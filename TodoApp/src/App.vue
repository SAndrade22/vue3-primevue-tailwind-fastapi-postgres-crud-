<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">

    <nav class="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-6 text-lg font-semibold text-gray-800">
        <i class="pi pi-users text-blue-600 text-xl"></i>
        <router-link to="/" class="hover:text-blue-600 transition-colors duration-200">Inicio</router-link>
        <router-link to="/todo" class="hover:text-blue-600 transition-colors duration-200">ToDo App</router-link>
      </div>
    </nav>


    <main class="flex flex-col items-center px-6 py-10 max-w-7xl w-full mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
