import React from "react";
import styled from "styled-components";
import HospitalItem from "./HospitalItem";

export default function HospitalList({ hospitalList, recommendedName, isLoading }) {
  if (isLoading) return <div>Loading...</div>;

  return (
    <Wrapper>
      {/* AI 추천 병원 */}
      {recommendedName && (
        <RecommendedWrapper>
          <HospitalItem
            name={recommendedName}
            recommended={true}
          />
        </RecommendedWrapper>
      )}

      {/* 병원 목록 */}
      <ListBody>
        {hospitalList.length === 0 && <div>No hospitals found</div>}
        {hospitalList.map((hospital, idx) => (
          <HospitalItem
            key={idx}
            name={hospital.name}
            address={hospital.addr}
            tel={hospital.dutyTel3}
            icuInfo={hospital.beds}
          />
        ))}
      </ListBody>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* 필요 시 스타일 추가 */
 
  overflow-y: auto;
  scrollbar-width: none;

`;

const RecommendedWrapper = styled.div`
  margin-bottom: 12px;
`;

const ListBody = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

`;
