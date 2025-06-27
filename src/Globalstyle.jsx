// GlobalStyle.js
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  .custom-info-window {
    padding: 12px 16px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: max-content;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: sans-serif;
  }

  .custom-info-window .hospital-name {
    font-weight: bold;
    color: #007aff;
    font-size: 14px;
  }

  .custom-info-window .hospital-kor {
    font-size: 13px;
    color: #333;
  }

  .custom-info-window .hospital-tel {
    font-size: 13px;
    color: #666;
  }

  .custom-info-window .icu-info {
    margin-top: 8px;
    align-self: flex-end;
    display: flex;
    align-items: center;
    background: #007aff;
    color: white;
    font-size: 13px;
    padding: 4px 10px;
    border-radius: 12px;
    gap: 4px;
  }

  .custom-info-window .icu-info svg {
    width: 16px;
    height: 16px;
  }
`;
