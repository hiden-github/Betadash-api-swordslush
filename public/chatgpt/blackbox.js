const axios = require('axios');
const { URLSearchParams } = require('url');
let fontEnabled = true;

function formatFont(text) { 
  const fontMapping = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
        j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
        s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
        A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I:       "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
  };

  let formattedText = "";
  for (const char of text) {
    if (fontEnabled && char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }
  return formattedText;
}

function formatBoldText(response) {
  return response.replace(/\*\*(.*?)\*\*/g, (match, text) => formatFont(text));
}


function genRndmIdempotencyKey() {
  let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 17; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function genRndmID() {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

exports.name = '/blackbox';
exports.index = async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ error: 'Missing ask parameter' });
  }

  try {
    const sessionIdRes = await axios.get('https://www.blackbox.ai/');
    const sessionId = sessionIdRes.headers['set-cookie'][0].split(';')[0];

 const headers = {
        "sec-ch-ua-platform": "\"Android\"",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
        "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
        "content-type": "application/json",
        "sec-ch-ua-mobile": "?1",
        "accept": "*/*",
        "origin": "https://www.blackbox.ai",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": "https://www.blackbox.ai/",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-PH,en-US;q=0.9,en;q=0.8,ru;q=0.7,tr;q=0.6,zh-CN;q=0.5,zh;q=0.4,fil;q=0.3",
        "cookie": "sessionId=5af10606-480c-4ea3-8a79-242cb9380cec; intercom-id-jlmqxicb=dffd9fe7-2b86-47e0-9d31-a8202db50b14; intercom-device-id-jlmqxicb=5bf7852e-22b8-452e-ae86-42db0cece20c; intercom-session-jlmqxicb=; __Host-authjs.csrf-token=771f45b744aaa236b31d5ff84536f772f9a0264057ee7fc9d87658c4b4a7addb%7Cd0610624f958e27b2c10340f6d5d01be2f900ef5c30c34777015ffeec1c1e0b2; __Secure-authjs.callback-url=https%3A%2F%2Fwww.blackbox.ai", };

    const intercomPingRes = await axios.post('https://api-iam.intercom.io/messenger/web/ping', 
      new URLSearchParams({
        'app_id': 'jlmqxicb',
        'v': '3',
        'g': 'e6f90c749d7765f3b1bbc8b97fa507e4875bf321',
        's': sessionId,
        'r': '',
        'platform': 'mobile_web',
        'installation_type': 'js-snippet',
        'Idempotency-Key': genRndmIdempotencyKey(),
        'internal': '{}',
        'is_intersection_booted': 'true',
        'page_title': 'Chat Blackbox: AI Code Generation, Code Chat, Code Search - Blackbox',
        'user_active_company_id': 'undefined',
        'user_data': '{}',
        'source': 'apiUpdate',
        'sampling': 'true',
        'referer': 'https://www.blackbox.ai/'
      })
    );

    const user = genRndmID();
    const chatReq = {
      'messages': [
        {
          'id': user,
          'content': ask,
          'role': 'user'
        }
      ],
      'id': user,
      'previewToken': null,
      'userId': intercomPingRes.data.user.anonymous_id,
      'codeModelMode': true,
      'agentMode': {},
          "maxTokens": 1024,
    "playgroundTopP": 0.9,
    "playgroundTemperature": 0.5,
      'trendingAgentMode': {},
      'isMicMode': true,
      'isChromeExt': true,
      'githubToken': null,
      'clickedAnswer2': true,
      'clickedAnswer3': true,
      'visitFromURL': true,
       "userSelectedModel": "blackbox.ai-pro",
       "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94"
    };


    const chatRes = await axios.post('https://www.blackbox.ai/api/chat', chatReq, { headers });

    let cleanResponse = chatRes.data;
cleanResponse = cleanResponse.replace(/^[^\S\r\n]*[^\n]*\n\n/, '').replace(/\$~~~\$[\s\S]*?\$~~~\$/g, '').trim();
    cleanResponse = cleanResponse.replace(/https?:\/\/[^\s]+/g, '');
cleanResponse = cleanResponse.replace(/\$@$v=undefined-rv1\$@\$/g, '').trim();
cleanResponse = cleanResponse.replace(/https:\/\/www\.blackbox\.ai/, '').trim();
cleanResponse = cleanResponse.replace(/Generated by BLACKBOX\.AI, try unlimited chat/, '').trim();
let formattedResponse = formatBoldText(cleanResponse);
    res.send({
      Author: "Cliffvincent",
      Response: formattedResponse
 });
  } catch (error) {
    res.status(500).send({ "error": error.message });
  }
};
