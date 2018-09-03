import Tp from "./Tp.js";
export default class Tp3 extends Tp {
  constructor (e1, e2, e3) {
    super(e1, e2);
    this._e3 = e3;
  }
  get e3 () {
    return this._e3;
  }
}
