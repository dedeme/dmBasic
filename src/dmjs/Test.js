/*
 * Copyright 19-jul-2013 ºDeme
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
/*jslint regexp: true */

/** Utilities for making tests */
goog.provide("dmjs.Test");

/**
 * @constructor
 * @struct
 * @param {!string} name The name of test.
 */
dmjs.Test = function (name) {
  'use strict';

  var
    annotation,
    fail,
    number,
    testN,
    subtestN,
    messages;

  annotation = function (ex, ac, isFail, notEq) {
    var
      place;

    place = (new Error("").stack.split("\n")[2]).replace(/@.*:/g, ":");
    number++;
    if (isFail) {
      fail++;
      messages = messages +
        "Fail in test " + testN +
        ((subtestN === 0) ?  "" : ("." + subtestN)) +
        " (" + place + ")" +
        "\n" +
        "  Expected: " + notEq + ex + "\n" +
        "    Actual: " + ac + "\n";
    }
  };

  fail = 0;
  number = 0;
  testN = 0;
  subtestN = 0;
  messages = "";

  /** Show restults */
  this.log = function () {
    window.console.log(
      name + ":\n" +
        messages +
        "Number: " + number + ". Passed: " + (number - fail) +
        ". Fails: " + fail + "\n\n"
    );
  };

  /**
   * Writes down as valid if 'expected' is equals to 'actual'.<p>
   * If 'actual' is undefined 'expected' must be a boolean value. In this case
   * result will be valid if 'actual' is true.
   * @param {*} expected
   * @param {*=} actual
   */
  this.yes = function (expected, actual) {
    if (actual === undefined) {
      actual = expected;
      expected = true;
    }
    testN++;
    subtestN = 0;
    annotation(expected, actual, expected !== actual, "");
  };

  /**
   * Writes down as valid if 'expected' is not equals to 'actual'.<p>
   * If 'actual' is undefined 'expected' must be a boolean value. In this case
   * result will be valid if 'actual' is false.
   * @param {*} expected
   * @param {*=} actual
   */
  this.not = function (expected, actual) {
    if (actual === undefined) {
      actual = expected;
      expected = true;
    }
    testN++;
    subtestN = 0;
    annotation(expected, actual, expected === actual, "!= ");
  };

  /**
   * Evaluates with 'yes()' every element of paramsResult conform next
   * scheme: yes(el1, func(el0)).
   * @param {!Array.<!Array.<*>>} paramsResult Array of [value, expected]
   * @param func Function for applying to value.
   */
  this.yess = function (paramsResult, func) {
    var
      i,
      expected,
      actual;

    testN++;
    subtestN = 0;
    for (i = 0; i < paramsResult.length; ++i) {
      subtestN++;
      expected = paramsResult[i][1];
      actual = func(paramsResult[i][0]);
      annotation(expected, actual, expected !== actual, "");
    }
  };

  /**
   * Evaluates with 'not()' every element of paramsResult conform next
   * scheme: not(el1, func(el0)).
   * @param {!Array.<!Array.<*>>} paramsResult Array of [value, expected]
   * @param func Function for applying to value.
   */
  this.nots = function (paramsResult, func) {
    var
      i,
      expected,
      actual;

    testN++;
    subtestN = 0;
    for (i = 0; i < paramsResult.length; ++i) {
      subtestN++;
      expected = paramsResult[i][1];
      actual = func(paramsResult[i][0]);
      annotation(expected, actual, expected === actual, "!= ");
    }
  };
};

