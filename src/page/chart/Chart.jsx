import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart, Area, Cell
} from 'recharts';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress,
  useTheme,
  Button
} from '@mui/material';
import chartService from '../../services/chartService';

const Chart = () => {
  const theme = useTheme();
  const [data, setData] = useState({
    clients: [],
    ventes: [],
    appros: [],
    years: []
  });
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const chartData = await chartService.getAllChartData(yearFilter);
        setData({
          clients: formatMonthlyData(chartData.clients),
          ventes: formatYearlyData(chartData.ventes),
          appros: formatYearlyData(chartData.appros),
          years: chartData.years
        });
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        setError('Échec du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [yearFilter]);

  const formatMonthlyData = (data) => {
    const months = [
      { name: 'Janvier', short: 'Jan', num: 1 },
      { name: 'Février', short: 'Fév', num: 2 },
      { name: 'Mars', short: 'Mar', num: 3 },
      { name: 'Avril', short: 'Avr', num: 4 },
      { name: 'Mai', short: 'Mai', num: 5 },
      { name: 'Juin', short: 'Juin', num: 6 },
      { name: 'Juillet', short: 'Juil', num: 7 },
      { name: 'Août', short: 'Août', num: 8 },
      { name: 'Septembre', short: 'Sept', num: 9 },
      { name: 'Octobre', short: 'Oct', num: 10 },
      { name: 'Novembre', short: 'Nov', num: 11 },
      { name: 'Décembre', short: 'Déc', num: 12 }
    ];
    
    return months.map(month => {
      const monthData = data.find(item => item.month === month.num);
      const count = monthData ? parseInt(monthData.count) : 0;
      
      return {
        month: month.name, // Utilisation du nom complet pour plus de clarté
        shortMonth: month.short,
        count,
        fill: getColorForValue(count, data.map(d => d.count))
      };
    });
  };

  const formatYearlyData = (data) => {
    return data.map(item => ({
      ...item,
      year: item.year.toString(),
      count: parseInt(item.count),
      total: parseFloat(item.total || 0)
    })).sort((a, b) => a.year - b.year);
  };

  const getColorForValue = (value, allValues = []) => {
    if (!value) return theme.palette.grey[300];
    
    const max = Math.max(...allValues);
    if (max === 0) return theme.palette.primary.light;
    
    const ratio = value / max;
    
    if (ratio > 0.7) return theme.palette.success.dark;
    if (ratio > 0.4) return theme.palette.success.main;
    if (ratio > 0.1) return theme.palette.success.light;
    return theme.palette.grey[300];
  };

  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Recharger
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%', margin: '0 auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" component="h1">Tableau de Bord</Typography>
        <FormControl sx={{ minWidth: 140 }} size="medium">
          <InputLabel id="year-select-label">Année</InputLabel>
          <Select
            labelId="year-select-label"
            value={yearFilter}
            label="Année"
            onChange={handleYearChange}
          >
            {data.years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4} sx={{ width: '100%' }}>
        {/* Clients par mois - Version élargie */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', width: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Inscriptions Clients ({yearFilter})
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.clients} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="shortMonth" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: theme.shape.borderRadius
                    }}
                    formatter={(value) => [`${value} clients`, 'Nombre']}
                    labelFormatter={(label) => data.clients.find(m => m.shortMonth === label)?.month || label}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    fill={theme.palette.primary.light} 
                    stroke={theme.palette.primary.main} 
                    fillOpacity={0.2} 
                    name="Tendance"
                  />
                  <Bar 
                    dataKey="count" 
                    name="Clients"
                    barSize={30}
                  >
                    {data.clients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Ventes par année - Version élargie */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Statistiques des Ventes
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.ventes} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="year" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis yAxisId="left" orientation="left" allowDecimals={false} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: theme.shape.borderRadius
                    }}
                    formatter={(value, name) => [
                      name === 'Nombre de ventes' ? `${value} ventes` : `${value} Ar`,
                      name
                    ]}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="count" 
                    stroke={theme.palette.success.main} 
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    name="Nombre de ventes"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="total" 
                    stroke={theme.palette.secondary.main} 
                    strokeWidth={3}
                    name="Chiffre d'affaires (Ar)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Approvisionnements par année - Version élargie */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Historique des Approvisionnements
            </Typography>
            <Box sx={{ height: 450 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.appros} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="year" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis yAxisId="left" orientation="left" allowDecimals={false} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: theme.shape.borderRadius
                    }}
                    formatter={(value, name) => [
                      name === 'Nombre' ? `${value} appros` : `${value}`,
                      name
                    ]}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="count" 
                    fill={theme.palette.warning.main} 
                    name="Nombre d'approvisionnements"
                    barSize={30}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="total" 
                    fill={theme.palette.info.main} 
                    name="Montant total (Ar)"
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chart;