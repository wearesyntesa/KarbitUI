import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-drawer.js';
import '../../src/components/forms/kb-button.js';
import '../../src/components/forms/kb-input.js';

export default {
  title: 'Overlay/Drawer',
  component: 'kb-drawer',
  args: { open: true, placement: 'right', size: 'md' },
} satisfies Meta;

type S = StoryObj;

/** Default right-side drawer with header, body, and footer. */
export const Right: S = {
  render: () => html`
    <kb-drawer open placement="right">
      <span slot="header">DRAWER TITLE</span>
      <p>Drawer body content goes here. This panel slides in from the right edge with a smooth animation.</p>
      <span slot="footer">
        <kb-button size="sm" variant="outline">Cancel</kb-button>
        <kb-button size="sm">Save</kb-button>
      </span>
    </kb-drawer>
  `,
};

/** Left-side drawer. */
export const Left: S = {
  render: () => html`
    <kb-drawer open placement="left">
      <span slot="header">LEFT NAVIGATION</span>
      <nav>
        <ul class="space-y-3">
          <li class="font-mono text-sm text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Dashboard</li>
          <li class="font-mono text-sm text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Analytics</li>
          <li class="font-mono text-sm text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Reports</li>
          <li class="font-mono text-sm text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Settings</li>
        </ul>
      </nav>
    </kb-drawer>
  `,
};

/** Top drawer slides down from the top edge. */
export const Top: S = {
  render: () => html`
    <kb-drawer open placement="top" size="sm">
      <span slot="header">NOTIFICATION PANEL</span>
      <p>Content drops down from the top of the viewport.</p>
    </kb-drawer>
  `,
};

/** Bottom drawer slides up from the bottom edge. */
export const Bottom: S = {
  render: () => html`
    <kb-drawer open placement="bottom" size="sm">
      <span slot="header">QUICK ACTIONS</span>
      <div class="flex gap-3">
        <kb-button size="sm" variant="outline" full-width>Share</kb-button>
        <kb-button size="sm" variant="outline" full-width>Export</kb-button>
        <kb-button size="sm" variant="outline" full-width>Print</kb-button>
      </div>
    </kb-drawer>
  `,
};

/** All 6 sizes for the right placement. */
export const AllSizes: S = {
  render: () => html`
    <div class="flex flex-wrap gap-3">
      ${(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map(
        (size) => html`
          <kb-button
            size="sm"
            variant="outline"
            @click=${(e: Event) => {
              const btn = e.currentTarget as HTMLElement;
              const drawer = btn.parentElement?.querySelector<HTMLElement>(`kb-drawer[data-size="${size}"]`);
              if (drawer) (drawer as unknown as { open: boolean }).open = true;
            }}
          >${size}</kb-button>
          <kb-drawer data-size=${size} placement="right" size=${size}>
            <span slot="header">SIZE: ${size.toUpperCase()}</span>
            <p>This drawer uses the <code class="font-mono text-blue-500">${size}</code> size preset.</p>
          </kb-drawer>
        `,
      )}
    </div>
  `,
};

/** Blurred backdrop with lighter overlay. */
export const BackdropBlur: S = {
  render: () => html`
    <kb-drawer open placement="right" backdrop="blur">
      <span slot="header">BLUR BACKDROP</span>
      <p>The background is blurred with a lighter overlay, giving a frosted glass effect.</p>
    </kb-drawer>
  `,
};

/** Transparent backdrop — no visual overlay, but clicking outside still closes. */
export const BackdropTransparent: S = {
  render: () => html`
    <kb-drawer open placement="right" backdrop="transparent">
      <span slot="header">TRANSPARENT BACKDROP</span>
      <p>No visible backdrop overlay. Click outside to dismiss.</p>
    </kb-drawer>
  `,
};

/** Drawer without a close button (closable=false). Must dismiss via overlay click or Escape. */
export const NotClosable: S = {
  render: () => html`
    <kb-drawer open placement="right" .closable=${false}>
      <span slot="header">NO CLOSE BUTTON</span>
      <p>This drawer has no X button. Use Escape key or click the overlay to dismiss.</p>
    </kb-drawer>
  `,
};

/** Drawer that cannot be closed by overlay click. */
export const NoOverlayClose: S = {
  render: () => html`
    <kb-drawer open placement="right" .closeOnOverlay=${false}>
      <span slot="header">PERSISTENT DRAWER</span>
      <p>Clicking the overlay does not close this drawer. Use the X button or Escape key.</p>
    </kb-drawer>
  `,
};

/** Drawer with no header slot — only close button visible in header area. */
export const NoHeader: S = {
  render: () => html`
    <kb-drawer open placement="right">
      <p>This drawer has no header slot. Only the close button appears at the top.</p>
    </kb-drawer>
  `,
};

/** Drawer with no footer — footer area is not rendered. */
export const NoFooter: S = {
  render: () => html`
    <kb-drawer open placement="right">
      <span slot="header">NO FOOTER</span>
      <p>This drawer has no footer slot, so the footer section is not rendered at all.</p>
    </kb-drawer>
  `,
};

/** Large drawer with form content and footer actions. */
export const WithForm: S = {
  render: () => html`
    <kb-drawer open placement="right" size="lg">
      <span slot="header">CREATE NEW ITEM</span>
      <div class="space-y-4">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1">Name</label>
          <kb-input placeholder="Enter name..." variant="outline" size="md"></kb-input>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1">Description</label>
          <kb-input placeholder="Enter description..." variant="outline" size="md"></kb-input>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1">Category</label>
          <kb-input placeholder="Select category..." variant="outline" size="md"></kb-input>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">Cancel</kb-button>
        <kb-button size="sm">Create</kb-button>
      </span>
    </kb-drawer>
  `,
};

/** XL-sized drawer for complex layouts. */
export const ExtraLarge: S = {
  render: () => html`
    <kb-drawer open placement="right" size="xl">
      <span slot="header">DETAIL VIEW</span>
      <div class="space-y-4">
        <div class="border border-gray-200 dark:border-zinc-700 p-4">
          <h3 class="font-sans font-semibold text-lg mb-2 text-slate-900 dark:text-zinc-50">Section One</h3>
          <p class="text-slate-500 dark:text-zinc-400 text-sm">Extra-large drawers work well for detail panels, settings pages, or multi-section layouts.</p>
        </div>
        <div class="border border-gray-200 dark:border-zinc-700 p-4">
          <h3 class="font-sans font-semibold text-lg mb-2 text-slate-900 dark:text-zinc-50">Section Two</h3>
          <p class="text-slate-500 dark:text-zinc-400 text-sm">Content can be organized into cards or sections within the drawer body.</p>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="outline">Close</kb-button>
      </span>
    </kb-drawer>
  `,
};

/** Full-width drawer takes over the entire viewport width. */
export const FullWidth: S = {
  render: () => html`
    <kb-drawer open placement="right" size="full">
      <span slot="header">FULL WIDTH DRAWER</span>
      <p>This drawer takes the full width of the viewport. Useful for immersive experiences or complex dashboards.</p>
      <span slot="footer">
        <kb-button size="sm">Done</kb-button>
      </span>
    </kb-drawer>
  `,
};

/** Blur backdrop with bottom placement — mobile action sheet pattern. */
export const MobileActionSheet: S = {
  render: () => html`
    <kb-drawer open placement="bottom" size="sm" backdrop="blur">
      <span slot="header">ACTIONS</span>
      <div class="space-y-2">
        <div class="py-2 px-1 cursor-pointer text-sm font-sans text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors border-b border-gray-100 dark:border-zinc-800">Edit item</div>
        <div class="py-2 px-1 cursor-pointer text-sm font-sans text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors border-b border-gray-100 dark:border-zinc-800">Duplicate</div>
        <div class="py-2 px-1 cursor-pointer text-sm font-sans text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors border-b border-gray-100 dark:border-zinc-800">Move to folder</div>
        <div class="py-2 px-1 cursor-pointer text-sm font-sans text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">Delete</div>
      </div>
    </kb-drawer>
  `,
};

/** Interactive demo: click button to toggle drawer open/close with animated transitions. */
export const ToggleDemo: S = {
  render: () => html`
    <kb-button
      @click=${(e: Event) => {
        const btn = e.currentTarget as HTMLElement;
        const drawer = btn.parentElement?.querySelector<HTMLElement>('kb-drawer');
        if (drawer) (drawer as unknown as { open: boolean }).open = true;
      }}
    >Open Drawer</kb-button>
    <kb-drawer placement="right" size="md" backdrop="blur">
      <span slot="header">TOGGLE DEMO</span>
      <p>This drawer was opened via button click. Close it with the X button, Escape key, or overlay click to see the animated dismiss transition.</p>
      <span slot="footer">
        <kb-button size="sm" variant="outline"
          @click=${(e: Event) => {
            const drawer = (e.currentTarget as HTMLElement).closest('kb-drawer');
            if (drawer) (drawer as unknown as { open: boolean }).open = false;
          }}
        >Close</kb-button>
      </span>
    </kb-drawer>
  `,
};
