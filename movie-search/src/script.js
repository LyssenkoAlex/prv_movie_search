import { getOMDBInfo } from './api/omdb';
import { getYandexTranslateURL } from './api/translate';
import { LANGUAGE } from './constraints';

let CURRENT_PAGE = 1;

const init = async () => {
	let movies = await getOMDBInfo({title:'rabbit', page:CURRENT_PAGE});
	await fillSliders(movies);
	await startSlider(movies);
};

const fillSliders = (movieArray) => {
	if (movieArray.Response === 'True') {
		console.log('movieArray', movieArray)
		movieArray.Search.forEach((x) => {
			createSlide(x,);
		});
	}
};

const startSlider = async (movies) => {
	console.log('movies: ', movies)
	let swiper = new Swiper('.swiper-container', {
		slidesPerView: 5,
		spaceBetween: 50,
		updateOnWindowResize:true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			dynamicBullets:true,
			dynamicMainBullets:true,
			type:'fraction',
			renderFraction: function (currentClass, totalClass) {
				console.log('totalClass', totalClass);
				return '<span class="' + currentClass + '"></span>' +
					' of ' +
					'<span class="' + totalClass + '"></span>';
			}
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		virtual: {
			slides: (function () {
				let slides = [];
				for (let i = 0; i < movies.totalResults; i += 1) {
					slides.push('Slide ' + (i + 1));
				}
				return slides;
			}()),
		},
	});
	let y = swiper.slideNext();
	swiper.on('reachEnd', () => {
		console.log('reachEnd')
		loadNextSlides(CURRENT_PAGE++)
	})
	// let t = await getYandexTranslateURL({ text: 'dream', from_lang: LANGUAGE.ENG.VALUE, to_lang: LANGUAGE.RU.VALUE });
	// console.log('y', y);
};

const loadNextSlides = async (page) => {
	let movies = await getOMDBInfo({title:'rabbit', page:page});
	await fillSliders(movies);
}

const createSlide = (movie) => {

	let el = document.querySelector('.swiper-wrapper');

	let sliderDiv = document.createElement('div');
	sliderDiv.classList.add('swiper-slide');

	let card = document.createElement('div');
	card.classList.add('card');

	let img = document.createElement('IMG');
	img.setAttribute('src', movie.Poster);
	img.setAttribute('alt', movie.Title);
	card.append(img);

	let cardBody = document.createElement('div');
	cardBody.classList.add('card-body');

	let title = document.createElement('h5');
	title.classList.add('card-title');
	title.innerText = movie.Title;
	cardBody.append(title);

	// let subTitle = document.createElement('h5');
	// subTitle.classList.add('card-subtitle');
	// subTitle.innerText = 'card-subtitle';
	// cardBody.append(subTitle);

	// let button = document.createElement('button');
	// cardBody.append(button);
	card.append(cardBody);
	sliderDiv.append(card);
	el.append(sliderDiv);
};
init();
