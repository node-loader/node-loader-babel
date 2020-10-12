import babel from "@babel/core";
import url from "url";

const { OptionManager, transform } = babel;

export async function transformSource(source, context, defaultGetSource) {
  const options = new OptionManager().init({
    sourceType: "module",
    root: process.cwd(),
    rootMode: "root",
    filename: url.fileURLToPath(context.url),
    configFile: true,
  });

  const transformedSource = transform(source, options).code;

  return {
    source: transformedSource,
  };
}
