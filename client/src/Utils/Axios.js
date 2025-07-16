import axios from "axios";
import { store } from '../redux/Store'
import { baseURL } from "../Constants/Constants";

const API = axios.create({
  baseURL: `${baseURL}`,
  withCredentials: true,
})

API.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
