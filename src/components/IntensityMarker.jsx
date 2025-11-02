function IntensityMarker({ intensity }) {
    // Size: 20px to 60px based on intensity
    const size = 20 + (Math.max(intensity, 1.5) * 40);

    // Get CSS variable for color
    const getColorVar = () => {
        if (intensity >= 0.8) return "--color-chart-5"; // Dark red (extreme)
        if (intensity >= 0.6) return "--color-chart-4"; // Red (critical)
        if (intensity >= 0.4) return "--color-chart-3"; // Orange (high)
        if (intensity >= 0.2) return "--color-chart-2"; // Yellow (medium)
        return "--color-chart-1"; // Green (low)
    };

    return (
        <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg blur-2xl w-full h-full"
                style={{
                    backgroundColor: `var(${getColorVar()})`
                }}
            >
            </div>
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/70 shadow-sm"
            >
            </div>
        </div>
    );
}

export default IntensityMarker;