import API from "../api/axiosInstance";

// CRUD for loans
export const getLoans = () => API.get("/loan/");
export const getLoan = (id) => API.get(`/loan/${id}`);
export const createLoan = (data) => API.post("/loan/", data);
export const updateLoan = (id, data) => API.put(`/loan/${id}`, data);
export const deleteLoan = (id) => API.delete(`/loan/${id}`);
