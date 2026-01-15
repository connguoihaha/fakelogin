/*
  Fake login + DEBUG log cho Shadowrocket
*/

console.log("====== FAKE LOGIN SCRIPT TRIGGERED ======");

// Log request cơ bản
console.log("URL:", $request.url);
console.log("METHOD:", $request.method);

// Log headers
console.log("HEADERS:", JSON.stringify($request.headers, null, 2));

// Log body gốc
let body = $request.body || "";
console.log("RAW BODY:", body);

let username = "";

// 1️⃣ Thử parse JSON
try {
  let json = JSON.parse(body);
  console.log("BODY JSON:", JSON.stringify(json, null, 2));

  if (json.userName) {
    username = json.userName;
    console.log("USERNAME FOUND (JSON):", username);
  }
} catch (e) {
  console.log("BODY NOT JSON, TRY FORM DATA");

  // 2️⃣ Parse x-www-form-urlencoded
  let params = body.split("&");
  for (let p of params) {
    let [key, value] = p.split("=");
    if (key === "userName") {
      username = decodeURIComponent(value || "");
      console.log("USERNAME FOUND (FORM):", username);
      break;
    }
  }
}

// Nếu vẫn không có
if (!username) {
  console.log("⚠️ USERNAME NOT FOUND IN PAYLOAD");
}

// Response giả
let responseBody = {
  code: 0,
  msg: "login ok",
  data: {
    userName: username
  }
};

console.log("FAKE RESPONSE:", JSON.stringify(responseBody, null, 2));

$done({
  status: 200,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(responseBody)
});
