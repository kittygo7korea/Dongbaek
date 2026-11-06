import { Fragment, type ReactNode } from "react";

/* 문장 속 "A2O Lite"(대소문자 무관) 글자만 네온 그라데이션 <span>으로 감쌉니다.
   서버·클라이언트 컴포넌트 어디서나 쓸 수 있는 순수 함수예요. */
export function neon(text: string): ReactNode {
  const parts = text.split(/(A2O Lite)/i);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className="neon">{part}</span> : <Fragment key={i}>{part}</Fragment>,
  );
}
