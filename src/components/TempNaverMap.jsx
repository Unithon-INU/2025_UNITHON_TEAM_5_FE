import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Reload from "../assets/reload.svg?react";
import Full from "../assets/full.svg?react";
import { useTranslation } from "react-i18next";
import useLocationStore from "../store/locationStore";
import Gps from "../assets/gps.svg?react";
import GpsIcon from "../assets/GpsIcon.svg";
import useLanguageStore from "../store/languageStore";
import { getHospitalById } from "../api/hospitalDetailApi"; // 새로 만든 API 함수 임포트

const TempNaverMap = ({
  isPopupVisible,
  onMarkerClick,
  togglePopup,
  onSearchNearby,
  hospitalMarkers = [], // [{ lat, lon, hpid, name }]
}) => {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const hospitalMarkerRefs = useRef([]); // 여러 병원 마커 관리용
  const infoWindowRef = useRef(null);
  const popupRef = useRef(null);

  const setUserLocation = useLocationStore((state) => state.setUserLocation);
  const setInitialUserLocation = useLocationStore(
    (state) => state.setInitialUserLocation
  );
  const initialUserLocation = useLocationStore(
    (state) => state.initialUserLocation
  );
  const didRunNearbySearch = useRef(false);

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const { t, i18n } = useTranslation();

  const [popupPosition, setPopupPosition] = useState({ top: 5, left: 14 });
  const DEFAULT_ZOOM = 13;

  

  const handleGoToInitialLocation = () => {
    const { lat, lon } = useLocationStore.getState().initialUserLocation || {};

    if (!lat || !lon) {
      console.warn("최초 위치가 설정되어 있지 않습니다.");
      return;
    }

    const newPosition = new window.naver.maps.LatLng(lat, lon);

    // 지도 중심 이동
    if (mapRef.current) {
      mapRef.current.setCenter(newPosition);
    }

    // 사용자 마커 이동
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(newPosition);
    }

    setUserLocation(lat, lon);
  };

  // 초기 지도 및 사용자 마커 생성
  useEffect(() => {
    console.log("초기지도발동");
    if (!window.naver || !mapElementRef.current) return;

    // InfoWindow 초기화
    infoWindowRef.current = new window.naver.maps.InfoWindow({
      content: '<div style="padding:8px;"></div>',
      disableAutoPan: true,
      maxWidth: 200,
      pixelOffset: new window.naver.maps.Point(0, -10),
    });

    const onPositionSuccess = (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      setUserLocation(userLat, userLng);

      setInitialUserLocation(userLat, userLng);

      const userLocation = new window.naver.maps.LatLng(userLat, userLng);

      const map = new window.naver.maps.Map(mapElementRef.current, {
        center: userLocation,
        zoom: DEFAULT_ZOOM,
      });
      mapRef.current = map;

      // 사용자 마커 생성
      const userMarker = new window.naver.maps.Marker({
        position: userLocation,
        map,
        title: t("current_location"),
        icon: {
          content:
            '<div style="background:#1976d2; border-radius:50%; width:16px; height:16px; border:3px solid white;"></div>',
        },
      });
      userMarkerRef.current = userMarker;

      
      // 지도 클릭 시 사용자 마커 위치 이동 및 InfoWindow 닫기
      map.addListener("click", (e) => {
        const lat = e.coord.lat();
        const lng = e.coord.lng();
        userMarker.setPosition(e.coord);
        setUserLocation(lat, lng);
        if (infoWindowRef.current.getMap()) {
          infoWindowRef.current.close();
        }
      });
    };

    const onPositionError = (error) => {
      console.error("위치 정보 가져오기 실패:", error);
      const fallbackCenter = new window.naver.maps.LatLng(37.375, 126.6322);
      const map = new window.naver.maps.Map(mapElementRef.current, {
        center: fallbackCenter,
        zoom: 10,
      });
      mapRef.current = map;

      const userMarker = new window.naver.maps.Marker({
        position: fallbackCenter,
        map,
        title: t("current_location"),
        icon: {
          content:
            '<div style="background:#1976d2; border-radius:50%; width:16px; height:16px; border:3px solid white;"></div>',
        },
      });
      userMarkerRef.current = userMarker;

      userMarker.addListener("click", () => {
        infoWindowRef.current.setContent(
          `<div style="padding:8px;">${t("current_location")}</div>`
        );
        if (
          !infoWindowRef.current.getMap() ||
          infoWindowRef.current.getMap() !== map
        ) {
          infoWindowRef.current.open(map, userMarker);
        }
        onMarkerClick && onMarkerClick();
      });

      // fallback 지도 클릭 시 사용자 마커 위치 이동 및 InfoWindow 닫기
      map.addListener("click", (e) => {
        const lat = e.coord.lat();
        const lng = e.coord.lng();
        userMarker.setPosition(e.coord);
        setUserLocation(lat, lng);
        if (infoWindowRef.current.getMap()) {
          infoWindowRef.current.close();
        }
      });
    };

    navigator.geolocation.getCurrentPosition(
      onPositionSuccess,
      onPositionError
    );
  }, [setUserLocation]);

  useEffect(() => {

  if (
    !didRunNearbySearch.current &&
    initialUserLocation &&
    initialUserLocation.lat &&
    initialUserLocation.lon &&
    typeof onSearchNearby === "function"
  ) {
    onSearchNearby(); // ✅ 언어 인자로 전달
    didRunNearbySearch.current = true;
  }
}, [initialUserLocation, onSearchNearby]);


  // hospitalMarkers 변경 시 마커 추가/갱신
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    // 기존 병원 마커 모두 제거
    hospitalMarkerRefs.current.forEach((m) => m.setMap(null));
    hospitalMarkerRefs.current = [];

    hospitalMarkers.forEach(({ lat, lng, hpid, name }) => {
      const position = new window.naver.maps.LatLng(lat, lng);
      const marker = new window.naver.maps.Marker({
        position,
        map: mapRef.current,
        title: name || hpid || "병원",
        icon: {
          url: "/hospital.svg",
          size: new window.naver.maps.Size(18, 18),
          scaledSize: new window.naver.maps.Size(18, 18),
          anchor: new window.naver.maps.Point(9, 9), // 중심으로 맞춤 (18의 절반)
        },
      });

      const customInfoWindowEl = document.createElement("div");
      customInfoWindowEl.className = "custom-info-window";
      customInfoWindowEl.innerHTML = `
        <div class="info-box">
          <strong>${name || "병원"}</strong><br/>
        
        </div>
      `;

    const customInfoWindow = new window.naver.maps.InfoWindow({
      content: customInfoWindowEl,
      borderWidth: 0,
      disableAnchor: true,
      backgroundColor: "transparent",
      pixelOffset: new window.naver.maps.Point(0, -20),
    });

      marker.addListener("click", async () => {
  // 병원 기본 이름만 먼저 보여줌 (로딩 중 상태 대비)
  customInfoWindowEl.innerHTML = `
    <div class="info-box">
      <strong style="color:#3A78EB; font-weight: 600;">${name || "병원"}</strong><br/>
      <span>정보를 불러오는 중...</span>
    </div>
  `;
  customInfoWindow.open(mapRef.current, marker);

  // API 요청
  try {
  const data = await getHospitalById(hpid);

  const contentHTML = `
    <div class="info-box">
      <div class="hospital-title" style="color:#3A78EB; font-weight:600;">${data.dutyNameEn || "병원"}</div>
      <div style="font-size:13px;">${data.dutyName || "병원 상세명 없음"}</div>
      <div style="font-size:13px; color:#666;">${data.dutyTel1 || "연락처 없음"}</div>
    </div>
  `;

  customInfoWindowEl.innerHTML = contentHTML;

  // 실제 DOM 삽입 후 줄 수 측정
  const titleElement = customInfoWindowEl.querySelector(".hospital-title");

  // 강제로 DOM 반영 후 측정 (줄 수 계산)
  setTimeout(() => {
    const lineHeight = 18; // 예상 줄 높이 (px)
    const lines = Math.ceil(titleElement.clientHeight / lineHeight);

    // 기본 offset에서 + 줄 수에 따라 5~10px씩 추가
    const offsetY = 5 + (lines - 2) * 5;

    customInfoWindow.setOptions({
      pixelOffset: new window.naver.maps.Point(0, -offsetY),
    });

    customInfoWindow.open(mapRef.current, marker);
  }, 0);
} catch (err) {
  customInfoWindowEl.innerHTML = `
    <div class="info-box">
      <strong style="color:#3A78EB;">${name || "병원"}</strong><br/>
      <span style="color:red;">정보를 불러오지 못했습니다.</span>
    </div>
  `;
  customInfoWindow.open(mapRef.current, marker);
}


  onMarkerClick && onMarkerClick(hpid);
});

hospitalMarkerRefs.current.push(marker);
    });
  }, [hospitalMarkers, onMarkerClick]);

  useEffect(() => {
    if (isPopupVisible) {
      setPopupPosition({ top: 5, left: 14 });
    }
  }, [isPopupVisible]);

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);

    togglePopup(false);
    setLanguage(language);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isPopupVisible &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        togglePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible, togglePopup]);

  return (
    <MapContainer ref={mapElementRef}>
      <TopCenterButton onClick={onSearchNearby}>
        <Reload />
        {t("search_nearby")}
      </TopCenterButton>

      <Popup
        style={{
          top: popupPosition.top,
          left: popupPosition.left,
          opacity: isPopupVisible ? 1 : 0,
          visibility: isPopupVisible ? "visible" : "hidden",
        }}
        ref={popupRef}
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
      {/* <GpsIcon onClick={handleGoToInitialLocation} /> */}
      <GpsImg src={GpsIcon} onClick={handleGoToInitialLocation} />
    </MapContainer>
  );
};

export default TempNaverMap;

const MapContainer = styled.div`
  width: 100%;
  min-height: 400px;
  position: relative;
  box-sizing: border-box;
`;

const Popup = styled.div`
  position: absolute;
  background-color: white;
  padding: 8px;
  z-index: 10;
  border-radius: 8px;
  height: 50px;
  background-color: #f5f8fd;
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s ease-in-out;

  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
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
  font-size: 14px;
  border: none;
  border-radius: 16px;
  cursor: pointer;

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
`;

// const GpsIcon = styled(Gps)`
//   position: absolute;
//   bottom: 20px;
//   right: 0;
//   transform: translateX(-50%);
//   z-index: 1;
//   width: 32px;
//   height: 32px;
// `;

const GpsImg = styled.img`
  position: absolute;
  bottom: 20px;
  right: 0;
  transform: translateX(-50%);
  z-index: 1;
  width: 32px;
  height: 32px;

  cursor: pointer;
`;
