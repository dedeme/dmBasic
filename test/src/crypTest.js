/*
 * Copyright 19-dic-2013 ºDeme
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

goog.provide("crypTest");

goog.require('dmjs.Test');
goog.require('dmjs.cryp');

crypTest = function () {
  "use strict";
  var
    t;

  t = new dmjs.Test("cryp test");

  t.yes("0", dmjs.cryp.d2h(dmjs.cryp.h2d("0")));
  t.yes("8", dmjs.cryp.d2h(dmjs.cryp.h2d("8")));
  t.yes("f", dmjs.cryp.d2h(dmjs.cryp.h2d("f")));
  t.yes(0, dmjs.cryp.h2d("0"));
  t.yes(8, dmjs.cryp.h2d("8"));
  t.yes(15, dmjs.cryp.h2d("f"));
  t.yes("0", dmjs.cryp.d2h(0));
  t.yes("8", dmjs.cryp.d2h(8));
  t.yes("f", dmjs.cryp.d2h(15));
  t.yes("a", dmjs.cryp.h2s(dmjs.cryp.s2h("a")));
  t.yes("ab cñç", dmjs.cryp.h2s(dmjs.cryp.s2h("ab cñç")));
  t.yes("\n\t\0a€b c", dmjs.cryp.h2s(dmjs.cryp.s2h("\n\t\0a€b c")));
  t.yes("0a090061a4622063", dmjs.cryp.s2h("\n\t\0a€b c"));
  t.yes("01", dmjs.cryp.autoDecryp(dmjs.cryp.autoCryp(2, "01")));
  t.yes("11", dmjs.cryp.autoDecryp(dmjs.cryp.autoCryp(2, "11")));
  t.yes("", dmjs.cryp.autoDecryp(dmjs.cryp.autoCryp(2, "")));
  t.yes("a", dmjs.cryp.autoDecryp(dmjs.cryp.autoCryp(2, "a")));
  t.yes("ab c", dmjs.cryp.autoDecryp(dmjs.cryp.autoCryp(2, "ab c")));
  t.yes("\n\t\0a€b c", dmjs.cryp.autoDecryp(
    dmjs.cryp.autoCryp(2, "\n\t\0a€b c")));

  t.log();
};

