import api from "./axios";

export const getProductTransactions = (productId) =>
  api.get(`/products/${productId}/transactions`);

export const createProductTransaction = (productId, data) =>
  api.post(`/products/${productId}/transactions`, data);
