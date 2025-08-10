import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Upload Excel file
export const uploadExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
