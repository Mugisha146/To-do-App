import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://to-do-api-dgj1.onrender.com/api",
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchTasks = () => api.get("/tasks");
export const addTask = (title: string, description: string) => api.post("/tasks", { title, description });
export const updateTask = (id: string,title: string, description: string, completed: boolean) =>
  api.patch(`/tasks/${id}`, { title,description,completed });
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const response = await api.post("/signup", {
    email,
    password,
    firstName,
    lastName,
  });
  await AsyncStorage.setItem("token", response.data.token); 
  return response;
};

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  await AsyncStorage.setItem("token", response.data.token); 
  return response;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  return api.post("/logout");
};

export const fetchUser = (id: string) => api.get(`/user/${id}`);
export const updateUser = (
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }
) => api.patch(`/user/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/user/${id}`);
