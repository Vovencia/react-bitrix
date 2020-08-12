import webpack from "webpack";
import {webpackConfig} from "../webpack/webpack.config";

const config = webpackConfig();

webpack(config, (err, stats) => {
	if (err) {
		console.error(err);
		return;
	}

	console.log(stats.toString({
		chunks: true,  // Makes the build much quieter
		colors: true    // Shows colors in the console
	}));
});