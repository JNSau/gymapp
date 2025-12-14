import api from "./axios";

// 1. Pobierz Katalog (Plany systemowe/publiczne)
export const getPublicPlans = async () => {
  const response = await api.get("/plans/public/");
  return response.data;
};

// 2. Pobierz Moje Plany (Skopiowane)
export const getUserPlans = async () => {
  const response = await api.get("/plans/my-plans/");
  return response.data;
};

// 3. Kopiuj plan z katalogu do moich planów
export const copyPlanToMyWorkouts = async (planId: number) => {
  const response = await api.post(`/plans/${planId}/copy/`);
  return response.data;
};

// 4. Pobierz szczegóły (działa dla obu rodzajów)
export const getPlanDetails = async (id: number) => {
  const response = await api.get(`/plans/${id}/`);
  return response.data;
};

// 5. Usuwanie (tylko dla moich planów)
export const deletePlan = async (id: number) => {
  const response = await api.delete(`/plans/${id}/`);
  return response.data;
};