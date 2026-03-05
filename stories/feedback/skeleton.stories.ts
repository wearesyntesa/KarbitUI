import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/feedback/kb-skeleton.js';

type Args = { variant?: string; size?: string; width?: string; height?: string; circle?: boolean; lines?: number };

export default {
  title: 'Feedback/Skeleton',
  component: 'kb-skeleton',
  render: (args) => html`<kb-skeleton ${spreadAttrs(args)}></kb-skeleton>`,
  args: { variant: 'pulse', size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {};

export const CustomSize: S = {
  args: { width: '200px', height: '24px' },
};

export const Circle: S = {
  args: { circle: true, height: '48px' },
};

export const MultiLine: S = {
  args: { lines: 3 },
};

export const NoAnimation: S = {
  args: { variant: 'none' },
};

export const Sizes: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:8px;max-width:400px;">
			<kb-skeleton size="xs"></kb-skeleton>
			<kb-skeleton size="sm"></kb-skeleton>
			<kb-skeleton size="md"></kb-skeleton>
			<kb-skeleton size="lg"></kb-skeleton>
			<kb-skeleton size="xl"></kb-skeleton>
		</div>
	`,
};

export const ContentPlaceholder: S = {
  render: () => html`
		<div style="display:flex;gap:12px;align-items:flex-start;max-width:400px;">
			<kb-skeleton circle height="48px"></kb-skeleton>
			<div style="flex:1;display:flex;flex-direction:column;gap:8px;">
				<kb-skeleton width="60%" height="16px"></kb-skeleton>
				<kb-skeleton lines="2" size="sm"></kb-skeleton>
			</div>
		</div>
	`,
};

export const KitchenSink: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:20px;max-width:400px;">
			<div style="display:flex;gap:12px;align-items:center;">
				<kb-skeleton circle height="40px"></kb-skeleton>
				<div style="flex:1;display:flex;flex-direction:column;gap:6px;">
					<kb-skeleton width="50%" height="14px"></kb-skeleton>
					<kb-skeleton width="80%" height="12px"></kb-skeleton>
				</div>
			</div>
			<kb-skeleton height="200px"></kb-skeleton>
			<kb-skeleton lines="4" size="sm"></kb-skeleton>
			<div style="display:flex;gap:8px;">
				<kb-skeleton width="80px" height="32px"></kb-skeleton>
				<kb-skeleton width="80px" height="32px"></kb-skeleton>
			</div>
		</div>
	`,
};
