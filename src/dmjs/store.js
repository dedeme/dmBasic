/*
 * Copyright 17-ago-2013 ºDeme
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

/** Management of local storage. */
goog.provide("dmjs.store");

(function (ns) {
  "use strict";

  /**
   * Put a new value.
   * @param {!string} name
   * @param {string} value
   */
  ns.put = function (name, value) {
    window.localStorage.setItem(name, value);
  };

  /**
   * Returns the value of key <i>name</i>
   * @param {!string} name
   * @return {string|null}
   */
  ns.get = function (name) {
    return window.localStorage.getItem(name);
  };

  /**
   * Removes the key <i>name</i>
   * @param {!string} name
   */
  ns.del = function (name) {
    window.localStorage.removeItem(name);
  };

  /**
   * Returns stored element number.
   * @return {!number}
   */
  ns.size = function () {
    return window.localStorage.length;
  };

  /**
   * Returns a <i>Array</i> with all keys.
   * @return {!Array.<!string>}
   */
  ns.keys = function () {
    var
      r,
      i;

    r = [];
    for (i = 0; i < ns.size(); i++) {
      r.push(window.localStorage.key(i));
    }
    return r;
  };

  /**
   * Removes all keys
   */
  ns.clear = function () {
    window.localStorage.clear();
  };

  /**
   * Remove some keys past the time <i>time</i> whithout operating.
   * @param {!string} name Key name which save time value.
   * @param {!Array.<!string>} keys Keys which will be removed.
   * @param {number} time Time in hours.
   */
  ns.expires = function (name, keys, time) {
    var
      dt,
      ex,
      i;

    dt = new Date().getTime();
    ex = window.localStorage.getItem(name);
    if (!ex || dt > parseInt(ex, 10)) {
      for (i = 0; i < keys.length; i++) {
        window.localStorage.removeItem(keys[i]);
      }
    }
    window.localStorage.setItem(name, (dt + time * 3600000).toString());
  };

}(dmjs.store));
