"use client"

import useNewsFeed from "@/hooks/useNewsFeed";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import StyledCollapsible from "@/components/StyledCollapsible";
import Article from "@/components/Article";
import Blinker from "@/components/Blinker";

function NewsFeed() {
    const {error, isLoading, newsFeed} = useNewsFeed();
    console.log(newsFeed);

    const averageSentiment = newsFeed?newsFeed.reduce((acc, current) => {
        acc += current.sentiment;
    }, 0) / newsFeed.length:0;

    if (isLoading || error || !newsFeed) return null;

    return (
        <Card className="w-96 p-2">
            <StyledCollapsible
                title={
                    <div className="flex flex-row justify-between items-center w-full gap-1">
                        <span>
                            Recent news
                        </span>
                        <Blinker sentiment={averageSentiment}/>
                    </div>
                }
                className="mb-0"
                defaultOpen={false}
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