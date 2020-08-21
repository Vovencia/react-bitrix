import loaderUtils from 'loader-utils';
// import {loader} from 'webpack';

const ejectStylesLoader: any/*loader.Loader*/ = function(source: any) {
    return source;
};
ejectStylesLoader.pitch = function(this: any/*loader.LoaderContext*/, request:any) {
    const options = ({
        ...{
            isServer: false,
        },
        ...(loaderUtils.getOptions(this) || {}),
    });
    if (!options.isServer) return '';
    request = request.replace(/\\/g, '/');
    return `
import {ejectStylesLoaderAdd} from '${__dirname.replace(/\\/g, '/')}/eject-styles.utils';
import content from '!!${request}';
const style = {
    path: content[0][0],
    content: content.toString(),
};
ejectStylesLoaderAdd(style);
`;
};

export default ejectStylesLoader;
export const pitch = ejectStylesLoader.pitch;
export const ejectStylesLoaderName = __filename;
