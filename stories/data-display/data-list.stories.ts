import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/data-display/kb-data-list.define.js';

export default {
  title: 'DataDisplay/DataList',
  component: 'kb-data-list',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-data-list .items=${[
      { label: 'Name', value: 'Project Alpha' },
      { label: 'Status', value: 'Active' },
      { label: 'Region', value: 'us-east-1' },
      { label: 'Created', value: '2026-01-15' },
    ]}></kb-data-list>
  `,
};

export const Vertical: S = {
  render: () => html`
    <kb-data-list orientation="vertical" .items=${[
      { label: 'Endpoint', value: '/api/v2/users' },
      { label: 'Method', value: 'GET' },
      { label: 'Rate Limit', value: '1,000 req/min' },
      { label: 'Auth', value: 'Bearer Token' },
    ]}></kb-data-list>
  `,
};

export const WithDivider: S = {
  render: () => html`
    <kb-data-list divider .items=${[
      { label: 'Plan', value: 'Pro' },
      { label: 'Billing', value: 'Monthly' },
      { label: 'Next Invoice', value: 'March 1, 2026' },
      { label: 'Amount', value: '$29.00' },
      { label: 'Payment', value: 'Visa ****4242' },
    ]}></kb-data-list>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="space-y-8">
      ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(
        (size) => html`
        <div>
          <div class="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">${size}</div>
          <kb-data-list size=${size} .items=${[
            { label: 'Name', value: 'Alpha' },
            { label: 'Status', value: 'Active' },
            { label: 'Uptime', value: '99.97%' },
          ]}></kb-data-list>
        </div>
      `,
      )}
    </div>
  `,
};

export const ServerDetails: S = {
  render: () => html`
    <div class="border border-gray-200 dark:border-zinc-700 p-4">
      <div class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">SERVER DETAILS</div>
      <kb-data-list divider .items=${[
        { label: 'Hostname', value: 'prod-api-01.syntesa.net' },
        { label: 'IP Address', value: '10.0.42.7' },
        { label: 'OS', value: 'Ubuntu 24.04 LTS' },
        { label: 'CPU', value: '8 vCPU (AMD EPYC)' },
        { label: 'Memory', value: '16 GB DDR5' },
        { label: 'Storage', value: '500 GB NVMe' },
        { label: 'Uptime', value: '47d 12h 33m' },
      ]}></kb-data-list>
    </div>
  `,
};
