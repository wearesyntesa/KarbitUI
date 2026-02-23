import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/feedback/kb-badge.js';

type Args = { variant?: string; size?: string };

export default {
  title: 'Feedback/Badge',
  component: 'kb-badge',
  render: (args) => html`<kb-badge ${spreadAttrs(args)}>Badge</kb-badge>`,
  args: { variant: 'subtle', size: 'sm' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Subtle: S = {};

export const Solid: S = { args: { variant: 'solid' } };

export const Outline: S = { args: { variant: 'outline' } };

export const ExtraSmall: S = { args: { size: 'xs' } };

export const Medium: S = { args: { size: 'md' } };

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge variant="solid" color-scheme="black">Black</kb-badge>
      <kb-badge variant="solid" color-scheme="red">Red</kb-badge>
      <kb-badge variant="solid" color-scheme="blue">Blue</kb-badge>
      <kb-badge variant="solid" color-scheme="green">Green</kb-badge>
      <kb-badge variant="solid" color-scheme="yellow">Yellow</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge variant="outline" color-scheme="black">Black</kb-badge>
      <kb-badge variant="outline" color-scheme="red">Red</kb-badge>
      <kb-badge variant="outline" color-scheme="blue">Blue</kb-badge>
      <kb-badge variant="outline" color-scheme="green">Green</kb-badge>
      <kb-badge variant="outline" color-scheme="yellow">Yellow</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge variant="subtle" color-scheme="black">Black</kb-badge>
      <kb-badge variant="subtle" color-scheme="red">Red</kb-badge>
      <kb-badge variant="subtle" color-scheme="blue">Blue</kb-badge>
      <kb-badge variant="subtle" color-scheme="green">Green</kb-badge>
      <kb-badge variant="subtle" color-scheme="yellow">Yellow</kb-badge>
    </div>
  `,
};

export const DotStatus: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge dot color-scheme="green">Online</kb-badge>
      <kb-badge dot color-scheme="yellow">Away</kb-badge>
      <kb-badge dot color-scheme="red">Busy</kb-badge>
      <kb-badge dot color-scheme="black">Offline</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge variant="outline" dot color-scheme="green">Online</kb-badge>
      <kb-badge variant="outline" dot color-scheme="yellow">Away</kb-badge>
      <kb-badge variant="outline" dot color-scheme="red">Busy</kb-badge>
      <kb-badge variant="outline" dot color-scheme="black">Offline</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge variant="solid" dot color-scheme="green">Online</kb-badge>
      <kb-badge variant="solid" dot color-scheme="red">Busy</kb-badge>
    </div>
  `,
};

export const PulseLive: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge dot pulse color-scheme="green">Live</kb-badge>
      <kb-badge dot pulse color-scheme="red">Recording</kb-badge>
      <kb-badge dot pulse color-scheme="blue">Syncing</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge variant="outline" dot pulse color-scheme="green">Live</kb-badge>
      <kb-badge variant="solid" dot pulse color-scheme="red">On Air</kb-badge>
    </div>
  `,
};

export const PingNotification: S = {
  render: () => html`
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
      <kb-badge ping color-scheme="red">3</kb-badge>
      <kb-badge ping color-scheme="blue" variant="solid">New</kb-badge>
      <kb-badge ping color-scheme="green" variant="outline">99+</kb-badge>
      <kb-badge ping>Updates</kb-badge>
    </div>
  `,
};

export const WithIcon: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge variant="subtle" color-scheme="green">
        <span slot="icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg></span>
        Verified
      </kb-badge>
      <kb-badge variant="subtle" color-scheme="yellow">
        <span slot="icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg></span>
        Beta
      </kb-badge>
      <kb-badge variant="subtle" color-scheme="red">
        <span slot="icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></span>
        Deprecated
      </kb-badge>
      <kb-badge variant="solid" color-scheme="blue">
        <span slot="icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg></span>
        Loading
      </kb-badge>
    </div>
  `,
};

export const Interactive: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge interactive color-scheme="blue" @kb-click=${() => console.log('Filter: Active')}>Active</kb-badge>
      <kb-badge interactive color-scheme="green" @kb-click=${() => console.log('Filter: Published')}>Published</kb-badge>
      <kb-badge interactive color-scheme="yellow" @kb-click=${() => console.log('Filter: Draft')}>Draft</kb-badge>
      <kb-badge interactive color-scheme="red" @kb-click=${() => console.log('Filter: Archived')}>Archived</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge interactive variant="outline" color-scheme="blue">Outline</kb-badge>
      <kb-badge interactive variant="solid" color-scheme="blue">Solid</kb-badge>
      <kb-badge interactive variant="subtle" color-scheme="blue">Subtle</kb-badge>
    </div>
  `,
};

export const Closable: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge closable color-scheme="blue">Technology</kb-badge>
      <kb-badge closable color-scheme="green">Design</kb-badge>
      <kb-badge closable color-scheme="red">Urgent</kb-badge>
      <kb-badge closable color-scheme="yellow">Pending</kb-badge>
      <kb-badge closable>Default</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge closable variant="outline" color-scheme="blue">Outline</kb-badge>
      <kb-badge closable variant="solid" color-scheme="red">Solid</kb-badge>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge size="xs" variant="solid" color-scheme="blue">XS</kb-badge>
      <kb-badge size="sm" variant="solid" color-scheme="blue">SM</kb-badge>
      <kb-badge size="md" variant="solid" color-scheme="blue">MD</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge size="xs" dot color-scheme="green">XS Dot</kb-badge>
      <kb-badge size="sm" dot color-scheme="green">SM Dot</kb-badge>
      <kb-badge size="md" dot color-scheme="green">MD Dot</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge size="xs" closable color-scheme="red">XS Close</kb-badge>
      <kb-badge size="sm" closable color-scheme="red">SM Close</kb-badge>
      <kb-badge size="md" closable color-scheme="red">MD Close</kb-badge>
    </div>
  `,
};

export const InteractiveClosable: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge interactive closable color-scheme="blue" @kb-click=${() => console.log('Clicked')}>Filter A</kb-badge>
      <kb-badge interactive closable color-scheme="green" @kb-click=${() => console.log('Clicked')}>Filter B</kb-badge>
      <kb-badge interactive closable color-scheme="red" @kb-click=${() => console.log('Clicked')}>Filter C</kb-badge>
    </div>
  `,
};

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-badge variant="subtle">Subtle</kb-badge>
      <kb-badge variant="outline">Outline</kb-badge>
      <kb-badge variant="solid">Solid</kb-badge>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px;">
      <kb-badge variant="subtle" color-scheme="blue">Subtle</kb-badge>
      <kb-badge variant="outline" color-scheme="blue">Outline</kb-badge>
      <kb-badge variant="solid" color-scheme="blue">Solid</kb-badge>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <kb-badge variant="solid" color-scheme="red" ping>3</kb-badge>
        <kb-badge dot pulse color-scheme="green">Live</kb-badge>
        <kb-badge variant="outline" dot color-scheme="blue">Synced</kb-badge>
        <kb-badge interactive closable color-scheme="blue">
          <span slot="icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg></span>
          Active Filter
        </kb-badge>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <kb-badge variant="subtle" color-scheme="green">
          <span slot="icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg></span>
          Verified
        </kb-badge>
        <kb-badge variant="subtle" color-scheme="yellow">
          <span slot="icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg></span>
          Beta
        </kb-badge>
        <kb-badge closable color-scheme="red">Critical</kb-badge>
        <kb-badge interactive variant="solid" color-scheme="black">PRO</kb-badge>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <kb-badge size="xs" dot color-scheme="green">xs</kb-badge>
        <kb-badge size="sm" dot pulse color-scheme="blue">sm</kb-badge>
        <kb-badge size="md" interactive closable color-scheme="red">md</kb-badge>
      </div>
    </div>
  `,
};
