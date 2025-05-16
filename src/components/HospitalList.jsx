import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import HospitalItem from "./HospitalItem";

import { ENDPOINTS } from "../constants/api";

export default function HospitalList({ region, district, onFetch }) {
  const [hospitalList, setHospitalList] = useState([]);
  const [recommendedName, setRecommendedName] = useState(null); // 병원 이름만
  const [recommendedReason, setRecommendedReason] = useState("");

  const handleFetchHospitals = async () => {
    try {
      // 1. GET 요청으로 병원 목록 가져오기
      const response = await axios.get(ENDPOINTS.egen(region, district));
      // const response = await axios.get(ENDPOINTS.egen("서울특별시", "강남구"));
      const hospitals = response.data.body?.items || [];

      // 2. 병원 목록 상태 저장용: map 사용
      const parsedItems = hospitals.map((item) => ({
        name: item.dutyName,
        tel: item.dutyTel3,
        icuInfo: item.generalICU,
        // icuInfo: [item.generalICU, item.internalMedicineICU, item.surgicalICU]
        //   .filter(Boolean)
        //   .join(" / "),
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

  // 외부에서 트리거하기 위해 함수 제공
  useEffect(() => {
    if (onFetch) {
      onFetch.current = handleFetchHospitals;
    }
  }, [onFetch, region, district]);

  // mocking
  // const array1 = [{ name: "병원alpha" }, { name: "병원beta" }];

  return (
    <Wrapper>
      {/* 맨 위에 올 ai추천 */}
      {recommendedName && (
        <>
          {/* {hospitalList.find((h) => h.name === recommendedName) ? (
            <HospitalItem
              name={recommendedName}
              tel={
                hospitalList.find((h) => h.name === recommendedName)?.tel ||
                "전화번호 없음"
              }
              icuInfo={
                hospitalList.find((h) => h.name === recommendedName)?.icuInfo ||
                "정보 없음"
              }
              recommended={true}
            />
          ) : (
            <HospitalItem name={recommendedName} recommended={true} />
          )} */}
          {(() => {
            const recommendedHospital = hospitalList.find((h) =>
              recommendedName.includes(h.name)
            );

            return (
              <HospitalItem
                name={recommendedName}
                tel={recommendedHospital?.tel || "N/A"}
                icuInfo={recommendedHospital?.icuInfo || "N/A"}
                recommended={true}
              />
            );
          })()}
        </>
      )}

      {/* 병원목록*/}
      <ListBody>
        {hospitalList.map((hospital, idx) => (
          <HospitalItem
            key={idx}
            name={hospital.name}
            tel={hospital.tel}
            icuInfo={hospital.icuInfo}
          />
        ))}
      </ListBody>
    </Wrapper>
  );
}

const Wrapper = styled.div`
 

  div {
    display: flex;
    /* justify-content: flex-end; */
   
  }
`;

const ListBody = styled.div`
  /* border: 1px solid black; */

  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
