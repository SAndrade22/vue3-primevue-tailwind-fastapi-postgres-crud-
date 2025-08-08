export interface Client {
  id?: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  notes?: string
  is_active?: boolean
  created_at?: string
}