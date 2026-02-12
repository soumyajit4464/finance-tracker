import axios from 'axios';
import authService from './authService';

const API_URL = '/api/budgets';

const getAllBudgets = async () => {
  const response = await axios.get(API_URL, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getCurrentMonthBudgets = async () => {
  const response = await axios.get(`${API_URL}/current`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getBudgetById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getBudgetsByMonthYear = async (month, year) => {
  const response = await axios.get(`${API_URL}/month/${month}/year/${year}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const createBudget = async (budgetData) => {
  const response = await axios.post(API_URL, budgetData, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const updateBudget = async (id, budgetData) => {
  const response = await axios.put(`${API_URL}/${id}`, budgetData, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const deleteBudget = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const budgetService = {
  getAllBudgets,
  getCurrentMonthBudgets,
  getBudgetById,
  getBudgetsByMonthYear,
  createBudget,
  updateBudget,
  deleteBudget
};

export default budgetService;
