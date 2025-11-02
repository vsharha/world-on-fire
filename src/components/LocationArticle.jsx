import StyledImage from "@/components/StyledImage";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";

function LocationArticle({article}) {
    const {image_url, title, description, url} = article;

    return (
        <div className="flex flex-row gap-2">
            <StyledImage src={image_url} alt={title} className="rounded-md w-1/3"/>
            <div className="flex-1 flex flex-col gap-1">
                <h1 className="font-bold">{title}</h1>
                <span className="text-muted-foreground">{description}</span>
                {url && <Link href={url} className="flex gap-1 items-center text-xs border-b-1 border-link text-link w-fit"
                       target="_blank">
                    View <ArrowUpRight size={12}/>
                </Link>}
            </div>
        </div>
    );
}

export default LocationArticle;