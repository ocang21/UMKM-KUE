"use client";

import Image from "next/image";

interface SharedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export default function SharedImage({
  src,
  alt,
  fill,
  className,
  sizes,
  width,
  height,
  style,
}: SharedImageProps) {
  if (src.startsWith("data:image/")) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
      />
    );
  }

  return fill ? (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      style={style}
      unoptimized
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width ?? 300}
      height={height ?? 300}
      className={className}
      sizes={sizes}
      style={style}
      unoptimized
    />
  );
}
