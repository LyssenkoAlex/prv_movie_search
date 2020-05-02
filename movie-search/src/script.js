import { getOMDBInfo } from './api/omdb';
import { getYandexTranslateURL } from './api/translate';
import { LANGUAGE } from './constraints';

let CURRENT_PAGE = 1;
let swiper;

const inputTitle = document.getElementById('paperInputs1');
const buttonSearch = document.getElementById('buttonSearch');
const fountTotal = document.querySelector('.foundItems');

const init = async (title) => {
	console.log('init', title);
	let movies = await getOMDBInfo({ title: title, page: CURRENT_PAGE });
	await startSlider(movies, title);
	cursorPosition();
	console.log('fountTotal', fountTotal);
	fountTotal.innerHTML = movies.totalResults;
};
const cursorPosition = () => {
	const setCaretPosition = (ctrl, pos) => {
		// Modern browsers
		if (ctrl.setSelectionRange) {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);

			// IE8 and below
		} else if (ctrl.createTextRange) {
			let range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	let input = document.getElementById('paperInputs1');
	setCaretPosition(input, input.value.length);
};

const startSlider = async (movies, title) => {
	console.log('startSlider: ', movies, 'title: ', title);

	swiper = new Swiper('.swiper-container', {
		slidesPerView: 4,
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
			type: 'fraction'
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

	swiper.on('reachEnd', async () => {
		console.log('reachEnd: ', inputTitle.value);
		if (inputTitle.value === null) {
			title = 'rabbit';
		} else {
			title = inputTitle.value;
		}
		let movies = await getOMDBInfo({ title: title, page: ++CURRENT_PAGE });
		console.log('reachEnd: ', movies);
		swiper.virtual.slides = [];
		swiper.virtual.slides = createSlides(movies);
		swiper.virtual.update(true);
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
init('rabbit');

inputTitle.addEventListener('keypress', async (e) => {
	if (e.key === 'Enter') {
		let movies = await getOMDBInfo({ title: inputTitle.value, page: ++CURRENT_PAGE });
		console.log('keypress: ', movies);
		swiper.virtual.slides = [];
		swiper.virtual.slides = createSlides(movies);
		swiper.virtual.update(true);
	}
});

buttonSearch.addEventListener('click', (e) => {
	init(inputTitle.value);
});
