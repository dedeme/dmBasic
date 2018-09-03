import It from "./It.js";
export default class Domo {
  constructor (e) {
    this._e = e;
  }
  e () {
    return this._e;
  }
  html (tx) {
    if (tx === undefined) return this._e.innerHTML ;
    this._e.innerHTML  = tx;
    return this;
  }
  text (tx) {
    if (tx === undefined) return this._e.textContent ;
    this._e.textContent  = tx;
    return this;
  }
  klass (tx) {
    if (tx === undefined) return this._e.className ;
    this._e.className  = tx;
    return this;
  }
  style (s) {
    if (s === undefined) return this._e.getAttribute("style");
    this._e.setAttribute("style", s);
    return this;
  }
  setStyle (key, value) {
    this._e.style[key] = value;
    return this;
  }
  att (key, value) {
    if (value === undefined) return this._e.getAttribute(key);
    this._e.setAttribute(key, value);
    return this;
  }
  disabled (value) {
    if (value === undefined) return this._e.disabled ;
    this._e.disabled  = value;
    return this;
  }
  checked (value) {
    if (value === undefined) return this._e.checked ;
    this._e.checked  = value;
    return this;
  }
  value (v) {
    if (v === undefined) return this._e.value ;
    this._e.value  = v;
    return this;
  }
  add (el) {
    this._e.appendChild(el._e);
    return this;
  }
  adds (els) {
    els.forEach(el => {
      this._e.appendChild(el._e);
    });
    return this;
  }
  remove (el) {
    this._e.removeChild(el._e);
    return this;
  }
  removeAll () {
    this._e.innerHTML  = "";
    return this;
  }
  get nodes () {
    const it = node =>
      new It(
        () => node !== null,
        () => node,
        () => it(node.nextSibling)
      );
    return it(this._e.firstChild);
  }
  on (event, action) {
    this._e.addEventListener(event, action, false);
    return this;
  }
}
