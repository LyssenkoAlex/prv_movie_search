import { getOMDBInfo } from './api/omdb';
import { getYandexTranslateURL } from './api/translate';
import { LANGUAGE } from './constraints';

let CURRENT_PAGE = 1;

const init = async () => {
	let movies = await getOMDBInfo({ title: 'rabbit', page: CURRENT_PAGE });
	await startSlider(movies);
};

const fillSliders = (movieArray) => {
	if (movieArray.Response === 'True') {
		console.log('movieArray', movieArray);
		movieArray.Search.forEach((x) => {
			createSlide(x);
		});
	}
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
	let y = swiper.slideNext();
	swiper.on('reachEnd', async () => {
		let movies = await getOMDBInfo({ title: 'rabbit', page: ++CURRENT_PAGE });
		swiper.virtual.appendSlide(createSlides(movies));
	});
};

const loadNextSlides = async (page) => {
	let movies = await getOMDBInfo({ title: 'rabbit', page: page });
	await fillSliders(movies);
};

const createSlides = (movies) => {
	let slides = [];

    for (let i = 0; i < movies.Search.length; i += 1) {
        slides.push(`
                            <div class="card">
                            <img src="${movies.Search[i].Poster}" alt="${movies.Search[i].Title}"/>
                            <h5>${movies.Search[i].Title}</h5>
                            </div>
                                `);
    }
    return slides;

};
init();
