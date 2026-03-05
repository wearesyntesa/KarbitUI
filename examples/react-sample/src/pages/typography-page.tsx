import { useState } from 'react'
import { Heading } from '@wearesyntesa/karbit-ui/react/heading'
import { Text } from '@wearesyntesa/karbit-ui/react/text'
import { Code } from '@wearesyntesa/karbit-ui/react/code'
import { Divider } from '@wearesyntesa/karbit-ui/react/divider'
import { Blockquote } from '@wearesyntesa/karbit-ui/react/blockquote'
import { Highlight } from '@wearesyntesa/karbit-ui/react/highlight'

export function TypographyPage() {
  const [searchQuery, setSearchQuery] = useState('design')

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <h1 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
        Typography
      </h1>

      {/* Heading — levels */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Heading — levels</h2>
        {(['1', '2', '3', '4', '5', '6'] as const).map((lvl) => (
          <Heading key={lvl} level={lvl}>Heading level {lvl}</Heading>
        ))}
      </section>

      {/* Heading — sizes */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Heading — sizes</h2>
        {(['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const).map((s) => (
          <Heading key={s} level="3" size={s}>Size {s}</Heading>
        ))}
      </section>

      {/* Heading — tones */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Heading — tones</h2>
        <div className="space-y-1">
          {(['primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'error'] as const).map((t) => (
            <Heading key={t} level="4" tone={t}>{t}</Heading>
          ))}
        </div>
      </section>

      <Divider />

      {/* Text — variants */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — variants</h2>
        <Text variant="body">Body text — the default variant for paragraph content.</Text>
        <Text variant="label">Label text — used for form labels and section headings.</Text>
        <Text variant="caption">Caption text — smaller supplementary information.</Text>
        <Text variant="overline">Overline text — uppercase small tracking.</Text>
      </section>

      {/* Text — sizes */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — sizes</h2>
        {(['2xl', 'xl', 'lg', 'base', 'sm', 'xs'] as const).map((s) => (
          <Text key={s} size={s}>Text size {s}</Text>
        ))}
      </section>

      {/* Text — tones */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — tones</h2>
        <div className="space-y-1">
          {(['primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'error'] as const).map((t) => (
            <Text key={t} tone={t}>{t} tone</Text>
          ))}
        </div>
      </section>

      {/* Text — truncate / clamp */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Text — truncate &amp; clamp</h2>
        <Text truncate>This is a very long text that should be truncated with an ellipsis when it overflows the container boundary.</Text>
        <Text clamp={2}>This is a multi-line text that should be clamped to two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Text>
      </section>

      <Divider />

      {/* Code — inline */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Code — inline</h2>
        <Text>
          Use <Code>npm install @wearesyntesa/karbit-ui</Code> to install the package.
        </Text>
        <Text>
          Then import components like <Code>{'import { Button } from \'karbit-ui\''}</Code>.
        </Text>
      </section>

      {/* Code — block */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Code — block</h2>
        <Code block language="typescript" filename="example.ts">
{`import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  @property() name = 'World';

  render() {
    return html\`<p>Hello, \${this.name}!</p>\`;
  }
}`}
        </Code>
        <Code block language="css" filename="styles.css">
{`:host {
  display: block;
  font-family: monospace;
  border: 1px solid currentColor;
  padding: 1rem;
}`}
        </Code>
      </section>

      <Divider />

      {/* Blockquote */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Blockquote</h2>
        <Blockquote>
          Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects, and the products are not burdened with non-essentials.
          <span slot="cite">Dieter Rams</span>
        </Blockquote>
        <Blockquote variant="plain">
          Simplicity is the ultimate sophistication.
          <span slot="cite">Leonardo da Vinci</span>
        </Blockquote>
        <Blockquote colorScheme="blue">
          The details are not the details. They make the design.
          <span slot="cite">Charles Eames</span>
        </Blockquote>
      </section>

      {/* Highlight */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Highlight — inline</h2>
        <Text>
          This sentence contains <Highlight>highlighted text</Highlight> for emphasis.
        </Text>
        <Text>
          Color schemes: <Highlight colorScheme="yellow">yellow</Highlight>{' '}
          <Highlight colorScheme="green">green</Highlight>{' '}
          <Highlight colorScheme="blue">blue</Highlight>{' '}
          <Highlight colorScheme="red">red</Highlight>{' '}
          <Highlight colorScheme="purple">purple</Highlight>
        </Text>
      </section>

      {/* Highlight — search mode */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Highlight — search</h2>
        <div className="flex gap-2 items-center mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm w-40"
            placeholder="Search..."
          />
        </div>
        <Highlight
          text="KarbitUI is a brutalist design system built with Lit web components and Tailwind CSS. It follows a structured minimal design philosophy."
          query={searchQuery}
        />
      </section>
    </div>
  )
}
