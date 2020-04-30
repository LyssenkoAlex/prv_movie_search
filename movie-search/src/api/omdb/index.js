import {OMDB_URL} from "../../constraints/";


export const getOMDBInfo = async (req) => {
    const response = await fetch(OMDB_URL + req)
    return response.json();
};
