// Copyright 04-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>


import It from "./It.js";

/** Wrapper for HTML5 Store */
export default class Store {

  /**
   * Removes all keys of local storage
   * @return {void}
   */
  static clear () {
    window.localStorage.clear();
  }

  /**
   * Removes the key [key]  of local storage
   * @param {string} key Param
   * @return {void}
   */
  static del (key) {
    window.localStorage.removeItem(key);
  }

  /**
   * Removes some [keys] past the time [time] since it was called itself.<p>
   * If it has not called ever delete keys too.
   * @param {string} tKey Storage key for saving the time
   * @param {!Array<string>} keys Array with the keys to remove
   * @param {number}time Time in hours
   * @return {void}
   */
  static expires (tKey, keys, time) {
    const dt = new Date(Date.now()).getTime();
    const ks = Store.take(tKey);
    if (ks === null || dt > Number(ks)) {
      keys.forEach(k => {
        Store.del(k);
      });
    }
    Store.put(tKey, String(dt + time * 3600000));
  }

  /**
   * Returns the value of key [key] or <b>null</b> if it does not exists
   * of local storage.
   * @param {string} key Param
   * @return {?string} Result
   */
  static take (key) {
    const r = window.localStorage.getItem(key);
    return r === "null" ? null : r;
  }

  /**
   * Returns the key in position [ix] of local storage.
   * @param {number} ix Param
   * @return {?string} Result
   */
  static key (ix) {
    return window.localStorage.key(ix);
  }

  /**
   * Returns a It with all keys of local storage.
   * @return {!It<string>} Result
   */
  static keys () {
    const sz = Store.size();
    const it = c =>
      new It(
        () => c < sz,
        () => window.localStorage.key(c),
        () => it(c + 1)
      );
    return it(0);
  }

  /**
   * Puts a new value in local storage.
   * @param {string} key Param
   * @param {string} value Param
   * @return {void}
   */
  static put (key, value) {
    window.localStorage.setItem(key, value);
  }

  /**
   * Returns the number of elements of local storage
   * @return {number} Result
   */
  static size () {
    return window.localStorage.length;
  }

  /**
   * Returns a It with all values of local storage.
   * @return {!It<string>} Result
   */
  static values () {
    return Store.keys()
      .map(e => Store.get(e));
  }

  /**
   * Removes all keys of session storage
   * @return {void}
   */
  static sessionClear () {
    window.sessionStorage.clear();
  }

  /**
   * Removes the key [key]  of session storage
   * @param {string} key Param
   * @return {void}
   */
  static sessionDel (key) {
    window.sessionStorage.removeItem(key);
  }

  /**
   * Returns the value of key [key] or <b>null</b> if it does not exists
   * of session storage.
   * @param {string} key Param
   * @return {?string} Result
   */
  static sessionTake (key) {
    const r = window.sessionStorage.getItem(key);
    return r === "null" ? null : r;
  }

  /**
   * Returns the key in position [ix] of session storage.
   * @param {number} ix Param
   * @return {?string} Result
   */
  static sessionKey (ix) {
    return window.sessionStorage.key(ix);
  }

  /**
   * Returns a It with all keys of session storage.
   * @return {!It<string>} Result
   */
  static sessionKeys () {
    const sz = Store.size();
    const it = c =>
      new It(
        () => c < sz,
        () => window.sessionStorage.key(c),
        () => it(c + 1)
      );
    return it(0);
  }

  /**
   * Puts a new value in session storage.
   * @param {string} key Param
   * @param {string} value Param
   * @return {void}
   */
  static sessionPut (key, value) {
    window.sessionStorage.setItem(key, value);
  }

  /**
   * Returns the number of elements of session storage
   * @return {number} Result
   */
  static sessionSize () {
    return window.sessionStorage.length;
  }

  /**
   * Returns a It with all values of session storage.
   * @return {!It<string>} Result
   */
  static sessionValues () {
    return Store.sessionKeys()
      .map(e => Store.sessionTake(e));
  }

}

