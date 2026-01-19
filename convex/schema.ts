import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  news: defineTable({
    title: v.string(),
    locations: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    publishedAt: v.number(),
    sentiment: v.float64(),
    createdAt: v.number(),
  })
    .index("by_published_at", ["publishedAt"])
    .index("by_url", ["url"])
    .index("by_title", ["title"]),

  locationCache: defineTable({
    location: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    updatedAt: v.number(),
  }).index("by_location", ["location"]),
});
