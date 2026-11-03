import { http } from './client';

// Shapes as backend/homeapi/serializers.py returns them today.
/**
 * @typedef {object} ApiStorageType
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {object} ApiResidence
 * @property {string} id
 * @property {string} name
 * @property {string} residence_type
 * @property {{ id: string, username: string, email: string, first_name: string, last_name: string }} owner
 */

/**
 * @typedef {object} ApiStorageArea
 * @property {string} id
 * @property {string} name
 * @property {string | null} description
 * @property {string} residence
 */

/**
 * @typedef {object} ApiStorageSpot
 * @property {string} id
 * @property {string} name
 * @property {string | null} parent
 * @property {ApiStorageArea} storage_area
 * @property {ApiStorageType} storage_type
 * @property {ApiStorageSpot[]} children
 * @property {string} primary_color
 * @property {string} secondary_color
 * @property {string} description
 * @property {string} qr_code_image_url
 */

/**
 * @typedef {object} ApiStorageItem
 * @property {string} id
 * @property {string} name
 * @property {string} brand
 * @property {number} count
 * @property {string} description
 * @property {ApiStorageSpot | null} storage_spot
 */

/**
 * What we send for an item. `storage_spot` is the spot's id: the serializer needs a
 * PrimaryKeyRelatedField for writes before create and move work against the API.
 *
 * @typedef {object} ApiItemWrite
 * @property {string} name
 * @property {string} brand
 * @property {number} count
 * @property {string} description
 * @property {string} storage_spot
 */

/**
 * Areas are flat in the serializer, so these writes work today.
 *
 * @typedef {object} ApiAreaWrite
 * @property {string} name
 * @property {string} description
 * @property {string} residence
 */

/**
 * Spots: storage_area and storage_type are nested serializers today, so create and
 * re-parent need the serializer to accept ids before they work against the API.
 *
 * @typedef {object} ApiSpotWrite
 * @property {string} name
 * @property {string | null} parent
 * @property {string} storage_area
 * @property {string} storage_type
 * @property {string} description
 */

const get = async (url) => (await http.get(url)).data;

export const api = {
  residences: () => get('/residences/'),
  areas: () => get('/storage-areas/'),
  spots: () => get('/storage-spots/'),
  items: () => get('/storage-items/'),
  types: () => get('/storage-types/'),
  createItem: async (body) => (await http.post('/storage-items/', body)).data,
  /** PATCH sends only what changed. A count-only PATCH works today; storage_spot needs the serializer fix. */
  updateItem: async (id, body) => (await http.patch(`/storage-items/${id}/`, body)).data,
  deleteItem: async (id) => {
    await http.delete(`/storage-items/${id}/`);
  },
  createArea: async (body) => (await http.post('/storage-areas/', body)).data,
  updateArea: async (id, body) => (await http.patch(`/storage-areas/${id}/`, body)).data,
  deleteArea: async (id) => {
    await http.delete(`/storage-areas/${id}/`);
  },
  createSpot: async (body) => (await http.post('/storage-spots/', body)).data,
  updateSpot: async (id, body) => (await http.patch(`/storage-spots/${id}/`, body)).data,
  deleteSpot: async (id) => {
    await http.delete(`/storage-spots/${id}/`);
  },
  createType: async (name) => (await http.post('/storage-types/', { name })).data,
  updateType: async (id, name) => (await http.patch(`/storage-types/${id}/`, { name })).data,
  /** The API protects types in use (on_delete=PROTECT); the app checks first. */
  deleteType: async (id) => {
    await http.delete(`/storage-types/${id}/`);
  },
};
