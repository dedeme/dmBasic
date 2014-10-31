/*
 * Copyright 19-jul-2013 ºDeme
 *
 * This file is part of 'dmBasic'.
 *
 * 'dmBasic' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * 'dmBasic' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'dmBasic'.  If not, see <http://www.gnu.org/licenses/>.
 */

/*globals goog, dmjs */

/** Iterator */
goog.provide('dmjs.It');

/**
 * @constructor
 * @struct
 * @template T, R
 * @param {function ():boolean} hasNext
 * @param {function ():T} next
 */
dmjs.It = function (hasNext, next) {
  'use strict';

  var
    self;

  self = this;
  /** type {function ():!boolean} */
  this.hasNext = hasNext;
  /** @type {function ():T} next */
  this.next = next;

  /**
   * Compares elements with ===
   *
   * @param {?dmjs.It.<T>} it
   * @return {!boolean}
   */
  this.equals = function (it) {
    if (it === self) {
      return true;
    }
    if (it === null) {
      return false;
    }
    var r = it.reduce(true, function (seed, e) {
      return seed ? (self.hasNext()) ? e === self.next() : false : false;
    });
    return r ? !self.hasNext() : false;
  };

  /**
   * Compare elements with eq
   *
   * @param {?dmjs.It.<T>} it
   * @param {!function(T,T):boolean} eq
   * @return {!boolean}
   */
  this.eq = function (it, eq) {
    if (it === self) {
      return true;
    }
    if (it === null) {
      return false;
    }
    var r = it.reduce(true, function (seed, e) {
      return seed ? (self.hasNext()) ? eq(e, self.next()) : false : false;
    });
    return r ? !self.hasNext() : false;
  };


  /**
   * return a string representation of It, using 'toString()' function for
   * each element.
   * @return {!string}
   * @override
   */
  this.toString = function () {
    return '[' + dmjs.It.join(
      self.map(function (e) { return e.toString(); }),
      ", "
    ) + "]";
  };

// Dynamic converters --------------------------------------

  /**
   * Returns an array with It values.
   * @return {!Array.<T>}
   */
  this.toArray = function () {
    return this.reduce([], function (s, e) { s.push(e); return s; });
  };

// Functions lazy ------------------------------------------

  /**
   * Adds an element. Its evaluation is lazy.
   * @param {T} element
   * @return {!dmjs.It.<T>}
   */
  this.add0 = function (element) {
    var
      isFirst,
      hasNext,
      next;

    isFirst = true;
    hasNext = function () { return isFirst || self.hasNext(); };
    next = function () {
      if (isFirst) {
        isFirst = false;
        return element;
      }
      return self.next();
    };
    return new dmjs.It(hasNext, next);
  };

  /**
   * Adds an element at 'index' position. Its evaluation is lazy.
   * @param {T} element
   * @param {!number=} index
   * @return {!dmjs.It.<T>}
   */
  this.add = function (element, index) {
    var c = 0;
    return (index === undefined)
      ? new dmjs.It(
        function () { return c === 0; },
        function () {
          if (self.hasNext()) {
            return self.next();
          }
          ++c;
          return element;
        }
      )
      : new dmjs.It(
        function () { return c < index || self.hasNext(); },
        function () {
          if (c <= index) {
            if (self.hasNext() && c < index) {
              ++c;
              return self.next();
            }
            c = index + 1;
            return element;
          }
          return self.next();
        }
      );
  };

  /**
   * Adds elements of 'it' at 'index' position. Its evaluation is lazy.
   * @param {!dmjs.It.<T>} it
   * @param {!number=} index
   * @return {!dmjs.It.<T>}
   */
  this.addIt = function (it, index) {
    var c = 0;
    return new dmjs.It(
      function () {
        return self.hasNext() || it.hasNext();
      },
      ((index === undefined)
        ? function () { return (self.hasNext()) ? self.next() : it.next(); }
        : function () {
          if (c < index) {
            if (self.hasNext()) {
              ++c;
              return self.next();
            }
            c = index;
            return this.next();  // yes call to next() of new It
          }
          if (it.hasNext()) {
            return it.next();
          }
          return self.next();
        }
      )
    );
  };

  /**
   * Returns this from 'n' element exclusive to end. Its evaluation is lazy.
   * @param {!number} n
   * @return {!dmjs.It.<T>}
   */
  this.drop = function (n) {
    var c = 0;
    while (this.hasNext() && (c++ < n)) {
      this.next();
    }
    return this;
  };

  /**
   * Returns this from the first element which 'f' value is false to end.
   * Its evaluation is lazy.
   * @param {!function (T):!boolean} f
   * @return {!dmjs.It.<T>}
   */
  this.dropWhile = function (f) {
    var
      hnx,
      e;

    hnx = self.hasNext();
    e = hnx ? self.next() : null;
    while (hnx && f(e)) {
      hnx = self.hasNext();
      if (hnx) {
        e = self.next();
      }
    }
    return new dmjs.It(
      function () { return hnx; },
      function () {
        if (hnx) {
          var r = e;
          hnx = self.hasNext();
          if (hnx) {
            e = self.next();
          }
          return r;
        }
        throw new Error("No such element");
      }
    );
  };

  /**
   * Returns elements which 'f' value is true. Its evaluation is lazy.
   * @param {function (T):!boolean} f
   * @return {!dmjs.It.<T>}
   */
  this.filter = function (f) {
    var
      hnx,
      e;

    hnx = self.hasNext();
    e = hnx ? self.next() : null;
    while (hnx && !f(e)) {
      hnx = self.hasNext();
      if (hnx) {
        e = self.next();
      }
    }

    return new dmjs.It(
      function () { return hnx; },
      function () {
        if (hnx) {
          var r = e;
          do {
            hnx = self.hasNext();
            if (hnx) {
              e = self.next();
            }
          } while (hnx && !f(e));
          return r;
        }
        throw new Error("No such element");
      }
    );
  };

  /**
   * Returns elements of this after apply 'f'. Its evaluation is lazy.
   * @param {function (T):R} f
   * @return {!dmjs.It.<R>}
   */
  this.map = function (f) {
    return new dmjs.It(
      self.hasNext,
      function () { return f(self.next()); }
    );
  };

  /**
   * Returns the 'n' first elements. Its evaluation is lazy.
   * @param {!number} n
   * @return {!dmjs.It.<T>}
   */
  this.take = function (n) {
    var c = 0;
    return new dmjs.It(
      function () { return self.hasNext() && (c < n); },
      function () {
        if (c++ < n) {
          return self.next();
        }
        throw new Error("No such element");
      }
    );
  };

  /**
   * Returns elements while 'f' application is true. Its evaluation is lazy.
   * @param {function (T):!boolean} f
   * @return {!dmjs.It.<T>}
   */
  this.takeWhile = function (f) {
    var
      hnx,
      e;

    hnx = self.hasNext();
    e = hnx ? self.next() : null;
    return new dmjs.It(
      function () { return hnx && f(e); },
      function () {
        if (hnx && f(e)) {
          var r = e;
          hnx = self.hasNext();
          if (hnx) {
            e = self.next();
          }
          return r;
        }
        throw new Error("No such element");
      }
    );
  };

// Progressive --------------------------------------------

  /**
   * Returns true if 'f' applied to every element is true.
   * @param {function (T):!boolean} f
   * @return {!boolean}
   */
  this.all = function (f) {
    return this.reduce(true, function (s, e) {
      return s ? s && f(e) : false;
    });
  };

  /**
   * Returns true if 'f' is true applied to one element at least.
   * @param {function (T):!boolean} f
   * @return {!boolean}
   */
  this.any = function (f) {
    return this.reduce(false, function (s, e) {
      return s ? true : s || f(e);
    });
  };

  /**
   * Returns number of elements.
   * @return {!number}
   */
  this.count = function () {
    return this.reduce(0, function (s) { return ++s; });
  };

  /**
   * Applies 'f' to every element.
   * @param {function (T)} f
   */
  this.each = function (f) {
    while (this.hasNext()) {
      f(this.next());
    }
  };

  /**
   * Aplies 'f' to every element, giving its order number.
   * @param {function (T, !number)} f
   */
  this.eachIx = function (f) {
    var c = 0;
    while (this.hasNext()) {
      f(this.next(), c++);
    }
  };

  /**
   * Returns the first element which is true applying 'f'.<p>
   * If the element does not exists returns undefined.
   * @param {function (T):!boolean} f
   * @return {T|undefined}
   */
  this.find = function (f) {
    var
      e;

    while (this.hasNext()) {
      e = this.next();
      if (f(e)) {
        return e;
      }
    }
    return undefined;
  };

  /**
   * Returns the last element which is true applying 'f'.<p>
   * If the element does not exists returns undefined.
   * @param {function (T):!boolean} f
   * @return {T|undefined}
   */
  this.findLast = function (f) {
    var
      r;
    r = undefined;
    this.eachIx(function (e) { if (f(e)) { r = e; } });
    return r;
  };

  /**
   * Returns the index of the first element which is true applying 'f'.<p>
   * If the element does not exists returns -1.
   * @param {function (T):!boolean} f
   * @return {!number}
   */
  this.index = function (f) {
    var
      r,
      c,
      e;

    r = -1;
    c = 0;
    while (this.hasNext()) {
      e = this.next();
      if (f(e)) {
        return c;
      }
      ++c;
    }
    return r;
  };

  /**
   * Returns the index of the last element which is true applying 'f'.<p>
   * If the element does not exists returns -1.
   * @param {function (T):!boolean} f
   * @return {!number}
   */
  this.lastIndex = function (f) {
    var r = -1;
    this.eachIx(function (e, ix) { if (f(e)) { r = ix; } });
    return r;
  };

  /**
   * Returns the result of applying 'f' to (seed, element) repeatedly.
   * i.e., f(f(f(seed, e1), e2), e3)
   * @param {R} seed
   * @param {function (R,T):R} f
   * @return {R}
   */
  this.reduce = function (seed, f) {
    this.each(function (e) { seed = f(seed, e); });
    return seed;
  };

// In block -----------------------------------------------

  /**
   * It converts previously this to an array.
   * @return {!Array.<!dmjs.It.<T>>} Two iterators equals to this
   */
  this.duplicate = function () {
    var arr = this.toArray();
    return [dmjs.It.from(arr), dmjs.It.from(arr)];
  };

  /**
   * Returns this in reverse order.<p>
   * It converts previously this to an array.
   * @return {!dmjs.It.<T>}
   */
  this.reverse = function () {
    return dmjs.It.from(this.toArray().reverse());
  };

  /**
   * Sorts with 'comparator'. It uses array.sort().<p>
   * It converts previously this to an array.
   * @param {!function (T, T):number=} comparator
   * @return {!dmjs.It.<T>}
   */
  this.sort = function (comparator) {
    return dmjs.It.from(this.toArray().sort(comparator));
  };

  /**
   * @return {!dmjs.It.<T>}
   */
  this.shuffle = function () {
    var
      arr,
      i,
      j,
      temp;

    arr = this.toArray();
    i = arr.length;
    if (i) {
      while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    return dmjs.It.from(arr);
  };

};

// static Constructors ------------------------------------

/**
 * Creates an iterator over:
 * <ul>
 * <li>Array. It iterates sequentially over the elements of array.</li>
 * <li>string. It iterates over the characters of it.</li>
 * <li>Array of pairs [string, value]. It iterates sequentially over the pairs.
 * </li>
 * </ul>
 * @template T
 * @param {!Array.<T> | !string | !Object.<string, T>} arr
 * @return {!dmjs.It.<T>}
 */
dmjs.It.from = function (arr) {
  "use strict";

  var
    c,
    length,
    tmp,
    k;

  c = 0;
  length = arr.length;
  if (typeof arr === "string") {
    return new dmjs.It(
      function () { return c < length; },
      function () {
        if (c < length) {
          return arr[c++];
        }
        throw new Error("No such element");
      }
    );
  }
  if (Object.prototype.toString.call(arr) === "[object Array]") {
    return new dmjs.It(
      function () { return c < length; },
      function () {
        if (c < length) {
          return arr[c++];
        }
        throw new Error("No such element");
      }
    );
  }
  tmp = [];
  for (k in arr) {
    if (arr.hasOwnProperty(k)) {
      tmp.push([k, arr[k]]);
    }
  }
  return dmjs.It.from(tmp);
};

/**
 * Returns keys (strings) from an array of pairs [string, object].
 * @param {!Object.<string, ?>} obj
 * @return {!dmjs.It.<string>}
 */
dmjs.It.keys = function (obj) {
  "use strict";

  return dmjs.It.from(obj).map(function (e) { return e[0]; });
};

/**
 * Returns values (objects) from an array of pairs [string, object].
 * @template T
 * @param {!Object.<string, T>} obj
 * @return {!dmjs.It.<T>}
 */
dmjs.It.values = function (obj) {
  "use strict";

  return dmjs.It.from(obj).map(function (e) { return e[1]; });
};

/**
 * Creates an empty iterator.
 * @return {!dmjs.It.<?>}
 */
dmjs.It.empty = function () {
  "use strict";

  return new dmjs.It(
    function () { return false; },
    function () { throw new Error("No such element"); }
  );
};

/**
 * Creates an iterator over integer with values from begin to end.
 * @param {!number=} begin (inclusive)
 * @param {!number=} end (exclusive))
 * @return {!dmjs.It.<number>}
 */
dmjs.It.range = function (begin, end) {
  "use strict";

  var c;
  if (end === undefined) {
    if (begin === undefined) {
      c = 0;
      return new dmjs.It(
        function () { return true; },
        function () { return c++; }
      );
    }
    return dmjs.It.range().take(begin);
  }
  if (begin === undefined) {
    return dmjs.It.empty();
  }
  return dmjs.It.range().take(end).drop(begin);
};

/**
 * Creates a pair iterator with elements of two ones. Elements of both
 * iterators are travelled simultaneously.
 * @param {!dmjs.It.<?>} it1
 * @param {!dmjs.It.<?>} it2
 * @return {!dmjs.It.<Array.<?>>} An iterator over Array[2]
 */
dmjs.It.zip = function (it1, it2) {
  "use strict";
  return new dmjs.It(
    function () { return it1.hasNext() && it2.hasNext(); },
    function () {
      if (it1.hasNext() && it2.hasNext()) {
        return [it1.next(), it2.next()];
      }
      throw new Error("No such element");
    }
  );
};

// Static converters --------------------------------------

/**
 * Returns an Iterator with elements of other ones concatenated.
 * @template T
 * @param {!dmjs.It.<dmjs.It.<T>>} it
 * @return {!dmjs.It.<T>}
 */
dmjs.It.flat = function (it) {
  "use strict";

  var tmp = dmjs.It.empty();
  while (it.hasNext()) {
    tmp = it.next();
    if (tmp.hasNext()) {
      break;
    }
  }
  return new dmjs.It(
    function () { return it.hasNext() || tmp.hasNext(); },
    function () {
      if (tmp.hasNext()) {
        return tmp.next();
      }
      tmp = it.next();
      return this.next();
    }
  );
};

/**
 * Returns a character iterator for a string iterator.
 * @param {!dmjs.It.<string>} it
 * @return {!dmjs.It.<string>}
 */
dmjs.It.flatFromStrings = function (it) {
  "use strict";

  return dmjs.It.flat(it.map(function (e) { return dmjs.It.from(e); }));
};

/**
 * Returns a string with elements of 'it' concatenated with 'separator'.
 * @param {!dmjs.It.<string>} it
 * @param {!string=} separator Default is "".
 * @return {!string}
 */
dmjs.It.join = function (it, separator) {
  "use strict";

  separator = (separator === undefined) ? "" : separator;
  return (it.hasNext())
    ? it.reduce(it.next(), function (seed, e) { return seed + separator + e; })
    : "";
};
