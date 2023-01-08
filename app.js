const express = require('express');
const app = express();

const https = require('https');

const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req, res) {

    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    console.log(req.body);
    const query = req.body.cityName;
    const appid = "cf58c226cb4862479cdd5d279d1b21fb";
    const units = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ appid +"&units="+ units;

    // a 401: unauthorized occurs when the url is not authorized using the correct API key and a 404: not found error occurs when the url that we provided doesn't exist
    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {
            // console.log(data); // returns a hex code and after putting the hex code into a hex-to-text converter we get the correct data
            const weatherData = JSON.parse(data);
            console.log(weatherData);

            const object = {
                name: "Anjishnu",
                favouriteFood: "Ramen"
            }

            console.log(JSON.stringify(object)); // converts a Javascript object into a flat string

            const temp = weatherData.main.temp;
            console.log("The temperature now in "+ query + " is " + temp);

            const weather = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            console.log("The weather now in "+ query + " is " + weather);

            res.write("<p>The weather in "+ query +" is " + weather + "</p>");
            res.write("<h1>The temperature in "+ query +" is " + temp + " degrees Celsius</h1>");
            res.write("<img src=" + iconurl + ">");
            res.send();
        });
    });
    // console.log("Post request received");
});



    // res.send("Server is up and running");
    // Remember that we can have only one res.send in any of the get() methods, but we can have multiple res.write()

app.listen(process.env.PORT || 4000, function() {
    console.log("Server is running on port 4000");
});