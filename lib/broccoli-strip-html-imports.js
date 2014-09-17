'use strict';
var Filter = require('broccoli-filter');
var strip = require('./strip-html-imports');

module.exports = Stripper;
Stripper.prototype = Object.create(Filter.prototype);
Stripper.prototype.constructor = Stripper;

/**
 * Strips `<link rel="import" href="">` tags.
 *
 * @param inputTree
 * @param options {
 *   extensions: ['html']
 *   excludes: ['regex']
 * }
 */
function Stripper(inputTree, options) {
  if (!(this instanceof Stripper)) {
    return new Stripper(inputTree, options);
  }

  this.inputTree = inputTree;

  options = options || {};
  this.extensions = options.extensions || ['html'];
  this.excludes = options.excludes;
}

Stripper.prototype.processString = function(str) {
  return strip(str, this.excludes);
};
