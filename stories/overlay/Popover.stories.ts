import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-popover.js';
import '../../src/components/forms/kb-button.js';

export default {
  title: 'Overlay/Popover',
  component: 'kb-popover',
  args: { placement: 'bottom', trigger: 'click' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="sm">
      <kb-button slot="trigger">CLICK ME</kb-button>
      <span slot="header">OPTIONS</span>
      <p>Popover body content with interactive elements.</p>
    </kb-popover>
  `,
};

export const WithArrow: S = {
  render: () => html`
    <div style="display: flex; gap: 48px; align-items: center; justify-content: center; padding: 120px 80px">
      <kb-popover placement="bottom" trigger="click" size="sm" show-arrow open>
        <kb-button slot="trigger" size="sm">BOTTOM</kb-button>
        <p>Arrow pointing up toward trigger.</p>
      </kb-popover>
      <kb-popover placement="top" trigger="click" size="sm" show-arrow open>
        <kb-button slot="trigger" size="sm">TOP</kb-button>
        <p>Arrow pointing down toward trigger.</p>
      </kb-popover>
      <kb-popover placement="right" trigger="click" size="sm" show-arrow open>
        <kb-button slot="trigger" size="sm">RIGHT</kb-button>
        <p>Arrow pointing left toward trigger.</p>
      </kb-popover>
      <kb-popover placement="left" trigger="click" size="sm" show-arrow open>
        <kb-button slot="trigger" size="sm">LEFT</kb-button>
        <p>Arrow pointing right toward trigger.</p>
      </kb-popover>
    </div>
  `,
};

export const HoverTrigger: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="hover" size="sm" show-arrow>
      <kb-button slot="trigger">HOVER ME</kb-button>
      <p>This popover opens on hover with a 150ms close delay to prevent accidental dismissal.</p>
    </kb-popover>
  `,
};

export const HoverWithDelay: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="hover" size="md" show-arrow open-delay="300" close-delay="200">
      <kb-button slot="trigger">HOVER (300ms DELAY)</kb-button>
      <span slot="header">DELAYED</span>
      <p>Opens after 300ms hover, closes 200ms after mouse leaves. Prevents flickering on quick mouse passes.</p>
    </kb-popover>
  `,
};

export const SizeExtraSmall: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="xs" show-arrow>
      <kb-button slot="trigger" size="sm">XS POPOVER</kb-button>
      <p>Compact popover for brief info.</p>
    </kb-popover>
  `,
};

export const SizeMedium: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="md" show-arrow>
      <kb-button slot="trigger">MD POPOVER</kb-button>
      <span slot="header">MEDIUM</span>
      <p>A medium-sized popover with more room for content and interactive elements.</p>
    </kb-popover>
  `,
};

export const SizeLarge: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="lg" show-arrow>
      <kb-button slot="trigger">LG POPOVER</kb-button>
      <span slot="header">DETAILS</span>
      <p>Large popover suitable for forms, previews, or detailed information panels. Provides generous space for complex content.</p>
    </kb-popover>
  `,
};

export const WithFooter: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="md" show-arrow>
      <kb-button slot="trigger">WITH FOOTER</kb-button>
      <span slot="header">SETTINGS</span>
      <p>Adjust your notification preferences for this project.</p>
      <span slot="footer">
        <kb-button variant="ghost" size="xs">RESET</kb-button>
        <kb-button size="xs">APPLY</kb-button>
      </span>
    </kb-popover>
  `,
};

export const Closable: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="md" closable show-arrow>
      <kb-button slot="trigger">CLOSABLE</kb-button>
      <span slot="header">NOTIFICATION</span>
      <p>This popover has a close button in the header. Click the X to dismiss.</p>
    </kb-popover>
  `,
};

export const ClosableWithFooter: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="md" closable show-arrow>
      <kb-button slot="trigger">FULL FEATURED</kb-button>
      <span slot="header">CONFIRM</span>
      <p>A fully-featured popover with header, close button, body content, and footer actions.</p>
      <span slot="footer">
        <kb-button variant="outline" size="xs">CANCEL</kb-button>
        <kb-button size="xs">SAVE</kb-button>
      </span>
    </kb-popover>
  `,
};

export const PlacementTop: S = {
  render: () => html`
    <div style="margin-top: 180px">
      <kb-popover placement="top" trigger="click" size="sm" show-arrow>
        <kb-button slot="trigger">OPEN TOP</kb-button>
        <span slot="header">TOP POPOVER</span>
        <p>Content appears above the trigger element.</p>
      </kb-popover>
    </div>
  `,
};

export const PlacementLeft: S = {
  render: () => html`
    <div style="margin-left: 300px">
      <kb-popover placement="left" trigger="click" size="sm" show-arrow>
        <kb-button slot="trigger">OPEN LEFT</kb-button>
        <p>Content appears to the left of the trigger.</p>
      </kb-popover>
    </div>
  `,
};

export const PlacementRight: S = {
  render: () => html`
    <kb-popover placement="right" trigger="click" size="sm" show-arrow>
      <kb-button slot="trigger">OPEN RIGHT</kb-button>
      <p>Content appears to the right of the trigger.</p>
    </kb-popover>
  `,
};

export const FocusTrap: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="md" trap-focus auto-focus show-arrow closable>
      <kb-button slot="trigger">FORM POPOVER</kb-button>
      <span slot="header">QUICK EDIT</span>
      <div style="display: flex; flex-direction: column; gap: 6px">
        <input type="text" placeholder="Name" style="padding: 4px 8px; border: 1px solid #e5e7eb; font-size: 13px" />
        <input type="email" placeholder="Email" style="padding: 4px 8px; border: 1px solid #e5e7eb; font-size: 13px" />
      </div>
      <span slot="footer">
        <kb-button size="xs">SAVE</kb-button>
      </span>
    </kb-popover>
  `,
};

export const NoHeaderNoFooter: S = {
  render: () => html`
    <kb-popover placement="bottom" trigger="click" size="sm" show-arrow>
      <kb-button slot="trigger">SIMPLE</kb-button>
      <p>A simple popover with only body content — no header, no footer, no close button.</p>
    </kb-popover>
  `,
};

export const CustomOffset: S = {
  render: () => html`
    <div style="display: flex; gap: 32px; padding: 80px">
      <kb-popover placement="bottom" trigger="click" size="xs" show-arrow offset="0">
        <kb-button slot="trigger" size="sm">OFFSET 0</kb-button>
        <p>No gap.</p>
      </kb-popover>
      <kb-popover placement="bottom" trigger="click" size="xs" show-arrow offset="2">
        <kb-button slot="trigger" size="sm">OFFSET 2</kb-button>
        <p>Default gap.</p>
      </kb-popover>
      <kb-popover placement="bottom" trigger="click" size="xs" show-arrow offset="4">
        <kb-button slot="trigger" size="sm">OFFSET 4</kb-button>
        <p>Large gap.</p>
      </kb-popover>
    </div>
  `,
};
