import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 챗봇의 첫 안내 메시지. 채팅방 초기화 시 불러옴
const initialAssistantMessage = {
  role: "assistant",
  content:
    '안녕하세요! 응급/의료 정보 AI 챗봇입니다. 증상, 진료 과목, 응급 상황 등에 대해 질문해 주세요. 더 정확한 답변을 위해, "어제부터 열이 38도까지 오르고 목이 아파요"와 같이 구체적으로 질문해주시면 좋습니다.',
};

export const useChatStore = create(
  persist(
    (set) => ({
      // messages 상태, 상태 변경 함수 정의
      messages: [initialAssistantMessage],

      // 전체 메시지 배열을 새로운 배열로 교체하는 함수
      setMessages: (newMessages) => set({ messages: newMessages }),

      // 대화 내역을 초기 메시지만 남기고 모두 지우는 함수
      clearChat: () => set({ messages: [initialAssistantMessage] }),
    }),
    {
      name: "chat-storage", // sessionStorage에 저장될 때 사용될 키 이름입니다.
      //   storage: createJSONStorage(() => sessionStorage),
    }
  )
);
