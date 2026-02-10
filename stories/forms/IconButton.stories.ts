import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/forms/kb-icon-button.js';

export default {
  title: 'Forms/IconButton',
  component: 'kb-icon-button',
  render: (args) =>
    html`<kb-icon-button ${spreadAttrs(args)}><span style="font-size:1.2em;">&#9733;</span></kb-icon-button>`,
  args: { label: 'Star', variant: 'solid', size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Solid: S = {};

export const Outline: S = { args: { variant: 'outline' } };

export const Ghost: S = { args: { variant: 'ghost' } };

export const Small: S = { args: { size: 'sm' } };

export const Large: S = { args: { size: 'lg' } };

export const Disabled: S = { args: { disabled: true } };
