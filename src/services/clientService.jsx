import api from './interceptor'

const createClient = async (data) => {
    const response = await api.post('/client', data);
    return response.data;
};

const findClient = async () => {
   const response = await api.get('/client');
   return response.data
}

const updateClient = async (id,data) => {
   const response = await api.put(`/client/${id}`, data);
   return response.data;
};

const deleteClient = async (id) => {
    const response = await api.delete(`/client/${id}`);
    return response.data;
};

export default { createClient, findClient, updateClient, deleteClient };