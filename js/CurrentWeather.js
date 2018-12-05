// Mapping the icon from the API to the appropriate icon class
const iconToIconClass = {
    'rain': 'wi wi-rain',
    'clear-day': 'wi wi-day-sunny',
    'clear-night': 'wi wi-night-clear',
    'snow': 'wi wi-snow',
    'sleet': 'wi wi-sleet',
    'wind': 'wi wi-strong-wind',
    'fog': 'wi wi-fog',
    'cloudy': 'wi wi-cloudy',
    'partly-cloudy-day': 'wi wi-day-cloudy', 
    'partly-cloudy-night': 'wi wi-night-partly-cloudy'
};

// Mapping the icon from the API to the appropriate message
const iconToSummary = {
    'rain': 'Rain',
    'clear-day': 'Clear Day',
    'clear-night': 'Clear Night',
    'snow': 'Snow',
    'sleet': 'Sleet',
    'wind': 'Strong Winds',
    'fog': 'Fog',
    'cloudy': 'Floudy',
    'partly-cloudy-day': 'Partly cloudy', 
    'partly-cloudy-night': 'Partly cloudy'
};

let cachedWeather = {};

// Setting today's weather info of the selected city
function setWeather (result, dailySummary, currentSelectedCity) {
    $('#current-icon').removeClass();
    $('#current-icon').addClass(iconToIconClass[result['icon']]);
    $('#temperature-span').text(`${result['temperature']}°`);
    $('#current-city-name').html(currentSelectedCity);
    $('#today-high').html(dailySummary['temperatureMax']);
    $('#today-low').html(dailySummary['temperatureMin']);
    $('#today-description').html(iconToSummary[dailySummary['icon']]);
    // UNIX timestamps are in seconds, so converting to milliseconds for JS
    let recievedDate = new Date(dailySummary['time'] * 1000);
    $('#current-city-day').html(`${getMonthFromDate(recievedDate)} ${recievedDate.getDate()}`);
}

// Getting the weather info of the selected city
function getWeather(currentSelectedCity) {
    const url = `http://localhost:3010/forecast?latitude=${cities[currentSelectedCity]['latitude']}&longitude=${cities[currentSelectedCity]['longitude']}`;
    return new Promise(resolve => {
        fetch(url)
        .then(response => {
            if (!response.ok) {
                // This means that something went wrong probably on serverside
                // Log the error
                console.error(response);
                // Sending empty JSON to indicate we didn't get what we expected
                resolve({});
            }
            // This means we successfully got a result
            return response.json()
        })
        .then(myJson => resolve(myJson))
        .catch(error => {
            // Log the error. Can't even connect to server
            console.error(error);
            // Sending empty JSON to indicate we didn't get what we expected
            resolve({});
        });
    });
}

// Attempt to get the weather info of selected city
$('.dropdown-value').on('click', async e => {
    const currentSelectedCity = e.target.text;
    setDropdownTitle(currentSelectedCity);
    if ($(e.target).hasClass('disabled')) {
        e.preventDefault();
    } else {
        await updateWeatherInfo(currentSelectedCity);
    }
});

// Validate the object that we recieved
const validateResultObj = jsonObj => jsonObj.hasOwnProperty('currently') &&
        jsonObj.hasOwnProperty('daily') &&
        jsonObj["daily"].hasOwnProperty('data') &&
        jsonObj["daily"]["data"].length > 0;

// Update the page with the weather info we want
async function updateWeatherInfo(currentSelectedCity) {
    if (cachedWeather.hasOwnProperty(currentSelectedCity) 
    && userCheckedWithinFiveMinutes(currentSelectedCity)) {
        updateWeatherInfoFromCache(currentSelectedCity);
        $('#retrieval-error').hide();
        return;
    }
    showLoader();
    $('#retrieval-error').hide();
    const result = await getWeather(currentSelectedCity);
    if (validateResultObj(result)) {
        setWeather(result['currently'], result['daily']['data'][0], currentSelectedCity);
        setForecast(result['daily']['data']);
        saveWeatherInfoToCache(result, currentSelectedCity);
        $('#weather-info').show();
        $('#forecast-container').show();
    } else {
        // Show error div
        $('#retrieval-error').fadeIn(300);
        $('#error-city-name').html(currentSelectedCity);
    }
    saveCurrentCityToStorage(currentSelectedCity);
    hideLoader();
}

function saveWeatherInfoToCache(result, currentSelectedCity) {
    cachedWeather[currentSelectedCity] = {};
    cachedWeather[currentSelectedCity]['forecast'] = result['daily']['data'];
    cachedWeather[currentSelectedCity]['currently'] = result['currently'];
    cachedWeather[currentSelectedCity]['currentDayInfo'] = result['daily']['data'][0];
    cachedWeather[currentSelectedCity]['time'] = new Date(result['currently']['time'] * 1000);
}

function updateWeatherInfoFromCache(currentSelectedCity) {
    setWeather(cachedWeather[currentSelectedCity]['currently'], cachedWeather[currentSelectedCity]['forecast'][0], currentSelectedCity);
    setForecast(cachedWeather[currentSelectedCity]['forecast']);
}

function userCheckedWithinFiveMinutes(currentSelectedCity) {
    const cachedDate = cachedWeather[currentSelectedCity]['time'];
    const nowDate = new Date();
    return ((nowDate - cachedDate)/1000)/60 < 5;
}

// Convert month number from date to word
function getMonthFromDate(date) {
    const months = [ 
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
}