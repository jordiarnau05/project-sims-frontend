<template>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="relative min-w-full divide-y divide-gray-300 dark:divide-white/15">
          <thead>
            <tr>
              <th
                v-for="(col, idx) in columns"
                :key="col.key"
                scope="col"
                :class="thClass(idx)"
              >
                <span v-if="col.srOnly" class="sr-only">{{ col.label }}</span>
                <span v-else>{{ col.label }}</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 dark:divide-white/10">
              <!-- rows -->
            <slot />
          </tbody>
        </table>

          <!-- optional: empty state inside the table -->
        <div
          v-if="empty"
          class="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <slot name="empty">{{ m.commonUi.noResults }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { m } = useI18n()

type Column = {
  key: string
  label: string
  srOnly?: boolean
}

const props = defineProps<{
  columns: Column[]
  empty?: boolean
}>()

function thClass(idx: number) {
  // Copia tu estilo exacto del ejemplo Tailwind:
  // 1ª columna: pr-3 pl-4 sm:pl-0
  // columnas intermedias: px-3
  // last (actions): pr-4 pl-3 sm:pr-0 (typically sr-only)
  const base = 'py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white'
  const first = 'pr-3 pl-4 sm:pl-0'
  const middle = 'px-3'
  const last = 'pr-4 pl-3 sm:pr-0 text-right'

  if (idx === 0) return `${base} ${first}`
  if (idx === props.columns.length - 1) return `${base} ${last}`
  return `${base} ${middle}`
}
</script>
