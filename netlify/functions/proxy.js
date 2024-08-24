const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    // 设置 CORS 头
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };

    // 处理 OPTIONS 请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: ''
        };
    }

    const keyword = event.queryStringParameters.keyword;
    if (!keyword) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ error: '缺少关键词参数' })
        };
    }

    const searchUrl = `https://lpz.chatc.vip/apiqq.php?msg=${encodeURIComponent(keyword)}`;

    try {
        const response = await fetch(searchUrl, { timeout: 8000 });
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Proxy function error:', error);
        return {
            statusCode: 502,
            headers: headers,
            body: JSON.stringify({ error: '获取数据失败', details: error.message })
        };
    }
};