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
    max_tokens: 4000,
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



const request = require('request');
const url = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';

let countriesData;



// Get the countries data from the URL
request(url, (err, response, body) => {
    if (err) {
        console.error(err);
    } else {
        countriesData = JSON.parse(body);
    }
});

// Function to get the route from origin to destination
function getRoute(originCountry, destinationCountry) {
    let originCountryData;
    let destinationCountryData;
    let route = [];

    // Find the origin and destination countries data
    countriesData.forEach(country => {
        if (country.cca3 === originCountry) {
            originCountryData = country;
        }
        if (country.cca3 === destinationCountry) {
            destinationCountryData = country;
        }
    });

    // Find the route by crossing through each country's borders
    if (originCountryData && destinationCountryData) {
        let borderCountries = originCountryData.borders;
        route.push(originCountry);
        while (borderCountries.indexOf(destinationCountry) === -1) {
            let nextCountry = undefined;
            for (let i = 0; i < borderCountries.length; i++) {
                let borderCountry = countriesData.find(country => country.cca3 === borderCountries[i]);
                if (borderCountry.borders.indexOf(destinationCountry) !== -1) {
                    nextCountry = borderCountry.cca3;
                    break;
                }
            }
            route.push(nextCountry);
            originCountryData = countriesData.find(country => country.cca3 === nextCountry);
            borderCountries = originCountryData.borders;
        }
        route.push(destinationCountry);
    }

    // Return the route or a 400 status code if no route is possible
    if (route.length > 0) {
        return {
            route
        }
    } else {
        return {
            statusCode: 400
        }
    }
}

// REST endpoint for getting the route between two countries
app.get('/routing/:originCountry/:destinationCountry', (req, res) => {
    const { originCountry, destinationCountry } = req.params;
    res.json(getRoute(originCountry, destinationCountry));
});
