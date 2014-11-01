/*
 * Copyright 09-Sep-2014 ºDeme
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

/** Container of pairs key-value */
goog.provide("dmjs.Map");

/**
 * Creates an empty Map.
 *
 * @constructor
 * @private
 * @struct
 * @template K, V
 * @param {!Array.<!Array>} data
 */
dmjs.Map = function (data) {
  "use strict";

  /**
   * Retuns every pair
   * @return {!Array.<!Array>}
   */
  this.data = function () { return data; };

  /**
   * Adds a new pair.
   * @param {!K} k
   * @param {V} v
   */
  this.put = function (k, v) {
    var
      i;

    for (i = 0; i < data.length; i++) {
      if (data[i][0] === k) {
        data[i] = [k, v];
        return;
      }
    }
    data.push([k, v]);
  };

  /**
   * Returns value of 'k'
   * @param {!K} k
   * @return {V | undefined}
   */
  this.get = function (k) {
    var
      i;

    for (i = 0; i < data.length; i++) {
      if (data[i][0] === k) {
        return data[i][1];
      }
    }
    return undefined;
  };

  /**
   * Removes entry with key 'k'
   * @param {!K} k
   */
  this.del = function (k) {
    data = dmjs.It.from(data).filter(function (e) {
      return e[0] !== k;
    }).toArray();
  };

  /**
   * Returns an iterator over keys
   * @return {!dmjs.It}
   */
  this.keys = function () {
    return dmjs.It.from(data).map(function (e) { return e[0]; });
  };

  /**
   * Returns an iterator over values
   * @return {!dmjs.It}
   */
  this.values = function () {
    return dmjs.It.from(data).map(function (e) { return e[1]; });
  };

  /** @return {!number} */
  this.size = function () {
    return dmjs.It.from(data).reduce(0, function (s) { return s + 1; });
  };

  /** @return {!string} */
  this.serialize = function () {
    return JSON.stringify(data);
  };

};

/**
 * @return {!dmjs.Map} Un empty dmjs.Map
 */
dmjs.Map.empty = function () {
  "use strict";

  return new dmjs.Map([]);
};

/**
 * @param {!string} serial
 * @return {!dmjs.Map}
 */
dmjs.Map.restore = function (serial) {
  "use strict";

  var
    rs =
      /** @private
       * @type {!Array}
       */
    (JSON.parse(serial));

  return new dmjs.Map(rs);
};
