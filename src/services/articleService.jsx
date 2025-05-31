import api from './interceptor'

const createArticle = async (data) => {
  const response = await api.post('/article', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
const findArticle = async () => {
   const response = await api.get('/article');
   return response.data
}

const updateArticle = async (id,data) => {
   const response = await api.put(`/article/${id}`, data);
   return response.data;
};

const deleteArticle = async (id) => {
    const response = await api.delete(`/article/${id}`);
    return response.data;
};

export default { createArticle, findArticle, updateArticle, deleteArticle };