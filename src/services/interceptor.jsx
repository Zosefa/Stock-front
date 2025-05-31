import axios from 'axios';
import crypto from './crypto';

const API_URL = `${import.meta.env.VITE_API_URL}`;

const interceptorsAPI = axios.create({
  baseURL: API_URL,
});

// Intercepte chaque requête pour ajouter le token
interceptorsAPI.interceptors.request.use(
  (config) => {
    const encryptedToken = sessionStorage.getItem('accessToken');
    if (encryptedToken) {
      try {
        const token = crypto.decrypt(encryptedToken);
        config.headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Erreur de décryptage du token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepte les réponses
interceptorsAPI.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Vérifie si l'erreur est due à un token expiré/invalide
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      const encryptedRefreshToken = sessionStorage.getItem('refreshToken');

      if (!encryptedRefreshToken) {
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Décrypte le refresh token
        const refreshToken = crypto.decrypt(encryptedRefreshToken);
        console.log('eto')
        
        // Demande un nouveau access token
        const response = await axios.post(`${API_URL}/refreshToken`, {
          refreshToken
        });

        console.log(response.data)

        if (response.data.accessToken) {
          // Crypte et stocke le nouveau token
          const newAccessToken = response.data.accessToken;
          const encryptedToken = crypto.encrypt(newAccessToken);
          
          // Stocke avec la bonne clé ('accessToken' et non 'token')
          sessionStorage.setItem('accessToken', encryptedToken);

          // Met à jour le header et réessaie la requête
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return interceptorsAPI(originalRequest);
        }
      } catch (refreshError) {
        console.error("Erreur lors du refresh token:", refreshError);
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Pour les autres erreurs
    return Promise.reject(error);
  }
);

export default interceptorsAPI;