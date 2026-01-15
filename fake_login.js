/*
  STRICT login fake
  - Chỉ chạy khi POST + có userName
  - Lấy đúng username từ payload
*/

if ($request.method !== "POST") {
  $done({});
  return;
}

let body = $request.body || "";
if (!body) {
  $done({});
  return;
}

let username = null;

// ====== 1️⃣ JSON payload ======
try {
  let json = JSON.parse(body);

  // duyệt nhiều key phổ biến
  username =
    json.userName ||
    json.username ||
    json.user_name ||
    (json.data && (json.data.userName || json.data.username));

} catch (e) {
  // ====== 2️⃣ x-www-form-urlencoded ======
  let params = body.split("&");
  for (let p of params) {
    let [key, value] = p.split("=");
    if (!key || !value) continue;

    let k = key.toLowerCase();
    if (k === "username" || k === "username" || k === "user_name") {
      username = decodeURIComponent(value);
      break;
    }
  }
}

// ❌ Không có username → không fake
if (!username) {
  $done({});
  return;
}

// ====== LOG CHÍNH XÁC ======
console.log("🎯 LOGIN MATCHED");
console.log("URL:", $request.url);
console.log("USERNAME:", username);

// ====== RESPONSE GIẢ ======
let fakeResponse = {
  code: 0,
  msg: "login ok",
  data: {
    userName: username
  }
};

$done({
  status: 200,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(fakeResponse)
});
