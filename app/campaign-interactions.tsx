"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries";
import { neon } from "./neon";

/* 마을 하루 카드: 2초마다 한 장씩, 1.2초에 걸쳐 천천히 밀어 넘기는 자동 스와이프. 끝에 닿으면 처음으로.
   마우스를 올리거나 손가락으로 만지거나 키보드로 들어오면 멈추고, 손을 떼면 잠시 뒤 다시 넘깁니다.
   '동작 줄이기' 설정이면 자동으로 넘기지 않습니다. */
export function AutoSwipeTrack({ className, children }: { className?: string; children: ReactNode }) {
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cardStep = () => {
      const card = el.firstElementChild as HTMLElement | null;
      return card ? card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0) : 0;
    };
    let paused = false;
    let resumeTimer: number | undefined;
    const pause = () => { paused = true; window.clearTimeout(resumeTimer); };
    const resumeLater = () => { window.clearTimeout(resumeTimer); resumeTimer = window.setTimeout(() => { paused = false; }, 2000); };

    // 브라우저 기본 부드러운 스크롤은 0.3~0.5초로 고정이라, 손으로 천천히 넘기듯 1.2초 동안 직접 움직임
    let frame = 0;
    const slideTo = (target: number) => {
      cancelAnimationFrame(frame);
      const from = el.scrollLeft;
      const start = performance.now();
      const duration = 1200;
      el.style.scrollSnapType = "none"; // 움직이는 동안 카드 맞춤(스냅)이 끼어들지 않게
      const tick = (now: number) => {
        if (paused) { el.style.scrollSnapType = ""; return; }
        const p = Math.min(1, (now - start) / duration);
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // 천천히 출발 → 가속 → 천천히 멈춤
        el.scrollLeft = from + (target - from) * ease;
        if (p < 1) frame = requestAnimationFrame(tick);
        else el.style.scrollSnapType = "";
      };
      frame = requestAnimationFrame(tick);
    };

    const step = () => {
      if (paused || document.hidden) return;
      const s = cardStep();
      if (!s) return;
      const max = el.scrollWidth - el.clientWidth;
      // 넘기는 간격(2초)이 미끄러지는 시간(1.2초)보다 길어, 매번 지금 보이는 카드 기준으로 한 장만 넘김
      const atEnd = el.scrollLeft >= max - 4;
      const next = Math.round(el.scrollLeft / s) + 1;
      slideTo(atEnd ? 0 : Math.min(next * s, max));
    };
    const timer = window.setInterval(step, 2000); // 2초에 한 컷

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resumeLater);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeLater);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resumeLater);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(resumeTimer);
      cancelAnimationFrame(frame);
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

/* bLOOM 로고의 꽃(첫 번째 O)이 우상단에서 미끄러지듯 내려와 제자리에 멈추고, 나머지 글자가 피어나는 장면.
   꽃 그림(logo-first-o.png)은 로고와 같은 900×900 캔버스에서 오려 내 멈추는 순간 원본과 정확히 겹칩니다. */
export function BloomFormation({ label, replay }: { label: string; replay: string }) {
  const [run, setRun] = useState(0);

  return (
    <div className="formation">
      <div key={run} className="formation-stage" role="img" aria-label={label}>
        <div className="formation-square">
          {/* 원본 로고 전체: 꽃이 첫 번째 O 자리에 멈춘 뒤 페이드인 → 나머지 글자가 나타남 */}
          <div className="logo-letters" aria-hidden="true">
            <Image src="/bloom/logo.webp" alt="" width={900} height={900} sizes="(max-width: 720px) 92vw, 640px" preload />
          </div>
          {/* 로고에서 오려 낸 꽃만(눈코입·팔다리 없음). 가로(바깥)·세로(안쪽)를 다른 속도 곡선으로 움직여 미끄럼틀 곡선을 그림 */}
          <div className="bloom-x" aria-hidden="true">
            <div className="bloom-y">
              <Image className="logo-bloom" src="/bloom/logo-first-o.png" alt="" width={900} height={900} sizes="(max-width: 720px) 92vw, 640px" preload />
            </div>
          </div>
        </div>
      </div>
      <button className="replay" type="button" onClick={() => setRun((n) => n + 1)}>
        <span aria-hidden="true">↺</span> {replay}
      </button>
    </div>
  );
}

/* 굿즈 사진을 누르면 크게 보기. <dialog>를 써서 Esc 키·닫기 버튼·바깥 어두운 영역 클릭으로 닫힘 */
export function ZoomableProduct({ image, name, detail, zoomLabel, closeLabel }: { image: string; name: string; detail: ReactNode; zoomLabel: string; closeLabel: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const src = `/bloom/${image}.webp`;

  return (
    <>
      <button type="button" className="product-photo" onClick={() => dialog.current?.showModal()} aria-label={`${name} · ${zoomLabel}`}>
        <Image src={src} alt={name} fill sizes="(max-width: 720px) 45vw, 340px" />
        <span className="zoom-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 0M15.5 15.5 20 20M10.5 7.5v6M7.5 10.5h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </span>
      </button>
      <dialog ref={dialog} className="zoom-dialog" aria-label={`${name} · ${zoomLabel}`} onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div className="zoom-body">
          <div className="zoom-frame">
            <Image src={src} alt={name} fill sizes="(max-width: 720px) 92vw, 720px" />
          </div>
          <p className="zoom-name">{name}</p>
          <p className="zoom-detail">{detail}</p>
          <button type="button" className="zoom-close" onClick={() => dialog.current?.close()} aria-label={closeLabel}>✕</button>
        </div>
      </dialog>
    </>
  );
}

/* SNS 카드뉴스 한 장: 누르면 <dialog>로 크게 보기 (Esc·닫기 버튼·바깥 클릭으로 닫힘) */
export function ZoomableCard({ src, alt, zoomLabel, closeLabel }: { src: string; alt: string; zoomLabel: string; closeLabel: string }) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" className="card-thumb" onClick={() => dialog.current?.showModal()} aria-label={`${zoomLabel}: ${alt}`}>
        <Image src={src} alt={alt} width={1080} height={1350} sizes="(max-width: 720px) 78vw, 230px" />
      </button>
      <dialog ref={dialog} className="zoom-dialog card-dialog" aria-label={zoomLabel} onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div className="zoom-body">
          <Image src={src} alt={alt} width={1080} height={1350} sizes="(max-width: 720px) 92vw, 560px" />
          <button type="button" className="zoom-close" onClick={() => dialog.current?.close()} aria-label={closeLabel}>✕</button>
        </div>
      </dialog>
    </>
  );
}

/* 알림 신청 보내기: 이 사이트의 서버(/api/notify)가 받아 구글 스프레드시트에 한 줄로 저장합니다. */
type NotifyPayload = {
  source: "dialog" | "section"; email: string; nickname?: string;
  goods: boolean; program: boolean; interests?: string[]; consent: true; website: string;
};
async function sendNotify(payload: NotifyPayload): Promise<"ok" | "invalid" | "failed"> {
  try {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, lang: document.documentElement.lang }),
    });
    if (res.ok) return "ok";
    return res.status === 400 ? "invalid" : "failed";
  } catch {
    return "failed";
  }
}
/* 사람에게는 보이지 않는 스팸 방지 칸: 봇이 채우면 서버가 저장하지 않음 */
function Honeypot() {
  return (
    <label className="hp" aria-hidden="true">
      Website <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  );
}

/* 알림 섹션 폼: 이메일 + 관심 굿즈 → 콜라보 굿즈 출시 소식으로 저장 */
export function NotifyForm({ t, cta }: { t: Dictionary["notify"]; cta: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  // 장바구니의 '출시 알림받기'로 넘어오면 담아둔 굿즈를 관심 굿즈로 미리 체크 (폼을 새로 그려 기본 체크값 반영)
  const [picks, setPicks] = useState<number[]>([]);
  const [pickRun, setPickRun] = useState(0);
  useEffect(() => {
    const onPick = (e: Event) => {
      setPicks((e as CustomEvent<number[]>).detail);
      setPickRun((n) => n + 1);
      setDone(false);
      setError("");
    };
    window.addEventListener(NOTIFY_PICK_EVENT, onPick);
    return () => window.removeEventListener(NOTIFY_PICK_EVENT, onPick);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const agreed = (form.elements.namedItem("agree") as HTMLInputElement).checked;
    const interests = [...form.querySelectorAll<HTMLInputElement>('input[name="interest"]:checked')].map((el) => el.value);
    const website = (form.elements.namedItem("website") as HTMLInputElement).value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t.errorEmail);
    if (!agreed) return setError(t.errorAgree);
    setError("");
    setSending(true);
    const result = await sendNotify({ source: "section", email, goods: true, program: false, interests, consent: true, website });
    setSending(false);
    if (result === "ok") setDone(true);
    else setError(result === "invalid" ? t.errorEmail : t.errorServer);
  }

  if (done) {
    return (
      <div className="notify-done" role="status">
        <Image src="/bloom/logo.webp" alt="bLOOM Your Way" width={900} height={900} sizes="260px" />
        <p className="done-title">{t.doneTitle}</p>
        <p>{t.doneText}</p>
        <button className="text-button" type="button" onClick={() => setDone(false)}>{t.again}</button>
      </div>
    );
  }

  return (
    <form key={pickRun} className="notify-form" onSubmit={submit} noValidate>
      <label className="field">
        <span>{t.emailLabel}</span>
        <input name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required />
      </label>
      <fieldset className="chips">
        <legend>{t.interestLegend} <small>{t.optional}</small></legend>
        {t.interests.map((item, i) => (
          <label key={item} className="chip">
            <input type="checkbox" name="interest" value={item} defaultChecked={picks.includes(i)} />
            <span>{item}</span>
          </label>
        ))}
      </fieldset>
      <label className="agree">
        <input type="checkbox" name="agree" required />
        <span>{t.agree}</span>
      </label>
      <Honeypot />
      <p className="form-error" role="alert">{error}</p>
      <button className="button button-large" type="submit" disabled={sending} aria-busy={sending}>{sending ? t.sending : cta}</button>
      <p className="demo-note">{t.demo}</p>
    </form>
  );
}

/* 굿즈 진열 + 장바구니 (교육용 데모: 결제 없음).
   카드의 '담아두기'로 담고, 장바구니에서 수량을 바꾸거나 뺄 수 있어요. 담은 목록은 이 브라우저에만 저장됩니다.
   '출시 알림받기'를 누르면 알림 폼으로 이동하면서 담아둔 굿즈를 관심 굿즈로 체크합니다. */
const CART_KEY = "bloom-cart";
export const NOTIFY_PICK_EVENT = "bloom:pick-interests";

/* 장바구니 저장소: 이 브라우저의 localStorage (막혀 있으면 메모리에만). useSyncExternalStore로 읽어
   서버 렌더(빈 장바구니)와 브라우저 값이 어긋나도 경고 없이 이어 받습니다. */
let memoryCart = "{}";
const cartListeners = new Set<() => void>();
function readCart() {
  try { return localStorage.getItem(CART_KEY) ?? memoryCart; } catch { return memoryCart; }
}
function writeCart(next: Record<number, number>) {
  memoryCart = JSON.stringify(next);
  try { localStorage.setItem(CART_KEY, memoryCart); } catch {}
  cartListeners.forEach((listener) => listener());
}
function subscribeCart(listener: () => void) {
  cartListeners.add(listener);
  window.addEventListener("storage", listener); // 다른 탭에서 바꾼 것도 반영
  return () => { cartListeners.delete(listener); window.removeEventListener("storage", listener); };
}

export function GoodsShop({ images, t }: { images: string[]; t: Dictionary["goods"] }) {
  const raw = useSyncExternalStore(subscribeCart, readCart, () => "{}");
  const cart = useMemo<Record<number, number>>(() => {
    try {
      const saved = JSON.parse(raw);
      return saved && typeof saved === "object" ? saved : {};
    } catch { return {}; }
  }, [raw]);
  const [message, setMessage] = useState("");
  const update = writeCart;

  const setQty = (i: number, qty: number) => {
    const next = { ...cart };
    if (qty > 0) next[i] = Math.min(qty, 9);
    else delete next[i];
    update(next);
  };
  const toggle = (i: number) => {
    const inCart = cart[i] > 0;
    setQty(i, inCart ? 0 : 1);
    setMessage(`${t.items[i].name} ${inCart ? t.cart.removedMsg : t.cart.addedMsg}`);
  };

  const picked = Object.keys(cart).map(Number).sort((a, b) => a - b);
  const total = picked.reduce((sum, i) => sum + cart[i], 0);

  const goNotify = () => {
    window.dispatchEvent(new CustomEvent(NOTIFY_PICK_EVENT, { detail: picked }));
    document.getElementById("notify")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <ul className="product-grid">
        {t.items.map((g, i) => {
          const inCart = cart[i] > 0;
          return (
            <li key={images[i]} className={inCart ? "in-cart" : undefined}>
              <span className="status">{t.status}</span>
              <ZoomableProduct image={images[i]} name={g.name} detail={neon(g.detail)} zoomLabel={t.zoom} closeLabel={t.close} />
              <h3>{g.name}</h3>
              <p>{neon(g.detail)}</p>
              <button type="button" className="product-add" aria-pressed={inCart} onClick={() => toggle(i)}>
                {inCart ? <>{t.added} <span aria-hidden="true">✓</span></> : <>{t.add} <span aria-hidden="true">+</span></>}
              </button>
            </li>
          );
        })}
      </ul>

      <aside className="cart" id="cart" aria-labelledby="cart-title">
        <div className="cart-head">
          <h3 id="cart-title">{t.cart.title}</h3>
          <span className="cart-count">{t.cart.count} {total}{t.cart.unit}</span>
        </div>
        {picked.length === 0 ? (
          <p className="cart-empty">{t.cart.empty}</p>
        ) : (
          <ul className="cart-list">
            {picked.map((i) => (
              <li key={i}>
                <span className="cart-thumb"><Image src={`/bloom/${images[i]}.webp`} alt="" fill sizes="56px" /></span>
                <span className="cart-name">{t.items[i].name}</span>
                <span className="qty" role="group" aria-label={t.items[i].name}>
                  <button type="button" onClick={() => setQty(i, cart[i] - 1)} aria-label={`${t.items[i].name} ${t.cart.less}`}>−</button>
                  <output aria-live="polite">{cart[i]}</output>
                  <button type="button" onClick={() => setQty(i, cart[i] + 1)} disabled={cart[i] >= 9} aria-label={`${t.items[i].name} ${t.cart.more}`}>+</button>
                </span>
                <button type="button" className="cart-remove" onClick={() => { setQty(i, 0); setMessage(`${t.items[i].name} ${t.cart.removedMsg}`); }}>{t.cart.remove}</button>
              </li>
            ))}
          </ul>
        )}
        <p className="cart-note">{t.cart.note}</p>
        <div className="cart-actions">
          {picked.length > 0 && <button type="button" className="text-button cart-clear" onClick={() => update({})}>{t.cart.clear}</button>}
          <button type="button" className="button button-large" onClick={goNotify}>{t.cart.cta}</button>
        </div>
        <p className="sr-only" role="status">{message}</p>
      </aside>
    </>
  );
}

/* 스크롤해서 새로 보이는 이미지·영상을 부드럽게 페이드인. 히어로와 크게 보기 창(dialog) 속 이미지는 제외.
   JS가 꺼져 있거나 '동작 줄이기' 설정이면 처음부터 그대로 보입니다. */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const targets = [...document.querySelectorAll<HTMLElement>("main section:not(.hero) :is(img, video)")].filter((el) => !el.closest("dialog, .cart"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    for (const el of targets) {
      el.classList.add("reveal");
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return null;
}

/* 헤더 '알림받기' → 알림 신청 창(<dialog>): 이메일·닉네임 입력 + 받고 싶은 소식 체크(하나 이상).
   제출하면 /api/notify → 구글 스프레드시트에 저장. Esc·닫기 버튼·바깥 클릭으로 닫힘 */
export function NotifyDialogButton({ label, t }: { label: string; t: Dictionary["notifyDialog"] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ nick: string; topics: string[] } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
    const email = field("email").value.trim();
    const nick = field("nick").value.trim();
    const topics = t.topics.filter((_, i) => field(`topic-${i}`).checked);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(t.errorEmail, field("email"));
    if (nick.length < 1 || nick.length > 20) return fail(t.errorNick, field("nick"));
    if (topics.length === 0) return fail(t.errorTopic, field("topic-0"));
    if (!field("agree").checked) return fail(t.errorAgree, field("agree"));
    setError("");
    setSending(true);
    const result = await sendNotify({
      source: "dialog", email, nickname: nick,
      goods: field("topic-0").checked, program: field("topic-1").checked,
      consent: true, website: field("website").value,
    });
    setSending(false);
    if (result === "ok") setDone({ nick, topics });
    else setError(result === "invalid" ? t.errorEmail : t.errorServer);
  }
  function fail(message: string, el: HTMLInputElement) {
    setError(message);
    el.focus();
  }

  return (
    <>
      <button type="button" className="button button-small" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>{label}</button>
      <dialog ref={dialog} className="notify-dialog" aria-labelledby="notify-dialog-title" onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div className="notify-dialog-body">
          <button type="button" className="zoom-close" onClick={() => dialog.current?.close()} aria-label={t.close}>✕</button>
          {done ? (
            <div className="notify-done" role="status">
              <Image src="/bloom/logo.webp" alt="bLOOM Your Way" width={900} height={900} sizes="220px" />
              <p className="done-title" id="notify-dialog-title">{t.doneTitle.replace("{nick}", done.nick)}</p>
              <p>{t.doneText}</p>
              <ul className="done-topics">{done.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              <button className="text-button" type="button" onClick={() => setDone(null)}>{t.again}</button>
            </div>
          ) : (
            <>
              <h2 id="notify-dialog-title">{t.title}</h2>
              <p className="notify-dialog-sub">{neon(t.sub)}</p>
              <form className="notify-form" onSubmit={submit} noValidate>
                <label className="field">
                  <span>{t.emailLabel}</span>
                  <input name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required autoFocus />
                </label>
                <label className="field">
                  <span>{t.nickLabel}</span>
                  <input name="nick" type="text" autoComplete="nickname" placeholder={t.nickPlaceholder} maxLength={20} required />
                </label>
                <fieldset className="topics">
                  <legend>{t.topicsLegend} <small>{t.topicsHint}</small></legend>
                  {t.topics.map((topic, i) => (
                    <label key={topic} className="topic">
                      <input type="checkbox" name={`topic-${i}`} defaultChecked={i === 0} />
                      <span>{topic}</span>
                    </label>
                  ))}
                </fieldset>
                <label className="agree">
                  <input type="checkbox" name="agree" required />
                  <span>{t.agree}</span>
                </label>
                <Honeypot />
                <p className="form-error" role="alert">{error}</p>
                <button className="button button-large" type="submit" disabled={sending} aria-busy={sending}>{sending ? t.sending : t.submit}</button>
                <p className="demo-note">{t.demo}</p>
              </form>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
