import { http } from './client';

// Requests and responses use the shapes in ../models.js.
const get = async (url) => (await http.get(url)).data;

export const api = {
  residences: () => get('/residences/'),
  locations: (residence) => get(`/locations/?residence=${residence}`),
  items: (residence) => get(`/storage-items/?residence=${residence}`),
  types: () => get('/storage-types/'),
  /** `event` on an item write is a history line saved with the change. */
  createItem: async (body) => (await http.post('/storage-items/', body)).data,
  /** PATCH sends only what changed. */
  updateItem: async (id, body) => (await http.patch(`/storage-items/${id}/`, body)).data,
  deleteItem: async (id) => {
    await http.delete(`/storage-items/${id}/`);
  },
  createLocation: async (body) => (await http.post('/locations/', body)).data,
  updateLocation: async (id, body) => (await http.patch(`/locations/${id}/`, body)).data,
  /** The API refuses (409) while items are inside; the app checks first. */
  deleteLocation: async (id) => {
    await http.delete(`/locations/${id}/`);
  },
  createType: async (name) => (await http.post('/storage-types/', { name })).data,
  updateType: async (id, name) => (await http.patch(`/storage-types/${id}/`, { name })).data,
  /** The API refuses (409) while a location uses the type; the app checks first. */
  deleteType: async (id) => {
    await http.delete(`/storage-types/${id}/`);
  },
};
