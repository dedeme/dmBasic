/*
 * Copyright 16-aug-2013 ºDeme
 *
 * This file is part of 'dmBasic'.
 *
 * 'dmBasic' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * 'dmBasic' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'dmBasic'.  If not, see <http://www.gnu.org/licenses/>.
 */

/*globals goog, dmjs */

/** Class for enveloping a DOM object */
goog.provide('dmjs.DomObject');

/**
 * @constructor
 * @struct
 * @param {?} o
 */
dmjs.DomObject = function (o) {
  "use strict";

  var
    self = this;

  /**
   * DOM object embeded
   * @type {*}
   */
  this.peer = o;

  /**
   * If 'tx' is empty returns property textContent value else sets it.
   * @param {string=} tx
   * @return {?}
   */
  this.text = function (tx) {
    if (tx === undefined) {
      return o.textContent;
    }
    o.textContent = tx;
    return self;
  };

  /**
   * If 'tx' is empty returns property innerHTML else sets it.
   * @param {string=} tx
   * @return {?}
   */
  this.html = function (tx) {
    if (tx === undefined) {
      return o.innerHTML;
    }
    o.innerHTML = tx;
    return self;
  };

  /**
   * If 'value' is empty returns property 'key' value else sets it.
   * @param {!string} key
   * @param {!string=} value
   * @return {?}
   */
  this.att = function (key, value) {
    if (value === undefined) {
      return o.getAttribute(key);
    }
    o.setAttribute(key, value);
    return self;
  };

  /**
   * If 'value' is empty returns property disabled value else sets it.
   * @param {!boolean=} value
   * @return {?}
   */
  this.disabled = function (value) {
    if (value === undefined) {
      return o.disabled;
    }
    o.disabled = value;
    return self;
  };

  /**
   * If 'value' is empty returns property value else sets it.
   * @param {*=} value
   * @return {?}
   */
  this.value = function (value) {
    if (value === undefined) {
      return o.value;
    }
    o.value = value;
    return self;
  };

  /**
   * Appends a child element.
   * @param {dmjs.DomObject} el
   * @return {!dmjs.DomObject}
   */
  this.add = function (el) {
    o.appendChild(el.peer);
    return self;
  };

  /**
   * Adds an iterator over rows ("tr") in a table.
   * @param {dmjs.It.<dmjs.DomObject>} els
   * @return {!dmjs.DomObject}
   */
  this.addIt = function (els) {
    els.each(function (el) {
      o.appendChild(el.peer);
    });
    return self;
  };

  /**
   * Removes a child element.
   * @param {dmjs.DomObject} el
   * @return {!dmjs.DomObject}
   */
  this.remove = function (el) {
    o.removeChild(el.peer);
    return self;
  };

  /**
   * Removes all child elements
   * @return {!dmjs.DomObject}
   */
  this.removeAll = function () {
    o.innerHTML = "";
    return self;
  };

  /**
   * Iterator over child elements.
   * @type {dmjs.It.<!dmjs.DomObject>}
   */
  this.nodes = (function () {
    var
      nextNode;

    nextNode = o.firstChild;
    return new dmjs.It(
      function () { return (nextNode !== null); },
      function () {
        var
          r;
        if (nextNode) {
          r = nextNode;
          nextNode = nextNode.nextSibling;
          return new dmjs.DomObject(r);
        }
        throw new Error("No such element");
      }
    );
  }());

  /**
   * Means of executing callbacks. Executes function 'f' whith
   * <tt>this.peer</tt> as argument.
   * <p>Example:</p>
   * <pre>
   * .on(function (peer) {
   *   peer.onclick = function (e) { control.add($("#newName").value()); }
   * })
   * </pre>
   * @param {function (*)} f
   * @return {!dmjs.DomObject}
   */
  this.on = function (f) {
    f(o);
    return self;
  };
};
