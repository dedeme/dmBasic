// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Rnd from "./Rnd.js";
//eslint-disable-next-line
import Tp from "./Tp.js";

/**
 * Random Box
 * @template T
 */
export default class Rbox {

  /** @param {!Array<T>} es Elements of Rbox */
  constructor (es) {
    /** @private */
    this._es = es;
    /** @private */
    this._box = Array.from(es);
    Rbox.shuffle(this._box);

    this[Symbol.iterator] = () => {
      return {
        "next": () => {
          return {"done": false, "value": this.next()};
        }
      };
    };
  }

  /**
   * Returns next random element.
   * @return {T} Next element.
   */
  next () {
    if (this._box.length === 0) {
      this._box = Array.from(this._es);
      Rbox.shuffle(this._box);
    }
    return this._box.pop();
  }

  /**
   * Returns a Rbox with repeated elements
   * @template T
   * @param {!Array<!Tp<T, number>>} es Description of box elements.
   *        For example:
   *        Rbox.mk([("a", 1),("b", 2)]) creates elements "a","b","b".
   * @return {!Rbox<T>} A new Rbox
   */
  static mk (es) {
    const r = [];
    es.forEach(e => {
      for (let i = 0; i < e.e2; ++i) r.push(e.e1);
    });
    return new Rbox(r);
  }

  /**
   * Modifies randomly in place the elements order of 'a'.
   * @param {!Array<?>} a An array
   * @return {void}
   */
  static shuffle (a) {
    let ix = a.length;
    while (ix > 1) {
      const i = Rnd.i(ix);
      --ix;
      if (i !== ix) {
        [a[i], a[ix]] = [a[ix], a[i]];
      }
    }
  }

}
