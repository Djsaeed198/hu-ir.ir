"use client";

import Image from "next/image";
import { useState } from "react";
import type { MediaItem } from "@/lib/media";
import { MEDIA } from "@/lib/media";

type Props = {
  media: MediaItem;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  ratio?: string;
  rounded?: string;
  eager?: boolean;
};

/* تصویر هوشمند سئو: alt/title فارسی، لزی‌لود، نسبت ثابت ضد CLS، فالبک */
export function SmartImage({
  media,
  className = "",
  imgClassName = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  ratio = "16/10",
  rounded = "rounded-2xl",
}: Props) {
  const [failed, setFailed] = useState(false);
  const fallback = MEDIA.heroParliamentNight;
  const item = failed ? fallback : media;

  return (
    <div className={`relative w-full overflow-hidden ${rounded} ${className}`} style={{ aspectRatio: ratio }}>
      <Image
        src={item.src}
        alt={item.alt}
        title={item.title}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        onError={() => setFailed(true)}
        className={`object-cover transition-transform duration-700 hover:scale-[1.03] ${imgClassName}`}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  );
}

/* تصویر با کپشن (figure/figcaption برای سئو) */
export function FigureImage({ media, caption, priority = false }: { media: MediaItem; caption?: string; priority?: boolean }) {
  return (
    <figure className="m-0">
      <SmartImage media={media} priority={priority} sizes="(max-width: 1024px) 100vw, 66vw" />
      <figcaption className="mt-2 text-center text-[11px] leading-6 text-white/35">
        {caption ?? media.alt}
        {media.credit ? ` — عکس: ${media.credit}` : ""}
      </figcaption>
    </figure>
  );
}

/* آواتار گرد تیم/نظر */
export function AvatarImage({ media, size = 56 }: { media: MediaItem; size?: number }) {
  const [failed, setFailed] = useState(false);
  const item = failed ? MEDIA.businessWomen : media;
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-400/40"
      style={{ width: size, height: size }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        title={item.title}
        fill
        loading="lazy"
        sizes={`${size}px`}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </span>
  );
}
