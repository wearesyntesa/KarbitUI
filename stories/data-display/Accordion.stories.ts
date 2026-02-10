import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/data-display/kb-accordion.js';
import '../../src/components/data-display/kb-accordion-group.js';

export default {
  title: 'Data Display/Accordion',
  component: 'kb-accordion',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-accordion>
      <span slot="trigger">Authentication requirements</span>
      All API requests must include a valid bearer token in the Authorization
      header. Tokens expire after 24 hours and must be refreshed via the
      /auth/refresh endpoint.
    </kb-accordion>
  `,
};

export const Open: S = {
  render: () => html`
    <kb-accordion open>
      <span slot="trigger">Rate limiting policy</span>
      Requests are limited to 1000 per minute per API key. Exceeding this
      threshold returns a 429 status code with a Retry-After header indicating
      when the next request can be made.
    </kb-accordion>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-accordion disabled>
      <span slot="trigger">Deprecated endpoints (locked)</span>
      This section is locked and cannot be toggled.
    </kb-accordion>
  `,
};

export const ExclusiveGroup: S = {
  name: 'Group (Exclusive)',
  render: () => html`
    <kb-accordion-group>
      <kb-accordion open>
        <span slot="trigger">Getting started</span>
        Install the client library with npm or yarn and configure your API
        credentials in a .env file to begin making authenticated requests.
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">Error handling</span>
        All error responses follow a consistent JSON structure with code,
        message, and details fields. Use the code field for programmatic
        error handling.
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">Rate limits</span>
        Standard tier accounts are limited to 1,000 requests per minute.
        Enterprise accounts can request higher limits through the dashboard.
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">Changelog</span>
        Version 2.4 introduces streaming responses and batch request support
        for all collection endpoints. Breaking changes are documented in the
        migration guide.
      </kb-accordion>
    </kb-accordion-group>
  `,
};

export const MultipleGroup: S = {
  name: 'Group (Allow Multiple)',
  render: () => html`
    <kb-accordion-group allow-multiple>
      <kb-accordion open>
        <span slot="trigger">System requirements</span>
        Node.js 18 or later is required. The SDK supports both CommonJS and
        ESM module formats out of the box.
      </kb-accordion>
      <kb-accordion open>
        <span slot="trigger">Installation</span>
        Run npm install @example/sdk to add the package to your project.
        TypeScript types are included — no separate @types package needed.
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">Configuration</span>
        Create a config file at the project root or pass options directly
        to the client constructor. Environment variables take precedence.
      </kb-accordion>
    </kb-accordion-group>
  `,
};

export const RichContent: S = {
  render: () => html`
    <kb-accordion-group>
      <kb-accordion open>
        <span slot="trigger">Endpoint reference</span>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p>The API exposes the following primary endpoints for resource management:</p>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid var(--kb-border, #e5e7eb);">
                <th style="text-align:left;padding:6px 8px;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Method</th>
                <th style="text-align:left;padding:6px 8px;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Path</th>
                <th style="text-align:left;padding:6px 8px;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--kb-border, #e5e7eb);">
                <td style="padding:6px 8px;font-family:monospace;font-size:13px;">GET</td>
                <td style="padding:6px 8px;font-family:monospace;font-size:13px;">/v2/resources</td>
                <td style="padding:6px 8px;font-size:13px;">List all resources</td>
              </tr>
              <tr style="border-bottom:1px solid var(--kb-border, #e5e7eb);">
                <td style="padding:6px 8px;font-family:monospace;font-size:13px;">POST</td>
                <td style="padding:6px 8px;font-family:monospace;font-size:13px;">/v2/resources</td>
                <td style="padding:6px 8px;font-size:13px;">Create a resource</td>
              </tr>
              <tr>
                <td style="padding:6px 8px;font-family:monospace;font-size:13px;">DELETE</td>
                <td style="padding:6px 8px;font-family:monospace;font-size:13px;">/v2/resources/:id</td>
                <td style="padding:6px 8px;font-size:13px;">Delete a resource</td>
              </tr>
            </tbody>
          </table>
        </div>
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">Authentication flow</span>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <p>The OAuth 2.0 authorization code flow is recommended for server-side applications:</p>
          <ol style="padding-left:20px;display:flex;flex-direction:column;gap:4px;">
            <li>Redirect the user to the authorization endpoint</li>
            <li>User grants permission and is redirected back with a code</li>
            <li>Exchange the code for an access token via POST /oauth/token</li>
            <li>Use the access token in the Authorization header for all API calls</li>
          </ol>
        </div>
      </kb-accordion>
    </kb-accordion-group>
  `,
};

export const MixedStates: S = {
  render: () => html`
    <kb-accordion-group>
      <kb-accordion open>
        <span slot="trigger">Active section</span>
        This section is currently expanded and can be toggled freely.
      </kb-accordion>
      <kb-accordion disabled>
        <span slot="trigger">Locked section</span>
        This section is disabled and cannot be toggled.
      </kb-accordion>
      <kb-accordion>
        <span slot="trigger">Collapsed section</span>
        This section starts collapsed but can be opened by clicking.
      </kb-accordion>
    </kb-accordion-group>
  `,
};
