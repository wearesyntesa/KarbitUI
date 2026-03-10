import React, { useEffect, useState, type ReactNode } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

interface LiveDemoProps {
  children: () => ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps a render function in BrowserOnly to handle SSR.
 * The children function is only called in the browser where
 * custom elements and Lit are available.
 */
export function LiveDemo({ children, fallback }: LiveDemoProps): React.ReactElement {
  return (
    <BrowserOnly
      fallback={
        <div className="text-slate-400 dark:text-zinc-500 text-sm py-4">
          {fallback ?? "Loading component..."}
        </div>
      }
    >
      {children}
    </BrowserOnly>
  );
}

interface LazyComponentProps {
  loader: () => Promise<Record<string, React.ComponentType<Record<string, unknown>>>>;
  componentName: string;
  props?: Record<string, unknown>;
  children?: ReactNode;
}

/**
 * Lazily loads a KarbitUI React wrapper component.
 * Handles the dynamic import and renders a loading state until ready.
 */
export function LazyComponent({ loader, componentName, props = {}, children }: LazyComponentProps): React.ReactElement {
  const [Component, setComponent] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loader().then((mod) => {
      if (!cancelled) {
        setComponent(() => mod[componentName] as React.ComponentType<Record<string, unknown>>);
      }
    });
    return () => { cancelled = true; };
  }, [loader, componentName]);

  if (!Component) {
    return <div className="text-slate-400 dark:text-zinc-500 text-sm py-2">Loading...</div>;
  }

  return <Component {...props}>{children}</Component>;
}
