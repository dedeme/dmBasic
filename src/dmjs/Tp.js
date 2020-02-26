// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
    Immutable tuples of two elemens.
    @template A, B
**/
export default class Tp {

  /**
      @param {A} e1 First element.
      @param {B} e2 Second element.
  **/
  constructor (e1, e2) {
    /**
        @private
    **/
    this._e1 = e1;
    /**
        @private
    **/
    this._e2 = e2;
  }

  /**
      @template A
      @return {A} The first element of 'this'.
  **/
  get e1 () {
    return this._e1;
  }

  /**
      @template B
      @return {B} The second element of 'this'.
  **/
  get e2 () {
    return this._e2;
  }

}
