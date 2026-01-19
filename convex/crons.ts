import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Process RSS feeds every 12 hours
crons.interval("process RSS feeds", { hours: 12 }, internal.rss.processRssFeeds);

export default crons;
