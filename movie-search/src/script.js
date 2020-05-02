import { getOMDBInfo } from './api/omdb';
import { getYandexTranslateURL } from './api/translate';
import { LANGUAGE } from './constraints';

let CURRENT_PAGE = 1;
let swiper;

const inputTitle = document.getElementById('paperInputs1');
const buttonSearch = document.getElementById('buttonSearch');
const fountTotal = document.querySelector('.foundItems');

const init = async (title) => {
	console.log('title', title)
	let movies = await getOMDBInfo({ title: title, page: CURRENT_PAGE });
	await startSlider(movies, title);
	cursorPosition();
	console.log('fountTotal', fountTotal)
	fountTotal.innerHTML = movies.totalResults;
};
const cursorPosition = () => {
	const  setCaretPosition = (ctrl, pos) => {
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
	}

	let input = document.getElementById('paperInputs1');
	setCaretPosition(input, input.value.length);
}

const startSlider = async (movies, title) => {
	console.log('movies: ', movies);

	 swiper = new Swiper('.swiper-container', {
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
			cache: false,
			slides: (function () {
				return createSlides(movies);
			})()
		}
	});


	swiper.on('reachEnd', async () => {
		let movies = await getOMDBInfo({ title: title, page: ++CURRENT_PAGE });
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
init('rabbit');



inputTitle.addEventListener('keypress', (e) => {
	if (e.key  === 'Enter') {
		swiper.removeAllSlides();
		init(inputTitle.value)
	}
})

buttonSearch.addEventListener('click', (e) => {
	swiper.removeAllSlides();
	init(inputTitle.value);
})
