import {useEffect, useState} from "react";
import useGeocoding from "@/hooks/useGeocoding";

function useGeolocation(setMapKey, setCenter) {
    useEffect(() => {
        // Get user's location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter([latitude, longitude]);
                    // setUserLocation([latitude, longitude]);
                    setMapKey(prev => prev + 1); // Force map re-render with new center
                },
                (error) => {
                    console.log('Location error:', error.message);
                }
            );
        }
    }, []);
}

export default useGeolocation;