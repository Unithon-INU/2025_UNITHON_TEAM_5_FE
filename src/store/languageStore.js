import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useLanguageStore = create(
  devtools((set) => ({
    language: 'ko', // 초기값
    setLanguage: (lang) => set({ language: lang }),
  }), { name: 'LanguageStore' }) // Devtools에서 이름 보이게 설정
);


export default useLanguageStore;
