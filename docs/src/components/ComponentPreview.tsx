import React, { useRef, useEffect } from "react";

interface ComponentPreviewProps {
  /** Clean HTML to render (no <script> blocks). */
  readonly html: string;
  /** Optional JS to execute after mount. Receives the container element. */
  readonly setup?: (container: HTMLDivElement) => void;
  /**
   * If set, the component is a dialog-type overlay or toast.
   * - For modal/drawer/alert-dialog: strips the `open` attribute and injects
   *   a trigger button so the user can open/close the overlay on demand.
   * - For toast: parses the HTML inside an inert <template> (so custom elements
   *   never upgrade), then creates "Show Toast" trigger buttons.  Clicking a
   *   trigger clones the toast into document.body where it renders normally.
   * The code display tabs still show the original HTML so users see the correct API.
   */
  readonly overlayTag?: string;
}

/**
 * Format a tag name into a human label: "kb-alert-dialog" → "Alert Dialog"
 */
function tagToLabel(tag: string): string {
  return tag
    .replace(/^kb-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Strip the boolean `open` attribute from a specific custom-element tag in HTML.
 * Handles `open`, `open="true"`, `open="open"`, etc.
 */
function stripOpenAttr(html: string, tag: string): string {
  // Match the opening tag, then remove `open` attribute within it
  const re = new RegExp(
    `(<${tag}\\b[^>]*?)\\s+open(?:="[^"]*")?([\\s>])`,
    "gi",
  );
  return html.replace(re, "$1$2");
}

/**
 * Renders a web component demo inside a container.
 *
 * - Sets innerHTML from the `html` prop.
 * - Calls `setup(container)` after mount so JS-property-bound components
 *   (e.g. select, combobox, tree-view) can have their properties set.
 * - When `overlayTag` is set, handles overlay/toast trigger injection.
 * - Custom element registration happens via `require()` in the calling MDX
 *   before this component renders (inside a `<BrowserOnly>` callback).
 */
export function ComponentPreview({ html, setup, overlayTag }: ComponentPreviewProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ── Toast handling ─────────────────────────────────────────────────
    //
    // Toasts auto-show on connectedCallback and render their inner content
    // with `fixed` positioning (Tailwind classes on the inner div).  We
    // MUST NOT inject toast HTML into the live DOM — instead we parse it
    // inside an inert <template> so custom elements never upgrade, then
    // create trigger buttons that clone fresh toasts into document.body.
    if (overlayTag === "kb-toast") {
      // Parse in an inert <template> — no custom element upgrades happen
      const tpl = document.createElement("template");
      tpl.innerHTML = html;

      const toasts = Array.from(
        tpl.content.querySelectorAll("kb-toast"),
      );

      if (toasts.length === 0) {
        // No toasts found (shouldn't happen), fall through to raw render
        el.innerHTML = html;
        if (setup) requestAnimationFrame(() => setup(el));
        return;
      }

      el.innerHTML = "";

      const createTrigger = (toastEl: Element, label: string): HTMLElement => {
        const toastMarkup = toastEl.outerHTML;
        const btn = document.createElement("kb-button");
        btn.setAttribute("variant", "outline");
        btn.setAttribute("size", "sm");
        btn.textContent = label;
        btn.addEventListener("click", () => {
          // Parse in another inert template so the element is fresh
          const clone = document.createElement("template");
          clone.innerHTML = toastMarkup;
          const fresh = clone.content.firstElementChild as HTMLElement | null;
          if (fresh) {
            // Strip Storybook-only position:static so toast uses its
            // default fixed positioning
            fresh.style.removeProperty("position");
            document.body.appendChild(fresh);
          }
        });
        return btn;
      };

      if (toasts.length === 1) {
        el.appendChild(createTrigger(toasts[0], "Show Toast"));
      } else {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexWrap = "wrap";
        wrapper.style.gap = "8px";

        toasts.forEach((t) => {
          const status = t.getAttribute("status") || "info";
          const capStatus = status.charAt(0).toUpperCase() + status.slice(1);
          wrapper.appendChild(createTrigger(t, `Show ${capStatus} Toast`));
        });

        el.appendChild(wrapper);
      }

      if (setup) requestAnimationFrame(() => setup(el));
      return;
    }

    // ── Modal / Drawer / Alert-dialog handling ─────────────────────────
    let processedHtml = html;

    if (overlayTag) {
      // Strip `open` so the overlay doesn't auto-open on render
      processedHtml = stripOpenAttr(processedHtml, overlayTag);
    }

    el.innerHTML = processedHtml;

    if (overlayTag) {
      const overlay = el.querySelector(overlayTag) as HTMLElement | null;
      if (overlay) {
        const openOverlay = () => {
          (overlay as any).open = true;
        };

        // Check if the story already provides a trigger button before the
        // overlay (e.g. drawer "Toggle Demo").  If so, wire it up instead
        // of injecting a duplicate.
        const prev = overlay.previousElementSibling;
        if (
          prev &&
          (prev.tagName === "KB-BUTTON" || prev.tagName === "BUTTON")
        ) {
          prev.addEventListener("click", openOverlay);
        } else {
          // No existing trigger — inject one
          const btn = document.createElement("kb-button");
          btn.setAttribute("variant", "outline");
          btn.setAttribute("size", "sm");
          btn.textContent = `Open ${tagToLabel(overlayTag)}`;
          btn.addEventListener("click", openOverlay);
          el.insertBefore(btn, overlay);
        }
      }
    }

    if (setup) {
      // Small delay to let custom elements upgrade after innerHTML assignment
      requestAnimationFrame(() => {
        setup(el);
      });
    }
  }, [html, setup, overlayTag]);

  return <div ref={containerRef} />;
}
