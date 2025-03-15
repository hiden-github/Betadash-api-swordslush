const gogo = require('gogo-unofficial');

exports.name = '/gogo';
exports.index = async (req, res) => {
    const { search, ep } = req.query;
    if (!search || !ep) {
        return res.status(400).send({error: 'parameters "search" and "ep" are required'});
    }

    try {
        const data = await gogo.searchinfo(search, "1");
        const text = data[1].title;
        const result = text.replace(/[:\s()]+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');
        const final = await gogo.videoinfo(result, ep);
        res.json(final);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Not found Movie" });
    }
};