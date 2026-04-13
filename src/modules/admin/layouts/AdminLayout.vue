<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white dark:bg-gray-900">
    <body class="h-full">
    ```
  -->
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="" leave="transition-opacity ease-linear duration-300" leave-from="" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80"></div>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="" leave="ease-in-out duration-300" leave-from="" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
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
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform opacity-0 scale-95"
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

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:border-b dark:after:border-white/10 dark:after:bg-black/10">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:text-white" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm/6 font-semibold text-gray-900 dark:text-white">{{ m.adminNav.dashboard }}</div>
      <LanguageSwitcher />
      <Menu as="div" class="relative">
        <MenuButton class="relative flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
          <span class="sr-only">Open user menu</span>
          <span class="size-8 rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10 bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
            {{ userInitials }}
          </span>
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
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
    </div>

    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <div v-if="isAdmin || isLoading">
          <router-view />
        </div>
        <div v-else class="p-8 text-center text-gray-500">
          <h2 class="text-lg font-semibold mb-2">{{ m.admin.notAuthorizedTitle }}</h2>
          <p>{{ m.admin.notAuthorizedMsg }}</p>
        </div>
      </div>
    </main>

    <!-- AI Chat floating widget -->
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChatWidget from '@/modules/client/components/ChatWidget.vue'
import LanguageSwitcher from '@/modules/common/components/LanguageSwitcher.vue'
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
  { key: 'tenants', href: '/admin/tenants', icon: BuildingOfficeIcon },
  { key: 'superAdmin', href: '/admin/super-admin', icon: Squares2X2Icon, superAdminOnly: true },
  { key: 'tenantWorkspace', href: '/admin/tenant-workspace', icon: RectangleGroupIcon, superAdminOnly: true },
  { key: 'tickets', href: '/admin/tickets', icon: TicketIcon },
]

const sidebarOpen = ref(false)
<<<<<<< HEAD
const { user, isLoading, logout } = useAuth()
=======
const { user, isLoading } = useAuth()
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
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
<<<<<<< HEAD

const adminDisplayName = computed(() => user.value?.name || 'Admin')
const adminProfilePath = computed(() => user.value?.id ? `/admin/users/${user.value.id}` : '/admin')
const userInitials = computed(() => {
  const name = user.value?.name || 'A'
  return name
    .split(' ')
    .map(n => n[0])
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
=======
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
</script>