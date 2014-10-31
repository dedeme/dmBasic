/*
 * Copyright 19-aug-2013 ºDeme
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

/** Utilities for strings */
goog.provide("dmjs.str");

goog.require("dmjs.It");
goog.require("dmjs.cryp");

(function (ns) {
  'use strict';

  /**
   * Compares two string character by character (case insensitive)
   *
   * @param {string} s1
   * @param {string} s2
   * @return {number}
   */
  ns.cmp = function (s1, s2) {
    var
      n1,
      n2;

    n1 = s1.toLowerCase();
    n2 = s2.toLowerCase();
    return n1 > n2 ? 1 : n2 > n1 ? -1 : 0;
  };

  /**
   * Compares two string in locale (case insensitive)
   *
   * @param {string} s1
   * @param {string} s2
   * @return {number}
   */
  ns.compare = function (s1, s2) {
    var
      n1,
      n2;

    n1 = s1.toLowerCase();
    n2 = s2.toLowerCase();
    return n1.localeCompare(n2);
  };

  /**
   * Converts a string to hexadecimal (lowercase).
   *
   * @param {!string} s
   * @return {!string}
   */
  ns.toHex = function (s) {
    return dmjs.cryp.s2h(s);
  };

  /**
   * Returns a hexadecimal (lowercase) string converts with toHex() to its
   * orginal form.
   *
   * @param {!string} hx
   * @return {!string}
   */
  ns.fromHex = function (hx) {
    return dmjs.cryp.h2s(hx);
  };

  /**
   * Removes blank characters at begin and at end of 's'
   * @param {!string} s
   * @return {!string}
   */
  ns.trim = function (s) { return s.replace(/^[\s\xa0]+|[\s\xa0]+$/g, ""); };

  /**
   * Removes blank characters at begin and at end of 's'
   * @param {!string} s
   * @return {!string}
   */
  ns.ltrim = function (s) { return s.replace(/^[\s\xa0]+/, ""); };

  /**
   * Removes blank characters at begin and at end of 's'
   * @param {!string} s
   * @return {!string}
   */
  ns.rtrim = function (s) { return s.replace(/[\s\xa0]+$/, ""); };

  /**
   * @param {!string} template Template string containing %0-%9 specifiers.
   * @param {!Array} args Values formatString is to be filled with.
   * @return {!string} Formatted string.
   */
  ns.aformat = function (template, args) {
    var
      r,
      lg,
      pos,
      ch,
      ix;

    r = "";
    pos = 0;
    lg = template.length;

    ix = template.indexOf("%");
    while (ix !== -1) {
      if (ix === lg - 1) {
        break;
      } else {
        ch = template.substring(ix + 1, ix + 2);
        if (ch >= "0" && ch <= "9") {
          r = r + template.substring(pos, ix) + args[ch];
          pos = ix + 2;
        }
        ix = template.indexOf("%", ix + 2);
      }
    }

    return r + template.substring(pos, lg);
  };

  /**
   * @param {!string} template Template string containing %0-%9 specifiers.
   * @param {...string|number|Array} args Values formatString is to be filled
   *  with.
   * @return {!string} Formatted string.
   */
  ns.format = function (template, args) {
    args = Array.prototype.slice.call(arguments);
    args.shift();
    return ns.aformat(template, args);
  };

  /**
   * Indicates if s starts with subs.
   * @param {!string} s
   * @param {!string} subs
   * @return {!boolean}
   */
  ns.starts = function (s, subs) {
    if (s.length >= subs.length &&
        s.substring(0, subs.length) === subs) {
      return true;
    }
    return false;
  };

  /**
   * Indicates if s ends with subs.
   * @param {!string} s
   * @param {!string} subs
   * @return {!boolean}
   */
  ns.ends = function (s, subs) {
    if (s.length >= subs.length &&
        s.substring(s.length - subs.length) === subs) {
      return true;
    }
    return false;
  };

}(dmjs.str));
