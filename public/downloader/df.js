const axios = require('axios');
const cheerio = require('cheerio');

exports.name = '/dreamforth'; 

exports.index = async (req, res) => {
    const title = req.query.title || '';
    const page = req.query.page || '1';
    const url = `https://www.dreamforth.com/search.php?query=${encodeURIComponent(title)}&type=dreams&page=${page}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.1'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $('h3').each((index, element) => {
            const titleElement = $(element).find('a');
            const titleText = titleElement.text();
            const link = titleElement.attr('href');
            const description = $(element).next('p').text();
            if (titleText && link && description) {
                results.push({
                    title: titleText,
                    link,
                    description
                });
            }
        });

        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
