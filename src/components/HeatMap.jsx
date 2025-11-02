"use client"

import {Map, MapLocateControl, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";
import { useState } from "react";
import IntensityMarker from "@/components/IntensityMarker";
import useGeocoding from "@/hooks/useGeocoding";
import useGeolocation from "@/hooks/useGeolocation";
import NewsList from "@/components/NewsList";
import useHeatmap from "@/hooks/useHeatmap";

function HeatMap() {
    const [center, setCenter] = useState([55.922797194822806, -3.1745191247766957 ]);
    const [mapKey, setMapKey] = useState(0);

    const {heatmap} = useHeatmap();
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
                            <NewsList location={location} />
                        </MapPopup>
                    </MapMarker>
                );
            })}
        </Map>
    );
}

export default HeatMap;