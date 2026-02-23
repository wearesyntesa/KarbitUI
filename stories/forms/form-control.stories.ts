import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-form-control.js';
import '../../src/components/forms/kb-form-label.js';
import '../../src/components/forms/kb-input.js';
import '../../src/components/forms/kb-textarea.js';
import '../../src/components/forms/kb-select.js';

export default {
  title: 'Forms/FormControl',
  component: 'kb-form-control',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-form-control>
        <kb-form-label>Full Name</kb-form-label>
        <kb-input placeholder="John Doe"></kb-input>
      </kb-form-control>
    </div>
  `,
};

export const Required: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-form-control required>
        <kb-form-label>Email</kb-form-label>
        <kb-input type="email" placeholder="you@example.com"></kb-input>
      </kb-form-control>
    </div>
  `,
};

export const WithHelper: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-form-control>
        <kb-form-label>Email</kb-form-label>
        <kb-input type="email" placeholder="you@example.com"></kb-input>
        <span slot="helper">We'll never share your email.</span>
      </kb-form-control>
    </div>
  `,
};

export const InvalidWithError: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-form-control invalid>
        <kb-form-label>Password</kb-form-label>
        <kb-input type="password" placeholder="Enter password..."></kb-input>
        <span slot="helper">Must be at least 8 characters.</span>
        <span slot="error">Password is too short.</span>
      </kb-form-control>
    </div>
  `,
};

export const WithCounter: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-form-control>
        <kb-form-label>Bio</kb-form-label>
        <kb-textarea placeholder="Tell us about yourself..." rows="3" max-length="200"></kb-textarea>
        <span slot="helper">Keep it brief.</span>
      </kb-form-control>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-form-control disabled>
        <kb-form-label>Locked Field</kb-form-label>
        <kb-input value="Cannot edit"></kb-input>
      </kb-form-control>
    </div>
  `,
};

export const ContextPropagation: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;max-width:400px;">
      <div>
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Required propagates to label + input</strong>
        <kb-form-control required>
          <kb-form-label>Username</kb-form-label>
          <kb-input placeholder="Required automatically"></kb-input>
        </kb-form-control>
      </div>
      <div>
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Invalid propagates to input</strong>
        <kb-form-control invalid>
          <kb-form-label>Email</kb-form-label>
          <kb-input placeholder="Invalid automatically"></kb-input>
          <span slot="error">This field has an error.</span>
        </kb-form-control>
      </div>
      <div>
        <strong style="font-size:14px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;">Disabled propagates to input</strong>
        <kb-form-control disabled>
          <kb-form-label>Code</kb-form-label>
          <kb-input value="Disabled automatically"></kb-input>
        </kb-form-control>
      </div>
    </div>
  `,
};

export const WithSelect: S = {
  render: () => html`
    <div style="max-width:400px;">
      <kb-form-control required>
        <kb-form-label>Country</kb-form-label>
        <kb-select>
          <option value="">Select a country...</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="se">Sweden</option>
        </kb-select>
      </kb-form-control>
    </div>
  `,
};

export const KitchenSink: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;max-width:500px;">
      <kb-form-control required>
        <kb-form-label>
          Email
          <span slot="info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></span>
        </kb-form-label>
        <kb-input type="email" placeholder="you@example.com" clearable>
          <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect width="20" height="16" x="2" y="4"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
        </kb-input>
        <span slot="helper">We'll never share your email.</span>
      </kb-form-control>

      <kb-form-control invalid>
        <kb-form-label>Password</kb-form-label>
        <kb-input type="password" placeholder="Min 8 characters" value="short">
          <span slot="icon-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect width="18" height="11" x="3" y="11"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
        </kb-input>
        <span slot="helper">Must be at least 8 characters.</span>
        <span slot="error">Password is too short.</span>
      </kb-form-control>

      <kb-form-control>
        <kb-form-label optional>Website</kb-form-label>
        <kb-input placeholder="yoursite">
          <span slot="addon-left">https://</span>
          <span slot="addon-right">.com</span>
        </kb-input>
      </kb-form-control>

      <kb-form-control>
        <kb-form-label optional>Bio</kb-form-label>
        <kb-textarea placeholder="Tell us about yourself..." rows="3" max-length="200"></kb-textarea>
        <span slot="helper">Keep it brief and professional.</span>
      </kb-form-control>

      <kb-form-control disabled>
        <kb-form-label>Account ID</kb-form-label>
        <kb-input value="ACC-2024-001" readonly></kb-input>
        <span slot="helper">Auto-generated, cannot be changed.</span>
      </kb-form-control>
    </div>
  `,
};
