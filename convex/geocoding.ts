import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export const geocodeLocations = internalAction({
  args: {
    locations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const results: Array<{
      location: string;
      latitude: number;
      longitude: number;
    }> = [];

    // Process locations in batches to avoid rate limiting
    for (const location of args.locations) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
          {
            headers: {
              "User-Agent": "WorldOnFire/1.0",
            },
          }
        );

        if (!response.ok) {
          console.error(`Geocoding failed for ${location}: ${response.status}`);
          continue;
        }

        const data = (await response.json()) as NominatimResult[];

        if (data.length > 0 && data[0]) {
          results.push({
            location,
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
        }

        // Rate limiting: wait 1 second between requests (Nominatim policy)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error geocoding ${location}:`, error);
      }
    }

    // Cache the results
    if (results.length > 0) {
      await ctx.runMutation(internal.news.cacheCoordinates, {
        entries: results,
      });
    }

    return results;
  },
});
