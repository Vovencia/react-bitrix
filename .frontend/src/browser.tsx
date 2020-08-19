import * as React from 'react';
import ReactDOM from 'react-dom';
import {getHydrateData} from "~utils/hydrateData";
import {AppContainer} from "~components/App/App";
import {ready} from "~utils/ready";

ready(() => {
	const $root = document.getElementById('root');
	const hydrateData = getHydrateData();

	if ($root) {
		const rootContent = $root.innerHTML.trim();
		if (hydrateData && rootContent) {
			ReactDOM.hydrate(<AppContainer hydrateData={hydrateData} />, $root);
		} else {
			ReactDOM.render(<AppContainer />, $root);
		}
	} else {
		console.error(`$root is null`);
	}
});