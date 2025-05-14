import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import HospitalItem from "./HospitalItem";

import { ENDPOINTS } from "../constants/api";

export default function HospitalList() {
  const [hospitalList, setHospitalList] = useState([]);
  const [recommendedName, setRecommendedName] = useState(null); // 병원 이름만
  const [recommendedReason, setRecommendedReason] = useState("");

  const handleClick = async () => {
    try {
      // 1. GET 요청으로 병원 목록 가져오기
      const response = await axios.get(ENDPOINTS.egen("서울특별시", "강남구"));
      const hospitals = response.data.body?.items || [];

      // 2. 병원 목록 상태 저장용: map 사용
      const parsedItems = hospitals.map((item) => ({
        name: item.dutyName,
        tel: item.dutyTel3,
        icuInfo: [item.generalICU, item.internalMedicineICU, item.surgicalICU]
          .filter(Boolean)
          .join(" / "),
        fullData: item, // POST 요청에 원본 필요하므로 같이 저장
      }));

      setHospitalList(parsedItems);

      // 3. POST 요청용 후보 리스트 구성
      const requestBody = {
        candidates: hospitals.map((item) => ({
          dutyName: item.dutyName,
          dutyTel3: item.dutyTel3,
          inpatientRoom: item.inpatientRoom,
          generalICU: item.generalICU,
          internalMedicineICU: item.internalMedicineICU,
          surgicalICU: item.surgicalICU,
          neurologyWard: item.neurologyWard,
          ctAvailable: item.ctAvailable,
          mriAvailable: item.mriAvailable,
          ventilatorAvailable: item.ventilatorAvailable,
          ambulanceAvailable: item.ambulanceAvailable,
        })),
      };

      // 4. POST 요청 보내기 (추천 병원 요청)
      const postRes = await axios.post(ENDPOINTS.suggestion, requestBody);
      console.log(postRes);
      const { recommendedHospitalName, recommendedReason } = postRes.data;
      setRecommendedName(recommendedHospitalName);
      setRecommendedReason(recommendedReason);
    } catch (error) {
      console.error("요청 실패:", error);
    }
  };

  // mocking
  // const array1 = [{ name: "병원alpha" }, { name: "병원beta" }];

  return (
    <div>
      <span>Hospital List</span>
      <button onClick={handleClick}>API 요청</button>
      {/* 맨 위에 올 ai추천 */}
      {recommendedName && (
        <>
          <h3>ai추천병원</h3>
          <HospitalItem name={recommendedName} />
        </>
      )}

      {/* 병원목록*/}
      <Wrapper>
        {hospitalList.map((hospital, idx) => (
          <HospitalItem
            key={idx}
            name={hospital.name}
            tel={hospital.tel}
            icuInfo={hospital.icuInfo}
          />
        ))}
      </Wrapper>
    </div>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;
