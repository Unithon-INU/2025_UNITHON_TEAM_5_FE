// src/components/ToggleSwitch.jsx
import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next"; // useTranslation 훅 임포트
import useHospitalTypeStore from "../store/stateStore";

const ToggleSwitch = ({ selected, setSelected }) => {
  const { t } = useTranslation(); // useTranslation 훅 사용
  const setHospitalType = useHospitalTypeStore((state) => state.setHospitalType);

  // 클릭 시 호출할 함수 따로 선언
  const handleSelect = (type) => {
    setSelected(type);          // 외부 상태 업데이트
    setHospitalType(type);      // Zustand 상태 업데이트
  };

  return (
    <Wrapper>
      <Slider active={selected} />
      <Tab active={selected === "ER"} onClick={() => handleSelect("ER")}>
        {t("er_type")} {/* 'er_type' 번역 키 사용 */}
      </Tab>
      <Tab active={selected === "Clinic"} onClick={() => handleSelect("Clinic")}>
        {t("clinic_type")} {/* 'clinic_type' 번역 키 사용 */}
      </Tab>
    </Wrapper>
  );
};

export default ToggleSwitch;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 160px;
  height: 34px;
  background-color: #3a78eb;
  border-radius: 17px;
  box-sizing: border-box;
`;

const Tab = styled.button`
  flex: 1;
  z-index: 5;
  border: none;
  border-radius: 17px;
  background: transparent;
  color: ${({ active }) => (active ? "#000" : "#fff")};
  font-weight: 900;
  cursor: pointer;
  transition: color 0.3s ease;
`;

const Slider = styled.div`
  position: absolute;
  left: ${({ active }) => (active === "ER" ? "0px" : "calc(50% + 2px)")};
  width: 50%;
  height: 100%;
  background-color: #fff;
  border-radius: 17px;
  transition: left 0.3s ease;
  z-index: 0;
`;
