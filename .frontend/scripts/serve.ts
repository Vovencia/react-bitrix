import express from 'express';
import * as bodyParser from 'body-parser';

import config from '../config.json';
import {statSync} from "fs";
import {IServerRender} from "~interfaces/IRender";
import {IHydrateData} from "~interfaces/hydrateData";

const MAIN_SCRIPT = require.resolve('../dist/main.js');

const app = express()
const port = config.servePort || 3000;

let lastChangedTime = new Date();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.all('/', (req, res) => {
	const stats = statSync(MAIN_SCRIPT);
	const mtime = stats.mtime;
	if (lastChangedTime.toUTCString() != mtime.toUTCString()) {
		console.log('CHANGED:', MAIN_SCRIPT);
		delete require.cache[MAIN_SCRIPT];
		lastChangedTime = mtime;
	}

	let data = req.body || '{}';
	try {
		if (typeof req.body === 'string') {
			data = JSON.parse(req.body);
		}
	} catch (e) {
		console.error(e);
	}
	data = data as IHydrateData;

	const render: IServerRender = require(MAIN_SCRIPT).default;
	try {
		const result = render(data);
		res.send(result);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
