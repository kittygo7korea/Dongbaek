/**
 * 동백마을 × A2O Lite 알림 신청 → 구글 스프레드시트 저장 (Google Apps Script 웹 앱)
 *
 * 웹사이트 서버(/api/notify)가 이 웹 앱으로 신청 내용을 보내면, 시트에 한 줄씩 쌓입니다.
 * 설정 방법은 같은 폴더의 README.md를 보세요.
 *
 * 1) (선택) 보안을 더 높이려면 SECRET에 긴 비밀값을 넣고, Vercel 환경 변수 GOOGLE_SHEET_WEBHOOK_SECRET에도 똑같이 넣으세요.
 *    비워 두면 웹 앱 URL 자체가 비밀 역할을 합니다(URL은 사이트 서버에만 있고 방문자에게 보이지 않음).
 * 2) 배포 → 새 배포 → 유형 '웹 앱', 실행 사용자 '나', 액세스 권한 '모든 사용자'로 배포하세요.
 */
const SECRET = ""; // 선택: 비워 두면 검사하지 않음
// 시트에서 '확장 프로그램 → Apps Script'로 만들었으면 비워 두고, script.google.com에서 따로 만들었으면 시트 ID를 넣음
const SHEET_ID = "";
const SHEET_NAME = "알림신청";
const HEADERS = ["신청 시각", "신청 위치", "언어", "이메일", "닉네임", "콜라보 굿즈 소식", "동백마을체험 소식", "관심 굿즈", "개인정보 동의"];

/* Apps Script 편집기에서 이 함수(맨 위라 기본 선택됨)를 한 번 실행하면 권한 승인 + 시트 제목 줄이 만들어집니다 */
function setup() {
  getSheet();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // 동시에 여러 명이 신청해도 줄이 겹치지 않게
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (SECRET && data.secret !== SECRET) return json({ ok: false, error: "unauthorized" });

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      data.source === "dialog" ? "헤더 알림받기 창" : "알림 섹션",
      data.lang || "",
      safe(data.email),
      safe(data.nickname),
      data.goods ? "O" : "",
      data.program ? "O" : "",
      safe((data.interests || []).join(", ")),
      data.consent ? "동의" : "",
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* '알림신청' 탭을 찾음. 없으면 첫 탭이 비어 있거나 같은 제목 줄만 있을 때 그 탭의 이름을 바꿔 쓰고,
   그렇지 않으면 새 탭을 만듦. 첫 줄이 비어 있으면 제목을 넣어 둠 */
function getSheet() {
  const book = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    const first = book.getSheets()[0];
    const firstRow = first.getLastRow() === 0 ? [] : first.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    const reusable = first.getLastRow() === 0 || (first.getLastRow() === 1 && firstRow.join("|") === HEADERS.join("|"));
    if (reusable) {
      first.setName(SHEET_NAME);
      sheet = first;
    } else {
      sheet = book.insertSheet(SHEET_NAME);
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  if (sheet.getFrozenRows() === 0) { // 제목 줄 고정·굵게 (처음 한 번)
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

/* =, +, -, @ 로 시작하는 값은 시트가 수식으로 실행하지 않도록 앞에 ' 를 붙임 */
function safe(value) {
  const text = String(value == null ? "" : value).slice(0, 200);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
