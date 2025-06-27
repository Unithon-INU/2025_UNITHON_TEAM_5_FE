// components/HospitalDetailContent.jsx
import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// 아이콘 임포트
import PinIcon from "../assets/PinIcon.svg";
import ClockIcon from "../assets/ClockIcon.svg";
import ERIcon from "../assets/ERIcon.svg";
import PhoneIcon from "../assets/PhoneIcon.svg";
import WebIcon from "../assets/WebIcon.svg";

// 시간 포맷을 위한 헬퍼 함수
const formatTime = (time24, lang) => {
  if (!time24) return "";
  const [hour, minute] = time24.split(":").map(Number);
  const minuteStr = minute.toString().padStart(2, "0");

  if (lang === "ko") {
    const period = hour < 12 ? "오전" : "오후";
    let formattedHour = hour % 12;
    if (formattedHour === 0) formattedHour = 12;
    return `${period} ${formattedHour}:${minuteStr}`;
  } else {
    const period = hour < 12 ? "AM" : "PM";
    let formattedHour = hour % 12;
    if (formattedHour === 0) formattedHour = 12;
    return `${formattedHour}:${minuteStr} ${period}`;
  }
};

// App.jsx로부터 hospitalDetail 객체를 prop으로 전달받음
function HospitalDetailContent({ hospitalDetail }) {
  const { t, i18n } = useTranslation();

  // hospitalDetail prop이 없으면 아무것도 렌더링하지 않음
  if (!hospitalDetail) return null;

  return (
    <>
      {/* <ImageArea>
        <MainImage />
        <MainImage />
      </ImageArea> */}
      <InfoArea>
        <TypeArea>
          {hospitalDetail.hasER && (
            <HospitalTypeER>
              <span>{t("er_type")}</span>
            </HospitalTypeER>
          )}
          {hospitalDetail.hasClinic && (
            <HospitalTypeGeneral>
              <span>{t("clinic_type")}</span>
            </HospitalTypeGeneral>
          )}
        </TypeArea>

        {hospitalDetail.nameTranslated && (
          <TitleArea>
            <span>{hospitalDetail.nameTranslated}</span>
            <StatusOpen>{t("open_now")}</StatusOpen>
            {/* <StatusClosed>CLOSED</StatusClosed> */}
          </TitleArea>
        )}

        {hospitalDetail.nameOriginal && (
          <span>{hospitalDetail.nameOriginal}</span>
        )}

        <DetailsArea>
          {hospitalDetail.address && (
            <InfoRow>
              <img src={PinIcon} alt="address icon" />
              {hospitalDetail.address}
            </InfoRow>
          )}

          {hospitalDetail.openToday && (
            <InfoRow>
              <img src={ClockIcon} alt="time icon" />
              <span>{t("open_today")}</span>
              <EmphasizedText>
                {t("clinic_hours_format", {
                  startTime: formatTime(
                    hospitalDetail.openToday.startTime,
                    i18n.language
                  ),
                  endTime: formatTime(
                    hospitalDetail.openToday.endTime,
                    i18n.language
                  ),
                })}
              </EmphasizedText>
            </InfoRow>
          )}

          {hospitalDetail.openingHours && (
            <OpeningHours>
              <EmphasizedText>{t("opening_hours_clinic")}</EmphasizedText>
              {hospitalDetail.openingHours.map((rule, index) => {
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
          )}

          {hospitalDetail.hasER && (
            <InfoRow style={{ marginLeft: "-2px" }}>
              <img src={ERIcon} alt="er icon" style={{ marginTop: "-4px" }} />
              <span style={{ color: "#FF714A" }}>{t("er_available")}</span>
            </InfoRow>
          )}

          {hospitalDetail.phone && (
            <InfoRow>
              <img src={PhoneIcon} alt="phone icon" style={{ width: "14px" }} />
              {hospitalDetail.phone}
            </InfoRow>
          )}

          {/* {hospitalDetail.website && (
            <InfoRow>
              <img src={WebIcon} alt="website icon" />
              <a
                href={hospitalDetail.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hospitalDetail.website}
              </a>
            </InfoRow>
          )} */}
        </DetailsArea>
      </InfoArea>
    </>
  );
}

export default HospitalDetailContent;

// --- Styled Components ---
const ImageArea = styled.div`
  width: 100%;
  height: 129px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-shrink: 0;
`;

const MainImage = styled.div`
  width: 194px;
  height: 129px;
  background: #eee;
  background-image: url("https://via.placeholder.com/199x129");
  background-size: cover;
  background-position: center;
`;

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
  margin: 6px 0 6px 4px;

  span {
    color: #3a78eb;
    font-family: Roboto;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.25rem;
  }
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
