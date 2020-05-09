import { OMDB_URL } from '../../constraints';

export const getOMDBInfo = async (config) => {
	const response = await fetch(`${OMDB_URL}s=${config.title}&page=${config.page}`);
	return response.json();
};

export const getOMDBRating = async (config) => {
	const response = await fetch(`${OMDB_URL}i=${config.imdbID}`);
	return response.json();
};
