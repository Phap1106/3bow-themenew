// src/components/common/SafeImage.tsx
"use client";

import * as React from "react";
import Image, { type ImageProps, type StaticImageData } from "next/image";

type Props = Omit<ImageProps, "onError"> & {
  /** Nhận URL string hoặc import tĩnh (StaticImageData) */
  fallbackSrc?: string | StaticImageData;
};

export default function SafeImage({ fallbackSrc, ...props }: Props) {
  const [err, setErr] = React.useState(false);

  // Chuẩn hoá fallback -> string
  const fb =
    typeof fallbackSrc === "object" && fallbackSrc
      ? (fallbackSrc as StaticImageData).src
      : (fallbackSrc as string | undefined);

  if (err) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={fb || ""} // nên truyền fallbackSrc; nếu không có sẽ để trống
        alt={(props.alt as string) || "image"}
        className={props.className}
        loading="lazy"
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      {...props}
      onError={() => setErr(true)}
      sizes={
        props.sizes ||
        "(min-width:1536px) 22vw, (min-width:1280px) 28vw, (min-width:1024px) 32vw, (min-width:768px) 48vw, 100vw"
      }
    />
  );
}
