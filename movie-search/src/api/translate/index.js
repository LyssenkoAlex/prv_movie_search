import {YANDEX_URL} from "../../constraints";



export const getYandexTranslateURL = async (config) => {
    const response = await fetch(`${YANDEX_URL}+&text=${config.text}&lang=${config.from_lang}-${config.to_lang}&format=plain`);
    return response.json();
}
