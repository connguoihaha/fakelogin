/**
 * Script: game_bypass.js
 * Action: Lấy userName từ Request Body và giả lập Response Login thành công.
 */

let body = $request.body;
let userName = "dev_test"; // Giá trị fallback

// 1. Cố gắng lấy userName từ Payload gửi đi
if (body) {
    try {
        // Thử parse JSON
        let reqData = JSON.parse(body);
        if (reqData.userName) userName = reqData.userName;
    } catch (e) {
        // Thử parse Form Data (key=value)
        let match = body.match(/userName=([^&]+)/);
        if (match && match[1]) userName = decodeURIComponent(match[1]);
    }
}

// 2. Tạo Response giả lập
let mockResponse = {
    "code": 0,
    "msg": "login ok",
    "data": {
        "userName": userName
    }
};

// 3. Trả về kết quả
$done({
    body: JSON.stringify(mockResponse),
    status: 200,
    headers: { 'Content-Type': 'application/json' }
});
