// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
    Utility to test code.
    @template T
**/
export default class Test {

  /**
      @param {string} fname Test name.
  **/
  constructor (fname) {
    /**
        @private
        @type {string}
    **/
    this._fname = fname;
    /**
        @private
        @type {number}
    **/
    this._pass = 0;
    /**
        @private
        @type {string}
    **/
    this._posName = "";
    /**
        @private
        @param {T} actual Actual result.
        @param {T} expected Expected result.
        @return {void}
    **/
    this._error = (actual, expected) => {
      throw new Error(
        `Test fail in [${this._fname}${this._posName ? ": " : ""}` +
        `${this._posName}]\n` +
        `  Actual  : ${actual}\n` +
        `  Expected: ${expected}`
      );
    };
  }

  /**
      Marks a point of program.
      @param {string} pname Mark name.
      @return {void}
  **/
  mark (pname) {
    this._posName = pname;
  }

  /**
      Shows summary.
      @return {void}
  **/
  log () {
    // eslint-disable-next-line no-console
    console.log(
      `Test [${this._fname}] summary:\n` +
      `  Passed: ${this._pass}`
    );
  }

  /**
      Asserts that 'value' is true.
      @param {boolean} value Expected value true.
      @return {void}
  **/
  yes (value) {
    if (!value) this._error("false", "true");
    ++this._pass;
  }

  /**
      Asserts that 'value' is false.
      @param {boolean} value Expected value false.
      @return {void}
  **/
  not (value) {
    if (value) this._error("true", "false");
    ++this._pass;
  }

  /**
      (equals) Compares with '==='.
      @param {T} actual Actual result.
      @param {T} expected Expected result.
      @return {void}
  **/
  eq (actual, expected) {
    if (expected !== actual) this._error(actual, expected);
    ++this._pass;
  }

  /**
      (not equals) Compares with '==='
      @param {T} actual Actual result.
      @param {T} expected Unexpected result.
      @return {void}
  **/
  neq (actual, expected) {
    if (expected === actual) this._error(actual, "!= " + actual);
    ++this._pass;
  }

}

