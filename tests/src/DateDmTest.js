// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("DateDmTest");
goog.require("github_dedeme");

DateDmTest = class {
  static run() {
    const t = new Test("DateDm");

    t.mark("constructor");

    /** @type {!DateDm} */
    let d1 = new DateDm(29, 2, 2013);
    let d2 = new DateDm(6, 3, 2013);
    let d3 = new DateDm(30, 4, 2013);

    t.mark("fromEn");

    t.yes(d1.eq(DateDm.fromEn("2-29-2013")));
    t.yes(d1.eq(DateDm.fromEn("2/29/2013")));
    t.yes(d2.eq(DateDm.fromEn("3-6-2013")));
    t.yes(d2.eq(DateDm.fromEn("3/6/2013")));

    t.mark("fromEu");

    t.yes(DateDm.fromEu("1/3/2013").eq(d1));
    t.yes(DateDm.fromEu("1-3-2013").eq(d1));
    t.yes(DateDm.fromEu("01/3/2013").eq(d1));
    t.yes(DateDm.fromEu("1/03/2013").eq(d1));
    t.yes(DateDm.fromEu("01-03-2013").eq(d1));
    t.yes(DateDm.fromStr("20130301").eq(d1));
    t.yes(DateDm.fromDate(new Date(2013, 2, 1, 0, 0, 0)).eq(d1));

    t.mark("add-df");

    t.yes(d1.add(5).eq(d2));
    t.yes(d2.eq(d3.add(-55)));
    t.eq(d1.df(d2), -5);
    t.eq(d3.df(d2), 55);

    t.mark("format");

    t.eq(d1.format("%%:%1, %d/%m/%y"), "%:V, 1/3/13");
    t.eq(d1.format("%%%A%%, %D/%M/%Y"), "%viernes%, 01/03/2013");
    t.eq(d3.format("%b, %d-%b-%y"), "abr, 30-abr-13");
    t.eq(d1.format("Madrid, a %d de %B de %Y."),
      "Madrid, a 1 de marzo de 2013.");

    t.mark("base");

    t.eq(d1.toBase(), "20130301");
    t.eq(d2.toBase(), "20130306");
    t.eq(d3.toBase(), "20130430");

    t.mark("day-month-year");

    t.eq(d1.day(), 1);
    t.eq(d2.day(), 6);
    t.eq(d3.day(), 30);
    t.eq(d1.month(), 3);
    t.eq(d2.month(), 3);
    t.eq(d3.month(), 4);
    t.eq(d1.year(), 2013);
    t.eq(d2.year(), 2013);
    t.eq(d3.year(), 2013);

    t.mark("serialize-restore");

    t.yes(d1.eq(DateDm.restore(d1.serialize())));
    t.yes(d2.eq(DateDm.restore(d2.serialize())));
    t.yes(d3.eq(DateDm.restore(d3.serialize())));

    t.log();
  }
};

