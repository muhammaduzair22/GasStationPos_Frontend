import API from "../api/axiosInstance";

// // Attach token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// MasterRecord APIs
export const getAllRecords = () => API.get("/masterrecords");
export const getRecordById = (id) => API.get(`/masterrecords/${id}`);
export const createRecord = (data) => API.post("/masterrecords", data);
export const updateRecord = (id, data) => API.put(`/masterrecords/${id}`, data);
export const deleteRecord = (id) => API.delete(`/masterrecords/${id}`);
