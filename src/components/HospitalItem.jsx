import React from "react";
import styled from "styled-components";
import PickBackground from "../assets/aipickback.svg";

export default function HospitalItem({ name, tel, icuInfo, recommended }) {
  return (
    <Wrapper>
      <FirstArea>
        <span>
          <strong>{name}</strong>
        </span>
        <span>📞 {tel || "전화번호 없음"}</span>
      </FirstArea>
      <SecondArea>
        {recommended && (
          <>
            <span>⭐ AI PICK!</span>
          </>
        )}
        <LeftBeds>🛏️ {icuInfo}</LeftBeds>
      </SecondArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-bottom: 1px solid gray;
  width: 100%;
  height: 6rem;

  display: flex;
  justify-content: space-between;

  span {
    margin: 0.25rem;
  }
`;

const FirstArea = styled.div`
  padding: 1.25rem;
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SecondArea = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  color: black;

  span {
    color: black;
  }
`;

const LeftBeds = styled.div`
  width: 80px;
  height: 28px;

  margin: 12px;

  border-radius: 0.5rem;
  background-color: #5dbd48;

  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
`;
