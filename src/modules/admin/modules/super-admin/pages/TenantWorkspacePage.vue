<template>
  <div class="space-y-8 px-4 sm:px-6 lg:px-8">
    <PageHeading
<<<<<<< HEAD
      :title="m.superAdminUi.tenantWorkspaceTitle"
      :description="m.superAdminUi.tenantWorkspaceDescription"
    />

    <div class="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800 dark:border-indigo-800/50 dark:bg-indigo-900/20 dark:text-indigo-300">
      {{ m.superAdminUi.currentTenantContext }}: <strong>{{ activeTenant || m.superAdminUi.none }}</strong>
    </div>

    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">{{ m.superAdminUi.loadingTenants }}</div>
=======
      title="Tenant Workspace"
      description="Switch context and manage each tenant fleet, users, roles and bookings"
    />

    <div class="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800 dark:border-indigo-800/50 dark:bg-indigo-900/20 dark:text-indigo-300">
      Current tenant context: <strong>{{ activeTenant || 'none' }}</strong>
    </div>

    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">Loading tenants...</div>
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
    <div v-else-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{{ error }}</div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="tenant in tenants"
        :key="tenant.id"
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900/60"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ tenant.name }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ tenant.slug }}</p>
          </div>
<<<<<<< HEAD
          <StatusBadge :active="tenant.active" :active-text="m.commonUi.active" :inactive-text="m.commonUi.inactive" />
        </div>

        <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">{{ tenant.email || m.superAdminUi.noEmailConfigured }}</p>
=======
          <StatusBadge :active="tenant.active" active-text="Active" inactive-text="Inactive" />
        </div>

        <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">{{ tenant.email || 'No email configured' }}</p>
>>>>>>> 765405c (feat: add super admin functionality and tenant management)

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            class="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            @click="activateTenant(tenant.slug)"
          >
<<<<<<< HEAD
            {{ m.superAdminUi.activateContext }}
=======
            Activate context
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
          </button>

          <router-link
            class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5"
            :to="'/admin/users'"
            @click="activateTenant(tenant.slug)"
          >
<<<<<<< HEAD
            {{ m.superAdminUi.users }}
=======
            Users
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
          </router-link>

          <router-link
            class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5"
            :to="'/admin/vehicles'"
            @click="activateTenant(tenant.slug)"
          >
<<<<<<< HEAD
            {{ m.superAdminUi.fleet }}
=======
            Fleet
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
          </router-link>

          <router-link
            class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5"
            :to="'/admin/roles'"
            @click="activateTenant(tenant.slug)"
          >
<<<<<<< HEAD
            {{ m.adminNav.roles }}
=======
            Roles
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
          </router-link>

          <router-link
            class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5"
            :to="'/admin/bookings'"
            @click="activateTenant(tenant.slug)"
          >
<<<<<<< HEAD
            {{ m.adminNav.bookings }}
=======
            Bookings
>>>>>>> 765405c (feat: add super admin functionality and tenant management)
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import StatusBadge from '@/modules/admin/components/StatusBadge.vue'
import { useSuperAdmin } from '../composables/useSuperAdmin'
<<<<<<< HEAD
import { useI18n } from '@/i18n'

const { m } = useI18n()
=======
>>>>>>> 765405c (feat: add super admin functionality and tenant management)

const {
  loading,
  error,
  tenants,
  refreshOverview,
  switchTenantContext,
} = useSuperAdmin()

const activeTenant = computed(() => localStorage.getItem('active_admin_tenant'))

const activateTenant = (tenantSlug: string) => {
  switchTenantContext(tenantSlug)
}

onMounted(async () => {
  await refreshOverview()
})
</script>
