import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Ważne: Django lubi slash na końcu
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // <--- USUŃ TO. Przy JWT trzymanym w localStorage to często przeszkadza.
});

// To jest ten magiczny fragment, którego brakowało:
api.interceptors.request.use(
  (config) => {
    // 1. Pobierz token z szuflady przeglądarki
    const token = localStorage.getItem("token");
    
    // 2. Jeśli token istnieje, doklej go do nagłówka
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;