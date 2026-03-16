import type { RouteRecordRaw } from 'vue-router'

export const superAdminRoutes: RouteRecordRaw[] = [
  {
    path: 'super-admin',
    name: 'SuperAdminOverview',
<<<<<<< HEAD
    redirect: '/admin/users',
=======
    component: () => import('../pages/SuperAdminOverviewPage.vue'),
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
    meta: { requiresAuth: true, requiresAdmin: true, requiresSuperAdmin: true }
  },
  {
    path: 'tenant-workspace',
    name: 'TenantWorkspace',
<<<<<<< HEAD
    redirect: '/admin/tenants',
=======
    component: () => import('../pages/TenantWorkspacePage.vue'),
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
    meta: { requiresAuth: true, requiresAdmin: true, requiresSuperAdmin: true }
  }
]
