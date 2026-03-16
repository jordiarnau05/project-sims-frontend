<template>
  <!-- fixed: ocupa exactament entre top nav (top-16) i bottom nav (bottom-0 mòbil / bottom-0 desktop sense bottom nav) -->
  <div class="fixed inset-x-0 top-16 bottom-0 bg-gray-800 z-0">
    <!-- Mapa: en mòbil deixa espai per la bottom nav fixe (4rem) -->
    <div ref="mapContainer" class="absolute inset-0 map-container"></div>

    <!-- DESKTOP: sidebar lateral esquerra -->
    <Transition name="slide-left">
      <div
        v-if="showSelectedPanel"
        class="hidden md:flex absolute left-0 top-0 bottom-0 w-80 z-[500] bg-white dark:bg-gray-900 shadow-2xl flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedVehicle?.plate }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedVehicle?.brand }} {{ selectedVehicle?.model }}</p>
          </div>
          <button @click="closeSelectedPanel" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Contingut scrollable -->
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Estat</p>
              <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                :class="{
                  'bg-green-100 text-green-800': selectedVehicle?.status === 'available',
                  'bg-orange-100 text-orange-800': selectedVehicle?.status === 'occupied',
                  'bg-red-100 text-red-800': selectedVehicle?.status === 'running'
                }">
                {{ selectedVehicle?.status === 'available' ? 'Disponible' : selectedVehicle?.status === 'occupied' ? 'Ocupat' : 'En Marxa' }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Actiu</p>
              <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                :class="selectedVehicle?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ selectedVehicle?.active ? 'Sí' : 'No' }}
              </span>
            </div>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Ubicació</p>
            <p class="text-xs font-mono text-gray-900 dark:text-white">{{ selectedVehicle?.latitude?.toFixed(6) }}, {{ selectedVehicle?.longitude?.toFixed(6) }}</p>
          </div>
          <div v-if="selectedVehicle?.created_at">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Data de creació</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedVehicle.created_at) }}</p>
          </div>
          <div v-if="selectedVehicle?.updated_at">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Última actualització</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedVehicle.updated_at) }}</p>
          </div>
        </div>
        <!-- Avís vehicle ocupat (desktop) -->
        <div v-if="selectedVehicleHasActiveBooking" class="mx-4 mb-2 flex items-start gap-2 bg-yellow-900/30 border border-yellow-700/50 rounded-xl px-3 py-2.5">
          <svg class="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-xs text-yellow-300">Aquest vehicle té una reserva {{ selectedVehicleBookingStatus === 'active' ? 'en curs' : 'pendent' }}. No es pot reservar fins que estigui lliure.</p>
        </div>
        <!-- Botó -->
        <div class="shrink-0 p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            @click="openBookingModal(selectedVehicle)"
            :disabled="isVehicleUnavailableForBooking"
            class="w-full font-semibold py-3 rounded-lg transition-colors"
            :class="isVehicleUnavailableForBooking
              ? 'bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
          >
            <span v-if="selectedVehicleHasActiveBooking">
              🟡 {{ selectedVehicleBookingStatus === 'active' ? 'En curs' : 'Reservat' }}
            </span>
            <span v-else-if="selectedVehicle?.status !== 'available'">No disponible</span>
            <span v-else>Reserva ara!</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- MÒBIL: popup centrat, respecta bottom nav -->
    <Transition name="modal">
      <div
        v-if="showSelectedPanel"
        class="md:hidden absolute inset-0 z-[500] flex items-center justify-center p-4 pb-20"
        style="pointer-events: none;"
      >
        <div class="absolute inset-0 bg-black/50" style="pointer-events: auto;" @click="closeSelectedPanel"></div>
        <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[65dvh] modal-card" style="pointer-events: auto;" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedVehicle?.plate }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedVehicle?.brand }} {{ selectedVehicle?.model }}</p>
            </div>
            <button @click="closeSelectedPanel" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Contingut -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <div class="flex gap-3">
              <div class="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Estat</p>
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-800': selectedVehicle?.status === 'available',
                    'bg-orange-100 text-orange-800': selectedVehicle?.status === 'occupied',
                    'bg-red-100 text-red-800': selectedVehicle?.status === 'running'
                  }">
                  {{ selectedVehicle?.status === 'available' ? 'Disponible' : selectedVehicle?.status === 'occupied' ? 'Ocupat' : 'En Marxa' }}
                </span>
              </div>
              <div class="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Actiu</p>
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="selectedVehicle?.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ selectedVehicle?.active ? 'Sí' : 'No' }}
                </span>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Ubicació</p>
              <p class="text-xs font-mono text-gray-900 dark:text-white">{{ selectedVehicle?.latitude?.toFixed(6) }}, {{ selectedVehicle?.longitude?.toFixed(6) }}</p>
            </div>
            <div v-if="selectedVehicle?.created_at" class="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Data de creació</p>
              <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedVehicle.created_at) }}</p>
            </div>
          </div>
          <!-- Avís vehicle ocupat (mòbil) -->
          <div v-if="selectedVehicleHasActiveBooking" class="mx-5 mb-2 flex items-start gap-2 bg-yellow-900/30 border border-yellow-700/50 rounded-xl px-3 py-2.5">
            <svg class="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p class="text-xs text-yellow-300">Vehicle {{ selectedVehicleBookingStatus === 'active' ? 'en curs' : 'reservat' }}. No disponible fins que estigui lliure.</p>
          </div>
          <!-- Botó -->
          <div class="shrink-0 px-5 py-4 border-t border-gray-100 dark:border-gray-800">
            <button
              @click="openBookingModal(selectedVehicle)"
              :disabled="isVehicleUnavailableForBooking"
              class="w-full font-semibold py-3 rounded-xl transition-colors"
              :class="isVehicleUnavailableForBooking
                ? 'bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
            >
              <span v-if="selectedVehicleHasActiveBooking">
                🟡 {{ selectedVehicleBookingStatus === 'active' ? 'En curs' : 'Reservat' }}
              </span>
              <span v-else-if="selectedVehicle?.status !== 'available'">No disponible</span>
              <span v-else>Reserva ara!</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de reserva -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showBookingModal" class="fixed inset-0 z-[10000] flex items-center justify-center p-4" @click.self="closeBookingModal">
          <div class="fixed inset-0 bg-black/60"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90dvh]" @click.stop>

            <!-- Header modal -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Reservar Vehicle</h3>
                <p v-if="vehicleForBooking" class="text-sm text-gray-500 dark:text-gray-400">{{ vehicleForBooking.brand }} {{ vehicleForBooking.model }} · {{ vehicleForBooking.plate }}</p>
              </div>
              <button @click="closeBookingModal" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Cos scrollable -->
            <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">

              <!-- Reserves existents del vehicle -->
              <div v-if="vehicleBookings.length > 0" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
                <p class="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Franges ja reservades
                </p>
                <ul class="space-y-1">
                  <li v-for="b in vehicleBookings" :key="b.id" class="text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    {{ formatDateShort(b.scheduled_start) }} → {{ formatDateShort(b.scheduled_end) }}
                    <span class="ml-auto text-amber-600 dark:text-amber-400 font-medium">{{ statusLabel(b.status) }}</span>
                  </li>
                </ul>
              </div>

              <!-- Error de solapament -->
              <div v-if="overlapError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 flex items-start gap-2">
                <svg class="h-4 w-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                <p class="text-xs text-red-700 dark:text-red-300">{{ overlapError }}</p>
              </div>

              <!-- Camps del formulari -->
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inici</label>
                  <input
                    type="datetime-local"
                    v-model="bookingForm.scheduled_start"
                    :min="minDateTime"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fi</label>
                  <input
                    type="datetime-local"
                    v-model="bookingForm.scheduled_end"
                    :min="bookingForm.scheduled_start || minDateTime"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <!-- Resum de preu -->
              <div v-if="priceInfo && !overlapError" class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Durada</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDuration(priceInfo.total_minutes) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Tarifa</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ priceInfo.price_per_minute }}€/min · màx {{ priceInfo.max_per_hour }}€/h</span>
                </div>
                <div v-if="priceInfo.base_price !== priceInfo.final_price" class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Preu base</span>
                  <span class="line-through text-gray-400">{{ priceInfo.base_price }}€</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-indigo-200 dark:border-indigo-700">
                  <span class="font-bold text-gray-900 dark:text-white">Total</span>
                  <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ priceInfo.final_price }}€</span>
                </div>
              </div>

              <!-- Càlcul en curs -->
              <div v-if="bookingForm.scheduled_start && bookingForm.scheduled_end && !priceInfo && !overlapError" class="text-center py-2">
                <span class="text-sm text-gray-400 animate-pulse">Calculant preu...</span>
              </div>
            </div>

            <!-- Accions -->
            <div class="shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
              <button
                type="button"
                @click="closeBookingModal"
                class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel·lar
              </button>
              <button
                type="button"
                @click="submitBooking"
                :disabled="bookingStore.loading || !priceInfo || !!overlapError"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {{ bookingStore.loading ? 'Creant...' : 'Confirmar reserva' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div
      class="map-controls absolute top-4 left-2 md:left-4 lg:left-20 bg-white/95 dark:bg-gray-900/95 text-sm p-2 md:p-4 rounded-lg shadow w-44 md:w-80 backdrop-blur"
      :class="{ 'md:hidden': showSelectedPanel }"
    >

      <details class="map-legend-details bg-transparent">
        <summary class="flex items-center justify-between font-semibold cursor-pointer text-xs md:text-sm">
          <span>{{ m.mapUi.legend }}</span>
          <svg class="legend-chevron h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="mt-1 md:mt-2 space-y-1 md:space-y-2">
          <div class="flex items-center gap-1.5 md:gap-2"><span style="width:10px;height:10px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff;flex-shrink:0"></span><span class="text-xs md:text-sm">{{ m.mapUi.available }}</span></div>
          <div class="flex items-center gap-1.5 md:gap-2"><span style="width:10px;height:10px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff;flex-shrink:0"></span><span class="text-xs md:text-sm">{{ m.mapUi.occupied }}</span></div>
          <div class="flex items-center gap-1.5 md:gap-2"><span style="width:10px;height:10px;border-radius:50%;background:#ffffff;display:inline-block;border:2px solid #ef4444;flex-shrink:0"></span><span class="text-xs md:text-sm">{{ m.mapUi.running }}</span></div>
        </div>
      </details>

      <details class="map-legend-details bg-transparent mt-2 md:mt-3 rounded border border-white/5 shadow-sm">
        <summary class="flex items-center justify-between font-semibold cursor-pointer px-1 md:px-2 py-0.5 md:py-1 text-xs md:text-sm">
          <span class="flex items-center gap-2">
            <span>{{ m.mapUi.nearby }}</span>
            <span class="text-xs text-gray-400">{{ m.mapUi.radius2km }}</span>
          </span>
          <svg class="legend-chevron h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="mt-1 md:mt-2 px-0.5 md:px-1">
          <div v-if="nearbyAvailable.length === 0" class="text-xs text-gray-400">{{ m.mapUi.noNearbyVehicles }}</div>
          <ul v-else class="space-y-1 max-h-32 md:max-h-48 overflow-y-auto">
            <li v-for="v in nearbyAvailable.slice(0,5)" :key="v.id" class="flex items-center justify-between gap-2 p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors" @click="onNearbyClick(v)">
              <div class="flex items-center gap-1.5 min-w-0">
                <span :style="{ width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', flexShrink: '0', background: v.status === 'running' ? '#ef4444' : (v.status === 'occupied' ? '#f59e0b' : '#22c55e'), border: '1.5px solid #fff' }"></span>
                <div class="min-w-0">
                  <div class="text-xs font-medium truncate">{{ v.plate }}</div>
                  <div class="text-xs text-gray-400 truncate hidden md:block">{{ v.brand }} {{ v.model }}</div>
                </div>
              </div>
              <div class="text-xs font-semibold text-indigo-300 shrink-0">{{ v.distanceMeters < 1000 ? `${Math.round(v.distanceMeters)}m` : `${(v.distanceMeters/1000).toFixed(1)}km` }}</div>
            </li>
          </ul>
        </div>
      </details>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMap } from '@/modules/map/composables/useMap'
import { useBookingStore } from '@/stores/bookingStore'
import { toast } from 'vue3-toastify'
import { useI18n } from '@/i18n'

const route = useRoute()
const { m } = useI18n()
const { mapContainer, map, vehicles, markers, initMap, fetchVehicles, startPolling, setUserLocation, destroyMap, rawVehicles, userLocation, _internal, centerOnVehicle, setOnVehicleClick, setSelectedVehicle, createVehicleIcon, markVehicleAsBooked } = useMap()
const bookingStore = useBookingStore()
let userMarker: any = null

const nearbyAvailable = ref<any[]>([])
const selectedVehicle = ref<any | null>(null)
const showSelectedPanel = ref(false)

// Reserves actives/pendents del vehicle seleccionat
const selectedVehicleBookings = ref<any[]>([])
const selectedVehicleHasActiveBooking = computed(() =>
  selectedVehicleBookings.value.some(b => ['active', 'pending', 'confirmed'].includes(b.status))
)
const selectedVehicleBookingStatus = computed(() => {
  const active = selectedVehicleBookings.value.find(b => b.status === 'active')
  if (active) return 'active'
  const pending = selectedVehicleBookings.value.find(b => ['pending', 'confirmed'].includes(b.status))
  if (pending) return 'pending'
  return null
})
const isVehicleUnavailableForBooking = computed(() =>
  selectedVehicleHasActiveBooking.value || selectedVehicle.value?.status !== 'available'
)

const showBookingModal = ref(false)
const vehicleForBooking = ref<any | null>(null)
const vehicleBookings = ref<any[]>([])
const overlapError = ref<string | null>(null)
const bookingForm = ref({
  vehicle_id: 0,
  scheduled_start: '',
  scheduled_end: ''
})
const priceInfo = ref<any>(null)

// Formata una data en hora LOCAL del navegador per a inputs datetime-local (YYYY-MM-DDTHH:MM)
// toISOString() retorna UTC i provoca desfasament horari (+1h a Catalunya)
function toLocalDatetimeInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// Data mínima: ara mateix (format datetime-local: YYYY-MM-DDTHH:MM)
const minDateTime = computed(() => {
  const now = new Date()
  now.setSeconds(0, 0)
  return toLocalDatetimeInput(now)
})

const refresh = () => fetchVehicles('/vehicles')

const locateMe = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    setUserLocation(lat, lng)
    if (map.value) {
      map.value.setView([lat, lng], 13)
      // user marker handled by setUserLocation
      setUserLocation(lat, lng)
      userMarker?.openPopup()
    }
  }, err => console.warn('Geolocation failed', err))
}

function computeNearbyAvailable() {
  if (!map.value) return
  // prefer user's location if available, fallback to map center
  const centerPoint = (userLocation.value && userLocation.value.lat && userLocation.value.lng)
    ? { lat: userLocation.value.lat, lng: userLocation.value.lng }
    : map.value.getCenter()
  const R = 6371000
  const toRad = (x: number) => (x * Math.PI) / 180
  nearbyAvailable.value = rawVehicles.value
    .map(v => {
      if (v.latitude == null || v.longitude == null) return null
      const dLat = toRad(v.latitude - centerPoint.lat)
      const dLon = toRad(v.longitude - centerPoint.lng)
      const lat1 = toRad(centerPoint.lat)
      const lat2 = toRad(v.latitude)
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c
      return { ...v, distanceMeters: d }
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .filter(v => v.distanceMeters <= 2000) // Mostra tots els vehicles dins de 2km
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 10)
}

onMounted(() => {
  initMap()
  
  // Registrar el callback per quan es clica un vehicle
  setOnVehicleClick(async (vehicle) => {
    selectedVehicle.value = vehicle
    selectedVehicleBookings.value = []
    showSelectedPanel.value = true
    setSelectedVehicle(vehicle.id)
    // Carregar reserves del vehicle per saber si està disponible
    try {
      const bookings = await bookingStore.fetchVehicleBookings(vehicle.id)
      selectedVehicleBookings.value = bookings
      // Si té reserves actives/pendents, marcar el vehicle com ocupat al mapa (icona groga)
      const hasActiveBooking = bookings.some(b => ['active', 'pending', 'confirmed'].includes(b.status))
      markVehicleAsBooked(vehicle.id, hasActiveBooking)
      if (hasActiveBooking) {
        // Actualitzar l'status del vehicle seleccionat per reflectir-ho al panel
        selectedVehicle.value = { ...selectedVehicle.value, status: 'occupied' }
      }
    } catch { /* ignorar errors */ }
  })
  
  const view = route.query.view?.toString()

  // Always ask for geolocation when entering the vehicles map to center on user
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserLocation(lat, lng)
        if (map.value) {
          map.value.setView([lat, lng], 15)
        }
        fetchVehicles('/vehicles').catch(err => console.error(err))
        startPolling('/vehicles', 8000)
        // try to grab userMarker via exposed internal function
        try { userMarker = _internal?.getUserMarker?.() ?? null } catch { userMarker = null }
        // compute nearby from user location
        setTimeout(() => computeNearbyAvailable(), 400)
      },
      (err) => {
        console.warn('Geolocation failed or denied', err)
        // fallback: centrar a Amposta i carregar vehicles
        if (map.value) {
          map.value.setView([40.7095, 0.5795], 13)
        }
        fetchVehicles('/vehicles').catch(err => console.error(err))
        startPolling('/vehicles', 8000)
        setTimeout(() => computeNearbyAvailable(), 600)
      },
      { enableHighAccuracy: true }
    )
  } else {
    // if geolocation not available, fallback: centrar a Amposta
    if (map.value) {
      map.value.setView([40.7095, 0.5795], 13)
    }
    fetchVehicles('/vehicles').catch(err => console.error(err))
    startPolling('/vehicles', 8000)
    setTimeout(() => computeNearbyAvailable(), 600)
  }

  // compute when map moves
  if (map.value) {
    map.value.on('moveend', () => computeNearbyAvailable())
  }
})

function onNearbyClick(v: any) {
  selectedVehicle.value = v
  showSelectedPanel.value = true
  setSelectedVehicle(v.id)
  centerOnVehicle(v)
}

function closeSelectedPanel() {
  showSelectedPanel.value = false
  selectedVehicle.value = null
  selectedVehicleBookings.value = []
  setSelectedVehicle(null)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('ca-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateShort(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Pendent',
    active: 'Activa',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancel·lada'
  }
  return labels[status] ?? status
}

function checkOverlap(start: string, end: string): string | null {
  if (!start || !end) return null
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  for (const b of vehicleBookings.value) {
    const bs = new Date(b.scheduled_start).getTime()
    const be = new Date(b.scheduled_end).getTime()
    if (s < be && e > bs) {
      return `Conflicte amb una reserva existent: ${formatDateShort(b.scheduled_start)} → ${formatDateShort(b.scheduled_end)}`
    }
  }
  return null
}

async function openBookingModal(vehicle: any) {
  vehicleForBooking.value = vehicle
  overlapError.value = null
  priceInfo.value = null
  vehicleBookings.value = []
  // Pre-omplir inici amb ara + 5 min (en hora local, no UTC)
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5, 0, 0)
  const startStr = toLocalDatetimeInput(now)
  const end = new Date(now)
  end.setHours(end.getHours() + 1)
  const endStr = toLocalDatetimeInput(end)
  bookingForm.value = {
    vehicle_id: vehicle.id,
    scheduled_start: startStr,
    scheduled_end: endStr
  }
  // Mostrar modal immediatament, carregar reserves en paral·lel
  showBookingModal.value = true
  bookingStore.fetchVehicleBookings(vehicle.id).then(result => {
    vehicleBookings.value = result
    overlapError.value = checkOverlap(bookingForm.value.scheduled_start, bookingForm.value.scheduled_end)
  }).catch(() => {})
}

function closeBookingModal() {
  showBookingModal.value = false
  vehicleForBooking.value = null
  vehicleBookings.value = []
  overlapError.value = null
  bookingForm.value = { vehicle_id: 0, scheduled_start: '', scheduled_end: '' }
  priceInfo.value = null
}

async function submitBooking() {
  if (overlapError.value) return
  try {
    const bookingData = {
      ...bookingForm.value,
      scheduled_start: bookingForm.value.scheduled_start + ':00',
      scheduled_end: bookingForm.value.scheduled_end + ':00'
    }
    await bookingStore.createBooking(bookingData)
    toast.success('Reserva creada correctament!')
    closeBookingModal()
    closeSelectedPanel()
    await fetchVehicles('/vehicles')
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Error creant la reserva'
    toast.error(msg)
    overlapError.value = msg
  }
}

watch([() => bookingForm.value.scheduled_start, () => bookingForm.value.scheduled_end], async ([start, end]) => {
  overlapError.value = checkOverlap(start, end)
  if (overlapError.value) {
    priceInfo.value = null
    return
  }
  if (start && end && new Date(end) > new Date(start)) {
    try {
      priceInfo.value = await bookingStore.calculatePrice(start, end)
    } catch {
      priceInfo.value = null
    }
  } else {
    priceInfo.value = null
  }
})

onUnmounted(() => {
  destroyMap()
})
</script>

<style>
.vehicle-marker {
  background: transparent !important;
  border: none !important;
}

/* Custom cluster styles */
.marker-cluster {
  background-clip: padding-box;
  border-radius: 50%;
  cursor: pointer;
}

.marker-cluster div {
  width: 40px;
  height: 40px;
  margin-left: 0;
  margin-top: 0;
  text-align: center;
  border-radius: 50%;
  font: 14px "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.marker-cluster:hover div {
  transform: scale(1.1);
}

.marker-cluster span {
  line-height: 40px;
  color: white;
  font-weight: 700;
  font-size: 15px;
}

/* Small clusters: 1-4 vehicles (green) */
.marker-cluster-small {
  background-color: rgba(34, 197, 94, 0.4);
}
.marker-cluster-small div {
  background-color: rgba(34, 197, 94, 0.9);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  border: 2px solid white;
}

/* Medium clusters: 5-9 vehicles (orange) */
.marker-cluster-medium {
  background-color: rgba(245, 158, 11, 0.4);
}
.marker-cluster-medium div {
  background-color: rgba(245, 158, 11, 0.9);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  border: 2px solid white;
}

/* Large clusters: 10+ vehicles (red) */
.marker-cluster-large {
  background-color: rgba(239, 68, 68, 0.4);
}
.marker-cluster-large div {
  background-color: rgba(239, 68, 68, 0.9);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  border: 2px solid white;
}

/* Ensure Leaflet map container stays below the app sidebar overlay elements.
   IMPORTANT: Do NOT override z-index on leaflet-pane, leaflet-map-pane or any
   inner pane — Leaflet uses transform+position internally to place markers and
   overriding those breaks marker positioning (icons stay fixed on screen). */
.leaflet-container {
  z-index: 0 !important;
}
/* Legend styling */
.map-legend { z-index: 10001; }
/* Allow sidebar and menus to receive pointer events above the map */
.admin-sidebar,
.app-sidebar,
.fixed-sidebar {
  z-index: 9999 !important;
  position: relative;
}

/* compact legend / nearby list tweaks */
.map-controls .map-legend-details {
  width: 18rem;
  font-size: 0.875rem;
}
.map-controls .map-legend-details summary {
  padding: 0;
  list-style: none;
}
.map-controls .map-legend-details summary::-webkit-details-marker {
  display: none;
}
.map-controls .legend-chevron {
  transition: transform 0.2s ease;
}
.map-controls .map-legend-details[open] .legend-chevron {
  transform: rotate(180deg);
}
.map-controls .map-legend-details ul { padding: 0 }
.map-controls .map-legend-details li { padding: 0 }

/* Desktop sidebar: slide from left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Mobile: map leaves space for bottom nav */
@media (max-width: 767px) {
  .map-container {
    bottom: 4rem !important;
  }
}

/* Modal transition (mòbil popup) */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-enter-from .modal-card {
  transform: scale(0.92) translateY(8px);
}
.modal-leave-to .modal-card {
  transform: scale(0.92) translateY(8px);
}
</style>
