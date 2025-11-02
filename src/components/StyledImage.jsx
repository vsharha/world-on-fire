import Image from "next/image";
import {twMerge} from "tailwind-merge";

function StyledImage({aspectRatio="16/9", src, alt, className, ...props}) {
  return (
    <Image
      src={src}
      alt={alt}
      width="0"
      height="0"
      sizes="100vw"
      className={twMerge("w-full h-fit bg-background", className)}
      style={{aspectRatio:aspectRatio}}
      draggable={false}
      {...props}
    />
  );
}

export default StyledImage;