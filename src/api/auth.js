import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL + '/auth' });

export const signup = (data) => API.post('/signup', data);
export const login = (data) => API.post('/login', data);