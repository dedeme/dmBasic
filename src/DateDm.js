// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Date management */
goog.provide("github_dedeme.DateDm");

{
  let months = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  let week = ["domingo", "lunes", "martes", "miércoles", "jueves",
    "viernes", "sábado"];

  let week1 = "DLMXJVS";

  github_dedeme.DateDm/**/ = class {
  /**
   * @param {number} day
   * @param {number} month Jan is 1, Dec is 12.
   * @param {number} year
   */
    constructor (day, month, year) {
    /**
     * @private
     * @type {!Date}
     */
      this._date = new Date(year, month - 1, day, 12, 0, 0);
    }

    /** @return {!Date} */
    date () {
      return this._date;
    }

    /**
   * In range 1-31
   * @return {number}
   */
    day () {
      return this._date.getDate();
    }

    /**
   *  In range 1-12
   * @return {number}
   */
    month () {
      return this._date.getMonth() + 1;
    }

    /** @return {number} */
    year () {
      return this._date.getFullYear();
    }

    /**
   * @param {!github_dedeme.DateDm} d
   * @return {boolean}
   */
    eq (d) {
      return this.day() === d.day() &&
           this.month() === d.month() &&
           this.year() === d.year();
    }

    /**
   * @param {!github_dedeme.DateDm} d
   * @return {number}
   */
    compare (d) {
      return this.year() === d.year()
        ? this.month() === d.month()
          ? this.day() - d.day()
          : this.month() - d.month()
        : this.year() - d.year();
    }

    /**
   * Returns a new DataDm equals to [this] + [days]
   * @param {number} days
   * @return {!github_dedeme.DateDm}
   */
    add (days) {
      return github_dedeme.DateDm/**/.fromTime(this.toTime() + days * 86400000);
    }

    /**
   * Returns [this] - [d] in days.
   * @param {!github_dedeme.DateDm} d
   * @return {number}
   */
    df (d) {
      return Math.round((this.toTime() - d.toTime()) / 86400000);
    }

    /**
   * Returns a string that represents to [this]. <p>
   * [template] is a kind <tt>printf</tt> with next sustitution
   * variables:
   *   %d  Day in number 06 -> 6
   *   %D  Day with tow digits 06 -> 06
   *   %m  Month in number 03 -> 3
   *   %M  Month with two digits 03 -> 03
   *   %y  Year with two digits 2010 -> 10
   *   %Y  Year with four digits 2010 -> 2010
   *   %b  Month with three characters.
   *   %B  Month with all characters.
   *   %1  Week day with one character: L M X J V S D
   *   %a  Week day with tree characters.
   *   %A  Week day with all characters.
   *   %%  The sign %
   * @param {string} template
   * @return {string}
   */
    format (template) {
      const r = (code, value) => {
        template = template.split(code).join(value);
      };

      const d = String(this.day());
      const dw = this.date().getDay();
      const w = github_dedeme.DateDm/**/.week()[dw];
      const mn = this.date().getMonth();
      const m = String(mn + 1);
      const ms = github_dedeme.DateDm/**/.months()[mn];
      const y = "0000" + this.year();

      r("%d", d);
      r("%D", d.length === 1 ? "0" + d : d);
      r("%m", m);
      r("%M", m.length === 1 ? "0" + m : m);
      r("%y", y.substring(y.length - 2));
      r("%Y", y.substring(y.length -4));
      r("%b", ms.substring(0, 3));
      r("%B", ms);
      r("%1", github_dedeme.DateDm/**/.week1().charAt(dw));
      r("%a", w.substring(0, 3));
      r("%A", w);
      r("%%", "%");

      return template;
    }

    /**
   * Returns [this] in format "yyyymmdd"
   * @return {string}
   */
    toBase () {
      let y = "0000" + this.year();
      let m = "00" + this.month();
      let d = "00" + this.day();
      return y.substring(y.length - 4) +
      m.substring(m.length - 2) +
      d.substring(d.length - 2);
    }

    /** @return {number} */
    toTime () {
      return this.date().getTime();
    }

    /**
   * Spanish format
   * @return {string}
   */
    toString () {
      let y = "0000" + this.year();
      let m = "00" + this.month();
      let d = "00" + this.day();
      return d.substring(d.length - 2) + "/" +
      m.substring(m.length - 2) + "/" +
      y.substring(y.length - 4);
    }

    /** @return {!Array<?>} */
    serialize () {
      return [this.day(), this.month(), this.year()];
    }

    /**
   * Inicializated as ["enero", "febrero", "marzo", "abril", "mayo", "junio",
   * "julio", "agosto", "septiembre", "octubre", "noviembre",  "diciembre"]
   * @return {!Array<string>}
   */
    static months () {
      return months;
    }

    /** @param {!Array<string>} value */
    static setMonths (value) {
      months = value;
    }

    /**
   * Inicializated as ["domingo", "lunes", "martes", "miércoles", "jueves",
   * "viernes", "sábado"]
   * @return {!Array<string>}
   */
    static week () {
      return week;
    }

    /** @param {!Array<string>} value */
    static setWeek (value) {
      week = value;
    }

    /** @return {string} */
    static week1 () {
      return week1;
    }

    /** @param {string} value */
    static setWeek1 (value) {
      week1 = value;
    }

    /**
   * @param {!Date} d
   * @return {!github_dedeme.DateDm}
   */
    static fromDate (d) {
      return new github_dedeme.DateDm(
        d.getDate(), d.getMonth() + 1, d.getFullYear());
    }

    /**
   * [s] is in format yyyymmdd (mm in range 01-12)
   * @param {string} s
   * @return {!github_dedeme.DateDm}
   */
    static fromStr (s) {
      return new github_dedeme.DateDm(
        Number(s.substring(6)), Number(s.substring(4, 6)), Number(s.substring(0, 4)));
    }

    /**
   * [s] is in format dd-mm-yyyy or dd-mm-yy or dd/mm/yyyy or dd/mm/yy
   * (mm in range 01-12)
   * @param {string} s
   * @return {!github_dedeme.DateDm}
   */
    static fromEu (s) {
      let ps = s.split("/");
      if (ps.length === 1) {
        ps = s.split("-");
      }
      const y = Number(ps[2]);
      return new github_dedeme.DateDm(
        Number(ps[0]), Number(ps[1]), ps[2].length === 2 ? 2000 + y : y);
    }

    /**
   * [s] is in format mm-dd-yyyy or mm-dd-yy or mm/dd/yyyy or mm/dd/yy
   * (mm in range 01-12)
   * @param {string} s
   * @return {!github_dedeme.DateDm}
   */
    static fromEn (s) {
      let ps = s.split("/");
      if (ps.length === 1) {
        ps = s.split("-");
      }
      const y = Number(ps[2]);
      return new github_dedeme.DateDm(
        Number(ps[1]), Number(ps[0]), ps[2].length === 2 ? 2000 + y : y);
    }

    /**
   * @param {number} time
   * @return {!github_dedeme.DateDm}
   */
    static fromTime (time) {
      return github_dedeme.DateDm/**/.fromDate(new Date(time));
    }

    /**
   * Returns the date-hour actual.
   * @return {!github_dedeme.DateDm}
   */
    static now () {
      return github_dedeme.DateDm/**/.fromTime(Date.now());
    }

    /**
   * @param {!Array<?>} serial
   * @return {!github_dedeme.DateDm}
   */
    static restore (serial) {
      return new github_dedeme.DateDm(serial[0], serial[1], serial[2]);
    }

    /**
   * [y] is the complete year (e.g. 2014)
   * @param {number} y
   * @return {boolean}
   */
    static isLeap (y) {
      return ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
    }

  };
}
