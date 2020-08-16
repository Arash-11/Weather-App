require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const api_key = process.env.API_KEY;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));


app.post('/', (req, res) => {

    const cityName = req.body.cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${api_key}`;

    https.get(url, (response) => {
        console.log('statusCode: ', response.statusCode);

        if (response.statusCode === 404) res.sendFile(`${__dirname}/404.html`);

        response.on('data', (data) => {
            const weatherData = JSON.parse(data);

            if (!weatherData.weather || !weatherData.main || !weatherData.wind) return;

            const des = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;

            const htmlFile = `
                <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="utf-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">

                            <title>Weather App</title>

                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <link rel="icon" type="image/png" sizes="32x32" href="favicon32x32.png">
                            <link rel="stylesheet" href="style.css">
                            <script src="https://kit.fontawesome.com/92272be603.js" crossorigin="anonymous"></script>
                            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
                        </head>

                        <body>
                            <div class="search">
                                <form action="/" method="post">
                                    <label for="cityInput">city name</label>
                                    <br>
                                    <input id="cityInput" type="text" name="cityName" placeholder="search for city">
                                    <button type="submit"><i class="fas fa-search fa-2x"></i></button>
                                </form>
                            </div>

                            <div class="main-display">
                                <h1>${cityName}</h1>
                                <p class="description">${des}</p>
                                <p class="temperature">${temp} °C</p>
                            </div>

                            <div class="secondary-display">
                                <p class="feels-like">Feels like</p>
                                <p class="feels-like-temp font-bold">${feelsLike}°C</p>
                                <p class="humidity">Humidity</p>
                                <p class="humidity-percentage font-bold">${humidity} %</p>
                                <p class="wind">Wind speed</p>
                                <p class="speed-of-wind font-bold">${windSpeed} m/s</p>
                            </div>
                            
                        </body>
                    </html>
            `

            res.send(htmlFile);
        })
    })

});


app.listen(port, () => console.log('Server is running on port 3000'));