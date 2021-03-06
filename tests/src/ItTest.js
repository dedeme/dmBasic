// Copyright 02-Sep-2018 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Test from "./dmjs/Test.js";
import It from "./dmjs/It.js";

export default class ItTest {
  static run () {
    const t = new Test("It");

    const aN1 = [1, 2, 3];
    let itN1 = It.from(aN1);
    t.eq(itN1.value, 1);
    itN1 = itN1.next;
    t.eq(itN1.value, 2);
    itN1 = itN1.next;
    t.eq(itN1.value, 3);
    itN1 = itN1.next;
    t.not(itN1.has);

    // constructors ------------------------------------------

    t.mark("constructors");

    const i0 = [];
    const i1 = [1];
    const i2 = [1, 2, 3];
    const s0 = [];
    const s1 = ["one"];
    const s2 = ["one", "two", "three"];

    t.not(It.empty().has);
    t.not(It.from([]).has);

    t.yes(It.from(i0).eq(It.from(i0)));
    t.yes(!It.from(i0).eq(It.from(i1)));
    t.yes(It.from(i1).eq(It.from(i1)));
    t.yes(!It.from(i1).eq(It.from(i0)));
    t.yes(It.from(i2).eq(It.from(i2)));
    t.yes(!It.from(i2).eq(It.from(i1)));
    t.yes(!It.from(i1).eq(It.from(i2)));
    t.yes(It.from(i0).eq(It.from(s0)));

    t.yes(It.from(i2).eq(It.from(i2), (a, b) => a === b));

    t.eq(It.from(i0).toString(), "[]");
    t.eq(It.from(i1).toString(), "[1]");
    t.eq(It.from(i2).toString(), "[1, 2, 3]");

    t.eq([...It.from(i0)].toString(), "");
    t.eq([...It.from(i1)].toString(), "1");
    t.eq([...It.from(i2)].toString(), "1,2,3");

    // lazy --------------------------------------------------

    t.mark("lazy");

    t.eq(It.from(i0).push(1).toString(), "[1]");
    t.eq(It.from(i0).unshift(1).toString(), "[1]");
    t.eq(It.from(i2).push(1).toString(), "[1, 2, 3, 1]");
    t.eq(It.from(i2).unshift(1).toString(), "[1, 1, 2, 3]");
    t.eq(It.from(i2).concat(It.from(i1)).toString(), "[1, 2, 3, 1]");
    t.eq(It.from(i2).concat(It.from(i0)).toString(), "[1, 2, 3]");
    t.eq(It.from(i0).concat(It.from(i0)).toString(), "[]");

    const pr1 = e => e < 2;
    const npr1 = e => e >= 2;

    t.eq(It.from(s2).take(0).toString(), "[]");
    t.eq(It.from(s2).take(-30).toString(), "[]");
    t.eq(It.from(s2).take(1).toString(), "[one]");
    t.eq(It.from(s2).take(10).toString(), "[one, two, three]");
    t.eq(It.from(i2).take(1000).toString(), "[1, 2, 3]");
    t.eq(It.from(i0).takeWhile(pr1).toString(), "[]");
    t.eq(It.from(i1).takeWhile(pr1).toString(), "[1]");
    t.eq(It.from(i2).takeWhile(pr1).toString(), "[1]");
    t.eq(It.from(i0).takeUntil(npr1).toString(), "[]");
    t.eq(It.from(i1).takeUntil(npr1).toString(), "[1]");
    t.eq(It.from(i2).takeUntil(npr1).toString(), "[1]");

    t.eq(It.from(s2).drop(0).toString(), "[one, two, three]");
    t.eq(It.from(s2).drop(1).toString(), "[two, three]");
    t.eq(It.from(s2).drop(10).toString(), "[]");
    t.eq(It.from(i2).drop(0).toString(), "[1, 2, 3]");
    t.eq(It.from(i0).dropUntil(npr1).toString(), "[]");
    t.eq(It.from(i1).dropWhile(pr1).toString(), "[]");
    t.eq(It.from(i2).dropWhile(pr1).toString(), "[2, 3]");
    t.eq(It.from(i0).dropWhile(pr1).toString(), "[]");
    t.eq(It.from(i1).dropWhile(pr1).toString(), "[]");
    t.eq(It.from(i2).dropWhile(pr1).toString(), "[2, 3]");

    const even = e => e % 2 === 0;
    const neven = e => e % 2 !== 0;

    t.eq(It.from(i0).filter(even).toString(), "[]");
    t.eq(It.from(i1).filter(even).toString(), "[]");
    t.eq(It.from(i2).filter(even).toString(), "[2]");
    t.eq(It.from(i0).filter(neven).toString(), "[]");
    t.eq(It.from(i1).filter(neven).toString(), "[1]");
    t.eq(It.from(i2).filter(neven).toString(), "[1, 3]");

    const mul2 = e => e * 2;

    t.eq(It.from(i0).map(mul2).toString(), "[]");
    t.eq(It.from(i1).map(mul2).toString(), "[2]");
    t.eq(It.from(i2).map(mul2).toString(), "[2, 4, 6]");

    // Progresive ----------------------

    t.mark("progresive");

    const ftrue = () => true;
    const feq = a => e => a === e;

    t.yes(It.from(i0).every(feq(1)));
    t.yes(It.from(i1).every(feq(1)));
    t.yes(!It.from(i2).every(feq(1)));
    t.yes(!It.from(i0).some(feq(1)));
    t.yes(It.from(i2).some(feq(1)));
    t.yes(!It.from(i2).some(feq(9)));
    t.yes(!It.from(i0).contains(1));
    t.yes(It.from(i2).contains(1));
    t.yes(!It.from(i2).contains(9));

    t.eq(It.from(s0).filter(ftrue).count(), 0);
    t.eq(It.from(s1).filter(ftrue).count(), 1);
    t.eq(It.from(s2).filter(ftrue).count(), 3);

    t.eq(It.from(i0).filter(even).count(), 0);
    t.eq(It.from(i1).filter(even).count(), 0);
    t.eq(It.from(i2).filter(even).value, 2);
    t.eq(It.from(i0).filter(neven).count(), 0);
    t.eq(It.from(i1).filter(neven).value, 1);
    t.eq(It.from(i2).filter(neven).value, 1);

    t.eq(It.from(i0).find(even), undefined);
    t.eq(It.from(i1).find(even), undefined);
    t.eq(It.from(i2).find(even), 2);
    t.eq(It.from(i0).find(neven), undefined);
    t.eq(It.from(i1).find(neven), 1);
    t.eq(It.from(i2).find(neven), 1);

    t.eq(It.from(i0).findLast(even), undefined);
    t.eq(It.from(i1).findLast(even), undefined);
    t.eq(It.from(i2).findLast(even), 2);
    t.eq(It.from(i0).findLast(neven), undefined);
    t.eq(It.from(i1).findLast(neven), 1);
    t.eq(It.from(i2).findLast(neven), 3);

    t.eq(It.from(i0).indexf(even), -1);
    t.eq(It.from(i1).indexf(even), -1);
    t.eq(It.from(i2).indexf(even), 1);
    t.eq(It.from(i0).indexf(neven), -1);
    t.eq(It.from(i1).indexf(neven), 0);
    t.eq(It.from(i2).indexf(neven), 0);

    t.eq(It.from(i0).index(3), -1);
    t.eq(It.from(i1).index(3), -1);
    t.eq(It.from(i1).index(1), 0);
    t.eq(It.from(i2).index(5), -1);
    t.eq(It.from(i2).index(1), 0);
    t.eq(It.from(i2).index(3), 2);

    t.eq(It.from(i0).lastIndexf(even), -1);
    t.eq(It.from(i1).lastIndexf(even), -1);
    t.eq(It.from(i2).lastIndexf(even), 1);
    t.eq(It.from(i0).lastIndexf(neven), -1);
    t.eq(It.from(i1).lastIndexf(neven), 0);
    t.eq(It.from(i2).lastIndexf(neven), 2);

    t.eq(It.from(i0).lastIndex(3), -1);
    t.eq(It.from(i1).lastIndex(3), -1);
    t.eq(It.from(i1).lastIndex(1), 0);
    t.eq(It.from(i2).lastIndex(5), -1);
    t.eq(It.from(i2).lastIndex(1), 0);
    t.eq(It.from(i2).lastIndex(3), 2);

    // Block ------------------

    t.mark("block");

    const fred = (s, e) => s + e;

    let sum = 0;
    It.from(i0).each(e => {
      sum += e;
    });
    t.eq(sum, 0);
    It.from(i1).each(e => {
      sum += e;
    });
    t.eq(sum, 1);
    It.from(i2).each(e => {
      sum += e;
    }
    );
    t.eq(sum, 7);

    let sum2 = 0;
    sum = 0;
    It.from(i0).each((e, ix) => {
      sum += e;
      sum2 += ix;
    });
    t.eq(sum, 0);
    t.eq(sum2, 0);
    It.from(i1).each((e, ix) => {
      sum += e;
      sum2 += ix;
    });
    t.eq(sum, 1);
    t.eq(sum2, 0);
    It.from(i2).each((e, ix) => {
      sum += e;
      sum2 += ix;
    });
    t.eq(sum, 7);
    t.eq(sum2, 3);

    t.eq(It.from(i0).reduce(0, fred), 0);
    t.eq(It.from(i1).reduce(0, fred), 1);
    t.eq(It.from(i2).reduce(0, fred), 6);
    t.eq(It.from(s0).reduce("", fred), "");
    t.eq(It.from(s1).reduce("", fred), "one");
    t.eq(It.from(s2).reduce("", fred), "onetwothree");

    t.eq(It.from(i0).reverse().toString(), "[]");
    t.eq(It.from(i1).reverse().toString(), "[1]");
    t.eq(It.from(i2).reverse().toString(), "[3, 2, 1]");

    const arr = ["pérez", "pera", "p zarra", "pizarra"];
    t.eq(
      [...It.from(arr).sort()].toString(),
      ["p zarra", "pera", "pizarra", "pérez"].toString()
    );
    t.eq(
      [...It.sortLocale(It.from(arr))].toString(),
      ["p zarra", "pera", "pérez", "pizarra"].toString()
    );

    t.eq(It.from(s0).shuffle().toString(), "[]");
    t.eq(It.from(s1).shuffle().toString(), "[one]");
    //console.log(It.from(s2).shuffle().toString());

    // Static constructors ------------------

    t.mark("static constructors");

    t.eq(It.range().take(5).toString(), "[0, 1, 2, 3, 4]");
    t.eq(It.range(5).toString(), "[0, 1, 2, 3, 4]");
    t.eq(It.range(2, 5).toString(), "[2, 3, 4]");
    t.eq(It.range(0).toString(), "[]");
    t.eq(It.range(2, 2).toString(), "[]");

    t.eq(It.zip(It.from(s0), It.from(s2)).toString(), "[]");
    let its = It.unzip(It.zip(It.from(s1), It.from(s2)));
    t.yes(its.e1.eq(It.from(s1)));
    t.yes(its.e2.eq(It.from(s1)));
    its = It.unzip(It.zip(It.from(i1), It.from(i2)));
    t.yes(its.e1.eq(It.from(i1)));
    t.yes(its.e2.eq(It.from(i1)));

    t.eq(It.zip3(It.from(s0), It.from(s2), It.from(s1)).toString(), "[]");
    let its3 = It.unzip3(It.zip3(It.from(s1), It.from(s2), It.from(s2)));
    t.yes(its3.e1.eq(It.from(s1)));
    t.yes(its3.e2.eq(It.from(s1)));
    t.yes(its3.e3.eq(It.from(s1)));
    its3 = It.unzip3(It.zip3(It.from(i1), It.from(i2), It.from(i1)));
    t.yes(its3.e1.eq(It.from(i1)));
    t.yes(its3.e2.eq(It.from(i1)));
    t.yes(its3.e3.eq(It.from(i1)));

    t.log();
  }
}
