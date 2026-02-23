import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/feedback/kb-toast.js';

type Args = { status?: string; duration?: number; closable?: boolean };

export default {
  title: 'Feedback/Toast',
  component: 'kb-toast',
  render: (args) =>
    html`<kb-toast ${spreadAttrs(args)} style="position:static;">This is a toast notification.</kb-toast>`,
  args: { status: 'info', duration: 0 },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Info: S = {};

export const Success: S = { args: { status: 'success' } };

export const Warning: S = { args: { status: 'warning' } };

export const ErrorStatus: S = { args: { status: 'error' } };

export const WithTitle: S = {
  render: () => html`
    <kb-toast status="success" duration="0" style="position:static;">
      <span slot="title">SAVED</span>
      Your changes have been saved successfully.
    </kb-toast>
  `,
};

export const WithAction: S = {
  render: () => html`
    <kb-toast status="error" duration="0" style="position:static;">
      <span slot="title">DEPLOYMENT FAILED</span>
      Pipeline encountered 3 errors during build phase.
      <span slot="action">
        <button class="font-mono text-xs uppercase tracking-widest underline underline-offset-4 text-red-600 dark:text-red-400 bg-transparent border-none cursor-pointer">RETRY</button>
        <button class="font-mono text-xs uppercase tracking-widest underline underline-offset-4 text-slate-500 dark:text-zinc-400 bg-transparent border-none cursor-pointer">DISMISS</button>
      </span>
    </kb-toast>
  `,
};

export const NoIcon: S = {
  render: () => html`
    <kb-toast status="info" show-icon="false" duration="0" style="position:static;">
      A simple notification without an icon.
    </kb-toast>
  `,
};

export const NotClosable: S = { args: { closable: false } };

export const WithCountdown: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <kb-toast status="info" duration="8000" style="position:static;">
        <span slot="title">INFO</span>
        This toast will dismiss in 8 seconds. Hover to pause.
      </kb-toast>
      <kb-toast status="success" duration="6000" style="position:static;">
        <span slot="title">SUCCESS</span>
        This toast will dismiss in 6 seconds. Hover to pause.
      </kb-toast>
      <kb-toast status="warning" duration="10000" style="position:static;">
        <span slot="title">WARNING</span>
        This toast will dismiss in 10 seconds. Hover to pause.
      </kb-toast>
    </div>
  `,
};

export const AllStatuses: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <kb-toast status="info" duration="0" style="position:static;">
        <span slot="title">INFO</span>
        System update available. Review the changelog for details.
      </kb-toast>
      <kb-toast status="success" duration="0" style="position:static;">
        <span slot="title">SUCCESS</span>
        Build completed. 142 tests passed, 0 failures.
      </kb-toast>
      <kb-toast status="warning" duration="0" style="position:static;">
        <span slot="title">WARNING</span>
        API rate limit at 85%. Reduce request frequency.
      </kb-toast>
      <kb-toast status="error" duration="0" style="position:static;">
        <span slot="title">ERROR</span>
        Connection to database lost. Retrying in 30s.
      </kb-toast>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:420px;">
      <kb-toast status="info" duration="0" style="position:static;">Simple info toast</kb-toast>

      <kb-toast status="success" duration="0" style="position:static;">
        <span slot="title">DEPLOYED</span>
        v2.4.1 is now live on production.
      </kb-toast>

      <kb-toast status="warning" duration="15000" style="position:static;">
        <span slot="title">DISK SPACE LOW</span>
        Server storage at 92% capacity. Free up space soon.
        <span slot="action">
          <button class="font-mono text-xs uppercase tracking-widest underline underline-offset-4 text-yellow-600 dark:text-yellow-400 bg-transparent border-none cursor-pointer">CLEAN UP</button>
        </span>
      </kb-toast>

      <kb-toast status="error" duration="0" closable="false" style="position:static;">
        <span slot="title">CRITICAL</span>
        Unrecoverable error in payment module. Manual intervention required.
      </kb-toast>

      <kb-toast status="success" show-icon="false" duration="0" style="position:static;">
        Minimal toast without icon.
      </kb-toast>
    </div>
  `,
};
