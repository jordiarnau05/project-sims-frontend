import type { RouteRecordRaw } from 'vue-router'

export const superAdminRoutes: RouteRecordRaw[] = [
  {
    path: 'super-admin',
    name: 'SuperAdminOverview',
    component: () => import('../pages/SuperAdminOverviewPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, requiresSuperAdmin: true }
  },
  {
    path: 'tenant-workspace',
    name: 'TenantWorkspace',
    component: () => import('../pages/TenantWorkspacePage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, requiresSuperAdmin: true }
  }
]
