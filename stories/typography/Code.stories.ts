import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import { KbCode } from '../../src/components/typography/kb-code.js';

// ── Demo highlighter (mimics what Prism/highlight.js would produce) ──────────
// This is NOT shipped with KarbitUI — it's a story-only demo showing how the
// pluggable hook works. In real usage, wire up Prism.js, highlight.js, or Shiki.

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'class', 'extends', 'import', 'export', 'from', 'default', 'new', 'this',
  'typeof', 'instanceof', 'async', 'await', 'yield', 'throw', 'try', 'catch',
  'finally', 'switch', 'case', 'break', 'continue', 'do', 'in', 'of', 'void',
  'delete', 'null', 'undefined', 'true', 'false', 'type', 'interface', 'enum',
]);

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function demoHighlight(code: string): string {
  // Tokenize with a simple regex — good enough for demo purposes
  const TOKEN_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$][\w$]*\b)/g;

  let result = '';
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_RE)) {
    const idx = match.index;
    if (idx > lastIndex) {
      result += esc(code.slice(lastIndex, idx));
    }

    const [full, comment, str, num, ident] = match;
    if (comment) {
      result += `<span style="color:#6b7280;font-style:italic">${esc(full)}</span>`;
    } else if (str) {
      result += `<span style="color:#16a34a">${esc(full)}</span>`;
    } else if (num) {
      result += `<span style="color:#d97706">${esc(full)}</span>`;
    } else if (ident && JS_KEYWORDS.has(full)) {
      result += `<span style="color:#7c3aed;font-weight:600">${esc(full)}</span>`;
    } else {
      result += esc(full);
    }

    lastIndex = idx + full.length;
  }

  if (lastIndex < code.length) {
    result += esc(code.slice(lastIndex));
  }

  return result;
}

// Register the demo highlighter
KbCode.highlighter = (_code, _lang) => demoHighlight(_code);

// ── Stories ──────────────────────────────────────────────────────────────────

export default {
  title: 'Typography/Code',
  component: 'kb-code',
  render: (args) => html`<kb-code ${spreadAttrs(args)}>const x = 42;</kb-code>`,
} satisfies Meta;

type S = StoryObj;

export const Inline: S = {};

export const InlineInText: S = {
  render: () => html`
    <p style="font-family:sans-serif;color:#334155;">
      Use <kb-code>npm install @wearesyntesa/karbit-ui</kb-code> to add the package,
      then import with <kb-code>import '@wearesyntesa/karbit-ui'</kb-code>.
    </p>
  `,
};

export const Block: S = {
  args: { block: true },
  render: (args) => html`
    <kb-code ${spreadAttrs(args)}>function greet(name: string) {
  return \`Hello, \${name}!\`;
}</kb-code>
  `,
};

export const BlockWithCopy: S = {
  render: () => html`
    <kb-code block>import { KbButton } from '@wearesyntesa/karbit-ui';

const App = () => {
  return html\`&lt;kb-button variant="solid"&gt;Click me&lt;/kb-button&gt;\`;
};</kb-code>
  `,
};

export const SyntaxHighlighted: S = {
  render: () => html`
    <kb-code block language="typescript">const greeting = "Hello, world!";

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the 10th Fibonacci number
const result = fibonacci(10);
console.log(result); // 55</kb-code>
  `,
};

export const SyntaxHighlightedInline: S = {
  render: () => html`
    <p style="font-family:sans-serif;color:#334155;">
      Declare a variable with <kb-code language="javascript">const x = 42;</kb-code> or
      use <kb-code language="javascript">let name = "Karbit";</kb-code> for mutable bindings.
    </p>
  `,
};

export const BlockMultipleSnippets: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <kb-code block language="bash">npm install @wearesyntesa/karbit-ui</kb-code>
      <kb-code block language="typescript">import '@wearesyntesa/karbit-ui';
import '@wearesyntesa/karbit-ui/react';</kb-code>
      <kb-code block language="typescript">// Usage
const el = document.createElement('kb-button');
el.variant = 'solid';
el.textContent = 'Hello';</kb-code>
    </div>
  `,
};

export const WithFilename: S = {
  render: () => html`
    <kb-code block filename="src/main.ts" language="typescript">import { KbButton, KbCode } from '@wearesyntesa/karbit-ui';

// Register all components
const app = document.getElementById('app');
if (app) {
  app.innerHTML = '<kb-button variant="solid">Hello</kb-button>';
}</kb-code>
  `,
};

export const MultipleFilenames: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <kb-code block filename="package.json" language="json">{
  "name": "my-app",
  "dependencies": {
    "@wearesyntesa/karbit-ui": "^2.0.0"
  }
}</kb-code>
      <kb-code block filename="src/App.tsx" language="typescript">import '@wearesyntesa/karbit-ui';

export function App() {
  return (
    <kb-button variant="solid" color-scheme="blue">
      Get Started
    </kb-button>
  );
}</kb-code>
      <kb-code block filename=".env">VITE_API_URL=https://api.example.com
VITE_APP_NAME=KarbitUI Demo</kb-code>
    </div>
  `,
};
