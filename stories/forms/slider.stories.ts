import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-slider.js';

export default {
  title: 'Forms/Slider',
  component: 'kb-slider',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-slider value="50" min="0" max="100"></kb-slider>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-slider size="xs" value="20" min="0" max="100"></kb-slider>
      <kb-slider size="sm" value="35" min="0" max="100"></kb-slider>
      <kb-slider size="md" value="50" min="0" max="100"></kb-slider>
      <kb-slider size="lg" value="65" min="0" max="100"></kb-slider>
      <kb-slider size="xl" value="80" min="0" max="100"></kb-slider>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-slider value="60" color-scheme="blue"></kb-slider>
      <kb-slider value="60" color-scheme="red"></kb-slider>
      <kb-slider value="60" color-scheme="green"></kb-slider>
      <kb-slider value="60" color-scheme="yellow"></kb-slider>
      <kb-slider value="60" color-scheme="black"></kb-slider>
    </div>
  `,
};

export const WithStep: S = {
  render: () => html`
    <kb-slider value="50" min="0" max="100" step="10"></kb-slider>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-slider value="40" disabled></kb-slider>
  `,
};

export const Range: S = {
  name: 'Custom Range',
  render: () => html`
    <kb-slider value="250" min="100" max="500" step="25" color-scheme="green"></kb-slider>
  `,
};

export const ShowValue: S = {
  name: 'Value Tooltip',
  render: () => html`
    <div class="flex flex-col gap-8">
      <p class="text-sm text-gray-500 dark:text-zinc-400 font-mono">Hover or drag to see the value tooltip above the thumb.</p>
      <kb-slider value="50" show-value></kb-slider>
      <kb-slider value="75" show-value color-scheme="red" size="lg"></kb-slider>
    </div>
  `,
};

export const ShowTicks: S = {
  name: 'Tick Marks',
  render: () => html`
    <div class="flex flex-col gap-10">
      <kb-slider value="50" min="0" max="100" step="10" show-ticks></kb-slider>
      <kb-slider value="30" min="0" max="100" step="20" show-ticks color-scheme="green"></kb-slider>
      <kb-slider value="60" min="0" max="100" step="25" show-ticks size="lg"></kb-slider>
    </div>
  `,
};

export const ShowRange: S = {
  name: 'Range Labels',
  render: () => html`
    <div class="flex flex-col gap-8">
      <kb-slider value="50" min="0" max="100" show-range></kb-slider>
      <kb-slider value="250" min="100" max="500" step="25" show-range color-scheme="blue"></kb-slider>
    </div>
  `,
};

export const Readonly: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <p class="text-sm text-gray-500 dark:text-zinc-400 font-mono">Readonly sliders are focusable but cannot be changed.</p>
      <kb-slider value="65" readonly show-value show-range></kb-slider>
    </div>
  `,
};

export const AllFeatures: S = {
  name: 'All Features Combined',
  render: () => html`
    <div class="flex flex-col gap-10">
      <kb-slider
        value="50"
        min="0"
        max="100"
        step="10"
        show-value
        show-ticks
        show-range
        color-scheme="blue"
      ></kb-slider>
      <kb-slider
        value="300"
        min="0"
        max="1000"
        step="100"
        show-value
        show-ticks
        show-range
        color-scheme="green"
        size="lg"
      ></kb-slider>
    </div>
  `,
};

export const CustomFormatter: S = {
  name: 'Custom Value Formatter',
  render: () => {
    const temperatureFormatter = (v: number): string => `${v}°C`;
    const currencyFormatter = (v: number): string => `$${v.toLocaleString()}`;

    return html`
      <div class="flex flex-col gap-10">
        <div>
          <p class="text-sm text-gray-500 dark:text-zinc-400 font-mono mb-3">Temperature (°C)</p>
          <kb-slider
            value="22"
            min="10"
            max="40"
            step="1"
            show-value
            show-range
            color-scheme="red"
            .formatValue=${temperatureFormatter}
          ></kb-slider>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-zinc-400 font-mono mb-3">Price ($)</p>
          <kb-slider
            value="500"
            min="0"
            max="2000"
            step="100"
            show-value
            show-ticks
            show-range
            color-scheme="green"
            size="lg"
            .formatValue=${currencyFormatter}
          ></kb-slider>
        </div>
      </div>
    `;
  },
};

export const SizesWithFeatures: S = {
  name: 'Sizes with Value & Ticks',
  render: () => html`
    <div class="flex flex-col gap-10">
      <kb-slider size="xs" value="30" step="10" show-value show-ticks show-range></kb-slider>
      <kb-slider size="sm" value="40" step="10" show-value show-ticks show-range></kb-slider>
      <kb-slider size="md" value="50" step="10" show-value show-ticks show-range></kb-slider>
      <kb-slider size="lg" value="60" step="10" show-value show-ticks show-range></kb-slider>
      <kb-slider size="xl" value="70" step="10" show-value show-ticks show-range></kb-slider>
    </div>
  `,
};
