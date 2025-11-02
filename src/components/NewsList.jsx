import {cityNews} from "@/data/data";
import LocationArticle from "@/components/LocationArticle";

function NewsList({location}) {
    // const news = useNews(location)
    const news = cityNews[location];
    console.log(location, news);

    return (
        <div className="max-h-100 overflow-y-auto">
            <div className="flex flex-row gap-2 justify-between items-center">
                <h1 className="text-lg font-bold mb-2">{location}</h1>
                <h1 className="text-muted-foreground">{news.length} articles</h1>
            </div>
            <div className="flex flex-col gap-3">
                {news.map((article, index) =>
                    <LocationArticle article={article} key={index} />
                )}
            </div>
        </div>
    );
}

export default NewsList;