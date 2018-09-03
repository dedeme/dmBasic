// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Class for envelopping DOM objects */
goog.provide("github_dedeme.Domo");
goog.require("github_dedeme.It");

github_dedeme.Domo/**/ = class {
  /** @param {*} e */
  constructor (e) {
    /** @private */
    this._e = e;
  }

  /** @return {*} */
  e () {
    return this._e;
  }

  /**
   * @param {string=} tx
   * @return {?}
   */
  html (tx) {
    if (tx === undefined) return this._e.innerHTML/**/;
    this._e.innerHTML/**/ = tx;
    return this;
  }

  /**
   * @param {string=} tx
   * @return {?}
   */
  text (tx) {
    if (tx === undefined) return this._e.textContent/**/;
    this._e.textContent/**/ = tx;
    return this;
  }

  /**
   * @param {string=} tx
   * @return {?}
   */
  klass (tx) {
    if (tx === undefined) return this._e.className/**/;
    this._e.className/**/ = tx;
    return this;
  }

  /**
   * @param {string=} s
   * @return {?}
   */
  style (s) {
    if (s === undefined) return this._e.getAttribute("style");
    this._e.setAttribute("style", s);
    return this;
  }

  /**
   * @param {string} tx
   * @return {!Domo}
   */
  addStyle(tx) {
    this._e.setAttribute("style", this.style() + ";" + tx);
    return this;
  }

  /**
   * @param {string} key
   * @param {?=} value
   * @return {?}
   */
  att (key, value) {
    if (value === undefined) return this._e.getAttribute(key);
    this._e.setAttribute(key, value);
    return this;
  }

  /**
   * @param {boolean=} value
   * @return {?}
   */
  disabled (value) {
    if (value === undefined) return this._e.disabled/**/;
    this._e.disabled/**/ = value;
    return this;
  }

  /**
   * @param {boolean=} value
   * @return {?}
   */
  checked (value) {
    if (value === undefined) return this._e.checked/**/;
    this._e.checked/**/ = value;
    return this;
  }

  /**
   * @param {?=} v
   * @return {?}
   */
  value (v) {
    if (v === undefined) return this._e.value/**/;
    this._e.value/**/ = v;
    return this;
  }

  /**
   * Appends a child element.
   * @param {!github_dedeme.Domo} el
   * @return {!github_dedeme.Domo}
   */
  add (el) {
    this._e.appendChild(el._e);
    return this;
  }

  /**
   * Adds an iterator over elements.
   * @param {github_dedeme.It<!github_dedeme.Domo>} els
   * @return {!github_dedeme.Domo}
   */
  addIt (els) {
    els.each(el => {
      this._e.appendChild(el._e);
    });
    return this;
  }

  /**
   * Removes a child element.
   * @param {!github_dedeme.Domo} el
   * @return {!github_dedeme.Domo}
   */
  remove (el) {
    this._e.removeChild(el._e);
    return this;
  }

  /**
   * Removes every child element.
   * @return {!github_dedeme.Domo}
   */
  removeAll () {
    this._e.innerHTML/**/ = "";
    return this;
  }

  /**
   * Iterator over child elements.
   * @return {github_dedeme.It<!github_dedeme.Domo>}
   */
  get nodes () {
    let nextNode = this._e.firstChild/**/;
    return new github_dedeme.It(
      () => nextNode !== null,
      () => {
        const r = nextNode;
        nextNode = nextNode.nextSibling/**/;
        return new github_dedeme.Domo(r);
      }
    );
  }

  /**
   * @private
   * @param {github_dedeme.It<!github_dedeme.Domo>} value
   */
  set nodes (value) {
    throw("nodes is read only");
  }

  /**
   * @param {string} event It can be one of: "blur", "change", "click",
   *        "dblclick", "focus", "keydown", "keypress", "keyup", "load",
   *        "mousedown", "mousemove", "mouseout", "mouseover", "mouseup",
   *        "mouseweel", "select", "selectstart" or "submit".
   * @param {function (*)} action
   * @return {!github_dedeme.Domo}
   */
  on (event, action) {
    this._e.addEventListener(event, action, false);
    return this;
  }
};

