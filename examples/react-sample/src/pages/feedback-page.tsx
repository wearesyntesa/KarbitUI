import { useState } from 'react'
import { Alert } from '@wearesyntesa/karbit-ui/react/alert'
import { Badge } from '@wearesyntesa/karbit-ui/react/badge'
import { Progress } from '@wearesyntesa/karbit-ui/react/progress'
import { Spinner } from '@wearesyntesa/karbit-ui/react/spinner'
import { Toast } from '@wearesyntesa/karbit-ui/react/toast'
import { Button } from '@wearesyntesa/karbit-ui/react/button'
import { Skeleton } from '@wearesyntesa/karbit-ui/react/skeleton'
import { Clipboard } from '@wearesyntesa/karbit-ui/react/clipboard'
import { EmptyState } from '@wearesyntesa/karbit-ui/react/empty-state'
import { CircularProgress } from '@wearesyntesa/karbit-ui/react/circular-progress'

export function FeedbackPage() {
  const [toastVisible, setToastVisible] = useState(false)
  const [progressValue, setProgressValue] = useState(60)
  const [circularValue, setCircularValue] = useState(72)

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-10">
      <h1 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
        Feedback
      </h1>

      {/* Alert — statuses */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert — statuses</h2>
        <Alert status="info" variant="subtle">Informational message</Alert>
        <Alert status="success" variant="subtle">Operation completed successfully</Alert>
        <Alert status="warning" variant="subtle">This action may have consequences</Alert>
        <Alert status="error" variant="subtle">Something went wrong</Alert>
      </section>

      {/* Alert — variants */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert — variants</h2>
        <Alert status="info" variant="solid">Solid info alert</Alert>
        <Alert status="success" variant="outline">Outline success alert</Alert>
        <Alert status="warning" variant="left-accent">Left accent warning alert</Alert>
      </section>

      {/* Alert — closable with title */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert — closable with title</h2>
        <Alert status="error" variant="subtle" closable>
          <span slot="title">Deployment Failed</span>
          Pipeline encountered 3 errors during build phase.
          <span slot="action">
            <Button variant="ghost" size="xs">Retry</Button>
          </span>
        </Alert>
      </section>

      {/* Badge */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Badge</h2>
        <div className="flex flex-wrap gap-2">
          {(['solid', 'outline', 'subtle'] as const).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
          {(['xs', 'sm', 'md'] as const).map((s) => (
            <Badge key={s} size={s} variant="solid">
              {s}
            </Badge>
          ))}
          <Badge variant="subtle" closable onKbClose={() => alert('badge closed')}>
            Closable
          </Badge>
        </div>
      </section>

      {/* Progress */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Progress</h2>
        <div className="space-y-2">
          <Progress value={progressValue} max={100} />
          <Progress value={progressValue} max={100} size="sm" />
          <Progress value={progressValue} max={100} size="lg" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setProgressValue((v) => Math.max(0, v - 10))}
          >
            − 10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setProgressValue((v) => Math.min(100, v + 10))}
          >
            + 10
          </Button>
          <span className="text-sm self-center">{progressValue}%</span>
        </div>
      </section>

      {/* Spinner */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Spinner</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
          <Spinner variant="dots" />
          <Spinner variant="pulse" />
        </div>
      </section>

      {/* Toast */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Toast</h2>
        <Button variant="outline" onClick={() => setToastVisible(true)}>
          Show toast
        </Button>
        {toastVisible && (
          <Toast
            status="success"
            position="bottom-right"
            closable
            onKbClose={() => setToastVisible(false)}
          >
            Changes saved successfully
          </Toast>
        )}
      </section>

      {/* Clipboard — inline */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Clipboard — inline</h2>
        <Clipboard value="npm install @wearesyntesa/karbit-ui" show-value label="Install Command" />
        <Clipboard value="https://karbit.dev" show-value label="Documentation URL" />
        <Clipboard value="sk-1234-abcd-5678" show-value label="API Key" size="sm" />
      </section>

      {/* Clipboard — button */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Clipboard — button</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Clipboard value="npm install @wearesyntesa/karbit-ui" label="Copy" />
          <Clipboard value="https://karbit.dev" label="Copy URL" variant="subtle" />
          <Clipboard value="sk-1234-abcd-5678" variant="ghost" size="sm" />
        </div>
      </section>

      {/* Skeleton */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Skeleton</h2>
        <Skeleton width="60%" />
        <Skeleton width="100%" size="lg" />
        <Skeleton width="40%" size="sm" />
        <div className="flex gap-4 mt-4">
          <Skeleton circle height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton lines={3} />
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Empty State</h2>
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started."
        >
          <span slot="icon">
            <svg className="w-full h-full text-slate-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="square" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </span>
          <span slot="action">
            <Button variant="solid" size="sm">New Project</Button>
          </span>
        </EmptyState>
        <EmptyState
          title="No results found"
          description="Try adjusting your search or filters."
          size="sm"
        />
      </section>

      {/* Circular Progress */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Circular Progress</h2>
        <div className="flex flex-wrap items-end gap-6">
          <CircularProgress value={circularValue} max={100} size="sm" />
          <CircularProgress value={circularValue} max={100} size="md" showValue />
          <CircularProgress value={circularValue} max={100} size="lg" showValue colorScheme="green" />
          <CircularProgress indeterminate size="md" />
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCircularValue((v) => Math.max(0, v - 10))}
          >
            &minus; 10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCircularValue((v) => Math.min(100, v + 10))}
          >
            + 10
          </Button>
          <span className="text-sm self-center">{circularValue}%</span>
        </div>
      </section>
    </div>
  )
}
