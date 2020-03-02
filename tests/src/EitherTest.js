// Copyright 25-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Test from "./dmjs/Test.js";
import Either from "./dmjs/Either.js";
import It from "./dmjs/It.js";

export default class MaybeTest {
  static run () {
    const t = new Test("Either");

    const vLeft = Either.left("error");
    t.yes(vLeft.isLeft());
    t.not(vLeft.isRight());
    const vRight = Either.right(2);
    t.not(vRight.isLeft());
    t.yes(vRight.isRight());

    t.eq(vLeft.fromLeft(), "error");
    t.eq(vRight.fromRight(), 2);
    const fn1 = x => x * 2;
    const fn2 = Either.right(fn1);
    /** @type {function(number):!Either<string, number>} */
    const fn3 = x => {
      if (x < 0) return Either.left("fn3 error");
      return Either.right(4);
    };

    t.eq(vLeft.fmap(fn1).fromLeft(), "error");
    t.eq(vRight.fmap(fn1).fromRight(), 4);
    t.eq(vLeft.comp(fn2).fromLeft(), "error");
    t.eq(vRight.comp(fn2).fromRight(), 4);
    t.eq(vLeft.bind(fn3).fromLeft(), "error");
    t.eq(vRight.bind(fn3).fromRight(), 4);
    t.eq(Either.right(-1).bind(fn3).fromLeft(), "fn3 error");

    const a =
      [Either.right(1), Either.right(2), Either.right(3), Either.right(4)];
    t.yes(It.from(Either.fromIterable(a).fromRight()).eq(
      It.from([1, 2, 3, 4])
    ));
    const a2 =
      [Either.right(1), Either.left("a"), Either.right(3), Either.left("b")];
    t.eq(Either.fromIterable(a2).fromLeft(), "a");

    t.eq(Either.fromJs(Either.left("err").toJs()).fromLeft(), "err");
    t.eq(Either.fromJs(Either.right(22).toJs()).fromRight(), 22);

    t.log();
  }
}
