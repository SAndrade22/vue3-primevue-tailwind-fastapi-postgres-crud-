<template>
  <div class="p-6 max-w-5xl mx-auto">
    <Toast />
    <ConfirmDialog />

    <div class="flex flex-col items-center mb-6">
      <div class="flex items-center gap-3 text-gray-800">
        <i class="pi pi-users text-3xl text-primary"></i>
        <h2 class="text-3xl font-bold">Gestión de Clientes</h2>
      </div>
      <p class="text-gray-500 mt-1 text-sm">Visualiza, agrega, edita o elimina clientes fácilmente</p>
    </div>


    <div class="flex justify-end mb-4">
      <Button label="Nuevo Cliente" icon="pi pi-plus" @click="showCreateDialog = true" />
    </div>


    <DataTable
      :value="clientStore.clients"
      paginator
      :rows="5"
      stripedRows
      class="p-datatable-sm shadow rounded-lg"
    >
      <Column field="first_name" header="Nombre" />
      <Column field="last_name" header="Apellido" />
      <Column field="email" header="Email" />
      <Column field="phone" header="Teléfono" />
      <Column field="company" header="Empresa" />
      <Column header="Acciones">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info"
              @click="editClient(slotProps.data)"
              aria-label="Editar"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="confirmDelete(slotProps.data)"
              aria-label="Eliminar"
            />
          </div>
        </template>
      </Column>
    </DataTable>


    <Dialog
      v-model:visible="showCreateDialog"
      modal
      header="Nuevo Cliente"
      :style="{ width: '30rem' }"
    >
      <ClientForm @saved="onClientSaved" @cancelled="showCreateDialog = false" />
    </Dialog>


    <Dialog
      v-model:visible="showEditDialog"
      modal
      header="Editar Cliente"
      :style="{ width: '30rem' }"
    >
      <ClientForm :client="selectedClient" @saved="onClientUpdated" @cancelled="showEditDialog = false" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useClientStore } from '@/stores/client'
  import type { Client } from '@/interfaces/client'
  import ClientForm from './ClientForm.vue'

  import Button from 'primevue/button'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Dialog from 'primevue/dialog'
  import Toast from 'primevue/toast'
  import ConfirmDialog from 'primevue/confirmdialog'
  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'

  const clientStore = useClientStore()
  const showCreateDialog = ref(false)
  const showEditDialog = ref(false)
  const selectedClient = ref<Client | null>(null)

  const toast = useToast()
  const confirm = useConfirm()

  clientStore.fetchClients()

  function editClient(client: Client) {
    selectedClient.value = { ...client }
    showEditDialog.value = true
  }

  function confirmDelete(client: Client) {
    if (!client.id) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'El cliente no tiene ID', life: 3000 })
      return
    }

    confirm.require({
      message: `¿Seguro que deseas eliminar a ${client.first_name} ${client.last_name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: async () => {
        await clientStore.deleteClient(client.id!)
        toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado', life: 3000 })
      }
    })
  }

  function onClientSaved() {
    showCreateDialog.value = false
    clientStore.fetchClients()
  }

  function onClientUpdated() {
    showEditDialog.value = false
    clientStore.fetchClients()
  }
</script>
