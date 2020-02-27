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
      @param {?string} l
      @param {R} r
  **/
  constructor (l, r) {
    this._l = l;
    this._r = r;
  }

  /**
      Returns 'true' if 'this' is a 'Left' value.
      return {bool}
  **/
  isLeft () {
    return this._l !== null;
  }

  /**
      Returns 'true' if 'this' is a 'Right' value.
      return {bool}
  **/
  isRight () {
    return this._r !== null;
  }

  /**
      Returns the value if 'this' is 'Left' or throw an exception if it is
      'Right'.
      @return {string}
      @throws {string}
  **/
  fromLeft () {
    if (this._l === null) throw new Error("Result.fromLeft: Result is Right");
    return this._l;
  }

  /**
      Returns the value if 'this' is 'Right' or throw an exception if it is
      'Left'.
      @return {!R}
      @throws {string}
  **/
  fromRight () {
    if (this._r === null) throw new Error("Either.fromRight: Either is Left");
    return this._r;
  }

  /**
    Returns the value if 'this' is 'Right' or 'd' if it is 'Left'
    @param {!R} d
    @return {!R}
  **/
  fromResult (d) {
    if (this._l === null) return d;
    return this._r;
  }

  /**
      Returns the value if 'this' is 'Right'. Otherwise throws an exception
      with the value of 'Left'.
      @return {!R}
      @throws {string}
  **/
  withFail () {
    if (this._r === null) throw new Error(this._l);
    return this._r;
  }

  /**
      @template U
      @param {function(!R):!U} fn
      @return {!Result<U>}
      @suppress {checkTypes}
  **/
  fmap (fn) {
    if (this._r === null) return Result.left(this._l);
    return Result.right(fn(this._r));
  }

  /**
      @template U
      @param {!Result<function(!R):!U>} fn
      @return {!Result<U>}
      @suppress {checkTypes}
  **/
  comp (fn) {
    if (fn._r === null) return Result.left(fn._l);
    return this.fmap(fn._r);
  }

  /**
      @template U
      @param {function(!R):!Result<U>} fn
      @return {!Result<U>}
      @suppress {checkTypes}
  **/
  bind (fn) {
    if (this._r === null) return Result.left(this._l);
    return fn(this._r);
  }

  /**
      @param {function(!R):!Array<?>} fnR
      @return {!Array<?>} Serialization of 'this'.
  **/
  toJs (fnR) {
    if (this._r === null) return [false, this._l];
    return [true].concat(fnR(this._r));
  }

  /**
      @template R
      @param {string} l
      @return {!Result<R>}
  **/
  static left (l) {
    return new Result(l, null);
  }

  /**
    @template R
    @param {!R} r
    @return {!Result<R>}
  **/
  static right (r) {
    return new Result(null, r);
  }

  /**
      @return {!Either<string, R>}
      @suppress {checkTypes}
  **/
  toEither () {
    return this;
  }

  /**
      @template R
      Simplification.
      @param {!Result<Result<R>>} rs
      @return {!Result<R>}
      @suppress {checkTypes}
  **/
  static flat (rs) {
    if (rs._r === null) return Result.left(rs._l);
    return rs._r;
  }

  /**
      @template R
      @param {!Array<?>} js
      @param {function(Array<?>):!R} fnR
      @return {!Result<R>}
  **/
  static fromJs (js, fnL, fnR) {
    if (js.shift()) return Result.right(fnR(js));
    return Result.left(js[0]);
  }

  /**
      @template T
      @template L
      @param {!Either<L, T>} ei
      @param {function(!L):string} fn
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
      @suppress {checkTypes}
  **/
  static fromIterable (it) {
    const r = [];
    for (const e of it)
      if (e._r === null) return Result.left(e._l);
      else r.push(e._r);
    return Result.right(r);
  }

}
