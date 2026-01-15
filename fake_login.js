/*
  Purpose: QA mock login for your own API
  - http-request: capture username from request body, store to persistentStore
  - http-response: return mocked login ok using stored username (no-cache)
*/

const STORE_KEY = "QA_LOGIN_USERNAME";

function safeDecode(s) {
  try { return decodeURIComponent(s.replace(/\+/g, "%20")); } catch (_) { return s; }
}

function extractUsernameFromBody(body) {
  if (!body) return null;

  // Try JSON
  try {
    const obj = JSON.parse(body);
    return obj.userName || obj.username || obj.user || obj.account || null;
  } catch (_) {}

  // Try x-www-form-urlencoded / form-data like
  const m = body.match(/(?:userName|username|user|account)=([^&]+)/i);
  if (m && m[1]) return safeDecode(m[1]);

  return null;
}

function isTargetLoginRequest(req) {
  // Bạn có thể siết chặt hơn tùy API của bạn
  return (req.method || "").toUpperCase() === "POST";
}

/** ------------------ REQUEST PHASE ------------------ **/
if (typeof $response === "undefined") {
  // http-request
  const req = $request;
  const body = req.body || "";

  if (!isTargetLoginRequest(req)) {
    console.log("ℹ️ [QA Login] Skip non-POST:", req.method);
    $done({});
    return;
  }

  const username = extractUsernameFromBody(body);
  if (username) {
    $persistentStore.write(username, STORE_KEY);
    console.log("✅ [QA Login] Captured userName =", username);
  } else {
    console.log("⚠️ [QA Login] No userName found. Body =", body);
  }

  $done({});
  return;
}

/** ------------------ RESPONSE PHASE ------------------ **/
(() => {
  // http-response
  const saved = $persistentStore.read(STORE_KEY);
  const username = saved || "Naksuu";

  const finalObj = {
    code: 0,
    msg: "login ok",
    data: { userName: username }
  };

  console.log("🔥 [QA Login] Mock response for userName =", username);

  $done({
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    },
    body: JSON.stringify(finalObj)
  });
})();
