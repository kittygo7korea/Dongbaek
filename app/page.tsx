import Image from "next/image";
import { BloomFormation, NotifyForm } from "./campaign-interactions";

const day = [
  { image: "walk.png", w: 1672, h: 941, step: "아침", title: "동백숲 길 걷기", text: "현무암 돌길을 따라 천천히. 블룸이는 늘 한 걸음 앞에서 걸어요." },
  { image: "seed.webp", w: 900, h: 510, step: "오전", title: "동백 씨앗 줍기", text: "떨어진 씨앗 세 알이면 충분해요. 나머지는 숲에게 남겨 둬요." },
  { image: "pasta-cooking.webp", w: 900, h: 507, step: "점심", title: "고사리 파스타 만들기", text: "마을 고사리를 볶는 냄새에 블룸이가 먼저 자리를 잡아요." },
  { image: "oil-extracting.webp", w: 900, h: 507, step: "오후", title: "동백오일 짜기", text: "주운 씨앗을 눌러 짜면 노란 오일 한 방울이 피어나요." },
  { image: "rest.webp", w: 900, h: 507, step: "해 질 녘", title: "숲에서 쉬어 가기", text: "아무것도 하지 않아도 괜찮은 시간. 동백마을의 하루는 이렇게 끝나요." },
];

const goods = [
  { image: "cups", name: "블룸 컵", detail: "연둣빛 유리에 A2O Lite 그래픽을 더한 컵" },
  { image: "bag", name: "블룸백", detail: "숲길 피크닉에 맞춘 투명 토트백" },
  { image: "camping-chair", name: "블룸 캠핑 의자", detail: "동백요정 그래픽과 투명 파라솔을 단 접이식 의자" },
  { image: "cap", name: "동백마을 모자", detail: "동백 엠블럼 패치를 단 아이보리 볼캡" },
  { image: "pouch", name: "씨앗 파우치", detail: "블룸이처럼 동백씨앗을 담는 면 파우치" },
  { image: "essence", name: "동백 에센스", detail: "동백오일을 담은 bLOOM YOUR WAY 에센스" },
];

const camellias = [
  { name: "붉은 동백", color: "#d62839" },
  { name: "분홍 동백", color: "#ff0176" },
  { name: "아이보리 동백", color: "#fdf8eb" },
  { name: "연두 잎", color: "#c4d88d" },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="bLOOM Your Way · 맨 위로">
          <Image src="/bloom/header-logo.webp" alt="" width={126} height={48} />
        </a>
        <nav aria-label="페이지 메뉴">
          <a href="#collab">콜라보 소식</a>
          <a href="#village">동백마을의 하루</a>
          <a href="#goods">출시 예정 굿즈</a>
        </nav>
        <a className="button button-small" href="#notify">알림받기</a>
      </header>

      <main id="top">
        {/* ① 히어로: 동백요정 → bLOOM 로고 */}
        <section className="hero" aria-labelledby="hero-title">
          <Image className="hero-forest" src="/bloom/forest.webp" alt="" fill sizes="100vw" preload />
          <div className="hero-inner">
            <p className="eyebrow hero-eyebrow">DONGBAEK VILLAGE × A2O LITE</p>
            <BloomFormation />
            <div className="hero-copy">
              <h1 id="hero-title">올 겨울, 동백마을이 A2O Lite와 만나<br /><em>새롭게 피어납니다</em></h1>
              <a className="button button-large" href="#notify">알림받기</a>
              <a className="scroll-hint" href="#collab">더 둘러보기 <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </section>

        {/* ② 콜라보 소식 */}
        <section className="section collab" id="collab" aria-labelledby="collab-title">
          <div className="collab-grid">
            <div>
              <p className="eyebrow">01 · COLLABORATION NEWS</p>
              <h2 id="collab-title">각자의 색으로 빛나는 A2O Lite가,<br />저마다의 색으로 피는 동백숲을 만났습니다.</h2>
              <p className="lead">A2O Lite는 2026년 10월 데뷔한 K-Pop 그룹이에요. 멤버 한 명 한 명의 색이 분명한 글로벌 구성이죠.
                붉은 동백, 분홍 동백, 아이보리 동백이 한 숲에 함께 피어나듯, 서로 다른 색이 모여 이번 겨울 동백마을 콜라보를 만듭니다.</p>
              <ul className="swatches" aria-label="동백숲의 색">
                {camellias.map((c) => (
                  <li key={c.name}><span style={{ background: c.color }} aria-hidden="true" />{c.name}</li>
                ))}
              </ul>
            </div>
            <figure className="collab-visual">
              <Image src="/bloom/a2o-graphics.png" alt="A2O Lite 그래픽 요소: 물결 윤곽선, 별 모양, 구슬과 타원, 궤도 심볼" width={670} height={447} sizes="(max-width: 720px) 100vw, 45vw" />
              <figcaption>A2O Lite 그래픽 요소가 동백마을 굿즈 위에 피어나요.</figcaption>
            </figure>
          </div>
        </section>

        {/* ③ 동백마을의 미학: 꽃님이와 블룸이의 하루 */}
        <section className="section village" id="village" aria-labelledby="village-title">
          <div className="section-heading">
            <p className="eyebrow">02 · THE AESTHETICS OF DONGBAEK VILLAGE</p>
            <h2 id="village-title">꽃님이와 블룸이가 안내하는<br />동백마을의 하루</h2>
            <p>마을 소녀 꽃님이와 동백숲 친구 블룸이를 따라, 느리게 피어나는 하루를 걸어 보세요.</p>
          </div>
          <ol className="day-track">
            {day.map((d) => (
              <li key={d.title}>
                <Image src={`/bloom/${d.image}`} alt={`${d.title}: 꽃님이와 블룸이`} width={d.w} height={d.h} sizes="(max-width: 720px) 82vw, 420px" />
                <p className="step">{d.step}</p>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </li>
            ))}
          </ol>
          <p className="track-hint" aria-hidden="true">옆으로 넘겨 보세요 →</p>
        </section>

        {/* ④ 출시 예정 굿즈 + 피크닉 장면 */}
        <section className="section goods" id="goods" aria-labelledby="goods-title">
          <div className="section-heading">
            <p className="eyebrow">03 · COMING THIS WINTER</p>
            <h2 id="goods-title">곧, 피어납니다.</h2>
            <p>동백마을 × A2O Lite 콜라보 굿즈 · <strong>2026 겨울 출시 예정</strong></p>
          </div>
          <ul className="product-grid">
            {goods.map((g) => (
              <li key={g.image}>
                <span className="status">2026 겨울 출시 예정</span>
                <div className="product-photo"><Image src={`/bloom/${g.image}.webp`} alt={g.name} fill sizes="(max-width: 720px) 45vw, 340px" /></div>
                <h3>{g.name}</h3>
                <p>{g.detail}</p>
                <a className="product-notify" href="#notify">알림받기 <span aria-hidden="true">→</span></a>
              </li>
            ))}
          </ul>
        </section>

        <section className="picnic" aria-labelledby="picnic-title">
          <Image src="/bloom/picnic-wide.png" alt="동백숲에서 블룸 캠핑 의자에 앉아 블룸 컵으로 차를 마시는 꽃님이와, 옆 의자에서 쉬는 블룸이. 투명 파라솔과 블룸백이 함께 놓여 있다." fill sizes="100vw" />
          <div className="picnic-copy">
            <p className="eyebrow">04 · A WINTER PICNIC</p>
            <h2 id="picnic-title">올 겨울, 동백숲 피크닉은 이렇게.</h2>
            <p>꽃님이는 블룸 컵에 차를 따르고, 블룸이는 옆 의자에서 눈을 감아요.</p>
          </div>
        </section>

        {/* ⑤ 이메일 알림받기 */}
        <section className="section notify" id="notify" aria-labelledby="notify-title">
          <Image className="notify-logo" src="/bloom/logo.webp" alt="" width={900} height={900} sizes="280px" />
          <h2 id="notify-title">블룸이 피어나는 날,<br />가장 먼저 알려드릴게요.</h2>
          <p>2026 겨울 · 동백마을 × A2O Lite 콜라보 굿즈 출시 알림</p>
          <NotifyForm />
        </section>

        {/* 마무리 영상 (푸터 바로 위) */}
        <section className="film" aria-label="동백마을 캠페인 영상">
          <video src="/bloom/film.mp4" autoPlay muted loop playsInline controls preload="metadata" />
          <div className="handwrite-row">
            <p className="handwrite">너의 방식대로<br />피어나</p>
            <Image className="handwrite-bloom" src="/bloom/bloom-flower.webp" alt="붉은 동백꽃을 높이 든 블룸이" width={1254} height={1254} sizes="(max-width: 720px) 34vw, 240px" />
          </div>
          <div className="shortform-wrap">
            <Image className="shortform-fairy" src="/bloom/fairy-walk.png" alt="손을 흔들며 걸어가는 동백요정" width={1254} height={1254} sizes="160px" />
            <video className="shortform" src="/bloom/shortform.mp4" autoPlay muted loop playsInline controls preload="metadata" aria-label="동백마을 bLOOM Your Way 숏폼 영상" />
          </div>
          {/* 손글씨 크레용 질감: 가장자리를 거칠게 흔들고, 안료가 빠진 듯한 작은 빈틈을 냅니다 */}
          <svg className="svg-defs" aria-hidden="true" focusable="false">
            <filter id="crayon" x="-5%" y="-10%" width="110%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="4" result="wobble" />
              <feDisplacementMap in="SourceGraphic" in2="wobble" scale="4" xChannelSelector="R" yChannelSelector="G" result="rough" />
              <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="9" result="speck" />
              <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.2" result="grain" />
              <feComposite in="rough" in2="grain" operator="in" />
            </filter>
          </svg>
        </section>
      </main>

      <footer>
        <span>DONGBAEK VILLAGE × A2O LITE · 교육용 가상 캠페인</span>
        <a href="#top">맨 위로 ↑</a>
      </footer>
    </>
  );
}
