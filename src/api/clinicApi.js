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
export const getClinic = async (lat, lng, department,language) => {
  try {
    const params = {
      lat,
      lng,
      department,
      language,
    };

    const response = await apiClient.get('/clinic/department', { params });
    return response.data;
  } catch (error) {
    console.error('getEmergency error:', error);
    throw error;
  }
};