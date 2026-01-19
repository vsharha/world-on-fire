import type { Article, HeatmapPoint } from "@/types";

export async function fetchHeatmap(): Promise<HeatmapPoint[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FASTAPI_URL}/news/heatmap`,
  );
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Could not parse error response");
  }
  return data;
}

export async function fetchArticles(location: string): Promise<Article[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FASTAPI_URL}/news/search?location=${location}`,
  );
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Could not parse error response");
  }
  return data;
}

export async function fetchNewsFeed(): Promise<Article[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FASTAPI_URL}/news/latest`,
  );
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Could not parse error response");
  }
  return data;
}
