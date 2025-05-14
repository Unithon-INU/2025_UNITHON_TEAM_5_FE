// src/contants/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ENDPOINTS.egen("서울특별시","강남구")

export const ENDPOINTS = {
  egen: (stage1, stage2) =>
    `${API_BASE_URL}/egen?stage1=${stage1}&stage2=${stage2}`,
  suggestion: `${API_BASE_URL}/emergency-hospitals/suggestion`,
};
