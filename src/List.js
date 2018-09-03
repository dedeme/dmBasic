// Copyright 02-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Inmutable container

goog.provide("github_dedeme.List");

/** @template T */
github_dedeme.List/**/ = class {
  constructor () {
    /** @private */
    this._head = undefined;
    /** @private */
    this._tail = null;
  }

  /**
   * Returns the first element or 'undefined' if 'this' is empty. It can
   * retuns a 'null' value.
   * @template T
   * @return {T | null | undefined}
   */
  head () {
    return this._head;
  }

  /**
   * Returns all elements of this but the first one or 'null' if 'this' is
   * empty.
   * @template T
   * @return {?github_dedeme.List<T>}
   */
  tail () {
    return this._tail;
  }

  /**
   * Returns a new List with 'e' adds at the head of 'this'
   * @param {T} e
   * @return {!github_dedeme.List<T>}
   */
  cons (e) {
    let r = new github_dedeme.List()/**/;
    r._head = e;
    r._tail = this;
    return r;
  }

  /** @return {!github_dedeme.List<T>} */
  reverse () {
    let r = new github_dedeme.List()/**/;
    let l = this;
    while (l._tail !== null) {
      r = r.cons(l._head);
      l = l._tail;
    }
    return r;
  }
};
