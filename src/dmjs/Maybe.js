// Copyright 26-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Either from "./Either.js";
import Result from "./Result.js";

/**
    Utilities for compatiblity with Haskell.
    @template T
**/
export default class Maybe {

  /**
      @private
      @param {T} e
  **/
  constructor (e) {
    this._e = e;
  }

  /**
      Returns 'true' if 'this' is a 'Nothing' value.
      return {bool}
  **/
  isNothing () {
    return this._e === null;
  }

  /**
      Returns 'true' if 'this' is a 'Just' value.
      return {bool}
  **/
  isJust () {
    return this._e !== null;
  }

  /**
      Returns the value if 'this' is 'Just' or throws an exception if it is
      'Nothing'.
      @return {T}
      @throws {string}
  **/
  fromJust () {
    if (this._e === null) throw new Error("Maybe.fromJust: Nothing");
    return this._e;
  }

  /**
    Returns the value if 'this' is 'Just' or 'd' if it is 'Nothing'
    @param {T} d
    @return {T}
  **/
  fromMaybe (d) {
    if (this._e === null) return d;
    return this._e;
  }

  /**
      Executes fElse if 'this' is 'Nothing'. Otherwise executes fIf
      @param {function(T):void} fIf
      @param {function():void} fElse
      @return
  **/
  ifElse (fIf, fElse) {
    if (this._e === null) fElse();
    else fIf(this._e);
  }

  /**
      Returns the value if 'this' is 'Just' or throw an exception with the
      message 'msg' if it is 'Nothing'
      @param {string} msg
      @return {T}
      @throws {string}
  **/
  withFail (msg) {
    if (this._e === null) throw new Error(msg);
    return this._e;
  }

  /**
      fn(t->u) -> M<u>
      @template U
      @param {function(T):!U} fn
      @return {!Maybe<U>}
  **/
  fmap (fn) {
    if (this._e === null) return Maybe.nothing;
    return Maybe.just(fn(this._e));
  }

  /**
      M<fn(t->u)> -> M<u>
      @template U
      @param {!Maybe<function(T):!U>} fn
      @return {!Maybe<U>}
  **/
  comp (fn) {
    if (fn._e === null) return Maybe.nothing;
    return this.fmap(fn._e);
  }

  /**
      fn(t->M<u>) -> M<u>
      @template U
      @param {function(T):!Maybe<U>} fn
      @return {!Maybe<U>}
  **/
  bind (fn) {
    if (this._e === null) return Maybe.nothing;
    return fn(this._e);
  }

  /**
      @template L
      @param {L} d
      @return {!Either<L, T>}
  **/
  toEither (d) {
    if (this._e === null) return Either.left(d);
    return Either.right(this._e);
  }

  /**
      @param {string} d
      @return {!Result<T>}
  **/
  toResult (d) {
    if (this._e === null) return Result.left(d);
    return Result.right(this._e);
  }

  /**
      @param {function(T):!Array<?>=} fn
      @return {!Array<?>} Serialization of 'this'.
  **/
  toJs (fn) {
    return (this._e === null)
      ? []
      : fn === undefined ? [this._e] : [fn(this._e)]
    ;
  }

  /**
      @return {!Maybe<?>}
  **/
  static get nothing () {
    return Maybe._nothing;
  }

  /**
    @template T
    @param {T} e
    @return {!Maybe<T>}
  **/
  static just (e) {
    return new Maybe(e);
  }

  /**
      @template T
      Simplification.
      @param {!Maybe<!Maybe<T>>} mb
      @return {!Maybe<T>}
  **/
  static flat (mb) {
    if (mb._e === null) return Maybe.nothing;
    return mb._e;
  }

  /**
      @template T
      @param {!Array<?>} js
      @param {function(!Array<?>):T=} fn
      @return {!Maybe<T>}
  **/
  static fromJs (js, fn) {
    return js.length
      ? fn === undefined ? Maybe.just(js[0]) : Maybe.just(fn(js[0]))
      : Maybe.nothing
    ;
  }

  /**
      @template T
      @template L
      @param {!Either<L, T>} ei
      @return {!Maybe<T>}
  **/
  static fromEither (ei) {
    if (ei.isLeft()) return Maybe.nothing;
    return Maybe.just(ei.fromRight());
  }

  /**
      @template T
      @param {!Result<T>} rs
      @return {!Maybe<T>}
  **/
  static fromResult (rs) {
    if (rs.isLeft()) return Maybe.nothing;
    return Maybe.just(rs.fromRight());
  }

  /**
      @template T
      @param {!Iterable<!Maybe<T>>} it
      @return {!Maybe<!Array<T>>}
  **/
  static fromIterable (it) {
    const r = [];
    for (const e of it)
      if (e._e === null) return Maybe.nothing;
      else r.push(e._e);
    return Maybe.just(r);
  }

}

Maybe._nothing = new Maybe(null);
