// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Some mathematical functions, rounding and numeric formats */

/**
 * Gives format to number.
 * @param {!Dec} d Number to fomat
 * @param {string} thousand Sign of thausands
 * @param {string} decimal Sign of decimal part
 * @return {string} The number 'd' formated.
 */
const format = (d, thousand, decimal) => {
  const scale = d._scale;
  let left = String(d._intValue);
  let right = "";
  if (scale > 0) {
    while (left.length < scale + 1) {
      left = "0" + left;
    }
    const ix = left.length - scale;
    right = decimal + left.substring(ix);
    left = left.substring(0, ix);
  }
  let size = 3;
  while (left.length > size) {
    const ix = left.length - size;
    left = left.substring(0, ix) + thousand + left.substring(ix);
    size += 4;
  }
  return ((d._sign === 1) ? "" : "-") + left + right;
};

/** Some mathematical functions, rounding and numeric formats */
export default class Dec {
  /**
   * @param {number=} value A float value. Default 0.
   * @param {number=} scale Number of decimal positions. Default 0.
   */
  constructor (value, scale) {
    value = value || 0;
    scale = scale || 0;

    /** @private */
    this._value = value;
    /** @private */
    this._scale = scale;
    /** @private */
    this._intScale = 1;
    /** @private */
    this._intValue = 0;
    /** @private */
    this._sign = 1;

    for (let i = 0; i < scale; ++i) {
      this._intScale *= 10;
    }

    if (value < 0) {
      this._intValue = Math.round(-value * this._intScale + 0.000000001);
      this._sign = this._intValue === 0 ? 1 : -1;
    } else {
      this._intValue = Math.round(value * this._intScale + 0.000000001);
    }

    this._value = this._intValue * this._sign / this._intScale;
  }

  /**
   *  @return {number} Value
   */
  get value () {
    return this._value;
  }

  /**
   * @return {number} Number of decimal positions.
   */
  get scale () {
    return this._scale;
  }

  /**
   * Returns if [this] and [d] have the same value and scale
   * @param {!Dec} d Another Dec
   * @return {boolean} "true" if 'd' is equals to 'this'
   */
  eq (d) {
    return this._intValue === d._intValue &&
    this._intScale === d._intScale &&
    this._sign === d._sign;
  }

  /**
   * Returns if [this] and [d] have the same value. (Doesn't pay attention to
   * their scales)
   * @param {!Dec} d Another Dec
   * @return {boolean} "true" if 'd' is equals to 'this'
   */
  eqValue (d) {
    return (this._scale > d._scale)
      ? this.eq(new Dec(d._value, this._scale))
      : (this._scale < d._scale)
        ? new Dec(this._value, d._scale).eq(d)
        : this._intValue * this._sign === d._intValue * d._sign;

  }

  /**
   * Returns 1, 0 or -1 depending on [this] was greater, equal or lesser than
   * [d]. (Doesn't take into account their scales)
   * @param {!Dec} d Another Dec
   * @return {number} A number >, < or === 0 according to 'this' is >, < or
   *   === to 'd'
   */
  compare (d) {
    return (this._scale > d._scale)
      ? this.compare(new Dec(d._value, this._scale))
      : (this._scale < d._scale)
        ? new Dec(this._value, d._scale).compare(d)
        : this._intValue * this._sign - d._intValue * d._sign
    ;
  }

  /**
   * European format, with point of thousand and decimal comma.
   * @return {string} 'this' in 'european' format
   */
  toEu () {
    return format(this, ".", ",");
  }

  /**
   * English format, with comma of thousand  and decimal point.
   * @return {string} 'this' in 'english' format
   */
  toEn () {
    return format(this, ",", ".");
  }

  /**
   * Return [this] in base format.
   * @return {string} 'this' in 'base' format
   */
  toString () {
    let r = String(this._intValue);
    if (this._scale > 0) {
      while (r.length < this._scale + 1) r = "0" + r;
      const ix = r.length - this._scale;
      r = r.substring(0, ix) + "." + r.substring(ix);
    }
    return (this._sign === 1) ? r : "-" + r;
  }

  /** @return {!Array<?>} Serialization of 'this' */
  serialize () {
    return [this._value, this._scale];
  }

  /**
   * [s] must be in base format.
   * @param {string} s A string.
   * @return {boolean} 'true' if s is a number.
   */
  static isNumber (s) {
    return !isNaN(s) && s !== "";
  }

  /**
   * Test if [s] is in English format
   * @param {string} s A string.
   * @return {boolean} 'true' if s is a number.
   */
  static isNumberEn (s) {
    return Dec.isNumber(s.split(",").join(""));
  }

  /**
   * Test if [s] is in European format
   * @param {string} s A string.
   * @return {boolean} 'true' if s is a number.
   */
  static isNumberEu (s) {
    return Dec.isNumber(
      s.split(".").join("").split(",").join(".")
    );
  }

  /**
   * Returns 's' (base format) converted to Float o null if 's' is not a
   * number
   * @param {string} s A string.
   * @return {number | null} A number of null
   */
  static toFloat (s) {
    return Dec.isNumber(s) ? parseFloat(s) : null;
  }

  /**
   * Returns 's' (English format) converted to Float o null if 's' is not a
   * number
   * @param {string} s A string.
   * @return {number | null} A number of null
   */
  static toFloatEn (s) {
    s = s.split(",").join("");
    return Dec.isNumber(s) ? parseFloat(s) : null;
  }

  /**
   * Returns 's' (base format) converted to Float o null if 's' is not a
   * number
   * @param {string} s A string.
   * @return {number | null} A number of null
   */
  static toFloatEu (s) {
    s = s.split(".").join("").split(",").join(".");
    return Dec.isNumber(s) ? parseFloat(s) : null;
  }

  /**
   * [s] must be in English format.
   * @param {string} s A string
   * @param {number} scale Number of decimals
   * @return {!Dec} A new Dec
   */
  static newEn (s, scale) {
    return new Dec(parseFloat(s.split(",").join("")), scale);
  }

  /**
   * [s] must be in European format.
   * @param {string} s  A string
   * @param {number} scale Number of decimals
   * @return {!Dec} A new Dec
   */
  static newEu (s, scale) {
    return new Dec(parseFloat(
      s.split(".").join("").split(",").join(".")
    ), scale);
  }

  /**
   * [s] must be in base format.
   * @param {string} s  A string
   * @param {number} scale Number of decimals
   * @return {!Dec} A new Dec
   */
  static newStr (s, scale) {
    return new Dec(parseFloat(s), scale);
  }

  /**
   * Returns a random integer between [n1] included and [n2] included. [n1]
   * can be upper or lower than n2.<p>
   * Result has a scale equals to the Dec with it greater.
   * @param {!Dec} n1 A number
   * @param {!Dec} n2 Other number
   * @return {!Dec} A new Dec
   */
  static rnd (n1, n2) {
    const sc = (n1._scale > n2._scale) ? n1._scale : n2._scale;
    const dif = n2._value - n1._value;
    return new Dec(n1._value + Math.random() * dif, sc);
  }

  /**
   * @param {!Array<?>} serial A serializacion of Dec
   * @return {!Dec} A new Dec
   */
  static restore (serial) {
    return new Dec(serial[0], serial[1]);
  }

}

