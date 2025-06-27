import React from "react";
import styled from "styled-components";
import HospitalItem from "./HospitalItem";
import useLanguageStore from "../store/languageStore";

// icons
import LoadingAnimation from "../assets/LoadingAnimation.gif";

const isDev = false;

export default function HospitalList({ hospitalList, type, recommendedHospital, isLoading ,noResultType,isopen,setShowHospitalDetail}) {
  const language = useLanguageStore(state => state.language);
  if (isDev) {
    return (
      <Wrapper>
        <LoadingContainer>
          <img src={LoadingAnimation} alt="Loading..." />
        </LoadingContainer>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      {isLoading ? (
        <LoadingContainer>
          <img src={LoadingAnimation} alt="Loading..." />
        </LoadingContainer>
      ) : (
        <>
          {type !== "Clinic" && recommendedHospital && (
            <RecommendedWrapper>
              <HospitalItem
                name={recommendedHospital.name}
                address={recommendedHospital.addr}
                tel={recommendedHospital.dutyTel3}
                icuInfo={recommendedHospital.beds}
                reason={recommendedHospital.reason}
                recommended={true}
            onClick={() => setShowHospitalDetail(recommendedHospital.hpid)}
              />
            </RecommendedWrapper>
          )}

          {/* 병원 목록 */}
          <ListBody>
            {hospitalList.length === 0 && !recommendedHospital && (
              <NoResultContainer>
                {type !== noResultType ? (
                  <>
                    {type === "Clinic" ? (
                      <p>
                        <span>주변 병원을 검색해보세요!</span>
                        <br />
                        <br />
                        <div>
                          1. 지도에서 원하는 위치 터치
                          <br />
                          2. 진료과 선택
                        </div>
                      </p>
                    ) : (
                      <p>
                        <span>주변 응급실을 검색해보세요!</span>
                        <br />
                        <br />
                        <div>
                          1. 지도에서 원하는 위치 터치
                          <br />
                          2. '현 지도에서 검색' 클릭
                        </div>
                      </p>
                    )}
                  </>
                ) : (
                  <span>반경 10km 안에 병원이 없습니다</span>
                )}
              </NoResultContainer>
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
              isOpen={hospital.isOpen}
              onClick={() => setShowHospitalDetail(hospital.hpid)}


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
              onClick={() => setShowHospitalDetail(hospital.hpid)}

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

const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 10rem; // 로딩 이미지 크기 조절
  }
`;

const NoResultContainer = styled(LoadingContainer)`
  height: 24rem;
  // 로딩 컨테이너 스타일 재사용
  color: #888;
  text-align: center;
  font-size: 1rem;

  span {
    color: black;
    font-weight: 700;
  }
`;

const RecommendedWrapper = styled.div`
  border-top: 2px solid lightblue;
`;

const ListBody = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* border-top: 1px solid gray; */
`;
