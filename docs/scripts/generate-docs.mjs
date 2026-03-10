#!/usr/bin/env node

/**
 * KarbitUI Documentation Generator
 *
 * Reads component source files and story examples to auto-generate:
 * - 78 individual component MDX pages
 * - 78 structured API JSON files
 * - 7 category config files (_category_.json)
 * - sidebars.ts
 * - llms.txt (site index for AI crawlers)
 * - llms-full.txt (all docs concatenated)
 *
 * Usage: node docs/scripts/generate-docs.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {string} */
const ROOT = resolve(__dirname, '../..');
/** @type {string} */
const DOCS_ROOT = resolve(__dirname, '..');
/** @type {string} */
const SRC = join(ROOT, 'src');
/** @type {string} */
const STORIES = join(ROOT, 'stories');
/** @type {string} */
const COMPONENTS_DOCS = join(DOCS_ROOT, 'docs', 'components');
/** @type {string} */
const STATIC = join(DOCS_ROOT, 'static');
/** @type {string} */
const API_DIR = join(STATIC, 'api');

/**
 * Dialog-type overlays that have no built-in trigger slot and block the page
 * when `open` is set.  For these tags, the live preview strips `open` and
 * injects a trigger button via ComponentPreview's `overlayTag` prop.
 *
 * Other overlays (popover, tooltip, hover-card) already have trigger
 * slots / wrapping patterns, so they don't need this treatment.
 */
const DIALOG_OVERLAY_TAGS = new Set(['kb-modal', 'kb-drawer', 'kb-alert-dialog', 'kb-toast']);

// ─── Component Registry ────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   slug: string;
 *   tag: string;
 *   name: string;
 *   category: string;
 *   categoryLabel: string;
 *   description: string;
 *   reactName: string;
 *   related: string[];
 *   usageHtml: string;
 * }} ComponentEntry
 */

/** @type {readonly ComponentEntry[]} */
const REGISTRY = [
  // ── Forms (25) ──────────────────────────────────────────────────────────────
  {
    slug: 'button', tag: 'kb-button', name: 'Button', category: 'forms', categoryLabel: 'Forms',
    description: 'A clickable button element for triggering actions and submitting forms.',
    reactName: 'Button', related: ['button-group', 'icon-button'],
    usageHtml: '<kb-button variant="solid">Click me</kb-button>',
  },
  {
    slug: 'button-group', tag: 'kb-button-group', name: 'Button Group', category: 'forms', categoryLabel: 'Forms',
    description: 'Groups multiple buttons together with consistent spacing and optional attached styling.',
    reactName: 'ButtonGroup', related: ['button', 'icon-button'],
    usageHtml: '<kb-button-group>\n  <kb-button>One</kb-button>\n  <kb-button>Two</kb-button>\n  <kb-button>Three</kb-button>\n</kb-button-group>',
  },
  {
    slug: 'icon-button', tag: 'kb-icon-button', name: 'Icon Button', category: 'forms', categoryLabel: 'Forms',
    description: 'A button that displays only an icon, with an accessible label.',
    reactName: 'IconButton', related: ['button', 'button-group'],
    usageHtml: '<kb-icon-button label="Settings">\n  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">\n    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>\n    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>\n  </svg>\n</kb-icon-button>',
  },
  {
    slug: 'input', tag: 'kb-input', name: 'Input', category: 'forms', categoryLabel: 'Forms',
    description: 'A text input field for capturing single-line user input.',
    reactName: 'Input', related: ['textarea', 'number-input', 'form-control'],
    usageHtml: '<kb-input placeholder="Enter your name"></kb-input>',
  },
  {
    slug: 'textarea', tag: 'kb-textarea', name: 'Textarea', category: 'forms', categoryLabel: 'Forms',
    description: 'A multi-line text input for longer form content.',
    reactName: 'Textarea', related: ['input', 'form-control'],
    usageHtml: '<kb-textarea placeholder="Write a message..." rows="4"></kb-textarea>',
  },
  {
    slug: 'number-input', tag: 'kb-number-input', name: 'Number Input', category: 'forms', categoryLabel: 'Forms',
    description: 'A numeric input with increment and decrement controls.',
    reactName: 'NumberInput', related: ['input', 'slider'],
    usageHtml: '<kb-number-input value="5" min="0" max="100"></kb-number-input>',
  },
  {
    slug: 'pin-input', tag: 'kb-pin-input', name: 'Pin Input', category: 'forms', categoryLabel: 'Forms',
    description: 'A sequence of single-character inputs for PIN or verification codes.',
    reactName: 'PinInput', related: ['input'],
    usageHtml: '<kb-pin-input length="4"></kb-pin-input>',
  },
  {
    slug: 'checkbox', tag: 'kb-checkbox', name: 'Checkbox', category: 'forms', categoryLabel: 'Forms',
    description: 'A toggle control that allows selecting one or more options.',
    reactName: 'Checkbox', related: ['checkbox-group', 'switch', 'radio'],
    usageHtml: '<kb-checkbox>Accept terms</kb-checkbox>',
  },
  {
    slug: 'checkbox-group', tag: 'kb-checkbox-group', name: 'Checkbox Group', category: 'forms', categoryLabel: 'Forms',
    description: 'Groups multiple checkboxes with shared state management.',
    reactName: 'CheckboxGroup', related: ['checkbox', 'radio-group'],
    usageHtml: '<kb-checkbox-group>\n  <kb-checkbox value="a">Option A</kb-checkbox>\n  <kb-checkbox value="b">Option B</kb-checkbox>\n</kb-checkbox-group>',
  },
  {
    slug: 'radio', tag: 'kb-radio', name: 'Radio', category: 'forms', categoryLabel: 'Forms',
    description: 'A single radio option, typically used within a radio group.',
    reactName: 'Radio', related: ['radio-group', 'checkbox', 'segment'],
    usageHtml: '<kb-radio name="color" value="red">Red</kb-radio>',
  },
  {
    slug: 'radio-group', tag: 'kb-radio-group', name: 'Radio Group', category: 'forms', categoryLabel: 'Forms',
    description: 'Groups radio buttons for mutually exclusive single selection.',
    reactName: 'RadioGroup', related: ['radio', 'checkbox-group', 'segment'],
    usageHtml: '<kb-radio-group>\n  <kb-radio value="sm">Small</kb-radio>\n  <kb-radio value="md">Medium</kb-radio>\n  <kb-radio value="lg">Large</kb-radio>\n</kb-radio-group>',
  },
  {
    slug: 'switch', tag: 'kb-switch', name: 'Switch', category: 'forms', categoryLabel: 'Forms',
    description: 'A toggle switch for binary on/off selections.',
    reactName: 'Switch', related: ['checkbox'],
    usageHtml: '<kb-switch>Enable notifications</kb-switch>',
  },
  {
    slug: 'select', tag: 'kb-select', name: 'Select', category: 'forms', categoryLabel: 'Forms',
    description: 'A dropdown select menu for choosing from a list of options.',
    reactName: 'Select', related: ['combobox'],
    usageHtml: '<!-- Options are set via JavaScript property -->\n<kb-select placeholder="Choose a fruit"></kb-select>\n\n<script>\n  document.querySelector(\'kb-select\').options = [\n    { value: \'apple\', label: \'Apple\' },\n    { value: \'banana\', label: \'Banana\' },\n  ];\n</script>',
  },
  {
    slug: 'combobox', tag: 'kb-combobox', name: 'Combobox', category: 'forms', categoryLabel: 'Forms',
    description: 'A searchable select with typeahead filtering.',
    reactName: 'Combobox', related: ['select', 'input'],
    usageHtml: '<!-- Options are set via JavaScript property -->\n<kb-combobox placeholder="Search..."></kb-combobox>\n\n<script>\n  document.querySelector(\'kb-combobox\').options = [\n    { value: \'react\', label: \'React\' },\n    { value: \'vue\', label: \'Vue\' },\n    { value: \'svelte\', label: \'Svelte\' },\n  ];\n</script>',
  },
  {
    slug: 'slider', tag: 'kb-slider', name: 'Slider', category: 'forms', categoryLabel: 'Forms',
    description: 'A range slider for selecting numeric values within a range.',
    reactName: 'Slider', related: ['number-input'],
    usageHtml: '<kb-slider value="50" min="0" max="100"></kb-slider>',
  },
  {
    slug: 'rating', tag: 'kb-rating', name: 'Rating', category: 'forms', categoryLabel: 'Forms',
    description: 'A star rating input for collecting user ratings.',
    reactName: 'Rating', related: ['slider'],
    usageHtml: '<kb-rating value="3" max="5"></kb-rating>',
  },
  {
    slug: 'date-picker', tag: 'kb-date-picker', name: 'Date Picker', category: 'forms', categoryLabel: 'Forms',
    description: 'A date selection input with a calendar dropdown.',
    reactName: 'DatePicker', related: ['time-picker', 'input'],
    usageHtml: '<kb-date-picker placeholder="Select a date"></kb-date-picker>',
  },
  {
    slug: 'time-picker', tag: 'kb-time-picker', name: 'Time Picker', category: 'forms', categoryLabel: 'Forms',
    description: 'A time selection input with hour and minute controls.',
    reactName: 'TimePicker', related: ['date-picker', 'input'],
    usageHtml: '<kb-time-picker placeholder="Select a time"></kb-time-picker>',
  },
  {
    slug: 'color-picker', tag: 'kb-color-picker', name: 'Color Picker', category: 'forms', categoryLabel: 'Forms',
    description: 'A color selection input with hue, saturation, and brightness controls.',
    reactName: 'ColorPicker', related: ['input'],
    usageHtml: '<kb-color-picker value="#3b82f6"></kb-color-picker>',
  },
  {
    slug: 'file-upload', tag: 'kb-file-upload', name: 'File Upload', category: 'forms', categoryLabel: 'Forms',
    description: 'A drag-and-drop file upload area with file list preview.',
    reactName: 'FileUpload', related: ['button'],
    usageHtml: '<kb-file-upload accept="image/*"></kb-file-upload>',
  },
  {
    slug: 'editable', tag: 'kb-editable', name: 'Editable', category: 'forms', categoryLabel: 'Forms',
    description: 'An inline-editable text field that toggles between display and edit modes.',
    reactName: 'Editable', related: ['input'],
    usageHtml: '<kb-editable value="Click to edit"></kb-editable>',
  },
  {
    slug: 'tags-input', tag: 'kb-tags-input', name: 'Tags Input', category: 'forms', categoryLabel: 'Forms',
    description: 'An input for adding and removing text tags.',
    reactName: 'TagsInput', related: ['input', 'tag', 'tag-group'],
    usageHtml: '<!-- Values are set via JavaScript property -->\n<kb-tags-input placeholder="Add a tag..."></kb-tags-input>\n\n<script>\n  document.querySelector(\'kb-tags-input\').values = [\'react\', \'vue\'];\n</script>',
  },
  {
    slug: 'segment', tag: 'kb-segment', name: 'Segment', category: 'forms', categoryLabel: 'Forms',
    description: 'A segmented control for toggling between a set of options.',
    reactName: 'Segment', related: ['radio-group', 'tabs'],
    usageHtml: '<!-- Options are set via JavaScript property -->\n<kb-segment></kb-segment>\n\n<script>\n  document.querySelector(\'kb-segment\').options = [\n    { value: \'day\', label: \'Day\' },\n    { value: \'week\', label: \'Week\' },\n    { value: \'month\', label: \'Month\' },\n  ];\n</script>',
  },
  {
    slug: 'form-control', tag: 'kb-form-control', name: 'Form Control', category: 'forms', categoryLabel: 'Forms',
    description: 'A wrapper that provides label, helper text, and error messaging for form fields.',
    reactName: 'FormControl', related: ['form-label', 'input'],
    usageHtml: '<kb-form-control>\n  <kb-form-label>Email</kb-form-label>\n  <kb-input type="email" placeholder="you@example.com"></kb-input>\n</kb-form-control>',
  },
  {
    slug: 'form-label', tag: 'kb-form-label', name: 'Form Label', category: 'forms', categoryLabel: 'Forms',
    description: 'A label element for form controls, with optional required indicator.',
    reactName: 'FormLabel', related: ['form-control'],
    usageHtml: '<kb-form-label required>Username</kb-form-label>',
  },

  // ── Data Display (17) ───────────────────────────────────────────────────────
  {
    slug: 'accordion', tag: 'kb-accordion', name: 'Accordion', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A collapsible content panel for showing and hiding sections of content.',
    reactName: 'Accordion', related: ['accordion-group', 'collapsible'],
    usageHtml: '<kb-accordion>\n  <span slot="trigger">Click to expand</span>\n  This is the accordion content.\n</kb-accordion>',
  },
  {
    slug: 'accordion-group', tag: 'kb-accordion-group', name: 'Accordion Group', category: 'data-display', categoryLabel: 'Data Display',
    description: 'Groups multiple accordions with optional exclusive (single-open) behavior.',
    reactName: 'AccordionGroup', related: ['accordion'],
    usageHtml: '<kb-accordion-group exclusive>\n  <kb-accordion>\n    <span slot="trigger">Section 1</span>\n    Content 1\n  </kb-accordion>\n  <kb-accordion>\n    <span slot="trigger">Section 2</span>\n    Content 2\n  </kb-accordion>\n</kb-accordion-group>',
  },
  {
    slug: 'avatar', tag: 'kb-avatar', name: 'Avatar', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A circular image or initials representing a user or entity.',
    reactName: 'Avatar', related: ['avatar-group'],
    usageHtml: '<kb-avatar name="John Doe" src="https://i.pravatar.cc/150?u=john"></kb-avatar>',
  },
  {
    slug: 'avatar-group', tag: 'kb-avatar-group', name: 'Avatar Group', category: 'data-display', categoryLabel: 'Data Display',
    description: 'Displays a stack of overlapping avatars with an optional overflow indicator.',
    reactName: 'AvatarGroup', related: ['avatar'],
    usageHtml: '<kb-avatar-group max="3">\n  <kb-avatar name="Alice"></kb-avatar>\n  <kb-avatar name="Bob"></kb-avatar>\n  <kb-avatar name="Charlie"></kb-avatar>\n  <kb-avatar name="Diana"></kb-avatar>\n</kb-avatar-group>',
  },
  {
    slug: 'card', tag: 'kb-card', name: 'Card', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A container with header, body, and footer sections for grouping related content.',
    reactName: 'Card', related: [],
    usageHtml: '<kb-card>\n  <div slot="header">Card Title</div>\n  Card body content goes here.\n  <div slot="footer">Card footer</div>\n</kb-card>',
  },
  {
    slug: 'carousel', tag: 'kb-carousel', name: 'Carousel', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A slideshow component for cycling through a series of content panels.',
    reactName: 'Carousel', related: [],
    usageHtml: '<kb-carousel>\n  <div>Slide 1</div>\n  <div>Slide 2</div>\n  <div>Slide 3</div>\n</kb-carousel>',
  },
  {
    slug: 'collapsible', tag: 'kb-collapsible', name: 'Collapsible', category: 'data-display', categoryLabel: 'Data Display',
    description: 'An animated collapse/expand container for toggling content visibility.',
    reactName: 'Collapsible', related: ['accordion'],
    usageHtml: '<kb-button variant="outline" size="sm" onclick="this.nextElementSibling.open = !this.nextElementSibling.open">Toggle Content</kb-button>\n<kb-collapsible open>\n  <div style="padding: 1rem 0;">This content can be collapsed.</div>\n</kb-collapsible>',
  },
  {
    slug: 'data-list', tag: 'kb-data-list', name: 'Data List', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A label-value pair list for displaying structured data.',
    reactName: 'DataList', related: ['list', 'stat'],
    usageHtml: '<!-- Items are set via JavaScript property -->\n<kb-data-list></kb-data-list>\n\n<script>\n  document.querySelector(\'kb-data-list\').items = [\n    { label: \'Name\', value: \'John Doe\' },\n    { label: \'Email\', value: \'john@example.com\' },\n  ];\n</script>',
  },
  {
    slug: 'kbd', tag: 'kb-kbd', name: 'Kbd', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A keyboard key indicator styled as a physical key.',
    reactName: 'Kbd', related: [],
    usageHtml: '<kb-kbd>Ctrl</kb-kbd> + <kb-kbd>C</kb-kbd>',
  },
  {
    slug: 'list', tag: 'kb-list', name: 'List', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A styled list container with consistent spacing between items.',
    reactName: 'List', related: ['list-item'],
    usageHtml: '<kb-list>\n  <kb-list-item>Item 1</kb-list-item>\n  <kb-list-item>Item 2</kb-list-item>\n  <kb-list-item>Item 3</kb-list-item>\n</kb-list>',
  },
  {
    slug: 'list-item', tag: 'kb-list-item', name: 'List Item', category: 'data-display', categoryLabel: 'Data Display',
    description: 'An individual item within a list component.',
    reactName: 'ListItem', related: ['list'],
    usageHtml: '<kb-list dividers>\n  <kb-list-item interactive>\n    <span slot="icon">\u2192</span>\n    Dashboard\n    <span slot="secondary">View system metrics</span>\n  </kb-list-item>\n  <kb-list-item interactive>\n    <span slot="icon">\u2192</span>\n    Settings\n    <span slot="secondary">Manage preferences</span>\n  </kb-list-item>\n  <kb-list-item disabled>\n    <span slot="icon">\u2192</span>\n    Archived\n    <span slot="secondary">Read-only access</span>\n  </kb-list-item>\n</kb-list>',
  },
  {
    slug: 'stat', tag: 'kb-stat', name: 'Stat', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A statistic display with label, value, and optional change indicator.',
    reactName: 'Stat', related: ['data-list'],
    usageHtml: '<kb-stat label="Revenue" value="$45,231" help-text="+20% from last month" indicator="up"></kb-stat>',
  },
  {
    slug: 'table', tag: 'kb-table', name: 'Table', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A data table with sorting, striping, and hover states.',
    reactName: 'Table', related: [],
    usageHtml: '<kb-table>\n  <table>\n    <thead><tr><th>Name</th><th>Role</th></tr></thead>\n    <tbody>\n      <tr><td>Alice</td><td>Engineer</td></tr>\n      <tr><td>Bob</td><td>Designer</td></tr>\n    </tbody>\n  </table>\n</kb-table>',
  },
  {
    slug: 'tag', tag: 'kb-tag', name: 'Tag', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A small label for categorizing or marking items.',
    reactName: 'Tag', related: ['tag-group', 'badge'],
    usageHtml: '<kb-tag>New</kb-tag>',
  },
  {
    slug: 'tag-group', tag: 'kb-tag-group', name: 'Tag Group', category: 'data-display', categoryLabel: 'Data Display',
    description: 'Groups multiple tags with consistent spacing and optional drag-to-reorder.',
    reactName: 'TagGroup', related: ['tag', 'tags-input'],
    usageHtml: '<kb-tag-group>\n  <kb-tag>React</kb-tag>\n  <kb-tag>Vue</kb-tag>\n  <kb-tag>Svelte</kb-tag>\n</kb-tag-group>',
  },
  {
    slug: 'timeline', tag: 'kb-timeline', name: 'Timeline', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A vertical timeline for displaying chronological events.',
    reactName: 'Timeline', related: ['steps'],
    usageHtml: '<!-- Items are set via JavaScript property -->\n<kb-timeline></kb-timeline>\n\n<script>\n  document.querySelector(\'kb-timeline\').items = [\n    { id: \'1\', title: \'Created\', description: \'Issue opened\' },\n    { id: \'2\', title: \'In Progress\', description: \'Work started\' },\n    { id: \'3\', title: \'Done\', description: \'Completed\', active: true },\n  ];\n</script>',
  },
  {
    slug: 'tree-view', tag: 'kb-tree-view', name: 'Tree View', category: 'data-display', categoryLabel: 'Data Display',
    description: 'A hierarchical tree display with expandable/collapsible nodes.',
    reactName: 'TreeView', related: ['accordion', 'list'],
    usageHtml: '<!-- Nodes are set via JavaScript property -->\n<kb-tree-view show-lines show-icons></kb-tree-view>\n\n<script>\n  document.querySelector(\'kb-tree-view\').nodes = [\n    { id: \'1\', label: \'src\', children: [\n      { id: \'2\', label: \'index.ts\' },\n      { id: \'3\', label: \'utils.ts\' },\n    ]},\n  ];\n</script>',
  },

  // ── Feedback (9) ────────────────────────────────────────────────────────────
  {
    slug: 'alert', tag: 'kb-alert', name: 'Alert', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A prominent message banner for conveying status, warnings, or information.',
    reactName: 'Alert', related: ['toast', 'empty-state'],
    usageHtml: '<kb-alert status="info" variant="subtle">\n  <span slot="title">Information</span>\n  This is an informational alert.\n</kb-alert>',
  },
  {
    slug: 'badge', tag: 'kb-badge', name: 'Badge', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A small count or status indicator, typically overlaid on another element.',
    reactName: 'Badge', related: ['tag'],
    usageHtml: '<kb-badge variant="solid" color-scheme="red">3</kb-badge>',
  },
  {
    slug: 'circular-progress', tag: 'kb-circular-progress', name: 'Circular Progress', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A circular progress indicator showing completion percentage.',
    reactName: 'CircularProgress', related: ['progress', 'spinner'],
    usageHtml: '<kb-circular-progress value="75"></kb-circular-progress>',
  },
  {
    slug: 'clipboard', tag: 'kb-clipboard', name: 'Clipboard', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A copy-to-clipboard button with visual feedback.',
    reactName: 'Clipboard', related: [],
    usageHtml: '<kb-clipboard value="npm install @wearesyntesa/karbit-ui"></kb-clipboard>',
  },
  {
    slug: 'empty-state', tag: 'kb-empty-state', name: 'Empty State', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A placeholder displayed when a section has no data.',
    reactName: 'EmptyState', related: ['alert'],
    usageHtml: '<kb-empty-state title="No results" description="Try a different search term."></kb-empty-state>',
  },
  {
    slug: 'progress', tag: 'kb-progress', name: 'Progress', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A horizontal progress bar showing completion percentage.',
    reactName: 'Progress', related: ['circular-progress', 'spinner'],
    usageHtml: '<kb-progress value="60"></kb-progress>',
  },
  {
    slug: 'skeleton', tag: 'kb-skeleton', name: 'Skeleton', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A placeholder loading animation that mimics content layout.',
    reactName: 'Skeleton', related: ['spinner'],
    usageHtml: '<kb-skeleton variant="text" width="200px"></kb-skeleton>',
  },
  {
    slug: 'spinner', tag: 'kb-spinner', name: 'Spinner', category: 'feedback', categoryLabel: 'Feedback',
    description: 'An animated loading indicator.',
    reactName: 'Spinner', related: ['skeleton', 'progress'],
    usageHtml: '<kb-spinner size="md"></kb-spinner>',
  },
  {
    slug: 'toast', tag: 'kb-toast', name: 'Toast', category: 'feedback', categoryLabel: 'Feedback',
    description: 'A temporary notification that appears at the edge of the viewport.',
    reactName: 'Toast', related: ['alert'],
    usageHtml: '<kb-toast status="success" open>\n  Changes saved successfully.\n</kb-toast>',
  },

  // ── Layout (7) ──────────────────────────────────────────────────────────────
  {
    slug: 'box', tag: 'kb-box', name: 'Box', category: 'layout', categoryLabel: 'Layout',
    description: 'A generic container element that accepts all style props.',
    reactName: 'Box', related: ['flex', 'grid'],
    usageHtml: '<kb-box p="4" bg="neutral.100">Content in a box</kb-box>',
  },
  {
    slug: 'container', tag: 'kb-container', name: 'Container', category: 'layout', categoryLabel: 'Layout',
    description: 'A max-width centered container for page content.',
    reactName: 'Container', related: ['box'],
    usageHtml: '<kb-container size="lg">Centered content</kb-container>',
  },
  {
    slug: 'divider', tag: 'kb-divider', name: 'Divider', category: 'layout', categoryLabel: 'Layout',
    description: 'A horizontal or vertical line separator.',
    reactName: 'Divider', related: [],
    usageHtml: '<kb-divider></kb-divider>',
  },
  {
    slug: 'flex', tag: 'kb-flex', name: 'Flex', category: 'layout', categoryLabel: 'Layout',
    description: 'A flexbox layout container with shorthand direction and alignment props.',
    reactName: 'Flex', related: ['box', 'stack', 'grid'],
    usageHtml: '<kb-flex direction="row" align="center" gap="4">\n  <div>Left</div>\n  <div>Right</div>\n</kb-flex>',
  },
  {
    slug: 'grid', tag: 'kb-grid', name: 'Grid', category: 'layout', categoryLabel: 'Layout',
    description: 'A CSS grid layout container.',
    reactName: 'Grid', related: ['flex', 'box'],
    usageHtml: '<kb-grid columns="3" gap="4">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</kb-grid>',
  },
  {
    slug: 'scroll-area', tag: 'kb-scroll-area', name: 'Scroll Area', category: 'layout', categoryLabel: 'Layout',
    description: 'A scrollable container with custom styled scrollbars.',
    reactName: 'ScrollArea', related: ['box'],
    usageHtml: '<kb-scroll-area max-h="200px">\n  <p>Scrollable content...</p>\n</kb-scroll-area>',
  },
  {
    slug: 'stack', tag: 'kb-stack', name: 'Stack', category: 'layout', categoryLabel: 'Layout',
    description: 'A flex column (or row) layout with uniform spacing between children.',
    reactName: 'Stack', related: ['flex', 'box'],
    usageHtml: '<kb-stack gap="4">\n  <div>First</div>\n  <div>Second</div>\n  <div>Third</div>\n</kb-stack>',
  },

  // ── Navigation (6) ──────────────────────────────────────────────────────────
  {
    slug: 'breadcrumb', tag: 'kb-breadcrumb', name: 'Breadcrumb', category: 'navigation', categoryLabel: 'Navigation',
    description: 'A navigation trail showing the current page location within a hierarchy.',
    reactName: 'Breadcrumb', related: ['link'],
    usageHtml: '<!-- Items are set via JavaScript property -->\n<kb-breadcrumb></kb-breadcrumb>\n\n<script>\n  document.querySelector(\'kb-breadcrumb\').items = [\n    { label: \'Home\', href: \'/\' },\n    { label: \'Components\', href: \'/components\' },\n    { label: \'Breadcrumb\' },\n  ];\n</script>',
  },
  {
    slug: 'link', tag: 'kb-link', name: 'Link', category: 'navigation', categoryLabel: 'Navigation',
    description: 'A styled anchor element for navigation.',
    reactName: 'Link', related: ['breadcrumb', 'button'],
    usageHtml: '<kb-link href="https://example.com">Visit Example</kb-link>',
  },
  {
    slug: 'pagination', tag: 'kb-pagination', name: 'Pagination', category: 'navigation', categoryLabel: 'Navigation',
    description: 'A page navigation control for paginated data.',
    reactName: 'Pagination', related: ['table'],
    usageHtml: '<kb-pagination total="100" page="1" per-page="10"></kb-pagination>',
  },
  {
    slug: 'steps', tag: 'kb-steps', name: 'Steps', category: 'navigation', categoryLabel: 'Navigation',
    description: 'A step indicator for multi-step processes.',
    reactName: 'Steps', related: ['step', 'tabs', 'timeline'],
    usageHtml: '<kb-steps current="1">\n  <kb-step label="Account"></kb-step>\n  <kb-step label="Profile"></kb-step>\n  <kb-step label="Review"></kb-step>\n</kb-steps>',
  },
  {
    slug: 'step', tag: 'kb-step', name: 'Step', category: 'navigation', categoryLabel: 'Navigation',
    description: 'An individual step within a steps component.',
    reactName: 'Step', related: ['steps'],
    usageHtml: '<kb-step label="Account Info">\n  <span slot="description">Enter your details</span>\n</kb-step>',
  },
  {
    slug: 'tabs', tag: 'kb-tabs', name: 'Tabs', category: 'navigation', categoryLabel: 'Navigation',
    description: 'A tabbed interface for switching between views.',
    reactName: 'Tabs', related: ['segment'],
    usageHtml: '<kb-tabs>\n  <span slot="tab-0">Tab 1</span>\n  <span slot="tab-1">Tab 2</span>\n  <div slot="panel-0">Panel 1 content</div>\n  <div slot="panel-1">Panel 2 content</div>\n</kb-tabs>',
  },

  // ── Overlay (9) ─────────────────────────────────────────────────────────────
  {
    slug: 'alert-dialog', tag: 'kb-alert-dialog', name: 'Alert Dialog', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A confirmation dialog requiring user acknowledgment before proceeding.',
    reactName: 'AlertDialog', related: ['modal'],
    usageHtml: '<kb-alert-dialog open>\n  <div slot="header">Confirm Delete</div>\n  Are you sure you want to delete this item?\n  <div slot="footer">\n    <kb-button variant="ghost">Cancel</kb-button>\n    <kb-button variant="solid" color-scheme="red">Delete</kb-button>\n  </div>\n</kb-alert-dialog>',
  },
  {
    slug: 'context-menu', tag: 'kb-context-menu', name: 'Context Menu', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A right-click context menu with menu items.',
    reactName: 'ContextMenu', related: ['dropdown-menu', 'menu-item'],
    usageHtml: '<kb-context-menu>\n  <div slot="trigger">Right-click here</div>\n  <kb-menu-item>Cut</kb-menu-item>\n  <kb-menu-item>Copy</kb-menu-item>\n  <kb-menu-item>Paste</kb-menu-item>\n</kb-context-menu>',
  },
  {
    slug: 'drawer', tag: 'kb-drawer', name: 'Drawer', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A sliding panel that overlays from the edge of the viewport.',
    reactName: 'Drawer', related: ['modal'],
    usageHtml: '<kb-drawer open placement="right">\n  <div slot="header">Drawer Title</div>\n  Drawer content goes here.\n  <div slot="footer">\n    <kb-button>Close</kb-button>\n  </div>\n</kb-drawer>',
  },
  {
    slug: 'dropdown-menu', tag: 'kb-dropdown-menu', name: 'Dropdown Menu', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A button-triggered dropdown menu with selectable items.',
    reactName: 'DropdownMenu', related: ['context-menu', 'menu-item', 'popover'],
    usageHtml: '<kb-dropdown-menu>\n  <kb-button slot="trigger">Options</kb-button>\n  <kb-menu-item value="edit">Edit</kb-menu-item>\n  <kb-menu-item value="delete">Delete</kb-menu-item>\n</kb-dropdown-menu>',
  },
  {
    slug: 'hover-card', tag: 'kb-hover-card', name: 'Hover Card', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A card that appears on hover for showing preview content.',
    reactName: 'HoverCard', related: ['tooltip', 'popover'],
    usageHtml: '<kb-hover-card>\n  <kb-link slot="trigger" href="#">Hover over me</kb-link>\n  <p>Preview content displayed on hover.</p>\n</kb-hover-card>',
  },
  {
    slug: 'menu-item', tag: 'kb-menu-item', name: 'Menu Item', category: 'overlay', categoryLabel: 'Overlay',
    description: 'An individual item within a dropdown or context menu.',
    reactName: 'MenuItem', related: ['dropdown-menu', 'context-menu'],
    usageHtml: '<kb-menu-item value="edit">Edit</kb-menu-item>',
  },
  {
    slug: 'modal', tag: 'kb-modal', name: 'Modal', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A dialog overlay for focused content or actions.',
    reactName: 'Modal', related: ['alert-dialog', 'drawer'],
    usageHtml: '<kb-modal open>\n  <div slot="header">Modal Title</div>\n  Modal content goes here.\n  <div slot="footer">\n    <kb-button variant="ghost">Cancel</kb-button>\n    <kb-button variant="solid">Save</kb-button>\n  </div>\n</kb-modal>',
  },
  {
    slug: 'popover', tag: 'kb-popover', name: 'Popover', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A floating panel anchored to a trigger element.',
    reactName: 'Popover', related: ['tooltip', 'dropdown-menu'],
    usageHtml: '<kb-popover>\n  <kb-button slot="trigger">Open Popover</kb-button>\n  <p>Popover content here.</p>\n</kb-popover>',
  },
  {
    slug: 'tooltip', tag: 'kb-tooltip', name: 'Tooltip', category: 'overlay', categoryLabel: 'Overlay',
    description: 'A small floating label that appears on hover or focus.',
    reactName: 'Tooltip', related: ['popover', 'hover-card'],
    usageHtml: '<kb-tooltip label="More information">\n  <kb-button>Hover me</kb-button>\n</kb-tooltip>',
  },

  // ── Typography (5) ──────────────────────────────────────────────────────────
  {
    slug: 'blockquote', tag: 'kb-blockquote', name: 'Blockquote', category: 'typography', categoryLabel: 'Typography',
    description: 'A styled quotation block for highlighting cited content.',
    reactName: 'Blockquote', related: ['text'],
    usageHtml: '<kb-blockquote>The best way to predict the future is to invent it.</kb-blockquote>',
  },
  {
    slug: 'code', tag: 'kb-code', name: 'Code', category: 'typography', categoryLabel: 'Typography',
    description: 'An inline or block code display element with optional syntax highlighting.',
    reactName: 'Code', related: ['kbd'],
    usageHtml: '<kb-code>const x = 42;</kb-code>',
  },
  {
    slug: 'heading', tag: 'kb-heading', name: 'Heading', category: 'typography', categoryLabel: 'Typography',
    description: 'A heading element (h1-h6) with size and weight variants.',
    reactName: 'Heading', related: ['text'],
    usageHtml: '<kb-heading level="2" size="xl">Section Title</kb-heading>',
  },
  {
    slug: 'highlight', tag: 'kb-highlight', name: 'Highlight', category: 'typography', categoryLabel: 'Typography',
    description: 'Highlights matching text within a string for search results.',
    reactName: 'Highlight', related: ['text'],
    usageHtml: '<kb-highlight query="world">Hello world</kb-highlight>',
  },
  {
    slug: 'text', tag: 'kb-text', name: 'Text', category: 'typography', categoryLabel: 'Typography',
    description: 'A general-purpose text element with size, weight, and tone variants.',
    reactName: 'Text', related: ['heading'],
    usageHtml: '<kb-text size="md" tone="secondary">Body text content</kb-text>',
  },
];

// Build a lookup from tag name (e.g. 'kb-button') to its registry entry.
/** @type {Map<string, ComponentEntry>} */
const TAG_TO_ENTRY = new Map();
for (const entry of REGISTRY) {
  TAG_TO_ENTRY.set(entry.tag, entry);
}

/**
 * Extract all unique `<kb-*>` tag names from an HTML string.
 * @param {string} html
 * @returns {string[]}
 */
function extractKbTags(html) {
  const tags = new Set();
  const re = /<(kb-[a-z][a-z0-9-]*)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    tags.add(m[1]);
  }
  return [...tags];
}

/**
 * Given a list of kb-* tag names, return unique require() import paths for
 * their `.define.js` files.
 * @param {string[]} tags
 * @returns {string[]}
 */
function buildDefineImports(tags) {
  const imports = [];
  const seen = new Set();
  for (const tag of tags) {
    const entry = TAG_TO_ENTRY.get(tag);
    if (entry && !seen.has(entry.tag)) {
      seen.add(entry.tag);
      imports.push(`@wearesyntesa/karbit-ui/components/${entry.category}/${entry.tag}.define.js`);
    }
  }
  return imports;
}

/**
 * Pretty-print a single-line HTML string with newlines and indentation.
 * Lightweight: places each tag on its own line and indents by nesting depth.
 * Inline/void elements on the same line as their content are kept together.
 * @param {string} html
 * @returns {string}
 */
function formatHtml(html) {
  // Already multi-line and looks formatted — skip
  if (html.split('\n').length > 3) return html;

  // Void (self-closing) elements that never have closing tags
  const VOID = new Set([
    'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr',
  ]);

  // Tokenise into tags and text runs
  const tokens = [];
  const re = /(<\/?[a-zA-Z][\w-]*(?:\s[^>]*)?\s*\/?>)|([^<]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1]) tokens.push({ type: 'tag', value: m[1] });
    else if (m[2].trim()) tokens.push({ type: 'text', value: m[2].trim() });
  }

  const lines = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type === 'text') {
      lines.push('  '.repeat(depth) + tok.value);
      continue;
    }
    const tag = tok.value;
    const isClosing = tag.startsWith('</');
    const isSelfClosing = tag.endsWith('/>');
    const tagName = (tag.match(/<\/?([a-zA-Z][\w-]*)/) || [])[1]?.toLowerCase() || '';
    const isVoid = VOID.has(tagName);

    if (isClosing) {
      depth = Math.max(0, depth - 1);
      lines.push('  '.repeat(depth) + tag);
    } else if (isSelfClosing || isVoid) {
      lines.push('  '.repeat(depth) + tag);
    } else {
      // Opening tag — check if next token is short text followed by the matching close tag
      // e.g. <kb-button size="md">Click me</kb-button> → keep on one line
      const nextText = tokens[i + 1];
      const nextClose = tokens[i + 2];
      if (
        nextText?.type === 'text' &&
        nextClose?.type === 'tag' &&
        nextClose.value === `</${tagName}>` &&
        (tag.length + nextText.value.length + nextClose.value.length) < 120
      ) {
        lines.push('  '.repeat(depth) + tag + nextText.value + nextClose.value);
        i += 2; // skip text + closing tag
      } else {
        lines.push('  '.repeat(depth) + tag);
        depth++;
      }
    }
  }

  return lines.join('\n');
}

/**
 * Check if usageHtml contains a <script> block (JS-property-bound components).
 * Returns the HTML without script and the script body separately.
 * @param {string} html
 * @returns {{ htmlOnly: string; scriptBody: string | null }}
 */
function splitUsageScript(html) {
  const scriptRe = /<script>[\s\S]*?<\/script>/g;
  const scripts = [];
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    // Extract the JS body inside <script>...</script>
    const body = m[0].replace(/^<script>\s*/, '').replace(/\s*<\/script>$/, '');
    scripts.push(body);
  }
  if (scripts.length === 0) {
    return { htmlOnly: html, scriptBody: null };
  }
  // Also strip HTML comment lines like <!-- Options are set via ... -->
  const htmlOnly = html.replace(scriptRe, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  const scriptBody = scripts.join('\n');
  return { htmlOnly, scriptBody };
}

// ─── Framework Code Generators ────────────────────────────────────────────────

/**
 * Build a lookup from <kb-*> tag name to React wrapper component name.
 * @returns {Map<string, string>}
 */
function buildTagToReactMap() {
  const map = new Map();
  for (const entry of REGISTRY) {
    map.set(entry.tag, entry.reactName);
  }
  return map;
}

/** @type {Map<string, string>} */
const TAG_TO_REACT = buildTagToReactMap();

/**
 * Parse script body into property assignments.
 * Returns array of { tag, property, value } objects.
 * @param {string} scriptBody
 * @returns {{ tag: string; property: string; value: string }[]}
 */
function parseScriptAssignments(scriptBody) {
  const results = [];
  // Match: document.querySelector('kb-*').prop = value;
  const re = /document\.querySelector\(\s*['"]([^'"]+)['"]\s*\)\.(\w+)\s*=\s*([\s\S]+?)\s*;\s*$/gm;
  // For multi-line values, the regex above won't work well. Use a different approach:
  // Split by `document.querySelector` and process each chunk.
  const chunks = scriptBody.split(/(?=document\.querySelector)/);
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const m = /^document\.querySelector\(\s*['"]([^'"]+)['"]\s*\)\.(\w+)\s*=\s*([\s\S]+?)\s*;?\s*$/.exec(trimmed);
    if (m) {
      let value = m[3].trim();
      // Remove trailing semicolon if present
      if (value.endsWith(';')) value = value.slice(0, -1).trim();
      results.push({ tag: m[1], property: m[2], value });
    }
  }
  return results;
}

/**
 * Convert usageHtml to React JSX code.
 * @param {ComponentEntry} entry
 * @param {string} usageHtml
 * @returns {string}
 */
function generateReactCode(entry, usageHtml) {
  const { htmlOnly, scriptBody } = splitUsageScript(usageHtml);

  // Track which React components are used
  const usedReactNames = new Set();

  // Parse script assignments (for components with JS properties)
  const assignments = scriptBody ? parseScriptAssignments(scriptBody) : [];

  // Start with the clean HTML (no scripts, no comments)
  let jsx = htmlOnly;

  // Inject JS properties as JSX attributes on the target elements
  for (const { tag, property, value } of assignments) {
    // Find the opening tag and add the prop before the closing >
    const tagRe = new RegExp(`(<${escapeRegex(tag)})(\\s[^>]*)?(>|\\s*/>)`, 's');
    const match = tagRe.exec(jsx);
    if (match) {
      const attrs = match[2] || '';
      const closing = match[3];
      // Format the value — indent multi-line arrays/objects
      const formattedValue = value.includes('\n')
        ? `{\n${value.split('\n').map(l => '  ' + l).join('\n')}\n}`
        : `{${value}}`;
      jsx = jsx.replace(tagRe, `$1${attrs}\n  ${property}=${formattedValue}${closing === '/>' ? ' />' : closing}`);
    }
  }

  // Replace <kb-*> opening tags with React component names
  jsx = jsx.replace(/<(kb-[\w-]+)/g, (_match, tag) => {
    const reactName = TAG_TO_REACT.get(tag);
    if (reactName) {
      usedReactNames.add(reactName);
      return '<' + reactName;
    }
    return '<' + tag;
  });

  // Replace </kb-*> closing tags
  jsx = jsx.replace(/<\/(kb-[\w-]+)>/g, (_match, tag) => {
    const reactName = TAG_TO_REACT.get(tag);
    return reactName ? `</${reactName}>` : `</${tag}>`;
  });

  // Convert empty elements to self-closing: <Tag ...></Tag> → <Tag ... />
  jsx = jsx.replace(/<(\w+)(\s[^>]*)><\/\1>/g, '<$1$2 />');

  // Build import statement
  const sortedImports = [...usedReactNames].sort();
  const importLine = sortedImports.length > 0
    ? `import { ${sortedImports.join(', ')} } from '@wearesyntesa/karbit-ui/react';`
    : '';

  return (importLine ? importLine + '\n\n' : '') + jsx.trim();
}

/**
 * Convert usageHtml to Vue SFC code.
 * @param {ComponentEntry} _entry
 * @param {string} usageHtml
 * @returns {string}
 */
function generateVueCode(_entry, usageHtml) {
  const { htmlOnly, scriptBody } = splitUsageScript(usageHtml);
  const assignments = scriptBody ? parseScriptAssignments(scriptBody) : [];

  let template = htmlOnly;
  const scriptVars = [];

  // Convert JS property assignments to Vue bindings
  for (const { tag, property, value } of assignments) {
    // Add the variable declaration
    scriptVars.push(`const ${property} = ${value};`);

    // Add :property binding to the element
    const tagRe = new RegExp(`(<${escapeRegex(tag)})(\\s[^>]*)?(>|\\s*/>)`, 's');
    const match = tagRe.exec(template);
    if (match) {
      const attrs = match[2] || '';
      const closing = match[3];
      template = template.replace(tagRe, `$1${attrs} :${property}="${property}"${closing}`);
    }
  }

  // Convert empty elements to self-closing
  template = template.replace(/<(kb-[\w-]+)(\s[^>]*)><\/\1>/g, '<$1$2 />');

  const lines = [];
  lines.push('<script setup>');
  lines.push("import '@wearesyntesa/karbit-ui/define';");
  if (scriptVars.length > 0) {
    lines.push('');
    for (const v of scriptVars) lines.push(v);
  }
  lines.push('</script>');
  lines.push('');
  lines.push('<template>');
  // Indent template content
  for (const line of template.split('\n')) {
    lines.push('  ' + line);
  }
  lines.push('</template>');

  return lines.join('\n');
}

/**
 * Convert usageHtml to Svelte code.
 * @param {ComponentEntry} _entry
 * @param {string} usageHtml
 * @returns {string}
 */
function generateSvelteCode(_entry, usageHtml) {
  const { htmlOnly, scriptBody } = splitUsageScript(usageHtml);
  const assignments = scriptBody ? parseScriptAssignments(scriptBody) : [];

  let markup = htmlOnly;
  const scriptVars = [];

  // Convert JS property assignments to Svelte bindings
  for (const { tag, property, value } of assignments) {
    scriptVars.push(`const ${property} = ${value};`);

    // Add property={variable} binding to the element
    const tagRe = new RegExp(`(<${escapeRegex(tag)})(\\s[^>]*)?(>|\\s*/>)`, 's');
    const match = tagRe.exec(markup);
    if (match) {
      const attrs = match[2] || '';
      const closing = match[3];
      markup = markup.replace(tagRe, `$1${attrs} ${property}={${property}}${closing}`);
    }
  }

  // Convert empty elements to self-closing
  markup = markup.replace(/<(kb-[\w-]+)(\s[^>]*)><\/\1>/g, '<$1$2 />');

  const lines = [];
  lines.push('<script>');
  lines.push("  import '@wearesyntesa/karbit-ui/define';");
  if (scriptVars.length > 0) {
    lines.push('');
    for (const v of scriptVars) lines.push('  ' + v);
  }
  lines.push('</script>');
  lines.push('');
  // Markup at top level (no indentation wrapper needed in Svelte)
  lines.push(markup.trim());

  return lines.join('\n');
}

/**
 * Generate all framework code variants for a story example.
 * Reconstructs a usageHtml-like string from the example HTML + optional setupCode,
 * then passes through the existing framework generators.
 * @param {ComponentEntry} entry
 * @param {string} html
 * @param {string | null} setupCode
 * @returns {{ html: string; react: string; vue: string; svelte: string }}
 */
function generateExampleFrameworkCodes(entry, html, setupCode) {
  // Reconstruct a usageHtml-like string that the framework generators expect
  let usageHtml = html;
  if (setupCode) {
    // Convert container.querySelector → document.querySelector for the generators
    const scriptBody = setupCode.replace(/container\.querySelector\(/g, 'document.querySelector(');
    usageHtml = html + '\n<script>\n' + scriptBody + '\n</script>';
  }

  const reactCode = generateReactCode(entry, usageHtml);
  const vueCode = generateVueCode(entry, usageHtml);
  const svelteCode = generateSvelteCode(entry, usageHtml);

  return { html, react: reactCode, vue: vueCode, svelte: svelteCode };
}

/**
 * Escape special regex characters in a string.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Source File Parsers ───────────────────────────────────────────────────────

/**
 * @typedef {{
 *   name: string;
 *   attribute: string | null;
 *   type: string;
 *   default: string;
 *   reflect: boolean;
 *   description: string;
 * }} PropInfo
 */

/**
 * @typedef {{
 *   name: string;
 *   description: string;
 * }} SlotInfo
 */

/**
 * @typedef {{
 *   name: string;
 *   detail: string;
 *   description: string;
 * }} EventInfo
 */

/**
 * @typedef {{
 *   roles: string[];
 *   ariaAttrs: string[];
 *   keyboardKeys: string[];
 *   isOverlay: boolean;
 * }} A11yInfo
 */

/**
 * @typedef {{
 *   props: PropInfo[];
 *   slots: SlotInfo[];
 *   events: EventInfo[];
 *   classJsdoc: string;
 *   a11y: A11yInfo;
 * }} ParsedComponent
 */

/**
 * Read and parse a component source file.
 * @param {ComponentEntry} entry
 * @returns {ParsedComponent}
 */
function parseComponentSource(entry) {
  const filePath = join(SRC, 'components', entry.category, `${entry.tag}.ts`);

  if (!existsSync(filePath)) {
    console.warn(`  Warning: Source file not found: ${filePath}`);
    return { props: [], slots: [], events: [], classJsdoc: '', a11y: { roles: [], ariaAttrs: [], keyboardKeys: [], isOverlay: false } };
  }

  const source = readFileSync(filePath, 'utf-8');

  const props = extractProps(source);
  const slots = extractSlots(source, entry);
  const events = extractEvents(source);
  const classJsdoc = extractClassJsdoc(source);
  const a11y = extractA11yInfo(source);

  return { props, slots, events, classJsdoc, a11y };
}

/**
 * Extract @property decorated properties from source.
 * @param {string} source
 * @returns {PropInfo[]}
 */
function extractProps(source) {
  /** @type {PropInfo[]} */
  const props = [];

  // Match @property decorators — handles both single-line and multi-line
  const propRegex = /@property\(\{([^}]*)\}\)\s*(?:(?:override|declare)\s+)*(\w+)(\?)?(?::\s*([^=;\n]+?))?(?:\s*=\s*([^;\n]+))?;/g;

  /** @type {RegExpExecArray | null} */
  let match;
  while ((match = propRegex.exec(source)) !== null) {
    const [fullMatch, decoratorArgs, propName, optional, typeAnnotation, defaultValue] = match;

    // Skip private/internal properties
    if (propName.startsWith('_')) continue;

    // Parse decorator arguments
    const attrMatch = /attribute:\s*'([^']+)'/.exec(decoratorArgs);
    const attrFalseMatch = /attribute:\s*false/.exec(decoratorArgs);
    const reflectMatch = /reflect:\s*true/.exec(decoratorArgs);
    const typeMatch = /type:\s*(\w+)/.exec(decoratorArgs);

    /** @type {string | null} */
    let attribute = null;
    if (attrFalseMatch) {
      attribute = null; // JS property only
    } else if (attrMatch) {
      attribute = attrMatch[1];
    } else {
      // Default: camelCase to kebab-case
      attribute = propName.replace(/[A-Z]/g, (/** @type {string} */ c) => `-${c.toLowerCase()}`);
    }

    const litType = typeMatch ? typeMatch[1] : 'String';
    const tsType = typeAnnotation ? typeAnnotation.trim() : litTypeToTs(litType);
    const cleanDefault = defaultValue ? defaultValue.trim().replace(/;$/, '').trim() : (optional ? 'undefined' : '—');

    // Try to find JSDoc comment for this property
    const description = extractPropertyJsdoc(source, fullMatch);

    props.push({
      name: propName,
      attribute,
      type: cleanTsType(tsType),
      default: cleanDefault,
      reflect: Boolean(reflectMatch),
      description,
    });
  }

  return props;
}

/**
 * Map Lit type to TypeScript type name.
 * @param {string} litType
 * @returns {string}
 */
function litTypeToTs(litType) {
  /** @type {Record<string, string>} */
  const map = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    Array: 'Array',
    Object: 'object',
  };
  return map[litType] ?? litType;
}

/**
 * Clean up a TypeScript type for display.
 * @param {string} type
 * @returns {string}
 */
function cleanTsType(type) {
  // Remove import paths
  return type.replace(/import\([^)]+\)\.\s*/g, '').trim();
}

/**
 * Extract the JSDoc comment immediately preceding a specific code location.
 * @param {string} source
 * @param {string} matchedCode
 * @returns {string}
 */
function extractPropertyJsdoc(source, matchedCode) {
  const idx = source.indexOf(matchedCode);
  if (idx < 0) return '';

  // Look backwards from the match for the immediately preceding JSDoc comment.
  // We search in the last 500 chars before the match to find the closest /** ... */ block.
  const searchStart = Math.max(0, idx - 500);
  const before = source.slice(searchStart, idx);

  // Find ALL /** ... */ blocks in the region, take the last one
  const allJsdocs = [...before.matchAll(/\/\*\*\s*([\s\S]*?)\s*\*\//g)];
  if (allJsdocs.length === 0) return '';

  const lastJsdoc = allJsdocs[allJsdocs.length - 1];

  // Ensure no code between the JSDoc end and the @property decorator (only whitespace)
  const jsdocEnd = lastJsdoc.index + lastJsdoc[0].length;
  const gap = before.slice(jsdocEnd);
  if (gap.trim().length > 0) return '';

  return lastJsdoc[1]
    .replace(/^\s*\*\s?/gm, '')
    .replace(/@\w+.*/g, '')
    .trim()
    .split('\n')[0]
    .trim();
}

/**
 * Extract the class-level JSDoc comment.
 * @param {string} source
 * @returns {string}
 */
function extractClassJsdoc(source) {
  const match = /\/\*\*([\s\S]*?)\*\/\s*export\s+class/.exec(source);
  if (!match) return '';
  return match[1]
    .replace(/^\s*\*\s?/gm, '')
    .replace(/@\w+.*/g, '')
    .trim()
    .split('\n')[0]
    .trim();
}

/**
 * Extract accessibility information from component source.
 * Parses roles, aria attributes, keyboard keys, and overlay base extension.
 * @param {string} source
 * @returns {A11yInfo}
 */
function extractA11yInfo(source) {
  /** @type {Set<string>} */
  const roles = new Set();
  /** @type {Set<string>} */
  const ariaAttrs = new Set();
  /** @type {Set<string>} */
  const keys = new Set();

  const isOverlay = /extends\s+KbOverlayBase/.test(source);

  // Roles — static in templates: role="dialog"
  for (const m of source.matchAll(/role="([^"]+)"/g)) {
    const val = m[1];
    // Skip querySelector('[role="..."]') — those are queried, not rendered
    const before = source.slice(Math.max(0, m.index - 20), m.index);
    if (before.includes('[')) continue;
    roles.add(val);
  }

  // Aria attributes — both static and dynamic bindings
  for (const m of source.matchAll(/(aria-[\w-]+)(?:=|\$\{)/g)) {
    ariaAttrs.add(m[1]);
  }
  // Also catch static: aria-label="Pagination"
  for (const m of source.matchAll(/(aria-[\w-]+)="/g)) {
    ariaAttrs.add(m[1]);
  }
  // Filter out aria-hidden (decorative, not meaningful a11y info)
  ariaAttrs.delete('aria-hidden');

  // Keyboard keys — equality checks: e.key === 'Enter'
  for (const m of source.matchAll(/\.key\s*===\s*'([^']+)'/g)) {
    keys.add(m[1] === ' ' ? 'Space' : m[1]);
  }
  // Switch cases: case 'Escape':
  for (const m of source.matchAll(/case\s+'([^']+)'\s*:/g)) {
    // Only include known keyboard key names
    const val = m[1];
    if (/^(Arrow|Escape|Enter|Tab|Home|End|Page| |Backspace|Delete|F\d)/.test(val) || val === ' ') {
      keys.add(val === ' ' ? 'Space' : val);
    }
  }
  // Dynamic key variables (kb-tabs pattern): 'ArrowDown' or 'ArrowRight' in ternaries
  for (const m of source.matchAll(/'(Arrow(?:Up|Down|Left|Right))'/g)) {
    // Only add if this is in a keyboard-handling context (near .key reference)
    const nearby = source.slice(Math.max(0, m.index - 200), m.index + 200);
    if (/\.key|keydown|keyboard/i.test(nearby)) {
      keys.add(m[1]);
    }
  }

  // Overlay components inherit Escape and Tab from KbOverlayBase
  if (isOverlay) {
    keys.add('Escape');
    keys.add('Tab');
  }

  return {
    roles: [...roles].sort(),
    ariaAttrs: [...ariaAttrs].sort(),
    keyboardKeys: [...keys].sort(),
    isOverlay,
  };
}

/**
 * Extract slot names from the KbBaseElement/KbOverlayBase generic parameter and @slot JSDoc tags.
 * @param {string} source
 * @param {ComponentEntry} entry
 * @returns {SlotInfo[]}
 */
function extractSlots(source, entry) {
  /** @type {SlotInfo[]} */
  const slots = [];

  // Extract slot descriptions from @slot JSDoc tags
  /** @type {Map<string, string>} */
  const slotDescriptions = new Map();
  const slotDocRegex = /@slot\s+(\S+)\s*[-\u2013\u2014]\s*(.+)/g;
  /** @type {RegExpExecArray | null} */
  let slotMatch;
  while ((slotMatch = slotDocRegex.exec(source)) !== null) {
    slotDescriptions.set(slotMatch[1], slotMatch[2].trim());
  }

  // Extract named slots from generic parameter: KbBaseElement<'icon-left' | 'icon-right'>
  const genericMatch = /Kb(?:Base|Overlay)(?:Element|Base)<\s*([^>]+)\s*>/.exec(source);
  if (genericMatch) {
    const unionStr = genericMatch[1];
    const slotNames = unionStr.match(/'([^']+)'/g);
    if (slotNames) {
      for (const quoted of slotNames) {
        const name = quoted.replace(/'/g, '');
        slots.push({
          name,
          description: slotDescriptions.get(name) ?? '',
        });
      }
    }
  }

  // Check for default slot usage
  if (source.includes('defaultSlotContent') || source.includes('slot>') || source.includes('<slot')) {
    slots.push({
      name: '(default)',
      description: slotDescriptions.get('default') ?? 'Default content',
    });
  }

  return slots;
}

/**
 * Extract events from this.emit() calls and @fires JSDoc tags.
 * @param {string} source
 * @returns {EventInfo[]}
 */
function extractEvents(source) {
  /** @type {Map<string, EventInfo>} */
  const eventsMap = new Map();

  // Extract @fires JSDoc tags
  const firesRegex = /@fires\s+(\S+)\s*[-\u2013\u2014]?\s*(.*)/g;
  /** @type {RegExpExecArray | null} */
  let firesMatch;
  while ((firesMatch = firesRegex.exec(source)) !== null) {
    const name = firesMatch[1];
    const desc = firesMatch[2].trim();
    eventsMap.set(name, {
      name,
      detail: lookupEventDetail(name),
      description: desc,
    });
  }

  // Extract this.emit('kb-...') calls
  const emitRegex = /this\.emit\(\s*'(kb-[^']+)'/g;
  /** @type {RegExpExecArray | null} */
  let emitMatch;
  while ((emitMatch = emitRegex.exec(source)) !== null) {
    const name = emitMatch[1];
    if (!eventsMap.has(name)) {
      eventsMap.set(name, {
        name,
        detail: lookupEventDetail(name),
        description: '',
      });
    }
  }

  return [...eventsMap.values()];
}

/**
 * Look up the detail type for a known event name from the KbEventDetailMap.
 * @param {string} eventName
 * @returns {string}
 */
function lookupEventDetail(eventName) {
  /** @type {Record<string, string>} */
  const detailMap = {
    'kb-change': '`KbChangeDetail` — discriminated union, narrow via `detail.source`',
    'kb-input': '`{ value: string }`',
    'kb-click': 'none',
    'kb-link-click': '`{ href: string }`',
    'kb-close': '`{ source?: string }` or none',
    'kb-open': '`{ source?: string }` or none',
    'kb-focus': '`{ source?: string }` or none',
    'kb-blur': '`{ source?: string }` or none',
    'kb-clear': '`{ source?: string }` or none',
    'kb-toggle': '`{ open: boolean }`',
    'kb-sort': '`{ column: number, direction: SortDirection }`',
    'kb-row-click': '`{ index: number, row: HTMLTableRowElement }`',
    'kb-tab-change': '`{ index: number, previousIndex: number }`',
    'kb-navigate': '`{ index: number, item: BreadcrumbItem }`',
    'kb-reorder': '`{ order: readonly string[] }`',
    'kb-drag-start': '`{ value: string }`',
    'kb-drag-end': '`{ value: string }`',
    'kb-page-change': '`{ page: number }`',
    'kb-complete': '`{ value: string }`',
    'kb-select': '`{ value: string }`',
    'kb-step-click': '`{ index: number }`',
    'kb-tag-add': '`{ value: string }`',
    'kb-tag-remove': '`{ value: string, index: number }`',
    'kb-file-select': '`{ files: readonly File[] }`',
    'kb-file-remove': '`{ name: string, index: number }`',
    'kb-rating-hover': '`{ value: number }`',
    'kb-color-change': '`{ hex: string, r: number, g: number, b: number, a: number }`',
    'kb-node-toggle': '`{ id: string, expanded: boolean }`',
    'kb-node-select': '`{ id: string, label: string }`',
    'kb-slide-change': '`{ index: number, previousIndex: number }`',
    'kb-timeline-item-click': '`{ index: number, id: string }`',
    'kb-copy': '`{ value: string, success: boolean }`',
    'kb-edit-submit': '`{ value: string, previousValue: string }`',
    'kb-edit-cancel': '`{ value: string }`',
    'kb-confirm': '`{ source: "alert-dialog" }`',
    'kb-cancel': '`{ source: "alert-dialog" }`',
    'kb-scroll': '`{ scrollTop: number, scrollLeft: number }`',
  };
  return detailMap[eventName] ?? '\u2014';
}

// ─── Story Example Parser ─────────────────────────────────────────────────────

/**
 * @typedef {{
 *   varName: string;
 *   humanName: string;
 *   html: string;
 *   needsSetup: boolean;
 *   setupCode: string | null;
 * }} StoryExample
 */

/**
 * Extract the content of a template literal starting at the opening backtick.
 * Handles nested `${...}` expressions (including nested template literals).
 * @param {string} src - Full source string
 * @param {number} pos - Index of the opening backtick
 * @returns {{ content: string; end: number } | null}
 */
function extractTemplateLiteral(src, pos) {
  if (src[pos] !== '`') return null;
  let i = pos + 1;
  let content = '';
  while (i < src.length) {
    const ch = src[i];
    if (ch === '\\') {
      content += ch + (src[i + 1] || '');
      i += 2;
      continue;
    }
    if (ch === '`') {
      return { content, end: i };
    }
    if (ch === '$' && src[i + 1] === '{') {
      // Nested expression — find matching }
      content += '${';
      i += 2;
      let depth = 1;
      while (i < src.length && depth > 0) {
        const c = src[i];
        if (c === '\\') {
          content += c + (src[i + 1] || '');
          i += 2;
          continue;
        }
        if (c === '{') depth++;
        if (c === '}') depth--;
        if (depth > 0) {
          // Handle strings inside expressions
          if (c === "'" || c === '"') {
            content += c;
            i++;
            while (i < src.length && src[i] !== c) {
              if (src[i] === '\\') {
                content += src[i] + (src[i + 1] || '');
                i += 2;
                continue;
              }
              content += src[i];
              i++;
            }
            if (i < src.length) { content += src[i]; i++; }
            continue;
          }
          // Handle nested template literals inside expressions
          if (c === '`') {
            const nested = extractTemplateLiteral(src, i);
            if (nested) {
              content += '`' + nested.content + '`';
              i = nested.end + 1;
              continue;
            }
          }
          content += c;
          i++;
        } else {
          content += '}';
          i++;
        }
      }
      continue;
    }
    content += ch;
    i++;
  }
  return null; // unterminated
}

/**
 * Extract a bracketed expression starting at `${`.
 * Returns the expression body (without ${ and }) and the end index (pointing past `}`).
 * @param {string} src
 * @param {number} pos - Index of the `$` in `${`
 * @returns {{ expr: string; end: number } | null}
 */
function extractExpression(src, pos) {
  if (src[pos] !== '$' || src[pos + 1] !== '{') return null;
  let i = pos + 2;
  let braceDepth = 1;
  let parenDepth = 0;
  let bracketDepth = 0;
  let expr = '';
  while (i < src.length && braceDepth > 0) {
    const c = src[i];
    if (c === '\\') { expr += c + (src[i + 1] || ''); i += 2; continue; }
    if (c === "'" || c === '"') {
      expr += c; i++;
      while (i < src.length && src[i] !== c) {
        if (src[i] === '\\') { expr += src[i] + (src[i + 1] || ''); i += 2; continue; }
        expr += src[i]; i++;
      }
      if (i < src.length) { expr += src[i]; i++; }
      continue;
    }
    if (c === '`') {
      const nested = extractTemplateLiteral(src, i);
      if (nested) { expr += '`' + nested.content + '`'; i = nested.end + 1; continue; }
    }
    if (c === '{') braceDepth++;
    if (c === '(') parenDepth++;
    if (c === '[') bracketDepth++;
    if (c === '}') {
      braceDepth--;
      if (braceDepth === 0) { i++; break; }
    }
    if (c === ')') parenDepth = Math.max(0, parenDepth - 1);
    if (c === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    expr += c;
    i++;
  }
  return { expr: expr.trim(), end: i };
}

/**
 * Convert an args object to a string of HTML attributes.
 * Booleans: true → bare attribute, false → omitted.
 * @param {Record<string, unknown>} args
 * @returns {string}
 */
function attrsToString(args) {
  const parts = [];
  for (const [key, value] of Object.entries(args)) {
    if (key.startsWith('_')) continue;
    const attr = key.replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`);
    if (value === true || value === '') {
      parts.push(attr);
    } else if (value === false || value === undefined || value === null) {
      continue;
    } else {
      parts.push(`${attr}="${String(value)}"`);
    }
  }
  return parts.join(' ');
}

/**
 * Extract top-level `const` variable declarations from a story file.
 * Only captures constants defined before exports (module-level data).
 * @param {string} source
 * @returns {Map<string, string>}
 */
function extractTopLevelVars(source) {
  /** @type {Map<string, string>} */
  const vars = new Map();
  // Match: const NAME = <value>;
  // where <value> can be an array [...] or object {...} or simple expression
  const re = /^(?:const|let)\s+(\w+)\s*=\s*/gm;
  let m;
  while ((m = re.exec(source)) !== null) {
    // Don't capture exports or type definitions
    const lineStart = source.lastIndexOf('\n', m.index) + 1;
    const prefix = source.slice(lineStart, m.index).trim();
    if (prefix === 'export' || prefix === 'export default') continue;

    const name = m[1];
    const valueStart = m.index + m[0].length;
    const firstChar = source[valueStart];

    if (firstChar === '[' || firstChar === '{') {
      // Find matching bracket
      let depth = 1;
      let i = valueStart + 1;
      while (i < source.length && depth > 0) {
        const c = source[i];
        if (c === '\\') { i += 2; continue; }
        if (c === "'" || c === '"' || c === '`') {
          i++;
          while (i < source.length && source[i] !== c) {
            if (source[i] === '\\') i++;
            i++;
          }
          i++;
          continue;
        }
        if (c === '[' || c === '{' || c === '(') depth++;
        if (c === ']' || c === '}' || c === ')') depth--;
        i++;
      }
      vars.set(name, source.slice(valueStart, i).trim());
    } else if (firstChar === "'" || firstChar === '"') {
      // String literal
      let i = valueStart + 1;
      while (i < source.length && source[i] !== firstChar) {
        if (source[i] === '\\') i++;
        i++;
      }
      vars.set(name, source.slice(valueStart, i + 1));
    }
  }
  return vars;
}

/**
 * Remove common leading whitespace from a multi-line string.
 * @param {string} str
 * @returns {string}
 */
function dedent(str) {
  const lines = str.split('\n');
  // Filter to non-empty lines for indent detection
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return str;
  const minIndent = Math.min(...nonEmpty.map((l) => l.match(/^(\s*)/)[0].length));
  return lines.map((l) => l.slice(minIndent)).join('\n').trim();
}

/**
 * Parse default args from the meta `args: { ... }` block.
 * @param {string} source
 * @returns {Record<string, unknown>}
 */
function parseDefaultArgs(source) {
  /** @type {Record<string, unknown>} */
  const args = {};
  // Find args block in the default export (meta)
  const metaMatch = /export\s+default\s*\{[\s\S]*?\}\s*satisfies/m.exec(source);
  if (!metaMatch) return args;
  const metaBlock = metaMatch[0];

  const argsBlockMatch = /\bargs:\s*\{([^}]+)\}/m.exec(metaBlock);
  if (!argsBlockMatch) return args;
  const argsStr = argsBlockMatch[1];
  const argPairs = argsStr.matchAll(/(\w+):\s*(?:'([^']*)'|"([^"]*)"|(\d+(?:\.\d+)?)|(\w+))/g);
  for (const pair of argPairs) {
    const key = pair[1];
    const strVal = pair[2] ?? pair[3];
    const numVal = pair[4];
    const identVal = pair[5];
    if (strVal !== undefined) {
      args[key] = strVal;
    } else if (numVal !== undefined) {
      args[key] = Number(numVal);
    } else if (identVal === 'true') {
      args[key] = true;
    } else if (identVal === 'false') {
      args[key] = false;
    } else if (identVal !== undefined) {
      args[key] = identVal;
    }
  }
  return args;
}

/**
 * Extract the default render template from the meta block.
 * @param {string} source
 * @returns {{ template: string; hasArgs: boolean } | null}
 */
function extractDefaultRender(source) {
  // Find `render:` inside the default export meta block
  const metaMatch = /export\s+default\s*\{/m.exec(source);
  if (!metaMatch) return null;

  // Search for render: within the meta block
  const startSearch = metaMatch.index + metaMatch[0].length;
  // Find the render property
  const renderRe = /\brender:\s*\((\w*)\)\s*=>\s*html\s*`/g;
  renderRe.lastIndex = startSearch;
  const rm = renderRe.exec(source);
  if (!rm) return null;

  // Make sure this render is inside the meta block (before first `export const`)
  const firstExport = source.indexOf('export const', metaMatch.index + 1);
  if (firstExport !== -1 && rm.index > firstExport) return null;

  const hasArgs = rm[1].length > 0;
  const backtickPos = source.indexOf('`', rm.index + rm[0].length - 1);
  const extracted = extractTemplateLiteral(source, backtickPos);
  if (!extracted) return null;

  return { template: extracted.content, hasArgs };
}

/**
 * Find all story export blocks in the source.
 * @param {string} source
 * @returns {{ name: string; block: string; blockStart: number }[]}
 */
function findStoryExports(source) {
  const results = [];
  const re = /export\s+const\s+(\w+)\s*(?::\s*\w+)?\s*=\s*\{/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const name = m[1];
    if (name === 'default' || name === 'meta' || name === 'Meta') continue;

    // Find matching closing brace using bracket counting
    const braceStart = source.indexOf('{', m.index + m[0].length - 1);
    let depth = 1;
    let i = braceStart + 1;
    while (i < source.length && depth > 0) {
      const c = source[i];
      if (c === '\\') { i += 2; continue; }
      if (c === "'" || c === '"') {
        i++;
        while (i < source.length && source[i] !== c) {
          if (source[i] === '\\') i++;
          i++;
        }
        i++;
        continue;
      }
      if (c === '`') {
        const tl = extractTemplateLiteral(source, i);
        if (tl) { i = tl.end + 1; continue; }
      }
      if (c === '{') depth++;
      if (c === '}') depth--;
      i++;
    }
    results.push({ name, block: source.slice(braceStart, i), blockStart: braceStart });
  }
  return results;
}

/**
 * Extract story-specific args from a story block.
 * @param {string} block - The story object literal source
 * @returns {Record<string, unknown>}
 */
function extractStoryArgs(block) {
  /** @type {Record<string, unknown>} */
  const args = {};
  const argsMatch = /\bargs:\s*\{([^}]+)\}/m.exec(block);
  if (!argsMatch) return args;
  const argsStr = argsMatch[1];
  const argPairs = argsStr.matchAll(/(\w+):\s*(?:'([^']*)'|"([^"]*)"|(\d+(?:\.\d+)?)|(\w+))/g);
  for (const pair of argPairs) {
    const key = pair[1];
    const strVal = pair[2] ?? pair[3];
    const numVal = pair[4];
    const identVal = pair[5];
    if (strVal !== undefined) {
      args[key] = strVal;
    } else if (numVal !== undefined) {
      args[key] = Number(numVal);
    } else if (identVal === 'true') {
      args[key] = true;
    } else if (identVal === 'false') {
      args[key] = false;
    } else if (identVal !== undefined) {
      args[key] = identVal;
    }
  }
  return args;
}

/**
 * Process a story's template: resolve expressions, extract JS property bindings.
 * Returns the clean HTML and optional setup code, or null if the story can't be converted.
 * @param {string} rawTemplate - Template literal content (may contain ${...})
 * @param {Record<string, unknown>} mergedArgs - Merged default+story args
 * @param {Map<string, string>} topVars - Top-level variables from the story file
 * @param {string} tag - The component's tag name (e.g. 'kb-select')
 * @returns {{ html: string; needsSetup: boolean; setupCode: string | null } | null}
 */
function processTemplate(rawTemplate, mergedArgs, topVars, tag) {
  let html = rawTemplate;

  // Step 1: Resolve ${spreadAttrs(args)}
  html = html.replace(/\$\{spreadAttrs\(\w+\)\}/g, () => {
    return attrsToString(mergedArgs);
  });

  // Step 2: Resolve ${args.prop ?? 'fallback'} and ${args.prop || 'fallback'}
  // Check if preceded by `=` (attribute context) → wrap in quotes
  html = html.replace(/=\$\{args\.(\w+)\s*(?:\?\?|\|\|)\s*'([^']*)'\}/g, (_, prop, fallback) => {
    const val = mergedArgs[prop];
    const resolved = val !== undefined && val !== null ? String(val) : fallback;
    return `="${resolved}"`;
  });
  // Also handle cases NOT in attribute context (standalone expressions)
  html = html.replace(/\$\{args\.(\w+)\s*(?:\?\?|\|\|)\s*'([^']*)'\}/g, (_, prop, fallback) => {
    const val = mergedArgs[prop];
    return val !== undefined && val !== null ? String(val) : fallback;
  });

  // Step 2b: Resolve ${args.prop ?? "fallback"} (double quotes)
  html = html.replace(/=\$\{args\.(\w+)\s*(?:\?\?|\|\|)\s*"([^"]*)"\}/g, (_, prop, fallback) => {
    const val = mergedArgs[prop];
    const resolved = val !== undefined && val !== null ? String(val) : fallback;
    return `="${resolved}"`;
  });
  html = html.replace(/\$\{args\.(\w+)\s*(?:\?\?|\|\|)\s*"([^"]*)"\}/g, (_, prop, fallback) => {
    const val = mergedArgs[prop];
    return val !== undefined && val !== null ? String(val) : fallback;
  });

  // Step 2c: Resolve bare ${args.prop}
  html = html.replace(/=\$\{args\.(\w+)\}/g, (_, prop) => {
    const val = mergedArgs[prop];
    const resolved = val !== undefined && val !== null ? String(val) : '';
    return `="${resolved}"`;
  });
  html = html.replace(/\$\{args\.(\w+)\}/g, (_, prop) => {
    const val = mergedArgs[prop];
    return val !== undefined && val !== null ? String(val) : '';
  });

  // Step 3: Extract .prop=${expr} bindings → setup code
  /** @type {{ prop: string; value: string; tags: string[] }[]} */
  const propBindings = [];

  // Find all .prop=${...} patterns
  // We need to handle these carefully since the expressions can be complex
  const propBindingRe = /\s*\.(\w+)=\$\{/g;
  let propMatch;
  /** @type {{ start: number; end: number; prop: string; expr: string }[]} */
  const propRanges = [];

  while ((propMatch = propBindingRe.exec(html)) !== null) {
    const prop = propMatch[1];
    const exprStart = html.indexOf('${', propMatch.index + propMatch[0].length - 2);
    const extracted = extractExpression(html, exprStart);
    if (!extracted) continue;

    propRanges.push({
      start: propMatch.index,
      end: extracted.end,
      prop,
      expr: extracted.expr,
    });
  }

  // Process in reverse order so indices stay valid
  /** @type {string[]} */
  const setupLines = [];
  /** @type {Set<string>} */
  const declaredVars = new Set();

  for (let pi = propRanges.length - 1; pi >= 0; pi--) {
    const { start, end, prop, expr } = propRanges[pi];

    // Determine the value for the setup function
    let valueCode = expr;
    // If it's a variable reference, use the top-level var definition
    if (/^\w+$/.test(expr) && topVars.has(expr)) {
      if (!declaredVars.has(expr)) {
        setupLines.unshift(`  const ${expr} = ${topVars.get(expr)};`);
        declaredVars.add(expr);
      }
      valueCode = expr;
    } else if (/^\w+$/.test(expr)) {
      // Unknown variable — can't resolve, skip story
      return null;
    }
    // else: inline expression, use as-is

    // Find which tag this binding is on (search backward for <tag-name)
    const beforeBinding = html.slice(0, start);
    const tagMatch = beforeBinding.match(/<([\w-]+)(?=[^>]*$)/);
    const boundTag = tagMatch ? tagMatch[1] : tag;

    // Check if we already have a setup line for this prop+tag
    const setupKey = `${boundTag}.${prop}`;
    if (!declaredVars.has(setupKey)) {
      setupLines.push(`  container.querySelectorAll('${boundTag}').forEach(el => { el.${prop} = ${valueCode}; });`);
      declaredVars.add(setupKey);
    }

    // Remove the .prop=${...} from the HTML
    html = html.slice(0, start) + html.slice(end);
  }

  // Step 4: Strip @event=${...} Lit event bindings
  const eventBindingRe = /\s*@[\w-]+=\$\{/g;
  let evMatch;
  /** @type {{ start: number; end: number }[]} */
  const eventRanges = [];

  while ((evMatch = eventBindingRe.exec(html)) !== null) {
    const exprStart = html.indexOf('${', evMatch.index + evMatch[0].length - 2);
    const extracted = extractExpression(html, exprStart);
    if (!extracted) continue;
    eventRanges.push({ start: evMatch.index, end: extracted.end });
  }

  for (let ei = eventRanges.length - 1; ei >= 0; ei--) {
    html = html.slice(0, eventRanges[ei].start) + html.slice(eventRanges[ei].end);
  }

  // Step 5: Resolve remaining ${varName} where varName is in topVars (simple string vars)
  html = html.replace(/\$\{(\w+)\}/g, (full, name) => {
    if (topVars.has(name)) {
      const val = topVars.get(name);
      // Only inline if it's a simple string literal
      const strMatch = /^['"](.*)['"]$/.exec(val);
      if (strMatch) return strMatch[1];
    }
    return full; // keep as-is, will be caught by step 6
  });

  // Step 6: Check for remaining unresolvable ${...}
  if (/\$\{/.test(html)) {
    return null; // can't convert this story
  }

  // Step 7: Clean up TypeScript type assertions
  html = html.replace(/\s+as\s+const\b/g, '');

  // Dedent and trim
  html = dedent(html);

  // Clean up empty attribute slots (multiple spaces, trailing spaces in tags).
  // Preserve whitespace inside <kb-code>...</kb-code> blocks (preformatted content).
  const codeBlocks = [];
  html = html.replace(/(<kb-code\b[^>]*>)([\s\S]*?)(<\/kb-code>)/g, (_, open, content, close) => {
    const idx = codeBlocks.length;
    codeBlocks.push(content);
    return `${open}__CODE_BLOCK_${idx}__${close}`;
  });
  html = html.replace(/\s{2,}/g, ' ');
  html = html.replace(/\s+>/g, '>');
  html = html.replace(/\s+\/>/g, ' />');
  // Restore preserved code block contents
  html = html.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => codeBlocks[parseInt(idx)]);

  const needsSetup = setupLines.length > 0;
  const setupCode = needsSetup ? setupLines.join('\n') : null;

  return { html, needsSetup, setupCode };
}

/**
 * Parse story examples from a storybook story file.
 * Returns an array of extractable examples, or null if no story file exists.
 * @param {ComponentEntry} entry
 * @returns {StoryExample[] | null}
 */
function parseStoryExamples(entry) {
  const storyPath = join(STORIES, entry.category, `${entry.slug}.stories.ts`);
  if (!existsSync(storyPath)) return null;

  const source = readFileSync(storyPath, 'utf-8');

  // 1. Extract top-level variables
  const topVars = extractTopLevelVars(source);

  // 2. Extract default meta info
  const defaultArgs = parseDefaultArgs(source);
  const defaultRender = extractDefaultRender(source);

  // 3. Find all story exports
  const storyExports = findStoryExports(source);

  // 4. Process each story
  /** @type {StoryExample[]} */
  const examples = [];

  for (const story of storyExports) {
    // Skip KitchenSink stories — they're redundant combinations
    if (story.name === 'KitchenSink') continue;

    const humanName = story.name.replace(/([A-Z])/g, ' $1').trim();

    // Check if this story has a custom render
    const renderArrowRe = /\brender:\s*\((\w*)\)\s*=>\s*html\s*`/;
    const renderBlockRe = /\brender:\s*\(\s*\)\s*=>\s*\{/;
    const renderArrowMatch = renderArrowRe.exec(story.block);
    const renderBlockMatch = renderBlockRe.exec(story.block);

    let rawTemplate = null;
    let usesArgs = false;

    if (renderBlockMatch && (!renderArrowMatch || renderBlockMatch.index < renderArrowMatch?.index)) {
      // Block function render: () => { ... return html`...`; }
      // Skip — too complex (closures, event handlers, local variables)
      continue;
    } else if (renderArrowMatch) {
      // Arrow function render: (args?) => html`...`
      usesArgs = renderArrowMatch[1].length > 0;
      const backtickIdx = story.block.indexOf('`', renderArrowMatch.index + renderArrowMatch[0].length - 1);
      const globalIdx = source.indexOf(story.block) + backtickIdx;
      const extracted = extractTemplateLiteral(source, globalIdx);
      if (!extracted) continue;
      rawTemplate = extracted.content;
    } else {
      // No custom render — uses default render from meta
      if (!defaultRender) continue;
      rawTemplate = defaultRender.template;
      usesArgs = defaultRender.hasArgs;
    }

    // Merge args: default + story-specific
    const storyArgs = extractStoryArgs(story.block);
    const mergedArgs = { ...defaultArgs, ...storyArgs };

    // Process the template
    const result = processTemplate(rawTemplate, mergedArgs, topVars, entry.tag);
    if (!result) continue;

    // Generate variable name: camelCase with 'ex' prefix
    const varName = 'ex' + story.name;

    examples.push({
      varName,
      humanName,
      html: result.html,
      needsSetup: result.needsSetup,
      setupCode: result.setupCode,
    });
  }

  return examples.length > 0 ? examples : null;
}

// ─── MDX Generator ─────────────────────────────────────────────────────────────

/**
 * Convert HTML usage snippet to React JSX.
 * Replaces kb-* tags with React wrapper names, converts kebab-case attributes to camelCase.
 * @param {string} html
 * @param {string} tag - e.g. 'kb-button'
 * @param {string} reactName - e.g. 'Button'
 * @returns {string}
 */
function htmlToReactJsx(html, tag, reactName) {
  let jsx = html;
  // Replace opening tags: <kb-button ...> → <Button ...>
  jsx = jsx.replace(new RegExp(`<${tag}(\\s|>|/)`, 'g'), `<${reactName}$1`);
  // Replace closing tags: </kb-button> → </Button>
  jsx = jsx.replace(new RegExp(`</${tag}>`, 'g'), `</${reactName}>`);
  // Convert kebab-case attributes to camelCase (but not data-* or aria-*)
  jsx = jsx.replace(/\s([a-z]+(?:-[a-z]+)+)(?==)/g, (_, attr) => {
    if (attr.startsWith('data-') || attr.startsWith('aria-')) return ` ${attr}`;
    const camel = attr.replace(/-([a-z])/g, (__, c) => c.toUpperCase());
    return ` ${camel}`;
  });
  return jsx;
}

/**
 * Map a keyboard key name to a human-readable action description.
 * @param {string} key
 * @param {boolean} isOverlay
 * @returns {string}
 */
function keyActionDescription(key, isOverlay) {
  /** @type {Record<string, string>} */
  const map = {
    Enter: 'Activate or select the focused item',
    Space: 'Activate or select the focused item',
    Escape: isOverlay ? 'Close the overlay and restore focus' : 'Close or cancel the current action',
    Tab: isOverlay ? 'Cycle focus within the overlay (focus trap)' : 'Move focus to the next focusable element',
    ArrowDown: 'Move focus to the next item',
    ArrowUp: 'Move focus to the previous item',
    ArrowRight: 'Move focus forward or increase value',
    ArrowLeft: 'Move focus backward or decrease value',
    Home: 'Move focus to the first item',
    End: 'Move focus to the last item',
    PageUp: 'Increase by a large step',
    PageDown: 'Decrease by a large step',
    Backspace: 'Delete the previous character or item',
    Delete: 'Delete the current character or item',
  };
  return map[key] ?? 'Perform action';
}

/**
 * Generate the MDX content for a component page.
 * @param {ComponentEntry} entry
 * @param {ParsedComponent} parsed
 * @param {ParsedStory | null} story
 * @returns {string}
 */

/**
 * Escape MDX-sensitive characters in markdown table cell content.
 * - `{` and `}` are JSX expression delimiters in MDX
 * - `|` is a table cell separator in markdown
 * Uses HTML entities for braces and backslash-escape for pipes.
 * @param {string} text
 * @returns {string}
 */
function escapeMdxTableCell(text) {
  // Split on backtick code spans — only escape braces in plain text segments,
  // not inside code spans (where MDX treats content as literal text).
  return text
    .replace(/(`[^`]*`)|([^`]+)/g, (_, code, plain) => {
      if (code) return code; // leave code spans untouched
      return plain
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;');
    })
    .replace(/(?<!\\)\|/g, '\\|');
}

function generateMdx(entry, parsed, examples) {
  const lines = [];

  // Frontmatter
  lines.push('---');
  lines.push(`title: "${entry.name}"`);
  lines.push(`description: "${entry.description}"`);
  lines.push(`sidebar_label: "${entry.name}"`);
  lines.push('---');
  lines.push('');

  // Imports
  lines.push("import BrowserOnly from '@docusaurus/BrowserOnly';");
  lines.push("import Tabs from '@theme/Tabs';");
  lines.push("import TabItem from '@theme/TabItem';");
  lines.push("import { Demo } from '@site/src/components/Demo';");
  lines.push("import { ComponentPreview } from '@site/src/components/ComponentPreview';");
  lines.push('');

  // Export const for usage code (MDX whitespace bug workaround)
  // usageCode contains the FULL html including comments/scripts (for display)
  const escapedUsage = entry.usageHtml
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  lines.push('export const usageCode = `' + escapedUsage + '`;');

  // Framework-specific code variants
  const reactCode = generateReactCode(entry, entry.usageHtml);
  const vueCode = generateVueCode(entry, entry.usageHtml);
  const svelteCode = generateSvelteCode(entry, entry.usageHtml);

  const escapedReact = reactCode
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  const escapedVue = vueCode
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  const escapedSvelte = svelteCode
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  lines.push('export const reactCode = `' + escapedReact + '`;');
  lines.push('export const vueCode = `' + escapedVue + '`;');
  lines.push('export const svelteCode = `' + escapedSvelte + '`;');

  // Split HTML from script for the live preview
  const { htmlOnly, scriptBody } = splitUsageScript(entry.usageHtml);
  const escapedHtmlOnly = htmlOnly
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  // Only emit demoHtml if it differs from usageCode (has script block)
  if (scriptBody) {
    lines.push('export const demoHtml = `' + escapedHtmlOnly + '`;');
  }

  // For JS-property-bound components, emit setup function at module level
  // (avoids curly braces inside JSX which MDX cannot parse)
  if (scriptBody) {
    const setupBody = scriptBody
      .replace(/document\.querySelector\(/g, 'container.querySelector(');
    lines.push('export const setupDemo = (container) => {');
    // Indent each line of the setup body
    for (const line of setupBody.split('\n')) {
      lines.push('  ' + line);
    }
    lines.push('};');
  }


  // Example code exports (from story examples)
  if (examples && examples.length > 0) {
    for (const ex of examples) {
      // Format HTML for readable code display
      const formattedHtml = formatHtml(ex.html);
      // Generate all framework variants
      const codes = generateExampleFrameworkCodes(entry, formattedHtml, ex.setupCode);

      // Resolve JS unicode escapes (\uXXXX) to actual characters BEFORE escaping
      // backslashes, so that e.g. \u2022 becomes • instead of \\u2022.
      const resolveUnicode = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      const esc = (s) => resolveUnicode(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

      lines.push(`export const ${ex.varName} = \`${esc(codes.html)}\`;`);
      lines.push(`export const ${ex.varName}React = \`${esc(codes.react)}\`;`);
      lines.push(`export const ${ex.varName}Vue = \`${esc(codes.vue)}\`;`);
      lines.push(`export const ${ex.varName}Svelte = \`${esc(codes.svelte)}\`;`);
      if (ex.needsSetup && ex.setupCode) {
        lines.push(`export const ${ex.varName}Setup = (container) => {`);
        for (const line of ex.setupCode.split('\n')) {
          lines.push(line);
        }
        lines.push('};');
      }
    }
    lines.push('');
  }

  // Ensure blank line between export block and markdown content (required by MDX parser)
  if (lines.length > 0 && lines[lines.length - 1] !== '') {
    lines.push('');
  }

  // Title and description
  lines.push(`# ${entry.name}`);
  lines.push('');
  lines.push(entry.description);
  lines.push('');

  // Tag and import
  lines.push('## Import');
  lines.push('');
  lines.push('<Tabs>');
  lines.push('<TabItem value="html" label="HTML" default>');
  lines.push('');
  lines.push('```html');
  lines.push('<script type="module">');
  lines.push("  import '@wearesyntesa/karbit-ui/define';");
  lines.push('</script>');
  lines.push('```');
  lines.push('');
  lines.push('</TabItem>');
  lines.push('<TabItem value="react" label="React">');
  lines.push('');
  lines.push('```tsx');
  lines.push(`import { ${entry.reactName} } from '@wearesyntesa/karbit-ui/react';`);
  lines.push('```');
  lines.push('');
  lines.push('</TabItem>');
  lines.push('<TabItem value="vue" label="Vue">');
  lines.push('');
  lines.push('```html');
  lines.push('<script setup>');
  lines.push("  import '@wearesyntesa/karbit-ui/define';");
  lines.push('</script>');
  lines.push('');
  lines.push('```');
  lines.push('');
  lines.push('</TabItem>');
  lines.push('<TabItem value="svelte" label="Svelte">');
  lines.push('');
  lines.push('```html');
  lines.push('<script>');
  lines.push("  import '@wearesyntesa/karbit-ui/define';");
  lines.push('</script>');
  lines.push('```');
  lines.push('');
  lines.push('</TabItem>');
  lines.push('</Tabs>');
  lines.push('');

  // Usage example
  lines.push('## Usage');
  lines.push('');
  lines.push('<Demo codes={{ html: usageCode, react: reactCode, vue: vueCode, svelte: svelteCode }}>');
  lines.push('  <BrowserOnly>');
  lines.push('    {() => {');
  // Single barrel require to register all custom elements
  lines.push("      require('@wearesyntesa/karbit-ui/define');");
  if (scriptBody) {
    // JS-property-bound component: use ComponentPreview with setup function
    lines.push('      return <ComponentPreview html={demoHtml} setup={setupDemo} />;');
  } else if (DIALOG_OVERLAY_TAGS.has(entry.tag)) {
    // Dialog overlay: strip `open` attr, inject trigger button via overlayTag
    lines.push(`      return <ComponentPreview html={usageCode} overlayTag="${entry.tag}" />;`);
  } else {
    // Simple component: just render with dangerouslySetInnerHTML
    lines.push('      return <div dangerouslySetInnerHTML={{ __html: usageCode }} />;');
  }
  lines.push('    }}');
  lines.push('  </BrowserOnly>');
  lines.push('</Demo>');
  lines.push('');

  // Props table
  if (parsed.props.length > 0) {
    lines.push('## Props');
    lines.push('');
    lines.push('| Property | Attribute | Type | Default | Description |');
    lines.push('|---|---|---|---|---|');
    for (const prop of parsed.props) {
      const attr = prop.attribute ? ('`' + prop.attribute + '`') : '\u2014 (JS only)';
      const type = escapeMdxTableCell('`' + prop.type.replace(/\|/g, '\\|') + '`');
      const def = escapeMdxTableCell(formatDefault(prop.default));
      const desc = escapeMdxTableCell(prop.description || '\u2014');
      lines.push(`| \`${prop.name}\` | ${attr} | ${type} | ${def} | ${desc} |`);
    }
    lines.push('');
  }

  // Slots table
  const namedSlots = parsed.slots.filter((s) => s.name !== '(default)');
  const hasDefault = parsed.slots.some((s) => s.name === '(default)');
  if (parsed.slots.length > 0) {
    lines.push('## Slots');
    lines.push('');
    lines.push('| Name | Description |');
    lines.push('|---|---|');
    if (hasDefault) {
      const defaultSlot = parsed.slots.find((s) => s.name === '(default)');
      lines.push(`| (default) | ${escapeMdxTableCell(defaultSlot?.description ?? 'Default content')} |`);
    }
    for (const slot of namedSlots) {
      lines.push(`| \`${slot.name}\` | ${escapeMdxTableCell(slot.description || '\u2014')} |`);
    }
    lines.push('');
  }

  // Events table
  if (parsed.events.length > 0) {
    lines.push('## Events');
    lines.push('');
    lines.push('| Event | Detail | Description |');
    lines.push('|---|---|---|');
    for (const event of parsed.events) {
      lines.push(`| \`${event.name}\` | ${escapeMdxTableCell(event.detail)} | ${escapeMdxTableCell(event.description || '\u2014')} |`);
    }
    lines.push('');
  }

  // Accessibility section
  const a11y = parsed.a11y;
  const hasA11y = a11y && (a11y.roles.length > 0 || a11y.ariaAttrs.length > 0 || a11y.keyboardKeys.length > 0 || a11y.isOverlay);
  if (hasA11y) {
    lines.push('## Accessibility');
    lines.push('');

    if (a11y.keyboardKeys.length > 0) {
      lines.push('### Keyboard Navigation');
      lines.push('');
      lines.push('| Key | Action |');
      lines.push('|---|---|');
      for (const key of a11y.keyboardKeys) {
        const displayKey = key === 'Space' ? '`Space`' : `\`${key}\``;
        lines.push(`| ${displayKey} | ${keyActionDescription(key, a11y.isOverlay)} |`);
      }
      lines.push('');
    }

    if (a11y.roles.length > 0 || a11y.ariaAttrs.length > 0) {
      lines.push('### ARIA');
      lines.push('');
      if (a11y.roles.length > 0) {
        lines.push(`**Roles:** ${a11y.roles.map((r) => `\`${r}\``).join(', ')}`);
        lines.push('');
      }
      if (a11y.ariaAttrs.length > 0) {
        lines.push(`**Attributes:** ${a11y.ariaAttrs.map((a) => `\`${a}\``).join(', ')}`);
        lines.push('');
      }
    }

    if (a11y.isOverlay) {
      lines.push('### Focus Management');
      lines.push('');
      lines.push('This component extends `KbOverlayBase` and provides:');
      lines.push('- Focus trapping within the overlay when open');
      lines.push('- Focus restoration to the trigger element on close');
      lines.push('- `Escape` key dismissal');
      lines.push('- Sibling elements marked as `inert` while open');
      lines.push('- Body scroll locking');
      lines.push('');
    }
  }

  // Examples (inline demos from story files)
  if (examples && examples.length > 0) {
    lines.push('## Examples');
    lines.push('');

    for (const ex of examples) {
      const codesAttr = `codes={{ html: ${ex.varName}, react: ${ex.varName}React, vue: ${ex.varName}Vue, svelte: ${ex.varName}Svelte }}`;
      const isDialogOverlay = DIALOG_OVERLAY_TAGS.has(entry.tag);

      if (ex.needsSetup && isDialogOverlay) {
        // Dialog overlay with JS-property setup: use ComponentPreview with both setup + overlayTag
        lines.push(`<Demo title="${ex.humanName}" ${codesAttr}>`)
        lines.push('  <BrowserOnly>');
        lines.push('    {() => {');
        lines.push("      require('@wearesyntesa/karbit-ui/define');");
        lines.push(`      return <ComponentPreview html={${ex.varName}} setup={${ex.varName}Setup} overlayTag="${entry.tag}" />;`);
        lines.push('    }}');
        lines.push('  </BrowserOnly>');
        lines.push('</Demo>');
      } else if (ex.needsSetup) {
        lines.push(`<Demo title="${ex.humanName}" ${codesAttr}>`)
        lines.push('  <BrowserOnly>');
        lines.push('    {() => {');
        lines.push("      require('@wearesyntesa/karbit-ui/define');");
        lines.push(`      return <ComponentPreview html={${ex.varName}} setup={${ex.varName}Setup} />;`);
        lines.push('    }}');
        lines.push('  </BrowserOnly>');
        lines.push('</Demo>');
      } else if (isDialogOverlay) {
        // Dialog overlay without setup: use ComponentPreview with overlayTag
        lines.push(`<Demo title="${ex.humanName}" ${codesAttr}>`)
        lines.push('  <BrowserOnly>');
        lines.push('    {() => {');
        lines.push("      require('@wearesyntesa/karbit-ui/define');");
        lines.push(`      return <ComponentPreview html={${ex.varName}} overlayTag="${entry.tag}" />;`);
        lines.push('    }}');
        lines.push('  </BrowserOnly>');
        lines.push('</Demo>');
      } else {
        lines.push(`<Demo title="${ex.humanName}" ${codesAttr}>`)
        lines.push('  <BrowserOnly>');
        lines.push('    {() => {');
        lines.push("      require('@wearesyntesa/karbit-ui/define');");
        lines.push(`      return <div dangerouslySetInnerHTML={{ __html: ${ex.varName} }} />;`);
        lines.push('    }}');
        lines.push('  </BrowserOnly>');
        lines.push('</Demo>');
      }
      lines.push('');
    }
  }

  // See Also
  if (entry.related.length > 0) {
    lines.push('## See Also');
    lines.push('');
    for (const relSlug of entry.related) {
      const relEntry = REGISTRY.find((r) => r.slug === relSlug);
      if (relEntry) {
        const relPath = relEntry.category === entry.category
          ? `./${relSlug}`
          : `../${relEntry.category}/${relSlug}`;
        lines.push(`- [${relEntry.name}](${relPath})`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format a default value for the props table.
 * @param {string} value
 * @returns {string}
 */
function formatDefault(value) {
  if (value === '\u2014' || value === 'undefined') return '\u2014';
  if (value === "''") return '`""`';
  return '`' + value.replace(/\|/g, '\\|') + '`';
}

// ─── JSON API Generator ────────────────────────────────────────────────────────

/**
 * Generate structured API JSON for a component.
 * @param {ComponentEntry} entry
 * @param {ParsedComponent} parsed
 * @returns {object}
 */
function generateApiJson(entry, parsed) {
  return {
    name: entry.name,
    tag: entry.tag,
    category: entry.category,
    description: entry.description,
    importPaths: {
      webComponent: `@wearesyntesa/karbit-ui/components/${entry.category}/${entry.tag}.define.js`,
      react: `@wearesyntesa/karbit-ui/react`,
      reactExport: entry.reactName,
    },
    props: parsed.props.map((p) => ({
      name: p.name,
      attribute: p.attribute,
      type: p.type,
      default: p.default === '\u2014' ? null : p.default,
      reflect: p.reflect,
      description: p.description,
    })),
    slots: parsed.slots.map((s) => ({
      name: s.name,
      description: s.description,
    })),
    events: parsed.events.map((e) => ({
      name: e.name,
      detail: e.detail,
      description: e.description,
    })),
    accessibility: parsed.a11y ? {
      roles: parsed.a11y.roles,
      ariaAttributes: parsed.a11y.ariaAttrs,
      keyboardKeys: parsed.a11y.keyboardKeys,
      isOverlay: parsed.a11y.isOverlay,
    } : null,
    relatedComponents: entry.related,
  };
}

// ─── Category Config Generator ─────────────────────────────────────────────────

/**
 * Generate _category_.json for a category directory.
 * @param {string} categoryLabel
 * @param {number} position
 * @returns {string}
 */
function generateCategoryJson(categoryLabel, position) {
  return JSON.stringify(
    {
      label: categoryLabel,
      position,
      collapsed: false,
      link: { type: 'generated-index', description: `${categoryLabel} components in KarbitUI.` },
    },
    null,
    2,
  );
}

// ─── Sidebar Generator ─────────────────────────────────────────────────────────

/**
 * Generate the sidebars.ts content.
 * @returns {string}
 */
function generateSidebars() {
  const categories = [
    { category: 'forms', label: 'Forms' },
    { category: 'data-display', label: 'Data Display' },
    { category: 'feedback', label: 'Feedback' },
    { category: 'layout', label: 'Layout' },
    { category: 'navigation', label: 'Navigation' },
    { category: 'overlay', label: 'Overlay' },
    { category: 'typography', label: 'Typography' },
  ];

  const catItems = categories.map((cat) => {
    const components = REGISTRY.filter((c) => c.category === cat.category);
    const items = components
      .map((c) => `        'components/${cat.category}/${c.slug}'`)
      .join(',\n');
    return `      {
        type: 'category',
        label: '${cat.label}',
        collapsed: false,
        link: { type: 'generated-index', description: '${cat.label} components in KarbitUI.' },
        items: [
${items},
        ],
      }`;
  });

  return `import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      link: { type: 'doc', id: 'getting-started/installation' },
      items: [
        'getting-started/installation',
        'getting-started/setup-react',
        'getting-started/setup-vue',
        'getting-started/setup-svelte',
        'getting-started/setup-vanilla',
        'getting-started/dark-mode',
      ],
    },
    {
      type: 'category',
      label: 'Design System',
      collapsed: false,
      link: { type: 'doc', id: 'design-system/overview' },
      items: [
        'design-system/overview',
        'design-system/theming',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      link: { type: 'doc', id: 'components/overview' },
      items: [
        'components/overview',
${catItems.join(',\n')},
      ],
    },
  ],
};

export default sidebars;
`;
}

// ─── LLMs Files Generator ──────────────────────────────────────────────────────

/**
 * Generate llms.txt content (site index for AI crawlers).
 * @returns {string}
 */
function generateLlmsTxt() {
  const lines = [];
  lines.push('# KarbitUI Documentation');
  lines.push('');
  lines.push('> KarbitUI is a web component library of 78 Lit-based components with Tailwind CSS styling.');
  lines.push('> Built by Syntesa. Package: @wearesyntesa/karbit-ui');
  lines.push('');
  lines.push('## Getting Started');
  lines.push('- [Installation](/docs/getting-started/installation)');
  lines.push('- [React Setup](/docs/getting-started/setup-react)');
  lines.push('- [Vue Setup](/docs/getting-started/setup-vue)');
  lines.push('- [Svelte Setup](/docs/getting-started/setup-svelte)');
  lines.push('- [Vanilla JS Setup](/docs/getting-started/setup-vanilla)');
  lines.push('- [Dark Mode](/docs/getting-started/dark-mode)');
  lines.push('');
  lines.push('## Design System');
  lines.push('- [Overview](/docs/design-system/overview)');
  lines.push('- [Theming](/docs/design-system/theming)');
  lines.push('');
  lines.push('## Components');
  lines.push('- [Overview](/docs/components/overview)');

  /** @type {Map<string, ComponentEntry[]>} */
  const byCategory = new Map();
  for (const entry of REGISTRY) {
    const existing = byCategory.get(entry.categoryLabel) ?? [];
    existing.push(entry);
    byCategory.set(entry.categoryLabel, existing);
  }

  for (const [label, entries] of byCategory) {
    lines.push('');
    lines.push(`### ${label}`);
    for (const entry of entries) {
      lines.push(`- [${entry.name}](/docs/components/${entry.category}/${entry.slug}): ${entry.description}`);
    }
  }

  lines.push('');
  lines.push('## API Reference');
  lines.push('');
  lines.push('Structured JSON API data is available at `/api/{component-slug}.json` for each component.');
  lines.push('Full documentation is also available at `/llms-full.txt`.');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate llms-full.txt (all docs concatenated).
 * @param {Map<string, string>} mdxContentMap - Map of slug to MDX content
 * @returns {string}
 */
function generateLlmsFullTxt(mdxContentMap) {
  const lines = [];
  lines.push('# KarbitUI — Full Documentation');
  lines.push('');
  lines.push('Package: @wearesyntesa/karbit-ui');
  lines.push('78 Lit-based web components with Tailwind CSS styling.');
  lines.push('');

  for (const entry of REGISTRY) {
    const mdx = mdxContentMap.get(entry.slug);
    if (!mdx) continue;

    // Strip frontmatter and imports for the full text version
    const cleaned = mdx
      .replace(/^---[\s\S]*?---\n*/m, '')
      .replace(/^import .*$/gm, '')
      .replace(/^export const .*$/gm, '')
      .replace(/<BrowserOnly>[\s\S]*?<\/BrowserOnly>/g, '')
      .replace(/<Demo[^>]*>/g, '')
      .replace(/<\/Demo>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    lines.push('---');
    lines.push('');
    lines.push(cleaned);
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('KarbitUI Documentation Generator');
  console.log(`Processing ${REGISTRY.length} components...\n`);

  // Ensure output directories
  const categoryDirs = [...new Set(REGISTRY.map((c) => c.category))];
  for (const cat of categoryDirs) {
    mkdirSync(join(COMPONENTS_DOCS, cat), { recursive: true });
  }
  mkdirSync(API_DIR, { recursive: true });

  /** @type {Map<string, string>} */
  const mdxContentMap = new Map();

  // Category position map
  /** @type {Record<string, { label: string; position: number }>} */
  const categoryPositions = {
    forms: { label: 'Forms', position: 2 },
    'data-display': { label: 'Data Display', position: 3 },
    feedback: { label: 'Feedback', position: 4 },
    layout: { label: 'Layout', position: 5 },
    navigation: { label: 'Navigation', position: 6 },
    overlay: { label: 'Overlay', position: 7 },
    typography: { label: 'Typography', position: 8 },
  };

  // Generate category configs
  for (const [cat, info] of Object.entries(categoryPositions)) {
    const catDir = join(COMPONENTS_DOCS, cat);
    const catJsonPath = join(catDir, '_category_.json');
    writeFileSync(catJsonPath, generateCategoryJson(info.label, info.position), 'utf-8');
    console.log(`  ${cat}/_category_.json`);
  }

  // Process each component
  /** @type {number} */
  let successCount = 0;
  for (const entry of REGISTRY) {
    process.stdout.write(`  ${entry.category}/${entry.slug}.mdx ... `);

    // Parse source
    const parsed = parseComponentSource(entry);

    // Parse story examples
    const examples = parseStoryExamples(entry);

    // Generate MDX
    const mdx = generateMdx(entry, parsed, examples);
    const mdxPath = join(COMPONENTS_DOCS, entry.category, `${entry.slug}.mdx`);
    writeFileSync(mdxPath, mdx, 'utf-8');
    mdxContentMap.set(entry.slug, mdx);

    // Generate API JSON
    const apiJson = generateApiJson(entry, parsed);
    const jsonPath = join(API_DIR, `${entry.slug}.json`);
    writeFileSync(jsonPath, JSON.stringify(apiJson, null, 2), 'utf-8');

    const propCount = parsed.props.length;
    const slotCount = parsed.slots.length;
    const eventCount = parsed.events.length;
    console.log(`${propCount} props, ${slotCount} slots, ${eventCount} events`);
    successCount++;
  }

  // Generate sidebars
  const sidebarsPath = join(DOCS_ROOT, 'sidebars.ts');
  writeFileSync(sidebarsPath, generateSidebars(), 'utf-8');
  console.log('\n  sidebars.ts');

  // Generate llms.txt
  const llmsTxtPath = join(STATIC, 'llms.txt');
  writeFileSync(llmsTxtPath, generateLlmsTxt(), 'utf-8');
  console.log('  llms.txt');

  // Generate llms-full.txt
  const llmsFullPath = join(STATIC, 'llms-full.txt');
  writeFileSync(llmsFullPath, generateLlmsFullTxt(mdxContentMap), 'utf-8');
  console.log('  llms-full.txt');

  console.log(`\nGenerated ${successCount} component pages, ${successCount} API JSONs, ${categoryDirs.length} category configs.`);
  console.log('Also: sidebars.ts, llms.txt, llms-full.txt');
}

main();
