import API from "../api/axiosInstance";

export const signup = (data) => API.post("/signup", data);
export const login = (data) => API.post("/login", data);
