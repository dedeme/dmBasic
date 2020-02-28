// Copyright 26-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>


/**
    Utilities for compatiblity with Haskell.
    @template L, R
**/
export default class Either {

  /**
      @private
      @param {boolean} isR
      @param {L|R} val
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
      @return {!L}
      @throws {string}
  **/
  fromLeft () {
    if (this._isR) throw new Error("Either.fromLeft: Either is Right");
    return this._val;
  }

  /**
      Returns the value if 'this' is 'Right' or throw an exception if it is
      'Left'.
      @return {!R}
      @throws {string}
  **/
  fromRight () {
    if (!this._isR) throw new Error("Either.fromRight: Either is Left");
    return this._val;
  }

  /**
    Returns the value if 'this' is 'Right' or 'd' if it is 'Left'
    @param {!R} d
    @return {!R}
  **/
  fromEither (d) {
    if (this._isR) return this._val;
    return d;
  }

  /**
      Returns the value if 'this' is 'Right'. Otherwise throws an exception
      with the value of 'Left'.
      @return {!R}
      @throws {!L}
  **/
  withFail () {
    if (this._isR) return this._val;
    throw new Error(this._val);
  }

  /**
      @template U
      @param {function(!R):!U} fn
      @return {!Either<L, U>}
  **/
  fmap (fn) {
    if (this._isR) return Either.right(fn(this._val));
    return Either.left(this._val);
  }

  /**
      @template U
      @param {!Either<L, function(!R):!U>} fn
      @return {!Either<L, U>}
  **/
  comp (fn) {
    if (fn._isR) return this.fmap(fn._val);
    return Either.left(fn._val);
  }

  /**
      @template U
      @param {function(!R):!Either<L, U>} fn
      @return {!Either<L, U>}
  **/
  bind (fn) {
    if (this._isR) return fn(this._val);
    return Either.left(this._val);
  }

  /**
      @param {function(!L):!Array<?>} fnL
      @param {function(!R):!Array<?>} fnR
      @return {!Array<?>} Serialization of 'this'.
  **/
  toJs (fnL, fnR) {
    return [this._isR, this._isR ? fnR(this._val) : fnL(this._val)];
  }

  /**
      @template L
      @template R
      @param {!L} l
      @return {!Either<L, R>}
  **/
  static left (l) {
    return new Either(false, l);
  }

  /**
    @template L
    @template R
    @param {!R} r
    @return {!Either<L, R>}
  **/
  static right (r) {
    return new Either(true, r);
  }

  /**
      @template L
      @template R
      Simplification.
      @param {!Either<L, Either<L, R>>} ei
      @return {!Either<L, R>}
  **/
  static flat (ei) {
    if (ei._isR) return ei._val;
    return Either.left(ei._val);
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
      if (e._isR) r.push(e._val);
      else return Either.left(e._val);
    return Either.right(r);
  }

}
