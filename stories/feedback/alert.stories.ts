import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/feedback/kb-alert.js';
import '../../src/components/forms/kb-button.js';
import '../../src/components/navigation/kb-link.js';

export default {
  title: 'Feedback/Alert',
  component: 'kb-alert',
  render: (args) => html`<kb-alert ${spreadAttrs(args)}>This is an alert message.</kb-alert>`,
  args: { status: 'info', variant: 'subtle' },
} satisfies Meta;

type S = StoryObj;

export const Info: S = {};

export const Success: S = { args: { status: 'success' } };

export const Warning: S = { args: { status: 'warning' } };

export const ErrorStatus: S = { args: { status: 'error' } };

export const Solid: S = { args: { variant: 'solid' } };

export const Outline: S = { args: { variant: 'outline' } };

export const LeftAccent: S = { args: { variant: 'left-accent' } };

export const Closable: S = { args: { closable: true } };

export const Small: S = { args: { size: 'sm' } };

export const Large: S = { args: { size: 'lg' } };

export const NoIcon: S = { args: { showIcon: false } };

export const AllStatuses: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-alert status="info">Info: System update available for your workspace.</kb-alert>
      <kb-alert status="success">Success: Deployment completed in 2.4 seconds.</kb-alert>
      <kb-alert status="warning">Warning: API rate limit at 85% capacity.</kb-alert>
      <kb-alert status="error">Error: Connection to database lost.</kb-alert>
    </div>
  `,
};

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-alert status="info" variant="subtle">Subtle variant</kb-alert>
      <kb-alert status="info" variant="outline">Outline variant</kb-alert>
      <kb-alert status="info" variant="solid">Solid variant</kb-alert>
      <kb-alert status="info" variant="left-accent">Left accent variant</kb-alert>
    </div>
  `,
};

export const WithTitle: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-alert status="info" variant="outline">
        <span slot="title">New Version Available</span>
        KarbitUI v2.1.0 includes performance improvements and 3 new components.
      </kb-alert>
      <kb-alert status="error" variant="left-accent" closable>
        <span slot="title">Build Failed</span>
        TypeScript compilation encountered 12 errors across 4 modules.
      </kb-alert>
      <kb-alert status="success" variant="subtle">
        <span slot="title">Pipeline Complete</span>
        All 47 tests passed. Coverage: 94.2%.
      </kb-alert>
      <kb-alert status="warning" variant="solid">
        <span slot="title">Storage Warning</span>
        Disk usage at 92%. Consider archiving old deployments.
      </kb-alert>
    </div>
  `,
};

export const WithActions: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-alert status="error" variant="outline" closable>
        <span slot="title">Deployment Failed</span>
        Pipeline encountered 3 errors during the build phase.
        <span slot="action">
          <kb-button variant="outline" size="xs">VIEW LOGS</kb-button>
          <kb-button variant="ghost" size="xs">RETRY</kb-button>
        </span>
      </kb-alert>
      <kb-alert status="info" variant="subtle">
        <span slot="title">Update Available</span>
        A new version of the CLI is available.
        <span slot="action">
          <kb-link href="#">Install now</kb-link>
        </span>
      </kb-alert>
      <kb-alert status="warning" variant="left-accent" closable>
        Your trial expires in 3 days.
        <span slot="action">
          <kb-button variant="solid" size="xs" color-scheme="yellow">UPGRADE NOW</kb-button>
        </span>
      </kb-alert>
    </div>
  `,
};

export const CollapsibleDetail: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <kb-alert status="error" variant="outline" closable>
        <span slot="title">Build Error</span>
        TypeScript compilation failed with 3 errors.
        <span slot="detail">
          <div style="font-family:monospace;font-size:12px;line-height:1.6;">
            <div>src/api/handler.ts:42 — TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.</div>
            <div>src/api/handler.ts:67 — TS2304: Cannot find name 'RequestContext'.</div>
            <div>src/utils/parse.ts:15 — TS7006: Parameter 'data' implicitly has an 'any' type.</div>
          </div>
        </span>
        <span slot="action">
          <kb-button variant="outline" size="xs">OPEN IN EDITOR</kb-button>
        </span>
      </kb-alert>
      <kb-alert status="warning" variant="subtle">
        <span slot="title">Security Audit</span>
        Found 2 vulnerabilities in dependencies.
        <span slot="detail">
          <div style="font-size:13px;line-height:1.6;">
            <div><strong>high</strong> — lodash@4.17.20: Prototype pollution in zipObjectDeep</div>
            <div><strong>moderate</strong> — axios@0.21.0: Server-Side Request Forgery</div>
          </div>
        </span>
        <span slot="action">
          <kb-button variant="outline" size="xs">RUN FIX</kb-button>
        </span>
      </kb-alert>
      <kb-alert status="info" variant="left-accent">
        <span slot="title">Migration Guide</span>
        Breaking changes in the v3 API require updates to your configuration.
        <span slot="detail">
          <div style="font-size:13px;line-height:1.6;">
            <p>1. Replace <code>config.legacy</code> with <code>config.compat</code></p>
            <p>2. Update all <code>createHandler()</code> calls to use the new signature</p>
            <p>3. Remove deprecated <code>onBeforeRender</code> lifecycle hook</p>
          </div>
        </span>
      </kb-alert>
    </div>
  `,
};

export const AutoDismiss: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="font-family:monospace;font-size:12px;color:#64748b;">These alerts auto-dismiss after 5 seconds:</p>
      <kb-alert status="success" variant="subtle" duration="5000">
        <span slot="title">Changes Saved</span>
        Your configuration has been updated. This alert dismisses in 5s.
      </kb-alert>
      <kb-alert status="info" variant="outline" duration="5000" closable>
        <span slot="title">Sync Complete</span>
        All files synchronized. Dismiss manually or wait 5s.
      </kb-alert>
    </div>
  `,
};

export const ClosableAnimated: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="font-family:monospace;font-size:12px;color:#64748b;">Click the close button to see the animated dismiss:</p>
      <kb-alert status="info" variant="subtle" closable>Dismissible info alert with smooth animation.</kb-alert>
      <kb-alert status="success" variant="outline" closable>Dismissible success alert with smooth animation.</kb-alert>
      <kb-alert status="warning" variant="left-accent" closable>Dismissible warning alert with smooth animation.</kb-alert>
      <kb-alert status="error" variant="solid" closable>Dismissible error alert with smooth animation.</kb-alert>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <kb-alert status="error" variant="outline" closable>
        <span slot="title">Critical: Service Degradation</span>
        The payment processing service is experiencing elevated error rates (12.4% failure rate).
        <span slot="detail">
          <div style="font-size:13px;line-height:1.8;">
            <div><strong>Affected regions:</strong> US-EAST-1, EU-WEST-1</div>
            <div><strong>Start time:</strong> 2026-02-10T14:23:00Z</div>
            <div><strong>Impact:</strong> ~340 failed transactions in the last 15 minutes</div>
            <div><strong>Root cause:</strong> Under investigation — possible upstream provider issue</div>
          </div>
        </span>
        <span slot="action">
          <kb-button variant="outline" size="xs">STATUS PAGE</kb-button>
          <kb-button variant="ghost" size="xs">SUBSCRIBE TO UPDATES</kb-button>
        </span>
      </kb-alert>

      <kb-alert status="success" variant="subtle" closable duration="8000">
        <span slot="title">Deployment Successful</span>
        v2.4.1 deployed to production (3 instances). Auto-dismissing in 8s.
        <span slot="action">
          <kb-link href="#">View deployment logs</kb-link>
        </span>
      </kb-alert>

      <kb-alert status="warning" variant="left-accent">
        <span slot="title">Deprecation Notice</span>
        The <code style="font-family:monospace;font-size:12px;background:rgba(0,0,0,0.06);padding:1px 4px;">v1/users</code> endpoint will be removed on March 1, 2026.
        <span slot="detail">
          <div style="font-size:13px;line-height:1.6;">
            Migrate to <code style="font-family:monospace;font-size:12px;">v2/users</code> which includes pagination, field selection, and improved rate limiting. See the migration guide for a step-by-step walkthrough.
          </div>
        </span>
        <span slot="action">
          <kb-button variant="outline" size="xs">MIGRATION GUIDE</kb-button>
        </span>
      </kb-alert>

      <kb-alert status="info" variant="solid" size="sm">
        <span slot="title">Tip</span>
        Press <kbd style="font-family:monospace;font-size:11px;border:1px solid currentColor;padding:0 4px;opacity:0.7;">Ctrl+K</kbd> to open the command palette.
      </kb-alert>
    </div>
  `,
};
