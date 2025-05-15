import React, { useState, useEffect, useRef } from "react";
import NaverMap from "./components/NaverMap";
import "./App.css";
import CommonBox from "./CommonBox";
import Header from "./components/Header";
import ToggleSwitch from "./components/ToggleSwitch";
import styled from "styled-components";
import DownArrow from "./assets/DownArrow.svg?react";
import HospitalList from "./components/HospitalList";

function App() {
  const regionRef = useRef(null);
  const districtRef = useRef(null);
  const fetchHospitalsRef = useRef(null); // 버튼으로 트리거할 함수 참조

  const [selected, setSelected] = useState("ER");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [stage1dropdownOpen, setStage1DropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("서울특별시");

  const [stage2dropdownOpen, setStage2DropdownOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("강남구");
  const [DeptDropdown, setDeptDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const toggleStage1Dropdown = () => setStage1DropdownOpen((prev) => !prev);
  const toggleStage2Dropdown = () => setStage2DropdownOpen((prev) => !prev);

  const toggleDeptDropdown = () => setDeptDropdown((prev) => !prev);
  const togglePopup = () => setIsPopupVisible((prev) => !prev);

  const deptList = [
    "Internal Medicine",
    "Pediatrics",
    "Orthopedics",
    "Otolaryngology",
    "Dermatology",
  ]; //내과,소아과,정형외과,이비인후과,피부과

  const regionMap = {
    서울특별시: "Seoul-si",
    인천광역시: "Inchoen-si",
    광주광역시: "Gwangju-si",
    부산광역시: "Busan-si",
  };

  const districtMap = {
    서울특별시: {
      강남구: "Gangnam-gu",
      종로구: "Jongno-gu",
      중구: "Jung-gu",
      용산구: "Yongsan-gu",
    },
    인천광역시: {
      연수구: "Yeonsu-gu",
      부평구: "Bupyeong-gu",
      남동구: "Namdong-gu",
      서구: "Seo-gu",
    },
    부산광역시: {
      중구: "Jung-gu",
      서구: "Seo-gu",
      동구: "Dong-gu",
      해운대구: "Haeundae-gu",
    },
    광주광역시: {
      동구: "Dong-gu",
      서구: "Seo-gu",
      남구: "Nam-gu",
      북구: "Buk-gu",
    },
  };

  const regionList = Object.keys(regionMap);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setStage1DropdownOpen(false);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setStage2DropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (regionRef.current && !regionRef.current.contains(e.target)) {
        setStage1DropdownOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(e.target)) {
        setStage2DropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <CommonBox>
      <Header togglePopup={togglePopup}>
        <ToggleSwitch selected={selected} setSelected={setSelected} />
      </Header>
      <NaverMap isPopupVisible={isPopupVisible} />
      {selected === "clinic" && (
        <DeptDiv>
          <DeptButton onClick={toggleDeptDropdown}>
            Select Department <StyleDown />
          </DeptButton>

          {DeptDropdown && (
            <Dropdown>
              {deptList.map((dept, index) => (
                <DropdownItem key={index}>{dept}</DropdownItem>
              ))}
            </Dropdown>
          )}
        </DeptDiv>
      )}
      {selected === "ER" && (
        <DropdownContainer>
          {/* 시/도 선택 */}
          <DropdownWrapper ref={regionRef}>
            <RegionButton onClick={toggleStage1Dropdown} $isNarrow={true}>
              {regionMap[selectedRegion]} <StyleDown />
            </RegionButton>
            {stage1dropdownOpen && (
              <Dropdown>
                {regionList.map((region, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => {
                      setSelectedRegion(region);
                      setSelectedDistrict(Object.keys(districtMap[region])[0]); // 기본 구 선택
                      setStage1DropdownOpen(false);
                    }}
                  >
                    {regionMap[region]}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </DropdownWrapper>
          {/* 군/구 선택 */}
          <DropdownWrapper ref={districtRef}>
            <RegionButton onClick={toggleStage2Dropdown}>
              {/* {selectedDistrict} <StyleDown /> */}
              {districtMap[selectedRegion][selectedDistrict]} <StyleDown />
            </RegionButton>
            {stage2dropdownOpen && (
              <Dropdown>
                {Object.keys(districtMap[selectedRegion] || {}).map(
                  (district, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => handleDistrictSelect(district)}
                    >
                      {districtMap[selectedRegion][district]}
                    </DropdownItem>
                  )
                )}
              </Dropdown>
            )}
          </DropdownWrapper>

          <FetchButton
            disabled={isLoading}
            onClick={async () => {
              if (fetchHospitalsRef.current) {
                setIsLoading(true);
                await fetchHospitalsRef.current();
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? "불러오는 중..." : "API 요청"}
          </FetchButton>
        </DropdownContainer>
      )}
      <HospitalList
        region={selectedRegion}
        district={selectedDistrict}
        onFetch={fetchHospitalsRef}
      />
    </CommonBox>
  );
}

export default App;

const DeptDiv = styled.div`
  padding: 8px 16px;
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  position: relative;

  display: flex;
  gap: 8px;
`;

const DropdownContainer = styled.div`
  /* border: 1px solid black; */

  padding: 8px 16px;
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  position: relative;

  display: flex;
  align-items: center;
  /* padding: 8px 16px;
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  position: relative;

  display: flex;
  */
`;

const StyleDown = styled(DownArrow)`
  width: 10px;
  height: 7px;
`;

const DeptButton = styled.button`
  width: 140px;
  height: 32px;
  background-color: #52aef9;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const DropdownWrapper = styled.div`
  /* border: 1px solid black; */
  position: relative;
  margin: 0.5rem;
`;

const RegionButton = styled.button`
  /* width: 140px; */
  width: ${({ $isNarrow }) => ($isNarrow ? "110px" : "140px")};
  height: 2rem;
  background-color: #52aef9;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 41px;
  width: 140px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 5;
`;

const DropdownItem = styled.div`
  padding: 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const FetchButton = styled.button`
  height: 2rem;
  padding: 0 16px;
  margin-left: 1rem;
  background-color: white;
  color: #52aef9;
  border: 2px solid #52aef9;
  border-radius: 12px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c5e5fe;
  }
`;
