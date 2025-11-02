async function fetchHeatmap() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/news/heatmap`);
    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error("Could not parse error response");
    }
    return data;
}

async function fetchArticles(location) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/news/search?location=${location}`);
    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error("Could not parse error response");
    }
    return data;
}


async function geocodeLocation(locationName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error(`Error geocoding ${locationName}:`, error);
        return null;
    }
}

export { fetchHeatmap, fetchArticles, geocodeLocation };