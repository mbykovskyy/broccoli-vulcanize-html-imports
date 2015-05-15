'use strict';
var HtmlParser = require('htmlparser2').Parser;
var fs = require('fs');
var path = require('path');
var glob = require('glob');

/**
 * Concatenates `<link rel="import" href="">` tags into a single file normalising
 * hrefs relative to the new file location.
 *
 * @param root the root directory
 * @param options {
 *   inputFiles: ['** /*.html']
 *   baseDir: root,
 *   excludes: ['regex']
 * }
 */
module.exports = function(root, options) {
  options = options || {};

  var patterns = options.inputFiles || ['**/*.html'];
  var baseDir = options.baseDir || root;
  var excludes = (options.excludes || []).map(function(regex) {
    return new RegExp(regex);
  });

  var files = getFiles(root, patterns);
  return collect(files, excludes, baseDir);
};

function getFiles(root, patterns) {
  var options = {
    nomount: true,
    strict: true,
    cwd: root
  };
  var files = {};

  patterns.forEach(function(pattern) {
    glob.sync(pattern, options).forEach(function(relativePath) {
      var fullPath = path.join(root, relativePath);

      if (fs.statSync(fullPath).isFile()) {
        files[fullPath] = true;
      }
    });
  });

  return Object.keys(files);
}

function collect(files, excludes, baseDir) {
  var tags = {};

  function tagsCollector(ref, file) {
    var relativePath = normalise(ref, file, baseDir);
    var tag = '<link rel="import" href="' + relativePath + '">';
    tags[tag] = true;
  }

  files.forEach(function(file) {
    processFile(file, excludes, tagsCollector);
  });

  return Object.keys(tags).join('\n');
}

function normalise(ref, file, baseDir) {
  var parent = path.dirname(file);
  var absolutePath = path.resolve(parent, ref);
  return path.relative(baseDir, absolutePath);
}

function processFile(file, excludes, cb) {
  var content = fs.readFileSync(file, 'utf8');
  return processString(content, excludes, file, cb);
}

function processString(str, excludes, file, cb) {
  var parser = new HtmlParser({
    onopentag: function(name, attrs) {
      if (shouldProcess(name, attrs, excludes)) {
        cb(attrs.href, file);
      }
    }
  });
  parser.write(str);
  parser.end();
}

function shouldProcess(name, attrs, excludes) {
  return 'link' === name && 'import' === attrs.rel && 'css' != attrs.type &&
    attrs.href && !exclude(attrs.href, excludes);
}

function exclude(ref, excludes) {
  return excludes.some(function(exclude) {
    return exclude.test(ref);
  });
}
