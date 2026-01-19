import StyledImage from "@/components/StyledImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Truncate from "@/components/Truncate";
import { formatTimestamp } from "@/lib/utils";
import Blinker from "@/components/Blinker";
import type { Article as ArticleType } from "@/types";

interface ArticleProps {
  article: ArticleType;
}

function Article({ article }: ArticleProps) {
  const { image_url, title, description, url, published_at, sentiment } =
    article;

  if (!image_url) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="w-full sm:w-1/3 flex flex-col gap-2">
        <StyledImage src={image_url} alt="" className="rounded-md w-full" />
        <div className="flex flex-row justify-between items-center gap-0.5">
          {published_at && (
            <span className="text-xs text-muted-foreground mt-1 block">
              {formatTimestamp(published_at)}
            </span>
          )}
          <Blinker sentiment={sentiment} />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1 text-sm">
        <h1 className="font-bold">{title}</h1>
        <Truncate className="text-muted-foreground text-justify">
          {description}
        </Truncate>
        {url && (
          <Link
            href={url}
            className="flex gap-1 items-center border-b-1 border-link text-link w-fit"
            target="_blank"
          >
            View <ArrowUpRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Article;
