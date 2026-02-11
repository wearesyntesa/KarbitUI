import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/data-display/kb-table.js';

const basicContent = html`
  <thead>
    <tr><th>Endpoint</th><th>Method</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>/api/auth/token</td><td>POST</td><td>Operational</td></tr>
    <tr><td>/api/users</td><td>GET</td><td>Degraded</td></tr>
    <tr><td>/api/events</td><td>GET</td><td>Operational</td></tr>
  </tbody>
`;

const richContent = html`
  <thead>
    <tr>
      <th>ID</th>
      <th>Service</th>
      <th>Region</th>
      <th data-sort="number">Latency</th>
      <th data-sort="number">Uptime</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0041</span></td>
      <td>Auth Gateway</td>
      <td><span class="text-slate-500 dark:text-zinc-400">us-east-1</span></td>
      <td><span class="font-mono tabular-nums">12ms</span></td>
      <td><span class="font-mono tabular-nums">99.98%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</span></td>
    </tr>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0042</span></td>
      <td>User Service</td>
      <td><span class="text-slate-500 dark:text-zinc-400">us-east-1</span></td>
      <td><span class="font-mono tabular-nums">45ms</span></td>
      <td><span class="font-mono tabular-nums">99.91%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</span></td>
    </tr>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0043</span></td>
      <td>Payment Processor</td>
      <td><span class="text-slate-500 dark:text-zinc-400">eu-west-1</span></td>
      <td><span class="font-mono tabular-nums">89ms</span></td>
      <td><span class="font-mono tabular-nums">98.44%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Degraded</span></td>
    </tr>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0044</span></td>
      <td>Notification Hub</td>
      <td><span class="text-slate-500 dark:text-zinc-400">ap-south-1</span></td>
      <td><span class="font-mono tabular-nums">23ms</span></td>
      <td><span class="font-mono tabular-nums">99.99%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</span></td>
    </tr>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0045</span></td>
      <td>Search Index</td>
      <td><span class="text-slate-500 dark:text-zinc-400">us-west-2</span></td>
      <td><span class="font-mono tabular-nums text-red-500">156ms</span></td>
      <td><span class="font-mono tabular-nums text-red-500">97.12%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span><span class="text-red-600 dark:text-red-400">Critical</span></span></td>
    </tr>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0046</span></td>
      <td>CDN Edge</td>
      <td><span class="text-slate-500 dark:text-zinc-400">global</span></td>
      <td><span class="font-mono tabular-nums">8ms</span></td>
      <td><span class="font-mono tabular-nums">99.99%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</span></td>
    </tr>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0047</span></td>
      <td>Log Aggregator</td>
      <td><span class="text-slate-500 dark:text-zinc-400">us-east-1</span></td>
      <td><span class="font-mono tabular-nums">34ms</span></td>
      <td><span class="font-mono tabular-nums">99.87%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</span></td>
    </tr>
    <tr>
      <td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">SVC-0048</span></td>
      <td>Queue Worker</td>
      <td><span class="text-slate-500 dark:text-zinc-400">eu-west-1</span></td>
      <td><span class="font-mono tabular-nums">67ms</span></td>
      <td><span class="font-mono tabular-nums">99.52%</span></td>
      <td><span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Degraded</span></td>
    </tr>
  </tbody>
`;

const scrollableContent = html`
  <thead>
    <tr><th>Timestamp</th><th>Level</th><th>Source</th><th>Message</th></tr>
  </thead>
  <tbody>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:12</span></td><td><span class="font-mono text-xs">INFO</span></td><td>auth</td><td>User login successful</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:14</span></td><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">DEBUG</span></td><td>cache</td><td>Cache hit for key user:4821</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:15</span></td><td><span class="font-mono text-xs text-yellow-600 dark:text-yellow-400">WARN</span></td><td>payment</td><td>Retry attempt 2/3 for txn:91023</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:18</span></td><td><span class="font-mono text-xs text-red-600 dark:text-red-400">ERROR</span></td><td>search</td><td>Index timeout after 5000ms</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:20</span></td><td><span class="font-mono text-xs">INFO</span></td><td>api</td><td>GET /api/users 200 12ms</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:22</span></td><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">DEBUG</span></td><td>db</td><td>Query executed in 3ms</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:25</span></td><td><span class="font-mono text-xs">INFO</span></td><td>auth</td><td>Token refreshed for session:8812</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:27</span></td><td><span class="font-mono text-xs text-yellow-600 dark:text-yellow-400">WARN</span></td><td>queue</td><td>Queue depth exceeding threshold: 1247</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:30</span></td><td><span class="font-mono text-xs">INFO</span></td><td>cdn</td><td>Asset purge completed for zone:us-east</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:32</span></td><td><span class="font-mono text-xs text-red-600 dark:text-red-400">ERROR</span></td><td>payment</td><td>Transaction failed: insufficient funds</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:35</span></td><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500">DEBUG</span></td><td>cache</td><td>Cache miss for key product:7712</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:37</span></td><td><span class="font-mono text-xs">INFO</span></td><td>notification</td><td>Email dispatched to user:4821</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:40</span></td><td><span class="font-mono text-xs">INFO</span></td><td>api</td><td>POST /api/events 201 45ms</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:42</span></td><td><span class="font-mono text-xs text-yellow-600 dark:text-yellow-400">WARN</span></td><td>search</td><td>Slow query detected: 890ms</td></tr>
    <tr><td><span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">2026-02-10 08:01:45</span></td><td><span class="font-mono text-xs">INFO</span></td><td>auth</td><td>New session created for user:6102</td></tr>
  </tbody>
`;

export default {
  title: 'Data Display/Table',
  component: 'kb-table',
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${basicContent}</kb-table>`,
  args: { variant: 'simple', size: 'md', hoverable: true },
  argTypes: {
    variant: { control: 'select', options: ['simple', 'striped', 'bordered'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    hoverable: { control: 'boolean' },
    interactive: { control: 'boolean' },
    sortable: { control: 'boolean' },
    searchable: { control: 'boolean' },
    resizable: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    caption: { control: 'text' },
    searchPlaceholder: { control: 'text' },
  },
} satisfies Meta;

type S = StoryObj;

export const Simple: S = {};

export const Striped: S = { args: { variant: 'striped' } };

export const Bordered: S = { args: { variant: 'bordered' } };

export const WithCaption: S = {
  args: { caption: 'API Endpoint Status' },
};

export const Sortable: S = {
  args: { sortable: true, caption: 'Service Health Dashboard' },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${richContent}</kb-table>`,
};

export const Searchable: S = {
  args: { searchable: true, caption: 'Service Health Dashboard', searchPlaceholder: 'Filter services...' },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${richContent}</kb-table>`,
};

export const SortableAndSearchable: S = {
  args: { sortable: true, searchable: true, caption: 'Infrastructure Overview', variant: 'striped' },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${richContent}</kb-table>`,
};

export const Resizable: S = {
  args: { resizable: true, caption: 'Drag column edges to resize' },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${richContent}</kb-table>`,
};

export const FullFeatured: S = {
  args: {
    sortable: true,
    searchable: true,
    resizable: true,
    hoverable: true,
    caption: 'Service Health Dashboard',
    variant: 'simple',
    searchPlaceholder: 'Search services...',
  },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${richContent}</kb-table>`,
};

export const Interactive: S = {
  args: { interactive: true, hoverable: false },
  render: (args) => html`
    <kb-table ${spreadAttrs(args)} @kb-row-click=${(e: CustomEvent) => {
      const row = e.detail.row as HTMLTableRowElement;
      const cells = Array.from(row.querySelectorAll('td'));
      const endpoint = cells[0]?.textContent ?? '';
      const info = document.getElementById('table-click-output');
      if (info) info.textContent = `Clicked row ${e.detail.index}: ${endpoint}`;
    }}>
      ${basicContent}
    </kb-table>
    <p id="table-click-output" class="mt-3 font-mono text-xs text-slate-500 dark:text-zinc-400 h-5">Click a row</p>
  `,
};

export const StickyHeader: S = {
  args: { stickyHeader: true, sortable: true, searchable: true, caption: 'System Logs' },
  render: (args) => html`
    <kb-table ${spreadAttrs(args)} class="max-h-[28rem]">
      ${scrollableContent}
    </kb-table>
  `,
};

export const Compact: S = {
  args: { size: 'sm', sortable: true },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${richContent}</kb-table>`,
};

export const Large: S = {
  args: { size: 'lg' },
};

export const RichData: S = {
  args: { variant: 'simple', caption: 'Service Health Dashboard' },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${richContent}</kb-table>`,
};

export const NoHover: S = {
  args: { hoverable: false },
  render: (args) => html`<kb-table ${spreadAttrs(args)}>${basicContent}</kb-table>`,
};

export const SizeComparison: S = {
  render: () => html`
    <div class="flex flex-col gap-8">
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Small</p>
        <kb-table size="sm">${basicContent}</kb-table>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Medium (default)</p>
        <kb-table size="md">${basicContent}</kb-table>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Large</p>
        <kb-table size="lg">${basicContent}</kb-table>
      </div>
    </div>
  `,
};

export const VariantComparison: S = {
  render: () => html`
    <div class="flex flex-col gap-8">
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Simple</p>
        <kb-table variant="simple">${basicContent}</kb-table>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Striped</p>
        <kb-table variant="striped">${basicContent}</kb-table>
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Bordered</p>
        <kb-table variant="bordered">${basicContent}</kb-table>
      </div>
    </div>
  `,
};
