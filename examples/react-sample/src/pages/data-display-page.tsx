import { useState } from 'react'
import { Table } from '@wearesyntesa/karbit-ui/react/table'
import { Card } from '@wearesyntesa/karbit-ui/react/card'
import { List } from '@wearesyntesa/karbit-ui/react/list'
import { ListItem } from '@wearesyntesa/karbit-ui/react/list-item'
import { AccordionGroup } from '@wearesyntesa/karbit-ui/react/accordion-group'
import { Accordion } from '@wearesyntesa/karbit-ui/react/accordion'
import { Tabs } from '@wearesyntesa/karbit-ui/react/tabs'
import { Tag } from '@wearesyntesa/karbit-ui/react/tag'
import { TagGroup } from '@wearesyntesa/karbit-ui/react/tag-group'
import { Avatar } from '@wearesyntesa/karbit-ui/react/avatar'
import { AvatarGroup } from '@wearesyntesa/karbit-ui/react/avatar-group'
import { Kbd } from '@wearesyntesa/karbit-ui/react/kbd'
import { Stat } from '@wearesyntesa/karbit-ui/react/stat'
import { Collapsible } from '@wearesyntesa/karbit-ui/react/collapsible'
import { TreeView } from '@wearesyntesa/karbit-ui/react/tree-view'
import { Timeline } from '@wearesyntesa/karbit-ui/react/timeline'
import { Carousel } from '@wearesyntesa/karbit-ui/react/carousel'
import { Button } from '@wearesyntesa/karbit-ui/react/button'
import { DataList } from '@wearesyntesa/karbit-ui/react/data-list'

import type { TreeNode } from '@wearesyntesa/karbit-ui/react/tree-view'
import type { TimelineItem } from '@wearesyntesa/karbit-ui/react/timeline'
import type { DataListItem } from '@wearesyntesa/karbit-ui/react/data-list'

const SERVICES = [
  { name: 'Auth', status: 'healthy', latency: 12, region: 'ap-southeast-1' },
  { name: 'API Gateway', status: 'degraded', latency: 340, region: 'ap-southeast-1' },
  { name: 'Database', status: 'healthy', latency: 4, region: 'ap-southeast-2' },
  { name: 'Cache', status: 'healthy', latency: 1, region: 'ap-southeast-1' },
  { name: 'Queue', status: 'down', latency: 0, region: 'ap-southeast-3' },
]

const TABS_CONFIG = [
  { label: 'Overview', panel: 'System is operating normally with 4 of 5 services healthy.' },
  { label: 'Metrics', panel: 'P99 latency: 340ms · Throughput: 12k rps · Error rate: 0.02%' },
  { label: 'Logs', panel: 'No critical errors in the last 24 hours.' },
]

const TREE_DATA: readonly TreeNode[] = [
  {
    id: 'src', label: 'src', children: [
      { id: 'components', label: 'components', children: [
        { id: 'button', label: 'Button.tsx' },
        { id: 'input', label: 'Input.tsx' },
        { id: 'select', label: 'Select.tsx' },
      ]},
      { id: 'utils', label: 'utils', children: [
        { id: 'helpers', label: 'helpers.ts' },
        { id: 'constants', label: 'constants.ts' },
      ]},
      { id: 'app', label: 'App.tsx' },
    ],
  },
  {
    id: 'public', label: 'public', children: [
      { id: 'favicon', label: 'favicon.ico' },
    ],
  },
  { id: 'package', label: 'package.json' },
]

const TIMELINE_ITEMS: TimelineItem[] = [
  { id: '1', title: 'Project created', description: 'Repository initialized and dependencies installed', timestamp: '2025-01-15', status: 'success' },
  { id: '2', title: 'Alpha release', description: 'First internal release with core components', timestamp: '2025-03-01', status: 'success' },
  { id: '3', title: 'Beta release', description: 'Public beta with documentation site', timestamp: '2025-06-15', status: 'warning', active: true },
  { id: '4', title: 'Stable release', description: 'Production-ready v1.0', timestamp: '2025-09-01', status: 'default' },
]

const SERVER_DETAILS: readonly DataListItem[] = [
  { label: 'Hostname', value: 'prod-web-01.cluster.local' },
  { label: 'IP Address', value: '10.0.42.17' },
  { label: 'Region', value: 'ap-southeast-1' },
  { label: 'Status', value: 'Running' },
  { label: 'Uptime', value: '42 days, 7 hours' },
]

export function DataDisplayPage() {
  const [collapseOpen, setCollapseOpen] = useState(false)

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <h1 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
        Data Display
      </h1>

      {/* Table */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Table</h2>
        <Table sortable searchable variant="simple" caption="Services" size="md">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th data-sort="number">Latency (ms)</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.status}</td>
                  <td>{s.latency}</td>
                  <td>{s.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </section>

      {/* Card */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(['elevated', 'outline', 'filled'] as const).map((v) => (
            <Card key={v} variant={v}>
              <div className="p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mb-1">{v}</p>
                <p className="font-semibold text-sm">Card title</p>
                <p className="text-xs text-slate-500 dark:text-zinc-300 mt-1">Some card description content here.</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* List */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 dark:text-zinc-300 mb-2">plain (unordered)</p>
            <List variant="plain">
              <ListItem>Deploy to staging</ListItem>
              <ListItem>Run smoke tests</ListItem>
              <ListItem>Promote to production</ListItem>
            </List>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-zinc-300 mb-2">ordered</p>
            <List variant="ordered">
              <ListItem>Checkout feature branch</ListItem>
              <ListItem>Open pull request</ListItem>
              <ListItem>Merge after approval</ListItem>
            </List>
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Accordion</h2>
        <AccordionGroup>
          <Accordion>
            <span slot="trigger">What is KarbitUI?</span>
            A brutalist design system built on Lit web components with Tailwind CSS and a Chakra UI-like API.
          </Accordion>
          <Accordion>
            <span slot="trigger">How does it work with React?</span>
            Through @lit/react createComponent wrappers that expose typed props and custom events as idiomatic React props.
          </Accordion>
          <Accordion>
            <span slot="trigger">Is it production ready?</span>
            It is currently in active development. Breaking changes may occur between minor versions.
          </Accordion>
        </AccordionGroup>
      </section>

      {/* Tabs */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tabs</h2>
        <Tabs variant="line" size="md">
          {TABS_CONFIG.map((t, i) => (
            <span key={`tab-${i}`} slot={`tab-${i}`}>{t.label}</span>
          ))}
          {TABS_CONFIG.map((t, i) => (
            <div key={`panel-${i}`} slot={`panel-${i}`} className="p-4 text-sm text-slate-600 dark:text-zinc-300">
              {t.panel}
            </div>
          ))}
        </Tabs>
      </section>

      {/* Tags */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {(['solid', 'outline', 'subtle'] as const).map((v) => (
            <Tag key={v} variant={v}>{v}</Tag>
          ))}
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Tag key={s} size={s} variant="outline">{s}</Tag>
          ))}
          <Tag variant="subtle" closable onKbClose={() => alert('tag removed')}>
            Closable
          </Tag>
        </div>
        <TagGroup>
          <Tag variant="outline">TypeScript</Tag>
          <Tag variant="outline">Lit</Tag>
          <Tag variant="outline">React</Tag>
          <Tag variant="outline">Tailwind</Tag>
        </TagGroup>
      </section>

      {/* Avatar */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Avatar</h2>
        <div className="flex flex-wrap items-center gap-3">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Avatar key={s} name="Jane Doe" size={s} colorScheme="blue" />
          ))}
          <Avatar name="John Smith" badge="green" />
          <Avatar src="https://i.pravatar.cc/80?u=avatar-demo" name="Alice" size="lg" />
        </div>
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Avatar Group</h2>
        <AvatarGroup max={3} size="md" spacing="md">
          <Avatar name="Alice" colorScheme="red" />
          <Avatar name="Bob" colorScheme="blue" />
          <Avatar name="Carol" colorScheme="green" />
          <Avatar name="Dave" colorScheme="yellow" />
          <Avatar name="Eve" colorScheme="purple" />
        </AvatarGroup>
      </section>

      {/* Kbd */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Kbd</h2>
        <div className="flex items-center gap-1">
          <Kbd>Ctrl</Kbd><span className="text-xs text-slate-400">+</span><Kbd>S</Kbd>
          <span className="text-xs text-slate-400 ml-3">Save</span>
        </div>
        <div className="flex items-center gap-1">
          <Kbd>Ctrl</Kbd><span className="text-xs text-slate-400">+</span><Kbd>Shift</Kbd><span className="text-xs text-slate-400">+</span><Kbd>P</Kbd>
          <span className="text-xs text-slate-400 ml-3">Command palette</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Kbd key={s} size={s}>Esc</Kbd>
          ))}
        </div>
      </section>

      {/* Stat */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Stat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Stat label="Revenue" value="$12,450" helpText="+12.5% from last month" indicator="increase" />
          <Stat label="Users" value="1,024" helpText="-3.2% from last week" indicator="decrease" />
          <Stat label="Uptime" value="99.98%" helpText="Last 30 days" />
        </div>
      </section>

      {/* TreeView */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">TreeView</h2>
        <TreeView nodes={TREE_DATA} show-lines show-icons selectable />
      </section>

      {/* Timeline */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Timeline</h2>
        <Timeline items={TIMELINE_ITEMS} variant="left" lineVariant="solid" show-icons />
      </section>

      {/* Carousel */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Carousel</h2>
        <Carousel showArrows showDots show-counter loop>
          <div className="p-8 bg-white dark:bg-zinc-900">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Revenue</p>
            <p className="text-4xl font-bold font-sans tabular-nums text-slate-900 dark:text-zinc-50 mb-1">$124,500</p>
            <p className="text-sm text-green-600 dark:text-green-400">+12.5% from last month</p>
          </div>
          <div className="p-8 bg-white dark:bg-zinc-900">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Active Users</p>
            <p className="text-4xl font-bold font-sans tabular-nums text-slate-900 dark:text-zinc-50 mb-1">8,432</p>
            <p className="text-sm text-green-600 dark:text-green-400">+3.2% from last week</p>
          </div>
          <div className="p-8 bg-white dark:bg-zinc-900">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Conversion</p>
            <p className="text-4xl font-bold font-sans tabular-nums text-slate-900 dark:text-zinc-50 mb-1">4.7%</p>
            <p className="text-sm text-red-500 dark:text-red-400">-0.3% from last week</p>
          </div>
        </Carousel>
      </section>

      {/* Collapsible */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Collapsible</h2>
        <Button variant="outline" onClick={() => setCollapseOpen(!collapseOpen)}>
          {collapseOpen ? 'Hide' : 'Show'} details
        </Button>
        <Collapsible open={collapseOpen}>
          <div className="border border-gray-200 dark:border-zinc-700 p-4 text-sm text-slate-600 dark:text-zinc-300 space-y-2">
            <p>This content is revealed by the collapsible component.</p>
            <p>Unlike accordion, the trigger is external — you control the <code>open</code> prop directly.</p>
          </div>
        </Collapsible>
      </section>

      {/* Data List */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Data List</h2>
        <DataList items={SERVER_DETAILS} orientation="horizontal" divider />
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Data List — vertical</h2>
        <DataList items={SERVER_DETAILS} orientation="vertical" size="sm" />
      </section>
    </div>
  )
}
