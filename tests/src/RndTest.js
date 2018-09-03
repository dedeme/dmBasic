// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("RndTest");
goog.require("github_dedeme");

RndTest = class {
  static run() {
    const t = new Test("Rnd");

    t.yes(Rnd.dec(-3, -2, 2).value() >= -3);
    t.yes(Rnd.dec(-3, -2, 3).value() <= -2);
    t.yes(Rnd.dec(3, 2, 1).value() >= 2);
    t.yes(Rnd.dec(3, 2).value() <= 3);
    // console.log(Rnd.dec(-3, -2, 2));

    t.yes(Rnd.dec(-3, -1).value() >= -3);
    t.yes(Rnd.dec(-3, -1, 1).value() <= -1);
    t.yes(Rnd.dec(3, 1, 3).value() >= 1);
    t.yes(Rnd.dec(3, 1, 2).value() <= 3);

    It.range(10).each(i => t.yes(Rnd.i(4) >= 0 && Rnd.i(4) < 4));

    It.range(11).each(i => t.yes(
      Rnd.dec(0, 2, 4).value() >= 0 && Rnd.dec(0, 2, 4).value() <= 4
    ));

    It.range(12).each(i => t.yes(
      Rnd.dec(4, 8, 0).value() >= 4 && Rnd.dec(4, 8).value() <= 8
    ));

    let box = new Rbox(["a", "b", "c"]);
    // It.range(7).each(i => console.log(box.next()));
    let v = box.next();
    t.yes(v == "a" || v == "b" || v == "c");
    v = box.next();
    t.yes(v == "a" || v == "b" || v == "c");
    v = box.next();
    t.yes(v == "a" || v == "b" || v == "c");
    v = box.next();
    t.yes(v == "a" || v == "b" || v == "c");
    v = box.next();
    t.yes(v == "a" || v == "b" || v == "c");
    v = box.next();
    t.yes(v == "a" || v == "b" || v == "c");
    v = box.next();
    t.yes(v == "a" || v == "b" || v == "c");


    box = Rbox.mk([new Tp("a", 2), new Tp("b", 1)]);
    // It.range(7).each(i => console.log(box.next()));
    v = box.next();
    t.yes(v == "a" || v == "b");
    v = box.next();
    t.yes(v == "a" || v == "b");
    v = box.next();
    t.yes(v == "a" || v == "b");
    v = box.next();
    t.yes(v == "a" || v == "b");
    v = box.next();
    t.yes(v == "a" || v == "b");
    v = box.next();
    t.yes(v == "a" || v == "b");
    v = box.next();
    t.yes(v == "a" || v == "b");

    t.log();
  }
};


