/*
 * Copyright 19-ago-2013 ºDeme
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

/** Class for rounding numbers. */
goog.provide("dmjs.Dec");

/**
 * <p>Creates a value rounded with a fixed number of decimal positions.</p>
 *
 * <p>You can miss values for 'value' and 'dec':</p>
 *
 * <pre>
 * dmjs.Dec() => dmjs.Dec(0, 0)
 * dmjs.Dec(4) => dmjs.Dec(4, 0)
 * </pre>
 *
 * @constructor
 * @struct
 * @param {!number=} value
 * @param {!number=} dec Decimal positions.
 */
dmjs.Dec = function (value, dec) {
  "use strict";

  var
    self = this,
    _power,
    _dec,
    _n;

  _dec = dec || 0;
  if (_dec < 0) {
    _dec = 0;
  }
  _power = Math.pow(10, _dec);
  _n = +(value ? (Math.round(value * _power) / _power).toFixed(_dec) : 0);

  /**
   * @return {!number} Intial value rounded.
   */
  this.value = function () {
    return _n;
  };

  /** @return {!number} Decimal positions.*/
  this.dec = function () {
    return _dec;
  };

  /**
   * String representation of 'this'.
   * @param {!string} decimal Decimal separator.
   * @param {!string=} separator Thousand separator. If it is omitted its value
   *  becomes "".
   * @return {!string}
   */
  this.format = function (decimal, separator) {
    var
      r,
      divSep,
      posSep;

    separator = separator || "";

    r = Math.abs(_n).toString().replace(".", decimal);

    if (separator !== "") {
      divSep = 4 + _dec;
      if (_dec === 0) {
        divSep = 3;
      }

      while (r.length > divSep) {
        posSep = r.length  - divSep;
        r = r.substring(0, posSep) + separator + r.substring(posSep);
        divSep += 4;
      }
    }

    if (_n < 0) {
      r = "-" + r;
    }

    return r;
  };

  /**
   * Returns a string in format 'base' (Equals to <tt>format (".")</tt>)
   * @return {!string}
   */
  this.toString = function () {
    return self.format(".");
  };

  /**
   * Equals to <tt>format (",", ".")</tt>.
   * @return {!string}
   */
  this.toEs = function () {
    return self.format(",", ".");
  };

  /**
   * Returns true if 'other' is another 'Dec' and if 'other.toString()' is
   * equals to 'this.toString()'. It other is 'null' it returns 'false'
   * @param {?dmjs.Dec} other
   * @return {!boolean}
   */
  this.eq = function (other) {
    if (other) {
      return self.toString() === other.toString();
    }
    return false;
  };

  /** @return {!string} Serialization of 'this'. */
  this.serialize = function () {
    return JSON.stringify([value, _dec]);
  };

};

/**
 * Retores a 'Dec' serialization.
 * @param {!string} serial
 * @return {!dmjs.Dec}
 */
dmjs.Dec.restore = function (serial) {
  "use strict";

  var
    rs;

  rs = JSON.parse(serial);
  return new dmjs.Dec(rs[0], rs[1]);
};

/**
 * <p>Returns a random number between n1 (inclusive) and n2 (exclusive).
 * (n2 can be less than n1).</p>
 * <p>You can use this function for creates a random fixed number between other
 * two (both inclusive). For example:<p>
 * <pre>
 * new dmjs.Dec(dmjs.Dec.rnd(3, 5), 2)
 *   => Generates a number n such that 3 <= n <= 5
 * </pre>
 *
 * @param {!number} n1
 * @param {!number} n2
 * @return {!number}
 */
dmjs.Dec.rnd = function (n1, n2) {
  "use strict";

  return Math.random() * (n2 - n1) + n1;
};

/**
 * Validate 'base' format (without thousand separator and with point as decimal
 * separator). Returns value of 's' or NaN.
 * @param {!string} s
 * @return {!number}
 */
dmjs.Dec.validate = function (s) {
  "use strict";

  return isNaN(s) ? NaN : parseFloat(s);
};

/**
 * Constructor from a string in 'base' format (without thousand separator and
 * with point as decimal separator).
 *
 * @param {!string} s
 * @param {!number} dec
 * @return {!dmjs.Dec}
 * @throws {!string} If 's' is not a valid number.
 */
dmjs.Dec.from = function (s, dec) {
  "use strict";

  var
    r;

  r = dmjs.Dec.validate(s);
  if (isNaN(r)) {
    throw new Error("'" + s + "' is not a number");
  }
  return new dmjs.Dec(r, dec);
};

/**
 * Validate 'es' format (with point as thousand separtor and comma as decimal
 * separator). Returns value of 's' or NaN.
 * @param {!string} s
 * @return {!number}
 */
dmjs.Dec.validateEs = function (s) {
  "use strict";

  return dmjs.Dec.validate(s.replace(/\./g, "").replace(/,/g, "."));
};

/**
 * Constructor with a string in 'es' format (with point as thousand separtor
 * and comma as decimal separator)
 *
 * @param {!string} s
 * @param {!number} dec
 * @return {!dmjs.Dec}
 * @throws {!string} If 's' is not a valid number.
 */
dmjs.Dec.fromEs = function (s, dec) {
  "use strict";

  var
    r;

  r = dmjs.Dec.validateEs(s);
  if (isNaN(r)) {
    throw new Error("'" + s + "' is not a number");
  }
  return new dmjs.Dec(r, dec);
};

/**
 * Vadiate 'en' format (with comma as thousand separtor and point as decimal
 * separator). Returns value of 's' or NaN.
 * @param {!string} s
 * @return {!number}
 */
dmjs.Dec.validateEn = function (s) {
  "use strict";

  return dmjs.Dec.validate(s.replace(/,/g, ""));
};

/**
 * Constructor with a string in 'en' format (with comma as thousand separtor
 * and point as decimal separator).
 *
 * @param {!string} s
 * @param {!number} dec
 * @return {!dmjs.Dec}
 * @throws {!string} If 's' is not a valid number.
 */
dmjs.Dec.fromEn = function (s, dec) {
  "use strict";

  var
    r;

  r = dmjs.Dec.validateEn(s);
  if (isNaN(r)) {
    throw new Error("'" + s + "' is not a number");
  }
  return new dmjs.Dec(r, dec);
};
