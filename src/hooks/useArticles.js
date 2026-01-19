import { useQuery } from "@tanstack/react-query";
import { fetchHeatmap, fetchArticles } from "@/services/api";

function useArticles(location) {
  const query = useQuery({
    queryKey: ["news"],
    queryFn: async () => fetchArticles(location),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return { ...query, news: query.data };
}

export default useArticles;
