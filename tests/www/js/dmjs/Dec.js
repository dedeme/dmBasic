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
export default class Dec {
  constructor (value, scale) {
    value = value || 0;
    scale = scale || 0;
    this._value = value;
    this._scale = scale;
    this._intScale = 1;
    this._intValue = 0;
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
  get value () {
    return this._value;
  }
  get scale () {
    return this._scale;
  }
  eq (d) {
    return this._intValue === d._intValue &&
    this._intScale === d._intScale &&
    this._sign === d._sign;
  }
  eqValue (d) {
    return (this._scale > d._scale)
      ? this.eq(new Dec(d._value, this._scale))
      : (this._scale < d._scale)
        ? new Dec(this._value, d._scale).eq(d)
        : this._intValue * this._sign === d._intValue * d._sign;
  }
  compare (d) {
    return (this._scale > d._scale)
      ? this.compare(new Dec(d._value, this._scale))
      : (this._scale < d._scale)
        ? new Dec(this._value, d._scale).compare(d)
        : this._intValue * this._sign - d._intValue * d._sign
    ;
  }
  toEu () {
    return format(this, ".", ",");
  }
  toEn () {
    return format(this, ",", ".");
  }
  toString () {
    let r = String(this._intValue);
    if (this._scale > 0) {
      while (r.length < this._scale + 1) r = "0" + r;
      const ix = r.length - this._scale;
      r = r.substring(0, ix) + "." + r.substring(ix);
    }
    return (this._sign === 1) ? r : "-" + r;
  }
  serialize () {
    return [this._value, this._scale];
  }
  static isNumber (s) {
    return !isNaN(s) && s !== "";
  }
  static isNumberEn (s) {
    return Dec.isNumber(s.split(",").join(""));
  }
  static isNumberEu (s) {
    return Dec.isNumber(
      s.split(".").join("").split(",").join(".")
    );
  }
  static toFloat (s) {
    return Dec.isNumber(s) ? parseFloat(s) : null;
  }
  static toFloatEn (s) {
    s = s.split(",").join("");
    return Dec.isNumber(s) ? parseFloat(s) : null;
  }
  static toFloatEu (s) {
    s = s.split(".").join("").split(",").join(".");
    return Dec.isNumber(s) ? parseFloat(s) : null;
  }
  static newEn (s, scale) {
    return new Dec(parseFloat(s.split(",").join("")), scale);
  }
  static newEu (s, scale) {
    return new Dec(parseFloat(
      s.split(".").join("").split(",").join(".")
    ), scale);
  }
  static newStr (s, scale) {
    return new Dec(parseFloat(s), scale);
  }
  static rnd (n1, n2) {
    const sc = (n1._scale > n2._scale) ? n1._scale : n2._scale;
    const dif = n2._value - n1._value;
    return new Dec(n1._value + Math.random() * dif, sc);
  }
  static restore (serial) {
    return new Dec(serial[0], serial[1]);
  }
}
