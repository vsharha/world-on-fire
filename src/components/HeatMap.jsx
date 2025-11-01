import {Map, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";

function HeatMap() {
    return (
        <Map center={[43.6532, -79.3832]} className="h-full
  rounded-none">
            <MapTileLayer/>
            <MapZoomControl className="m-3"/>
            <MapMarker position={[43.6532, -79.3832]}>
                <MapPopup>A map component for shadcn/ui.</MapPopup>
            </MapMarker>
        </Map>
    );
}

export default HeatMap;