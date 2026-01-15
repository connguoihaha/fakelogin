/*
  Style: Locket Gold Clone
  Target: Login Bypass & Capture Username
*/

var url = $request.url;
var body = $request.body;
var method = $request.method;

// Mặc định response trả về
var finalObj = {
  "code": 0,
  "msg": "login ok",
  "data": {
    "userName": "Player_Default" 
  }
};

// Chỉ xử lý khi có Body gửi lên (Để lấy UserName)
if (body) {
    // 1. Thử tìm userName trong JSON
    try {
        var reqJson = JSON.parse(body);
        if (reqJson.userName) finalObj.data.userName = reqJson.userName;
        else if (reqJson.username) finalObj.data.userName = reqJson.username;
        else if (reqJson.user) finalObj.data.userName = reqJson.user;
    } catch (e) {
        // 2. Nếu không phải JSON, thử tìm trong chuỗi (Form Data)
        // Regex bắt tất cả các biến thể: userName=, username=, user=
        var match = body.match(/(?:userName|username|user)=([^&]+)/i);
        if (match && match[1]) {
            // Decode URI để tránh lỗi ký tự đặc biệt (VD: %20 -> dấu cách)
            finalObj.data.userName = decodeURIComponent(match[1]);
        }
    }
}

// Log ra để bạn debug trong Shadowrocket (nếu cần)
console.log("🔥 [GameHook] Bypass Login cho User: " + finalObj.data.userName);

// Trả về kết quả
$done({
    body: JSON.stringify(finalObj),
    status: 200,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate', // Ép game không được cache kết quả
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});
