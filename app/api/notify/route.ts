import { dictionaries } from "../../dictionaries";

/* 알림 신청 접수 → 구글 스프레드시트(Apps Script 웹 앱)로 전달.
   시트 주소와 비밀값은 서버 환경 변수에만 있어 방문자 브라우저에는 드러나지 않습니다.
   - GOOGLE_SHEET_WEBHOOK_URL    : Apps Script 웹 앱 배포 URL (https://script.google.com/macros/s/…/exec)
   - GOOGLE_SHEET_WEBHOOK_SECRET : google-apps-script/notify-sheet.gs 의 SECRET 과 같은 값 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 관심 굿즈는 사이트에 있는 이름만 받음 (한·영)
const KNOWN_INTERESTS = new Set([...dictionaries.ko.notify.interests, ...dictionaries.en.notify.interests]);

type Body = {
  source?: unknown; lang?: unknown; email?: unknown; nickname?: unknown;
  goods?: unknown; program?: unknown; interests?: unknown; consent?: unknown; website?: unknown;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  // 사람에게는 안 보이는 칸(website)이 채워져 있으면 스팸 봇 → 저장하지 않고 성공처럼 응답
  if (typeof body.website === "string" && body.website !== "") return Response.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  const source = body.source === "dialog" ? "dialog" : "section";
  const lang = body.lang === "en" ? "en" : "ko";
  const goods = body.goods === true;
  const program = body.program === true;
  const interests = Array.isArray(body.interests)
    ? body.interests.filter((v): v is string => typeof v === "string" && KNOWN_INTERESTS.has(v)).slice(0, 6)
    : [];

  if (!EMAIL.test(email) || email.length > 120) return invalid("email");
  if (source === "dialog" && (nickname.length < 1 || nickname.length > 20)) return invalid("nickname");
  if (!goods && !program) return invalid("topic");
  if (body.consent !== true) return invalid("consent");

  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.error("[notify] GOOGLE_SHEET_WEBHOOK_URL / GOOGLE_SHEET_WEBHOOK_SECRET 환경 변수가 없습니다.");
    return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  try {
    // Apps Script 웹 앱은 응답을 다른 주소로 한 번 넘겨(302) 돌려주므로 redirect: "follow"
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, source, lang, email, nickname, goods, program, interests, consent: true }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !result?.ok) {
      console.error("[notify] 시트 저장 실패", res.status, result?.error);
      return Response.json({ ok: false, error: "sheet-failed" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[notify] 시트 연결 실패", err);
    return Response.json({ ok: false, error: "sheet-unreachable" }, { status: 502 });
  }
}

function invalid(field: string) {
  return Response.json({ ok: false, error: "invalid", field }, { status: 400 });
}
