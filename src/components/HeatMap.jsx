"use client"

import {Map, MapLocateControl, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";
import { useState, useEffect } from "react";
import heatmap from "@/data/data";

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

function HeatMap() {
    const [center, setCenter] = useState([55.922797194822806, -3.1745191247766957 ]);
    const [userLocation, setUserLocation] = useState(null);
    const [mapKey, setMapKey] = useState(0);
    const [locationCoords, setLocationCoords] = useState({});

    useEffect(() => {
        // Get user's location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter([latitude, longitude]);
                    setUserLocation([latitude, longitude]);
                    setMapKey(prev => prev + 1); // Force map re-render with new center
                },
                (error) => {
                    console.log('Location error:', error.message);
                }
            );
        }
    }, []);

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

    return (
        <Map key={mapKey} center={center} className="h-full rounded-none" zoom="6">
            <MapTileLayer/>
            <MapZoomControl className="m-3"/>
            <MapLocateControl
                className="m-3"
                onLocationFound={(location) => {
                    console.log('User location:', location.latlng);
                    setCenter([location.latlng.lat, location.latlng.lng]);
                    setUserLocation([location.latlng.lat, location.latlng.lng]);
                }}
                onLocationError={(error) => {
                    console.log('Location error:', error);
                }}
            />
            {heatmap && heatmap.map(({location, intensity}, index) => {
                const coords = locationCoords[location];
                console.log(coords)
                if (!coords) return null;

                return (
                    <MapMarker key={index} position={coords}>
                        <MapPopup>
                            <div className="font-semibold">{location}</div>
                            <div className="text-sm">Intensity: {(intensity * 100).toFixed(0)}%</div>
                        </MapPopup>
                    </MapMarker>
                );
            })}
        </Map>
    );
}

export default HeatMap;