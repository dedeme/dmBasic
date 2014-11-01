/*
 * Copyright 15-Apr-2014 ºDeme
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

/** Class for internationalizacion */
goog.provide("dmjs.I18n");
goog.require("dmjs.It");
goog.require("dmjs.str");

/**
 * @constructor
 * @struct
 * @param {!Array.<string>} languages
 */
dmjs.I18n = function (languages) {
  "use strict";

  var
    self,
    aformat,
    baformat,
    show,
    /**
     * @private
     * @type {!function(!string, ...[(string|number|Array)]):!string}
     */
    format = function (template, args) {
      args = Array.prototype.slice.call(arguments);
      args.shift();
      return aformat(template, args);
    },
    bshow,
    /**
     * @private
     * @type {!function(!string, ...[(string|number|Array)]):!string}
     */
    bformat = function (textId, args) {
      args = Array.prototype.slice.call(arguments);
      args.shift();
      return baformat(textId, args);
    };

  self = this;

  aformat = function (template, args) {
    var
      t;

    t = show(template);
    return (t === undefined) ? "???" : dmjs.str.aformat(t, args);
  };

  baformat = function (textId, args) {
    var
      t;

    t = bshow(textId);
    return (t === undefined) ? "???" : dmjs.str.aformat(t, args);
  };

  show = function (text) {
    var
      index,
      translations;

    index = dmjs.It.from(languages).index(function (e) {
      return e === self.selected;
    });
    index = (index === -1) ? 0 : index;

    translations = dmjs.It.from(self.small).find(function (e) {
      return e[0] === text;
    });

    return (translations === undefined) ? "???" : translations[index];
  };

  bshow = function (textId) {
    var
      index,
      translations;

    index = dmjs.It.from(languages).index(function (e) {
      return e === self.selected;
    });
    index = (index === -1) ? 0 : index;

    translations = dmjs.It.from(self.big).find(function (e) {
      return e[0] === textId;
    });

    return (translations === undefined) ? "???" : translations[index + 1];
  };

  /**
   * Languages for translations
   * @return {!Array.<string>} Languages of translator.
   */
  this.languages = function () { return languages; };

  /**
   * Selected language for translations.<br>
   * Default languages[0]
   * @type {!string}
   */
  this.selected = languages[0];

  /**
   * Sets and gets translations. First field (index 0) in each row has got the
   * translation for <tt>this.languages()[0]</tt>, second field for
   * <tt>this.languages()[1]</tt> and so.<br>
   * Default []
   * @type {!Array.<Array.<string>>}
   */
  this.small = [];

  /**
   * Sets and gets translations. First field (index 0) in each row is a key,
   * translation for <tt>this.languages()[0]</tt> is in the second field,
   * translation for <tt>this.languages()[1]</tt> is in the third one and so.
   * <br>
   *  Default []
   * @type {!Array.<Array.<string>>}
   */
  this.big = [];

  /**
   * Translate text in small index. Usage:</p>
   * <pre>
   * _ = i18._();
   * ...
   * alert(_("text"));</pre>
   * @return {!function(!string):!string}
   */
  this._ = function () { return show; };
  /**
   * Translate template with args in small index. Usage:</p>
   * <pre>
   * __ = i18.__();
   * ...
   * alert(__("(%1): %0 is %1", "one", 1));</pre>
   * @return {!function(!string, ...[(string|number|Array)]):!string}
   */
  this.__ = function () { return format; };

  /**
   * Translate textId in big index. Usage:</p>
   * <pre>
   * b_ = i18.b_();
   * ...
   * alert(b_("key"));</pre>
   * @return {!function(!string):!string}
   */
  this.b_ = function () { return bshow; };

  /**
   * Translate textId which points to a template with args. Data is
   * in big index. Usage:</p>
   * <pre>
   * b__ = i18.b__();
   * ...
   * alert(b__("key", "one", 1));</pre>
   * @return {!function(!string, ...[(string|number|Array)]):!string}
   */
  this.b__ = function () { return bformat; };
};
