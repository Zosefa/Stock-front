import api from './interceptor'

const createApprovisionnement = async (data) => {
    const response = await api.post('/approvisionnement', data);
    return response.data;
};

const findApprovisionnement = async () => {
   const response = await api.get('/approvisionnement');
   return response.data
}

const findApprovisionnementById = async (id) => {
   const response = await api.get(`/approvisionnement/${id}`);
   return response.data
}


export default { createApprovisionnement, findApprovisionnement, findApprovisionnementById };