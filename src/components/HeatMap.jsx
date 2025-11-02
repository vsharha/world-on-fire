"use client"

import {Map, MapLocateControl, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";
import { useState } from "react";
import IntensityMarker from "@/components/IntensityMarker";
import useGeolocation from "@/hooks/useGeolocation";
import NewsList from "@/components/NewsList";
import useHeatmap from "@/hooks/useHeatmap";
import Loading from "@/components/Loading";
import {LucideX} from "lucide-react";

function HeatMap() {
    const [center, setCenter] = useState([55.922797194822806, -3.1745191247766957 ]);
    const [mapKey, setMapKey] = useState(0);

    const {error, isLoading, heatmap} = useHeatmap();

    useGeolocation(setMapKey, setCenter)

    return (
        <Map key={mapKey} center={center} className="h-full rounded-none" zoom="6">
            <MapTileLayer/>
            <MapZoomControl className="m-3"/>
            <MapLocateControl
                className="m-3"
                onLocationFound={(location) => {
                    console.log('User location:', location.latlng);
                    setCenter([location.latlng.lat, location.latlng.lng]);
                }}
                onLocationError={(error) => {
                    console.log('Location error:', error);
                }}
            />
            {heatmap && heatmap.map(({location, coordinates, intensity}, index) => {
                if (!coordinates) return null;

                // Calculate marker size for proper centering
                const markerSize = 20 + (intensity * 40);
                const iconAnchor = [markerSize / 2, markerSize / 2];

                return (
                    <MapMarker
                        key={index}
                        position={coordinates}
                        icon={<IntensityMarker intensity={intensity} />}
                        iconAnchor={iconAnchor}
                    >
                        <MapPopup>
                            <NewsList location={location} />
                        </MapPopup>
                    </MapMarker>
                );
            })}

            {(isLoading || error) && (
                <div className="absolute bottom-4 left-4 bg-card backdrop-blur-sm rounded-lg shadow-lg px-2 py-1.5 flex items-center gap-2 z-[1000]">
                    {isLoading && (
                        <>
                            <Loading />
                            <span className="text-sm font-medium">Loading...</span>
                        </>
                    )}
                    {error && !isLoading && (
                        <>
                            <LucideX className="w-5 h-5" />
                            <span className="text-sm">{error.message || 'An error occurred'}</span>
                        </>
                    )}
                </div>
            )}
        </Map>
    );
}

export default HeatMap;