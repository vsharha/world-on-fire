"use client"

import useNewsFeed from "@/hooks/useNewsFeed";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import StyledCollapsible from "@/components/StyledCollapsible";
import Article from "@/components/Article";
import Blinker from "@/components/Blinker";
import {cn} from "@/lib/utils";

function NewsFeed({className, defaultOpen=false}) {
    const {error, isLoading, newsFeed} = useNewsFeed();
    console.log(newsFeed);

    const averageSentiment = newsFeed?newsFeed.reduce((acc, current) => {
        acc += current.sentiment;
    }, 0) / newsFeed.length:0;

    if (isLoading || error || !newsFeed) return null;

    return (
        <Card className={cn("w-fit p-0", className)}>
            <StyledCollapsible
                title={
                    <div className="flex flex-row justify-between items-center w-full gap-3">
                        <span>
                            Recent news
                        </span>
                        <Blinker sentiment={averageSentiment}/>
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