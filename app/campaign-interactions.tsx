"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

/* 마을 하루 카드: 1초마다 다음 카드로 자동 스와이프, 끝에 닿으면 처음으로.
   마우스를 올리거나 손가락으로 만지거나 키보드로 들어오면 멈추고, 손을 떼면 잠시 뒤 다시 넘깁니다.
   '동작 줄이기' 설정이면 자동으로 넘기지 않습니다. */
export function AutoSwipeTrack({ className, children }: { className?: string; children: ReactNode }) {
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    let resumeTimer: number | undefined;
    const pause = () => { paused = true; window.clearTimeout(resumeTimer); };
    const resumeLater = () => { window.clearTimeout(resumeTimer); resumeTimer = window.setTimeout(() => { paused = false; }, 2000); };

    const step = () => {
      if (paused || document.hidden) return;
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + card.offsetWidth + gap, behavior: "smooth" });
    };
    const timer = window.setInterval(step, 1000);

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resumeLater);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeLater);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resumeLater);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(resumeTimer);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resumeLater);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resumeLater);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resumeLater);
    };
  }, []);

  return <ol ref={track} className={className}>{children}</ol>;
}

/* 동백요정이 숲에서 날아와 bLOOM 로고 속 꽃이 되는 장면.
   요정 그림의 꽃 몸통이 로고의 'OO' 꽃과 같은 자리·크기에 오도록
   .fairy-flight 위치값(globals.css)을 로고 이미지 기준으로 맞춰 두었습니다. */
export function BloomFormation() {
  const [run, setRun] = useState(0);

  return (
    <div className="formation">
      <div key={run} className="formation-stage" role="img" aria-label="동백요정이 날아와 꽃잎을 모으며 bLOOM Your Way 로고가 됩니다">
        <div className="formation-square">
          {/* 글자 층: 요정이 자리 잡은 뒤에 페이드인 (꽃 자리는 비워 둠) */}
          <div className="logo-letters" aria-hidden="true">
            <Image src="/bloom/logo.webp" alt="" width={900} height={900} sizes="(max-width: 720px) 92vw, 640px" preload />
          </div>
          {/* 원본 로고 꽃: 움직임 줄이기 설정일 때만 표시 */}
          <div className="logo-flower" aria-hidden="true">
            <Image src="/bloom/logo.webp" alt="" width={900} height={900} sizes="(max-width: 720px) 92vw, 640px" />
          </div>
          {/* 가로 이동(바깥)과 세로 이동(안쪽)을 다른 속도 곡선으로 움직여 미끄럼틀 같은 곡선을 만듭니다 */}
          <div className="fairy-flight" aria-hidden="true">
            <div className="fairy-drop">
              {/* 발 방향 1시 → 5시로만 시계방향 회전 */}
              <div className="fairy-spin">
                {/* 분홍 꽃 몸통만 남긴 층(그대로 로고의 꽃이 됨) + 얼굴·팔다리·잎까지 있는 전체 층(착지 후 페이드아웃) */}
                <Image className="fairy-body" src="/bloom/fairy-white.png" alt="" width={1254} height={1254} sizes="300px" preload />
                <Image className="fairy-full" src="/bloom/fairy-white.png" alt="" width={1254} height={1254} sizes="300px" preload />
              </div>
            </div>
          </div>
          <svg className="svg-defs" aria-hidden="true" focusable="false">
            {/* 분홍(빨강↑·초록↓)만 남기고 흰 팔다리·얼굴과 연두 잎은 투명하게 */}
            <filter id="fairy-pink-only" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  3 -3 0 0 -0.4" result="pink" />
              <feComposite in="pink" in2="SourceGraphic" operator="in" />
            </filter>
          </svg>
        </div>
      </div>
      <button className="replay" type="button" onClick={() => setRun((n) => n + 1)}>
        <span aria-hidden="true">↺</span> 요정이 피어나는 장면 다시 보기
      </button>
    </div>
  );
}

const interests = ["블룸 컵", "블룸백", "캠핑 의자", "모자", "씨앗 파우치", "동백 에센스"];

/* 교육용 데모: 입력한 이메일은 어디에도 전송·저장하지 않습니다. */
export function NotifyForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const agreed = (form.elements.namedItem("agree") as HTMLInputElement).checked;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("이메일 주소를 다시 확인해 주세요.");
    if (!agreed) return setError("알림 발송을 위한 개인정보 수집에 동의해 주세요.");
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <div className="notify-done" role="status">
        <Image src="/bloom/logo.webp" alt="bLOOM Your Way" width={900} height={900} sizes="260px" />
        <p className="done-title">알림 신청이 완료됐어요.</p>
        <p>올 겨울, 블룸이 피어나는 날 가장 먼저 찾아갈게요.</p>
        <button className="text-button" type="button" onClick={() => setDone(false)}>다른 이메일로 신청하기</button>
      </div>
    );
  }

  return (
    <form className="notify-form" onSubmit={submit} noValidate>
      <label className="field">
        <span>알림 받을 이메일</span>
        <input name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required />
      </label>
      <fieldset className="chips">
        <legend>관심 있는 굿즈 <small>(선택)</small></legend>
        {interests.map((item) => (
          <label key={item} className="chip">
            <input type="checkbox" name="interest" value={item} />
            <span>{item}</span>
          </label>
        ))}
      </fieldset>
      <label className="agree">
        <input type="checkbox" name="agree" required />
        <span>출시 알림 발송을 위해 이메일을 수집·이용하는 데 동의합니다. (출시 후 파기)</span>
      </label>
      <p className="form-error" role="alert">{error}</p>
      <button className="button button-large" type="submit">알림받기</button>
      <p className="demo-note">교육용 가상 캠페인 데모입니다. 입력한 이메일은 전송되거나 저장되지 않습니다.</p>
    </form>
  );
}
