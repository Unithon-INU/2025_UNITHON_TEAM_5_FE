import React, { useState } from "react";
import styled from "styled-components";

// icons
import PickBackground from "../assets/aipickback.svg";
import Bed from "../assets/bed.svg?react";
import { IoIosArrowDown } from "react-icons/io"; // 화살표 아이콘
import AIPickIcon from "../assets/AIPickIcon.svg";

// i18n
import { useTranslation } from "react-i18next";

export default function HospitalItem({
  name,
  address,
  tel,
  icuInfo,
  reason,
  recommended,
  type,
  isOpen,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isResonModalOpen, setIsResonModalOpen] = useState(false);

  const hasIcuInfo = icuInfo && icuInfo.hvec != null;

  const { t, i18n } = useTranslation();

  return (
    <Wrapper recommended={recommended}>
      <FirstArea>
        <NameRow>
          <NameText>
            <strong>{name}</strong>
          </NameText>
          <DropdownBtn onClick={() => setIsNameModalOpen(!isNameModalOpen)}>
            <RotatingIcon open={isNameModalOpen} size={16} />
          </DropdownBtn>
        </NameRow>
        <AddressRow>
          <AddressText>
            {type === "Clinic" ? address : address || "null"}
          </AddressText>
          {address && (
            <DropdownBtn onClick={() => setIsModalOpen(!isModalOpen)}>
              <RotatingIcon open={isModalOpen} size={16} />
            </DropdownBtn>
          )}
        </AddressRow>

        <span>
          {type === "Clinic"
            ? tel || t("tel_na")
            : hasIcuInfo
              ? tel || t("tel_na")
              : t("addr_na")}
        </span>
        <AddressRow>
          <AddressText>{reason}</AddressText>
          {reason && (
            <DropdownBtn onClick={() => setIsResonModalOpen(!isResonModalOpen)}>
              <RotatingIcon open={isResonModalOpen} size={16} />
            </DropdownBtn>
          )}
        </AddressRow>
      </FirstArea>

      <SecondArea recommended={recommended}>
        {recommended && (
          <Pickdiv>
            <img src={AIPickIcon} />
          </Pickdiv>
        )}
        {type === "Clinic" ? (
          // Clinic이면 Bed 대신 isOpen 상태 표시
          <LeftBeds $bgColor={isOpen ? "#3A78EB" : "#909090"}>
            <span>{isOpen ? t("open_now") : t("closed_today")}</span>{" "}
            {/*국제화필요*/}
          </LeftBeds>
        ) : // 기존 ICU 정보 처리
        hasIcuInfo && icuInfo.hvs01 != null ? (
          icuInfo.hvec < 0 ? (
            <LeftBeds $bgColor="#FF847C">
              {`대기 : ${Math.abs(icuInfo.hvec)}`}
            </LeftBeds>
          ) : (
            <LeftBeds>
              <Bed /> {icuInfo.hvec}
            </LeftBeds>
          )
        ) : (
          <LeftBeds $bgColor="#909090">
            <span>{t("na")}</span>
          </LeftBeds>
        )}
      </SecondArea>

      {/* 🔽 이 부분이 팝업 */}
      {isNameModalOpen && (
        <PopupModal onClick={(e) => e.stopPropagation()}>
          <div>{name}</div>
        </PopupModal>
      )}
      {isModalOpen && (
        <PopupModal onClick={(e) => e.stopPropagation()}>
          <div>{address}</div>
        </PopupModal>
      )}
      {isResonModalOpen && (
        <PopupModal onClick={(e) => e.stopPropagation()}>
          <div>{reason}</div>
        </PopupModal>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-bottom: 1px solid gray;
  width: 100%;
  height: ${({ recommended }) => (recommended ? "7rem" : "6rem")};
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
  font-family: "Inter", sans-serif;
  font-size: 14px;
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
  width: 5rem;
  height: 1.75rem;

  border-radius: 0.5rem;
  /* background-color: #53a0ff; */
  background-color: ${(props) => (props.$bgColor ? props.$bgColor : "#53a0ff")};

  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  span {
    color: white;
    font-size: 0.75rem;
  }
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
const NameRow = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const NameText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
