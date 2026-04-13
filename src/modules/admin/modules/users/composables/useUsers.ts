import { ref, computed } from 'vue'
import api from '@/services/api'
import { useAuth } from '@/modules/auth/composables/useAuth'
import type { User, UserForm, UserFilters } from '../interfaces/user.interface'

export function useUsers() {
  const { user: currentUser } = useAuth()
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  const isCurrentUserAdmin = computed(() => {
    return currentUser.value?.roles?.some((role: any) => {
      return typeof role.name === 'string' && role.name.toLowerCase().includes('admin')
    }) ?? false
  })

  const getUsers = async (page = 1, filters: UserFilters = {}) => {
    loading.value = true
    error.value = null
    try {
      const params: Record<string, any> = {
        page,
        per_page: pagination.value.per_page,
      }
      if (filters.search) params.search = filters.search
      if (filters.role) params.role = filters.role
      if (filters.tenant_id) params.tenant_id = filters.tenant_id
      if (filters.active !== undefined) params.active = filters.active ? 1 : 0

      const response = await api.get('/users', { params })
      const data = response.data

      users.value = data.data
      const meta = data.meta ?? data
      pagination.value = {
        current_page: meta.current_page,
        last_page: meta.last_page,
        per_page: meta.per_page,
        total: meta.total,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error loading users'
      console.error('Error loading users:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (data: UserForm) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<{ data: User; message: string }>('/users', data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error creating user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, data: Partial<UserForm>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<{ data: User; message: string }>(`/users/${id}`, data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error updating user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/users/${id}`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error deleting user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUser = async (id: number): Promise<User> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ data: User }>(`/users/${id}`)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error fetching user'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    pagination,
    isCurrentUserAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
  }
}
