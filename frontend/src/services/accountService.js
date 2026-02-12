import axios from 'axios';
import authService from './authService';

const API_URL = '/api/accounts';

const getAllAccounts = async () => {
  const response = await axios.get(API_URL, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getAccountById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const createAccount = async (accountData) => {
  const response = await axios.post(API_URL, accountData, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const updateAccount = async (id, accountData) => {
  const response = await axios.put(`${API_URL}/${id}`, accountData, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const deleteAccount = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const getTotalBalance = async () => {
  const response = await axios.get(`${API_URL}/total-balance`, {
    headers: authService.getAuthHeader()
  });
  return response.data;
};

const accountService = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getTotalBalance
};

export default accountService;
