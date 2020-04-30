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
            createSlide(x)
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

const createSlide =(movie) => {
    console.log('movie', movie)
    let el = document.querySelector('.swiper-wrapper');
    let sliderDiv = document.createElement('div');
    sliderDiv.classList.add('swiper-slide');
    let sliderTitle = document.createElement('span');
    sliderTitle.innerText = movie.Title;
    let img = document.createElement("IMG");
    img.setAttribute("src", movie.Poster);
    img.setAttribute("alt", movie.Title);
    sliderDiv.append(sliderTitle);
    sliderDiv.append(img)
    el.append(sliderDiv);

}
init();
