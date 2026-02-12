import axios from 'axios';
import authService from './authService';

const API_URL = '/api/transactions';

const getAllTransactions = async () => {
  const response = await axios.get(API_URL, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getTransactionById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getTransactionsByAccount = async (accountId) => {
  const response = await axios.get(`${API_URL}/account/${accountId}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getTransactionsByDateRange = async (startDate, endDate) => {
  const response = await axios.get(`${API_URL}/date-range`, {
    params: { startDate, endDate },
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const createTransaction = async (transactionData) => {
  const response = await axios.post(API_URL, transactionData, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const updateTransaction = async (id, transactionData) => {
  const response = await axios.put(`${API_URL}/${id}`, transactionData, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const transactionService = {
  getAllTransactions,
  getTransactionById,
  getTransactionsByAccount,
  getTransactionsByDateRange,
  createTransaction,
  updateTransaction,
  deleteTransaction
};

export default transactionService;
