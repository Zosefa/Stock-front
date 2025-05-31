import api from './interceptor'

const createVente = async (data) => {
    const response = await api.post('/vente', data);
    return response.data;
};

const findVente = async () => {
   const response = await api.get('/vente');
   return response.data
}

const findVenteById = async (id) => {
   const response = await api.get(`/vente/${id}`);
   return response.data
}


export default { createVente, findVente, findVenteById };