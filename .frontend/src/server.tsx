import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import {App} from "./components/App/App";
import {IHydrateData} from "./interfaces/hydrateData";
import { ServerStyleSheet } from 'styled-components';


export default function(hydrateData: IHydrateData = {}): {html: string, styles: string} {
	const sheet = new ServerStyleSheet();
	const app = sheet.collectStyles(<App hydrateData={hydrateData} />);
	const html = ReactDOMServer.renderToString(app);
	const styles = sheet.getStyleTags();

	return {
		html,
		styles,
	};
}