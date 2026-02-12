import axios from 'axios';

const API_URL = '/api/auth';

const register = async (name, email, password, phone) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    phone
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthHeader
};

export default authService;
