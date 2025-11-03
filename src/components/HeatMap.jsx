"use client"

import {Map, MapLocateControl, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";
import { useState, useEffect } from "react";
import React from "react";
import IntensityMarker from "@/components/IntensityMarker";
import useGeolocation from "@/hooks/useGeolocation";
import ArticleList from "@/components/ArticleList";
import useHeatmap from "@/hooks/useHeatmap";
import Loading from "@/components/Loading";
import {LucideX} from "lucide-react";

function HeatMap() {
    const [center, setCenter] = useState([55.922797194822806, -3.1745191247766957 ]);
    const [mapKey, setMapKey] = useState(0);

    const {error, isLoading, heatmap} = useHeatmap();

    useGeolocation(setMapKey, setCenter)

    // Rerender map when heatmap data loads
    useEffect(() => {
        if (heatmap && !isLoading) {
            setMapKey(prev => prev + 1);
        }
    }, [heatmap, isLoading]);

    return (
        <Map key={mapKey} center={center} className="h-full rounded-none" zoom="6" minZoom="2">
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

                // Blur overlay size
                const blurSize = 20 + (Math.min(Math.max(Math.abs(intensity), 0.5), 1.5) * 40);

                return (
                    <React.Fragment key={index}>
                        {/* Non-clickable blur overlay */}
                        <MapMarker
                            position={coordinates}
                            icon={<IntensityMarker intensity={intensity} showBlur={true} />}
                            iconAnchor={[blurSize / 2, blurSize / 2]}
                            interactive={false}
                        />
                        {/* Clickable white dot */}
                        <MapMarker
                            position={coordinates}
                            icon={<IntensityMarker intensity={intensity} showBlur={false} />}
                            iconAnchor={[4, 4]}
                        >
                            <MapPopup key={location} className="max-w-[calc(100vw*9/10)]">
                                <ArticleList location={location} intensity={intensity} />
                            </MapPopup>
                        </MapMarker>
                    </React.Fragment>
                );
            })}

            {(isLoading || error) && (
                <div className="absolute bottom-4 left-4 bg-card backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 flex items-center gap-2 z-[1000]">
                    {isLoading && (
                        <>
                            <Loading size={20}/>
                            <span className="hidden sm:block text-sm font-medium">Loading...</span>
                        </>
                    )}
                    {error && !isLoading && (
                        <>
                            <LucideX className="w-5 h-5" size={20}/>
                            <span className="text-sm">{error.message || 'An error occurred'}</span>
                        </>
                    )}
                </div>
            )}
        </Map>
    );
}

export default HeatMap;