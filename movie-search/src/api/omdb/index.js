import {OMDB_URL} from "../../constraints/";


export const getOMDBInfo = async (config) => {
    const response = await fetch(OMDB_URL + config.title + '&page='+config.page)
    return response.json();
};
