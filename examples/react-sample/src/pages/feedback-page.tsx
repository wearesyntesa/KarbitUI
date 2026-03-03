import { useState } from 'react'
import { Alert } from '@wearesyntesa/karbit-ui/react/alert'
import { Badge } from '@wearesyntesa/karbit-ui/react/badge'
import { Progress } from '@wearesyntesa/karbit-ui/react/progress'
import { Spinner } from '@wearesyntesa/karbit-ui/react/spinner'
import { Toast } from '@wearesyntesa/karbit-ui/react/toast'
import { Button } from '@wearesyntesa/karbit-ui/react/button'

export function FeedbackPage() {
  const [toastVisible, setToastVisible] = useState(false)
  const [progressValue, setProgressValue] = useState(60)

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
        <div className="flex items-center gap-4">
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
    </div>
  )
}
