import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/typography/kb-highlight.define.js';

export default {
  title: 'Typography/Highlight',
  component: 'kb-highlight',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <p class="text-sm text-slate-700 dark:text-zinc-300">
      This sentence contains <kb-highlight>important text</kb-highlight> that stands out.
    </p>
  `,
};

export const QueryMode: S = {
  render: () => html`
    <div class="space-y-3">
      <div class="font-mono text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Search: "deploy"</div>
      <p class="text-sm text-slate-700 dark:text-zinc-300">
        <kb-highlight text="Deploy your application to production using the deploy command. Each deploy creates a new revision." query="deploy"></kb-highlight>
      </p>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div class="space-y-3">
      ${(['yellow', 'green', 'blue', 'red', 'orange', 'purple', 'pink'] as const).map(
        (scheme) => html`
        <p class="text-sm text-slate-700 dark:text-zinc-300">
          <kb-highlight color-scheme=${scheme}>${scheme} highlight</kb-highlight>
          <span class="ml-2 font-mono text-[10px] text-slate-400 dark:text-zinc-500">${scheme}</span>
        </p>
      `,
      )}
    </div>
  `,
};

export const SearchResults: S = {
  render: () => html`
    <div class="space-y-4">
      <div class="font-mono text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Results for "API"</div>
      ${[
        'The API Gateway handles all incoming requests and routes them to the appropriate microservice.',
        'Each API endpoint requires a valid authentication token in the Authorization header.',
        'Rate limiting is applied per API key at 1,000 requests per minute.',
      ].map(
        (text) => html`
        <div class="border-b border-gray-100 dark:border-zinc-800 pb-3">
          <p class="text-sm text-slate-700 dark:text-zinc-300">
            <kb-highlight text=${text} query="API"></kb-highlight>
          </p>
        </div>
      `,
      )}
    </div>
  `,
};

export const InlineUsage: S = {
  render: () => html`
    <p class="text-sm text-slate-700 dark:text-zinc-300">
      Press <kb-highlight color-scheme="blue">Ctrl+K</kb-highlight> to open the command palette,
      or <kb-highlight color-scheme="green">Ctrl+S</kb-highlight> to save your changes.
    </p>
  `,
};

export const MultipleMatches: S = {
  render: () => html`
    <p class="text-sm text-slate-700 dark:text-zinc-300">
      <kb-highlight
        text="The server processes the request, validates the server configuration, and sends the response back to the server pool."
        query="server"
        color-scheme="orange"
      ></kb-highlight>
    </p>
  `,
};
