import { useState } from 'react'
import { Modal } from '@wearesyntesa/karbit-ui/react/modal'
import { Drawer } from '@wearesyntesa/karbit-ui/react/drawer'
import { Popover } from '@wearesyntesa/karbit-ui/react/popover'
import { Tooltip } from '@wearesyntesa/karbit-ui/react/tooltip'
import { Button } from '@wearesyntesa/karbit-ui/react/button'

export function OverlayPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPlacement, setDrawerPlacement] = useState<'left' | 'right' | 'top' | 'bottom'>('right')

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-10">
      <h1 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
        Overlay
      </h1>

      {/* Modal */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Modal</h2>
        <Button variant="outline" onClick={() => setModalOpen(true)}>Open modal</Button>
        <Modal
          open={modalOpen}
          size="md"
          onKbClose={() => setModalOpen(false)}
        >
          <span slot="header">Confirm Action</span>
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            Are you sure you want to proceed? This action cannot be undone.
          </p>
          <span slot="footer">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="solid" onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </span>
        </Modal>
      </section>

      {/* Drawer */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Drawer</h2>
        <div className="flex flex-wrap gap-2">
          {(['left', 'right', 'top', 'bottom'] as const).map((p) => (
            <Button
              key={p}
              variant="outline"
              onClick={() => {
                setDrawerPlacement(p)
                setDrawerOpen(true)
              }}
            >
              {p}
            </Button>
          ))}
        </div>
        <Drawer
          open={drawerOpen}
          placement={drawerPlacement}
          size="md"
          onKbClose={() => setDrawerOpen(false)}
        >
          <span slot="header">Drawer — {drawerPlacement}</span>
          <div className="space-y-3 text-sm text-slate-600 dark:text-zinc-300">
            <p>This is a {drawerPlacement} drawer.</p>
            <p>Click outside or press Esc to close.</p>
          </div>
        </Drawer>
      </section>

      {/* Popover */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Popover</h2>
        <div className="flex gap-4 flex-wrap">
          <Popover trigger="click" placement="bottom">
            <Button variant="outline" slot="trigger">Click popover</Button>
            <div className="text-sm space-y-1">
              <p className="font-semibold">Popover title</p>
              <p className="text-slate-500 dark:text-zinc-300">Some content inside a popover triggered on click.</p>
            </div>
          </Popover>
          <Popover trigger="hover" placement="top">
            <Button variant="outline" slot="trigger">Hover popover</Button>
            <div className="text-sm">Hovered content</div>
          </Popover>
        </div>
      </section>

      {/* Tooltip */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Tooltip</h2>
        <div className="flex gap-4 flex-wrap items-center">
          {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
            <Tooltip key={p} label={`Tooltip — ${p}`} placement={p}>
              <Button variant="outline">{p}</Button>
            </Tooltip>
          ))}
        </div>
      </section>
    </div>
  )
}
