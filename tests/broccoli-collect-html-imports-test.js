'use strict';
var assert = require('assert');
var collectImports = require('../lib/broccoli-collect-html-imports');
var Broccoli = require('broccoli');
var path = require('path');
var fs = require('fs');
var builder;

describe('broccoli-collect-html-imports', function() {
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('should collect html imports', function() {
    var tree = collectImports('fixtures/collect-html-imports');
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importHtml));
    });
  });

  it('should not change options', function() {
    var options = {
      inputFiles: ['*.hbs']
    };
    var tree = collectImports('fixtures/collect-html-imports', options);
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function() {
      assert.deepEqual({inputFiles: ['*.hbs']}, options);
    });
  });

  it('should not be affected by options changing outside', function() {
    var options = {
      inputFiles: ['*.hbs']
    };
    var tree = collectImports('fixtures/collect-html-imports', options);
    options.outputfile = 'should/not/affect/imports.html';

    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importHtml));
    });
  });

  // it('should break component into html and js when CSP is enabled', function() {
  //   var tree = vulcanize('fixtures', {
  //     input: 'index.html',
  //     csp: true
  //   });
  //   builder = new Broccoli.Builder(tree);

  //   return builder.build().then(function(result) {
  //     var indexHtml = path.join(result.directory, 'index.html');
  //     assert(fs.existsSync(indexHtml));

  //     var indexJs = path.join(result.directory, 'index.js');
  //     assert(fs.existsSync(indexJs));
  //   });
  // });

  it('should be able to call collect repeatedly', function() {
    var tree = collectImports('fixtures/collect-html-imports');
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importHtml));

      return builder.build().then(function(result) {
        var importHtml = path.join(result.directory, 'imports.html');
        assert(fs.existsSync(importHtml));
      });
    });
  });

  it('should accept a broccoli tree', function() {
    var tree = {
      read: function() {
        return 'fixtures/collect-html-imports';
      },
      cleanup: function() {
      }
    };

    tree = collectImports(tree);
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importHtml));
    });
  });
});
