// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import It from "./It.js";

/** Class for envelopping DOM objects */
export default class Domo {
  /** @param {*} e  Param*/
  constructor (e) {
    /** @private */
    this._e = e;
  }

  /** @return {*} Element wrapped */
  e () {
    return this._e;
  }

  /**
   * @param {string=} tx Param
   * @return {?} Result
   */
  html (tx) {
    if (tx === undefined) return this._e.innerHTML/**/;
    this._e.innerHTML/**/ = tx;
    return this;
  }

  /**
   * @param {string=} tx Param
   * @return {?} Result
   */
  text (tx) {
    if (tx === undefined) return this._e.textContent/**/;
    this._e.textContent/**/ = tx;
    return this;
  }

  /**
   * @param {string=} tx Param
   * @return {?} Result
   */
  klass (tx) {
    if (tx === undefined) return this._e.className/**/;
    this._e.className/**/ = tx;
    return this;
  }

  /**
   * @param {string=} s Param
   * @return {?} Result
   */
  style (s) {
    if (s === undefined) return this._e.getAttribute("style");
    this._e.setAttribute("style", s);
    return this;
  }

  /**
   * @param {string} key Style key
   * @param {string} value Style value
   * @return {!Domo} Result
   */
  setStyle (key, value) {
    this._e.style[key] = value;
    return this;
  }

  /**
   * @param {string} key Param
   * @param {?=} value Param
   * @return {?} Result
   */
  att (key, value) {
    if (value === undefined) return this._e.getAttribute(key);
    this._e.setAttribute(key, value);
    return this;
  }

  /**
   * @param {boolean=} value Param
   * @return {?} Result
   */
  disabled (value) {
    if (value === undefined) return this._e.disabled/**/;
    this._e.disabled/**/ = value;
    return this;
  }

  /**
   * @param {boolean=} value Param
   * @return {?} Result
   */
  checked (value) {
    if (value === undefined) return this._e.checked/**/;
    this._e.checked/**/ = value;
    return this;
  }

  /**
   * @param {?=} v Param
   * @return {?} Result
   */
  value (v) {
    if (v === undefined) return this._e.value/**/;
    this._e.value/**/ = v;
    return this;
  }

  /**
   * Appends a child element.
   * @param {!Domo} el Param
   * @return {!Domo} Result
   */
  add (el) {
    this._e.appendChild(el._e);
    return this;
  }

  /**
   * Adds an iterator over elements.
   * @param {!Array<!Domo>} els Param
   * @return {!Domo} Result
   */
  adds (els) {
    els.forEach(el => {
      this._e.appendChild(el._e);
    });
    return this;
  }

  /**
   * Removes a child element.
   * @param {!github_dedeme.Domo} el Param
   * @return {!Domo} Result
   */
  remove (el) {
    this._e.removeChild(el._e);
    return this;
  }

  /**
   * Removes every child element.
   * @return {!Domo} Result
   */
  removeAll () {
    this._e.innerHTML/**/ = "";
    return this;
  }

  /**
   * Iterator over child elements.
   * @return {It<!Domo>} Result
   */
  get nodes () {
    const it = node =>
      new It(
        () => node !== null,
        () => node,
        () => it(node.nextSibling)
      );
    return it(this._e.firstChild);
  }

  /**
   * @param {string} event It can be one of: "blur", "change", "click",
   *        "dblclick", "focus", "keydown", "keypress", "keyup", "load",
   *        "mousedown", "mousemove", "mouseout", "mouseover", "mouseup",
   *        "mouseweel", "select", "selectstart" or "submit".
   * @param {function (*)} action Function to run
   * @return {!Domo} Result
   */
  on (event, action) {
    this._e.addEventListener(event, action, false);
    return this;
  }
}

