const fetch = require('node-fetch');
const iconv = require('iconv-lite');

exports.handler = async function (event, context) {
    console.log('Function invoked with query:', event.queryStringParameters);

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };

    if (event.httpMethod === 'OPTIONS') {
        console.log('Handling OPTIONS request');
        return { statusCode: 200, headers: headers, body: '' };
    }

    const keyword = event.queryStringParameters.keyword;
    if (!keyword) {
        console.log('Missing keyword parameter');
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ error: 'Missing keyword parameter' })
        };
    }

    const searchUrl = `http://lpz.chatc.vip/apiqq.php?msg=${encodeURIComponent(keyword)}`;
    console.log('Fetching from URL:', searchUrl);

    try {
        console.log('Initiating fetch request');
        const response = await fetch(searchUrl, { timeout: 15000 });
        console.log('Received response with status:', response.status);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const buffer = await response.buffer();
        const text = iconv.decode(buffer, 'utf-8');  // 假设编码是 UTF-8，如果是 GBK 则改为 'gbk'
        console.log('Decoded response:', text);

        // 将文本响应转换为数组
        const songs = text.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('SyntaxError'));

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ songs: songs })
        };
    } catch (error) {
        console.error('Proxy function error:', error);
        return {
            statusCode: 502,
            headers: headers,
            body: JSON.stringify({ error: 'Failed to fetch data', details: error.message })
        };
    }
};