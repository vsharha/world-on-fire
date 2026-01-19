import { Loader } from "lucide-react";

interface LoadingProps {
  size?: number;
}

function Loading({ size = 30 }: LoadingProps) {
  return (
    <div className="overflow-hidden">
      <Loader className="animate-spin" size={size} />
    </div>
  );
}

export default Loading;
