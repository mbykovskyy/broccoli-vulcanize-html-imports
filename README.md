# broccoli-vulcanize-html-imports
[![Build Status](https://travis-ci.org/mbykovskyy/broccoli-vulcanize-html-imports.svg?branch=master)](https://travis-ci.org/mbykovskyy/broccoli-vulcanize-html-imports)

[Broccoli][broccoli] plugin for vulcanizing HTML imports with [Polymer vulcanize][polymer-vulcanize] tool. It strips out HTML imports from files and then vulcanizes the import files. This is useful for preprocessing templates before compiling them.

## Install

```bash
npm install --save-dev broccoli-vulcanize-html-imports
```

## Usage

```js
var vulcanize = require('broccoli-vulcanize-html-imports');
var inputTree = 'templates';
var options = {
  extensions: ['html', 'hbs'],
  outputFile: 'assets/components.html',
  overwrite: true,
  csp: true,
  inline: true,
  strip: true,
  excludes: {
    imports: ["(^data:)|(^http[s]?:)|(^\/)"],
    scripts: ["(^data:)|(^http[s]?:)|(^\/)"],
    styles: ["(^data:)|(^http[s]?:)|(^\/)"]
  }
};

module.exports = vulcanize(inputTree, options);
```

**Input Tree**

```
templates
+ - components
|   + - component.hbs
+ - page.html
```

**Output Tree**

```
.
+ - assets
|   + - components.html
|   + - components.js
+ - components
|   + - component.hbs
+ - page.html
```

The `assets\components.html` and `assets\components.js` are vulcanized import files and `components\component.hbs` and `page.html` are stripped out of HTML imports except the ones that are specified in `excludes.imports` option.

See [polymer vulcanize][polymer-vulcanize] for details on `options`.

[broccoli]: https://github.com/broccolijs/broccoli "Broccoli"
[polymer-vulcanize]: https://github.com/Polymer/vulcanize  "Polymer vulcanize"
