// Admin API functions using the shared api client (includes auth headers)
import apiClient, { api } from "../services/api";

// Helper function for admin API calls with error handling
async function adminApiCall(apiFunction, errorMessage = 'Operation failed') {
  try {
    const result = await apiFunction();
    return { success: true, data: result };
  } catch (error) {
    console.error(errorMessage, error);
    const message = error.response?.data?.message || error.message || errorMessage;
    return { success: false, error: message };
  }
}

// Fetch all bookings (admin view)
export async function getAllBookings(params = {}) {
  const result = await adminApiCall(async () => {
    const searchParams = new URLSearchParams(params);
    const res = await apiClient.get(`/bookings/admin/all?${searchParams}`);
    return res.bookings || [];
  }, 'Failed to fetch bookings');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Fetch products (admin can reuse public list for active products)
export async function getAllProducts(params = {}) {
  const result = await adminApiCall(async () => {
    const { products } = await api.products.getAll(params);
    return products || [];
  }, 'Failed to fetch products');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Delete product (soft delete)
export async function deleteProduct(productId) {
  const result = await adminApiCall(async () => {
    return await apiClient.delete(`/products/${productId}`);
  }, 'Failed to delete product');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Update product (e.g., stock, price, name)
export async function updateProduct(product) {
  const result = await adminApiCall(async () => {
    const { _id, ...payload } = product;
    return await apiClient.put(`/products/${_id}`, payload);
  }, 'Failed to update product');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Add product
export async function addProduct(product) {
  const result = await adminApiCall(async () => {
    return await apiClient.post(`/products`, product);
  }, 'Failed to add product');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Send confirmation email (implement when server endpoint is ready)
export async function sendConfirmationEmail(bookingId) {
  const result = await adminApiCall(async () => {
    return await apiClient.post(`/bookings/${bookingId}/send-confirmation`);
  }, 'Failed to send confirmation email');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Services (Admin)
export async function getAllServices() {
  const result = await adminApiCall(async () => {
    return await api.services.getAll();
  }, 'Failed to fetch services');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function addService(service) {
  const result = await adminApiCall(async () => {
    return await apiClient.post('/services', service);
  }, 'Failed to add service');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function updateService(service) {
  const result = await adminApiCall(async () => {
    const { _id, ...payload } = service;
    return await apiClient.put(`/services/${_id}`, payload);
  }, 'Failed to update service');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function deleteService(serviceId) {
  const result = await adminApiCall(async () => {
    return await apiClient.delete(`/services/${serviceId}`);
  }, 'Failed to delete service');
  
  if (!result.success) throw new Error(result.error);
  return result.data;
}
