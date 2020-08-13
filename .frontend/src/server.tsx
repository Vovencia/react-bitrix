import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import {AppContainer} from "~components/App/App";
import {IHydrateData} from "~interfaces/hydrateData";
import { ServerStyleSheet } from 'styled-components';


export default function(hydrateData: IHydrateData = {}): {html: string, styles: string} {
	const sheet = new ServerStyleSheet();
	const appElement = sheet.collectStyles(<AppContainer hydrateData={hydrateData} />);
	const html = ReactDOMServer.renderToString(appElement);
	const styles = sheet.getStyleTags();

	return {
		html,
		styles,
	};
}