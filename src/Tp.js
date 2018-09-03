// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Tuple of two elemens

goog.provide("github_dedeme.Tp");

/** @template A, B */
github_dedeme.Tp/**/ = class {
  /**
   * @param {A} e1
   * @param {B} e2
   */
  constructor (e1, e2) {
    /** @private */
    this._e1 = e1;
    /** @private */
    this._e2 = e2;
  }

  /** @return {A} */
  e1 () {
    return this._e1;
  }

  /** @param {A} value */
  setE1 (value) {
    this._e1 = value;
  }

  /** @return {B} */
  e2 () {
    return this._e2;
  }

  /** @param {B} value */
  setE2 (value) {
    this._e2 = value;
  }
};
