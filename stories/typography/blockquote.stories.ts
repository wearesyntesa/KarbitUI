import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/typography/kb-blockquote.define.js';

export default {
  title: 'Typography/Blockquote',
  component: 'kb-blockquote',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-blockquote>
      Design is not just what it looks like and feels like. Design is how it works.
      <span slot="cite">Steve Jobs</span>
    </kb-blockquote>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div class="space-y-6">
      ${(['gray', 'blue', 'green', 'red', 'purple', 'orange'] as const).map(
        (scheme) => html`
        <kb-blockquote color-scheme=${scheme}>
          The accent color for this blockquote is ${scheme}.
          <span slot="cite">Design System</span>
        </kb-blockquote>
      `,
      )}
    </div>
  `,
};

export const PlainVariant: S = {
  render: () => html`
    <kb-blockquote variant="plain" color-scheme="blue">
      Simplicity is the ultimate sophistication.
      <span slot="cite">Leonardo da Vinci</span>
    </kb-blockquote>
  `,
};

export const NoCitation: S = {
  render: () => html`
    <kb-blockquote color-scheme="purple">
      The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.
    </kb-blockquote>
  `,
};

export const LongContent: S = {
  render: () => html`
    <kb-blockquote color-scheme="green">
      We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard; because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one we intend to win.
      <span slot="cite">John F. Kennedy, 1962</span>
    </kb-blockquote>
  `,
};

export const Multiple: S = {
  render: () => html`
    <div class="space-y-6">
      <kb-blockquote color-scheme="blue">
        Programs must be written for people to read, and only incidentally for machines to execute.
        <span slot="cite">Abelson & Sussman</span>
      </kb-blockquote>

      <kb-blockquote color-scheme="red">
        Any fool can write code that a computer can understand. Good programmers write code that humans can understand.
        <span slot="cite">Martin Fowler</span>
      </kb-blockquote>

      <kb-blockquote>
        Premature optimization is the root of all evil.
        <span slot="cite">Donald Knuth</span>
      </kb-blockquote>
    </div>
  `,
};
