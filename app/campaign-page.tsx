import Image from "next/image";
import Link from "next/link";
import { AutoSwipeTrack, BloomFormation, NotifyForm, ZoomableCard, ZoomableProduct } from "./campaign-interactions";
import { dictionaries, type Locale } from "./dictionaries";

/* 이미지·색 같은 언어와 무관한 값. 문구는 dictionaries.ts에서 같은 순서로 가져옵니다. */
const dayImages = [
  { image: "walk.png", w: 1672, h: 941 },
  { image: "seed.webp", w: 900, h: 510 },
  { image: "pasta-cooking.webp", w: 900, h: 507 },
  { image: "oil-extracting.webp", w: 900, h: 507 },
  { image: "rest.webp", w: 900, h: 507 },
];
const goodsImages = ["cups", "bag", "camping-chair", "cap", "pouch", "essence"];
const swatchColors = ["#d62839", "#ff0176", "#fdf8eb", "#c4d88d"];

export function CampaignPage({ lang }: { lang: Locale }) {
  const t = dictionaries[lang];

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={t.header.home}>
          <Image src="/bloom/header-logo.webp" alt="" width={126} height={48} />
        </a>
        <nav aria-label={t.header.menu}>
          <a href="#collab">{t.header.collab}</a>
          <a href="#village">{t.header.village}</a>
          <a href="#goods">{t.header.goods}</a>
        </nav>
        <div className="header-actions">
          {/* 언어 전환: 한국어 / , 영어 /en (서로 다른 루트 레이아웃이라 이동 시 페이지 전체를 새로 불러옴) */}
          <div className="lang-switch" role="group" aria-label={t.header.language}>
            <Link href="/" hrefLang="ko" lang="ko" aria-current={lang === "ko" ? "page" : undefined}>KO</Link>
            <Link href="/en" hrefLang="en" lang="en" aria-current={lang === "en" ? "page" : undefined}>EN</Link>
          </div>
          <a className="button button-small" href="#notify">{t.notifyCta}</a>
        </div>
      </header>

      <main id="top">
        {/* ① 히어로: 동백요정 → bLOOM 로고 */}
        <section className="hero" aria-labelledby="hero-title">
          <Image className="hero-forest" src="/bloom/forest.webp" alt="" fill sizes="100vw" preload />
          <div className="hero-inner">
            <p className="eyebrow hero-eyebrow">DONGBAEK VILLAGE × A2O LITE</p>
            <BloomFormation label={t.hero.formationLabel} replay={t.hero.replay} />
            <div className="hero-copy">
              <h1 id="hero-title">{t.hero.line1}<br /><em>{t.hero.line2}</em></h1>
              <a className="button button-large" href="#notify">{t.notifyCta}</a>
              <a className="scroll-hint" href="#collab">{t.hero.more} <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </section>

        {/* ② 콜라보 소식 */}
        <section className="section collab" id="collab" aria-labelledby="collab-title">
          <div className="collab-grid">
            <div>
              <p className="eyebrow">01 · COLLABORATION NEWS</p>
              <h2 id="collab-title">{t.collab.title1}<br />{t.collab.title2}</h2>
              <p className="lead">{t.collab.lead}</p>
              <ul className="swatches" aria-label={t.collab.swatchLabel}>
                {t.collab.swatches.map((name, i) => (
                  <li key={name}><span style={{ background: swatchColors[i] }} aria-hidden="true" />{name}</li>
                ))}
              </ul>
            </div>
            <figure className="collab-visual">
              <Image src="/bloom/a2o-graphics.png" alt={t.collab.graphicAlt} width={670} height={447} sizes="(max-width: 720px) 100vw, 45vw" />
              <figcaption>{t.collab.graphicCaption}</figcaption>
            </figure>
          </div>
        </section>

        {/* ③ 동백마을의 미학: 꽃님이와 블룸이의 하루 */}
        <section className="section village" id="village" aria-labelledby="village-title">
          <div className="section-heading">
            <p className="eyebrow">02 · THE AESTHETICS OF DONGBAEK VILLAGE</p>
            <h2 id="village-title">{t.village.title1}<br />{t.village.title2}</h2>
            <p>{t.village.intro}</p>
          </div>
          <AutoSwipeTrack className="day-track">
            {t.village.day.map((d, i) => (
              <li key={dayImages[i].image}>
                <Image src={`/bloom/${dayImages[i].image}`} alt={`${d.title}: ${t.village.altSuffix}`} width={dayImages[i].w} height={dayImages[i].h} sizes="(max-width: 720px) 82vw, 420px" />
                <p className="step">{d.step}</p>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </li>
            ))}
          </AutoSwipeTrack>
          <p className="track-hint" aria-hidden="true">{t.village.hint}</p>
        </section>

        {/* ④ 출시 예정 굿즈 + 피크닉 장면 */}
        <section className="section goods" id="goods" aria-labelledby="goods-title">
          <div className="section-heading">
            <p className="eyebrow">03 · COMING THIS WINTER</p>
            <h2 id="goods-title">{t.goods.title}</h2>
            <p>{t.goods.sub} · <strong>{t.goods.status}</strong></p>
          </div>
          <ul className="product-grid">
            {t.goods.items.map((g, i) => (
              <li key={goodsImages[i]}>
                <span className="status">{t.goods.status}</span>
                <ZoomableProduct image={goodsImages[i]} name={g.name} detail={g.detail} zoomLabel={t.goods.zoom} closeLabel={t.goods.close} />
                <h3>{g.name}</h3>
                <p>{g.detail}</p>
                <a className="product-notify" href="#notify">{t.notifyCta} <span aria-hidden="true">→</span></a>
              </li>
            ))}
          </ul>
        </section>

        <section className="picnic" aria-labelledby="picnic-title">
          <Image src="/bloom/picnic-wide.png" alt={t.picnic.alt} fill sizes="100vw" />
          <div className="picnic-copy">
            <p className="eyebrow">04 · A WINTER PICNIC</p>
            <h2 id="picnic-title">{t.picnic.title}</h2>
            <p>{t.picnic.text}</p>
          </div>
        </section>

        {/* ⑤ 이메일 알림받기 */}
        <section className="section notify" id="notify" aria-labelledby="notify-title">
          <Image className="notify-logo" src="/bloom/logo.webp" alt="" width={900} height={900} sizes="280px" />
          <h2 id="notify-title">{t.notify.title1}<br />{t.notify.title2}</h2>
          <p>{t.notify.sub}</p>
          <NotifyForm t={t.notify} cta={t.notifyCta} />
        </section>

        {/* 마무리 영상 (푸터 바로 위) */}
        <section className="film" aria-label={t.film.label}>
          <video src="/bloom/film.mp4" autoPlay muted loop playsInline controls preload="metadata" />
          <div className="handwrite-row">
            <p className="handwrite">{t.film.hand1}<br />{t.film.hand2}</p>
            <Image className="handwrite-bloom" src="/bloom/bloom-flower.webp" alt={t.film.bloomAlt} width={1254} height={1254} sizes="(max-width: 720px) 34vw, 288px" />
          </div>
          <div className="shortform-wrap">
            <Image className="shortform-fairy" src="/bloom/fairy-bench.webp" alt={t.film.fairyAlt} width={1307} height={1203} sizes="180px" />
            <video className="shortform" src="/bloom/shortform.mp4" autoPlay muted loop playsInline controls preload="metadata" aria-label={t.film.shortformLabel} />
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

        {/* ⑥ SNS 카드뉴스 (페이지 가장 아래) */}
        <section className="section cardnews" id="cardnews" aria-labelledby="cardnews-title">
          <div className="section-heading">
            <p className="eyebrow">05 · ON INSTAGRAM</p>
            <h2 id="cardnews-title">{t.cardnews.title}</h2>
            <p>{t.cardnews.sub}{t.cardnews.note && <> <span className="cardnews-note">{t.cardnews.note}</span></>}</p>
          </div>
          <ol className="cardnews-track">
            {t.cardnews.cards.map((alt, i) => (
              <li key={i}>
                <ZoomableCard src={`/cardnews/card-${i + 1}.png`} alt={alt} zoomLabel={t.cardnews.zoom} closeLabel={t.cardnews.close} />
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer>
        <span>{t.footer.note}</span>
        <a href="#top">{t.footer.top}</a>
      </footer>
    </>
  );
}
