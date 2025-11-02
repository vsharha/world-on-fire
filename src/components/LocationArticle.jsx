import StyledImage from "@/components/StyledImage";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";

function LocationArticle({article}) {
    const {src, title, description, link} = article;

    return (
        <div className="flex flex-row gap-2">
            <StyledImage src={src} alt={title} className="rounded-md max-w-1/3"/>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold">{title}</h1>
                <span className="text-muted-foreground">{description}</span>
                <Link href={link} className="flex gap-1 items-center text-xs border-b-1 border-link text-link w-fit" target="_blank">
                    View <ArrowUpRight size={12}/>
                </Link>
            </div>
        </div>
    );
}

export default LocationArticle;