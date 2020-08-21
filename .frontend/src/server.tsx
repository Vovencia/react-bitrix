import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import {AppContainer} from "~components/App/App";
import {IHydrateData} from "~interfaces/hydrateData";
import {ServerStyleSheet} from 'styled-components';
import {IServerRender} from "~interfaces/IRender";
import {ejectStylesLoaderGet, IEjectStyle} from '../webpack/eject-styles.loader/eject-styles.utils';
import {logging} from "~utils/logging";

export const render: IServerRender = (hydrateData: IHydrateData = {}) => {
	const sheet = new ServerStyleSheet();
	const appElement = sheet.collectStyles(<AppContainer hydrateData={hydrateData} />);
	const html = ReactDOMServer.renderToString(appElement);
	const styledStyles = sheet.getStyleTags();
	let styles: IEjectStyle[] = [];

	try {
		styles = ejectStylesLoaderGet();
	} catch (e) {
		logging.error(e);
	}

	return {
		html,
		styledStyles,
		styles,
	};
}

export default render;