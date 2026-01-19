import Article from "@/components/Article";
import useArticles from "@/hooks/useArticles";
import Loading from "@/components/Loading";
import Blinker from "@/components/Blinker";

interface ArticleListProps {
  location: string;
  intensity: number;
}

function ArticleList({ location, intensity }: ArticleListProps) {
  const { error, isLoading, news } = useArticles(location);

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
        Error loading news: {error.message || "An error occurred"}
      </div>
    );
  }

  return (
    <div className="max-h-100 overflow-y-auto p-4 w-full" key={intensity}>
      <div className="flex flex-col gap-0 pb-3">
        <div className="flex flex-row gap-1 justify-between items-center">
          <h1 className="text-lg font-bold mb-2">{location}</h1>
          <Blinker sentiment={intensity} />
        </div>
        <h1 className="text-muted-foreground">
          {news?.length || 0} article(s)
        </h1>
      </div>
      <div className="flex flex-col gap-3">
        {news?.map((article, index) => (
          <Article article={article} key={index} />
        ))}
      </div>
    </div>
  );
}

export default ArticleList;
