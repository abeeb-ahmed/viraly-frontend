import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://viraly-api.onrender.com/api/",
  withCredentials: true,
});
