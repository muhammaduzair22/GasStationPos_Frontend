import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + '/users',
});

export const getUsers = () => API.get('/');
export const getUser = (id) => API.get(`/${id}`);
export const createUser = (data) => API.post('/', data);
export const updateUser = (id, data) => API.put(`/${id}`, data);
export const deleteUser = (id) => API.delete(`/${id}`);
