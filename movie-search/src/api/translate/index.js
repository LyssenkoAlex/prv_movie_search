import { YANDEX_URL, LANGUAGE } from '../../constraints';

const getYandexTranslateURL = async (config) => {
	const response = await fetch(`${YANDEX_URL}+&text=${config.text}&lang=${LANGUAGE.RU.VALUE}-${LANGUAGE.ENG.VALUE}&format=plain`);
	return response.json();
};

export default getYandexTranslateURL;
