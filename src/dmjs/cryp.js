/*
 * Copyright 19-dic-2013 ºDeme
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
/*jslint bitwise: true */

/** Cryptographics functions */
goog.provide("dmjs.cryp");

(function (ns) {
  'use strict';

  /**
   * Converts a number between 0 and 15 to hexadecimal (lowercase).
   *
   * @param {!number} d
   * @return {!string}
   */
  ns.d2h = function (d) {
    return (d === 15) ? "f"
      : (d === 14) ? "e"
        : (d === 13) ? "d"
          : (d === 12) ? "c"
            : (d === 11) ? "b"
              : (d === 10) ? "a"
                : d.toString();
  };

  /**
   * Converts a digit hexadecimal (lowercase) to number.
   *
   * @param {!string} h
   * @return {!number}
   */
  ns.h2d = function (h) {
    return (h === "f") ? 15
      : (h === "e") ? 14
        : (h === "d") ? 13
          : (h === "c") ? 12
            : (h === "b") ? 11
              : (h === "a") ? 10
                : +h;
  };

  /**
   * Converts a string to hexadecimal (lowercase).
   *
   * @param {!string} s
   * @return {!string}
   */
  ns.s2h = function (s) {
    var
      r,
      i,
      c;

    r = [];
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c === 8364) {  // Euro symbol
        r.push("a4");
      } else {
        r.push(ns.d2h(c >> 4) + ns.d2h(c & 15));
      }
    }
    return r.join("");
  };

  /**
   * Returns a hexadecimal (lowercase) string converts with s2h() to its
   * orginal form.
   *
   * @param {!string} h
   * @return {!string}
   */
  ns.h2s = function (h) {
    var
      r,
      i,
      code;

    r = [];
    for (i = 0; i < h.length; i += 2) {
      code = (ns.h2d(h.substr(i, 1)) << 4) +
        ns.h2d(h.substr(i + 1, 1));
      if (code === 164) {  // Euro symbol
        r.push("\u20ac");
      } else {
        r.push(String.fromCharCode(code));
      }
    }
    return r.join("");
  };

  /**
   * Generates a random key of a length 'lg'
   *
   * @param {!number} lg
   * @return {!string} A hexadecimal string
   */
  ns.genK = function (lg) {
    var
      r,
      i;

    r = [];
    for (i = 0; i < lg; i++) {
      r.push(ns.d2h(Math.floor(Math.random() * 16)));
    }
    return r.join("");
  };

  /**
   * Returns 'k' codified in irreversible way, using 'lg' hexadecimal digits.
   * This function only uses the first 'lg * 2' characters of 'k'. If you
   * want to use every character of 'k' you can call function keyCripAll().
   *
   * @param {!string} k String to codify
   * @param {!number} lg length of result
   * @return {!string} 'lg' hexadecimal digits
   */
  ns.keyCryp = function (k, lg) {
    var
      lg2,
      dt,
      sum,
      i,
      r;

    lg2 = lg * 2;
    k = k + "codified in irreversibleDeme is good, very good!\n\r8@@";
    while (k.length < lg2) {
      k = k + k;
    }
    k = k.substr(0, lg2);

    dt = [];
    for (i = 0; i < lg2; i++) {
      dt.push(k.charCodeAt(i));
    }

    sum = 0;
    for (i = 0; i < lg2; i++) {
      sum = (sum + dt[i]) % 16;
      dt[i] = (sum + i + dt[i]) % 16;
    }
    for (i = lg2 - 1; i >= 0; i--) {
      sum = (sum + dt[i]) % 16;
      dt[i] = (sum + i + dt[i]) % 16;
    }

    r = [];
    for (i = 0; i < lg; i++) {
      r.push(ns.d2h(dt[i]));
    }
    return r.join("");
  };

  /**
   * Returns 'k' codified in irreversible way, using 'lg' hexadecimal digits.
   * This function use every character of 'k'.
   *
   * @param {!string} k String to codify
   * @param {!number} lg length of result
   * @return {!string} 'lg' hexadecimal digits
   */
  ns.keyCrypAll = function (k, lg) {
    return ns.keyCryp(k, k.length).substring(0, lg);
  };

  /**
   * Encode 'm' with key 'k'.
   *
   * @param {!string} k Key for encoding
   * @param {!string} m Message to encode
   * @return {!string} 'm' codified in hexadecimal digits.
   */
  ns.cryp = function (k, m) {
    var
      r,
      i;

    m = ns.s2h(m);
    k = ns.keyCryp(k, m.length);
    r = [];
    for (i = 0; i < m.length; i++) {
      r.push(ns.d2h((ns.h2d(m.charAt(i)) + ns.h2d(k.charAt(i))) % 16));
    }
    return r.join("");
  };

  /**
   * Decode 'c' using key 'k'. 'c' was codified with cryp().
   *
   * @param {!string} k Key for decoding
   * @param {!string} c Text codified with cryp()
   * @return {!string} decoded 'c'.
   */
  ns.decryp = function (k, c) {
    var
      r,
      i,
      n;

    k = ns.keyCryp(k, c.length);
    r = [];
    for (i = 0; i < c.length; i++) {
      n = ns.h2d(c.charAt(i)) - ns.h2d(k.charAt(i));
      if (n < 0) {
        n += 16;
      }
      r.push(ns.d2h(n));
    }
    return ns.h2s(r.join(""));
  };

  /**
   * Encode automatically 'm' with a random key of 'nk' digits.
   *
   * @param {!number} nK Number of digits for random key
   * @param {!string} m Text for enconding
   * @return {!string} 'm' encoded in hexadecimal digits
   */
  ns.autoCryp = function (nK, m) {
    var
      k1,
      n,
      k;

    k1 = ns.genK(2);
    n = ns.d2h(nK >> 4) + ns.d2h(nK % 16);
    k = ns.genK(nK);
    return k1 +
      ns.cryp(k1, n) +
      k +
      ns.cryp(k, m);
  };

  /**
   * Decode a text codified with autoCryp()
   *
   * @param {!string} c Codified text
   * @return {!string} Decoded text
   */
  ns.autoDecryp = function (c) {
    var
      c1,
      nK;

    c1 = ns.decryp(c.substr(0, 2), c.substr(2, 4));
    nK = (ns.h2d(c1.charAt(0)) << 4) + ns.h2d(c1.charAt(1));
    return ns.decryp(c.substr(6, nK), c.substr(6 + nK));
  };

}(dmjs.cryp));
