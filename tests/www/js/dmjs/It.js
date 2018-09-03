import Rbox from "./Rbox.js";
import Tp from "./Tp.js";
import Tp3 from "./Tp3.js";
export default class It {
  constructor (has, value, next) {
    this._has = has;
    this._value = value;
    this._next = next;
    this[Symbol.iterator] = () => this;
  }
  get has () {
    return this._has();
  }
  get value () {
    return this._value();
  }
  get next () {
    return this._next();
  }
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
  unshift (e) {
    return new It(
      () => true,
      () => e,
      () => this
    );
  }
  push (e) {
    const it = this;
    return new It(
      () => true,
      () => it.has ? it.value : e,
      () => it.has ? it.next.push(e) : It.empty()
    );
  }
  concat (i) {
    const it = this;
    const i2 = i;
    return new It(
      () => it.has || i2.has,
      () => it.has ? it.value : i2.value,
      () => it.has ? it.next.concat(i2) : i2.next
    );
  }
  take (n) {
    return new It(
      () => this.has && n > 0,
      () => this.value,
      () => this.next.take(n - 1)
    );
  }
  takeWhile (f) {
    return new It(
      () => this.has && f(this.value),
      () => this.value,
      () => this.next.takeWhile(f)
    );
  }
  takeUntil (f) {
    return this.takeWhile(e => !f(e));
  }
  drop (n) {
    let i = this;
    while (n > 0 && i.has) {
      --n;
      i = i.next;
    }
    return i;
  }
  dropWhile (f) {
    let i = this;
    while (i.has && f(i.value)) {
      i = i.next;
    }
    return i;
  }
  dropUntil (f) {
    return this.dropWhile(e => !f(e));
  }
  filter (f) {
    const it = this.dropUntil(f);
    return new It(
      () => it.has,
      () => it.value,
      () => it.next.filter(f)
    );
  }
  map (f) {
    return new It(
      () => this.has,
      () => f(this.value),
      () => this.next.map(f)
    );
  }
  every (f) {
    for (const e of this.to()) if (!f(e)) return false;
    return true;
  }
  some (f) {
    for (const e of this.to()) if (f(e)) return true;
    return false;
  }
  contains (e) {
    return this.some(el => el === e);
  }
  find (f) {
    for (const e of this.to()) if (f(e)) return e;
    return undefined;
  }
  findLast (f) {
    let r = undefined;
    for (const e of this.to()) if (f(e)) r = e;
    return r;
  }
  count () {
    let c = 0;
    for (const e of this.to()) ++c;
    return c;
  }
  indexf (f) {
    let c = 0;
    for (const e of this.to()) {
      if (f(e)) return c;
      ++c;
    }
    return -1;
  }
  index (e) {
    return this.indexf(el => e === el);
  }
  lastIndexf (f) {
    let c = 0;
    let r = -1;
    for (const e of this.to()) {
      if (f(e)) r = c;
      ++c;
    }
    return r;
  }
  lastIndex (e) {
    return this.lastIndexf(el => e === el);
  }
  each (f) {
    let i = 0;
    for (const e of this.to()) f(e, i++);
  }
  reduce (seed, f) {
    for (const e of this.to()) seed = f(seed, e);
    return seed;
  }
  reverse () {
    return It.from([...this.to()].reverse());
  }
  sort (f) {
    return It.from([...this.to()].sort(f));
  }
  shuffle () {
    const a = [...this.to()];
    Rbox.shuffle(a);
    return It.from(a);
  }
  to () {
    let it = this;
    const itJs = {};
    itJs[Symbol.iterator] = () => {
      return {
        "next": () => {
          if (it.has) {
            const value = it.value;
            it = it.next;
            return {"done": false, value};
          }
          return {"done": true};
        }
      };
    };
    return itJs;
  }
  toString () {
    return "[" + It.join(this, ", ") + "]";
  }
  static empty () {
    return new It(
      () => false,
      () => null,
      () => null
    );
  }
  static from (a) {
    const from2 = (a, i) =>
      new It(
        () => i < a.length,
        () => i >= a.length ? Error("Array is empty") : a[i],
        () => i >= a.length ? Error("Array is empty") : from2(a, i + 1)
      );
    return from2(a, 0);
  }
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
  static sortLocale (i) {
    return i.sort((e1, e2) => e1.localeCompare(e2));
  }
  static join (i, sep) {
    if (!i.has) return "";
    sep = sep || "";
    let r = i.value;
    for (const o of i.next.to()) {
      r += sep + o;
    }
    return r;
  }
  static unzip (i) {
    const i1 = i.map(tp => tp.e1);
    const i2 = i.map(tp => tp.e2);
    return new Tp(i1, i2);
  }
  static unzip3 (i) {
    const i1 = i.map(tp => tp.e1);
    const i2 = i.map(tp => tp.e2);
    const i3 = i.map(tp => tp.e3);
    return new Tp3(i1, i2, i3);
  }
  static zip (i1, i2) {
    return new It(
      () => i1.has && i2.has,
      () => new Tp(i1.value, i2.value),
      () => It.zip(i1.next, i2.next)
    );
  }
  static zip3 (i1, i2, i3) {
    return new It(
      () => i1.has && i2.has && i3.has,
      () => new Tp3(i1.value, i2.value, i3.value),
      () => It.zip3(i1.next, i2.next, i3.next)
    );
  }
}
