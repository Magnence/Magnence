"use client";

import * as React from "react";

interface CaseStudyImageProps {
  imageUrl?: string;
  imageGradient: string;
  alt: string;
  className?: string;
  /** When true (default), uses eager loading for above-the-fold images */
  priority?: boolean;
}

/**
 * Renders a real image from a direct URL (Unsplash).
 * Falls back to the provided gradient if the image fails to load.
 * Uses eager loading by default to ensure images appear immediately on page load.
 */
export function CaseStudyImage({
  imageUrl,
  imageGradient,
  alt,
  className = "",
  priority = true,
}: CaseStudyImageProps) {
  const [imgError, setImgError] = React.useState(false);

  // If no URL or image failed to load, show gradient fallback
  if (imgError || !imageUrl) {
    return (
      <div
        className={className}
        style={{ background: imageGradient }}
        aria-label={alt}
        role="img"
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      style={{ objectFit: "cover", width: "100%", height: "100%" }}
      onError={() => setImgError(true)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
