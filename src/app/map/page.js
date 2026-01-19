import HeatMap from "@/components/HeatMap";
import NewsFeed from "@/components/NewsFeed";

function Page() {
  return (
    <main className="flex-1 h-full relative">
      {/*<IntensityMarker intensity={0.9}/>*/}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex justify-center w-full sm:px-0 px-4">
        <NewsFeed className="max-w-200" />
      </div>
      <HeatMap />
    </main>
  );
}

export default Page;
