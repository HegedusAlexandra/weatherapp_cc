//----------CREATE COMPONENTS----------

//----------Search Component----------
const citySearchComponent = function () {
    return `
        <input type="text" id="search" placeholder="Enter city here...">
    `
};

//----------Search Button Component----------
const searchButtonComponent = function () {
    return `
        <button id="submit">
            <ion-icon name="search-outline">
        </ion-icon></button>
    `
};

//----------Search Button Component----------
const favButtonComponent = function () {
    return `
        <button id="favButton">
            <ion-icon name="heart-outline"></ion-icon>
        </button>
    `
};

//----------Favorite City Component----------
const favCityItemComponent = function (name) {
    return `
        <option value="${name}">${name}<option>
    `
};

//----------Parent Component for List Items----------
const suggestionsComponent = function () {
    return `
        <div id="suggestions"></div>
    `
};

//----------List Item Component----------
const listItemComponent = function (name) {
    return `
        <option value="${name}">${name}</option>
    `
};

//----------Card Container Component----------
const cardContainerComponent = function () {
    return `
        <section id="container"></section>
    `
};

//----------Card Component----------
const cityCardComponent = function (date, name, country, icon, temp, condition) {
    return `
        <div class="city-card">
            <p>${date}</p>
            <h5 id="name">${name}</h5>
            <p id="country">${country}</p>
            <img src="${icon}">
            <h6 id="temperature">${temp}</h6>
            <p id="condition">${condition}</p>
        </div>
    `
};

//----------Loading Spinner Component----------
const loadingSpinnerComponent = function () {
    return `
        <div hidden id="spinner"></div>
    `
};

//----------My Weather API key----------
const myKey = "dd27ce39ba9342f5a5a124154221605";

//----------LOAD EVENT----------
const loadEvent = function () {
    //----------root element----------
    const rootElement = document.getElementById("root");
    
    //----------add components to DOM----------
    rootElement.insertAdjacentHTML("beforeend", favButtonComponent());
    
    rootElement.insertAdjacentHTML("beforeend", citySearchComponent());

    rootElement.insertAdjacentHTML("beforeend", searchButtonComponent());
    
    rootElement.insertAdjacentHTML("beforeend", suggestionsComponent());
    
    rootElement.insertAdjacentHTML("beforeend", cardContainerComponent());

    rootElement.insertAdjacentHTML("beforebegin", loadingSpinnerComponent());

    //----------VARIABLES FOR ELEMENTS----------
    
    //----------input element----------
    const search = document.getElementById("search");

    //----------search button element----------
    const searchButton = document.getElementById("submit");

    //----------fav button element----------
    const favButton = document.getElementById("favButton");

    //----------suggestions element----------
    const suggestionsElement = document.getElementById("suggestions");

    //----------EVENT LISTENERS----------

    //----------input element event listeners----------
    search.addEventListener("keypress", pressEnter);

    search.addEventListener("input", autoComplete);

    //----------search button event listener----------
    searchButton.addEventListener("click", searchButtonClick);

    //----------fav button event listener----------
    favButton.addEventListener("click", saveIt);

    //----------list item element event listener----------
    suggestionsElement.addEventListener("click", listItemClick);

    //----------document event listener - click outside the input----------
    document.addEventListener("click", showFav);

    //----------EVENT LISTENER FUNCTIONS----------

    //----------press enter----------
    function pressEnter (event) {
        if (event.key == "Enter") {
            if (favButton.innerHTML = `<ion-icon name="heart"></ion-icon>`) {
                favButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`
            }
            getData(search.value);
            getImage(search.value);
            search.value = "";
            suggestionsElement.innerHTML = "";
        }
    };

    //----------auto complete input----------
    function autoComplete () {
        if (search.value.length === 0) {
            Cities(favCities);
        } else {
            getCity(search.value)
        }
    };

    //----------click outside the input element----------
    function showFav (event) {
        if(!search.contains(event.target)) {
            suggestionsElement.innerHTML = "";
        } else {
            Cities(favCities);
        }
    };

    //----------search button click----------
    function searchButtonClick () {
        if (favButton.innerHTML = `<ion-icon name="heart"></ion-icon>`) {
            favButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`
        }
        getData(search.value);
        getImage(search.value);
        search.value = "";
        suggestionsElement.innerHTML = "";
    };

    //----------favorite button click----------
    let favCities = [];

    function saveIt () {
        if (favButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`) {
            favCities.push(listOfName);
            Cities(favCities);
            favButton.innerHTML = `<ion-icon name="heart"></ion-icon>`;
            suggestionsElement.innerHTML = "";
        } else {
            favButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon>`
        }
    };

    //----------list item click----------
    function listItemClick (event) {
        if (event.target && event.target.nodeName === "OPTION") {
            search.value = event.target.value;
            suggestionsElement.innerHTML = "";
        }
    };

    //----------fetching weather data----------
    async function getData (value) {
        //loading spinner appears
        spinner.removeAttribute('hidden');

        //make request to url
        spinner.removeAttribute('hidden');
        
        const response = await fetch(`
        http://api.weatherapi.com/v1/current.json?key=${myKey}&q=${value}&aqi=no
        `);

        
        //if the input is invalid
        if (response.status != 200) {
            alert("City not found!");
            spinner.setAttribute('hidden', '')
        } else {
            const cityWeather = await response.json();

            //weather card container element
            const cardContainerElement = document.getElementById("container");

            //delay all data to give some time to the loading spinner
            setTimeout(function () {spinner.setAttribute('hidden', '');
            
            //current date
            const getLocalDate = function(localTime){
                const year = parseInt(localTime.substring(0, 4));
                const month = parseInt(localTime.substring(5, 7));
                const day = parseInt(localTime.substring(8, 10));
                const date = new Date(`${year}, ${month}, ${day}`);
                
                //array of weekdays
                const weekDays = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ];

                const dayOfTheWeek = weekDays[date.getDay()];

                //array of months
                const monthOfYear = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ];

                return `${dayOfTheWeek}, ${day} ${monthOfYear[month-1]} ${year}`
            };

            const currentDate = getLocalDate(cityWeather.location.localtime);
            
            //insert data to DOM
            cardContainerElement.innerHTML = cityCardComponent(
                `${currentDate}`,
                `${cityWeather.location.name}`,
                `${cityWeather.location.country}`,
                `${cityWeather.current.condition.icon}`,
                `${cityWeather.current.temp_c}°`,
                `${cityWeather.current.condition.text}`
                );

            //----------variable for the favorite button----------
            listOfName = cityWeather.location.name;

            },1000); //the amount of delay time
        }
    };

    //-----------Pexels API for background image---------------
    async function getImage (value) {

        const response = await fetch(`https://api.pexels.com/v1/search?query=${value}`,{
            headers: {Authorization: "563492ad6f91700001000001ff24965070704f299ee63e106f4ed677"}
        });
        
        const cityImage = await response.json();
        
        document.querySelector("body").style.backgroundImage = `url(${cityImage.photos[0].src.landscape})`
    };

    //----------fetching autocomplete data----------
    async function getCity (value) {
        //make request to url
        const response = await fetch (`
        http://api.weatherapi.com/v1/search.json?key=${myKey}&q=${value}
        `);
        
        const cities = await response.json();

        //empty array for the city names
        let results = [];

        //iterate through the array of objects
        for (let i = 0; i < cities.length; i++) {
            //fill my empty array with the city names
            results.push(cities[i].name)
        }

        //if the input field is empty, we ain't no need no list no more!
        if (`${value}`.length === 0) {
            results = [];
            suggestionsElement.innerHTML = "";
        };

        //call the function which inserts the city names to DOM
        listItemHtml(results);
    };

    //----------insert city names to DOM----------
    function listItemHtml (results) {
        const item = results.map(listItemComponent).join(" ");
        suggestionsElement.innerHTML = item
    };

    //----------insert city names to favorites----------
    function Cities (favCities) {
        const item = favCities.map(favCityItemComponent).join(" ");
        suggestionsElement.innerHTML =  item
    };
}

window.addEventListener("load", loadEvent)