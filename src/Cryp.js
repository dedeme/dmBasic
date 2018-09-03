// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Cryptographic functions

goog.provide("github_dedeme.Cryp");
goog.require("github_dedeme.B64");

{
  const B64 = github_dedeme.B64/**/;

  github_dedeme.Cryp/**/ = class {

    /**
   * Generates a B64 random key of a length 'lg'
   * @param {number} lg
   * @return {string}
   */
    static genK (lg) {
      let arr = new Uint8Array(lg);
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
      let k = B64.decodeBytes(B64.encode(
        key + "codified in irreversibleDeme is good, very good!\n\r8@@"
      ));
      let lenk = k.length;
      let sum = 0;
      for (let i = 0; i < lenk; ++i) {
        sum += k[i];
      }

      let lg2 = lg + lenk;
      let r = new Uint8Array(lg2);
      let r1 = new Uint8Array(lg2);
      let r2 = new Uint8Array(lg2);
      let ik = 0;
      for (let i = 0; i < lg2; ++i) {
        let v1 = k[ik];
        let v2 = v1 + k[v1 % lenk];
        let v3 = v2 + k[v2 % lenk];
        let v4 = v3 + k[v3 % lenk];
        sum = (sum + i + v4) % 256;
        r1[i] = sum;
        r2[i] = sum;
        ++ik;
        if (ik === lenk) {
          ik = 0;
        }
      }

      for (let i = 0; i < lg2; ++i) {
        let v1 = r2[i];
        let v2 = v1 + r2[v1 % lg2];
        let v3 = v2 + r2[v2 % lg2];
        let v4 = v3 + r2[v3 % lg2];
        sum = (sum + v4) % 256;
        r2[i] = sum;
        r[i] = (sum + r1[i]) % 256;
      }

      return B64.encodeBytes(r).substring(0, lg);
    }

    /**
   * Encodes 'm' with key 'k'.
   * @param {string} k Key for encoding
   * @param {string} m Message to encode
   * @return {string} 'm' codified in B64 digits.
   */
    static cryp (k, m) {
      m = B64.encode(m);
      let lg = m.length;
      k = github_dedeme.Cryp/**/.key(k, lg);
      let r = new Uint8Array(lg);
      for (let i = 0; i < lg; ++i) {
        r[i] = m.charCodeAt(i) + k.charCodeAt(i);
      }

      return B64.encodeBytes(r);
    }

    /**
   * Decodes 'c' using key 'k'. 'c' was codified with cryp().
   * @param {string} k Key for decoding
   * @param {string} c Text codified with cryp()
   * @return {string} 'c' decoded.
   */
    static decryp(k, c) {
      let bs = B64.decodeBytes(c);
      let lg = bs.length;
      k = github_dedeme.Cryp/**/.key(k, lg);
      let r = "";
      for (let i = 0; i < lg; ++i) {
        r += String.fromCharCode(bs[i] - k.charCodeAt(i));
      }

      return B64.decode(r);
    }

  }; }

