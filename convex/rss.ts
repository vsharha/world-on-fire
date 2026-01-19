"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { RSS_FEEDS } from "./lib/rssFeeds";
import { processFeeds } from "./lib/rssProcessor";
import { getAllCities } from "./lib/trackedCities";

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

      // Insert articles in batches to avoid hitting limits
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

      // Geocode any new locations that aren't cached
      const allLocations = new Set<string>();
      for (const article of articles) {
        for (const location of article.locations) {
          allLocations.add(location);
        }
      }

      // Get list of uncached locations
      const trackedCities = getAllCities();
      const locationsToGeocode = trackedCities.filter((city) =>
        allLocations.has(city)
      );

      if (locationsToGeocode.length > 0) {
        // Schedule geocoding for new locations (limit to avoid timeout)
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
