import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function useArticles(location: string) {
  const news = useQuery(api.news.searchByLocation, { location });
  return { news };
}

export default useArticles;
