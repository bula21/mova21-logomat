import axios from 'axios';

const BASE_URL = "https://log.bula21.ch/_/";

export const api = axios.create({
  baseURL: BASE_URL,
});

export default api;