import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-tooltip.js';
import '../../src/components/forms/kb-button.js';
import '../../src/components/forms/kb-icon-button.js';

export default {
  title: 'Overlay/Tooltip',
  component: 'kb-tooltip',
  args: { label: 'Tooltip text', placement: 'top' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <div class="flex items-center justify-center p-20">
      <kb-tooltip label="This is a tooltip">
        <kb-button>Hover me</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const Placements: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="Top placement" placement="top">
        <kb-button variant="outline">Top</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Bottom placement" placement="bottom">
        <kb-button variant="outline">Bottom</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Left placement" placement="left">
        <kb-button variant="outline">Left</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Right placement" placement="right">
        <kb-button variant="outline">Right</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="Extra small" size="xs">
        <kb-button size="xs">XS tooltip</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Small (default)" size="sm">
        <kb-button size="sm">SM tooltip</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Medium tooltip" size="md">
        <kb-button size="md">MD tooltip</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const WithArrow: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="Arrow on top" placement="top" show-arrow>
        <kb-button variant="outline">Top</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Arrow on bottom" placement="bottom" show-arrow>
        <kb-button variant="outline">Bottom</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Arrow on left" placement="left" show-arrow>
        <kb-button variant="outline">Left</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Arrow on right" placement="right" show-arrow>
        <kb-button variant="outline">Right</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const NoArrow: S = {
  render: () => html`
    <div class="flex items-center justify-center p-20">
      <kb-tooltip label="No arrow tooltip" .showArrow=${false}>
        <kb-button>No arrow</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const DarkVariant: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="Dark tooltip (default)" variant="dark" placement="top" show-arrow>
        <kb-button variant="outline">Dark</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Dark tooltip" variant="dark" placement="bottom" show-arrow>
        <kb-button variant="outline">Dark bottom</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const LightVariant: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="Light tooltip" variant="light" placement="top" show-arrow>
        <kb-button>Light</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Light tooltip" variant="light" placement="bottom" show-arrow>
        <kb-button>Light bottom</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Light tooltip" variant="light" placement="left" show-arrow>
        <kb-button>Light left</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Light tooltip" variant="light" placement="right" show-arrow>
        <kb-button>Light right</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const Offsets: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="Offset 0" offset="0">
        <kb-button variant="outline" size="xs">Offset 0</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Offset 1" offset="1">
        <kb-button variant="outline" size="xs">Offset 1</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Offset 2 (default)" offset="2">
        <kb-button variant="outline" size="xs">Offset 2</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Offset 3" offset="3">
        <kb-button variant="outline" size="xs">Offset 3</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Offset 4" offset="4">
        <kb-button variant="outline" size="xs">Offset 4</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const OpenDelay: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="No delay" open-delay="0">
        <kb-button variant="outline">0ms delay</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Default delay" open-delay="200">
        <kb-button variant="outline">200ms (default)</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Slow delay" open-delay="800">
        <kb-button variant="outline">800ms delay</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const CloseDelay: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="Instant close" close-delay="0">
        <kb-button variant="outline">0ms close</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Delayed close" close-delay="500">
        <kb-button variant="outline">500ms close delay</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div class="flex items-center justify-center p-20">
      <kb-tooltip label="You won't see this" disabled>
        <kb-button>Tooltip disabled</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const MultilineText: S = {
  render: () => html`
    <div class="flex flex-wrap items-center justify-center gap-8 p-20">
      <kb-tooltip label="This is a longer tooltip that wraps to multiple lines when it exceeds the max width" size="sm">
        <kb-button>Multiline SM</kb-button>
      </kb-tooltip>
      <kb-tooltip label="This is a longer tooltip that wraps to multiple lines when it exceeds the max width constraint" size="md">
        <kb-button>Multiline MD</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const ProgrammaticOpen: S = {
  render: () => html`
    <div class="flex items-center justify-center p-20">
      <kb-tooltip label="Programmatically opened" open show-arrow>
        <kb-button variant="solid">Always visible</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const FocusAccessible: S = {
  render: () => html`
    <div class="flex items-center justify-center gap-4 p-20">
      <p class="text-sm text-slate-500 dark:text-zinc-400">Tab to focus each button:</p>
      <kb-tooltip label="First action" show-arrow>
        <kb-button variant="outline">Action 1</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Second action" show-arrow>
        <kb-button variant="outline">Action 2</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Third action" show-arrow>
        <kb-button variant="outline">Action 3</kb-button>
      </kb-tooltip>
    </div>
  `,
};

export const OnIconButton: S = {
  render: () => html`
    <div class="flex items-center justify-center gap-4 p-20">
      <kb-tooltip label="Edit" show-arrow>
        <kb-icon-button aria-label="Edit" variant="outline">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </kb-icon-button>
      </kb-tooltip>
      <kb-tooltip label="Delete" show-arrow>
        <kb-icon-button aria-label="Delete" variant="outline" color-scheme="red">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </kb-icon-button>
      </kb-tooltip>
      <kb-tooltip label="Settings" show-arrow>
        <kb-icon-button aria-label="Settings" variant="ghost">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </kb-icon-button>
      </kb-tooltip>
    </div>
  `,
};

export const AllVariantsAndPlacements: S = {
  render: () => html`
    <div class="grid grid-cols-4 gap-8 p-20 place-items-center">
      <kb-tooltip label="Dark / Top" variant="dark" placement="top" show-arrow>
        <kb-button variant="outline" size="xs">Dark Top</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Dark / Bottom" variant="dark" placement="bottom" show-arrow>
        <kb-button variant="outline" size="xs">Dark Bottom</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Dark / Left" variant="dark" placement="left" show-arrow>
        <kb-button variant="outline" size="xs">Dark Left</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Dark / Right" variant="dark" placement="right" show-arrow>
        <kb-button variant="outline" size="xs">Dark Right</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Light / Top" variant="light" placement="top" show-arrow>
        <kb-button variant="outline" size="xs">Light Top</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Light / Bottom" variant="light" placement="bottom" show-arrow>
        <kb-button variant="outline" size="xs">Light Bottom</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Light / Left" variant="light" placement="left" show-arrow>
        <kb-button variant="outline" size="xs">Light Left</kb-button>
      </kb-tooltip>
      <kb-tooltip label="Light / Right" variant="light" placement="right" show-arrow>
        <kb-button variant="outline" size="xs">Light Right</kb-button>
      </kb-tooltip>
    </div>
  `,
};
