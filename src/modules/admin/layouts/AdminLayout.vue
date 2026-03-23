<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-[100] lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-gray-900 dark:ring dark:ring-white/10 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
                <div class="relative flex h-16 shrink-0 items-center">
                  <img class="h-8 w-auto dark:hidden" src="@/assets/logo/logo-black.svg" alt="Fleetly" />
                  <img class="h-8 w-auto not-dark:hidden" src="@/assets/logo/logo-white.svg" alt="Fleetly" />
                </div>
                <nav class="relative flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link :to="item.href" :class="[item.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-[50] lg:flex lg:w-72 lg:flex-col dark:bg-gray-900">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-black/10">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto dark:hidden" src="@/assets/logo/logo-black.svg" alt="Fleetly" />
          <img class="h-8 w-auto not-dark:hidden" src="@/assets/logo/logo-white.svg" alt="Fleetly" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link :to="item.href" :class="[item.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <Menu as="div" class="relative px-2 py-2">
                <MenuButton class="w-full flex items-center gap-x-3 rounded-md px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                  <span class="size-8 rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10 bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                    {{ userInitials }}
                  </span>
                  <span class="truncate">{{ adminDisplayName }}</span>
                  <ChevronUpDownIcon class="ml-auto size-4 text-gray-400" />
                </MenuButton>
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from="opacity-0 scale-95"
                  enter-to="scale-100 opacity-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from="scale-100 opacity-100"
                  leave-to="opacity-0 scale-95"
                >
                  <MenuItems class="absolute bottom-14 left-2 right-2 z-40 origin-bottom rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
                    <MenuItem v-slot="{ active }">
                      <router-link
                        :to="adminProfilePath"
                        :class="[active ? 'bg-gray-100 dark:bg-white/5' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300']"
                      >
                        {{ m.userMenu.yourProfile }}
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        type="button"
                        @click="handleLogout"
                        :class="[active ? 'bg-gray-100 dark:bg-white/5' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300']"
                      >
                        {{ m.userMenu.signOut }}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-900 dark:border-white/10">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-400" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden dark:bg-white/10" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="flex flex-1 items-center font-semibold text-gray-900 dark:text-white">
            {{ $route.meta.title || 'Admin' }}
          </div>
        </div>
      </div>

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <router-view v-if="!isLoading" />
          <div v-else class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { useI18n } from '@/i18n'
import showToast from '@/modules/common/composables/useToast'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  Bars3Icon,
  ChevronUpDownIcon,
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  TruckIcon,
  TicketIcon,
  MapIcon,
  BuildingOfficeIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const { m } = useI18n()
const route = useRoute()
const router = useRouter()

const navigationItems = [
  { key: 'dashboard', href: '/admin', icon: HomeIcon },
  { key: 'map', href: '/admin/map', icon: MapIcon },
  { key: 'users', href: '/admin/users', icon: UsersIcon },
  { key: 'roles', href: '/admin/roles', icon: ShieldCheckIcon },
  { key: 'bookings', href: '/admin/bookings', icon: CalendarDaysIcon },
  { key: 'vehicles', href: '/admin/vehicles', icon: TruckIcon },
  { key: 'tenants', href: '/admin/tenants', icon: BuildingOfficeIcon, superAdminOnly: true },
  { key: 'superAdmin', href: '/admin/super-admin', icon: Squares2X2Icon, superAdminOnly: true },
  { key: 'tenantWorkspace', href: '/admin/tenant-workspace', icon: RectangleGroupIcon, superAdminOnly: true },
  { key: 'tickets', href: '/admin/tickets', icon: TicketIcon },
]

const sidebarOpen = ref(false)
const { user, isLoading, logout } = useAuth()
const isAdmin = computed(() => !!(user.value && user.value.roles && user.value.roles.some((r: any) => (r.name || '').toLowerCase().includes('admin'))))
const isSuperAdmin = computed(() => !!(user.value && user.value.roles && user.value.roles.some((r: any) => (r.name || '').toLowerCase().includes('superadmin'))))

const navigation = computed(() =>
  navigationItems
    .filter((item) => !item.superAdminOnly || isSuperAdmin.value)
    .map(item => ({
      ...item,
      name: m.value.adminNav[item.key as keyof typeof m.value.adminNav],
      current: route.path === item.href || (item.href !== '/admin' && route.path.startsWith(item.href))
    }))
)

const adminDisplayName = computed(() => user.value?.name || 'Admin')
const adminProfilePath = computed(() => user.value?.id ? `/admin/users/${user.value.id}` : '/admin')
const userInitials = computed(() => {
  const name = user.value?.name || 'A'
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleLogout = async () => {
  try {
    await logout()
    showToast(m.value.userMenu.loggedOut)
  } catch {
    // error toast handled in useAuth
  } finally {
    router.push('/login')
  }
}
</script>