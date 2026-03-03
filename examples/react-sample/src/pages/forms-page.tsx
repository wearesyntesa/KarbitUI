import { useState } from 'react'
import { Button } from '@wearesyntesa/karbit-ui/react/button'
import { ButtonGroup } from '@wearesyntesa/karbit-ui/react/button-group'
import { Input } from '@wearesyntesa/karbit-ui/react/input'
import { Select } from '@wearesyntesa/karbit-ui/react/select'
import { Checkbox } from '@wearesyntesa/karbit-ui/react/checkbox'
import { Radio } from '@wearesyntesa/karbit-ui/react/radio'
import { Textarea } from '@wearesyntesa/karbit-ui/react/textarea'
import { FormControl } from '@wearesyntesa/karbit-ui/react/form-control'
import { FormLabel } from '@wearesyntesa/karbit-ui/react/form-label'
import { Switch } from '@wearesyntesa/karbit-ui/react/switch'
import { IconButton } from '@wearesyntesa/karbit-ui/react/icon-button'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
] as const
type Role = (typeof ROLE_OPTIONS)[number]['value']

const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const
type Priority = (typeof PRIORITY_OPTIONS)[number]

export function FormsPage() {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<Role | ''>('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [notes, setNotes] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
        Forms
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Enter username"
            value={username}
            clearable
            onKbInput={(e) => setUsername(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Role</FormLabel>
          <Select
            options={ROLE_OPTIONS}
            value={role}
            placeholder="Pick a role"
            onKbChange={(e) => setRole(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Priority</FormLabel>
          <div className="flex gap-6">
            {PRIORITY_OPTIONS.map((val) => (
              <Radio
                key={val}
                value={val}
                checked={priority === val}
                onKbChange={() => setPriority(val)}
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </Radio>
            ))}
          </div>
        </FormControl>

        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            placeholder="Add a note..."
            value={notes}
            rows={4}
            resize="vertical"
            onKbInput={(e) => setNotes(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <Checkbox
            checked={termsAccepted}
            onKbChange={(e) => setTermsAccepted(e.detail.checked)}
          >
            Accept terms and conditions
          </Checkbox>
        </FormControl>

        <FormControl>
          <Switch
            checked={notifications}
            onKbChange={(e) => setNotifications(e.detail.checked)}
          >
            Enable notifications
          </Switch>
        </FormControl>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button variants</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="solid" type="submit" loading={loading} loadingText="Saving...">Submit</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="solid" colorScheme="red" disabled>Disabled</Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button sizes</p>
          <div className="flex flex-wrap items-center gap-2">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <Button key={s} size={s} variant="outline">{s.toUpperCase()}</Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Button group</p>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Icon buttons</p>
          <div className="flex gap-2">
            <IconButton variant="solid" aria-label="Add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 5v14M5 12h14"/></svg>
            </IconButton>
            <IconButton variant="outline" aria-label="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/></svg>
            </IconButton>
            <IconButton variant="ghost" aria-label="Settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </IconButton>
          </div>
        </div>

        <div className="border border-gray-100 dark:border-zinc-700 p-4 text-xs space-y-1 text-gray-500 dark:text-zinc-400">
          <div>username: {username || '—'}</div>
          <div>role: {role || '—'}</div>
          <div>priority: {priority || '—'}</div>
          <div>terms: {String(termsAccepted)}</div>
          <div>notifications: {String(notifications)}</div>
        </div>

      </form>
    </div>
  )
}
