<template>
  <Menubar :model="items" class="shadow-md">
    <template #start>
      <div class="text-xl font-bold text-gray-700 px-4">Gestión de Clientes</div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Menubar from 'primevue/menubar'

const items = ref([
  {
    label: 'Inicio',
    icon: 'pi pi-home',
    to: '/'
  },
  {
    label: 'ToDo App',
    icon: 'pi pi-check-square',
    to: '/todo'
  }
])
</script>
