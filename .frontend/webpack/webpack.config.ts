import * as webpack from 'webpack';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';

import {Workspace} from "../utils/workspace";
import {resolve} from "../utils/resolve";

const styledComponentsTransformer = createStyledComponentsTransformer();

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
							// `resourcePath` - `/absolute/path/to/file.js`
							// `resourceQuery` - `?foo=bar`

							return resourcePath.replace(/\\/g, '/').replace(
								workspace.resolveFrontend('assets', 'images').replace(/\\/g, '/') + '/',
								''
							);
							//
							// if (process.env.NODE_ENV === 'development') {
							// 	return '[path][name].[ext]';
							// }
							//
							// return '[contenthash].[ext]';
						},
						publicPath: '/' + resolve(workspace.templatePath, 'public', 'images'),
						outputPath: 'images',
					},
				},
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