// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Some mathematical functions, rounding and numeric formats
goog.provide("github_dedeme.Dec");

{

  /**
   * @type function(!github_dedeme.Dec, string, string):string
   */
  const format = (d, thousand, decimal) => {
    const scale = d._scale;
    let left = String(d._intValue);
    let right = "";
    if (scale > 0) {
      while (left.length < scale + 1) {
        left = "0" + left;
      }
      let ix = left.length - scale;
      right = decimal + left.substring(ix);
      left = left.substring(0, ix);
    }
    let size = 3;
    while (left.length > size) {
      let ix = left.length - size;
      left = left.substring(0, ix) + thousand + left.substring(ix);
      size += 4;
    }
    return ((d._sign == 1)? "" : "-") + left + right;
  };

  github_dedeme.Dec/**/ = class {
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
        this._intValue = Math.round (-value * this._intScale + 0.000000001);
        this._sign = this._intValue == 0 ? 1 : -1;
      } else {
        this._intValue = Math.round (value * this._intScale + 0.000000001);
      }

      this._value = this._intValue * this._sign / this._intScale;
    }

    /** @return {number} */
    value () {
      return this._value;
    }

    /**
   * Number of decimal positions.
   * @return {number}
   */
    scale () {
      return this._scale;
    }

    /**
   * Returns if [this] and [d] have the same value and scale
   * @param {!github_dedeme.Dec} d
   * @return {boolean}
   */
    eq (d){
      return this._intValue == d._intValue &&
      this._intScale == d._intScale &&
      this._sign == d._sign;
    }

    /**
   * Returns if [this] and [d] have the same value. (Doesn't pay attention to
   * their scales)
   * @param {!github_dedeme.Dec} d
   * @return {boolean}
   */
    eqValue (d) {
      return (this._scale > d._scale)
        ? this.eq (new github_dedeme.Dec (d._value, this._scale))
        : (this._scale < d._scale)
          ? new github_dedeme.Dec (this._value, d._scale).eq(d)
          : this._intValue * this._sign == d._intValue * d._sign;

    }

    /**
   * Returns 1, 0 or -1 depending on [this] was greater, equal or lesser than
   * [d]. (Doesn't take into account their scales)
   * @param {!github_dedeme.Dec} d
   * @return {number}
   */
    compare (d) {
      return (this._scale > d._scale)
        ? this.compare (new github_dedeme.Dec (d._value, this._scale))
        : (this._scale < d._scale)
          ? new github_dedeme.Dec (this._value, d._scale).compare(d)
          : this._intValue * this._sign - d._intValue * d._sign
      ;
    }

    /**
   * European format, with point of thousand and decimal comma.
   * @return {string}
   */
    toEu () {
      return format(this, ".", ",");
    }

    /**
   * English format, with comma of thousand  and decimal point.
   * @return {string}
   */
    toEn () {
      return format(this, ",", ".");
    }

    /**
   * Return [this] in base format.
   * @return {string}
   */
    toString () {
      let r = String(this._intValue);
      if (this._scale > 0) {
        while (r.length < this._scale + 1) r = "0" + r;
        let ix = r.length - this._scale;
        r = r.substring(0, ix) + "." + r.substring(ix);
      }
      return (this._sign == 1)? r : "-" + r;
    }

    /** @return {!Array<?>} */
    serialize () {
      return [this._value, this._scale];
    }

    /**
   * [s] must be in base format.
   * @param {string} s
   * @return {boolean}
   */
    static isNumber (s) {
      return !isNaN(s) && s != "";
    }

    /**
   * Test if [s] is in English format
   * @param {string} s
   * @return {boolean}
   */
    static isNumberEn (s) {
      return github_dedeme.Dec/**/.isNumber(s.split(",").join(""));
    }

    /**
   * Test if [s] is in European format
   * @param {string} s
   * @return {boolean}
   */
    static isNumberEu (s) {
      return github_dedeme.Dec/**/.isNumber(
        s.split(".").join("").split(",").join(".")
      );
    }

    /**
   * Returns 's' (base format) converted to Float o null if 's' is not a
   * number
   * @param {string} s
   * @return {number | null}
   */
    static toFloat (s) {
      return github_dedeme.Dec/**/.isNumber(s) ? parseFloat(s) : null;
    }

    /**
   * Returns 's' (English format) converted to Float o null if 's' is not a
   * number
   * @param {string} s
   * @return {number | null}
   */
    static toFloatEn (s) {
      s = s.split(",").join("");
      return github_dedeme.Dec/**/.isNumber(s) ? parseFloat(s) : null;
    }

    /**
   * Returns 's' (base format) converted to Float o null if 's' is not a
   * number
   * @param {string} s
   * @return {number | null}
   */
    static toFloatEu (s) {
      s = s.split(".").join("").split(",").join(".");
      return github_dedeme.Dec/**/.isNumber(s) ? parseFloat(s) : null;
    }

    /**
   * [s] must be in English format.
   * @param {string} s
   * @param {number} scale
   * @return {!github_dedeme.Dec}
   */
    static newEn (s, scale) {
      return new github_dedeme.Dec(parseFloat(s.split(",").join("")), scale);
    }

    /**
   * [s] must be in European format.
   * @param {string} s
   * @param {number} scale
   * @return {!github_dedeme.Dec}
   */
    static newEu (s, scale) {
      return new github_dedeme.Dec(parseFloat (
        s.split(".").join("").split(",").join(".")
      ), scale);
    }

    /**
   * [s] must be in base format.
   * @param {string} s
   * @param {number} scale
   * @return {!github_dedeme.Dec}
   */
    static newStr (s, scale) {
      return new github_dedeme.Dec(parseFloat(s), scale);
    }

    /**
   * Returns a random integer between [n1] included and [n2] included. [n1]
   * can be upper or lower than n2.<p>
   * Result has a scale equals to the Dec with it greater.
   * @param {!github_dedeme.Dec} n1
   * @param {!github_dedeme.Dec} n2
   * @return {!github_dedeme.Dec}
   */
    static rnd (n1, n2) {
      let sc = (n1._scale > n2._scale) ? n1._scale : n2._scale;
      let dif = n2._value - n1._value;
      return new github_dedeme.Dec (n1._value + Math.random() * dif, sc);
    }

    /**
   * @param {!Array<?>} serial
   * @return {!github_dedeme.Dec}
   */
    static restore (serial) {
      return new github_dedeme.Dec(serial[0], serial[1]);
    }

  }; }

