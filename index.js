const express = require('express')
const app = express()
app.listen(process.env.PORT || 3000)


const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion () {
const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "write a mongoose query to fetch users with their recent chat with all other users",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return completion.data.choices[0].text;
}
app.all('/', (req, res) => {
const resp= runCompletion();
res.send(resp)
})