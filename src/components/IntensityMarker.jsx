function IntensityMarker({ intensity, showBlur = true }) {
    // Size: 20px to 60px based on intensity
    const blurSize = 20 + (Math.min(Math.max(Math.abs(intensity), 0.5), 1.5) * 40);

    // Get CSS variable for color
    const getColorVar = () => {
        // Zero/neutral intensity
        if (intensity === 0 || (intensity > -0.1 && intensity < 0.1)) {
            return "--color-chart-3"; // Neutral
        }

        // Positive intensity
        if (intensity > 0) {
            if (intensity > 0.5) return "--color-chart-5"; // Very positive
            return "--color-chart-4"; // Somewhat positive
        }

        // Negative intensity
        if (intensity < -0.5) return "--color-chart-1"; // Very negative
        return "--color-chart-2"; // Somewhat negative
    };

    // If showBlur is false, return only the white dot (for clickable marker)
    if (!showBlur) {
        return (
            <div className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
        );
    }

    // Return full marker with blur (for background overlay)
    return (
        <div className="relative pointer-events-none" style={{ width: `${blurSize}px`, height: `${blurSize}px` }}>
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg blur-2xl w-full h-full"
                style={{
                    backgroundColor: `var(${getColorVar()})`
                }}
            >
            </div>
        </div>
    );
}

export default IntensityMarker;