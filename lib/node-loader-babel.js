import process from 'process';
import path from 'path';
import {fileURLToPath} from 'url';
import {loadOptionsAsync, transformAsync} from '@babel/core';

const BABEL_FORMATS_TRANSFORMED = new Set(['module']);

const BABEL_CONFIG_FILES = new Set([
	'.babelrc.js',
	'.babelrc.mjs',
	'babel.config.js',
	'babel.config.mjs',
	'.babelrc',
	'.babelrc.cjs',
	'babel.config.cjs',
]);

const anyURLToPathOrUndefined = (url) => {
	try {
		return fileURLToPath(url);
	} catch (error) {
		if (error instanceof TypeError && error.code === 'ERR_INVALID_URL_SCHEME') {
			return undefined;
		}

		throw error;
	}
};

const isBabelConfigFile = (filename) => {
	const basename = path.basename(filename);
	return BABEL_CONFIG_FILES.has(basename);
};

const getSourceType = (format) => {
	switch (format) {
		case 'module':
			return 'module';
		case 'commonjs':
			return 'script';
		default:
			return 'unambiguous';
	}
};

const prepare = async (url, context, defaultLoad) => {
	const original = await defaultLoad(url, context, defaultLoad);

	const noop = () => ({
		transform: false,
		original,
	});

	if (
		/node_modules/.test(url) ||
		/node:/.test(url) ||
		!BABEL_FORMATS_TRANSFORMED.has(original.format)
	) {
		return noop();
	}

	const filename = anyURLToPathOrUndefined(url);

	// Babel config files can themselves be ES modules,
	// but transforming those could require more than one pass.
	if (isBabelConfigFile(filename)) return noop();

	return {
		transform: true,
		original,
		options: {
			filename,
		},
	};
};

const transformed = async ({format, source}, {filename}) => {
	const options = await loadOptionsAsync({
		sourceType: getSourceType(format),
		root: process.cwd(),
		rootMode: 'root',
		filename,
		configFile: true,
	});

	const result = await transformAsync(source, options);

	return {
		source: result.code,
		// TODO: look at babel config to see whether it will output ESM/CJS or other formats
		format,
	};
};

export const load = async (url, context, defaultLoad) => {
	const {transform, original, options} = await prepare(
		url,
		context,
		defaultLoad,
	);
	return transform ? transformed(original, options) : original;
};
