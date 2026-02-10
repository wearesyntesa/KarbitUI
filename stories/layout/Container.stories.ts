import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-container.js';

export default {
  title: 'Layout/Container',
  component: 'kb-container',
  render: (args) => html`<kb-container ${spreadAttrs(args)}>Contained content with max-width constraint.</kb-container>`,
  args: { bg: 'gray-100', p: '6' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {};

export const Narrow: S = { args: { max: 'sm' } };

export const Wide: S = { args: { max: '5xl' } };

export const NotCentered: S = { args: { center: false } };
