const express = require('express')
const app = express()
app.listen(process.env.PORT || 3000)


const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

 

async function runCompletion (query) {
    const configuration = new Configuration({
        apiKey:process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
     
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
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

try{
const query=req.query.ques;
const resp=  await runCompletion(query);
const resp_=resp.data.choices[0].text;
res.json({"response":resp_});
    }
    catch(e){
        res.json({"result":e.message})
    }
}) 