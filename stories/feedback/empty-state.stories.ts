import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/feedback/kb-empty-state.define.js';
import '../../src/components/forms/kb-button.define.js';

const folderIcon = html`
  <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
`;

const searchIcon = html`
  <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
`;

export default {
  title: 'Feedback/EmptyState',
  component: 'kb-empty-state',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-empty-state
      title="No projects yet"
      description="Create your first project to get started."
    >
      ${folderIcon}
      <kb-button slot="action" size="sm">CREATE PROJECT</kb-button>
    </kb-empty-state>
  `,
};

export const NoResults: S = {
  render: () => html`
    <kb-empty-state
      title="No results found"
      description="Try adjusting your search or filter criteria."
    >
      ${searchIcon}
    </kb-empty-state>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="space-y-8">
      ${(['sm', 'md', 'lg'] as const).map(
        (size) => html`
        <div class="border border-gray-200 dark:border-zinc-700">
          <kb-empty-state
            size=${size}
            title="Empty — ${size}"
            description="No data to display."
          >
            ${folderIcon}
            <kb-button slot="action" size="sm">ADD DATA</kb-button>
          </kb-empty-state>
        </div>
      `,
      )}
    </div>
  `,
};

export const WithBorder: S = {
  render: () => html`
    <div class="border border-gray-200 dark:border-zinc-700">
      <kb-empty-state
        title="No deployments"
        description="Deploy your first build to see it listed here."
      >
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <kb-button slot="action" size="sm">DEPLOY NOW</kb-button>
      </kb-empty-state>
    </div>
  `,
};

export const TitleOnly: S = {
  render: () => html`
    <kb-empty-state title="Nothing to see here"></kb-empty-state>
  `,
};
