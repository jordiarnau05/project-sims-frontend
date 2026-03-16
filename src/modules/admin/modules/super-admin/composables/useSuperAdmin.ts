import { computed, ref } from 'vue'
import api from '@/services/api'
import { useTenants } from '@/modules/admin/modules/tenants/composables/useTenants'
import type {
  SuperAdminSummary,
  SuperAdminTenant,
  SuperAdminUser,
  SuperAdminVehicle,
} from '../interfaces/super-admin.interface'

type AnyRecord = Record<string, any>

export function useSuperAdmin() {
  const { getTenants } = useTenants()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const tenants = ref<SuperAdminTenant[]>([])
  const users = ref<SuperAdminUser[]>([])
  const vehicles = ref<SuperAdminVehicle[]>([])

  const summary = computed<SuperAdminSummary>(() => {
    const activeTenants = tenants.value.filter((t) => t.active).length
    const activeVehicles = vehicles.value.filter((v) => v.active).length
    const activeUsers = users.value.filter((u) => u.active).length

    return {
      tenants: tenants.value.length,
      activeTenants,
      totalVehicles: vehicles.value.length,
      activeVehicles,
      totalUsers: users.value.length,
      activeUsers,
    }
  })

  const refreshOverview = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
<<<<<<< HEAD
      await loadTenants()
      const [vehiclesByTenant, usersByTenant] = await Promise.all([
        loadVehiclesForSuperAdmin(),
        loadUsersForSuperAdmin(),
=======
      const tenantList = await loadTenants()
      const [vehiclesByTenant, usersByTenant] = await Promise.all([
        loadVehiclesForTenants(tenantList),
        loadUsersForTenants(tenantList),
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
      ])

      vehicles.value = vehiclesByTenant
      users.value = usersByTenant
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Error loading super admin overview'
    } finally {
      loading.value = false
    }
  }

  const switchTenantContext = (tenantSlug: string): void => {
    document.cookie = `tenant=${tenantSlug};path=/`
    localStorage.setItem('active_admin_tenant', tenantSlug)
  }

  const loadTenants = async (): Promise<SuperAdminTenant[]> => {
    const response = await api.get('/tenants', { params: { per_page: 200 } })
    const rows = normalizeCollection(response.data)

    const mapped: SuperAdminTenant[] = rows.map((row: AnyRecord) => ({
      id: String(row.id),
      slug: String(row.slug || row.id),
      name: String(row.name || row.id),
      email: row.email ?? null,
      active: Boolean(row.active),
    }))
<<<<<<< HEAD
    // The central tenant is the SuperAdmin workspace, not an operational tenant.
    .filter((tenant) => tenant.id !== 'central')
=======
>>>>>>> 765405c (feat: add super admin functionality and tenant management)

    tenants.value = mapped
    return mapped
  }

<<<<<<< HEAD
  const loadVehiclesForSuperAdmin = async (): Promise<SuperAdminVehicle[]> => {
    const response = await api.get('/vehicles', {
      params: { per_page: 300 },
    })

    const rows = normalizeCollection(response.data)
    return rows.map((row: AnyRecord) => ({
      id: Number(row.id),
      tenant_id: row.tenant_id ? String(row.tenant_id) : null,
      tenant_name: String(row.tenant?.name || row.tenant_id || '-'),
      license_plate: String(row.license_plate || '-'),
      brand: row.brand ?? null,
      model: row.model ?? null,
      active: Boolean(row.active),
    }))
  }

  const loadUsersForSuperAdmin = async (): Promise<SuperAdminUser[]> => {
    const response = await api.get('/users')

    const rows = normalizeCollection(response.data)
    return rows.map((row: AnyRecord) => ({
      id: Number(row.id),
      tenant_id: row.tenant_id ? String(row.tenant_id) : null,
      tenant_name: String(row.tenant?.name || row.tenant_id || '-'),
      name: String(row.name || '-'),
      username: String(row.username || '-'),
      email: String(row.email || '-'),
      active: Boolean(row.active),
      role_name: row.roles?.[0]?.name || '-',
    }))
=======
  const loadVehiclesForTenants = async (tenantList: SuperAdminTenant[]): Promise<SuperAdminVehicle[]> => {
    const results = await Promise.all(
      tenantList.map(async (tenant) => {
        try {
          const response = await api.get('/vehicles', {
            params: { per_page: 300 },
            headers: { 'X-Tenant': tenant.slug },
          })

          const rows = normalizeCollection(response.data)
          return rows.map((row: AnyRecord) => ({
            id: Number(row.id),
            tenant_id: row.tenant_id ? String(row.tenant_id) : tenant.slug,
            tenant_name: tenant.name,
            license_plate: String(row.license_plate || '-'),
            brand: row.brand ?? null,
            model: row.model ?? null,
            active: Boolean(row.active),
          }))
        } catch {
          return []
        }
      })
    )

    return results.flat()
  }

  const loadUsersForTenants = async (tenantList: SuperAdminTenant[]): Promise<SuperAdminUser[]> => {
    const results = await Promise.all(
      tenantList.map(async (tenant) => {
        try {
          const response = await api.get('/users', {
            headers: { 'X-Tenant': tenant.slug },
          })

          const rows = normalizeCollection(response.data)
          return rows.map((row: AnyRecord) => ({
            id: Number(row.id),
            tenant_id: row.tenant_id ? String(row.tenant_id) : tenant.slug,
            tenant_name: tenant.name,
            name: String(row.name || '-'),
            username: String(row.username || '-'),
            email: String(row.email || '-'),
            active: Boolean(row.active),
            role_name: row.roles?.[0]?.name || '-',
          }))
        } catch {
          return []
        }
      })
    )

    return results.flat()
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
  }

  return {
    loading,
    error,
    tenants,
    users,
    vehicles,
    summary,
    refreshOverview,
    switchTenantContext,
  }
}

function normalizeCollection(payload: any): AnyRecord[] {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}
