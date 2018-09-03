// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");
goog.require("TpTest");
goog.require("ListTest");
goog.require("ItTest");
goog.require("DateDmTest");
goog.require("DecTest");
goog.require("B64Test");
goog.require("CrypTest");
goog.require("RndTest");

Main = class {
  run () {
    TpTest.run();
    ItTest.run(); // Its log apears at the end because it has a callback
    ListTest.run();
    DateDmTest.run();
    DecTest.run();
    B64Test.run();
    CrypTest.run();
    RndTest.run();
  }
};

new Main().run();
