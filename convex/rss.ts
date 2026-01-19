"use node";

import Parser from "rss-parser";
import * as cheerio from "cheerio";
import Sentiment from "sentiment";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { RSS_FEEDS } from "./lib/rssFeeds";
import { getAllCities, getTrackedCitiesSet } from "./lib/trackedCities";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["enclosure", "enclosure"],
    ],
  },
});

const sentiment = new Sentiment();

interface ParsedArticle {
  title: string;
  locations: string[];
  imageUrl?: string;
  description?: string;
  url?: string;
  publishedAt: number;
  sentiment: number;
}

function stripHtml(html: string): string {
  if (!html) return "";
  const $ = cheerio.load(html);
  return $.text().trim();
}

function extractImageUrl(item: Parser.Item & {
  mediaContent?: Array<{ $?: { url?: string } }>;
  mediaThumbnail?: Array<{ $?: { url?: string } }>;
  enclosure?: { url?: string; type?: string };
}): string | undefined {
  if (item.mediaContent?.[0]?.$?.url) {
    return item.mediaContent[0].$.url;
  }
  if (item.mediaThumbnail?.[0]?.$?.url) {
    return item.mediaThumbnail[0].$.url;
  }
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url;
  }
  const content = item.content || item.contentSnippet || "";
  if (content) {
    const $ = cheerio.load(content);
    const imgSrc = $("img").first().attr("src");
    if (imgSrc) {
      return imgSrc;
    }
  }
  return undefined;
}

function extractCities(text: string, trackedCities: Set<string>): string[] {
  const found: Set<string> = new Set();
  for (const city of trackedCities) {
    const regex = new RegExp(`\\b${city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    if (regex.test(text)) {
      found.add(city);
    }
  }
  return Array.from(found);
}

function parsePublishedDate(dateStr: string): number {
  if (!dateStr) return Date.now();
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return Date.now();
    }
    return date.getTime();
  } catch {
    return Date.now();
  }
}

function analyzeSentiment(text: string): number {
  const result = sentiment.analyze(text);
  return Math.max(-1, Math.min(1, result.score / 10));
}

async function fetchAndParseFeed(feedUrl: string): Promise<ParsedArticle[]> {
  const trackedCities = getTrackedCitiesSet();
  const articles: ParsedArticle[] = [];

  try {
    const proxyUrl = `https://morss.it/${feedUrl}`;
    const feed = await parser.parseURL(proxyUrl);

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const description = stripHtml(item.content || item.contentSnippet || item.summary || "");
      const fullText = `${item.title} ${description}`;
      const cities = extractCities(fullText, trackedCities);

      if (cities.length === 0) continue;

      const sentimentScore = analyzeSentiment(fullText);
      const imageUrl = extractImageUrl(item as Parameters<typeof extractImageUrl>[0]);

      articles.push({
        title: item.title,
        locations: cities,
        ...(imageUrl && { imageUrl }),
        description: description.slice(0, 500),
        url: item.link,
        publishedAt: parsePublishedDate(item.pubDate || item.isoDate || ""),
        sentiment: sentimentScore,
      });
    }
  } catch (error) {
    console.error(`Error processing feed ${feedUrl}:`, error);
  }

  return articles;
}

async function processFeeds(feedUrls: string[]): Promise<ParsedArticle[]> {
  const allArticles: ParsedArticle[] = [];
  const seenUrls = new Set<string>();

  const batchSize = 5;
  for (let i = 0; i < feedUrls.length; i += batchSize) {
    const batch = feedUrls.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(fetchAndParseFeed));

    for (const articles of results) {
      for (const article of articles) {
        if (article.url && seenUrls.has(article.url)) continue;
        if (article.url) seenUrls.add(article.url);
        allArticles.push(article);
      }
    }
  }

  return allArticles;
}

export const processRssFeeds = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log(`Starting RSS feed processing for ${RSS_FEEDS.length} feeds...`);

    try {
      const articles = await processFeeds(RSS_FEEDS);
      console.log(`Parsed ${articles.length} articles with tracked cities`);

      if (articles.length === 0) {
        console.log("No articles found with tracked cities");
        return { processed: 0, inserted: 0 };
      }

      const batchSize = 50;
      let totalInserted = 0;

      for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        const result = await ctx.runMutation(internal.news.insertArticlesBatch, {
          articles: batch,
        });
        totalInserted += result.inserted;
      }

      console.log(`Inserted ${totalInserted} new articles`);

      const allLocations = new Set<string>();
      for (const article of articles) {
        for (const location of article.locations) {
          allLocations.add(location);
        }
      }

      const trackedCities = getAllCities();
      const locationsToGeocode = trackedCities.filter((city: string) =>
        allLocations.has(city)
      );

      if (locationsToGeocode.length > 0) {
        const geocodeBatch = locationsToGeocode.slice(0, 20);
        console.log(`Scheduling geocoding for ${geocodeBatch.length} locations`);

        await ctx.runAction(internal.geocoding.geocodeLocations, {
          locations: geocodeBatch,
        });
      }

      return { processed: articles.length, inserted: totalInserted };
    } catch (error) {
      console.error("Error processing RSS feeds:", error);
      throw error;
    }
  },
});
