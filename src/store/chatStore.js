import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// // 챗봇의 첫 안내 메시지. 채팅방 초기화 시 불러옴
// const initialAssistantMessage = {
//   role: "assistant",
//   content:
//     'Hello! This is the emergency/medical information AI chatbot. Please ask questions about your symptoms, treatment subjects, emergencies, and more. For a more accurate answer, I would like you to ask specific questions such as "My fever has reached 38 degrees since yesterday and my throat hurts.',
// };

// export const useChatStore = create(
//   persist(
//     (set) => ({
//       // messages 상태, 상태 변경 함수 정의
//       messages: [initialAssistantMessage],

//       // 전체 메시지 배열을 새로운 배열로 교체하는 함수
//       setMessages: (newMessages) => set({ messages: newMessages }),

//       // 대화 내역을 초기 메시지만 남기고 모두 지우는 함수
//       clearChat: () => set({ messages: [initialAssistantMessage] }),
//     }),
//     {
//       name: "chat-storage", // sessionStorage에 저장될 때 사용될 키 이름입니다.
//       storage: createJSONStorage(() => sessionStorage),
//     }
//   )
// );

const getInitialMessage = (t) => ({
  role: "assistant",
  content: t("initial_chat_message"),
});

export const useChatStore = create(
  persist(
    (set, get) => ({
      // messages 상태는 이제 빈 배열로 시작하거나, sessionStorage에 저장된 값을 불러옵니다.
      messages: [],

      // 전체 메시지 배열을 새로운 배열로 교체하는 함수
      setMessages: (newMessages) => set({ messages: newMessages }),

      initializeChat: (t) => {
        // 현재 메시지가 없거나, 언어가 변경되었을 때만 초기화합니다.
        // 이렇게 하면 불필요한 초기화를 방지할 수 있습니다.
        if (
          get().messages.length === 0 ||
          get().messages[0].content !== t("initial_chat_message")
        ) {
          set({ messages: [getInitialMessage(t)] });
        }
      },
      // 나가서 언어를 바꾼 다음에 '새 채팅'을 눌르면 현재 언어에 맞는 초기 메시지로 리셋됨
      clearChat: (t) => set({ messages: [getInitialMessage(t)] }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => sessionStorage), // sessionStorage 사용
    }
  )
);
