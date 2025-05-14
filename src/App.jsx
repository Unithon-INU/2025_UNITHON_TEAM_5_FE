import React, { useState } from "react";
import NaverMap from "./components/NaverMap";
import "./App.css";
import CommonBox from "./CommonBox";
import Header from "./components/Header";
import ToggleSwitch from "./components/ToggleSwitch";
import styled from "styled-components";
import DownArrow from "./assets/DownArrow.svg?react";
import HospitalList from "./components/HospitalList";

function App() {
  const [selected, setSelected] = useState("emergency");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [DeptDropdown, setDeptDropdown] = useState(false);

  const toggleDeptDropdown = () => setDeptDropdown((prev) => !prev);
  const togglePopup = () => setIsPopupVisible((prev) => !prev);
  const deptList = [
    "Internal Medicine",
    "Pediatrics",
    "Orthopedics",
    "Otolaryngology",
    "Dermatology",
  ]; //내과,소아과,정형외과,이비인후과,피부과

  return (
    <CommonBox>
      <Header togglePopup={togglePopup}>
        <ToggleSwitch selected={selected} setSelected={setSelected} />
      </Header>
      <NaverMap isPopupVisible={isPopupVisible} />
      {selected === "hospital" && (
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
      <HospitalList />
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
