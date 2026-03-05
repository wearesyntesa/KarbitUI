import { useState } from 'react'
import { Pagination } from '@wearesyntesa/karbit-ui/react/pagination'
import { Tabs } from '@wearesyntesa/karbit-ui/react/tabs'
import { Steps } from '@wearesyntesa/karbit-ui/react/steps'
import { Step } from '@wearesyntesa/karbit-ui/react/step'
import { Button } from '@wearesyntesa/karbit-ui/react/button'

const ITEMS = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)
const PAGE_SIZE = 5

export function NavigationPage() {
  const [page, setPage] = useState(1)
  const [step, setStep] = useState(1)
  const totalPages = Math.ceil(ITEMS.length / PAGE_SIZE)
  const pageItems = ITEMS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-10">
      <h1 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
        Navigation
      </h1>

      {/* Tabs */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tabs</h2>
        <Tabs variant="line" size="md">
          <span slot="tab-0">Overview</span>
          <span slot="tab-1">Metrics</span>
          <span slot="tab-2">Logs</span>
          <div slot="panel-0" className="p-4 text-sm text-slate-600 dark:text-zinc-300">
            System is operating normally with 4 of 5 services healthy.
          </div>
          <div slot="panel-1" className="p-4 text-sm text-slate-600 dark:text-zinc-300">
            P99 latency: 340ms · Throughput: 12k rps · Error rate: 0.02%
          </div>
          <div slot="panel-2" className="p-4 text-sm text-slate-600 dark:text-zinc-300">
            No critical errors in the last 24 hours.
          </div>
        </Tabs>
      </section>

      {/* Pagination */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Pagination</h2>
        <div className="border border-gray-200 dark:border-zinc-700 divide-y divide-gray-200 dark:divide-zinc-700">
          {pageItems.map((item) => (
            <div key={item} className="px-4 py-2 text-sm">{item}</div>
          ))}
        </div>
        <Pagination
          total={totalPages}
          page={page}
          siblings={1}
          onKbPageChange={(e: CustomEvent<{ page: number }>) => setPage(e.detail.page)}
        />
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Pagination key={s} total={10} page={3} size={s} />
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Steps</h2>
        <Steps
          current={step}
          onKbStepClick={(e: CustomEvent<{ index: number }>) => setStep(e.detail.index)}
        >
          <Step label="Account" />
          <Step label="Profile" />
          <Step label="Review" />
          <Step label="Done" />
        </Steps>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          <Button variant="outline" size="sm" disabled={step === 3} onClick={() => setStep(step + 1)}>Next</Button>
        </div>
      </section>
    </div>
  )
}
