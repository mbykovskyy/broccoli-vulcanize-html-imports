'use strict';
var assert = require('assert');
var stripImports = require('../lib/broccoli-strip-html-imports');
var Broccoli = require('broccoli');
var path = require('path');
var fs = require('fs');
var builder;

describe('broccoli-strip-html-imports', function() {
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('should strip html imports', function() {
    var tree = stripImports('fixtures/strip-html-imports');
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));
    });
  });

  it('should not change options', function() {
    var options = {
      extensions: ['hbs']
    };
    var tree = stripImports('fixtures/strip-html-imports', options);
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function() {
      assert.deepEqual({extensions: ['hbs']}, options);
    });
  });

  it('should not be affected by options changing outside', function() {
    var options = {
      extensions: ['hbs']
    };
    var tree = stripImports('fixtures/strip-html-imports', options);
    options.excludes = ['import2.html'];

    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));

      var actual = fs.readFileSync(importsHtml, 'utf8');
      var expected = '<link rel="import" href="import1.html">\n<link rel="import" href="import2.html">\n<import2></import2>\n';
      assert.equal(actual, expected);

      actual = fs.readFileSync(importsHbs, 'utf8');
      expected = '\n\n<import1></import1>\n';
      assert.equal(actual, expected);
    });
  });

  it('should be able to call strip repeatedly', function() {
    var tree = stripImports('fixtures/strip-html-imports');
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));

      return builder.build().then(function(result) {
        var importsHtml = path.join(result.directory, 'imports.html');
        assert(fs.existsSync(importsHtml));

        var importsHbs = path.join(result.directory, 'imports.hbs');
        assert(fs.existsSync(importsHbs));
      });
    });
  });

  it('should accept a broccoli tree', function() {
    var tree = {
      read: function() {
        return 'fixtures/strip-html-imports';
      },
      cleanup: function() {
      }
    };

    tree = stripImports(tree);
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));
    });
  });
});
