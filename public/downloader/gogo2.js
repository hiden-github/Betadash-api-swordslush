const gogo = require('gogo-unofficial');

exports.name = '/gogo2';
exports.index = async (req, res) => {
    const q = req.query.info;
    if (!q) {
        return res.status(400).send({error: 'parameter "info" is required'});
    }

    try {
        const data = await gogo.searchinfo(q, "1");
        const text = data[1].title;
        const result = text.replace(/[:\s()]+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');
        const final = await gogo.animeinfo(result);
        res.json(final);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Not found Info of that movie' });
    }
};

