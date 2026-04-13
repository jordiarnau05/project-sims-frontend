import { ref } from 'vue'
import api from '@/services/api'
import type { Tenant, TenantForm, TenantFilters, TenantPagination } from '../interfaces/tenant.interface'

export function useTenants() {
  const tenants = ref<Tenant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const getTenants = async (page = 1, filters: TenantFilters = {}) => {
    loading.value = true
    error.value = null
    try {
      const params: Record<string, any> = { page, per_page: pagination.value.per_page }
      if (filters.search) params.search = filters.search
      if (filters.active !== undefined) params.active = filters.active

      const response = await api.get<TenantPagination>('/tenants', { params })
      tenants.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error cargando tenants'
      console.error('Error loading tenants:', err)
    } finally {
      loading.value = false
    }
  }

  const createTenant = async (data: TenantForm) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<{ data: Tenant; message: string }>('/tenants', data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error creando tenant'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTenant = async (id: string | number): Promise<Tenant> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ data: Tenant }>(`/tenants/${id}`)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error cargando tenant'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTenant = async (id: string | number, data: TenantForm): Promise<Tenant> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<{ data: Tenant; message: string }>(`/tenants/${id}`, data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error actualizando tenant'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTenant = async (id: string | number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/tenants/${id}`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error eliminando tenant'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleActive = async (id: string | number): Promise<Tenant> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch<{ data: Tenant; message: string }>(`/tenants/${id}/toggle-active`)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error cambiando estado del tenant'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tenants,
    loading,
    error,
    pagination,
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    toggleActive
  }
}
