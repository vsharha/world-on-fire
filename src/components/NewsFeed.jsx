"use client"

import useNewsFeed from "@/hooks/useNewsFeed";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Loading from "@/components/Loading";
import StyledCollapsible from "@/components/StyledCollapsible";
import LocationArticle from "@/components/LocationArticle";

function NewsFeed() {
    const {error, isLoading, newsFeed} = useNewsFeed();

    if (isLoading || error || newsFeed) return null;

    return (
        <Card className="w-96 p-2">
            <StyledCollapsible title="Recent news" className="mb-0">
                <CardContent>
                    {newsFeed.map((article, index) => (
                        <LocationArticle article={article} key={index} />
                    ))}
                </CardContent>
            </StyledCollapsible>
        </Card>
    );
}

export default NewsFeed;