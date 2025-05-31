import api from './interceptor'

const createFournisseur = async (data) => {
    const response = await api.post('/fournisseur', data);
    return response.data;
};

const findFournisseur = async () => {
   const response = await api.get('/fournisseur');
   return response.data
}

const updateFournisseur = async (id,data) => {
   const response = await api.put(`/fournisseur/${id}`, data);
   return response.data;
};

const deleteFournisseur = async (id) => {
    const response = await api.delete(`/fournisseur/${id}`);
    return response.data;
};

export default { createFournisseur, findFournisseur, updateFournisseur, deleteFournisseur };