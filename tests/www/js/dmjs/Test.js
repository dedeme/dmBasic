export default class Test {
  constructor (fname) {
    this._fname = fname;
    this._pass = 0;
    this._fail = 0;
    this._posName = "";
    this._msg = (actual, expected) => {
      console.log("Test fail in [" + this._fname +
        (this._posName ? ":" : "") +
        this._posName + "]\n" +
         "  Actual  : " + actual + "\n  Expected: " + expected);
    };
  }
  mark (pname) {
    this._posName = pname;
  }
  log () {
    console.log("Test [" + this._fname + "] summary:\n" +
      "  Total : " + (Number(this._pass) + this._fail) + "\n" +
      "  Passed: " + this._pass + "\n" +
      "  Failed: " + this._fail);
  }
  yes (value) {
    if (!value) {
      ++this._fail;
      this._msg("false", "true");
    } else {
      ++this._pass;
    }
  }
  not (value) {
    if (value) {
      ++this._fail;
      this._msg("true", "false");
    } else {
      ++this._pass;
    }
  }
  eq (actual, expected) {
    if (expected !== actual) {
      ++this._fail;
      this._msg(actual, expected);
    } else {
      ++this._pass;
    }
  }
  neq (actual, expected) {
    if (expected === actual) {
      ++this._fail;
      this._msg("!= " + actual, expected);
    } else {
      ++this._pass;
    }
  }
}
