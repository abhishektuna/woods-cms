import API from "../../lib/axios";

const BASE = "/products";

export const productApi = {
  getAll: async () => {
    const res = await API.get(BASE);
    return res.data.data || res.data;
  },

  getById: async (id: string) => {
    const res = await API.get(`${BASE}/${id}`);
    return res.data.data || res.data;
  },

  create: async (data: any) => {
    const res = await API.post(BASE, data);
    return res.data.data || res.data;
  },

  update: async (id: string, data: any) => {
    const res = await API.patch(`${BASE}/${id}`, data);
    return res.data.data || res.data;
  },

  remove: async (id: string) => {
    await API.delete(`${BASE}/${id}`);
    return id;
  },
};
