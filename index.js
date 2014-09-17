'use strict';
var collectImports = require('./lib/broccoli-collect-html-imports');
var stripImports = require('./lib/broccoli-strip-html-imports');
var vulcanize = require('broccoli-vulcanize');
var mergeTrees = require('broccoli-merge-trees');

/**
 * options {
 *   extensions: ['html']
 *   outputFile: 'imports.html',
 *   overwrite: true,
 *   csp: true,
 *   inline: true,
 *   strip: true,
 *   excludes: {
 *     imports: ['regex'],
 *     styles: ['regex'],
 *     scripts: ['regex']
 *   }
 */
module.exports = function(inputTree, options) {
  options = options || {};

  var inputFiles = (options.extensions || []).map(function(ext) {
    return '**/*.' + ext;
  });
  var outputFile = options.outputFile || 'vulcanized.html';
  var excludes = options.excludes || {};

  var collected = collectImports(inputTree, {
    inputFiles: inputFiles,
    outputFile: outputFile,
    excludes: excludes.imports
  });

  var vulcanized = vulcanize(collected, {
    input: outputFile,
    output: outputFile,
    csp: options.csp,
    inline: options.inline,
    strip: options.strip,
    excludes: excludes
  });

  var stripped = stripImports(inputTree, {
    extensions: options.extensions,
    excludes: excludes.imports
  });

  return mergeTrees([stripped, vulcanized], {
    overwrite: options.overwrite
  });
};
