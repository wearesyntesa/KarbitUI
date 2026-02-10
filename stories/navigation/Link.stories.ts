import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/navigation/kb-link.js';

const arrowSvg = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const mailSvg = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect width="20" height="16" x="2" y="4"/><path d="m22 4-10 8L2 4"/></svg>`;
const docSvg = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>`;
const homeSvg = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const settingsSvg = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;

export default {
  title: 'Navigation/Link',
  component: 'kb-link',
} satisfies Meta;

type S = StoryObj;

export const Underline: S = {
  render: () => html`
    <kb-link href="#" variant="underline">Underline link</kb-link>
  `,
};

export const HoverUnderline: S = {
  render: () => html`
    <kb-link href="#" variant="hover-underline">Hover to reveal underline</kb-link>
  `,
};

export const Plain: S = {
  render: () => html`
    <kb-link href="#" variant="plain">Plain link</kb-link>
  `,
};

export const Subtle: S = {
  render: () => html`
    <kb-link href="#" variant="subtle">Subtle bottom border</kb-link>
  `,
};

export const Highlight: S = {
  render: () => html`
    <kb-link href="#" variant="highlight">Highlight on hover</kb-link>
  `,
};

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-link href="#" variant="underline">Underline</kb-link>
      <kb-link href="#" variant="hover-underline">Hover Underline</kb-link>
      <kb-link href="#" variant="plain">Plain</kb-link>
      <kb-link href="#" variant="subtle">Subtle</kb-link>
      <kb-link href="#" variant="highlight">Highlight</kb-link>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-link href="#" size="xs">Extra Small (xs)</kb-link>
      <kb-link href="#" size="sm">Small (sm)</kb-link>
      <kb-link href="#" size="md">Medium (md)</kb-link>
      <kb-link href="#" size="lg">Large (lg)</kb-link>
      <kb-link href="#" size="xl">Extra Large (xl)</kb-link>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:16px;align-items:center">
        <kb-link href="#" color-scheme="blue">Blue</kb-link>
        <kb-link href="#" color-scheme="red">Red</kb-link>
        <kb-link href="#" color-scheme="green">Green</kb-link>
        <kb-link href="#" color-scheme="yellow">Yellow</kb-link>
        <kb-link href="#" color-scheme="black">Black</kb-link>
      </div>
      <div style="display:flex;gap:16px;align-items:center">
        <kb-link href="#" variant="hover-underline" color-scheme="blue">Blue</kb-link>
        <kb-link href="#" variant="hover-underline" color-scheme="red">Red</kb-link>
        <kb-link href="#" variant="hover-underline" color-scheme="green">Green</kb-link>
        <kb-link href="#" variant="hover-underline" color-scheme="yellow">Yellow</kb-link>
        <kb-link href="#" variant="hover-underline" color-scheme="black">Black</kb-link>
      </div>
      <div style="display:flex;gap:16px;align-items:center">
        <kb-link href="#" variant="highlight" color-scheme="blue">Blue</kb-link>
        <kb-link href="#" variant="highlight" color-scheme="red">Red</kb-link>
        <kb-link href="#" variant="highlight" color-scheme="green">Green</kb-link>
        <kb-link href="#" variant="highlight" color-scheme="yellow">Yellow</kb-link>
        <kb-link href="#" variant="highlight" color-scheme="black">Black</kb-link>
      </div>
    </div>
  `,
};

export const External: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-link href="https://example.com" external>External link</kb-link>
      <kb-link href="https://example.com" external variant="hover-underline">External hover-underline</kb-link>
      <kb-link href="https://example.com" external variant="highlight">External highlight</kb-link>
      <kb-link href="https://example.com" external size="lg">External large</kb-link>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div style="display:flex;gap:16px">
      <kb-link href="#" disabled>Disabled underline</kb-link>
      <kb-link href="#" disabled variant="hover-underline">Disabled hover</kb-link>
      <kb-link href="#" disabled variant="highlight">Disabled highlight</kb-link>
    </div>
  `,
};

export const WithIconLeft: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-link href="#"><span slot="icon-left">${homeSvg}</span>Home</kb-link>
      <kb-link href="#" variant="hover-underline"><span slot="icon-left">${docSvg}</span>Documentation</kb-link>
      <kb-link href="#" variant="highlight"><span slot="icon-left">${settingsSvg}</span>Settings</kb-link>
      <kb-link href="#" variant="subtle"><span slot="icon-left">${mailSvg}</span>Contact</kb-link>
    </div>
  `,
};

export const WithIconRight: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-link href="#"><span slot="icon-right">${arrowSvg}</span>Read more</kb-link>
      <kb-link href="#" variant="hover-underline"><span slot="icon-right">${arrowSvg}</span>Continue</kb-link>
      <kb-link href="#" variant="highlight"><span slot="icon-right">${arrowSvg}</span>Next page</kb-link>
    </div>
  `,
};

export const WithBothIcons: S = {
  render: () => html`
    <kb-link href="#" size="lg" variant="hover-underline">
      <span slot="icon-left">${docSvg}</span>
      View Documentation
      <span slot="icon-right">${arrowSvg}</span>
    </kb-link>
  `,
};

export const IconSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => html`
        <kb-link href="#" size=${size}><span slot="icon-left">${homeSvg}</span>${size} with icon</kb-link>
      `)}
    </div>
  `,
};

export const Visited: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <kb-link href="#" show-visited>This link shows visited color</kb-link>
      <kb-link href="#" show-visited color-scheme="red">Red visited</kb-link>
      <kb-link href="#" show-visited color-scheme="green">Green visited</kb-link>
    </div>
  `,
};

export const Truncated: S = {
  render: () => html`
    <div style="max-width:200px">
      <kb-link href="#" truncate>This is a very long link text that should be truncated with an ellipsis</kb-link>
    </div>
  `,
};

export const InlineText: S = {
  render: () => html`
    <p class="text-sm text-slate-600 dark:text-zinc-400 max-w-md" style="line-height:1.8">
      You can use links inline within text. For example, visit the
      <kb-link href="#" variant="underline">documentation page</kb-link>
      for more details, or check out the
      <kb-link href="#" variant="hover-underline" color-scheme="green">release notes</kb-link>
      to see what's new. External resources are available at
      <kb-link href="https://example.com" external>example.com</kb-link>.
    </p>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <kb-link href="#" variant="underline">Underline</kb-link>
        <kb-link href="#" variant="hover-underline">Hover Underline</kb-link>
        <kb-link href="#" variant="plain">Plain</kb-link>
        <kb-link href="#" variant="subtle">Subtle</kb-link>
        <kb-link href="#" variant="highlight">Highlight</kb-link>
      </div>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <kb-link href="#" color-scheme="red"><span slot="icon-left">${mailSvg}</span>Contact</kb-link>
        <kb-link href="#" variant="hover-underline" color-scheme="green"><span slot="icon-right">${arrowSvg}</span>Continue</kb-link>
        <kb-link href="https://example.com" external variant="highlight">External</kb-link>
        <kb-link href="#" disabled>Disabled</kb-link>
      </div>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <kb-link href="#" size="xs">Extra Small</kb-link>
        <kb-link href="#" size="sm">Small</kb-link>
        <kb-link href="#" size="md">Medium</kb-link>
        <kb-link href="#" size="lg">Large</kb-link>
        <kb-link href="#" size="xl">Extra Large</kb-link>
      </div>
    </div>
  `,
};
