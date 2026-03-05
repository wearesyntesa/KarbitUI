import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-modal.js';
import '../../src/components/forms/kb-button.js';
import '../../src/components/forms/kb-input.js';
import '../../src/components/forms/kb-switch.js';
import '../../src/components/forms/kb-select.js';
import '../../src/components/forms/kb-textarea.js';
import '../../src/components/feedback/kb-badge.js';
import '../../src/components/feedback/kb-progress.js';
import '../../src/components/data-display/kb-tag.js';
import '../../src/components/layout/kb-divider.js';

type Args = { open?: boolean; size?: string };

export default {
  title: 'Overlay/Modal',
  component: 'kb-modal',
  args: { open: true, size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {
  render: () => html`
    <kb-modal open size="md">
      <span slot="header">DEPLOY TO PRODUCTION</span>
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <kb-badge color-scheme="green" dot>PASSING</kb-badge>
          <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">Build #1847 — 2m 34s</span>
        </div>
        <div class="border border-gray-200 dark:border-zinc-700 p-3 space-y-2">
          <div class="flex justify-between">
            <span class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Branch</span>
            <span class="font-mono text-sm text-slate-900 dark:text-zinc-50">main</span>
          </div>
          <div class="flex justify-between">
            <span class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Commit</span>
            <span class="font-mono text-sm text-blue-500">a3f8c2d</span>
          </div>
          <div class="flex justify-between">
            <span class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Environment</span>
            <span class="font-mono text-sm text-slate-900 dark:text-zinc-50">us-east-1</span>
          </div>
          <div class="flex justify-between">
            <span class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Changes</span>
            <span class="font-mono text-sm text-slate-900 dark:text-zinc-50">14 files, +327 / -89</span>
          </div>
        </div>
        <p class="text-sm text-slate-500 dark:text-zinc-400">This will deploy the latest changes to production. All traffic will be routed to the new build within 60 seconds.</p>
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CANCEL</kb-button>
        <kb-button size="sm">DEPLOY NOW</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ExtraSmall: S = {
  render: () => html`
    <kb-modal open size="xs">
      <span slot="header">API KEY CREATED</span>
      <div class="space-y-3">
        <p class="text-sm text-slate-500 dark:text-zinc-400">Your new key has been generated. Copy it now — it won't be shown again.</p>
        <div class="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-2.5">
          <code class="font-mono text-xs text-slate-900 dark:text-zinc-50 break-all select-all">sk_live_7f3a9c2e1b4d8f6a0e5c3b7d9f1a2c4e</code>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="xs">COPY KEY</kb-button>
      </span>
    </kb-modal>
  `,
};

export const Small: S = {
  render: () => html`
    <kb-modal open size="sm">
      <span slot="header">SESSION EXPIRING</span>
      <div class="space-y-3">
        <div class="flex items-baseline gap-3">
          <span class="font-sans text-3xl font-bold text-slate-900 dark:text-zinc-50">4:32</span>
          <span class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500">remaining</span>
        </div>
        <p class="text-sm text-slate-500 dark:text-zinc-400">Your session is about to expire due to inactivity. Any unsaved changes will be lost.</p>
      </div>
      <span slot="footer">
        <kb-button variant="ghost" size="sm">LOG OUT</kb-button>
        <kb-button size="sm">EXTEND SESSION</kb-button>
      </span>
    </kb-modal>
  `,
};

export const Large: S = {
  render: () => html`
    <kb-modal open size="lg">
      <span slot="header">INVITE TEAM MEMBERS</span>
      <div class="space-y-4">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Email addresses</label>
          <kb-textarea placeholder="Enter emails separated by commas..." size="sm" rows="2"></kb-textarea>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Role</label>
          <kb-select placeholder="Select role..." size="sm" .options=${[
            { label: 'Viewer — Read-only access', value: 'viewer' },
            { label: 'Editor — Can edit content', value: 'editor' },
            { label: 'Admin — Full access', value: 'admin' },
          ]}></kb-select>
        </div>
        <kb-divider></kb-divider>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-2">Current team</label>
          <div class="space-y-2">
            ${[
              { name: 'Elena Vasquez', role: 'Admin', email: 'elena@syntesa.net' },
              { name: 'Marcus Chen', role: 'Editor', email: 'marcus@syntesa.net' },
              { name: 'Ava Petrov', role: 'Viewer', email: 'ava@syntesa.net' },
            ].map(
              (m) => html`
              <div class="flex items-center justify-between py-1.5">
                <div>
                  <span class="text-sm font-medium text-slate-900 dark:text-zinc-50">${m.name}</span>
                  <span class="text-xs text-slate-400 dark:text-zinc-500 ml-2">${m.email}</span>
                </div>
                <kb-badge size="xs" variant="outline">${m.role}</kb-badge>
              </div>
            `,
            )}
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CANCEL</kb-button>
        <kb-button size="sm">SEND INVITES</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ExtraLarge: S = {
  render: () => html`
    <kb-modal open size="xl">
      <span slot="header">USAGE OVERVIEW — JANUARY 2026</span>
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${[
            { label: 'API Calls', value: '1,247,893', pct: 62, limit: '2,000,000' },
            { label: 'Storage', value: '18.4 GB', pct: 37, limit: '50 GB' },
            { label: 'Bandwidth', value: '842 GB', pct: 84, limit: '1,000 GB' },
          ].map(
            (s) => html`
            <div class="border border-gray-200 dark:border-zinc-700 p-3 space-y-2">
              <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">${s.label}</div>
              <div class="font-sans text-xl font-bold text-slate-900 dark:text-zinc-50">${s.value}</div>
              <kb-progress value=${s.pct} size="sm" auto-color></kb-progress>
              <div class="font-mono text-xs text-slate-400 dark:text-zinc-500">${s.pct}% of ${s.limit}</div>
            </div>
          `,
          )}
        </div>
        <kb-divider></kb-divider>
        <div class="border border-gray-200 dark:border-zinc-700">
          <div class="grid grid-cols-4 gap-0 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hidden sm:grid">
            ${['Endpoint', 'Calls', 'Avg Latency', 'Errors'].map(
              (h) =>
                html`<div class="px-3 py-2 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">${h}</div>`,
            )}
          </div>
          ${[
            { ep: '/api/v2/users', calls: '482,103', lat: '45ms', err: '0.02%' },
            { ep: '/api/v2/events', calls: '389,241', lat: '112ms', err: '0.14%' },
            { ep: '/api/v2/analytics', calls: '201,887', lat: '234ms', err: '0.31%' },
            { ep: '/api/v2/webhooks', calls: '174,662', lat: '67ms', err: '0.08%' },
          ].map(
            (r) => html`
            <div class="grid sm:grid-cols-4 gap-0 border-b border-gray-200 dark:border-zinc-700 last:border-b-0">
              <div class="px-3 py-2 font-mono text-sm text-blue-500">${r.ep}</div>
              <div class="px-3 py-2 font-mono text-sm text-slate-900 dark:text-zinc-50">${r.calls}</div>
              <div class="px-3 py-2 font-mono text-sm text-slate-900 dark:text-zinc-50">${r.lat}</div>
              <div class="px-3 py-2 font-mono text-sm text-slate-900 dark:text-zinc-50">${r.err}</div>
            </div>
          `,
          )}
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="ghost" size="sm">EXPORT CSV</kb-button>
        <kb-button variant="outline" size="sm">UPGRADE PLAN</kb-button>
        <kb-button size="sm">CLOSE</kb-button>
      </span>
    </kb-modal>
  `,
};

export const FullWidth: S = {
  render: () => html`
    <kb-modal open size="full">
      <span slot="header">DIFF — SCHEMA MIGRATION v2.14.0</span>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-gray-200 dark:border-zinc-700">
        <div class="border-r border-gray-200 dark:border-zinc-700">
          <div class="px-3 py-2 bg-gray-50 dark:bg-zinc-800 font-mono text-xs text-slate-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-700">schema_v2.13.sql</div>
          <pre class="p-3 font-mono text-xs leading-relaxed text-slate-700 dark:text-zinc-300 overflow-x-auto"><code>CREATE TABLE users (
  id          UUID PRIMARY KEY,
  email       VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email
  ON users(email);</code></pre>
        </div>
        <div>
          <div class="px-3 py-2 bg-gray-50 dark:bg-zinc-800 font-mono text-xs text-slate-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-700">schema_v2.14.sql</div>
          <pre class="p-3 font-mono text-xs leading-relaxed overflow-x-auto"><code>CREATE TABLE users (
  id          UUID PRIMARY KEY,
  email       VARCHAR(255) NOT NULL,
<span class="text-green-600 dark:text-green-400">+ display_name VARCHAR(128),</span>
<span class="text-green-600 dark:text-green-400">+ avatar_url   TEXT,</span>
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email
  ON users(email);

<span class="text-green-600 dark:text-green-400">+ CREATE INDEX idx_users_display_name</span>
<span class="text-green-600 dark:text-green-400">+   ON users(display_name);</span></code></pre>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CANCEL</kb-button>
        <kb-button size="sm">RUN MIGRATION</kb-button>
      </span>
    </kb-modal>
  `,
};

export const TopPlacement: S = {
  render: () => html`
    <kb-modal open size="md" placement="top">
      <span slot="header">SCHEDULED MAINTENANCE</span>
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <kb-badge color-scheme="yellow" variant="solid" size="xs">UPCOMING</kb-badge>
          <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">February 22, 2026 — 02:00 UTC</span>
        </div>
        <p class="text-sm text-slate-700 dark:text-zinc-300">We will perform database maintenance on the <strong class="text-slate-900 dark:text-zinc-50">us-east-1</strong> cluster. Expect up to 15 minutes of read-only mode. Write operations will be queued and replayed automatically.</p>
        <div class="border border-gray-200 dark:border-zinc-700 p-3">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1.5">Affected services</div>
          <div class="flex gap-2">
            <kb-tag size="sm">Database</kb-tag>
            <kb-tag size="sm">API Gateway</kb-tag>
            <kb-tag size="sm">Webhooks</kb-tag>
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm">REMIND ME LATER</kb-button>
        <kb-button size="sm">ACKNOWLEDGE</kb-button>
      </span>
    </kb-modal>
  `,
};

export const BackdropBlur: S = {
  render: () => html`
    <div class="space-y-3 p-6">
      <div class="font-sans text-lg font-semibold text-slate-900 dark:text-zinc-50">Project Dashboard</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        ${[1, 2, 3].map(() => html`<div class="border border-gray-200 dark:border-zinc-700 p-4 h-24"></div>`)}
      </div>
    </div>
    <kb-modal open size="sm" backdrop="blur">
      <span slot="header">UPGRADE TO PRO</span>
      <div class="space-y-4">
        <div class="space-y-3">
          ${[
            'Unlimited API calls',
            'Custom domains',
            'Priority support',
            'Advanced analytics',
            'Team collaboration',
          ].map(
            (f) => html`
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <span class="text-sm text-slate-700 dark:text-zinc-300">${f}</span>
            </div>
          `,
          )}
        </div>
        <kb-divider></kb-divider>
        <div class="flex items-baseline gap-1">
          <span class="font-sans text-3xl font-bold text-slate-900 dark:text-zinc-50">$29</span>
          <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">/ month</span>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="ghost" size="sm">MAYBE LATER</kb-button>
        <kb-button size="sm">START FREE TRIAL</kb-button>
      </span>
    </kb-modal>
  `,
};

export const BackdropTransparent: S = {
  render: () => html`
    <div class="space-y-2 p-6">
      <p class="text-sm text-slate-500 dark:text-zinc-400">Background remains fully visible behind the transparent backdrop.</p>
      <div class="border border-gray-200 dark:border-zinc-700 p-4">
        <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-2">Active processes</div>
        <div class="space-y-1">
          ${['worker-01: idle', 'worker-02: processing', 'worker-03: idle'].map(
            (w) => html`<div class="font-mono text-xs text-slate-700 dark:text-zinc-300">${w}</div>`,
          )}
        </div>
      </div>
    </div>
    <kb-modal open size="sm" backdrop="transparent">
      <span slot="header">TRANSPARENT BACKDROP</span>
      <p class="text-sm text-slate-500 dark:text-zinc-400">No overlay dimming. The page behind is fully visible. Useful for non-blocking contextual panels.</p>
      <span slot="footer">
        <kb-button size="sm">OK</kb-button>
      </span>
    </kb-modal>
  `,
};

export const NoFooter: S = {
  render: () => html`
    <kb-modal open size="md">
      <span slot="header">WHAT'S NEW IN v3.2</span>
      <div class="space-y-4">
        ${[
          {
            v: '3.2.0',
            date: 'Feb 21, 2026',
            items: [
              'Real-time collaboration cursors',
              'Markdown export for all documents',
              'Keyboard shortcut customization',
            ],
          },
          {
            v: '3.1.4',
            date: 'Feb 14, 2026',
            items: ['Fixed sidebar collapse on narrow viewports', 'Improved table sort performance by 3x'],
          },
          {
            v: '3.1.3',
            date: 'Feb 7, 2026',
            items: ['Added bulk select for list views', 'Fixed timezone offset in activity feed'],
          },
        ].map(
          (release) => html`
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm font-bold text-slate-900 dark:text-zinc-50">v${release.v}</span>
              <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">${release.date}</span>
            </div>
            <ul class="space-y-1">
              ${release.items.map(
                (item) => html`
                <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
                  <span class="text-slate-300 dark:text-zinc-600 mt-1.5">—</span>
                  ${item}
                </li>
              `,
              )}
            </ul>
          </div>
        `,
        )}
      </div>
    </kb-modal>
  `,
};

export const NoHeader: S = {
  render: () => html`
    <kb-modal open size="md">
      <div class="space-y-3">
        <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500">Keyboard shortcuts</div>
        <div class="space-y-2">
          ${[
            { keys: ['Ctrl', 'K'], desc: 'Command palette' },
            { keys: ['Ctrl', 'S'], desc: 'Save changes' },
            { keys: ['Ctrl', 'Shift', 'P'], desc: 'Open preview' },
            { keys: ['Ctrl', '/'], desc: 'Toggle sidebar' },
            { keys: ['Esc'], desc: 'Close current panel' },
          ].map(
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
      <span slot="footer">
        <kb-button size="sm" variant="outline">CLOSE</kb-button>
      </span>
    </kb-modal>
  `,
};

export const NotClosable: S = {
  render: () => html`
    <kb-modal open size="sm" .closable=${false} .closeOnOverlay=${false} .closeOnEscape=${false}>
      <span slot="header">BREAKING CHANGES</span>
      <div class="space-y-3">
        <kb-badge color-scheme="red" variant="solid" size="xs">REQUIRED UPDATE</kb-badge>
        <p class="text-sm text-slate-700 dark:text-zinc-300">API v1 endpoints have been deprecated and will stop responding on <strong class="text-slate-900 dark:text-zinc-50">March 1, 2026</strong>. You must migrate to v2 before this date.</p>
        <div class="border border-gray-200 dark:border-zinc-700 p-3 space-y-1">
          <div class="font-mono text-xs text-red-500 line-through">GET /api/v1/users</div>
          <div class="font-mono text-xs text-green-600 dark:text-green-400">GET /api/v2/users</div>
        </div>
      </div>
      <span slot="footer">
        <kb-button size="sm">I UNDERSTAND</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ScrollableBody: S = {
  render: () => html`
    <kb-modal open size="md">
      <span slot="header">AUDIT LOG — PROJECT ALPHA</span>
      <div class="space-y-0">
        ${[
          { time: '14:32:07', user: 'elena.v', action: 'Deployed build #1847 to production' },
          { time: '14:28:51', user: 'system', action: 'Build #1847 passed all 342 tests' },
          { time: '14:22:14', user: 'marcus.c', action: 'Merged PR #219: Add user avatar support' },
          { time: '13:58:03', user: 'ava.p', action: 'Approved PR #219' },
          { time: '13:45:22', user: 'marcus.c', action: 'Requested review from ava.p' },
          { time: '12:30:11', user: 'elena.v', action: 'Created branch feature/user-avatars' },
          { time: '12:15:48', user: 'system', action: 'Build #1846 passed all 340 tests' },
          { time: '12:08:33', user: 'elena.v', action: 'Deployed build #1846 to staging' },
          { time: '11:55:19', user: 'marcus.c', action: 'Merged PR #218: Fix pagination offset' },
          { time: '11:42:07', user: 'ava.p', action: 'Opened issue #447: Mobile layout breaks at 320px' },
          { time: '11:30:00', user: 'system', action: 'Scheduled backup completed successfully' },
          { time: '10:58:44', user: 'elena.v', action: 'Updated environment variables for staging' },
          { time: '10:45:21', user: 'marcus.c', action: 'Opened PR #218: Fix pagination offset' },
          { time: '10:22:16', user: 'system', action: 'Alert: API latency spike on /api/v2/events (avg 450ms)' },
          { time: '09:15:03', user: 'elena.v', action: 'Rotated API keys for production' },
        ].map(
          (e) => html`
          <div class="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-zinc-800 last:border-b-0">
            <span class="font-mono text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap mt-0.5">${e.time}</span>
            <span class="font-mono text-xs text-blue-500 whitespace-nowrap mt-0.5 w-20">${e.user}</span>
            <span class="text-sm text-slate-700 dark:text-zinc-300">${e.action}</span>
          </div>
        `,
        )}
      </div>
      <span slot="footer">
        <kb-button variant="ghost" size="sm">EXPORT</kb-button>
        <kb-button variant="outline" size="sm">CLOSE</kb-button>
      </span>
    </kb-modal>
  `,
};

export const FocusTrap: S = {
  render: () => html`
    <kb-modal open size="md" trap-focus auto-focus>
      <span slot="header">CREATE WEBHOOK</span>
      <div class="space-y-4">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Endpoint URL</label>
          <kb-input placeholder="https://your-server.com/webhook" variant="outline" size="sm" type="url"></kb-input>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Description</label>
          <kb-input placeholder="e.g. Slack notification on deploy" variant="outline" size="sm"></kb-input>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Events</label>
          <kb-select placeholder="Select events..." size="sm" .options=${[
            { label: 'deployment.created', value: 'deployment.created' },
            { label: 'deployment.failed', value: 'deployment.failed' },
            { label: 'build.completed', value: 'build.completed' },
            { label: 'alert.triggered', value: 'alert.triggered' },
          ]}></kb-select>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Secret</label>
          <kb-input placeholder="whsec_..." variant="outline" size="sm" type="password"></kb-input>
        </div>
        <kb-divider></kb-divider>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-slate-900 dark:text-zinc-50">Active</div>
            <div class="text-xs text-slate-400 dark:text-zinc-500">Start delivering events immediately</div>
          </div>
          <kb-switch checked size="sm"></kb-switch>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CANCEL</kb-button>
        <kb-button size="sm">CREATE WEBHOOK</kb-button>
      </span>
    </kb-modal>
  `,
};

export const NoScrollLock: S = {
  render: () => html`
    <div style="height: 2000px; padding: 20px" class="space-y-4">
      <p class="text-sm text-slate-500 dark:text-zinc-400">Scroll the page — the modal stays fixed while background scrolling is allowed.</p>
      ${Array.from(
        { length: 8 },
        (_, i) => html`
        <div class="border border-gray-200 dark:border-zinc-700 p-4">
          <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Section ${String(i + 1).padStart(2, '0')}</div>
          <p class="text-sm text-slate-700 dark:text-zinc-300">Background content that remains scrollable behind the modal panel.</p>
        </div>
      `,
      )}
    </div>
    <kb-modal open size="sm" .lockScroll=${false}>
      <span slot="header">NON-BLOCKING NOTICE</span>
      <p class="text-sm text-slate-500 dark:text-zinc-400">This modal does not lock body scroll. The page behind remains scrollable for reference while you read this notice.</p>
      <span slot="footer">
        <kb-button size="sm">DISMISS</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ConfirmDialog: S = {
  render: () => html`
    <kb-modal open size="sm">
      <span slot="header">DELETE PROJECT</span>
      <div class="space-y-3">
        <p class="text-sm text-slate-700 dark:text-zinc-300">This will permanently delete <strong class="text-slate-900 dark:text-zinc-50">Project Alpha</strong> and all associated data:</p>
        <div class="border border-gray-200 dark:border-zinc-700 p-3 space-y-1.5">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-zinc-400">Deployments</span>
            <span class="font-mono text-slate-900 dark:text-zinc-50">1,847</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-zinc-400">Environment variables</span>
            <span class="font-mono text-slate-900 dark:text-zinc-50">23</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-zinc-400">Team members</span>
            <span class="font-mono text-slate-900 dark:text-zinc-50">5</span>
          </div>
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Type "delete project alpha" to confirm</label>
          <kb-input placeholder="delete project alpha" variant="outline" size="sm"></kb-input>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="ghost" size="sm">CANCEL</kb-button>
        <kb-button size="sm" color-scheme="red">DELETE PERMANENTLY</kb-button>
      </span>
    </kb-modal>
  `,
};
