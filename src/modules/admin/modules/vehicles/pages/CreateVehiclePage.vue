<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <PageHeading
      title="Crear vehículo"
      description="Añade un nuevo vehículo a la flota"
    >
      <template #actions>
        <router-link
          to="/admin/vehicles"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
                 dark:bg-white/10 dark:text-white dark:ring-white/5 dark:hover:bg-white/20"
        >
          Volver
        </router-link>
      </template>
    </PageHeading>

    <form @submit.prevent="handleSubmit" class="mt-8 max-w-2xl space-y-1">
      <FormInput
        v-model="form.license_plate"
        label="Matrícula"
        placeholder="1234ABC o 1234 ABC"
        :error="errors.license_plate"
      />

      <FormInput
        v-model="form.brand"
        label="Marca"
        placeholder="Ej: Toyota"
        :error="errors.brand"
      />

      <FormInput
        v-model="form.model"
        label="Modelo"
        placeholder="Ej: Corolla"
        :error="errors.model"
      />

      <FormField label="Ubicación del vehículo" :error="errors.latitude || errors.longitude">
        <div class="space-y-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Haz clic en el mapa para fijar la posición inicial del vehículo.
          </p>

          <div ref="mapContainer" class="h-72 w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"></div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Latitud</label>
              <input
                v-model.number="form.latitude"
                type="number"
                step="0.000001"
                placeholder="40.709500"
                class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                       placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm
                       dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                @change="syncMarkerFromInputs"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Longitud</label>
              <input
                v-model.number="form.longitude"
                type="number"
                step="0.000001"
                placeholder="0.579500"
                class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                       placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm
                       dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                @change="syncMarkerFromInputs"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              @click="setDefaultLocation"
              class="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200
                     dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Centrar en Amposta
            </button>
            <button
              type="button"
              @click="setCurrentLocation"
              class="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200
                     dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Usar mi ubicación
            </button>
          </div>
        </div>
      </FormField>

      <FormCheckbox
        v-model="form.active"
        label="Activo"
      />

      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Guardando...' : 'Crear vehículo' }}
        </button>
        <router-link
          to="/admin/vehicles"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
                 dark:bg-white/10 dark:text-white dark:ring-white/5 dark:hover:bg-white/20"
        >
          Cancelar
        </router-link>
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useVehicles } from '../composables/useVehicles'
import type { VehicleForm } from '../interfaces/vehicle.interface'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import FormCheckbox from '@/modules/admin/components/FormCheckbox.vue'
import FormField from '@/modules/admin/components/FormField.vue'

const router = useRouter()
const { createVehicle, loading, error } = useVehicles()

const form = reactive<VehicleForm>({
  license_plate: '',
  brand: '',
  model: '',
  latitude: null,
  longitude: null,
  active: true
})

const errors = reactive<Record<string, string | null>>({
  license_plate: null,
  brand: null,
  model: null,
  latitude: null,
  longitude: null,
})

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.CircleMarker | null = null

const DEFAULT_CENTER: [number, number] = [40.7095, 0.5795]
const DEFAULT_ZOOM = 13

function setLocation(lat: number, lng: number, center = true) {
  form.latitude = Number(lat.toFixed(6))
  form.longitude = Number(lng.toFixed(6))

  if (!map) return

  const point: [number, number] = [form.latitude, form.longitude]
  if (!marker) {
    marker = L.circleMarker(point, {
      radius: 8,
      color: '#4f46e5',
      weight: 2,
      fillColor: '#818cf8',
      fillOpacity: 0.9,
    }).addTo(map)
  } else {
    marker.setLatLng(point)
  }

  if (center) {
    map.setView(point, Math.max(map.getZoom(), 14))
  }
}

function syncMarkerFromInputs() {
  if (typeof form.latitude !== 'number' || typeof form.longitude !== 'number') return
  setLocation(form.latitude, form.longitude, true)
}

function setDefaultLocation() {
  setLocation(DEFAULT_CENTER[0], DEFAULT_CENTER[1], true)
}

function setCurrentLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation(position.coords.latitude, position.coords.longitude, true)
    },
    () => {
      // keep silent: user can still click map manually
    },
    { enableHighAccuracy: true }
  )
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView(DEFAULT_CENTER, DEFAULT_ZOOM)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  map.on('click', (event: L.LeafletMouseEvent) => {
    setLocation(event.latlng.lat, event.latlng.lng, false)
  })

  setDefaultLocation()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  marker = null
})

function validate(): boolean {
  let valid = true
  errors.license_plate = null
  errors.brand = null
  errors.model = null
  errors.latitude = null
  errors.longitude = null

  if (!form.license_plate.trim()) {
    errors.license_plate = 'La matrícula es obligatoria'
    valid = false
  } else {
    // Validar formato: 4 dígitos + 3 letras (con o sin espacio)
    const licensePlatePattern = /^\d{4}\s?[A-Z]{3}$/i
    if (!licensePlatePattern.test(form.license_plate.trim())) {
      errors.license_plate = 'Formato incorrecto. Usa: 4 dígitos y 3 letras (ej: 1234ABC o 1234 ABC)'
      valid = false
    }
  }

  if (!form.brand.trim()) {
    errors.brand = 'La marca es obligatoria'
    valid = false
  }
  if (!form.model.trim()) {
    errors.model = 'El modelo es obligatorio'
    valid = false
  }

  if (typeof form.latitude !== 'number' || Number.isNaN(form.latitude)) {
    errors.latitude = 'La latitud es obligatoria'
    valid = false
  }

  if (typeof form.longitude !== 'number' || Number.isNaN(form.longitude)) {
    errors.longitude = 'La longitud es obligatoria'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const created = await createVehicle({ ...form })
    if (!created?.id) {
      throw new Error('Vehicle created response without id')
    }
    router.push(`/admin/vehicles/${created.id}`)
  } catch (err: any) {
    // Validation errors from backend
    if (err.response?.status === 422) {
      const backendErrors = err.response.data.errors || {}
      for (const key of Object.keys(backendErrors)) {
        if (key in errors) {
          errors[key] = backendErrors[key][0]
        }
      }
    } else {
      errors.latitude = errors.latitude || 'No se pudo confirmar el guardado en base de datos. Revisa backend.'
    }
  }
}
</script>
