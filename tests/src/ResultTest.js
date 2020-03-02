// Copyright 25-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Test from "./dmjs/Test.js";
import Result from "./dmjs/Result.js";
import It from "./dmjs/It.js";

export default class MaybeTest {
  static run () {
    const t = new Test("Result");

    const vLeft = Result.left("error");
    t.yes(vLeft.isLeft());
    t.not(vLeft.isRight());
    const vRight = Result.right(2);
    t.not(vRight.isLeft());
    t.yes(vRight.isRight());

    t.eq(vLeft.fromLeft(), "error");
    t.eq(vRight.fromRight(), 2);
    const fn1 = x => x * 2;
    const fn2 = Result.right(fn1);
    /** @type {function(number):!Result<number>} */
    const fn3 = x => {
      if (x < 0) return Result.left("fn3 error");
      return Result.right(x * 2);
    };

    t.eq(vLeft.fmap(fn1).fromLeft(), "error");
    t.eq(vRight.fmap(fn1).fromRight(), 4);
    t.eq(vLeft.comp(fn2).fromLeft(), "error");
    t.eq(vRight.comp(fn2).fromRight(), 4);
    t.eq(vLeft.bind(fn3).fromLeft(), "error");
    t.eq(vRight.bind(fn3).fromRight(), 4);
    t.eq(Result.right(-1).bind(fn3).fromLeft(), "fn3 error");

    const a =
      [Result.right(1), Result.right(2), Result.right(3), Result.right(4)];
    t.yes(It.from(Result.fromIterable(a).fromRight()).eq(
      It.from([1, 2, 3, 4])
    ));
    const a2 =
      [Result.right(1), Result.left("a"), Result.right(3), Result.left("b")];
    t.eq(Result.fromIterable(a2).fromLeft(), "a");

    t.eq(Result.fromJs(Result.left("err").toJs()).fromLeft(), "err");
    t.eq(Result.fromJs(Result.right(22).toJs()).fromRight(), 22);

    t.log();
  }
}
