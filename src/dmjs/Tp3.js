// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Immutable tuple of three elements.

import Tp from "./Tp.js";

/**
 * @extends {Tp}
 * @template A, B, C
 */
export default class Tp3 extends Tp {
  /**
   * @param {A} e1 First element
   * @param {B} e2 Second element
   * @param {C} e3 Tird element
   */
  constructor (e1, e2, e3) {
    super(e1, e2);
    /** @private */
    this._e3 = e3;
  }

  /**
   * @template C
   * @return {C} The third element of 'this'
   */
  get e3 () {
    return this._e3;
  }

}
