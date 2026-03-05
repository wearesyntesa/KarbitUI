import { useState } from 'react'
import { Modal } from '@wearesyntesa/karbit-ui/react/modal'
import { Drawer } from '@wearesyntesa/karbit-ui/react/drawer'
import { Popover } from '@wearesyntesa/karbit-ui/react/popover'
import { Tooltip } from '@wearesyntesa/karbit-ui/react/tooltip'
import { Button } from '@wearesyntesa/karbit-ui/react/button'
import { DropdownMenu } from '@wearesyntesa/karbit-ui/react/dropdown-menu'
import { MenuItem } from '@wearesyntesa/karbit-ui/react/menu-item'
import { AlertDialog } from '@wearesyntesa/karbit-ui/react/alert-dialog'
import { ContextMenu } from '@wearesyntesa/karbit-ui/react/context-menu'
import { HoverCard } from '@wearesyntesa/karbit-ui/react/hover-card'

export function OverlayPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPlacement, setDrawerPlacement] = useState<'left' | 'right' | 'top' | 'bottom'>('right')
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

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

      {/* Dropdown Menu */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Dropdown Menu</h2>
        <div className="flex flex-wrap gap-4">
          <DropdownMenu placement="bottom">
            <Button variant="outline" slot="trigger">Actions</Button>
            <MenuItem value="edit">Edit</MenuItem>
            <MenuItem value="duplicate">Duplicate</MenuItem>
            <MenuItem value="archive">Archive</MenuItem>
            <MenuItem value="delete" destructive>Delete</MenuItem>
          </DropdownMenu>
          <DropdownMenu placement="bottom" size="sm">
            <Button variant="outline" slot="trigger" size="sm">Small menu</Button>
            <MenuItem value="copy">Copy</MenuItem>
            <MenuItem value="paste">Paste</MenuItem>
            <MenuItem value="cut" disabled>Cut (disabled)</MenuItem>
          </DropdownMenu>
        </div>
      </section>

      {/* Alert Dialog */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Alert Dialog</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => setAlertOpen(true)}>Confirm action</Button>
          <Button variant="solid" colorScheme="red" onClick={() => setDeleteAlertOpen(true)}>Delete item</Button>
        </div>
        <AlertDialog
          open={alertOpen}
          size="sm"
          onKbConfirm={() => setAlertOpen(false)}
          onKbCancel={() => setAlertOpen(false)}
        >
          <span slot="header">Confirm changes</span>
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            Are you sure you want to save these changes? This will update the production configuration.
          </p>
          <span slot="footer">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" data-action="cancel">Cancel</Button>
              <Button variant="solid" data-action="confirm">Confirm</Button>
            </div>
          </span>
        </AlertDialog>
        <AlertDialog
          open={deleteAlertOpen}
          size="sm"
          onKbConfirm={() => setDeleteAlertOpen(false)}
          onKbCancel={() => setDeleteAlertOpen(false)}
        >
          <span slot="header">Delete item</span>
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            This action cannot be undone. The item and all associated data will be permanently removed.
          </p>
          <span slot="footer">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" data-action="cancel">Cancel</Button>
              <Button variant="solid" colorScheme="red" data-action="confirm">Delete</Button>
            </div>
          </span>
        </AlertDialog>
      </section>

      {/* Context Menu */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Context Menu</h2>
        <ContextMenu>
          <div slot="trigger" className="border border-dashed border-gray-300 dark:border-zinc-600 p-8 text-center text-sm text-slate-500 dark:text-zinc-400">
            Right-click this area
          </div>
          <MenuItem value="cut">Cut</MenuItem>
          <MenuItem value="copy">Copy</MenuItem>
          <MenuItem value="paste">Paste</MenuItem>
          <MenuItem value="delete" destructive>Delete</MenuItem>
        </ContextMenu>
      </section>

      {/* Hover Card */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Hover Card</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <HoverCard placement="bottom" size="md">
            <span className="underline decoration-dotted cursor-pointer text-sm">Hover me</span>
            <div slot="content" className="space-y-2">
              <p className="font-semibold text-sm">Profile Card</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                A preview card that appears on hover. Useful for user profiles, link previews, or additional context.
              </p>
            </div>
          </HoverCard>
          <HoverCard placement="top" size="sm">
            <span className="underline decoration-dotted cursor-pointer text-sm">Top placement</span>
            <div slot="content">
              <p className="text-xs">This card opens above the trigger.</p>
            </div>
          </HoverCard>
        </div>
      </section>
    </div>
  )
}
