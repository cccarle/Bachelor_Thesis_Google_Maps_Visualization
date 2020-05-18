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
},{}],"node_modules/quickselect/quickselect.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.quickselect = factory());
}(this, (function () { 'use strict';

function quickselect(arr, k, left, right, compare) {
    quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
}

function quickselectStep(arr, k, left, right, compare) {

    while (right > left) {
        if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            quickselectStep(arr, k, newLeft, newRight, compare);
        }

        var t = arr[k];
        var i = left;
        var j = right;

        swap(arr, left, k);
        if (compare(arr[right], t) > 0) swap(arr, left, right);

        while (i < j) {
            swap(arr, i, j);
            i++;
            j--;
            while (compare(arr[i], t) < 0) i++;
            while (compare(arr[j], t) > 0) j--;
        }

        if (compare(arr[left], t) === 0) swap(arr, left, j);
        else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

return quickselect;

})));

},{}],"node_modules/rbush/index.js":[function(require,module,exports) {
'use strict';

module.exports = rbush;
module.exports.default = rbush;

var quickselect = require('quickselect');

function rbush(maxEntries, format) {
    if (!(this instanceof rbush)) return new rbush(maxEntries, format);

    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries || 9);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

    if (format) {
        this._initFormat(format);
    }

    this.clear();
}

rbush.prototype = {

    all: function () {
        return this._all(this.data, []);
    },

    search: function (bbox) {

        var node = this.data,
            result = [],
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return result;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf) result.push(child);
                    else if (contains(bbox, childBBox)) this._all(child, result);
                    else nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return result;
    },

    collides: function (bbox) {

        var node = this.data,
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return false;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf || contains(bbox, childBBox)) return true;
                    nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return false;
    },

    load: function (data) {
        if (!(data && data.length)) return this;

        if (data.length < this._minEntries) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
            }
            return this;
        }

        // recursively build the tree with the given data from scratch using OMT algorithm
        var node = this._build(data.slice(), 0, data.length - 1, 0);

        if (!this.data.children.length) {
            // save as is if tree is empty
            this.data = node;

        } else if (this.data.height === node.height) {
            // split root if trees have the same height
            this._splitRoot(this.data, node);

        } else {
            if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
            }

            // insert the small tree into the large tree at appropriate level
            this._insert(node, this.data.height - node.height - 1, true);
        }

        return this;
    },

    insert: function (item) {
        if (item) this._insert(item, this.data.height - 1);
        return this;
    },

    clear: function () {
        this.data = createNode([]);
        return this;
    },

    remove: function (item, equalsFn) {
        if (!item) return this;

        var node = this.data,
            bbox = this.toBBox(item),
            path = [],
            indexes = [],
            i, parent, index, goingUp;

        // depth-first iterative tree traversal
        while (node || path.length) {

            if (!node) { // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
            }

            if (node.leaf) { // check current node
                index = findItem(item, node.children, equalsFn);

                if (index !== -1) {
                    // item found, remove the item and condense tree upwards
                    node.children.splice(index, 1);
                    path.push(node);
                    this._condense(path);
                    return this;
                }
            }

            if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];

            } else if (parent) { // go right
                i++;
                node = parent.children[i];
                goingUp = false;

            } else node = null; // nothing found
        }

        return this;
    },

    toBBox: function (item) { return item; },

    compareMinX: compareNodeMinX,
    compareMinY: compareNodeMinY,

    toJSON: function () { return this.data; },

    fromJSON: function (data) {
        this.data = data;
        return this;
    },

    _all: function (node, result) {
        var nodesToSearch = [];
        while (node) {
            if (node.leaf) result.push.apply(result, node.children);
            else nodesToSearch.push.apply(nodesToSearch, node.children);

            node = nodesToSearch.pop();
        }
        return result;
    },

    _build: function (items, left, right, height) {

        var N = right - left + 1,
            M = this._maxEntries,
            node;

        if (N <= M) {
            // reached leaf level; return leaf
            node = createNode(items.slice(left, right + 1));
            calcBBox(node, this.toBBox);
            return node;
        }

        if (!height) {
            // target height of the bulk-loaded tree
            height = Math.ceil(Math.log(N) / Math.log(M));

            // target number of root entries to maximize storage utilization
            M = Math.ceil(N / Math.pow(M, height - 1));
        }

        node = createNode([]);
        node.leaf = false;
        node.height = height;

        // split the items into M mostly square tiles

        var N2 = Math.ceil(N / M),
            N1 = N2 * Math.ceil(Math.sqrt(M)),
            i, j, right2, right3;

        multiSelect(items, left, right, N1, this.compareMinX);

        for (i = left; i <= right; i += N1) {

            right2 = Math.min(i + N1 - 1, right);

            multiSelect(items, i, right2, N2, this.compareMinY);

            for (j = i; j <= right2; j += N2) {

                right3 = Math.min(j + N2 - 1, right2);

                // pack each entry recursively
                node.children.push(this._build(items, j, right3, height - 1));
            }
        }

        calcBBox(node, this.toBBox);

        return node;
    },

    _chooseSubtree: function (bbox, node, level, path) {

        var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

        while (true) {
            path.push(node);

            if (node.leaf || path.length - 1 === level) break;

            minArea = minEnlargement = Infinity;

            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = bboxArea(child);
                enlargement = enlargedArea(bbox, child) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                    minEnlargement = enlargement;
                    minArea = area < minArea ? area : minArea;
                    targetNode = child;

                } else if (enlargement === minEnlargement) {
                    // otherwise choose one with the smallest area
                    if (area < minArea) {
                        minArea = area;
                        targetNode = child;
                    }
                }
            }

            node = targetNode || node.children[0];
        }

        return node;
    },

    _insert: function (item, level, isNode) {

        var toBBox = this.toBBox,
            bbox = isNode ? item : toBBox(item),
            insertPath = [];

        // find the best node for accommodating the item, saving all nodes along the path too
        var node = this._chooseSubtree(bbox, this.data, level, insertPath);

        // put the item into the node
        node.children.push(item);
        extend(node, bbox);

        // split on node overflow; propagate upwards if necessary
        while (level >= 0) {
            if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
            } else break;
        }

        // adjust bboxes along the insertion path
        this._adjustParentBBoxes(bbox, insertPath, level);
    },

    // split overflowed node into two
    _split: function (insertPath, level) {

        var node = insertPath[level],
            M = node.children.length,
            m = this._minEntries;

        this._chooseSplitAxis(node, m, M);

        var splitIndex = this._chooseSplitIndex(node, m, M);

        var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
        newNode.height = node.height;
        newNode.leaf = node.leaf;

        calcBBox(node, this.toBBox);
        calcBBox(newNode, this.toBBox);

        if (level) insertPath[level - 1].children.push(newNode);
        else this._splitRoot(node, newNode);
    },

    _splitRoot: function (node, newNode) {
        // split root node
        this.data = createNode([node, newNode]);
        this.data.height = node.height + 1;
        this.data.leaf = false;
        calcBBox(this.data, this.toBBox);
    },

    _chooseSplitIndex: function (node, m, M) {

        var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

        minOverlap = minArea = Infinity;

        for (i = m; i <= M - m; i++) {
            bbox1 = distBBox(node, 0, i, this.toBBox);
            bbox2 = distBBox(node, i, M, this.toBBox);

            overlap = intersectionArea(bbox1, bbox2);
            area = bboxArea(bbox1) + bboxArea(bbox2);

            // choose distribution with minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;

            } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                    minArea = area;
                    index = i;
                }
            }
        }

        return index;
    },

    // sorts node children by the best axis for split
    _chooseSplitAxis: function (node, m, M) {

        var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
            compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
            xMargin = this._allDistMargin(node, m, M, compareMinX),
            yMargin = this._allDistMargin(node, m, M, compareMinY);

        // if total distributions margin value is minimal for x, sort by minX,
        // otherwise it's already sorted by minY
        if (xMargin < yMargin) node.children.sort(compareMinX);
    },

    // total margin of all possible split distributions where each node is at least m full
    _allDistMargin: function (node, m, M, compare) {

        node.children.sort(compare);

        var toBBox = this.toBBox,
            leftBBox = distBBox(node, 0, m, toBBox),
            rightBBox = distBBox(node, M - m, M, toBBox),
            margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
            i, child;

        for (i = m; i < M - m; i++) {
            child = node.children[i];
            extend(leftBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(leftBBox);
        }

        for (i = M - m - 1; i >= m; i--) {
            child = node.children[i];
            extend(rightBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(rightBBox);
        }

        return margin;
    },

    _adjustParentBBoxes: function (bbox, path, level) {
        // adjust bboxes along the given tree path
        for (var i = level; i >= 0; i--) {
            extend(path[i], bbox);
        }
    },

    _condense: function (path) {
        // go through the path, removing empty nodes and updating bboxes
        for (var i = path.length - 1, siblings; i >= 0; i--) {
            if (path[i].children.length === 0) {
                if (i > 0) {
                    siblings = path[i - 1].children;
                    siblings.splice(siblings.indexOf(path[i]), 1);

                } else this.clear();

            } else calcBBox(path[i], this.toBBox);
        }
    },

    _initFormat: function (format) {
        // data format (minX, minY, maxX, maxY accessors)

        // uses eval-type function compilation instead of just accepting a toBBox function
        // because the algorithms are very sensitive to sorting functions performance,
        // so they should be dead simple and without inner calls

        var compareArr = ['return a', ' - b', ';'];

        this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
        this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

        this.toBBox = new Function('a',
            'return {minX: a' + format[0] +
            ', minY: a' + format[1] +
            ', maxX: a' + format[2] +
            ', maxY: a' + format[3] + '};');
    }
};

function findItem(item, items, equalsFn) {
    if (!equalsFn) return items.indexOf(item);

    for (var i = 0; i < items.length; i++) {
        if (equalsFn(item, items[i])) return i;
    }
    return -1;
}

// calculate node's bbox from bboxes of its children
function calcBBox(node, toBBox) {
    distBBox(node, 0, node.children.length, toBBox, node);
}

// min bounding rectangle of node children from k to p-1
function distBBox(node, k, p, toBBox, destNode) {
    if (!destNode) destNode = createNode(null);
    destNode.minX = Infinity;
    destNode.minY = Infinity;
    destNode.maxX = -Infinity;
    destNode.maxY = -Infinity;

    for (var i = k, child; i < p; i++) {
        child = node.children[i];
        extend(destNode, node.leaf ? toBBox(child) : child);
    }

    return destNode;
}

function extend(a, b) {
    a.minX = Math.min(a.minX, b.minX);
    a.minY = Math.min(a.minY, b.minY);
    a.maxX = Math.max(a.maxX, b.maxX);
    a.maxY = Math.max(a.maxY, b.maxY);
    return a;
}

function compareNodeMinX(a, b) { return a.minX - b.minX; }
function compareNodeMinY(a, b) { return a.minY - b.minY; }

function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

function enlargedArea(a, b) {
    return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
           (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}

function intersectionArea(a, b) {
    var minX = Math.max(a.minX, b.minX),
        minY = Math.max(a.minY, b.minY),
        maxX = Math.min(a.maxX, b.maxX),
        maxY = Math.min(a.maxY, b.maxY);

    return Math.max(0, maxX - minX) *
           Math.max(0, maxY - minY);
}

function contains(a, b) {
    return a.minX <= b.minX &&
           a.minY <= b.minY &&
           b.maxX <= a.maxX &&
           b.maxY <= a.maxY;
}

function intersects(a, b) {
    return b.minX <= a.maxX &&
           b.minY <= a.maxY &&
           b.maxX >= a.minX &&
           b.maxY >= a.minY;
}

function createNode(children) {
    return {
        children: children,
        height: 1,
        leaf: true,
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity
    };
}

// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
// combines selection algorithm with binary divide & conquer approach

function multiSelect(arr, left, right, n, compare) {
    var stack = [left, right],
        mid;

    while (stack.length) {
        right = stack.pop();
        left = stack.pop();

        if (right - left <= n) continue;

        mid = left + Math.ceil((right - left) / n / 2) * n;
        quickselect(arr, mid, left, right, compare);

        stack.push(left, mid, mid, right);
    }
}

},{"quickselect":"node_modules/quickselect/quickselect.js"}],"node_modules/two-product/two-product.js":[function(require,module,exports) {
"use strict"

module.exports = twoProduct

var SPLITTER = +(Math.pow(2, 27) + 1.0)

function twoProduct(a, b, result) {
  var x = a * b

  var c = SPLITTER * a
  var abig = c - a
  var ahi = c - abig
  var alo = a - ahi

  var d = SPLITTER * b
  var bbig = d - b
  var bhi = d - bbig
  var blo = b - bhi

  var err1 = x - (ahi * bhi)
  var err2 = err1 - (alo * bhi)
  var err3 = err2 - (ahi * blo)

  var y = alo * blo - err3

  if(result) {
    result[0] = y
    result[1] = x
    return result
  }

  return [ y, x ]
}
},{}],"node_modules/robust-sum/robust-sum.js":[function(require,module,exports) {
"use strict"

module.exports = linearExpansionSum

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function linearExpansionSum(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],"node_modules/two-sum/two-sum.js":[function(require,module,exports) {
"use strict"

module.exports = fastTwoSum

function fastTwoSum(a, b, result) {
	var x = a + b
	var bv = x - a
	var av = x - bv
	var br = b - bv
	var ar = a - av
	if(result) {
		result[0] = ar + br
		result[1] = x
		return result
	}
	return [ar+br, x]
}
},{}],"node_modules/robust-scale/robust-scale.js":[function(require,module,exports) {
"use strict"

var twoProduct = require("two-product")
var twoSum = require("two-sum")

module.exports = scaleLinearExpansion

function scaleLinearExpansion(e, scale) {
  var n = e.length
  if(n === 1) {
    var ts = twoProduct(e[0], scale)
    if(ts[0]) {
      return ts
    }
    return [ ts[1] ]
  }
  var g = new Array(2 * n)
  var q = [0.1, 0.1]
  var t = [0.1, 0.1]
  var count = 0
  twoProduct(e[0], scale, q)
  if(q[0]) {
    g[count++] = q[0]
  }
  for(var i=1; i<n; ++i) {
    twoProduct(e[i], scale, t)
    var pq = q[1]
    twoSum(pq, t[0], q)
    if(q[0]) {
      g[count++] = q[0]
    }
    var a = t[1]
    var b = q[1]
    var x = a + b
    var bv = x - a
    var y = b - bv
    q[1] = x
    if(y) {
      g[count++] = y
    }
  }
  if(q[1]) {
    g[count++] = q[1]
  }
  if(count === 0) {
    g[count++] = 0.0
  }
  g.length = count
  return g
}
},{"two-product":"node_modules/two-product/two-product.js","two-sum":"node_modules/two-sum/two-sum.js"}],"node_modules/robust-subtract/robust-diff.js":[function(require,module,exports) {
"use strict"

module.exports = robustSubtract

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function robustSubtract(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], -f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = -f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = -f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],"node_modules/robust-orientation/orientation.js":[function(require,module,exports) {
"use strict"

var twoProduct = require("two-product")
var robustSum = require("robust-sum")
var robustScale = require("robust-scale")
var robustSubtract = require("robust-subtract")

var NUM_EXPAND = 5

var EPSILON     = 1.1102230246251565e-16
var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON
var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON

function cofactor(m, c) {
  var result = new Array(m.length-1)
  for(var i=1; i<m.length; ++i) {
    var r = result[i-1] = new Array(m.length-1)
    for(var j=0,k=0; j<m.length; ++j) {
      if(j === c) {
        continue
      }
      r[k++] = m[i][j]
    }
  }
  return result
}

function matrix(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = new Array(n)
    for(var j=0; j<n; ++j) {
      result[i][j] = ["m", j, "[", (n-i-1), "]"].join("")
    }
  }
  return result
}

function sign(n) {
  if(n & 1) {
    return "-"
  }
  return ""
}

function generateSum(expr) {
  if(expr.length === 1) {
    return expr[0]
  } else if(expr.length === 2) {
    return ["sum(", expr[0], ",", expr[1], ")"].join("")
  } else {
    var m = expr.length>>1
    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
  }
}

function determinant(m) {
  if(m.length === 2) {
    return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
  } else {
    var expr = []
    for(var i=0; i<m.length; ++i) {
      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""))
    }
    return expr
  }
}

function orientation(n) {
  var pos = []
  var neg = []
  var m = matrix(n)
  var args = []
  for(var i=0; i<n; ++i) {
    if((i&1)===0) {
      pos.push.apply(pos, determinant(cofactor(m, i)))
    } else {
      neg.push.apply(neg, determinant(cofactor(m, i)))
    }
    args.push("m" + i)
  }
  var posExpr = generateSum(pos)
  var negExpr = generateSum(neg)
  var funcName = "orientation" + n + "Exact"
  var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("")
  var proc = new Function("sum", "prod", "scale", "sub", code)
  return proc(robustSum, twoProduct, robustScale, robustSubtract)
}

var orientation3Exact = orientation(3)
var orientation4Exact = orientation(4)

var CACHED = [
  function orientation0() { return 0 },
  function orientation1() { return 0 },
  function orientation2(a, b) { 
    return b[0] - a[0]
  },
  function orientation3(a, b, c) {
    var l = (a[1] - c[1]) * (b[0] - c[0])
    var r = (a[0] - c[0]) * (b[1] - c[1])
    var det = l - r
    var s
    if(l > 0) {
      if(r <= 0) {
        return det
      } else {
        s = l + r
      }
    } else if(l < 0) {
      if(r >= 0) {
        return det
      } else {
        s = -(l + r)
      }
    } else {
      return det
    }
    var tol = ERRBOUND3 * s
    if(det >= tol || det <= -tol) {
      return det
    }
    return orientation3Exact(a, b, c)
  },
  function orientation4(a,b,c,d) {
    var adx = a[0] - d[0]
    var bdx = b[0] - d[0]
    var cdx = c[0] - d[0]
    var ady = a[1] - d[1]
    var bdy = b[1] - d[1]
    var cdy = c[1] - d[1]
    var adz = a[2] - d[2]
    var bdz = b[2] - d[2]
    var cdz = c[2] - d[2]
    var bdxcdy = bdx * cdy
    var cdxbdy = cdx * bdy
    var cdxady = cdx * ady
    var adxcdy = adx * cdy
    var adxbdy = adx * bdy
    var bdxady = bdx * ady
    var det = adz * (bdxcdy - cdxbdy) 
            + bdz * (cdxady - adxcdy)
            + cdz * (adxbdy - bdxady)
    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz)
    var tol = ERRBOUND4 * permanent
    if ((det > tol) || (-det > tol)) {
      return det
    }
    return orientation4Exact(a,b,c,d)
  }
]

function slowOrient(args) {
  var proc = CACHED[args.length]
  if(!proc) {
    proc = CACHED[args.length] = orientation(args.length)
  }
  return proc.apply(undefined, args)
}

function generateOrientationProc() {
  while(CACHED.length <= NUM_EXPAND) {
    CACHED.push(orientation(CACHED.length))
  }
  var args = []
  var procArgs = ["slow"]
  for(var i=0; i<=NUM_EXPAND; ++i) {
    args.push("a" + i)
    procArgs.push("o" + i)
  }
  var code = [
    "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
  ]
  for(var i=2; i<=NUM_EXPAND; ++i) {
    code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");")
  }
  code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation")
  procArgs.push(code.join(""))

  var proc = Function.apply(undefined, procArgs)
  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED))
  for(var i=0; i<=NUM_EXPAND; ++i) {
    module.exports[i] = CACHED[i]
  }
}

generateOrientationProc()
},{"two-product":"node_modules/two-product/two-product.js","robust-sum":"node_modules/robust-sum/robust-sum.js","robust-scale":"node_modules/robust-scale/robust-scale.js","robust-subtract":"node_modules/robust-subtract/robust-diff.js"}],"node_modules/monotone-convex-hull-2d/index.js":[function(require,module,exports) {
'use strict'

module.exports = monotoneConvexHull2D

var orient = require('robust-orientation')[3]

function monotoneConvexHull2D(points) {
  var n = points.length

  if(n < 3) {
    var result = new Array(n)
    for(var i=0; i<n; ++i) {
      result[i] = i
    }

    if(n === 2 &&
       points[0][0] === points[1][0] &&
       points[0][1] === points[1][1]) {
      return [0]
    }

    return result
  }

  //Sort point indices along x-axis
  var sorted = new Array(n)
  for(var i=0; i<n; ++i) {
    sorted[i] = i
  }
  sorted.sort(function(a,b) {
    var d = points[a][0]-points[b][0]
    if(d) {
      return d
    }
    return points[a][1] - points[b][1]
  })

  //Construct upper and lower hulls
  var lower = [sorted[0], sorted[1]]
  var upper = [sorted[0], sorted[1]]

  for(var i=2; i<n; ++i) {
    var idx = sorted[i]
    var p   = points[idx]

    //Insert into lower list
    var m = lower.length
    while(m > 1 && orient(
        points[lower[m-2]], 
        points[lower[m-1]], 
        p) <= 0) {
      m -= 1
      lower.pop()
    }
    lower.push(idx)

    //Insert into upper list
    m = upper.length
    while(m > 1 && orient(
        points[upper[m-2]], 
        points[upper[m-1]], 
        p) >= 0) {
      m -= 1
      upper.pop()
    }
    upper.push(idx)
  }

  //Merge lists together
  var result = new Array(upper.length + lower.length - 2)
  var ptr    = 0
  for(var i=0, nl=lower.length; i<nl; ++i) {
    result[ptr++] = lower[i]
  }
  for(var j=upper.length-2; j>0; --j) {
    result[ptr++] = upper[j]
  }

  //Return result
  return result
}
},{"robust-orientation":"node_modules/robust-orientation/orientation.js"}],"node_modules/tinyqueue/index.js":[function(require,module,exports) {
'use strict';

module.exports = TinyQueue;
module.exports.default = TinyQueue;

function TinyQueue(data, compare) {
    if (!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

    this.data = data || [];
    this.length = this.data.length;
    this.compare = compare || defaultCompare;

    if (this.length > 0) {
        for (var i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
    }
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

TinyQueue.prototype = {

    push: function (item) {
        this.data.push(item);
        this.length++;
        this._up(this.length - 1);
    },

    pop: function () {
        if (this.length === 0) return undefined;

        var top = this.data[0];
        this.length--;

        if (this.length > 0) {
            this.data[0] = this.data[this.length];
            this._down(0);
        }
        this.data.pop();

        return top;
    },

    peek: function () {
        return this.data[0];
    },

    _up: function (pos) {
        var data = this.data;
        var compare = this.compare;
        var item = data[pos];

        while (pos > 0) {
            var parent = (pos - 1) >> 1;
            var current = data[parent];
            if (compare(item, current) >= 0) break;
            data[pos] = current;
            pos = parent;
        }

        data[pos] = item;
    },

    _down: function (pos) {
        var data = this.data;
        var compare = this.compare;
        var halfLength = this.length >> 1;
        var item = data[pos];

        while (pos < halfLength) {
            var left = (pos << 1) + 1;
            var right = left + 1;
            var best = data[left];

            if (right < this.length && compare(data[right], best) < 0) {
                left = right;
                best = data[right];
            }
            if (compare(best, item) >= 0) break;

            data[pos] = best;
            pos = left;
        }

        data[pos] = item;
    }
};

},{}],"node_modules/point-in-polygon/index.js":[function(require,module,exports) {
module.exports = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

},{}],"node_modules/concaveman/index.js":[function(require,module,exports) {
'use strict';

var rbush = require('rbush');
var convexHull = require('monotone-convex-hull-2d');
var Queue = require('tinyqueue');
var pointInPolygon = require('point-in-polygon');
var orient = require('robust-orientation')[3];

module.exports = concaveman;
module.exports.default = concaveman;

function concaveman(points, concavity, lengthThreshold) {
    // a relative measure of concavity; higher value means simpler hull
    concavity = Math.max(0, concavity === undefined ? 2 : concavity);

    // when a segment goes below this length threshold, it won't be drilled down further
    lengthThreshold = lengthThreshold || 0;

    // start with a convex hull of the points
    var hull = fastConvexHull(points);

    // index the points with an R-tree
    var tree = rbush(16, ['[0]', '[1]', '[0]', '[1]']).load(points);

    // turn the convex hull into a linked list and populate the initial edge queue with the nodes
    var queue = [];
    for (var i = 0, last; i < hull.length; i++) {
        var p = hull[i];
        tree.remove(p);
        last = insertNode(p, last);
        queue.push(last);
    }

    // index the segments with an R-tree (for intersection checks)
    var segTree = rbush(16);
    for (i = 0; i < queue.length; i++) segTree.insert(updateBBox(queue[i]));

    var sqConcavity = concavity * concavity;
    var sqLenThreshold = lengthThreshold * lengthThreshold;

    // process edges one by one
    while (queue.length) {
        var node = queue.shift();
        var a = node.p;
        var b = node.next.p;

        // skip the edge if it's already short enough
        var sqLen = getSqDist(a, b);
        if (sqLen < sqLenThreshold) continue;

        var maxSqLen = sqLen / sqConcavity;

        // find the best connection point for the current edge to flex inward to
        p = findCandidate(tree, node.prev.p, a, b, node.next.next.p, maxSqLen, segTree);

        // if we found a connection and it satisfies our concavity measure
        if (p && Math.min(getSqDist(p, a), getSqDist(p, b)) <= maxSqLen) {
            // connect the edge endpoints through this point and add 2 new edges to the queue
            queue.push(node);
            queue.push(insertNode(p, node));

            // update point and segment indexes
            tree.remove(p);
            segTree.remove(node);
            segTree.insert(updateBBox(node));
            segTree.insert(updateBBox(node.next));
        }
    }

    // convert the resulting hull linked list to an array of points
    node = last;
    var concave = [];
    do {
        concave.push(node.p);
        node = node.next;
    } while (node !== last);

    concave.push(node.p);

    return concave;
}

function findCandidate(tree, a, b, c, d, maxDist, segTree) {
    var queue = new Queue(null, compareDist);
    var node = tree.data;

    // search through the point R-tree with a depth-first search using a priority queue
    // in the order of distance to the edge (b, c)
    while (node) {
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];

            var dist = node.leaf ? sqSegDist(child, b, c) : sqSegBoxDist(b, c, child);
            if (dist > maxDist) continue; // skip the node if it's farther than we ever need

            queue.push({
                node: child,
                dist: dist
            });
        }

        while (queue.length && !queue.peek().node.children) {
            var item = queue.pop();
            var p = item.node;

            // skip all points that are as close to adjacent edges (a,b) and (c,d),
            // and points that would introduce self-intersections when connected
            var d0 = sqSegDist(p, a, b);
            var d1 = sqSegDist(p, c, d);
            if (item.dist < d0 && item.dist < d1 &&
                noIntersections(b, p, segTree) &&
                noIntersections(c, p, segTree)) return p;
        }

        node = queue.pop();
        if (node) node = node.node;
    }

    return null;
}

function compareDist(a, b) {
    return a.dist - b.dist;
}

// square distance from a segment bounding box to the given one
function sqSegBoxDist(a, b, bbox) {
    if (inside(a, bbox) || inside(b, bbox)) return 0;
    var d1 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.maxX, bbox.minY);
    if (d1 === 0) return 0;
    var d2 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.minX, bbox.maxY);
    if (d2 === 0) return 0;
    var d3 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.maxX, bbox.minY, bbox.maxX, bbox.maxY);
    if (d3 === 0) return 0;
    var d4 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.maxY, bbox.maxX, bbox.maxY);
    if (d4 === 0) return 0;
    return Math.min(d1, d2, d3, d4);
}

function inside(a, bbox) {
    return a[0] >= bbox.minX &&
           a[0] <= bbox.maxX &&
           a[1] >= bbox.minY &&
           a[1] <= bbox.maxY;
}

// check if the edge (a,b) doesn't intersect any other edges
function noIntersections(a, b, segTree) {
    var minX = Math.min(a[0], b[0]);
    var minY = Math.min(a[1], b[1]);
    var maxX = Math.max(a[0], b[0]);
    var maxY = Math.max(a[1], b[1]);

    var edges = segTree.search({minX: minX, minY: minY, maxX: maxX, maxY: maxY});
    for (var i = 0; i < edges.length; i++) {
        if (intersects(edges[i].p, edges[i].next.p, a, b)) return false;
    }
    return true;
}

// check if the edges (p1,q1) and (p2,q2) intersect
function intersects(p1, q1, p2, q2) {
    return p1 !== q2 && q1 !== p2 &&
        orient(p1, q1, p2) > 0 !== orient(p1, q1, q2) > 0 &&
        orient(p2, q2, p1) > 0 !== orient(p2, q2, q1) > 0;
}

// update the bounding box of a node's edge
function updateBBox(node) {
    var p1 = node.p;
    var p2 = node.next.p;
    node.minX = Math.min(p1[0], p2[0]);
    node.minY = Math.min(p1[1], p2[1]);
    node.maxX = Math.max(p1[0], p2[0]);
    node.maxY = Math.max(p1[1], p2[1]);
    return node;
}

// speed up convex hull by filtering out points inside quadrilateral formed by 4 extreme points
function fastConvexHull(points) {
    var left = points[0];
    var top = points[0];
    var right = points[0];
    var bottom = points[0];

    // find the leftmost, rightmost, topmost and bottommost points
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (p[0] < left[0]) left = p;
        if (p[0] > right[0]) right = p;
        if (p[1] < top[1]) top = p;
        if (p[1] > bottom[1]) bottom = p;
    }

    // filter out points that are inside the resulting quadrilateral
    var cull = [left, top, right, bottom];
    var filtered = cull.slice();
    for (i = 0; i < points.length; i++) {
        if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
    }

    // get convex hull around the filtered points
    var indices = convexHull(filtered);

    // return the hull as array of points (rather than indices)
    var hull = [];
    for (i = 0; i < indices.length; i++) hull.push(filtered[indices[i]]);
    return hull;
}

// create a new node in a doubly linked list
function insertNode(p, prev) {
    var node = {
        p: p,
        prev: null,
        next: null,
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
    };

    if (!prev) {
        node.prev = node;
        node.next = node;

    } else {
        node.next = prev.next;
        node.prev = prev;
        prev.next.prev = node;
        prev.next = node;
    }
    return node;
}

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1[0] - p2[0],
        dy = p1[1] - p2[1];

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function sqSegDist(p, p1, p2) {

    var x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2[0];
            y = p2[1];

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return dx * dx + dy * dy;
}

// segment to segment distance, ported from http://geomalgorithms.com/a07-_distance.html by Dan Sunday
function sqSegSegDist(x0, y0, x1, y1, x2, y2, x3, y3) {
    var ux = x1 - x0;
    var uy = y1 - y0;
    var vx = x3 - x2;
    var vy = y3 - y2;
    var wx = x0 - x2;
    var wy = y0 - y2;
    var a = ux * ux + uy * uy;
    var b = ux * vx + uy * vy;
    var c = vx * vx + vy * vy;
    var d = ux * wx + uy * wy;
    var e = vx * wx + vy * wy;
    var D = a * c - b * b;

    var sc, sN, tc, tN;
    var sD = D;
    var tD = D;

    if (D === 0) {
        sN = 0;
        sD = 1;
        tN = e;
        tD = c;
    } else {
        sN = b * e - c * d;
        tN = a * e - b * d;
        if (sN < 0) {
            sN = 0;
            tN = e;
            tD = c;
        } else if (sN > sD) {
            sN = sD;
            tN = e + b;
            tD = c;
        }
    }

    if (tN < 0.0) {
        tN = 0.0;
        if (-d < 0.0) sN = 0.0;
        else if (-d > a) sN = sD;
        else {
            sN = -d;
            sD = a;
        }
    } else if (tN > tD) {
        tN = tD;
        if ((-d + b) < 0.0) sN = 0;
        else if (-d + b > a) sN = sD;
        else {
            sN = -d + b;
            sD = a;
        }
    }

    sc = sN === 0 ? 0 : sN / sD;
    tc = tN === 0 ? 0 : tN / tD;

    var cx = (1 - sc) * x0 + sc * x1;
    var cy = (1 - sc) * y0 + sc * y1;
    var cx2 = (1 - tc) * x2 + tc * x3;
    var cy2 = (1 - tc) * y2 + tc * y3;
    var dx = cx2 - cx;
    var dy = cy2 - cy;

    return dx * dx + dy * dy;
}

},{"rbush":"node_modules/rbush/index.js","monotone-convex-hull-2d":"node_modules/monotone-convex-hull-2d/index.js","tinyqueue":"node_modules/tinyqueue/index.js","point-in-polygon":"node_modules/point-in-polygon/index.js","robust-orientation":"node_modules/robust-orientation/orientation.js"}],"calculatePolygons.js":[function(require,module,exports) {
var convexhull = require('./convec_hull');

var concaveman = require('concaveman');

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
      x: c.location.lat,
      y: c.location.lng
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

function getCoordinatesInArray(coordinates) {
  var coordinatesArr = [];
  coordinates.forEach(function (c) {
    coordinatesArr.push([c.location.lat, c.location.lng]);
  });
  return coordinatesArr;
}

function getArrayCoordinatesInLatLng(coordinates) {
  var coordinatesLatLng = [];
  coordinates.forEach(function (c) {
    coordinatesLatLng.push({
      lat: c[0],
      lng: c[1]
    });
  });
  return coordinatesLatLng;
}

function calculatePolygon(coordinates) {
  // let coordinatesXY = getCoordinatesInXY(coordinates)
  var coordinatesArr = getCoordinatesInArray(coordinates); // let polygonXY = convexhull.makeHull(coordinatesXY)
  // coordinatesXY.concavity = 1
  // coordinatesXY.lengthThreshold = 1

  var polygonXY = concaveman(coordinatesArr); // let polygonLatLng = getXYCoordinatesInLatLng(polygonXY)

  var polygonLatLng = getArrayCoordinatesInLatLng(polygonXY);
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
  console.log(coordinatesByTime);
  var polygons = {};

  for (var key in coordinatesByTime) {
    polygons[key] = getPolygon(coordinatesByTime[key], allowedDistance);
  }

  return polygons;
}

module.exports = run;
},{"./convec_hull":"convec_hull.js","concaveman":"node_modules/concaveman/index.js"}],"app.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

require("dotenv").config();

var loadGoogleMapsApi = require("load-google-maps-api");

var fs = require("fs");

var polygons = require("./calculatePolygons");

var cords_full = "[{\n    \"location\": {\n        \"lat\": 56.65731472997458,\n        \"lng\": 16.321155688268764\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506818628\n}, {\n    \"location\": {\n        \"lat\": 56.65732947260858,\n        \"lng\": 16.321201285822017\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506819346\n}, {\n    \"location\": {\n        \"lat\": 56.65734716376178,\n        \"lng\": 16.32125761221133\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506819924\n}, {\n    \"location\": {\n        \"lat\": 56.65736190638308,\n        \"lng\": 16.321316620809657\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506820525\n}, {\n    \"location\": {\n        \"lat\": 56.657386968826096,\n        \"lng\": 16.32138904045306\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506821230\n}, {\n    \"location\": {\n        \"lat\": 56.65740760847251,\n        \"lng\": 16.321458777887447\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506822827\n}, {\n    \"location\": {\n        \"lat\": 56.65742529958902,\n        \"lng\": 16.32152046869479\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506823427\n}, {\n    \"location\": {\n        \"lat\": 56.65744741347302,\n        \"lng\": 16.321579477293117\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506824116\n}, {\n    \"location\": {\n        \"lat\": 56.657469527344006,\n        \"lng\": 16.32164653251849\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506824896\n}, {\n    \"location\": {\n        \"lat\": 56.65749016694524,\n        \"lng\": 16.32172431657992\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506825541\n}, {\n    \"location\": {\n        \"lat\": 56.65750343525434,\n        \"lng\": 16.32177796076022\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506826096\n}, {\n    \"location\": {\n        \"lat\": 56.657466578828625,\n        \"lng\": 16.321820876104457\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506826771\n}, {\n    \"location\": {\n        \"lat\": 56.65744004217979,\n        \"lng\": 16.321775278551204\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506827567\n}, {\n    \"location\": {\n        \"lat\": 56.65742529958902,\n        \"lng\": 16.321689447862727\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506828062\n}, {\n    \"location\": {\n        \"lat\": 56.6574002371715,\n        \"lng\": 16.32161971042834\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506828654\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.32153656194888\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506829345\n}, {\n    \"location\": {\n        \"lat\": 56.657350112286494,\n        \"lng\": 16.32148291776858\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506829870\n}, {\n    \"location\": {\n        \"lat\": 56.657325049818986,\n        \"lng\": 16.32141586254321\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506830416\n}, {\n    \"location\": {\n        \"lat\": 56.65730588439141,\n        \"lng\": 16.321370264989955\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506831016\n}, {\n    \"location\": {\n        \"lat\": 56.65728082189451,\n        \"lng\": 16.321354171735866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506831542\n}, {\n    \"location\": {\n        \"lat\": 56.657254285114924,\n        \"lng\": 16.321397087080104\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506832134\n}, {\n    \"location\": {\n        \"lat\": 56.657198262963306,\n        \"lng\": 16.32153119753085\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506833290\n}, {\n    \"location\": {\n        \"lat\": 56.657154034890084,\n        \"lng\": 16.321659943563564\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506834984\n}, {\n    \"location\": {\n        \"lat\": 56.65721005710739,\n        \"lng\": 16.321474871141536\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506835989\n}, {\n    \"location\": {\n        \"lat\": 56.65716435477848,\n        \"lng\": 16.321600934965236\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506836784\n}, {\n    \"location\": {\n        \"lat\": 56.65712307520794,\n        \"lng\": 16.32173504541598\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506837414\n}, {\n    \"location\": {\n        \"lat\": 56.65708474413767,\n        \"lng\": 16.321863791448695\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506838738\n}, {\n    \"location\": {\n        \"lat\": 56.65709358977274,\n        \"lng\": 16.321812829477413\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506839642\n}, {\n    \"location\": {\n        \"lat\": 56.65705820722007,\n        \"lng\": 16.321938893301112\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506840542\n}, {\n    \"location\": {\n        \"lat\": 56.657036093107784,\n        \"lng\": 16.322000584108455\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506841569\n}, {\n    \"location\": {\n        \"lat\": 56.65702282463418,\n        \"lng\": 16.322067639333827\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506842784\n}, {\n    \"location\": {\n        \"lat\": 56.65704788730261,\n        \"lng\": 16.32210787246905\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506843744\n}, {\n    \"location\": {\n        \"lat\": 56.657074424227496,\n        \"lng\": 16.322056910497768\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506845049\n}, {\n    \"location\": {\n        \"lat\": 56.65709358977274,\n        \"lng\": 16.32198717306338\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506845942\n}, {\n    \"location\": {\n        \"lat\": 56.65711422957979,\n        \"lng\": 16.321928164465053\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506846999\n}, {\n    \"location\": {\n        \"lat\": 56.65713044656315,\n        \"lng\": 16.32189866016589\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506847771\n}, {\n    \"location\": {\n        \"lat\": 56.65714961207989,\n        \"lng\": 16.32183428714953\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506848530\n}, {\n    \"location\": {\n        \"lat\": 56.657180571740234,\n        \"lng\": 16.32177259634219\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506849436\n}, {\n    \"location\": {\n        \"lat\": 56.65720268576776,\n        \"lng\": 16.321697494489772\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506850464\n}, {\n    \"location\": {\n        \"lat\": 56.65723364538453,\n        \"lng\": 16.32161971042834\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506851845\n}, {\n    \"location\": {\n        \"lat\": 56.657248388050235,\n        \"lng\": 16.321558019620998\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506853029\n}, {\n    \"location\": {\n        \"lat\": 56.65726313071019,\n        \"lng\": 16.321480235559566\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506854012\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.321453413469417\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506854763\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.321533879739864\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506855594\n}, {\n    \"location\": {\n        \"lat\": 56.65732799834543,\n        \"lng\": 16.32161434601031\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506856629\n}, {\n    \"location\": {\n        \"lat\": 56.657345689499316,\n        \"lng\": 16.321654579145534\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506857416\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.321732363206966\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506858205\n}, {\n    \"location\": {\n        \"lat\": 56.65738107178216,\n        \"lng\": 16.321791371805293\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506858999\n}, {\n    \"location\": {\n        \"lat\": 56.6574002371715,\n        \"lng\": 16.32185038040362\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506859704\n}, {\n    \"location\": {\n        \"lat\": 56.65739139160839,\n        \"lng\": 16.321922800047023\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506860432\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.32190938900195\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506861174\n}, {\n    \"location\": {\n        \"lat\": 56.657332421134676,\n        \"lng\": 16.32185574482165\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506861865\n}, {\n    \"location\": {\n        \"lat\": 56.657320627028874,\n        \"lng\": 16.321780642969234\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506862599\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.321716269952876\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506863387\n}, {\n    \"location\": {\n        \"lat\": 56.65728377042442,\n        \"lng\": 16.321676036817653\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506863986\n}, {\n    \"location\": {\n        \"lat\": 56.65727492483398,\n        \"lng\": 16.32163580368243\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506864639\n}, {\n    \"location\": {\n        \"lat\": 56.65724249098464,\n        \"lng\": 16.32172431657992\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506865570\n}, {\n    \"location\": {\n        \"lat\": 56.657224799782334,\n        \"lng\": 16.321804782850368\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506866589\n}, {\n    \"location\": {\n        \"lat\": 56.657213005642845,\n        \"lng\": 16.32186110923968\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506867212\n}, {\n    \"location\": {\n        \"lat\": 56.657190891621376,\n        \"lng\": 16.321906706792934\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506867840\n}, {\n    \"location\": {\n        \"lat\": 56.65717320039485,\n        \"lng\": 16.321944257719142\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506868464\n}, {\n    \"location\": {\n        \"lat\": 56.65715108635001,\n        \"lng\": 16.32198180864535\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506869072\n}, {\n    \"location\": {\n        \"lat\": 56.65713486937557,\n        \"lng\": 16.322022041780574\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506869678\n}, {\n    \"location\": {\n        \"lat\": 56.65711717812273,\n        \"lng\": 16.322075685960872\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506870264\n}, {\n    \"location\": {\n        \"lat\": 56.65709653831731,\n        \"lng\": 16.32212396572314\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506870901\n}, {\n    \"location\": {\n        \"lat\": 56.65708032131938,\n        \"lng\": 16.322201749784572\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506871636\n}, {\n    \"location\": {\n        \"lat\": 56.6570685271347,\n        \"lng\": 16.32225002954684\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506872312\n}, {\n    \"location\": {\n        \"lat\": 56.657064104314486,\n        \"lng\": 16.322325131399257\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506873415\n}, {\n    \"location\": {\n        \"lat\": 56.65706557858795,\n        \"lng\": 16.322400233251674\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506874412\n}, {\n    \"location\": {\n        \"lat\": 56.657074424227496,\n        \"lng\": 16.322453877431972\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506875304\n}, {\n    \"location\": {\n        \"lat\": 56.65708032131938,\n        \"lng\": 16.322494110567195\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506876016\n}, {\n    \"location\": {\n        \"lat\": 56.657086218410335,\n        \"lng\": 16.322553119165523\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506876655\n}, {\n    \"location\": {\n        \"lat\": 56.657098012589486,\n        \"lng\": 16.322638949854\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506877390\n}, {\n    \"location\": {\n        \"lat\": 56.65711570385129,\n        \"lng\": 16.322684547407253\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506878110\n}, {\n    \"location\": {\n        \"lat\": 56.65714518926921,\n        \"lng\": 16.322708687288387\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506878769\n}, {\n    \"location\": {\n        \"lat\": 56.65717172612559,\n        \"lng\": 16.322719416124446\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506879430\n}, {\n    \"location\": {\n        \"lat\": 56.657201211499675,\n        \"lng\": 16.32271673391543\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506880127\n}, {\n    \"location\": {\n        \"lat\": 56.65723217111765,\n        \"lng\": 16.322697958452327\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506880877\n}, {\n    \"location\": {\n        \"lat\": 56.657266079241474,\n        \"lng\": 16.322673818571193\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506881575\n}, {\n    \"location\": {\n        \"lat\": 56.657282296159494,\n        \"lng\": 16.322663089735133\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506882482\n}, {\n    \"location\": {\n        \"lat\": 56.65730146159907,\n        \"lng\": 16.32264431427203\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506883172\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.322609445554836\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506883930\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.3225853056737\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506884650\n}, {\n    \"location\": {\n        \"lat\": 56.657266079241474,\n        \"lng\": 16.32259603450976\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506885527\n}, {\n    \"location\": {\n        \"lat\": 56.657243965251126,\n        \"lng\": 16.322614809972865\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506886172\n}, {\n    \"location\": {\n        \"lat\": 56.657213005642845,\n        \"lng\": 16.322620174390895\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506886825\n}, {\n    \"location\": {\n        \"lat\": 56.65719236588987,\n        \"lng\": 16.32262285659991\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506887462\n}, {\n    \"location\": {\n        \"lat\": 56.657161406239204,\n        \"lng\": 16.322609445554836\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506888085\n}, {\n    \"location\": {\n        \"lat\": 56.657137817916876,\n        \"lng\": 16.32261212776385\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506888910\n}, {\n    \"location\": {\n        \"lat\": 56.65712454947911,\n        \"lng\": 16.322577259046657\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506889477\n}, {\n    \"location\": {\n        \"lat\": 56.65711570385129,\n        \"lng\": 16.32251825044833\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506890207\n}, {\n    \"location\": {\n        \"lat\": 56.65711128103663,\n        \"lng\": 16.322437784177882\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506890790\n}, {\n    \"location\": {\n        \"lat\": 56.65711275530824,\n        \"lng\": 16.32236536453448\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506891475\n}, {\n    \"location\": {\n        \"lat\": 56.65710538394958,\n        \"lng\": 16.322322449190242\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506892262\n}, {\n    \"location\": {\n        \"lat\": 56.65710980676495,\n        \"lng\": 16.3222607583829\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506892815\n}, {\n    \"location\": {\n        \"lat\": 56.65712012666546,\n        \"lng\": 16.32221784303866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506893455\n}, {\n    \"location\": {\n        \"lat\": 56.65713486937557,\n        \"lng\": 16.322177609903438\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506894037\n}, {\n    \"location\": {\n        \"lat\": 56.65715108635001,\n        \"lng\": 16.32210787246905\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506894939\n}, {\n    \"location\": {\n        \"lat\": 56.657174674664056,\n        \"lng\": 16.322051546079738\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506895530\n}, {\n    \"location\": {\n        \"lat\": 56.6572056343038,\n        \"lng\": 16.322005948526485\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506896114\n}, {\n    \"location\": {\n        \"lat\": 56.65721595417806,\n        \"lng\": 16.32198180864535\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506896905\n}, {\n    \"location\": {\n        \"lat\": 56.657243965251126,\n        \"lng\": 16.321901342374904\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506897510\n}, {\n    \"location\": {\n        \"lat\": 56.65726018217865,\n        \"lng\": 16.321842333776576\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506898141\n}, {\n    \"location\": {\n        \"lat\": 56.657277873364364,\n        \"lng\": 16.32179405401431\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506898793\n}, {\n    \"location\": {\n        \"lat\": 56.6572911417482,\n        \"lng\": 16.32186647365771\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506900137\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.321936211092098\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506901096\n}, {\n    \"location\": {\n        \"lat\": 56.65725870791281,\n        \"lng\": 16.322016677362544\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506902709\n}, {\n    \"location\": {\n        \"lat\": 56.657266079241474,\n        \"lng\": 16.321973762018306\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506904359\n}, {\n    \"location\": {\n        \"lat\": 56.657226274049506,\n        \"lng\": 16.322078368169887\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506905350\n}, {\n    \"location\": {\n        \"lat\": 56.65720268576776,\n        \"lng\": 16.322126647932155\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506906752\n}, {\n    \"location\": {\n        \"lat\": 56.657190891621376,\n        \"lng\": 16.32215615223132\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506907630\n}, {\n    \"location\": {\n        \"lat\": 56.65717909747128,\n        \"lng\": 16.322199067575557\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506908288\n}, {\n    \"location\": {\n        \"lat\": 56.65716730331749,\n        \"lng\": 16.32223930071078\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506908972\n}, {\n    \"location\": {\n        \"lat\": 56.65715993196949,\n        \"lng\": 16.32227685163699\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506909615\n}, {\n    \"location\": {\n        \"lat\": 56.657154034890084,\n        \"lng\": 16.3223331780263\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506910307\n}, {\n    \"location\": {\n        \"lat\": 56.657154034890084,\n        \"lng\": 16.32238145778857\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506910965\n}, {\n    \"location\": {\n        \"lat\": 56.65715550916002,\n        \"lng\": 16.322421690923793\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506911595\n}, {\n    \"location\": {\n        \"lat\": 56.65715993196949,\n        \"lng\": 16.32246460626803\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506912225\n}, {\n    \"location\": {\n        \"lat\": 56.65716582904801,\n        \"lng\": 16.32250215719424\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506913015\n}, {\n    \"location\": {\n        \"lat\": 56.657174674664056,\n        \"lng\": 16.32252897928439\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506913839\n}, {\n    \"location\": {\n        \"lat\": 56.657201211499675,\n        \"lng\": 16.322550436956508\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506914438\n}, {\n    \"location\": {\n        \"lat\": 56.65722774831662,\n        \"lng\": 16.322542390329463\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506915127\n}, {\n    \"location\": {\n        \"lat\": 56.65726755350704,\n        \"lng\": 16.32252361486636\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506915961\n}, {\n    \"location\": {\n        \"lat\": 56.657288193218854,\n        \"lng\": 16.322504839403255\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506916658\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.322448513013942\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506917492\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.32239755104266\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506918467\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.322357317907436\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506919202\n}, {\n    \"location\": {\n        \"lat\": 56.657319152765396,\n        \"lng\": 16.322274169427974\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506920011\n}, {\n    \"location\": {\n        \"lat\": 56.65732799834543,\n        \"lng\": 16.322201749784572\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506920762\n}, {\n    \"location\": {\n        \"lat\": 56.6573383181862,\n        \"lng\": 16.32214542339526\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506921512\n}, {\n    \"location\": {\n        \"lat\": 56.657344215236805,\n        \"lng\": 16.32209177921496\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506922185\n}, {\n    \"location\": {\n        \"lat\": 56.657341266711626,\n        \"lng\": 16.322059592706783\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506923171\n}, {\n    \"location\": {\n        \"lat\": 56.65733389539764,\n        \"lng\": 16.322011312944515\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506923798\n}, {\n    \"location\": {\n        \"lat\": 56.65731030718325,\n        \"lng\": 16.322005948526485\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506924518\n}, {\n    \"location\": {\n        \"lat\": 56.65729703880619,\n        \"lng\": 16.32202472398959\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506925163\n}, {\n    \"location\": {\n        \"lat\": 56.657279347629455,\n        \"lng\": 16.322059592706783\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506925930\n}, {\n    \"location\": {\n        \"lat\": 56.65727197630338,\n        \"lng\": 16.32209177921496\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506926550\n}, {\n    \"location\": {\n        \"lat\": 56.65724986231649,\n        \"lng\": 16.322132012350185\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506927301\n}, {\n    \"location\": {\n        \"lat\": 56.657235119651375,\n        \"lng\": 16.322204431993587\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506927976\n}, {\n    \"location\": {\n        \"lat\": 56.657224799782334,\n        \"lng\": 16.322252711755855\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506928620\n}, {\n    \"location\": {\n        \"lat\": 56.65721595417806,\n        \"lng\": 16.322290262682063\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506929393\n}, {\n    \"location\": {\n        \"lat\": 56.65721153137515,\n        \"lng\": 16.322335860235317\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506930053\n}, {\n    \"location\": {\n        \"lat\": 56.6572056343038,\n        \"lng\": 16.322405597669704\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506930728\n}, {\n    \"location\": {\n        \"lat\": 56.65721005710739,\n        \"lng\": 16.322445830804927\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506931425\n}, {\n    \"location\": {\n        \"lat\": 56.6572174284456,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506932306\n}, {\n    \"location\": {\n        \"lat\": 56.65724543951755,\n        \"lng\": 16.322456559640987\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506933060\n}, {\n    \"location\": {\n        \"lat\": 56.65724691378393,\n        \"lng\": 16.32239755104266\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506933713\n}, {\n    \"location\": {\n        \"lat\": 56.657251336582696,\n        \"lng\": 16.322346589071376\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506934455\n}, {\n    \"location\": {\n        \"lat\": 56.65726165644445,\n        \"lng\": 16.32228221605502\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506935168\n}, {\n    \"location\": {\n        \"lat\": 56.657277873364364,\n        \"lng\": 16.32221784303866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506935783\n}, {\n    \"location\": {\n        \"lat\": 56.6572911417482,\n        \"lng\": 16.32216151664935\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506936548\n}, {\n    \"location\": {\n        \"lat\": 56.657304410127345,\n        \"lng\": 16.32210787246905\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506937163\n}, {\n    \"location\": {\n        \"lat\": 56.65736485490666,\n        \"lng\": 16.32202472398959\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506938597\n}, {\n    \"location\": {\n        \"lat\": 56.65740760847251,\n        \"lng\": 16.321995219690425\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506940270\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.321957668764217\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506941830\n}, {\n    \"location\": {\n        \"lat\": 56.657468053086355,\n        \"lng\": 16.321930846674068\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506942578\n}, {\n    \"location\": {\n        \"lat\": 56.65749753822867,\n        \"lng\": 16.321925482256038\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506943433\n}, {\n    \"location\": {\n        \"lat\": 56.65752112632591,\n        \"lng\": 16.321941575510127\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506944115\n}, {\n    \"location\": {\n        \"lat\": 56.65754324015365,\n        \"lng\": 16.32198717306338\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506944798\n}, {\n    \"location\": {\n        \"lat\": 56.65753586887918,\n        \"lng\": 16.32186110923968\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506946321\n}, {\n    \"location\": {\n        \"lat\": 56.6575815707577,\n        \"lng\": 16.322005948526485\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506947657\n}, {\n    \"location\": {\n        \"lat\": 56.65757567374425,\n        \"lng\": 16.321941575510127\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506948633\n}, {\n    \"location\": {\n        \"lat\": 56.657593364781874,\n        \"lng\": 16.32209714363299\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506949440\n}, {\n    \"location\": {\n        \"lat\": 56.6576228498262,\n        \"lng\": 16.322148105604274\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506951377\n}, {\n    \"location\": {\n        \"lat\": 56.65763611808858,\n        \"lng\": 16.322209796411617\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506952080\n}, {\n    \"location\": {\n        \"lat\": 56.657644963594265,\n        \"lng\": 16.32222320745669\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506953035\n}, {\n    \"location\": {\n        \"lat\": 56.65766118034928,\n        \"lng\": 16.322295627100093\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506953745\n}, {\n    \"location\": {\n        \"lat\": 56.657675922847794,\n        \"lng\": 16.322362682325465\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506954390\n}, {\n    \"location\": {\n        \"lat\": 56.65768919109152,\n        \"lng\": 16.322421690923793\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506955290\n}, {\n    \"location\": {\n        \"lat\": 56.65770245933058,\n        \"lng\": 16.322467288477046\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506955875\n}, {\n    \"location\": {\n        \"lat\": 56.65771867606086,\n        \"lng\": 16.32253970812045\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506956714\n}, {\n    \"location\": {\n        \"lat\": 56.65773047004213,\n        \"lng\": 16.32260676334582\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506961605\n}, {\n    \"location\": {\n        \"lat\": 56.657749635253865,\n        \"lng\": 16.322684547407253\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506963610\n}, {\n    \"location\": {\n        \"lat\": 56.65776142922546,\n        \"lng\": 16.322783789140804\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506964839\n}, {\n    \"location\": {\n        \"lat\": 56.65778796564805,\n        \"lng\": 16.322920581800563\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506967667\n}, {\n    \"location\": {\n        \"lat\": 56.6577805944214,\n        \"lng\": 16.322883030874355\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506968475\n}, {\n    \"location\": {\n        \"lat\": 56.657796811118104,\n        \"lng\": 16.32298495481692\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506969467\n}, {\n    \"location\": {\n        \"lat\": 56.657808605074926,\n        \"lng\": 16.32303859899722\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506970592\n}, {\n    \"location\": {\n        \"lat\": 56.65781597629607,\n        \"lng\": 16.323086878759486\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506971168\n}, {\n    \"location\": {\n        \"lat\": 56.65782334751578,\n        \"lng\": 16.3231432051488\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506972195\n}, {\n    \"location\": {\n        \"lat\": 56.65782187327197,\n        \"lng\": 16.323183438284023\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506972983\n}, {\n    \"location\": {\n        \"lat\": 56.657817450540136,\n        \"lng\": 16.32322635362826\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506973695\n}, {\n    \"location\": {\n        \"lat\": 56.65781450205198,\n        \"lng\": 16.32327463339053\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506974430\n}, {\n    \"location\": {\n        \"lat\": 56.657807130830534,\n        \"lng\": 16.323312184316737\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506975113\n}, {\n    \"location\": {\n        \"lat\": 56.65778796564805,\n        \"lng\": 16.32337923954211\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506975897\n}, {\n    \"location\": {\n        \"lat\": 56.65777617168476,\n        \"lng\": 16.323427519304378\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506976578\n}, {\n    \"location\": {\n        \"lat\": 56.657765851963866,\n        \"lng\": 16.323481163484676\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506977168\n}, {\n    \"location\": {\n        \"lat\": 56.65776142922546,\n        \"lng\": 16.32351066778384\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506977888\n}, {\n    \"location\": {\n        \"lat\": 56.657749635253865,\n        \"lng\": 16.323553583128078\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506978827\n}, {\n    \"location\": {\n        \"lat\": 56.65774373826668,\n        \"lng\": 16.32358308742724\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506979635\n}, {\n    \"location\": {\n        \"lat\": 56.65773931552568,\n        \"lng\": 16.323591134054286\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506980425\n}, {\n    \"location\": {\n        \"lat\": 56.65770245933058,\n        \"lng\": 16.323634049398525\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506981828\n}, {\n    \"location\": {\n        \"lat\": 56.657662654599406,\n        \"lng\": 16.32365282486163\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506983477\n}, {\n    \"location\": {\n        \"lat\": 56.65764054084168,\n        \"lng\": 16.323666235906703\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506984450\n}, {\n    \"location\": {\n        \"lat\": 56.657605158802376,\n        \"lng\": 16.323668918115718\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506985238\n}, {\n    \"location\": {\n        \"lat\": 56.657580096504425,\n        \"lng\": 16.323690375787837\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506986507\n}, {\n    \"location\": {\n        \"lat\": 56.6575506114267,\n        \"lng\": 16.323685011369808\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506987323\n}, {\n    \"location\": {\n        \"lat\": 56.65751375504709,\n        \"lng\": 16.323701104623897\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506988193\n}, {\n    \"location\": {\n        \"lat\": 56.65748426991748,\n        \"lng\": 16.323703786832912\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506988935\n}, {\n    \"location\": {\n        \"lat\": 56.65746215605512,\n        \"lng\": 16.32371451566897\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506990115\n}, {\n    \"location\": {\n        \"lat\": 56.6574208768107,\n        \"lng\": 16.32373060892306\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506991622\n}, {\n    \"location\": {\n        \"lat\": 56.65739139160839,\n        \"lng\": 16.323733291132076\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506992874\n}, {\n    \"location\": {\n        \"lat\": 56.6573368439234,\n        \"lng\": 16.323727926714046\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506994824\n}, {\n    \"location\": {\n        \"lat\": 56.657292616012775,\n        \"lng\": 16.323687693578822\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586506997262\n}, {\n    \"location\": {\n        \"lat\": 56.65728377042442,\n        \"lng\": 16.323607227308376\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507000142\n}, {\n    \"location\": {\n        \"lat\": 56.65727050203799,\n        \"lng\": 16.32353212545596\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507002753\n}, {\n    \"location\": {\n        \"lat\": 56.65726313071019,\n        \"lng\": 16.323438248140437\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507004545\n}, {\n    \"location\": {\n        \"lat\": 56.65726018217865,\n        \"lng\": 16.323360464079006\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507006351\n}, {\n    \"location\": {\n        \"lat\": 56.657254285114924,\n        \"lng\": 16.323223671419246\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507008325\n}, {\n    \"location\": {\n        \"lat\": 56.65724986231649,\n        \"lng\": 16.323151251775844\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507009359\n}, {\n    \"location\": {\n        \"lat\": 56.657243965251126,\n        \"lng\": 16.323054692251308\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507011152\n}, {\n    \"location\": {\n        \"lat\": 56.657279347629455,\n        \"lng\": 16.323046645624263\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507013364\n}, {\n    \"location\": {\n        \"lat\": 56.65728966748355,\n        \"lng\": 16.323140522939784\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507014338\n}, {\n    \"location\": {\n        \"lat\": 56.65729556454177,\n        \"lng\": 16.323199531538112\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507015028\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.323255857927425\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507015883\n}, {\n    \"location\": {\n        \"lat\": 56.65729851307053,\n        \"lng\": 16.323293408853633\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507016719\n}, {\n    \"location\": {\n        \"lat\": 56.65730735865543,\n        \"lng\": 16.32335778186999\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507017773\n}, {\n    \"location\": {\n        \"lat\": 56.65730883291936,\n        \"lng\": 16.32341679046832\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507018973\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.323440930349452\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507019655\n}, {\n    \"location\": {\n        \"lat\": 56.65732357555569,\n        \"lng\": 16.323497256738765\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507020630\n}, {\n    \"location\": {\n        \"lat\": 56.657325049818986,\n        \"lng\": 16.323540172083003\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507021475\n}, {\n    \"location\": {\n        \"lat\": 56.657332421134676,\n        \"lng\": 16.323561629755122\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507022004\n}, {\n    \"location\": {\n        \"lat\": 56.657342740974244,\n        \"lng\": 16.323591134054286\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507022896\n}, {\n    \"location\": {\n        \"lat\": 56.65735895785928,\n        \"lng\": 16.323650142652614\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507024155\n}, {\n    \"location\": {\n        \"lat\": 56.65739728865071,\n        \"lng\": 16.323639413816554\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507025423\n}, {\n    \"location\": {\n        \"lat\": 56.657431196626014,\n        \"lng\": 16.32363673160754\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507026450\n}, {\n    \"location\": {\n        \"lat\": 56.657463630313025,\n        \"lng\": 16.323628684980495\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507027448\n}, {\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.32362063835345\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507028258\n}, {\n    \"location\": {\n        \"lat\": 56.657515229302966,\n        \"lng\": 16.323612591726405\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507029270\n}, {\n    \"location\": {\n        \"lat\": 56.65755503418983,\n        \"lng\": 16.32360990951739\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507030260\n}, {\n    \"location\": {\n        \"lat\": 56.6576095815591,\n        \"lng\": 16.323591134054286\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507033277\n}, {\n    \"location\": {\n        \"lat\": 56.657647912095705,\n        \"lng\": 16.323572358591182\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507035039\n}, {\n    \"location\": {\n        \"lat\": 56.65767887134682,\n        \"lng\": 16.32354285429202\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507036050\n}, {\n    \"location\": {\n        \"lat\": 56.65769951083341,\n        \"lng\": 16.32349457452975\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507037078\n}, {\n    \"location\": {\n        \"lat\": 56.65771277906886,\n        \"lng\": 16.3234677524396\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507038135\n}, {\n    \"location\": {\n        \"lat\": 56.657728995794685,\n        \"lng\": 16.323422154886348\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507039058\n}, {\n    \"location\": {\n        \"lat\": 56.65773784127857,\n        \"lng\": 16.32334705303393\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507040153\n}, {\n    \"location\": {\n        \"lat\": 56.65774521251357,\n        \"lng\": 16.323293408853633\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507040970\n}, {\n    \"location\": {\n        \"lat\": 56.657765851963866,\n        \"lng\": 16.3232156247922\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507042488\n}, {\n    \"location\": {\n        \"lat\": 56.657768800455806,\n        \"lng\": 16.323178073865993\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507043355\n}, {\n    \"location\": {\n        \"lat\": 56.657768800455806,\n        \"lng\": 16.323097607595546\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507044293\n}, {\n    \"location\": {\n        \"lat\": 56.6577584807329,\n        \"lng\": 16.32302787016116\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507045276\n}, {\n    \"location\": {\n        \"lat\": 56.657749635253865,\n        \"lng\": 16.322966179353816\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507046528\n}, {\n    \"location\": {\n        \"lat\": 56.6577363670314,\n        \"lng\": 16.322928628427608\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507047498\n}, {\n    \"location\": {\n        \"lat\": 56.65772752154718,\n        \"lng\": 16.32285889099322\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507048531\n}, {\n    \"location\": {\n        \"lat\": 56.65771425331694,\n        \"lng\": 16.322799882394893\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507049247\n}, {\n    \"location\": {\n        \"lat\": 56.65769951083341,\n        \"lng\": 16.322730144960506\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507050173\n}, {\n    \"location\": {\n        \"lat\": 56.65768624259332,\n        \"lng\": 16.322676500780208\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507051598\n}, {\n    \"location\": {\n        \"lat\": 56.65767297434857,\n        \"lng\": 16.322604081136806\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507052625\n}, {\n    \"location\": {\n        \"lat\": 56.65765528334827,\n        \"lng\": 16.322547754747493\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507053544\n}, {\n    \"location\": {\n        \"lat\": 56.65764938634633,\n        \"lng\": 16.322499474985225\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507055250\n}, {\n    \"location\": {\n        \"lat\": 56.65763759233967,\n        \"lng\": 16.322416326505763\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507055978\n}, {\n    \"location\": {\n        \"lat\": 56.657618427071,\n        \"lng\": 16.32237609337054\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507057015\n}, {\n    \"location\": {\n        \"lat\": 56.657600736045126,\n        \"lng\": 16.322300991518123\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507058220\n}, {\n    \"location\": {\n        \"lat\": 56.65758599351723,\n        \"lng\": 16.322241982919795\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507059317\n}, {\n    \"location\": {\n        \"lat\": 56.657569776729844,\n        \"lng\": 16.322185656530483\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507060388\n}, {\n    \"location\": {\n        \"lat\": 56.65755798269829,\n        \"lng\": 16.322158834440334\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507061157\n}, {\n    \"location\": {\n        \"lat\": 56.65754176589888,\n        \"lng\": 16.32211323688708\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507061865\n}, {\n    \"location\": {\n        \"lat\": 56.65752554909248,\n        \"lng\": 16.322083732587917\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507063153\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.322064957124812\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507063884\n}, {\n    \"location\": {\n        \"lat\": 56.657468053086355,\n        \"lng\": 16.322062274915798\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507064979\n}, {\n    \"location\": {\n        \"lat\": 56.6574002371715,\n        \"lng\": 16.322153470022304\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507068482\n}, {\n    \"location\": {\n        \"lat\": 56.657406134212444,\n        \"lng\": 16.32210250805102\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507070005\n}, {\n    \"location\": {\n        \"lat\": 56.65737959752104,\n        \"lng\": 16.322209796411617\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507070895\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.32227685163699\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507071855\n}, {\n    \"location\": {\n        \"lat\": 56.657375174737346,\n        \"lng\": 16.32221784303866\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507072785\n}, {\n    \"location\": {\n        \"lat\": 56.65735748359728,\n        \"lng\": 16.32228221605502\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507073464\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.32235463569842\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507074450\n}, {\n    \"location\": {\n        \"lat\": 56.657341266711626,\n        \"lng\": 16.322427055341823\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507075125\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.322494110567195\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507076692\n}, {\n    \"location\": {\n        \"lat\": 56.657345689499316,\n        \"lng\": 16.322579941255672\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507077929\n}, {\n    \"location\": {\n        \"lat\": 56.657370751953096,\n        \"lng\": 16.32262285659991\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507079001\n}, {\n    \"location\": {\n        \"lat\": 56.65735306081098,\n        \"lng\": 16.322697958452327\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507080134\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.32273819158755\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507080848\n}, {\n    \"location\": {\n        \"lat\": 56.65726018217865,\n        \"lng\": 16.32277037809573\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507082205\n}, {\n    \"location\": {\n        \"lat\": 56.65723364538453,\n        \"lng\": 16.322789153558833\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507083165\n}, {\n    \"location\": {\n        \"lat\": 56.657186468815524,\n        \"lng\": 16.322821340067012\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507084376\n}, {\n    \"location\": {\n        \"lat\": 56.65719236588987,\n        \"lng\": 16.322893759710414\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507085595\n}, {\n    \"location\": {\n        \"lat\": 56.65721890271305,\n        \"lng\": 16.322925946218593\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507094528\n}, {\n    \"location\": {\n        \"lat\": 56.657254285114924,\n        \"lng\": 16.3228910775014\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507095808\n}, {\n    \"location\": {\n        \"lat\": 56.657299987334824,\n        \"lng\": 16.322872302038295\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507096918\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.32284816215716\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507097729\n}, {\n    \"location\": {\n        \"lat\": 56.657367803429985,\n        \"lng\": 16.32283206890307\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507098875\n}, {\n    \"location\": {\n        \"lat\": 56.65739728865071,\n        \"lng\": 16.322818657857997\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507099613\n}, {\n    \"location\": {\n        \"lat\": 56.65744151643854,\n        \"lng\": 16.322799882394893\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507100563\n}, {\n    \"location\": {\n        \"lat\": 56.65747689863146,\n        \"lng\": 16.32278647134982\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507101613\n}, {\n    \"location\": {\n        \"lat\": 56.65751080653517,\n        \"lng\": 16.322762331468684\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507102378\n}, {\n    \"location\": {\n        \"lat\": 56.65754029164405,\n        \"lng\": 16.322746238214595\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507103264\n}, {\n    \"location\": {\n        \"lat\": 56.6575668282223,\n        \"lng\": 16.32273819158755\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507104223\n}, {\n    \"location\": {\n        \"lat\": 56.65759631328736,\n        \"lng\": 16.322719416124446\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507105086\n}, {\n    \"location\": {\n        \"lat\": 56.657618427071,\n        \"lng\": 16.322695276243312\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507106113\n}, {\n    \"location\": {\n        \"lat\": 56.65763464383744,\n        \"lng\": 16.322681865198238\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507107036\n}, {\n    \"location\": {\n        \"lat\": 56.65764054084168,\n        \"lng\": 16.32266040752612\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507108139\n}, {\n    \"location\": {\n        \"lat\": 56.65763169533499,\n        \"lng\": 16.322593352300746\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507108922\n}, {\n    \"location\": {\n        \"lat\": 56.657606633054684,\n        \"lng\": 16.32253970812045\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507110218\n}, {\n    \"location\": {\n        \"lat\": 56.6575845192641,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507116750\n}, {\n    \"location\": {\n        \"lat\": 56.65756240546056,\n        \"lng\": 16.322545072538478\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507121744\n}, {\n    \"location\": {\n        \"lat\": 56.65761547856727,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507123155\n}, {\n    \"location\": {\n        \"lat\": 56.65757419949074,\n        \"lng\": 16.32238145778857\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507124151\n}, {\n    \"location\": {\n        \"lat\": 56.65755208568114,\n        \"lng\": 16.322303673727138\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507125230\n}, {\n    \"location\": {\n        \"lat\": 56.65753439462409,\n        \"lng\": 16.3222607583829\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507126043\n}, {\n    \"location\": {\n        \"lat\": 56.65750785802302,\n        \"lng\": 16.3222071142026\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507127083\n}, {\n    \"location\": {\n        \"lat\": 56.65747395011666,\n        \"lng\": 16.322193703157527\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507128141\n}, {\n    \"location\": {\n        \"lat\": 56.65745331050656,\n        \"lng\": 16.322204431993587\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507129440\n}, {\n    \"location\": {\n        \"lat\": 56.65743267088514,\n        \"lng\": 16.322258076173885\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507130322\n}, {\n    \"location\": {\n        \"lat\": 56.657417928291494,\n        \"lng\": 16.322314402563197\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507131366\n}, {\n    \"location\": {\n        \"lat\": 56.65741497977207,\n        \"lng\": 16.32237609337054\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507132461\n}, {\n    \"location\": {\n        \"lat\": 56.657409082732535,\n        \"lng\": 16.322429737550838\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507133376\n}, {\n    \"location\": {\n        \"lat\": 56.65740760847251,\n        \"lng\": 16.32246997068606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507134284\n}, {\n    \"location\": {\n        \"lat\": 56.65741055699251,\n        \"lng\": 16.32253434370242\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507135401\n}, {\n    \"location\": {\n        \"lat\": 56.65745331050656,\n        \"lng\": 16.32253970812045\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507136904\n}, {\n    \"location\": {\n        \"lat\": 56.657457733281085,\n        \"lng\": 16.322472652895076\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507137885\n}, {\n    \"location\": {\n        \"lat\": 56.65746215605512,\n        \"lng\": 16.32240291546069\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507138949\n}, {\n    \"location\": {\n        \"lat\": 56.657469527344006,\n        \"lng\": 16.322351953489406\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507139886\n}, {\n    \"location\": {\n        \"lat\": 56.65747837288878,\n        \"lng\": 16.322290262682063\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507141094\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.32228758047305\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507141979\n}, {\n    \"location\": {\n        \"lat\": 56.657499012485175,\n        \"lng\": 16.322258076173885\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507143555\n}, {\n    \"location\": {\n        \"lat\": 56.65751228079117,\n        \"lng\": 16.322325131399257\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507144259\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.32241364429675\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507145399\n}, {\n    \"location\": {\n        \"lat\": 56.65751817781455,\n        \"lng\": 16.322435101968868\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507146876\n}, {\n    \"location\": {\n        \"lat\": 56.65751817781455,\n        \"lng\": 16.322483381731136\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507148137\n}, {\n    \"location\": {\n        \"lat\": 56.65750048674163,\n        \"lng\": 16.32251825044833\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507148890\n}, {\n    \"location\": {\n        \"lat\": 56.65750048674163,\n        \"lng\": 16.322550436956508\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507149959\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.322571894628627\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507151166\n}, {\n    \"location\": {\n        \"lat\": 56.65751375504709,\n        \"lng\": 16.32259067009173\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507152299\n}, {\n    \"location\": {\n        \"lat\": 56.65755208568114,\n        \"lng\": 16.322636267644985\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507156065\n}, {\n    \"location\": {\n        \"lat\": 56.657588942023274,\n        \"lng\": 16.32264967869006\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507158622\n}, {\n    \"location\": {\n        \"lat\": 56.65752407483702,\n        \"lng\": 16.322687229616268\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507160258\n}, {\n    \"location\": {\n        \"lat\": 56.65748721843146,\n        \"lng\": 16.322689911825282\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507161382\n}, {\n    \"location\": {\n        \"lat\": 56.65747395011666,\n        \"lng\": 16.322646996481044\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507163296\n}, {\n    \"location\": {\n        \"lat\": 56.65745625902295,\n        \"lng\": 16.32261749218188\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507164704\n}, {\n    \"location\": {\n        \"lat\": 56.65741497977207,\n        \"lng\": 16.32261749218188\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507166963\n}, {\n    \"location\": {\n        \"lat\": 56.65742235107019,\n        \"lng\": 16.322689911825282\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507171553\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.32272209833346\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507174418\n}, {\n    \"location\": {\n        \"lat\": 56.65739286586908,\n        \"lng\": 16.32275428484164\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507175519\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.32277574251376\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507176758\n}, {\n    \"location\": {\n        \"lat\": 56.657341266711626,\n        \"lng\": 16.32278647134982\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507178369\n}, {\n    \"location\": {\n        \"lat\": 56.657311781447085,\n        \"lng\": 16.322802564603908\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507179446\n}, {\n    \"location\": {\n        \"lat\": 56.657342740974244,\n        \"lng\": 16.32290180633746\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507180334\n}, {\n    \"location\": {\n        \"lat\": 56.657342740974244,\n        \"lng\": 16.322936675054653\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507181872\n}, {\n    \"location\": {\n        \"lat\": 56.65739139160839,\n        \"lng\": 16.322928628427608\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507182929\n}, {\n    \"location\": {\n        \"lat\": 56.65740465995227,\n        \"lng\": 16.32290717075549\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507185196\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.322893759710414\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507186035\n}, {\n    \"location\": {\n        \"lat\": 56.657465104570846,\n        \"lng\": 16.32288571308337\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507187194\n}, {\n    \"location\": {\n        \"lat\": 56.657499012485175,\n        \"lng\": 16.32288571308337\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507188074\n}, {\n    \"location\": {\n        \"lat\": 56.65751965207025,\n        \"lng\": 16.322866937620265\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507189094\n}, {\n    \"location\": {\n        \"lat\": 56.65755208568114,\n        \"lng\": 16.32286425541125\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507190804\n}, {\n    \"location\": {\n        \"lat\": 56.65758304501093,\n        \"lng\": 16.32283206890307\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507192289\n}, {\n    \"location\": {\n        \"lat\": 56.65760810730692,\n        \"lng\": 16.322818657857997\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507193782\n}, {\n    \"location\": {\n        \"lat\": 56.65763759233967,\n        \"lng\": 16.322813293439967\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507195194\n}, {\n    \"location\": {\n        \"lat\": 56.65765970609911,\n        \"lng\": 16.32278647134982\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507196788\n}, {\n    \"location\": {\n        \"lat\": 56.657687716842446,\n        \"lng\": 16.32285889099322\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507198372\n}, {\n    \"location\": {\n        \"lat\": 56.65769213958951,\n        \"lng\": 16.322939357263667\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507199950\n}, {\n    \"location\": {\n        \"lat\": 56.657693613838404,\n        \"lng\": 16.32300104807101\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507201551\n}, {\n    \"location\": {\n        \"lat\": 56.65769508808725,\n        \"lng\": 16.323014459116084\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507203210\n}, {\n    \"location\": {\n        \"lat\": 56.65771425331694,\n        \"lng\": 16.323086878759486\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507204687\n}, {\n    \"location\": {\n        \"lat\": 56.657708356324214,\n        \"lng\": 16.323145887357814\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507206222\n}, {\n    \"location\": {\n        \"lat\": 56.657708356324214,\n        \"lng\": 16.323199531538112\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507207762\n}, {\n    \"location\": {\n        \"lat\": 56.65770688207591,\n        \"lng\": 16.32325317571841\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507209614\n}, {\n    \"location\": {\n        \"lat\": 56.657687716842446,\n        \"lng\": 16.323322913152797\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507236459\n}, {\n    \"location\": {\n        \"lat\": 56.657687716842446,\n        \"lng\": 16.323328277570827\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507238543\n}, {\n    \"location\": {\n        \"lat\": 56.657668551599244,\n        \"lng\": 16.323419472677333\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507239422\n}, {\n    \"location\": {\n        \"lat\": 56.65765970609911,\n        \"lng\": 16.32340069721423\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507241280\n}, {\n    \"location\": {\n        \"lat\": 56.65762137557452,\n        \"lng\": 16.323459705812557\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507242757\n}, {\n    \"location\": {\n        \"lat\": 56.6576095815591,\n        \"lng\": 16.323497256738765\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507244217\n}, {\n    \"location\": {\n        \"lat\": 56.65757272523715,\n        \"lng\": 16.323513349992854\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507245835\n}, {\n    \"location\": {\n        \"lat\": 56.657544714408374,\n        \"lng\": 16.3235213966199\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507247420\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.32353212545596\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507249057\n}, {\n    \"location\": {\n        \"lat\": 56.657488692688396,\n        \"lng\": 16.323545536501033\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507250670\n}, {\n    \"location\": {\n        \"lat\": 56.657469527344006,\n        \"lng\": 16.32354285429202\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507252331\n}, {\n    \"location\": {\n        \"lat\": 56.657442990697234,\n        \"lng\": 16.32354285429202\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507254000\n}, {\n    \"location\": {\n        \"lat\": 56.65741055699251,\n        \"lng\": 16.323534807664974\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507255574\n}, {\n    \"location\": {\n        \"lat\": 56.657386968826096,\n        \"lng\": 16.323529443246944\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507257198\n}, {\n    \"location\": {\n        \"lat\": 56.65736190638308,\n        \"lng\": 16.32350530336581\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507259520\n}, {\n    \"location\": {\n        \"lat\": 56.65735306081098,\n        \"lng\": 16.32346238802157\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507261065\n}, {\n    \"location\": {\n        \"lat\": 56.65734863802416,\n        \"lng\": 16.323376557333095\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507262216\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.32334705303393\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507263870\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.323277315599544\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507265154\n}, {\n    \"location\": {\n        \"lat\": 56.65733536966056,\n        \"lng\": 16.32320489595614\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507266296\n}, {\n    \"location\": {\n        \"lat\": 56.6573368439234,\n        \"lng\": 16.323140522939784\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507267703\n}, {\n    \"location\": {\n        \"lat\": 56.657339792448965,\n        \"lng\": 16.323065421087367\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507268850\n}, {\n    \"location\": {\n        \"lat\": 56.657339792448965,\n        \"lng\": 16.323057374460323\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507270125\n}, {\n    \"location\": {\n        \"lat\": 56.657345689499316,\n        \"lng\": 16.32302787016116\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507271348\n}, {\n    \"location\": {\n        \"lat\": 56.65738402030423,\n        \"lng\": 16.323070785505397\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507272810\n}, {\n    \"location\": {\n        \"lat\": 56.65738549456519,\n        \"lng\": 16.323186120493038\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507274340\n}, {\n    \"location\": {\n        \"lat\": 56.6573884430869,\n        \"lng\": 16.323304137689693\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507276467\n}, {\n    \"location\": {\n        \"lat\": 56.657382546043245,\n        \"lng\": 16.323355099660976\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507278202\n}, {\n    \"location\": {\n        \"lat\": 56.657409082732535,\n        \"lng\": 16.323419472677333\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507279920\n}, {\n    \"location\": {\n        \"lat\": 56.65743267088514,\n        \"lng\": 16.323440930349452\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507281630\n}, {\n    \"location\": {\n        \"lat\": 56.6574503619899,\n        \"lng\": 16.3234677524396\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507283352\n}, {\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.323454341394527\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507284589\n}, {\n    \"location\": {\n        \"lat\": 56.657494589715476,\n        \"lng\": 16.32345702360354\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507285838\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.323435565931423\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507287188\n}, {\n    \"location\": {\n        \"lat\": 56.65755355993551,\n        \"lng\": 16.323438248140437\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507288643\n}, {\n    \"location\": {\n        \"lat\": 56.657590416276186,\n        \"lng\": 16.3233953327962\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507291201\n}, {\n    \"location\": {\n        \"lat\": 56.65760810730692,\n        \"lng\": 16.32335778186999\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507292897\n}, {\n    \"location\": {\n        \"lat\": 56.65762874683227,\n        \"lng\": 16.323309502107723\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507295176\n}, {\n    \"location\": {\n        \"lat\": 56.6576420150926,\n        \"lng\": 16.32327463339053\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507296458\n}, {\n    \"location\": {\n        \"lat\": 56.657644963594265,\n        \"lng\": 16.323186120493038\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507298262\n}, {\n    \"location\": {\n        \"lat\": 56.657646437845024,\n        \"lng\": 16.32311101864062\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507300106\n}, {\n    \"location\": {\n        \"lat\": 56.657644963594265,\n        \"lng\": 16.323076149923427\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507301222\n}, {\n    \"location\": {\n        \"lat\": 56.657639066590725,\n        \"lng\": 16.323009094698055\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507302758\n}, {\n    \"location\": {\n        \"lat\": 56.65763169533499,\n        \"lng\": 16.322971543771846\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507303793\n}, {\n    \"location\": {\n        \"lat\": 56.6576199013228,\n        \"lng\": 16.322928628427608\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507305308\n}, {\n    \"location\": {\n        \"lat\": 56.657606633054684,\n        \"lng\": 16.32291253517352\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507306921\n}, {\n    \"location\": {\n        \"lat\": 56.65755945695243,\n        \"lng\": 16.322966179353816\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507308416\n}, {\n    \"location\": {\n        \"lat\": 56.65751228079117,\n        \"lng\": 16.322987637025935\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507309934\n}, {\n    \"location\": {\n        \"lat\": 56.65749606397208,\n        \"lng\": 16.32300104807101\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507311438\n}, {\n    \"location\": {\n        \"lat\": 56.6574503619899,\n        \"lng\": 16.32303323457919\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507312998\n}, {\n    \"location\": {\n        \"lat\": 56.65745331050656,\n        \"lng\": 16.323019823534114\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507314788\n}, {\n    \"location\": {\n        \"lat\": 56.65743856792097,\n        \"lng\": 16.3230171413251\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507316162\n}, {\n    \"location\": {\n        \"lat\": 56.657431196626014,\n        \"lng\": 16.323108336431606\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507317789\n}, {\n    \"location\": {\n        \"lat\": 56.657435619403174,\n        \"lng\": 16.323194167120082\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507319408\n}, {\n    \"location\": {\n        \"lat\": 56.657445939214476,\n        \"lng\": 16.323266586763484\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507320465\n}, {\n    \"location\": {\n        \"lat\": 56.657466578828625,\n        \"lng\": 16.323322913152797\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507321396\n}, {\n    \"location\": {\n        \"lat\": 56.65750785802302,\n        \"lng\": 16.32333095977984\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507322571\n}, {\n    \"location\": {\n        \"lat\": 56.65754324015365,\n        \"lng\": 16.323314866525752\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507323742\n}, {\n    \"location\": {\n        \"lat\": 56.65757567374425,\n        \"lng\": 16.32326390455447\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507324763\n}, {\n    \"location\": {\n        \"lat\": 56.65758599351723,\n        \"lng\": 16.323194167120082\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507325911\n}, {\n    \"location\": {\n        \"lat\": 56.657580096504425,\n        \"lng\": 16.32310565422259\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507327446\n}, {\n    \"location\": {\n        \"lat\": 56.65756535396844,\n        \"lng\": 16.32308419655047\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507328668\n}, {\n    \"location\": {\n        \"lat\": 56.657527023347896,\n        \"lng\": 16.323065421087367\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507329758\n}, {\n    \"location\": {\n        \"lat\": 56.65748721843146,\n        \"lng\": 16.32309492538653\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507331356\n}, {\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.323191484911067\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507332475\n}, {\n    \"location\": {\n        \"lat\": 56.657509332279126,\n        \"lng\": 16.323239764673335\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507334188\n}, {\n    \"location\": {\n        \"lat\": 56.65752112632591,\n        \"lng\": 16.32321026037417\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507335384\n}, {\n    \"location\": {\n        \"lat\": 56.65754324015365,\n        \"lng\": 16.323151251775844\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507336749\n}, {\n    \"location\": {\n        \"lat\": 56.65754176589888,\n        \"lng\": 16.32323171804629\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507339574\n}, {\n    \"location\": {\n        \"lat\": 56.65754618866303,\n        \"lng\": 16.323161980611903\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507342359\n}, {\n    \"location\": {\n        \"lat\": 56.657549137172204,\n        \"lng\": 16.323250493509395\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507344228\n}, {\n    \"location\": {\n        \"lat\": 56.65756093120652,\n        \"lng\": 16.323301455480678\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507345621\n}, {\n    \"location\": {\n        \"lat\": 56.65757714799769,\n        \"lng\": 16.32335241745196\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507346915\n}, {\n    \"location\": {\n        \"lat\": 56.65759926179259,\n        \"lng\": 16.323414108259303\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507348051\n}, {\n    \"location\": {\n        \"lat\": 56.65762137557452,\n        \"lng\": 16.32347848127566\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507349183\n}, {\n    \"location\": {\n        \"lat\": 56.65763611808858,\n        \"lng\": 16.323534807664974\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507350159\n}, {\n    \"location\": {\n        \"lat\": 56.657656757598616,\n        \"lng\": 16.3235938162633\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507351473\n}, {\n    \"location\": {\n        \"lat\": 56.65767002584909,\n        \"lng\": 16.32362063835345\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507352401\n}, {\n    \"location\": {\n        \"lat\": 56.65768034559622,\n        \"lng\": 16.323687693578822\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507353837\n}, {\n    \"location\": {\n        \"lat\": 56.65768181984558,\n        \"lng\": 16.32374670217715\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507354822\n}, {\n    \"location\": {\n        \"lat\": 56.65768329409489,\n        \"lng\": 16.323813757402522\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507356490\n}]";
var cords_hours = "[{\"location\":{\"lat\":56.65731472997458,\"lng\":16.321155688268764},\"weight\":1,\"timestamp\":1586506818628},{\"location\":{\"lat\":56.65732947260858,\"lng\":16.321201285822017},\"weight\":1,\"timestamp\":1586506879346},{\"location\":{\"lat\":56.65734716376178,\"lng\":16.32125761221133},\"weight\":1,\"timestamp\":1586506939924},{\"location\":{\"lat\":56.65736190638308,\"lng\":16.321316620809657},\"weight\":1,\"timestamp\":1586507000525},{\"location\":{\"lat\":56.657386968826096,\"lng\":16.32138904045306},\"weight\":1,\"timestamp\":1586507061230},{\"location\":{\"lat\":56.65740760847251,\"lng\":16.321458777887447},\"weight\":1,\"timestamp\":1586507122827},{\"location\":{\"lat\":56.65742529958902,\"lng\":16.32152046869479},\"weight\":1,\"timestamp\":1586507183427},{\"location\":{\"lat\":56.65744741347302,\"lng\":16.321579477293117},\"weight\":1,\"timestamp\":1586507244116},{\"location\":{\"lat\":56.657469527344006,\"lng\":16.32164653251849},\"weight\":1,\"timestamp\":1586507304896},{\"location\":{\"lat\":56.65749016694524,\"lng\":16.32172431657992},\"weight\":1,\"timestamp\":1586507365541},{\"location\":{\"lat\":56.65750343525434,\"lng\":16.32177796076022},\"weight\":1,\"timestamp\":1586507426096},{\"location\":{\"lat\":56.657466578828625,\"lng\":16.321820876104457},\"weight\":1,\"timestamp\":1586507486771},{\"location\":{\"lat\":56.65744004217979,\"lng\":16.321775278551204},\"weight\":1,\"timestamp\":1586507547567},{\"location\":{\"lat\":56.65742529958902,\"lng\":16.321689447862727},\"weight\":1,\"timestamp\":1586507608062},{\"location\":{\"lat\":56.6574002371715,\"lng\":16.32161971042834},\"weight\":1,\"timestamp\":1586507668654},{\"location\":{\"lat\":56.657367803429985,\"lng\":16.32153656194888},\"weight\":1,\"timestamp\":1586507729345},{\"location\":{\"lat\":56.657350112286494,\"lng\":16.32148291776858},\"weight\":1,\"timestamp\":1586507789870},{\"location\":{\"lat\":56.657325049818986,\"lng\":16.32141586254321},\"weight\":1,\"timestamp\":1586507850416},{\"location\":{\"lat\":56.65730588439141,\"lng\":16.321370264989955},\"weight\":1,\"timestamp\":1586507911016},{\"location\":{\"lat\":56.65728082189451,\"lng\":16.321354171735866},\"weight\":1,\"timestamp\":1586507971542},{\"location\":{\"lat\":56.657254285114924,\"lng\":16.321397087080104},\"weight\":1,\"timestamp\":1586508032134},{\"location\":{\"lat\":56.657198262963306,\"lng\":16.32153119753085},\"weight\":1,\"timestamp\":1586508093290},{\"location\":{\"lat\":56.657154034890084,\"lng\":16.321659943563564},\"weight\":1,\"timestamp\":1586508154984},{\"location\":{\"lat\":56.65721005710739,\"lng\":16.321474871141536},\"weight\":1,\"timestamp\":1586508215989},{\"location\":{\"lat\":56.65716435477848,\"lng\":16.321600934965236},\"weight\":1,\"timestamp\":1586508276784},{\"location\":{\"lat\":56.65712307520794,\"lng\":16.32173504541598},\"weight\":1,\"timestamp\":1586508337414},{\"location\":{\"lat\":56.65708474413767,\"lng\":16.321863791448695},\"weight\":1,\"timestamp\":1586508398738},{\"location\":{\"lat\":56.65709358977274,\"lng\":16.321812829477413},\"weight\":1,\"timestamp\":1586508459642},{\"location\":{\"lat\":56.65705820722007,\"lng\":16.321938893301112},\"weight\":1,\"timestamp\":1586508520542},{\"location\":{\"lat\":56.657036093107784,\"lng\":16.322000584108455},\"weight\":1,\"timestamp\":1586508581569},{\"location\":{\"lat\":56.65702282463418,\"lng\":16.322067639333827},\"weight\":1,\"timestamp\":1586508642784},{\"location\":{\"lat\":56.65704788730261,\"lng\":16.32210787246905},\"weight\":1,\"timestamp\":1586508703744},{\"location\":{\"lat\":56.657074424227496,\"lng\":16.322056910497768},\"weight\":1,\"timestamp\":1586508765049},{\"location\":{\"lat\":56.65709358977274,\"lng\":16.32198717306338},\"weight\":1,\"timestamp\":1586508825942},{\"location\":{\"lat\":56.65711422957979,\"lng\":16.321928164465053},\"weight\":1,\"timestamp\":1586508886999},{\"location\":{\"lat\":56.65713044656315,\"lng\":16.32189866016589},\"weight\":1,\"timestamp\":1586508947771},{\"location\":{\"lat\":56.65714961207989,\"lng\":16.32183428714953},\"weight\":1,\"timestamp\":1586509008530},{\"location\":{\"lat\":56.657180571740234,\"lng\":16.32177259634219},\"weight\":1,\"timestamp\":1586509069436},{\"location\":{\"lat\":56.65720268576776,\"lng\":16.321697494489772},\"weight\":1,\"timestamp\":1586509130464},{\"location\":{\"lat\":56.65723364538453,\"lng\":16.32161971042834},\"weight\":1,\"timestamp\":1586509191845},{\"location\":{\"lat\":56.657248388050235,\"lng\":16.321558019620998},\"weight\":1,\"timestamp\":1586509253029},{\"location\":{\"lat\":56.65726313071019,\"lng\":16.321480235559566},\"weight\":1,\"timestamp\":1586509314012},{\"location\":{\"lat\":56.65728966748355,\"lng\":16.321453413469417},\"weight\":1,\"timestamp\":1586509374763},{\"location\":{\"lat\":56.657311781447085,\"lng\":16.321533879739864},\"weight\":1,\"timestamp\":1586509435594},{\"location\":{\"lat\":56.65732799834543,\"lng\":16.32161434601031},\"weight\":1,\"timestamp\":1586509496629},{\"location\":{\"lat\":56.657345689499316,\"lng\":16.321654579145534},\"weight\":1,\"timestamp\":1586509557416},{\"location\":{\"lat\":56.657367803429985,\"lng\":16.321732363206966},\"weight\":1,\"timestamp\":1586509618205},{\"location\":{\"lat\":56.65738107178216,\"lng\":16.321791371805293},\"weight\":1,\"timestamp\":1586509678999},{\"location\":{\"lat\":56.6574002371715,\"lng\":16.32185038040362},\"weight\":1,\"timestamp\":1586509739704},{\"location\":{\"lat\":56.65739139160839,\"lng\":16.321922800047023},\"weight\":1,\"timestamp\":1586509800432},{\"location\":{\"lat\":56.65734863802416,\"lng\":16.32190938900195},\"weight\":1,\"timestamp\":1586509861174},{\"location\":{\"lat\":56.657332421134676,\"lng\":16.32185574482165},\"weight\":1,\"timestamp\":1586509921865},{\"location\":{\"lat\":56.657320627028874,\"lng\":16.321780642969234},\"weight\":1,\"timestamp\":1586509982599},{\"location\":{\"lat\":56.65729851307053,\"lng\":16.321716269952876},\"weight\":1,\"timestamp\":1586510043387},{\"location\":{\"lat\":56.65728377042442,\"lng\":16.321676036817653},\"weight\":1,\"timestamp\":1586510103986},{\"location\":{\"lat\":56.65727492483398,\"lng\":16.32163580368243},\"weight\":1,\"timestamp\":1586510164639},{\"location\":{\"lat\":56.65724249098464,\"lng\":16.32172431657992},\"weight\":1,\"timestamp\":1586510225570},{\"location\":{\"lat\":56.657224799782334,\"lng\":16.321804782850368},\"weight\":1,\"timestamp\":1586510286589},{\"location\":{\"lat\":56.657213005642845,\"lng\":16.32186110923968},\"weight\":1,\"timestamp\":1586510347212},{\"location\":{\"lat\":56.657190891621376,\"lng\":16.321906706792934},\"weight\":1,\"timestamp\":1586510407840},{\"location\":{\"lat\":56.65717320039485,\"lng\":16.321944257719142},\"weight\":1,\"timestamp\":1586510468464},{\"location\":{\"lat\":56.65715108635001,\"lng\":16.32198180864535},\"weight\":1,\"timestamp\":1586510529072},{\"location\":{\"lat\":56.65713486937557,\"lng\":16.322022041780574},\"weight\":1,\"timestamp\":1586510589678},{\"location\":{\"lat\":56.65711717812273,\"lng\":16.322075685960872},\"weight\":1,\"timestamp\":1586510650264},{\"location\":{\"lat\":56.65709653831731,\"lng\":16.32212396572314},\"weight\":1,\"timestamp\":1586510710901},{\"location\":{\"lat\":56.65708032131938,\"lng\":16.322201749784572},\"weight\":1,\"timestamp\":1586510771636},{\"location\":{\"lat\":56.6570685271347,\"lng\":16.32225002954684},\"weight\":1,\"timestamp\":1586510832312},{\"location\":{\"lat\":56.657064104314486,\"lng\":16.322325131399257},\"weight\":1,\"timestamp\":1586510893415},{\"location\":{\"lat\":56.65706557858795,\"lng\":16.322400233251674},\"weight\":1,\"timestamp\":1586510954412},{\"location\":{\"lat\":56.657074424227496,\"lng\":16.322453877431972},\"weight\":1,\"timestamp\":1586511015304},{\"location\":{\"lat\":56.65708032131938,\"lng\":16.322494110567195},\"weight\":1,\"timestamp\":1586511076016},{\"location\":{\"lat\":56.657086218410335,\"lng\":16.322553119165523},\"weight\":1,\"timestamp\":1586511136655},{\"location\":{\"lat\":56.657098012589486,\"lng\":16.322638949854},\"weight\":1,\"timestamp\":1586511197390},{\"location\":{\"lat\":56.65711570385129,\"lng\":16.322684547407253},\"weight\":1,\"timestamp\":1586511258110},{\"location\":{\"lat\":56.65714518926921,\"lng\":16.322708687288387},\"weight\":1,\"timestamp\":1586511318769},{\"location\":{\"lat\":56.65717172612559,\"lng\":16.322719416124446},\"weight\":1,\"timestamp\":1586511379430},{\"location\":{\"lat\":56.657201211499675,\"lng\":16.32271673391543},\"weight\":1,\"timestamp\":1586511440127},{\"location\":{\"lat\":56.65723217111765,\"lng\":16.322697958452327},\"weight\":1,\"timestamp\":1586511500877},{\"location\":{\"lat\":56.657266079241474,\"lng\":16.322673818571193},\"weight\":1,\"timestamp\":1586511561575},{\"location\":{\"lat\":56.657282296159494,\"lng\":16.322663089735133},\"weight\":1,\"timestamp\":1586511622482},{\"location\":{\"lat\":56.65730146159907,\"lng\":16.32264431427203},\"weight\":1,\"timestamp\":1586511683172},{\"location\":{\"lat\":56.65730883291936,\"lng\":16.322609445554836},\"weight\":1,\"timestamp\":1586511743930},{\"location\":{\"lat\":56.65728966748355,\"lng\":16.3225853056737},\"weight\":1,\"timestamp\":1586511804650},{\"location\":{\"lat\":56.657266079241474,\"lng\":16.32259603450976},\"weight\":1,\"timestamp\":1586511865527},{\"location\":{\"lat\":56.657243965251126,\"lng\":16.322614809972865},\"weight\":1,\"timestamp\":1586511926172},{\"location\":{\"lat\":56.657213005642845,\"lng\":16.322620174390895},\"weight\":1,\"timestamp\":1586511986825},{\"location\":{\"lat\":56.65719236588987,\"lng\":16.32262285659991},\"weight\":1,\"timestamp\":1586512047462},{\"location\":{\"lat\":56.657161406239204,\"lng\":16.322609445554836},\"weight\":1,\"timestamp\":1586512108085},{\"location\":{\"lat\":56.657137817916876,\"lng\":16.32261212776385},\"weight\":1,\"timestamp\":1586512168910},{\"location\":{\"lat\":56.65712454947911,\"lng\":16.322577259046657},\"weight\":1,\"timestamp\":1586512229477},{\"location\":{\"lat\":56.65711570385129,\"lng\":16.32251825044833},\"weight\":1,\"timestamp\":1586512290207},{\"location\":{\"lat\":56.65711128103663,\"lng\":16.322437784177882},\"weight\":1,\"timestamp\":1586512350790},{\"location\":{\"lat\":56.65711275530824,\"lng\":16.32236536453448},\"weight\":1,\"timestamp\":1586512411475},{\"location\":{\"lat\":56.65710538394958,\"lng\":16.322322449190242},\"weight\":1,\"timestamp\":1586512472262},{\"location\":{\"lat\":56.65710980676495,\"lng\":16.3222607583829},\"weight\":1,\"timestamp\":1586512532815},{\"location\":{\"lat\":56.65712012666546,\"lng\":16.32221784303866},\"weight\":1,\"timestamp\":1586512593455},{\"location\":{\"lat\":56.65713486937557,\"lng\":16.322177609903438},\"weight\":1,\"timestamp\":1586512654037},{\"location\":{\"lat\":56.65715108635001,\"lng\":16.32210787246905},\"weight\":1,\"timestamp\":1586512714939},{\"location\":{\"lat\":56.657174674664056,\"lng\":16.322051546079738},\"weight\":1,\"timestamp\":1586512775530},{\"location\":{\"lat\":56.6572056343038,\"lng\":16.322005948526485},\"weight\":1,\"timestamp\":1586512836114},{\"location\":{\"lat\":56.65721595417806,\"lng\":16.32198180864535},\"weight\":1,\"timestamp\":1586512896905},{\"location\":{\"lat\":56.657243965251126,\"lng\":16.321901342374904},\"weight\":1,\"timestamp\":1586512957510},{\"location\":{\"lat\":56.65726018217865,\"lng\":16.321842333776576},\"weight\":1,\"timestamp\":1586513018141},{\"location\":{\"lat\":56.657277873364364,\"lng\":16.32179405401431},\"weight\":1,\"timestamp\":1586513078793},{\"location\":{\"lat\":56.6572911417482,\"lng\":16.32186647365771},\"weight\":1,\"timestamp\":1586513140137},{\"location\":{\"lat\":56.65730883291936,\"lng\":16.321936211092098},\"weight\":1,\"timestamp\":1586513201096},{\"location\":{\"lat\":56.65725870791281,\"lng\":16.322016677362544},\"weight\":1,\"timestamp\":1586513262709},{\"location\":{\"lat\":56.657266079241474,\"lng\":16.321973762018306},\"weight\":1,\"timestamp\":1586513324359},{\"location\":{\"lat\":56.657226274049506,\"lng\":16.322078368169887},\"weight\":1,\"timestamp\":1586513385350},{\"location\":{\"lat\":56.65720268576776,\"lng\":16.322126647932155},\"weight\":1,\"timestamp\":1586513446752},{\"location\":{\"lat\":56.657190891621376,\"lng\":16.32215615223132},\"weight\":1,\"timestamp\":1586513507630},{\"location\":{\"lat\":56.65717909747128,\"lng\":16.322199067575557},\"weight\":1,\"timestamp\":1586513568288},{\"location\":{\"lat\":56.65716730331749,\"lng\":16.32223930071078},\"weight\":1,\"timestamp\":1586513628972},{\"location\":{\"lat\":56.65715993196949,\"lng\":16.32227685163699},\"weight\":1,\"timestamp\":1586513689615},{\"location\":{\"lat\":56.657154034890084,\"lng\":16.3223331780263},\"weight\":1,\"timestamp\":1586513750307},{\"location\":{\"lat\":56.657154034890084,\"lng\":16.32238145778857},\"weight\":1,\"timestamp\":1586513810965},{\"location\":{\"lat\":56.65715550916002,\"lng\":16.322421690923793},\"weight\":1,\"timestamp\":1586513871595},{\"location\":{\"lat\":56.65715993196949,\"lng\":16.32246460626803},\"weight\":1,\"timestamp\":1586513932225},{\"location\":{\"lat\":56.65716582904801,\"lng\":16.32250215719424},\"weight\":1,\"timestamp\":1586513993015},{\"location\":{\"lat\":56.657174674664056,\"lng\":16.32252897928439},\"weight\":1,\"timestamp\":1586514053839},{\"location\":{\"lat\":56.657201211499675,\"lng\":16.322550436956508},\"weight\":1,\"timestamp\":1586514114438},{\"location\":{\"lat\":56.65722774831662,\"lng\":16.322542390329463},\"weight\":1,\"timestamp\":1586514175127},{\"location\":{\"lat\":56.65726755350704,\"lng\":16.32252361486636},\"weight\":1,\"timestamp\":1586514235961},{\"location\":{\"lat\":56.657288193218854,\"lng\":16.322504839403255},\"weight\":1,\"timestamp\":1586514296658},{\"location\":{\"lat\":56.65728966748355,\"lng\":16.322448513013942},\"weight\":1,\"timestamp\":1586514357492},{\"location\":{\"lat\":56.65729851307053,\"lng\":16.32239755104266},\"weight\":1,\"timestamp\":1586514418467},{\"location\":{\"lat\":56.65730883291936,\"lng\":16.322357317907436},\"weight\":1,\"timestamp\":1586514479202},{\"location\":{\"lat\":56.657319152765396,\"lng\":16.322274169427974},\"weight\":1,\"timestamp\":1586514540011},{\"location\":{\"lat\":56.65732799834543,\"lng\":16.322201749784572},\"weight\":1,\"timestamp\":1586514600762},{\"location\":{\"lat\":56.6573383181862,\"lng\":16.32214542339526},\"weight\":1,\"timestamp\":1586514661512},{\"location\":{\"lat\":56.657344215236805,\"lng\":16.32209177921496},\"weight\":1,\"timestamp\":1586514722185},{\"location\":{\"lat\":56.657341266711626,\"lng\":16.322059592706783},\"weight\":1,\"timestamp\":1586514783171},{\"location\":{\"lat\":56.65733389539764,\"lng\":16.322011312944515},\"weight\":1,\"timestamp\":1586514843798},{\"location\":{\"lat\":56.65731030718325,\"lng\":16.322005948526485},\"weight\":1,\"timestamp\":1586514904518},{\"location\":{\"lat\":56.65729703880619,\"lng\":16.32202472398959},\"weight\":1,\"timestamp\":1586514965163},{\"location\":{\"lat\":56.657279347629455,\"lng\":16.322059592706783},\"weight\":1,\"timestamp\":1586515025930},{\"location\":{\"lat\":56.65727197630338,\"lng\":16.32209177921496},\"weight\":1,\"timestamp\":1586515086550},{\"location\":{\"lat\":56.65724986231649,\"lng\":16.322132012350185},\"weight\":1,\"timestamp\":1586515147301},{\"location\":{\"lat\":56.657235119651375,\"lng\":16.322204431993587},\"weight\":1,\"timestamp\":1586515207976},{\"location\":{\"lat\":56.657224799782334,\"lng\":16.322252711755855},\"weight\":1,\"timestamp\":1586515268620},{\"location\":{\"lat\":56.65721595417806,\"lng\":16.322290262682063},\"weight\":1,\"timestamp\":1586515329393},{\"location\":{\"lat\":56.65721153137515,\"lng\":16.322335860235317},\"weight\":1,\"timestamp\":1586515390053},{\"location\":{\"lat\":56.6572056343038,\"lng\":16.322405597669704},\"weight\":1,\"timestamp\":1586515450728},{\"location\":{\"lat\":56.65721005710739,\"lng\":16.322445830804927},\"weight\":1,\"timestamp\":1586515511425},{\"location\":{\"lat\":56.6572174284456,\"lng\":16.32246997068606},\"weight\":1,\"timestamp\":1586515572306},{\"location\":{\"lat\":56.65724543951755,\"lng\":16.322456559640987},\"weight\":1,\"timestamp\":1586515633060},{\"location\":{\"lat\":56.65724691378393,\"lng\":16.32239755104266},\"weight\":1,\"timestamp\":1586515693713},{\"location\":{\"lat\":56.657251336582696,\"lng\":16.322346589071376},\"weight\":1,\"timestamp\":1586515754455},{\"location\":{\"lat\":56.65726165644445,\"lng\":16.32228221605502},\"weight\":1,\"timestamp\":1586515815168},{\"location\":{\"lat\":56.657277873364364,\"lng\":16.32221784303866},\"weight\":1,\"timestamp\":1586515875783},{\"location\":{\"lat\":56.6572911417482,\"lng\":16.32216151664935},\"weight\":1,\"timestamp\":1586515936548},{\"location\":{\"lat\":56.657304410127345,\"lng\":16.32210787246905},\"weight\":1,\"timestamp\":1586515997163},{\"location\":{\"lat\":56.65736485490666,\"lng\":16.32202472398959},\"weight\":1,\"timestamp\":1586516058597},{\"location\":{\"lat\":56.65740760847251,\"lng\":16.321995219690425},\"weight\":1,\"timestamp\":1586516120270},{\"location\":{\"lat\":56.657435619403174,\"lng\":16.321957668764217},\"weight\":1,\"timestamp\":1586516181830},{\"location\":{\"lat\":56.657468053086355,\"lng\":16.321930846674068},\"weight\":1,\"timestamp\":1586516242578},{\"location\":{\"lat\":56.65749753822867,\"lng\":16.321925482256038},\"weight\":1,\"timestamp\":1586516303433},{\"location\":{\"lat\":56.65752112632591,\"lng\":16.321941575510127},\"weight\":1,\"timestamp\":1586516364115},{\"location\":{\"lat\":56.65754324015365,\"lng\":16.32198717306338},\"weight\":1,\"timestamp\":1586516424798},{\"location\":{\"lat\":56.65753586887918,\"lng\":16.32186110923968},\"weight\":1,\"timestamp\":1586516486321},{\"location\":{\"lat\":56.6575815707577,\"lng\":16.322005948526485},\"weight\":1,\"timestamp\":1586516547657},{\"location\":{\"lat\":56.65757567374425,\"lng\":16.321941575510127},\"weight\":1,\"timestamp\":1586516608633},{\"location\":{\"lat\":56.657593364781874,\"lng\":16.32209714363299},\"weight\":1,\"timestamp\":1586516669440},{\"location\":{\"lat\":56.6576228498262,\"lng\":16.322148105604274},\"weight\":1,\"timestamp\":1586516731377},{\"location\":{\"lat\":56.65763611808858,\"lng\":16.322209796411617},\"weight\":1,\"timestamp\":1586516792080},{\"location\":{\"lat\":56.657644963594265,\"lng\":16.32222320745669},\"weight\":1,\"timestamp\":1586516853035},{\"location\":{\"lat\":56.65766118034928,\"lng\":16.322295627100093},\"weight\":1,\"timestamp\":1586516913745},{\"location\":{\"lat\":56.657675922847794,\"lng\":16.322362682325465},\"weight\":1,\"timestamp\":1586516974390},{\"location\":{\"lat\":56.65768919109152,\"lng\":16.322421690923793},\"weight\":1,\"timestamp\":1586517035290},{\"location\":{\"lat\":56.65770245933058,\"lng\":16.322467288477046},\"weight\":1,\"timestamp\":1586517095875},{\"location\":{\"lat\":56.65771867606086,\"lng\":16.32253970812045},\"weight\":1,\"timestamp\":1586517156714},{\"location\":{\"lat\":56.65773047004213,\"lng\":16.32260676334582},\"weight\":1,\"timestamp\":1586517221605},{\"location\":{\"lat\":56.657749635253865,\"lng\":16.322684547407253},\"weight\":1,\"timestamp\":1586517283610},{\"location\":{\"lat\":56.65776142922546,\"lng\":16.322783789140804},\"weight\":1,\"timestamp\":1586517344839},{\"location\":{\"lat\":56.65778796564805,\"lng\":16.322920581800563},\"weight\":1,\"timestamp\":1586517407667},{\"location\":{\"lat\":56.6577805944214,\"lng\":16.322883030874355},\"weight\":1,\"timestamp\":1586517468475},{\"location\":{\"lat\":56.657796811118104,\"lng\":16.32298495481692},\"weight\":1,\"timestamp\":1586517529467},{\"location\":{\"lat\":56.657808605074926,\"lng\":16.32303859899722},\"weight\":1,\"timestamp\":1586517590592},{\"location\":{\"lat\":56.65781597629607,\"lng\":16.323086878759486},\"weight\":1,\"timestamp\":1586517651168},{\"location\":{\"lat\":56.65782334751578,\"lng\":16.3231432051488},\"weight\":1,\"timestamp\":1586517712195},{\"location\":{\"lat\":56.65782187327197,\"lng\":16.323183438284023},\"weight\":1,\"timestamp\":1586517772983},{\"location\":{\"lat\":56.657817450540136,\"lng\":16.32322635362826},\"weight\":1,\"timestamp\":1586517833695},{\"location\":{\"lat\":56.65781450205198,\"lng\":16.32327463339053},\"weight\":1,\"timestamp\":1586517894430},{\"location\":{\"lat\":56.657807130830534,\"lng\":16.323312184316737},\"weight\":1,\"timestamp\":1586517955113},{\"location\":{\"lat\":56.65778796564805,\"lng\":16.32337923954211},\"weight\":1,\"timestamp\":1586518015897},{\"location\":{\"lat\":56.65777617168476,\"lng\":16.323427519304378},\"weight\":1,\"timestamp\":1586518076578},{\"location\":{\"lat\":56.657765851963866,\"lng\":16.323481163484676},\"weight\":1,\"timestamp\":1586518137168},{\"location\":{\"lat\":56.65776142922546,\"lng\":16.32351066778384},\"weight\":1,\"timestamp\":1586518197888},{\"location\":{\"lat\":56.657749635253865,\"lng\":16.323553583128078},\"weight\":1,\"timestamp\":1586518258827},{\"location\":{\"lat\":56.65774373826668,\"lng\":16.32358308742724},\"weight\":1,\"timestamp\":1586518319635},{\"location\":{\"lat\":56.65773931552568,\"lng\":16.323591134054286},\"weight\":1,\"timestamp\":1586518380425},{\"location\":{\"lat\":56.65770245933058,\"lng\":16.323634049398525},\"weight\":1,\"timestamp\":1586518441828},{\"location\":{\"lat\":56.657662654599406,\"lng\":16.32365282486163},\"weight\":1,\"timestamp\":1586518503477},{\"location\":{\"lat\":56.65764054084168,\"lng\":16.323666235906703},\"weight\":1,\"timestamp\":1586518564450},{\"location\":{\"lat\":56.657605158802376,\"lng\":16.323668918115718},\"weight\":1,\"timestamp\":1586518625238},{\"location\":{\"lat\":56.657580096504425,\"lng\":16.323690375787837},\"weight\":1,\"timestamp\":1586518686507},{\"location\":{\"lat\":56.6575506114267,\"lng\":16.323685011369808},\"weight\":1,\"timestamp\":1586518747323},{\"location\":{\"lat\":56.65751375504709,\"lng\":16.323701104623897},\"weight\":1,\"timestamp\":1586518808193},{\"location\":{\"lat\":56.65748426991748,\"lng\":16.323703786832912},\"weight\":1,\"timestamp\":1586518868935},{\"location\":{\"lat\":56.65746215605512,\"lng\":16.32371451566897},\"weight\":1,\"timestamp\":1586518930115},{\"location\":{\"lat\":56.6574208768107,\"lng\":16.32373060892306},\"weight\":1,\"timestamp\":1586518991622},{\"location\":{\"lat\":56.65739139160839,\"lng\":16.323733291132076},\"weight\":1,\"timestamp\":1586519052874},{\"location\":{\"lat\":56.6573368439234,\"lng\":16.323727926714046},\"weight\":1,\"timestamp\":1586519114824},{\"location\":{\"lat\":56.657292616012775,\"lng\":16.323687693578822},\"weight\":1,\"timestamp\":1586519177262},{\"location\":{\"lat\":56.65728377042442,\"lng\":16.323607227308376},\"weight\":1,\"timestamp\":1586519240142},{\"location\":{\"lat\":56.65727050203799,\"lng\":16.32353212545596},\"weight\":1,\"timestamp\":1586519302753},{\"location\":{\"lat\":56.65726313071019,\"lng\":16.323438248140437},\"weight\":1,\"timestamp\":1586519364545},{\"location\":{\"lat\":56.65726018217865,\"lng\":16.323360464079006},\"weight\":1,\"timestamp\":1586519426351},{\"location\":{\"lat\":56.657254285114924,\"lng\":16.323223671419246},\"weight\":1,\"timestamp\":1586519488325},{\"location\":{\"lat\":56.65724986231649,\"lng\":16.323151251775844},\"weight\":1,\"timestamp\":1586519549359},{\"location\":{\"lat\":56.657243965251126,\"lng\":16.323054692251308},\"weight\":1,\"timestamp\":1586519611152},{\"location\":{\"lat\":56.657279347629455,\"lng\":16.323046645624263},\"weight\":1,\"timestamp\":1586519673364},{\"location\":{\"lat\":56.65728966748355,\"lng\":16.323140522939784},\"weight\":1,\"timestamp\":1586519734338},{\"location\":{\"lat\":56.65729556454177,\"lng\":16.323199531538112},\"weight\":1,\"timestamp\":1586519795028},{\"location\":{\"lat\":56.65729851307053,\"lng\":16.323255857927425},\"weight\":1,\"timestamp\":1586519855883},{\"location\":{\"lat\":56.65729851307053,\"lng\":16.323293408853633},\"weight\":1,\"timestamp\":1586519916719},{\"location\":{\"lat\":56.65730735865543,\"lng\":16.32335778186999},\"weight\":1,\"timestamp\":1586519977773},{\"location\":{\"lat\":56.65730883291936,\"lng\":16.32341679046832},\"weight\":1,\"timestamp\":1586520038973},{\"location\":{\"lat\":56.657311781447085,\"lng\":16.323440930349452},\"weight\":1,\"timestamp\":1586520099655},{\"location\":{\"lat\":56.65732357555569,\"lng\":16.323497256738765},\"weight\":1,\"timestamp\":1586520160630},{\"location\":{\"lat\":56.657325049818986,\"lng\":16.323540172083003},\"weight\":1,\"timestamp\":1586520221475},{\"location\":{\"lat\":56.657332421134676,\"lng\":16.323561629755122},\"weight\":1,\"timestamp\":1586520282004},{\"location\":{\"lat\":56.657342740974244,\"lng\":16.323591134054286},\"weight\":1,\"timestamp\":1586520342896},{\"location\":{\"lat\":56.65735895785928,\"lng\":16.323650142652614},\"weight\":1,\"timestamp\":1586520404155},{\"location\":{\"lat\":56.65739728865071,\"lng\":16.323639413816554},\"weight\":1,\"timestamp\":1586520465423},{\"location\":{\"lat\":56.657431196626014,\"lng\":16.32363673160754},\"weight\":1,\"timestamp\":1586520526450},{\"location\":{\"lat\":56.657463630313025,\"lng\":16.323628684980495},\"weight\":1,\"timestamp\":1586520587448},{\"location\":{\"lat\":56.65748132140324,\"lng\":16.32362063835345},\"weight\":1,\"timestamp\":1586520648258},{\"location\":{\"lat\":56.657515229302966,\"lng\":16.323612591726405},\"weight\":1,\"timestamp\":1586520709270},{\"location\":{\"lat\":56.65755503418983,\"lng\":16.32360990951739},\"weight\":1,\"timestamp\":1586520770260},{\"location\":{\"lat\":56.6576095815591,\"lng\":16.323591134054286},\"weight\":1,\"timestamp\":1586520833277},{\"location\":{\"lat\":56.657647912095705,\"lng\":16.323572358591182},\"weight\":1,\"timestamp\":1586520895039},{\"location\":{\"lat\":56.65767887134682,\"lng\":16.32354285429202},\"weight\":1,\"timestamp\":1586520956050},{\"location\":{\"lat\":56.65769951083341,\"lng\":16.32349457452975},\"weight\":1,\"timestamp\":1586521017078},{\"location\":{\"lat\":56.65771277906886,\"lng\":16.3234677524396},\"weight\":1,\"timestamp\":1586521078135},{\"location\":{\"lat\":56.657728995794685,\"lng\":16.323422154886348},\"weight\":1,\"timestamp\":1586521139058},{\"location\":{\"lat\":56.65773784127857,\"lng\":16.32334705303393},\"weight\":1,\"timestamp\":1586521200153},{\"location\":{\"lat\":56.65774521251357,\"lng\":16.323293408853633},\"weight\":1,\"timestamp\":1586521260970},{\"location\":{\"lat\":56.657765851963866,\"lng\":16.3232156247922},\"weight\":1,\"timestamp\":1586521322488},{\"location\":{\"lat\":56.657768800455806,\"lng\":16.323178073865993},\"weight\":1,\"timestamp\":1586521383355},{\"location\":{\"lat\":56.657768800455806,\"lng\":16.323097607595546},\"weight\":1,\"timestamp\":1586521444293},{\"location\":{\"lat\":56.6577584807329,\"lng\":16.32302787016116},\"weight\":1,\"timestamp\":1586521505276},{\"location\":{\"lat\":56.657749635253865,\"lng\":16.322966179353816},\"weight\":1,\"timestamp\":1586521566528},{\"location\":{\"lat\":56.6577363670314,\"lng\":16.322928628427608},\"weight\":1,\"timestamp\":1586521627498},{\"location\":{\"lat\":56.65772752154718,\"lng\":16.32285889099322},\"weight\":1,\"timestamp\":1586521688531},{\"location\":{\"lat\":56.65771425331694,\"lng\":16.322799882394893},\"weight\":1,\"timestamp\":1586521749247},{\"location\":{\"lat\":56.65769951083341,\"lng\":16.322730144960506},\"weight\":1,\"timestamp\":1586521810173},{\"location\":{\"lat\":56.65768624259332,\"lng\":16.322676500780208},\"weight\":1,\"timestamp\":1586521871598},{\"location\":{\"lat\":56.65767297434857,\"lng\":16.322604081136806},\"weight\":1,\"timestamp\":1586521932625},{\"location\":{\"lat\":56.65765528334827,\"lng\":16.322547754747493},\"weight\":1,\"timestamp\":1586521993544},{\"location\":{\"lat\":56.65764938634633,\"lng\":16.322499474985225},\"weight\":1,\"timestamp\":1586522055250},{\"location\":{\"lat\":56.65763759233967,\"lng\":16.322416326505763},\"weight\":1,\"timestamp\":1586522115978},{\"location\":{\"lat\":56.657618427071,\"lng\":16.32237609337054},\"weight\":1,\"timestamp\":1586522177015},{\"location\":{\"lat\":56.657600736045126,\"lng\":16.322300991518123},\"weight\":1,\"timestamp\":1586522238220},{\"location\":{\"lat\":56.65758599351723,\"lng\":16.322241982919795},\"weight\":1,\"timestamp\":1586522299317},{\"location\":{\"lat\":56.657569776729844,\"lng\":16.322185656530483},\"weight\":1,\"timestamp\":1586522360388},{\"location\":{\"lat\":56.65755798269829,\"lng\":16.322158834440334},\"weight\":1,\"timestamp\":1586522421157},{\"location\":{\"lat\":56.65754176589888,\"lng\":16.32211323688708},\"weight\":1,\"timestamp\":1586522481865},{\"location\":{\"lat\":56.65752554909248,\"lng\":16.322083732587917},\"weight\":1,\"timestamp\":1586522543153},{\"location\":{\"lat\":56.65749606397208,\"lng\":16.322064957124812},\"weight\":1,\"timestamp\":1586522603884},{\"location\":{\"lat\":56.657468053086355,\"lng\":16.322062274915798},\"weight\":1,\"timestamp\":1586522664979},{\"location\":{\"lat\":56.6574002371715,\"lng\":16.322153470022304},\"weight\":1,\"timestamp\":1586522728482},{\"location\":{\"lat\":56.657406134212444,\"lng\":16.32210250805102},\"weight\":1,\"timestamp\":1586522790005},{\"location\":{\"lat\":56.65737959752104,\"lng\":16.322209796411617},\"weight\":1,\"timestamp\":1586522850895},{\"location\":{\"lat\":56.657367803429985,\"lng\":16.32227685163699},\"weight\":1,\"timestamp\":1586522911855},{\"location\":{\"lat\":56.657375174737346,\"lng\":16.32221784303866},\"weight\":1,\"timestamp\":1586522972785},{\"location\":{\"lat\":56.65735748359728,\"lng\":16.32228221605502},\"weight\":1,\"timestamp\":1586523033464},{\"location\":{\"lat\":56.65734863802416,\"lng\":16.32235463569842},\"weight\":1,\"timestamp\":1586523094450},{\"location\":{\"lat\":56.657341266711626,\"lng\":16.322427055341823},\"weight\":1,\"timestamp\":1586523155125},{\"location\":{\"lat\":56.65734863802416,\"lng\":16.322494110567195},\"weight\":1,\"timestamp\":1586523216692},{\"location\":{\"lat\":56.657345689499316,\"lng\":16.322579941255672},\"weight\":1,\"timestamp\":1586523277929},{\"location\":{\"lat\":56.657370751953096,\"lng\":16.32262285659991},\"weight\":1,\"timestamp\":1586523339001},{\"location\":{\"lat\":56.65735306081098,\"lng\":16.322697958452327},\"weight\":1,\"timestamp\":1586523400134},{\"location\":{\"lat\":56.657311781447085,\"lng\":16.32273819158755},\"weight\":1,\"timestamp\":1586523460848},{\"location\":{\"lat\":56.65726018217865,\"lng\":16.32277037809573},\"weight\":1,\"timestamp\":1586523522205},{\"location\":{\"lat\":56.65723364538453,\"lng\":16.322789153558833},\"weight\":1,\"timestamp\":1586523583165},{\"location\":{\"lat\":56.657186468815524,\"lng\":16.322821340067012},\"weight\":1,\"timestamp\":1586523644376},{\"location\":{\"lat\":56.65719236588987,\"lng\":16.322893759710414},\"weight\":1,\"timestamp\":1586523705595},{\"location\":{\"lat\":56.65721890271305,\"lng\":16.322925946218593},\"weight\":1,\"timestamp\":1586523774528},{\"location\":{\"lat\":56.657254285114924,\"lng\":16.3228910775014},\"weight\":1,\"timestamp\":1586523835808},{\"location\":{\"lat\":56.657299987334824,\"lng\":16.322872302038295},\"weight\":1,\"timestamp\":1586523896918},{\"location\":{\"lat\":56.65733536966056,\"lng\":16.32284816215716},\"weight\":1,\"timestamp\":1586523957729},{\"location\":{\"lat\":56.657367803429985,\"lng\":16.32283206890307},\"weight\":1,\"timestamp\":1586524018875},{\"location\":{\"lat\":56.65739728865071,\"lng\":16.322818657857997},\"weight\":1,\"timestamp\":1586524079613},{\"location\":{\"lat\":56.65744151643854,\"lng\":16.322799882394893},\"weight\":1,\"timestamp\":1586524140563},{\"location\":{\"lat\":56.65747689863146,\"lng\":16.32278647134982},\"weight\":1,\"timestamp\":1586524201613},{\"location\":{\"lat\":56.65751080653517,\"lng\":16.322762331468684},\"weight\":1,\"timestamp\":1586524262378},{\"location\":{\"lat\":56.65754029164405,\"lng\":16.322746238214595},\"weight\":1,\"timestamp\":1586524323264},{\"location\":{\"lat\":56.6575668282223,\"lng\":16.32273819158755},\"weight\":1,\"timestamp\":1586524384223},{\"location\":{\"lat\":56.65759631328736,\"lng\":16.322719416124446},\"weight\":1,\"timestamp\":1586524445086},{\"location\":{\"lat\":56.657618427071,\"lng\":16.322695276243312},\"weight\":1,\"timestamp\":1586524506113},{\"location\":{\"lat\":56.65763464383744,\"lng\":16.322681865198238},\"weight\":1,\"timestamp\":1586524567036},{\"location\":{\"lat\":56.65764054084168,\"lng\":16.32266040752612},\"weight\":1,\"timestamp\":1586524628139},{\"location\":{\"lat\":56.65763169533499,\"lng\":16.322593352300746},\"weight\":1,\"timestamp\":1586524688922},{\"location\":{\"lat\":56.657606633054684,\"lng\":16.32253970812045},\"weight\":1,\"timestamp\":1586524750218},{\"location\":{\"lat\":56.6575845192641,\"lng\":16.32246997068606},\"weight\":1,\"timestamp\":1586524816750},{\"location\":{\"lat\":56.65756240546056,\"lng\":16.322545072538478},\"weight\":1,\"timestamp\":1586524881744},{\"location\":{\"lat\":56.65761547856727,\"lng\":16.32246997068606},\"weight\":1,\"timestamp\":1586524943155},{\"location\":{\"lat\":56.65757419949074,\"lng\":16.32238145778857},\"weight\":1,\"timestamp\":1586525004151},{\"location\":{\"lat\":56.65755208568114,\"lng\":16.322303673727138},\"weight\":1,\"timestamp\":1586525065230},{\"location\":{\"lat\":56.65753439462409,\"lng\":16.3222607583829},\"weight\":1,\"timestamp\":1586525126043},{\"location\":{\"lat\":56.65750785802302,\"lng\":16.3222071142026},\"weight\":1,\"timestamp\":1586525187083},{\"location\":{\"lat\":56.65747395011666,\"lng\":16.322193703157527},\"weight\":1,\"timestamp\":1586525248141},{\"location\":{\"lat\":56.65745331050656,\"lng\":16.322204431993587},\"weight\":1,\"timestamp\":1586525309440},{\"location\":{\"lat\":56.65743267088514,\"lng\":16.322258076173885},\"weight\":1,\"timestamp\":1586525370322},{\"location\":{\"lat\":56.657417928291494,\"lng\":16.322314402563197},\"weight\":1,\"timestamp\":1586525431366},{\"location\":{\"lat\":56.65741497977207,\"lng\":16.32237609337054},\"weight\":1,\"timestamp\":1586525492461},{\"location\":{\"lat\":56.657409082732535,\"lng\":16.322429737550838},\"weight\":1,\"timestamp\":1586525553376},{\"location\":{\"lat\":56.65740760847251,\"lng\":16.32246997068606},\"weight\":1,\"timestamp\":1586525614284},{\"location\":{\"lat\":56.65741055699251,\"lng\":16.32253434370242},\"weight\":1,\"timestamp\":1586525675401},{\"location\":{\"lat\":56.65745331050656,\"lng\":16.32253970812045},\"weight\":1,\"timestamp\":1586525736904},{\"location\":{\"lat\":56.657457733281085,\"lng\":16.322472652895076},\"weight\":1,\"timestamp\":1586525797885},{\"location\":{\"lat\":56.65746215605512,\"lng\":16.32240291546069},\"weight\":1,\"timestamp\":1586525858949},{\"location\":{\"lat\":56.657469527344006,\"lng\":16.322351953489406},\"weight\":1,\"timestamp\":1586525919886},{\"location\":{\"lat\":56.65747837288878,\"lng\":16.322290262682063},\"weight\":1,\"timestamp\":1586525981094},{\"location\":{\"lat\":56.65749606397208,\"lng\":16.32228758047305},\"weight\":1,\"timestamp\":1586526041979},{\"location\":{\"lat\":56.657499012485175,\"lng\":16.322258076173885},\"weight\":1,\"timestamp\":1586526103555},{\"location\":{\"lat\":56.65751228079117,\"lng\":16.322325131399257},\"weight\":1,\"timestamp\":1586526164259},{\"location\":{\"lat\":56.657527023347896,\"lng\":16.32241364429675},\"weight\":1,\"timestamp\":1586526225399},{\"location\":{\"lat\":56.65751817781455,\"lng\":16.322435101968868},\"weight\":1,\"timestamp\":1586526286876},{\"location\":{\"lat\":56.65751817781455,\"lng\":16.322483381731136},\"weight\":1,\"timestamp\":1586526348137},{\"location\":{\"lat\":56.65750048674163,\"lng\":16.32251825044833},\"weight\":1,\"timestamp\":1586526408890},{\"location\":{\"lat\":56.65750048674163,\"lng\":16.322550436956508},\"weight\":1,\"timestamp\":1586526469959},{\"location\":{\"lat\":56.65749606397208,\"lng\":16.322571894628627},\"weight\":1,\"timestamp\":1586526531166},{\"location\":{\"lat\":56.65751375504709,\"lng\":16.32259067009173},\"weight\":1,\"timestamp\":1586526592299},{\"location\":{\"lat\":56.65755208568114,\"lng\":16.322636267644985},\"weight\":1,\"timestamp\":1586526656065},{\"location\":{\"lat\":56.657588942023274,\"lng\":16.32264967869006},\"weight\":1,\"timestamp\":1586526718622},{\"location\":{\"lat\":56.65752407483702,\"lng\":16.322687229616268},\"weight\":1,\"timestamp\":1586526780258},{\"location\":{\"lat\":56.65748721843146,\"lng\":16.322689911825282},\"weight\":1,\"timestamp\":1586526841382},{\"location\":{\"lat\":56.65747395011666,\"lng\":16.322646996481044},\"weight\":1,\"timestamp\":1586526903296},{\"location\":{\"lat\":56.65745625902295,\"lng\":16.32261749218188},\"weight\":1,\"timestamp\":1586526964704},{\"location\":{\"lat\":56.65741497977207,\"lng\":16.32261749218188},\"weight\":1,\"timestamp\":1586527026963},{\"location\":{\"lat\":56.65742235107019,\"lng\":16.322689911825282},\"weight\":1,\"timestamp\":1586527091553},{\"location\":{\"lat\":56.657435619403174,\"lng\":16.32272209833346},\"weight\":1,\"timestamp\":1586527154418},{\"location\":{\"lat\":56.65739286586908,\"lng\":16.32275428484164},\"weight\":1,\"timestamp\":1586527215519},{\"location\":{\"lat\":56.65734863802416,\"lng\":16.32277574251376},\"weight\":1,\"timestamp\":1586527276758},{\"location\":{\"lat\":56.657341266711626,\"lng\":16.32278647134982},\"weight\":1,\"timestamp\":1586527338369},{\"location\":{\"lat\":56.657311781447085,\"lng\":16.322802564603908},\"weight\":1,\"timestamp\":1586527399446},{\"location\":{\"lat\":56.657342740974244,\"lng\":16.32290180633746},\"weight\":1,\"timestamp\":1586527460334},{\"location\":{\"lat\":56.657342740974244,\"lng\":16.322936675054653},\"weight\":1,\"timestamp\":1586527521872},{\"location\":{\"lat\":56.65739139160839,\"lng\":16.322928628427608},\"weight\":1,\"timestamp\":1586527582929},{\"location\":{\"lat\":56.65740465995227,\"lng\":16.32290717075549},\"weight\":1,\"timestamp\":1586527645196},{\"location\":{\"lat\":56.657435619403174,\"lng\":16.322893759710414},\"weight\":1,\"timestamp\":1586527706035},{\"location\":{\"lat\":56.657465104570846,\"lng\":16.32288571308337},\"weight\":1,\"timestamp\":1586527767194},{\"location\":{\"lat\":56.657499012485175,\"lng\":16.32288571308337},\"weight\":1,\"timestamp\":1586527828074},{\"location\":{\"lat\":56.65751965207025,\"lng\":16.322866937620265},\"weight\":1,\"timestamp\":1586527889094},{\"location\":{\"lat\":56.65755208568114,\"lng\":16.32286425541125},\"weight\":1,\"timestamp\":1586527950804},{\"location\":{\"lat\":56.65758304501093,\"lng\":16.32283206890307},\"weight\":1,\"timestamp\":1586528012289},{\"location\":{\"lat\":56.65760810730692,\"lng\":16.322818657857997},\"weight\":1,\"timestamp\":1586528073782},{\"location\":{\"lat\":56.65763759233967,\"lng\":16.322813293439967},\"weight\":1,\"timestamp\":1586528135194},{\"location\":{\"lat\":56.65765970609911,\"lng\":16.32278647134982},\"weight\":1,\"timestamp\":1586528196788},{\"location\":{\"lat\":56.657687716842446,\"lng\":16.32285889099322},\"weight\":1,\"timestamp\":1586528258372},{\"location\":{\"lat\":56.65769213958951,\"lng\":16.322939357263667},\"weight\":1,\"timestamp\":1586528319950},{\"location\":{\"lat\":56.657693613838404,\"lng\":16.32300104807101},\"weight\":1,\"timestamp\":1586528381551},{\"location\":{\"lat\":56.65769508808725,\"lng\":16.323014459116084},\"weight\":1,\"timestamp\":1586528443210},{\"location\":{\"lat\":56.65771425331694,\"lng\":16.323086878759486},\"weight\":1,\"timestamp\":1586528504687},{\"location\":{\"lat\":56.657708356324214,\"lng\":16.323145887357814},\"weight\":1,\"timestamp\":1586528566222},{\"location\":{\"lat\":56.657708356324214,\"lng\":16.323199531538112},\"weight\":1,\"timestamp\":1586528627762},{\"location\":{\"lat\":56.65770688207591,\"lng\":16.32325317571841},\"weight\":1,\"timestamp\":1586528689614},{\"location\":{\"lat\":56.657687716842446,\"lng\":16.323322913152797},\"weight\":1,\"timestamp\":1586528776459},{\"location\":{\"lat\":56.657687716842446,\"lng\":16.323328277570827},\"weight\":1,\"timestamp\":1586528838543},{\"location\":{\"lat\":56.657668551599244,\"lng\":16.323419472677333},\"weight\":1,\"timestamp\":1586528899422},{\"location\":{\"lat\":56.65765970609911,\"lng\":16.32340069721423},\"weight\":1,\"timestamp\":1586528961280},{\"location\":{\"lat\":56.65762137557452,\"lng\":16.323459705812557},\"weight\":1,\"timestamp\":1586529022757},{\"location\":{\"lat\":56.6576095815591,\"lng\":16.323497256738765},\"weight\":1,\"timestamp\":1586529084217},{\"location\":{\"lat\":56.65757272523715,\"lng\":16.323513349992854},\"weight\":1,\"timestamp\":1586529145835},{\"location\":{\"lat\":56.657544714408374,\"lng\":16.3235213966199},\"weight\":1,\"timestamp\":1586529207420},{\"location\":{\"lat\":56.657527023347896,\"lng\":16.32353212545596},\"weight\":1,\"timestamp\":1586529269057},{\"location\":{\"lat\":56.657488692688396,\"lng\":16.323545536501033},\"weight\":1,\"timestamp\":1586529330670},{\"location\":{\"lat\":56.657469527344006,\"lng\":16.32354285429202},\"weight\":1,\"timestamp\":1586529392331},{\"location\":{\"lat\":56.657442990697234,\"lng\":16.32354285429202},\"weight\":1,\"timestamp\":1586529454000},{\"location\":{\"lat\":56.65741055699251,\"lng\":16.323534807664974},\"weight\":1,\"timestamp\":1586529515574},{\"location\":{\"lat\":56.657386968826096,\"lng\":16.323529443246944},\"weight\":1,\"timestamp\":1586529577198},{\"location\":{\"lat\":56.65736190638308,\"lng\":16.32350530336581},\"weight\":1,\"timestamp\":1586529639520},{\"location\":{\"lat\":56.65735306081098,\"lng\":16.32346238802157},\"weight\":1,\"timestamp\":1586529701065},{\"location\":{\"lat\":56.65734863802416,\"lng\":16.323376557333095},\"weight\":1,\"timestamp\":1586529762216},{\"location\":{\"lat\":56.65733536966056,\"lng\":16.32334705303393},\"weight\":1,\"timestamp\":1586529823870},{\"location\":{\"lat\":56.65733536966056,\"lng\":16.323277315599544},\"weight\":1,\"timestamp\":1586529885154},{\"location\":{\"lat\":56.65733536966056,\"lng\":16.32320489595614},\"weight\":1,\"timestamp\":1586529946296},{\"location\":{\"lat\":56.6573368439234,\"lng\":16.323140522939784},\"weight\":1,\"timestamp\":1586530007703},{\"location\":{\"lat\":56.657339792448965,\"lng\":16.323065421087367},\"weight\":1,\"timestamp\":1586530068850},{\"location\":{\"lat\":56.657339792448965,\"lng\":16.323057374460323},\"weight\":1,\"timestamp\":1586530130125},{\"location\":{\"lat\":56.657345689499316,\"lng\":16.32302787016116},\"weight\":1,\"timestamp\":1586530191348},{\"location\":{\"lat\":56.65738402030423,\"lng\":16.323070785505397},\"weight\":1,\"timestamp\":1586530252810},{\"location\":{\"lat\":56.65738549456519,\"lng\":16.323186120493038},\"weight\":1,\"timestamp\":1586530314340},{\"location\":{\"lat\":56.6573884430869,\"lng\":16.323304137689693},\"weight\":1,\"timestamp\":1586530376467},{\"location\":{\"lat\":56.657382546043245,\"lng\":16.323355099660976},\"weight\":1,\"timestamp\":1586530438202},{\"location\":{\"lat\":56.657409082732535,\"lng\":16.323419472677333},\"weight\":1,\"timestamp\":1586530499920},{\"location\":{\"lat\":56.65743267088514,\"lng\":16.323440930349452},\"weight\":1,\"timestamp\":1586530561630},{\"location\":{\"lat\":56.6574503619899,\"lng\":16.3234677524396},\"weight\":1,\"timestamp\":1586530623352},{\"location\":{\"lat\":56.65748132140324,\"lng\":16.323454341394527},\"weight\":1,\"timestamp\":1586530684589},{\"location\":{\"lat\":56.657494589715476,\"lng\":16.32345702360354},\"weight\":1,\"timestamp\":1586530745838},{\"location\":{\"lat\":56.657527023347896,\"lng\":16.323435565931423},\"weight\":1,\"timestamp\":1586530807188},{\"location\":{\"lat\":56.65755355993551,\"lng\":16.323438248140437},\"weight\":1,\"timestamp\":1586530868643},{\"location\":{\"lat\":56.657590416276186,\"lng\":16.3233953327962},\"weight\":1,\"timestamp\":1586530931201},{\"location\":{\"lat\":56.65760810730692,\"lng\":16.32335778186999},\"weight\":1,\"timestamp\":1586530992897},{\"location\":{\"lat\":56.65762874683227,\"lng\":16.323309502107723},\"weight\":1,\"timestamp\":1586531055176},{\"location\":{\"lat\":56.6576420150926,\"lng\":16.32327463339053},\"weight\":1,\"timestamp\":1586531116458},{\"location\":{\"lat\":56.657644963594265,\"lng\":16.323186120493038},\"weight\":1,\"timestamp\":1586531178262},{\"location\":{\"lat\":56.657646437845024,\"lng\":16.32311101864062},\"weight\":1,\"timestamp\":1586531240106},{\"location\":{\"lat\":56.657644963594265,\"lng\":16.323076149923427},\"weight\":1,\"timestamp\":1586531301222},{\"location\":{\"lat\":56.657639066590725,\"lng\":16.323009094698055},\"weight\":1,\"timestamp\":1586531362758},{\"location\":{\"lat\":56.65763169533499,\"lng\":16.322971543771846},\"weight\":1,\"timestamp\":1586531423793},{\"location\":{\"lat\":56.6576199013228,\"lng\":16.322928628427608},\"weight\":1,\"timestamp\":1586531485308},{\"location\":{\"lat\":56.657606633054684,\"lng\":16.32291253517352},\"weight\":1,\"timestamp\":1586531546921},{\"location\":{\"lat\":56.65755945695243,\"lng\":16.322966179353816},\"weight\":1,\"timestamp\":1586531608416},{\"location\":{\"lat\":56.65751228079117,\"lng\":16.322987637025935},\"weight\":1,\"timestamp\":1586531669934},{\"location\":{\"lat\":56.65749606397208,\"lng\":16.32300104807101},\"weight\":1,\"timestamp\":1586531731438},{\"location\":{\"lat\":56.6574503619899,\"lng\":16.32303323457919},\"weight\":1,\"timestamp\":1586531792998},{\"location\":{\"lat\":56.65745331050656,\"lng\":16.323019823534114},\"weight\":1,\"timestamp\":1586531854788},{\"location\":{\"lat\":56.65743856792097,\"lng\":16.3230171413251},\"weight\":1,\"timestamp\":1586531916162},{\"location\":{\"lat\":56.657431196626014,\"lng\":16.323108336431606},\"weight\":1,\"timestamp\":1586531977789},{\"location\":{\"lat\":56.657435619403174,\"lng\":16.323194167120082},\"weight\":1,\"timestamp\":1586532039408},{\"location\":{\"lat\":56.657445939214476,\"lng\":16.323266586763484},\"weight\":1,\"timestamp\":1586532100465},{\"location\":{\"lat\":56.657466578828625,\"lng\":16.323322913152797},\"weight\":1,\"timestamp\":1586532161396},{\"location\":{\"lat\":56.65750785802302,\"lng\":16.32333095977984},\"weight\":1,\"timestamp\":1586532222571},{\"location\":{\"lat\":56.65754324015365,\"lng\":16.323314866525752},\"weight\":1,\"timestamp\":1586532283742},{\"location\":{\"lat\":56.65757567374425,\"lng\":16.32326390455447},\"weight\":1,\"timestamp\":1586532344763},{\"location\":{\"lat\":56.65758599351723,\"lng\":16.323194167120082},\"weight\":1,\"timestamp\":1586532405911},{\"location\":{\"lat\":56.657580096504425,\"lng\":16.32310565422259},\"weight\":1,\"timestamp\":1586532467446},{\"location\":{\"lat\":56.65756535396844,\"lng\":16.32308419655047},\"weight\":1,\"timestamp\":1586532528668},{\"location\":{\"lat\":56.657527023347896,\"lng\":16.323065421087367},\"weight\":1,\"timestamp\":1586532589758},{\"location\":{\"lat\":56.65748721843146,\"lng\":16.32309492538653},\"weight\":1,\"timestamp\":1586532651356},{\"location\":{\"lat\":56.65748132140324,\"lng\":16.323191484911067},\"weight\":1,\"timestamp\":1586532712475},{\"location\":{\"lat\":56.657509332279126,\"lng\":16.323239764673335},\"weight\":1,\"timestamp\":1586532774188},{\"location\":{\"lat\":56.65752112632591,\"lng\":16.32321026037417},\"weight\":1,\"timestamp\":1586532835384},{\"location\":{\"lat\":56.65754324015365,\"lng\":16.323151251775844},\"weight\":1,\"timestamp\":1586532896749},{\"location\":{\"lat\":56.65754176589888,\"lng\":16.32323171804629},\"weight\":1,\"timestamp\":1586532959574},{\"location\":{\"lat\":56.65754618866303,\"lng\":16.323161980611903},\"weight\":1,\"timestamp\":1586533022359},{\"location\":{\"lat\":56.657549137172204,\"lng\":16.323250493509395},\"weight\":1,\"timestamp\":1586533084228},{\"location\":{\"lat\":56.65756093120652,\"lng\":16.323301455480678},\"weight\":1,\"timestamp\":1586533145621},{\"location\":{\"lat\":56.65757714799769,\"lng\":16.32335241745196},\"weight\":1,\"timestamp\":1586533206915},{\"location\":{\"lat\":56.65759926179259,\"lng\":16.323414108259303},\"weight\":1,\"timestamp\":1586533268051},{\"location\":{\"lat\":56.65762137557452,\"lng\":16.32347848127566},\"weight\":1,\"timestamp\":1586533329183},{\"location\":{\"lat\":56.65763611808858,\"lng\":16.323534807664974},\"weight\":1,\"timestamp\":1586533390159},{\"location\":{\"lat\":56.657656757598616,\"lng\":16.3235938162633},\"weight\":1,\"timestamp\":1586533451473},{\"location\":{\"lat\":56.65767002584909,\"lng\":16.32362063835345},\"weight\":1,\"timestamp\":1586533512401},{\"location\":{\"lat\":56.65768034559622,\"lng\":16.323687693578822},\"weight\":1,\"timestamp\":1586533573837},{\"location\":{\"lat\":56.65768181984558,\"lng\":16.32374670217715},\"weight\":1,\"timestamp\":1586533634822},{\"location\":{\"lat\":56.65768329409489,\"lng\":16.323813757402522},\"weight\":1,\"timestamp\":1586533696490}]";
var one_coordinates = "[{\n    \"location\": {\n        \"lat\": 56.65748132140324,\n        \"lng\": 16.323191484911067\n    },\n    \"weight\": 1,\n    \"timestamp\": 1586507332475\n}]";
var dataset_1 = JSON.parse(cords_full);
var dataset_2 = JSON.parse(cords_hours);
var searchRadiusButton = document.getElementById("searchRadius");
var map, googleMaps, heatmap;
var radius = 50;
var searchRadius = 4;

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
  document.addEventListener("DOMContentLoaded", function () {
    var mapElement = document.getElementById("map");
    loadGoogleMapsApi({
      key: "AIzaSyDVxL_-voEagurltC-HoSJk9WvgFMmkTAU",
      libraries: ["visualization"]
    }).then(function (google) {
      googleMaps = google;
      map = new googleMaps.Map(mapElement, {
        center: {
          lat: 56.657081713112085,
          lng: 16.321899075213206
        },
        zoom: 19,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        mapTypeId: "satellite"
      }); // Polygon-layer
      //  createPolygonLayer(dataset_2);
      // Circle-layer

      var copyOfDataSet = _toConsumableArray(dataset_1);

      var colorizedDataset = divideColorToCordordinates(copyOfDataSet);
      createCirclesLayer(colorizedDataset); // Heatmap-layer
      //   createHeatmapLayer(covertToGoogleMapsCords(calculateWeight(dataset_1)))

      writePositionsToJSONByClick();
    });
  });
};
/* 
Uses creatPolygon() to creates a new separate polygon for every array returned by polygons() method. 
*/


var createPolygonLayer = function createPolygonLayer(coordinates) {
  var allPolygons = polygons(coordinates, 10);
  var objLen = Object.keys(allPolygons).length;
  var i = 0;

  for (var key in allPolygons) {
    allPolygons[key].forEach(function (cordsArray) {
      var risingColor = 255 / objLen * (i + 1);
      var sinkingColor = 255 - 255 / objLen * (i + 1);
      var polygon = new google.maps.Polygon({
        paths: cordsArray,
        strokeColor: "rgba(" + risingColor + ", 0, " + sinkingColor + ", 1)",
        strokeOpacity: 1.2,
        strokeWeight: 2,
        fillColor: "rgba(" + risingColor + ", 0, " + sinkingColor + ", 1)",
        fillOpacity: 0.85,
        draggable: false
      });
      polygon.setMap(map);
    });
    i++;
  }
};

var createCirclesLayer = function createCirclesLayer(coordinates) {
  coordinates.forEach(function (coordinates) {
    for (var coord in coordinates) {
      new window.google.maps.Circle({
        strokeColor: coordinates[coord].color,
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: coordinates[coord].color,
        fillOpacity: 0.35,
        map: map,
        center: coordinates[coord].location,
        radius: searchRadius
      });
    }
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
  heatmap.set("radius", heatmap.get("radius") ? radius : radius);
  var gradient = ["rgba(0, 0, 255, 0)", "rgba(0, 0, 255, 1)", "rgba(55, 0, 200, 1)", "rgba(125, 0, 120, 1)", "rgba(200, 0, 55, 1)", "rgba(255, 0, 0, 1)"];
  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
};

var calculateWeight = function calculateWeight(stdCoordinates) {
  var crds = JSON.parse(JSON.stringify(stdCoordinates));
  crds = sortByTimestamp(crds);

  if (crds.length > 1) {
    var diff = crds[crds.length - 1].timestamp - crds[0].timestamp;
    crds.forEach(function (element) {
      var percent = (element.timestamp - crds[0].timestamp) / diff * 100;
      element.weight = parseFloat(percent.toFixed(1)) + 1;
    });
  }

  return crds;
};

var divideColorToCordordinates = function divideColorToCordordinates(coordinates) {
  var dividedArray = splitIntoParts(sortByTimestamp(coordinates), 10);
  dividedArray.forEach(function (arr, i) {
    var colorDown = 255 - 255 / dividedArray.length * (i + 1);
    var colorUp = 255 / dividedArray.length * (i + 1);
    arr.forEach(function (element) {
      element.color = "rgba(" + colorUp + ", 0, " + colorDown + ", " + (i > 0 ? 1 : 1) + ")";
    });
  });
  return dividedArray;
};

var splitIntoParts = function splitIntoParts(array, parts) {
  // array is the dataset that will be split into part.
  // parts is how many parts the array will be divided into.
  var result = [];

  for (var i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }

  return result;
};

var changeRadius = function changeRadius() {
  searchRadiusButton.addEventListener("click", function () {
    var inputValue = document.querySelector(".input").value;

    if (inputValue <= 100 && inputValue > 0) {
      radius = inputValue;
      heatmap.set("radius", heatmap.get("radius") ? radius : radius);
    }
  });
};
/* 
Appends the "click-positions" longiture & latitude to the coordinates array.
*/


var writePositionsToJSONByClick = function writePositionsToJSONByClick() {
  googleMaps.event.addListener(map, "click", function (event) {
    arr.push({
      location: new window.google.maps.LatLng({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }),
      weight: 1,
      timestamp: Date.now()
    });
    heatmap.setMap(null);
    createHeatmapLayer(covertToGoogleMapsCords(calculateWeight(arr)));
  });
};

var sortByTimestamp = function sortByTimestamp(coordinates) {
  return coordinates.sort(function (a, b) {
    return a.timestamp - b.timestamp;
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58999" + '/');

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