"use client";

import useNewsFeed from "@/hooks/useNewsFeed";
import { Card, CardContent } from "@/components/ui/card";
import StyledCollapsible from "@/components/StyledCollapsible";
import Article from "@/components/Article";
import Blinker from "@/components/Blinker";
import { cn } from "@/lib/utils";

interface NewsFeedProps {
  className?: string;
  defaultOpen?: boolean;
}

function NewsFeed({ className, defaultOpen = false }: NewsFeedProps) {
  const { newsFeed } = useNewsFeed();

  const averageSentiment = (() => {
    if (!newsFeed || newsFeed.length === 0) return 0;
    const sum = newsFeed.reduce(
      (acc, current) => acc + (Number(current?.sentiment) || 0),
      0,
    );
    return sum / newsFeed.length;
  })();

  if (newsFeed === undefined || !newsFeed) return null;

  return (
    <Card className={cn("w-fit p-0", className)}>
      <StyledCollapsible
        title={
          <div className="flex flex-row justify-between items-center w-full gap-3 h-fit">
            <span>Recent news</span>
            <Blinker sentiment={averageSentiment} />
          </div>
        }
        className="mb-0"
        defaultOpen={defaultOpen}
      >
        <CardContent className="max-h-100 overflow-y-auto mt-3 flex flex-col gap-3">
          {newsFeed.map((article, index) => (
            <Article article={article} key={index} />
          ))}
        </CardContent>
      </StyledCollapsible>
    </Card>
  );
}

export default NewsFeed;
