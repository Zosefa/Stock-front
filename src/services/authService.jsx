import axios from "axios";
import crypto from "./crypto";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const authLogin = async (email, password, navigate) => {
  console.log(email,password)
  const response = await axios.post(`${API_URL}/login`, { email, password });
  console.log(response)
  if(response.data){

    console.log(response.data)
    const accessTokenCrypter = crypto.encrypt(response.data.accessToken);
    const refreshTokenCrypter = crypto.encrypt(response.data.refreshToken);

    sessionStorage.setItem("accessToken", accessTokenCrypter);
    sessionStorage.setItem("refreshToken", refreshTokenCrypter);
    sessionStorage.setItem("email", response.data.email);
    sessionStorage.setItem("username", response.data.username);
    sessionStorage.setItem("id", response.data.id);
    navigate('/admin');
  }
};

const registerService = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  const response = await axios.post(`${API_URL}/register`, formData, config);
  return response.data;
};

const infoUser = async (id) => {
  const response = await axios.get(`${API_URL}/info-user/${id}`);
  if(response.data){
    return response.data;
  }
};

const logout = async () => {
  const accessToken = crypto.decrypt(sessionStorage.getItem('accessToken'));
  const refreshToken = crypto.decrypt(sessionStorage.getItem('refreshToken'));
  const response = await axios.post(`${API_URL}/logout`, { refreshToken, accessToken });
  if(response.data){
    sessionStorage.clear();
  }
};

export default { authLogin, registerService, infoUser, logout };
