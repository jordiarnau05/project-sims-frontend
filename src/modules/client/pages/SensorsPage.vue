<template>
  <div class="min-h-screen bg-gray-900 text-white px-4 py-8">
    <div class="mx-auto max-w-4xl">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">{{ m.sensorsUi.title }}</h1>
          <p class="mt-1 text-sm text-gray-400">
            {{ m.sensorsUi.subtitle }}
          </p>
        </div>

        <button
          type="button"
          class="rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-200 outline outline-1 outline-white/10 hover:bg-white/10"
          :disabled="loadingDevices"
          @click="reload"
        >
          {{ m.sensorsUi.reload }}
        </button>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="sm:col-span-1 rounded-xl bg-gray-800/60 border border-white/5 p-4">
          <div class="text-sm font-semibold">{{ m.sensorsUi.device }}</div>
          <div class="mt-2">
            <div v-if="loadingDevices" class="text-sm text-gray-400">{{ m.sensorsUi.loadingDevices }}</div>
            <div v-else-if="!hasDevices" class="text-sm text-gray-400">{{ m.sensorsUi.noDevices }}</div>

            <select
              v-else
              v-model="selectedDeviceId"
              class="mt-1 w-full rounded-lg bg-gray-900/40 px-3 py-2 text-sm text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500"
              @change="onDeviceChange"
            >
              <option v-for="d in devices" :key="d" :value="d">{{ d }}</option>
            </select>

            <p class="mt-2 text-xs text-gray-500">
              Endpoint: <span class="text-gray-300">/api/sensor-data/devices</span>
            </p>
          </div>
        </div>

        <div class="sm:col-span-2 rounded-xl bg-gray-800/60 border border-white/5 p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-sm font-semibold">{{ m.sensorsUi.latestReading }}</div>
              <div class="mt-1 text-xs text-gray-400">
                <span v-if="lastUpdatedAt">{{ m.sensorsUi.updated }}: {{ lastUpdatedAt.toLocaleTimeString() }}</span>
                <span v-else>{{ m.sensorsUi.notUpdated }}</span>
              </div>
            </div>

            <div class="text-xs" :class="pollingClass">
              {{ pollingLabel }}
            </div>
          </div>

          <div v-if="error" class="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200 outline outline-1 outline-red-500/20">
            {{ error }}
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-lg bg-gray-900/40 p-4 outline outline-1 outline-white/10">
              <div class="text-xs uppercase tracking-wide text-gray-400">{{ m.sensorsUi.distance }}</div>
              <div class="mt-2 text-3xl font-bold">
                <span v-if="latest">{{ formatValue(latest.value) }}</span>
                <span v-else class="text-gray-500">—</span>
                <span class="ml-1 text-base font-medium text-gray-300">{{ latest?.unit || 'cm' }}</span>
              </div>
            </div>

            <div class="rounded-lg bg-gray-900/40 p-4 outline outline-1 outline-white/10">
              <div class="text-xs uppercase tracking-wide text-gray-400">{{ m.sensorsUi.sensorType }}</div>
              <div class="mt-2 text-lg font-semibold">
                <span v-if="latest">{{ latest.sensor_type }}</span>
                <span v-else class="text-gray-500">—</span>
              </div>
            </div>

            <div class="rounded-lg bg-gray-900/40 p-4 outline outline-1 outline-white/10">
              <div class="text-xs uppercase tracking-wide text-gray-400">{{ m.sensorsUi.timestamp }}</div>
              <div class="mt-2 text-sm text-gray-200">
                <span v-if="latest">{{ latest.timestamp || latest.created_at || '—' }}</span>
                <span v-else class="text-gray-500">—</span>
              </div>
            </div>
          </div>

          <div class="mt-4 text-xs text-gray-500">
            Polling: <span class="text-gray-300">/api/sensor-data/devices/{{ selectedDeviceId }}/latest</span>
          </div>

          <div class="mt-6 rounded-lg bg-gray-900/40 p-4 outline outline-1 outline-white/10">
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-sm font-semibold">Actuator (LED)</div>
                <div class="mt-1 text-xs text-gray-400">
                  Current state:
                  <span class="font-semibold" :class="actuatorState === 'ON' ? 'text-green-300' : 'text-gray-300'">
                    {{ actuatorState || 'UNKNOWN' }}
                  </span>
                </div>
              </div>

              <button
                type="button"
                class="rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-200 outline outline-1 outline-white/10 hover:bg-white/10 disabled:opacity-50"
                :disabled="loadingActuator"
                @click="loadActuatorStatus"
              >
                Refresh status
              </button>
            </div>

            <div v-if="actuatorError" class="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200 outline outline-1 outline-red-500/20">
              {{ actuatorError }}
            </div>

            <div class="mt-4 flex items-center gap-2">
              <button
                type="button"
                class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                :disabled="loadingActuator || actuatorState === 'ON'"
                @click="setActuator('ON')"
              >
                Turn ON
              </button>
              <button
                type="button"
                class="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
                :disabled="loadingActuator || actuatorState === 'OFF'"
                @click="setActuator('OFF')"
              >
                Turn OFF
              </button>

              <div class="ml-auto text-xs text-gray-400" v-if="loadingActuator">Updating LED…</div>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              :disabled="!selectedDeviceId"
              @click="start"
            >
              {{ m.sensorsUi.start }}
            </button>
            <button
              type="button"
              class="rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-gray-200 outline outline-1 outline-white/10 hover:bg-white/10"
              @click="stop"
            >
              {{ m.sensorsUi.stop }}
            </button>
            <button
              type="button"
              class="rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-gray-200 outline outline-1 outline-white/10 hover:bg-white/10"
              :disabled="loadingLatest || !selectedDeviceId"
              @click="refreshOnce"
            >
              {{ m.sensorsUi.refreshNow }}
            </button>

            <div class="ml-auto text-xs text-gray-400" v-if="loadingLatest">{{ m.sensorsUi.loading }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useSensorData } from '../composables/useSensorData'
import api from '@/services/api'
import { useI18n } from '@/i18n'

const { m } = useI18n()

const {
  devices,
  selectedDeviceId,
  latest,
  hasDevices,
  loadingDevices,
  loadingLatest,
  error,
  lastUpdatedAt,
  fetchDevices,
  fetchLatest,
  startPolling,
  stopPolling,
} = useSensorData(2000)

const isPolling = ref(false)
const actuatorState = ref<'ON' | 'OFF' | null>(null)
const loadingActuator = ref(false)
const actuatorError = ref<string | null>(null)

const loadActuatorStatus = async () => {
  loadingActuator.value = true
  actuatorError.value = null
  try {
    const res = await api.get('/actuator/status')
    const current = String(res.data?.data?.current_state || '').toUpperCase()
    actuatorState.value = current === 'ON' ? 'ON' : current === 'OFF' ? 'OFF' : null
  } catch (err: any) {
    actuatorError.value = err.response?.data?.message || err.message || 'Error loading actuator status'
  } finally {
    loadingActuator.value = false
  }
}

const setActuator = async (state: 'ON' | 'OFF') => {
  loadingActuator.value = true
  actuatorError.value = null
  try {
    const res = await api.post('/actuator', { state })
    const current = String(res.data?.data?.current_state || '').toUpperCase()
    actuatorState.value = current === 'ON' ? 'ON' : current === 'OFF' ? 'OFF' : state
  } catch (err: any) {
    actuatorError.value = err.response?.data?.message || err.message || 'Error updating actuator state'
  } finally {
    loadingActuator.value = false
  }
}

const start = () => {
  if (!selectedDeviceId.value) return
  startPolling()
  isPolling.value = true
}

const stop = () => {
  stopPolling()
  isPolling.value = false
}

const reload = async () => {
  stop()
  await fetchDevices()
  if (selectedDeviceId.value) {
    await fetchLatest()
  }
}

const refreshOnce = async () => {
  await fetchLatest()
}

const onDeviceChange = async () => {
  stop()
  await fetchLatest()
  start()
}

watch(selectedDeviceId, async () => {
  // if device is cleared, stop polling
  if (!selectedDeviceId.value) stop()
})

onMounted(async () => {
  await fetchDevices()
  if (selectedDeviceId.value) {
    await fetchLatest()
    start()
  }
  await loadActuatorStatus()
})

const pollingLabel = computed(() => (isPolling.value ? m.value.sensorsUi.live : m.value.sensorsUi.paused))
const pollingClass = computed(() =>
  isPolling.value ? 'text-green-300 bg-green-500/10 px-2 py-1 rounded-md outline outline-1 outline-green-500/20'
    : 'text-gray-300 bg-white/5 px-2 py-1 rounded-md outline outline-1 outline-white/10'
)

const formatValue = (v: any) => {
  const n = Number(v)
  if (Number.isNaN(n)) return String(v)
  return n.toFixed(2)
}
</script>
