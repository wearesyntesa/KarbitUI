import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/forms/kb-button.js';
import '../../src/components/forms/kb-button-group.js';

export default {
  title: 'Forms/Button',
  component: 'kb-button',
  render: (args) => html`<kb-button ${spreadAttrs(args)}>CLICK ME</kb-button>`,
  args: { variant: 'solid', size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Solid: S = {};

export const Outline: S = { args: { variant: 'outline' } };

export const Ghost: S = { args: { variant: 'ghost' } };

export const Link: S = { args: { variant: 'link' } };

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;gap:8px;align-items:center;">
      <kb-button size="xs">XS</kb-button>
      <kb-button size="sm">SM</kb-button>
      <kb-button size="md">MD</kb-button>
      <kb-button size="lg">LG</kb-button>
      <kb-button size="xl">XL</kb-button>
    </div>
  `,
};

export const ColorSchemesSolid: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <kb-button color-scheme="black">BLACK</kb-button>
      <kb-button color-scheme="red">RED</kb-button>
      <kb-button color-scheme="blue">BLUE</kb-button>
      <kb-button color-scheme="green">GREEN</kb-button>
      <kb-button color-scheme="yellow">YELLOW</kb-button>
    </div>
  `,
};

export const ColorSchemesOutline: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <kb-button variant="outline" color-scheme="black">BLACK</kb-button>
      <kb-button variant="outline" color-scheme="red">RED</kb-button>
      <kb-button variant="outline" color-scheme="blue">BLUE</kb-button>
      <kb-button variant="outline" color-scheme="green">GREEN</kb-button>
      <kb-button variant="outline" color-scheme="yellow">YELLOW</kb-button>
    </div>
  `,
};

export const ColorSchemesGhost: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <kb-button variant="ghost" color-scheme="black">BLACK</kb-button>
      <kb-button variant="ghost" color-scheme="red">RED</kb-button>
      <kb-button variant="ghost" color-scheme="blue">BLUE</kb-button>
      <kb-button variant="ghost" color-scheme="green">GREEN</kb-button>
      <kb-button variant="ghost" color-scheme="yellow">YELLOW</kb-button>
    </div>
  `,
};

export const ColorSchemesLink: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <kb-button variant="link" color-scheme="black">BLACK</kb-button>
      <kb-button variant="link" color-scheme="red">RED</kb-button>
      <kb-button variant="link" color-scheme="blue">BLUE</kb-button>
      <kb-button variant="link" color-scheme="green">GREEN</kb-button>
      <kb-button variant="link" color-scheme="yellow">YELLOW</kb-button>
    </div>
  `,
};

export const WithIcons: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-button>
        <svg slot="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        ADD ITEM
      </kb-button>
      <kb-button variant="outline" color-scheme="red">
        DELETE
        <svg slot="icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
      </kb-button>
      <kb-button variant="ghost">
        <svg slot="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="8"/></svg>
        SEARCH
      </kb-button>
      <kb-button size="lg" color-scheme="green">
        <svg slot="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>
        CONFIRM
        <svg slot="icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m9 18 6-6-6-6"/></svg>
      </kb-button>
    </div>
  `,
};

export const Loading: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <kb-button loading>SAVE</kb-button>
      <kb-button loading loading-text="Saving...">SAVE</kb-button>
      <kb-button variant="outline" loading loading-text="Processing...">SUBMIT</kb-button>
      <kb-button size="lg" color-scheme="green" loading loading-text="Deploying...">DEPLOY</kb-button>
      <kb-button size="xs" loading>TINY</kb-button>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <kb-button disabled>SOLID</kb-button>
      <kb-button variant="outline" disabled>OUTLINE</kb-button>
      <kb-button variant="ghost" disabled>GHOST</kb-button>
      <kb-button variant="link" disabled>LINK</kb-button>
    </div>
  `,
};

export const FullWidth: S = {
  render: () => html`
    <div style="max-width:400px;display:flex;flex-direction:column;gap:8px;">
      <kb-button full-width>FULL WIDTH SOLID</kb-button>
      <kb-button full-width variant="outline">FULL WIDTH OUTLINE</kb-button>
      <kb-button full-width variant="ghost" color-scheme="red">FULL WIDTH GHOST</kb-button>
    </div>
  `,
};

export const ButtonGroupAttached: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <kb-button-group>
        <kb-button variant="outline">LEFT</kb-button>
        <kb-button variant="outline">CENTER</kb-button>
        <kb-button variant="outline">RIGHT</kb-button>
      </kb-button-group>
      <kb-button-group>
        <kb-button>PRIMARY</kb-button>
        <kb-button variant="outline">SECONDARY</kb-button>
      </kb-button-group>
      <kb-button-group>
        <kb-button variant="outline" color-scheme="blue">EDIT</kb-button>
        <kb-button variant="outline" color-scheme="green">SAVE</kb-button>
        <kb-button variant="outline" color-scheme="red">DELETE</kb-button>
      </kb-button-group>
    </div>
  `,
};

export const ButtonGroupVertical: S = {
  render: () => html`
    <kb-button-group direction="vertical">
      <kb-button variant="outline">TOP</kb-button>
      <kb-button variant="outline">MIDDLE</kb-button>
      <kb-button variant="outline">BOTTOM</kb-button>
    </kb-button-group>
  `,
};

export const ButtonGroupSpaced: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <kb-button-group spaced>
        <kb-button>SAVE</kb-button>
        <kb-button variant="outline">CANCEL</kb-button>
      </kb-button-group>
      <kb-button-group spaced>
        <kb-button color-scheme="red">DELETE</kb-button>
        <kb-button variant="ghost">CANCEL</kb-button>
      </kb-button-group>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;max-width:500px;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <kb-button size="sm">SOLID SM</kb-button>
        <kb-button variant="outline" size="sm">OUTLINE SM</kb-button>
        <kb-button variant="ghost" size="sm">GHOST SM</kb-button>
        <kb-button variant="link" size="sm">LINK SM</kb-button>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <kb-button color-scheme="green">
          <svg slot="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>
          APPROVE
        </kb-button>
        <kb-button variant="outline" color-scheme="red">
          <svg slot="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          REJECT
        </kb-button>
        <kb-button variant="ghost" color-scheme="blue">
          <svg slot="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          INFO
        </kb-button>
      </div>

      <div style="display:flex;gap:8px;align-items:center;">
        <kb-button loading loading-text="Saving...">SAVE</kb-button>
        <kb-button disabled>DISABLED</kb-button>
      </div>

      <kb-button full-width color-scheme="black">FULL WIDTH ACTION</kb-button>

      <kb-button-group>
        <kb-button variant="outline">PREV</kb-button>
        <kb-button variant="outline">1</kb-button>
        <kb-button variant="outline">2</kb-button>
        <kb-button variant="outline">3</kb-button>
        <kb-button variant="outline">NEXT</kb-button>
      </kb-button-group>
    </div>
  `,
};
