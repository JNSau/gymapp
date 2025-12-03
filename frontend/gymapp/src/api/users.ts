import  api  from "./axios";

export const registerUser = async (data: {
  username: string;
  password: string;
 email?: string;   // jeśli email nie jest wymagany
  level?: string;   // dodaj level jako opcjonaln
}) => {
  const response = await api.post("/users/register/", data);
  return response.data;
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/users/login/", data);
  return response.data; // zwraca token + user
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me/");
  return response.data;
};
