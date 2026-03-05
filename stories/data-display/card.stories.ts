import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/data-display/kb-card.js';

export default {
  title: 'Data Display/Card',
  component: 'kb-card',
} satisfies Meta;

type S = StoryObj;

export const Outline: S = {
  render: () => html`
    <kb-card variant="outline">
      <span slot="header">System overview</span>
      Displays a summary of resource usage across all active services in the
      current deployment environment.
      <span slot="footer">Last updated 2 min ago</span>
    </kb-card>
  `,
};

export const Filled: S = {
  render: () => html`
    <kb-card variant="filled">
      <span slot="header">Diagnostics</span>
      Filled variant provides a muted background to distinguish grouped
      information from the surrounding layout.
    </kb-card>
  `,
};

export const Ghost: S = {
  render: () => html`
    <kb-card variant="ghost">
      <span slot="header">Notes</span>
      Ghost variant has no border or background. Content is structured purely
      through the header and footer separators and padding.
      <span slot="footer">Draft saved</span>
    </kb-card>
  `,
};

export const Interactive: S = {
  render: () => html`
    <kb-card
      interactive
      @kb-click=${() => alert('Card clicked')}
    >
      <span slot="header">View deployment logs</span>
      Interactive cards are focusable and respond to keyboard activation.
      Try pressing Tab to focus, then Enter or Space to activate.
      <span slot="footer">Click or press Enter</span>
    </kb-card>
  `,
};

export const LinkedCard: S = {
  name: 'Linked (href)',
  render: () => html`
    <kb-card href="https://example.com" target="_blank">
      <span slot="header">Documentation</span>
      Cards with an href prop render as anchor elements. This card navigates
      to an external URL when clicked.
      <span slot="footer">Opens in new tab</span>
    </kb-card>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <kb-card size="sm">
        <span slot="header">Small</span>
        Compact padding for dense layouts.
      </kb-card>
      <kb-card size="md">
        <span slot="header">Medium</span>
        Default padding for standard content cards.
      </kb-card>
      <kb-card size="lg">
        <span slot="header">Large</span>
        Generous padding for featured or hero content sections.
      </kb-card>
    </div>
  `,
};

export const CardGrid: S = {
  name: 'Card Grid',
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
      <kb-card interactive @kb-click=${() => alert('Requests')}>
        <span slot="header">Requests</span>
        <div style="font-size:2rem;font-weight:700;letter-spacing:-0.02em;">12,847</div>
        <span slot="footer">+14% from last week</span>
      </kb-card>
      <kb-card interactive @kb-click=${() => alert('Latency')}>
        <span slot="header">Avg latency</span>
        <div style="font-size:2rem;font-weight:700;letter-spacing:-0.02em;">23ms</div>
        <span slot="footer">p99: 142ms</span>
      </kb-card>
      <kb-card interactive @kb-click=${() => alert('Errors')}>
        <span slot="header">Error rate</span>
        <div style="font-size:2rem;font-weight:700;letter-spacing:-0.02em;">0.03%</div>
        <span slot="footer">2 incidents this week</span>
      </kb-card>
    </div>
  `,
};

export const RichContent: S = {
  name: 'Rich Content',
  render: () => html`
    <kb-card size="lg">
      <span slot="header">Service health</span>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-weight:600;">API Gateway</span>
          <span style="font-family:monospace;font-size:12px;color:#22c55e;">OPERATIONAL</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-weight:600;">Database cluster</span>
          <span style="font-family:monospace;font-size:12px;color:#22c55e;">OPERATIONAL</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-weight:600;">Background workers</span>
          <span style="font-family:monospace;font-size:12px;color:#f59e0b;">DEGRADED</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-weight:600;">CDN</span>
          <span style="font-family:monospace;font-size:12px;color:#22c55e;">OPERATIONAL</span>
        </div>
      </div>
      <span slot="footer">Last checked 30 seconds ago</span>
    </kb-card>
  `,
};

export const VariantComparison: S = {
  name: 'Variant Comparison',
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
      <kb-card variant="outline">
        <span slot="header">Outline</span>
        Thin border with surface background. The default structural card
        for most content.
      </kb-card>
      <kb-card variant="filled">
        <span slot="header">Filled</span>
        Muted background with border. Use for secondary content areas
        or grouped information.
      </kb-card>
      <kb-card variant="ghost">
        <span slot="header">Ghost</span>
        No border or background. Content is structured through spacing
        and separator lines only.
      </kb-card>
    </div>
  `,
};
