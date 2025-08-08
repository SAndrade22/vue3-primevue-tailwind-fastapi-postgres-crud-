import { defineStore } from 'pinia'
import axios from '@/services/axios.ts'
import type { Client } from '@/interfaces/client'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[],
  }),
  actions: {
    async fetchClients() {
      const res = await axios.get('/clients/')
      this.clients = res.data
    },
    async createClient(client: Omit<Client, 'id' | 'created_at'>) {
      const res = await axios.post('/clients/', client)
      this.clients.push(res.data)
    },
    async updateClient(id: number, client: Partial<Client>) {
      const res = await axios.put(`/clients/${id}/`, client)
      const index = this.clients.findIndex(c => c.id === id)
      if (index !== -1) this.clients[index] = res.data
    },
    async deleteClient(id: number) {
      await axios.delete(`/clients/${id}/`)
      this.clients = this.clients.filter(c => c.id !== id)
    },
  },
})
