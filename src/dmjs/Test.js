// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Utility to test code

export default class Test {
  /** @param {string} fname Test name*/
  constructor (fname) {
    /**
     * @private
     * @type {string}
     */
    this._fname = fname;
    /**
     * @private
     * @type {number}
     */
    this._pass = 0;
    /**
     * @private
     * @type {number}
     */
    this._fail = 0;
    /**
     * @private
     * @type {string}
     */
    this._posName = "";
    /**
     * @template T
     * @private
     * @param {T} actual Actual result
     * @param {T} expected Expected result
     * @return {void}
     */
    this._msg = (actual, expected) => {
      // eslint-disable-next-line no-console
      console.log("Test fail in [" + this._fname +
        (this._posName ? ":" : "") +
        this._posName + "]\n" +
         "  Actual  : " + actual + "\n  Expected: " + expected);
    };
  }

  /**
   * Marks a point of program
   * @param {string} pname Mark name
   * @return {void}
   */
  mark (pname) {
    this._posName = pname;
  }

  /**
   * Shows summary
   * @return {void}
   */
  log () {
    // eslint-disable-next-line no-console
    console.log("Test [" + this._fname + "] summary:\n" +
      "  Total : " + (Number(this._pass) + this._fail) + "\n" +
      "  Passed: " + this._pass + "\n" +
      "  Failed: " + this._fail);
  }

  /**
   * Asserts that 'value' is true
   * @param {boolean} value Expected value true
   * @return {void}
   */
  yes (value) {
    if (!value) {
      ++this._fail;
      this._msg("false", "true");
    } else {
      ++this._pass;
    }
  }

  /**
   * Asserts that 'value' is false
   * @param {boolean} value Expected value false
   * @return {void}
   */
  not (value) {
    if (value) {
      ++this._fail;
      this._msg("true", "false");
    } else {
      ++this._pass;
    }
  }

  /**
   * (equals) Compares with ===
   * @template T
   * @param {T} actual Actual result
   * @param {T} expected Expected result
   * @return {void}
   */
  eq (actual, expected) {
    if (expected !== actual) {
      ++this._fail;
      this._msg(actual, expected);
    } else {
      ++this._pass;
    }
  }

  /**
   * (not equals) Compares with ===
   * @template T
   * @param {T} actual Actual result
   * @param {T} expected Expected result
   * @return {void}
   */
  neq (actual, expected) {
    if (expected === actual) {
      ++this._fail;
      this._msg("!= " + actual, expected);
    } else {
      ++this._pass;
    }
  }
}

