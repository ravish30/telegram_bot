const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const {data} = require("./data/Shaayri");

dotenv.config();

const app = express();


const { TOKEN, SERVER_URL, PORT } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

app.use(express.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.post(URI, async (req, res) => {
  console.log(req.body);

  const chatID = req.body.message.chat.id;
  const text = req.body.message.text;

  let msg = "";
  if (text == "/tareef") {
    const reply = await axios.get(
      "https://8768zwfurd.execute-api.us-east-1.amazonaws.com/v1/compliments"
    );
    msg += reply.data;
  } 
  else if(text == "/shayari") {
    const num = Math.floor(Math.random()*10);
    // console.log(num);
    msg += data[num];
  }
  
  else {
    msg += "Could not able to understand :(";
  }

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatID,
    text: msg,
  });

  return res.send();
});

app.listen(PORT, async () => {
  console.log("app started at port", PORT);
  await init();
});
