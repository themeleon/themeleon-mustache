'use strict';

var ap = require('ap');
var d = require('themeleon/decorators');
var fs = require('fs');
var path = require('path');
var q = require('q');

var readFile = q.denodeify(fs.readFile);

/**
 * Given partials are in the following format:
 *
 *     {
 *       name: 'path/to/partial.mustache',
 *       ...
 *     }
 *
 * The promise will resolve to the following:
 *
 *     {
 *       name: 'template file content',
 *       ...
 *     }
 *
 * The template files are relative to `src` directory.
 *
 * @param {string} src
 * @param {object} partials
 * @return {promise}
 */
function readPartials(src, partials) {
  var promises = [];

  for (var name in partials) {
    var file = path.resolve(src, partials[name]);
    var promise = q.all([q(name), readFile(file, 'utf8')]);
    promises.push(promise);
  }

  return q.all(promises)
    .then(function (list) {
      list.forEach(function (item) {
        var name = item[0];
        var content = item[1];

        partials[name] = content;
      });

      return partials;
    });
}

module.exports = function (mustache) {
  mustache = mustache || require('mustache');

  var writeFile = q.denodeify(fs.writeFile);

  return {
    mustache: d.srcDest(function (src, dest, partials) {
      var promise = q.all([readFile(src, 'utf8'), readPartials(this.src, partials)])
        .spread(function (template, partials) {
          return mustache.render(template, this.ctx, partials);
        }.bind(this))
        .then(ap([dest], writeFile));
      this.push(promise);
    }),
  };
};
