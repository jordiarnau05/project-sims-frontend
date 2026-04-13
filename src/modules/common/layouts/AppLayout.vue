<template>
  <div class="min-h-[100dvh] bg-gray-900">
    <!-- Top nav (tu template) -->
    <nav class="border-b border-white/10 bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex shrink-0 items-center">
              <RouterLink to="/">
                <img
                  class="h-11 w-auto object-contain"
                  src="/image.png"
                  alt="SIMS"
                />
              </RouterLink>
            </div>

            <!-- Desktop nav -->
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                class="inline-flex items-center gap-1.5 border-b-2 px-1 pt-1 text-sm font-medium"
                :class="isActive(item.to)
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-gray-400 hover:border-white/20 hover:text-gray-200'"
              >
                <component :is="item.icon" class="size-5" aria-hidden="true" />
                {{ item.name }}
              </RouterLink>
            </div>
          </div>

          <div class="hidden sm:ml-6 sm:flex sm:items-center gap-3">
            <LanguageSwitcher />
            <button type="button" class="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <BellIcon class="size-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <MenuButton class="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Open user menu</span>
                <span class="size-8 rounded-full outline -outline-offset-1 outline-white/10 bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                  {{ userInitials }}
                </span>
              </MenuButton>

              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <button
                      v-if="item.type === 'logout'"
                      type="button"
                      @click="handleLogout"
                      :class="[active ? 'bg-white/5 outline-none' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-300']"
                    >
                      {{ item.name }}
                    </button>
                    <RouterLink
                      v-else
                      :to="item.to"
                      :class="[active ? 'bg-white/5 outline-none' : '', 'block px-4 py-2 text-sm text-gray-300']"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Mobile: top actions -->
          <div class="-mr-2 flex items-center gap-2 sm:hidden">
            <LanguageSwitcher />
            
            <!-- Mobile User Menu -->
            <Menu as="div" class="relative">
              <MenuButton class="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span class="size-8 rounded-full outline -outline-offset-1 outline-white/10 bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                  {{ userInitials }}
                </span>
              </MenuButton>

              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 outline -outline-offset-1 outline-white/10">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <button
                      v-if="item.type === 'logout'"
                      type="button"
                      @click="handleLogout"
                      :class="[active ? 'bg-white/5 outline-none' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-300']"
                    >
                      {{ item.name }}
                    </button>
                    <RouterLink
                      v-else
                      :to="item.to"
                      :class="[active ? 'bg-white/5 outline-none' : '', 'block px-4 py-2 text-sm text-gray-300']"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content (MAP / PAGES) -->
    <main class="relative min-h-[calc(100dvh-4rem)] pb-16">
      <router-view />
    </main>

    <!-- Bottom nav (mobile-first) -->
    <nav class="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-gray-900/90 backdrop-blur sm:hidden">
      <div class="mx-auto max-w-md px-2 py-1 grid grid-cols-5 text-center text-xs text-gray-300">
        <RouterLink to="/" class="flex items-center justify-center py-2 rounded-xl" :class="isActive('/') ? 'text-indigo-400' : 'hover:text-gray-100'">
          <MapIcon class="size-6" />
        </RouterLink>
        <RouterLink to="/bookings" class="flex items-center justify-center py-2 rounded-xl" :class="isActive('/bookings') ? 'text-indigo-400' : 'hover:text-gray-100'">
          <CalendarDaysIcon class="size-6" />
        </RouterLink>
        <RouterLink to="/tickets" class="flex items-center justify-center py-2 rounded-xl" :class="isActive('/tickets') ? 'text-indigo-400' : 'hover:text-gray-100'">
          <TicketIcon class="size-6" />
        </RouterLink>
        <RouterLink to="/sensors" class="flex items-center justify-center py-2 rounded-xl" :class="isActive('/sensors') ? 'text-indigo-400' : 'hover:text-gray-100'">
          <WifiIcon class="size-6" />
        </RouterLink>
        <RouterLink to="/perfil" class="flex items-center justify-center py-2 rounded-xl" :class="isActive('/perfil') ? 'text-indigo-400' : 'hover:text-gray-100'">
          <UserIcon class="size-6" />
        </RouterLink>
      </div>
    </nav>

    <!-- AI Chat floating widget -->
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { BellIcon, MapIcon, CalendarDaysIcon, TicketIcon, UserIcon, WifiIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '@/modules/auth/composables/useAuth'
import showToast from '@/modules/common/composables/useToast'
import ChatWidget from '@/modules/client/components/ChatWidget.vue'
import LanguageSwitcher from '@/modules/common/components/LanguageSwitcher.vue'
import { useI18n } from '@/i18n'

const { m } = useI18n()
const route = useRoute()
const router = useRouter()
const { logout, user: authUser } = useAuth()
const isActive = (path: string) => route.path === path

const userInitials = computed(() => {
  const name = authUser.value?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const navigation = computed(() => [
  { name: m.value.nav.map, to: '/vehicles-map', icon: MapIcon },
  { name: m.value.nav.bookings, to: '/bookings', icon: CalendarDaysIcon },
  { name: m.value.nav.tickets, to: '/tickets', icon: TicketIcon },
  { name: 'Sensors', to: '/sensors', icon: WifiIcon },
  { name: m.value.nav.profile, to: '/perfil', icon: UserIcon },
])

const userNavigation = computed(() => [
  { name: m.value.userMenu.yourProfile, to: '/perfil', type: 'link' },
  { name: m.value.userMenu.settings, to: '/settings', type: 'link' },
  { name: m.value.userMenu.signOut, to: '', type: 'logout' },
])

const handleLogout = async () => {
  try {
    await logout()
    showToast(m.value.userMenu.loggedOut)
  } catch (_) {
    // El propio useAuth ja mostra l'error si falla
  } finally {
    router.push('/login')
  }
}
</script>
