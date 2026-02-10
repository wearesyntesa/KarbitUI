import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/typography/kb-heading.js';

export default {
  title: 'Typography/Heading',
  component: 'kb-heading',
  render: (args) => html`<kb-heading ${spreadAttrs(args)}>Section heading</kb-heading>`,
} satisfies Meta;

type S = StoryObj;

export const H1: S = { args: { level: '1' } };

export const H2: S = { args: { level: '2' } };

export const H3: S = { args: { level: '3' } };

export const H4: S = { args: { level: '4' } };

export const H5: S = { args: { level: '5' } };

export const H6: S = { args: { level: '6' } };

export const CustomSize: S = { args: { level: '2', size: '4xl' } };

export const AllLevels: S = {
  render: () => html`
    <kb-heading level="1">Heading Level 1</kb-heading>
    <kb-heading level="2">Heading Level 2</kb-heading>
    <kb-heading level="3">Heading Level 3</kb-heading>
    <kb-heading level="4">Heading Level 4</kb-heading>
    <kb-heading level="5">Heading Level 5</kb-heading>
    <kb-heading level="6">Heading Level 6</kb-heading>
  `,
};
