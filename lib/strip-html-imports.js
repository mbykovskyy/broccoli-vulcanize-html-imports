'use strict';
var cheerio = require('cheerio');

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
  var $ = cheerio.load(str);

  $('link[rel="import"][href]').each(function() {
    var el = $(this);
    var ref = el.attr('href');

    if (!exclude(ref, excludes)) {
      el.remove();
    }
  });
  return $.html();
}

function exclude(ref, excludes) {
  return excludes.some(function(exclude) {
    return exclude.test(ref);
  });
}
