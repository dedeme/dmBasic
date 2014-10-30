/*
 * Copyright 11-ago-2013 ºDeme
 *
 * This file is part of 'dmBasic'.
 *
 * 'dmBasic' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * 'dmBasic' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'dmBasic'.  If not, see <http://www.gnu.org/licenses/>.
 */

/*globals goog, dmjs */

/** Class for handling spanish dates */
goog.provide("dmjs.Date");

/**
 * <p>Create a date representation. DateDm is a immutalbe object.</p>
 * <p>Constructor can be:</p>
 * <pre>
 *  <b>d, m, y</b> . With digits. E.g.: new dmjs.Date(3, 12, 2010)
 *  <b>date</b> .    With a Date object.
 *                   E.g.: new dmjs.Date(new Date())
 *  <b>str</b> .     With a string respresenting a data in one of next
 *                   formats: yyyymmdd, [d]d/[m]m/yyyy or [d]d-[m]m-yyyy.
 *                   E.g.: new dmjs.Date("20100408"); new dmjs.Date("8/4/2010");
 *                   new dmjs.Date("08/04/2010"); new dmjs.Date("8-4-2010")
 *  <b>()</b> .      Without arguments gives the day today.
 * </pre>
 * <p>You can test if a dmjs.Date is valid with <tt>isNaN(date.base())</tt>.
 * This call returns <b>true</b> if 'date' is not valid.</p>
 * @constructor
 * @param {!Date|string|number=} day (if it is a day its value is from 1)
 * @param {!number=} month (from 1 to 12)
 * @param {!number=} year Whith 2 o 4 digits.
 */
dmjs.Date = function (day, month, year) {
  'use strict';

  var
    self = this,
    dt,
    makeDt,
    makeDtStr;

  makeDt = function (date) {
    var
      year,
      month,
      day;

    year = "0000" + date.getFullYear().toString();
    year = year.substring(year.length - 4);
    month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
      month = "0" + month;
    }
    day = date.getDate().toString();
    if (day.length < 2) {
      day = "0" + day;
    }
    return year + month + day;
  };

  makeDtStr = function (date) {
    var ps = date.split("-");
    if (ps.length !== 3) {
      ps = date.split("/");
    }
    if (3 === ps.length) {
      return makeDt(new Date(
        +ps[2],
        ps[1] - 1,
        +ps[0]
      ));
    }
    return makeDt(new Date(
      +date.substring(0, 4),
      date.substring(4, 6) - 1,
      +date.substring(6)
    ));
  };

  dt = (year !== undefined) ? makeDt(new Date(year, month - 1, day))
    : (day === undefined) ? makeDt(new Date())
      : (typeof day === "string") ? makeDtStr(day)
        : makeDt(day);

  /**
   * Returns a javascript Date that represents to <i>this</i>.
   *
   * @return {!Date}
   */
  this.date = function() {
    return new Date(self.year(), self.month() - 1, self.day());
  };

  /**
   * Returns date in format "yyyymmdd"
   *
   * @return {string}
   */
  this.base = function() {
    return dt;
  };

  /**
   * Returns date in format "dd/mm/yyyy"
   *
   * @return {!string}
   */
  this.toString = function () {
    return dt.substring(6) + "/" +
      dt.substring(4, 6) + "/" +
      dt.substring(0, 4);
  };

  /**
   * <p>Returns a string that represents to <i>this</i>.</p>
   * <p><i>template</i> is kind <tt>printf</tt> with next sustitution
   * variables:</p>
   * <pre>
   *   %d  Day in number 06 -> 6
   *   %D  Day with tow digits 06 -> 06
   *   %m  Month in number 03 -> 3
   *   %M  Month with two digits 03 -> 03
   *   %y  Year with two digits 2010 -> 10
   *   %Y  Year with four digits 2010 -> 2010
   *   %a1 Week day with one character: L M X J V S D
   *   %a3 Week day with tree characters.
   *   %A  Week day withd all characters.
   *   %b  Month with three characters.
   *   %B  Month with all characters.
   *   %%  The sign %
   * </pre>
   *
   * @param {!string} template
   * @return {!string}
   */
  this.format = function(template) {
    var
      d1,
      d2,
      m1,
      m2,
      w;

    d2 = dt.substring(6);
    d1 = d2;
    if (d1.charAt(0) === "0") {
      d1 = d1.charAt(1);
    }
    m2 = dt.substring(4, 6);
    m1 = m2;
    if (m1.charAt(0) === "0") {
      m1 = m1.charAt(1);
    }
    w = self.date().getDay();
    return template.replace(/%d/g, d1
      ).replace(/%D/g, d2
      ).replace(/%m/g, m1
      ).replace(/%M/g, m2
      ).replace(/%y/g, dt.substring(2, 4)
      ).replace(/%Y/g, dt.substring(0, 4)
      ).replace(/%b/g, dmjs.Date.months[dt.substring(4, 6) - 1].substring(0, 3)
      ).replace(/%B/g, dmjs.Date.months[dt.substring(4, 6) - 1]
      ).replace(/%a3/g, dmjs.Date.week[w].substring(0, 3)
      ).replace(/%a1/g, dmjs.Date.week1.charAt(w)
      ).replace(/%A/g, dmjs.Date.week[w]
      ).replace(/%%/g, "%");
  };

  /**
   * Returns 'true' if <i>this</i> is equals than <i>date</i>
   *
   * @param {!dmjs.Date} date
   * @return {!boolean}
   */
  this.eq = function (date) {
    return dt === date.base();
  };

  /**
   * Returns 'true' if <i>this</i> is less than <i>date</i>
   *
   * @param {!dmjs.Date} date
   * @return {!boolean}
   */
  this.lt = function (date) {
    return dt < date.base();
  };

  /**
   * Returns 'true' if <i>this</i> is greater than <i>date</i>
   *
   * @param {!dmjs.Date} date
   * @return {!boolean}
   */
  this.gt = function (date) {
    return dt > date.base();
  };

  /**
   * Returns day in number.
   *
   * @return {!number}
   */
  this.day = function () {
    return parseInt(dt.substring(6), 10);
  };

  /**
   * Returns month in number. (from 1 to 12)
   *
   * @return {!number}
   */
  this.month = function () {
    return parseInt(dt.substring(4, 6), 10);
  };

  /**
   * Returns year in number.
   *
   * @return {!number}
   */
  this.year = function () {
    return parseInt(dt.substring(0, 4), 10);
  };

  /**
   * Returns a new Date <i>this</i> + <i>days</i>
   *
   * @param {!number} days
   * @return {!dmjs.Date}
   */
  this.add = function (days) {
    var
      d;
    d = self.date();
    d.setDate(d.getDate() + days);
    return new dmjs.Date(d);
  };

  /**
   * <p>Returns substract <i>this</i> - <i>date</i> in days.</p>
   * <p>Result can be negative.</p>
   *
   * @param {!dmjs.Date} date
   * @return {!number}
   */
  this.dfDays = function (date) {
    var
      t1,
      t2;

    t1 = Date.UTC(self.year(), self.month() - 1, self.day());
    t2 = Date.UTC(date.year(), date.month() - 1, date.day());
    return Math.floor((t1 - t2) / 86400000);
  };
};

/**
 * <p>Reads a Date in English format.</p>
 * <p>Valid formats are <tt>[m]m/[d]d/yyyy</tt> or <tt>[m]m-[d]d-yyyy</tt>.</p>
 * <pre>
 * E.g.: new dmjs.Date("8/4/2010"); new dmjs.Date("08/04/2010");
 *       new dmjs.Date("8-4-2010")</pre>
 * @param {!string} date A valid date.
 * @return {!dmjs.Date}
 */
dmjs.Date.fromEn = function (date) {
    var ps = date.split("-");
    if (ps.length !== 3) {
      ps = date.split("/");
    }
    return new dmjs.Date(
      +ps[1],
      +ps[0],
      +ps[2]
    );
};

/**
 * <p>Spanish days of week in strings:<p>
 * <p>["domingo", "lunes", "martes", "miércoles", "jueves", "viernes",
 * "sábado"]</p>
 * @type {Array.<string>}
 */
dmjs.Date.week = ["domingo", "lunes", "martes", "miércoles", "jueves",
  "viernes", "sábado"];
/**
 * <p>Spanish days of week in characters:<p>
 * <p>"DLMXJVS"</p>
 * @type {string}
 */
dmjs.Date.week1 = "DLMXJVS";
/**
 * <p>Spanish months in strings:<p>
 * <p>["enero", ..., "diciembre"]</p>
 * @type {Array.<string>}
 */
dmjs.Date.months = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
