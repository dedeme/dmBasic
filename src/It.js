// Copyright 02-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Iterator */

goog.provide("github_dedeme.It");
goog.require("github_dedeme.List");
goog.require("github_dedeme.Tp");
goog.require("github_dedeme.Tp3");

/** @template T */
github_dedeme.It/**/ = class {
  /**
   * @param {function ():boolean} hasNext
   * @param {function ():T} next
   */
  constructor (hasNext, next) {
    /** @private */
    this._hasNext = hasNext;
    /** @private */
    this._next = next;
  }

  /** @return {boolean} */
  hasNext () {
    return this._hasNext();
  }

  /** @return {T} */
  next () {
    return this._next();
  }

  /**
   * Returns [this] with [element] added at end or at [i] if [i] is
   * not null
   * @param {T} e
   * @param {number=} i
   * @return {!github_dedeme.It<T>}
   */
  add (e, i) {
    const self = this;
    let c = 0;
    if (!i) {
      return new github_dedeme.It(
        () => c === 0,
        () => {
          if (self._hasNext()) return self._next();
          ++c;
          return e;
        }
      );
    }
    return new github_dedeme.It(
      () => self._hasNext() || c < i,
      () => {
        if (c <= i) {
          if (self._hasNext() && c < i) {
            ++c;
            return self._next();
          }
          c = i + 1;
          return e;
        }
        return self._next();
      }
    );
  }

  /**
   * Returns [this] with [e] added at the beginning
   * @param {T} e
   * @return {!github_dedeme.It<T>}
   */
  add0 (e) {
    const self = this;
    let isNotAdd = true;
    return new github_dedeme.It(
      () => self._hasNext() || isNotAdd,
      () => {
        if (isNotAdd) {
          isNotAdd = false;
          return e;
        }
        return self._next();
      }
    );
  }

  /**
   * Inserts an iterator in [this] at [i] or at end if [i] is null.
   * @param {!github_dedeme.It<T>} it
   * @param {number=} i
   * @return {!github_dedeme.It<T>}
   */
  addIt (it, i) {
    const self = this;
    let c = 0;
    return new github_dedeme.It(
      () => self._hasNext() || it.hasNext(),
      () => {
        if (!i) {
          if (self._hasNext()) return self._next();
          return it.next();
        }
        if (c < i) {
          if (self._hasNext()) {
            ++c;
            return self._next();
          }
          c = i;
        }
        if (it.hasNext()) return it.next();
        return self._next();
      }
    );
  }

  /**
   * Returns true if all elements give true with [f]
   * @param {function (T):boolean} f
   * @return {boolean}
   */
  all (f) {
    while (this._hasNext())
      if (!f(this._next())) return false;
    return true;
  }

  /**
   * Returns true if any element of [this] is equals (===) to [e]
   * @param {T} e
   * @return {boolean}
   */
  contains (e) {
    while (this._hasNext())
      if (e === this._next()) return true;
    return false;
  }

  /**
   * Returns true if any element of [this] returns true with [f]
   * @param {function (T):boolean} f
   * @return {boolean}
   */
  containsf (f) {
    while (this._hasNext())
      if (f(this._next())) return true;
    return false;
  }

  /**
   * Returns the number of elements whish give true with [f]
   * Number of all the elements is returned by [size()]
   * @param {function (T):boolean} f
   * @return {number}
   */
  count (f) {
    return this.filter(f).size();
  }

  /**
   * Returns rest of [this] after call [take ()]
   * @param {number} n
   * @return  {!github_dedeme.It<T>}
   */
  drop (n) {
    const r = this.take(n);
    while (r.hasNext()) r.next();
    return this;
  }

  /**
   * Returns rest of [It] after call [takeWhile()]
   * @param {function (T):boolean} f
   * @return  {!github_dedeme.It<T>}
   */
  dropWhile (f) {
    return this.dropUntil(e => !f(e));
  }

  /**
   * Returns rest of It after call[ takeUntil()]
   * @param {function (T):boolean} f
   * @return  {!github_dedeme.It<T>}
   */
  dropUntil (f) {
    const self = this;
    let last = null;
    let nx = true;
    for (;;) {
      if (self._hasNext()) {
        last = self._next();
        if (f(last)) break;
      } else {
        nx = false;
        break;
      }
    }
    return new github_dedeme.It(
      () => nx,
      () => {
        const r = last;
        if (self._hasNext()) last = self._next();
        else nx = false;
        return r;
      }
    );
  }

  /** @param {function (T)} f */
  each (f) {
    while (this._hasNext()) f(this._next());
  }

  /** @param {function (T, number)} f */
  eachIx (f) {
    let c = -1;
    while (this._hasNext()) f(this._next(), ++c);
  }

  /**
   * Equals comparing with "!=="
   * @param {!github_dedeme.It<T>} i
   * @return {boolean}
   */
  eq (i) {
    while (this._hasNext() && i.hasNext())
      if (this._next() !== i.next()) return false;
    if (this._hasNext() || i.hasNext()) return false;
    return true;
  }

  /**
   * Equals comparing with [f]
   * @param {!github_dedeme.It<T>} i
   * @param {function(T, T):boolean} f
   * @return {boolean}
   */
  eqf (i, f) {
    while (this._hasNext() && i.hasNext())
      if (!f(this._next(), i.next())) return false;
    if (this._hasNext() || i.hasNext()) return false;
    return true;
  }

  /**
   * Filters [this], returning a subset of collection.
   * @param {function (T):boolean} f Function to select values
   * @return {!github_dedeme.It<T>}
   */
  filter (f) {
    const self = this;
    let last = null;
    let nx = true;
    const nnext = function () {
      for (;;) {
        if (self._hasNext()) {
          last = self._next();
          if (f(last)) break;
        } else {
          nx = false;
          break;
        }
      }
    };
    nnext();
    return new github_dedeme.It(
      () => nx,
      () => {
        const r = last;
        nnext();
        return r;
      }
    );
  }

  /**
   * Returns those elements that gives true with [f].
   * @param {function (T):boolean} f
   * @return {!Array<T>}
   */
  find (f) {
    let a = [];
    this.each(e => {
      if (f(e)) a.push(e);
    });
    return a;
  }

  /**
   * Returns the first element that gives true with [f] or undefined
   * @param {function (T):boolean} f
   * @return {T | null | undefined}
   */
  findFirst (f) {
    while (this._hasNext()) {
      let e = this._next();
      if (f(e)) return e;
    }
    return undefined;
  }

  /**
   * Returns the last element that gives true with [f] or undefined
   * @param {function (T):boolean} f
   * @return {T | null | undefined}
   */
  findLast (f) {
    let r = undefined;
    while (this._hasNext()) {
      let e = this._next();
      if (f(e)) r = e;
    }
    return r;
  }

  /**
   * Returns the index of first element that is equals (===) to [e]
   * @param {T} e
   * @return {number}
   */
  index (e) {
    let i = 0;
    while (this._hasNext()) {
      if (this._next() === e) return i;
      ++i;
    }
    return -1;
  }

  /**
   * Returns the index of first element that gives true with [f]
   * or -1 if [this] has nothing
   * @param {function (T):boolean} f
   * @return {number}
   */
  indexf (f) {
    let i = 0;
    while (this._hasNext()) {
      if (f(this._next())) return i;
      ++i;
    }
    return -1;
  }

  /**
   * Returns the index of first element that is equals (===) to [e]
   * @param {T} e
   * @return {number}
   */
  lastIndex (e) {
    let r = -1;
    let i = 0;
    while (this._hasNext()) {
      if (this._next() === e) r = i;
      ++i;
    }
    return r;
  }

  /**
   * Returns the index of last element that gives true with [f]
   * or -1 if [this] has nothing
   * @param {function (T):boolean} f
   * @return {number}
   */
  lastIndexf (f) {
    let r = -1;
    let i = 0;
    this.each(e => {
      if (f(e)) r = i;
      ++i;
    });
    return r;
  }

  /**
   * Returns the iterator whish results of apply 'f' to every element
   * of 'this'
   * @template U
   * @param {function (T):U} f
   * @return {!github_dedeme.It<U>}
   */
  map (f) {
    const self = this;
    return new github_dedeme.It(() => self._hasNext(), () => f(self._next()));
  }

  /**
   * Returns the result of applying [f]([f]([seed], e1), e2)... over
   * every element of [this].
   * @template R
   * @param {R} seed
   * @param {function (R, T):R} f
   * @return {R}
   */
  reduce (seed, f) {
    while (this._hasNext()) seed = f(seed, this._next());
    return seed;
  }

  /**
   * Returns [this] in reverse order.
   * NOTE: This function creates an array!.
   * @return {!github_dedeme.It<T>}
   */
  reverse () {
    return github_dedeme.It/**/.from(this.to().reverse());
  }

  /**
   * Returns an iterator over elements of [this] mixed.
   * NOTE: This function creates an array!.
   * @return {!github_dedeme.It<T>}
   */
  shuffle () {
    let ni;
    const a = this.to();
    let i = a.length;
    if (!i) return github_dedeme.It/**/.empty();
    while (--i) {
      ni = Math.floor(Math.random() * (i + 1));
      if (ni !== i) {
        let tmp = a[i];
        a[i] = a[ni];
        a[ni] = tmp;
      }
    }
    return github_dedeme.It/**/.from(a);
  }

  /**
   * Returns the number of elements of [this].
   * @return {number}
   */
  size () {
    let r = 0;
    this.each(() => {
      ++r;
    });
    return r;
  }

  /**
   * Sorts [this] in "natural order" (In strings lowercase goes after
   * uppercase).
   * NOTE: This function creates an array!.
   * @return {!github_dedeme.It<T>}
   */
  sort () {
    return github_dedeme.It/**/.from(this.to().sort());
  }

  /**
   * Sort [this] conforming [compare] function.
   * NOTE: This function creates an array!.
   * @param {function (T, T):number} f
   * @return {!github_dedeme.It<T>}
   */
  sortf (f) {
    return github_dedeme.It/**/.from(this.to().sort(f));
  }

  /**
   * It work similar as each(), but can be used with callbacks.<br>
   * An example of its use is:
   *   sources.readArray().sync(
   *     function (s, f) {
   *       server.fileInfo(s[2], function (info) {
   *         if (info.type != "D") {
   *           s[3] = false;
   *           s[4] = false;
   *         }
   *         f(); // It is mandatory call 'f' at the end of callback
   *       });
   *     }, function () {
   *       program goes on...
   *     }
   *   );
   * @param {function(T, function():void):void} f Function which execute
   *  a callback function. This function recive two arguments:
   *    {T} Iterator element
   *    {function():void} Funtion to be called at the end of the callback.
   * @param {function():void} goOn Program continuation.
   * @return {void}
   */
  sync (f, goOn) {
    const self = this;
    if (self._hasNext()) {
      f(self._next(), function () {
        self.sync(f, goOn); 
      });
    } else {
      goOn();
    }
  }

  /**
   * Returns n first elements.
   * If [this] has less elements than 'n' returns all of theirs.
   * [this] can be used for the rest of data after consume 'take'.
   * @param {number} n
   * @return {!github_dedeme.It<T>}
   */
  take (n) {
    const self = this;
    return new github_dedeme.It(
      () => self._hasNext() && n > 0,
      () => {
        --n;
        return self._next();
      }
    );
  }

  /**
   * Returns the first elements of [it] whish give true with [f]
   * @param {function (T):boolean} f
   * @return  {!github_dedeme.It<T>}
   */
  takeWhile (f) {
    const self = this;
    let last = null;
    let hnx = false;
    if (self._hasNext()) {
      last = self._next();
      hnx = true;
    }
    return new github_dedeme.It(
      () => hnx && f(last),
      () => {
        const r = last;
        last = null;
        hnx = false;
        if (self._hasNext()) {
          last = self._next();
          hnx = true;
        }
        return r;
      }
    );
  }

  /**
   * Returns the n first elements of [it] whish give false with [f]
   * @param {function (T):boolean} f
   * @return  {!github_dedeme.It<T>}
   */
  takeUntil (f) {
    return this.takeWhile(e => !f(e));
  }

  /** @return {!Array<T>} */
  to () {
    let a = [];
    this.each(o => {
      a.push(o);
    });
    return a;
  }

  /** @return {!github_dedeme.List<T>} */
  toList () {
    let l = new github_dedeme.List();
    this.each(o => {
      l = l.cons(o);
    });
    return l.reverse();
  }

  /** @return {string} */
  toString () {
    return "[" + github_dedeme.It/**/.join(this, ", ") + "]";
  }

  /**
   * Empty iterator
   * @return {!github_dedeme.It<?>}
   */
  static empty () {
    return new github_dedeme.It(() => false, () => null);
  }


  /**
   * Create an It from an array
   * @template T
   * @param {!Array<T>} a
   * @return {!github_dedeme.It<T>}
   */
  static from (a) {
    const len = a.length;
    let i = 0;
    return new github_dedeme.It(() => i < len, () => a[i++]);
  }

  /**
   * Create an It from a List
   * @template T
   * @param {!github_dedeme.List<T>} l
   * @return {!github_dedeme.It<T>}
   */
  static fromList (l) {
    return new github_dedeme.It(
      () => l.tail() !== null,
      () => {
        let r = l.head();
        l = l.tail() || l;
        return r;
      }
    );
  }

  /**
   * Create an It from an array
   * @param {!Uint8Array} a
   * @return {!github_dedeme.It<number>}
   */
  static fromBytes (a) {
    const len = a.length;
    let i = 0;
    return new github_dedeme.It(() => i < len, () => a[i++]);
  }

  /**
   * @template T
   * @param {!github_dedeme.It<T>} i
   * @param {string=} sep
   * @return {string}
   */
  static join (i, sep) {
    if (!i.hasNext()) return "";
    sep = sep || "";
    let r = i.next();
    i.each(o => {
      r += sep + o;
    });
    return r;
  }

  /**
   * Returns an iterator over an Object whose keys are strings.
   * @param {!Object<string, ?>} o
   * @return {!github_dedeme.It<string>}
   */
  static keys (o) {
    return github_dedeme.It/**/.from(Object.keys(o));
  }

  /**
   * Iterates over a range. If end is null the range is [0 - startEnd),
   * otherwise the range is [startEnd - end)
   * @param {number} startEnd
   * @param {number=} end
   * @return {!github_dedeme.It<number>}
   */
  static range (startEnd, end) {
    if (!end) {
      end = startEnd;
      startEnd = 0;
    }

    return new github_dedeme.It(() => startEnd < end, () => startEnd++);
  }

  /**
   * Sorts an It of strings in locale and returns it..
   * NOTE: This function creates an array!.
   * @param {!github_dedeme.It<string>} i
   * @return {!github_dedeme.It<string>}
   */
  static sortLocale (i) {
    return i.sortf((e1, e2) => e1.localeCompare(e2));
  }

  /**
   * Returns two iterators from one It<Tp>.
   * NOTE: This function creates two arrays!.
   * @template A
   * @template B
   * @param {!github_dedeme.It<!github_dedeme.Tp<A, B>>} i
   * @return {!github_dedeme.Tp<!github_dedeme.It<A>,
   *                            !github_dedeme.It<B>>}
   */
  static unzip (i) {
    let a1 = [];
    let a2 = [];
    i.each(tp => {
      a1.push(tp.e1());
      a2.push(tp.e2());
    });
    return new github_dedeme.Tp(
      github_dedeme.It/**/.from(a1),
      github_dedeme.It/**/.from(a2)
    );
  }

  /**
   * Returns three iterators from one It<Tp3>
   * NOTE: This function creates three arrays!.
   * @template A
   * @template B
   * @template C
   * @param {!github_dedeme.It<!github_dedeme.Tp3<A, B, C>>} i
   * @return {!github_dedeme.Tp3<!github_dedeme.It<A>,
   *                             !github_dedeme.It<B>,
   *                             !github_dedeme.It<C>>}
   */
  static unzip3 (i) {
    let a1 = [];
    let a2 = [];
    let a3 = [];
    i.each(tp => {
      a1.push(tp.e1());
      a2.push(tp.e2());
      a3.push(tp.e3());
    });
    return new github_dedeme.Tp3(
      github_dedeme.It/**/.from(a1),
      github_dedeme.It/**/.from(a2),
      github_dedeme.It/**/.from(a3)
    );
  }

  /**
   * Returns a iterator with elements of [it1] and [it2].
   * The number of elements of resultant iterator is the least of both ones.
   * @template A
   * @template B
   * @param {!github_dedeme.It<A>} i1
   * @param {!github_dedeme.It<B>} i2
   * @return {!github_dedeme.It<!github_dedeme.Tp<A, B>>}
   */
  static zip (i1, i2) {
    return new github_dedeme.It(
      () => i1.hasNext() && i2.hasNext(),
      () => new github_dedeme.Tp(i1.next(), i2.next())
    );
  }

  /**
   * Returns a iterator with elements of [it1], [it2] and [it3].
   * The number of elements of resultant iterator is the least of three ones.
   * @template A
   * @template B
   * @template C
   * @param {!github_dedeme.It<A>} i1
   * @param {!github_dedeme.It<B>} i2
   * @param {!github_dedeme.It<C>} i3
   * @return {!github_dedeme.It<!github_dedeme.Tp3<A, B, C>>}
   */
  static zip3 (i1, i2, i3) {
    return new github_dedeme.It(
      () => i1.hasNext() && i2.hasNext() && i3.hasNext(),
      () => new github_dedeme.Tp3(i1.next(), i2.next(), i3.next())
    );
  }

};
