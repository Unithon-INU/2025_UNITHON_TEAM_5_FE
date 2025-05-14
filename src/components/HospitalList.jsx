import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import HospitalItem from "./HospitalItem";

import { ENDPOINTS } from "../constants/api";

export default function HospitalList() {
  const [hospitalList, setHospitalList] = useState([]);

  const handleClick = async () => {
    try {
      const response = await axios.get(ENDPOINTS.egen("서울특별시", "강남구"));
      // if (!response.ok) throw new Error("Network response was not ok");
      const data = response.data;
      console.log("응답 데이터:", data);
      const parsedItems =
        data.body?.items?.map((item) => ({
          name: item.dutyName,
          tel: item.dutyTel3,
          icuInfo: [item.generalICU, item.internalMedicineICU, item.surgicalICU]
            .filter(Boolean)
            .join(" / "),
        })) || [];

      setHospitalList(parsedItems);
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
      <HospitalItem name="병원1" />
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
