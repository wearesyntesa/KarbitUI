import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { kbClasses } from '../../src/core/theme.js';
import '../../src/components/data-display/kb-timeline.js';
import type { TimelineItem } from '../../src/components/data-display/kb-timeline.js';

/* ------------------------------------------------------------------ */
/*  Shared data sets                                                  */
/* ------------------------------------------------------------------ */

const DEPLOY_HISTORY: TimelineItem[] = [
  {
    id: '1',
    title: 'Deployment started',
    description: 'Pipeline triggered by push to main',
    timestamp: '2026-02-10 08:00',
    status: 'info',
  },
  {
    id: '2',
    title: 'Build completed',
    description: 'All 42 modules compiled successfully',
    timestamp: '2026-02-10 08:03',
    status: 'success',
  },
  {
    id: '3',
    title: 'Tests passed',
    description: '128 tests passed, 0 failed',
    timestamp: '2026-02-10 08:05',
    status: 'success',
  },
  {
    id: '4',
    title: 'Staging deploy',
    description: 'Deployed to staging environment',
    timestamp: '2026-02-10 08:07',
    status: 'success',
    active: true,
  },
  { id: '5', title: 'Production deploy', description: 'Waiting for manual approval', status: 'default' },
];

const INCIDENT_LOG: TimelineItem[] = [
  {
    id: '1',
    title: 'Alert triggered',
    description: 'CPU usage exceeded 95% threshold',
    timestamp: '14:32',
    status: 'error',
  },
  {
    id: '2',
    title: 'Incident created',
    description: 'Auto-escalated to on-call team',
    timestamp: '14:33',
    status: 'warning',
  },
  {
    id: '3',
    title: 'Investigation started',
    description: 'Engineer acknowledged the page',
    timestamp: '14:35',
    status: 'info',
  },
  {
    id: '4',
    title: 'Root cause identified',
    description: 'Memory leak in worker pool',
    timestamp: '14:48',
    status: 'info',
  },
  {
    id: '5',
    title: 'Fix deployed',
    description: 'Hotfix rolled out to production',
    timestamp: '15:02',
    status: 'success',
  },
  {
    id: '6',
    title: 'Incident resolved',
    description: 'All metrics returned to normal',
    timestamp: '15:10',
    status: 'success',
  },
];

const PROJECT_ROADMAP: TimelineItem[] = [
  {
    id: '1',
    title: 'Research & Discovery',
    description: 'User interviews, competitive analysis, requirements gathering',
    timestamp: 'Jan 2026',
    status: 'success',
  },
  {
    id: '2',
    title: 'Design System',
    description: 'Tokens, typography, component specifications',
    timestamp: 'Feb 2026',
    status: 'success',
  },
  {
    id: '3',
    title: 'Core Components',
    description: 'Buttons, inputs, forms, layout primitives',
    timestamp: 'Mar 2026',
    status: 'success',
    active: true,
  },
  {
    id: '4',
    title: 'Advanced Components',
    description: 'Data tables, charts, complex forms',
    timestamp: 'Apr 2026',
    status: 'default',
  },
  {
    id: '5',
    title: 'Documentation & Launch',
    description: 'API docs, guides, migration tools',
    timestamp: 'May 2026',
    status: 'default',
  },
];

type Args = {
  _items?: TimelineItem[];
  variant?: string;
  size?: string;
  'line-variant'?: string;
  'show-icons'?: boolean;
};

export default {
  title: 'Data Display/Timeline',
  component: 'kb-timeline',
  render: (args) => {
    const items: TimelineItem[] = args._items ?? DEPLOY_HISTORY;
    return html`<kb-timeline
      .items=${items}
      variant=${args.variant ?? 'left'}
      size=${args.size ?? 'md'}
      line-variant=${args['line-variant'] ?? 'solid'}
      ?show-icons=${args['show-icons'] ?? false}
    ></kb-timeline>`;
  },
  args: { variant: 'left', size: 'md', 'line-variant': 'solid', 'show-icons': false },
  argTypes: {
    variant: { control: 'select', options: ['left', 'alternate'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    'line-variant': { control: 'select', options: ['solid', 'dashed'] },
    'show-icons': { control: 'boolean' },
  },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

/* ------------------------------------------------------------------ */
/*  Core variants                                                     */
/* ------------------------------------------------------------------ */

/** Default left-aligned timeline with square dot indicators. */
export const Default: S = {};

/** Status icons inside the indicator squares — checkmark, X, warning, info. */
export const WithIcons: S = {
  args: { 'show-icons': true },
};

/** Incident log with mixed status colors and icons. */
export const IncidentLog: S = {
  args: { _items: INCIDENT_LOG, 'show-icons': true },
};

/** Alternating left/right layout. Collapses to left-aligned on small screens. */
export const AlternateLayout: S = {
  args: { _items: INCIDENT_LOG, variant: 'alternate', 'show-icons': true },
};

/** Dashed connecting line variant. */
export const DashedLine: S = {
  args: { 'line-variant': 'dashed', 'show-icons': true },
};

/** Active item highlighted with filled indicator and accent left border. */
export const ActiveItem: S = {
  args: {
    'show-icons': true,
    _items: [
      { id: '1', title: 'Completed step', description: 'This step is done', timestamp: '09:00', status: 'success' },
      {
        id: '2',
        title: 'Current step',
        description: 'This step is in progress',
        timestamp: '09:15',
        status: 'info',
        active: true,
      },
      { id: '3', title: 'Pending step', description: 'Not started yet', status: 'default' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Sizes                                                             */
/* ------------------------------------------------------------------ */

/** Side-by-side size comparison. */
export const Sizes: S = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;">
      <div>
        <p class="${kbClasses.label} mb-4">size="sm"</p>
        <kb-timeline .items=${DEPLOY_HISTORY} size="sm" show-icons></kb-timeline>
      </div>
      <div>
        <p class="${kbClasses.label} mb-4">size="md"</p>
        <kb-timeline .items=${DEPLOY_HISTORY} size="md" show-icons></kb-timeline>
      </div>
      <div>
        <p class="${kbClasses.label} mb-4">size="lg"</p>
        <kb-timeline .items=${DEPLOY_HISTORY} size="lg" show-icons></kb-timeline>
      </div>
    </div>
  `,
};

/* ------------------------------------------------------------------ */
/*  Practical patterns                                                */
/* ------------------------------------------------------------------ */

/** Project roadmap — milestone tracking with completion status. */
export const ProjectRoadmap: S = {
  args: { _items: PROJECT_ROADMAP, 'show-icons': true },
};

/** Interactive click handler — logs clicked item to console. */
export const InteractiveClick: S = {
  args: { _items: DEPLOY_HISTORY, 'show-icons': true },
  render: (args) => {
    const items: TimelineItem[] = args._items ?? DEPLOY_HISTORY;
    return html`
      <p class="${kbClasses.label} mb-4">Click any item (check console)</p>
      <kb-timeline
        .items=${items}
        show-icons
        @kb-timeline-item-click=${(e: CustomEvent<{ index: number; id: string }>): void => {
          console.log('Timeline item clicked:', e.detail);
        }}
      ></kb-timeline>
    `;
  },
};
