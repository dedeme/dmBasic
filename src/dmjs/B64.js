// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** B64 encode y decode. */
export default class B64 {

  /**
   * Encodes a string in B64
   * @param {string} s String source
   * @return {string} B64 result
   */
  static encode (s) {
    return btoa(encodeURIComponent(s).replace(
      /%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode(parseInt("0x" + p1, 16))
    ));
  }

  /**
   * Decodes B64 code in string
   * @param {string} b64 B64 source
   * @return {string} String result
   */
  static decode (b64) {
    return decodeURIComponent(atob(b64).split("").map(
      c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(""));
  }

  /**
   * Encodes a Uint8Array in B64
   * @param {!Uint8Array} bs Bytes source
   * @return {string} B64 result
   */
  static encodeBytes (bs) {
    return btoa(String.fromCharCode.apply(null, bs));
  }

  /**
   * Decodes B64 code in Uint8Array
   * @param {string} b64 B64 source
   * @return {!Uint8Array} Bytes result
   */
  static decodeBytes (b64) {
    return new Uint8Array(atob(b64).split("").map(c => c.charCodeAt(0)));
  }
}
