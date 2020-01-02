require('dotenv').config();

const axios = require("axios");

axios({
    "method": "GET",
    "url": process.env.JOKE_API_URL
}).then((response) => {
    console.log(response.data.joke.joke);
}).catch((error) => {
    console.error(error)
})