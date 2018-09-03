import It from "./It.js";
export default class Store {
  static clear () {
    window.localStorage.clear();
  }
  static del (key) {
    window.localStorage.removeItem(key);
  }
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
  static take (key) {
    const r = window.localStorage.getItem(key);
    return r === "null" ? null : r;
  }
  static key (ix) {
    return window.localStorage.key(ix);
  }
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
  static put (key, value) {
    window.localStorage.setItem(key, value);
  }
  static size () {
    return window.localStorage.length;
  }
  static values () {
    return Store.keys()
      .map(e => Store.get(e));
  }
  static sessionClear () {
    window.sessionStorage.clear();
  }
  static sessionDel (key) {
    window.sessionStorage.removeItem(key);
  }
  static sessionTake (key) {
    const r = window.sessionStorage.getItem(key);
    return r === "null" ? null : r;
  }
  static sessionKey (ix) {
    return window.sessionStorage.key(ix);
  }
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
  static sessionPut (key, value) {
    window.sessionStorage.setItem(key, value);
  }
  static sessionSize () {
    return window.sessionStorage.length;
  }
  static sessionValues () {
    return Store.sessionKeys()
      .map(e => Store.sessionTake(e));
  }
}
