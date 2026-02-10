import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-modal.js';
import '../../src/components/forms/kb-button.js';

export default {
  title: 'Overlay/Modal',
  component: 'kb-modal',
  args: { open: true, size: 'md' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-modal open size="md">
      <span slot="header">CONFIRM ACTION</span>
      <p>Are you sure you want to proceed? This action cannot be undone.</p>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CANCEL</kb-button>
        <kb-button size="sm">CONFIRM</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ExtraSmall: S = {
  render: () => html`
    <kb-modal open size="xs">
      <span slot="header">QUICK NOTE</span>
      <p>A compact modal for brief messages.</p>
    </kb-modal>
  `,
};

export const Small: S = {
  render: () => html`
    <kb-modal open size="sm">
      <span slot="header">SMALL MODAL</span>
      <p>Compact modal for simple confirmations.</p>
      <span slot="footer">
        <kb-button size="sm">OK</kb-button>
      </span>
    </kb-modal>
  `,
};

export const Large: S = {
  render: () => html`
    <kb-modal open size="lg">
      <span slot="header">LARGE MODAL</span>
      <p>Spacious modal for detailed content and forms. This size is suitable for displaying complex information, multi-step wizards, or detailed data views that require more horizontal space.</p>
      <span slot="footer">
        <kb-button variant="ghost" size="sm">DISCARD</kb-button>
        <kb-button variant="outline" size="sm">SAVE DRAFT</kb-button>
        <kb-button size="sm">PUBLISH</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ExtraLarge: S = {
  render: () => html`
    <kb-modal open size="xl">
      <span slot="header">EXTRA LARGE MODAL</span>
      <p>Very wide modal for data tables, image previews, or side-by-side content comparison.</p>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CLOSE</kb-button>
      </span>
    </kb-modal>
  `,
};

export const FullWidth: S = {
  render: () => html`
    <kb-modal open size="full">
      <span slot="header">FULL WIDTH MODAL</span>
      <p>Full viewport width modal for immersive experiences.</p>
      <span slot="footer">
        <kb-button variant="outline" size="sm">EXIT</kb-button>
      </span>
    </kb-modal>
  `,
};

export const TopPlacement: S = {
  render: () => html`
    <kb-modal open size="md" placement="top">
      <span slot="header">TOP PLACEMENT</span>
      <p>This modal is positioned near the top of the viewport instead of centered. Useful for modals with long or variable-height content that could shift the visual center.</p>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CANCEL</kb-button>
        <kb-button size="sm">OK</kb-button>
      </span>
    </kb-modal>
  `,
};

export const BackdropBlur: S = {
  render: () => html`
    <div>
      <p>Background content visible through blurred backdrop.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
    <kb-modal open size="md" backdrop="blur">
      <span slot="header">BLURRED BACKDROP</span>
      <p>The background content is blurred for a frosted glass effect.</p>
      <span slot="footer">
        <kb-button size="sm">CLOSE</kb-button>
      </span>
    </kb-modal>
  `,
};

export const BackdropTransparent: S = {
  render: () => html`
    <div>
      <p>Background content fully visible through transparent backdrop.</p>
    </div>
    <kb-modal open size="sm" backdrop="transparent">
      <span slot="header">TRANSPARENT BACKDROP</span>
      <p>No overlay dimming — background is fully visible.</p>
      <span slot="footer">
        <kb-button size="sm">OK</kb-button>
      </span>
    </kb-modal>
  `,
};

export const NoFooter: S = {
  render: () => html`
    <kb-modal open size="md">
      <span slot="header">INFORMATION</span>
      <p>This modal has no footer section. The footer only renders when a <code>slot="footer"</code> element is provided.</p>
      <p>Useful for informational dialogs or content previews.</p>
    </kb-modal>
  `,
};

export const NoHeader: S = {
  render: () => html`
    <kb-modal open size="md">
      <p>This modal has no header slot — only the close button appears in the header area.</p>
      <span slot="footer">
        <kb-button size="sm">DISMISS</kb-button>
      </span>
    </kb-modal>
  `,
};

export const NotClosable: S = {
  render: () => html`
    <kb-modal open size="sm" .closable=${false} .closeOnOverlay=${false} .closeOnEscape=${false}>
      <span slot="header">REQUIRED ACTION</span>
      <p>This modal cannot be dismissed by clicking the overlay, pressing Escape, or via a close button. The user must interact with the content to proceed.</p>
      <span slot="footer">
        <kb-button size="sm">I UNDERSTAND</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ScrollableBody: S = {
  render: () => html`
    <kb-modal open size="md">
      <span slot="header">TERMS OF SERVICE</span>
      <div>
        ${Array.from({ length: 20 }, (_, i) => html`
          <p style="margin-bottom: 12px">Section ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        `)}
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm">DECLINE</kb-button>
        <kb-button size="sm">ACCEPT</kb-button>
      </span>
    </kb-modal>
  `,
};

export const FocusTrap: S = {
  render: () => html`
    <kb-modal open size="md" trap-focus auto-focus>
      <span slot="header">FOCUS TRAPPED</span>
      <p>Tab through the interactive elements — focus is trapped within this modal panel.</p>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px">
        <input type="text" placeholder="First name" style="padding: 6px 10px; border: 1px solid #e5e7eb" />
        <input type="text" placeholder="Last name" style="padding: 6px 10px; border: 1px solid #e5e7eb" />
        <input type="email" placeholder="Email" style="padding: 6px 10px; border: 1px solid #e5e7eb" />
      </div>
      <span slot="footer">
        <kb-button variant="outline" size="sm">CANCEL</kb-button>
        <kb-button size="sm">SUBMIT</kb-button>
      </span>
    </kb-modal>
  `,
};

export const NoScrollLock: S = {
  render: () => html`
    <div style="height: 2000px; padding: 20px">
      <p>This page has a tall body. With lock-scroll disabled, you can still scroll the background.</p>
    </div>
    <kb-modal open size="sm" .lockScroll=${false}>
      <span slot="header">SCROLL UNLOCKED</span>
      <p>Body scroll is not locked — the page behind can still scroll.</p>
      <span slot="footer">
        <kb-button size="sm">OK</kb-button>
      </span>
    </kb-modal>
  `,
};

export const ConfirmDialog: S = {
  render: () => html`
    <kb-modal open size="sm">
      <span slot="header">DELETE ITEM</span>
      <p>Are you sure you want to delete this item? This action is permanent and cannot be reversed.</p>
      <span slot="footer">
        <kb-button variant="ghost" size="sm">CANCEL</kb-button>
        <kb-button size="sm" color-scheme="red">DELETE</kb-button>
      </span>
    </kb-modal>
  `,
};
