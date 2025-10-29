/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener
      ? mql.addEventListener("change", handler)
      : mql.addListener(handler);
    setMatches(mql.matches);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", handler)
        : mql.removeListener(handler);
    };
  }, [query]);

  return matches;
}
