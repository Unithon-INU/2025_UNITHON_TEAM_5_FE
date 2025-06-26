// components/ChatModal.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ChatInterface from "./ChatInterface"; // 우리가 만든 ChatInterface 컴포넌트

// icons
import { IoIosClose } from "react-icons/io"; // 닫기 버튼 아이콘

const ModalBackdrop = styled.div`
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: center;
  /* width: 100%; */
  width: 393px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소들 위에 보이도록 z-index 설정 */
`;

// 실제 모달 컨텐츠가 들어갈 컨테이너
const ModalContainer = styled.div`
  width: 90%;
  max-width: 800px; /* 최대 너비 제한 */
  height: 80%;
  max-height: 700px; /* 최대 높이 제한 */

  /* ChatInterface의 스타일과 유사하게 맞춤 */
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;

  /* 내부 ChatInterface가 잘 채워지도록 flex 설정 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 컨테이너의 모서리 둥글게 처리 */
`;

function ChatModal({ onClose }) {
  // 배경 클릭 시 모달이 닫히도록 설정
  const handleBackdropClick = () => {
    onClose();
  };

  // 모달 컨텐츠 내부를 클릭했을 때 이벤트가 배경으로 전파되는 것을 막음
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalContainer onClick={handleContainerClick}>
        <ChatInterface />
      </ModalContainer>
    </ModalBackdrop>
  );
}

// const SlideContainer = styled.div`
//   position: absolute;
//   top: 0;
//   right: 0;
//   width: 100%;
//   height: 100%;
//   background-color: #ffffff;
//   z-index: 1000;
//   display: flex;
//   flex-direction: column;
//   box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);

//   /* $isOpen prop에 따라 위치가 변합니다. '$'는 styled-component 전용 prop임을 나타냅니다. */
//   transform: translateX(${({ $isOpen }) => ($isOpen ? "0%" : "100%")});

//   transition: ${({ $isDragging }) =>
//     $isDragging ? "none" : "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)"};
// `;

// const ChatModalHeader = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   padding: 8px;
//   background-color: #f9fafb;
//   border-bottom: 1px solid #e5e7eb;
//   cursor: grab;

//   &:active {
//     cursor: grabbing;
//   }
// `;

// const CloseButton = styled.button`
//   background: transparent;
//   border: none;
//   cursor: pointer;
//   font-size: 2rem;
//   color: #6b7280;
//   padding: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: color 0.2s;

//   &:hover {
//     color: #111827;
//   }
// `;

// const ChatWrapper = styled.div`
//   flex: 1;
//   overflow: hidden;
// `;

// function ChatModal({ isOpen, onClose }) {
//   const panelRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const dragInfo = useRef({ startX: 0 });

//   const handleDragStart = (e) => {
//     if (e.type === "mousedown" && e.button !== 0) return;

//     setIsDragging(true);
//     const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
//     dragInfo.current.startX = startX;
//   };

//   const handleDragMove = (e) => {
//     if (!isDragging) return;
//     const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
//     const deltaX = currentX - dragInfo.current.startX;

//     if (deltaX > 0 && panelRef.current) {
//       panelRef.current.style.transform = `translateX(${deltaX}px)`;
//     }
//   };

//   const handleDragEnd = (e) => {
//     if (!isDragging) return;
//     setIsDragging(false);

//     const panelWidth = panelRef.current?.offsetWidth || 0;
//     const finalX =
//       e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
//     const dragDistance = finalX - dragInfo.current.startX;

//     if (dragDistance > panelWidth * 0.3) {
//       onClose();
//     } else {
//       if (panelRef.current) {
//         panelRef.current.style.transform = "translateX(0)";
//       }
//     }
//   };

//   useEffect(() => {
//     if (!isDragging) return;

//     const options = { passive: true };
//     const moveHandler = (e) => handleDragMove(e);
//     const endHandler = (e) => handleDragEnd(e);

//     window.addEventListener("mousemove", moveHandler);
//     window.addEventListener("mouseup", endHandler);
//     window.addEventListener("touchmove", moveHandler, options);
//     window.addEventListener("touchend", endHandler);

//     return () => {
//       window.removeEventListener("mousemove", moveHandler);
//       window.removeEventListener("mouseup", endHandler);
//       window.removeEventListener("touchmove", moveHandler);
//       window.removeEventListener("touchend", endHandler);
//     };
//   }, [isDragging]);

//   return (
//     <SlideContainer
//       ref={panelRef}
//       // [수정된 부분] isOpen을 $isOpen으로 전달합니다.
//       $isOpen={isOpen}
//       $isDragging={isDragging}
//       onMouseDown={handleDragStart}
//       onTouchStart={handleDragStart}
//     >
//       <ChatModalHeader>
//         <CloseButton onClick={onClose} onMouseDown={(e) => e.stopPropagation()}>
//           <IoIosClose />
//         </CloseButton>
//       </ChatModalHeader>
//       <ChatWrapper>
//         <ChatInterface />
//       </ChatWrapper>
//     </SlideContainer>
//   );
// }
export default ChatModal;
