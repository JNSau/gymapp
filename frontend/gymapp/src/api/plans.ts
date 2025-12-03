import  api  from "./axios";

// Wszystkie plany
export const getPlans = async () => {
  const response = await api.get("/plans/");
  return response.data;
};

// Jeden plan z dniami i ćwiczeniami
export const getPlanDetails = async (id: number) => {
  const response = await api.get(`/plans/${id}/`);
  return response.data;
};

// Dodaj plan
export const createPlan = async (data: any) => {
  const response = await api.post("/plans/", data);
  return response.data;
};

// Usuwanie
export const deletePlan = async (id: number) => {
  const response = await api.delete(`/plans/${id}/`);
  return response.data;
};
