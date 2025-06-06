import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Reload from "../assets/reload.svg?react";
import Full from "../assets/full.svg?react";

const NaverMap = ({ isPopupVisible }) => {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [popupPosition, setPopupPosition] = useState({ top: 5, left: 14 });
  const [selectedLanguage, setSelectedLanguage] = useState('kor');

  useEffect(() => {
    if (!window.naver || !mapElementRef.current) return;

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

        // InfoWindow 예시 (선택)
        const infoWindow = new window.naver.maps.InfoWindow({
          content: '<div style="padding:8px;">현재 위치입니다</div>'
        });

        window.naver.maps.Event.addListener(marker, 'click', function () {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        });

        // 지도 클릭 시 마커 이동
        window.naver.maps.Event.addListener(map, 'click', function (e) {
          const lat = e.coord.lat();
          const lng = e.coord.lng();
          console.log('📍 마커 이동 - 위도:', lat, '경도:', lng);
          marker.setPosition(e.coord);
          infoWindow.close();
        });
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        // fallback center 사용 (예: 안산시)
        const fallbackCenter = new window.naver.maps.LatLng(37.3750, 126.6322);

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
      }
    );
  }, []);

  useEffect(() => {
    if (isPopupVisible) {
      setPopupPosition({ top: 5, left: 14 });
    }
  }, [isPopupVisible]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <MapContainer ref={mapElementRef}>
      <TopCenterButton><Reload />Search nearby</TopCenterButton>
      <TopCenterIcon><Full style={{ width: '32px', height: '32px' }} /></TopCenterIcon>

      {isPopupVisible && (
        <Popup style={{ top: popupPosition.top, left: popupPosition.left }}>
          <LanguageButton
            onClick={() => handleLanguageSelect('kor')}
            selected={selectedLanguage === 'kor'}
          >
            한국어
          </LanguageButton>
          <LanguageButton
            onClick={() => handleLanguageSelect('eng')}
            selected={selectedLanguage === 'eng'}
          >
            English
          </LanguageButton>

          <SelectedLanguage>
            {selectedLanguage === 'kor' ? '현재 언어: 한국어' : 'Current Language: English'}
          </SelectedLanguage>
        </Popup>
      )}
    </MapContainer>
  );
};

export default NaverMap;

// 스타일 컴포넌트는 그대로 유지



const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  position: relative;
  box-sizing: border-box;
`

const Popup = styled.div`
  position: absolute;
  background-color: white;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border-radius: 8px;
  height: 50px;
  background-color: #f5f8fd;
`
const LanguageButton = styled.button`
  background-color: ${({ selected }) => (selected ? '#52AEF9' : '#ffffff')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background-color: #52AEF9;
    color: #fff;
  }
  height: 36px;
`

const SelectedLanguage = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #333;
`
const TopCenterButton = styled.button`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  padding: 8px 32px;
  background-color: #fff;
  font-family: 'Kanit', sans-serif;
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
`
const TopCenterIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  transform: translateX(-50%);
  z-index: 1;
  
 
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`