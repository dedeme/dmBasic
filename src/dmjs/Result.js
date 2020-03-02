// Copyright 26-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Utilities for compatiblity with Haskell. */

import Either from "./Either.js"; // eslint-disable-line

/**
    @template R
**/
export default class Result {
  /**
      @private
      @param {boolean} isR
      @param {string|R} val
  **/
  constructor (isR, val) {
    this._isR = isR;
    this._val = val;
  }

  /**
      Returns 'true' if 'this' is a 'Left' value.
      return {bool}
  **/
  isLeft () {
    return !this._isR;
  }

  /**
      Returns 'true' if 'this' is a 'Right' value.
      return {bool}
  **/
  isRight () {
    return this._isR;
  }

  /**
      Returns the value if 'this' is 'Left' or throw an exception if it is
      'Right'.
      @return {string}
      @throws {string}
  **/
  fromLeft () {
    if (this._isR) throw new Error("Result.fromLeft: Either is Right");
    return this._val;
  }

  /**
      Returns the value if 'this' is 'Right' or throw an exception if it is
      'Left'.
      @return {R}
      @throws {string}
  **/
  fromRight () {
    if (!this._isR) throw new Error("Result.fromRight: Either is Left");
    return this._val;
  }

  /**
    Returns the value if 'this' is 'Right' or 'd' if it is 'Left'
    @param {R} d
    @return {R}
  **/
  fromResult (d) {
    if (this._isR) return this._val;
    return d;
  }

  /**
      Returns the value if 'this' is 'Right'. Otherwise throws an exception
      with the value of 'Left'.
      @return {R}
      @throws {string}
  **/
  withFail () {
    if (this._isR) return this._val;
    throw new Error(this._val);
  }

  /**
      @template U
      @param {function(R):U} fn
      @return {!Result<U>}
  **/
  fmap (fn) {
    if (this._isR) return Result.right(fn(this._val));
    return /** @type {!Result<U>} */ (this);
  }

  /**
      @template U
      @param {!Result<function(R):U>} fn
      @return {!Result<U>}
  **/
  comp (fn) {
    if (fn._isR) return this.fmap(/** @type {function(R):U}} */ (fn._val));
    return /** @type {!Result<U>} */ (this);
  }

  /**
      @template U
      @param {function(R):!Result<U>} fn
      @return {!Result<U>}
  **/
  bind (fn) {
    if (this._isR) return fn(this._val);
    return /** @type {!Result<U>} */ (this);
  }

  /**
      @param {function(R):!Array<?>=} fnR
      @return {!Array<?>} Serialization of 'this'.
  **/
  toJs (fnR) {
    return [
      this._isR,
      this._isR
        ? fnR === undefined ? this._val : fnR(this._val)
        : this._val
    ];
  }

  /**
      @template R
      @param {string} l
      @return {!Result<R>}
  **/
  static left (l) {
    return new Result(false, l);
  }

  /**
    @template R
    @param {R} r
    @return {!Result<R>}
  **/
  static right (r) {
    return new Result(true, r);
  }

  /**
      @return {!Either<string, R>}
      @suppress {checkTypes}
  **/
  toEither () {
    return /** @type {!Either<string, R>} */ (this);
  }

  /**
      @template R
      Simplification.
      @param {!Result<!Result<R>>} rs
      @return {!Result<R>}
  **/
  static flat (rs) {
    if (rs._isR) return /** @type {!Result<R>} */ (rs._val);
    return Result.left(/** @type {string} */ (rs._val));
  }

  /**
      @template R
      @param {!Array<?>} js
      @param {function(!Array<?>):R=} fnR
      @return {!Result<R>}
  **/
  static fromJs (js, fnR) {
    const isR = js[0];
    return isR
      ? fnR === undefined ? Result.right(js[1]) : Result.right(fnR(js[1]))
      : Result.left(js[1])
    ;
  }

  /**
      @template T
      @template L
      @param {!Either<L, T>} ei
      @param {function(L):string} fn
      @return {!Result<T>}
  **/
  static fromEither (ei, fn) {
    if (ei.isLeft()) return Result.left(fn(ei.fromLeft()));
    return Result.right(ei.fromRight());
  }

  /**
      @template R
      @param {!Iterable<!Result<R>>} it
      @return {!Result<!Array<R>>}
  **/
  static fromIterable (it) {
    const r = [];
    for (const e of it)
      if (e._isR) r.push(e._val);
      else return Result.left(e._val);
    return Result.right(r);
  }

}
