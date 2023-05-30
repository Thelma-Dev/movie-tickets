'use strict';

import { select, print } from './utils.js';

import info from './cities.json' assert { type: "json" };
import movieData from './movies.json' assert { type: "json" };

print(movieData.movies);
print(info.cities);


const storage = select('.storage-display')
const url = './assets/script/movies.json';

const options = {
    method: 'GET',
    headers : {'Content-Type': 'application/json; charset=UTF-8'},
    mode: 'cors'
};


async function getMovies() {
    try {
        const result = await fetch(url, options);

        print('here');
        if(!result.ok){
            throw new Error(`${result.statusText} (${result.status})`);
        }

        const data = await result.json();
        const movies = data.movies;
        
        printMovies(movies);
        
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
        movie.innerHTML = `<img src= "${element.img}" max-width="100%" max-height="100%" border-radius="6px">` +
                            `<p style="color:#fff;margin-top:3px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden">
                            ${element.title}</p>`;
       storage.append(movie);
    });
}



