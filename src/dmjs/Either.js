// Copyright 26-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>


/**
    Utilities for compatiblity with Haskell.
    @template L, R
**/
export default class Either {

  /**
      @private
      @param {L} l
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
      @return {!L}
      @throws {string}
  **/
  fromLeft () {
    if (this._l === null) throw new Error("Either.fromLeft: Either is Right");
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
  fromEither (d) {
    if (this._l === null) return d;
    return this._r;
  }

  /**
      Returns the value if 'this' is 'Right'. Otherwise throws an exception
      with the value of 'Left'.
      @return {!R}
      @throws {!L}
  **/
  withFail () {
    if (this._r === null) throw new Error(this._l);
    return this._r;
  }

  /**
      @template U
      @param {function(!R):!U} fn
      @return {!Either<L, U>}
  **/
  fmap (fn) {
    if (this._r === null) return Either.left(this._l);
    return Either.right(fn(this._r));
  }

  /**
      @template U
      @param {!Either<L, function(!R):!U>} fn
      @return {!Either<L, U>}
  **/
  comp (fn) {
    if (fn._r === null) return Either.left(fn._l);
    return this.fmap(fn._r);
  }

  /**
      @template U
      @param {function(!R):!Either<L, U>} fn
      @return {!Either<L, U>}
  **/
  bind (fn) {
    if (this._r === null) return Either.left(this._l);
    return fn(this._r);
  }

  /**
      @param {function(!L):!Array<?>} fnL
      @param {function(!R):!Array<?>} fnR
      @return {!Array<?>} Serialization of 'this'.
  **/
  toJs (fnL, fnR) {
    if (this._r === null) return [false].concat(fnL(this._l));
    return [true].concat(fnR(this._r));
  }

  /**
      @template L
      @template R
      @param {!L} l
      @return {!Either<L, R>}
  **/
  static left (l) {
    return new Either(l, null);
  }

  /**
    @template L
    @template R
    @param {!R} r
    @return {!Either<L, R>}
  **/
  static right (r) {
    return new Either(null, r);
  }

  /**
      @template L
      @template R
      Simplification.
      @param {!Either<L, Either<L, R>>} ei
      @return {!Either<L, R>}
  **/
  static flat (ei) {
    if (ei._r === null) return Either.left(ei._l);
    return ei._r;
  }

  /**
      @template L
      @template R
      @param {!Array<?>} js
      @param {function(Array<?>):!L} fnL
      @param {function(Array<?>):!R} fnR
      @return {!Either<L, R>}
  **/
  static fromJs (js, fnL, fnR) {
    if (js.shift()) return Either.right(fnR(js));
    return Either.left(fnL(js));
  }

  /**
      @template L
      @template R
      @param {!Iterable<!Either<L, R>>} it
      @return {!Either<L, !Array<R>>}
  **/
  static fromIterable (it) {
    const r = [];
    for (const e of it)
      if (e._r === null) return Either.left(e._l);
      else r.push(e._r);
    return Either.right(r);
  }

}
