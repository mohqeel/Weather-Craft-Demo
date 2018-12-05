// Hardcoding the choices for city
const cities = {
    "San Francisco": {
        "latitude": "37.47",
        "longitude": "-122.26"
    },
    "Los Angeles": {
        "latitude": "34.3",
        "longitude": "-118.15"
    }
};

const localStoreKeyForCity = "cityName";

// Caching the selected city to the browser
function saveCurrentCityToStorage(currentSelectedCity) {
    localStorage.setItem(localStoreKeyForCity, currentSelectedCity);
}

async function loadCityInfoFromStorage() {
    if (localStorage.getItem(localStoreKeyForCity) !== null) {
        currentSelectedCity = localStorage.getItem(localStoreKeyForCity);
        setDropdownTitle(currentSelectedCity);
        await updateWeatherInfo(currentSelectedCity);
    }
}