import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import {Workspace} from "../utils/workspace";

export function webpackConfig(workspace = new Workspace()): webpack.Configuration {
	return {
		entry: workspace.entry,
		devtool: workspace.devtool,
		mode: workspace.mode,
		target: workspace.isServer ? 'node' : 'web',
		output: {
			filename: "main.js",
			path: workspace.output,
			publicPath: '/',
			library: workspace.isServer ? 'ssr' : undefined,
			libraryTarget: workspace.isServer ? 'umd' : undefined,
		},
		resolve: {
			extensions: [".ts", ".tsx", ".json", ".js", ".jsx", ".css", ".sass", ".scss"],
			alias: {
				"~src": workspace.resolveFrontend('src', 'index'),
				"~src/*": workspace.resolveFrontend('src', '*'),
				"~components": workspace.resolveFrontend('src/components', 'index'),
				"~components/*": workspace.resolveFrontend('src/components', '*'),
				"~containers": workspace.resolveFrontend('src/containers', 'index'),
				"~containers/*": workspace.resolveFrontend('src/containers', '*'),
				"~pages": workspace.resolveFrontend('src/pages', 'index'),
				"~pages/*": workspace.resolveFrontend('src/pages', '*'),
				"~utils": workspace.resolveFrontend('src/utils', 'index'),
				"~utils/*": workspace.resolveFrontend('src/utils', '*'),
			}
		},
		module: {
			rules: [
				{ test: /\.[tj]sx?$/, loader: "ts-loader" },
			],
		},
		optimization: {

		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.ENV': JSON.stringify(process.env.ENV),
				'process.env.MODE': JSON.stringify(process.env.MODE),
				'process.env.TEMPLATE_PATH': JSON.stringify(process.env.TEMPLATE_PATH),
			}),
			new CleanWebpackPlugin(),
		],
		watch: workspace.watch
	}
}