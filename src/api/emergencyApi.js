import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
  },
});

// 주변 응급실 위치 요청
export const getEmergency = async (lat, lon, language) => {
  try {
    const params = {
      lat,
      lon,
      language,
    };

    const response = await apiClient.get('/emergency/nearby', { params });
    return response.data;
  } catch (error) {
    console.error('getEmergency error:', error);
    throw error;
  }
};

// 응급실 병상 정보 요청
export const getEmergencyInfo = async (lat, lng, radiusKm) => {
  try {
    const params = {
      lat,
      lng,
      radiusKm,
    };

    const response = await apiClient.get('/emergency/beds', { params });
    return response.data;
  } catch (error) {
    console.error('getEmergencyInfo error:', error);
    throw error;
  }
};

export const recommend = async (lat, lng, radiusKm) => {
  try {
    const params = {
      lat,
      lng,
      radiusKm,
    };

    const response = await apiClient.get('/gemini/recommend-emergency', { params });
    return response.data;
  } catch (error) {
    console.error('recommend error:', error);
    throw error;
  }
};