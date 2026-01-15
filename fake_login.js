/*
  Shadowrocket http-response script
  - Bắt POST request
  - Lấy userName từ payload
  - Ghi đè response
*/

let req = $request;
let body = req.body || "";

// Mặc định
let username = "";

// Trường hợp payload JSON
try {
  let json = JSON.parse(body);
  if (json.userName) {
    username = json.userName;
  }
} catch (e) {
  // Trường hợp x-www-form-urlencoded
  let params = body.split("&");
  for (let p of params) {
    let [key, value] = p.split("=");
    if (key === "userName") {
      username = decodeURIComponent(value || "");
      break;
    }
  }
}

// Response giả
let responseBody = {
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
  body: JSON.stringify(responseBody)
});
