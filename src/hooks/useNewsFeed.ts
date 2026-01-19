import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function useNewsFeed() {
  const newsFeed = useQuery(api.news.getLatestNews);
  return { newsFeed };
}

export default useNewsFeed;
