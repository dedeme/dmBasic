/*
 * Copyright 19-ago-2013 ºDeme
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

/*globals goog, dmjs, decTest */

goog.provide("dateTest");

goog.require('dmjs.Test');
goog.require('dmjs.Date');

(function (ns) {
  "use strict";

  ns.run = function () {
    var
      t,
      d1,
      d2,
      d3;

    t = new dmjs.Test("Date test");

    d1 = new dmjs.Date(29, 2, 2013);
    d2 = new dmjs.Date(6, 3, 2013);
    d3 = new dmjs.Date(30, 4, 2013);

    t.yes(d1.eq(dmjs.Date.fromEn("2-29-2013")));
    t.yes(d1.eq(dmjs.Date.fromEn("2/29/2013")));
    t.yes(d2.eq(dmjs.Date.fromEn("3-6-2013")));
    t.yes(d2.eq(dmjs.Date.fromEn("3/6/2013")));

    t.yes(d1.add(5).eq(d2));
    t.yes(d2.eq(d3.add(-55)));
    t.yes(-5, d1.dfDays(d2));
    t.yes(55, d3.dfDays(d2));

    t.yes("%:V, 1/3/13", d1.format("%%:%a1, %d/%m/%y"));
    t.yes("%viernes%, 01/03/2013", d1.format("%%%A%%, %D/%M/%Y"));
    t.yes("abr, 30-abr-13", d3.format("%b, %d-%b-%y"));
    t.yes("Madrid, a 1 de marzo de 2013.",
      d1.format("Madrid, a %d de %B de %Y."));

    t.yes("20130301", d1.base());
    t.yes("20130306", d2.base());
    t.yes("20130430", d3.base());

    t.yes(1, d1.day ());
    t.yes(6, d2.day ());
    t.yes(30, d3.day ());
    t.yes(3, d1.month ());
    t.yes(3, d2.month ());
    t.yes(4, d3.month ());
    t.yes(2013, d1.year ());
    t.yes(2013, d2.year ());
    t.yes(2013, d3.year ());

    t.yes(new dmjs.Date("1/3/2013").eq(d1));
    t.yes(new dmjs.Date("1-3-2013").eq(d1));
    t.yes(new dmjs.Date("01/3/2013").eq(d1));
    t.yes(new dmjs.Date("1/03/2013").eq(d1));
    t.yes(new dmjs.Date("01-03-2013").eq(d1));
    t.yes(new dmjs.Date("20130301").eq(d1));
    t.yes(new dmjs.Date(new Date(2013, 2, 1)).eq(d1));

    t.log();
  };

}(dateTest));
