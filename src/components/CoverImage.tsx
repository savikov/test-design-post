"use client";

import { useState } from 'react';
import type { CSSProperties } from 'react';

type CoverImageProps = {
  primarySrc: string;
  fallbackSrc?: string | null;
  alt?: string;
  className?: string;
  style?: CSSProperties;
};

const PLACEHOLDER_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
      '<rect width="100%" height="100%" fill="#111111"/>' +
      '<rect x="32" y="32" width="736" height="536" rx="32" fill="#1a1a1a"/>' +
      '</svg>'
  );

export function CoverImage({ primarySrc, fallbackSrc, alt = '', className, style }: CoverImageProps) {
  const initialSrc = primarySrc || fallbackSrc || PLACEHOLDER_SRC;
  const [src, setSrc] = useState(initialSrc);

  const handleError = () => {
    if (src === primarySrc && fallbackSrc) {
      setSrc(fallbackSrc);
      return;
    }
    if (src !== PLACEHOLDER_SRC) {
      setSrc(PLACEHOLDER_SRC);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={className}
      style={style}
    />
  );
}
