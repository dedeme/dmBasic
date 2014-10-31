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

goog.provide('rndTest');

goog.require('dmjs.Test');
goog.require('dmjs.rnd');

rndTest = function () {
  'use strict';

  var
    t,
    v,
    box;

  t = new dmjs.Test ("rnd Test");

  dmjs.It.range(10).each(function () {
    t.yes(dmjs.rnd.i(4) >= 0 && dmjs.rnd.i(4) < 4);
  });

  dmjs.It.range(10).each(function () {
    t.yes(
      dmjs.rnd.dec(2, 4, 0).value() >= 0 && dmjs.rnd.dec(2, 4, 0).value() <= 4
    );
  });

  dmjs.It.range(10).each(function () {
    t.yes(
      dmjs.rnd.dec(0, 4, 8).value() >= 4 && dmjs.rnd.dec(0, 4, 8).value() <= 8
    );
  });

  box = new dmjs.rnd.Box(["a", "b", "c"]);
  v = box.next();
  t.yes(v === "a" || v === "b" || v === "c");
  t.yes(box.box().length === 2);
  v = box.next();
  t.yes(v === "a" || v === "b" || v === "c");
  t.yes(box.box().length === 1);
  v = box.next();
  t.yes(v === "a" || v === "b" || v === "c");
  t.yes(box.box().length === 0);
  v = box.next();
  t.yes(v === "a" || v === "b" || v === "c");
  t.yes(box.box().length === 2);
  v = box.next();
  t.yes(v === "a" || v === "b" || v === "c");
  t.yes(box.box().length === 1);
  v = box.next();
  t.yes(v === "a" || v === "b" || v === "c");
  t.yes(box.box().length === 0);
  v = box.next();
  t.yes(v === "a" || v === "b" || v === "c");
  t.yes(box.box().length === 2);

  box = dmjs.rnd.mkBox([["a", 2], ["b", 1]]);
  v = box.next();
  t.yes(v === "a" || v === "b");
  t.yes(box.box().length === 2);
  v = box.next();
  t.yes(v === "a" || v === "b");
  t.yes(box.box().length === 1);
  v = box.next();
  t.yes(v === "a" || v === "b");
  t.yes(box.box().length === 0);
  v = box.next();
  t.yes(v === "a" || v === "b");
  t.yes(box.box().length === 2);
  v = box.next();
  t.yes(v === "a" || v === "b");
  t.yes(box.box().length === 1);
  v = box.next();
  t.yes(v === "a" || v === "b");
  t.yes(box.box().length === 0);
  v = box.next();
  t.yes(v === "a" || v === "b");
  t.yes(box.box().length === 2);

  t.log();
}
