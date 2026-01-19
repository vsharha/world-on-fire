import Image, { type ImageProps } from "next/image";
import { twMerge } from "tailwind-merge";

interface StyledImageProps extends Omit<ImageProps, "width" | "height"> {
  className?: string;
}

function StyledImage({ src, alt, className, ...props }: StyledImageProps) {
  return (
    <div
      className={twMerge(
        "w-full aspect-video flex items-center justify-center border-1 border-border",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        key={String(src)}
        width="0"
        height="0"
        sizes="100vw"
        className="w-fit h-full bg-background"
        draggable={false}
        {...props}
      />
    </div>
  );
}

export default StyledImage;
