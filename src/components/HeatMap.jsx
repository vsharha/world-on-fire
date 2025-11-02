"use client"

import {Map, MapLocateControl, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";
import { useState, useEffect } from "react";
import heatmap from "@/data/data";
import IntensityMarker from "@/components/IntensityMarker";
import useGeocoding from "@/hooks/useGeocoding";
import useGeolocation from "@/hooks/useGeolocation";

function HeatMap() {
    const [center, setCenter] = useState([55.922797194822806, -3.1745191247766957 ]);
    const [mapKey, setMapKey] = useState(0);

    const locationCoords = useGeocoding(heatmap)

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
            {heatmap && heatmap.map(({location, intensity}, index) => {
                const coords = locationCoords[location];
                if (!coords) return null;

                // Calculate marker size for proper centering
                const markerSize = 20 + (intensity * 40);
                const iconAnchor = [markerSize / 2, markerSize / 2];

                return (
                    <MapMarker
                        key={index}
                        position={coords}
                        icon={<IntensityMarker intensity={intensity} />}
                        iconAnchor={iconAnchor}
                    >
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