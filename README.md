# concatenify

Browserify transform for the lazy ones which allows you to concatenate trees of 
JS files into your bundle.

## Why?

While browserify allows you to easily use CommonJS modules on browser
code, there are still a few valid use cases for file concatenation:

* You already use some other concatenation system like Sprockets
* Your frontend only app already depends on a framework module system
  like the Angular.js module system
* You're just being lazy

## How

This transform uses [glob](https://www.npmjs.org/package/glob)
internally, so you can just use the same patterns from the root of the
file you're requiring from.

```
npm install concatenify
```

```js
// app.js
var concatenify = require('concatenify');
concatenify('file.js');
concatenify('libs/*.js');
concatenify('libs/**/*.js');
```

```
browserify -t concatenify app.js > bundle.js
```

Concatenify will replace all the calls to itself with require calls to
each file matched by the globbed patterns, and browserify will then take
care of requiring all those files and automatically wrap them in a
CommonJS wrapper.

And because of that you get free sourcemaps with with the `--debug`
flag, so you can tell your files apart on your debugging tool.

## License

MIT
