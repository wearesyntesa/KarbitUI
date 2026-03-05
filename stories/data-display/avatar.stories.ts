import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/data-display/kb-avatar.js';
import '../../src/components/data-display/kb-avatar-group.js';

type Args = { src?: string; name?: string; size?: string; 'color-scheme'?: string; badge?: string };

export default {
  title: 'Data Display/Avatar',
  component: 'kb-avatar',
  render: (args) => html`<kb-avatar ${spreadAttrs(args)}></kb-avatar>`,
  args: { name: 'Jane Doe', size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const WithName: S = {};

export const WithImage: S = {
  args: { src: 'https://i.pravatar.cc/150?u=avatar-story', name: 'Alex Rivera' },
};

export const FallbackIcon: S = {
  args: { name: undefined },
};

export const Sizes: S = {
  render: () => html`
		<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
			<kb-avatar name="XS" size="xs"></kb-avatar>
			<kb-avatar name="SM" size="sm"></kb-avatar>
			<kb-avatar name="MD" size="md"></kb-avatar>
			<kb-avatar name="LG" size="lg"></kb-avatar>
			<kb-avatar name="XL" size="xl"></kb-avatar>
		</div>
	`,
};

export const ColorSchemes: S = {
  render: () => html`
		<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
			<kb-avatar name="Red User" color-scheme="red"></kb-avatar>
			<kb-avatar name="Blue User" color-scheme="blue"></kb-avatar>
			<kb-avatar name="Green User" color-scheme="green"></kb-avatar>
			<kb-avatar name="Yellow User" color-scheme="yellow"></kb-avatar>
			<kb-avatar name="Black User" color-scheme="black"></kb-avatar>
		</div>
	`,
};

export const WithBadge: S = {
  render: () => html`
		<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
			<kb-avatar name="Online" badge="green" size="lg"></kb-avatar>
			<kb-avatar name="Away" badge="yellow" size="lg"></kb-avatar>
			<kb-avatar name="Busy" badge="red" size="lg"></kb-avatar>
		</div>
	`,
};

export const Group: S = {
  render: () => html`
		<kb-avatar-group max="3" size="md">
			<kb-avatar name="Alice Anderson"></kb-avatar>
			<kb-avatar name="Bob Brown"></kb-avatar>
			<kb-avatar name="Carol Chen"></kb-avatar>
			<kb-avatar name="Dave Davis"></kb-avatar>
			<kb-avatar name="Eve Evans"></kb-avatar>
		</kb-avatar-group>
	`,
};

export const GroupSizes: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:16px;">
			<kb-avatar-group max="4" size="sm" spacing="sm">
				<kb-avatar name="AA"></kb-avatar>
				<kb-avatar name="BB"></kb-avatar>
				<kb-avatar name="CC"></kb-avatar>
				<kb-avatar name="DD"></kb-avatar>
				<kb-avatar name="EE"></kb-avatar>
			</kb-avatar-group>
			<kb-avatar-group max="4" size="lg" spacing="lg">
				<kb-avatar name="AA"></kb-avatar>
				<kb-avatar name="BB"></kb-avatar>
				<kb-avatar name="CC"></kb-avatar>
				<kb-avatar name="DD"></kb-avatar>
				<kb-avatar name="EE"></kb-avatar>
			</kb-avatar-group>
		</div>
	`,
};

export const KitchenSink: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:20px;">
			<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
				<kb-avatar src="https://i.pravatar.cc/150?u=ks1" name="Photo User" size="lg" badge="green"></kb-avatar>
				<kb-avatar name="Initials Only" size="lg" color-scheme="blue"></kb-avatar>
				<kb-avatar size="lg"></kb-avatar>
			</div>
			<kb-avatar-group max="3" size="md">
				<kb-avatar name="Alpha" color-scheme="red"></kb-avatar>
				<kb-avatar name="Beta" color-scheme="blue"></kb-avatar>
				<kb-avatar name="Gamma" color-scheme="green"></kb-avatar>
				<kb-avatar name="Delta" color-scheme="yellow"></kb-avatar>
			</kb-avatar-group>
		</div>
	`,
};
