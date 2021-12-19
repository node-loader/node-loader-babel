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
    const { source, format } = await defaultLoad(url, context, defaultLoad);

    // Skip transpilation of CommonJS modules.
    // These modules are already preprocessed by Node.js,
    // so we cannot parse the non-standard syntaxes like JSX and TypeScript.
    // Their transpilation is better handled separately by @babel/register or @babel/node.
    if (format !== "module") {
      return { source, format };
    }

    const filename = urlModule.fileURLToPath(url);
    // Babel config files can themselves be ES modules,
    // but we cannot transform those since doing so would cause an infinite loop.
    if (isBabelConfigFile(filename)) {
      return {
        source,
        format,
      };
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
      // NOTE: transform-modules-commonjs doesn't work properly.
      //       We put a branch here just for consistency.
      format: transformed.sourceType === "module" ? "module" : "commonjs",
    };
  } else {
    return defaultLoad(url, context, defaultLoad);
  }
}

function useLoader(url) {
  return !/node_modules/.test(url) && !/node:/.test(url);
}
