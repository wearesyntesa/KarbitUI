import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/data-display/kb-stat.js';

type Args = { label?: string; value?: string; 'help-text'?: string; indicator?: string; size?: string };

export default {
  title: 'Data Display/Stat',
  component: 'kb-stat',
  render: (args) => html`<kb-stat ${spreadAttrs(args)}></kb-stat>`,
  args: { label: 'Revenue', value: '$12,450', 'help-text': '+12.5% from last month', indicator: 'increase' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Increase: S = {};

export const Decrease: S = {
  args: { label: 'Churn', value: '3.2%', 'help-text': '-0.5% from last month', indicator: 'decrease' },
};

export const NoIndicator: S = {
  args: { label: 'Total Users', value: '1,024', 'help-text': 'All time', indicator: 'none' },
};

export const Sizes: S = {
  render: () => html`
		<div style="display:flex;gap:32px;flex-wrap:wrap;">
			<kb-stat size="sm" label="Small" value="128" help-text="+4.2%" indicator="increase"></kb-stat>
			<kb-stat size="md" label="Medium" value="1,024" help-text="+12.5%" indicator="increase"></kb-stat>
			<kb-stat size="lg" label="Large" value="$45,200" help-text="-2.3%" indicator="decrease"></kb-stat>
		</div>
	`,
};

export const StatRow: S = {
  render: () => html`
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:24px;max-width:600px;">
			<kb-stat label="Revenue" value="$12,450" help-text="+12.5%" indicator="increase"></kb-stat>
			<kb-stat label="Orders" value="342" help-text="-3.1%" indicator="decrease"></kb-stat>
			<kb-stat label="Customers" value="1,209" help-text="+8.7%" indicator="increase"></kb-stat>
		</div>
	`,
};

export const KitchenSink: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:24px;">
			<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:24px;">
				<kb-stat size="sm" label="Visitors" value="8,942" help-text="+5.2% vs yesterday" indicator="increase"></kb-stat>
				<kb-stat size="sm" label="Bounce Rate" value="42.3%" help-text="-1.8%" indicator="decrease"></kb-stat>
				<kb-stat size="sm" label="Avg Session" value="4m 32s" help-text="No change" indicator="none"></kb-stat>
			</div>
			<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;">
				<kb-stat size="lg" label="Total Revenue" value="$142,580" help-text="+22% this quarter" indicator="increase"></kb-stat>
				<kb-stat size="lg" label="MRR" value="$18,200" help-text="-$400 from last month" indicator="decrease"></kb-stat>
			</div>
		</div>
	`,
};
