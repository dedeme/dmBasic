// Copyright 26-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Utilities for compatiblity with Haskell. */

import Either from "./Either.js";

/**
    @template R
    @extends {Either<string, R>}
**/
export default class Result extends Either {

  /**
      @return {!Either<string, R>}
  **/
  toEither () {
    return this;
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
      @template L
      @template R
      @param {string} l
      @return {!Result<R>}
  **/
  static left (l) {
    return new Result(l, null);
  }

  /**
    @template L
    @template R
    @param {!R} r
    @return {!Result<R>}
  **/
  static right (r) {
    return new Result(null, r);
  }

  /**
      @template R
      Simplification.
      @param {!Result<Result<R>>} rs
      @return {!Result<R>}
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
  **/
  static fromIterable (it) {
    const r = [];
    for (const e of it)
      if (e._r === null) return Result.left(e._l);
      else r.push(e._r);
    return Result.right(r);
  }

}
