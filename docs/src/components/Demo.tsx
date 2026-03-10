import React, { type ReactNode, useEffect, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import CodeBlock from "@theme/CodeBlock";

interface FrameworkCode {
  html?: string;
  react?: string;
  vue?: string;
  svelte?: string;
}

interface DemoProps {
  children: ReactNode;
  /** Single code string (backward compat) */
  code?: string;
  /** Framework-specific code variants */
  codes?: FrameworkCode;
  language?: string;
  title?: string;
  description?: string;
}

const TABS = [
  { key: "html", label: "HTML", lang: "html" },
  { key: "react", label: "React", lang: "tsx" },
  { key: "vue", label: "Vue", lang: "html" },
  { key: "svelte", label: "Svelte", lang: "html" },
] as const;

const STORAGE_KEY = "karbit-docs-framework";
const SYNC_EVENT = "karbit-framework-change";

export function Demo({ children, code, codes, language = "html", title, description }: DemoProps): React.ReactElement {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("html");

  // Restore persisted tab on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && TABS.some((t) => t.key === stored)) {
        setActiveTab(stored);
      }
    } catch {
      // SSR or localStorage unavailable
    }
  }, []);

  // Sync tab across all Demo instances on the page
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setActiveTab(detail);
    };
    window.addEventListener(SYNC_EVENT, handler);
    return () => window.removeEventListener(SYNC_EVENT, handler);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: key }));
  };

  const hasCodes = codes && Object.keys(codes).length > 0;
  const activeCode = hasCodes
    ? codes[activeTab as keyof FrameworkCode] ?? codes.html ?? ""
    : code ?? "";
  const activeLang = hasCodes
    ? (TABS.find((t) => t.key === activeTab)?.lang ?? "html")
    : language;

  const handleCopy = async (): Promise<void> => {
    if (activeCode) {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative border border-neutral-200 dark:border-neutral-800 mb-8">
      {/* Header */}
      {(title || description) && (
        <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {title}
                </span>
              )}
              {description && (
                <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            {activeCode && (
              <button
                type="button"
                onClick={handleCopy}
                className="ml-4 px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-400 transition-colors"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview — no overflow-hidden so dropdowns/popups render outside bounds */}
      <div className="p-6 bg-white dark:bg-neutral-950 min-h-[100px] flex items-center justify-center">
        <BrowserOnly fallback={
          <div className="text-neutral-400 dark:text-neutral-600 text-sm py-4">
            Loading component...
          </div>
        }>
          {() => <div className="w-full max-w-3xl">{children}</div>}
        </BrowserOnly>
      </div>

      {/* Code toggle */}
      {(activeCode || hasCodes) && (
        <>
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {showCode ? "Hide Code" : "Show Code"}
            </span>
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform ${showCode ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showCode && (
            <div className="border-t border-neutral-200 dark:border-neutral-800">
              {/* Framework tabs */}
              {hasCodes && (
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                  {TABS.map((tab) => {
                    const tabCode = codes[tab.key as keyof FrameworkCode];
                    if (!tabCode) return null;
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handleTabChange(tab.key)}
                        className={`px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors relative ${
                          isActive
                            ? "text-neutral-900 dark:text-neutral-100"
                            : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
                        }`}
                      >
                        {tab.label}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 dark:bg-neutral-100" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Code block */}
              <div className="overflow-hidden [&>div]:!mb-0 [&>div]:!border-0 [&>div]:!border-t-0">
                <CodeBlock language={activeLang}>{activeCode}</CodeBlock>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
