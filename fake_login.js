/**
 * Script: game_bypass.js (Phiên bản Debug)
 */

let body = $request.body || "";
let userName = null;

// GHI LOG: Để xem thực tế game gửi cái gì lên (Xem trong Config -> Diagnostics/Log)
console.log("⚠️ [DEBUG] Raw Body: " + body);

// CÁCH 1: Thử phân tích dạng JSON
try {
    let reqData = JSON.parse(body);
    // Tìm key có thể là tên đăng nhập (thường là userName, username, uName, account...)
    if (reqData.userName) userName = reqData.userName;
    else if (reqData.username) userName = reqData.username;
    else if (reqData.user) userName = reqData.user;
    
    console.log("✅ [DEBUG] Parsed via JSON: " + userName);
} catch (e) {
    // Không phải JSON
}

// CÁCH 2: Thử phân tích dạng Form (key=value) hoặc Text
if (!userName) {
    // Regex tìm chuỗi 'userName=...' hoặc 'username=...' bất chấp hoa thường
    // Giải mã: username=abc%20def -> abc def
    let match = body.match(/(?:userName|username|user)=([^&]+)/i);
    if (match && match[1]) {
        userName = decodeURIComponent(match[1]);
        console.log("✅ [DEBUG] Parsed via Regex: " + userName);
    }
}

// CÁCH 3: Fallback (Nếu vẫn không lấy được thì dùng tên mặc định để test)
if (!userName) {
    userName = "Naksuu"; 
    console.log("❌ [DEBUG] Failed to parse. Using default: " + userName);
}

// Tạo Response giả
let mockResponse = {
    "code": 0,
    "msg": "login ok",
    "data": {
        "userName": userName
    }
};

$done({
    body: JSON.stringify(mockResponse),
    status: 200,
    headers: { 'Content-Type': 'application/json' }
});
