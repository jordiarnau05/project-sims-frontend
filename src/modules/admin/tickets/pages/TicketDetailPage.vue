<template>
  <div class="px-4 sm:px-6 lg:px-8 max-w-5xl">

    <!-- Back button -->
    <div class="mb-6">
      <router-link
        to="/admin/tickets"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to tickets
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading && !ticket" class="text-center text-gray-500 py-12">Loading ticket...</div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 py-8">{{ error }}</div>

    <template v-else-if="ticket">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-900 shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ ticket.title }}
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              By <span class="font-medium">{{ ticket.user?.name || '-' }}</span>
              ({{ ticket.user?.email || '-' }}) ·
              {{ formatDate(ticket.created_at) }}
            </p>
            <p v-if="ticket.description" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {{ ticket.description }}
            </p>
          </div>

          <!-- Status selector + delete -->
          <div class="flex items-center gap-3 shrink-0">
            <select
              :value="ticket.active"
              @change="toggleStatus($event)"
              class="rounded-md border-0 px-2 py-1 text-sm shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
            >
              <option :value="true">Active</option>
              <option :value="false">Closed</option>
            </select>

            <button
              @click="confirmingDelete = true"
              class="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500"
            >
              <span class="material-icons text-base">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Conversation: chat style -->
      <div class="bg-white dark:bg-gray-900 shadow rounded-lg mb-6 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Conversation</h3>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ conversationMessages.length }} messages</span>
        </div>

        <div ref="chatScrollEl" class="px-4 py-4 space-y-4 max-h-[52vh] overflow-y-auto bg-gray-50/60 dark:bg-gray-950/30">
          <p v-if="conversationMessages.length === 0" class="text-sm text-gray-400 text-center py-4">
            No messages yet.
          </p>

          <div
            v-for="m in conversationMessages"
            :key="`${m.id}-${m.created_at}`"
            :class="[
              'flex gap-2',
              m.user_id === currentUserId ? 'flex-row-reverse' : 'flex-row',
            ]"
          >
            <div
              :class="[
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none',
                isClientMessage(m) ? 'bg-emerald-600' : (m.user_id === currentUserId ? 'bg-indigo-600' : 'bg-violet-600'),
              ]"
            >
              {{ initials(m.user?.name) }}
            </div>

            <div :class="m.user_id === currentUserId ? 'items-end' : 'items-start'" class="flex flex-col max-w-[82%]">
              <div class="flex items-center gap-2 mb-1" :class="m.user_id === currentUserId ? 'flex-row-reverse' : 'flex-row'">
                <span class="text-xs font-semibold" :class="isClientMessage(m) ? 'text-emerald-400' : (m.user_id === currentUserId ? 'text-indigo-400' : 'text-violet-400')">
                  {{ m.user?.name || 'Unknown' }}
                </span>
                <span class="text-[11px] px-2 py-0.5 rounded-full border"
                  :class="isClientMessage(m) ? 'border-emerald-500/40 text-emerald-300 bg-emerald-900/20' : 'border-indigo-500/40 text-indigo-300 bg-indigo-900/20'"
                >
                  {{ isClientMessage(m) ? 'Client' : 'Admin' }}
                </span>
                <span class="text-xs text-gray-500">{{ formatDate(m.created_at) }}</span>
              </div>
              <div
                :class="[
                  'px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm',
                  isClientMessage(m)
                    ? 'bg-emerald-900/25 text-emerald-100 border border-emerald-700/30 rounded-tl-sm'
                    : (m.user_id === currentUserId
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-violet-900/30 text-violet-100 border border-violet-700/30 rounded-tl-sm'),
                ]"
              >
                {{ m.message }}
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Reply</h3>
          <textarea
            v-model="replyText"
            rows="4"
            class="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
            placeholder="Write your reply..."
          />
          <div class="mt-3 flex justify-end">
            <button
              :disabled="sending || !replyText.trim()"
              @click="handleReply"
              class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ sending ? 'Sending…' : 'Send reply' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete confirmation -->
    <ConfirmDialog
      :visible="confirmingDelete"
      title="Delete ticket"
      :message="`Are you sure you want to permanently delete this ticket? This action cannot be undone.`"
      @confirm="handleDelete"
      @cancel="confirmingDelete = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTickets } from '@/modules/tickets/composables/useTickets'
import { useToast } from '@/modules/common/composables/useToast'
import { useAuth } from '@/modules/auth/composables/useAuth'
import type { TicketMessage } from '@/modules/tickets/interfaces/ticket.interface'
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { user: authUser } = useAuth()
const { ticket, loading, error, getTicket, updateTicket, deleteTicket, sendMessage } = useTickets()

const id = Number(route.params.id)
const currentUserId = computed(() => authUser.value?.id ?? null)
const initials = (name?: string) =>
  (name ?? '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const replyText = ref('')
const sending = ref(false)
const confirmingDelete = ref(false)
const messages = ref<TicketMessage[]>([])
const chatScrollEl = ref<HTMLElement | null>(null)

const isClientMessage = (message: TicketMessage) => message.user_id === ticket.value?.user_id

const conversationMessages = computed<TicketMessage[]>(() => {
  const ordered = [...messages.value].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  if (!ticket.value?.description?.trim()) return ordered

  const initialMessage: TicketMessage = {
    id: -1,
    ticket_id: ticket.value.id,
    user_id: ticket.value.user_id,
    message: ticket.value.description,
    user: ticket.value.user,
    created_at: ticket.value.created_at,
    updated_at: ticket.value.created_at,
  }

  return [initialMessage, ...ordered]
})

const scrollChatToBottom = () => {
  if (!chatScrollEl.value) return
  chatScrollEl.value.scrollTop = chatScrollEl.value.scrollHeight
}

const load = async () => {
  try {
    const data = await getTicket(id)
    messages.value = data.messages ?? []
    await nextTick()
    scrollChatToBottom()
  } catch {
    toast.error('Error loading ticket')
  }
}

const toggleStatus = async (event: Event) => {
  const active = (event.target as HTMLSelectElement).value === 'true'
  try {
    await updateTicket(id, { active })
    toast.success('Status updated')
  } catch {
    toast.error('Error updating status')
  }
}

const handleReply = async () => {
  if (!replyText.value.trim()) return
  sending.value = true
  try {
    const msg = await sendMessage(id, replyText.value.trim())
    messages.value.push(msg)
    replyText.value = ''
    await nextTick()
    scrollChatToBottom()
    toast.success('Reply sent')
  } catch (err: any) {
    const detail = err?.response?.data?.message || 'Error sending message'
    toast.error(detail)
  } finally {
    sending.value = false
  }
}

const handleDelete = async () => {
  try {
    await deleteTicket(id)
    toast.success('Ticket deleted')
    router.push('/admin/tickets')
  } catch {
    toast.error('Error deleting ticket')
    confirmingDelete.value = false
  }
}

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleString() : '-'

watch(() => conversationMessages.value.length, async () => {
  await nextTick()
  scrollChatToBottom()
})

onMounted(load)
</script>
