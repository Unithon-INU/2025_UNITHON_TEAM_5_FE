// components/HospitalDetailContent.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getHospitalById } from "../api/hospitalDetailApi"; // 새로 만든 API 함수 임포트

// 아이콘 임포트는 그대로 유지
import PinIcon from "../assets/PinIcon.svg";
import ClockIcon from "../assets/ClockIcon.svg";
import ERIcon from "../assets/ERIcon.svg";
import PhoneIcon from "../assets/PhoneIcon.svg";

// --- Helper Functions ---

// HHMM 형식의 시간을 AM/PM 또는 오전/오후 형식으로 변환
const formatTime = (timeHHMM, lang) => {
  if (!timeHHMM) return "";
  const hour = parseInt(timeHHMM.substring(0, 2), 10);
  const minute = timeHHMM.substring(2, 4);

  if (lang === "ko") {
    const period = hour < 12 ? "오전" : "오후";
    let formattedHour = hour % 12;
    if (formattedHour === 0) formattedHour = 12;
    return `${period} ${formattedHour}:${minute}`;
  } else {
    const period = hour < 12 ? "AM" : "PM";
    let formattedHour = hour % 12;
    if (formattedHour === 0) formattedHour = 12;
    return `${formattedHour}:${minute} ${period}`;
  }
};

// API 응답 데이터를 UI 렌더링에 적합한 구조로 가공
const transformData = (data, lang) => {
  if (!data) return null;

  // 1. 운영 시간 정보 가공
  const dayLabels = {
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
    7: "sun",
    8: "public_holiday",
  };
  const openingHours = [];
  let tempGroup = null;

  for (let i = 1; i <= 8; i++) {
    const startTime = data[`dutyTime${i}s`];
    const endTime = data[`dutyTime${i}c`];
    const currentDayLabel = dayLabels[i];

    if (
      tempGroup &&
      tempGroup.startTime === startTime &&
      tempGroup.endTime === endTime
    ) {
      tempGroup.days.push(currentDayLabel);
    } else {
      if (tempGroup) openingHours.push(tempGroup);
      tempGroup = {
        days: [currentDayLabel],
        startTime: startTime,
        endTime: endTime,
        isClosed: !startTime,
      };
    }
  }
  if (tempGroup) openingHours.push(tempGroup);

  // 2. 오늘 운영 정보 찾기
  // JS의 getDay()는 일요일=0, 월요일=1... 이고 API는 월요일=1, 화요일=2...일요일=7
  const todayIndex = new Date().getDay();
  const apiDayIndex = todayIndex === 0 ? 7 : todayIndex;
  const openToday = {
    startTime: data[`dutyTime${apiDayIndex}s`],
    endTime: data[`dutyTime${apiDayIndex}c`],
  };

  // 3. 최종 데이터 객체 반환
  return {
    name: lang === "en" ? data.dutyNameEn : data.dutyName,
    nameOriginal: lang === "en" ? data.dutyName : data.dutyNameEn,
    address: lang === "en" ? data.dutyAddrEn : data.dutyAddr,
    phone: data.dutyTel1,
    hasER: !!data.dutyTel3, // 응급실 전화번호 유무로 판단
    hasClinic: data.dutyDivNam !== "응급의료기관", // 예시: 분류명으로 일반진료 유무 판단
    openingHours,
    openToday,
  };
};

// --- Main Component ---

function HospitalDetailContent({ hpid }) {
  const { t, i18n } = useTranslation();

  // 컴포넌트 내부 상태
  const [hospitalData, setHospitalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hpid) return;

    const fetchHospitalDetails = async () => {
      setIsLoading(true);
      setError(null);
      setHospitalData(null);

      try {
        const data = await getHospitalById(hpid);
        // API 원본 데이터를 UI에 맞게 가공하여 상태에 저장
        setHospitalData(transformData(data, i18n.language));
        console.log("병원정보 : ", hospitalData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [hpid, i18n.language]); // hpid나 언어가 바뀔 때 다시 호출

  if (isLoading) {
    return <StatusContainer>{t("loading")}...</StatusContainer>;
  }

  if (error) {
    return (
      <StatusContainer isError={true}>
        {t("error_loading_detail")}
      </StatusContainer>
    );
  }

  if (!hospitalData) {
    return null; // 데이터가 없으면 아무것도 표시 안함
  }

  // --- JSX (렌더링 부분) ---
  return (
    <InfoArea>
      <TypeArea>
        {hospitalData.hasER && (
          <HospitalTypeER>
            <span>{t("er_type")}</span>
          </HospitalTypeER>
        )}
        {hospitalData.hasClinic && (
          <HospitalTypeGeneral>
            <span>{t("clinic_type")}</span>
          </HospitalTypeGeneral>
        )}
      </TypeArea>

      <TitleArea>
        <span>{hospitalData.name}</span>
        {hospitalData.openToday.startTime && (
          <StatusOpen>{t("open_now")}</StatusOpen>
        )}
      </TitleArea>
      {i18n.language === "en" ? (
        <OriginalName>{hospitalData.nameOriginal}</OriginalName>
      ) : null}

      <DetailsArea>
        <InfoRow>
          <img src={PinIcon} alt="address icon" />
          {hospitalData.address}
        </InfoRow>

        {hospitalData.openToday.startTime && (
          <InfoRow>
            <img src={ClockIcon} alt="time icon" />
            <span>{t("open_today")}</span>
            <EmphasizedText>
              {t("clinic_hours_format", {
                startTime: formatTime(
                  hospitalData.openToday.startTime,
                  i18n.language
                ),
                endTime: formatTime(
                  hospitalData.openToday.endTime,
                  i18n.language
                ),
              })}
            </EmphasizedText>
          </InfoRow>
        )}

        <OpeningHours>
          <EmphasizedText>{t("opening_hours_clinic")}</EmphasizedText>
          {hospitalData.openingHours.map((rule, index) => {
            const firstDay = t(rule.days[0]);
            const lastDay = t(rule.days[rule.days.length - 1]);
            const dayRangeText =
              rule.days.length > 1 ? `${firstDay} - ${lastDay}` : firstDay;

            if (rule.isClosed) {
              return (
                <p key={index}>
                  {t("closed_format", {
                    dayRange: dayRangeText,
                    dayOffText: t("regular_day_off"),
                  })}
                </p>
              );
            } else {
              return (
                <p key={index}>
                  {t("hours_format", {
                    dayRange: dayRangeText,
                    startTime: formatTime(rule.startTime, i18n.language),
                    endTime: formatTime(rule.endTime, i18n.language),
                  })}
                </p>
              );
            }
          })}
        </OpeningHours>

        {hospitalData.hasER && (
          <InfoRow style={{ marginLeft: "-2px" }}>
            <img src={ERIcon} alt="er icon" style={{ marginTop: "-4px" }} />
            <span style={{ color: "#FF714A" }}>{t("er_available")}</span>
          </InfoRow>
        )}

        {hospitalData.phone && (
          <InfoRow>
            <img src={PhoneIcon} alt="phone icon" style={{ width: "14px" }} />
            {hospitalData.phone}
          </InfoRow>
        )}
      </DetailsArea>
    </InfoArea>
  );
}

export default HospitalDetailContent;

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.1rem;
  color: ${(props) => (props.isError ? "red" : "#555")};
`;

// const ImageArea = styled.div`
//   width: 100%;
//   height: 129px;
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   flex-shrink: 0;
// `;

// const MainImage = styled.div`
//   width: 194px;
//   height: 129px;
//   background: #eee;
//   background-image: url("https://via.placeholder.com/199x129");
//   background-size: cover;
//   background-position: center;
// `;

const HospitalTypeGeneral = styled.div`
  border: none;
  background-color: #3a78eb;
  width: 68px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: white;
    font-size: 12px;
    font-weight: 600;
    font-family: Inter;
  }
`;

const HospitalTypeER = styled(HospitalTypeGeneral)`
  background-color: #ff714a;
`;

const InfoArea = styled.div`
  width: 100%;
  padding: 20px;
  /* padding: 0.5rem 1.25rem; */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const TypeArea = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 4px;
  gap: 12px;
`;

const TitleArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0 0.5rem 0.25rem;

  span {
    color: #3a78eb;
    font-family: Roboto;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.25rem;
  }
`;

const OriginalName = styled.span`
  font-size: 1rem;
  color: #565656;
  margin-left: 0.25rem;
`;

const StatusOpen = styled.div`
  border-radius: 1rem;
  border: 0.75px solid #3a78eb;
  background: #f9f9f9;
  width: 5.75rem;
  height: 1.5rem;
  margin-right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3a78eb;
  font-family: Inter;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const StatusClosed = styled.div`
  border-radius: 1rem;
  border: 0.75px solid #565656;
  background: #f9f9f9;
  width: 5.75rem;
  height: 1.5rem;
  margin-right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #565656;
  font-family: Inter;
  font-size: 0.75rem;
  font-weight: 700;
`;

const DetailsArea = styled.div`
  width: 100%;
  margin: 10px 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 14px;
  color: #565656;
  gap: 0.5rem;

  img {
    width: 16px;
    height: 16px;
  }
`;

const EmphasizedText = styled.span`
  font-weight: bold;
  color: #3a78eb;
`;

const OpeningHours = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #565656;
  margin: 0.5rem 0 0.5rem 24px;
  p {
    margin: 4px 0;
  }
`;
