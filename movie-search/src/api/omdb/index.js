import { OMDB_URL } from '../../constraints';

export const getOMDBInfo = async (config) => {
	const response = await fetch(`${OMDB_URL}s=${config.title}&page=${config.page}`);
	return response.json();
};
