/**
 * Script: game_bypass_v2.js
 * Logic: Chỉ can thiệp khi là POST và tìm thấy userName
 */

const method = $request.method;
const body = $request.body;

// 1. CHỐT CHẶN: Nếu không phải POST hoặc không có body, bỏ qua ngay lập tức!
// Việc này giúp script không chạy lung tung khi bật app (tránh bắt nhầm request GET/OPTIONS)
if (method !== 'POST' || !body) {
    console.log(`[PASS] Method: ${method} - Skipping...`);
    $done({}); // Trả về nguyên bản, không chỉnh sửa gì
} else {
    // 2. XỬ LÝ: Chỉ chạy khi đã qua chốt chặn trên
    let userName = null;

    try {
        // Thử parse JSON
        let reqData = JSON.parse(body);
        if (reqData.userName) userName = reqData.userName;
        else if (reqData.username) userName = reqData.username;
    } catch (e) {
        // Thử parse Form Data
        let match = body.match(/userName=([^&]+)/i);
        if (match && match[1]) userName = decodeURIComponent(match[1]);
    }

    // 3. QUYẾT ĐỊNH CUỐI CÙNG
    if (userName) {
        // Nếu tìm thấy username -> Chỉnh sửa Response
        console.log(`[SUCCESS] Found userName: ${userName}. Modifying response.`);
        
        let newResponse = {
            "code": 0,
            "msg": "login ok",
            "data": {
                "userName": userName
            }
        };

        $done({
            body: JSON.stringify(newResponse),
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        // Nếu là POST nhưng không tìm ra username (request rác) -> Bỏ qua
        console.log("[FAIL] POST request but no userName found. Returning original.");
        $done({});
    }
}
