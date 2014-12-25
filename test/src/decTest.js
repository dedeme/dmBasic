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

goog.provide("decTest");

goog.require('dmjs.Test');
goog.require('dmjs.Dec');

decTest = function () {
  "use strict";

  var
    Dec,
    dec,
    /** @private @type dmjs.Test */
    t;

  Dec = dmjs.Dec;
  dec = dmjs.Dec.from;

  t = new dmjs.Test("Dec test");

  t.yes(0, new Dec().value());
  t.yes(0, new Dec().dec());

  t.yes(-3.25, new Dec(-3.25499, 2).value());
  t.yes(2, new Dec(-3.248, 2).dec());

  t.yes(3.25, new Dec(3.245, 2).value());
  t.yes(2, new Dec(3.245, 2).dec());

  t.yes(0, new Dec(-0).value());
  t.yes(0, new Dec(-0.0).value());
  t.yes(0, new Dec(0.0).value());
  t.yes(0, new Dec(.0).value());
  t.yes(0, new Dec(-.0).value());

  t.yes(1.28, new Dec(1.275, 2).value());
  t.yes(0.1, new Dec(0.09, 1).value());
  t.yes(1.27, new Dec(1.27499, 2).value());
  t.yes(3216234125.12, new Dec(3216234125.124, 2).value());
  t.yes("3.216.234.125,12", new Dec(3216234125.124, 2).toEs());

  t.yes("0", new Dec().toString());
  t.yes("0", new Dec().toEs());

  t.yes("-3.25", new Dec(-3.25499, 2).toString());
  t.yes("-16234125.12", new Dec(-16234125.124, 2).toString());
  t.yes("3", new Dec(3.25499, 0).toString());
  t.yes("16234125", new Dec(16234125.124, 0).toString());
  t.yes("1.35",new Dec(1.345, 2).toString());

  t.yes("-3,25", new Dec(-3.25499, 2).toEs());
  t.yes("-16.234.125,12", new Dec(-16234125.124, 2).toEs());
  t.yes("3", new Dec(3.25499, 0).toEs());
  t.yes("16.234.125", new Dec(16234125.124, 0).toEs());
  t.yes("16.234.125,10", new Dec(16234125.1, 2).toEs());
  t.yes("16.234.125,00", new Dec(16234125, 2).toEs());

  t.yes(-3.25, dec("-3.25499", 2).value());
  t.yes(-16234125.12, dec("-16234125.124", 2).value());
  t.yes(3, dec("3.25499", 0).value());
  t.yes(16234125, dec("16234125.124", 0).value());

  t.yes(0, dec(".0", 2).value());
  t.yes(0, dmjs.Dec.fromEs(",0", 2).value());
  t.yes(-3.25, dec("-3.25499", 2).value());
  t.yes(-16234125.12, dmjs.Dec.fromEs("-16.234.125,124", 2).value());
  t.yes(3, dec("3.25499", 0).value());
  t.yes(16234125, dmjs.Dec.fromEs("16.234.125,124", 0).value());
  t.yes(16234125.1, dmjs.Dec.fromEs("16.234.125,10", 2).value());
  t.yes(16234125, dmjs.Dec.fromEs("16.234.125,00", 2).value());

  t.yes(-3.25, dmjs.Dec.fromEn("-3.25499", 2).value());
  t.yes(-16234125.12, dmjs.Dec.fromEn("-16,234,125.124", 2).value());
  t.yes(3, dmjs.Dec.fromEn("3.25499", 0).value());
  t.yes(16234125, dmjs.Dec.fromEn("16,234,125.124", 0).value());
  t.yes(16234125.1, dmjs.Dec.fromEn("16,234,125.10", 2).value());
  t.yes(16234125, dmjs.Dec.fromEn("16,234,125.00", 2).value());

  t.yes(isNaN(dmjs.Dec.validate("dd")));
  t.yes(isNaN(dmjs.Dec.validate("")));

  t.yes(dmjs.Dec.rnd(-3, -2) >= -3);
  t.yes(dmjs.Dec.rnd(-3, -2) < -2);
  t.yes(dmjs.Dec.rnd(3, 2) > 2);
  t.yes(dmjs.Dec.rnd(3, 2) <= 3);

  t.yes(dmjs.Dec.rnd(-3, -1) >= -3);
  t.yes(dmjs.Dec.rnd(-3, -1) < -1);
  t.yes(dmjs.Dec.rnd(3, 1) > 1);
  t.yes(dmjs.Dec.rnd(3, 1) <= 3);

  t.yes(new Dec().eq(dmjs.Dec.restore(new Dec().serialize())));
  t.yes(new Dec(.0).eq(dmjs.Dec.restore(new Dec(.0).serialize())));
  t.yes(new Dec(-0).eq(dmjs.Dec.restore(new Dec(-0).serialize())));
  t.yes(new Dec(-3.25, 2).eq(
    dmjs.Dec.restore(new Dec(-3.25, 2).serialize())
  ));
  t.yes(new Dec(3.25).eq(
    dmjs.Dec.restore(new Dec(3.25).serialize())
  ));
  t.yes(new Dec(-16234125.12, 2).eq(
    dmjs.Dec.restore(new Dec(-16234125.12, 2).serialize())
  ));
  t.yes(new Dec(16234125.12, 2).eq(
    dmjs.Dec.restore(new Dec(16234125.12, 2).serialize())
  ));
  t.yes(new Dec(-16234125.12).eq(
    dmjs.Dec.restore(new Dec(-16234125.12).serialize())
  ));

  t.log();
};
