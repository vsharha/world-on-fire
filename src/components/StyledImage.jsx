import Image from "next/image";
import {twMerge} from "tailwind-merge";

function StyledImage({src, alt, className, ...props}) {
  return (
    <Image
      src={src}
      alt={alt}
      key={src}
      width="0"
      height="0"
      sizes="100vw"
      className={twMerge("w-full h-fit bg-background border-1 border-border", className)}
      draggable={false}
      {...props}
    />
  );
}

export default StyledImage;