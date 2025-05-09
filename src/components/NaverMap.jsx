// src/components/NaverMap.js
import { useEffect, useRef } from 'react';

const NaverMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    console.log('window.naver:', window.naver); // ← 추가

    if (!window.naver || !mapRef.current) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.3750,126.6322), // 서울 시청
      zoom: 10,
    });
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
    ></div>
  );
};

export default NaverMap;
