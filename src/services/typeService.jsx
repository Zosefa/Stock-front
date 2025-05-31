import api from './interceptor'

const createType = async (data) => {
    const response = await api.post('/type-article', data);
    return response.data;
};

const findType = async () => {
   const response = await api.get('/type-article');
   return response.data
}

const updateType = async (id,data) => {
   const response = await api.put(`/type-article/${id}`, data);
   return response.data;
};

const deleteType = async (id) => {
    const response = await api.delete(`/type-article/${id}`);
    return response.data;
};

export default { createType, findType, updateType, deleteType };