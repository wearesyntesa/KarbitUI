import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/feedback/kb-spinner.js';

export default {
  title: 'Feedback/Spinner',
  component: 'kb-spinner',
  render: (args) => html`<kb-spinner ${spreadAttrs(args)}></kb-spinner>`,
  args: { size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {};

export const WithTrack: S = { args: { track: true } };

export const Dots: S = { args: { variant: 'dots' } };

export const Bars: S = { args: { variant: 'bars' } };

export const Pulse: S = { args: { variant: 'pulse' } };

export const AllVariants: S = {
  render: () => html`
    <div style="display:flex;gap:32px;align-items:center;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <kb-spinner variant="border" size="lg" color-scheme="blue" track></kb-spinner>
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Border</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <kb-spinner variant="dots" size="lg" color-scheme="blue"></kb-spinner>
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Dots</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <kb-spinner variant="bars" size="lg" color-scheme="blue"></kb-spinner>
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Bars</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <kb-spinner variant="pulse" size="lg" color-scheme="blue"></kb-spinner>
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Pulse</span>
      </div>
    </div>
  `,
};

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;gap:24px;align-items:center;">
      <kb-spinner size="xs"></kb-spinner>
      <kb-spinner size="sm"></kb-spinner>
      <kb-spinner size="md"></kb-spinner>
      <kb-spinner size="lg"></kb-spinner>
      <kb-spinner size="xl"></kb-spinner>
    </div>
    <div style="display:flex;gap:24px;align-items:center;margin-top:24px;">
      <kb-spinner variant="dots" size="xs"></kb-spinner>
      <kb-spinner variant="dots" size="sm"></kb-spinner>
      <kb-spinner variant="dots" size="md"></kb-spinner>
      <kb-spinner variant="dots" size="lg"></kb-spinner>
      <kb-spinner variant="dots" size="xl"></kb-spinner>
    </div>
    <div style="display:flex;gap:24px;align-items:center;margin-top:24px;">
      <kb-spinner variant="bars" size="xs"></kb-spinner>
      <kb-spinner variant="bars" size="sm"></kb-spinner>
      <kb-spinner variant="bars" size="md"></kb-spinner>
      <kb-spinner variant="bars" size="lg"></kb-spinner>
      <kb-spinner variant="bars" size="xl"></kb-spinner>
    </div>
  `,
};

export const ColorSchemes: S = {
  render: () => html`
    <div style="display:flex;gap:24px;align-items:center;">
      <kb-spinner color-scheme="black" track></kb-spinner>
      <kb-spinner color-scheme="red" track></kb-spinner>
      <kb-spinner color-scheme="blue" track></kb-spinner>
      <kb-spinner color-scheme="green" track></kb-spinner>
      <kb-spinner color-scheme="yellow" track></kb-spinner>
    </div>
    <div style="display:flex;gap:24px;align-items:center;margin-top:20px;">
      <kb-spinner variant="dots" color-scheme="black"></kb-spinner>
      <kb-spinner variant="dots" color-scheme="red"></kb-spinner>
      <kb-spinner variant="dots" color-scheme="blue"></kb-spinner>
      <kb-spinner variant="dots" color-scheme="green"></kb-spinner>
      <kb-spinner variant="dots" color-scheme="yellow"></kb-spinner>
    </div>
    <div style="display:flex;gap:24px;align-items:center;margin-top:20px;">
      <kb-spinner variant="bars" color-scheme="black"></kb-spinner>
      <kb-spinner variant="bars" color-scheme="red"></kb-spinner>
      <kb-spinner variant="bars" color-scheme="blue"></kb-spinner>
      <kb-spinner variant="bars" color-scheme="green"></kb-spinner>
      <kb-spinner variant="bars" color-scheme="yellow"></kb-spinner>
    </div>
    <div style="display:flex;gap:24px;align-items:center;margin-top:20px;">
      <kb-spinner variant="pulse" color-scheme="black"></kb-spinner>
      <kb-spinner variant="pulse" color-scheme="red"></kb-spinner>
      <kb-spinner variant="pulse" color-scheme="blue"></kb-spinner>
      <kb-spinner variant="pulse" color-scheme="green"></kb-spinner>
      <kb-spinner variant="pulse" color-scheme="yellow"></kb-spinner>
    </div>
  `,
};

export const Speeds: S = {
  render: () => html`
    <div style="display:flex;gap:32px;align-items:center;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <kb-spinner speed="slow" size="lg" track color-scheme="blue"></kb-spinner>
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Slow</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <kb-spinner speed="normal" size="lg" track color-scheme="blue"></kb-spinner>
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Normal</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <kb-spinner speed="fast" size="lg" track color-scheme="blue"></kb-spinner>
        <span style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Fast</span>
      </div>
    </div>
  `,
};

export const WithLabelBottom: S = {
  render: () => html`
    <div style="display:flex;gap:40px;align-items:start;">
      <kb-spinner size="lg" track color-scheme="blue" show-label label="Loading..."></kb-spinner>
      <kb-spinner variant="dots" size="lg" color-scheme="green" show-label label="Processing..."></kb-spinner>
      <kb-spinner variant="bars" size="lg" color-scheme="red" show-label label="Uploading..."></kb-spinner>
      <kb-spinner variant="pulse" size="lg" color-scheme="yellow" show-label label="Syncing..."></kb-spinner>
    </div>
  `,
};

export const WithLabelRight: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;">
      <kb-spinner size="md" track color-scheme="blue" show-label label="Loading data..." label-position="right"></kb-spinner>
      <kb-spinner variant="dots" size="md" color-scheme="green" show-label label="Processing request..." label-position="right"></kb-spinner>
      <kb-spinner variant="bars" size="md" color-scheme="red" show-label label="Uploading files..." label-position="right"></kb-spinner>
    </div>
  `,
};

export const Overlay: S = {
  render: () => html`
    <div style="display:flex;gap:32px;">
      <kb-spinner overlay variant="border" size="lg" track color-scheme="blue" show-label label="Loading...">
        <div style="width:200px;padding:24px;border:1px solid #e5e7eb;">
          <div style="font-weight:600;margin-bottom:8px;">Card Title</div>
          <div style="font-size:14px;opacity:0.7;">Some content that is loading and will be revealed when ready.</div>
        </div>
      </kb-spinner>
      <kb-spinner overlay variant="dots" size="md" color-scheme="blue" show-label label="Processing...">
        <div style="width:200px;padding:24px;border:1px solid #e5e7eb;">
          <div style="font-weight:600;margin-bottom:8px;">Another Card</div>
          <div style="font-size:14px;opacity:0.7;">This card is being processed with a dots spinner overlay.</div>
        </div>
      </kb-spinner>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:32px;">
      <div style="display:flex;gap:32px;align-items:center;">
        <kb-spinner variant="border" size="xl" track color-scheme="blue" show-label label="Loading"></kb-spinner>
        <kb-spinner variant="dots" size="xl" color-scheme="green" show-label label="Processing"></kb-spinner>
        <kb-spinner variant="bars" size="xl" color-scheme="red" show-label label="Uploading"></kb-spinner>
        <kb-spinner variant="pulse" size="xl" color-scheme="yellow" show-label label="Syncing"></kb-spinner>
      </div>
      <div style="display:flex;gap:24px;align-items:center;">
        <kb-spinner size="sm" speed="fast" track color-scheme="red" show-label label="Urgent" label-position="right"></kb-spinner>
        <kb-spinner variant="dots" size="sm" color-scheme="blue" show-label label="Please wait" label-position="right"></kb-spinner>
        <kb-spinner variant="bars" size="sm" color-scheme="green" show-label label="Almost done" label-position="right"></kb-spinner>
      </div>
      <div style="display:flex;gap:16px;align-items:center;">
        <kb-spinner size="xs" color-scheme="blue" track></kb-spinner>
        <kb-spinner variant="dots" size="xs" color-scheme="red"></kb-spinner>
        <kb-spinner variant="bars" size="xs" color-scheme="green"></kb-spinner>
        <kb-spinner variant="pulse" size="xs" color-scheme="yellow"></kb-spinner>
      </div>
    </div>
  `,
};
