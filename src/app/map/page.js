import HeatMap from "@/components/HeatMap";
import NewsFeed from "@/components/NewsFeed";

function Page() {
    return (
        <main className="flex-1 h-full relative">
            {/*<IntensityMarker intensity={0.9}/>*/}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
                <NewsFeed/>
            </div>
            <HeatMap/>
        </main>
    );
}

export default Page;