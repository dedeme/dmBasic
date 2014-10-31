/*
 * Copyright 09-Sep-2014 ºDeme
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

/*globals goog, dmjs, mapTest */

goog.provide("mapTest");

goog.require('dmjs.Test');
goog.require('dmjs.Map');

mapTest = function () {
  "use strict";

  var
    t;

  t = new dmjs.Test("Map test");
  var
    /** @type {dmjs.Map.<!String, Number> } */
    map;

  map = dmjs.Map.empty();
  t.yes(0, map.size());
  map.put("a", 1);
  t.yes(1, map.size());
  t.yes(1, map.get("a"))
  map.put("b", 2);
  t.yes(2, map.get("b"));
  t.yes("[[\"a\",1],[\"b\",2]]", map.serialize());
  t.yes(map.serialize(), dmjs.Map.restore(map.serialize()).serialize());
  map.put("a", 0);
  t.yes(0, map.get("a"))
  t.yes(2, map.size());
  map.del("a");
  t.yes(1, map.size());
  t.yes("[[\"b\",2]]", map.serialize());

  t.log();
};

