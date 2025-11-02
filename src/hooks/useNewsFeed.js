import { useQuery } from "@tanstack/react-query";
import { fetchNewsFeed } from "@/services/api";

function useNewsFeed() {
    const query = useQuery({
        queryKey: ["news_feed"],
        queryFn: fetchNewsFeed,
        refetchOnWindowFocus: true,
        refetchInterval: 15 * 1000,
        staleTime: 0,
    })

    return {...query, newsFeed: query.data}
}

export default useNewsFeed