import  api  from "./axios";

export const getExercises = async () => {
  const response = await api.get("/exercises/");
  return response.data;
};

export const getExercise = async (id: number) => {
  const response = await api.get(`/exercises/${id}/`);
  return response.data;
};
