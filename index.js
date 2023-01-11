const express = require('express')
const app = express()
app.listen(process.env.PORT || 3000)


const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion (query) {
    
return await openai.createCompletion({
    model: "text-davinci-003",
    prompt: query,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  
}

app.all('/', async(req, res) => {
try{
const query=req.query.ques;
const resp=  await runCompletion(query);
const resp_=resp.data.choices[0].text;
res.send({"result":resp_});
    }
    catch(e){
        res.json({"result":e.message})
    }
}) 