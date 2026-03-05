import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/data-display/kb-kbd.js';

type Args = { size?: string };

export default {
  title: 'Data Display/Kbd',
  component: 'kb-kbd',
  render: (args) => html`<kb-kbd ${spreadAttrs(args)}>Ctrl</kb-kbd>`,
  args: { size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {};

export const Small: S = { args: { size: 'sm' } };

export const Large: S = { args: { size: 'lg' } };

export const Sizes: S = {
  render: () => html`
		<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
			<kb-kbd size="sm">Esc</kb-kbd>
			<kb-kbd size="md">Esc</kb-kbd>
			<kb-kbd size="lg">Esc</kb-kbd>
		</div>
	`,
};

export const ShortcutCombination: S = {
  render: () => html`
		<div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;font-family:monospace;font-size:14px;color:var(--kb-text,#333);">
			<kb-kbd>Ctrl</kb-kbd>
			<span style="color:#888;">+</span>
			<kb-kbd>Shift</kb-kbd>
			<span style="color:#888;">+</span>
			<kb-kbd>P</kb-kbd>
		</div>
	`,
};

export const CommonShortcuts: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:12px;">
			<div style="display:flex;gap:4px;align-items:center;font-family:monospace;font-size:13px;color:var(--kb-text,#666);">
				<span style="min-width:80px;">Save</span>
				<kb-kbd size="sm">Ctrl</kb-kbd><span style="color:#888;">+</span><kb-kbd size="sm">S</kb-kbd>
			</div>
			<div style="display:flex;gap:4px;align-items:center;font-family:monospace;font-size:13px;color:var(--kb-text,#666);">
				<span style="min-width:80px;">Copy</span>
				<kb-kbd size="sm">Ctrl</kb-kbd><span style="color:#888;">+</span><kb-kbd size="sm">C</kb-kbd>
			</div>
			<div style="display:flex;gap:4px;align-items:center;font-family:monospace;font-size:13px;color:var(--kb-text,#666);">
				<span style="min-width:80px;">Paste</span>
				<kb-kbd size="sm">Ctrl</kb-kbd><span style="color:#888;">+</span><kb-kbd size="sm">V</kb-kbd>
			</div>
			<div style="display:flex;gap:4px;align-items:center;font-family:monospace;font-size:13px;color:var(--kb-text,#666);">
				<span style="min-width:80px;">Undo</span>
				<kb-kbd size="sm">Ctrl</kb-kbd><span style="color:#888;">+</span><kb-kbd size="sm">Z</kb-kbd>
			</div>
		</div>
	`,
};

export const KitchenSink: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:16px;">
			<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
				<kb-kbd size="sm">A</kb-kbd>
				<kb-kbd size="md">Tab</kb-kbd>
				<kb-kbd size="lg">Enter</kb-kbd>
			</div>
			<div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;font-family:monospace;font-size:14px;">
				<kb-kbd>Cmd</kb-kbd>
				<span style="color:#888;">+</span>
				<kb-kbd>K</kb-kbd>
			</div>
			<div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;font-family:monospace;font-size:14px;">
				<kb-kbd size="sm">Shift</kb-kbd>
				<span style="color:#888;">+</span>
				<kb-kbd size="sm">Alt</kb-kbd>
				<span style="color:#888;">+</span>
				<kb-kbd size="sm">F</kb-kbd>
			</div>
		</div>
	`,
};
