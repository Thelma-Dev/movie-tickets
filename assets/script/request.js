'use strict';

import { select, print, getElement, onEvent } from './utils.js';


import cityData from './cities.js';
import movieData from './movies.js';


const storage = select('.storage-display');
const movieInput = select('.movie-input');
const cityInput = select('.city-input');
const body = select('body');
const movieSearchResultBox = getElement('moviesearch-result');
const citySearchResultBox = getElement('citysearch-result');
const movieTitleArray = [];
const cityArray = [];
const movieUrl = './assets/script/movies.json';
const cityUrl = './assets/script/cities.json';

const options = {
    method: 'GET',
    headers : {'Content-Type': 'application/json; charset=UTF-8'},
    mode: 'cors'
};


async function getMovies() {
    try {
        const result = await fetch(movieUrl, options);

        if(!result.ok){
            throw new Error(`${result.statusText} (${result.status})`);
        }

        const data = await result.json();
        const movies = data.movies;
        
        printMovies(movies);
        getMovieTitles(movies);
        
    } 
    catch(error) {
        print(error.message);
    }
}

getMovies();


function printMovies(el) {
    el.forEach(element => {
        let movie = document.createElement('div');
        movie.classList.add('movies');
        movie.innerHTML = `<img src= "${element.img}" class="movie-img">` +
                            `<p class="movie-title">
                            ${element.title}</p>`;
       storage.append(movie);
    });
}


async function getCities() {
    try {
        const result = await fetch(cityUrl, options);

        if(!result.ok){
            throw new Error(`${result.statusText} (${result.status})`);
        }

        const data = await result.json();
        const cities = data.cities;
        
        getCityNames(cities);
        
    } 
    catch(error) {
        print(error.message);
    }
}
getCities();


// Add autocomplete search feature
// Get words to be searched into an array, filter the array based on matching keyword
function getMovieTitles(el) {
    el.forEach(element => {
        movieTitleArray.push(element.title)
    });
}

function getCityNames(el) {
    el.forEach(element => {
        cityArray.push(element.name)
    });
}


function findMovieKeywordMatch(keyword, movieTitleArray) {
    let result = [];

    if(keyword == '') {
        return;
    }


    result = movieTitleArray.filter((movie) => {
           return movie.toLowerCase().includes(keyword.toLowerCase());
    })

    displayMatchedMovies(result);
   
}


function displayMatchedMovies(result){
    let movie = document.createElement('div');

    if(result.length) {
        resetSearch(movieSearchResultBox);

        for(let i = 0; i < result.length; i++) {
            movie = document.createElement('div');
            movie.innerHTML = result[i];
            movieSearchResultBox.append(movie);
    
            selectMovieFromSearchResult(movie);
        }
    }

    if(!result.length) {
        movieSearchResultBox.innerHTML = "No movie found";
        movieSearchResultBox.style.padding = '10px';
    }
}


function findCityKeywordMatch(keyword, cityArray) {
    let result = [];

    if(keyword == '') {
        return;
    }


    result = cityArray.filter((city) => {
        return city.toLowerCase().includes(keyword.toLowerCase());
    })

    displayMatchedCities(result);
}


function displayMatchedCities(result) {
    let city = document.createElement('div');

    if(result.length) {
        resetSearch(citySearchResultBox);
        for(let i = 0; i < result.length; i++){
            city = document.createElement('div');
            city.innerHTML = result[i];
            citySearchResultBox.append(city);
    
            selectCityFromSearchResult(city);
        }
    }

    if(!result.length) {
        citySearchResultBox.innerHTML = "No cities found";
        citySearchResultBox.style.padding = '10px';
    }
}


// Event Listeners
onEvent('input', movieInput, function() {

    displaySearchResultBox(movieSearchResultBox);
    let input = movieInput.value;

    if(input.length > 1) {
        findMovieKeywordMatch(input, movieTitleArray);  
    }
    else{
        hideSearchResultBox(movieSearchResultBox);
    }
})

onEvent('input', cityInput, function() {

    displaySearchResultBox(citySearchResultBox);
    let input = cityInput.value;

    if(input.length > 1) {
        findCityKeywordMatch(input, cityArray);
    }
    else{
        hideSearchResultBox(citySearchResultBox);
    }

})

onEvent('click', body, function() {
    if(citySearchResultBox || movieSearchResultBox) {
        hideSearchResultBox(citySearchResultBox);
        hideSearchResultBox(movieSearchResultBox);
    }
})


// Helper Functions
function selectMovieFromSearchResult(movie) {

    onEvent('click', movie, () => {
        closeMovieSearchBox(movie);
        movieInput.value = movie.innerHTML;
    })
}


function closeMovieSearchBox(movie) {
    if (movieSearchResultBox){
        movieSearchResultBox.remove(movie);
    }
        
}


function selectCityFromSearchResult(city) {
    onEvent('click', city, () => {
        closeCitySearchBox(city);
        cityInput.value = city.innerHTML;
    })
}

function closeCitySearchBox(city) {
    if (citySearchResultBox)
        citySearchResultBox.remove(city);
}

function displaySearchResultBox(searchResultBox) {

    searchResultBox.style.display = 'block';
}

function hideSearchResultBox(searchResultBox) {

    searchResultBox.style.display = 'none';
}

function resetSearch(searchResultBox) {
    searchResultBox.innerHTML = '';
    searchResultBox.style.padding = '0px';
}

