# KarbitUI // UNDER DEVELOPMENT

A neo-brutalist design system built on **Lit v3 web components** for "Karbit"-peeps. Works with React, Vue, Svelte, and vanilla HTML.

```
npm install @wearesyntesa/karbit-ui
```

## Features

- **34 components** across 7 categories (layout, typography, forms, feedback, data display, overlay, navigation)
- **Light DOM** rendering — no Shadow DOM, full Tailwind compatibility
- **Style props** — Chakra-like shorthand props (`p`, `m`, `bg`, `color`, etc.) that map to Tailwind classes
- **Variant recipes** — CVA-inspired type-safe variant system
- **Tree-shakeable** — `preserveModules` build with `sideEffects: false`
- **Cross-framework** — works everywhere, first-class React wrappers included
- **Type-safe** — extensive use of mapped types, template literal types, and conditional types

## Quick Start

### Tailwind CSS Setup (Required)

KarbitUI outputs Tailwind utility classes. Your project must have Tailwind CSS configured.

Add the KarbitUI preset to your `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';
import karbitPreset from '@wearesyntesa/karbit-ui/tailwind.config';

const config: Config = {
  presets: [karbitPreset],
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './node_modules/@wearesyntesa/karbit-ui/dist/**/*.js',
  ],
};

export default config;
```

The preset provides:
- Brutal box shadows (`shadow-brutal`, `shadow-brutal-lg`, etc.)
- `kb-*` color tokens
- IBM Plex Mono font family
- `0px` border radius defaults

### Vanilla HTML

```html
<script type="module">
  import '@wearesyntesa/karbit-ui';
</script>

<kb-button variant="solid" size="lg">EXECUTE</kb-button>
<kb-input placeholder="Enter value" variant="outline"></kb-input>
```

### React

```tsx
import { Button, Input, Stack } from '@wearesyntesa/karbit-ui/react';

function App() {
  return (
    <Stack direction="vertical" gap="4">
      <Input
        placeholder="Username"
        variant="outline"
        onKbChange={(e) => console.log(e.detail.value)}
      />
      <Button variant="solid" size="md" p="4" bg="blue-500">
        SUBMIT
      </Button>
    </Stack>
  );
}
```

## Components

### Layout

| Component | Tag | Description |
|---|---|---|
| Box | `kb-box` | Base div primitive with style props |
| Flex | `kb-flex` | Flexbox container with shorthand props |
| Grid | `kb-grid` | CSS Grid container |
| Stack | `kb-stack` | Linear stack (vertical/horizontal) |
| Container | `kb-container` | Centered max-width container |
| Divider | `kb-divider` | Horizontal/vertical separator |

### Typography

| Component | Tag | Description |
|---|---|---|
| Text | `kb-text` | Body text with size variants |
| Heading | `kb-heading` | h1-h6 headings, auto-sized, uppercase |
| Code | `kb-code` | Inline/block code display |

### Forms

| Component | Tag | Description |
|---|---|---|
| Button | `kb-button` | solid/outline/ghost/link × xs-xl, loading state |
| IconButton | `kb-icon-button` | Square icon button, `aria-label` required |
| Input | `kb-input` | outline/filled/flushed variants |
| Textarea | `kb-textarea` | Multi-line input, same variants as Input |
| Select | `kb-select` | Dropdown with custom arrow |
| Checkbox | `kb-checkbox` | Custom checkbox with indeterminate state |
| Radio | `kb-radio` | Custom radio button |
| Switch | `kb-switch` | Toggle switch |
| FormControl | `kb-form-control` | Group wrapper (required/invalid/disabled) |
| FormLabel | `kb-form-label` | Label with required asterisk |

### Feedback

| Component | Tag | Description |
|---|---|---|
| Alert | `kb-alert` | Status alert (info/success/warning/error), 4 variants |
| Badge | `kb-badge` | Compact label |
| Spinner | `kb-spinner` | Animated loading indicator |
| Progress | `kb-progress` | Determinate/indeterminate progress bar |
| Toast | `kb-toast` | Auto-dismiss notification popup, 6 positions |

### Data Display

| Component | Tag | Description |
|---|---|---|
| Card | `kb-card` | elevated/outline/filled, optional interactive mode |
| Table | `kb-table` | simple/striped with hover rows |
| Accordion | `kb-accordion` | Collapsible panel with +/- indicator |
| List | `kb-list` | ordered/unordered/none, spacing variants |
| Tag | `kb-tag` | Closable interactive tag |

### Overlay

| Component | Tag | Description |
|---|---|---|
| Modal | `kb-modal` | Dialog with backdrop, keyboard dismiss |
| Drawer | `kb-drawer` | Slide-out panel from any edge |
| Tooltip | `kb-tooltip` | Hover/focus tooltip with placement |
| Popover | `kb-popover` | Interactive popover with click/hover triggers |

### Navigation

| Component | Tag | Description |
|---|---|---|
| Tabs | `kb-tabs` | line/enclosed/solid variants, fitted mode |
| Breadcrumb | `kb-breadcrumb` | Trail navigation with custom separators |
| Link | `kb-link` | underline/plain/brutal variants, external support |

## Style Props

All components inherit style props from `KbBaseElement`. These map directly to Tailwind utility classes:

```html
<kb-box p="4" m="2" bg="blue-500" color="white" w="full" shadow="brutal">
  Content
</kb-box>
```

### Available Props

| Category | Props |
|---|---|
| Spacing | `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` |
| Color | `bg`, `color`, `opacity` |
| Sizing | `w`, `h`, `minW`, `maxW`, `minH`, `maxH` |
| Border | `border`, `borderColor`, `borderTop`, `borderRight`, `borderBottom`, `borderLeft`, `rounded`, `shadow` |
| Layout | `display`, `position`, `top`, `right`, `bottom`, `left`, `zIndex`, `overflow`, `overflowX`, `overflowY` |
| Flex | `gap`, `gapX`, `gapY`, `alignItems`, `justifyContent`, `flexDir`, `flexWrap`, `flexGrow`, `flexShrink`, `flex` |
| Grid | `gridCols`, `gridRows`, `colSpan`, `rowSpan` |
| Typography | `fontSize`, `fontWeight`, `fontFamily`, `textAlign`, `lineHeight`, `letterSpacing`, `textDecoration`, `textTransform` |
| Misc | `cursor`, `userSelect`, `pointerEvents`, `transition` |

Props accept Tailwind values as strings. For example, `p="4"` produces `p-4`, `bg="red-500"` produces `bg-red-500`.

## Variant Recipes

Components use a CVA-inspired `recipe()` function for type-safe variants:

```ts
import { recipe } from '@wearesyntesa/karbit-ui';

const chipRecipe = recipe({
  base: 'inline-flex items-center font-mono border-2 border-black',
  variants: {
    size: {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-1.5',
    },
    intent: {
      neutral: 'bg-gray-100 text-black',
      danger: 'bg-red-500 text-white',
    },
  },
  defaultVariants: { size: 'md' },
});

// `intent` is required (no default), `size` is optional (has default)
chipRecipe({ intent: 'danger' });           // valid
chipRecipe({ intent: 'danger', size: 'lg' }); // valid
chipRecipe({});                              // type error: missing `intent`
```

## Design Tokens

Access the brutalist theme tokens programmatically:

```ts
import { theme, brutalClasses } from '@wearesyntesa/karbit-ui/theme';

theme.colors.red    // '#ef4444'
theme.shadows.brutal // '4px 4px 0px 0px rgba(0,0,0,1)'
theme.fonts.mono    // '"IBM Plex Mono", ...'

brutalClasses.base   // 'font-mono border-2 border-black rounded-none'
brutalClasses.hover  // 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg'
brutalClasses.active // 'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
```

## Custom Events (React)

React wrappers expose typed event handlers for custom events:

| Event Prop | Detail Type | Components |
|---|---|---|
| `onKbInput` | `{ value: string }` | Input, Textarea |
| `onKbChange` | `{ value: string }` | Input, Select |
| `onKbChange` | `{ checked: boolean }` | Checkbox, Switch |
| `onKbChange` | `{ checked: boolean, value: string }` | Radio |
| `onKbClose` | — | Alert, Toast, Tag, Modal, Drawer, Popover |
| `onKbOpen` | — | Popover |
| `onKbToggle` | `{ open: boolean }` | Accordion |
| `onKbTabChange` | `{ index: number }` | Tabs |

## Architecture

```
STYLE_PROP_DEFS (single source of truth)
    ├── StyleProps type (computed via mapped types)
    ├── STYLE_PROP_KEYS (derived)
    ├── KbBaseElement.properties (generated at runtime)
    └── mapPropToClass() (prop → Tailwind class)

recipe() → RecipeFunction<V, D>
    ├── Type-safe variant props (required vs optional based on defaults)
    └── LRU-cached class string output
```

All components use **Light DOM** (`createRenderRoot() → this`), enabling direct Tailwind styling without CSS encapsulation barriers.

## Package Exports

```json
{
  ".":       "dist/index.js",
  "./theme": "dist/core/theme.js",
  "./react": "dist/react/index.js"
}
```

## Development

```bash
pnpm install
pnpm run build       # typecheck + vite build
pnpm run typecheck   # tsc --noEmit only
pnpm run dev         # vite build --watch
pnpm run storybook
```

## License

MIT
