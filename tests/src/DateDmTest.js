// Copyright 16-Aug-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import DateDm from "./dmjs/DateDm.js";
import Test from "./dmjs/Test.js";

export default class DateDmTest {

  static run () {
    const t = new Test("DateDm");

    const d1 = new DateDm(29, 2, 2013);
    const d2 = new DateDm(6, 3, 2013);
    const d3 = new DateDm(30, 4, 2013);

    t.yes(d1.add(5).eq(d2));
    t.yes(d2.eq(d3.add(-55)));
    t.eq(d1.df(d2), -5);
    t.eq(d3.df(d2), 55);

    t.eq(d1.format("%%:%1, %d/%m/%y"), "%:V, 1/3/13");
    t.eq(d1.format("%%%A%%, %D/%M/%Y"), "%viernes%, 01/03/2013");
    t.eq(d3.format("%b, %d-%b-%y"), "abr, 30-abr-13");
    t.eq(
      d1.format("Madrid, a %d de %B de %Y."), "Madrid, a 1 de marzo de 2013."
    );

    t.eq("20130301", d1.toBase());
    t.eq("20130306", d2.toBase());
    t.eq("20130430", d3.toBase());

    t.eq(d1.day, 1);
    t.eq(d2.day, 6);
    t.eq(d3.day, 30);
    t.eq(d1.month, 3);
    t.eq(d2.month, 3);
    t.eq(d3.month, 4);
    t.eq(d1.year, 2013);
    t.eq(d2.year, 2013);
    t.eq(d3.year, 2013);

    t.yes(DateDm.fromIso("1/3/2013").eq(d1));
    t.yes(DateDm.fromIso("1-3-2013").eq(d1));
    t.yes(DateDm.fromIso("01/3/2013").eq(d1));
    t.yes(DateDm.fromIso("1/03/2013").eq(d1));
    t.yes(DateDm.fromIso("01-03-2013").eq(d1));
    t.yes(d1.eq(DateDm.fromEn("2-29-2013")));
    t.yes(d1.eq(DateDm.fromEn("2/29/2013")));
    t.yes(d2.eq(DateDm.fromEn("3-6-2013")));
    t.yes(d2.eq(DateDm.fromEn("3/6/2013")));
    t.yes(DateDm.fromStr("20130301").eq(d1));
    t.yes(DateDm.fromDate(new Date(2013, 2, 1)).eq(d1));

    t.yes(DateDm.isLeap(2020));
    t.yes(DateDm.isLeap(2000));
    t.yes(!DateDm.isLeap(2100));

    t.eq(new DateDm(14, 7, 2019).format("%1"), "D");

    t.log();
  }

}


