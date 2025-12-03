import  api  from "./axios";

// Pobranie feedbacku konkretnego planu
export const getFeedbackForPlan = async (planId: number) => {
  const response = await api.get(`/feedback/?plan=${planId}`);
  return response.data;
};

// Dodanie oceny
export const sendFeedback = async (data: {
  plan: number;
  rating: number;
}) => {
  const response = await api.post("/feedback/", data);
  return response.data;
};

// Zmiana oceny
export const updateFeedback = async (id: number, data: { rating: number }) => {
  const response = await api.patch(`/feedback/${id}/`, data);
  return response.data;
};
