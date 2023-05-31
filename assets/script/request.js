'use strict';

import { select, print, getElement, onEvent } from './utils.js';

import info from './cities.json' assert { type: "json" };
import movieData from './movies.json' assert { type: "json" };

print(movieData.movies);
print(info.cities);


const storage = select('.storage-display');
const movieInput = select('.movie-input');
const cityInput = select('.city-input');
const body = select('body');
const movieSearchResult = getElement('moviesearch-result');
const citySearchResult = getElement('citysearch-result');
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



function printMovies(el) {
    el.forEach(element => {
        let movie = document.createElement('div');
        movie.classList.add('movies');
        movie.innerHTML = `<img src= "${element.img}" max-width="100%" max-height="100%" border-radius="6px">` +
                            `<p style="color:#fff;margin-top:3px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden">
                            ${element.title}</p>`;
       storage.append(movie);
    });
}


// Adding an autocomplete feature in search
// Create an array of all movie titles
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


function findMatches(keyword, movieTitleArray) {
    let movie = document.createElement('div');

    if(keyword == '') {
        return;
    }

    for(let i = 0; i < movieTitleArray.length; i++) {

        if(movieTitleArray[i].toLowerCase().includes(keyword.toLowerCase())) {

            movie = document.createElement('div');
            movie.innerHTML = movieTitleArray[i];
            movieSearchResult.append(movie);

            closeMovieSearchResult(movie);
        }        
    }
    
}


function findCityMatches(keyword, cityArray) {
    let city = document.createElement('div');

    if(keyword == '') {
        return;
    }

    for(let i = 0; i < cityArray.length; i++) {

        if(cityArray[i].toLowerCase().includes(keyword.toLowerCase())) {

            city = document.createElement('div');
            city.innerHTML = cityArray[i];
            citySearchResult.append(city);

            closeCitySearchResult(city);
        }        
    }
    
}

function onNoMatches(keyword, movieTitleArray) {
    
    for(let i = 0; i < movieTitleArray.length; i++) {

        if(!movieTitleArray[i].toLowerCase().includes(keyword.toLowerCase())) {
            let movie = document.createElement('div');
            movie.innerHTML = "Movie not found";
            movieSearchResult.append(movie);
        }
    }
    
}


function closeMovieSearchResult(movie) {

    onEvent('click', movie, () => {
        closeMovieSelection(movie);
        movieInput.value = '';
    })
}


function closeMovieSelection(movie) {
    if (movieSearchResult)
        movieSearchResult.remove(movie);
}


function closeCitySearchResult(city) {
    onEvent('click', city, () => {
        closeCitySelection(city);
        cityInput.value = '';
    })
}

function closeCitySelection(city) {
    if (citySearchResult)
        citySearchResult.remove(city);
}

function displaySearchResult(searchResultBar) {

    searchResultBar.style.display = 'block';
}

function hideSearchResult(searchResultBar) {

    searchResultBar.style.display = 'none';
}

onEvent('keyup', movieInput, function() {

    displaySearchResult(movieSearchResult);

    let input = movieInput.value;

    if(input.length > 1) {
        findMatches(input, movieTitleArray);
    }
})

onEvent('keyup', cityInput, function() {

    displaySearchResult(citySearchResult);

    let input = cityInput.value;

    if(input.length > 1) {
        findCityMatches(input, cityArray);
    }
})

onEvent('click', body, function() {
    if(citySearchResult || movieSearchResult) {
        hideSearchResult(citySearchResult);
        hideSearchResult(movieSearchResult);
    }
})
    
