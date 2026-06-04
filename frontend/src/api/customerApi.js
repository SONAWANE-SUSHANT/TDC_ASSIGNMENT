import axiosClient from "./axiosClient";

export const fetchCustomers = async (params = {}) => {
  const response = await axiosClient.get("/customers", { params });
  return response.data.data;
};

export const fetchCustomerById = async (id) => {
  const response = await axiosClient.get(`/customers/${id}`);
  return response.data.data;
};

export const fetchCustomerMatches = async (id, params = {}) => {
  const response = await axiosClient.get(`/customers/${id}/matches`, { params });
  return response.data.data;
};

export const updateCustomerStatus = async (id, payload) => {
  const response = await axiosClient.patch(`/customers/${id}/status`, payload);
  return response.data.data;
};
