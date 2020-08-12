import * as React from 'react';
import ReactDOM from 'react-dom';
import {App} from "./components/App/App";

const $root = document.getElementById('root');
console.log('__hydrateData', (window as any).__hydrateData)

if ($root) {
	const hydrateData = (window as any).__hydrateData || {};
	ReactDOM.hydrate(<App hydrateData={hydrateData} />, $root);
} else {
	console.error(`$root is null`);
}