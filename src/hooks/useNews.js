import { useQuery } from "@tanstack/react-query";
import {fetchHeatmap} from "@/services/api";

function useNews(city) {
    const query = useQuery({
        queryKey: ["news"],
        queryFn: async () => fetchHeatmap(city),
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    return {...query, assignments: query.data}
}

export default useNews