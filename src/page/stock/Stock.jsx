import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  TablePagination,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import stockService from '../../services/stockService';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const IMAGE_ARTICLE_URL = `${import.meta.env.VITE_IMAGE_ARTICLE_URL}`;

  // Fetch all stocks
  const fetchStock = async () => {
    try {
      setLoading(true);
      const response = await stockService.findStock();
      setStocks(response);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des stocks',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

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

  const paginatedStocks = stocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Liste des Stocks', 14, 22);

    const tableColumn = ["Article", "Prix Unitaire (Ar)", "Stock"];
    const tableRows = stocks.map(stock => ([
      stock.article.article,
      `${Number(stock.article.prixUnitaire).toFixed(2)} Ar`,
      stock.stock
    ]));

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('stocks.pdf');
  };

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
                  Suivie des Stocks
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={exportToPDF}
                >
                  Exporter PDF
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="stocks table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Article</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Prix Unitaire</TableCell>
                        <TableCell>Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedStocks.map((stock) => (
                        <TableRow key={stock.id}>
                          <TableCell>{stock.article.article}</TableCell>
                          <TableCell>
                            <Avatar
                              src={`${IMAGE_ARTICLE_URL}${stock.article.image}`}
                              sx={{ width: 56, height: 56 }}
                            />
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('fr-FR', {
                              minimumFractionDigits: 2
                            }).format(stock.article.prixUnitaire)} Ar
                          </TableCell>
                          <TableCell>{stock.stock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={stocks.length}
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

export default Stock;
