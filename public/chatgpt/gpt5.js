const axios = require('axios');

const gpt4 = async (prompt) => {
  try {
    const response = await axios.post(
      'https://apps.voc.ai/api/v1/plg/prompt_stream',
      {
        prompt,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    const array = response.data.split('\n\n');
    const regex = /data: (\{.*?\})/g;
    const mtch = [];

    let match;
    while ((match = regex.exec(array[0])) !== null) {
      mtch.push(match[1]);
    }

    const rgx = /"data": ({.*?})/;
    const ends = mtch.slice(-1);
    const output = ends[0]?.match(rgx);

    return output ? JSON.parse(output[1]) : null;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

exports.name = "/gpt4";
exports.index = async function (req, res) {
  const { ask } = req.query;

  if (!ask) {
    return res.status(400).send({Error: 'Query parameter "ask" is required.'});
  }

  try {
    const response = await gpt4(ask);
    res.json(response);
  } catch (error) {
    res.status(500).send('bawal Kana gumamit');
  }
};