import React, { useState, useRef } from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Box,
  Avatar
} from "@mui/material";
import { 
  EmailOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff,
  PersonOutline,
  AddAPhoto
} from "@mui/icons-material";
import "./register.scss";
import authService from "../../services/authService";
import Toast from "../../components/Toast/Toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setToast({
        message: "Veuillez sélectionner une image",
        type: "error",
        duration: 5000
      });
      return;
    }

    if(password !== confirm){
      setToast({
        message: "Verifier bien votre mot de passe",
        type: "error",
        duration: 5000
      });
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('image', image);

    try {
      await authService.registerService(formData);
      setToast({
        message: "Inscription réussie! Redirection en cours...",
        type: "success",
        duration: 3000
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Inscription échouée. Veuillez réessayer.";
      setToast({
        message: errorMessage,
        type: "error",
        duration: 5000
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <Paper elevation={0} className="login-card">
        <Box className="login-header">
          <Typography variant="h4" className="login-title">
            Bienvenue
          </Typography>
          <Typography variant="subtitle1" className="login-subtitle">
            Créer votre compte
          </Typography>
        </Box>

        <form onSubmit={handleRegister} className="login-form">
          {/* Champ image */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <IconButton onClick={triggerFileInput}>
              <Avatar 
                src={imagePreview} 
                sx={{ 
                  width: 80, 
                  height: 80,
                  bgcolor: imagePreview ? 'transparent' : 'action.active'
                }}
              >
                {!imagePreview && <AddAPhoto fontSize="large" />}
              </Avatar>
            </IconButton>
          </Box>

          <TextField
            label="Adresse email"
            variant="filled"
            fullWidth
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              disableUnderline: true
            }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            label="Nom d'utilisateur"
            variant="filled"
            fullWidth
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputProps={{
              disableUnderline: true
            }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            variant="filled"
            fullWidth
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              disableUnderline: true
            }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            label="Confirmer"
            type={showConfirm ? "text" : "password"}
            variant="filled"
            fullWidth
            className="input-field"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm(!showPassword)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              disableUnderline: true
            }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            className="login-button"
            size="large"
          >
            S'inscrire
          </Button>

          <Divider className="login-divider">ou</Divider>

          <Box className="login-footer">
            <Typography variant="body2">
              Déjà un compte ? <a href="/login" className="login-link">Se connecter</a>
            </Typography>
          </Box>
        </form>
      </Paper>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Register;