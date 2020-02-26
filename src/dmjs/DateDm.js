// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

let months = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

let week = ["domingo", "lunes", "martes", "miércoles", "jueves",
  "viernes", "sábado"];

let week1 = "DLMXJVS";

/**
    Date management.
**/
export default class DateDm {

  /**
      @param {number} day Day of month.
      @param {number} month Jan is 1, Dec is 12.
      @param {number} year With four digits.
  **/
  constructor (day, month, year) {
  /**
      @private
      @type {!Date}
  **/
    this._date = new Date(year, month - 1, day, 12, 0, 0);
  }

  /**
      @return {!Date} The Date representation of 'this'.
  **/
  get date () {
    return this._date;
  }

  /**
      In range 1-31,
      @return {number} Day of month.
  **/
  get day () {
    return this._date.getDate();
  }

  /**
       In range 1-12,
      @return {number} Month.
  **/
  get month () {
    return this._date.getMonth() + 1;
  }

  /**
      @return {number} Year.
  **/
  get year () {
    return this._date.getFullYear();
  }

  /**
      @return {number} Year.
  **/
  get minutes () {
    return this._date.getMinutes();
  }

  /**
      @return {number} Year.
  **/
  get seconds () {
    return this._date.getSeconds();
  }

  /**
      @return {number} Year.
  **/
  get hours () {
    return this._date.getHours();
  }

  /**
      @param {!DateDm} d Another DateDm.
      @return {boolean} "true" if 'd' is equals to 'this'.
  **/
  eq (d) {
    return this.day === d.day &&
         this.month === d.month &&
         this.year === d.year;
  }

  /**
      @param {!DateDm} d Anoter DateDm.
      @return {number} A number >, < or === 0 according to 'this' is >, < or
        === to 'd'.
  **/
  compare (d) {
    return this.year === d.year
      ? this.month === d.month
        ? this.day - d.day
        : this.month - d.month
      : this.year - d.year;
  }

  /**
      Returns a new DataDm equals to 'this' + 'days'.
      @param {number} days Days to add.
      @return {!DateDm} New DateDm.
  **/
  add (days) {
    return DateDm.fromTime(this.toTime() + days * 86400000);
  }

  /**
      Returns 'this' - 'd' in days.
      @param {!DateDm} d Another DateDm.
      @return {number} Difference.
  **/
  df (d) {
    return Math.round((this.toTime() - d.toTime()) / 86400000);
  }

  /**
      Returns a string that represents to 'this'.
      'template' is a kind 'printf' with next sustitution variables:
        %d  Day in number 06 -> 6.
        %D  Day with tow digits 06 -> 06.
        %m  Month in number 03 -> 3.
        %M  Month with two digits 03 -> 03.
        %y  Year with two digits 2010 -> 10.
        %Y  Year with four digits 2010 -> 2010.
        %b  Month with three characters.
        %B  Month with all characters.
        %1  Week day with one character: L M X J V S D.
        %a  Week day with tree characters.
        %A  Week day with all characters.
        %H  Hour with two digits.
        %N  Minutes with two digits.
        %S  Seconds with two digits.
        %%  The sign '%'.
      This method is slow. For more speed use 'toXXX' methods.
      @param {string} template Temple to fomat.
      @return {string} DateDm fomated.
  **/
  format (template) {
    const r = (code, value) => {
      template = template.split(code).join(value);
    };

    const d = String(this.day);
    const dw = this.date.getDay();
    const w = DateDm.week()[dw];
    const mn = this.date.getMonth();
    const m = String(mn + 1);
    const ms = DateDm.months()[mn];
    const y = "0000" + this.year;
    const h = String(this.date.getHours());
    const n = String(this.date.getMinutes());
    const s = String(this.date.getSeconds());

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
    r("%H", h.length === 1 ? "0" + h : h);
    r("%N", n.length === 1 ? "0" + n : n);
    r("%S", s.length === 1 ? "0" + s : s);
    r("%%", "%");

    return template;
  }

  /**
      @return {string} Returns 'this' in format "yyyymmdd".
  **/
  toBase () {
    const y = "0000" + this.year;
    const m = "00" + this.month;
    const d = "00" + this.day;
    return y.substring(y.length - 4) +
    m.substring(m.length - 2) +
    d.substring(d.length - 2);
  }

  /**
      @return {number} In milliseconds since Jan 1 of 1970.
  **/
  toTime () {
    return this.date.getTime();
  }

  /**
      @return {string} Spanish format.
  **/
  toString () {
    const y = "0000" + this.year;
    const m = "00" + this.month;
    const d = "00" + this.day;
    return d.substring(d.length - 2) + "/" +
    m.substring(m.length - 2) + "/" +
    y.substring(y.length - 4);
  }

  /**
      @return {!Array<?>} 'this' serialized.
  **/
  toJs () {
    return [this.day, this.month, this.year];
  }

  /**
      Inicializated as ["enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre",  "diciembre"].
      @return {!Array<string>} Spanish month names.
  **/
  static months () {
    return months;
  }

  /**
      @param {!Array<string>} value Changes the value of variable 'months'.
      @return {void}
  **/
  static setMonths (value) {
    months = value;
  }

  /**
      Inicializated as ["domingo", "lunes", "martes", "miércoles", "jueves",
      "viernes", "sábado"].
      @return {!Array<string>} Spanish week day names.
  **/
  static week () {
    return week;
  }

  /**
      @param {!Array<string>} value Changes the value variable 'week'.
      @return {void}
  **/
  static setWeek (value) {
    week = value;
  }

  /**
      @return {string} Returns "DLMXJVS".
  **/
  static week1 () {
    return week1;
  }

  /**
      @param {string} value Changes the value of variable 'week1'.
      @return {void}
  **/
  static setWeek1 (value) {
    week1 = value;
  }

  /**
      @param {!Date} d Another date.
      @return {!DateDm} Duplicate of 'd'
  **/
  static fromDate (d) {
    return new DateDm(d.getDate(), d.getMonth() + 1, d.getFullYear());
  }

  /**
      's' is in format yyyymmdd (mm in range 01-12).
      @param {string} s A string.
      @return {!DateDm} A new DateDm.
  **/
  static fromStr (s) {
    return new DateDm(
      Number(s.substring(6)),
      Number(s.substring(4, 6)),
      Number(s.substring(0, 4))
    );
  }

  /**
      's' is in format dd-mm-yyyy or dd-mm-yy or dd/mm/yyyy or dd/mm/yy
      (mm in range 01-12).
      @param {string} s A string.
      @return {!DateDm} A new DateDm.
  **/
  static fromIso (s) {
    let ps = s.split("/");
    if (ps.length === 1) ps = s.split("-");
    const y = Number(ps[2]);
    return new DateDm(
      Number(ps[0]),
      Number(ps[1]),
      ps[2].length === 2 ? 2000 + y : y
    );
  }

  /**
      's' is in format mm-dd-yyyy or mm-dd-yy or mm/dd/yyyy or mm/dd/yy
      (mm in range 01-12).
      @param {string} s A string.
      @return {!DateDm} A new DateDm.
  **/
  static fromEn (s) {
    let ps = s.split("/");
    if (ps.length === 1) ps = s.split("-");
    const y = Number(ps[2]);
    return new DateDm(
      Number(ps[1]),
      Number(ps[0]),
      ps[2].length === 2 ? 2000 + y : y
    );
  }

  /**
      @param {number} time Value in milleseconds since Jan 1 of 1970.
      @return {!DateDm} A new DateDm.
  **/
  static fromTime (time) {
    return DateDm.fromDate(new Date(time));
  }

  /**
      Returns the date-hour actual.
      @return {!DateDm} A new DateDm.
  **/
  static now () {
    return DateDm.fromTime(Date.now());
  }

  /**
      @param {!Array<?>} serial DateDm serialization.
      @return {!DateDm} A new DateDm.
  **/
  static fromJs (serial) {
    return new DateDm(serial[0], serial[1], serial[2]);
  }

  /**
      'y' is the complete year (e.g. 2014).
      @param {number} y Year to test.
      @return {boolean} "true" if 'y' is leap.
  **/
  static isLeap (y) {
    return ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
  }

}
