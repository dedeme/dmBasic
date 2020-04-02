// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>


import B64Test from "./B64Test.js";
import CrypTest from "./CrypTest.js";
import DecTest from "./DecTest.js";
import TpTest from "./TpTest.js";
import MaybeTest from "./MaybeTest.js";
import EitherTest from "./EitherTest.js";
import ResultTest from "./ResultTest.js";
import RndTest from "./RndTest.js";
import ItTest from "./ItTest.js";
import DateDmTest from "./DateDmTest.js";
import PathTest from "./PathTest.js";

export function main () {
  B64Test.run();
  CrypTest.run();
  DecTest.run();
  TpTest.run();
  MaybeTest.run();
  EitherTest.run();
  ResultTest.run();
  RndTest.run();
  ItTest.run();
  DateDmTest.run();
  PathTest.run();
}

window["main"] = main;
