import React, { useState } from "react";
import styled from "styled-components";
import PickBackground from "../assets/aipickback.svg";
import Bed from "../assets/bed.svg?react";
import { IoIosArrowDown } from "react-icons/io"; // 화살표 아이콘

export default function HospitalItem({
  name,
  address,
  tel,
  icuInfo,
  recommended,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasIcuInfo = icuInfo && icuInfo.hvec != null;

  return (
    <Wrapper recommended={recommended}>
      <FirstArea>
        <span>
          <strong>{name}</strong>
        </span>
        <AddressRow>
          <AddressText>{address || "null"}</AddressText>
          {address && (
            <DropdownBtn onClick={() => setIsModalOpen(!isModalOpen)}>
              <RotatingIcon open={isModalOpen} size={16} />
            </DropdownBtn>
          )}
        </AddressRow>
        <span>
          {hasIcuInfo ? tel || "전화번호 없음" : "정보를 제공하지 않음"}
        </span>
      </FirstArea>

      <SecondArea recommended={recommended}>
        {recommended && <Pickdiv>AI PICK!</Pickdiv>}
        <LeftBeds>
          {hasIcuInfo && icuInfo.hvs01 != null ? (
            icuInfo.hvec < 0 ? (
              `${Math.abs(icuInfo.hvec)}대기`
            ) : (
              <>
                <Bed /> {icuInfo.hvec}
              </>
            )
          ) : (
            0
          )}
        </LeftBeds>
      </SecondArea>

      {/* 🔽 이 부분이 팝업 */}
      {isModalOpen && (
        <PopupModal onClick={(e) => e.stopPropagation()}>
          <div>{address}</div>
        </PopupModal>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-bottom: 1px solid gray;
  width: 100%;
  height: 6rem;
  background: ${({ recommended }) =>
    recommended ? "linear-gradient(to bottom, #BCE1FF, #FFE1FC)" : "white"};

  display: flex;
  justify-content: space-between;
  position: relative;
  span {
    margin: 0.25rem;
  }
  padding: 8px 16px;
  box-sizing: border-box;
`;

const FirstArea = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 400px) {
    font-size: 13px;
  }
`;

const SecondArea = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: ${({ recommended }) =>
    recommended ? "space-between" : "flex-end"};
  align-items: flex-end;
  align-items: flex-end;

  color: black;

  span {
    color: black;
  }
  @media (max-width: 400px) {
    font-size: 15px;
  }
`;

const LeftBeds = styled.div`
  width: 80px;
  height: 28px;

  border-radius: 0.5rem;
  background-color: #53a0ff;

  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const Pickdiv = styled.div`
  width: 80px;
  padding-left: 2px;
  box-sizing: border-box;
  font-family: "Fredoka One", cursive;
`;

const AddressRow = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const AddressText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const PopupModal = styled.div`
  position: absolute;
  top: calc(65%); /* 카드 아래로 4px 떨어지게 */
  left: 15;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 10;
  width: max-content;
  max-width: 280px;
  font-size: 14px;
  word-break: break-word;
`;
const DropdownBtn = styled.button`
  background: none;
  border: none;
  margin-left: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
`;

const RotatingIcon = styled(IoIosArrowDown)`
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
`;
