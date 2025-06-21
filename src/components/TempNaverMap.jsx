// src/components/TempNaverMap.jsx
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Reload from "../assets/reload.svg?react";
import Full from "../assets/full.svg?react";
import { useTranslation } from "react-i18next"; // useTranslation 훅 임포트

const TempNaverMap = ({ isPopupVisible, onMarkerClick, togglePopup }) => {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // 추가
  const { t, i18n } = useTranslation(); // useTranslation 훅 사용
  const infoWindowRef = useRef(null); // 1. InfoWindow 인스턴스를 useRef로 관리\
  const popupRef = useRef(null); // 2. 팝업 영역 ref
  const [popupVisible, setPopupVisible] = useState(isPopupVisible); // 3. 팝업 가시성 상태 (애니메이션 용)

  const [popupPosition, setPopupPosition] = useState({ top: 5, left: 14 });
  // const [selectedLanguage, setSelectedLanguage] = useState("kor"); // 이 상태는 이제 i18n.language로 대체됩니다.

  useEffect(() => {
    setPopupVisible(isPopupVisible); // isPopupVisible prop 변경 시 popupVisible 업데이트
  }, [isPopupVisible]);

  useEffect(() => {
    if (!window.naver || !mapElementRef.current) return;

    // InfoWindow 인스턴스를 한 번만 생성하여 useRef에 저장
    infoWindowRef.current = new window.naver.maps.InfoWindow({
      // content는 나중에 t() 함수로 번역된 텍스트로 설정됩니다.
      content: '<div style="padding:8px;"></div>',
      disableAutoPan: true, // 자동 팬 기능 비활성화로 InfoWindow가 지도를 움직이는 것을 방지
      maxWidth: 200, // 최대 너비 설정
      pixelOffset: new window.naver.maps.Point(0, -10), // 마커 상단에 위치하도록 오프셋 조정
    });

    // 🔹 위치 요청
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const userLocation = new window.naver.maps.LatLng(userLat, userLng);

        // 지도 생성
        const map = new window.naver.maps.Map(mapElementRef.current, {
          center: userLocation,
          zoom: 13,
        });
        mapRef.current = map;

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position: userLocation,
          map: map,
        });
        markerRef.current = marker;

        // 마커 클릭 이벤트 - 바텀시트 열기 및 InfoWindow 제어
        window.naver.maps.Event.addListener(marker, "click", function () {
          // InfoWindow 내용 업데이트 (클릭 시점에 현재 언어 반영)
          infoWindowRef.current.setContent(
            `<div style="padding:8px;">${t("current_location")}</div>`
          );

          // InfoWindow가 지도에 열려 있지 않거나, 열려있더라도 재클릭 시 닫히지 않도록 항상 엽니다.
          // 바텀시트가 열려 있을 때 InfoWindow가 사라지지 않도록 하는 핵심 수정
          if (
            !infoWindowRef.current.getMap() ||
            infoWindowRef.current.getMap() !== map
          ) {
            infoWindowRef.current.open(map, marker);
          }

          // 바텀시트 열기
          if (onMarkerClick) {
            onMarkerClick();
          }
        });

        // 지도 클릭 시 InfoWindow 닫기 (마커 클릭이 아닐 경우)
        window.naver.maps.Event.addListener(map, "click", function (e) {
          const lat = e.coord.lat();
          const lng = e.coord.lng();
          console.log("📍 마커 이동 - 위도:", lat, "경도:", lng);
          marker.setPosition(e.coord);
          // 지도 클릭 시 InfoWindow 닫기 (단, 마커 클릭으로 열린 것은 유지)
          if (infoWindowRef.current.getMap()) {
            infoWindowRef.current.close();
          }
        });
      },
      (error) => {
        console.error("위치 정보 가져오기 실패:", error);
        // fallback center 사용 (예: 안산시)
        const fallbackCenter = new window.naver.maps.LatLng(37.375, 126.6322);

        const map = new window.naver.maps.Map(mapElementRef.current, {
          center: fallbackCenter,
          zoom: 10,
        });
        mapRef.current = map;

        const marker = new window.naver.maps.Marker({
          position: fallbackCenter,
          map: map,
        });
        markerRef.current = marker;

        // fallback에서도 동일한 이벤트 추가
        window.naver.maps.Event.addListener(marker, "click", function () {
          infoWindowRef.current.setContent(
            `<div style="padding:8px;">${t("current_location")}</div>`
          );
          if (
            !infoWindowRef.current.getMap() ||
            infoWindowRef.current.getMap() !== map
          ) {
            infoWindowRef.current.open(map, marker);
          }
          if (onMarkerClick) {
            onMarkerClick();
          }
        });
        window.naver.maps.Event.addListener(map, "click", function (e) {
          const lat = e.coord.lat();
          const lng = e.coord.lng();
          console.log("📍 마커 이동 - 위도:", lat, "경도:", lng);
          marker.setPosition(e.coord);
          if (infoWindowRef.current.getMap()) {
            infoWindowRef.current.close();
          }
        });
      }
    );
  }, [onMarkerClick, t]); // t를 의존성 배열에 추가하여 언어 변경 시 useEffect 재실행

  useEffect(() => {
    if (isPopupVisible) {
      setPopupPosition({ top: 5, left: 14 });
    }
  }, [isPopupVisible]);

  // LanguageButton 클릭 핸들러: i18n.changeLanguage를 호출하여 언어 변경
  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
    setPopupVisible(false); // 언어 선택 후 팝업 닫기
    togglePopup(false);

    setTimeout(() => {}, 0); // 임시. 변경예정
    // togglePopup 함수를 직접 호출하는 게 아니라 props으로 전달받도록 코드를 수정하면 지울예정
    // 그 전까지는 callback 함수로 팝업 닫기
  };

  // 외부 영역 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupVisible &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setPopupVisible(false);
        // App.jsx의 팝업 상태도 업데이트해야 합니다.
        // 마찬가지로 콜백 함수를 사용하는 것이 좋습니다.
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupVisible]);

  return (
    <MapContainer ref={mapElementRef}>
      <TopCenterButton>
        <Reload />
        {t("search_nearby")} {/* 'search_nearby' 키로 번역 */}
      </TopCenterButton>
      <TopCenterIcon>
        <Full style={{ width: "32px", height: "32px" }} />
      </TopCenterIcon>

      {/* {isPopupVisible && (
        <Popup style={{ top: popupPosition.top, left: popupPosition.left }}>
          <LanguageButton
            onClick={() => handleLanguageSelect("ko")} // 한국어 버튼
            selected={i18n.language === "ko"} // 현재 언어가 한국어인지 확인
          >
            한국어
          </LanguageButton>
          <LanguageButton
            onClick={() => handleLanguageSelect("en")} // 영어 버튼
            selected={i18n.language === "en"} // 현재 언어가 영어인지 확인
          >
            English
          </LanguageButton>

          {/* 현재 언어 표시 (선택 사항) */}
      {/* <SelectedLanguage>
            {i18n.language === "ko"
              ? "현재 언어: 한국어"
              : "Current Language: English"}
          </SelectedLanguage> */}

      {/* </Popup> */}
      {/* )} */}

      <Popup
        style={{
          top: popupPosition.top,
          left: popupPosition.left,
          opacity: popupVisible ? 1 : 0, // 팝업 가시성에 따라 투명도 조절
          visibility: popupVisible ? "visible" : "hidden", // 팝업 가시성에 따라 보임/숨김 조절
        }}
        ref={popupRef} // ref 연결
      >
        <LanguageButton
          onClick={() => handleLanguageSelect("ko")}
          selected={i18n.language === "ko"}
        >
          한국어
        </LanguageButton>
        <LanguageButton
          onClick={() => handleLanguageSelect("en")}
          selected={i18n.language === "en"}
        >
          English
        </LanguageButton>
      </Popup>
    </MapContainer>
  );
};

export default TempNaverMap;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  position: relative;
  box-sizing: border-box;
`;

const Popup = styled.div`
  position: absolute;
  background-color: white;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border-radius: 8px;
  height: 50px;
  background-color: #f5f8fd;
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s ease-in-out;
`;

const LanguageButton = styled.button`
  background-color: ${({ selected }) => (selected ? "#52AEF9" : "#ffffff")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background-color: #52aef9;
    color: #fff;
  }
  height: 36px;
`;

const SelectedLanguage = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #333;
`;

const TopCenterButton = styled.button`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  padding: 8px 32px;
  background-color: #fff;
  font-family: "Kanit", sans-serif;
  font-weight: 900;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 201px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 35px;
`;

const TopCenterIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  transform: translateX(-50%);
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;
