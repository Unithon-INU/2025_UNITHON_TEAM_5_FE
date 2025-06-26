import React from "react";
import styled from "styled-components";
import HospitalItem from "./HospitalItem";
import useLanguageStore from "../store/languageStore";

export default function HospitalList({ hospitalList, type, recommendedHospital, isLoading ,noResultType}) {
  const language = useLanguageStore(state => state.language);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Wrapper>
      {/* AI 추천 병원 (응급 병원에서만 표시) */}
      {type !== "Clinic" && recommendedHospital && (
        <RecommendedWrapper>
          <HospitalItem
            name={recommendedHospital.name}
            address={recommendedHospital.addr}
            tel={recommendedHospital.dutyTel3}
            icuInfo={recommendedHospital.beds}
            recommended={true}
          />
        </RecommendedWrapper>
      )}

      {/* 병원 목록 */}
      <ListBody>
        {hospitalList.length === 0 && !recommendedHospital && (
          <div>
            {type !== noResultType
              ? "주변 병원을 검색해보세요!"
              : "반경 10km 안에 병원이 없습니다"} 
          </div>
        )}

        {hospitalList.map((hospital, idx) => {
          const name = language === "en" ? hospital.nameEn || hospital.name : hospital.name;
          const address = language === "en" ? hospital.addressEn || hospital.address || hospital.addrEn || hospital.addr : hospital.address || hospital.addr;

          return type === "Clinic" ? (
            <HospitalItem
              key={idx}
              name={name}
              address={address}
              tel={hospital.tel}
              recommended={false}
              type={'Clinic'}
            />
          ) : (
            <HospitalItem
              key={idx}
              name={hospital.name}
              address={hospital.addr}
              tel={hospital.dutyTel3}
              icuInfo={hospital.beds}
              recommended={false}
              type={'ER'}
            />
          );
        })}
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
`;

const ListBody = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

`;
