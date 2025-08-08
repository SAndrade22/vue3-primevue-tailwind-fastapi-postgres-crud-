import axios from 'axios'
import type { Client } from '@/interfaces/client'

const API_URL = 'http://localhost:8000/clients'

export const getClients = async (): Promise<Client[]> => {
  const response = await axios.get(API_URL)
  return response.data
}
