import type { Shot } from "./photos";

export function mediaUrl(path: string): string {
  return `/media/${path}`;
}

/** Thumb plus full image. Hero images are eager; everything else is lazy. */
export function Photo({
  shot,
  alt,
  priority = false,
  sizes = "(max-width: 720px) 100vw, 360px",
  className,
}: {
  shot: Shot;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const full = mediaUrl(shot.file);
  const thumb = shot.thumb ? mediaUrl(shot.thumb) : null;
  const srcSet = thumb && shot.thumbWidth ? `${thumb} ${shot.thumbWidth}w, ${full} ${shot.width}w` : undefined;
  return (
    <img
      className={className}
      src={thumb ?? full}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt ?? shot.alt}
      width={shot.width}
      height={shot.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

export function HeroPhoto() {
  return (
    <picture className="hero-picture">
      <source
        media="(max-width: 720px)"
        srcSet="/media/thumbs/hero-mobile-600.webp 337w, /media/hero-mobile.webp 1080w"
        sizes="100vw"
      />
      <img
        src="/media/hero.webp"
        srcSet="/media/thumbs/hero-600.webp 600w, /media/hero.webp 1920w"
        sizes="100vw"
        alt="Photoreal high-street hair and beauty shopfront with a glowing neon pink SalonOS sign"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
