// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Cryptographic functions

import B64 from "./B64.js";

export default class Cryp {

  /**
   * Generates a B64 random key of a length 'lg'
   * @param {number} lg Key length
   * @return {string} Random key
   */
  static genK (lg) {
    const arr = new Uint8Array(lg);
    for (let i = 0; i < lg; ++i) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return B64.encodeBytes(arr).substring(0, lg);
  }

  /**
   * Returns 'k' codified in irreversible way, using 'lg' B64 digits.
   * @param {string} key String to codify
   * @param {number} lg Length of result
   * @return {string} 'lg' B64 digits
   */
  static key (key, lg) {
    /** @type {!Uint8Array} */
    const k = B64.decodeBytes(B64.encode(
      key + "codified in irreversibleDeme is good, very good!\n\r8@@"
    ));
    const lenk = k.length;
    let sum = 0;
    for (let i = 0; i < lenk; ++i) {
      sum += k[i];
    }

    const lg2 = lg + lenk;
    const r = new Uint8Array(lg2);
    const r1 = new Uint8Array(lg2);
    const r2 = new Uint8Array(lg2);
    let ik = 0;
    for (let i = 0; i < lg2; ++i) {
      const v1 = k[ik];
      const v2 = v1 + k[v1 % lenk];
      const v3 = v2 + k[v2 % lenk];
      const v4 = v3 + k[v3 % lenk];
      sum = (sum + i + v4) % 256;
      r1[i] = sum;
      r2[i] = sum;
      ++ik;
      if (ik === lenk) {
        ik = 0;
      }
    }

    for (let i = 0; i < lg2; ++i) {
      const v1 = r2[i];
      const v2 = v1 + r2[v1 % lg2];
      const v3 = v2 + r2[v2 % lg2];
      const v4 = v3 + r2[v3 % lg2];
      sum = (sum + v4) % 256;
      r2[i] = sum;
      r[i] = (sum + r1[i]) % 256;
    }

    return B64.encodeBytes(r).substring(0, lg);
  }

  /**
   * Encodes 'm' with key 'k'.
   * @param {string} key Key for encoding
   * @param {string} msg Message to encode
   * @return {string} 'm' codified in B64 digits.
   */
  static cryp (key, msg) {
    const m = B64.encode(msg);
    const lg = m.length;
    const k = Cryp.key(key, lg);
    const r = new Uint8Array(lg);
    for (let i = 0; i < lg; ++i) {
      r[i] = m.charCodeAt(i) + k.charCodeAt(i);
    }

    return B64.encodeBytes(r);
  }

  /**
   * Decodes 'c' using key 'k'. 'c' was codified with cryp().
   * @param {string} key Key for decoding
   * @param {string} c Text codified with cryp()
   * @return {string} 'c' decoded.
   */
  static decryp (key, c) {
    const bs = B64.decodeBytes(c);
    const lg = bs.length;
    const k = Cryp.key(key, lg);
    let r = "";
    for (let i = 0; i < lg; ++i) {
      r += String.fromCharCode(bs[i] - k.charCodeAt(i));
    }

    return B64.decode(r);
  }

}

