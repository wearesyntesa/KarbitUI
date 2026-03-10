import React, { useEffect } from "react";

/**
 * Syncs Docusaurus dark mode (`[data-theme="dark"]`) with
 * KarbitUI's `.dark` class on `<html>`.
 */
export default function Root({ children }: { children: React.ReactNode }): React.ReactElement {
  useEffect(() => {
    const html = document.documentElement;

    function syncDarkClass(): void {
      const isDark = html.getAttribute("data-theme") === "dark";
      html.classList.toggle("dark", isDark);
    }

    syncDarkClass();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "data-theme") {
          syncDarkClass();
          return;
        }
      }
    });

    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
