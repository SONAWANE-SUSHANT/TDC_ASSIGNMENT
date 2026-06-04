import axiosClient from "./axiosClient";

export const loginUser = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data.data;
};
