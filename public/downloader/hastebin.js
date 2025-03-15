const axios = require('axios');

exports.name = '/hastebin';
exports.index = async (req, res) => {
    const data = req.query.upload;

    if (!data) {
        return res.status(400).json({ message: 'query upload string is missing' });
    }

const end = ["js", "php", "csharp", "css", "js", "kotlin", "htm"];
  const randomIndex = Math.floor(Math.random() * end.length);
    const tae = end[randomIndex];

    const url = 'https://hastebin.skyra.pw/documents';
    const headers = {
        'authority': 'hastebin.skyra.pw',
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'text/plain',
        'origin': 'https://hastebin.skyra.pw',
        'referer': 'https://hastebin.skyra.pw/',
        'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    };

    try {
        const response = await axios.post(url, data, { headers });
        const documentKey = response.data.key;

        if (documentKey) {
            const documentUrls = {
                status: "200",
                message: 'Document uploaded successfully',
                author: 'cliff',
                skyra: `https://hastebin.skyra.pw/${documentKey}.${tae}`,
                raw: `https://hastebin.skyra.pw/raw/${documentKey}.${tae}`,
            };
            res.status(200).json(documentUrls);
        } else {
            res.status(500).json({ message: 'skills issue Failed to upload the document' });
        }
    } catch (error) {
        res.status(500).json({ message: 'skills issue Error uploading the document', error: error.message });
    }
};

