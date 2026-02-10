import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/navigation/kb-tabs.js';

const basicTabs = html`
  <span slot="tab-0">Overview</span>
  <span slot="tab-1">Features</span>
  <span slot="tab-2">Pricing</span>
  <div slot="panel-0"><p>Overview content goes here. This panel contains general information about the product.</p></div>
  <div slot="panel-1"><p>Features list with detailed descriptions of all available functionality.</p></div>
  <div slot="panel-2"><p>Pricing tiers and subscription options for different team sizes.</p></div>
`;

const iconTabs = html`
  <span slot="icon-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg></span>
  <span slot="tab-0">Home</span>
  <span slot="icon-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></span>
  <span slot="tab-1">Profile</span>
  <span slot="icon-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
  <span slot="tab-2">Settings</span>
  <div slot="panel-0"><p>Welcome home. Here is your dashboard overview.</p></div>
  <div slot="panel-1"><p>Your profile information and account details.</p></div>
  <div slot="panel-2"><p>Application settings and preferences.</p></div>
`;

const fiveTabs = html`
  <span slot="tab-0">Dashboard</span>
  <span slot="tab-1">Analytics</span>
  <span slot="tab-2">Reports</span>
  <span slot="tab-3">Users</span>
  <span slot="tab-4">Settings</span>
  <div slot="panel-0"><p>Dashboard overview with key metrics and recent activity.</p></div>
  <div slot="panel-1"><p>Detailed analytics charts and performance data.</p></div>
  <div slot="panel-2"><p>Generated reports and export options.</p></div>
  <div slot="panel-3"><p>User management and access control settings.</p></div>
  <div slot="panel-4"><p>Application configuration and preferences.</p></div>
`;

export default {
  title: 'Navigation/Tabs',
  component: 'kb-tabs',
  render: (args) => html`<kb-tabs ${spreadAttrs(args)}>${basicTabs}</kb-tabs>`,
  args: { variant: 'line', active: 0, size: 'md', 'color-scheme': 'blue', orientation: 'horizontal' },
} satisfies Meta;

type S = StoryObj;

/** Default line variant with sliding blue indicator. */
export const Line: S = {};

/** Enclosed variant with top accent border on active tab. */
export const Enclosed: S = { args: { variant: 'enclosed' } };

/** Solid variant with filled background on active tab. */
export const SolidVariant: S = { args: { variant: 'solid' } };

/** Unstyled variant — only text color changes, no borders or backgrounds. */
export const Unstyled: S = { args: { variant: 'unstyled' } };

/** Fitted tabs stretch to fill the full width. */
export const Fitted: S = { args: { fitted: true } };

/** Second tab active on load. */
export const SecondActive: S = { args: { active: 1 } };

/** All 5 sizes (xs through xl) for the line variant. */
export const AllSizes: S = {
  render: () => html`
    ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(
      (size) => html`
        <div class="mb-8">
          <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-2">${size}</p>
          <kb-tabs variant="line" size=${size}>
            ${basicTabs}
          </kb-tabs>
        </div>
      `,
    )}
  `,
};

/** All 5 color schemes on the line variant. */
export const AllColorSchemes: S = {
  render: () => html`
    ${(['blue', 'red', 'green', 'yellow', 'black'] as const).map(
      (cs) => html`
        <div class="mb-8">
          <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-2">${cs}</p>
          <kb-tabs variant="line" color-scheme=${cs}>
            ${basicTabs}
          </kb-tabs>
        </div>
      `,
    )}
  `,
};

/** Color schemes applied to the solid variant. */
export const SolidColorSchemes: S = {
  render: () => html`
    ${(['blue', 'red', 'green', 'yellow', 'black'] as const).map(
      (cs) => html`
        <div class="mb-8">
          <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-2">solid / ${cs}</p>
          <kb-tabs variant="solid" color-scheme=${cs}>
            ${basicTabs}
          </kb-tabs>
        </div>
      `,
    )}
  `,
};

/** Color schemes applied to the enclosed variant. */
export const EnclosedColorSchemes: S = {
  render: () => html`
    ${(['blue', 'red', 'green', 'yellow', 'black'] as const).map(
      (cs) => html`
        <div class="mb-8">
          <p class="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-2">enclosed / ${cs}</p>
          <kb-tabs variant="enclosed" color-scheme=${cs}>
            ${basicTabs}
          </kb-tabs>
        </div>
      `,
    )}
  `,
};

/** Tabs with leading icons next to labels. */
export const WithIcons: S = {
  render: (args) => html`<kb-tabs ${spreadAttrs(args)}>${iconTabs}</kb-tabs>`,
};

/** Icon tabs at large size. */
export const IconsLarge: S = {
  render: (args) => html`<kb-tabs ${spreadAttrs(args)}>${iconTabs}</kb-tabs>`,
  args: { size: 'lg' },
};

/** Vertical orientation with sliding indicator on the right edge. */
export const Vertical: S = {
  args: { orientation: 'vertical' },
  render: (args) => html`
    <div style="height: 300px;">
      <kb-tabs ${spreadAttrs(args)}>
        ${basicTabs}
      </kb-tabs>
    </div>
  `,
};

/** Vertical enclosed tabs. */
export const VerticalEnclosed: S = {
  args: { orientation: 'vertical', variant: 'enclosed' },
  render: (args) => html`
    <div style="height: 300px;">
      <kb-tabs ${spreadAttrs(args)}>
        ${basicTabs}
      </kb-tabs>
    </div>
  `,
};

/** Vertical solid tabs. */
export const VerticalSolid: S = {
  args: { orientation: 'vertical', variant: 'solid' },
  render: (args) => html`
    <div style="height: 300px;">
      <kb-tabs ${spreadAttrs(args)}>
        ${basicTabs}
      </kb-tabs>
    </div>
  `,
};

/** Disabled tabs (indices 1 and 3) — cannot be clicked or focused via keyboard. */
export const DisabledTabs: S = {
  render: (args) => html`
    <kb-tabs ${spreadAttrs(args)} disabled-tabs="1,3">
      ${fiveTabs}
    </kb-tabs>
  `,
};

/** Tabs aligned to center. */
export const AlignCenter: S = {
  args: { align: 'center' },
};

/** Tabs aligned to end. */
export const AlignEnd: S = {
  args: { align: 'end' },
};

/** Many tabs to demonstrate scrolling/wrapping behavior. */
export const ManyTabs: S = {
  render: (args) => html`
    <kb-tabs ${spreadAttrs(args)}>
      ${fiveTabs}
    </kb-tabs>
  `,
};

/** Kitchen sink: vertical, icons, green color scheme, large size. */
export const KitchenSink: S = {
  render: () => html`
    <div style="height: 350px;">
      <kb-tabs variant="line" size="lg" color-scheme="green" orientation="vertical">
        ${iconTabs}
      </kb-tabs>
    </div>
  `,
};
