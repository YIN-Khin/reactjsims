// // src/api/auth.api.js
// import axios from "./axios";

// export const login = async (credentials) => {
//   const response = await axios.post("/login", credentials);
//   return response.data;
// };

// export const register = async (userData) => {
//   const response = await axios.post("/register", userData);
//   return response.data;
// };

// export const sendOTP = async (email) => {
//   const response = await axios.post("/api/user/sendOtp", { email });
//   return response.data;
// };

// export const verifyOTP = async (data) => {
//   const response = await axios.post("/api/user/verifyOtp", data);
//   return response.data;
// };

// export const resetPassword = async (data) => {
//   const response = await axios.post("/api/user/resetPassword", data);
//   return response.data;
// };

// export const getUserDetails = async (id) => {
//   const response = await axios.get(`/api/user/${id}`);
//   return response.data;
// };

// export const getCurrentUser = async () => {
//   const response = await axios.get("/api/user/me");
//   return response.data;
// };

// export const getUserPermissions = async () => {
//   const response = await axios.get("/api/user/permissions");
//   return response.data;
// };

// export const getAllUsers = async () => {
//   const response = await axios.get("/api/user");
//   return response.data;
// };

// export const updateUser = async (id, userData) => {
//   const response = await axios.put(`/api/user/${id}`, userData);
//   return response.data;
// };

// export const deleteUser = async (id) => {
//   const response = await axios.delete(`/api/user/${id}`);
//   return response.data;
// };

// src/api/auth.api.js
import axios from "./axios";

export const login = async (credentials) => {
  const response = await axios.post("/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post("/register", userData);
  return response.data;
};

export const sendOTP = async (email) => {
  const response = await axios.post("/api/user/sendOtp", { email });
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await axios.post("/api/user/verifyOtp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axios.post("/api/user/resetPassword", data);
  return response.data;
};

export const getUserDetails = async (id) => {
  const response = await axios.get(`/api/user/${id}`);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get("/api/user/me");
  return response.data;
};

export const getUserPermissions = async () => {
  const response = await axios.get("/api/user/permissions");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get("/api/user");
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`/api/user/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`/api/user/${id}`);
  return response.data;
};
