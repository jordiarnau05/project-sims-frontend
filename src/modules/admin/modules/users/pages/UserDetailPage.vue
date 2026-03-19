<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Back button -->
    <div class="mb-6">
      <router-link
        to="/admin/users"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to users
      </router-link>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Loading user...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Detail view -->
    <div v-else-if="user" class="bg-white dark:bg-gray-900 shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          {{ user.name }}
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Full user information
        </p>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <!-- Nombre -->
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user.name }}</dd>
          </div>

          <!-- Username -->
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Username</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user.username || '-' }}</dd>
          </div>

          <!-- Email -->
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user.email }}</dd>
          </div>

          <!-- Rol -->
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span v-if="user.roles && user.roles.length > 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="user.roles[0]?.name === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'">
                {{ user.roles[0]?.name }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </dd>
          </div>

          <!-- Estado -->
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span :class="['inline-flex rounded-full px-2 py-1 text-xs font-semibold', user.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200']">
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </dd>
          </div>

          <!-- Created at -->
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created at</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(user.created_at) }}</dd>
          </div>

          <!-- Last updated -->
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Updated at</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(user.updated_at) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Actions -->
      <div v-if="isCurrentUserAdmin" class="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6 flex gap-3">
        <router-link
          :to="`/admin/users/${user.id}/edit`"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </router-link>
        <button
          v-if="canDeleteViewedUser"
          @click="openDeleteModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Delete Modal -->
    <UserDeleteModal
      v-if="showDeleteModal && canDeleteViewedUser"
      :user="user!"
      @confirmed="handleDeleteConfirmed"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsers } from '../composables/useUsers'
import { useToast } from '@/modules/common/composables/useToast'
import type { User } from '../interfaces/user.interface'
import UserDeleteModal from '../components/UserDeleteModal.vue'

const router = useRouter()
const route = useRoute()
const { getUser, isCurrentUserAdmin } = useUsers()
const toast = useToast()

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)

const userId = computed(() => Number(route.params.id))
const isViewedUserSuperAdmin = computed(() => {
  if (!user.value) return false

  const hasSuperAdminRole = user.value.roles?.some((role) => {
    const normalizedName = role.name.trim().toLowerCase()
    return normalizedName === 'super admin' || normalizedName === 'superadmin'
  }) ?? false

  const hasSuperAdminName = user.value.name.trim().toLowerCase() === 'super admin'

  return hasSuperAdminRole || hasSuperAdminName
})

const canDeleteViewedUser = computed(() => {
  return isCurrentUserAdmin.value && !isViewedUserSuperAdmin.value
})

onMounted(async () => {
  await loadUser()
})

const loadUser = async () => {
  loading.value = true
  error.value = null
  try {
    user.value = await getUser(userId.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error loading user'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openDeleteModal = () => {
  if (!canDeleteViewedUser.value) return
  showDeleteModal.value = true
}

const handleDeleteConfirmed = async () => {
  showDeleteModal.value = false
  router.push('/admin/users')
}
</script>
