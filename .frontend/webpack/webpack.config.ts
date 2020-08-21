import * as webpack from 'webpack';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

import MiniCssExtractPlugin from "mini-css-extract-plugin";

import createStyledComponentsTransformer from 'typescript-plugin-styled-components';
const styledComponentsTransformer = createStyledComponentsTransformer();

import {Workspace} from "../utils/workspace";
import {resolve} from "../utils/resolve";
import {RuleSetRule} from "webpack";
import {ejectStylesLoaderName} from './eject-styles.loader/eject-styles.loader';
// import ejectStylesLoader from "./eject-styles.loader";

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
			extensions: [".ts", ".tsx", ".json", ".js", ".jsx", ".css", ".sass", ".scss", ".png", ".jpg", ".gif"],
			alias: {
				"~src": workspace.resolveFrontend('src'),
				"~components": workspace.resolveFrontend('src/components'),
				"~containers": workspace.resolveFrontend('src/containers'),
				"~interfaces": workspace.resolveFrontend('src/interfaces'),
				"~pages": workspace.resolveFrontend('src/pages'),
				"~utils": workspace.resolveFrontend('src/utils'),
				"~assets": workspace.resolveFrontend('assets'),
				"~images": workspace.resolveFrontend('assets/images'),
			}
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: {
						getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
					}
				},
				{
					test: /\.(png|jpg|gif)$/i,
					loader: 'file-loader',
					options: {
						name(resourcePath: string, resourceQuery: string) {
							resourcePath = resourcePath.replace(/\\/g, '/');
							const basePath = workspace.resolveFrontend('assets', 'images').replace(/\\/g, '/') + '/'
							return resourcePath.replace(basePath, '');
						},
						publicPath: '/' + resolve(workspace.templatePath, 'public', 'images'),
						outputPath: 'images',
					},
				},
				stylesLoaders(workspace, true),
				stylesLoaders(workspace, false),
			],
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					styles: {
						name: 'styles',
						test: /\.css$/,
						chunks: 'all',
						enforce: true,
					},
				},
			},
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.ENV': JSON.stringify(process.env.ENV),
				'process.env.MODE': JSON.stringify(process.env.MODE),
				'process.env.TEMPLATE_PATH': JSON.stringify(process.env.TEMPLATE_PATH),
			}),
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin({
				filename: '[name].bundle.css',
			}),
		],
		watch: workspace.watch
	}
}

function stylesLoaders(workspace: Workspace, sass = false): RuleSetRule {
	const test = sass ? /\.s[ac]ss$/i : /\.css$/i;
	const use = [];
	use.push({
		loader: ejectStylesLoaderName,
		options: {
			isServer: workspace.isServer,
		},
	});
	use.push('css-loader');
	if (sass) {
		use.push({
			loader: 'sass-loader',
			options: {
				sourceMap: false,
				sassOptions: {
					outputStyle: workspace.isProd ? 'compressed' : undefined,
				},
			},
		});
	}

	return {
		test,
		use,
	}
}