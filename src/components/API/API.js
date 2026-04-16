import { supabase } from '../../supabase-client.js';
const API = {
  get: async (endpoint, query = '*', filters = []) => {
    let supabaseQuery = supabase.from(endpoint).select(query);

    filters.forEach(({ type, column, value }) => {
      if (type === 'ilike') {
        supabaseQuery = supabaseQuery.ilike(column, `%${value}%`);
      } else if (type === 'eq') {
        supabaseQuery = supabaseQuery.eq(column, value);
      } else if (type === 'in') {
        supabaseQuery = supabaseQuery.in(column, value);
      }
    });

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error(error);
      return { isSuccess: false, result: [] };
    }

    return { isSuccess: true, result: data };
  },
  post: async (endpoint, payload) => {
    const { data, error } = await supabase.from(endpoint).insert(payload);

    if (error) {
      console.error(error);
      return { isSuccess: false, result: [] };
    }

    return { isSuccess: true, result: data };
  },
};
export default API;
