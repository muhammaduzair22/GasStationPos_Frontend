import API from "../api/axiosInstance";

export const getEmployees = () => API.get("/employee/");
export const getEmployee = (id) => API.get(`/employee/${id}`);
export const createEmployee = (data) => API.post("/employee/", data);
export const updateEmployee = (id, data) => API.put(`/employee/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employee/${id}`);
