var assert = require('assert');
var fs = require('fs');
var themeleon = require('themeleon')();
var mustache = require('../index');
var path = require('path');
var q = require('q');

themeleon.use(mustache);

function testTheme(dest, expected, theme) {
  dest = path.resolve(__dirname, dest);
  expected = path.resolve(__dirname, expected);

  return themeleon(__dirname, theme)(__dirname, {title: 'Hello world!'})
    .then(function () {
      var destContent = fs.readFileSync(dest, 'utf8');
      var expectedContent = fs.readFileSync(expected, 'utf8');

      assert.equal(destContent, expectedContent);

      fs.unlink(dest);
    });
}

q()
  .then(function () {
    var src = 'views/test-single.mustache';
    var dest = 'test-single.html';
    var expected = 'test-single.expected.html';

    return testTheme(dest, expected, function (t) {
      t.mustache(src, dest);
    })
  })
  .then(function () {
    var src = 'views/test-partials.mustache';
    var dest = 'test-partials-object.html';
    var expected = 'test-partials.expected.html';

    return testTheme(dest, expected, function (t) {
      t.mustache(src, dest, {
        'foo': 'views/foo.mustache',
        'foo/bar': 'views/foo/bar.mustache',
      });
    });
  })
  .then(function () {
    var src = 'views/test-partials.mustache';
    var dest = 'test-partials-directory.html';
    var expected = 'test-partials.expected.html';

    return testTheme(dest, expected, function (t) {
      t.mustache(src, dest, 'views');
    });
  })
  .done();
