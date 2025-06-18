import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import styled from "styled-components";

// collapsed 모드에서 보이는 부분의 높이(px)
const PEEK_HEIGHT = 300;

const HospitalItemBody = ({ isOpen, onClose }) => {
  const sheetRef = useRef(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [collapsedTranslate, setCollapsedTranslate] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(null);
  const [initialTranslate, setInitialTranslate] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  // 레이아웃 이후에 Sheet 높이(px) 측정
  useLayoutEffect(() => {
    if (sheetRef.current) {
      const heightPx = sheetRef.current.clientHeight;
      setSheetHeight(heightPx);
      setCollapsedTranslate(heightPx - PEEK_HEIGHT);
      // 초기 collapsed 위치
      setCurrentTranslate(heightPx - PEEK_HEIGHT);
    }
  }, []);

  // isOpen 변경 시 Sheet 위치 제어
  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false);
      setIsDragging(false);
      if (sheetHeight) {
        // 화면 아래로 완전히 숨김
        setCurrentTranslate(sheetHeight);
      }
    } else {
      if (!isDragging) {
        setCurrentTranslate(isExpanded ? 0 : collapsedTranslate);
      }
    }
  }, [isOpen, isExpanded, sheetHeight, collapsedTranslate, isDragging]);

  // Document 레벨 드래그 핸들러
  useEffect(() => {
    // 마우스 이동 중
    const onMouseMove = (e) => {
      if (!isDragging || startY === null) return;
      const clientY = e.clientY;
      updateTranslate(clientY);
    };
    // 마우스 버튼 뗄 때
    const onMouseUp = () => {
      if (!isDragging) return;
      finishDrag();
    };

    // 터치 이동 중
    const onTouchMove = (e) => {
      if (!isDragging || startY === null) return;
      const clientY = e.touches[0].clientY;
      updateTranslate(clientY);
    };
    // 터치 끝낼 때
    const onTouchEnd = () => {
      if (!isDragging) return;
      finishDrag();
    };

    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    isDragging,
    startY,
    initialTranslate,
    currentTranslate,
    collapsedTranslate,
  ]);

  // --- 드래그 이동 중 translate 업데이트 함수 ---
  const updateTranslate = (clientY) => {
    const diff = clientY - startY; // 양수 → 아래, 음수 → 위
    let newTranslate = initialTranslate + diff;
    if (newTranslate < 0) newTranslate = 0;
    if (newTranslate > collapsedTranslate) newTranslate = collapsedTranslate;
    setCurrentTranslate(newTranslate);
  };

  // --- 드래그 종료 시 호출 ---
  const finishDrag = () => {
    setIsDragging(false);
    const threshold = collapsedTranslate / 2;
    if (isExpanded) {
      // expanded 상태 → 아래로 내린 경우
      if (currentTranslate > threshold) {
        setIsExpanded(false);
        setCurrentTranslate(collapsedTranslate);
      } else {
        setCurrentTranslate(0);
      }
    } else {
      // collapsed 상태 → 위로 올린 경우
      if (collapsedTranslate - currentTranslate > threshold) {
        setIsExpanded(true);
        setCurrentTranslate(0);
      } else {
        setCurrentTranslate(collapsedTranslate);
      }
    }
    setStartY(null);
  };

  // --- 드래그 시작: PullHandleArea에서만 호출 ---
  const handleDragStart = (clientY) => {
    if (!isOpen) return;
    setIsDragging(true);
    setStartY(clientY);
    setInitialTranslate(isExpanded ? 0 : collapsedTranslate);
  };

  // isOpen이 false라면 렌더하지 않음
  if (!isOpen) return null;

  return (
    <Overlay>
      <Sheet
        ref={sheetRef}
        style={{
          transform: `translateY(${currentTranslate}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* PullHandleArea: 여기서 드래그 시작만 허용 */}
        <PullHandleArea
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        >
          <CloseIndicator />
        </PullHandleArea>

        {/* 항상 보이는 부분 (collapsed 모드에서도 표시) */}

        {isExpanded ? (
          <>
            <ImageArea>
              <MainImage />
              <MainImage />
            </ImageArea>
            <div>
              <HospitalTypeGeneral>종합병원</HospitalTypeGeneral>
              <HospitalTypeER>응급실</HospitalTypeER>
            </div>
          </>
        ) : (
          <>
            <ImageArea>
              <MainImage />
            </ImageArea>
            <HospitalTypeER>응급실</HospitalTypeER>
          </>
        )}
        <HospitalName>서울대학교 병원</HospitalName>
        <HospitalTypeGeneral>종합병원</HospitalTypeGeneral>
        <Status>진료 중</Status>
        <Address>서울 종로구 대학로 101</Address>
        <Phone>1588-5700</Phone>
        <OpenInfo>공휴일 제외 연중 무휴</OpenInfo>

        {/* isExpanded === true일 때만 보이는 추가 정보 */}
        {isExpanded && (
          <ExtraInfo>
            추가 정보 1
            <br />
            추가 정보 2
            <br />
            추가 정보 3
            <br />
          </ExtraInfo>
        )}

        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </Sheet>
    </Overlay>
  );
};

export default HospitalItemBody;

/* CommonBox 내부 기준으로 100% 너비/높이를 차지 */
const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 30;
`;

const Sheet = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; /* CommonBox 너비 전체 */
  height: 80vh; /* CommonBox 높이 대비 80% */
  background: #fff;
  border-radius: 1rem 1rem 0 0;
  /* 위쪽으로만 그림자 */
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  touch-action: none;
`;

const PullHandleArea = styled.div`
  width: 100%;
  height: 1.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
`;

const CloseIndicator = styled.div`
  width: 4.25rem;
  height: 0.625rem;
  background-color: #d9d9d9;
  border-radius: 2rem;
`;

const ImageArea = styled.div`
  width: 100%;
  height: 129px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainImage = styled.div`
  width: 199px;
  height: 129px;
  background: #eee;
  border-radius: 16px;
  margin: 40px auto 0 auto;
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
  /* margin: 2.5rem 0 0 1.5rem; */
`;

const Status = styled.div`
  font-family: "Kanit", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin: 8px 0 0 24px;
`;

const Address = styled.div`
  font-family: "Kanit", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  margin: 8px 0 0 24px;
`;

const Phone = styled.div`
  font-family: "Kanit", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  margin: 8px 0 0 24px;
`;

const OpenInfo = styled.div`
  font-family: "Kanit", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #000;
  margin: 8px 0 0 24px;
`;

const ExtraInfo = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #333;
  margin: 16px 24px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #ff5f5f;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #e04949;
  }
`;
