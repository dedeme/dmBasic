// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import B64Test from "./B64Test.js";
import CrypTest from "./CrypTest.js";
import DecTest from "./DecTest.js";
import TpTest from "./TpTest.js";
import RndTest from "./RndTest.js";
import ItTest from "./ItTest.js";

export function main () {
  B64Test.run();
  CrypTest.run();
  DecTest.run();
  TpTest.run();
  RndTest.run();
  ItTest.run();
}

window["main"] = main;
