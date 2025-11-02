import { useQuery } from "@tanstack/react-query";
import {fetchHeatmap, fetchNews} from "@/services/api";

function useNews(city) {
    const query = useQuery({
        queryKey: ["news"],
        queryFn: async () => fetchNews(city),
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    return {...query, news: query.data}
}

export default useNews