import api from "./axios";

export const getPublicPlans = async () => {
  const response = await api.get("/plans/public/");
  return response.data;
};

export const getUserPlans = async () => {
  const response = await api.get("/plans/my-plans/");
  return response.data;
};

export const copyPlanToMyWorkouts = async (planId: number) => {
  const response = await api.post(`/plans/${planId}/copy/`);
  return response.data;
};

export const getPlanDetails = async (id: number) => {
  const response = await api.get(`/plans/${id}/`);
  return response.data;
};

export const deletePlan = async (id: number) => {
  const response = await api.delete(`/plans/${id}/`);
  return response.data;
};


export const updatePlan = async (id: number, data: { name?: string; description?: string }) => {
  const response = await api.patch(`/plans/${id}/`, data);
  return response.data;
};

export const updateExerciseSettings = async (
  id: number, 
  data: { exercise_id?: number; sets?: number; reps?: string; rest_time?: string }
) => {
  const response = await api.patch(`/plans/exercise-in-plan/${id}/`, data);
  return response.data;
};