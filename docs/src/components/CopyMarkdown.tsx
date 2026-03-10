import React, { useState, useCallback } from "react";

/**
 * Converts the current doc page's rendered HTML to Markdown and copies it.
 * Reads from the `.markdown` container in the DOM.
 *
 * Handles: headings, paragraphs, code blocks, inline code, tables,
 * ordered/unordered lists, links, bold, italic, and horizontal rules.
 */

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  // Skip certain elements
  if (el.classList.contains("hash-link")) return "";
  if (el.classList.contains("kb-demo")) return "";
  if (tag === "button") return "";

  // Headings
  if (/^h([1-6])$/.test(tag)) {
    const level = Number(tag[1]);
    const text = getTextContent(el);
    return `${"#".repeat(level)} ${text}\n\n`;
  }

  // Paragraphs
  if (tag === "p") {
    const text = childrenToMarkdown(el).trim();
    if (!text) return "";
    return `${text}\n\n`;
  }

  // Pre > code (fenced code blocks)
  if (tag === "pre") {
    const codeEl = el.querySelector("code");
    if (codeEl) {
      const lang = extractLanguage(codeEl);
      const code = codeEl.textContent ?? "";
      return `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\`\n\n`;
    }
    return `\`\`\`\n${el.textContent ?? ""}\n\`\`\`\n\n`;
  }

  // Inline code
  if (tag === "code") {
    return `\`${el.textContent ?? ""}\``;
  }

  // Links
  if (tag === "a") {
    const href = el.getAttribute("href") ?? "";
    const text = childrenToMarkdown(el);
    return `[${text}](${href})`;
  }

  // Bold
  if (tag === "strong" || tag === "b") {
    return `**${childrenToMarkdown(el)}**`;
  }

  // Italic
  if (tag === "em" || tag === "i") {
    return `*${childrenToMarkdown(el)}*`;
  }

  // Unordered list
  if (tag === "ul") {
    return listToMarkdown(el, "-") + "\n";
  }

  // Ordered list
  if (tag === "ol") {
    return listToMarkdown(el, "1.") + "\n";
  }

  // Table
  if (tag === "table") {
    return tableToMarkdown(el) + "\n";
  }

  // Horizontal rule
  if (tag === "hr") {
    return "---\n\n";
  }

  // Blockquote
  if (tag === "blockquote") {
    const content = childrenToMarkdown(el).trim();
    return content
      .split("\n")
      .map((line: string) => `> ${line}`)
      .join("\n") + "\n\n";
  }

  // Div/section/article — recurse
  return childrenToMarkdown(el);
}

function childrenToMarkdown(el: HTMLElement): string {
  let result = "";
  for (const child of Array.from(el.childNodes)) {
    result += nodeToMarkdown(child);
  }
  return result;
}

function getTextContent(el: HTMLElement): string {
  let text = "";
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childEl = child as HTMLElement;
      if (childEl.classList.contains("hash-link")) continue;
      text += getTextContent(childEl);
    } else if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent ?? "";
    }
  }
  return text.trim();
}

function extractLanguage(codeEl: Element): string {
  const classList = Array.from(codeEl.classList);
  for (const cls of classList) {
    if (cls.startsWith("language-")) {
      return cls.replace("language-", "");
    }
  }
  return "";
}

function listToMarkdown(el: HTMLElement, marker: string): string {
  const items: string[] = [];
  for (const li of Array.from(el.children)) {
    if (li.tagName.toLowerCase() === "li") {
      const text = childrenToMarkdown(li as HTMLElement).trim();
      items.push(`${marker} ${text}`);
    }
  }
  return items.join("\n") + "\n";
}

function tableToMarkdown(table: HTMLElement): string {
  const rows: string[][] = [];
  for (const tr of Array.from(table.querySelectorAll("tr"))) {
    const cells: string[] = [];
    for (const cell of Array.from(tr.querySelectorAll("th, td"))) {
      cells.push(childrenToMarkdown(cell as HTMLElement).trim().replace(/\|/g, "\\|"));
    }
    rows.push(cells);
  }

  if (rows.length === 0) return "";

  const lines: string[] = [];
  const header = rows[0];
  lines.push(`| ${header.join(" | ")} |`);
  lines.push(`| ${header.map(() => "---").join(" | ")} |`);

  for (let i = 1; i < rows.length; i++) {
    lines.push(`| ${rows[i].join(" | ")} |`);
  }

  return lines.join("\n") + "\n";
}

export function CopyMarkdown(): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const markdownEl = document.querySelector(".markdown");
    if (!markdownEl) return;

    const markdown = childrenToMarkdown(markdownEl as HTMLElement)
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="kb-copy-markdown-btn"
      title="Copy page as Markdown"
      aria-label="Copy page as Markdown"
    >
      {copied ? (
        <>
          <CheckIcon /> Copied
        </>
      ) : (
        <>
          <CopyIcon /> Copy as Markdown
        </>
      )}
    </button>
  );
}

function CopyIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="0" />
      <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
    </svg>
  );
}

function CheckIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
