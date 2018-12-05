// Activating the materialize dropdown
$('.dropdown-trigger').dropdown();

// Checking and loading weather info for the last city the user selected
loadCityInfoFromStorage();

// Set the dropdown title to the selected city
function setDropdownTitle(currentSelectedCity) {
    if (currentSelectedCity !== "") {
        $("#dropdown-span").html(currentSelectedCity);
        hideLoader();
    }
}

function showLoader() {
    $("#spinner").show();
}

function hideLoader() {
    $("#spinner").hide();
}