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
import { NumberInput } from '@wearesyntesa/karbit-ui/react/number-input'
import { Slider } from '@wearesyntesa/karbit-ui/react/slider'
import { PinInput } from '@wearesyntesa/karbit-ui/react/pin-input'
import { Rating } from '@wearesyntesa/karbit-ui/react/rating'
import { Segment } from '@wearesyntesa/karbit-ui/react/segment'
import { TagsInput } from '@wearesyntesa/karbit-ui/react/tags-input'
import { FileUpload } from '@wearesyntesa/karbit-ui/react/file-upload'
import { TimePicker } from '@wearesyntesa/karbit-ui/react/time-picker'
import { Combobox } from '@wearesyntesa/karbit-ui/react/combobox'
import { DatePicker } from '@wearesyntesa/karbit-ui/react/date-picker'
import { ColorPicker } from '@wearesyntesa/karbit-ui/react/color-picker'
import { Editable } from '@wearesyntesa/karbit-ui/react/editable'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
] as const
type Role = (typeof ROLE_OPTIONS)[number]['value']

const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const
type Priority = (typeof PRIORITY_OPTIONS)[number]

const SEGMENT_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const
type Interval = (typeof SEGMENT_OPTIONS)[number]['value']

const FRAMEWORK_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'solid', label: 'Solid' },
] as const
type Framework = (typeof FRAMEWORK_OPTIONS)[number]['value']

export function FormsPage() {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<Role | ''>('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [notes, setNotes] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [quantity, setQuantity] = useState(5)
  const [sliderVal, setSliderVal] = useState(50)
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)
  const [interval, setInterval] = useState<Interval>('monthly')
  const [tags, setTags] = useState<readonly string[]>(['react', 'typescript'])
  const [time, setTime] = useState('')
  const [framework, setFramework] = useState<Framework | ''>('')
  const [date, setDate] = useState('')
  const [color, setColor] = useState('#3b82f6ff')
  const [editableText, setEditableText] = useState('Click me to edit')

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
          <div className="flex flex-wrap gap-6">
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

        <FormControl>
          <FormLabel>Quantity</FormLabel>
          <NumberInput
            value={quantity}
            min={0}
            max={100}
            step={1}
            onKbChange={(e) => setQuantity(Number(e.detail.value))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Volume ({sliderVal}%)</FormLabel>
          <Slider
            value={sliderVal}
            min={0}
            max={100}
            step={10}
            showValue
            showTicks
            showRange
            onKbChange={(e) => setSliderVal(Number(e.detail.value))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Verification code</FormLabel>
          <PinInput
            length={6}
            type="numeric"
            onKbComplete={(e) => setPin(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Rating ({rating}/5)</FormLabel>
          <Rating
            value={rating}
            max={5}
            allowHalf
            onKbChange={(e) => setRating(Number(e.detail.value))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Billing interval</FormLabel>
          <Segment
            options={SEGMENT_OPTIONS}
            value={interval}
            onKbChange={(e) => setInterval(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Tags</FormLabel>
          <TagsInput
            values={tags}
            placeholder="Add a tag..."
            onKbChange={(e) => setTags(e.detail.values)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Appointment time</FormLabel>
          <TimePicker
            value={time}
            placeholder="Pick a time"
            clearable
            onKbChange={(e) => setTime(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Framework</FormLabel>
          <Combobox
            options={FRAMEWORK_OPTIONS}
            value={framework}
            placeholder="Search frameworks..."
            clearable
            onKbChange={(e) => setFramework(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Date</FormLabel>
          <DatePicker
            value={date}
            placeholder="Pick a date"
            clearable
            onKbChange={(e) => setDate(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Color</FormLabel>
          <ColorPicker
            value={color}
            showAlpha
            onKbChange={(e) => setColor(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Editable text</FormLabel>
          <Editable
            value={editableText}
            placeholder="Click to edit"
            onKbEditSubmit={(e) => setEditableText(e.detail.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Attachments</FormLabel>
          <FileUpload
            accept="image/*,.pdf"
            multiple
            maxSize={5_000_000}
          />
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
          <div className="flex flex-wrap gap-2">
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
          <div>quantity: {quantity}</div>
          <div>slider: {sliderVal}%</div>
          <div>pin: {pin || '—'}</div>
          <div>rating: {rating}</div>
          <div>interval: {interval}</div>
          <div>tags: {tags.join(', ') || '—'}</div>
          <div>time: {time || '—'}</div>
          <div>framework: {framework || '—'}</div>
          <div>date: {date || '—'}</div>
          <div>color: {color}</div>
          <div>editable: {editableText}</div>
        </div>

      </form>
    </div>
  )
}
