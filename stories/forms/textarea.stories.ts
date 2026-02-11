import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-textarea.js';

const loremShort = 'The quick brown fox jumps over the lazy dog.';
const loremLong =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow.';
const lorem280 =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow. Waltz, nymph, for quick jigs vex Bud. Glib jocks quiz nymph to vex dwarf.';

export default {
  title: 'Forms/Textarea',
  component: 'kb-textarea',
  args: { placeholder: 'Write something...', variant: 'outline', size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Outline: S = {
  render: () => html`
    <kb-textarea variant="outline" placeholder="Outline variant" style="max-width:400px"></kb-textarea>
  `,
};

export const Filled: S = {
  render: () => html`
    <kb-textarea variant="filled" placeholder="Filled variant" style="max-width:400px"></kb-textarea>
  `,
};

export const Flushed: S = {
  render: () => html`
    <kb-textarea variant="flushed" placeholder="Flushed variant" style="max-width:400px"></kb-textarea>
  `,
};

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px">
      <kb-textarea variant="outline" placeholder="Outline"></kb-textarea>
      <kb-textarea variant="filled" placeholder="Filled"></kb-textarea>
      <kb-textarea variant="flushed" placeholder="Flushed"></kb-textarea>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
      <kb-textarea size="xs" placeholder="Extra Small (xs)" rows="2"></kb-textarea>
      <kb-textarea size="sm" placeholder="Small (sm)" rows="2"></kb-textarea>
      <kb-textarea size="md" placeholder="Medium (md)" rows="2"></kb-textarea>
      <kb-textarea size="lg" placeholder="Large (lg)" rows="2"></kb-textarea>
      <kb-textarea size="xl" placeholder="Extra Large (xl)" rows="2"></kb-textarea>
    </div>
  `,
};

export const WithValue: S = {
  render: () => html`
    <kb-textarea value=${loremShort} style="max-width:400px"></kb-textarea>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
      <kb-textarea disabled placeholder="Disabled empty"></kb-textarea>
      <kb-textarea disabled value=${loremShort}></kb-textarea>
    </div>
  `,
};

export const Invalid: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
      <kb-textarea invalid variant="outline" placeholder="Invalid outline"></kb-textarea>
      <kb-textarea invalid variant="filled" placeholder="Invalid filled"></kb-textarea>
      <kb-textarea invalid variant="flushed" placeholder="Invalid flushed"></kb-textarea>
    </div>
  `,
};

export const Readonly: S = {
  render: () => html`
    <kb-textarea readonly value=${loremLong} style="max-width:400px"></kb-textarea>
  `,
};

export const AutoResize: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
      <kb-textarea auto-resize placeholder="Start typing — I'll grow as you write..." rows="2"></kb-textarea>
      <kb-textarea auto-resize variant="filled" placeholder="Auto-resize filled variant" rows="2"></kb-textarea>
      <kb-textarea auto-resize variant="flushed" placeholder="Auto-resize flushed variant" rows="2"></kb-textarea>
    </div>
  `,
};

export const Clearable: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
      <kb-textarea clearable value=${loremShort} placeholder="Clearable with value"></kb-textarea>
      <kb-textarea clearable placeholder="Clearable — type something then clear"></kb-textarea>
    </div>
  `,
};

export const Loading: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
      <kb-textarea loading placeholder="Loading..."></kb-textarea>
      <kb-textarea loading value=${loremShort}></kb-textarea>
    </div>
  `,
};

export const MaxLength: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
      <kb-textarea max-length="300" placeholder="Type up to 300 characters..."></kb-textarea>
      <kb-textarea max-length="100" value=${loremShort} placeholder="100 char limit"></kb-textarea>
    </div>
  `,
};

export const MaxLengthNearLimit: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px">
      <kb-textarea max-length="300" value=${lorem280} placeholder="Near limit (yellow)"></kb-textarea>
      <kb-textarea max-length="50" value=${loremShort} placeholder="At limit (red)"></kb-textarea>
    </div>
  `,
};

export const ResizeModes: S = {
  render: () => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:640px">
      <kb-textarea resize="vertical" placeholder="resize: vertical (default)" rows="3"></kb-textarea>
      <kb-textarea resize="horizontal" placeholder="resize: horizontal" rows="3"></kb-textarea>
      <kb-textarea resize="both" placeholder="resize: both" rows="3"></kb-textarea>
      <kb-textarea resize="none" placeholder="resize: none" rows="3"></kb-textarea>
    </div>
  `,
};

export const AutoResizeWithMaxLength: S = {
  render: () => html`
    <kb-textarea
      auto-resize
      max-length="200"
      placeholder="Auto-resize + character counter — type to see both in action..."
      rows="2"
      style="max-width:400px"
    ></kb-textarea>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:700px">
      <kb-textarea variant="outline" placeholder="Outline"></kb-textarea>
      <kb-textarea variant="filled" placeholder="Filled"></kb-textarea>
      <kb-textarea variant="flushed" placeholder="Flushed"></kb-textarea>
      <kb-textarea clearable value=${loremShort} placeholder="Clearable"></kb-textarea>
      <kb-textarea invalid placeholder="Invalid"></kb-textarea>
      <kb-textarea disabled placeholder="Disabled"></kb-textarea>
      <kb-textarea loading placeholder="Loading..."></kb-textarea>
      <kb-textarea auto-resize placeholder="Auto-resize — type to grow..." rows="2"></kb-textarea>
      <kb-textarea max-length="150" value=${loremShort} placeholder="Max length"></kb-textarea>
      <kb-textarea auto-resize clearable max-length="200" placeholder="All features combined" rows="2"></kb-textarea>
    </div>
  `,
};
