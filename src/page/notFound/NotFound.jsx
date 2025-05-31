// src/page/NotFound/NotFound.js
import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.scss';

const NotFound = () => {
  return (
    <Container className="not-found-container" maxWidth="xl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="content-box">
          <Typography variant="h1" className="title">
            404
          </Typography>
          <Typography variant="h4" className="subtitle">
            Page introuvable
          </Typography>
          <Typography variant="body1" className="message">
            Désolé, nous n'avons pas trouvé la page que vous recherchez.
          </Typography>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              className="home-button"
              component={Link}
              to="/"
              sx={{
                mt: 4,
                px: 6,
                py: 1.5,
                borderRadius: '50px',
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Retour à l'accueil
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default NotFound;