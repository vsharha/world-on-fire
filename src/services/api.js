async function fetchHeatmap() {
    return heatmap
}

async function fetchNews(city) {

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

export { fetchHeatmap, fetchNews, geocodeLocation };