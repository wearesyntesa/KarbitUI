import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/data-display/kb-collapsible.js';

export default {
  title: 'Data Display/Collapsible',
  component: 'kb-collapsible',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <div>
      <button
        class="px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
        @click=${(e: Event) => {
          const collapsible = (e.target as HTMLElement).nextElementSibling as HTMLElement & { toggle(): void };
          collapsible.toggle();
        }}
      >Toggle content</button>
      <kb-collapsible>
        <div class="p-4 border border-gray-200 dark:border-zinc-700 border-t-0 text-sm font-sans text-slate-900 dark:text-zinc-50">
          This content can be expanded or collapsed by clicking the button above.
          The collapsible component does not render its own trigger — you control
          the toggle externally.
        </div>
      </kb-collapsible>
    </div>
  `,
};

export const Open: S = {
  render: () => html`
    <div>
      <button
        class="px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
        @click=${(e: Event) => {
          const collapsible = (e.target as HTMLElement).nextElementSibling as HTMLElement & { toggle(): void };
          collapsible.toggle();
        }}
      >Toggle section</button>
      <kb-collapsible open>
        <div class="p-4 border border-gray-200 dark:border-zinc-700 border-t-0 text-sm font-sans text-slate-900 dark:text-zinc-50">
          This panel starts in the open state. Click the button to collapse it.
        </div>
      </kb-collapsible>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div>
      <button
        class="px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 cursor-not-allowed"
        @click=${(e: Event) => {
          const collapsible = (e.target as HTMLElement).nextElementSibling as HTMLElement & { toggle(): void };
          collapsible.toggle();
        }}
      >Disabled toggle</button>
      <kb-collapsible disabled open>
        <div class="p-4 border border-gray-200 dark:border-zinc-700 border-t-0 text-sm font-sans text-slate-900 dark:text-zinc-50">
          This collapsible is disabled. The toggle method will have no effect.
        </div>
      </kb-collapsible>
    </div>
  `,
};

export const MultipleCollapsibles: S = {
  name: 'Multiple Panels',
  render: () => html`
    <div class="flex flex-col gap-2">
      ${['System requirements', 'Installation guide', 'Configuration options'].map(
        (title) => html`
          <div>
            <button
              class="w-full px-4 py-2 text-left text-sm font-mono uppercase tracking-widest border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
              @click=${(e: Event) => {
                const collapsible = (e.target as HTMLElement).nextElementSibling as HTMLElement & { toggle(): void };
                collapsible.toggle();
              }}
            >${title}</button>
            <kb-collapsible>
              <div class="p-4 border border-gray-200 dark:border-zinc-700 border-t-0 text-sm font-sans text-slate-500 dark:text-zinc-300">
                Content for the "${title}" section. Each collapsible operates
                independently — opening one does not close the others.
              </div>
            </kb-collapsible>
          </div>
        `,
      )}
    </div>
  `,
};
