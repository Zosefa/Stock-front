import CryptoJS from "crypto-js";

const SECRET_KEY = `${import.meta.env.VITE_SECRET_KEY}`;

const crypto = {
    
  encrypt: (data) => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  },

  decrypt: (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

export default crypto;
