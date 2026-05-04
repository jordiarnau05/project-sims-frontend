<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white dark:bg-gray-900">
    <body class="h-full">
    ```
  -->
  <div class="admin-theme min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="" leave="transition-opacity ease-linear duration-300" leave-from="" leave-to="opacity-0">
          <div class="fixed inset-0 bg-[var(--fleetly-black)]/70"></div>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="" leave="ease-in-out duration-300" leave-from="" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">{{ m.adminLayoutUi.closeSidebar }}</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-[var(--app-sidebar-bg)] px-6 pb-2 ring ring-[var(--app-border)]/40">
                <div class="relative flex h-20 shrink-0 items-center">
                  <img
                    class="h-10 w-auto object-contain"
                    :src="isDark ? '/branding/fleetly_logotip_blanc.svg' : '/branding/fleetly_logotip_negre.svg'"
                    alt="Fleetly"
                  />
                </div>
                <nav class="relative flex flex-1 flex-col" data-tour-id="admin-mobile-nav">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link :to="item.href" :class="[item.current ? 'bg-[var(--app-sidebar-hover)] text-[var(--app-text)]' : 'text-[var(--app-sidebar-text)] hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-text)]', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <component :is="item.icon" :class="[item.current ? 'text-[var(--fleetly-baltic-blue)]' : 'text-[var(--app-sidebar-text)] group-hover:text-[var(--fleetly-baltic-blue)]', (item.key === 'roles' || item.key === 'vehicles') ? 'admin-nav-icon-boost' : '', 'size-6 shrink-0']" aria-hidden="true" />
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
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-[50] lg:flex lg:w-72 lg:flex-col bg-[var(--app-sidebar-bg)]">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-[var(--app-border)] bg-[var(--app-sidebar-bg)] px-6">
        <div class="flex h-20 shrink-0 items-center">
          <img
            class="h-10 w-auto object-contain"
            :src="isDark ? '/branding/fleetly_logotip_blanc.svg' : '/branding/fleetly_logotip_negre.svg'"
            alt="Fleetly"
          />
        </div>
        <nav class="flex flex-1 flex-col" data-tour-id="admin-main-nav">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link :to="item.href" :class="[item.current ? 'bg-[var(--app-sidebar-hover)] text-[var(--app-text)]' : 'text-[var(--app-sidebar-text)] hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-text)]', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <component :is="item.icon" :class="[item.current ? 'text-[var(--fleetly-baltic-blue)]' : 'text-[var(--app-sidebar-text)] group-hover:text-[var(--fleetly-baltic-blue)]', (item.key === 'roles' || item.key === 'vehicles') ? 'admin-nav-icon-boost' : '', 'size-6 shrink-0']" aria-hidden="true" />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <div class="px-2 pb-2">
                <div class="mb-2 flex justify-center" data-tour-id="language-switcher">
                  <LanguageSwitcher />
                </div>
                <button
                  type="button"
                  data-tour-id="admin-tour-button"
                  class="mb-2 w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--app-sidebar-text)] hover:bg-[var(--app-sidebar-hover)]"
                  @click="startGuide(true)"
                >
                  <QuestionMarkCircleIcon class="size-4" />
                  {{ m.guidedTour.startGuide }}
                </button>
                <button
                  type="button"
                  data-tour-id="theme-toggle"
                  class="w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--app-sidebar-text)] hover:bg-[var(--app-sidebar-hover)]"
                  @click="toggleTheme"
                >
                  <MoonIcon v-if="!isDark" class="size-4" />
                  <SunIcon v-else class="size-4" />
                  {{ isDark ? m.adminLayoutUi.themeLight : m.adminLayoutUi.themeDark }}
                </button>
              </div>
              <Menu as="div" class="relative px-2 py-2" data-tour-id="admin-user-menu">
                <MenuButton class="w-full flex items-center gap-x-3 rounded-md px-4 py-2 text-sm font-semibold text-[var(--app-sidebar-text)] hover:bg-[var(--app-sidebar-hover)]">
                  <span class="size-8 rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10 bg-[var(--fleetly-baltic-blue)] flex items-center justify-center text-xs font-bold text-white">
                    {{ userInitials }}
                  </span>
                  <span class="truncate">{{ adminDisplayName }}</span>
                  <ChevronUpDownIcon class="ml-auto size-4 text-[var(--fleetly-pale-slate)]" />
                </MenuButton>
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute bottom-14 left-2 right-2 z-40 origin-bottom rounded-md bg-[var(--app-surface)] py-1 shadow-lg ring-1 ring-[var(--app-border)]">
                    <MenuItem v-slot="{ active }">
                      <router-link
                        :to="adminProfilePath"
                        :class="[active ? 'bg-[var(--app-surface-alt)]' : '', 'block px-4 py-2 text-sm text-[var(--app-text)]']"
                      >
                        {{ m.userMenu.yourProfile }}
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        type="button"
                        @click="handleLogout"
                        :class="[active ? 'bg-[var(--app-surface-alt)]' : '', 'block w-full text-left px-4 py-2 text-sm text-[var(--app-text)]']"
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

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-[var(--app-surface)] px-4 py-4 shadow-xs sm:px-6 lg:hidden border-b border-[var(--app-border)]/60">
      <button type="button" class="-m-2.5 p-2.5 text-[var(--fleetly-gunmetal)] hover:text-[var(--fleetly-black)] lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">{{ m.adminLayoutUi.openSidebar }}</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm/6 font-semibold text-[var(--app-text)]">{{ m.adminNav.dashboard }}</div>
      <button
        type="button"
        data-tour-id="theme-toggle"
        class="rounded-md p-2 text-[var(--app-muted-text)] hover:bg-[var(--app-surface-alt)] hover:text-[var(--app-text)]"
        @click="toggleTheme"
      >
        <MoonIcon v-if="!isDark" class="size-5" />
        <SunIcon v-else class="size-5" />
      </button>
      <div data-tour-id="language-switcher">
        <LanguageSwitcher />
      </div>
      <button
        type="button"
        data-tour-id="admin-tour-button"
        class="rounded-md p-2 text-[var(--app-muted-text)] hover:bg-[var(--app-surface-alt)] hover:text-[var(--app-text)]"
        @click="startGuide(true)"
      >
        <QuestionMarkCircleIcon class="size-5" />
      </button>
      <Menu as="div" class="relative" data-tour-id="admin-user-menu-mobile">
        <MenuButton class="relative flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fleetly-baltic-blue)]">
          <span class="sr-only">{{ m.adminLayoutUi.openUserMenu }}</span>
          <span class="size-8 rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10 bg-[var(--fleetly-baltic-blue)] flex items-center justify-center text-xs font-bold text-white">
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
          <MenuItems class="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-[var(--app-surface)] py-1 shadow-lg ring-1 ring-[var(--app-border)]">
            <MenuItem v-slot="{ active }">
              <router-link
                :to="adminProfilePath"
                :class="[active ? 'bg-[var(--app-surface-alt)]' : '', 'block px-4 py-2 text-sm text-[var(--app-text)]']"
              >
                {{ m.userMenu.yourProfile }}
              </router-link>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                type="button"
                @click="handleLogout"
                :class="[active ? 'bg-[var(--app-surface-alt)]' : '', 'block w-full text-left px-4 py-2 text-sm text-[var(--app-text)]']"
              >
                {{ m.userMenu.signOut }}
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <main class="py-10 lg:pl-72 bg-[var(--app-bg)]" data-tour-id="admin-content">
      <div class="px-4 sm:px-6 lg:px-8">
        <div v-if="isAdmin || isLoading">
          <router-view />
        </div>
        <div v-else class="p-8 text-center text-[var(--app-muted-text)]">
          <h2 class="text-lg font-semibold mb-2">{{ m.admin.notAuthorizedTitle }}</h2>
          <p>{{ m.admin.notAuthorizedMsg }}</p>
        </div>
      </div>
    </main>

    <!-- AI Chat floating widget -->
    <div data-tour-id="chat-widget">
      <ChatWidget />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import ChatWidget from '@/modules/client/components/ChatWidget.vue'
import LanguageSwitcher from '@/modules/common/components/LanguageSwitcher.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { useI18n } from '@/i18n'
import showToast from '@/modules/common/composables/useToast'
import { useGuidedTour } from '@/modules/common/composables/useGuidedTour'
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
  MapPinIcon,
  ExclamationTriangleIcon,
  MoonIcon,
  SunIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/24/outline'
import { useTheme } from '@/modules/common/composables/useTheme'

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
  { key: 'geofences', href: '/admin/geofences', icon: MapPinIcon },
  { key: 'geofenceEvents', href: '/admin/geofence-events', icon: ExclamationTriangleIcon },
  { key: 'tenants', href: '/admin/tenants', icon: BuildingOfficeIcon, superAdminOnly: true },
  { key: 'tenantRequests', href: '/admin/tenant-requests', icon: BuildingOfficeIcon, superAdminOnly: true },
  { key: 'tickets', href: '/admin/tickets', icon: TicketIcon },
]

const sidebarOpen = ref(false)
const { isDark, toggleTheme } = useTheme()
const { user, isLoading, logout } = useAuth()
const { startAdminTour } = useGuidedTour()
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

const startGuide = (force = false) => {
  startAdminTour({
    userScope: String(user.value?.id ?? 'guest'),
    force,
  })
}

onMounted(async () => {
  await nextTick()
  startGuide(false)
})

</script>

<style scoped>
.admin-nav-icon-boost {
  stroke-width: 2.2;
}

:global(html.dark) .admin-theme .admin-nav-icon-boost {
  color: color-mix(in srgb, var(--app-text) 92%, var(--fleetly-baltic-blue) 8%);
}
</style>