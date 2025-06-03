import axios from "axios";

const api = axios.create({
  baseURL: "http://16.171.158.43:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
