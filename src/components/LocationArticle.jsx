import StyledImage from "@/components/StyledImage";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import Truncate from "@/components/Truncate";
import {formatTimestamp} from "@/lib/utils";

function LocationArticle({article}) {
    const {image_url, title, description, url, created_at} = article;

    return (
        <div className="flex flex-row gap-2">
            <div className="w-1/3">
                <StyledImage src={image_url} alt={title} className="rounded-md w-full"/>
                {created_at && (
                    <span className="text-xs text-muted-foreground mt-1 block">
                        {formatTimestamp(created_at)}
                    </span>
                )}
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
                <h1 className="font-bold">{title}</h1>
                <Truncate className="text-muted-foreground">{description}</Truncate>
                {url && <Link href={url} className="flex gap-1 items-center text-xs border-b-1 border-link text-link w-fit"
                       target="_blank">
                    View <ArrowUpRight size={12}/>
                </Link>}
            </div>
        </div>
    );
}

export default LocationArticle;