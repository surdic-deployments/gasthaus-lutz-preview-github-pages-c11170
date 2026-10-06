"use client";

import { routeUrl, routeUrlApple } from "@/data/betrieb";
import { useBrowserWert } from "@/lib/useBrowserWert";

const istApple = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** „Route planen“: Apple Karten auf iPhone/iPad, sonst Google Maps (öffnet auf Mobilgeräten die Navigation). */
export function RouteLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const apple = useBrowserWert(istApple, false);
  return (
    <a className={className} href={apple ? routeUrlApple : routeUrl} target="_blank" rel="noopener">
      {children}
    </a>
  );
}
