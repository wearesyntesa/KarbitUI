import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { TreeNode } from '../../src/components/data-display/kb-tree-view.js';
import '../../src/components/data-display/kb-tree-view.define.js';

const FILE_TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'input', label: 'Input.tsx' },
          { id: 'modal', label: 'Modal.tsx' },
        ],
      },
      {
        id: 'utils',
        label: 'utils',
        children: [
          { id: 'helpers', label: 'helpers.ts' },
          { id: 'constants', label: 'constants.ts', disabled: true },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  {
    id: 'tests',
    label: 'tests',
    children: [
      {
        id: 'unit',
        label: 'unit',
        children: [{ id: 'button-test', label: 'Button.test.tsx' }],
      },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];

const LARGE_TREE: TreeNode[] = [
  {
    id: 'app',
    label: 'app',
    children: [
      {
        id: 'api',
        label: 'api',
        children: [
          {
            id: 'routes',
            label: 'routes',
            children: [
              { id: 'auth-route', label: 'auth.ts' },
              { id: 'users-route', label: 'users.ts' },
              { id: 'posts-route', label: 'posts.ts' },
            ],
          },
          {
            id: 'middleware',
            label: 'middleware',
            children: [
              { id: 'auth-mw', label: 'auth.ts' },
              { id: 'logging-mw', label: 'logging.ts' },
              { id: 'rate-limit-mw', label: 'rate-limit.ts' },
            ],
          },
          {
            id: 'models',
            label: 'models',
            children: [
              { id: 'user-model', label: 'User.ts' },
              { id: 'post-model', label: 'Post.ts' },
              { id: 'comment-model', label: 'Comment.ts' },
            ],
          },
        ],
      },
      {
        id: 'client',
        label: 'client',
        children: [
          {
            id: 'pages',
            label: 'pages',
            children: [
              { id: 'home-page', label: 'Home.tsx' },
              { id: 'dashboard-page', label: 'Dashboard.tsx' },
              { id: 'settings-page', label: 'Settings.tsx' },
            ],
          },
          {
            id: 'components-client',
            label: 'components',
            children: [
              { id: 'header', label: 'Header.tsx' },
              { id: 'footer', label: 'Footer.tsx' },
              { id: 'sidebar', label: 'Sidebar.tsx' },
              { id: 'nav', label: 'Nav.tsx' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'config',
    label: 'config',
    children: [
      { id: 'tsconfig', label: 'tsconfig.json' },
      { id: 'eslintrc', label: '.eslintrc.js' },
      { id: 'prettier', label: '.prettierrc' },
    ],
  },
  { id: 'docker', label: 'Dockerfile' },
  { id: 'makefile', label: 'Makefile' },
];

const DISABLED_TREE: TreeNode[] = [
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'assets', label: 'assets', children: [{ id: 'logo', label: 'logo.svg' }] },
      { id: 'favicon', label: 'favicon.ico' },
    ],
  },
  {
    id: 'private',
    label: 'private',
    disabled: true,
    children: [
      { id: 'secrets', label: 'secrets.json', disabled: true },
      { id: 'keys', label: 'keys.pem', disabled: true },
    ],
  },
  { id: 'env-file', label: '.env', disabled: true },
  { id: 'readme-disabled', label: 'README.md' },
];

const PROJECT_TREE: TreeNode[] = [
  {
    id: 'frontend',
    label: 'frontend',
    children: [
      {
        id: 'fe-src',
        label: 'src',
        children: [
          {
            id: 'fe-pages',
            label: 'pages',
            children: [
              { id: 'fe-home', label: 'index.tsx' },
              { id: 'fe-about', label: 'about.tsx' },
              { id: 'fe-contact', label: 'contact.tsx' },
            ],
          },
          {
            id: 'fe-components',
            label: 'components',
            children: [
              { id: 'fe-header', label: 'Header.tsx' },
              { id: 'fe-footer', label: 'Footer.tsx' },
              { id: 'fe-layout', label: 'Layout.tsx' },
            ],
          },
          {
            id: 'fe-styles',
            label: 'styles',
            children: [
              { id: 'fe-global', label: 'global.css' },
              { id: 'fe-vars', label: 'variables.css' },
            ],
          },
        ],
      },
      { id: 'fe-package', label: 'package.json' },
      { id: 'fe-tsconfig', label: 'tsconfig.json' },
    ],
  },
  {
    id: 'backend',
    label: 'backend',
    children: [
      {
        id: 'be-src',
        label: 'src',
        children: [
          {
            id: 'be-controllers',
            label: 'controllers',
            children: [
              { id: 'be-user-ctrl', label: 'userController.ts' },
              { id: 'be-auth-ctrl', label: 'authController.ts' },
            ],
          },
          {
            id: 'be-services',
            label: 'services',
            children: [
              { id: 'be-user-svc', label: 'userService.ts' },
              { id: 'be-auth-svc', label: 'authService.ts' },
              { id: 'be-email-svc', label: 'emailService.ts' },
            ],
          },
          { id: 'be-index', label: 'index.ts' },
        ],
      },
      { id: 'be-package', label: 'package.json' },
    ],
  },
  {
    id: 'shared',
    label: 'shared',
    children: [
      { id: 'shared-types', label: 'types.ts' },
      { id: 'shared-utils', label: 'utils.ts' },
      { id: 'shared-constants', label: 'constants.ts' },
    ],
  },
  { id: 'root-readme', label: 'README.md' },
  { id: 'root-license', label: 'LICENSE' },
];

export default {
  title: 'Data Display/Tree View',
  component: 'kb-tree-view',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <div class="max-w-sm">
      <kb-tree-view .nodes=${FILE_TREE}></kb-tree-view>
    </div>
  `,
};

export const WithIcons: S = {
  name: 'With Icons',
  render: () => html`
    <div class="max-w-sm">
      <kb-tree-view .nodes=${FILE_TREE} show-icons></kb-tree-view>
    </div>
  `,
};

export const WithGuideLines: S = {
  name: 'With Guide Lines',
  render: () => html`
    <div class="max-w-sm">
      <kb-tree-view .nodes=${FILE_TREE} show-lines show-icons></kb-tree-view>
    </div>
  `,
};

export const LargeTree: S = {
  name: 'Large Tree',
  render: () => html`
    <div class="max-w-md">
      <kb-tree-view .nodes=${LARGE_TREE} show-icons></kb-tree-view>
    </div>
  `,
};

export const PreExpanded: S = {
  name: 'Pre-Expanded Nodes',
  render: () => html`
    <div class="max-w-sm">
      <kb-tree-view
        .nodes=${FILE_TREE}
        show-icons
        .expanded-ids=${['src', 'components', 'tests']}
        selected-id="button"
      ></kb-tree-view>
    </div>
  `,
};

export const DisabledNodes: S = {
  name: 'Disabled Nodes',
  render: () => html`
    <div class="max-w-sm">
      <kb-tree-view
        .nodes=${DISABLED_TREE}
        show-icons
        .expanded-ids=${['public', 'assets', 'private']}
      ></kb-tree-view>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex gap-8 flex-wrap">
      ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(
        (size) => html`
          <div class="flex-1 min-w-[200px]">
            <div class="font-mono text-xs uppercase tracking-widest mb-2 opacity-50">${size}</div>
            <kb-tree-view
              .nodes=${FILE_TREE}
              size=${size}
              show-icons
              .expanded-ids=${['src', 'components']}
            ></kb-tree-view>
          </div>
        `,
      )}
    </div>
  `,
};

export const MonorepoProject: S = {
  name: 'Monorepo Project',
  render: () => html`
    <div class="max-w-md">
      <kb-tree-view
        .nodes=${PROJECT_TREE}
        show-icons
        show-lines
        .expanded-ids=${['frontend', 'fe-src', 'backend', 'be-src']}
      ></kb-tree-view>
    </div>
  `,
};

export const InteractiveFileExplorer: S = {
  name: 'Interactive File Explorer',
  render: () => {
    const handleToggle = (e: CustomEvent<{ id: string; expanded: boolean }>): void => {
      const action = e.detail.expanded ? 'Expanded' : 'Collapsed';
      console.log(`${action}: ${e.detail.id}`);
    };
    const handleSelect = (e: CustomEvent<{ id: string; label: string }>): void => {
      console.log(`Selected: ${e.detail.label} (${e.detail.id})`);
    };
    return html`
      <div class="max-w-sm">
        <div class="font-mono text-xs uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500">Click rows to expand & select (see console)</div>
        <kb-tree-view
          .nodes=${FILE_TREE}
          show-icons
          show-lines
          @kb-node-toggle=${handleToggle}
          @kb-node-select=${handleSelect}
        ></kb-tree-view>
      </div>
    `;
  },
};

export const NoSelection: S = {
  name: 'No Selection',
  render: () => html`
    <div class="max-w-sm">
      <kb-tree-view .nodes=${FILE_TREE} show-icons .selectable=${false}></kb-tree-view>
    </div>
  `,
};
