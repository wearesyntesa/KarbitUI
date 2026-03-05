import { Box } from '@wearesyntesa/karbit-ui/react/box'
import { Container } from '@wearesyntesa/karbit-ui/react/container'
import { Divider } from '@wearesyntesa/karbit-ui/react/divider'
import { Flex } from '@wearesyntesa/karbit-ui/react/flex'
import { Grid } from '@wearesyntesa/karbit-ui/react/grid'
import { Stack } from '@wearesyntesa/karbit-ui/react/stack'
import { ScrollArea } from '@wearesyntesa/karbit-ui/react/scroll-area'

export function LayoutPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <h1 className="text-xl font-bold uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700 pb-4">
        Layout
      </h1>

      {/* Box */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Box</h2>
        <Box className="border border-gray-200 dark:border-zinc-700 p-4 text-sm">
          A generic container element with no semantic meaning — useful as a building block.
        </Box>
      </section>

      {/* Container */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Container — sizes</h2>
        {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Container key={s} size={s} className="border border-dashed border-gray-300 dark:border-zinc-600 p-3 text-xs text-slate-500 dark:text-zinc-400">
            Container size=&quot;{s}&quot;
          </Container>
        ))}
      </section>

      {/* Divider */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Divider</h2>
        <Divider />
        <Divider variant="dashed" />
        <Divider variant="dotted" />
        <Divider label="OR" />
        <div className="flex items-center h-16 gap-4">
          <span className="text-sm">Left</span>
          <Divider orientation="vertical" />
          <span className="text-sm">Right</span>
        </div>
      </section>

      {/* Flex */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Flex</h2>
        <Flex justify="space-between" align="center" className="gap-4">
          {[1, 2, 3].map((n) => (
            <Box key={n} className="border border-gray-200 dark:border-zinc-700 p-4 text-center text-sm flex-1">
              Item {n}
            </Box>
          ))}
        </Flex>
        <Flex direction="column" className="gap-2">
          {[1, 2].map((n) => (
            <Box key={n} className="border border-gray-200 dark:border-zinc-700 p-3 text-sm">
              Column item {n}
            </Box>
          ))}
        </Flex>
      </section>

      {/* Grid */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Grid</h2>
        <Grid columns="3" className="gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Box key={n} className="border border-gray-200 dark:border-zinc-700 p-4 text-center text-sm">
              Cell {n}
            </Box>
          ))}
        </Grid>
        <Grid columns="4" className="gap-2">
          {[1, 2, 3, 4].map((n) => (
            <Box key={n} className="border border-gray-200 dark:border-zinc-700 p-3 text-center text-xs">
              4-col {n}
            </Box>
          ))}
        </Grid>
      </section>

      {/* Stack */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Stack — vertical</h2>
        <Stack spacing="4">
          {[1, 2, 3].map((n) => (
            <Box key={n} className="border border-gray-200 dark:border-zinc-700 p-3 text-sm">
              Stacked item {n}
            </Box>
          ))}
        </Stack>
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Stack — horizontal</h2>
        <Stack direction="horizontal" spacing="4">
          {[1, 2, 3].map((n) => (
            <Box key={n} className="border border-gray-200 dark:border-zinc-700 p-4 text-sm">
              H-item {n}
            </Box>
          ))}
        </Stack>
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Stack — with divider</h2>
        <Stack spacing="4" divider>
          {[1, 2, 3].map((n) => (
            <Box key={n} className="p-3 text-sm">
              Divided item {n}
            </Box>
          ))}
        </Stack>
      </section>

      {/* Scroll Area */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300">Scroll Area — vertical</h2>
        <ScrollArea direction="vertical" scrollbar="hover" bordered className="h-48">
          <div className="p-4 space-y-3">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-sm text-slate-600 dark:text-zinc-300">
                Scrollable item {i + 1} — this content overflows the container.
              </p>
            ))}
          </div>
        </ScrollArea>
        <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-300 mt-4">Scroll Area — horizontal</h2>
        <ScrollArea direction="horizontal" scrollbar="always" bordered className="h-auto">
          <div className="flex gap-4 p-4 w-max">
            {Array.from({ length: 12 }, (_, i) => (
              <Box key={i} className="border border-gray-200 dark:border-zinc-700 p-4 text-center text-sm shrink-0 w-36">
                Card {i + 1}
              </Box>
            ))}
          </div>
        </ScrollArea>
      </section>
    </div>
  )
}
