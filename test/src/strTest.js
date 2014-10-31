/*
 * Copyright 27-ago-2013 ºDeme
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

/*globals goog, dmjs, strTest */

goog.provide("strTest");

goog.require("dmjs.Test");
goog.require("dmjs.str");
goog.require("dmjs.It");

strTest = function () {
  "use strict";

  var
    t;

  t = new dmjs.Test("Str test");

  t.yes("", dmjs.str.fromHex(dmjs.str.toHex("")));
  t.yes("a", dmjs.str.fromHex(dmjs.str.toHex("a")));
  t.yes("ab c", dmjs.str.fromHex(dmjs.str.toHex("ab c")));
  t.yes("\n\t\0a€b c", dmjs.str.fromHex(dmjs.str.toHex("\n\t\0a€b c")));
  t.yes("0a090061622063", dmjs.str.toHex("\n\t\0ab c"));
  t.yess([
    ["  ", ""],
    [" a", "a"],
    ["a   ", "a"],
    ["\na\t\t", "a"],
    [" \na n c\t\t ", "a n c"]
  ], dmjs.str.trim);
  t.yes("a22c", dmjs.str.format("a%0c", "22"));
  t.yes("a22undefinedc", dmjs.str.format("a%0%1c", "22"));
  t.yes("a22c", dmjs.str.format("a%0c", 22));
  t.yes("a22,12c", dmjs.str.format("a%0c", [22, 12]));
  t.yes("ac", dmjs.str.format("a%0c", ""));
  t.yes("a1c2", dmjs.str.format("a%0c%1", 1, 2));
  t.yes("2a1c", dmjs.str.format("%1a%0c", 1, 2));

  t.yes("", dmjs.str.trim(" \n\t "));
  t.yes("", dmjs.str.ltrim(" \n\t "));
  t.yes("", dmjs.str.rtrim(" \n\t "));

  t.yes("abc", dmjs.str.trim(" \nabc\t "));
  t.yes("abc\t ", dmjs.str.ltrim(" \nabc\t "));
  t.yes(" \nabc", dmjs.str.rtrim(" \nabc\t "));

  t.yes(dmjs.str.starts("", ""));
  t.yes(dmjs.str.starts("abc", ""));
  t.not(dmjs.str.starts("", "abc"));
  t.yes(dmjs.str.starts("abc", "a"));
  t.yes(dmjs.str.starts("abc", "abc"));
  t.not(dmjs.str.starts("abc", "b"));

  t.yes(dmjs.str.ends("", ""));
  t.yes(dmjs.str.ends("abc", ""));
  t.not(dmjs.str.ends("", "abc"));
  t.yes(dmjs.str.ends("abc", "c"));
  t.yes(dmjs.str.ends("abc", "abc"));
  t.not(dmjs.str.ends("abc", "b"));

  var arr = (["pérez", "pera", "p zarra", "pizarra"]);
  var arr2 = dmjs.It.from(arr).sort(dmjs.str.cmp).toArray();
  t.yes(["p zarra", "pera", "pizarra", "pérez"].toString(), arr2.toString());
  arr2 = dmjs.It.from(arr).sort(dmjs.str.compare).toArray();
  t.yes(["p zarra", "pera", "pérez", "pizarra"].toString(), arr2.toString());

  t.log();
};

