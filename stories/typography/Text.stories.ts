import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/typography/kb-text.js';

export default {
  title: 'Typography/Text',
  component: 'kb-text',
  render: (args) => html`<kb-text ${spreadAttrs(args)}>The quick brown fox jumps over the lazy dog.</kb-text>`,
} satisfies Meta;

type S = StoryObj;

export const Default: S = {};

export const ExtraSmall: S = { args: { size: 'xs' } };

export const Small: S = { args: { size: 'sm' } };

export const Large: S = { args: { size: 'lg' } };

export const ExtraLarge: S = { args: { size: 'xl' } };

export const DoubleXL: S = { args: { size: '2xl' } };

export const Truncated: S = {
  args: { truncate: true, maxW: 'xs' },
  render: (args) =>
    html`<kb-text ${spreadAttrs(args)}>This is a very long text that will be truncated when it overflows the container.</kb-text>`,
};
