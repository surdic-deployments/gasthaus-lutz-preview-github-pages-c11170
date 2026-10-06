"use client";

import { useSyncExternalStore } from "react";

const keinAbo = () => () => {};

/**
 * Liefert einen Wert, der nur im Browser bekannt ist (Datum, Gerät …).
 * Beim Server-Rendering wird `serverWert` verwendet, danach der echte Wert - ohne Hydration-Fehler.
 * `holen` muss einen primitiven Wert liefern (string/number/boolean), damit React ihn vergleichen kann.
 * Mit `intervallMs` wird der Wert regelmäßig neu gelesen.
 */
export function useBrowserWert<T extends string | number | boolean | null>(holen: () => T, serverWert: T, intervallMs?: number): T {
  return useSyncExternalStore(
    intervallMs
      ? (melden) => {
          const t = setInterval(melden, intervallMs);
          return () => clearInterval(t);
        }
      : keinAbo,
    holen,
    () => serverWert,
  );
}
