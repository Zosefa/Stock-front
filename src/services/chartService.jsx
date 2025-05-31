import api from './interceptor';

const chartService = {
  // Clients par mois avec filtrage par année
  findClient: async (year) => {
    const response = await api.get('/clients-per-month', {
      params: { year }
    });
    return response.data;
  },

  // Ventes par année
  findVente: async () => {
    const response = await api.get('/ventes-per-year');
    return response.data;
  },

  // Approvisionnements par année
  findApprovisionnement: async () => {
    const response = await api.get('/appro-per-year');
    return response.data;
  },

  // Récupère les années disponibles pour le filtre
  getAvailableYears: async () => {
    try {
      // Vous pouvez soit:
      // 1. Faire un appel API spécifique si votre backend le supporte
      // const response = await api.get('/available-years');
      // return response.data;
      
      // 2. Ou calculer les années à partir des données existantes
      const [ventesRes] = await Promise.all([
        api.get('/ventes-per-year')
      ]);
      
      const years = ventesRes.data.map(item => item.year);
      
      // Ajouter l'année actuelle si elle n'est pas déjà présente
      const currentYear = new Date().getFullYear();
      if (!years.includes(currentYear)) {
        years.push(currentYear);
      }
      
      // Trier par ordre décroissant
      return years.sort((a, b) => b - a);
    } catch (error) {
      console.error('Error fetching available years:', error);
      // Retourner les 5 dernières années par défaut
      const currentYear = new Date().getFullYear();
      return Array.from({length: 5}, (_, i) => currentYear - i);
    }
  },

  // Optionnel: Récupérer toutes les données en un seul appel
  getAllChartData: async (year) => {
    try {
      const [clients, ventes, appros, years] = await Promise.all([
        api.get('/clients-per-month', { params: { year } }),
        api.get('/ventes-per-year'),
        api.get('/appro-per-year'),
        chartService.getAvailableYears()
      ]);
      
      return {
        clients: clients.data,
        ventes: ventes.data,
        appros: appros.data,
        years
      };
    } catch (error) {
      console.error('Error fetching all chart data:', error);
      throw error;
    }
  }
};

export default chartService;