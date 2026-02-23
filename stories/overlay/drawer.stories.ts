import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-drawer.js';
import '../../src/components/forms/kb-button.js';
import '../../src/components/forms/kb-input.js';
import '../../src/components/forms/kb-switch.js';
import '../../src/components/forms/kb-select.js';
import '../../src/components/forms/kb-textarea.js';
import '../../src/components/feedback/kb-badge.js';
import '../../src/components/feedback/kb-progress.js';
import '../../src/components/data-display/kb-tag.js';
import '../../src/components/layout/kb-divider.js';

type Args = { open?: boolean; placement?: string; size?: string };

export default {
  title: 'Overlay/Drawer',
  component: 'kb-drawer',
  args: { open: true, placement: 'right', size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Right: S = {
  render: () => html`
    <kb-drawer open placement="right">
      <span slot="header">ACCOUNT</span>
      <div class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-500 flex items-center justify-center text-white font-sans font-bold text-lg flex-shrink-0">EV</div>
          <div>
            <div class="font-sans font-semibold text-slate-900 dark:text-zinc-50">Elena Vasquez</div>
            <div class="text-sm text-slate-400 dark:text-zinc-500">elena@syntesa.net</div>
          </div>
        </div>
        <kb-divider></kb-divider>
        <div class="space-y-3">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Preferences</div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-700 dark:text-zinc-300">Dark mode</span>
            <kb-switch size="sm"></kb-switch>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-700 dark:text-zinc-300">Email notifications</span>
            <kb-switch size="sm" checked></kb-switch>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-700 dark:text-zinc-300">Two-factor auth</span>
            <kb-switch size="sm" checked color-scheme="green"></kb-switch>
          </div>
        </div>
        <kb-divider></kb-divider>
        <div class="space-y-3">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Usage this month</div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-zinc-400">API calls</span>
              <span class="font-mono text-slate-900 dark:text-zinc-50">12,847 / 50,000</span>
            </div>
            <kb-progress value=${26} size="xs"></kb-progress>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-zinc-400">Storage</span>
              <span class="font-mono text-slate-900 dark:text-zinc-50">2.1 GB / 10 GB</span>
            </div>
            <kb-progress value=${21} size="xs"></kb-progress>
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">LOG OUT</kb-button>
        <kb-button size="sm">SAVE CHANGES</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const Left: S = {
  render: () => html`
    <kb-drawer open placement="left">
      <span slot="header">NAVIGATION</span>
      <div class="space-y-5">
        <div class="space-y-1">
          ${[
            { label: 'Dashboard', active: true },
            { label: 'Projects', active: false, count: 12 },
            { label: 'Deployments', active: false },
            { label: 'Analytics', active: false },
            { label: 'Logs', active: false },
          ].map(
            (item) => html`
            <div class="flex items-center justify-between px-2 py-2 cursor-pointer transition-colors ${
              item.active
                ? 'bg-gray-50 dark:bg-zinc-800 text-blue-500 font-medium'
                : 'text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }">
              <span class="text-sm">${item.label}</span>
              ${item.count ? html`<kb-badge size="xs" variant="subtle">${item.count}</kb-badge>` : ''}
            </div>
          `,
          )}
        </div>
        <kb-divider></kb-divider>
        <div class="space-y-1">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-2 mb-2">Team</div>
          ${['Members', 'Billing', 'Integrations', 'API Keys'].map(
            (label) => html`
            <div class="px-2 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">${label}</div>
          `,
          )}
        </div>
        <kb-divider></kb-divider>
        <div class="space-y-1">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-2 mb-2">Resources</div>
          ${['Documentation', 'Status Page', 'Changelog'].map(
            (label) => html`
            <div class="px-2 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">${label}</div>
          `,
          )}
        </div>
      </div>
    </kb-drawer>
  `,
};

export const Top: S = {
  render: () => html`
    <kb-drawer open placement="top" size="sm">
      <span slot="header">SEARCH</span>
      <div class="space-y-4">
        <kb-input placeholder="Search projects, deployments, team members..." variant="outline" size="md" type="search" clearable></kb-input>
        <div>
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">Recent searches</div>
          <div class="space-y-1">
            ${['production deploy error', 'webhook configuration', 'API rate limits'].map(
              (q) => html`
              <div class="flex items-center gap-2 py-1.5 px-2 text-sm text-slate-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <svg class="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ${q}
              </div>
            `,
            )}
          </div>
        </div>
      </div>
    </kb-drawer>
  `,
};

export const Bottom: S = {
  render: () => html`
    <kb-drawer open placement="bottom" size="sm">
      <span slot="header">SHARE PROJECT</span>
      <div class="space-y-4">
        <div>
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">Share via link</div>
          <div class="flex gap-2">
            <kb-input value="https://app.syntesa.net/p/alpha-7f3a" variant="outline" size="sm" readonly class="flex-1"></kb-input>
            <kb-button size="sm" variant="outline">COPY</kb-button>
          </div>
        </div>
        <kb-divider></kb-divider>
        <div class="flex justify-center gap-6">
          ${['Slack', 'Email', 'Notion', 'GitHub'].map(
            (app) => html`
            <div class="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div class="w-10 h-10 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                <span class="font-mono text-xs font-bold">${app.substring(0, 2).toUpperCase()}</span>
              </div>
              <span class="text-xs text-slate-500 dark:text-zinc-400">${app}</span>
            </div>
          `,
          )}
        </div>
      </div>
    </kb-drawer>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div class="flex flex-wrap gap-3">
      ${(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map(
        (size) => html`
          <kb-button
            size="sm"
            variant="outline"
            @click=${(e: Event) => {
              const btn = e.currentTarget as HTMLElement;
              const drawer = btn.parentElement?.querySelector<HTMLElement>(`kb-drawer[data-size="${size}"]`);
              if (drawer) (drawer as unknown as { open: boolean }).open = true;
            }}
          >${size}</kb-button>
          <kb-drawer data-size=${size} placement="right" size=${size}>
            <span slot="header">SIZE: ${size.toUpperCase()}</span>
            <p class="text-sm text-slate-500 dark:text-zinc-400">This drawer uses the <code class="font-mono text-blue-500">${size}</code> size preset.</p>
          </kb-drawer>
        `,
      )}
    </div>
  `,
};

export const BackdropBlur: S = {
  render: () => html`
    <kb-drawer open placement="right" backdrop="blur">
      <span slot="header">QUICK NOTE</span>
      <div class="space-y-4">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Title</label>
          <kb-input placeholder="Note title..." variant="outline" size="sm"></kb-input>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Content</label>
          <kb-textarea placeholder="Write your note..." size="sm" rows="6"></kb-textarea>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Tags</label>
          <div class="flex gap-2">
            <kb-tag size="sm" closable>bug</kb-tag>
            <kb-tag size="sm" closable>frontend</kb-tag>
            <kb-tag size="sm" closable>urgent</kb-tag>
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">DISCARD</kb-button>
        <kb-button size="sm">SAVE NOTE</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const BackdropTransparent: S = {
  render: () => html`
    <kb-drawer open placement="right" backdrop="transparent" size="sm">
      <span slot="header">INSPECTOR</span>
      <div class="space-y-3">
        <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500">Element</div>
        <div class="border border-gray-200 dark:border-zinc-700 p-2 space-y-1">
          <div class="flex justify-between">
            <span class="font-mono text-xs text-slate-500 dark:text-zinc-400">Tag</span>
            <span class="font-mono text-xs text-blue-500">&lt;kb-button&gt;</span>
          </div>
          <div class="flex justify-between">
            <span class="font-mono text-xs text-slate-500 dark:text-zinc-400">Size</span>
            <span class="font-mono text-xs text-slate-900 dark:text-zinc-50">sm</span>
          </div>
          <div class="flex justify-between">
            <span class="font-mono text-xs text-slate-500 dark:text-zinc-400">Variant</span>
            <span class="font-mono text-xs text-slate-900 dark:text-zinc-50">solid</span>
          </div>
        </div>
        <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500">Computed classes</div>
        <div class="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-2">
          <code class="font-mono text-xs text-slate-600 dark:text-zinc-300 break-all">inline-flex items-center justify-center font-sans font-bold uppercase tracking-wider bg-blue-500 text-white px-3 py-1.5 text-xs</code>
        </div>
        <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500">Box model</div>
        <div class="border border-gray-200 dark:border-zinc-700 p-2 space-y-1">
          ${[
            { prop: 'width', val: '96px' },
            { prop: 'height', val: '32px' },
            { prop: 'padding', val: '6px 12px' },
            { prop: 'margin', val: '0px' },
          ].map(
            (r) => html`
            <div class="flex justify-between">
              <span class="font-mono text-xs text-slate-500 dark:text-zinc-400">${r.prop}</span>
              <span class="font-mono text-xs text-slate-900 dark:text-zinc-50">${r.val}</span>
            </div>
          `,
          )}
        </div>
      </div>
    </kb-drawer>
  `,
};

export const NotClosable: S = {
  render: () => html`
    <kb-drawer open placement="right" .closable=${false}>
      <span slot="header">ONBOARDING — STEP 2 OF 3</span>
      <div class="space-y-4">
        <div>
          <kb-progress value=${66} size="xs"></kb-progress>
        </div>
        <div class="font-sans text-lg font-semibold text-slate-900 dark:text-zinc-50">Connect your repository</div>
        <p class="text-sm text-slate-500 dark:text-zinc-400">Link a Git repository to enable automatic deployments. We support GitHub, GitLab, and Bitbucket.</p>
        <div class="space-y-2">
          ${['GitHub', 'GitLab', 'Bitbucket'].map(
            (provider) => html`
            <div class="flex items-center justify-between border border-gray-200 dark:border-zinc-700 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center">
                  <span class="font-mono text-xs font-bold text-slate-500 dark:text-zinc-400">${provider.substring(0, 2).toUpperCase()}</span>
                </div>
                <span class="text-sm font-medium text-slate-900 dark:text-zinc-50">${provider}</span>
              </div>
              <kb-button size="xs" variant="outline">CONNECT</kb-button>
            </div>
          `,
          )}
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">BACK</kb-button>
        <kb-button size="sm">SKIP FOR NOW</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const NoOverlayClose: S = {
  render: () => html`
    <kb-drawer open placement="right" .closeOnOverlay=${false}>
      <span slot="header">FILTERS</span>
      <div class="space-y-4">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Status</label>
          <kb-select placeholder="All statuses" size="sm" .options=${[
            { label: 'Active', value: 'active' },
            { label: 'Paused', value: 'paused' },
            { label: 'Failed', value: 'failed' },
            { label: 'Completed', value: 'completed' },
          ]}></kb-select>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Environment</label>
          <kb-select placeholder="All environments" size="sm" .options=${[
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
            { label: 'Development', value: 'development' },
          ]}></kb-select>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Date range</label>
          <div class="flex gap-2">
            <kb-input type="date" variant="outline" size="sm" class="flex-1"></kb-input>
            <kb-input type="date" variant="outline" size="sm" class="flex-1"></kb-input>
          </div>
        </div>
        <kb-divider></kb-divider>
        <div class="space-y-2">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Quick filters</div>
          <div class="flex flex-wrap gap-2">
            ${['Last 24h', 'Last 7d', 'Last 30d', 'Failed only', 'My deploys'].map(
              (f) => html`<kb-tag size="sm" interactive>${f}</kb-tag>`,
            )}
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">RESET ALL</kb-button>
        <kb-button size="sm">APPLY FILTERS</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const NoHeader: S = {
  render: () => html`
    <kb-drawer open placement="right">
      <div class="space-y-0">
        <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">Notifications</div>
        ${[
          { title: 'Deploy succeeded', desc: 'Build #1847 deployed to production', time: '2 min ago', unread: true },
          { title: 'PR approved', desc: 'Ava approved PR #219: Add avatar support', time: '15 min ago', unread: true },
          { title: 'Build failed', desc: 'Build #1845 failed — test suite error', time: '1 hour ago', unread: false },
          { title: 'New team member', desc: 'Marcus Chen joined the workspace', time: '3 hours ago', unread: false },
          { title: 'Usage alert', desc: 'API calls reached 80% of monthly limit', time: '5 hours ago', unread: false },
          {
            title: 'Certificate renewed',
            desc: 'SSL certificate for *.syntesa.net renewed',
            time: '1 day ago',
            unread: false,
          },
          { title: 'Scheduled backup', desc: 'Daily backup completed successfully', time: '1 day ago', unread: false },
        ].map(
          (n) => html`
          <div class="flex gap-3 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 ${n.unread ? '' : 'opacity-60'}">
            ${n.unread ? html`<div class="w-1.5 h-1.5 bg-blue-500 mt-2 flex-shrink-0"></div>` : html`<div class="w-1.5 flex-shrink-0"></div>`}
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-slate-900 dark:text-zinc-50">${n.title}</div>
              <div class="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">${n.desc}</div>
              <div class="font-mono text-xs text-slate-400 dark:text-zinc-500 mt-1">${n.time}</div>
            </div>
          </div>
        `,
        )}
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">MARK ALL READ</kb-button>
        <kb-button size="sm" variant="outline">VIEW ALL</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const NoFooter: S = {
  render: () => html`
    <kb-drawer open placement="right">
      <span slot="header">KEYBOARD SHORTCUTS</span>
      <div class="space-y-4">
        ${[
          {
            section: 'General',
            shortcuts: [
              { keys: ['Ctrl', 'K'], desc: 'Command palette' },
              { keys: ['Ctrl', 'S'], desc: 'Save changes' },
              { keys: ['Ctrl', '/'], desc: 'Toggle sidebar' },
            ],
          },
          {
            section: 'Editor',
            shortcuts: [
              { keys: ['Ctrl', 'Shift', 'P'], desc: 'Format document' },
              { keys: ['Ctrl', 'D'], desc: 'Duplicate line' },
              { keys: ['Ctrl', 'Shift', 'K'], desc: 'Delete line' },
              { keys: ['Alt', 'Up'], desc: 'Move line up' },
            ],
          },
          {
            section: 'Navigation',
            shortcuts: [
              { keys: ['Ctrl', '1-9'], desc: 'Switch tab' },
              { keys: ['Ctrl', 'W'], desc: 'Close tab' },
              { keys: ['Ctrl', 'Shift', 'T'], desc: 'Reopen tab' },
            ],
          },
        ].map(
          (group) => html`
          <div>
            <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">${group.section}</div>
            <div class="space-y-1.5">
              ${group.shortcuts.map(
                (s) => html`
                <div class="flex items-center justify-between py-1">
                  <span class="text-sm text-slate-600 dark:text-zinc-300">${s.desc}</span>
                  <div class="flex gap-1">
                    ${s.keys.map(
                      (k) =>
                        html`<kbd class="px-1.5 py-0.5 text-xs font-mono border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">${k}</kbd>`,
                    )}
                  </div>
                </div>
              `,
              )}
            </div>
          </div>
        `,
        )}
      </div>
    </kb-drawer>
  `,
};

export const WithForm: S = {
  render: () => html`
    <kb-drawer open placement="right" size="lg">
      <span slot="header">NEW PROJECT</span>
      <div class="space-y-4">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Project name</label>
          <kb-input placeholder="my-project" variant="outline" size="sm"></kb-input>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Framework</label>
          <kb-select placeholder="Select framework..." size="sm" .options=${[
            { label: 'Next.js', value: 'nextjs' },
            { label: 'Remix', value: 'remix' },
            { label: 'Astro', value: 'astro' },
            { label: 'Vite + React', value: 'vite-react' },
            { label: 'SvelteKit', value: 'sveltekit' },
          ]}></kb-select>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Repository</label>
          <kb-input placeholder="https://github.com/..." variant="outline" size="sm" type="url"></kb-input>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Description</label>
          <kb-textarea placeholder="What does this project do?" size="sm" rows="3"></kb-textarea>
        </div>
        <kb-divider></kb-divider>
        <div class="space-y-3">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Build settings</div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-slate-900 dark:text-zinc-50">Auto-deploy</div>
              <div class="text-xs text-slate-400 dark:text-zinc-500">Deploy on push to main branch</div>
            </div>
            <kb-switch size="sm" checked></kb-switch>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-slate-900 dark:text-zinc-50">Preview deploys</div>
              <div class="text-xs text-slate-400 dark:text-zinc-500">Create preview for every pull request</div>
            </div>
            <kb-switch size="sm" checked></kb-switch>
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">CANCEL</kb-button>
        <kb-button size="sm">CREATE PROJECT</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const ExtraLarge: S = {
  render: () => html`
    <kb-drawer open placement="right" size="xl">
      <span slot="header">ORDER #ORD-2026-1847</span>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <kb-badge color-scheme="green" dot>SHIPPED</kb-badge>
            <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">Feb 20, 2026</span>
          </div>
          <span class="font-sans text-lg font-bold text-slate-900 dark:text-zinc-50">$1,247.00</span>
        </div>
        <kb-divider></kb-divider>
        <div>
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">Items</div>
          <div class="space-y-3">
            ${[
              { name: 'Enterprise License — Annual', qty: 1, price: '$999.00' },
              { name: 'Priority Support Add-on', qty: 1, price: '$199.00' },
              { name: 'Additional Team Seats (5)', qty: 1, price: '$49.00' },
            ].map(
              (item) => html`
              <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                <div>
                  <div class="text-sm font-medium text-slate-900 dark:text-zinc-50">${item.name}</div>
                  <div class="font-mono text-xs text-slate-400 dark:text-zinc-500">Qty: ${item.qty}</div>
                </div>
                <span class="font-mono text-sm text-slate-900 dark:text-zinc-50">${item.price}</span>
              </div>
            `,
            )}
          </div>
        </div>
        <kb-divider></kb-divider>
        <div>
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">Timeline</div>
          <div class="space-y-3">
            ${[
              { date: 'Feb 20', event: 'Shipped via FedEx', detail: 'Tracking: 7948 2381 0473' },
              { date: 'Feb 19', event: 'Payment confirmed', detail: 'Visa ending 4242' },
              { date: 'Feb 19', event: 'Order placed', detail: 'By elena@syntesa.net' },
            ].map(
              (step) => html`
              <div class="flex gap-3">
                <div class="flex flex-col items-center">
                  <div class="w-2 h-2 bg-blue-500 mt-1.5"></div>
                  <div class="w-px flex-1 bg-gray-200 dark:bg-zinc-700"></div>
                </div>
                <div class="pb-3">
                  <div class="text-sm font-medium text-slate-900 dark:text-zinc-50">${step.event}</div>
                  <div class="font-mono text-xs text-slate-400 dark:text-zinc-500">${step.date} — ${step.detail}</div>
                </div>
              </div>
            `,
            )}
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">REFUND</kb-button>
        <kb-button size="sm" variant="outline">DOWNLOAD INVOICE</kb-button>
        <kb-button size="sm">CLOSE</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const FullWidth: S = {
  render: () => html`
    <kb-drawer open placement="right" size="full">
      <span slot="header">ANALYTICS — LAST 30 DAYS</span>
      <div class="space-y-5">
        <div class="grid grid-cols-4 gap-4">
          ${[
            { label: 'Total Requests', value: '4.2M', change: '+12.3%' },
            { label: 'Unique Visitors', value: '284K', change: '+8.7%' },
            { label: 'Avg Response Time', value: '127ms', change: '-15.4%' },
            { label: 'Error Rate', value: '0.03%', change: '-22.1%' },
          ].map(
            (stat) => html`
            <div class="border border-gray-200 dark:border-zinc-700 p-4 space-y-1">
              <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">${stat.label}</div>
              <div class="font-sans text-2xl font-bold text-slate-900 dark:text-zinc-50">${stat.value}</div>
              <div class="font-mono text-xs ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-blue-500'}">${stat.change}</div>
            </div>
          `,
          )}
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="border border-gray-200 dark:border-zinc-700 p-4">
            <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Top endpoints</div>
            <div class="space-y-2">
              ${[
                { path: '/api/v2/users', pct: 38 },
                { path: '/api/v2/events', pct: 27 },
                { path: '/api/v2/analytics', pct: 18 },
                { path: '/api/v2/webhooks', pct: 11 },
                { path: '/api/v2/billing', pct: 6 },
              ].map(
                (ep) => html`
                <div class="space-y-1">
                  <div class="flex justify-between text-sm">
                    <span class="font-mono text-blue-500">${ep.path}</span>
                    <span class="font-mono text-slate-500 dark:text-zinc-400">${ep.pct}%</span>
                  </div>
                  <kb-progress value=${ep.pct} size="xs"></kb-progress>
                </div>
              `,
              )}
            </div>
          </div>
          <div class="border border-gray-200 dark:border-zinc-700 p-4">
            <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Geographic distribution</div>
            <div class="space-y-2">
              ${[
                { region: 'North America', pct: 42, count: '119K' },
                { region: 'Europe', pct: 31, count: '88K' },
                { region: 'Asia Pacific', pct: 18, count: '51K' },
                { region: 'South America', pct: 6, count: '17K' },
                { region: 'Other', pct: 3, count: '9K' },
              ].map(
                (r) => html`
                <div class="flex items-center justify-between py-1">
                  <span class="text-sm text-slate-700 dark:text-zinc-300">${r.region}</span>
                  <div class="flex items-center gap-3">
                    <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">${r.count}</span>
                    <span class="font-mono text-xs text-slate-900 dark:text-zinc-50 w-8 text-right">${r.pct}%</span>
                  </div>
                </div>
              `,
              )}
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="ghost">EXPORT CSV</kb-button>
        <kb-button size="sm">CLOSE</kb-button>
      </span>
    </kb-drawer>
  `,
};

export const MobileActionSheet: S = {
  render: () => html`
    <kb-drawer open placement="bottom" size="sm" backdrop="blur">
      <span slot="header">ACTIONS</span>
      <div class="space-y-1">
        ${[
          {
            label: 'Edit project settings',
            icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
          },
          {
            label: 'Duplicate',
            icon: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75',
          },
          {
            label: 'Move to folder',
            icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
          },
          {
            label: 'Share with team',
            icon: 'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z',
          },
        ].map(
          (item) => html`
          <div class="flex items-center gap-3 py-2.5 px-1 cursor-pointer text-sm text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors border-b border-gray-100 dark:border-zinc-800">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${item.icon}" /></svg>
            ${item.label}
          </div>
        `,
        )}
        <div class="flex items-center gap-3 py-2.5 px-1 cursor-pointer text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          Delete
        </div>
      </div>
    </kb-drawer>
  `,
};

export const ToggleDemo: S = {
  render: () => html`
    <kb-button
      @click=${(e: Event) => {
        const btn = e.currentTarget as HTMLElement;
        const drawer = btn.parentElement?.querySelector<HTMLElement>('kb-drawer');
        if (drawer) (drawer as unknown as { open: boolean }).open = true;
      }}
    >OPEN DRAWER</kb-button>
    <kb-drawer placement="right" size="md" backdrop="blur">
      <span slot="header">TOGGLE DEMO</span>
      <div class="space-y-3">
        <p class="text-sm text-slate-500 dark:text-zinc-400">This drawer was opened via button click. Close it with the X button, Escape key, or overlay click to see the animated dismiss transition.</p>
        <div class="border border-gray-200 dark:border-zinc-700 p-3">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">Dismiss methods</div>
          <div class="space-y-1 text-sm text-slate-600 dark:text-zinc-300">
            <div>Close button (X)</div>
            <div>Escape key</div>
            <div>Click backdrop overlay</div>
            <div>Footer close button</div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm" variant="outline"
          @click=${(e: Event) => {
            const drawer = (e.currentTarget as HTMLElement).closest('kb-drawer');
            if (drawer) (drawer as unknown as { open: boolean }).open = false;
          }}
        >CLOSE</kb-button>
      </span>
    </kb-drawer>
  `,
};
