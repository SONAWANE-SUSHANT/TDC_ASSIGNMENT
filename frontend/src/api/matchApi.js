import axiosClient from "./axiosClient";

export const explainMatch = async (payload) => {
  const response = await axiosClient.post("/ai/explain-match", payload);
  return response.data.data;
};

export const generateIntro = async (payload) => {
  const response = await axiosClient.post("/ai/generate-intro", payload);
  return response.data.data;
};

export const sendMatch = async (payload) => {
  const response = await axiosClient.post("/matches/send", payload);
  return response.data.data;
};

export const fetchMatchHistory = async (params = {}) => {
  const response = await axiosClient.get("/matches/history", { params });
  return response.data.data;
};

export const updateMatchStatus = async (id, payload) => {
  const response = await axiosClient.patch(`/matches/${id}/status`, payload);
  return response.data.data;
};
