import React, { useState } from "react";
import styled from "styled-components";
import Globe from "../assets/Globe.svg?react";
import ChatIcon from "../assets/ChatIcon.svg?react";

function Header({ children, onGlobeClick, onChatIconClick }) {
  const handleChatButtonClick = () => {
    if (onChatIconClick) {
      onChatIconClick();
    }
  };

  return (
    <HeaderBox>
      {/*현재 state에 어느 모드에서든 패치해온게 다른 모드로 가도 남아있어서 전역으로 빼고 토글스위치바뀌면 클린시키는식으로해야할듯*/}
      <GlobeIcon width={30} height={30} onClick={onGlobeClick} />
      <ChildrenWrapper>{children}</ChildrenWrapper>
      <ChatButton width={30} height={30} onClick={handleChatButtonClick} />
    </HeaderBox>
  );
}

export default Header;

const HeaderBox = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  min-height: 50px;
  box-sizing: border-box;
  background-color: #52aef9;
  padding: 8px 16px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  z-index: 2;
`;

const GlobeIcon = styled(Globe)`
  cursor: pointer;
`;

const ChildrenWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ChatButton = styled(ChatIcon)`
  cursor: pointer;
`;
