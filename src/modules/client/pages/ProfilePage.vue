<template>
  <div class="min-h-screen bg-gray-900 text-white px-4 py-8">
    <div class="mx-auto max-w-2xl">

      <div class="mb-8">
        <h1 class="text-2xl font-bold">{{ m.profile.title }}</h1>
        <p class="mt-1 text-sm text-gray-400">{{ m.profile.subtitle }}</p>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>

      <template v-else-if="user">

        <div class="flex items-center gap-4 mb-8">
          <span class="size-16 rounded-full bg-indigo-700 flex items-center justify-center text-2xl font-bold">
            {{ initials }}
          </span>
          <div>
            <p class="text-lg font-semibold">{{ user.name }}</p>
            <p class="text-sm text-gray-400">@{{ user.username }}</p>
            <span
              :class="user.active
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'"
              class="inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium"
            >
              {{ user.active ? m.profile.active : m.profile.inactive }}
            </span>
          </div>
        </div>

        <section class="rounded-xl bg-gray-800/60 border border-white/5 p-6 mb-6">
          <h2 class="text-base font-semibold mb-5">{{ m.profile.personalInfo }}</h2>

          <form @submit.prevent="submitProfile" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">{{ m.profile.fullName }}</label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  required
                  class="input-field"
                  :placeholder="m.profile.fullName"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">{{ m.profile.username }}</label>
                <input
                  v-model="profileForm.username"
                  type="text"
                  required
                  class="input-field"
                  :placeholder="m.profile.username"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-1">{{ m.profile.email }}</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="savingProfile"
                class="btn-primary"
              >
                <svg v-if="savingProfile" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {{ savingProfile ? m.profile.saving : m.profile.saveChanges }}
              </button>
            </div>
          </form>
        </section>

        <section class="rounded-xl bg-gray-800/60 border border-white/5 p-6">
          <h2 class="text-base font-semibold mb-5">{{ m.profile.changePassword }}</h2>

          <form @submit.prevent="submitPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">{{ m.profile.newPassword }}</label>
              <input
                v-model="passwordForm.password"
                type="password"
                required
                minlength="8"
                class="input-field"
                :placeholder="m.profile.newPasswordPlaceholder"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">{{ m.profile.confirmPassword }}</label>
              <input
                v-model="passwordForm.password_confirmation"
                type="password"
                required
                minlength="8"
                class="input-field"
                :placeholder="m.profile.confirmPasswordPlaceholder"
              />
              <p v-if="passwordMismatch" class="mt-1 text-xs text-red-400">{{ m.profile.mismatch }}</p>
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="savingPassword || passwordMismatch"
                class="btn-primary"
              >
                <svg v-if="savingPassword" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {{ savingPassword ? m.profile.updating : m.profile.updatePassword }}
              </button>
            </div>
          </form>
        </section>
        
        <!-- Danger Zone / Logout for mobile -->
        <section class="mt-12 pt-8 border-t border-white/10 text-center">
          <button
            type="button"
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            {{ m.userMenu.signOut }}
          </button>
        </section>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { useUsers } from '@/modules/admin/modules/users/composables/useUsers'
import { useToast } from '@/modules/common/composables/useToast'

const { m } = useI18n()
const router = useRouter()
const { user, fetchUser, logout } = useAuth()
const { updateUser } = useUsers()
const toast = useToast()

const loading = ref(false)
const savingProfile = ref(false)
const savingPassword = ref(false)

const profileForm = reactive({ name: '', username: '', email: '' })
const passwordForm = reactive({ password: '', password_confirmation: '' })

const initials = computed(() => {
  return (user.value?.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const handleLogout = async () => {
  try {
    await logout()
    toast.success(m.value.userMenu.loggedOut)
  } catch {
    //
  } finally {
    router.push('/login')
  }
}

const passwordMismatch = computed(() =>
  !!passwordForm.password_confirmation && passwordForm.password !== passwordForm.password_confirmation
)

onMounted(async () => {
  loading.value = true
  await fetchUser()
  if (user.value) {
    profileForm.name = user.value.name
    profileForm.username = user.value.username
    profileForm.email = user.value.email
  }
  loading.value = false
})

const submitProfile = async () => {
  if (!user.value) return
  savingProfile.value = true
  try {
    await updateUser(user.value.id, {
      name: profileForm.name,
      username: profileForm.username,
      email: profileForm.email,
      active: user.value.active,
    })
    await fetchUser()
    toast.success(m.value.profile.profileUpdated)
  } catch (err: any) {
    toast.error(err.response?.data?.message || m.value.profile.profileError)
  } finally {
    savingProfile.value = false
  }
}

const submitPassword = async () => {
  if (!user.value || passwordMismatch.value) return
  savingPassword.value = true
  try {
    await updateUser(user.value.id, {
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
      active: user.value.active,
    })
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
    toast.success(m.value.profile.passwordUpdated)
  } catch (err: any) {
    toast.error(err.response?.data?.message || m.value.profile.passwordError)
  } finally {
    savingPassword.value = false
  }
}
</script>

<style scoped>
.input-field {
  display: block;
  width: 100%;
  border-radius: 0.5rem;
  border: none;
  background-color: rgba(55, 65, 81, 0.6);
  padding: 0.5rem 0.75rem;
  color: #fff;
  font-size: 0.875rem;
  outline: 1px solid rgba(255,255,255,0.1);
}
.input-field::placeholder { color: #6b7280; }
.input-field:focus {
  outline: 2px solid #6366f1;
  outline-offset: 0;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: #4f46e5;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  transition: background-color 0.15s;
  cursor: pointer;
}
.btn-primary:hover { background-color: #6366f1; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>