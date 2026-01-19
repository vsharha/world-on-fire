import Image from "next/image";
import { twMerge } from "tailwind-merge";

function StyledImage({ src, alt, className, ...props }) {
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
        key={src}
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
