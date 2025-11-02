import {geocodeLocation} from "@/services/api";
import {useEffect, useState} from "react";

function useGeocoding(heatmap) {
    const [locationCoords, setLocationCoords] = useState({});

    useEffect(() => {
        if (!heatmap) return;

        const fetchCoordinates = async () => {
            const coords = {};

            for (const item of heatmap) {
                if (!coords[item.location]) {
                    const result = await geocodeLocation(item.location);
                    if (result) {
                        coords[item.location] = [result.lat, result.lng];
                    }
                    // Wait 1 second between requests (Nominatim rate limit)
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            setLocationCoords(coords);
        };

        fetchCoordinates();
    }, [heatmap]);

    return locationCoords;
}

export default useGeocoding