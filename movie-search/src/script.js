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
		console.log('movieArray: ', movieArray);
		let el = document.getElementsByClassName('swiper-wrapper')[0];

		movieArray.Search.forEach((x) => {
			let sliderDiv = document.createElement('div');
			sliderDiv.classList.add('swiper-slide');
			let sliderTitle = document.createElement('span');
			sliderTitle.innerText = x.Title;
			sliderDiv.append(sliderTitle);
			el.append(sliderDiv);
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

init();
