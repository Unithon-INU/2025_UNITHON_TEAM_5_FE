import React from "react";
import styled from "styled-components";

export default function HospitalItem({ name, tel, icuInfo }) {
  return (
    <Wrapper>
      <div>
        <strong>{name}</strong>
      </div>
      <div>📞 {tel || "전화번호 없음"}</div>
      <div>🛏️ ICU 병상: {icuInfo}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 1rem;
  border: 1px solid black;
  padding: 1rem;
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
`;
