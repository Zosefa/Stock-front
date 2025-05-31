import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  TablePagination
} from '@mui/material';
import { 
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import articleService from '../../services/articleService';
import clientService from '../../services/clientService';
import venteService from '../../services/venteService';

const Vente = () => {
  const [articles, setArticles] = useState([]);
  const [clients, setClients] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    articleId: '',
    clientId: '',
    qte: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch all article
  const fetchVente = async () => {
    try {
      setLoading(true);
      const response = await venteService.findVente();
      setVentes(response);
    } catch (error) {
      console.error('Error fetching types:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des types',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientService.findClient();
      setClients(response);
    } catch (error) {
      console.error('Error fetching types:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des types',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.findArticle();
      setArticles(response);
    } catch (error) {
      console.error('Error fetching types:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des types',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchClient();
    fetchVente();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          // Create new type
          const response = await venteService.createVente({
            ...formData,
            qte: parseInt(formData.qte, 10),
          });
          if(response.status === false ){
            setSnackbar({
                open: true,
                message: response.msg,
                severity: 'error'
            });
          }else{
            setSnackbar({
                open: true,
                message: response,
                severity: 'success'
            });
          }
        fetchVente();
        handleCloseModal();
      } catch (error) {
        console.error('Error saving type:', error);
        setSnackbar({
          open: true,
          message: 'Erreur lors de la sauvegarde',
          severity: 'error'
        });
      }
    };

  // Open create modal
  const handleOpenModal = () => {
    setFormData({
      articleId: '',
      clientId: '',
      qte: ''
    });
    setOpenModal(true);
  };

  // Close all modals
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTypes = ventes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ flexGrow: 1, p: 3, width: '100%' }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Card elevation={3} sx={{ width: '100%' }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5" component="h2">
                  Gestion de vente
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModal}
                >
                  Enregistrer une Vente
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="types table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Article</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Date de vente</TableCell>
                            <TableCell>Prix Unitaire</TableCell>
                            <TableCell>Qte</TableCell>
                            <TableCell>Montant</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {paginatedTypes.map((vente) => (
                            <TableRow key={vente.id}>
                            <TableCell>{vente.article.article}</TableCell>
                            <TableCell>{vente.client.nom}</TableCell>
                            <TableCell>
                                {new Date(vente.createdAt).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(vente.article.prixUnitaire)} Ar
                            </TableCell>

                            <TableCell>{vente.qte}</TableCell>

                            <TableCell>
                                {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(vente.article.prixUnitaire * vente.qte)} Ar
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={articles.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Lignes par page"
                    />
                    </TableContainer>

              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Type Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
            <DialogTitle>Enregister une vente</DialogTitle>
            <DialogContent dividers>
            {/* Image Upload avec style amélioré */}

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Client"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        SelectProps={{ native: true }}
                    >
                        <option value="">-- Choisir un client --</option>
                        {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.nom}
                        </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Article"
                        name="articleId"
                        value={formData.articleId}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        SelectProps={{ native: true }}
                    >
                        <option value="">-- Choisir un article --</option>
                        {articles.map((article) => (
                        <option key={article.id} value={article.id}>
                            {article.article}
                        </option>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Qte"
                    name="qte"
                    value={formData.qte}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                />
                </Grid>
            </Grid>

            </DialogContent>
            <DialogActions>
            <Button
                onClick={handleCloseModal}
                startIcon={<CloseIcon />}
            >
                Annuler
            </Button>
            <Button
                type="submit"
                color="primary"
                variant="contained"
                startIcon={<CheckIcon />}
            >
                Enregistrer
            </Button>
            </DialogActions>
        </form>
        </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Vente;