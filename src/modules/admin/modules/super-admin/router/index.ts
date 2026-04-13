import type { RouteRecordRaw } from 'vue-router'

export const superAdminRoutes: RouteRecordRaw[] = [
  {
    path: 'super-admin',
    name: 'SuperAdminOverview',
    redirect: '/admin/users',
    meta: { requiresAuth: true, requiresAdmin: true, requiresSuperAdmin: true }
  },
  {
    path: 'tenant-workspace',
    name: 'TenantWorkspace',
    redirect: '/admin/tenants',
    meta: { requiresAuth: true, requiresAdmin: true, requiresSuperAdmin: true }
  }
]
