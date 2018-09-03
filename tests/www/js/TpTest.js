import Test from "./dmjs/Test.js";
import Tp from "./dmjs/Tp.js";
import Tp3 from "./dmjs/Tp3.js";
export default class TpTest {
  static run () {
    const t = new Test("Tuple");
    t.mark("Tp");
    const tp = new Tp(1, "b");
    t.eq(1, tp.e1);
    t.eq("b", tp.e2);
    t.mark("Tp3");
    const tp3 = new Tp3(1, "b", 33);
    t.eq(1, tp3.e1);
    t.eq("b", tp3.e2);
    t.eq(33, tp3.e3);
    t.log();
  }
}
