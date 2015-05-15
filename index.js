'use strict';
var collectImports = require('./lib/broccoli-collect-html-imports');
var stripImports = require('./lib/broccoli-strip-html-imports');
var vulcanize = require('broccoli-vulcanize');
var mergeTrees = require('broccoli-merge-trees');

/**
 * options {
 *   extensions: ['html']
 *   outputFile: 'imports.html',
 *   overwrite: false,
 *   excludes: [/(^data:)|(^http[s]?:)|(^\/)/]
 *   abspath: '/webroot/',
 *   stripExcludes: false,
 *   stripComments: false,
 *   inlineScripts: false,
 *   inlineCss: false,
 *   implicitStrip: false
 * }
 */
module.exports = function(inputTree, options) {
  options = options || {};

  var inputFiles = (options.extensions || []).map(function(ext) {
    return '**/*.' + ext;
  });
  var outputFile = options.outputFile || 'vulcanized.html';
  var excludes = options.excludes || [];

  var collected = collectImports(inputTree, {
    inputFiles: inputFiles,
    outputFile: outputFile,
    excludes: excludes
  });

  var vulcanized = vulcanize(collected, {
    input: outputFile,
    output: outputFile,
    excludes: excludes,
    abspath: options.abspath,
    stripExcludes: options.stripExcludes,
    stripComments: options.stripComments,
    inlineScripts: options.inlineScripts,
    inlineCss: options.inlineCss,
    implicitStrip: options.implicitStrip
  });

  var stripped = stripImports(inputTree, {
    extensions: options.extensions,
    excludes: excludes
  });

  return mergeTrees([stripped, vulcanized], {
    overwrite: options.overwrite
  });
};
