import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-divider.js';

export default {
  title: 'Layout/Divider',
  component: 'kb-divider',
  render: (args) => html`<kb-divider ${spreadAttrs(args)}></kb-divider>`,
} satisfies Meta;

type S = StoryObj;

export const Horizontal: S = {};

export const Vertical: S = {
  render: () => html`
    <div style="display:flex;height:80px;align-items:stretch;gap:16px;">
      <span>Left</span>
      <kb-divider orientation="vertical"></kb-divider>
      <span>Right</span>
    </div>
  `,
};

export const Colored: S = { args: { dividerColor: 'red-500' } };
