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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  TablePagination,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import articleService from '../../services/articleService';
import fournisseurService from '../../services/fournisseurService';
import approvisionnementService from '../../services/approvisionnementService';

const Approvisionnement = () => {
  const [articles, setArticles] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [approvisionnement, setApprovisionnement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    articleId: '',
    fournisseurId: '',
    prixUnitaire: '',
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
  const fetchApprovisionnement = async () => {
    try {
      setLoading(true);
      const response = await approvisionnementService.findApprovisionnement();
      setApprovisionnement(response);
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

  const fetchFournisseur = async () => {
    try {
      setLoading(true);
      const response = await fournisseurService.findFournisseur();
      setFournisseurs(response);
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
    fetchFournisseur();
    fetchApprovisionnement();
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
          const response = await approvisionnementService.createApprovisionnement({
            ...formData,
            prixUnitaire: parseFloat(formData.prixUnitaire),
            qte: parseInt(formData.qte, 10),
          });
          setSnackbar({
            open: true,
            message: response,
            severity: 'success'
          });
        fetchApprovisionnement();
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
      fournisseurId: '',
      prixUnitaire: '',
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

  const paginatedTypes = approvisionnement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                  Gestion d'Approvisionnement
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModal}
                >
                  Faire un Approvisionnement
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
                            <TableCell>Fournisseur</TableCell>
                            <TableCell>Date d'insertion</TableCell>
                            <TableCell>Prix Unitaire</TableCell>
                            <TableCell>Qte</TableCell>
                            <TableCell>Montant</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {paginatedTypes.map((approvionnement) => (
                            <TableRow key={approvionnement.id}>
                            <TableCell>{approvionnement.article.article}</TableCell>
                            <TableCell>{approvionnement.fournisseur.nom}</TableCell>
                            <TableCell>
                                {new Date(approvionnement.createdAt).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(approvionnement.prixUnitaire)} Ar
                            </TableCell>

                            <TableCell>{approvionnement.qte}</TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(approvionnement.prixUnitaire * approvionnement.qte)} Ar
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
            <DialogTitle>Faire un Approvisionnement</DialogTitle>
            <DialogContent dividers>
            {/* Image Upload avec style amélioré */}

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Fournisseur"
                        name="fournisseurId"
                        value={formData.fournisseurId}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                        SelectProps={{ native: true }}
                    >
                        <option value="">-- Choisir un fournisseur --</option>
                        {fournisseurs.map((fournisseur) => (
                        <option key={fournisseur.id} value={fournisseur.id}>
                            {fournisseur.nom}
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
                    label="Prix Unitaire"
                    name="prixUnitaire"
                    value={formData.prixUnitaire}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                />
                </Grid>
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

export default Approvisionnement;