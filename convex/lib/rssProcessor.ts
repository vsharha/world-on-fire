import Parser from "rss-parser";
import * as cheerio from "cheerio";
import Sentiment from "sentiment";
import { getTrackedCitiesSet } from "./trackedCities";

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

export interface ParsedArticle {
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
  // media:content
  if (item.mediaContent?.[0]?.$?.url) {
    return item.mediaContent[0].$.url;
  }

  // media:thumbnail
  if (item.mediaThumbnail?.[0]?.$?.url) {
    return item.mediaThumbnail[0].$.url;
  }

  // enclosure (if image type)
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url;
  }

  // Try to extract from content/description HTML
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
    // Use word boundary matching to avoid partial matches
    const regex = new RegExp(`\\b${escapeRegex(city)}\\b`, "gi");
    if (regex.test(text)) {
      found.add(city);
    }
  }

  return Array.from(found);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
  // Normalize to -1 to 1 range
  // sentiment returns a score that can be any integer, we normalize it
  const normalized = Math.max(-1, Math.min(1, result.score / 10));
  return normalized;
}

export async function fetchAndParseFeed(
  feedUrl: string
): Promise<ParsedArticle[]> {
  const trackedCities = getTrackedCitiesSet();
  const articles: ParsedArticle[] = [];

  try {
    // Use morss.it proxy for full content
    const proxyUrl = `https://morss.it/${feedUrl}`;
    const feed = await parser.parseURL(proxyUrl);

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const description = stripHtml(item.content || item.contentSnippet || item.summary || "");

      // Combine title and description for city extraction
      const fullText = `${item.title} ${description}`;
      const cities = extractCities(fullText, trackedCities);

      // Skip articles without tracked cities
      if (cities.length === 0) {
        continue;
      }

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

export async function processFeeds(
  feedUrls: string[]
): Promise<ParsedArticle[]> {
  const allArticles: ParsedArticle[] = [];
  const seenUrls = new Set<string>();

  // Process feeds in parallel batches
  const batchSize = 5;
  for (let i = 0; i < feedUrls.length; i += batchSize) {
    const batch = feedUrls.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(fetchAndParseFeed));

    for (const articles of results) {
      for (const article of articles) {
        // Deduplicate by URL
        if (article.url && seenUrls.has(article.url)) {
          continue;
        }
        if (article.url) {
          seenUrls.add(article.url);
        }
        allArticles.push(article);
      }
    }
  }

  return allArticles;
}
