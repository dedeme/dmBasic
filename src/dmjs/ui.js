/*
 * Copyright 19-aug-2013 ºDeme
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

/** Utilities for handling DOM elements */
goog.provide("dmjs.ui");

goog.require("dmjs.DomObject");
goog.require('dmjs.It');

(function (ns) {
  'use strict';

  /**
   * Returns a object dmjs.ui.O
   * @param {Element|HTMLElement|Node|string} obj
   * @return {dmjs.It.<Element>|dmjs.DomObject}
   */
  ns.$ = function (obj) {
    var
      toIt;

    toIt = function (arr) {
      var
        c,
        length;

      c = 0;
      length = arr.length;
      return new dmjs.It(
        function () { return c < length; },
        function () {
          if (c < length) {
            return new dmjs.DomObject(arr[c++]);
          }
          throw new Error("No such element");
        }
      );
    };

    if (typeof obj === "string") {
      if (obj === "") {
        return toIt(document.getElementsByTagName("*"));
      }
      if (obj.charAt(0) === "#") {
        return new dmjs.DomObject(document.getElementById(obj.substring(1)));
      }
      if (obj.charAt(0) === "@") {
        return toIt(document.getElementsByTagName(obj.substring(1)));
      }
      if (obj.charAt(0) === "%") {
        return toIt(document.getElementsByName(obj.substring(1)));
      }
      if (obj.charAt(0) === ".") {
        return toIt(document.getElementsByClassName(obj.substring(1)));
      }
      return new dmjs.DomObject(document.createElement(obj));
    }
    return new dmjs.DomObject(obj);
  };

  /**
   * <p>Extracts variables of URL. Returns a map with next rules:<p>
   * <ul>
   * <li>Expresions 'key = value' are changed in {"key" : "value"}</li>
   * <li>Expresion only with value are changes by {"its-order-number" "value"}.
   *   (order-number is zero based)</li>
   * </ul>
   * <p>Example:</p>
   * <p><tt>foo.com/bar?v1&k1=v2&v3 -> {:0 v1, :k1 v2, :2 v3}</tt></p>
   * <p>NOTE: <i>keys and values are not trimized.</i></p>
   *
   * @return {!Object.<!string, !string>}
   */
  ns.url = function () {
    var search = window.location.search;
    if (search === "") {
      return {};
    }
    return dmjs.It.from(search.substring(1).split("&")).reduce(
      [{}, 0],
      function (s, e) {
        var ix = e.indexOf("=");
        if (ix === -1) {
          s[0][s[1].toString()] = decodeURI(e);
        } else {
          s[0][decodeURI(e.substring(0, ix))] = decodeURI(e.substring(ix + 1));
        }
        return [s[0], ++s[1]];
      }
    )[0];
  };

  /**
   * Loads dynamically a javascript or css file.
   *
   * @param {!string} path Complete path, including .js or .css extension.
   * @param {!function ()} action
   */
  ns.load = function (path, action) {
    var
      element;

    if (path.substring(path.length - 3) === ".js") {
      element = document.createElement('script');
      element.setAttribute("type", "text/javascript");
      element.setAttribute("src", path);
    } else if (path.substring(path.length - 4) === ".css") {
      element = document.createElement('link');
      element.setAttribute("rel", "stylesheet");
      element.setAttribute("type", "text/css");
      element.setAttribute("href", path);
    } else {
      throw new Error("'" + path + "' is not a .js or .css file");
    }
    document.getElementsByTagName("head")[0].appendChild(element);
    element.onload = function () { action(); };
  };

  /**
   * Loads dynamically several javascript or css files. (they can go mixed).
   *
   * @param {!Array.<!string>} paths Array with complete paths, including .js
   *  or .css extension.
   * @param {!function ()} action
   */
  ns.loads = function (paths, action) {
    var
      load;

    load = function () {
      if (paths.length === 0) {
        action();
      } else {
        ns.load(paths.shift(), load);
      }
    };

    load();
  };

  /**
   * Changes key point of number block by comma.
   * @param {!dmjs.DomObject} inp An input of type text.
   * @return {!dmjs.DomObject} The entry object modified.
   */
  ns.changePoint = function (inp) {
    inp.peer.onkeydown = function (e) {
      var
        start,
        end,
        text;
      if (e.keyCode === 110) {
        start = inp.peer.selectionStart;
        end = inp.peer.selectionEnd;
        text = inp.peer.value;

        inp.peer.value = text.substring(0, start) + "," + text.substring(end);
        inp.peer.selectionStart = start + 1;
        inp.peer.selectionEnd = start + 1;

        return false;
      }
    };
    return inp;
  };

  /**
   * <p>Creates a image with border='0'.</p>
   * @param {!string} name Image name without extension ('.png' will be used).
   *   It must be placed in a directory named 'img'.
   * @return {!dmjs.DomObject}
   */
  ns.img = function (name) {
    return ns.$("img")
      .att("src", "img/" + name + ".png")
      .att("border", "0");
  };

  /**
   * <p>Creates a image with border='0' and a 'opacity:0.4'.</p>
   * @param {!string} name Image name without extension ('.png' will be used).
   *   It must be placed in a directory named 'img'.
   * @return {!dmjs.DomObject}
   */
  ns.clearImg = function (name) {
    return ns.img(name).att("style", "opacity:0.4");
  };

  /**
   * <p>Creates a text field which passes focus to another element.</p>
   * @param {!string} targetId Id of element which will receive the focus.
   * @return !{dmjs.DomObject}
   */
  ns.field = function (targetId) {
    var r = ns.$("input").att("type", "text");
    r.peer.onkeydown = function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        ns.$("#" + targetId).peer.focus();
      }
    };
    return r;
  };

  /**
   * <p>Creates a password field which passes focus to another element.</p>
   * @param {!string} targetId Id of element which will receive the focus.
   * @return !{dmjs.DomObject}
   */
  ns.pass = function (targetId) {
    var r = ns.$("input").att("type", "password");
    r.peer.onkeydown = function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        ns.$("#" + targetId).peer.focus();
      }
    };
    return r;
  };

  /**
   * Creates a text field with a validation function.
   *
   * @param {!string} targetId Id of element which will receive the focus.
   * @param {!function ()} action Validation function.
   * @return {!dmjs.DomObject}
   */
  ns.fieldAc = function (targetId, action) {
    var r = ns.field(targetId);
    r.peer.onblur = action;
    return r;
  };

  /**
   * <p>Create a link to a function.</p>
   * @param {function ()} f Function to execute.
   * @return {!dmjs.DomObject}
   */
  ns.link = function (f) {
    var r = ns.$("span").att("style", "cursor:pointer");
    r.peer.onclick = f;
    return r;
  };

  /**
   * <p>Create a select with list as entries. Every option has an id formed with
   *   'idPrefix' + "_" + 'its list name' and a name equals to 'idPrefix'.
   *   Also select widget has name 'idPrefix' too.</p>
   * @param {!string} idPrefix Prefix to make option id.
   * @param {!Array.<string>} list Entries of select. Default selected goes
   *   marked with '+' (e.g. ["1", "+2", "3"])
   * @return {!dmjs.DomObject}
   */
  ns.select = function (idPrefix, list) {
    var r = ns.$("select").att("id", idPrefix);
    dmjs.It.from(list).each(function (tx) {
      var op = ns.$("option");
      if (tx.length > 0 && tx.charAt(0) === "+") {
        tx = tx.substring(1);
        op.att("selected", "true");
      }
      op.text(tx).att("name", idPrefix).att("id", idPrefix + "_" + tx);
      r.peer.add(op.peer);
    });
    return r;
  };

}(dmjs.ui));
