import LocationArticle from "@/components/LocationArticle";
import useArticles from "@/hooks/useArticles";
import Loading from "@/components/Loading";

function ArticleList({location}) {
    const {error, isLoading, news} = useArticles(location)
    console.log(news)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-4">
                Error loading news: {error.message || 'An error occurred'}
            </div>
        );
    }

    return (
        <div className="max-h-100 overflow-y-auto">
            <div className="flex flex-row gap-2 justify-between items-center">
                <h1 className="text-lg font-bold mb-2">{location}</h1>
                <h1 className="text-muted-foreground">{news?.length || 0} article(s)</h1>
            </div>
            <div className="flex flex-col gap-3">
                {news?.map((article, index) =>
                    <LocationArticle article={article} key={index} />
                )}
            </div>
        </div>
    );
}

export default ArticleList;