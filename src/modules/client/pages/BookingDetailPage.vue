<template>
  <div class="min-h-screen bg-gray-900 text-white px-4 py-8">
    <h1 class="text-2xl font-bold mb-2">{{ m.clientUi.bookingDetailTitle }}</h1>
    <p class="text-gray-400">
      {{ m.clientUi.notImplemented }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'
const { m } = useI18n()
// TODO: Implementar el detall d'una reserva de l'usuari final
// - Mostrar info de la reserva (GET /reservations/:id)
// - Mostrar estat, vehicle, durada, preu
// - Accions depenent de l'estat: activar, finalitzar, cancel·lar
</script>
