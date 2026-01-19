import { getSentimentColor } from "@/lib/utils";

function IntensityMarker({ intensity, showBlur = true }) {
  // Size: 20px to 60px based on intensity
  const blurSize = 20 + Math.min(Math.max(Math.abs(intensity), 0.5), 1.5) * 40;

  const color = getSentimentColor(intensity);

  // If showBlur is false, return only the white dot (for clickable marker)
  if (!showBlur) {
    return <div className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />;
  }

  // Return full marker with blur (for background overlay)
  return (
    <div
      className="relative pointer-events-none"
      style={{ width: `${blurSize}px`, height: `${blurSize}px` }}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg blur-2xl w-full h-full"
        style={{
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
}

export default IntensityMarker;
