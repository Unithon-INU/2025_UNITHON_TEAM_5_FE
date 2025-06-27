// components/ChatModal.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ChatInterface from "./ChatInterface"; // 우리가 만든 ChatInterface 컴포넌트

const ModalBackdrop = styled.div`
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: center;
  width: 100%;
  /* width: 393px; */
  max-width: 480px;
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
        <ChatInterface onClose={onClose} />
      </ModalContainer>
    </ModalBackdrop>
  );
}

export default ChatModal;
