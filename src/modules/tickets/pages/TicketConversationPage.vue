<template>
  <div class="p-4 max-w-3xl mx-auto">

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

    <!-- Loading -->
    <div v-if="loading && !ticket" class="text-center text-gray-400 py-12">{{ m.ticketsUi.loadingTicket }}</div>

    <template v-else-if="ticket">

      <!-- Ticket info card -->
      <div class="bg-white dark:bg-gray-900 shadow rounded-lg mb-6 px-4 py-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ ticket.title }}</h2>
            <p class="mt-1 text-xs text-gray-500">{{ m.ticketsUi.openedOn }} {{ formatDate(ticket.created_at) }}</p>
          </div>
          <span
            :class="[
              'inline-flex rounded-full px-2 py-1 text-xs font-semibold shrink-0',
              ticket.active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
            ]"
          >
            {{ ticket.active ? m.ticketsUi.active : m.ticketsUi.closed }}
          </span>
        </div>
        <p v-if="ticket.description" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ ticket.description }}
        </p>
      </div>

      <!-- Messages -->
      <div class="space-y-4 mb-6">
        <p v-if="messages.length === 0" class="text-center text-sm text-gray-400 py-4">
          {{ m.ticketsUi.noMessages }}
        </p>

        <div
          v-for="m in messages"
          :key="m.id"
          :class="[
            'flex gap-2',
            m.user_id === currentUserId ? 'flex-row-reverse' : 'flex-row',
          ]"
        >
          <!-- Avatar initials -->
          <div
            :class="[
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none',
              m.user_id === currentUserId ? 'bg-indigo-600' : 'bg-gray-600',
            ]"
          >
            {{ initials(m.user?.name) }}
          </div>

          <!-- Bubble -->
          <div :class="m.user_id === currentUserId ? 'items-end' : 'items-start'" class="flex flex-col max-w-[75%]">
            <div class="flex items-baseline gap-2 mb-1" :class="m.user_id === currentUserId ? 'flex-row-reverse' : 'flex-row'">
              <span class="text-xs font-semibold" :class="m.user_id === currentUserId ? 'text-indigo-400' : 'text-gray-300'">
                {{ m.user?.name || i18nM.ticketsUi.unknown }}
              </span>
              <span class="text-xs text-gray-500">{{ formatDate(m.created_at) }}</span>
            </div>
            <div
              :class="[
                'px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm',
                m.user_id === currentUserId
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-gray-800 text-gray-100 rounded-tl-sm',
              ]"
            >
              {{ m.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Reply form (only when ticket is active) -->
      <div
        v-if="ticket.active"
        class="bg-white dark:bg-gray-900 shadow rounded-lg px-4 py-4"
      >
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ i18nM.ticketsUi.reply }}</h3>
        <textarea
          v-model="replyText"
          rows="4"
          :placeholder="i18nM.ticketsUi.replyPlaceholder"
          class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
        />
        <div class="mt-3 flex justify-end">
          <button
            :disabled="sending || !replyText.trim()"
            @click="handleReply"
            class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="sending" class="animate-spin h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ sending ? i18nM.ticketsUi.sending : i18nM.ticketsUi.send }}
          </button>
        </div>
      </div>

      <p v-else class="text-center text-sm text-gray-500 py-4">
        {{ i18nM.ticketsUi.ticketClosedInfo }}
      </p>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTickets } from '../composables/useTickets'
import { useToast } from '@/modules/common/composables/useToast'
import { useAuth } from '@/modules/auth/composables/useAuth'
import type { TicketMessage } from '../interfaces/ticket.interface'
import { useI18n } from '@/i18n'

const route = useRoute()
const toast = useToast()
const { user: authUser } = useAuth()
const { ticket, loading, getTicket, sendMessage } = useTickets()
const { m: i18nM, locale } = useI18n()

const currentUserId = computed(() => authUser.value?.id ?? null)
const initials = (name?: string) =>
  (name ?? '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const id = Number(route.params.id)
const messages = ref<TicketMessage[]>([])
const replyText = ref('')
const sending = ref(false)

const localeCode = computed(() => {
  if (locale.value === 'es') return 'es-ES'
  if (locale.value === 'en') return 'en-GB'
  return 'ca-ES'
})

const load = async () => {
  try {
    const data = await getTicket(id)
    messages.value = data.messages ?? []
  } catch {
    toast.error(i18nM.value.ticketsUi.loadTicketError)
  }
}

const handleReply = async () => {
  if (!replyText.value.trim()) return
  sending.value = true
  try {
    const msg = await sendMessage(id, replyText.value.trim())
    messages.value.push(msg)
    replyText.value = ''
  } catch (err: any) {
    const detail = err?.response?.data?.message || i18nM.value.ticketsUi.sendMessageError
    toast.error(detail)
  } finally {
    sending.value = false
  }
}

const formatDate = (iso: string) => iso ? new Date(iso).toLocaleString(localeCode.value) : '-'

onMounted(load)
</script>
