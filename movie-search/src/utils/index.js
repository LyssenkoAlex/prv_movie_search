import imgNotFound from '../assets/image-not-found.svg';

export const createSlides = (movies) => {
	const slides = [];
	for (let i = 0; i < movies.Search.length; i += 1) {
		const imgSrc = movies.Search[i].Poster === 'N/A' ? imgNotFound : movies.Search[i].Poster;
		slides.push(`
				<div class="swiper-slide">
					<div class="card">
					<img src="${imgSrc}" alt="${movies.Search[i].Title}" class="image_container"/>
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

export const cursorPosition = () => {
	const setCaretPosition = (ctrl, pos) => {
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
