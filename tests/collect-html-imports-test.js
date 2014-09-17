'use strict';
var assert = require('assert');
var fs = require('fs');
var collectImports = require('../lib/collect-html-imports');

describe('collect-html-imports', function() {
  it('should collect html imports', function() {
    var expected = '<link rel="import" href="import1.html">\n<link rel="import" href="import2.html">';
    var actual = collectImports('fixtures/collect-html-imports');

    assert.equal(actual, expected);
  });

  it('should exclude html import', function() {
    var expected = '<link rel="import" href="import1.html">';
    var actual = collectImports('fixtures/collect-html-imports', {
      excludes: ['import2.html']
    });

    assert.equal(actual, expected);
  });

  it('should normalise hrefs', function() {
    var expected = '<link rel="import" href="collect-html-imports/import1.html">\n<link rel="import" href="collect-html-imports/import2.html">';
    var actual = collectImports('fixtures/collect-html-imports', {
      baseDir: 'fixtures'
    });

    assert.equal(actual, expected);
  });
});
