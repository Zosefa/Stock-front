import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Box
} from "@mui/material";
import { 
  EmailOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff 
} from "@mui/icons-material";
import "./login.scss";
import authService  from "../../services/authService";
import Toast from "../../components/Toast/Toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.authLogin(email, password, navigate);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Identifiants incorrects. Veuillez réessayer.";
      setToast({
        message: errorMessage,
        type: "error",
        duration: 5000
      });
    }
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
            Connectez-vous à votre compte
          </Typography>
        </Box>

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            label="Adresse email"
            variant="filled"
            fullWidth
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            className="login-button"
            size="large"
          >
            Se connecter
          </Button>

          <Divider className="login-divider">ou</Divider>

          <Box className="login-footer">
            <Typography variant="body2">
              Nouveau ici ? <a href="/register" className="login-link">Créer un compte</a>
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

export default Login;