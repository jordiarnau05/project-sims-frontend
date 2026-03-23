<template>
  <Modal :show="visible" @close="onCancel">
    <template #header>
      <h3 class="text-lg font-medium">{{ title }}</h3>
    </template>

    <div>
      <p>{{ message }}</p>
    </div>

    <template #footer>
      <button @click="onCancel" class="mr-2">{{ m.commonUi.cancel }}</button>
      <button @click="onConfirm" class="bg-red-600 text-white px-3 py-1 rounded">{{ m.commonUi.confirm }}</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import { useI18n } from '@/i18n'

const { m } = useI18n()

const props = defineProps<{
  visible: boolean
  title?: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() { emit('confirm') }
function onCancel() { emit('cancel') }
</script>

<style scoped>
button { padding:6px 10px; border-radius:6px }
</style>
