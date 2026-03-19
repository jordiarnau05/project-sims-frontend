<template>
  <div class="p-4 max-w-2xl mx-auto">

    <!-- Back -->
    <div class="mb-6">
      <router-link
        to="/tickets"
        class="inline-flex items-center text-indigo-400 hover:text-indigo-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ m.ticketsUi.backToTickets }}
      </router-link>
    </div>

    <!-- Card -->
    <div class="bg-white dark:bg-gray-900 shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ m.ticketsUi.openNewTicket }}</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ m.ticketsUi.openNewTicketSubtitle }}
        </p>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700 space-y-5"
      >
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ m.ticketsUi.title }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            maxlength="255"
            :placeholder="m.ticketsUi.titlePlaceholder"
            class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ m.ticketsUi.description }}
          </label>
          <textarea
            v-model="form.description"
            rows="6"
            :placeholder="m.ticketsUi.descriptionPlaceholder"
            class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
          />
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <router-link
            to="/tickets"
            class="flex-1 text-center px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-sm font-medium"
          >
            {{ m.ticketsUi.cancel }}
          </router-link>
          <button
            type="submit"
            :disabled="loading || !form.title.trim()"
            class="flex-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ loading ? m.ticketsUi.creating : m.ticketsUi.openTicket }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTickets } from '../composables/useTickets'
import { useToast } from '@/modules/common/composables/useToast'
import type { TicketForm } from '../interfaces/ticket.interface'
import { useI18n } from '@/i18n'

const router = useRouter()
const toast = useToast()
const { loading, createTicket } = useTickets()
const { m } = useI18n()

const form = reactive<TicketForm>({
  title: '',
  description: '',
})

const handleSubmit = async () => {
  if (!form.title.trim()) return
  try {
    const ticket = await createTicket({
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
    })
    toast.success(m.value.ticketsUi.ticketCreated)
    router.push(`/tickets/${ticket.id}`)
  } catch (err: any) {
    const msg = err?.response?.data?.message || m.value.ticketsUi.createTicketError
    toast.error(msg)
  }
}
</script>
