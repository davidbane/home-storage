import { http } from './client'

// Shapes as backend/homeapi/serializers.py returns them today.

export interface ApiStorageType {
  id: string
  name: string
}

export interface ApiResidence {
  id: string
  name: string
  residence_type: string
  owner: { id: string; username: string; email: string; first_name: string; last_name: string }
}

export interface ApiStorageArea {
  id: string
  name: string
  description: string | null
  residence: string
}

export interface ApiStorageSpot {
  id: string
  name: string
  parent: string | null
  storage_area: ApiStorageArea
  storage_type: ApiStorageType
  children: ApiStorageSpot[]
  primary_color: string
  secondary_color: string
  description: string
  qr_code_image_url: string
}

export interface ApiStorageItem {
  id: string
  name: string
  brand: string
  count: number
  description: string
  storage_spot: ApiStorageSpot | null
}

const get = async <T>(url: string) => (await http.get<T>(url)).data

export const api = {
  residences: () => get<ApiResidence[]>('/residences/'),
  areas: () => get<ApiStorageArea[]>('/storage-areas/'),
  spots: () => get<ApiStorageSpot[]>('/storage-spots/'),
  items: () => get<ApiStorageItem[]>('/storage-items/'),
  types: () => get<ApiStorageType[]>('/storage-types/'),
  /** Only the count changes, so the nested storage_spot isn't sent (DRF can't write it yet). */
  setItemCount: async (id: string, count: number) => (await http.patch<ApiStorageItem>(`/storage-items/${id}/`, { count })).data,
}
