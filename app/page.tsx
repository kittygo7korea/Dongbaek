import Image from "next/image";
import { LogoReveal, NotifyForm } from "./campaign-interactions";

const products = [
  { image: "cups", name: "블룸 컵", detail: "알록달록한 그래픽을 더한 연두빛 유리컵" },
  { image: "bag", name: "블룸백", detail: "연두색 손잡이와 컬러 그래픽이 돋보이는 투명 토트백" },
  { image: "camping-chair", name: "블룸 캠핑 의자", detail: "동백요정 그래픽과 투명 파라솔을 더한 접이식 의자" },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top">
          <Image src="/bloom/header-logo.webp" alt="bLOOM Your Way · 맨 위로" width={126} height={48} />
        </a>
        <nav aria-label="페이지 메뉴">
          <a href="#goods">콜라보 굿즈</a>
          <a href="#walk">마을 산책</a>
        </nav>
        <a className="button button-small" href="#notify">알림받기 <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">✿</span> DONGBAEK VILLAGE × A2O LITE</p>
            <h1 id="hero-title">동백숲에서 피어난,<br /><em>나의 방식.</em></h1>
            <p className="hero-description">꽃님이와 블룸이를 따라 동백마을을 걸어요.<br />숲에서 시작된 콜라보 굿즈가 곧 찾아옵니다.</p>
            <a className="button" href="#notify">알림받기 <span aria-hidden="true">↗</span></a>
            <a className="explore" href="#goods">굿즈 먼저 보기 <span aria-hidden="true">↓</span></a>
          </div>
          <figure className="hero-visual">
            <Image src="/bloom/girl-with-goods.webp" alt="제주 돌집 창가에서 블룸 굿즈를 정리하는 꽃님이" fill sizes="(max-width: 720px) 100vw, 55vw" preload />
            <figcaption><span>JEJU · DONGBAEK VILLAGE</span><span>꽃님이와 블룸 굿즈</span></figcaption>
          </figure>
        </section>

        <section className="section goods" id="goods" aria-labelledby="goods-title">
          <div className="section-heading">
            <p className="eyebrow">01 / THE COLLABORATION</p>
            <h2 id="goods-title">숲에서의 한때를<br />일상으로.</h2>
            <p>동백마을 × A2O Lite 콜라보 굿즈</p>
          </div>
          <div className="goods-banner">
            <span className="status"><span aria-hidden="true">●</span> 출시 예정</span>
            <Image src="/bloom/picnic-with-goods.webp" alt="동백숲에서 콜라보 의자에 앉아 차를 마시는 꽃님이와 블룸이" width={1600} height={900} sizes="(max-width: 720px) 100vw, 760px" />
            <p>정확한 출시 일정은 추후 공개됩니다.</p>
          </div>
          <ul className="product-grid">
            {products.map((product) => (
              <li key={product.image}>
                <div className="product-photo"><Image src={`/bloom/${product.image}.webp`} alt={product.name} fill sizes="(max-width: 720px) 30vw, 300px" /></div>
                <h3>{product.name}</h3><p>{product.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section walk" id="walk" aria-labelledby="walk-title">
          <div className="section-heading">
            <p className="eyebrow">02 / A WALK IN THE VILLAGE</p>
            <h2 id="walk-title">꽃님이와 블룸이의<br />동백숲 산책</h2>
            <p>돌담을 따라 마을을 걸어요. 꽃님이와 블룸이가 들른 세 곳을 만나보세요.</p>
          </div>
          <div className="walk-grid">
            <figure>
              <Image src="/bloom/seed.webp" alt="마을 야외 작업대에서 블룸이와 함께 동백 씨앗을 고르는 꽃님이" width={900} height={510} sizes="(max-width: 720px) 100vw, 50vw" />
              <figcaption><span>첫 번째 걸음</span><h3>동백 씨앗 고르기</h3><p>꽃님이가 씨앗을 하나씩 살펴보면, 블룸이도 옆에서 고개를 빼꼼 내밀어요.</p></figcaption>
            </figure>
            <figure>
              <Image src="/bloom/pasta-cooking.webp" alt="제주 돌집 부엌에서 고사리 파스타를 만드는 꽃님이와 블룸이" width={900} height={507} sizes="(max-width: 720px) 100vw, 50vw" />
              <figcaption><span>두 번째 걸음</span><h3>고사리 파스타 쿠킹 클래스</h3><p>꽃님이가 팬에서 파스타를 볶는 동안, 블룸이는 옆에서 고사리를 손질해요.</p></figcaption>
            </figure>
            <figure>
              <Image src="/bloom/oil-extracting.webp" alt="동백씨앗을 압착하는 꽃님이와 갓 짠 오일을 맛보는 블룸이" width={900} height={507} sizes="(max-width: 720px) 100vw, 50vw" />
              <figcaption><span>세 번째 걸음</span><h3>동백오일 방앗간</h3><p>신선한 동백씨앗을 직접 냉압착하면 고소한 동백오일이 돼요.</p></figcaption>
            </figure>
          </div>
        </section>

        <section className="reveal" aria-labelledby="reveal-title">
          <div className="reveal-copy">
            <p className="eyebrow">03 / THE BLOOM SIGN</p>
            <h2 id="reveal-title">동백숲의 작은 요정</h2>
            <p>숲에 사는 동백요정의 꽃잎이 블룸 로고 속에 피어납니다.</p>
          </div>
          <LogoReveal />
        </section>

        <section className="section notify" id="notify" aria-labelledby="notify-title">
          <p className="eyebrow">✿ &nbsp; COMING SOON</p>
          <h2 id="notify-title">동백숲에서 시작된 굿즈,<br />출시 소식을 받아보세요.</h2>
          <p>동백마을 × A2O Lite</p>
          <NotifyForm />
        </section>
      </main>
      <footer><span>✿ &nbsp; 동백마을 × A2O Lite</span><a href="#top">맨 위로 ↑</a></footer>
    </>
  );
}
