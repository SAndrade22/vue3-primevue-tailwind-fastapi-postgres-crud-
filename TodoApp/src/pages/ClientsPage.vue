<template>
  <div class="w-full px-6 pt-8">


    <div class="bg-white shadow-sm rounded-xl border border-gray-100 p-5 mb-6 flex items-center justify-between">
      <div>
        <div class="text-sm text-gray-500 flex items-center gap-2">
          <span>👋 Bienvenido</span><span class="text-gray-300">|</span><span>Panel de clientes</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mt-1">Gestión de Clientes</h1>
        <p class="text-gray-500 text-sm mt-1">Esta pagina tiene su respectivo CRUD.</p>
      </div>

      <div class="flex items-center gap-2">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="globalFilter" placeholder="Buscar..." class="w-56" />
        </span>
        <Button icon="pi pi-download" label="Exportar" class="p-button-text" @click="exportCSV" />
        <Button icon="pi pi-plus" label="Nuevo Cliente" class="p-button-success" @click="showCreateDialog = true" />
      </div>
    </div>


    <div
      v-if="selectedClients.length"
      class="bg-white border border-blue-100 rounded-lg px-4 py-3 mb-3 flex items-center justify-between"
    >
      <div class="text-sm text-blue-700">
        <b>{{ selectedClients.length }}</b> seleccionado(s)
      </div>
      <div class="flex gap-2">
        <Button size="small" class="p-button-success p-button-outlined" icon="pi pi-check"
                label="Activar" @click="bulkSetActive(true)" />
        <Button size="small" class="p-button-warning p-button-outlined" icon="pi pi-ban"
                label="Inactivar" @click="bulkSetActive(false)" />
        <Button size="small" class="p-button-secondary p-button-outlined" icon="pi pi-download"
                label="Exportar selección" @click="exportSelectedCSV" />
        <Button size="small" class="p-button-danger" icon="pi pi-trash"
                label="Eliminar selección" @click="bulkDelete" />
      </div>
    </div>


    <DataTable
      ref="dt"
      :value="clients"
      paginator
      :rows="pageSize"
      :rowsPerPageOptions="[5,10,15,20,50]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      class="shadow rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
      :loading="loading"
      dataKey="id"
      :globalFilterFields="['first_name','last_name','email','phone','company']"
      :filters="{ 'global': { value: globalFilter, matchMode: 'contains' } }"
      v-model:selection="selectedClients"
      stripedRows
      showGridlines
      responsiveLayout="scroll"
    >

      <template #empty>
        <div class="text-center text-gray-500 py-8">No hay clientes.</div>
      </template>
      <template #loading> Cargando clientes… </template>


      <Column selectionMode="multiple" headerStyle="width:3rem" />

      <Column field="first_name" header="Nombre" sortable />
      <Column field="last_name" header="Apellido" sortable />
      <Column field="email" header="Correo electrónico" sortable />
      <Column field="phone" header="Teléfono" />
      <Column field="company" header="Empresa" sortable />

      <!-- ✅ NUEVA COLUMNA: ESTADO (Activo / Inactivo) -->
      <Column field="is_active" header="Estado" style="width: 120px; text-align: center;">
        <template #body="{ data }">
          <Tag
            :value="data.is_active ? 'Activo' : 'Inactivo'"
            :severity="data.is_active ? 'success' : 'danger'"
            rounded
          />
        </template>
      </Column>
      <!-- /FIN COLUMNA ESTADO -->

      <Column header="Etiquetas">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-2">
            <Tag
              v-for="(t, idx) in getTags(data.id)"
              :key="idx"
              :value="t"
              :severity="tagSeverity(t)"
              rounded
            />
            <span v-if="getTags(data.id).length === 0" class="text-gray-400 text-sm">—</span>
          </div>
        </template>
      </Column>

      <Column header="Acciones" style="width: 140px;">
        <template #body="{ data }">
          <div class="flex gap-2 justify-end">
            <Button icon="pi pi-tags" class="p-button-rounded p-button-help p-button-text"
              @click="openTags(data)" />
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-button-text"
              @click="editClient(data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
              @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
    </DataTable>


    <Dialog v-model:visible="showCreateDialog" modal header="Nuevo Cliente" :style="{ width: '40vw' }">
      <ClientForm @saved="handleClientSaved" @cancelled="showCreateDialog = false" />
    </Dialog>


    <Dialog v-model:visible="showEditDialog" modal header="Editar Cliente" :style="{ width: '40vw' }">
      <ClientForm :client="selectedClient" @saved="handleClientUpdated" @cancelled="showEditDialog = false" />
    </Dialog>


    <Dialog v-model:visible="showTagsDialog" modal header="Etiquetas del cliente" :style="{ width: '32rem' }">
      <div class="space-y-4">
        <div class="text-sm text-gray-600">
          Agrega o quita etiquetas. Se guardan localmente (no requieren cambios en backend).
        </div>
        <Chips v-model="editingTags" separator="," placeholder="Escribe y presiona Enter" />
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" class="p-button-text" @click="showTagsDialog = false" />
          <Button label="Guardar" class="p-button-primary" @click="saveTags" />
        </div>
      </div>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'

  import InputText from 'primevue/inputtext'
  import Tag from 'primevue/tag'
  import Chips from 'primevue/chips'

  import { getClients as apiGetClients } from '@/services/clients'
  import type { Client } from '@/interfaces/client'
  import ClientForm from '@/components/ClientForm.vue'
  import { useClientTagsStore } from '@/stores/clientTags'
  import { useClientStore } from '@/stores/client'

  const dt = ref()
  const clients = ref<Client[]>([])
  const loading = ref(true)
  const globalFilter = ref('')
  const pageSize = ref(15)

  const selectedClients = ref<Client[]>([])

  const showCreateDialog = ref(false)
  const showEditDialog = ref(false)
  const selectedClient = ref<Client | null>(null)

  const showTagsDialog = ref(false)
  const editingTags = ref<string[]>([])
  const editingClientId = ref<number | null>(null)

  const toast = useToast()
  const confirm = useConfirm()
  const tagsStore = useClientTagsStore()
  const store = useClientStore()

  tagsStore.load()

  const load = async () => {
    loading.value = true
    try {
      clients.value = await apiGetClients()
    } finally {
      loading.value = false
    }
  }

  onMounted(load)


  function editClient(client: Client) {
    selectedClient.value = { ...client }
    showEditDialog.value = true
  }
  async function handleClientSaved() {
    showCreateDialog.value = false
    await load()
    toast.add({ severity: 'success', summary: 'Guardado', detail: 'Cliente creado', life: 2500 })
  }
  async function handleClientUpdated() {
    showEditDialog.value = false
    await load()
    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Cliente actualizado', life: 2500 })
  }
  function confirmDelete(client: Client) {
    if (!client.id) return
    confirm.require({
      message: `¿Eliminar a ${client.first_name} ${client.last_name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: async () => {
        await store.deleteClient(client.id!)
        toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado', life: 2500 })
        await load()
      }
    })
  }


  function exportCSV() {
    (dt.value as any)?.exportCSV()
  }
  function exportSelectedCSV() {
    (dt.value as any)?.exportCSV({ selectionOnly: true })
  }


  function getTags(id?: number) {
    return tagsStore.getTags(id)
  }
  function openTags(client: Client) {
    if (!client.id) return
    editingClientId.value = client.id
    editingTags.value = [...tagsStore.getTags(client.id)]
    showTagsDialog.value = true
  }
  function saveTags() {
    if (!editingClientId.value) return
    tagsStore.setTags(editingClientId.value, editingTags.value)
    showTagsDialog.value = false
    toast.add({ severity: 'success', summary: 'Etiquetas', detail: 'Etiquetas guardadas', life: 2000 })
  }
  function tagSeverity(tag: string) {
    const t = tag.toLowerCase()
    if (['vip','premium','clave','top'].some(k => t.includes(k))) return 'warning'
    if (['moroso','bloqueado','riesgo'].some(k => t.includes(k))) return 'danger'
    if (['nuevo','trial','lead'].some(k => t.includes(k))) return 'info'
    return 'success'
  }


  async function bulkSetActive(active: boolean) {
    if (!selectedClients.value.length) return
    const verbo = active ? 'activar' : 'inactivar'
    confirm.require({
      message: `¿Deseas ${verbo} ${selectedClients.value.length} cliente(s)?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: async () => {
        const ops = selectedClients.value
          .filter(c => c.id)
          .map(c => store.updateClient(c.id!, { is_active: active }))
        await Promise.all(ops)
        await load()
        selectedClients.value = []
        toast.add({ severity: 'success', summary: 'Listo', detail: `Clientes ${verbo}dos`, life: 2200 })
      }
    })
  }

  async function bulkDelete() {
    if (!selectedClients.value.length) return
    confirm.require({
      message: `¿Eliminar ${selectedClients.value.length} cliente(s)?`,
      header: 'Eliminar selección',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: async () => {
        const ops = selectedClients.value
          .filter(c => c.id)
          .map(c => store.deleteClient(c.id!))
        await Promise.all(ops)
        await load()
        selectedClients.value = []
        toast.add({ severity: 'success', summary: 'Eliminados', detail: 'Selección eliminada', life: 2200 })
      }
    })
  }
</script>

<style scoped>
</style>
