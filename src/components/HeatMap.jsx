"use client"

import {Map, MapLocateControl, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";
import { useState, useEffect } from "react";

function HeatMap() {
    const [center, setCenter] = useState([43.6532, -79.3832]);
    const [userLocation, setUserLocation] = useState(null);
    const [mapKey, setMapKey] = useState(0);

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

    return (
        <Map key={mapKey} center={center} className="h-full rounded-none">
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
            {userLocation && (
                <MapMarker position={userLocation}>
                    <MapPopup>Your location</MapPopup>
                </MapMarker>
            )}
        </Map>
    );
}

export default HeatMap;