// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/path-browserify/index.js":[function(require,module,exports) {
var process = require("process");
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/dotenv/lib/main.js":[function(require,module,exports) {
var process = require("process");
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/
var fs = require('fs');

var path = require('path');

function log(message
/*: string */
) {
  console.log("[dotenv][DEBUG] ".concat(message));
}

var NEWLINE = '\n';
var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
var RE_NEWLINES = /\\n/g;
var NEWLINES_MATCH = /\n|\r|\r\n/; // Parses src into an Object

function parse(src
/*: string | Buffer */
, options
/*: ?DotenvParseOptions */
)
/*: DotenvParseOutput */
{
  var debug = Boolean(options && options.debug);
  var obj = {}; // convert Buffers before splitting into lines and processing

  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    var keyValueArr = line.match(RE_INI_KEY_VAL); // matched?

    if (keyValueArr != null) {
      var key = keyValueArr[1]; // default undefined or missing values to empty string

      var val = keyValueArr[2] || '';
      var end = val.length - 1;
      var isDoubleQuoted = val[0] === '"' && val[end] === '"';
      var isSingleQuoted = val[0] === "'" && val[end] === "'"; // if single or double quoted, remove quotes

      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end); // if double quoted, expand newlines

        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE);
        }
      } else {
        // remove surrounding whitespace
        val = val.trim();
      }

      obj[key] = val;
    } else if (debug) {
      log("did not match key and value when parsing line ".concat(idx + 1, ": ").concat(line));
    }
  });
  return obj;
} // Populates process.env from .env file


function config(options
/*: ?DotenvConfigOptions */
)
/*: DotenvConfigOutput */
{
  var dotenvPath = path.resolve(process.cwd(), '.env');
  var encoding
  /*: string */
  = 'utf8';
  var debug = false;

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path;
    }

    if (options.encoding != null) {
      encoding = options.encoding;
    }

    if (options.debug != null) {
      debug = true;
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    var parsed = parse(fs.readFileSync(dotenvPath, {
      encoding: encoding
    }), {
      debug: debug
    });
    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      } else if (debug) {
        log("\"".concat(key, "\" is already defined in `process.env` and will not be overwritten"));
      }
    });
    return {
      parsed: parsed
    };
  } catch (e) {
    return {
      error: e
    };
  }
}

module.exports.config = config;
module.exports.parse = parse;
},{"fs":"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js","path":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/path-browserify/index.js","process":"../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/load-google-maps-api/index.js":[function(require,module,exports) {
const API_URL = 'https://maps.googleapis.com/maps/api/js'
const CALLBACK_NAME = '__googleMapsApiOnLoadCallback'

const optionsKeys = ['channel', 'client', 'key', 'language', 'region', 'v']

let promise = null

module.exports = function (options = {}) {
  promise =
    promise ||
    new Promise(function (resolve, reject) {
      // Reject the promise after a timeout
      const timeoutId = setTimeout(function () {
        window[CALLBACK_NAME] = function () {} // Set the on load callback to a no-op
        reject(new Error('Could not load the Google Maps API'))
      }, options.timeout || 10000)

      // Hook up the on load callback
      window[CALLBACK_NAME] = function () {
        if (timeoutId !== null) {
          clearTimeout(timeoutId)
        }
        resolve(window.google.maps)
        delete window[CALLBACK_NAME]
      }

      // Prepare the `script` tag to be inserted into the page
      const scriptElement = document.createElement('script')
      const params = [`callback=${CALLBACK_NAME}`]
      optionsKeys.forEach(function (key) {
        if (options[key]) {
          params.push(`${key}=${options[key]}`)
        }
      })
      if (options.libraries && options.libraries.length) {
        params.push(`libraries=${options.libraries.join(',')}`)
      }
      scriptElement.src = `${options.apiUrl || API_URL}?${params.join('&')}`

      // Insert the `script` tag
      document.body.appendChild(scriptElement)
    })
  return promise
}

},{}],"convec_hull.js":[function(require,module,exports) {
/* 
 * Convex hull algorithm - Library (JavaScript)
 * 
 * Copyright (c) 2018 Project Nayuki
 * https://www.nayuki.io/page/convex-hull-algorithm
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program (see COPYING.txt and COPYING.LESSER.txt).
 * If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

var convexhull = new function () {
  // Returns a new array of points representing the convex hull of
  // the given set of points. The convex hull excludes collinear points.
  // This algorithm runs in O(n log n) time.
  this.makeHull = function (points) {
    var newPoints = points.slice();
    newPoints.sort(this.POINT_COMPARATOR);
    return this.makeHullPresorted(newPoints);
  }; // Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.


  this.makeHullPresorted = function (points) {
    if (points.length <= 1) return points.slice(); // Andrew's monotone chain algorithm. Positive y coordinates correspond to "up"
    // as per the mathematical convention, instead of "down" as per the computer
    // graphics convention. This doesn't affect the correctness of the result.

    var upperHull = [];

    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      while (upperHull.length >= 2) {
        var q = upperHull[upperHull.length - 1];
        var r = upperHull[upperHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();else break;
      }

      upperHull.push(p);
    }

    upperHull.pop();
    var lowerHull = [];

    for (var i = points.length - 1; i >= 0; i--) {
      var p = points[i];

      while (lowerHull.length >= 2) {
        var q = lowerHull[lowerHull.length - 1];
        var r = lowerHull[lowerHull.length - 2];
        if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();else break;
      }

      lowerHull.push(p);
    }

    lowerHull.pop();
    if (upperHull.length == 1 && lowerHull.length == 1 && upperHull[0].x == lowerHull[0].x && upperHull[0].y == lowerHull[0].y) return upperHull;else return upperHull.concat(lowerHull);
  };

  this.POINT_COMPARATOR = function (a, b) {
    if (a.x < b.x) return -1;else if (a.x > b.x) return +1;else if (a.y < b.y) return -1;else if (a.y > b.y) return +1;else return 0;
  };
}();
module.exports = convexhull;
},{}],"calculatePolygons.js":[function(require,module,exports) {
var convexhull = require('./convec_hull');

function splitByTimestamp(coordinates) {
  var coordinatesByTime = {};
  coordinates.forEach(function (c) {
    var time = new Date(c.timestamp);
    var h = time.getHours();
    var timeName = h.toString() + ':00-' + h.toString() + ':59';

    if (!coordinatesByTime[timeName]) {
      coordinatesByTime[timeName] = [];
    }

    coordinatesByTime[timeName].push(c);
  });
  return coordinatesByTime;
}

function measure(coord1, coord2) {
  // generally used geo measurement function
  var lat1 = coord1.lat;
  var lon1 = coord1.lng;
  var lat2 = coord2.lat;
  var lon2 = coord2.lng;
  var R = 6378.137; // Radius of earth in KM

  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

function coordinateIsIn(coordinate, coordinateGroups) {
  var index = -1;
  coordinateGroups.forEach(function (polygon, i) {
    if (polygon.includes(coordinate)) {
      index = i;
      return;
    }
  });
  return index;
}

function groupCoordinatesByDistance(coordinates, allowedDistance) {
  var coordinateGroups = [];

  for (var i = 0; i < coordinates.length; i++) {
    var c = coordinates;
    var iPolygonIndex = coordinateIsIn(c[i], coordinateGroups);

    if (iPolygonIndex < 0) {
      coordinateGroups.push([c[i]]);
      iPolygonIndex = coordinateGroups.length - 1;
    }

    for (var j = 0; j < coordinates.length; j++) {
      if (!(i === j)) {
        var distance = measure(c[i].location, c[j].location);

        if (distance <= allowedDistance) {
          var jPolygonIndex = coordinateIsIn(c[j], coordinateGroups);

          if (jPolygonIndex < 0) {
            coordinateGroups[iPolygonIndex].push(c[j]);
          } else if (jPolygonIndex !== iPolygonIndex) {
            var newArr = coordinateGroups[iPolygonIndex].concat(coordinateGroups[jPolygonIndex]);
            coordinateGroups.splice(iPolygonIndex, 1);
            coordinateGroups.splice(jPolygonIndex, 1);
            coordinateGroups.push(newArr);
            iPolygonIndex = coordinateGroups.length - 1;
            jPolygonIndex = iPolygonIndex;
          }
        }
      }
    }
  }

  return coordinateGroups;
}

function getCoordinatesInXY(coordinates) {
  var coordinatesXY = [];
  coordinates.forEach(function (c) {
    coordinatesXY.push({
      x: c.location.lng,
      y: c.location.lat
    });
  });
  return coordinatesXY;
}

function getXYCoordinatesInLatLng(coordinates) {
  var coordinatesLatLng = [];
  coordinates.forEach(function (c) {
    coordinatesLatLng.push({
      lat: c.x,
      lng: c.y
    });
  });
  return coordinatesLatLng;
}

function calculatePolygon(coordinates) {
  var coordinatesXY = getCoordinatesInXY(coordinates);
  var polygonXY = convexhull.makeHull(coordinatesXY);
  var polygonLatLng = getXYCoordinatesInLatLng(polygonXY);
  return polygonLatLng;
}

function calculatePolygonsFromCoordinateGroups(coordinateGroups) {
  var polygons = [];
  coordinateGroups.forEach(function (group) {
    polygons.push(calculatePolygon(group));
  });
  return polygons;
}

function getPolygon(coordinates, allowedDistance) {
  var newCoordinates = JSON.parse(JSON.stringify(coordinates));
  var groups = groupCoordinatesByDistance(newCoordinates, allowedDistance);
  var polygons = calculatePolygonsFromCoordinateGroups(groups);
  return polygons;
}

function run(coordinates, allowedDistance) {
  var coordinatesByTime = splitByTimestamp(coordinates);
  var polygons = {};

  for (var key in coordinatesByTime) {
    polygons[key] = getPolygon(coordinatesByTime[key], allowedDistance);
  }

  return polygons;
}

module.exports = run;
},{"./convec_hull":"convec_hull.js"}],"app.js":[function(require,module,exports) {
require('dotenv').config();

var loadGoogleMapsApi = require('load-google-maps-api');

var fs = require('fs');

var polygons = require('./calculatePolygons');

var cords_full = "[{\n    \"location\": {\n        \"lat\": 56.65731472997458,\n        \"lng\": 16.321155688268764\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506818628\n}, {\n    \"location\": {\n        \"lat\": 56.65732947260858,\n        \"lng\": 16.321201285822017\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506819346\n}, {\n    \"location\": {\n        \"lat\": 56.65734716376178,\n        \"lng\": 16.32125761221133\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506819924\n}, {\n    \"location\": {\n        \"lat\": 56.65736190638308,\n        \"lng\": 16.321316620809657\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506820525\n}, {\n    \"location\": {\n        \"lat\": 56.657386968826096,\n        \"lng\": 16.32138904045306\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506821230\n}, {\n    \"location\": {\n        \"lat\": 56.65740760847251,\n        \"lng\": 16.321458777887447\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506822827\n}, {\n    \"location\": {\n        \"lat\": 56.65742529958902,\n        \"lng\": 16.32152046869479\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506823427\n}, {\n    \"location\": {\n        \"lat\": 56.65744741347302,\n        \"lng\": 16.321579477293117\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506824116\n}, {\n    \"location\": {\n        \"lat\": 56.657469527344006,\n        \"lng\": 16.32164653251849\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506824896\n}, {\n    \"location\": {\n        \"lat\": 56.65749016694524,\n        \"lng\": 16.32172431657992\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506825541\n}, {\n    \"location\": {\n        \"lat\": 56.65750343525434,\n        \"lng\": 16.32177796076022\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506826096\n}, {\n    \"location\": {\n        \"lat\": 56.657466578828625,\n        \"lng\": 16.321820876104457\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506826771\n}, {\n    \"location\": {\n        \"lat\": 56.65744004217979,\n        \"lng\": 16.321775278551204\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506827567\n}, {\n    \"location\": {\n        \"lat\": 56.65742529958902,\n        \"lng\": 16.321689447862727\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506828062\n}, {\n    \"location\": {\n        \"lat\": 56.6574002371715,\n        \"lng\": 16.32161971042834\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506828654\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.32153656194888\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506829345\n}, {\n    \"location\": {\n        \"lat\": 56.657350112286494,\n        \"lng\": 16.32148291776858\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506829870\n}, {\n    \"location\": {\n        \"lat\": 56.657325049818986,\n        \"lng\": 16.32141586254321\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506830416\n}, {\n    \"location\": {\n        \"lat\": 56.65730588439141,\n        \"lng\": 16.321370264989955\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506831016\n}, {\n    \"location\": {\n        \"lat\": 56.65728082189451,\n        \"lng\": 16.321354171735866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506831542\n}, {\n    \"location\": {\n        \"lat\": 56.657254285114924,\n        \"lng\": 16.321397087080104\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506832134\n}, {\n    \"location\": {\n        \"lat\": 56.657198262963306,\n        \"lng\": 16.32153119753085\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506833290\n}, {\n    \"location\": {\n        \"lat\": 56.657154034890084,\n        \"lng\": 16.321659943563564\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506834984\n}, {\n    \"location\": {\n        \"lat\": 56.65721005710739,\n        \"lng\": 16.321474871141536\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506835989\n}, {\n    \"location\": {\n        \"lat\": 56.65716435477848,\n        \"lng\": 16.321600934965236\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506836784\n}, {\n    \"location\": {\n        \"lat\": 56.65712307520794,\n        \"lng\": 16.32173504541598\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506837414\n}, {\n    \"location\": {\n        \"lat\": 56.65708474413767,\n        \"lng\": 16.321863791448695\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506838738\n}, {\n    \"location\": {\n        \"lat\": 56.65709358977274,\n        \"lng\": 16.321812829477413\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506839642\n}, {\n    \"location\": {\n        \"lat\": 56.65705820722007,\n        \"lng\": 16.321938893301112\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506840542\n}, {\n    \"location\": {\n        \"lat\": 56.657036093107784,\n        \"lng\": 16.322000584108455\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506841569\n}, {\n    \"location\": {\n        \"lat\": 56.65702282463418,\n        \"lng\": 16.322067639333827\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506842784\n}, {\n    \"location\": {\n        \"lat\": 56.65704788730261,\n        \"lng\": 16.32210787246905\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506843744\n}, {\n    \"location\": {\n        \"lat\": 56.657074424227496,\n        \"lng\": 16.322056910497768\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506845049\n}, {\n    \"location\": {\n        \"lat\": 56.65709358977274,\n        \"lng\": 16.32198717306338\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506845942\n}, {\n    \"location\": {\n        \"lat\": 56.65711422957979,\n        \"lng\": 16.321928164465053\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506846999\n}, {\n    \"location\": {\n        \"lat\": 56.65713044656315,\n        \"lng\": 16.32189866016589\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506847771\n}, {\n    \"location\": {\n        \"lat\": 56.65714961207989,\n        \"lng\": 16.32183428714953\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506848530\n}, {\n    \"location\": {\n        \"lat\": 56.657180571740234,\n        \"lng\": 16.32177259634219\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506849436\n}, {\n    \"location\": {\n        \"lat\": 56.65720268576776,\n        \"lng\": 16.321697494489772\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506850464\n}, {\n    \"location\": {\n        \"lat\": 56.65723364538453,\n        \"lng\": 16.32161971042834\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506851845\n}, {\n    \"location\": {\n        \"lat\": 56.657248388050235,\n        \"lng\": 16.321558019620998\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506853029\n}, {\n    \"location\": {\n        \"lat\": 56.65726313071019,\n        \"lng\": 16.321480235559566\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506854012\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.321453413469417\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506854763\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.321533879739864\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506855594\n}, {\n    \"location\": {\n        \"lat\": 56.65732799834543,\n        \"lng\": 16.32161434601031\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506856629\n}, {\n    \"location\": {\n        \"lat\": 56.657345689499316,\n        \"lng\": 16.321654579145534\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506857416\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.321732363206966\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506858205\n}, {\n    \"location\": {\n        \"lat\": 56.65738107178216,\n        \"lng\": 16.321791371805293\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506858999\n}, {\n    \"location\": {\n        \"lat\": 56.6574002371715,\n        \"lng\": 16.32185038040362\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506859704\n}, {\n    \"location\": {\n        \"lat\": 56.65739139160839,\n        \"lng\": 16.321922800047023\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506860432\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.32190938900195\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506861174\n}, {\n    \"location\": {\n        \"lat\": 56.657332421134676,\n        \"lng\": 16.32185574482165\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506861865\n}, {\n    \"location\": {\n        \"lat\": 56.657320627028874,\n        \"lng\": 16.321780642969234\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506862599\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.321716269952876\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506863387\n}, {\n    \"location\": {\n        \"lat\": 56.65728377042442,\n        \"lng\": 16.321676036817653\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506863986\n}, {\n    \"location\": {\n        \"lat\": 56.65727492483398,\n        \"lng\": 16.32163580368243\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506864639\n}, {\n    \"location\": {\n        \"lat\": 56.65724249098464,\n        \"lng\": 16.32172431657992\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506865570\n}, {\n    \"location\": {\n        \"lat\": 56.657224799782334,\n        \"lng\": 16.321804782850368\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506866589\n}, {\n    \"location\": {\n        \"lat\": 56.657213005642845,\n        \"lng\": 16.32186110923968\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506867212\n}, {\n    \"location\": {\n        \"lat\": 56.657190891621376,\n        \"lng\": 16.321906706792934\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506867840\n}, {\n    \"location\": {\n        \"lat\": 56.65717320039485,\n        \"lng\": 16.321944257719142\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506868464\n}, {\n    \"location\": {\n        \"lat\": 56.65715108635001,\n        \"lng\": 16.32198180864535\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506869072\n}, {\n    \"location\": {\n        \"lat\": 56.65713486937557,\n        \"lng\": 16.322022041780574\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506869678\n}, {\n    \"location\": {\n        \"lat\": 56.65711717812273,\n        \"lng\": 16.322075685960872\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506870264\n}, {\n    \"location\": {\n        \"lat\": 56.65709653831731,\n        \"lng\": 16.32212396572314\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506870901\n}, {\n    \"location\": {\n        \"lat\": 56.65708032131938,\n        \"lng\": 16.322201749784572\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506871636\n}, {\n    \"location\": {\n        \"lat\": 56.6570685271347,\n        \"lng\": 16.32225002954684\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506872312\n}, {\n    \"location\": {\n        \"lat\": 56.657064104314486,\n        \"lng\": 16.322325131399257\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506873415\n}, {\n    \"location\": {\n        \"lat\": 56.65706557858795,\n        \"lng\": 16.322400233251674\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506874412\n}, {\n    \"location\": {\n        \"lat\": 56.657074424227496,\n        \"lng\": 16.322453877431972\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506875304\n}, {\n    \"location\": {\n        \"lat\": 56.65708032131938,\n        \"lng\": 16.322494110567195\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506876016\n}, {\n    \"location\": {\n        \"lat\": 56.657086218410335,\n        \"lng\": 16.322553119165523\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506876655\n}, {\n    \"location\": {\n        \"lat\": 56.657098012589486,\n        \"lng\": 16.322638949854\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506877390\n}, {\n    \"location\": {\n        \"lat\": 56.65711570385129,\n        \"lng\": 16.322684547407253\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506878110\n}, {\n    \"location\": {\n        \"lat\": 56.65714518926921,\n        \"lng\": 16.322708687288387\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506878769\n}, {\n    \"location\": {\n        \"lat\": 56.65717172612559,\n        \"lng\": 16.322719416124446\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506879430\n}, {\n    \"location\": {\n        \"lat\": 56.657201211499675,\n        \"lng\": 16.32271673391543\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506880127\n}, {\n    \"location\": {\n        \"lat\": 56.65723217111765,\n        \"lng\": 16.322697958452327\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506880877\n}, {\n    \"location\": {\n        \"lat\": 56.657266079241474,\n        \"lng\": 16.322673818571193\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506881575\n}, {\n    \"location\": {\n        \"lat\": 56.657282296159494,\n        \"lng\": 16.322663089735133\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506882482\n}, {\n    \"location\": {\n        \"lat\": 56.65730146159907,\n        \"lng\": 16.32264431427203\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506883172\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.322609445554836\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506883930\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.3225853056737\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506884650\n}, {\n    \"location\": {\n        \"lat\": 56.657266079241474,\n        \"lng\": 16.32259603450976\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506885527\n}, {\n    \"location\": {\n        \"lat\": 56.657243965251126,\n        \"lng\": 16.322614809972865\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506886172\n}, {\n    \"location\": {\n        \"lat\": 56.657213005642845,\n        \"lng\": 16.322620174390895\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506886825\n}, {\n    \"location\": {\n        \"lat\": 56.65719236588987,\n        \"lng\": 16.32262285659991\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506887462\n}, {\n    \"location\": {\n        \"lat\": 56.657161406239204,\n        \"lng\": 16.322609445554836\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506888085\n}, {\n    \"location\": {\n        \"lat\": 56.657137817916876,\n        \"lng\": 16.32261212776385\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506888910\n}, {\n    \"location\": {\n        \"lat\": 56.65712454947911,\n        \"lng\": 16.322577259046657\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506889477\n}, {\n    \"location\": {\n        \"lat\": 56.65711570385129,\n        \"lng\": 16.32251825044833\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506890207\n}, {\n    \"location\": {\n        \"lat\": 56.65711128103663,\n        \"lng\": 16.322437784177882\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506890790\n}, {\n    \"location\": {\n        \"lat\": 56.65711275530824,\n        \"lng\": 16.32236536453448\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506891475\n}, {\n    \"location\": {\n        \"lat\": 56.65710538394958,\n        \"lng\": 16.322322449190242\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506892262\n}, {\n    \"location\": {\n        \"lat\": 56.65710980676495,\n        \"lng\": 16.3222607583829\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506892815\n}, {\n    \"location\": {\n        \"lat\": 56.65712012666546,\n        \"lng\": 16.32221784303866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506893455\n}, {\n    \"location\": {\n        \"lat\": 56.65713486937557,\n        \"lng\": 16.322177609903438\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506894037\n}, {\n    \"location\": {\n        \"lat\": 56.65715108635001,\n        \"lng\": 16.32210787246905\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506894939\n}, {\n    \"location\": {\n        \"lat\": 56.657174674664056,\n        \"lng\": 16.322051546079738\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506895530\n}, {\n    \"location\": {\n        \"lat\": 56.6572056343038,\n        \"lng\": 16.322005948526485\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506896114\n}, {\n    \"location\": {\n        \"lat\": 56.65721595417806,\n        \"lng\": 16.32198180864535\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506896905\n}, {\n    \"location\": {\n        \"lat\": 56.657243965251126,\n        \"lng\": 16.321901342374904\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506897510\n}, {\n    \"location\": {\n        \"lat\": 56.65726018217865,\n        \"lng\": 16.321842333776576\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506898141\n}, {\n    \"location\": {\n        \"lat\": 56.657277873364364,\n        \"lng\": 16.32179405401431\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506898793\n}, {\n    \"location\": {\n        \"lat\": 56.6572911417482,\n        \"lng\": 16.32186647365771\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506900137\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.321936211092098\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506901096\n}, {\n    \"location\": {\n        \"lat\": 56.65725870791281,\n        \"lng\": 16.322016677362544\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506902709\n}, {\n    \"location\": {\n        \"lat\": 56.657266079241474,\n        \"lng\": 16.321973762018306\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506904359\n}, {\n    \"location\": {\n        \"lat\": 56.657226274049506,\n        \"lng\": 16.322078368169887\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506905350\n}, {\n    \"location\": {\n        \"lat\": 56.65720268576776,\n        \"lng\": 16.322126647932155\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506906752\n}, {\n    \"location\": {\n        \"lat\": 56.657190891621376,\n        \"lng\": 16.32215615223132\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506907630\n}, {\n    \"location\": {\n        \"lat\": 56.65717909747128,\n        \"lng\": 16.322199067575557\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506908288\n}, {\n    \"location\": {\n        \"lat\": 56.65716730331749,\n        \"lng\": 16.32223930071078\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506908972\n}, {\n    \"location\": {\n        \"lat\": 56.65715993196949,\n        \"lng\": 16.32227685163699\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506909615\n}, {\n    \"location\": {\n        \"lat\": 56.657154034890084,\n        \"lng\": 16.3223331780263\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506910307\n}, {\n    \"location\": {\n        \"lat\": 56.657154034890084,\n        \"lng\": 16.32238145778857\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506910965\n}, {\n    \"location\": {\n        \"lat\": 56.65715550916002,\n        \"lng\": 16.322421690923793\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506911595\n}, {\n    \"location\": {\n        \"lat\": 56.65715993196949,\n        \"lng\": 16.32246460626803\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506912225\n}, {\n    \"location\": {\n        \"lat\": 56.65716582904801,\n        \"lng\": 16.32250215719424\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506913015\n}, {\n    \"location\": {\n        \"lat\": 56.657174674664056,\n        \"lng\": 16.32252897928439\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506913839\n}, {\n    \"location\": {\n        \"lat\": 56.657201211499675,\n        \"lng\": 16.322550436956508\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506914438\n}, {\n    \"location\": {\n        \"lat\": 56.65722774831662,\n        \"lng\": 16.322542390329463\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506915127\n}, {\n    \"location\": {\n        \"lat\": 56.65726755350704,\n        \"lng\": 16.32252361486636\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506915961\n}, {\n    \"location\": {\n        \"lat\": 56.657288193218854,\n        \"lng\": 16.322504839403255\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506916658\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.322448513013942\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506917492\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.32239755104266\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506918467\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.322357317907436\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506919202\n}, {\n    \"location\": {\n        \"lat\": 56.657319152765396,\n        \"lng\": 16.322274169427974\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506920011\n}, {\n    \"location\": {\n        \"lat\": 56.65732799834543,\n        \"lng\": 16.322201749784572\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506920762\n}, {\n    \"location\": {\n        \"lat\": 56.6573383181862,\n        \"lng\": 16.32214542339526\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506921512\n}, {\n    \"location\": {\n        \"lat\": 56.657344215236805,\n        \"lng\": 16.32209177921496\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506922185\n}, {\n    \"location\": {\n        \"lat\": 56.657341266711626,\n        \"lng\": 16.322059592706783\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506923171\n}, {\n    \"location\": {\n        \"lat\": 56.65733389539764,\n        \"lng\": 16.322011312944515\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506923798\n}, {\n    \"location\": {\n        \"lat\": 56.65731030718325,\n        \"lng\": 16.322005948526485\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506924518\n}, {\n    \"location\": {\n        \"lat\": 56.65729703880619,\n        \"lng\": 16.32202472398959\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506925163\n}, {\n    \"location\": {\n        \"lat\": 56.657279347629455,\n        \"lng\": 16.322059592706783\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506925930\n}, {\n    \"location\": {\n        \"lat\": 56.65727197630338,\n        \"lng\": 16.32209177921496\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506926550\n}, {\n    \"location\": {\n        \"lat\": 56.65724986231649,\n        \"lng\": 16.322132012350185\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506927301\n}, {\n    \"location\": {\n        \"lat\": 56.657235119651375,\n        \"lng\": 16.322204431993587\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506927976\n}, {\n    \"location\": {\n        \"lat\": 56.657224799782334,\n        \"lng\": 16.322252711755855\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506928620\n}, {\n    \"location\": {\n        \"lat\": 56.65721595417806,\n        \"lng\": 16.322290262682063\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506929393\n}, {\n    \"location\": {\n        \"lat\": 56.65721153137515,\n        \"lng\": 16.322335860235317\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506930053\n}, {\n    \"location\": {\n        \"lat\": 56.6572056343038,\n        \"lng\": 16.322405597669704\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506930728\n}, {\n    \"location\": {\n        \"lat\": 56.65721005710739,\n        \"lng\": 16.322445830804927\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506931425\n}, {\n    \"location\": {\n        \"lat\": 56.6572174284456,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506932306\n}, {\n    \"location\": {\n        \"lat\": 56.65724543951755,\n        \"lng\": 16.322456559640987\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506933060\n}, {\n    \"location\": {\n        \"lat\": 56.65724691378393,\n        \"lng\": 16.32239755104266\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506933713\n}, {\n    \"location\": {\n        \"lat\": 56.657251336582696,\n        \"lng\": 16.322346589071376\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506934455\n}, {\n    \"location\": {\n        \"lat\": 56.65726165644445,\n        \"lng\": 16.32228221605502\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506935168\n}, {\n    \"location\": {\n        \"lat\": 56.657277873364364,\n        \"lng\": 16.32221784303866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506935783\n}, {\n    \"location\": {\n        \"lat\": 56.6572911417482,\n        \"lng\": 16.32216151664935\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506936548\n}, {\n    \"location\": {\n        \"lat\": 56.657304410127345,\n        \"lng\": 16.32210787246905\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506937163\n}, {\n    \"location\": {\n        \"lat\": 56.65736485490666,\n        \"lng\": 16.32202472398959\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506938597\n}, {\n    \"location\": {\n        \"lat\": 56.65740760847251,\n        \"lng\": 16.321995219690425\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506940270\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.321957668764217\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506941830\n}, {\n    \"location\": {\n        \"lat\": 56.657468053086355,\n        \"lng\": 16.321930846674068\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506942578\n}, {\n    \"location\": {\n        \"lat\": 56.65749753822867,\n        \"lng\": 16.321925482256038\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506943433\n}, {\n    \"location\": {\n        \"lat\": 56.65752112632591,\n        \"lng\": 16.321941575510127\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506944115\n}, {\n    \"location\": {\n        \"lat\": 56.65754324015365,\n        \"lng\": 16.32198717306338\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506944798\n}, {\n    \"location\": {\n        \"lat\": 56.65753586887918,\n        \"lng\": 16.32186110923968\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506946321\n}, {\n    \"location\": {\n        \"lat\": 56.6575815707577,\n        \"lng\": 16.322005948526485\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506947657\n}, {\n    \"location\": {\n        \"lat\": 56.65757567374425,\n        \"lng\": 16.321941575510127\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506948633\n}, {\n    \"location\": {\n        \"lat\": 56.657593364781874,\n        \"lng\": 16.32209714363299\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506949440\n}, {\n    \"location\": {\n        \"lat\": 56.6576228498262,\n        \"lng\": 16.322148105604274\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506951377\n}, {\n    \"location\": {\n        \"lat\": 56.65763611808858,\n        \"lng\": 16.322209796411617\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506952080\n}, {\n    \"location\": {\n        \"lat\": 56.657644963594265,\n        \"lng\": 16.32222320745669\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506953035\n}, {\n    \"location\": {\n        \"lat\": 56.65766118034928,\n        \"lng\": 16.322295627100093\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506953745\n}, {\n    \"location\": {\n        \"lat\": 56.657675922847794,\n        \"lng\": 16.322362682325465\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506954390\n}, {\n    \"location\": {\n        \"lat\": 56.65768919109152,\n        \"lng\": 16.322421690923793\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506955290\n}, {\n    \"location\": {\n        \"lat\": 56.65770245933058,\n        \"lng\": 16.322467288477046\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506955875\n}, {\n    \"location\": {\n        \"lat\": 56.65771867606086,\n        \"lng\": 16.32253970812045\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506956714\n}, {\n    \"location\": {\n        \"lat\": 56.65773047004213,\n        \"lng\": 16.32260676334582\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506961605\n}, {\n    \"location\": {\n        \"lat\": 56.657749635253865,\n        \"lng\": 16.322684547407253\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506963610\n}, {\n    \"location\": {\n        \"lat\": 56.65776142922546,\n        \"lng\": 16.322783789140804\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506964839\n}, {\n    \"location\": {\n        \"lat\": 56.65778796564805,\n        \"lng\": 16.322920581800563\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506967667\n}, {\n    \"location\": {\n        \"lat\": 56.6577805944214,\n        \"lng\": 16.322883030874355\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506968475\n}, {\n    \"location\": {\n        \"lat\": 56.657796811118104,\n        \"lng\": 16.32298495481692\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506969467\n}, {\n    \"location\": {\n        \"lat\": 56.657808605074926,\n        \"lng\": 16.32303859899722\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506970592\n}, {\n    \"location\": {\n        \"lat\": 56.65781597629607,\n        \"lng\": 16.323086878759486\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506971168\n}, {\n    \"location\": {\n        \"lat\": 56.65782334751578,\n        \"lng\": 16.3231432051488\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506972195\n}, {\n    \"location\": {\n        \"lat\": 56.65782187327197,\n        \"lng\": 16.323183438284023\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506972983\n}, {\n    \"location\": {\n        \"lat\": 56.657817450540136,\n        \"lng\": 16.32322635362826\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506973695\n}, {\n    \"location\": {\n        \"lat\": 56.65781450205198,\n        \"lng\": 16.32327463339053\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506974430\n}, {\n    \"location\": {\n        \"lat\": 56.657807130830534,\n        \"lng\": 16.323312184316737\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506975113\n}, {\n    \"location\": {\n        \"lat\": 56.65778796564805,\n        \"lng\": 16.32337923954211\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506975897\n}, {\n    \"location\": {\n        \"lat\": 56.65777617168476,\n        \"lng\": 16.323427519304378\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506976578\n}, {\n    \"location\": {\n        \"lat\": 56.657765851963866,\n        \"lng\": 16.323481163484676\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506977168\n}, {\n    \"location\": {\n        \"lat\": 56.65776142922546,\n        \"lng\": 16.32351066778384\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506977888\n}, {\n    \"location\": {\n        \"lat\": 56.657749635253865,\n        \"lng\": 16.323553583128078\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506978827\n}, {\n    \"location\": {\n        \"lat\": 56.65774373826668,\n        \"lng\": 16.32358308742724\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506979635\n}, {\n    \"location\": {\n        \"lat\": 56.65773931552568,\n        \"lng\": 16.323591134054286\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506980425\n}, {\n    \"location\": {\n        \"lat\": 56.65770245933058,\n        \"lng\": 16.323634049398525\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506981828\n}, {\n    \"location\": {\n        \"lat\": 56.657662654599406,\n        \"lng\": 16.32365282486163\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506983477\n}, {\n    \"location\": {\n        \"lat\": 56.65764054084168,\n        \"lng\": 16.323666235906703\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506984450\n}, {\n    \"location\": {\n        \"lat\": 56.657605158802376,\n        \"lng\": 16.323668918115718\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506985238\n}, {\n    \"location\": {\n        \"lat\": 56.657580096504425,\n        \"lng\": 16.323690375787837\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506986507\n}, {\n    \"location\": {\n        \"lat\": 56.6575506114267,\n        \"lng\": 16.323685011369808\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506987323\n}, {\n    \"location\": {\n        \"lat\": 56.65751375504709,\n        \"lng\": 16.323701104623897\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506988193\n}, {\n    \"location\": {\n        \"lat\": 56.65748426991748,\n        \"lng\": 16.323703786832912\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506988935\n}, {\n    \"location\": {\n        \"lat\": 56.65746215605512,\n        \"lng\": 16.32371451566897\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506990115\n}, {\n    \"location\": {\n        \"lat\": 56.6574208768107,\n        \"lng\": 16.32373060892306\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506991622\n}, {\n    \"location\": {\n        \"lat\": 56.65739139160839,\n        \"lng\": 16.323733291132076\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506992874\n}, {\n    \"location\": {\n        \"lat\": 56.6573368439234,\n        \"lng\": 16.323727926714046\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506994824\n}, {\n    \"location\": {\n        \"lat\": 56.657292616012775,\n        \"lng\": 16.323687693578822\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506997262\n}, {\n    \"location\": {\n        \"lat\": 56.65728377042442,\n        \"lng\": 16.323607227308376\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507000142\n}, {\n    \"location\": {\n        \"lat\": 56.65727050203799,\n        \"lng\": 16.32353212545596\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507002753\n}, {\n    \"location\": {\n        \"lat\": 56.65726313071019,\n        \"lng\": 16.323438248140437\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507004545\n}, {\n    \"location\": {\n        \"lat\": 56.65726018217865,\n        \"lng\": 16.323360464079006\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507006351\n}, {\n    \"location\": {\n        \"lat\": 56.657254285114924,\n        \"lng\": 16.323223671419246\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507008325\n}, {\n    \"location\": {\n        \"lat\": 56.65724986231649,\n        \"lng\": 16.323151251775844\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507009359\n}, {\n    \"location\": {\n        \"lat\": 56.657243965251126,\n        \"lng\": 16.323054692251308\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507011152\n}, {\n    \"location\": {\n        \"lat\": 56.657279347629455,\n        \"lng\": 16.323046645624263\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507013364\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.323140522939784\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507014338\n}, {\n    \"location\": {\n        \"lat\": 56.65729556454177,\n        \"lng\": 16.323199531538112\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507015028\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.323255857927425\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507015883\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.323293408853633\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507016719\n}, {\n    \"location\": {\n        \"lat\": 56.65730735865543,\n        \"lng\": 16.32335778186999\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507017773\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.32341679046832\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507018973\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.323440930349452\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507019655\n}, {\n    \"location\": {\n        \"lat\": 56.65732357555569,\n        \"lng\": 16.323497256738765\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507020630\n}, {\n    \"location\": {\n        \"lat\": 56.657325049818986,\n        \"lng\": 16.323540172083003\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507021475\n}, {\n    \"location\": {\n        \"lat\": 56.657332421134676,\n        \"lng\": 16.323561629755122\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507022004\n}, {\n    \"location\": {\n        \"lat\": 56.657342740974244,\n        \"lng\": 16.323591134054286\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507022896\n}, {\n    \"location\": {\n        \"lat\": 56.65735895785928,\n        \"lng\": 16.323650142652614\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507024155\n}, {\n    \"location\": {\n        \"lat\": 56.65739728865071,\n        \"lng\": 16.323639413816554\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507025423\n}, {\n    \"location\": {\n        \"lat\": 56.657431196626014,\n        \"lng\": 16.32363673160754\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507026450\n}, {\n    \"location\": {\n        \"lat\": 56.657463630313025,\n        \"lng\": 16.323628684980495\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507027448\n}, {\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.32362063835345\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507028258\n}, {\n    \"location\": {\n        \"lat\": 56.657515229302966,\n        \"lng\": 16.323612591726405\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507029270\n}, {\n    \"location\": {\n        \"lat\": 56.65755503418983,\n        \"lng\": 16.32360990951739\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507030260\n}, {\n    \"location\": {\n        \"lat\": 56.6576095815591,\n        \"lng\": 16.323591134054286\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507033277\n}, {\n    \"location\": {\n        \"lat\": 56.657647912095705,\n        \"lng\": 16.323572358591182\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507035039\n}, {\n    \"location\": {\n        \"lat\": 56.65767887134682,\n        \"lng\": 16.32354285429202\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507036050\n}, {\n    \"location\": {\n        \"lat\": 56.65769951083341,\n        \"lng\": 16.32349457452975\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507037078\n}, {\n    \"location\": {\n        \"lat\": 56.65771277906886,\n        \"lng\": 16.3234677524396\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507038135\n}, {\n    \"location\": {\n        \"lat\": 56.657728995794685,\n        \"lng\": 16.323422154886348\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507039058\n}, {\n    \"location\": {\n        \"lat\": 56.65773784127857,\n        \"lng\": 16.32334705303393\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507040153\n}, {\n    \"location\": {\n        \"lat\": 56.65774521251357,\n        \"lng\": 16.323293408853633\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507040970\n}, {\n    \"location\": {\n        \"lat\": 56.657765851963866,\n        \"lng\": 16.3232156247922\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507042488\n}, {\n    \"location\": {\n        \"lat\": 56.657768800455806,\n        \"lng\": 16.323178073865993\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507043355\n}, {\n    \"location\": {\n        \"lat\": 56.657768800455806,\n        \"lng\": 16.323097607595546\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507044293\n}, {\n    \"location\": {\n        \"lat\": 56.6577584807329,\n        \"lng\": 16.32302787016116\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507045276\n}, {\n    \"location\": {\n        \"lat\": 56.657749635253865,\n        \"lng\": 16.322966179353816\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507046528\n}, {\n    \"location\": {\n        \"lat\": 56.6577363670314,\n        \"lng\": 16.322928628427608\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507047498\n}, {\n    \"location\": {\n        \"lat\": 56.65772752154718,\n        \"lng\": 16.32285889099322\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507048531\n}, {\n    \"location\": {\n        \"lat\": 56.65771425331694,\n        \"lng\": 16.322799882394893\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507049247\n}, {\n    \"location\": {\n        \"lat\": 56.65769951083341,\n        \"lng\": 16.322730144960506\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507050173\n}, {\n    \"location\": {\n        \"lat\": 56.65768624259332,\n        \"lng\": 16.322676500780208\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507051598\n}, {\n    \"location\": {\n        \"lat\": 56.65767297434857,\n        \"lng\": 16.322604081136806\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507052625\n}, {\n    \"location\": {\n        \"lat\": 56.65765528334827,\n        \"lng\": 16.322547754747493\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507053544\n}, {\n    \"location\": {\n        \"lat\": 56.65764938634633,\n        \"lng\": 16.322499474985225\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507055250\n}, {\n    \"location\": {\n        \"lat\": 56.65763759233967,\n        \"lng\": 16.322416326505763\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507055978\n}, {\n    \"location\": {\n        \"lat\": 56.657618427071,\n        \"lng\": 16.32237609337054\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507057015\n}, {\n    \"location\": {\n        \"lat\": 56.657600736045126,\n        \"lng\": 16.322300991518123\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507058220\n}, {\n    \"location\": {\n        \"lat\": 56.65758599351723,\n        \"lng\": 16.322241982919795\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507059317\n}, {\n    \"location\": {\n        \"lat\": 56.657569776729844,\n        \"lng\": 16.322185656530483\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507060388\n}, {\n    \"location\": {\n        \"lat\": 56.65755798269829,\n        \"lng\": 16.322158834440334\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507061157\n}, {\n    \"location\": {\n        \"lat\": 56.65754176589888,\n        \"lng\": 16.32211323688708\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507061865\n}, {\n    \"location\": {\n        \"lat\": 56.65752554909248,\n        \"lng\": 16.322083732587917\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507063153\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.322064957124812\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507063884\n}, {\n    \"location\": {\n        \"lat\": 56.657468053086355,\n        \"lng\": 16.322062274915798\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507064979\n}, {\n    \"location\": {\n        \"lat\": 56.6574002371715,\n        \"lng\": 16.322153470022304\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507068482\n}, {\n    \"location\": {\n        \"lat\": 56.657406134212444,\n        \"lng\": 16.32210250805102\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507070005\n}, {\n    \"location\": {\n        \"lat\": 56.65737959752104,\n        \"lng\": 16.322209796411617\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507070895\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.32227685163699\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507071855\n}, {\n    \"location\": {\n        \"lat\": 56.657375174737346,\n        \"lng\": 16.32221784303866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507072785\n}, {\n    \"location\": {\n        \"lat\": 56.65735748359728,\n        \"lng\": 16.32228221605502\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507073464\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.32235463569842\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507074450\n}, {\n    \"location\": {\n        \"lat\": 56.657341266711626,\n        \"lng\": 16.322427055341823\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507075125\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.322494110567195\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507076692\n}, {\n    \"location\": {\n        \"lat\": 56.657345689499316,\n        \"lng\": 16.322579941255672\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507077929\n}, {\n    \"location\": {\n        \"lat\": 56.657370751953096,\n        \"lng\": 16.32262285659991\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507079001\n}, {\n    \"location\": {\n        \"lat\": 56.65735306081098,\n        \"lng\": 16.322697958452327\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507080134\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.32273819158755\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507080848\n}, {\n    \"location\": {\n        \"lat\": 56.65726018217865,\n        \"lng\": 16.32277037809573\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507082205\n}, {\n    \"location\": {\n        \"lat\": 56.65723364538453,\n        \"lng\": 16.322789153558833\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507083165\n}, {\n    \"location\": {\n        \"lat\": 56.657186468815524,\n        \"lng\": 16.322821340067012\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507084376\n}, {\n    \"location\": {\n        \"lat\": 56.65719236588987,\n        \"lng\": 16.322893759710414\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507085595\n}, {\n    \"location\": {\n        \"lat\": 56.65721890271305,\n        \"lng\": 16.322925946218593\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507094528\n}, {\n    \"location\": {\n        \"lat\": 56.657254285114924,\n        \"lng\": 16.3228910775014\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507095808\n}, {\n    \"location\": {\n        \"lat\": 56.657299987334824,\n        \"lng\": 16.322872302038295\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507096918\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.32284816215716\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507097729\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.32283206890307\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507098875\n}, {\n    \"location\": {\n        \"lat\": 56.65739728865071,\n        \"lng\": 16.322818657857997\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507099613\n}, {\n    \"location\": {\n        \"lat\": 56.65744151643854,\n        \"lng\": 16.322799882394893\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507100563\n}, {\n    \"location\": {\n        \"lat\": 56.65747689863146,\n        \"lng\": 16.32278647134982\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507101613\n}, {\n    \"location\": {\n        \"lat\": 56.65751080653517,\n        \"lng\": 16.322762331468684\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507102378\n}, {\n    \"location\": {\n        \"lat\": 56.65754029164405,\n        \"lng\": 16.322746238214595\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507103264\n}, {\n    \"location\": {\n        \"lat\": 56.6575668282223,\n        \"lng\": 16.32273819158755\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507104223\n}, {\n    \"location\": {\n        \"lat\": 56.65759631328736,\n        \"lng\": 16.322719416124446\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507105086\n}, {\n    \"location\": {\n        \"lat\": 56.657618427071,\n        \"lng\": 16.322695276243312\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507106113\n}, {\n    \"location\": {\n        \"lat\": 56.65763464383744,\n        \"lng\": 16.322681865198238\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507107036\n}, {\n    \"location\": {\n        \"lat\": 56.65764054084168,\n        \"lng\": 16.32266040752612\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507108139\n}, {\n    \"location\": {\n        \"lat\": 56.65763169533499,\n        \"lng\": 16.322593352300746\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507108922\n}, {\n    \"location\": {\n        \"lat\": 56.657606633054684,\n        \"lng\": 16.32253970812045\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507110218\n}, {\n    \"location\": {\n        \"lat\": 56.6575845192641,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507116750\n}, {\n    \"location\": {\n        \"lat\": 56.65756240546056,\n        \"lng\": 16.322545072538478\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507121744\n}, {\n    \"location\": {\n        \"lat\": 56.65761547856727,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507123155\n}, {\n    \"location\": {\n        \"lat\": 56.65757419949074,\n        \"lng\": 16.32238145778857\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507124151\n}, {\n    \"location\": {\n        \"lat\": 56.65755208568114,\n        \"lng\": 16.322303673727138\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507125230\n}, {\n    \"location\": {\n        \"lat\": 56.65753439462409,\n        \"lng\": 16.3222607583829\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507126043\n}, {\n    \"location\": {\n        \"lat\": 56.65750785802302,\n        \"lng\": 16.3222071142026\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507127083\n}, {\n    \"location\": {\n        \"lat\": 56.65747395011666,\n        \"lng\": 16.322193703157527\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507128141\n}, {\n    \"location\": {\n        \"lat\": 56.65745331050656,\n        \"lng\": 16.322204431993587\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507129440\n}, {\n    \"location\": {\n        \"lat\": 56.65743267088514,\n        \"lng\": 16.322258076173885\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507130322\n}, {\n    \"location\": {\n        \"lat\": 56.657417928291494,\n        \"lng\": 16.322314402563197\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507131366\n}, {\n    \"location\": {\n        \"lat\": 56.65741497977207,\n        \"lng\": 16.32237609337054\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507132461\n}, {\n    \"location\": {\n        \"lat\": 56.657409082732535,\n        \"lng\": 16.322429737550838\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507133376\n}, {\n    \"location\": {\n        \"lat\": 56.65740760847251,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507134284\n}, {\n    \"location\": {\n        \"lat\": 56.65741055699251,\n        \"lng\": 16.32253434370242\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507135401\n}, {\n    \"location\": {\n        \"lat\": 56.65745331050656,\n        \"lng\": 16.32253970812045\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507136904\n}, {\n    \"location\": {\n        \"lat\": 56.657457733281085,\n        \"lng\": 16.322472652895076\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507137885\n}, {\n    \"location\": {\n        \"lat\": 56.65746215605512,\n        \"lng\": 16.32240291546069\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507138949\n}, {\n    \"location\": {\n        \"lat\": 56.657469527344006,\n        \"lng\": 16.322351953489406\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507139886\n}, {\n    \"location\": {\n        \"lat\": 56.65747837288878,\n        \"lng\": 16.322290262682063\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507141094\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.32228758047305\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507141979\n}, {\n    \"location\": {\n        \"lat\": 56.657499012485175,\n        \"lng\": 16.322258076173885\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507143555\n}, {\n    \"location\": {\n        \"lat\": 56.65751228079117,\n        \"lng\": 16.322325131399257\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507144259\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.32241364429675\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507145399\n}, {\n    \"location\": {\n        \"lat\": 56.65751817781455,\n        \"lng\": 16.322435101968868\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507146876\n}, {\n    \"location\": {\n        \"lat\": 56.65751817781455,\n        \"lng\": 16.322483381731136\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507148137\n}, {\n    \"location\": {\n        \"lat\": 56.65750048674163,\n        \"lng\": 16.32251825044833\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507148890\n}, {\n    \"location\": {\n        \"lat\": 56.65750048674163,\n        \"lng\": 16.322550436956508\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507149959\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.322571894628627\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507151166\n}, {\n    \"location\": {\n        \"lat\": 56.65751375504709,\n        \"lng\": 16.32259067009173\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507152299\n}, {\n    \"location\": {\n        \"lat\": 56.65755208568114,\n        \"lng\": 16.322636267644985\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507156065\n}, {\n    \"location\": {\n        \"lat\": 56.657588942023274,\n        \"lng\": 16.32264967869006\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507158622\n}, {\n    \"location\": {\n        \"lat\": 56.65752407483702,\n        \"lng\": 16.322687229616268\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507160258\n}, {\n    \"location\": {\n        \"lat\": 56.65748721843146,\n        \"lng\": 16.322689911825282\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507161382\n}, {\n    \"location\": {\n        \"lat\": 56.65747395011666,\n        \"lng\": 16.322646996481044\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507163296\n}, {\n    \"location\": {\n        \"lat\": 56.65745625902295,\n        \"lng\": 16.32261749218188\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507164704\n}, {\n    \"location\": {\n        \"lat\": 56.65741497977207,\n        \"lng\": 16.32261749218188\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507166963\n}, {\n    \"location\": {\n        \"lat\": 56.65742235107019,\n        \"lng\": 16.322689911825282\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507171553\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.32272209833346\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507174418\n}, {\n    \"location\": {\n        \"lat\": 56.65739286586908,\n        \"lng\": 16.32275428484164\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507175519\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.32277574251376\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507176758\n}, {\n    \"location\": {\n        \"lat\": 56.657341266711626,\n        \"lng\": 16.32278647134982\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507178369\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.322802564603908\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507179446\n}, {\n    \"location\": {\n        \"lat\": 56.657342740974244,\n        \"lng\": 16.32290180633746\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507180334\n}, {\n    \"location\": {\n        \"lat\": 56.657342740974244,\n        \"lng\": 16.322936675054653\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507181872\n}, {\n    \"location\": {\n        \"lat\": 56.65739139160839,\n        \"lng\": 16.322928628427608\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507182929\n}, {\n    \"location\": {\n        \"lat\": 56.65740465995227,\n        \"lng\": 16.32290717075549\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507185196\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.322893759710414\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507186035\n}, {\n    \"location\": {\n        \"lat\": 56.657465104570846,\n        \"lng\": 16.32288571308337\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507187194\n}, {\n    \"location\": {\n        \"lat\": 56.657499012485175,\n        \"lng\": 16.32288571308337\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507188074\n}, {\n    \"location\": {\n        \"lat\": 56.65751965207025,\n        \"lng\": 16.322866937620265\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507189094\n}, {\n    \"location\": {\n        \"lat\": 56.65755208568114,\n        \"lng\": 16.32286425541125\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507190804\n}, {\n    \"location\": {\n        \"lat\": 56.65758304501093,\n        \"lng\": 16.32283206890307\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507192289\n}, {\n    \"location\": {\n        \"lat\": 56.65760810730692,\n        \"lng\": 16.322818657857997\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507193782\n}, {\n    \"location\": {\n        \"lat\": 56.65763759233967,\n        \"lng\": 16.322813293439967\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507195194\n}, {\n    \"location\": {\n        \"lat\": 56.65765970609911,\n        \"lng\": 16.32278647134982\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507196788\n}, {\n    \"location\": {\n        \"lat\": 56.657687716842446,\n        \"lng\": 16.32285889099322\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507198372\n}, {\n    \"location\": {\n        \"lat\": 56.65769213958951,\n        \"lng\": 16.322939357263667\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507199950\n}, {\n    \"location\": {\n        \"lat\": 56.657693613838404,\n        \"lng\": 16.32300104807101\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507201551\n}, {\n    \"location\": {\n        \"lat\": 56.65769508808725,\n        \"lng\": 16.323014459116084\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507203210\n}, {\n    \"location\": {\n        \"lat\": 56.65771425331694,\n        \"lng\": 16.323086878759486\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507204687\n}, {\n    \"location\": {\n        \"lat\": 56.657708356324214,\n        \"lng\": 16.323145887357814\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507206222\n}, {\n    \"location\": {\n        \"lat\": 56.657708356324214,\n        \"lng\": 16.323199531538112\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507207762\n}, {\n    \"location\": {\n        \"lat\": 56.65770688207591,\n        \"lng\": 16.32325317571841\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507209614\n}, {\n    \"location\": {\n        \"lat\": 56.657687716842446,\n        \"lng\": 16.323322913152797\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507236459\n}, {\n    \"location\": {\n        \"lat\": 56.657687716842446,\n        \"lng\": 16.323328277570827\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507238543\n}, {\n    \"location\": {\n        \"lat\": 56.657668551599244,\n        \"lng\": 16.323419472677333\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507239422\n}, {\n    \"location\": {\n        \"lat\": 56.65765970609911,\n        \"lng\": 16.32340069721423\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507241280\n}, {\n    \"location\": {\n        \"lat\": 56.65762137557452,\n        \"lng\": 16.323459705812557\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507242757\n}, {\n    \"location\": {\n        \"lat\": 56.6576095815591,\n        \"lng\": 16.323497256738765\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507244217\n}, {\n    \"location\": {\n        \"lat\": 56.65757272523715,\n        \"lng\": 16.323513349992854\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507245835\n}, {\n    \"location\": {\n        \"lat\": 56.657544714408374,\n        \"lng\": 16.3235213966199\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507247420\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.32353212545596\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507249057\n}, {\n    \"location\": {\n        \"lat\": 56.657488692688396,\n        \"lng\": 16.323545536501033\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507250670\n}, {\n    \"location\": {\n        \"lat\": 56.657469527344006,\n        \"lng\": 16.32354285429202\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507252331\n}, {\n    \"location\": {\n        \"lat\": 56.657442990697234,\n        \"lng\": 16.32354285429202\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507254000\n}, {\n    \"location\": {\n        \"lat\": 56.65741055699251,\n        \"lng\": 16.323534807664974\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507255574\n}, {\n    \"location\": {\n        \"lat\": 56.657386968826096,\n        \"lng\": 16.323529443246944\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507257198\n}, {\n    \"location\": {\n        \"lat\": 56.65736190638308,\n        \"lng\": 16.32350530336581\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507259520\n}, {\n    \"location\": {\n        \"lat\": 56.65735306081098,\n        \"lng\": 16.32346238802157\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507261065\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.323376557333095\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507262216\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.32334705303393\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507263870\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.323277315599544\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507265154\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.32320489595614\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507266296\n}, {\n    \"location\": {\n        \"lat\": 56.6573368439234,\n        \"lng\": 16.323140522939784\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507267703\n}, {\n    \"location\": {\n        \"lat\": 56.657339792448965,\n        \"lng\": 16.323065421087367\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507268850\n}, {\n    \"location\": {\n        \"lat\": 56.657339792448965,\n        \"lng\": 16.323057374460323\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507270125\n}, {\n    \"location\": {\n        \"lat\": 56.657345689499316,\n        \"lng\": 16.32302787016116\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507271348\n}, {\n    \"location\": {\n        \"lat\": 56.65738402030423,\n        \"lng\": 16.323070785505397\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507272810\n}, {\n    \"location\": {\n        \"lat\": 56.65738549456519,\n        \"lng\": 16.323186120493038\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507274340\n}, {\n    \"location\": {\n        \"lat\": 56.6573884430869,\n        \"lng\": 16.323304137689693\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507276467\n}, {\n    \"location\": {\n        \"lat\": 56.657382546043245,\n        \"lng\": 16.323355099660976\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507278202\n}, {\n    \"location\": {\n        \"lat\": 56.657409082732535,\n        \"lng\": 16.323419472677333\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507279920\n}, {\n    \"location\": {\n        \"lat\": 56.65743267088514,\n        \"lng\": 16.323440930349452\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507281630\n}, {\n    \"location\": {\n        \"lat\": 56.6574503619899,\n        \"lng\": 16.3234677524396\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507283352\n}, {\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.323454341394527\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507284589\n}, {\n    \"location\": {\n        \"lat\": 56.657494589715476,\n        \"lng\": 16.32345702360354\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507285838\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.323435565931423\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507287188\n}, {\n    \"location\": {\n        \"lat\": 56.65755355993551,\n        \"lng\": 16.323438248140437\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507288643\n}, {\n    \"location\": {\n        \"lat\": 56.657590416276186,\n        \"lng\": 16.3233953327962\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507291201\n}, {\n    \"location\": {\n        \"lat\": 56.65760810730692,\n        \"lng\": 16.32335778186999\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507292897\n}, {\n    \"location\": {\n        \"lat\": 56.65762874683227,\n        \"lng\": 16.323309502107723\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507295176\n}, {\n    \"location\": {\n        \"lat\": 56.6576420150926,\n        \"lng\": 16.32327463339053\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507296458\n}, {\n    \"location\": {\n        \"lat\": 56.657644963594265,\n        \"lng\": 16.323186120493038\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507298262\n}, {\n    \"location\": {\n        \"lat\": 56.657646437845024,\n        \"lng\": 16.32311101864062\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507300106\n}, {\n    \"location\": {\n        \"lat\": 56.657644963594265,\n        \"lng\": 16.323076149923427\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507301222\n}, {\n    \"location\": {\n        \"lat\": 56.657639066590725,\n        \"lng\": 16.323009094698055\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507302758\n}, {\n    \"location\": {\n        \"lat\": 56.65763169533499,\n        \"lng\": 16.322971543771846\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507303793\n}, {\n    \"location\": {\n        \"lat\": 56.6576199013228,\n        \"lng\": 16.322928628427608\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507305308\n}, {\n    \"location\": {\n        \"lat\": 56.657606633054684,\n        \"lng\": 16.32291253517352\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507306921\n}, {\n    \"location\": {\n        \"lat\": 56.65755945695243,\n        \"lng\": 16.322966179353816\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507308416\n}, {\n    \"location\": {\n        \"lat\": 56.65751228079117,\n        \"lng\": 16.322987637025935\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507309934\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.32300104807101\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507311438\n}, {\n    \"location\": {\n        \"lat\": 56.6574503619899,\n        \"lng\": 16.32303323457919\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507312998\n}, {\n    \"location\": {\n        \"lat\": 56.65745331050656,\n        \"lng\": 16.323019823534114\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507314788\n}, {\n    \"location\": {\n        \"lat\": 56.65743856792097,\n        \"lng\": 16.3230171413251\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507316162\n}, {\n    \"location\": {\n        \"lat\": 56.657431196626014,\n        \"lng\": 16.323108336431606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507317789\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.323194167120082\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507319408\n}, {\n    \"location\": {\n        \"lat\": 56.657445939214476,\n        \"lng\": 16.323266586763484\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507320465\n}, {\n    \"location\": {\n        \"lat\": 56.657466578828625,\n        \"lng\": 16.323322913152797\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507321396\n}, {\n    \"location\": {\n        \"lat\": 56.65750785802302,\n        \"lng\": 16.32333095977984\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507322571\n}, {\n    \"location\": {\n        \"lat\": 56.65754324015365,\n        \"lng\": 16.323314866525752\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507323742\n}, {\n    \"location\": {\n        \"lat\": 56.65757567374425,\n        \"lng\": 16.32326390455447\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507324763\n}, {\n    \"location\": {\n        \"lat\": 56.65758599351723,\n        \"lng\": 16.323194167120082\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507325911\n}, {\n    \"location\": {\n        \"lat\": 56.657580096504425,\n        \"lng\": 16.32310565422259\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507327446\n}, {\n    \"location\": {\n        \"lat\": 56.65756535396844,\n        \"lng\": 16.32308419655047\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507328668\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.323065421087367\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507329758\n}, {\n    \"location\": {\n        \"lat\": 56.65748721843146,\n        \"lng\": 16.32309492538653\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507331356\n}, {\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.323191484911067\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507332475\n}, {\n    \"location\": {\n        \"lat\": 56.657509332279126,\n        \"lng\": 16.323239764673335\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507334188\n}, {\n    \"location\": {\n        \"lat\": 56.65752112632591,\n        \"lng\": 16.32321026037417\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507335384\n}, {\n    \"location\": {\n        \"lat\": 56.65754324015365,\n        \"lng\": 16.323151251775844\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507336749\n}, {\n    \"location\": {\n        \"lat\": 56.65754176589888,\n        \"lng\": 16.32323171804629\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507339574\n}, {\n    \"location\": {\n        \"lat\": 56.65754618866303,\n        \"lng\": 16.323161980611903\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507342359\n}, {\n    \"location\": {\n        \"lat\": 56.657549137172204,\n        \"lng\": 16.323250493509395\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507344228\n}, {\n    \"location\": {\n        \"lat\": 56.65756093120652,\n        \"lng\": 16.323301455480678\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507345621\n}, {\n    \"location\": {\n        \"lat\": 56.65757714799769,\n        \"lng\": 16.32335241745196\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507346915\n}, {\n    \"location\": {\n        \"lat\": 56.65759926179259,\n        \"lng\": 16.323414108259303\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507348051\n}, {\n    \"location\": {\n        \"lat\": 56.65762137557452,\n        \"lng\": 16.32347848127566\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507349183\n}, {\n    \"location\": {\n        \"lat\": 56.65763611808858,\n        \"lng\": 16.323534807664974\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507350159\n}, {\n    \"location\": {\n        \"lat\": 56.657656757598616,\n        \"lng\": 16.3235938162633\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507351473\n}, {\n    \"location\": {\n        \"lat\": 56.65767002584909,\n        \"lng\": 16.32362063835345\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507352401\n}, {\n    \"location\": {\n        \"lat\": 56.65768034559622,\n        \"lng\": 16.323687693578822\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507353837\n}, {\n    \"location\": {\n        \"lat\": 56.65768181984558,\n        \"lng\": 16.32374670217715\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507354822\n}, {\n    \"location\": {\n        \"lat\": 56.65768329409489,\n        \"lng\": 16.323813757402522\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507356490\n}]";
var one_coordinates = "[{\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.323191484911067\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507332475\n}]";
var dataset_1 = JSON.parse(cords_full);
var searchRadiusButton = document.getElementById('searchRadius');
var arr = [];
var map, googleMaps, heatmap, coordinates;
var radius = 50; // const page = await import('./calculatePolygons')

var covertToGoogleMapsCords = function covertToGoogleMapsCords(data) {
  return data.map(function (cord) {
    return {
      location: new window.google.maps.LatLng({
        lat: cord.location.lat,
        lng: cord.location.lng
      }),
      weight: cord.weight
    };
  });
};
/* 
Create map when DOM is loaded.
Set up listener for adding new posotions to heatmap layer.
*/


var initMap = function _initMap() {
  document.addEventListener('DOMContentLoaded', function () {
    var mapElement = document.getElementById('map');
    loadGoogleMapsApi({
      key: "AIzaSyDVxL_-voEagurltC-HoSJk9WvgFMmkTAU",
      libraries: ['visualization']
    }).then(function (google) {
      googleMaps = google;
      map = new googleMaps.Map(mapElement, {
        center: {
          lat: 56.657081713112085,
          lng: 16.321899075213206
        },
        zoom: 19,
        mapTypeId: 'satellite'
      });
      dataset_1 = calculateWeight(dataset_1);
      createPolygonLayer(dataset_1);
      coordinates = covertToGoogleMapsCords(dataset_1); //createHeatmapLayer(coordinates)
      // createOverlayView()

      writePositionsToJSONByClick();
    });
  });
};

var calculateWeight = function calculateWeight(stdCoordinates) {
  var crds = JSON.parse(JSON.stringify(stdCoordinates));
  crds.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });

  if (crds.length > 1) {
    var diff = crds[crds.length - 1].timestamp - crds[0].timestamp;
    var i = 1;
    crds.forEach(function (element) {
      var percent = (element.timestamp - crds[0].timestamp) / diff * 100;
      element.weight = parseFloat(percent.toFixed(1)) + 1;
    });
  }

  return crds;
}; // const createOverlayView = () => {
//   var overlay;
//   USGSOverlay.prototype = new window.google.maps.OverlayView();
//   var bounds = new window.google.maps.LatLngBounds(
//     new window.google.maps.LatLng(56.65762137557452, 16.32347848127566),
//     new window.google.maps.LatLng(56.65768329409489, 16.323813757402522));
//   var srcImage = 'https://developers.google.com/maps/documentation/' +
//     'javascript/examples/full/images/talkeetna.png';
//   overlay = new USGSOverlay(bounds, srcImage, map);
//   /* 
//   Create Overlay-layer 
//   TODO: add canvas to the overlay. 
//   */
//   function USGSOverlay(bounds, image, map) {
//     this.bounds_ = bounds;
//     this.image_ = image;
//     this.map_ = map;
//     this.div_ = null;
//     this.setMap(map);
//   }
//   /**
//    * onAdd is called when the map's panes are ready and the overlay has been
//    * added to the map.
//    */
//   USGSOverlay.prototype.onAdd = function () {
//     var div = document.createElement('div');
//     div.style.borderStyle = 'none';
//     div.style.borderWidth = '0px';
//     div.style.position = 'absolute';
//     // Create the img element and attach it to the div.
//     var img = document.createElement('img');
//     img.src = this.image_;
//     img.style.width = '100%';
//     img.style.height = '100%';
//     img.style.position = 'absolute';
//     div.appendChild(img);
//     this.div_ = div;
//     // Add the element to the "overlayLayer" pane.
//     var panes = this.getPanes();
//     panes.overlayLayer.appendChild(div);
//   };
//   USGSOverlay.prototype.draw = function () {
//     // We use the south-west and north-east
//     // coordinates of the overlay to peg it to the correct position and size.
//     // To do this, we need to retrieve the projection from the overlay.
//     var overlayProjection = this.getProjection();
//     // Retrieve the south-west and north-east coordinates of this overlay
//     // in LatLngs and convert them to pixel coordinates.
//     // We'll use these coordinates to resize the div.
//     var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
//     var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
//     // Resize the image's div to fit the indicated dimensions.
//     var div = this.div_;
//     div.style.left = sw.x + 'px';
//     div.style.top = ne.y + 'px';
//     div.style.width = (ne.x - sw.x) + 'px';
//     div.style.height = (sw.y - ne.y) + 'px';
//   };
//   // The onRemove() method will be called automatically from the API if
//   // we ever set the overlay's map property to 'null'.
//   USGSOverlay.prototype.onRemove = function () {
//     this.div_.parentNode.removeChild(this.div_);
//     this.div_ = null;
//   };
// }

/* 
Create Polygon with based on the given parameters. 
*/


var creatPolygon = function creatPolygon(coordinates, sColor, sOpacity, weight, fColor, fOpacity) {
  var polygonLayer = new google.maps.Polygon({
    paths: coordinates,
    strokeColor: sColor,
    strokeOpacity: sOpacity,
    strokeWeight: weight,
    fillColor: fColor,
    fillOpacity: fOpacity,
    draggable: false
  });
  return polygonLayer;
};
/* 
Uses creatPolygon() to creates a new separate polygon for every array returned by polygons() method. 
*/


var createPolygonLayer = function createPolygonLayer(coordinates) {
  var allCords = polygons(coordinates, 4)['10:00-10:59'];
  allCords.forEach(function (cordsArray) {
    console.log(cordsArray);
    var polygon = creatPolygon(cordsArray, 'rgba(0, 0, 255, 1)', 1.2, 2, 'rgba(255, 0, 0, 1)', .55);
    polygon.setMap(map);
  });
};
/* 
Create Heatmap-layer with coordinates array. 
*/


var createHeatmapLayer = function createHeatmapLayer(coordinates) {
  heatmap = new googleMaps.visualization.HeatmapLayer({
    data: coordinates
  });
  heatmap.setMap(map);
  heatmap.set('radius', heatmap.get('radius') ? radius : radius);
  var gradient = ['rgba(0, 0, 255, 0)', 'rgba(0, 0, 255, 1)', 'rgba(55, 0, 200, 1)', 'rgba(125, 0, 120, 1)', 'rgba(200, 0, 55, 1)', 'rgba(255, 0, 0, 1)'];
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
};

var changeRadius = function changeRadius() {
  searchRadiusButton.addEventListener('click', function () {
    var inputValue = document.querySelector('.input').value;

    if (inputValue <= 100 && inputValue > 0) {
      radius = inputValue;
      heatmap.set('radius', heatmap.get('radius') ? radius : radius);
    }
  });
};
/* 
Appends the "click-positions" longiture & latitude to the coordinates array.
*/


var writePositionsToJSONByClick = function writePositionsToJSONByClick() {
  googleMaps.event.addListener(map, 'click', function (event) {
    arr.push({
      location: new window.google.maps.LatLng({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }),
      weight: 1,
      timestamp: Date.now()
    });
    heatmap.setMap(null);
    var data = calculateWeight(arr);
    var coordinates = covertToGoogleMapsCords(data);
    createHeatmapLayer(coordinates);
  });
};

initMap();
changeRadius();
},{"dotenv":"node_modules/dotenv/lib/main.js","load-google-maps-api":"node_modules/load-google-maps-api/index.js","fs":"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/_empty.js","./calculatePolygons":"calculatePolygons.js"}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53099" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map