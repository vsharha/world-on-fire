import HeatMap from "@/components/HeatMap";
import IntensityMarker from "@/components/IntensityMarker";

function Page() {
    return (
        <main className="flex-1 h-full">
            {/*<IntensityMarker intensity={0.9}/>*/}
            <HeatMap/>
        </main>
    );
}

export default Page;