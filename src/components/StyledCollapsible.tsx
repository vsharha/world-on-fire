"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StyledCollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function StyledCollapsible({
  title,
  children,
  defaultOpen = true,
  className,
}: StyledCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          className={cn(
            "flex items-center mb-4 gap-2 w-full justify-start flex-nowrap",
            className,
          )}
          variant="ghost"
        >
          {open ? <ChevronDown /> : <ChevronRight />}
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default StyledCollapsible;
