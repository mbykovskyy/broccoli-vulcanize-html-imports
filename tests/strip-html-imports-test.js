'use strict';
var assert = require('assert');
var stripImports = require('../lib/strip-html-imports');

describe('strip-html-imports', function() {
  it('should strip html imports', function() {
    var html = '<html><link rel="import" href="import1.html"><link rel="import" href="import2.html"></html>';
    var expected = '<html></html>';
    var actual = stripImports(html);

    assert.equal(actual, expected);
  });

  it('should exclude html import', function() {
    var html = '<html><link rel="import" href="import1.html"><link rel="import" href="import2.html"></html>';
    var expected = '<html><link rel="import" href="import1.html"></html>';
    var actual = stripImports(html, ['import1.html']);

    assert.equal(actual, expected);
  });

  it('should not decode html', function() {
    var html = '<html>{{link-to "resource"}}</html>';
    var expected = '<html>{{link-to "resource"}}</html>';
    var actual = stripImports(html);

    assert.equal(actual, expected);
  });

  it('should not break handlebars', function() {
    var html = '<button {{bing-attr text="button"}}></button>';
    var expected = '<button {{bing-attr text="button"}}></button>';
    var actual = stripImports(html);

    assert.equal(actual, expected);
  });

  it('should process text', function() {
    var html = 'This is html with no tags.';
    var expected = 'This is html with no tags.';
    var actual = stripImports(html);

    assert.equal(actual, expected);
  });

  it('should not process commented out imports', function() {
    var html = '<html><!--<link rel="import" href="import1.html">\n--><link rel="import" href="import2.html"></html>';
    var expected = '<html><!--<link rel="import" href="import1.html">\n--></html>';
    var actual = stripImports(html);

    assert.equal(actual, expected);
  });
});
