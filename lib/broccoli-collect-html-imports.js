'use strict';
var Writer = require('broccoli-writer');
var collect = require('./collect-html-imports');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

module.exports = Collector;
Collector.prototype = Object.create(Writer.prototype);
Collector.prototype.constructor = Collector;

/**
 * Concatenates `<link rel="import" href="">` tags into a single file normalising
 * hrefs relative to the new file location.
 *
 * @param inputTree
 * @param options {
 *   inputFiles: ['** /*.html']
 *   outputFile: 'imports.html',
 *   excludes: ['regex']
 * }
 */
function Collector(inputTree, options) {
  if (!(this instanceof Collector)) {
    return new Collector(inputTree, options);
  }

  this.inputTree = inputTree;

  options = options || {};
  this.collectOptions = {
    inputFiles: options.inputFiles,
    excludes: options.excludes
  };
  this.outputFile = options.outputFile || 'imports.html';
}

Collector.prototype.write = function(readTree, destDir) {
  var outputFile = path.join(destDir, this.outputFile);
  this.collectOptions.baseDir = path.dirname(outputFile);

  return readTree(this.inputTree).then(function(srcDir) {
    var content = collect(srcDir, this.collectOptions);

    mkdirp.sync(path.dirname(outputFile));
    fs.writeFileSync(outputFile, content);
  }.bind(this));
};
