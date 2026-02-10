import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/typography/kb-code.js';

export default {
  title: 'Typography/Code',
  component: 'kb-code',
  render: (args) => html`<kb-code ${spreadAttrs(args)}>const x = 42;</kb-code>`,
} satisfies Meta;

type S = StoryObj;

export const Inline: S = {};

export const Block: S = {
  args: { block: true },
  render: (args) => html`
    <kb-code ${spreadAttrs(args)}>function greet(name: string) {
  return \`Hello, \${name}!\`;
}</kb-code>
  `,
};
