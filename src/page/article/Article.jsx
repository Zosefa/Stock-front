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
import typeService from '../../services/typeService';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [formData, setFormData] = useState({
    article: '',
    prixUnitaire: '',
    description: '',
    typeId: '',
    image: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const IMAGE_ARTICLE_URL = `${import.meta.env.VITE_IMAGE_ARTICLE_URL}`;

  // Fetch all article
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

  const fetchType = async () => {
    try {
      setLoading(true);
      const response = await typeService.findType();
      setTypes(response);
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
    fetchType();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentType) {
        // Update existing type
        const data = new FormData();
        data.append('article', formData.article);
        data.append('prixUnitaire', formData.prixUnitaire);
        data.append('description', formData.description);
        data.append('typeId', formData.typeId);
        if (formData.image) data.append('image', formData.image);
        const response = await articleService.createArticle(data);
        setSnackbar({
          open: true,
          message: response,
          severity: 'success'
        });
      } else {
        // Create new type
        const data = new FormData();
        data.append('article', formData.article);
        data.append('prixUnitaire', formData.prixUnitaire);
        data.append('description', formData.description);
        data.append('typeId', formData.typeId);
        if (formData.image) data.append('image', formData.image);
        const response = await articleService.createArticle(data);
        setSnackbar({
          open: true,
          message: response,
          severity: 'success'
        });
      }
      fetchArticle();
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

  // Handle edit button click
  const handleEdit = (article) => {
    setCurrentType(article);
    setFormData({
      article: article.article,
      prixUnitaire: article.prixUnitaire,
      description: article.description,
      typeId: article.typeId
    });
    setOpenEditModal(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      const res = await articleService.deleteArticle(id);
      setSnackbar({
        open: true,
        message: res,
        severity: 'success'
      });
      fetchArticle();
    } catch (error) {
      console.error('Error deleting type:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression',
        severity: 'error'
      });
    }
  };

  // Open create modal
  const handleOpenModal = () => {
    setCurrentType(null);
    setFormData({
      article: '',
      prixUnitaire: '',
      description: '',
      typeId: ''
    });
    setOpenModal(true);
  };

  // Close all modals
  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenEditModal(false);
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

  const paginatedTypes = articles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                  Gestion des Article
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModal}
                >
                  Ajouter un Article
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
                            <TableCell>Prix Unitaire</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Type Article</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {paginatedTypes.map((article) => (
                            <TableRow key={article.id}>
                            <TableCell>{article.article}</TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(article.prixUnitaire)} Ar
                            </TableCell>

                            <TableCell>{article.description}</TableCell>
                            <TableCell>{article.type.type}</TableCell>
                            <TableCell>
                                <Avatar 
                                    src={`${IMAGE_ARTICLE_URL}${article.image}`}
                                    sx={{ width: 56, height: 56 }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Modifier">
                                <IconButton color="primary" onClick={() => handleEdit(article)}>
                                    <EditIcon />
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                <IconButton color="error" onClick={() => handleDelete(article.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                </Tooltip>
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
            <DialogTitle>Ajouter un Article</DialogTitle>
            <DialogContent dividers>
            {/* Image Upload avec style amélioré */}
            <Grid item xs={12} sx={{ mb: 2 }}>
                <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-image"
                type="file"
                onChange={handleFileChange}
                required
                />
                <label htmlFor="upload-image">
                <Button variant="outlined" component="span">
                    Choisir une image
                </Button>
                </label>

                {/* Aperçu de l’image */}
                {formData.image && (
                <Box mt={2}>
                    <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Aperçu"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                    />
                </Box>
                )}
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Article"
                    name="article"
                    value={formData.article}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                />
                </Grid>
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
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    multiline
                    rows={4}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    select
                    fullWidth
                    label="Type Article"
                    name="typeId"
                    value={formData.typeId}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    SelectProps={{ native: true }}
                >
                    <option value="">-- Choisir un type --</option>
                    {types.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.type}
                    </option>
                    ))}
                </TextField>
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


      {/* Edit Type Modal */}
      <Dialog open={openEditModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Modifier un Article</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Article"
                  name="article"
                  value={formData.article}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
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
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    multiline
                    rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Type Article"
                  name="typeId"
                  value={formData.typeId}
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
              Mettre à jour
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

export default Article;