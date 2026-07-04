'use client';

import Image from "next/image";
import { useState } from "react";

/**
 * SmartImage — uses next/image for automatic format negotiation (AVIF → WebP → JPEG),
 * responsive srcsets, lazy loading, and blur prevention via width/height.
 *
 * For priority (above-the-fold) images, pass `priority` — this tells next/image
 * to preload the image eagerly.
 *
 * The component still includes a WebP fallback path for the case where
 * next/image optimization isn't available (e.g., static export), but in
 * normal Next.js runtime, next/image handles everything.
 *
 * Usage:
 *   <SmartImage src="/school/home.jpg" alt="..." width={1200} height={630} priority />
 *   <SmartImage src="/school/about-02.jpg" alt="..." width={600} height={750} />
 *
 * Note: `src` now includes the file extension (e.g. "/school/home.jpg").
 * next/image handles format negotiation automatically — no need for separate
 * .webp files.
 */

type SmartImageProps = {
  /** Path WITH extension, e.g. "/school/home.jpg" */
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** If true, image loads eagerly with high priority (above-the-fold). */
  priority?: boolean;
  className?: string;
  /** Optional sizes attribute for responsive srcset. */
  sizes?: string;
  /** When true, image fills its parent container (use with relative parent). */
  fill?: boolean;
};

export function SmartImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
  fill = false,
}: SmartImageProps) {
  const [errored, setErrored] = useState(false);

  // If next/image fails for any reason, fall back to a plain <img>
  if (errored) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes || "100vw"}
        className={className}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 1200}
      height={height || 800}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
