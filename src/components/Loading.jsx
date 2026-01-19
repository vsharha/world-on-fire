import { Loader } from "lucide-react";

function Loading({ size = 30 }) {
  return (
    <div className="overflow-hidden">
      <Loader className="animate-spin" size={size} />
    </div>
  );
}

export default Loading;
