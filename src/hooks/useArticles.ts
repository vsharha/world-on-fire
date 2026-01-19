import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/services/api";

function useArticles(location: string) {
  const query = useQuery({
    queryKey: ["news"],
    queryFn: async () => fetchArticles(location),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return { ...query, news: query.data };
}

export default useArticles;
