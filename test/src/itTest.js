'use strict';
goog.provide('itTest');

goog.require('dmjs.Test');
goog.require('dmjs.func');
goog.require('dmjs.It');

itTest = function () {
  var It = dmjs.It;
  var fn =dmjs.func;

  var t = new dmjs.Test ("It Test: constructors");
  /** @private @type{!Array.<number>} */
  var i0 = [];
  var i1 = [1];
  var i2 = [1, 2, 3];
  /** @private @type{!Array.<string>} */
  var s0 = [];
  var s1 = ["one"];
  var s2 = ["one", "two", "three"];

  t.yes (It.from(i0).equals(It.from(i0)));
  t.not (It.from(i0).equals(It.from(i1)));
  t.yes (It.from(i1).equals(It.from(i1)));
  t.not (It.from(i1).equals(It.from(i0)));
  t.yes (It.from(i2).equals(It.from(i2)));
  t.not (It.from(i2).equals(It.from(i1)));
  t.not (It.from(i1).equals(It.from(i2)));

//  t.not (It.from(i0).equals(It.from(s0)));

  t.yes ("[]", It.from(i0).toString());
  t.yes ("[1]", It.from(i1).toString());
  t.yes ("[1, 2, 3]", It.from(i2).toString());

  t.yes ("", It.from(i0).toArray().toString());
  t.yes ("1", It.from(i1).toArray().toString());
  t.yes ("1,2,3", It.from(i2).toArray().toString());

  t.yes ("[]", It.from("").toString())
  t.yes ("[a]", It.from("a").toString())
  t.yes ("[a, b, c]", It.from("abc").toString())

  t.yes ("[]", It.from({}).toString());
  var itMap = It.from({"one":1, "two":2});
  t.yes ("one,1", itMap.next().toString());
  t.yes ("two,2", itMap.next().toString());
  t.not (itMap.hasNext());

  t.log();

  //----------------------------------
  t = new dmjs.Test ("It test: lazy");

  t.yes("[1]", It.from(i0).add(1).toString());
  t.yes("[1]", It.from(i0).add0(1).toString());
  t.yes("[1, 2, 3, 1]", It.from(i2).add(1).toString());
  t.yes("[1, 1, 2, 3]", It.from(i2).add0(1).toString());
  t.yes("[1, 1, 2, 3]", It.from(i2).add(1, 1).toString());
  t.yes("[1, 2, 3, 1]", It.from(i2).addIt(It.from(i1)).toString());
  t.yes("[1, 1, 2, 3]", It.from(i2).addIt(It.from(i1), 1).toString());
  t.yes("[1, 2, 3]", It.from(i2).addIt(It.from(i0)).toString());
  t.yes("[1, 2, 3]", It.from(i2).addIt(It.from(i0), 1).toString());
  t.yes("[]", It.from(i0).addIt(It.from(i0)).toString());
  t.yes("[1, 2, 3]", It.from(i0).addIt(It.from(i2), 1).toString());

  t.yes("[1]", It.empty().add(1).toString());
  t.yes("[1]", It.empty().add0(1).toString());
  t.yes("[]", It.empty().addIt(It.from(i0)).toString());
  t.yes("[1, 2, 3]", It.empty().addIt(It.from(i2), 1).toString());

  var pr1 = function  (e) { return e < 2; };

  t.yes("[one, two, three]", It.from(s2).drop(0).toString());
  t.yes("[two, three]", It.from(s2).drop(1).toString());
  t.yes("[]", It.from(s2).drop(10).toString());
  t.yes("[1, 2, 3]", It.from(i2).drop(0).toString());
  t.yes("[]", It.from(i0).dropWhile(pr1).toString());
  t.yes("[]", It.from(i1).dropWhile(pr1).toString());
  t.yes("[2, 3]", It.from(i2).dropWhile(pr1).toString());

  var even = function  (e) { return e % 2 == 0; };

  t.yes ("[]", It.from(i0).filter(even).toString());
  t.yes ("[]", It.from(i1).filter(even).toString());
  t.yes ("[2]", It.from(i2).filter(even).toString());
  t.yes ("[]", It.from(i0).filter(fn.negate(even)).toString());
  t.yes ("[1]", It.from(i1).filter(fn.negate(even)).toString());
  t.yes ("[1, 3]", It.from(i2).filter(fn.negate(even)).toString());

  var mul2 = function  (e) { return e * 2; };

  t.yes("[]", It.from(i0).map(mul2).toString());
  t.yes("[2]", It.from(i1).map(mul2).toString());
  t.yes("[2, 4, 6]", It.from(i2).map(mul2).toString());

  t.yes("[]", It.from(s2).take(0).toString());
  t.yes("[one]", It.from(s2).take(1).toString());
  t.yes("[one, two, three]", It.from(s2).take(10).toString());
  t.yes("[1, 2, 3]", It.from(i2).take(1000).toString());
  t.yes("[]", It.from(i0).takeWhile(pr1).toString());
  t.yes("[1]", It.from(i1).takeWhile(pr1).toString());
  t.yes("[1]", It.from(i2).takeWhile(pr1).toString());

  t.log();

  //-----------------------------------------
  t = new dmjs.Test ("It test: progressive");

  t.yes(It.from(i0).all(fn.eq(1)));
  t.yes(It.from(i1).all(fn.eq(1)));
  t.not(It.from(i2).all(fn.eq(1)));
  t.not(It.from(i0).any(fn.eq(1)));
  t.yes(It.from(i2).any(fn.eq(1)));
  t.not(It.from(i2).any(fn.eq(9)));

  t.yes(0, It.from(s0).count());
  t.yes(1, It.from(s1).count());
  t.yes(3, It.from(s2).count());

  t.yes(undefined === It.from(i0).find(even));
  t.yes(undefined === It.from(i1).find(even));
  t.yes(2, It.from(i2).find(even));
  t.yes(undefined === It.from(i0).find(fn.negate(even)));
  t.yes(1, It.from(i1).find(fn.negate(even)));
  t.yes(1, It.from(i2).find(fn.negate(even)));

  t.yes(-1, It.from(i0).index(even));
  t.yes(-1, It.from(i1).index(even));
  t.yes(1, It.from(i2).index(even));
  t.yes(-1, It.from(i0).index(fn.negate(even)));
  t.yes(0, It.from(i1).index(fn.negate(even)));
  t.yes(0, It.from(i2).index(fn.negate(even)));

  t.yes(undefined === It.from(i0).findLast(even));
  t.yes(undefined === It.from(i1).findLast(even));
  t.yes(2, It.from(i2).findLast(even));
  t.yes(undefined === It.from(i0).findLast(fn.negate(even)));
  t.yes(1, It.from(i1).findLast(fn.negate(even)));
  t.yes(3, It.from(i2).findLast(fn.negate(even)));

  t.yes(-1, It.from(i0).lastIndex(even));
  t.yes(-1, It.from(i1).lastIndex(even));
  t.yes(1, It.from(i2).lastIndex(even));
  t.yes(-1, It.from(i0).lastIndex(fn.negate(even)));
  t.yes(0, It.from(i1).lastIndex(fn.negate(even)));
  t.yes(2, It.from(i2).lastIndex(fn.negate(even)));

  t.log();

  //--------------------------------------
  t = new dmjs.Test ("It test: in block");

  var tpS;
  tpS = It.from(s0).duplicate();
  t.yes(It.from(s0).equals(tpS[0]));
  t.yes(It.from(s0).equals(tpS[1]));
  tpS = It.from(s1).duplicate();
  t.yes(It.from(s1).equals(tpS[0]));
  t.yes(It.from(s1).equals(tpS[1]));
  tpS = It.from(s2).duplicate();
  t.yes(It.from(s2).equals(tpS[0]));
  t.yes(It.from(s2).equals(tpS[1]));

  t.yes("[]", It.from(i0).reverse().toString());
  t.yes("[1]", It.from(i1).reverse().toString());
  t.yes("[3, 2, 1]", It.from(i2).reverse().toString());

  t.yes("[]", It.from(s0).sort().toString());
  t.yes("[one]", It.from(s1).reverse().toString());
  t.yes("[three, two, one]", It.from(s2).reverse().toString());

  t.yes("[]", It.from(s0).sort().toString());
  t.yes("[1]", It.from(i1).sort().toString());
  t.yes("[1, 2, 3]", It.from(i2).sort().reverse().sort().toString());
  t.yes("[3, 2, 1]", It.from(i2).sort(function (a, b){
    return b - a;
  }).toString());


  var arr = (["pérez", "pera", "p zarra", "pizarra"]);
  var arr2 = It.from(arr).sort(function (a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }).toArray();
  t.yes(["p zarra", "pera", "pizarra", "pérez"].toString(), arr2.toString());

  arr2 = It.from(arr).sort(function (a, b) {
    return a.localeCompare(b);
  }).toArray();
  t.yes(["p zarra", "pera", "pérez", "pizarra"].toString(), arr2.toString());

  t.yes("[]", It.from(s0).shuffle().toString());

  t.log();

  //-------------------------------------------------
  t = new dmjs.Test ("It test: static constructors");


  t.yes("[0, 1, 2, 3, 4]", It.range(5).toString());
  t.yes("[2, 3, 4]", It.range(2, 5).toString());
  t.yes("[]", It.range(0).toString());
  t.yes("[]", It.range(2, 2).toString());

  t.yes("[]", It.zip(It.from(s0), It.from(s2)).toString());
  t.yes("[one,one]", It.zip(It.from(s1), It.from(s2)).toString());
  t.yes("[1,one]", It.zip(It.from(i1), It.from(s2)).toString());
  t.yes("[1,1, 2,2, 3,3]"
  , It.zip(It.from(i2), It.from(i2)).toString()
  );

  t.yes("[]", It.flat(
    It.from ([[]]).map(function (e) { return It.from(e); })
  ).toString())
  t.yes("[]", It.flat(
    It.from ([[],[],[]]).map(function (e) { return It.from(e); })
  ).toString())
  t.yes("[1, 3, 2, 1]", It.flat(
    It.from ([[], [1], [3, 2, 1]]).map(function (e) { return It.from(e); })
  ).toString())

  t.yes("", It.join(It.flatFromStrings(It.from ([]))));
  t.yes("", It.join(It.flatFromStrings(It.from (["", "", ""]))));
  t.yes("acba", It.join(It.flatFromStrings(It.from (["", "a", "cba"]))));

  var sum = 0;
  It.from(i0).each (function (e) { sum += e; });
  t.yes (0, sum);
  It.from(i1).each (function (e) { sum += e; });
  t.yes (1, sum);
  It.from(i2).each (function (e) { sum += e; });
  t.yes (7, sum);

  var sum2 = 0;
  sum = 0;
  It.from(i0).eachIx (function (e, ix) { sum += e; sum2 += ix});
  t.yes (0, sum);
  t.yes (0, sum2);
  It.from(i1).eachIx (function (e, ix) { sum += e; sum2 += ix});
  t.yes (1, sum);
  t.yes (0, sum2);
  It.from(i2).eachIx (function (e, ix) { sum += e; sum2 += ix});
  t.yes (7, sum);
  t.yes (3, sum2);

  t.log();
}
