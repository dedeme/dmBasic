// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Test from "./dmjs/Test.js";
import It from "./dmjs/It.js";
import Tp from "./dmjs/Tp.js";
import Rnd from "./dmjs/Rnd.js";
import Rbox from "./dmjs/Rbox.js";

export default class RndTest {
  static run () {
    const t = new Test("Rnd");

    t.yes(Rnd.dec(-3, -2, 2).value >= -3);
    t.yes(Rnd.dec(-3, -2, 3).value <= -2);
    t.yes(Rnd.dec(3, 2, 1).value >= 2);
    t.yes(Rnd.dec(3, 2).value <= 3);
    // console.log(Rnd.dec(-3, -2, 2));

    t.yes(Rnd.dec(-3, -1).value >= -3);
    t.yes(Rnd.dec(-3, -1, 1).value <= -1);
    t.yes(Rnd.dec(3, 1, 3).value >= 1);
    t.yes(Rnd.dec(3, 1, 2).value <= 3);

    It.range(10).each(() => t.yes(Rnd.i(4) >= 0 && Rnd.i(4) < 4));

    It.range(11).each(() => t.yes(
      Rnd.dec(0, 2, 4).value >= 0 && Rnd.dec(0, 2, 4).value <= 4
    ));

    It.range(12).each(() => t.yes(
      Rnd.dec(4, 8, 0).value >= 4 && Rnd.dec(4, 8).value <= 8
    ));

    let box = new Rbox(["a", "b", "c"]);
    // It.range(7).each(() => console.log(box.next()));
    //let i = 0;
    //for (const e of box) {
    //  if (i++ === 7) break;
    //  console.log(e);
    //}
    let v = box.next();
    t.yes(v === "a" || v === "b" || v === "c");
    v = box.next();
    t.yes(v === "a" || v === "b" || v === "c");
    v = box.next();
    t.yes(v === "a" || v === "b" || v === "c");
    v = box.next();
    t.yes(v === "a" || v === "b" || v === "c");
    v = box.next();
    t.yes(v === "a" || v === "b" || v === "c");
    v = box.next();
    t.yes(v === "a" || v === "b" || v === "c");
    v = box.next();
    t.yes(v === "a" || v === "b" || v === "c");


    box = Rbox.mk([new Tp("a", 2), new Tp("b", 1)]);
    // It.range(7).each(i => console.log(box.next()));
    v = box.next();
    t.yes(v === "a" || v === "b");
    v = box.next();
    t.yes(v === "a" || v === "b");
    v = box.next();
    t.yes(v === "a" || v === "b");
    v = box.next();
    t.yes(v === "a" || v === "b");
    v = box.next();
    t.yes(v === "a" || v === "b");
    v = box.next();
    t.yes(v === "a" || v === "b");
    v = box.next();
    t.yes(v === "a" || v === "b");

    t.log();
  }
}


