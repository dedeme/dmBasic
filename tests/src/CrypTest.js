// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("CrypTest");
goog.require("github_dedeme");

CrypTest = class {
  static run() {
    const t = new Test("Cryp");

    //    t.eq(Cryp.genK(12).length, 12);
    //    console.log(Cryp.genK(6));
    t.eq(Cryp.key("deme", 6), "wiWTB9");
    t.eq(Cryp.key("Generaro", 5), "Ixy8I");
    t.eq(Cryp.key("Generara", 5), "0DIih");
    t.eq(Cryp.cryp("deme", "Cañón€%ç"), "v12ftuzYeq2Xz7q7tLe8tNnHtqY=");
    t.eq(Cryp.decryp("deme", Cryp.cryp("deme", "Cañón€%ç")), "Cañón€%ç");
    t.eq(Cryp.decryp("deme", Cryp.cryp("deme", "1")), "1");
    t.eq(Cryp.decryp("deme", Cryp.cryp("deme", "")), "");
    t.eq(Cryp.decryp("", Cryp.cryp("", "Cañón€%ç")), "Cañón€%ç");
    t.eq(Cryp.decryp("", Cryp.cryp("", "1")), "1");
    t.eq(Cryp.decryp("", Cryp.cryp("", "")), "");
    t.eq(Cryp.decryp("abc", Cryp.cryp("abc", "\n\ta€b c")), "\n\ta€b c");

    t.log();
  }
};


