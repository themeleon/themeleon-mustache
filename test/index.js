var assert = require('assert');
var fs = require('fs');
var themeleon = require('themeleon')();
var mustache = require('../index');

themeleon.use(mustache);

var index = __dirname + '/index.html';
var expected = __dirname + '/expected.html';

var theme = themeleon(__dirname, function (t) {
  t.mustache('views/index.mustache', 'index.html', {
    'foo': 'views/foo.mustache',
    'foo/bar': 'views/foo/bar.mustache',
  });
});

theme(__dirname, {title: 'Hello world!'})
  .done(function () {
    var indexContent = fs.readFileSync(index, 'utf8');
    var expectedContent = fs.readFileSync(expected, 'utf8');

    assert.equal(indexContent, expectedContent);

    fs.unlink(index);
  });
