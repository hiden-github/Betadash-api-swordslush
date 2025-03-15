const request = require('request');

exports.name = '/shorten';
exports.index = async (req, res) => {
    const url = req.query.link;
    const isUrl = /https?:\/\//.test(url);

    if (!isUrl) {
        return res.json({ creator: 'Cliff', status: false });
    }

    const apiUrl = 'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url);

    request(apiUrl, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            return res.json({ creator: 'Cliff', status: false });
        }

        return res.json({ url: body });
    });
};
