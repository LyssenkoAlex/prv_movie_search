import {YANDEX_URL, LANGUAGE} from "../../constraints";


export const getYandexTranslateURL = async (config) => {
    console.log('YANDEX_URL', YANDEX_URL, 'LANGUAGE', LANGUAGE)
    const response = await fetch(`${YANDEX_URL}+&text=${config.text}&lang=${LANGUAGE.RU.VALUE}-${LANGUAGE.ENG.VALUE}&format=plain`);
    return response.json();
}
