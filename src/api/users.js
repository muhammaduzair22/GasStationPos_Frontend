import API from "../api/axiosInstance";

export const getUsers = () => API.get("/users/");
export const getUser = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post("/users/", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
