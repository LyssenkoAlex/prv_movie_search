import Swiper from 'swiper';
import getYandexTranslateURL from './api/translate';
import { DEFAULT_SEARCH_VALUE, OMDB_URL } from './constraints';
import { createSlides, cursorPosition } from './utils';
import getOMDBInfo from './api/omdb';

let CURRENT_PAGE = 1;
let swiper;

const inputTitle = document.getElementById('paperInputs1');
const buttonSearch = document.querySelector('.input-icon');
const fountTotal = document.querySelector('.fondWrapper');
const clearButton = document.querySelector('.clear_icon');

const loader = document.querySelector('.loader');
const searchNote = document.querySelector('.searchNote');

const loaderUpdate = (loaderCommand, message) => {
	if (loaderCommand === 'start') {
		loader.style.animationDuration = '2s';
		loader.style.borderTopColor = '#41403e';
	} else if (loaderCommand === 'stop') {
		loader.style.animationDuration = '0s';
		loader.style.borderTopColor = '#8bc34a';
		fountTotal.innerHTML = message;
		searchNote.innerHTML = ``;
	} else if (loaderCommand === 'error') {
		loader.style.animationDuration = '0s';
		loader.style.borderTopColor = '#F44336';
		searchNote.innerHTML = message;
		fountTotal.innerHTML = 'Found: 0';
	}
};

const fillImdRating = async (movies) => {
	const ratingURl = movies.Search.map((movie) => `${OMDB_URL}i=${movie.imdbID}`);
	try {
		const ratingResp = await Promise.all(
			ratingURl.map(async (rating) => {
				const response = await fetch(rating);
				return response.json();
			})
		);

		movies.Search.forEach((movie) => {
			// eslint-disable-next-line no-param-reassign
			movie.imdbRating = ratingResp.filter((rating) => rating.imdbID === movie.imdbID)[0].imdbRating;
		});
	} catch (e) {
		loaderUpdate('error', 'An error has happend');
	}
};

const searchTitle = async (searchType) => {
	loaderUpdate('start');
	// eslint-disable-next-line no-plusplus,no-unused-expressions
	searchType === 'PROCEED' ? ++CURRENT_PAGE : (CURRENT_PAGE = 1);
	let title = '';
	// eslint-disable-next-line no-unused-expressions
	inputTitle.value === '' ? (title = DEFAULT_SEARCH_VALUE) : (title = inputTitle.value);
	const translation = await getYandexTranslateURL({ text: title });
	const translatedWord = translation.text[0];
	const movies = await getOMDBInfo({ title: translatedWord, page: CURRENT_PAGE });

	if (movies.Search !== undefined && movies.Search.length > 0) {
		await fillImdRating(movies);
		if (searchType === 'NEW') {
			swiper.virtual.slides = [];
			swiper.virtual.slides = createSlides(movies);
			swiper.virtual.update(true);
			swiper.slideTo(0, 1);
		}

		if (searchType === 'PROCEED') {
			swiper.virtual.appendSlide(createSlides(movies));
			swiper.virtual.update(true);
		}
		loaderUpdate('stop', `Found: ${movies.totalResults}`);
		searchNote.innerHTML = `Showing results for ${translatedWord}`;
	} else {
		loaderUpdate('error', 'Nothing found!');
		searchNote.innerHTML = `Nothing found for ${title}`;
	}
};

const startSlider = async (movies, title) => {
	swiper = new Swiper('.swiper-container', {
		slidesPerView: 1,
		spaceBetween: 50,
		speed: 400,
		watchSlidesVisibility: true,
		preloadImages: false,
		updateOnWindowResize: true,
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 3,
			loadOnTransitionStart: true
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets'
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 10
			},
			414: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			720: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			768: {
				slidesPerView: 4,
				spaceBetween: 40
			},
			1400: {
				slidesPerView: 5,
				spaceBetween: 50
			}
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		virtual: {
			cache: false,
			slides: (() => {
				return createSlides(movies);
			})()
		}
	});
	swiper.virtual.update(true);

	swiper.on('reachEnd', async () => {
		if (inputTitle.value === '') {
			title = DEFAULT_SEARCH_VALUE;
		} else {
			title = inputTitle.value;
		}
		await searchTitle('PROCEED');
	});
};

const init = async (title) => {
	loaderUpdate('start');
	const movies = await getOMDBInfo({ title, page: CURRENT_PAGE });
	if (movies.Search.length > 0) {
		await fillImdRating(movies);
		await startSlider(movies, title);
		cursorPosition();
		loaderUpdate('stop', `Found: ${movies.totalResults}`);
		searchNote.innerHTML = `Showing results for ${title}`;
	} else {
		loaderUpdate('error', 'Nothing found!');
	}
};

init(DEFAULT_SEARCH_VALUE);

inputTitle.addEventListener('keypress', async (e) => {
	if (e.key === 'Enter') {
		try {
			await searchTitle('NEW');
		} catch (error) {
			loaderUpdate('error', `Error has happened`);
		}
	}
});

buttonSearch.addEventListener('click', async () => {
	CURRENT_PAGE = 1;
	try {
		await searchTitle('NEW');
	} catch (error) {
		loaderUpdate('error');
		loaderUpdate('error', `Error has happened`);
	}
});

inputTitle.addEventListener('keyup', () => {
	clearButton.style.visibility = inputTitle.value.length ? 'visible' : 'hidden';
});

clearButton.addEventListener('click', (e) => {
	clearButton.style.visibility = 'hidden';
	inputTitle.value = '';
});
