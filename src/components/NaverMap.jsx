import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const NaverMap = ({ isPopupVisible }) => {
  const mapRef = useRef(null)
  const [popupPosition, setPopupPosition] = useState({ top: 5, left: 14 }); 
  const [selectedLanguage, setSelectedLanguage] = useState('kor') // 나중에 전역변수로바꾸는게나을듯

  useEffect(() => {
    if (!window.naver || !mapRef.current) return

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.3750, 126.6322), 
      zoom: 10,
    })

    if (isPopupVisible) {
      setPopupPosition({ top: 5, left: 14 }); 
    }
    

  }, [isPopupVisible])
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language) 
  }

  return (
    <MapContainer ref={mapRef}>
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
  )
}

export default NaverMap

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
