// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("B64Test");
goog.require("github_dedeme");

B64Test = class {
  static run() {
    const t = new Test("B64");
    t.eq(B64.encode("Cañónç䍆"), "Q2HDscOzbsOn5I2G");
    t.eq(B64.decode(B64.encode("Cañónç䍆")), "Cañónç䍆");
    let arr = new Uint8Array(4);
    for (let i = 0; i < 4; ++i) {
      arr[i] = i + 10;
    }
    let arr2 = B64.decodeBytes(B64.encodeBytes(arr));
    t.yes(It.fromBytes(arr).eq(It.fromBytes(arr2)));

    t.log();
  }
};


