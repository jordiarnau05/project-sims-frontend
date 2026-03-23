import { ref } from 'vue'
import api from '@/services/api'
import type { Vehicle, VehicleForm, VehicleFilters, VehiclePagination } from '../interfaces/vehicle.interface'

export function useVehicles() {
  const vehicles = ref<Vehicle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const getVehicles = async (page = 1, filters: VehicleFilters = {}) => {
    loading.value = true
    error.value = null
    try {
      const params: Record<string, any> = { page, per_page: pagination.value.per_page }
      if (filters.search) params.search = filters.search
      if (filters.active !== undefined) params.active = filters.active

      const response = await api.get<VehiclePagination>('/vehicles', { params })
      vehicles.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error loading vehicles'
      console.error('Error loading vehicles:', err)
    } finally {
      loading.value = false
    }
  }

  const createVehicle = async (data: VehicleForm) => {
    loading.value = true
    error.value = null
    try {
      const payload: Record<string, any> = {
        ...data,
      }

      if (typeof data.latitude === 'number') {
        payload.latitude = data.latitude
        payload.lat = data.latitude
      }

      if (typeof data.longitude === 'number') {
        payload.longitude = data.longitude
        payload.lng = data.longitude
      }

      const response = await api.post<{ data?: Vehicle; message?: string }>('/vehicles', payload)
      return (response.data?.data ?? response.data) as Vehicle
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error creating vehicle'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getVehicle = async (id: number): Promise<Vehicle> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ data: Vehicle }>(`/vehicles/${id}`)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error loading vehicle'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVehicle = async (id: number, data: VehicleForm): Promise<Vehicle> => {
    loading.value = true
    error.value = null
    try {
      const payload: Record<string, any> = {
        ...data,
      }

      if (typeof data.latitude === 'number') {
        payload.latitude = data.latitude
        payload.lat = data.latitude
      }

      if (typeof data.longitude === 'number') {
        payload.longitude = data.longitude
        payload.lng = data.longitude
      }

      const response = await api.put<{ data?: Vehicle; message?: string }>(`/vehicles/${id}`, payload)
      return (response.data?.data ?? response.data) as Vehicle
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error updating vehicle'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteVehicle = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/vehicles/${id}`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error deleting vehicle'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    vehicles,
    loading,
    error,
    pagination,
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
  }
}
