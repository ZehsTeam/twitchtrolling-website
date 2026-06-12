import { httpRouter } from 'convex/server';
import { getPageExists, getPage, createPage, updatePage, deletePage } from './pagesHttp';
import { setEffects, updateEffects } from './effectsHttp';

const http = httpRouter();

http.route({
	path: '/page/exists',
	method: 'GET',
	handler: getPageExists
});

http.route({
	path: '/page',
	method: 'GET',
	handler: getPage
});

http.route({
	path: '/page',
	method: 'POST',
	handler: createPage
});

http.route({
	path: '/page',
	method: 'PATCH',
	handler: updatePage
});

http.route({
	path: '/page',
	method: 'DELETE',
	handler: deletePage
});

http.route({
	path: '/page/effects',
	method: 'PUT',
	handler: setEffects
});

http.route({
	path: '/page/effects',
	method: 'PATCH',
	handler: updateEffects
});

export default http;
