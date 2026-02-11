import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/navigation/kb-breadcrumb.js';

const basicItems = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Categories', href: '#' },
  { label: 'Electronics' },
];

const shortItems = [{ label: 'Home', href: '#' }, { label: 'Current Page' }];

const longItems = [
  { label: 'Home', href: '#' },
  { label: 'Organization', href: '#' },
  { label: 'Department', href: '#' },
  { label: 'Team', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Repository', href: '#' },
  { label: 'Branch', href: '#' },
  { label: 'File' },
];

export default {
  title: 'Navigation/Breadcrumb',
  component: 'kb-breadcrumb',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-breadcrumb .items=${basicItems}></kb-breadcrumb>
  `,
};

export const ChevronSeparator: S = {
  render: () => html`
    <kb-breadcrumb separator="chevron" .items=${basicItems}></kb-breadcrumb>
  `,
};

export const SlashSeparator: S = {
  render: () => html`
    <kb-breadcrumb separator="slash" .items=${basicItems}></kb-breadcrumb>
  `,
};

export const ArrowSeparator: S = {
  render: () => html`
    <kb-breadcrumb separator="arrow" .items=${basicItems}></kb-breadcrumb>
  `,
};

export const DotSeparator: S = {
  render: () => html`
    <kb-breadcrumb separator="dot" .items=${basicItems}></kb-breadcrumb>
  `,
};

export const PipeSeparator: S = {
  render: () => html`
    <kb-breadcrumb separator="pipe" .items=${basicItems}></kb-breadcrumb>
  `,
};

export const AllSeparators: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <kb-breadcrumb separator="chevron" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb separator="slash" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb separator="arrow" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb separator="dot" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb separator="pipe" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb separator="\u2014" .items=${basicItems}></kb-breadcrumb>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <kb-breadcrumb size="xs" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb size="sm" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb size="md" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb size="lg" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb size="xl" .items=${basicItems}></kb-breadcrumb>
    </div>
  `,
};

export const TwoItems: S = {
  render: () => html`
    <kb-breadcrumb .items=${shortItems}></kb-breadcrumb>
  `,
};

export const ManyItems: S = {
  render: () => html`
    <kb-breadcrumb .items=${longItems}></kb-breadcrumb>
  `,
};

export const CollapsedMaxItems: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <kb-breadcrumb max-items="3" .items=${longItems}></kb-breadcrumb>
      <kb-breadcrumb max-items="4" .items=${longItems}></kb-breadcrumb>
      <kb-breadcrumb max-items="1" .items=${longItems}></kb-breadcrumb>
    </div>
  `,
};

export const CollapsedWithArrow: S = {
  render: () => html`
    <kb-breadcrumb separator="arrow" max-items="3" .items=${longItems}></kb-breadcrumb>
  `,
};

export const NoHref: S = {
  render: () => html`
    <kb-breadcrumb .items=${[{ label: 'Dashboard' }, { label: 'Settings' }, { label: 'Profile' }]}></kb-breadcrumb>
  `,
};

export const CustomSeparator: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <kb-breadcrumb separator="::" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb separator="~" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb separator="\u2022" .items=${basicItems}></kb-breadcrumb>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px">
      <kb-breadcrumb size="sm" separator="chevron" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb size="md" separator="arrow" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb size="lg" separator="slash" .items=${basicItems}></kb-breadcrumb>
      <kb-breadcrumb size="md" separator="dot" max-items="3" .items=${longItems}></kb-breadcrumb>
      <kb-breadcrumb size="sm" separator="pipe" .items=${shortItems}></kb-breadcrumb>
    </div>
  `,
};
