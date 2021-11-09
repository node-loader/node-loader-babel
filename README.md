# @node-loader/babel

A [nodejs loader](https://nodejs.org/dist/latest-v13.x/docs/api/esm.html#esm_experimental_loaders) for [babel](https://babeljs.io/). This allows you to compile all files with babel before they are executed in Node.

**This project is similar to [`@babel/node`](https://babeljs.io/docs/en/next/babel-node.html), except that it works with ES modules.**

## Installation

```sh
npm install --save @node-loader/babel

# Or, if you prefer Yarn
yarn add --save @node-loader/babel
```

If using Node<16.12, use `@node-loader/babel@1`. Otherwise, use `@node-loader/babel@latest`

## Usage

Run node with the `--experimental-loader` flag:

```sh
node --experimental-loader @node-loader/babel file.js
```

## Configuration

[Babel configuration files](https://babeljs.io/docs/en/config-files) are loaded and applied per the normal rules.

## Composition

If you wish to combine the babel loader with other NodeJS loaders, you may do so by using [node-loader-core](https://github.com/node-loader/node-loader-core).
