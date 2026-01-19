import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a timestamp into a human-readable relative time string
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} A human-readable time string (e.g., "2 hours ago", "just now")
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else {
    // For older dates, show the actual date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

export function getSentimentColor(intensity) {
  let variable;

  if (intensity === 0 || (intensity > -0.1 && intensity < 0.1)) {
    // Zero/neutral intensity
    variable = "--color-chart-3"; // Neutral
  } else if (intensity > 0) {
    // Positive intensity
    if (intensity > 0.5) {
      variable = "--color-chart-5"; // Very positive
    } else {
      variable = "--color-chart-4"; // Somewhat positive
    }
  } else if (intensity < -0.5) {
    // Negative intensity
    variable = "--color-chart-1";
  } else {
    variable = "--color-chart-2"; // Somewhat negative
  }

  return `var(${variable})`;
}
