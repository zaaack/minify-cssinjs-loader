# minify-cssinjs-loader


[![Build Status](https://travis-ci.org/hydux/minify-cssinjs-loader.svg?branch=master)](https://travis-ci.org/hydux/minify-cssinjs-loader) [![npm](https://img.shields.io/npm/v/minify-cssinjs-loader.svg)](https://www.npmjs.com/package/minify-cssinjs-loader) [![npm](https://img.shields.io/npm/dm/minify-cssinjs-loader.svg)](https://www.npmjs.com/package/minify-cssinjs-loader)

A webpack loader to minify your css-in-js.

## Install

```sh
yarn add minify-cssinjs-loader # or npm i minify-cssinjs-loader
```

## Why

before:
```js
let cls1 = css`
  color: red;
  .cls1 {
  display: block;
  background: url('...') no-repeat;

  & > h2 {
    color: red;
    font-size: ${size}px;
  }
}
`
```

after:
```js
let cls1 = css`color:red;.cls1{display:block;background:url('...') no-repeat;&>h2{color:red;font-size:${size}px;}}`
```

## Usage

awesome-typescript-loader example:

```js

import { defaultTagRules } from 'minify-cssinjs-loader'

module.exports = {

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: "awesome-typescript-loader",
          options: {
            useTranspileModule: true,
            transpileOnly: true,
            declaration: false,
            instance: 'at-loader2'
          }
        }, {
          loader: 'minify-cssinjs-loader',
          options: {
            // default is ['css', 'injectGlobal', /^styled(\.[a-z]+|\(([A-Z][a-z]+|['"][a-z]+["'])\))$/],
            // you can override or append custom trule default tagRules,
            // it accepts string/RedExp/Function.
            //
            // tagRules: [...], // override default rules.
            // tagRules: defaultTagRules.concat(...), // append new rules
            // recast: { ... }, custom parameters passed to recast(https://github.com/benjamn/recast).
          }
        }, {
          loader: "awesome-typescript-loader",
          options: {
            target: 'ESNEXT',
            declaration: !__DEV__,
            useTranspileModule: __DEV__,
            // jsx: 'preserve',
          },
        }, ],
      },
    ]
  }
}

```

babel-loader example:

```js
module.exports = {

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: "awesome-typescript-loader",
          options: {
            useTranspileModule: true,
            transpileOnly: true,
            declaration: false,
            instance: 'at-loader2'
          }
        }, {
          loader: 'minify-cssinjs-loader',
        }],
      },
    ]
  }
}
```

## License

MIT
