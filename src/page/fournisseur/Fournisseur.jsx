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
  TablePagination
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import fournisseurService from '../../services/fournisseurService';

const Fournisseur = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    siege: '',
    contact: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch all fournisseurs
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

  useEffect(() => {
    fetchFournisseur();
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
      if (currentType) {
        // Update existing type
        const response = await fournisseurService.updateFournisseur(currentType.id, formData);
        setSnackbar({
          open: true,
          message: response,
          severity: 'success'
        });
      } else {
        // Create new type
        const response = await fournisseurService.createFournisseur(formData);
        setSnackbar({
          open: true,
          message: response,
          severity: 'success'
        });
      }
      fetchFournisseur();
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
  const handleEdit = (fournisseur) => {
    setCurrentType(fournisseur);
    setFormData({
      nom: fournisseur.nom,
      siege: fournisseur.siege,
      contact: fournisseur.contact
    });
    setOpenEditModal(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      const res = await fournisseurService.deleteFournisseur(id);
      setSnackbar({
        open: true,
        message: res,
        severity: 'success'
      });
      fetchFournisseur();
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
      nom: '',
      siege: '',
      contact: ''
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

  const paginatedTypes = fournisseurs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                  Gestion des Fournisseurs
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModal}
                >
                  Ajouter un Fournisseur
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
                            <TableCell>Fournisseur</TableCell>
                            <TableCell>Siege</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {paginatedTypes.map((fournisseur) => (
                            <TableRow key={fournisseur.id}>
                            <TableCell>{fournisseur.nom}</TableCell>
                            <TableCell>{fournisseur.siege}</TableCell>
                            <TableCell>
                                {(() => {
                                    const phoneNumber = parsePhoneNumberFromString("+"+fournisseur.contact);
                                    return phoneNumber ? phoneNumber.formatInternational() : fournisseur.contact;
                                })()}
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Modifier">
                                <IconButton color="primary" onClick={() => handleEdit(fournisseur)}>
                                    <EditIcon />
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                <IconButton color="error" onClick={() => handleDelete(fournisseur.id)}>
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
                        count={fournisseurs.length}
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
          <DialogTitle>Ajouter un Client</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fournisseur"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Siege"
                  name="siege"
                  value={formData.siege}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PhoneInput
                country={'mg'} // Défaut : Madagascar
                preferredCountries={['mg', 'fr', 'us']}
                value={formData.contact}
                onChange={(phone) => setFormData(prev => ({ ...prev, contact: phone }))}
                inputProps={{
                    name: 'contact',
                    required: true,
                    autoFocus: false
                }}
                containerStyle={{ marginTop: '16px' }}
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

      {/* Edit Type Modal */}
      <Dialog open={openEditModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Modifier les informations d'un client</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fournisseur"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Siege"
                  name="siege"
                  value={formData.siege}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PhoneInput
                country={'mg'} 
                preferredCountries={['mg', 'fr', 'us']}
                value={formData.contact}
                onChange={(phone) => setFormData(prev => ({ ...prev, contact: phone }))}
                inputProps={{
                    name: 'contact',
                    required: true,
                    autoFocus: false
                }}
                containerStyle={{ marginTop: '16px' }}
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

export default Fournisseur;