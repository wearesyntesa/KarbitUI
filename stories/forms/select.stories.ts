import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-select.js';

const frameworkOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'lit', label: 'Lit' },
  { value: 'angular', label: 'Angular' },
];

type Args = { placeholder?: string; size?: string };

export default {
  title: 'Forms/Select',
  component: 'kb-select',
  args: { placeholder: 'Choose a framework', size: 'md' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {
  render: (args) => html`
    <kb-select
      placeholder=${args.placeholder ?? 'Choose a framework'}
      size=${args.size ?? 'md'}
      .options=${frameworkOptions}
    ></kb-select>
  `,
};

export const Outline: S = {
  render: () => html`
    <kb-select variant="outline" placeholder="Outline variant" .options=${frameworkOptions}></kb-select>
  `,
};

export const Filled: S = {
  render: () => html`
    <kb-select variant="filled" placeholder="Filled variant" .options=${frameworkOptions}></kb-select>
  `,
};

export const Flushed: S = {
  render: () => html`
    <kb-select variant="flushed" placeholder="Flushed variant" .options=${frameworkOptions}></kb-select>
  `,
};

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:320px">
      <kb-select variant="outline" placeholder="Outline" .options=${frameworkOptions}></kb-select>
      <kb-select variant="filled" placeholder="Filled" .options=${frameworkOptions}></kb-select>
      <kb-select variant="flushed" placeholder="Flushed" .options=${frameworkOptions}></kb-select>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
      <kb-select size="xs" placeholder="Extra Small" .options=${frameworkOptions}></kb-select>
      <kb-select size="sm" placeholder="Small" .options=${frameworkOptions}></kb-select>
      <kb-select size="md" placeholder="Medium" .options=${frameworkOptions}></kb-select>
      <kb-select size="lg" placeholder="Large" .options=${frameworkOptions}></kb-select>
      <kb-select size="xl" placeholder="Extra Large" .options=${frameworkOptions}></kb-select>
    </div>
  `,
};

export const WithValue: S = {
  render: () => html`
    <kb-select placeholder="Choose..." value="vue" .options=${frameworkOptions}></kb-select>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
      <kb-select disabled placeholder="Disabled empty" .options=${frameworkOptions}></kb-select>
      <kb-select disabled value="react" .options=${frameworkOptions}></kb-select>
    </div>
  `,
};

export const Invalid: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
      <kb-select invalid variant="outline" placeholder="Invalid outline" .options=${frameworkOptions}></kb-select>
      <kb-select invalid variant="filled" placeholder="Invalid filled" .options=${frameworkOptions}></kb-select>
      <kb-select invalid variant="flushed" placeholder="Invalid flushed" .options=${frameworkOptions}></kb-select>
    </div>
  `,
};

export const WithIcon: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
      <kb-select placeholder="Select language" .options=${[
        { value: 'en', label: 'English' },
        { value: 'sv', label: 'Svenska' },
        { value: 'de', label: 'Deutsch' },
        { value: 'fr', label: 'Français' },
      ]}>
        <span slot="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10"/></svg></span>
      </kb-select>
      <kb-select variant="filled" placeholder="Select role" .options=${[
        { value: 'admin', label: 'Administrator' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
      ]}>
        <span slot="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
      </kb-select>
    </div>
  `,
};

export const IconAllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
      ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(
        (size) => html`
        <kb-select size=${size} placeholder="${size} with icon" .options=${frameworkOptions}>
          <span slot="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="8"/></svg></span>
        </kb-select>
      `,
      )}
    </div>
  `,
};

export const Clearable: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
      <kb-select clearable placeholder="Select and clear..." value="react" .options=${frameworkOptions}></kb-select>
      <kb-select clearable placeholder="No value yet" .options=${frameworkOptions}></kb-select>
    </div>
  `,
};

export const Loading: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
      <kb-select loading placeholder="Loading options..." .options=${[]}></kb-select>
      <kb-select loading value="react" .options=${frameworkOptions}></kb-select>
    </div>
  `,
};

export const WithDisabledOption: S = {
  render: () => html`
    <kb-select placeholder="Pick a color" .options=${[
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green', disabled: true },
      { value: 'yellow', label: 'Yellow' },
    ]}></kb-select>
  `,
};

export const OptionGroups: S = {
  render: () => html`
    <kb-select placeholder="Choose a technology" .options=${[
      {
        group: 'Frontend',
        options: [
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'svelte', label: 'Svelte' },
        ],
      },
      {
        group: 'Backend',
        options: [
          { value: 'node', label: 'Node.js' },
          { value: 'deno', label: 'Deno' },
          { value: 'bun', label: 'Bun' },
        ],
      },
      {
        group: 'Database',
        options: [
          { value: 'postgres', label: 'PostgreSQL' },
          { value: 'mysql', label: 'MySQL' },
          { value: 'sqlite', label: 'SQLite', disabled: true },
        ],
      },
    ]}></kb-select>
  `,
};

export const OptionGroupsWithIcon: S = {
  render: () => html`
    <kb-select clearable placeholder="Select stack" .options=${[
      {
        group: 'Languages',
        options: [
          { value: 'ts', label: 'TypeScript' },
          { value: 'rust', label: 'Rust' },
          { value: 'go', label: 'Go' },
        ],
      },
      {
        group: 'Runtimes',
        options: [
          { value: 'node', label: 'Node.js' },
          { value: 'deno', label: 'Deno' },
          { value: 'bun', label: 'Bun' },
        ],
      },
    ]}>
      <span slot="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m8 6 4-4 4 4"/><path d="M12 2v10.3"/><path d="M4 13.5V4a2 2 0 0 1 2-2h2"/><path d="M20 13.5V4a2 2 0 0 0-2-2h-2"/><rect x="2" y="14" width="20" height="8" rx="0"/></svg></span>
    </kb-select>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;max-width:640px">
      <kb-select variant="outline" placeholder="Outline" .options=${frameworkOptions}>
        <span slot="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="8"/></svg></span>
      </kb-select>
      <kb-select variant="filled" placeholder="Filled" .options=${frameworkOptions}>
        <span slot="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="8"/></svg></span>
      </kb-select>
      <kb-select variant="flushed" placeholder="Flushed" .options=${frameworkOptions}></kb-select>
      <kb-select clearable value="vue" placeholder="Clearable" .options=${frameworkOptions}></kb-select>
      <kb-select invalid placeholder="Invalid" .options=${frameworkOptions}></kb-select>
      <kb-select disabled placeholder="Disabled" .options=${frameworkOptions}></kb-select>
      <kb-select loading placeholder="Loading..." .options=${[]}></kb-select>
      <kb-select clearable placeholder="Option groups" .options=${[
        {
          group: 'Frontend',
          options: [
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
          ],
        },
        {
          group: 'Backend',
          options: [
            { value: 'node', label: 'Node.js' },
            { value: 'deno', label: 'Deno' },
          ],
        },
      ]}>
        <span slot="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10"/></svg></span>
      </kb-select>
    </div>
  `,
};
