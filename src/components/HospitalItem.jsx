import React from "react";
import styled from "styled-components";
import PickBackground from "../assets/aipickback.svg";
import Bed from "../assets/bed.svg?react";


export default function HospitalItem({ name, tel, icuInfo, recommended }) {
  return (
    <Wrapper recommended={recommended}>
      <FirstArea >
        <span>
          <strong>{name}</strong>
        </span>
        <span>50-1, Yonsei-ro, Seodaemun-gu, Seoul</span> {/*임시주소*/}
        <span> {tel || "전화번호 없음"}</span>
      </FirstArea>
      <SecondArea recommended={recommended}>
        {recommended && (
          <>
            <Pickdiv>AI PICK!</Pickdiv>
          </>
        )}
        <LeftBeds><Bed/> {icuInfo}</LeftBeds> {/* 최대병상수가 몇인지 안나와서 n/m 적용을 어케할지 고민 */}
      </SecondArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-bottom: 1px solid gray;
  width: 100%;
  height: 6rem;
  background: ${({ recommended }) =>
  recommended
    ? 'linear-gradient(to bottom, #BCE1FF, #FFE1FC)'
    : 'white'};

  display: flex;
  justify-content: space-between;

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
  recommended ? 'space-between' : 'flex-end'};
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

const  LeftBeds = styled.div`
  width: 80px;
  height: 28px;

  border-radius: 0.5rem;
  background-color: #53A0FF;

  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const Pickdiv=styled.div`
    width: 80px;
    padding-left: 2px;
    box-sizing: border-box;
    font-family: 'Fredoka One', cursive;


`