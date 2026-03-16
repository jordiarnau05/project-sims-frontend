<template>
  <div class="min-h-screen bg-gray-900 pb-6">
    <div class="container mx-auto px-4 py-6 max-w-3xl">

      <!-- Capçalera -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">{{ m.bookingsUi.title }}</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ m.bookingsUi.subtitle }}</p>
      </div>

      <!-- Loading -->
      <div v-if="bookingStore.loading && bookingStore.bookings.length === 0" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Sense reserves -->
      <div v-else-if="bookingStore.bookings.length === 0" class="text-center py-20">
        <div class="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-white font-semibold mb-1">{{ m.bookingsUi.emptyTitle }}</p>
        <p class="text-sm text-gray-400 mb-6">{{ m.bookingsUi.emptySubtitle }}</p>
        <RouterLink to="/" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
          {{ m.bookingsUi.seeMap }}
        </RouterLink>
      </div>

      <template v-else>
        <!-- SECCIÓ: Actives i pendents -->
        <section v-if="activeAndPendingBookings.length > 0" class="mb-8">
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{{ m.bookingsUi.sectionUpcoming }}</h2>
          <div class="space-y-3">
            <div
              v-for="booking in activeAndPendingBookings"
              :key="booking.id"
              class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-sm"
            >
              <!-- Barra d'estat de color -->
              <div class="h-1 w-full" :class="{
                'bg-blue-500': booking.status === 'active',
                'bg-yellow-400': booking.status === 'pending',
                'bg-purple-500': booking.status === 'confirmed',
              }"></div>

              <div class="p-4">
                <!-- Fila principal: vehicle + estat -->
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="{
                      'bg-blue-900/40': booking.status === 'active',
                      'bg-yellow-900/40': booking.status === 'pending',
                      'bg-purple-900/40': booking.status === 'confirmed',
                    }">
                      <svg class="h-5 w-5" :class="{
                        'text-blue-600': booking.status === 'active',
                        'text-yellow-600': booking.status === 'pending',
                        'text-purple-600': booking.status === 'confirmed',
                      }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-bold text-white">{{ booking.vehicle?.license_plate || '—' }}</p>
                      <p class="text-sm text-gray-400">{{ booking.vehicle?.brand }} {{ booking.vehicle?.model }}</p>
                    </div>
                  </div>
                  <span class="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full" :class="{
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300': booking.status === 'active',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300': booking.status === 'pending',
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300': booking.status === 'confirmed',
                  }">{{ getStatusLabel(booking.status) }}</span>
                </div>

                <!-- Info contextual -->
                <div v-if="booking.status === 'active'" class="flex items-center gap-2 bg-blue-900/20 rounded-xl px-3 py-2 mb-3">
                  <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse shrink-0"></span>
                  <span class="text-xs font-medium text-blue-300">{{ m.bookingsUi.activeVehicleInUse }}</span>
                  <span v-if="booking.trip?.engine_started_at" class="text-xs text-blue-500 ml-auto">{{ m.bookingsUi.activeSince }} {{ formatTimeOnly(booking.trip.engine_started_at) }}</span>
                </div>

                <div v-else-if="booking.status === 'pending'" class="flex items-center gap-2 mb-3 rounded-xl px-3 py-2" :class="isDeadlineNear(booking) ? 'bg-red-900/20' : 'bg-gray-700/50'">
                  <svg class="h-4 w-4 shrink-0" :class="isDeadlineNear(booking) ? 'text-red-400' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span class="text-xs font-medium" :class="isDeadlineNear(booking) ? 'text-red-300' : 'text-gray-300'">{{ timeUntilStart(booking) }}</span>
                  <span v-if="booking.activation_deadline" class="text-xs text-gray-400 ml-auto">{{ m.bookingsUi.activateUntil }} {{ formatTimeOnly(booking.activation_deadline) }}</span>
                </div>

                <!-- Dates -->
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="bg-gray-800 rounded-xl p-2.5">
                    <p class="text-xs text-gray-400 mb-0.5">{{ m.bookingsUi.start }}</p>
                    <p class="text-xs font-semibold text-white">{{ formatDateCompact(booking.scheduled_start) }}</p>
                  </div>
                  <div v-if="booking.scheduled_end" class="bg-gray-800 rounded-xl p-2.5">
                    <p class="text-xs text-gray-400 mb-0.5">{{ m.bookingsUi.end }}</p>
                    <p class="text-xs font-semibold text-white">{{ formatDateCompact(booking.scheduled_end) }}</p>
                  </div>
                </div>

                <!-- Accions -->
                <div class="flex gap-2">
                  <button
                    v-if="booking.status === 'pending'"
                    @click="initCancelBooking(booking.id)"
                    class="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-sm font-semibold py-2 rounded-xl transition-colors"
                  >{{ m.bookingsUi.cancel }}</button>
                  <button
                    @click="viewDetails(booking)"
                    class="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold py-2 rounded-xl transition-colors"
                  >{{ m.bookingsUi.details }}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECCIÓ: Completades -->
        <section v-if="completedBookings.length > 0" class="mb-8">
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{{ m.bookingsUi.sectionHistory }}</h2>
          <div class="space-y-2">
            <div
              v-for="booking in completedBookings"
              :key="booking.id"
              class="bg-gray-800 rounded-2xl border border-gray-700 p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
              @click="viewDetails(booking)"
            >
              <div class="w-9 h-9 bg-green-900/30 rounded-xl flex items-center justify-center shrink-0">
                <svg class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-white text-sm">{{ booking.vehicle?.license_plate || '—' }}</p>
                <p class="text-xs text-gray-400 truncate">{{ formatDateCompact(booking.scheduled_start) }} · {{ booking.vehicle?.brand }} {{ booking.vehicle?.model }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-bold text-white text-sm">{{ getBookingPrice(booking) !== 'Pendent' ? getBookingPrice(booking) + '€' : '—' }}</p>
                <p class="text-xs text-green-400">{{ m.bookingsUi.completed }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- SECCIÓ: Cancel·lades (col·lapsable) -->
        <section v-if="cancelledBookings.length > 0">
          <button
            @click="showCancelled = !showCancelled"
            class="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-300 transition-colors"
          >
            <svg class="h-3.5 w-3.5 transition-transform duration-200" :class="showCancelled ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
            {{ m.bookingsUi.sectionCancelled }} ({{ cancelledBookings.length }})
          </button>
          <Transition name="fade">
            <div v-if="showCancelled" class="space-y-2">
              <div
                v-for="booking in cancelledBookings"
                :key="booking.id"
                class="bg-gray-800 rounded-2xl border border-gray-700 p-4 flex items-center gap-4 opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
                @click="viewDetails(booking)"
              >
                <div class="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                  <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-300 text-sm">{{ booking.vehicle?.license_plate || '—' }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ formatDateCompact(booking.scheduled_start) }} · {{ booking.vehicle?.brand }} {{ booking.vehicle?.model }}</p>
                </div>
                <p class="text-xs text-red-400 shrink-0">{{ m.bookingsUi.cancelled }}</p>
              </div>
            </div>
          </Transition>
        </section>
      </template>
    </div>

    <!-- Modal confirmar cancel·lació -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4" @click.self="showCancelModal = false">
          <div class="fixed inset-0 bg-black/50"></div>
          <div class="relative bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-sm p-6" @click.stop>
            <div class="md:hidden w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div class="w-12 h-12 bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-white text-center mb-1">{{ m.bookingsUi.confirmCancelTitle }}</h3>
            <p class="text-sm text-gray-400 text-center mb-6">{{ m.bookingsUi.confirmCancelText }}</p>
            <div class="flex gap-3">
              <button @click="showCancelModal = false" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors">
                {{ m.bookingsUi.back }}
              </button>
              <button @click="confirmCancelBooking" :disabled="bookingStore.loading" class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
                {{ bookingStore.loading ? '...' : m.bookingsUi.yesCancel }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal detalls reserva -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailsModal && selectedBooking" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4" @click.self="closeDetailsModal">
          <div class="fixed inset-0 bg-black/50"></div>
          <div class="relative bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-md max-h-[85dvh] flex flex-col" @click.stop>
            <div class="md:hidden w-10 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-1 shrink-0"></div>

            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
              <div>
                <h3 class="font-bold text-white">{{ m.bookingsUi.bookingNumber }} #{{ selectedBooking.id }}</h3>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="{
                  'bg-yellow-900/40 text-yellow-300': selectedBooking.status === 'pending',
                  'bg-blue-900/40 text-blue-300': selectedBooking.status === 'active',
                  'bg-green-900/40 text-green-300': selectedBooking.status === 'completed',
                  'bg-red-900/40 text-red-300': selectedBooking.status === 'cancelled',
                  'bg-purple-900/40 text-purple-300': selectedBooking.status === 'confirmed',
                }">{{ getStatusLabel(selectedBooking.status) }}</span>
              </div>
              <button @click="closeDetailsModal" class="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Cos -->
            <div class="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <!-- Vehicle -->
              <div class="bg-gray-700/50 rounded-2xl p-4 flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                </div>
                <div>
                  <p class="font-bold text-white">{{ selectedBooking.vehicle?.license_plate || 'N/A' }}</p>
                  <p class="text-sm text-gray-400">{{ selectedBooking.vehicle?.brand }} {{ selectedBooking.vehicle?.model }}</p>
                </div>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-gray-800 rounded-xl p-3">
                  <p class="text-xs text-gray-400 mb-1">{{ m.bookingsUi.scheduledStart }}</p>
                  <p class="text-sm font-semibold text-white">{{ formatDate(selectedBooking.scheduled_start) }}</p>
                </div>
                <div class="bg-gray-800 rounded-xl p-3">
                  <p class="text-xs text-gray-400 mb-1">{{ m.bookingsUi.scheduledEnd }}</p>
                  <p class="text-sm font-semibold text-white">{{ formatDate(selectedBooking.scheduled_end) }}</p>
                </div>
                <div v-if="selectedBooking.activation_deadline" class="bg-gray-800 rounded-xl p-3">
                  <p class="text-xs text-gray-400 mb-1">{{ m.bookingsUi.activationLimit }}</p>
                  <p class="text-sm font-semibold text-white">{{ formatDate(selectedBooking.activation_deadline) }}</p>
                </div>
                <div v-if="selectedBooking.trip?.engine_started_at" class="bg-gray-800 rounded-xl p-3">
                  <p class="text-xs text-gray-400 mb-1">{{ m.bookingsUi.realStart }}</p>
                  <p class="text-sm font-semibold text-white">{{ formatDate(selectedBooking.trip.engine_started_at) }}</p>
                </div>
                <div v-if="selectedBooking.cancelled_at" class="col-span-2 bg-red-900/20 rounded-xl p-3">
                  <p class="text-xs text-red-400 mb-1">{{ m.bookingsUi.cancelledOn }}</p>
                  <p class="text-sm font-semibold text-red-300">{{ formatDate(selectedBooking.cancelled_at) }}</p>
                </div>
              </div>

              <!-- Preu -->
              <div class="bg-indigo-900/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p class="text-xs text-indigo-400 mb-0.5">{{ getBookingPriceLabel(selectedBooking) }}</p>
                  <p v-if="selectedBooking.trip?.minutes_driven" class="text-xs text-indigo-400">{{ selectedBooking.trip.minutes_driven }} {{ m.bookingsUi.minutesDriven }}</p>
                </div>
                <span v-if="getBookingPrice(selectedBooking) === m.bookingsUi.pendingPrice" class="text-sm font-semibold text-yellow-500">{{ m.bookingsUi.pendingPriceMsg }}</span>
                <span v-else class="text-2xl font-bold text-indigo-400">{{ getBookingPrice(selectedBooking) }}€</span>
              </div>
            </div>

            <!-- Footer -->
            <div v-if="selectedBooking.status === 'pending'" class="shrink-0 px-5 pb-5 pt-3 border-t border-gray-700">
              <button @click="initCancelBooking(selectedBooking.id)" class="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 font-semibold py-3 rounded-xl transition-colors">
                {{ m.bookingsUi.cancelThisBooking }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'
import { toast } from 'vue3-toastify'
import { useI18n } from '@/i18n'

const bookingStore = useBookingStore()
const { m, locale } = useI18n()

const showCancelModal = ref(false)
const showDetailsModal = ref(false)
const showCancelled = ref(false)
const selectedBooking = ref<any>(null)
const bookingIdToCancel = ref<number | null>(null)
const countdownInterval = ref<number | null>(null)
const expiredBookings = ref<Set<number>>(new Set())

const activeAndPendingBookings = computed(() =>
  bookingStore.bookings
    .filter(b => ['active', 'pending', 'confirmed'].includes(b.status))
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime())
)
const completedBookings = computed(() =>
  bookingStore.bookings
    .filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime())
)
const cancelledBookings = computed(() =>
  bookingStore.bookings
    .filter(b => b.status === 'cancelled')
    .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime())
)

onMounted(async () => {
  try {
    await bookingStore.fetchBookings()
  } catch {
    toast.error(m.value.bookingsUi.fetchError)
    return
  }
  countdownInterval.value = window.setInterval(async () => {
    const now = new Date()
    for (const booking of bookingStore.bookings) {
      if (booking.status === 'pending' && booking.activation_deadline) {
        const deadline = new Date(booking.activation_deadline)
        if (now >= deadline && !expiredBookings.value.has(booking.id)) {
          expiredBookings.value.add(booking.id)
          toast.warning(m.value.bookingsUi.expiredBookingToast.replace('{vehicle}', booking.vehicle?.license_plate || 'vehicle'))
          try { await bookingStore.fetchBookings() } catch {}
        }
      }
    }
  }, 10000)
})

onUnmounted(() => {
  if (countdownInterval.value) clearInterval(countdownInterval.value)
})

function initCancelBooking(id: number) {
  bookingIdToCancel.value = id
  showDetailsModal.value = false
  showCancelModal.value = true
}

async function confirmCancelBooking() {
  if (!bookingIdToCancel.value) return
  try {
    await bookingStore.cancelBooking(bookingIdToCancel.value)
    toast.success(m.value.bookingsUi.cancelledToast)
    await bookingStore.fetchBookings()
    showCancelModal.value = false
    bookingIdToCancel.value = null
  } catch (error: any) {
    toast.error(error.response?.data?.message || m.value.bookingsUi.cancelError)
  }
}

function viewDetails(booking: any) {
  selectedBooking.value = booking
  showDetailsModal.value = true
}

function closeDetailsModal() {
  showDetailsModal.value = false
  selectedBooking.value = null
}

function getLocaleCode() {
  if (locale.value === 'es') return 'es-ES'
  if (locale.value === 'en') return 'en-GB'
  return 'ca-ES'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(getLocaleCode(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDateCompact(dateString: string) {
  const d = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1)
  const time = d.toLocaleTimeString(getLocaleCode(), { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === today.toDateString()) return `${m.value.bookingsUi.today} ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `${m.value.bookingsUi.tomorrow} ${time}`
  return d.toLocaleDateString(getLocaleCode(), { day: '2-digit', month: '2-digit' }) + ' ' + time
}

function formatTimeOnly(dateString: string) {
  return new Date(dateString).toLocaleTimeString(getLocaleCode(), { hour: '2-digit', minute: '2-digit' })
}

function timeUntilStart(booking: any): string {
  const diffMs = new Date(booking.scheduled_start).getTime() - Date.now()
  if (diffMs <= 0) return m.value.bookingsUi.startsInPast
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return m.value.bookingsUi.startsInMinutes.replace('{min}', String(diffMin))
  const h = Math.floor(diffMin / 60)
  const minRemainder = diffMin % 60
  if (h < 24) return m.value.bookingsUi.startsInHours
    .replace('{hours}', String(h))
    .replace('{minutes}', minRemainder > 0 ? ` ${minRemainder}min` : '')
  const days = Math.floor(h / 24)
  return m.value.bookingsUi.startsInDays
    .replace('{days}', String(days))
    .replace('{plural}', days > 1 ? 's' : '')
}

function isDeadlineNear(booking: any): boolean {
  if (!booking.activation_deadline) return false
  const diffMin = (new Date(booking.activation_deadline).getTime() - Date.now()) / 60000
  return diffMin < 30 && diffMin > 0
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: m.value.bookingsUi.pending,
    active: m.value.bookingsUi.active,
    completed: m.value.bookingsUi.completedStatus,
    cancelled: m.value.bookingsUi.cancelledStatus,
    confirmed: m.value.bookingsUi.confirmed,
  }
  return labels[status] ?? status
}

function getBookingPrice(booking: any): string {
  if (booking.trip?.total_amount != null) return booking.trip.total_amount.toFixed(2)
  if (booking.total_price != null) return booking.total_price.toFixed(2)
  if (booking.cancellation_fee != null) return booking.cancellation_fee.toFixed(2)
  if (['pending', 'active'].includes(booking.status)) return m.value.bookingsUi.pendingPrice
  return '0.00'
}

function getBookingPriceLabel(booking: any): string {
  if (['pending', 'active'].includes(booking.status)) return m.value.bookingsUi.estimatedPrice
  if (booking.status === 'cancelled' && booking.cancellation_fee != null) return m.value.bookingsUi.cancellationFee
  return m.value.bookingsUi.totalPrice
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active > div:last-child, .modal-leave-active > div:last-child { transition: transform 0.3s ease; }
.modal-enter-from > div:last-child, .modal-leave-to > div:last-child { transform: translateY(100%); }
@media (min-width: 768px) {
  .modal-enter-from > div:last-child, .modal-leave-to > div:last-child { transform: scale(0.95) translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
