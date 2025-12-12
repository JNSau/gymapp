import api from "./axios";

// Pobieranie historii
export const getWorkoutHistory = async () => {
  const response = await api.get("plans/history/");
  return response.data;
};

// Zapisywanie treningu
export const saveWorkout = async (data: any) => {
  const response = await api.post("plans/history/", data);
  return response.data;
};