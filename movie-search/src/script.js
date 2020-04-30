import { getOMDBInfo } from './api/omdb';
import { getYandexTranslateURL } from './api/translate';
import { LANGUAGE } from './constraints';

const init = async () => {
	let movies = await getOMDBInfo('rabbit');
	await fillSliders(movies);
	await startSlider();
};

const fillSliders = (movieArray) => {
	if (movieArray.Response === 'True') {
		movieArray.Search.forEach((x) => {
			createSlide(x);
		});
	}
};

const startSlider = async () => {
	let swiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		spaceBetween: 30,
		pagination: {
			el: '.swiper-pagination',
			clickable: true
		}
	});
	let t = await getYandexTranslateURL({ text: 'dream', from_lang: LANGUAGE.ENG.VALUE, to_lang: LANGUAGE.RU.VALUE });
	console.log('t', t);
};

const createSlide = (movie) => {
	console.log('movie', movie);
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

	let title = document.createElement('h4');
	title.classList.add('card-title');
	title.innerText = movie.Title;
	cardBody.append(title);

	let subTitle = document.createElement('h5');
	subTitle.classList.add('card-subtitle');
	subTitle.innerText = 'card-subtitle';
	cardBody.append(subTitle);

	let button = document.createElement('button');
	cardBody.append(button);
	card.append(cardBody);
	sliderDiv.append(card);
	el.append(sliderDiv);
};
init();
