import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-alert-dialog.define.js';
import '../../src/components/forms/kb-button.define.js';
import '../../src/components/forms/kb-input.define.js';
import '../../src/components/feedback/kb-badge.define.js';

export default {
  title: 'Overlay/AlertDialog',
  component: 'kb-alert-dialog',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-alert-dialog open size="sm">
      <span slot="header">DELETE PROJECT</span>
      <p class="text-sm text-slate-700 dark:text-zinc-300">This action cannot be undone. All data associated with <strong class="text-slate-900 dark:text-zinc-50">Project Alpha</strong> will be permanently removed.</p>
      <span slot="footer">
        <kb-button variant="outline" size="sm" data-action="cancel">CANCEL</kb-button>
        <kb-button size="sm" color-scheme="red" data-action="confirm">DELETE</kb-button>
      </span>
    </kb-alert-dialog>
  `,
};

export const DangerousAction: S = {
  render: () => html`
    <kb-alert-dialog open size="md">
      <span slot="header">REVOKE ALL API KEYS</span>
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <kb-badge color-scheme="red" variant="solid" size="xs">DESTRUCTIVE</kb-badge>
          <span class="font-mono text-xs text-slate-400 dark:text-zinc-500">Affects 14 active integrations</span>
        </div>
        <p class="text-sm text-slate-700 dark:text-zinc-300">Revoking all API keys will immediately disconnect every active integration. Services depending on these keys will stop functioning until new keys are issued.</p>
        <div class="border border-gray-200 dark:border-zinc-700 p-3 space-y-1.5">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-zinc-400">Active keys</span>
            <span class="font-mono text-slate-900 dark:text-zinc-50">14</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-zinc-400">Connected services</span>
            <span class="font-mono text-slate-900 dark:text-zinc-50">8</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-zinc-400">Last rotation</span>
            <span class="font-mono text-slate-900 dark:text-zinc-50">47 days ago</span>
          </div>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="ghost" size="sm" data-action="cancel">KEEP KEYS</kb-button>
        <kb-button size="sm" color-scheme="red" data-action="confirm">REVOKE ALL</kb-button>
      </span>
    </kb-alert-dialog>
  `,
};

export const ConfirmOnly: S = {
  render: () => html`
    <kb-alert-dialog open size="xs">
      <span slot="header">TERMS UPDATED</span>
      <p class="text-sm text-slate-600 dark:text-zinc-300">Our Terms of Service have been updated effective March 1, 2026. Continued use constitutes acceptance.</p>
      <span slot="footer">
        <kb-button size="sm" data-action="confirm">I AGREE</kb-button>
      </span>
    </kb-alert-dialog>
  `,
};

export const WithInputConfirmation: S = {
  render: () => html`
    <kb-alert-dialog open size="sm">
      <span slot="header">DROP DATABASE</span>
      <div class="space-y-3">
        <p class="text-sm text-slate-700 dark:text-zinc-300">This will permanently delete the <strong class="text-slate-900 dark:text-zinc-50">production</strong> database and all 2.4M records. This cannot be undone.</p>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Type "drop production" to confirm</label>
          <kb-input placeholder="drop production" variant="outline" size="sm"></kb-input>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="ghost" size="sm" data-action="cancel">CANCEL</kb-button>
        <kb-button size="sm" color-scheme="red" data-action="confirm">DROP DATABASE</kb-button>
      </span>
    </kb-alert-dialog>
  `,
};

export const LargeSize: S = {
  render: () => html`
    <kb-alert-dialog open size="lg">
      <span slot="header">CONFIRM MIGRATION</span>
      <div class="space-y-3">
        <p class="text-sm text-slate-700 dark:text-zinc-300">The following schema changes will be applied to the production database. Please review carefully before confirming.</p>
        <div class="border border-gray-200 dark:border-zinc-700 p-3 font-mono text-xs space-y-1">
          <div class="text-green-600 dark:text-green-400">+ ALTER TABLE users ADD COLUMN avatar_url TEXT;</div>
          <div class="text-green-600 dark:text-green-400">+ CREATE INDEX idx_users_avatar ON users(avatar_url);</div>
          <div class="text-red-500">- DROP INDEX idx_users_legacy_email;</div>
          <div class="text-green-600 dark:text-green-400">+ ALTER TABLE sessions ADD COLUMN device_id UUID;</div>
        </div>
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm" data-action="cancel">ABORT</kb-button>
        <kb-button size="sm" data-action="confirm">RUN MIGRATION</kb-button>
      </span>
    </kb-alert-dialog>
  `,
};
