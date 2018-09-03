import Rnd from "./Rnd.js";
export default class Rbox {
  constructor (es) {
    this._es = es;
    this._box = Array.from(es);
    Rbox.shuffle(this._box);
  }
  next () {
    if (this._box.length === 0) {
      this._box = Array.from(this._es);
      Rbox.shuffle(this._box);
    }
    return this._box.pop();
  }
  to () {
    const it = {};
    it[Symbol.iterator] = () => {
      return {
        "next": () => {
          return {"done": false, "value": this.next()}; 
        }
      };
    };
    return it;
  }
  static mk (es) {
    const r = [];
    es.forEach(function (e) {
      for (let i = 0; i < e.e2; ++i) r.push(e.e1);
    });
    return new Rbox(r);
  }
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
