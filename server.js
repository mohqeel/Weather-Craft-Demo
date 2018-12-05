const express = require('express');
const app = express();
const request = require('request');
const port = '3010';
const apiKey = '2ce8441359c2f49f0b41938c680b9434';
const url = `https://api.darksky.net/forecast/${apiKey}/`;

const setResHeader = res => {
    const accessCtrlAllow = "Access-Control-Allow";
    res.header(`${accessCtrlAllow}-Origin`, '*');
    res.header(`${accessCtrlAllow}-Methods`, 'GET, PUT, POST, DELETE, OPTIONS');
    res.header(`${accessCtrlAllow}-Headers`, 'Content-Type, Authorization, Content-Length, X-Requested-With');
};

const getRequestUrl = (latitude, longitude) => `${url}${latitude},${longitude}?exclude=minutely,hourly,alerts,flags`;

app.get('/forecast', (req, res) => {
    setResHeader(res);
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const requestUrl = getRequestUrl(latitude, longitude);
    request.get(requestUrl, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        res.json(JSON.parse(body));
    });
});

// Console logging port just for info
app.listen(port, () => console.log(`listening on ${port}`));