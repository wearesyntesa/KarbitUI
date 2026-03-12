# KarbitUI

[![npm version](https://img.shields.io/npm/v/@wearesyntesa/karbit-ui)](https://www.npmjs.com/package/@wearesyntesa/karbit-ui)
[![npm downloads](https://img.shields.io/npm/dm/@wearesyntesa/karbit-ui)](https://www.npmjs.com/package/@wearesyntesa/karbit-ui)
[![license](https://img.shields.io/npm/l/@wearesyntesa/karbit-ui)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@wearesyntesa/karbit-ui)](https://bundlephobia.com/package/@wearesyntesa/karbit-ui)

A karbit-peeps web component library built on Lit v3. Ships with React wrappers and works with Vue, Svelte, and vanilla HTML out of the box.

Components render in the Light DOM, so Tailwind CSS classes apply directly without Shadow DOM barriers.

> This project is under active development.

## Installation

```
npm install @wearesyntesa/karbit-ui
```

## Tailwind CSS Setup

KarbitUI outputs Tailwind utility classes. Your project must have Tailwind CSS configured.

Add the KarbitUI preset to your `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
import karbitPreset from '@wearesyntesa/karbit-ui/tailwind.config'

const config: Config = {
  presets: [karbitPreset],
  content: ['./src/**/*.{html,js,ts,jsx,tsx}', './node_modules/@wearesyntesa/karbit-ui/dist/**/*.js'],
}

export default config
```

The preset registers brutal box shadows, `kb-*` color tokens, IBM Plex Mono as the default mono font, and `0px` border radius defaults.

## Usage

### HTML

```html
<script type="module">
  import '@wearesyntesa/karbit-ui'
</script>

<kb-button variant="solid" size="lg">EXECUTE</kb-button>
<kb-input placeholder="Enter value" variant="outline"></kb-input>
```

### React

```tsx
import { Button, Input, Stack } from '@wearesyntesa/karbit-ui/react'

function App() {
  return (
    <Stack direction="vertical" gap="4">
      <Input placeholder="Username" variant="outline" onKbChange={(e) => console.log(e.detail.value)} />
      <Button variant="solid" size="md">
        SUBMIT
      </Button>
    </Stack>
  )
}
```

## Style Props

All components inherit style props from the base element. These map directly to Tailwind utility classes.

```html
<kb-box p="4" m="2" bg="blue-500" color="white" w="full" shadow="brutal"> Content </kb-box>
```

`p="4"` produces `p-4`, `bg="red-500"` produces `bg-red-500`, and so on. Props cover spacing, color, sizing, border, layout, flex, grid, and typography.

## Documentation

Full component API reference and live examples are available at the documentation site.

```bash
pnpm docs:build      # build the documentation site
pnpm docs:serve      # preview the built site locally
```

## Development

```bash
pnpm install
pnpm build           # typecheck + vite library build
pnpm typecheck       # tsc --noEmit
pnpm dev             # vite build in watch mode
```

### Examples

```bash
pnpm example:react   # run the React sample app
pnpm example:vue     # run the Vue sample app
pnpm example:svelte  # run the Svelte sample app
```

## License

MIT
