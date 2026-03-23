<template>
  <div class="min-h-screen bg-gray-900 text-white px-4 py-8">
    <h1 class="text-2xl font-bold mb-2">{{ m.clientUi.favoritesTitle }}</h1>
    <p class="text-gray-400">
      {{ m.clientUi.notImplemented }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'
const { m } = useI18n()
// TODO: Implementar la pàgina de vehicles favorits
// - Llistar vehicles marcats com a favorits
// - Afegir / eliminar favorits
// - Accés ràpid per fer una nova reserva des d'un favorit
</script>
