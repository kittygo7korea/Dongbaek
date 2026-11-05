"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";

export function LogoReveal() {
  const stage = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="reveal-interaction">
      <div ref={stage} className={`reveal-stage${revealed ? " revealed" : ""}`}>
        <Image className="forest-backdrop" src="/bloom/forest.webp" alt="" fill sizes="100vw" />
        <div className="fairy-art" aria-hidden={revealed}>
          <Image src="/bloom/fairy.webp" alt="분홍색 동백요정" width={240} height={240} />
        </div>
        <div className="logo-art" aria-hidden={!revealed}>
          <Image src="/bloom/logo.webp" alt="bLOOM Your Way 로고" width={520} height={280} />
        </div>
      </div>
      <button className="replay" type="button" onClick={() => setRevealed(!revealed)}>
        {revealed ? "↺ 요정 다시 보기" : "✿ 로고로 바뀌는 모습 보기"}
      </button>
    </div>
  );
}

export function NotifyForm() {
  const [status, setStatus] = useState("");

  function saveInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      window.localStorage.setItem("dongbaek-launch-interest", "true");
      setStatus("이 브라우저에 알림 관심을 저장했어요.");
    } catch {
      setStatus("이 브라우저에서 저장할 수 없어요. 브라우저 설정을 확인해 주세요.");
    }
  }

  return (
    <form className="notify-form" onSubmit={saveInterest}>
      <button className="button" type="submit" aria-describedby="notify-note">알림받기 <span aria-hidden="true">↗</span></button>
      <p id="notify-note">미리보기에서는 알림 관심만 이 브라우저에 저장됩니다.</p>
      <p role="status">{status}</p>
    </form>
  );
}
