import { getOMDBInfo } from './api/omdb';
import { getYandexTranslateURL } from './api/translate';
import { LANGUAGE } from './constraints';

let CURRENT_PAGE = 1;

const init = async () => {
	let movies = await getOMDBInfo({ title: 'rabbit', page: CURRENT_PAGE });
	await startSlider(movies);
};

const startSlider = async (movies) => {
	console.log('movies: ', movies.Search);
	let swiper = new Swiper('.swiper-container', {
		slidesPerView: 5,
		spaceBetween: 50,
		updateOnWindowResize: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			dynamicBullets: true,
			dynamicMainBullets: true,
			type: 'fraction',
			renderFraction: function (currentClass, totalClass) {
				console.log('totalClass', totalClass);
				return '<span class="' + currentClass + '"></span>' + ' of ' + '<span class="' + totalClass + '"></span>';
			}
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		virtual: {
			slides: (function () {
				return createSlides(movies);
			})()
		}
	});

	swiper.on('reachEnd', async () => {
		let movies = await getOMDBInfo({ title: 'rabbit', page: ++CURRENT_PAGE });
		swiper.virtual.appendSlide(createSlides(movies));
	});
};



const createSlides = (movies) => {
	let slides = [];
	for (let i = 0; i < movies.Search.length; i += 1) {
		slides.push(`
	            <div class="card">
	            <img src="${movies.Search[i].Poster}" alt="${movies.Search[i].Title}"/>
	            <div class="card-body">
	                <a class="paper-btn btn-secondary" href="https://www.imdb.com/title/${movies.Search[i].imdbID}" target="_blank">${movies.Search[i].Title}</a>
	                <h5 class="card-subtitle">${movies.Search[i].Type} ${movies.Search[i].Year}</h5>
	            </div>
	            </div>
	                `);
	}
	return slides;
};
init();
