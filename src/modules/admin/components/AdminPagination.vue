<template>
  <nav
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6
           dark:border-white/10 dark:bg-transparent"
    aria-label="Pagination"
  >
    <!-- Info -->
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        {{ m.commonUi.showing }}
        <span class="font-medium">{{ from }}</span>
        {{ m.commonUi.to }}
        <span class="font-medium">{{ to }}</span>
        {{ m.commonUi.of }}
        <span class="font-medium">{{ total }}</span>
        {{ m.commonUi.results }}
      </p>
    </div>

    <!-- Controls -->
    <div class="flex flex-1 justify-between sm:justify-end gap-3">
      <button
        type="button"
        class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold
               text-gray-700 inset-ring inset-ring-gray-300 hover:bg-gray-50
               disabled:opacity-50 disabled:cursor-not-allowed
               dark:bg-white/10 dark:text-gray-200 dark:inset-ring-white/5 dark:hover:bg-white/20"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        {{ m.commonUi.previous }}
      </button>

      <button
        type="button"
        class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold
               text-gray-700 inset-ring inset-ring-gray-300 hover:bg-gray-50
               disabled:opacity-50 disabled:cursor-not-allowed
               dark:bg-white/10 dark:text-gray-200 dark:inset-ring-white/5 dark:hover:bg-white/20"
        :disabled="page >= totalPages"
        @click="emit('update:page', page + 1)"
      >
        {{ m.commonUi.next }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'

const { m } = useI18n()

const props = defineProps<{
  page: number
  perPage: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.perPage))
)

const from = computed(() =>
  props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1
)

const to = computed(() =>
  Math.min(props.page * props.perPage, props.total)
)
</script>
