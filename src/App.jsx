// App.jsx
import React, { useCallback,useState, useEffect, useRef } from "react";
import NaverMap from "./components/NaverMap";
import "./App.css";
import CommonBox from "./CommonBox";
import Header from "./components/Header";
import ToggleSwitch from "./components/ToggleSwitch";
import styled from "styled-components";

import HospitalList from "./components/HospitalList";
import HospitalItemBody from "./components/HospitalItemBody";
import BottomSheet from "./components/BottomSheet";
import useLocationStore from "./store/locationStore";
import { getEmergency,getEmergencyInfo } from "./api/emergencyApi";
// icons
import DownArrow from "./assets/DownArrow.svg?react";
import PinIcon from "./assets/PinIcon.svg";
import ClockIcon from "./assets/ClockIcon.svg";
import ERIcon from "./assets/ERIcon.svg";
import PhoneIcon from "./assets/PhoneIcon.svg";
import WebIcon from "./assets/WebIcon.svg";
import TempNaverMap from "./components/TempNaverMap";
import { IoIosArrowDown } from "react-icons/io"; // 화살표 아이콘

// i18n
import { useTranslation } from "react-i18next";

const formatTime = (time24, lang) => {
  if (!time24) return "";
  const [hour, minute] = time24.split(":").map(Number);
  const minuteStr = minute.toString().padStart(2, "0");

  if (lang === "ko") {
    const period = hour < 12 ? "오전" : "오후";
    let formattedHour = hour % 12;
    if (formattedHour === 0) formattedHour = 12; // 0시는 오후 12시가 아닌 오전 12시로, 12시는 오후 12시로
    return `${period} ${formattedHour}:${minuteStr}`;
  }
  // 기본값 (영어)
  else {
    const period = hour < 12 ? "AM" : "PM";
    let formattedHour = hour % 12;
    if (formattedHour === 0) formattedHour = 12; // 0시는 12 AM
    return `${formattedHour}:${minuteStr} ${period}`;
  }
};

function App() {
  // i18n 초기화
  const { t, i18n } = useTranslation();

  const regionRef = useRef(null);
  const districtRef = useRef(null);
  const fetchHospitalsRef = useRef(null);

  const [selected, setSelected] = useState("ER");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [stage1dropdownOpen, setStage1DropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("서울특별시");
  const [stage2dropdownOpen, setStage2DropdownOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("강남구");
  const [DeptDropdown, setDeptDropdown] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const toggleStage1Dropdown = () => setStage1DropdownOpen((prev) => !prev);
  const toggleStage2Dropdown = () => setStage2DropdownOpen((prev) => !prev);
  const toggleDeptDropdown = () => setDeptDropdown((prev) => !prev);
  const togglePopup = () => setIsPopupVisible((prev) => !prev);

  const userLocation = useLocationStore((state) => state.userLocation);
  const [hospitalMarkers, setHospitalMarkers] = useState([]);
  const [hospitalDetails, setHospitalDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isMyLocOpen, setIsMyLocOpen] = useState(false);
  const [myLocationAddress,setMyLocationAddress] =useState();
  const reverseGeocode = (lat, lng) => {
  return new Promise((resolve, reject) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      reject("Naver Maps API is not loaded");
      return;
    }

    window.naver.maps.Service.reverseGeocode(
      {
        coords: new window.naver.maps.LatLng(lat, lng),
        orders: [window.naver.maps.Service.OrderType.ADDR], // 주소 결과만 요청
      },
      (status, response) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          reject(status);
          return;
        }

        const result = response.v2;
        const address = result.address; // 주소 정보

        // 주소 구성 요소를 원하는 대로 조합
        // jibunAddress(지번 주소), roadAddress(도로명 주소) 중 우선순위 정해 사용
        const formattedAddress =
          address.jibunAddress || address.roadAddress || "주소 정보 없음";

        resolve(formattedAddress);
      }
    );
  });
};


  const fetchHospitalsNearby = async () => {
    if (!userLocation) {
      alert("현재 위치를 먼저 확인해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const emergencyData = await getEmergency(userLocation.lat, userLocation.lon, 10);
      const hospitals = emergencyData || [];
      console.log('emer',emergencyData)
            console.log('hs',hospitals)


      setHospitalMarkers(hospitals.map(h => ({
        hpid: h.hpid,
        lat: h.lat,
        lng: h.lng,
        name: h.name,
      })));

      const emergencyInfoData = await getEmergencyInfo(userLocation.lat, userLocation.lon, 10);
      console.log('se',emergencyInfoData)
      const details = emergencyInfoData || [];
      console.log('detail',details)



      const mergedDetails = hospitals.map(h => {
        const detail = details.find(d => d.hpid === h.hpid) || {};
        return {
          hpid: h.hpid,
          name: h.name,
          lat: h.lat,
          lng: h.lng,
          addr: h.address,   // 주소는 getEmergency에서
          ...detail, 
        };
      });
      console.log('멎ㅣ',mergedDetails)

      setHospitalDetails(mergedDetails);
    } catch (error) {
      console.error("병원 정보 불러오기 실패", error);
      setHospitalMarkers([]);
      setHospitalDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 바텀 시트에 들어갈 상태
  const [hospitalDetail, setHospitalDetail] = useState({
    nameTranslated: "Seoul-University Hospital", // 번역된 병원 이름
    nameOriginal: "서울대학교 병원 / Seoul Daehakgyo Byeongwon", // 한글 + 영문 로마자
    address: "서울 종로구 대학로 101 (6.2km)", // 주소
    openToday: {
      startTime: "09:00",
      endTime: "22:00",
      type: "Clinic",
    },
    openingHours: [
      {
        days: ["mon", "tue", "wed", "thu", "fri"], // 적용 요일 (번역 키와 일치시킴)
        startTime: "09:00",
        endTime: "22:00",
      },
      {
        days: ["sat"],
        startTime: "09:00",
        endTime: "13:00",
      },
      {
        days: ["sun"],
        isClosed: true, // 휴무일 여부
      },
    ],
    hasER: true, // 응급실 유무
    hasClinic: true, // 일반 진료 유무
    phone: "02-111-2221", // 전화번호
    website: "https://www.snuh.org/", // 홈페이지
  });

  // Bottom Sheet 전체 열기/닫기
  const [showHospitalDetail, setShowHospitalDetail] = useState(false);

  const handleMarkerClick = useCallback((hpid) => {
    
  setSelectedHospital(hpid);
  setShowHospitalDetail(true);
}, []);


  const deptList = [
    "Internal Medicine",
    "Pediatrics",
    "Orthopedics",
    "Otolaryngology",
    "Dermatology",
  ];

  

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setStage1DropdownOpen(false);
  };
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setStage2DropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (regionRef.current && !regionRef.current.contains(e.target)) {
        setStage1DropdownOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(e.target)) {
        setStage2DropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [regionRef, districtRef]);
  useEffect(() => {
  if (!userLocation) return;

  reverseGeocode(userLocation.lat, userLocation.lon)
    .then(address => {
      setMyLocationAddress(address);
    })
    .catch(() => {
      setMyLocationAddress("주소 변환 실패");
    });
}, [userLocation]);



  return (
    <CommonBox>
      <Header onGlobeClick={togglePopup}>
        <ToggleSwitch selected={selected} setSelected={setSelected} />
      </Header>
      <TempNaverMap
        isPopupVisible={isPopupVisible}
        onMarkerClick={handleMarkerClick}
        togglePopup={togglePopup}
        onSearchNearby={fetchHospitalsNearby}
        hospitalMarkers={hospitalMarkers}
      />

      {selected === "Clinic" && (
        <DeptDiv>
          <DeptButton onClick={toggleDeptDropdown}>
            Select Department <StyleDown />
          </DeptButton>
          {DeptDropdown && (
            <Dropdown>
              {deptList.map((dept, idx) => (
                <DropdownItem key={idx}>{dept}</DropdownItem>
              ))}
            </Dropdown>
          )}
          <LocRow>
              <MylocateDiv>
                {myLocationAddress}
                {isMyLocOpen && (
              <LocationPopup>
                {myLocationAddress}
              </LocationPopup>
            )}
              </MylocateDiv>
              <ArrowIcon open={isMyLocOpen} onClick={() => setIsMyLocOpen(prev => !prev)} />
            </LocRow>

        </DeptDiv>
      )}

      {selected === "ER" && (
        <DropdownContainer>
          <ERdiv>
            <LocRow>
              <MylocateDiv>
                {myLocationAddress}
                {isMyLocOpen && (
              <LocationPopup>
                {myLocationAddress}
              </LocationPopup>
            )}
              </MylocateDiv>
              <ArrowIcon open={isMyLocOpen} onClick={() => setIsMyLocOpen(prev => !prev)} />
            </LocRow>


          </ERdiv>
          
        </DropdownContainer>
      )}
      
      <HospitalList
        hospitalList={hospitalDetails}
        isLoading={isLoading}
      />
      {/* isOpen prop: true이면 바텀 시트가 화면에 나타남 */}
      {/* <HospitalItemBody
        isOpen={showHospitalDetail}
        onClose={() => setShowHospitalDetail(false)}
      /> */}
      <BottomSheet
        isOpen={showHospitalDetail}
        onClose={() => setShowHospitalDetail(false)}
      >
        <ImageArea>
          <MainImage />
          <MainImage />
        </ImageArea>

        <InfoArea>
          <TypeArea>
            {/* hospitalDetail의 값에 따라 조건부 렌더링 및 t 함수로 번역 */}
            {hospitalDetail.hasER && (
              <HospitalTypeER>{t("er_type")}</HospitalTypeER>
            )}
            {hospitalDetail.hasClinic && (
              <HospitalTypeGeneral>{t("clinic_type")}</HospitalTypeGeneral>
            )}
            {/* <HospitalTypeER>ER</HospitalTypeER>
            <HospitalTypeGeneral>Clinic</HospitalTypeGeneral> */}
          </TypeArea>

          {/* 번역된 병원명 */}
          {hospitalDetail.nameTranslated && (
            <TitleArea>
              <span>{hospitalDetail.nameTranslated}</span>
              <StatusOpen>{t("open_now")}</StatusOpen>
              {/* <StatusClosed>CLOSED</StatusClosed> */}
            </TitleArea>
          )}

          {/* 병원 한글명 / 영문명 */}
          {hospitalDetail.nameOriginal && (
            <span>{hospitalDetail.nameOriginal}</span>
          )}

          <DetailsArea>
            {/* 주소 */}
            {hospitalDetail.address && (
              <InfoRow>
                <img src={PinIcon} />
                {hospitalDetail.address}
              </InfoRow>
            )}

            {/* 오늘 운영 시간 */}
            {hospitalDetail.openToday && (
              <InfoRow>
                <img src={ClockIcon} />
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

            {/* 요일별 운영 시간 */}
            {hospitalDetail.openingHours && (
              <OpeningHours>
                <EmphasizedText>{t("opening_hours_clinic")}</EmphasizedText>
                {hospitalDetail.openingHours.map((rule, index) => {
                  // 요일 범위 텍스트 정의 (ex. "월 - 금", "토", "일")
                  const firstDay = t(rule.days[0]); // hospitalDetail에서 days에 "mon"과 같은 양식으로 translation.json에 들어가는 키값과 동일하게 하였으므로 자동 번역됨
                  const lastDay = t(rule.days[rule.days.length - 1]);
                  const dayRangeText =
                    rule.days.length > 1
                      ? `${firstDay} - ${lastDay}`
                      : firstDay;

                  // 휴무일 여부에 따라 다른 번역  키 사용하기
                  if (rule.isClosed) {
                    return (
                      <p key={index}>
                        {t("closed_format", {
                          dayRange: dayRangeText,
                          dayOffText: t("regular_day_off"), // "휴무일" 번역 사용
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

            {/* 응급실 가능 여부 */}
            {hospitalDetail.hasER && (
              <InfoRow style={{ marginLeft: "-2px" }}>
                <img src={ERIcon} style={{ marginTop: "-4px" }} />
                <span style={{ color: "#FF714A" }}>{t("er_available")}</span>
              </InfoRow>
            )}

            {/* 전화번호 */}
            {hospitalDetail.phone && (
              <InfoRow>
                <img src={PhoneIcon} style={{ width: "14px" }} />
                {hospitalDetail.phone}
              </InfoRow>
            )}

            {/* 웹사이트 */}
            {hospitalDetail.website && (
              <InfoRow>
                <img src={WebIcon} />
                <a href={hospitalDetail.website}>{hospitalDetail.website}</a>
              </InfoRow>
            )}
          </DetailsArea>
        </InfoArea>
      </BottomSheet>
    </CommonBox>
  );
}

export default App;

const DeptDiv = styled.div`
  padding: 8px 16px;
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  border-bottom:solid 1px gray;
`;

const DropdownContainer = styled.div`
  padding: 8px 16px;
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-bottom:solid 1px gray;
`;

const StyleDown = styled(DownArrow)`
  width: 10px;
  height: 7px;
`;

const DeptButton = styled.button`
  width: 165px;
  height: 32px;
  background-color: #52aef9;
  color: #fff;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 16px;
  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  margin: 0.5rem;
`;

const RegionButton = styled.button`
  width: ${({ $isNarrow }) => ($isNarrow ? "110px" : "140px")};
  @media (max-width: 400px) {
    width: 100px;
    font-size: 12px;
  }
  height: 2rem;
  background-color: #52aef9;
  color: #fff;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 41px;
  width: 140px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 5;
  
`;

const DropdownItem = styled.div`
  padding: 8px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
  
`;

const FetchButton = styled.button`
  height: 2rem;
  padding: 0 16px;
  margin-left: 0.25px;
  background-color: #fff;
  color: #52aef9;
  border: 2px solid #52aef9;
  border-radius: 12px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #c5e5fe;
  }
`;

const ShowDetailButton = styled.button`
  height: 2rem;
  padding: 0 12px;
  margin-left: 0.5rem;
  background-color: #f2f2f2;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const LocRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
`;

const MylocateDiv = styled.div`
  font-size: 14px;
  font-family: "Kanit", sans-serif;
  font-weight: 900;
  width: 153px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;



// 바텀 시트 관련 UI

const ImageArea = styled.div`
  width: 100%;
  height: 129px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const MainImage = styled.div`
  width: 194px;
  height: 129px;
  background: #eee;
  /* border-radius: 16px; */
  /* margin: 40px auto 0 auto; */
  background-image: url("https://via.placeholder.com/199x129");
  background-size: cover;
  background-position: center;
`;

const HospitalName = styled.div`
  /* font-family: "Kanit", sans-serif; */
  font-size: 24px;
  font-weight: 700;
  color: #3a78eb;
  margin: 2.5rem 0 0 1.5rem;
`;

const HospitalTypeGeneral = styled.div`
  border: none;
  background-color: #3a78eb;

  width: 68px;
  height: 24px;

  color: white;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  /* margin: 2.5rem 0 0 1.5rem; */
`;

const HospitalTypeER = styled.div`
  border: none;
  background-color: #ff714a;

  width: 68px;
  height: 24px;

  color: white;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
`;

const InfoArea = styled.div`
  width: 100%;
  /* height: 100px; */
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
`;

const TypeArea = styled.div`
  display: flex;
  justify-content: flex-start;
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
    font-style: normal;
    font-weight: 700;
    line-height: 1.25rem; /* 100% */
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
  /* text-align: center; */

  color: #3a78eb;
  font-family: Inter;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
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
  /* text-align: center; */

  color: #565656;
  font-family: Inter;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
`;

const DetailsArea = styled.div`
  width: 100%;
  height: 100%;
  margin: 10px 4px;
  /* padding: 0 16px; */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 14px;
  color: #565656;

  gap: 0.5rem;
`;

const EmphasizedText = styled.span`
  font-weight: bold;
  color: #3a78eb;
`;

const OpeningHours = styled.div`
  /* font-family: "Kanit", sans-serif; */
  font-size: 14px;
  font-weight: 500;
  color: #565656;
  margin: 0.5rem 22px;

  p {
    margin: 4px 0;
  }
`;

const ERdiv=styled.div`
  display:flex;
  justify-content: flex-end;
  width: 100%;

`

const LocationPopup = styled.div`
  position: absolute;
  top: calc(100% + 4px); /* 아래로 띄우기 */
  right: 0;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  z-index: 20;
  width: max-content;
  max-width: 260px;
  font-size: 13px;
  color: black;
  white-space: normal;
  word-break: break-word;
`;

const ArrowIcon = styled(IoIosArrowDown)`
  
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
  cursor: pointer;
  color: black;
`;