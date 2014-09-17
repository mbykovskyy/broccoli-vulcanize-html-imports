'use strict';
var assert = require('assert');
var vulcanizeImports = require('..');
var Broccoli = require('broccoli');
var path = require('path');
var fs = require('fs');
var builder;

describe('broccoli-vulcanize-html-imports', function() {
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('should vulcanize html imports', function() {
    var tree = vulcanizeImports('fixtures/vulcanize-html-imports');
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));

      var import1Html = path.join(result.directory, 'import1.html');
      assert(fs.existsSync(import1Html));

      var import2Html = path.join(result.directory, 'import2.html');
      assert(fs.existsSync(import2Html));

      var vulcanizedHtml = path.join(result.directory, 'vulcanized.html');
      assert(fs.existsSync(vulcanizedHtml));
    });
  });

  it('should not overwrite existing file', function() {
    var tree = vulcanizeImports('fixtures/vulcanize-html-imports', {
      outputFile: 'imports.html'
    });
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function() {
      assert(false, 'Expected an exception to be thrown.');
    }).catch(function(e) {
      assert(e);
    });
  });

it('should overwrite existing file when overwrite option is set', function() {
    var tree = vulcanizeImports('fixtures/vulcanize-html-imports', {
      overwrite: true,
      outputFile: 'imports.html'
    });
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));

      var import1Html = path.join(result.directory, 'import1.html');
      assert(fs.existsSync(import1Html));

      var import2Html = path.join(result.directory, 'import2.html');
      assert(fs.existsSync(import2Html));
    });
  });

  it('should not change options', function() {
    var options = {
      extensions: ['hbs']
    };
    var tree = vulcanizeImports('fixtures/vulcanize-html-imports', options);
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function() {
      assert.deepEqual({extensions: ['hbs']}, options);
    });
  });

  it('should not be affected by options changing outside', function() {
    var options = {
      outputFile: 'vulcanized.html'
    };
    var tree = vulcanizeImports('fixtures/vulcanize-html-imports', options);
    options.outputFile = 'imports.html';

    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var vulcanizedHtml = path.join(result.directory, 'vulcanized.html');
      assert(fs.existsSync(vulcanizedHtml));
    });
  });

  it('should be able to call vulcanize repeatedly', function() {
    var tree = vulcanizeImports('fixtures/vulcanize-html-imports');
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));

      var import1Html = path.join(result.directory, 'import1.html');
      assert(fs.existsSync(import1Html));

      var import2Html = path.join(result.directory, 'import2.html');
      assert(fs.existsSync(import2Html));

      var vulcanizedHtml = path.join(result.directory, 'vulcanized.html');
      assert(fs.existsSync(vulcanizedHtml));

      return builder.build().then(function(result) {
        var importsHtml = path.join(result.directory, 'imports.html');
        assert(fs.existsSync(importsHtml));

        var importsHbs = path.join(result.directory, 'imports.hbs');
        assert(fs.existsSync(importsHbs));

        var import1Html = path.join(result.directory, 'import1.html');
        assert(fs.existsSync(import1Html));

        var import2Html = path.join(result.directory, 'import2.html');
        assert(fs.existsSync(import2Html));

        var vulcanizedHtml = path.join(result.directory, 'vulcanized.html');
        assert(fs.existsSync(vulcanizedHtml));
      });
    });
  });

  it('should accept a broccoli tree', function() {
    var tree = {
      read: function() {
        return 'fixtures/vulcanize-html-imports';
      },
      cleanup: function() {
      }
    };

    tree = vulcanizeImports(tree);
    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var importsHtml = path.join(result.directory, 'imports.html');
      assert(fs.existsSync(importsHtml));

      var importsHbs = path.join(result.directory, 'imports.hbs');
      assert(fs.existsSync(importsHbs));

      var import1Html = path.join(result.directory, 'import1.html');
      assert(fs.existsSync(import1Html));

      var import2Html = path.join(result.directory, 'import2.html');
      assert(fs.existsSync(import2Html));

      var vulcanizedHtml = path.join(result.directory, 'vulcanized.html');
      assert(fs.existsSync(vulcanizedHtml));
    });
  });
});
