import API from "../../lib/axios";

const BASE = "/product-tire-keys";

export const productTireKeyApi = {
  getAll: async () => {
    const res = await API.get(BASE);
    return res.data.data || res.data;
  },
};
