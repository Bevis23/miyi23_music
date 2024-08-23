const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const keyword = event.queryStringParameters.keyword;
    const searchUrl = `http://lpz.chatc.vip/apiqq.php?msg=${encodeURIComponent(keyword)}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Failed to fetch data'
        };
    }
};
