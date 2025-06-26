// ChatInterface.jsx
import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ENDPOINTS } from "../constants/api";
import { useChatStore } from "../store/chatStore";

// icons
import ChatBotIcon from "../assets/ChatbotIcon.svg";

function ChatInterface() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { messages, setMessages, clearChat } = useChatStore();

  // 메시지 목록이 업데이트될 때마다 맨 아래로 스크롤 하는 기능
  const messageEndRef = useRef(null);

  // 나중에 이 함수만 useEffect가 아니라 맨 아래로 가는 기능 버튼으로 넣어도 좋을 듯
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleNewChat = () => {
    if (messages.length > 1) {
      clearChat();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    // 이전 메시지와 새 사용자 메시지를 포함한 새 배열을 만들어 스토어를 업데이트
    const newMessages = [...messages, userMessage];
    setMessages(newMessages); // zustand store의 setMessages 함수 호출
    setInput("");
    setIsLoading(true);

    try {
      // `http://localhost:8082/api/chat`,
      const response = await fetch(
        // `https://serverless-seven-eta-36.vercel.app/api/chat`,
        ENDPOINTS.chatbot,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: newMessages, // 'userMessage'만 보내는 대신 전체 메시지 배열을 전송
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`${response.status}: API 요청이 실패했습니다.`);
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.answer,
      };

      // store를 쓰므로, 완성된 배열을 넘겨준다.
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content: "죄송합니다, 오류가 발생했습니다: " + error.message,
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h1>큐링핑</h1>
        <NewChatButton onClick={handleNewChat}>새 채팅 시작</NewChatButton>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((message, index) =>
          // role로 동적 스타일링 적용
          message.role === "assistant" ? (
            <AssistantContainer>
              <img src={ChatBotIcon} />
              <Message key={index} role={message.role}>
                {message.content}
              </Message>
            </AssistantContainer>
          ) : (
            <Message key={index} role={message.role}>
              {message.content}
            </Message>
          )
        )}
        {isLoading && (
          <Message role="assistant">
            <LoadingIndicator>
              <span></span>
              <span></span>
              <span></span>
            </LoadingIndicator>
          </Message>
        )}
      </MessagesContainer>

      <InputForm onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
        />
        <StyledButton type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? "전송 중..." : "전송"}
        </StyledButton>
      </InputForm>
    </ChatContainer>
  );
}

export default ChatInterface;

// CSS의 @keyframes를 styled-components의 keyframes 헬퍼로 변환
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

// 스타일드 컴포넌트 정의
const ChatContainer = styled.div`
  width: 100%;
  /* max-width: 800px; */
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;

  /* margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   */

  /* height: 600px; */
`;

const ChatHeader = styled.div`
  background-color: #52aef9;
  color: white;
  padding: 15px 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;

  display: flex;
  /* justify-content: center; */
  align-items: center;

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const NewChatButton = styled.button`
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const AssistantContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    align-self: flex-end;
    margin-right: 1rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  background-color: #f9fafb;
`;

// 고정된 첫 메시지를 주기 전 'ai와 대화를 시작해보세요!'하는 컴포넌트
// const EmptyState = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   color: #9ca3af;
//   font-style: italic;
// `;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 15px;
  max-width: 80%;
  word-break: break-word;
  line-height: 1.5;
  position: relative;

  /* props를 기반으로 동적 스타일링 */
  ${({ role }) =>
    role === "user"
      ? `
        align-self: flex-end;
        background-color: #3b82f6;
        color: white;
        border-bottom-right-radius: 4px;
      `
      : `
        align-self: flex-start;
        background-color: #e5e7eb;
        color: #1f2937;
        border-bottom-left-radius: 4px;
      `}
`;

const LoadingIndicator = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  min-width: 50px;

  span {
    width: 8px;
    height: 8px;
    background-color: #9ca3af;
    border-radius: 50%;
    display: inline-block;
    animation: ${bounce} 1.5s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const InputForm = styled.form`
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #e5e7eb;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const StyledButton = styled.button`
  padding: 12px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;
