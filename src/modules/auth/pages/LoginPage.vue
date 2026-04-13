<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/logo/logo-white.svg" alt="Fleetly" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="tenant" class="block text-sm/6 font-medium text-gray-100">Organization</label>
          <div class="mt-2">
            <input
              id="tenant"
              v-model="tenantSlug"
              type="text"
              autocomplete="organization"
              required
              placeholder="your-company-slug"
              :disabled="isLoading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
          <div class="mt-2">
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              :disabled="isLoading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
          </div>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              :disabled="isLoading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div v-if="error" class="text-sm text-red-400">Error: {{ error }}</div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <p class="text-center text-sm text-gray-400">
          Don't have an account?
          <RouterLink to="/register" class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">Register</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, isLoading, error } = useAuth()

const tenantSlug = ref('')
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  const success = await login(tenantSlug.value, email.value, password.value)
  
  if (success) {
    router.push('/admin')
  }
}
</script>
