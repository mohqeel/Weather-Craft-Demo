const weatherForecastIds = [
    "daily-date-", "daily-icon-", "high-", "low-", "daily-description-"
];

const forecastIdsToJSONParameter = {
    "daily-date-": "time",
    "daily-icon-": "icon",
    "high-": "temperatureMax",
    "low-": "temperatureMin",
    "daily-description-": "summary"
};

const days = [ {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6} ];

// Compile and append Handlebars template for the 7 days
const source = document.getElementById("forcast-template").innerHTML;
const template = Handlebars.compile(source);
const html = template(days);
$("#upcoming-weather").append(html);

// Function to get the element identifier
const getForecastElementId = (foreCastId, dayId) => `#${weatherForecastIds[foreCastId]}${days[dayId]["id"]}`;

const buildTimeElement = (data, forecastElementId, dayIndex) => {
    const recievedDate = new Date(data[dayIndex + 1]["time"] * 1000);
    const dateString = `${getMonthFromDate(recievedDate)} ${recievedDate.getDate()}`;
    $(forecastElementId).html(dateString);
};

const buildIconElement = (data, forecastElementId, dayIndex) => {
    $(forecastElementId).removeClass();
    $(forecastElementId).addClass(iconToIconClass[data[dayIndex + 1]["icon"]]);
};

const buildTempMaxElement = (data, forecastElementId, dayId) => { $(forecastElementId).html(data[dayId + 1]["temperatureMax"]); }
const buildTempMinElement = (data, forecastElementId, dayId) => { $(forecastElementId).html(data[dayId + 1]["temperatureMin"]); }
const buildSummaryElement = (data, forecastElementId, dayId) => { $(forecastElementId).html(iconToSummary[data[dayId + 1]["icon"]]); }

// Setting forecast for each day
function setForecast(dailyDataArray) {
    for(let i = 0; i < days.length; i++){
        for(let j = 0; j < weatherForecastIds.length; j++) {
            const forecastElementId = getForecastElementId(j, i);
            switch(forecastIdsToJSONParameter[weatherForecastIds[j]]){
                case "time":
                    buildTimeElement(dailyDataArray, forecastElementId, i);
                    break;
                case "icon":
                    buildIconElement(dailyDataArray, forecastElementId, i);
                    break;
                case "temperatureMax":
                    buildTempMaxElement(dailyDataArray, forecastElementId, i);
                    break;
                case "temperatureMin":
                    buildTempMinElement(dailyDataArray, forecastElementId, i);
                    break;
                case "summary":
                    buildSummaryElement(dailyDataArray, forecastElementId, i);
                    break;
            }
        }
    }
}