import api from "./axios";

export const registerUser = async (data: {
  username: string;
  password: string;
  email: string;   // Usunąłem '?', bo backend wymaga emaila (required=True)
  level?: string;  
}) => {
  const response = await api.post("/users/register/", data);
  return response.data;
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/users/login/", data);
  return response.data; 
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me/");
  return response.data;
};

// --- NOWA FUNKCJA DO ANKIETY ---
// Służy do aktualizacji samego poziomu użytkownika
export const updateUserLevel = async (level: string) => {
  // Używamy PATCH, żeby zaktualizować tylko jedno pole, a nie cały obiekt
  const response = await api.patch("/users/me/", { level });
  return response.data;
};