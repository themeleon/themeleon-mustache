Themeleon Mustache
==================

> [Mustache] mixin for [Themeleon].

**Warning:** this repository/package is deprecated, template engines
will be handled by consolidate.js in Themeleon 3.0.

[Mustache]: https://mustache.github.io/
[Themeleon]: https://github.com/themeleon/themeleon

Installation
------------

In your `package.json`:

```json
{
  "dependencies": {
    "themeleon": "1.*",
    "themeleon-mustache": "1.*"
  }
}
```

Usage
-----

Say we have the following theme structure:

```
views/
  foo/
    bar.mustache
  foo.mustache
  index.mustache
```

```js
var themeleon = require('themeleon')();

// Use the Mustache mixin
themeleon.use('mustache');

// Or inject your own instance
themeleon.use('mustache', require('mustache'));

module.exports = themeleon(__dirname, function (t) {
  // Render index alone
  t.mustache('views/index.mustache', 'index.html');

  // Or include a partials object
  t.mustache('views/index.mustache', 'index.html', {
    foo: 'views/foo.mustache',
    'foo/bar': 'views/foo/bar.mustache',
  });

  // Or let the mixin resolve all `.mustache` files in `views`
  // Note: `.mustache` and `.mst` extensions are supported.
  t.mustache('views/index.mustache', 'index.html', 'views');
});
```
