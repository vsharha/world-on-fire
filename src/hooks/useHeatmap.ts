import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function useHeatmap() {
  const heatmap = useQuery(api.news.getHeatmap);
  return { heatmap };
}

export default useHeatmap;
