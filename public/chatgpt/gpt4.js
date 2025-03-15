const axios = require('axios');

function random(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const url = 'https://koala.sh/api/gpt/';
const headers = {
  'Accept': 'text/event-stream',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-US,en;q=0.9',
  'Content-Type': 'application/json',
  'Cookie': '_ga=GA1.1.2071891485.1720919015; cf_clearance=A5RlCm1YLDulyexCBpb_xnx9L_wwuawlrSdAtutn9b4-1720919015-1.0.1.1-isImWVvBXMWx6JkJ0_DD8iZHjaJ7XZro3v6.Kzk9qykIEB94FLOd2PO.NlaHPrfBTkLlXRKcfjj873MYBfgK9g; crisp-client%2Fsession%2Fb21d4851-f776-4e10-bd26-bef59f54886b=session_6ed7ce76-7c47-4df0-9d56-db7863046e64; _iidt=EDfqBQ/zGut8gsWDDwY4aS6YDepHB880GoNk5mE1JalVdMWykmQ1Ms5YfakvJyAHLQcOHr+167fLpA==; _vid_t=6KMe/rgbhilm0saDBHsDJOy6vfjrmsIPeYxkoX4ja0l+01iy1aha7f9KUSTg/TtwEIA+3Lfrsb/37w==; _ga_9LCF2TJ2CY=GS1.1.1720919015.1.1.1720919161.0.0.0',
  'Flag-Real-Time-Data': 'true',
  'Origin': 'https://koala.sh',
  'Priority': 'u=1, i',
  'Referer': 'https://koala.sh/chat',
  'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Visitor-Id': random()
};

function chunks(data) {
  const lines = data.split('\n').filter(line => line.trim() !== '');
  const result = lines.map(line => line.replace(/^data: /, '')).join('');
  return result;
}

exports.name = "/gpt3-turbo";
exports.index = async function (req, res) {
  const data = {
    input: req.query.question,
    inputHistory: [],
    outputHistory: [],
    model: 'gpt-3.5-turbo'
  };

  axios.post(url, data, { headers, responseType: 'stream' })
    .then(result => {
      let msg = '';

      result.data.on('data', chunk => {
        msg += chunk.toString();
      });

      result.data.on('end', () => {
        const resp = chunks(msg);
        res.json({
          author: 'yazky',
          response: resp.replace(/"/g, '')
        });
      });
    })
    .catch(error => {
      res.status(500).json({Error: 'please provide a question first' });
    });
};

