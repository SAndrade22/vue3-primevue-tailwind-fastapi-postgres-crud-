<template>
  <form @submit.prevent="saveClient" class="space-y-5">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <InputText v-model="form.first_name" class="w-full" />
        <small v-if="v$.form.first_name.$error" class="p-error text-xs">Nombre es obligatorio</small>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
        <InputText v-model="form.last_name" class="w-full" />
        <small v-if="v$.form.last_name.$error" class="p-error text-xs">Apellido es obligatorio</small>
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <InputText v-model="form.email" type="email" class="w-full" />
        <small v-if="v$.form.email.$error" class="p-error text-xs">
          {{ v$.form.email.required ? 'Email es obligatorio' : 'Formato inválido' }}
        </small>
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <InputText v-model="form.phone" class="w-full" />
      </div>


      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
        <InputText v-model="form.company" class="w-full" />
      </div>


      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
        <Textarea v-model="form.notes" :autoResize="true" rows="3" class="w-full" />
      </div>
    </div>


    <div class="flex items-center gap-2">
      <Checkbox v-model="form.is_active" :binary="true" inputId="activo" />
      <label for="activo" class="text-sm text-gray-700">Activo</label>
    </div>


    <div class="flex justify-end gap-2 pt-1">
      <Button label="Cancelar" class="p-button-text" @click="$emit('cancelled')" />
      <Button type="submit" label="Guardar" :disabled="v$.$invalid" />
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref, watch, defineProps, defineEmits, nextTick } from 'vue'
  import { useClientStore } from '@/stores/client'
  import type { Client } from '@/interfaces/client'

  import useVuelidate from '@vuelidate/core'
  import { required, email } from '@vuelidate/validators'
  //import axios from 'axios'

  const props = defineProps<{ client?: Client | null }>()
  const emit = defineEmits(['saved', 'cancelled'])

  const clientStore = useClientStore()

  const form = ref<Client>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    is_active: true,
  })

  const rules = {
    form: {
      first_name: { required },
      last_name: { required },
      email: { required, email },
      phone: {},
      company: {},
      notes: {},
      is_active: {},
    }
  }

  const v$ = useVuelidate(rules, { form })

  watch(() => props.client, (newClient) => {
    if (newClient) {
      form.value = { ...newClient }
    }
  }, { immediate: true })

  const saveClient = async () => {
    await v$.value.$validate()
    if (v$.value.$invalid) return

    if (props.client?.id) {
      await clientStore.updateClient(props.client.id, form.value)
    } else {
      await clientStore.createClient(form.value)
    }

    /* await axios.post('https://iapzazyhjdxhfae.form.io/clientform/submission', {
      data: {
        Nombre: form.value.first_name,
        Apellido: form.value.last_name,
        'Correo electrónico': form.value.email,
        Teléfono: form.value.phone,
        Dirección: form.value.company,
        Estado: form.value.is_active ? 'Activo' : 'Inactivo'
      }
    })*/

    await nextTick()
    emit('saved')
  }
</script>
