import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { kbClasses } from '../../src/core/theme.js';
import { spreadAttrs } from '../_define.js';
import '../../src/components/data-display/kb-carousel.js';

/* ------------------------------------------------------------------ */
/*  Shared slide templates                                            */
/* ------------------------------------------------------------------ */

const colorSlides = html`
  <div class="h-48 flex items-center justify-center bg-blue-50 dark:bg-blue-950/30">
    <span class="text-lg font-semibold text-blue-600 dark:text-blue-400">Slide 1</span>
  </div>
  <div class="h-48 flex items-center justify-center bg-green-50 dark:bg-green-950/30">
    <span class="text-lg font-semibold text-green-600 dark:text-green-400">Slide 2</span>
  </div>
  <div class="h-48 flex items-center justify-center bg-amber-50 dark:bg-amber-950/30">
    <span class="text-lg font-semibold text-amber-600 dark:text-amber-400">Slide 3</span>
  </div>
  <div class="h-48 flex items-center justify-center bg-purple-50 dark:bg-purple-950/30">
    <span class="text-lg font-semibold text-purple-600 dark:text-purple-400">Slide 4</span>
  </div>
`;

type Args = {
  active?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
  'show-arrows'?: boolean;
  'show-dots'?: boolean;
  'show-counter'?: boolean;
  'pause-on-hover'?: boolean;
  swipeable?: boolean;
};

export default {
  title: 'Data Display/Carousel',
  component: 'kb-carousel',
  render: (args) => html`<kb-carousel ${spreadAttrs(args)}>${colorSlides}</kb-carousel>`,
  args: {
    active: 0,
    loop: true,
    'show-arrows': true,
    'show-dots': true,
    'show-counter': true,
    swipeable: true,
  },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

/* ------------------------------------------------------------------ */
/*  Core behavior                                                     */
/* ------------------------------------------------------------------ */

/** Default carousel with integrated control bar: arrows, dots, counter, and swipe. */
export const Default: S = {};

/** Autoplay with a progress bar along the bottom edge. Hover to pause. */
export const Autoplay: S = {
  args: { autoplay: true, interval: 2000, 'pause-on-hover': true },
};

/** Non-looping — arrows disable at the boundaries. */
export const NoLoop: S = {
  args: { loop: false },
};

/** Touch/drag swipe is the primary navigation — no arrows or counter. */
export const SwipeOnly: S = {
  args: { 'show-arrows': false, 'show-counter': false },
};

/** Minimal — dots only, no arrows or counter. */
export const DotsOnly: S = {
  args: { 'show-arrows': false, 'show-counter': false },
};

/** Counter only — no dots or arrows. Clean numeric indicator. */
export const CounterOnly: S = {
  args: { 'show-dots': false, 'show-arrows': false },
};

/** No control bar at all — keyboard and swipe only. */
export const NoControls: S = {
  args: { 'show-arrows': false, 'show-dots': false, 'show-counter': false },
};

/* ------------------------------------------------------------------ */
/*  Practical patterns                                                */
/* ------------------------------------------------------------------ */

/** Feature showcase slides with structured content and sans typography. */
export const FeatureShowcase: S = {
  render: (args) => html`
    <kb-carousel ${spreadAttrs(args)}>
      <div class="h-64 p-8 flex flex-col justify-center ${kbClasses.surface}">
        <p class="${kbClasses.label} mb-2">01 / Introduction</p>
        <p class="text-2xl font-bold ${kbClasses.textPrimary} mb-3">Getting started with KarbitUI</p>
        <p class="${kbClasses.textSecondary}">A brutalist component library built with Lit and Tailwind CSS.</p>
      </div>
      <div class="h-64 p-8 flex flex-col justify-center ${kbClasses.surface}">
        <p class="${kbClasses.label} mb-2">02 / Components</p>
        <p class="text-2xl font-bold ${kbClasses.textPrimary} mb-3">78 production-ready components</p>
        <p class="${kbClasses.textSecondary}">Buttons, forms, overlays, navigation, data display, and more.</p>
      </div>
      <div class="h-64 p-8 flex flex-col justify-center ${kbClasses.surface}">
        <p class="${kbClasses.label} mb-2">03 / Theming</p>
        <p class="text-2xl font-bold ${kbClasses.textPrimary} mb-3">Dark mode built in</p>
        <p class="${kbClasses.textSecondary}">Every component supports light and dark mode via Tailwind dark: classes.</p>
      </div>
    </kb-carousel>
  `,
};

/** Testimonial slider — centered quotes with attribution. */
export const Testimonials: S = {
  args: { 'show-arrows': true, autoplay: true, interval: 4000 },
  render: (args) => html`
    <kb-carousel ${spreadAttrs(args)}>
      <div class="min-h-[16rem] p-8 flex flex-col items-center justify-center text-center ${kbClasses.surface}">
        <svg class="w-8 h-8 mb-4 ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 7.05V12H6.05A5.97 5.97 0 0 1 6 11.5C6 8.46 8.46 6 11.5 6l.5.05V3.02A8.96 8.96 0 0 0 3 12a9 9 0 0 0 9 9 1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM22 8a1 1 0 0 0-1-1h-1V3.02A8.96 8.96 0 0 0 11 12a9 9 0 0 0 9 9 1 1 0 0 0 1-1V8Z"/>
        </svg>
        <p class="text-lg ${kbClasses.textPrimary} mb-4 max-w-md">"The structured minimal approach perfectly matches our brand. Clean, fast, and accessible out of the box."</p>
        <p class="${kbClasses.label}">Sarah Chen — Design Lead, Acme Corp</p>
      </div>
      <div class="min-h-[16rem] p-8 flex flex-col items-center justify-center text-center ${kbClasses.surface}">
        <svg class="w-8 h-8 mb-4 ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 7.05V12H6.05A5.97 5.97 0 0 1 6 11.5C6 8.46 8.46 6 11.5 6l.5.05V3.02A8.96 8.96 0 0 0 3 12a9 9 0 0 0 9 9 1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM22 8a1 1 0 0 0-1-1h-1V3.02A8.96 8.96 0 0 0 11 12a9 9 0 0 0 9 9 1 1 0 0 0 1-1V8Z"/>
        </svg>
        <p class="text-lg ${kbClasses.textPrimary} mb-4 max-w-md">"We migrated from a heavy component library and cut our bundle size by 60%. The Lit foundation makes it incredibly fast."</p>
        <p class="${kbClasses.label}">Marcus Johnson — Frontend Architect</p>
      </div>
      <div class="min-h-[16rem] p-8 flex flex-col items-center justify-center text-center ${kbClasses.surface}">
        <svg class="w-8 h-8 mb-4 ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 7.05V12H6.05A5.97 5.97 0 0 1 6 11.5C6 8.46 8.46 6 11.5 6l.5.05V3.02A8.96 8.96 0 0 0 3 12a9 9 0 0 0 9 9 1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1ZM22 8a1 1 0 0 0-1-1h-1V3.02A8.96 8.96 0 0 0 11 12a9 9 0 0 0 9 9 1 1 0 0 0 1-1V8Z"/>
        </svg>
        <p class="text-lg ${kbClasses.textPrimary} mb-4 max-w-md">"Dark mode support that actually works. Every component looks great in both themes without any custom CSS."</p>
        <p class="${kbClasses.label}">Yuki Tanaka — Product Designer</p>
      </div>
    </kb-carousel>
  `,
};

/** Image gallery pattern — full-bleed images with swipe navigation. */
export const ImageGallery: S = {
  args: { 'show-counter': true, 'show-dots': false },
  render: (args) => html`
    <kb-carousel ${spreadAttrs(args)}>
      <div class="h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2 text-blue-400 dark:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <p class="font-sans text-sm ${kbClasses.textSecondary}">Mountain landscape</p>
        </div>
      </div>
      <div class="h-64 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950 dark:to-green-900">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2 text-green-400 dark:text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <p class="font-sans text-sm ${kbClasses.textSecondary}">Forest canopy</p>
        </div>
      </div>
      <div class="h-64 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2 text-amber-400 dark:text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <p class="font-sans text-sm ${kbClasses.textSecondary}">Desert sunset</p>
        </div>
      </div>
      <div class="h-64 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2 text-purple-400 dark:text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <p class="font-sans text-sm ${kbClasses.textSecondary}">Night sky</p>
        </div>
      </div>
    </kb-carousel>
  `,
};

/** Stats dashboard — slide between metric cards. Autoplay with progress. */
export const MetricCards: S = {
  args: { autoplay: true, interval: 3000, 'show-arrows': true },
  render: (args) => html`
    <kb-carousel ${spreadAttrs(args)}>
      <div class="p-8 ${kbClasses.surface}">
        <p class="${kbClasses.label} mb-1">Revenue</p>
        <p class="text-4xl font-bold font-sans tabular-nums ${kbClasses.textPrimary} mb-1">$124,500</p>
        <p class="text-sm text-green-600 dark:text-green-400 font-sans">+12.5% from last month</p>
      </div>
      <div class="p-8 ${kbClasses.surface}">
        <p class="${kbClasses.label} mb-1">Active Users</p>
        <p class="text-4xl font-bold font-sans tabular-nums ${kbClasses.textPrimary} mb-1">8,432</p>
        <p class="text-sm text-green-600 dark:text-green-400 font-sans">+3.2% from last week</p>
      </div>
      <div class="p-8 ${kbClasses.surface}">
        <p class="${kbClasses.label} mb-1">Conversion Rate</p>
        <p class="text-4xl font-bold font-sans tabular-nums ${kbClasses.textPrimary} mb-1">4.7%</p>
        <p class="text-sm text-red-500 dark:text-red-400 font-sans">-0.3% from last week</p>
      </div>
    </kb-carousel>
  `,
};
