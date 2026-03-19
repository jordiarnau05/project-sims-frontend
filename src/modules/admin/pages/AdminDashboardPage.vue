<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">Admin dashboard</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Quick overview of administration modules.
      </p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <RouterLink
        v-for="item in items"
        :key="item.name"
        :to="item.to"
        class="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900/60 p-6 ring-1 ring-gray-200 dark:ring-white/10 hover:ring-indigo-500 transition shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ item.name }}
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {{ item.description }}
            </p>
            <p
              v-if="item.count !== undefined"
              class="mt-3 text-gray-900 dark:text-gray-100"
            >
              <span class="text-3xl font-semibold">{{ item.count }}</span>
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :class="item.bgClass"
          >
            <component
              :is="item.icon"
              class="h-6 w-6"
              :class="item.iconClass"
            />
          </div>
        </div>
        <p class="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
          Go to {{ item.name.toLowerCase() }}
        </p>
      </RouterLink>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  CalendarDaysIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
  TicketIcon,
} from '@heroicons/vue/24/outline'
import { useUsers } from '@/modules/admin/modules/users/composables/useUsers'
import { useVehicles } from '@/modules/admin/modules/vehicles/composables/useVehicles'
import { useRoles } from '@/modules/admin/modules/roles/composables/useRoles'
import { useBookings } from '@/modules/admin/bookings/composables/useBookings'
import { useTickets } from '@/modules/tickets/composables/useTickets'

const {
  users,
  pagination: usersPagination,
  getUsers,
} = useUsers()
const {
  vehicles,
  pagination: vehiclesPagination,
  getVehicles,
} = useVehicles()
const {
  roles,
  pagination: rolesPagination,
  getRoles,
} = useRoles()
const {
  bookings,
  pagination: bookingsPagination,
  getBookings,
} = useBookings()
const { tickets, getTickets } = useTickets()

const loadingStats = ref(false)

onMounted(async () => {
  loadingStats.value = true
  try {
    // Load stats independently so one failing endpoint doesn't block others
    await Promise.all([
      getUsers(1).catch((e) => console.error('Error loading users stats', e)),
      getVehicles(1).catch((e) => console.error('Error loading vehicles stats', e)),
      getRoles(1).catch((e) => console.error('Error loading roles stats', e)),
      getBookings(1).catch((e) => console.error('Error loading bookings stats', e)),
      getTickets().catch((e) => console.error('Error loading tickets stats', e)),
    ])
  } catch (e) {
    console.error('Error loading admin stats', e)
  } finally {
    loadingStats.value = false
  }
})

const items = computed(() => [
  {
    name: 'Users',
    description: 'Manage platform users.',
    to: '/admin/users',
    icon: UsersIcon,
    bgClass: 'bg-blue-500/20',
    iconClass: 'text-blue-400',
    count: usersPagination.value.total || users.value.length,
  },
  {
    name: 'Roles',
    description: 'Configure roles and permissions.',
    to: '/admin/roles',
    icon: ShieldCheckIcon,
    bgClass: 'bg-purple-500/20',
    iconClass: 'text-purple-400',
    count: rolesPagination.value.total || roles.value.length,
  },
  {
    name: 'Bookings',
    description: 'Manage vehicle reservations.',
    to: '/admin/bookings',
    icon: CalendarDaysIcon,
    bgClass: 'bg-emerald-500/20',
    iconClass: 'text-emerald-400',
    count: bookingsPagination.value.total || bookings.value.length,
  },
  {
    name: 'Vehicles',
    description: 'Control the vehicle inventory.',
    to: '/admin/vehicles',
    icon: TruckIcon,
    bgClass: 'bg-orange-500/20',
    iconClass: 'text-orange-400',
    count: vehiclesPagination.value.total || vehicles.value.length,
  },
  {
    name: 'Tickets',
    description: 'Manage user support tickets.',
    to: '/admin/tickets',
    icon: TicketIcon,
    bgClass: 'bg-rose-500/20',
    iconClass: 'text-rose-400',
    count: tickets.value.length,
  },
])
</script>
