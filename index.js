const express = require('express');
var cors = require('cors')
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

const app = express();

const PORT = 8080;

var corsOptions = {
    origin: ['*', 'https://ai4language.kaustubh.app'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

app.use(express.json())

app.listen(PORT, () => console.log('Live on http://localhost:8080'))

app.post('/translate',cors(corsOptions),(req,res) => {
    const {TEXT} = req.body

    if(!TEXT) {
        return res.status(418).send({message : 'Text not specified in request'})
    }else if (TEXT.length > 60){
        return res.status(413).send({message : 'Text specified is larger than 60 characters. Will refuse.'})
    }


    translateText(TEXT, 'or')
        .then((translatedText) => {
            // console.log(translatedText);
            return res.status(200).send({translated : translatedText})
        })
        .catch((err) => {
            return res.status(500).send({message : 'Google Translate API refused the request', error: err})
        });
})


// const detectLanguage = async (text) => {

//     try {
//         let response = await translate.detect(text);
//         return response[0].language;
//     } catch (error) {
//         console.log(`Error at detectLanguage --> ${error}`);
//         return 0;
//     }
// }

// detectLanguage('Oggi è lunedì')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(error);
//     });