import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/forms/kb-icon-button.js';

const starIcon = html`<span style="font-size:1.2em;">&#9733;</span>`;
const closeIcon = html`<span style="font-size:1.4em;">&times;</span>`;
const plusIcon = html`<span style="font-size:1.4em;">+</span>`;

type Args = { label?: string; variant?: string; size?: string; disabled?: boolean; loading?: boolean };

export default {
  title: 'Forms/IconButton',
  component: 'kb-icon-button',
  render: (args) => html`<kb-icon-button ${spreadAttrs(args)}>${starIcon}</kb-icon-button>`,
  args: { label: 'Star', variant: 'solid', size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Solid: S = {};

export const Outline: S = { args: { variant: 'outline' } };

export const Ghost: S = { args: { variant: 'ghost' } };

export const Small: S = { args: { size: 'sm' } };

export const Large: S = { args: { size: 'lg' } };

export const Disabled: S = { args: { disabled: true } };

export const Loading: S = { args: { loading: true } };

export const LoadingOutline: S = { args: { variant: 'outline', loading: true } };

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <kb-icon-button label="Default" variant="solid">${starIcon}</kb-icon-button>
      <kb-icon-button label="Black" variant="solid" color-scheme="black">${starIcon}</kb-icon-button>
      <kb-icon-button label="Red" variant="solid" color-scheme="red">${closeIcon}</kb-icon-button>
      <kb-icon-button label="Green" variant="solid" color-scheme="green">${plusIcon}</kb-icon-button>
      <kb-icon-button label="Yellow" variant="solid" color-scheme="yellow">${starIcon}</kb-icon-button>
    </div>
  `,
};

export const ColorSchemesOutline: S = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <kb-icon-button label="Default" variant="outline">${starIcon}</kb-icon-button>
      <kb-icon-button label="Black" variant="outline" color-scheme="black">${starIcon}</kb-icon-button>
      <kb-icon-button label="Red" variant="outline" color-scheme="red">${closeIcon}</kb-icon-button>
      <kb-icon-button label="Green" variant="outline" color-scheme="green">${plusIcon}</kb-icon-button>
      <kb-icon-button label="Yellow" variant="outline" color-scheme="yellow">${starIcon}</kb-icon-button>
    </div>
  `,
};

export const ColorSchemesGhost: S = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <kb-icon-button label="Default" variant="ghost">${starIcon}</kb-icon-button>
      <kb-icon-button label="Black" variant="ghost" color-scheme="black">${starIcon}</kb-icon-button>
      <kb-icon-button label="Red" variant="ghost" color-scheme="red">${closeIcon}</kb-icon-button>
      <kb-icon-button label="Green" variant="ghost" color-scheme="green">${plusIcon}</kb-icon-button>
      <kb-icon-button label="Yellow" variant="ghost" color-scheme="yellow">${starIcon}</kb-icon-button>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <kb-icon-button label="XS" size="xs">${starIcon}</kb-icon-button>
      <kb-icon-button label="SM" size="sm">${starIcon}</kb-icon-button>
      <kb-icon-button label="MD" size="md">${starIcon}</kb-icon-button>
      <kb-icon-button label="LG" size="lg">${starIcon}</kb-icon-button>
      <kb-icon-button label="XL" size="xl">${starIcon}</kb-icon-button>
    </div>
  `,
};

export const LoadingSizes: S = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <kb-icon-button label="XS" size="xs" loading>${starIcon}</kb-icon-button>
      <kb-icon-button label="SM" size="sm" loading>${starIcon}</kb-icon-button>
      <kb-icon-button label="MD" size="md" loading>${starIcon}</kb-icon-button>
      <kb-icon-button label="LG" size="lg" loading>${starIcon}</kb-icon-button>
      <kb-icon-button label="XL" size="xl" loading>${starIcon}</kb-icon-button>
    </div>
  `,
};
