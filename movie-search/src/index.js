import Swiper from 'swiper';
import { getOMDBInfo } from './api/omdb';
import { getYandexTranslateURL } from './api/translate';
import { OMDB_URL } from './constraints';

let CURRENT_PAGE = 1;
let swiper;

const inputTitle = document.getElementById('paperInputs1');
const buttonSearch = document.querySelector('.input-icon');
const fountTotal = document.querySelector('.fondWrapper');
const clearButton = document.querySelector('.clear_icon');

const loader = document.querySelector('.loader');
const searchNote = document.querySelector('.searchNote');

const loaderUpdate = (loaderCommand) => {
	if (loaderCommand === 'start') {
		loader.style.animationDuration = '2s';
		loader.style.borderTopColor = '#41403e';
	} else if (loaderCommand === 'stop') {
		loader.style.animationDuration = '0s';
		loader.style.borderTopColor = '#8bc34a';
		searchNote.innerHTML = ``;
	} else if (loaderCommand === 'error') {
		loader.style.animationDuration = '0s';
		loader.style.borderTopColor = '#F44336';
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
		loaderUpdate('error');
		searchNote.innerHTML = `An error has happend`;
	}
};

const createSlides = (movies) => {
	const slides = [];
	for (let i = 0; i < movies.Search.length; i += 1) {
		slides.push(`
				<div class="swiper-slide">
					<div class="card">
					<img src="${movies.Search[i].Poster}" alt="${movies.Search[i].Title}"/>
					<div class="card-body">
						<a class="paper-btn btn-secondary" href="https://www.imdb.com/title/${movies.Search[i].imdbID}" target="_blank">${movies.Search[i].Title}</a>
						<h5 class="card-subtitle">${movies.Search[i].Type} ${movies.Search[i].Year}</h5>
						<h5 class="card-subtitle">Rating: ${movies.Search[i].imdbRating}</h5>
					</div>
					</div>
	            </div>
	                `);
	}
	return slides;
};

const searchTitle = async (searchType) => {
	loaderUpdate('none', 'block');
	// eslint-disable-next-line no-plusplus
	searchType === 'PROCEED' ? ++CURRENT_PAGE : (CURRENT_PAGE = 1);
	let title = '';
	inputTitle.value === '' ? (title = 'rabbit') : (title = inputTitle.value);
	const translation = await getYandexTranslateURL({ text: title });
	const translatedWord = translation.text[0];
	const movies = await getOMDBInfo({ title: translatedWord, page: CURRENT_PAGE });
	if (movies.Search !== undefined && movies.Search.length > 0) {
		loaderUpdate('start');
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
		fountTotal.innerHTML = `Found: ${movies.totalResults}`;
		loaderUpdate('stop');
		searchNote.innerHTML = `Showing results for ${title}`;
	} else {
		fountTotal.innerHTML = 'Nothing found!';
		loaderUpdate('error');
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
			slides: (function () {
				return createSlides(movies);
			})()
		}
	});
	swiper.virtual.update(true);

	swiper.on('reachEnd', async () => {
		if (inputTitle.value === '') {
			title = 'rabbit';
		} else {
			title = inputTitle.value;
		}
		await searchTitle('PROCEED');
	});
};

const cursorPosition = () => {
	const setCaretPosition = (ctrl, pos) => {
		// Modern browsers
		if (ctrl.setSelectionRange) {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);

			// IE8 and below
		} else if (ctrl.createTextRange) {
			const range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	const input = document.getElementById('paperInputs1');
	setCaretPosition(input, input.value.length);
};

const init = async (title) => {
	loaderUpdate('start');
	const movies = await getOMDBInfo({ title, page: CURRENT_PAGE });
	if (movies.Search.length > 0) {
		await fillImdRating(movies);
		await startSlider(movies, title);
		cursorPosition();
		fountTotal.innerHTML = `Found: ${movies.totalResults}`;
		loaderUpdate('stop');
		searchNote.innerHTML = `Showing results for ${title}`;
	} else {
		fountTotal.innerHTML = 'Nothing found!';
	}
};

init('rabbit');

inputTitle.addEventListener('keypress', async (e) => {
	if (e.key === 'Enter') {
		try {
			await searchTitle('NEW');
		} catch (error) {
			loaderUpdate('error');
			searchNote.innerHTML = `Error has happened`;
		}
	}
});

buttonSearch.addEventListener('click', async () => {
	CURRENT_PAGE = 1;
	try {
		await searchTitle('NEW');
	} catch (error) {
		loaderUpdate('error');
		searchNote.innerHTML = `Error has happened`;
	}
});

inputTitle.addEventListener('keyup', () => {
	clearButton.style.visibility = inputTitle.value.length ? 'visible' : 'hidden';
});

clearButton.addEventListener('click', (e) => {
	clearButton.style.visibility = 'hidden';
	inputTitle.value = '';
});
