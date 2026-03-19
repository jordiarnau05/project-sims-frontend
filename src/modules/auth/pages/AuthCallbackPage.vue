<template>
  <div class="flex min-h-screen items-center justify-center bg-[#040b1f] px-6 text-center text-white">
    <div>
      <p class="text-lg font-semibold">Completing sign in...</p>
      <p v-if="errorMessage" class="mt-3 text-sm text-red-300">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { completeTenantRedirectLogin } = useAuth()
const errorMessage = ref('')

onMounted(async () => {
  const exchangeToken = String(route.query.exchange_token || '')
  const tenant = String(route.query.tenant || '')

  if (!exchangeToken || !tenant) {
    errorMessage.value = 'Missing authentication payload.'
    setTimeout(() => router.replace('/login'), 800)
    return
  }

  const ok = await completeTenantRedirectLogin(exchangeToken, tenant)
  if (ok) {
    await router.replace('/admin')
    return
  }

  errorMessage.value = 'Could not complete sign in.'
  setTimeout(() => router.replace('/login'), 1000)
})
</script>
