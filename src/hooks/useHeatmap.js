import { useQuery } from "@tanstack/react-query";
import {fetchHeatmap} from "@/services/api";

function useHeatmap() {
    const query = useQuery({
        queryKey: ["heatmap"],
        queryFn: fetchHeatmap,
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    return {...query, heat_map: query.data}
}

export default useHeatmap