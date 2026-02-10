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

export const Dashed: S = { args: { variant: 'dashed' } };

export const Dotted: S = { args: { variant: 'dotted' } };

export const ThicknessThin: S = { args: { thickness: 'thin' } };

export const ThicknessMedium: S = { args: { thickness: 'medium' } };

export const ThicknessThick: S = { args: { thickness: 'thick' } };

export const Label: S = { args: { label: 'OR' } };

export const LabelWithVariant: S = { args: { label: 'CONTINUE', variant: 'dashed' } };

export const VerticalLabel: S = {
  render: () => html`
    <div style="display:flex;height:120px;align-items:stretch;gap:16px;">
      <span>Left</span>
      <kb-divider orientation="vertical" label="OR"></kb-divider>
      <span>Right</span>
    </div>
  `,
};

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <div>
        <p class="text-xs font-mono text-slate-500 mb-2">SOLID (default)</p>
        <kb-divider></kb-divider>
      </div>
      <div>
        <p class="text-xs font-mono text-slate-500 mb-2">DASHED</p>
        <kb-divider variant="dashed"></kb-divider>
      </div>
      <div>
        <p class="text-xs font-mono text-slate-500 mb-2">DOTTED</p>
        <kb-divider variant="dotted"></kb-divider>
      </div>
    </div>
  `,
};

export const AllThicknesses: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <div>
        <p class="text-xs font-mono text-slate-500 mb-2">THIN (default)</p>
        <kb-divider thickness="thin"></kb-divider>
      </div>
      <div>
        <p class="text-xs font-mono text-slate-500 mb-2">MEDIUM</p>
        <kb-divider thickness="medium"></kb-divider>
      </div>
      <div>
        <p class="text-xs font-mono text-slate-500 mb-2">THICK</p>
        <kb-divider thickness="thick"></kb-divider>
      </div>
    </div>
  `,
};

export const Animated: S = { args: { animated: true } };

export const AnimatedLabeled: S = { args: { animated: true, label: 'NEW SECTION' } };

export const ComposedExample: S = {
  render: () => html`
    <div style="max-width:400px;display:flex;flex-direction:column;gap:16px;">
      <p class="text-sm">Sign in with your email and password.</p>
      <kb-divider label="OR" variant="dashed"></kb-divider>
      <p class="text-sm">Continue with a social provider.</p>
    </div>
  `,
};
