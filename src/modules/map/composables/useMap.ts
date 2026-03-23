import { ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import apiClient from '@/services/api'

export interface Vehicle {
  id: number
  plate: string
  license_plate?: string
  brand: string
  model: string
  latitude: number
  longitude: number
  status: 'available' | 'occupied' | 'running'
  tenant_id?: number
  active?: boolean
  postgres_active?: boolean
  mongo_active?: boolean
  created_at?: string
  updated_at?: string
}

const vehicles = ref<Vehicle[]>([])
const map = ref<L.Map | null>(null)
const mapContainer = ref<HTMLElement | null>(null)
const markers: Map<number, L.Marker> = new Map()
let userMarker: L.Marker | L.CircleMarker | null = null
let pollInterval: ReturnType<typeof setInterval> | null = null
let pollEndpoint = '/vehicles-map'
let onVehicleClickCallback: ((vehicle: Vehicle) => void) | null = null
let selectedVehicleId: number | null = null

// reactive filters & search
const searchQuery = ref('')
const showOperativeOnly = ref(false)
const userLocation = ref<{ lat: number; lng: number } | null>(null)
const radiusMeters = ref<number | null>(null)

const normalizeVehicleStatus = (vehicle: any): 'available' | 'occupied' | 'running' => {
  // Prioritat d'estat real:
  // 1) mongo_active -> running (vehicle en marxa)
  // 2) postgres_active -> occupied (vehicle reservat/ocupat)
  // 3) status del backend si és vàlid
  // 4) available per defecte
  if (vehicle?.mongo_active === true) return 'running'
  if (vehicle?.postgres_active === true) return 'occupied'
  if (['available', 'occupied', 'running'].includes(vehicle?.status)) {
    return vehicle.status
  }
  return 'available'
}

const createVehicleIcon = (status: 'available' | 'occupied' | 'running', isSelected: boolean = false) => {
  // Lògica correcta dels colors segons status:
  // - available: fons verd, borde blanc
  // - occupied: fons taronja, borde blanc
  // - running: fons blanc, borde vermell
  
  let color = '#22c55e' // Verd (available)
  let borderColor = '#ffffff' // Blanc
  let iconColor = 'white'
  
  if (status === 'running') {
    color = '#ffffff' // Blanc
    borderColor = '#ef4444' // Vermell
    iconColor = '#ef4444' // Icona vermella
  } else if (status === 'occupied') {
    color = '#f59e0b' // Taronja
    borderColor = '#ffffff' // Blanc
    iconColor = 'white'
  }
  
  // Si està seleccionat, afegir efecte de highlight
  const boxShadow = isSelected 
    ? '0 0 0 4px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0,0,0,0.4)' 
    : '0 2px 6px rgba(0,0,0,0.3)'
  const size = isSelected ? 40 : 32
  const iconSize = isSelected ? 22 : 18

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid ${borderColor};
        box-shadow: ${boxShadow};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="${iconColor}" viewBox="0 0 24 24" width="${iconSize}" height="${iconSize}">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
    className: 'vehicle-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}

const rawVehicles = ref<Vehicle[]>([])
// IDs de vehicles amb reserva activa/pendent detectats des del frontend
const bookedVehicleIds = ref<Set<number>>(new Set())

const extractCollection = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  const candidates = [
    payload.data,
    payload.vehicles,
    payload.reservations,
    payload.bookings,
    payload.results,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
    if (candidate && typeof candidate === 'object' && Array.isArray(candidate.data)) {
      return candidate.data
    }
  }

  return []
}

const markVehicleAsBooked = (vehicleId: number, booked: boolean) => {
  const newSet = new Set(bookedVehicleIds.value)
  if (booked) {
    newSet.add(vehicleId)
  } else {
    newSet.delete(vehicleId)
  }
  bookedVehicleIds.value = newSet
  // Actualitzar la icona del marcador si existeix
  const marker = markers.get(vehicleId) as any
  const vehicle = rawVehicles.value.find(v => v.id === vehicleId)
  if (marker && vehicle) {
    const isSelected = vehicle.id === selectedVehicleId
    const effectiveStatus = newSet.has(vehicleId) ? 'occupied' : vehicle.status
    try { marker.setIcon(createVehicleIcon(effectiveStatus, isSelected)) } catch { /* ignore */ }
  }
}

const fetchVehicles = async (endpoint = '/vehicles') => {
  try {
    const [vehiclesResponse, reservationsResponse] = await Promise.all([
      apiClient.get(endpoint),
      apiClient.get('/reservations').catch(() => ({ data: [] }))
    ])

    // El backend pot retornar diferents formes de payload
    const vehiclesData = extractCollection(vehiclesResponse.data)
    
    if (!Array.isArray(vehiclesData)) {
      console.error('Backend did not return an array:', vehiclesResponse.data)
      rawVehicles.value = []
      return
    }
    
    // Calcular quins vehicle_ids tenen reserva activa/pendent IMMINENT
    // Un vehicle es considera ocupat si:
    //   - té una reserva 'active' (vehicle en ús ara mateix)
    //   - té una reserva 'pending'/'confirmed' que comença en menys de 2 hores
    const reservationsData: any[] = extractCollection(reservationsResponse.data)
    const now = Date.now()
    const twoHoursMs = 2 * 60 * 60 * 1000
    const occupiedIds = new Set<number>(
      reservationsData
        .filter((r: any) => {
          if (r.status === 'active') return true
          if (['pending', 'confirmed'].includes(r.status)) {
            const startsIn = new Date(r.scheduled_start).getTime() - now
            return startsIn <= twoHoursMs
          }
          return false
        })
        .map((r: any) => r.vehicle_id)
    )
    bookedVehicleIds.value = occupiedIds

    // El backend retorna vehicles filtrats per tenant automàticament
    rawVehicles.value = vehiclesData.map((v: any) => ({
      id: v.id,
      plate: v.license_plate || v.plate || 'N/A',
      license_plate: v.license_plate,
      brand: v.brand || 'Unknown',
      model: v.model || '',
      latitude: v.latitude,
      longitude: v.longitude,
      tenant_id: v.tenant_id,
      status: normalizeVehicleStatus(v),
      active: v.active,
      postgres_active: v.postgres_active,
      mongo_active: v.mongo_active,
      created_at: v.created_at,
      updated_at: v.updated_at,
    }))

    console.log(`Loaded ${rawVehicles.value.length} vehicles, ${occupiedIds.size} with active bookings`)
    applyFiltersAndMarkers()

    // Actualitzar icones dels marcadors ja existents amb l'estat real de reserva
    rawVehicles.value.forEach(v => {
      const marker = markers.get(v.id) as any
      if (marker) {
        const isSelected = v.id === selectedVehicleId
        const effectiveStatus = occupiedIds.has(v.id) ? 'occupied' : v.status
        try { marker.setIcon(createVehicleIcon(effectiveStatus, isSelected)) } catch { /* ignore */ }
      }
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    rawVehicles.value = []
  }
}

const initMap = () => {
  if (!mapContainer.value) return

  // Centrar a Amposta per defecte
  map.value = L.map(mapContainer.value).setView([40.7095, 0.5795], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value as any)
}

const withinRadius = (v: Vehicle) => {
  if (!userLocation.value || !radiusMeters.value) return true
  const R = 6371000 // metres
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(v.latitude - userLocation.value.lat)
  const dLon = toRad(v.longitude - userLocation.value.lng)
  const lat1 = toRad(userLocation.value.lat)
  const lat2 = toRad(v.latitude)

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d <= (radiusMeters.value || 0)
}

const applyFiltersAndMarkers = () => {
  if (!map.value) return
  
  const q = searchQuery.value.trim().toLowerCase()
  const filtered = rawVehicles.value.filter(v => {
    if (showOperativeOnly.value && v.status !== 'running') return false
    if (q) {
      const combined = `${v.plate} ${v.brand} ${v.model}`.toLowerCase()
      if (!combined.includes(q)) return false
    }
    if (!withinRadius(v)) return false
    return true
  })

  vehicles.value = filtered
  
  // Afegir només marcadors nous
  vehicles.value.forEach(v => {
    if (v.latitude == null || v.longitude == null) return
    if (markers.has(v.id)) return
    
    const effectiveStatus = bookedVehicleIds.value.has(v.id) ? 'occupied' : v.status
    const marker = L.marker([v.latitude, v.longitude], { 
      icon: createVehicleIcon(effectiveStatus, false) 
    }).addTo(map.value as any)
    
    marker.on('click', () => {
      if (onVehicleClickCallback) {
        onVehicleClickCallback(v)
      }
    })

    markers.set(v.id, marker)
  })
  
  // Eliminar marcadors que no estan al filtre
  const visibleIds = new Set(vehicles.value.map(v => v.id))
  markers.forEach((m, id) => {
    if (!visibleIds.has(id)) {
      m.remove()
      markers.delete(id)
    }
  })
}

const centerOnVehicle = (vehicle: Vehicle) => {
  if (map.value) {
    map.value.setView([vehicle.latitude, vehicle.longitude], 15)
  }
}

const setUserLocation = (lat: number, lng: number) => {
  userLocation.value = { lat, lng }
  // add or move user marker
  if (map.value) {
    if (userMarker) {
      // update existing marker
      try { userMarker.setLatLng([lat, lng]) } catch { /* ignore if circle */ }
    } else if (map.value) {
      // use a circle marker for user to ensure visible and distinct
      userMarker = L.circleMarker([lat, lng], { radius: 8, color: '#2563eb', weight: 2, fillColor: '#60a5fa', fillOpacity: 0.9 }).addTo(map.value as any)
      try { userMarker.bindPopup('<b>You are here</b>') } catch {}
    }
    // ensure user marker is on top
    if ((userMarker as any)?.bringToFront) (userMarker as any).bringToFront()
  }
  applyFiltersAndMarkers()
}

const destroyUserMarker = () => {
  if (userMarker) {
    userMarker.remove()
    userMarker = null
  }
}

const setRadiusMeters = (m: number | null) => {
  radiusMeters.value = m
  applyFiltersAndMarkers()
}

const setSearchQuery = (q: string) => {
  searchQuery.value = q
  applyFiltersAndMarkers()
}

const setShowOperativeOnly = (v: boolean) => {
  showOperativeOnly.value = v
  applyFiltersAndMarkers()
}

const setOnVehicleClick = (callback: (vehicle: Vehicle) => void) => {
  onVehicleClickCallback = callback
}

const startPolling = (endpoint = '/vehicles', intervalMs = 8000) => {
  pollEndpoint = endpoint
  if (pollInterval) clearInterval(pollInterval)
  pollInterval = setInterval(() => {
    fetchVehicles(pollEndpoint).catch(() => {})
  }, intervalMs)
}

const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

const getEffectiveStatus = (vehicle: Vehicle): 'available' | 'occupied' | 'running' => {
  if (bookedVehicleIds.value.has(vehicle.id)) return 'occupied'
  return vehicle.status
}

const setSelectedVehicle = (vehicleId: number | null) => {
  const previousSelectedId = selectedVehicleId
  selectedVehicleId = vehicleId
  
  // Només actualitzar els marcadors afectats (l'anterior i el nou)
  if (previousSelectedId !== null && markers.has(previousSelectedId)) {
    const prevMarker = markers.get(previousSelectedId) as any
    const prevVehicle = rawVehicles.value.find(v => v.id === previousSelectedId)
    if (prevVehicle) {
      try {
        prevMarker.setIcon(createVehicleIcon(getEffectiveStatus(prevVehicle), false))
      } catch (e) { /* ignore */ }
    }
  }
  
  if (vehicleId !== null && markers.has(vehicleId)) {
    const newMarker = markers.get(vehicleId) as any
    const newVehicle = rawVehicles.value.find(v => v.id === vehicleId)
    if (newVehicle) {
      try {
        newMarker.setIcon(createVehicleIcon(getEffectiveStatus(newVehicle), true))
      } catch (e) { /* ignore */ }
    }
  }
}

const destroyMap = () => {
  markers.forEach(m => m.remove())
  markers.clear()
  
  if (map.value) {
    map.value.remove()
    map.value = null
  }
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
  onVehicleClickCallback = null
  selectedVehicleId = null
}

export function useMap() {
  return {
    mapContainer,
    vehicles,
    map,
    markers,
    createVehicleIcon,
    fetchVehicles,
    initMap,
    centerOnVehicle,
    destroyMap,
    setOnVehicleClick,
    startPolling,
    stopPolling,
    setSelectedVehicle,
    markVehicleAsBooked,
    bookedVehicleIds,
    // new api
    rawVehicles,
    searchQuery,
    setSearchQuery,
    showOperativeOnly,
    setShowOperativeOnly,
    userLocation,
    setUserLocation,
    radiusMeters,
    setRadiusMeters,
    // expose user marker functions for diagnostics
    _internal: {
      getUserMarker: () => userMarker
    }
  }
}
