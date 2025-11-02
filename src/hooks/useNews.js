import { useQuery } from "@tanstack/react-query";
import {fetchHeatmap} from "@/services/api";

function useHeatmap(news) {
    const query = useQuery({
        queryKey: ["news"],
        queryFn: async () => fetchHeatmap(news),
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    return {...query, assignments: query.data}
}

export default useHeatmap