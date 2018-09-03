let months = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
let week = ["domingo", "lunes", "martes", "miércoles", "jueves",
  "viernes", "sábado"];
let week1 = "DLMXJVS";
export default class DateDm {
  constructor (day, month, year) {
    this._date = new Date(year, month - 1, day, 12, 0, 0);
  }
  get date () {
    return this._date;
  }
  get day () {
    return this._date.getDate();
  }
  get month () {
    return this._date.getMonth() + 1;
  }
  get year () {
    return this._date.getFullYear();
  }
  eq (d) {
    return this.day() === d.day() &&
         this.month() === d.month() &&
         this.year() === d.year();
  }
  compare (d) {
    return this.year() === d.year()
      ? this.month() === d.month()
        ? this.day() - d.day()
        : this.month() - d.month()
      : this.year() - d.year();
  }
  add (days) {
    return DateDm.fromTime(this.toTime() + days * 86400000);
  }
  df (d) {
    return Math.round((this.toTime() - d.toTime()) / 86400000);
  }
  format (template) {
    const r = (code, value) => {
      template = template.split(code).join(value);
    };
    const d = String(this.day());
    const dw = this.date().getDay();
    const w = DateDm.week()[dw];
    const mn = this.date().getMonth();
    const m = String(mn + 1);
    const ms = DateDm.months()[mn];
    const y = "0000" + this.year();
    r("%d", d);
    r("%D", d.length === 1 ? "0" + d : d);
    r("%m", m);
    r("%M", m.length === 1 ? "0" + m : m);
    r("%y", y.substring(y.length - 2));
    r("%Y", y.substring(y.length - 4));
    r("%b", ms.substring(0, 3));
    r("%B", ms);
    r("%1", DateDm.week1().charAt(dw));
    r("%a", w.substring(0, 3));
    r("%A", w);
    r("%%", "%");
    return template;
  }
  toBase () {
    const y = "0000" + this.year();
    const m = "00" + this.month();
    const d = "00" + this.day();
    return y.substring(y.length - 4) +
    m.substring(m.length - 2) +
    d.substring(d.length - 2);
  }
  toTime () {
    return this.date().getTime();
  }
  toString () {
    const y = "0000" + this.year();
    const m = "00" + this.month();
    const d = "00" + this.day();
    return d.substring(d.length - 2) + "/" +
    m.substring(m.length - 2) + "/" +
    y.substring(y.length - 4);
  }
  serialize () {
    return [this.day(), this.month(), this.year()];
  }
  static months () {
    return months;
  }
  static setMonths (value) {
    months = value;
  }
  static week () {
    return week;
  }
  static setWeek (value) {
    week = value;
  }
  static week1 () {
    return week1;
  }
  static setWeek1 (value) {
    week1 = value;
  }
  static fromDate (d) {
    return new DateDm(
      d.getDate(), d.getMonth() + 1, d.getFullYear());
  }
  static fromStr (s) {
    return new DateDm(
      Number(s.substring(6)), Number(s.substring(4, 6)), Number(s.substring(0, 4)));
  }
  static fromEu (s) {
    let ps = s.split("/");
    if (ps.length === 1) {
      ps = s.split("-");
    }
    const y = Number(ps[2]);
    return new DateDm(
      Number(ps[0]), Number(ps[1]), ps[2].length === 2 ? 2000 + y : y);
  }
  static fromEn (s) {
    let ps = s.split("/");
    if (ps.length === 1) {
      ps = s.split("-");
    }
    const y = Number(ps[2]);
    return new DateDm(
      Number(ps[1]), Number(ps[0]), ps[2].length === 2 ? 2000 + y : y);
  }
  static fromTime (time) {
    return DateDm.fromDate(new Date(time));
  }
  static now () {
    return DateDm.fromTime(Date.now());
  }
  static restore (serial) {
    return new DateDm(serial[0], serial[1], serial[2]);
  }
  static isLeap (y) {
    return ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
  }
}
