import API from "../api/axiosInstance";

// CRUD for stations
export const getStations = () => API.get("/stations/");
export const getStation = (id) => API.get(`/stations/${id}`);
export const createStation = (data) => API.post("/stations/", data);
export const updateStation = (id, data) => API.put(`/stations/${id}`, data);
export const deleteStation = (id) => API.delete(`/stations/${id}`);
