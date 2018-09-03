import B64 from "./dmjs/B64.js";
import Test from "./dmjs/Test.js";
export default class B64Test {
  static run () {
    const t = new Test("B64");
    t.eq(B64.encode("Cañónç䍆"), "Q2HDscOzbsOn5I2G");
    t.eq(B64.decode(B64.encode("Cañónç䍆")), "Cañónç䍆");
    const arr = new Uint8Array(4);
    for (let i = 0; i < 4; ++i) {
      arr[i] = i + 10;
    }
    const arr2 = B64.decodeBytes(B64.encodeBytes(arr));
    t.yes(arr.toString() === (arr2.toString()));
    t.log();
  }
}
