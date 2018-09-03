// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** B64 encode y decode */
goog.provide("github_dedeme.B64");

github_dedeme.B64/**/ = class {

  /**
   * Encodes a string in B64
   * @param {string} s
   * @return {string}
   */
  static encode (s) {
    return btoa(encodeURIComponent(s).replace(
      /%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode(parseInt("0x" + p1, 16))
    ));
  }

  /**
   * Decodes B64 code in string
   * @param {string} b64
   * @return {string}
   */
  static decode (b64) {
    return decodeURIComponent(atob(b64).split("").map(
      c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(""));
  }

  /**
   * Encodes a Uint8Array in B64
   * @param {!Uint8Array} bs
   * @return {string}
   */
  static encodeBytes (bs) {
    return btoa(String.fromCharCode/**/.apply(null, bs));
  }

  /**
   * Decodes B64 code in Uint8Array
   * @param {string} b64
   * @return {!Uint8Array}
   */
  static decodeBytes (b64) {
    return new Uint8Array(atob(b64).split("").map(c => c.charCodeAt(0)));
  }
};
