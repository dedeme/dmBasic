// Copyright 26-Feb-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>
// Adapted from go.

/**
    Path management.
**/

import Tp from "./Tp.js";

/**
    @private
**/
class LazyBuf {
  /**
      @param {string} s
      @param {string} buf
      @param {number} w
  **/
  constructor (s, buf, w) {
    this._s = s;
    this._buf = buf;
    this._w = w;
  }

  /**
      @return {string}
  **/
  get s () {
    return this._s;
  }

  /**
      @return {string}
  **/
  get buf () {
    return this._buf;
  }

  /**
      @return {number}
  **/
  get w () {
    return this._w;
  }

  /**
      @return {void}
  **/
  incW () {
    ++this._w;
  }

  /**
      @return {void}
  **/
  decW () {
    --this._w;
  }

  /**
    @param {number} i
    @return {string}
  **/
  index (i) {
    if (this._buf === "") return this._s.charAt(i);
    return this._buf.charAt(i);
  }

  /**
    @param {string} c
    @return {void}
  **/
  append (c) {
    if (this._buf === "") {
      if (this._w < this._s.length && this._s.charAt(this._w) === c) {
        ++this._w;
        return;
      }
      this._buf = this._s.substring(0, this._w);
    }
    if (this._w === this._buf.length) this._buf += c;
    else this._buf = this._buf.substring(0, this._w) + c +
      this._buf.substring(this._w);
    ++this._w;
  }

  /**
      @return {string}
  **/
  toString () {
    if (this._buf === "") return this._s.substring(0, this._w);
    return this._buf.substring(0, this._w);
  }

}

/**
    Path management.
**/
export default class Path {

  /**
      Returns the shortest path name equivalent to path
      by purely lexical processing. It applies the following rules
      iteratively until no further processing can be done:
        1. Replace multiple slashes with a single slash.
        2. Eliminate each . path name element (the current directory).
        3. Eliminate each inner .. path name element (the parent directory)
           along with the non-.. element that precedes it.
        4. Eliminate .. elements that begin a rooted path:
           that is, replace "/.." by "/" at the beginning of a path.
      The returned path ends in a slash only if it is the root "/".
      If the result of this process is an empty string, Clean
      returns the string ".".
      See also Rob Pike, ``Lexical File Names in Plan 9 or
      Getting Dot-Dot Right,''
      https://9p.io/sys/doc/lexnames.html

      @param {string} path
      @return {string}
  **/
  static clean (path) {
    if (path === "") return ".";

    const rooted = path.charAt(0) === "/";
    const n = path.length;

    const out = new LazyBuf(path, "", 0);
    let r = 0;
    let dotdot = 0;
    if (rooted) {
      out.append("/");
      r = 1;
      dotdot = 1;
    }

    while (r < n) {
      if (path.charAt(r) === "/") ++r;
      else if (
        path.charAt(r) === "." &&
        (r + 1 === n || path.charAt(r + 1) === "/")
      ) ++r;
      else if (
        path.charAt(r) === "." &&
        path.charAt(r + 1) === "." &&
        (r + 2 === n || path.charAt(r + 2) === "/")
      ) {
        r += 2;
        if (out.w > dotdot) {
          out.decW();
          while (out.w > dotdot && out.index(out.w) !== "/") {
            out.decW();
          }
        } else if (!rooted) {
          if (out.w > 0) out.append("/");
          out.append(".");
          out.append(".");
          dotdot = out.w;
        }
      } else {
        if (rooted && out.w !== 1 || !rooted && out.w !== 0) {
          out.append("/");
        }
        for (; r < n && path.charAt(r) !== "/"; ++r)
          out.append(path.charAt(r));
      }
    }

    if (out.w === 0) return ".";
    return out.toString();
  }

  /**
      Splits path immediately following the final slash,
      separating it into a directory and file name component.
      If there is no slash in path, Split returns an empty dir and
      file set to path.
      The returned values have the property that path = dir+file.
      @param {string} path
      @return {!Tp<string, string>} Tuple (dir, file). 'dir' can end with '/'.
  **/
  static split (path) {
    const i = path.lastIndexOf("/");
    return new Tp(path.substring(0, i + 1), path.substring(i + 1));
  }

  /**
      Joins any number of path elements into a single path,
      separating them with slashes. Empty elements are ignored.
      The result is Cleaned. However, if the argument list is
      empty or all its elements are empty, Join returns
      an empty string.
      @param {...string} elem
      @return string
  **/
  static join (...elem) {
    for (let i = 0; i < elem.length; ++i) {
      const e = elem[i];
      if (e !== "") return Path.clean(elem.slice(i).join("/"));
    }
    return "";
  }

  /**
      Returns the file name extension used by path.
      The extension is the suffix beginning at the final dot
      in the final slash-separated element of path;
      it is empty if there is no dot.
      @param {string} path
      @return {string}
  **/
  static ext (path) {
    for (let i = path.length - 1; i >= 0 && path.charAt(i) !== "/"; --i) {
      if (path.charAt(i) === ".") return path.substring(i);
    }
    return "";
  }

  /**
      Returns the last element of path.
      Trailing slashes are removed before extracting the last element.
      If the path is empty, Base returns ".".
      If the path consists entirely of slashes, Base returns "/".
      @param {string} path
      @return {string}
  **/
  static base (path) {
    if (path === "") return ".";

    while (path.length > 0 && path.charAt(path.length - 1) === "/") {
      path = path.substring(0, path.length - 1);
    }

    const i = path.lastIndexOf("/");
    if (i >= 0) path = path.substring(i + 1);

    if (path === "") return "/";
    return path;
  }

  /**
      Reports whether the path is absolute.
      @param {string} path
      @return {boolean}
  **/
  static isAbs (path) {
    return path.length > 0 && path.charAt(0) === "/";
  }

  /**
      Returns all but the last element of path, typically the path's directory.
      After dropping the final element using Split, the path is Cleaned and
      trailing slashes are removed.
      If the path is empty, Dir returns ".".
      If the path consists entirely of slashes followed by non-slash bytes, Dir
      returns a single slash. In any other case, the returned path does not end
      in a slash.
      @param {string} path
      @return {string}
  **/
  static dir (path) {
    const tp = Path.split(path);
    return Path.clean(tp.e1);
  }
}

