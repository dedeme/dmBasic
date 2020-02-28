// Copyright 25-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Test from "./dmjs/Test.js";
import Maybe from "./dmjs/Maybe.js";
import It from "./dmjs/It.js";

export default class MaybeTest {
  static run () {
    const t = new Test("Maybe");

    const vNothing = Maybe.nothing;
    t.yes(vNothing.isNothing());
    t.not(vNothing.isJust());
    const vJust = Maybe.just(2);
    t.not(vJust.isNothing());
    t.yes(vJust.isJust());
    t.eq(vNothing.fromMaybe("abc"), "abc");
    t.eq(vJust.fromMaybe(34), 2);
    const fn1 = x => x * 2;
    const fn2 = Maybe.just(fn1);
    /** @type {function(number):!Maybe<number>} */
    const fn3 = x => x < 0 ? Maybe.nothing : Maybe.just(x * 2);

    t.yes(vNothing.fmap(fn1).isNothing());
    t.eq(vJust.fmap(fn1).fromJust(), 4);
    t.yes(vNothing.comp(fn2).isNothing());
    t.eq(vJust.comp(fn2).fromJust(), 4);
    t.yes(vNothing.bind(fn3).isNothing());
    t.eq(vJust.bind(fn3).fromJust(), 4);
    t.yes(Maybe.just(-1).bind(fn3).isNothing());

    const a = [Maybe.just(1), Maybe.just(2), Maybe.just(3), Maybe.just(4)];
    t.yes(It.from(Maybe.fromIterable(a).fromJust()).eq(It.from([1, 2, 3, 4])));
    const a2 = [Maybe.just(1), Maybe.nothing, Maybe.just(3), Maybe.nothing];
    t.yes(Maybe.fromIterable(a2).isNothing());

    t.log();
  }
}
