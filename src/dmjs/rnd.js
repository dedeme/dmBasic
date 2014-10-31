/*
 * Copyright 29-Dic-2013 ºDeme
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

/** Utilities for random operations */
goog.provide("dmjs.rnd");

goog.require("dmjs.Dec");
goog.require("dmjs.It");

(function (ns) {
  'use strict';

  /**
   * Returns an integer between 0 (inclusive) and n (exclusive)
   * @param {!number} n Must be > 0
   * @return {!number}
   */
  ns.i = function (n) {
    return parseInt(Math.random() * n, 10);
  };

  /**
   * Returns a random Dec between n1 (inclusive) and n2 (inclusive) with 'd'
   * decimals. (n2 can be less than n1)
   *
   * @param {!number} d
   * @param {!number} n1
   * @param {!number} n2
   * @return {!dmjs.Dec}
   */
  ns.dec = function (d, n1, n2) {
    return new dmjs.Dec(dmjs.Dec.rnd(n1, n2), d);
  };

  /**
   * Object for selecting among a group of elements in random way. When all
   * elements have been selected, Box is reloaded with elements in different
   * order.
   *
   * @constructor
   * @struct
   * @template T
   * @param {!Array.<T>} es
   */
  ns.Box = function (es) {
    var
      box;

    box = dmjs.It.from(es).shuffle().shuffle().toArray();

    /**
     * @return {!Array.<T>}
     */
    this.elements = function () {
      return es;
    };

    /**
     * @return {!Array.<T>}
     */
    this.box = function () {
      return box;
    };

    /**
     * Returns next random element.
     *
     * @return {T}
     */
    this.next = function () {
      if (box.length === 0) {
        box = dmjs.It.from(es).shuffle().shuffle().toArray();
      }
      return box.pop();
    };
  };

  /**
   * Returns a dmjs.Box with repeated elements
   *
   * @template T
   * @param {!Array.<!Array.<T, !number>>} es Each element is type
   *   [object, numberOfRepetitions]
   * @return {!dmjs.rnd.Box.<T>}
   */
  ns.mkBox = function (es) {
    var
      a;

    a = dmjs.It.from(es).reduce([], function (seed, e) {
      dmjs.It.range(e[1]).each(function () {
        seed.push(e[0]);
      });
      return seed;
    });
    return new ns.Box(a);
  };

}(dmjs.rnd));
