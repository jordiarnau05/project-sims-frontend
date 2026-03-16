<template>
  <div class="h-full">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ m.adminMapUi.title }}</h1>
      <p class="text-gray-600 dark:text-gray-400">{{ m.adminMapUi.subtitle }}</p>
    </div>
    
    <!-- Map -->
    <!-- Reserve left space for admin sidebar (lg) and reduce height on small screens -->
    <div ref="mapContainer" class="w-full h-[500px] lg:ml-0 lg:pl-0 rounded-lg shadow-lg z-0" style="height: 60vh;"></div>
    <div class="map-legend absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 text-sm p-2 rounded shadow">
      <div class="flex items-center justify-between mb-1">
        <div class="font-semibold">{{ m.adminMapUi.legend }}</div>
        <button @click="legendOpen = !legendOpen" class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{{ legendOpen ? m.adminMapUi.hide : m.adminMapUi.show }}</button>
      </div>
      <div v-if="legendOpen">
        <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>{{ m.adminMapUi.available }}</span></div>
        <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>{{ m.adminMapUi.occupied }}</span></div>
        <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>{{ m.adminMapUi.running }}</span></div>
      </div>
    </div>
    
    <!-- Vehicles list as responsive cards -->
    <div class="mt-4">
      <div class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow hover:shadow-lg transition-shadow flex flex-col justify-between">
          <div @click="centerOnVehicle(vehicle)" class="cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white truncate">{{ vehicle.plate }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ vehicle.brand }} {{ vehicle.model }}</p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="vehicle.postgres_active ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">{{ vehicle.postgres_active ? m.adminMapUi.occupied : m.adminMapUi.available }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full" :class="vehicle.mongo_active ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'">{{ vehicle.mongo_active ? m.adminMapUi.running : m.adminMapUi.stopped }}</span>
              </div>
            </div>

            <div class="mt-2 text-xs text-gray-500 flex items-center justify-between gap-2">
              <div class="truncate">{{ m.adminMapUi.lat }}: {{ vehicle.latitude ?? '-' }}, {{ m.adminMapUi.lng }}: {{ vehicle.longitude ?? '-' }}</div>
              <div class="text-right text-xs text-gray-400">ID: {{ vehicle.id }}</div>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <!-- Actions removed: clicking plate centers and opens popup -->
            </div>
            <div class="text-xs text-gray-400">{{ vehicle.updated_at ? new Date(vehicle.updated_at).toLocaleString() : '' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useMap } from '@/modules/map/composables/useMap'
import { useI18n } from '@/i18n'

const { m } = useI18n()
const { mapContainer, vehicles, markers, map, initMap, fetchVehicles, centerOnVehicle, destroyMap, setSearchQuery, setShowOperativeOnly, setUserLocation, setRadiusMeters, rawVehicles } = useMap()

const query = ref('')
const operativeOnly = ref(false)
const radiusKm = ref<number | null>(null)
const full = ref(false)
const legendOpen = ref(false)

const onSearch = () => setSearchQuery(query.value)
const onToggleOperative = () => setShowOperativeOnly(operativeOnly.value)
const onRadiusChange = () => setRadiusMeters(radiusKm.value ? radiusKm.value * 1000 : null)

const exportCSV = () => {
  const rows = (vehicles.value || []).map((v: any) => ({ id: v.id, plate: v.plate, brand: v.brand, model: v.model, lat: v.latitude, lng: v.longitude, postgres_active: v.postgres_active, mongo_active: v.mongo_active }))
  if (rows.length === 0) {
    alert(m.value.adminMapUi.noVehiclesToExport)
    return
  }
  const first = rows[0] as any
  const header = Object.keys(first).join(',')
  const csvRows = rows.map((r: any) => Object.values(r).map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(','))
  const csv = [header, ...csvRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vehicles-${new Date().toISOString()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const refresh = () => fetchVehicles('/vehicles-map-admin')
const fitBounds = () => {
  if (!map.value) return
  const arr = (vehicles.value || []).filter(v => v.latitude != null && v.longitude != null).map(v => [v.latitude, v.longitude])
  if (arr.length === 0) return
  const bounds = (window as any).L.latLngBounds(arr)
  map.value.fitBounds(bounds, { padding: [50,50] })
}

const toggleFull = () => {
  full.value = !full.value
  // wait for DOM then invalidate size
  setTimeout(() => map.value?.invalidateSize(), 200)
}

const locateMe = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    setUserLocation(lat, lng)
    if (map.value) {
      map.value.setView([lat, lng], 13)
      if ((window as any).L?.marker) (window as any).L.marker([lat, lng]).addTo(map.value).bindPopup('<b>You are here</b>').openPopup()
    }
  }, err => console.warn('Geolocation failed', err))
}

onMounted(() => {
  initMap()
  fetchVehicles('/vehicles-map-admin').catch(err => console.error(err))
})

onUnmounted(() => {
  destroyMap()
})
</script>

<style scoped>
.vehicle-marker {
  background: transparent !important;
  border: none !important;
}
/* Keep only the container below overlays.
   Do not override Leaflet inner panes, or markers lose map anchoring. */
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
</style>
