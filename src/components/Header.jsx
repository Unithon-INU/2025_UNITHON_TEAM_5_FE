import React, { useState } from "react";
import styled from "styled-components";
import Globe from "../assets/Globe.svg?react";

function Header({ children, onGlobeClick }) {
  return (
    <HeaderBox>
      {" "}
      <GlobeIcon width={30} height={30} onClick={onGlobeClick} />
      <ChildrenWrapper>{children}</ChildrenWrapper>
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
