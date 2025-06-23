// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend"; // 백엔드 플러그인 추가
import LanguageDetector from "i18next-browser-languagedetector"; // 언어 감지 플러그인 추가

// 번역 파일을 불러올 수 있는 플러그인 (예 : JSON 파일)
i18n
  .use(Backend)
  .use(LanguageDetector) // 언어 감지 플러그인 추가
  .use(initReactI18next) // i18next를 React와 통합(바인딩)

  .init({
    debug: true, // 디버그 모드 활성화. 개발 중 디버깅 메시지 활성화
    fallbackLng: "en", // 기본 언어 설정. 번역이 없는 경우 사용할 언어. 번역을 찾을 수 없을 때.
    interpolation: {
      escapeValue: false, // React는 XSS 공격을 방지하기 위해 기본적으로 이스케이프 처리함. false로 설정하여 이스케이프 처리 비활성화
      // 요약하면 React는 XSS 보호를 내장하고 있으므로 escapeValue를 false로 설정해도 안전하다는 말. 필요없다.
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    // 네임스페이스 설정: 'translation'은 기본 네임스페이스입니다.
    ns: ["translation"],
    defaultNS: "translation",

    // LanguageDetector 플러그인 설정: 언어 감지 및 캐싱 우선순위를 정의합니다.
    detection: {
      // 언어 감지 시도 순서:
      // 쿼리 파라미터 -> 쿠키 -> 로컬 스토리지 -> 세션 스토리지 -> 브라우저 언어 -> HTML 태그의 lang 속성
      order: [
        "queryString",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
      ],
      // 감지된 언어를 어디에 저장할지 지정합니다.
      // localStorage와 cookie에 저장하여 사용자가 한 번 선택한 언어가 유지되도록 합니다.
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
