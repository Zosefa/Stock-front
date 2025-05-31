import api from './interceptor'

const findStock = async () => {
   const response = await api.get('/stock');
   return response.data
}

export default { findStock };