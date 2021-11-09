import babel from "@babel/core";
import path from "path";
import urlModule from "url";

const { loadOptionsAsync, transformAsync } = babel;

function isBabelConfigFile(filename) {
  const basename = path.basename(filename);
  return (
    basename === ".babelrc.js" ||
    basename === ".babelrc.mjs" ||
    basename === "babel.config.js" ||
    basename === "babel.config.mjs" ||
    basename === ".babelrc" ||
    basename === ".babelrc.cjs" ||
    basename === "babel.config.cjs"
  );
}

export async function load(url, context, defaultLoad) {
  if (useLoader(url)) {
    const { source } = await defaultLoad(url, context, defaultLoad);

    const filename = urlModule.fileURLToPath(url);
    // Babel config files can themselves be ES modules,
    // but we cannot transform those since doing so would cause an infinite loop.
    if (isBabelConfigFile(filename)) {
      return { source, format: /\.(c|m)?js$/.test(filename) ? 'module' : 'json' };
    }

    const options = await loadOptionsAsync({
      sourceType: "module",
      root: process.cwd(),
      rootMode: "root",
      filename: filename,
      configFile: true,
    });

    const transformed = await transformAsync(source, options);

    return {
      source: transformed.code,
      // Maybe a shaky assumption
      // TODO: look at babel config to see whether it will output ESM/CJS or other formats
      format: "module"
    };
  } else {
    return defaultLoad(url, context, defaultLoad)
  }
}

function useLoader(url) {
  return !/node_modules/.test(url) && !/node:/.test(url)
}