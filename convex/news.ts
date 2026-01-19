import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const getLatestNews = query({
  args: {},
  handler: async (ctx) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_published_at")
      .order("desc")
      .take(100);

    return news.map((article) => ({
      image_url: article.imageUrl ?? "",
      title: article.title,
      description: article.description ?? "",
      url: article.url ?? "",
      published_at: new Date(article.publishedAt).toISOString(),
      sentiment: article.sentiment,
    }));
  },
});

export const searchByLocation = query({
  args: { location: v.string() },
  handler: async (ctx, args) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_published_at")
      .order("desc")
      .collect();

    const filtered = news.filter((article) =>
      article.locations.some(
        (loc) => loc.toLowerCase() === args.location.toLowerCase()
      )
    );

    return filtered.slice(0, 50).map((article) => ({
      image_url: article.imageUrl ?? "",
      title: article.title,
      description: article.description ?? "",
      url: article.url ?? "",
      published_at: new Date(article.publishedAt).toISOString(),
      sentiment: article.sentiment,
    }));
  },
});

export const getHeatmap = query({
  args: {},
  handler: async (ctx) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_published_at")
      .order("desc")
      .take(500);

    const locationCache = await ctx.db.query("locationCache").collect();
    const cacheMap = new Map(
      locationCache.map((entry) => [
        entry.location.toLowerCase(),
        { latitude: entry.latitude, longitude: entry.longitude },
      ])
    );

    // Count articles per location and sum sentiment
    const locationData = new Map<
      string,
      { count: number; totalSentiment: number }
    >();

    for (const article of news) {
      for (const location of article.locations) {
        const key = location.toLowerCase();
        const existing = locationData.get(key) ?? { count: 0, totalSentiment: 0 };
        locationData.set(key, {
          count: existing.count + 1,
          totalSentiment: existing.totalSentiment + article.sentiment,
        });
      }
    }

    const heatmapPoints: {
      location: string;
      coordinates: [number, number];
      intensity: number;
    }[] = [];

    for (const [location, data] of locationData.entries()) {
      const coords = cacheMap.get(location);
      if (coords) {
        // Intensity based on count, sentiment affects the weight
        const avgSentiment = data.totalSentiment / data.count;
        // Negative sentiment = higher intensity (more "fire")
        const intensity = data.count * (1 - avgSentiment);
        heatmapPoints.push({
          location:
            location.charAt(0).toUpperCase() + location.slice(1),
          coordinates: [coords.latitude, coords.longitude],
          intensity: Math.max(0.1, Math.min(1, intensity / 10)),
        });
      }
    }

    return heatmapPoints;
  },
});

export const insertArticlesBatch = internalMutation({
  args: {
    articles: v.array(
      v.object({
        title: v.string(),
        locations: v.array(v.string()),
        imageUrl: v.optional(v.string()),
        description: v.optional(v.string()),
        url: v.optional(v.string()),
        publishedAt: v.number(),
        sentiment: v.float64(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let inserted = 0;

    for (const article of args.articles) {
      // Check if article already exists by URL or title
      if (article.url) {
        const existingByUrl = await ctx.db
          .query("news")
          .withIndex("by_url", (q) => q.eq("url", article.url))
          .first();
        if (existingByUrl) continue;
      }

      const existingByTitle = await ctx.db
        .query("news")
        .withIndex("by_title", (q) => q.eq("title", article.title))
        .first();
      if (existingByTitle) continue;

      await ctx.db.insert("news", {
        ...article,
        createdAt: now,
      });
      inserted++;
    }

    return { inserted };
  },
});

export const cacheCoordinates = internalMutation({
  args: {
    entries: v.array(
      v.object({
        location: v.string(),
        latitude: v.float64(),
        longitude: v.float64(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const entry of args.entries) {
      const existing = await ctx.db
        .query("locationCache")
        .withIndex("by_location", (q) => q.eq("location", entry.location))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          latitude: entry.latitude,
          longitude: entry.longitude,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("locationCache", {
          ...entry,
          updatedAt: now,
        });
      }
    }
  },
});
