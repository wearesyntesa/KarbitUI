import { Table } from '@wearesyntesa/karbit-ui/react/table'
import { Card } from '@wearesyntesa/karbit-ui/react/card'
import { List } from '@wearesyntesa/karbit-ui/react/list'
import { ListItem } from '@wearesyntesa/karbit-ui/react/list-item'
import { AccordionGroup } from '@wearesyntesa/karbit-ui/react/accordion-group'
import { Accordion } from '@wearesyntesa/karbit-ui/react/accordion'
import { Tabs } from '@wearesyntesa/karbit-ui/react/tabs'
import { Tag } from '@wearesyntesa/karbit-ui/react/tag'
import { TagGroup } from '@wearesyntesa/karbit-ui/react/tag-group'

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

export function DataDisplayPage() {
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
        <div className="grid grid-cols-3 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
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
    </div>
  )
}
