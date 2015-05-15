'use strict';
var HtmlParser = require('htmlparser2').Parser;

/**
 * Strips `<link rel="import" href="">` tags.
 *
 * @param str the string to strip imports from
 * @param excludes an array of regexes
 * }
 */
module.exports = function(str, excludes) {
  var regexes = (excludes || []).map(function(regex) {
    return new RegExp(regex);
  });

  return strip(str, regexes);
};

function strip(str, excludes) {
  var result = '';
  var lastIndex = 0;
  var parser = new HtmlParser({
    onopentag: function(name, attrs) {
      if (shouldProcess(name, attrs, excludes)) {
        result += str.substring(lastIndex, parser.startIndex);
        lastIndex = parser.endIndex + 1;
      }
    },
    onend: function() {
      result += str.substring(lastIndex);
    }
  });
  parser.write(str);
  parser.end();

  return result;
}

function shouldProcess(name, attrs, excludes) {
  return 'link' === name && 'import' === attrs.rel && 'css' != attrs.type &&
    !exclude(attrs.href, excludes);
}

function exclude(ref, excludes) {
  return excludes.some(function(exclude) {
    return exclude.test(ref);
  });
}
