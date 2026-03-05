import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/navigation/kb-pagination.js';

type Args = { total?: number; page?: number; siblings?: number; size?: string };

export default {
  title: 'Navigation/Pagination',
  component: 'kb-pagination',
  render: (args) => html`<kb-pagination ${spreadAttrs(args)}></kb-pagination>`,
  args: { total: 10, page: 5, siblings: 1, size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {};

export const FirstPage: S = {
  args: { page: 1 },
};

export const LastPage: S = {
  args: { page: 10 },
};

export const FewPages: S = {
  args: { total: 3, page: 2 },
};

export const ManyPages: S = {
  args: { total: 50, page: 25, siblings: 2 },
};

export const Sizes: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:16px;">
			<kb-pagination total="10" page="5" size="sm"></kb-pagination>
			<kb-pagination total="10" page="5" size="md"></kb-pagination>
			<kb-pagination total="10" page="5" size="lg"></kb-pagination>
		</div>
	`,
};

export const KitchenSink: S = {
  render: () => html`
		<div style="display:flex;flex-direction:column;gap:20px;">
			<kb-pagination total="1" page="1" size="sm"></kb-pagination>
			<kb-pagination total="5" page="3" size="md"></kb-pagination>
			<kb-pagination total="20" page="10" siblings="2" size="md"></kb-pagination>
			<kb-pagination total="100" page="50" siblings="1" size="lg"></kb-pagination>
		</div>
	`,
};
