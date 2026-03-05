import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/feedback/kb-clipboard.define.js';

type Args = {
  value?: string;
  label?: string;
  'copied-label'?: string;
  'show-value'?: boolean;
  size?: string;
  variant?: string;
  disabled?: boolean;
  timeout?: number;
};

export default {
  title: 'Feedback/Clipboard',
  component: 'kb-clipboard',
  args: {
    value: 'npm install @wearesyntesa/karbit-ui',
    variant: 'outline',
    size: 'md',
  },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

/* ------------------------------------------------------------------ */
/*  Button mode                                                       */
/* ------------------------------------------------------------------ */

export const Default: S = {
  render: (args) => html`
    <kb-clipboard
      value=${args.value ?? 'npm install @wearesyntesa/karbit-ui'}
      variant=${args.variant ?? 'outline'}
      size=${args.size ?? 'md'}
    ></kb-clipboard>
  `,
};

export const ButtonWithLabel: S = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <kb-clipboard value="npm install @wearesyntesa/karbit-ui" label="Copy"></kb-clipboard>
      <kb-clipboard value="npx create-karbit" label="Copy Command" copied-label="Done!"></kb-clipboard>
      <kb-clipboard value="ABC-123-XYZ" label="Copy ID" variant="subtle"></kb-clipboard>
    </div>
  `,
};

export const ButtonVariants: S = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <kb-clipboard value="outline" label="Outline" variant="outline"></kb-clipboard>
      <kb-clipboard value="subtle" label="Subtle" variant="subtle"></kb-clipboard>
      <kb-clipboard value="ghost" label="Ghost" variant="ghost"></kb-clipboard>
    </div>
  `,
};

export const ButtonSizes: S = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <kb-clipboard value="xs" label="XS" size="xs"></kb-clipboard>
      <kb-clipboard value="sm" label="SM" size="sm"></kb-clipboard>
      <kb-clipboard value="md" label="MD" size="md"></kb-clipboard>
      <kb-clipboard value="lg" label="LG" size="lg"></kb-clipboard>
      <kb-clipboard value="xl" label="XL" size="xl"></kb-clipboard>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:16px;">
      <kb-clipboard value="xs" size="xs"></kb-clipboard>
      <kb-clipboard value="sm" size="sm"></kb-clipboard>
      <kb-clipboard value="md" size="md"></kb-clipboard>
      <kb-clipboard value="lg" size="lg"></kb-clipboard>
      <kb-clipboard value="xl" size="xl"></kb-clipboard>
    </div>
  `,
};

/* ------------------------------------------------------------------ */
/*  Inline mode (show-value)                                          */
/* ------------------------------------------------------------------ */

export const InlineDefault: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-clipboard value="npm install @wearesyntesa/karbit-ui" show-value></kb-clipboard>
    </div>
  `,
};

export const InlineWithLabel: S = {
  render: () => html`
    <div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
      <kb-clipboard value="npm install @wearesyntesa/karbit-ui" show-value label="Install Command"></kb-clipboard>
      <kb-clipboard value="https://karbit.dev" show-value label="Documentation URL"></kb-clipboard>
      <kb-clipboard value="sk-1234-abcd-5678-efgh" show-value label="API Key"></kb-clipboard>
    </div>
  `,
};

export const InlineSizes: S = {
  render: () => html`
    <div style="display:grid;gap:12px;max-width:420px;">
      <kb-clipboard value="xs — extra small" show-value size="xs"></kb-clipboard>
      <kb-clipboard value="sm — small size" show-value size="sm"></kb-clipboard>
      <kb-clipboard value="md — medium (default)" show-value size="md"></kb-clipboard>
      <kb-clipboard value="lg — large size" show-value size="lg"></kb-clipboard>
      <kb-clipboard value="xl — extra large" show-value size="xl"></kb-clipboard>
    </div>
  `,
};

export const InlineLongValue: S = {
  render: () => html`
    <div style="max-width:360px;">
      <kb-clipboard
        value="https://registry.npmjs.org/@wearesyntesa/karbit-ui/-/karbit-ui-0.1.3.tgz"
        show-value
        label="Package URL"
      ></kb-clipboard>
    </div>
    <div style="max-width:240px;margin-top:16px;">
      <kb-clipboard
        value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkthcmJpdCJ9"
        show-value
        label="JWT Token"
      ></kb-clipboard>
    </div>
  `,
};

/* ------------------------------------------------------------------ */
/*  States                                                            */
/* ------------------------------------------------------------------ */

export const Disabled: S = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <kb-clipboard value="disabled" label="Disabled" disabled></kb-clipboard>
      <kb-clipboard value="disabled" label="Disabled Subtle" variant="subtle" disabled></kb-clipboard>
      <kb-clipboard value="disabled" label="Disabled Ghost" variant="ghost" disabled></kb-clipboard>
    </div>
    <div style="max-width:360px;margin-top:16px;">
      <kb-clipboard value="Cannot copy this" show-value label="Disabled Inline" disabled></kb-clipboard>
    </div>
  `,
};

export const CustomTimeout: S = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <kb-clipboard value="fast" label="500ms" timeout="500"></kb-clipboard>
      <kb-clipboard value="default" label="1500ms (default)"></kb-clipboard>
      <kb-clipboard value="slow" label="3000ms" timeout="3000"></kb-clipboard>
    </div>
  `,
};

/* ------------------------------------------------------------------ */
/*  Practical patterns                                                */
/* ------------------------------------------------------------------ */

export const CodeBlock: S = {
  render: () => html`
    <div style="position:relative;max-width:480px;">
      <pre
        class="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 pr-12 font-mono text-sm text-slate-900 dark:text-zinc-50 overflow-x-auto"
      ><code>npm install @wearesyntesa/karbit-ui</code></pre>
      <div style="position:absolute;top:8px;right:8px;">
        <kb-clipboard value="npm install @wearesyntesa/karbit-ui" variant="ghost" size="sm"></kb-clipboard>
      </div>
    </div>
    <div style="position:relative;max-width:480px;margin-top:16px;">
      <pre
        class="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 pr-12 font-mono text-sm text-slate-900 dark:text-zinc-50 overflow-x-auto"
      ><code>const app = createApp({
  theme: 'dark',
  components: ['clipboard', 'badge'],
});</code></pre>
      <div style="position:absolute;top:8px;right:8px;">
        <kb-clipboard
          value="const app = createApp({ theme: 'dark', components: ['clipboard', 'badge'] });"
          variant="ghost"
          size="sm"
        ></kb-clipboard>
      </div>
    </div>
  `,
};

export const InlineCollection: S = {
  render: () => html`
    <div class="border border-gray-200 dark:border-zinc-700 divide-y divide-gray-200 dark:divide-zinc-700" style="max-width:480px;">
      <div class="p-4 space-y-1.5">
        <kb-clipboard value="192.168.1.100" show-value label="IP Address" size="sm"></kb-clipboard>
      </div>
      <div class="p-4 space-y-1.5">
        <kb-clipboard value="5432" show-value label="Port" size="sm"></kb-clipboard>
      </div>
      <div class="p-4 space-y-1.5">
        <kb-clipboard value="postgres://admin:pass@192.168.1.100:5432/mydb" show-value label="Connection String" size="sm"></kb-clipboard>
      </div>
      <div class="p-4 space-y-1.5">
        <kb-clipboard value="sk-proj-abc123def456ghi789" show-value label="API Key" size="sm"></kb-clipboard>
      </div>
    </div>
  `,
};

export const InlineWithButton: S = {
  render: () => html`
    <p class="text-sm text-slate-500 dark:text-zinc-400 mb-4">Inline and button modes side by side — both share the same size scale.</p>
    <div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));align-items:end;">
      <kb-clipboard value="npm install @wearesyntesa/karbit-ui" show-value label="Install" size="md"></kb-clipboard>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <kb-clipboard value="npm install @wearesyntesa/karbit-ui" label="Copy" size="md"></kb-clipboard>
        <kb-clipboard value="npm install @wearesyntesa/karbit-ui" label="Copy" variant="subtle" size="md"></kb-clipboard>
        <kb-clipboard value="npm install @wearesyntesa/karbit-ui" variant="ghost" size="md"></kb-clipboard>
      </div>
    </div>
  `,
};
