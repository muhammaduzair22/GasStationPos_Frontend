import API from "../api/axiosInstance";

// CRUD for stations
export const getStations = () => API.get("/");
export const getStation = (id) => API.get(`/${id}`);
export const createStation = (data) => API.post("/", data);
export const updateStation = (id, data) => API.put(`/${id}`, data);
export const deleteStation = (id) => API.delete(`/${id}`);
