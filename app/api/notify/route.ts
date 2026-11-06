import { dictionaries } from "../../dictionaries";

/* 알림 신청 접수 → 구글 스프레드시트로 저장. 주소는 서버 환경 변수에만 있어 방문자 브라우저에는 드러나지 않습니다.
   - GOOGLE_FORM_ACTION_URL      : (권장) 구글 설문지 응답 주소 https://docs.google.com/forms/d/e/…/formResponse
                                   → 설문지에 연결된 시트에 한 줄씩 쌓임. 질문 번호는 아래 FORM_ENTRIES
   - GOOGLE_SHEET_WEBHOOK_URL    : (대안) Apps Script 웹 앱 배포 URL. google-apps-script/notify-sheet.gs
   - GOOGLE_SHEET_WEBHOOK_SECRET : (선택) notify-sheet.gs 의 SECRET 과 같은 값 */

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

  const row = { source, lang, email, nickname, goods, program, interests };

  // 1순위: 구글 설문지(권한 승인 없이 동작). 응답은 설문지에 연결된 '동백마을 알림 신청' 시트에 쌓임
  const formUrl = process.env.GOOGLE_FORM_ACTION_URL;
  if (formUrl) return sendToGoogleForm(formUrl, row);

  // 2순위: Apps Script 웹 앱 (google-apps-script/notify-sheet.gs)
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_WEBHOOK_SECRET ?? "";
  if (!url) {
    console.error("[notify] GOOGLE_FORM_ACTION_URL 또는 GOOGLE_SHEET_WEBHOOK_URL 환경 변수가 없습니다.");
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

/* 구글 설문지 '동백마을 알림 신청 (웹사이트 연동용)'의 질문별 입력 칸 번호(entry.N).
   설문지 질문을 지우거나 새로 만들면 번호가 바뀌니, 공개 설문지 페이지에서 다시 확인해 고쳐야 합니다. */
const FORM_ENTRIES = {
  source: "entry.1860830531", // 신청 위치
  lang: "entry.278466533", // 언어
  email: "entry.1781368310", // 이메일
  nickname: "entry.887153207", // 닉네임
  goods: "entry.491042114", // 콜라보 굿즈 소식
  program: "entry.671137270", // 동백마을체험 소식
  interests: "entry.790912810", // 관심 굿즈
  consent: "entry.797105928", // 개인정보 동의
};

type Row = { source: string; lang: string; email: string; nickname: string; goods: boolean; program: boolean; interests: string[] };

async function sendToGoogleForm(formUrl: string, row: Row) {
  const body = new URLSearchParams({
    [FORM_ENTRIES.source]: row.source === "dialog" ? "헤더 알림받기 창" : "알림 섹션",
    [FORM_ENTRIES.lang]: row.lang,
    [FORM_ENTRIES.email]: row.email,
    [FORM_ENTRIES.nickname]: row.nickname,
    [FORM_ENTRIES.goods]: row.goods ? "O" : "",
    [FORM_ENTRIES.program]: row.program ? "O" : "",
    [FORM_ENTRIES.interests]: row.interests.join(", "),
    [FORM_ENTRIES.consent]: "동의",
  });
  try {
    const res = await fetch(formUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[notify] 설문지 제출 실패", res.status);
      return Response.json({ ok: false, error: "form-failed" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[notify] 설문지 연결 실패", err);
    return Response.json({ ok: false, error: "form-unreachable" }, { status: 502 });
  }
}

function invalid(field: string) {
  return Response.json({ ok: false, error: "invalid", field }, { status: 400 });
}
