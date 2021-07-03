import babel from "@babel/core";
import path from "path";
import url from "url";

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

export async function transformSource(source, context, defaultGetSource) {
  const filename = url.fileURLToPath(context.url);
  // Babel config files can themselves be ES modules,
  // but we cannot transform those since doing so would cause an infinite loop.
  if (isBabelConfigFile(filename)) {
    return { source };
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
  };
}
