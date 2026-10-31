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

/**
 * What we send for an item. `storage_spot` is the spot's id: the serializer needs a
 * PrimaryKeyRelatedField for writes before create and move work against the API.
 */
export interface ApiItemWrite {
  name: string
  brand: string
  count: number
  description: string
  storage_spot: string
}

/** Areas are flat in the serializer, so these writes work today. */
export interface ApiAreaWrite {
  name: string
  description: string
  residence: string
}

/**
 * Spots: storage_area and storage_type are nested serializers today, so create and
 * re-parent need the serializer to accept ids before they work against the API.
 */
export interface ApiSpotWrite {
  name: string
  parent: string | null
  storage_area: string
  storage_type: string
  description: string
}

const get = async <T>(url: string) => (await http.get<T>(url)).data

export const api = {
  residences: () => get<ApiResidence[]>('/residences/'),
  areas: () => get<ApiStorageArea[]>('/storage-areas/'),
  spots: () => get<ApiStorageSpot[]>('/storage-spots/'),
  items: () => get<ApiStorageItem[]>('/storage-items/'),
  types: () => get<ApiStorageType[]>('/storage-types/'),
  createItem: async (body: ApiItemWrite) => (await http.post<ApiStorageItem>('/storage-items/', body)).data,
  /** PATCH sends only what changed. A count-only PATCH works today; storage_spot needs the serializer fix. */
  updateItem: async (id: string, body: Partial<ApiItemWrite>) => (await http.patch<ApiStorageItem>(`/storage-items/${id}/`, body)).data,
  deleteItem: async (id: string) => {
    await http.delete(`/storage-items/${id}/`)
  },
  createArea: async (body: ApiAreaWrite) => (await http.post<ApiStorageArea>('/storage-areas/', body)).data,
  updateArea: async (id: string, body: Partial<ApiAreaWrite>) => (await http.patch<ApiStorageArea>(`/storage-areas/${id}/`, body)).data,
  deleteArea: async (id: string) => {
    await http.delete(`/storage-areas/${id}/`)
  },
  createSpot: async (body: ApiSpotWrite) => (await http.post<ApiStorageSpot>('/storage-spots/', body)).data,
  updateSpot: async (id: string, body: Partial<ApiSpotWrite>) => (await http.patch<ApiStorageSpot>(`/storage-spots/${id}/`, body)).data,
  deleteSpot: async (id: string) => {
    await http.delete(`/storage-spots/${id}/`)
  },
  createType: async (name: string) => (await http.post<ApiStorageType>('/storage-types/', { name })).data,
  updateType: async (id: string, name: string) => (await http.patch<ApiStorageType>(`/storage-types/${id}/`, { name })).data,
  /** The API protects types in use (on_delete=PROTECT); the app checks first. */
  deleteType: async (id: string) => {
    await http.delete(`/storage-types/${id}/`)
  },
}
