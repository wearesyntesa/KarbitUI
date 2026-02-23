import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/data-display/kb-list.js';
import '../../src/components/data-display/kb-list-item.js';

export default {
  title: 'Data Display/List',
  component: 'kb-list',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-list>
      <kb-list-item>Configure environment variables</kb-list-item>
      <kb-list-item>Initialize database connection</kb-list-item>
      <kb-list-item>Start application server</kb-list-item>
    </kb-list>
  `,
};

export const WithDividers: S = {
  name: 'With Dividers',
  render: () => html`
    <kb-list dividers>
      <kb-list-item>Configure environment variables</kb-list-item>
      <kb-list-item>Initialize database connection</kb-list-item>
      <kb-list-item>Start application server</kb-list-item>
      <kb-list-item>Run health check</kb-list-item>
    </kb-list>
  `,
};

export const Ordered: S = {
  render: () => html`
    <kb-list variant="ordered" dividers>
      <kb-list-item>Clone the repository</kb-list-item>
      <kb-list-item>Install dependencies with npm install</kb-list-item>
      <kb-list-item>Copy .env.example to .env and configure</kb-list-item>
      <kb-list-item>Run database migrations</kb-list-item>
      <kb-list-item>Start the development server</kb-list-item>
    </kb-list>
  `,
};

export const Interactive: S = {
  render: () => html`
    <kb-list interactive dividers>
      <kb-list-item @kb-click=${() => alert('Dashboard')}>Dashboard</kb-list-item>
      <kb-list-item @kb-click=${() => alert('Analytics')}>Analytics</kb-list-item>
      <kb-list-item @kb-click=${() => alert('Settings')}>Settings</kb-list-item>
      <kb-list-item @kb-click=${() => alert('Logs')}>Deployment logs</kb-list-item>
    </kb-list>
  `,
};

export const LinkedItems: S = {
  name: 'Linked Items',
  render: () => html`
    <kb-list dividers>
      <kb-list-item href="https://example.com/docs">Documentation</kb-list-item>
      <kb-list-item href="https://example.com/api">API reference</kb-list-item>
      <kb-list-item href="https://example.com/changelog">Changelog</kb-list-item>
    </kb-list>
  `,
};

export const WithIcons: S = {
  name: 'With Icons',
  render: () => html`
    <kb-list dividers>
      <kb-list-item>
        <span slot="icon">&#9632;</span>
        API Gateway
        <span slot="trailing" style="font-family:monospace;font-size:11px;color:#22c55e;">OPERATIONAL</span>
      </kb-list-item>
      <kb-list-item>
        <span slot="icon">&#9632;</span>
        Database cluster
        <span slot="trailing" style="font-family:monospace;font-size:11px;color:#22c55e;">OPERATIONAL</span>
      </kb-list-item>
      <kb-list-item>
        <span slot="icon">&#9632;</span>
        Background workers
        <span slot="trailing" style="font-family:monospace;font-size:11px;color:#f59e0b;">DEGRADED</span>
      </kb-list-item>
      <kb-list-item>
        <span slot="icon">&#9632;</span>
        CDN
        <span slot="trailing" style="font-family:monospace;font-size:11px;color:#22c55e;">OPERATIONAL</span>
      </kb-list-item>
    </kb-list>
  `,
};

export const WithSecondaryText: S = {
  name: 'With Secondary Text',
  render: () => html`
    <kb-list dividers>
      <kb-list-item>
        Production deployment
        <span slot="secondary">Deployed 2 hours ago by ci/cd pipeline</span>
      </kb-list-item>
      <kb-list-item>
        Staging deployment
        <span slot="secondary">Deployed 45 minutes ago by dev-team</span>
      </kb-list-item>
      <kb-list-item>
        Preview deployment
        <span slot="secondary">Deployed 10 minutes ago from feature/auth branch</span>
      </kb-list-item>
    </kb-list>
  `,
};

export const NavigationMenu: S = {
  name: 'Navigation Menu',
  render: () => html`
    <div style="max-width:280px;">
      <kb-list interactive>
        <kb-list-item @kb-click=${() => alert('Dashboard')}>
          <span slot="icon">&#8962;</span>
          Dashboard
          <span slot="trailing">&#8250;</span>
        </kb-list-item>
        <kb-list-item @kb-click=${() => alert('Projects')}>
          <span slot="icon">&#9634;</span>
          Projects
          <span slot="trailing">&#8250;</span>
        </kb-list-item>
        <kb-list-item @kb-click=${() => alert('Team')}>
          <span slot="icon">&#9673;</span>
          Team members
          <span slot="trailing">&#8250;</span>
        </kb-list-item>
        <kb-list-item @kb-click=${() => alert('Settings')}>
          <span slot="icon">&#9881;</span>
          Settings
          <span slot="trailing">&#8250;</span>
        </kb-list-item>
        <kb-list-item disabled>
          <span slot="icon">&#128274;</span>
          Admin panel
          <span slot="secondary">Requires elevated permissions</span>
        </kb-list-item>
      </kb-list>
    </div>
  `,
};

export const Spacing: S = {
  render: () => html`
    <div style="display:flex;gap:32px;">
      <div style="flex:1;">
        <div style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;opacity:0.5;">Compact</div>
        <kb-list spacing="compact" dividers>
          <kb-list-item>Item one</kb-list-item>
          <kb-list-item>Item two</kb-list-item>
          <kb-list-item>Item three</kb-list-item>
        </kb-list>
      </div>
      <div style="flex:1;">
        <div style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;opacity:0.5;">Normal</div>
        <kb-list spacing="normal" dividers>
          <kb-list-item>Item one</kb-list-item>
          <kb-list-item>Item two</kb-list-item>
          <kb-list-item>Item three</kb-list-item>
        </kb-list>
      </div>
      <div style="flex:1;">
        <div style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;opacity:0.5;">Loose</div>
        <kb-list spacing="loose" dividers>
          <kb-list-item>Item one</kb-list-item>
          <kb-list-item>Item two</kb-list-item>
          <kb-list-item>Item three</kb-list-item>
        </kb-list>
      </div>
    </div>
  `,
};

export const MixedStates: S = {
  name: 'Mixed States',
  render: () => html`
    <kb-list dividers>
      <kb-list-item interactive @kb-click=${() => alert('Active')}>
        Active item (interactive)
      </kb-list-item>
      <kb-list-item disabled>
        Disabled item (cannot interact)
      </kb-list-item>
      <kb-list-item href="https://example.com">
        Linked item (navigates on click)
      </kb-list-item>
      <kb-list-item>
        Static item (no interaction)
      </kb-list-item>
    </kb-list>
  `,
};
