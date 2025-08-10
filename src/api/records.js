import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/records';

export const getAllRecords = () => axios.get(API_URL);
export const getRecordById = (id) => axios.get(`${API_URL}/${id}`);
export const createRecord = (data) => axios.post(API_URL, data);
export const updateRecord = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteRecord = (id) => axios.delete(`${API_URL}/${id}`);
