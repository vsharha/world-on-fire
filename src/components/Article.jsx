import StyledImage from "@/components/StyledImage";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import Truncate from "@/components/Truncate";
import {formatTimestamp, getSentimentColor} from "@/lib/utils";

function Article({article}) {
    const {image_url, title, description, url, created_at, sentiment} = article;

    const color = getSentimentColor(sentiment)

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-1/3 flex flex-col gap-2">
                <StyledImage src={image_url} alt="" className="rounded-md w-full"/>
                <div className="flex flex-row justify-between items-center">
                    <span className="text-xs">Sentiment</span>
                    <div
                        className="w-2 h-2 aspect-square rounded-full pr-1"
                        style={{
                            backgroundColor: color,
                        }}
                    >
                    </div>
                </div>
                {created_at && (
                    <span className="text-xs text-muted-foreground mt-1 block">
                        {formatTimestamp(created_at)}
                    </span>
                )}
            </div>
            <div className="flex-1 flex flex-col gap-1 text-sm">
                <h1 className="font-bold">{title}</h1>
                <Truncate className="text-muted-foreground">{description}</Truncate>
                {url && <Link href={url} className="flex gap-1 items-center border-b-1 border-link text-link w-fit"
                       target="_blank">
                    View <ArrowUpRight size={12}/>
                </Link>}
            </div>
        </div>
    );
}

export default Article;