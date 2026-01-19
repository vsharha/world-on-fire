"use client";

import _ from "lodash";
import { useState } from "react";

interface TruncateProps {
  length?: number;
  children: React.ReactNode;
  className?: string;
}

function Truncate({ length = 100, children, className }: TruncateProps) {
  const [open, setOpen] = useState(false);

  function truncate(text: string) {
    if (open) return text;
    return _.truncate(text, { length });
  }

  if (typeof children !== "string") {
    return children;
  }

  return (
    <p className={className}>
      {truncate(children)}
      {children.length > length && (
        <span
          className="text-muted-foreground underline cursor-pointer flex"
          onClick={() => setOpen((open) => !open)}
        >
          {length && open ? "Show less..." : "Show more..."}
        </span>
      )}
    </p>
  );
}

export default Truncate;
