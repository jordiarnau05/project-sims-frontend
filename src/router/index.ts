import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { authRoutes } from '@/modules/auth/router'
import AppLayout from '@/modules/common/layouts/AppLayout.vue'
import AdminLayout from '@/modules/admin/layouts/AdminLayout.vue'
import NotFoundPage from '@/modules/common/pages/NotFoundPage.vue'
import { userRoutes } from '@/modules/admin/modules/users/router'
import { vehicleRoutes } from '@/modules/admin/modules/vehicles/router'
import { rolesRoutes } from '@/modules/admin/modules/roles/router'
import { tenantRoutes } from '@/modules/admin/modules/tenants/router'
import { clientRoutes } from '@/modules/client/router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('@/modules/common/pages/HomePage.vue') },
      { path: 'vehicles-map', component: () => import('@/modules/common/pages/MapPage.vue') },
      { path: 'tickets', component: () => import('@/modules/tickets/pages/TicketsPage.vue') },
      { path: 'tickets/create', component: () => import('@/modules/tickets/pages/CreateTicketPage.vue') },
      { path: 'tickets/:id', component: () => import('@/modules/tickets/pages/TicketConversationPage.vue') },
      ...clientRoutes,

    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('@/modules/admin/pages/AdminDashboardPage.vue') },
      {
        path: 'map',
        name: 'AdminVehicleMap',
        component: () => import('@/modules/admin/pages/VehicleMapPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      ...vehicleRoutes,
      ...userRoutes,
      ...rolesRoutes,
      ...tenantRoutes,
      {
        path: 'bookings',
        name: 'AdminBookings',
        component: () => import('@/modules/admin/bookings/pages/BookingsPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'tickets',
        name: 'AdminTickets',
        component: () => import('@/modules/admin/tickets/pages/TicketsPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'tickets/:id',
        name: 'AdminTicketDetail',
        component: () => import('@/modules/admin/tickets/pages/TicketDetailPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'bookings/:id',
        name: 'AdminBookingDetail',
        component: () => import('@/modules/admin/bookings/pages/BookingDetailPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'bookings/:id/edit',
        name: 'AdminBookingEdit',
        component: () => import('@/modules/admin/bookings/pages/BookingFormPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  ...authRoutes,

  { path: '/landing', name: 'Landing', component: () => import('@/modules/common/pages/LandingPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard global
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, fetchUser, getToken, user } = useAuth()
  const requiresAuth = to.meta.requiresAuth

  // If there's a token but no user data, try to fetch user
  if (getToken() && !isAuthenticated.value) {
    await fetchUser()
  }

  const isAdmin = user.value?.roles?.some((r: any) => r.name === 'Admin') ?? false

  if (requiresAuth && !isAuthenticated.value) {
    // Protected route and not authenticated -> go to login
    next('/login')
  } else if (to.path.startsWith('/admin') && isAuthenticated.value && !isAdmin) {
    // Client trying to access admin area -> redirect to client home
    next('/')
  } else {
    next()
  }
})

export default router
