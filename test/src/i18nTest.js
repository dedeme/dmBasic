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

/*globals goog, dmjs, i18nTest:true */

goog.provide("i18nTest");

goog.require('dmjs.Test');
goog.require('dmjs.I18n');

i18nTest = function () {
  "use strict";

  var
    t,
    i18,
    _,
    __,
    b_,
    b__;

  t = new dmjs.Test("I18n Test");

  i18 = new dmjs.I18n(["en", "es"]);

  i18.small = [
    ["one", "uno"],
    ["two", "dos"],
    ["July", "julio"],
    ["there are %0 or %1 of us", "somos %0 o %1"],
    ["%0 %1, %2", "%1 de %0 de %2"]
  ];

  i18.big = [
    ["1", "one", "uno"],
    ["2", "two", "dos"],
    ["3", "July", "julio"],
    ["4", "there are %0 or %1 of us", "somos %0 o %1"],
    ["5", "%0 %1, %2", "%1 de %0 de %2"]
  ];

  _ = i18._();
  __ = i18.__();
  b_ = i18.b_();
  b__ = i18.b__();

  t.yes("???", _("xx"));
  t.yes("one", _("one"));
  t.yes("two", _("two"));
  t.yes("???", __("xx", 1, 2));
  t.yes("there are 6 or 7 of us",
    __("there are %0 or %1 of us", 6, 7));
  t.yes("July 13, 1998", __("%0 %1, %2", _("July"), 13, 1998));

  t.yes("???", b_("xx"));
  t.yes("one", b_("1"));
  t.yes("two", b_("2"));
  t.yes("???", b__("xx", 1, 2));
  t.yes("there are 6 or 7 of us", b__("4", 6, 7));
  t.yes("July 13, 1998", b__("5", b_("3"), 13, 1998));

  i18.selected = "es";

  t.yes("???", _("xx"));
  t.yes("uno", _("one"));
  t.yes("dos", _("two"));
  t.yes("???", __("xx", 1, 2));
  t.yes("somos 6 o 7",
    __("there are %0 or %1 of us", 6, 7));
  t.yes("13 de julio de 1998", __("%0 %1, %2", _("July"), 13, 1998));

  t.yes("???", b_("xx"));
  t.yes("uno", b_("1"));
  t.yes("dos", b_("2"));
  t.yes("???", b__("xx", 1, 2));
  t.yes("somos 6 o 7", b__("4", 6, 7));
  t.yes("13 de julio de 1998", b__("5", b_("3"), 13, 1998));

  t.log();
};
