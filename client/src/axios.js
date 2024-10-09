import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:7000/api/v1/",
  withCredentials: true,
});
