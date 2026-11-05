"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

/* 동백요정이 숲에서 날아와 bLOOM 로고 속 꽃이 되는 장면.
   요정 그림의 꽃 몸통이 로고의 'OO' 꽃과 같은 자리·크기에 오도록
   .fairy-flight 위치값(globals.css)을 로고 이미지 기준으로 맞춰 두었습니다. */
export function BloomFormation() {
  const [run, setRun] = useState(0);

  return (
    <div className="formation">
      <div key={run} className="formation-stage" role="img" aria-label="동백요정이 날아와 꽃잎을 모으며 bLOOM Your Way 로고가 됩니다">
        <div className="formation-square">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="petal" style={{ ["--i" as string]: i }} aria-hidden="true" />
          ))}
          <div className="fairy-flight" aria-hidden="true">
            <Image src="/bloom/fairy.webp" alt="" width={900} height={900} sizes="300px" preload />
          </div>
          <div className="logo-formed" aria-hidden="true">
            <Image src="/bloom/logo.webp" alt="" width={900} height={900} sizes="(max-width: 720px) 92vw, 640px" preload />
          </div>
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
