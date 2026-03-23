import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
  created_at?: string
  updated_at?: string
}

export const useVehicleStore = defineStore('vehicle', () => {
  // State
  const vehicles = ref<Vehicle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedVehicle = ref<Vehicle | null>(null)

  // Getters
  const availableVehicles = computed(() => 
    vehicles.value.filter(v => v.status === 'available')
  )

  const occupiedVehicles = computed(() => 
    vehicles.value.filter(v => v.status === 'occupied')
  )

  const runningVehicles = computed(() => 
    vehicles.value.filter(v => v.status === 'running')
  )

  const activeVehicles = computed(() => 
    vehicles.value.filter(v => v.active === true)
  )

  const extractCollection = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload
    if (!payload || typeof payload !== 'object') return []

    const candidates = [
      payload.data,
      payload.vehicles,
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

  // Actions
  async function fetchVehicles() {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/vehicles')
      const vehiclesData = extractCollection(response.data)
      
      vehicles.value = vehiclesData.map((v: any) => ({
        id: v.id,
        plate: v.license_plate || v.plate || 'N/A',
        license_plate: v.license_plate,
        brand: v.brand || 'Unknown',
        model: v.model || '',
        latitude: v.latitude,
        longitude: v.longitude,
        tenant_id: v.tenant_id,
        status: v.status || 'available',
        active: v.active,
        created_at: v.created_at,
        updated_at: v.updated_at,
      }))
      
      return vehicles.value
    } catch (err: any) {
      error.value = err.message || 'Error fetching vehicles'
      console.error('Error fetching vehicles:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchVehicleById(id: number) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get(`/vehicles/${id}`)
      const vehicle = response.data
      
      selectedVehicle.value = {
        id: vehicle.id,
        plate: vehicle.license_plate || vehicle.plate || 'N/A',
        license_plate: vehicle.license_plate,
        brand: vehicle.brand || 'Unknown',
        model: vehicle.model || '',
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        tenant_id: vehicle.tenant_id,
        status: vehicle.status || 'available',
        active: vehicle.active,
        created_at: vehicle.created_at,
        updated_at: vehicle.updated_at,
      }
      
      return selectedVehicle.value
    } catch (err: any) {
      error.value = err.message || 'Error fetching vehicle'
      console.error('Error fetching vehicle:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function selectVehicle(vehicle: Vehicle | null) {
    selectedVehicle.value = vehicle
  }

  function clearError() {
    error.value = null
  }

  function $reset() {
    vehicles.value = []
    loading.value = false
    error.value = null
    selectedVehicle.value = null
  }

  return {
    // State
    vehicles,
    loading,
    error,
    selectedVehicle,
    
    // Getters
    availableVehicles,
    occupiedVehicles,
    runningVehicles,
    activeVehicles,
    
    // Actions
    fetchVehicles,
    fetchVehicleById,
    selectVehicle,
    clearError,
    $reset,
  }
})
