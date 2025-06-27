import axios from "axios";
import { ENDPOINTS } from "../constants/api"; // ENDPOINTS가 URL 경로를 생성한다고 가정합니다.

export const getHospitalById = async (hpid) => {
  const headers = {};

  try {
    const response = await axios.get(ENDPOINTS.hospitals(hpid), {
      headers: headers,
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버가 응답을 했지만, 상태 코드가 2xx 범위를 벗어나는 경우
      // (e.g., 404 Not Found, 401 Unauthorized, 500 Internal Server Error)
      console.error(`API Error: ${error.response.status}`, error.response.data);
      throw new Error(
        `병원 정보를 불러오는 데 실패했습니다. (상태 코드: ${error.response.status})`
      );
    } else if (error.request) {
      // 요청은 성공했으나, 서버로부터 응답을 받지 못한 경우 (네트워크 문제 등)
      console.error("Network Error:", error.request);
      throw new Error("서버 응답이 없습니다. 네트워크 연결을 확인해주세요.");
    } else {
      // 요청을 설정하는 단계에서 에러가 발생한 경우
      console.error("Axios Error:", error.message);
      throw new Error("요청 중 문제가 발생했습니다.");
    }
  }
};
