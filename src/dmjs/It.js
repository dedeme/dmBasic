// Copyright 02-Sep-2018 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint consistent-this: "off" */

/** Lazy iterator. */

import Rbox from "./Rbox.js";
import Tp from "./Tp.js";
import Tp3 from "./Tp3.js";

/**
 * Lazy iterator
 * @template T
 * @implements {Iterable<T>}
 */
export default class It {
  /**
   * Makes a new It
   * @param {function ():boolean} has Returns true if 'this' has more elements.
   * @param {function ():T} value Returns the current value. If 'has' returns
   *  'false' throws an error.
   * @param {function ():!It<T>} next Returns the next step of 'this'. If
   *  'has' returns 'false' throws an error.
   */
  constructor (has, value, next) {
    this._has = has;
    this._value = value;
    this._next = next;
    this[Symbol.iterator] = () => {
      let it = this;
      return {
        "next": () => {
          if (it.has) {
            const value = it.value;
            it = it.next;
            return {"done": false, "value": value};
          }
          return {"done": true};
        }
      };
    };
  }

  /**
   * @return {boolean} 'true' if there are more elements.
   */
  get has () {
    return this._has();
  }

  /**
   * @template T
   * @return {T} The current element
   */
  get value () {
    return this._value();
  }

  /**
   * @template T
   * @return {!It<T>} The next It.
   */
  get next () {
    return this._next();
  }

  /**
   * Equals comparing with [f]
   * @param {!It<T>} i onother It
   * @param {function(T, T):boolean =} f If is undefined its value is '==='
   * @return {boolean} If 'this' is equals to 'i'
   */
  eq (i, f) {
    let it = this;
    let i2 = i;
    if (f === undefined) {
      while (it.has && i2.has) {
        if (it.value !== i2.value) return false;
        it = it.next;
        i2 = i2.next;
      }
    } else {
      while (it.has && i2.has) {
        if (!f(it.value, i2.value)) return false;
        it = it.next;
        i2 = i2.next;
      }
    }
    if (it.has || i2.has) return false;
    return true;
  }

  /**
   * Adds one element to the beginning
   * @param {T} e element to add
   * @return {!It<T>} a new It
   */
  unshift (e) {
    return new It(
      () => true,
      () => e,
      () => this
    );
  }

  /**
   * Adds one element to the end
   * @param {T} e element to add
   * @return {!It<T>} a new It
   */
  push (e) {
    const it = this;
    return new It(
      () => true,
      () => it.has ? it.value : e,
      () => it.has ? it.next.push(e) : It.empty()
    );
  }

  /**
   * Adds one It<T> to the end
   * @param {!It<T>} i It to add
   * @return {!It<T>} a new It
   */
  concat (i) {
    const it = this;
    const i2 = i;
    return new It(
      () => it.has || i2.has,
      () => it.has ? it.value : i2.value,
      () => it.has ? it.next.concat(i2) : i2.next
    );
  }

  /**
   * Returns n first elements.
   * If [this] has less elements than 'n' returns all of theirs.
   * [this] can be used for the rest of data after consume 'take'.
   * @param {number} n Number of elements
   * @return {!It<T>} New It
   */
  take (n) {
    return new It(
      () => this.has && n > 0,
      () => this.value,
      () => this.next.take(n - 1)
    );
  }

  /**
   * Returns the first elements of [it] whish give true with [f]
   * @param {function (T):boolean} f Condition
   * @return {!It<T>} New It
   */
  takeWhile (f) {
    return new It(
      () => this.has && f(this.value),
      () => this.value,
      () => this.next.takeWhile(f)
    );
  }

  /**
   * Returns the n first elements of [it] whish give false with [f]
   * @param {function (T):boolean} f Condition
   * @return {!It<T>}  New It
   */
  takeUntil (f) {
    return this.takeWhile(e => !f(e));
  }

  /**
   * Returns rest of [this] after call [take ()]
   * @param {number} n Number of elements
   * @return {!It<T>}  New It
   */
  drop (n) {
    let i = this;
    while (n > 0 && i.has) {
      --n;
      i = i.next;
    }
    return i;
  }

  /**
   * Returns rest of [It] after call [takeWhile()]
   * @param {function (T):boolean} f Condition
   * @return {!It<T>}  New It
   */
  dropWhile (f) {
    let i = this;
    while (i.has && f(i.value)) {
      i = i.next;
    }
    return i;
  }

  /**
   * Returns rest of It after call[ takeUntil()]
   * @param {function (T):boolean} f Condition
   * @return {!It<T>}  New It
   */
  dropUntil (f) {
    return this.dropWhile(e => !f(e));
  }

  /**
   * Filters [this], returning a subset of collection.
   * @param {function (T):boolean} f Function to select values
   * @return {!It<T>}  New It
   */
  filter (f) {
    const it = this.dropUntil(f);
    return new It(
      () => it.has,
      () => it.value,
      () => it.next.filter(f)
    );
  }

  /**
   * Returns the iterator whish results of apply 'f' to every element
   * of 'this'
   * @template U
   * @param {function (T):U} f Application function
   * @return {!It<U>}  New It
   */
  map (f) {
    return new It(
      () => this.has,
      () => f(this.value),
      () => this.next.map(f)
    );
  }

  /**
   * Tests whether all elements in the array pass the test implemented by 'f'.
   * @param {function (T):boolean} f Function to test values
   * @return {boolean} Result
   */
  every (f) {
    for (const e of this) if (!f(e)) return false;
    return true;
  }

  /**
   * Tests whether at least one element in the array passes the test
   * implemented by 'f'.
   * @param {function (T):boolean} f Function to test values
   * @return {boolean} Result
   */
  some (f) {
    for (const e of this) if (f(e)) return true;
    return false;
  }

  /**
   * Tests whether at least one element in the array is === to e
   * @param {T} e Element to search
   * @return {boolean} Result
   */
  contains (e) {
    return this.some(el => el === e);
  }

  /**
   * Returns the value of the first element in It that satisfies 'f'.
   * Otherwise 'undefined' is returned.
   * @param {function (T):boolean} f Function to test values
   * @return {T|undefined} Result
   */
  find (f) {
    for (const e of this) if (f(e)) return e;
    return undefined;
  }

  /**
   * Returns the value of the last element in It that satisfies 'f'.
   * Otherwise 'undefined' is returned.
   * @param {function (T):boolean} f Function to test values
   * @return {T|undefined} Result
   */
  findLast (f) {
    let r = undefined;
    for (const e of this) if (f(e)) r = e;
    return r;
  }

  /**
   * @return {number} number of elements
   */
  count () {
    let c = 0;
    // eslint-disable-next-line
    for (const e of this) ++c;
    return c;
  }

  /**
   * Returns the first index at which an element gives 'true' with 'f' in It
   * or -1 if it does no happen.
   * @param {function (T):boolean } f Function to test values
   * @return {number} The index or -1
   */
  indexf (f) {
    let c = 0;
    for (const e of this) {
      if (f(e)) return c;
      ++c;
    }
    return -1;
  }

  /**
   * Returns the first index at which a given element can be found in It
   * or -1 if it is not present
   * @param {T} e elemento to search
   * @return {number} The index or -1
   */
  index (e) {
    return this.indexf(el => e === el);
  }

  /**
   * Returns the last index at which an element gives 'true' with 'f' in It
   * or -1 if it does no happen.
   * @param {function (T):boolean } f Function to test values
   * @return {number} The index or -1
   */
  lastIndexf (f) {
    let c = 0;
    let r = -1;
    for (const e of this) {
      if (f(e)) r = c;
      ++c;
    }
    return r;
  }

  /**
   * Returns the last index at which a given element can be found in It
   * or -1 if it is not present
   * @param {T} e elemento to search
   * @return {number} The index or -1
   */
  lastIndex (e) {
    return this.lastIndexf(el => e === el);
  }

  /**
   * @param {function (T, number=)} f 'f(element, index)'
   * @return {void}
   */
  each (f) {
    let i = 0;
    for (const e of this) f(e, i++);
  }

  /**
   * Executes synchronically 'frecursive' for each value of 'this' and then
   * executes 'fend'.
   * @param {function(T):!Promise<?>} frecursive
   * @param {function():void} fend
   */
  async eachSync (frecursive, fend) {
    if (this.has) {
      await frecursive(this.value);
      this.next.eachSync(frecursive, fend);
    } else {
      fend();
    }
  }

  /**
   * Returns the result of applying [f]([f]([seed], e1), e2)... over
   * every element of [this].
   * @template R
   * @param {R} seed The initial value
   * @param {function (R, T):R} f Function to apply
   * @return {R} The final value
   */
  reduce (seed, f) {
    for (const e of this) seed = f(seed, e);
    return seed;
  }

  /**
   * Returns [this] in reverse order.
   * NOTE: This function creates an array and use 'Array.reverse'.
   * @return {!It<T>} A new It.
   */
  reverse () {
    return It.from([...this].reverse());
  }

  /**
   * Sort [this] conforming [compare] function.
   * NOTE: This function creates an array and uses 'Array.sort'.
   * @param {function (T, T):number =} f If its value is not given, the
   *  'natural order' is used.
   * @return {!It<T>} A new It.
   */
  sort (f) {
    return It.from([...this].sort(f));
  }

  /**
   * Returns an iterator over elements of [this] randomly mixed.
   * NOTE: This function creates an array and use Rbox.shuffle.
   * @return {!It<T>} A new It
   */
  shuffle () {
    const a = [...this];
    Rbox.shuffle(a);
    return It.from(a);
  }

  /** @return {string} A representation of 'this' */
  toString () {
    return "[" + It.join(this, ", ") + "]";
  }

  /**
   * @return {!It<?>} Empty iterator
   */
  static empty () {
    return new It(
      () => false,
      () => null,
      () => It.empty()
    );
  }

  /**
   * Create an It from an array
   * @template T
   * @param {!Array<T>|!Uint8Array} a An array
   * @return {!It<T>} A new It
   */
  static from (a) {
    const from2 = (a, i) =>
      new It(
        () => i < a.length,
        () => i >= a.length ? Error("Array is empty") : a[i],
        () => i >= a.length ? Error("Array is empty") : from2(a, i + 1)
      );
    return from2(a, 0);
  }

  /**
   * Iterates over a range [start-end] (end exclusive).
   * @param {number=} startEnd If is null the range is [0 - infinitum]
   * @param {number=} end If is null the range is [0 - startEnd]
   * @return {!It<number>} A new It.
   */
  static range (startEnd, end) {
    if (startEnd === undefined) {
      const range2 = (i) =>
        new It(
          () => true,
          () => i,
          () => range2(i + 1)
        );
      return range2(0);
    }
    if (end === undefined) {
      return It.range(0, startEnd);
    }
    const range2 = (i) =>
      new It(
        () => i < end,
        () => i >= end ? Error("Range exhausted") : i,
        () => i >= end ? Error("Range exhausted") : range2(i + 1)
      );
    return range2(startEnd);
  }

  /**
   * Sorts an It of strings in locale and returns it..
   * NOTE: This function creates an array and uses 'Array.sort'.
   * @param {!It<string>} i It to sort
   * @return {!It<string>} A new It
   */
  static sortLocale (i) {
    return i.sort((e1, e2) => e1.localeCompare(e2));
  }

  /**
   * @template T
   * @param {!It<string>} i Strings
   * @param {string=} sep Separator
   * @return {string} Result
   */
  static join (i, sep) {
    if (!i.has) return "";
    sep = sep || "";
    let r = i.value;
    for (const o of i.next) {
      r += sep + o;
    }
    return r;
  }

  /**
   * Returns two iterators from one It<Tp>.
   * @template A
   * @template B
   * @param {!It<!Tp<A, B>>} i Tp iterator
   * @return {!Tp<!It<A>,!It<B>>} Tp with 2 new It's.
   */
  static unzip (i) {
    const i1 = i.map(tp => tp.e1);
    const i2 = i.map(tp => tp.e2);
    return new Tp(i1, i2);
  }

  /**
   * Returns three iterators from one It<Tp3>
   * NOTE: This function creates three arrays!.
   * @template A
   * @template B
   * @template C
   * @param {!It<!Tp3<A, B, C>>} i Tp3 iterator
   * @return {!Tp3<!It<A>,!It<B>,!It<C>>} Tp3 with 3 new It's
   */
  static unzip3 (i) {
    const i1 = i.map(tp => tp.e1);
    const i2 = i.map(tp => tp.e2);
    const i3 = i.map(tp => tp.e3);
    return new Tp3(i1, i2, i3);
  }

  /**
   * Returns a iterator with elements of [it1] and [it2].
   * The number of elements of resultant iterator is the least of both ones.
   * @template A
   * @template B
   * @param {!It<A>} i1 Iterator to zip
   * @param {!It<B>} i2 Iterator to zip
   * @return {!It<!Tp<A, B>>} Result
   */
  static zip (i1, i2) {
    return new It(
      () => i1.has && i2.has,
      () => new Tp(i1.value, i2.value),
      () => It.zip(i1.next, i2.next)
    );
  }

  /**
   * Returns a iterator with elements of [it1], [it2] and [it3].
   * The number of elements of resultant iterator is the least of three ones.
   * @template A
   * @template B
   * @template C
   * @param {!It<A>} i1 Iterator to zip
   * @param {!It<B>} i2 Iterator to zip
   * @param {!It<C>} i3 Iterator to zip
   * @return {!It<!Tp3<A, B, C>>} Result
   */
  static zip3 (i1, i2, i3) {
    return new It(
      () => i1.has && i2.has && i3.has,
      () => new Tp3(i1.value, i2.value, i3.value),
      () => It.zip3(i1.next, i2.next, i3.next)
    );
  }

}
