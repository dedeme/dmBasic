/*
 * Copyright 16-Apr-2014 ºDeme
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

/** Class for authentication */
goog.provide("dmjs.Logger");
goog.require("dmjs.It");
goog.require("dmjs.rnd");

/**
 * @constructor
 * @param {!number} timeOut TimeOut in seconds for showing a captcha.
 * @param {!number} maxTimes Maximun number of attempts to authentication
 *   before showing a captcha.
 * @param {!function():!number} getLastTime Date().getTime() of access
 *   last time.
 * @param {!function(!number)} setLastTime set Date().getTime() of access.
 * @param {!function():!number} getTimes Number of attempts to authentication.
 * @param {!function()} incTimes Increment the number of attempts to
 *  authentication.
 * @param {!function()} resetTimes Set the number of attempts to
 *  authentication at 0.
 * @param {!function(!string, !string, !function((string|null)))} login A
 *  function type <tt>f(user, password, callback(level))</tt> Which logs
 *  'user' with 'password' and executes callback sending 'level' of user
 *  or <tt>null</tt> if 'user' has not logged.
 * @param {!function(!string, !string, !string, !function(boolean))} changeLog
 *  A function type <tt>f(user, password, newPassword, callback(value))</tt>
 *  which tries to change user password. After operation <tt>changelog</tt>
 *  executes 'callback' sending 'true' if it succeeded and 'false' in the
 *  other case.
 */
dmjs.Logger = function (
  timeOut,
  maxTimes,
  getLastTime,
  setLastTime,
  getTimes,
  incTimes,
  resetTimes,
  login,
  changeLog
) {
  "use strict";

  /**
   * Returns "" if is not necesary a captcha, else returns one.
   * @return {!string}
   */
  this.captcha = function () {
    if (new Date().getTime() > getLastTime() + timeOut * 1000) {
      return "";
    }
    if (getTimes() < maxTimes) {
      return "";
    }
    return dmjs.It.join(dmjs.It.from(
      dmjs.rnd.mkBox([["1", 4], ["0", 4]]).box()
    ));
  };

  /**
   * Authentifies user. If the operation fails it calls 'setLastTime' with 'new
   *  Date.getTime()' and 'incTimes' and send 'null' to 'action'.
   * @param {!string} user
   * @param {!string} password (encrypted)
   * @param {!boolean} captcha If its value is 'false' authentification will
   *   fail.
   * @param {!function ((string|null))} action Function type f(level) where
   *  'level' is the user level ('0' for 'admin') or <tt>null</tt> if
   *  authentification failed.
   */
  this.login = function (user, password, captcha, action) {
    if (captcha) {
      login(user, password, function (level) {
        if (level) {
          resetTimes();
        } else {
          setLastTime(new Date().getTime());
          incTimes();
        }
        action(level);
      });
    } else {
      setLastTime(new Date().getTime());
      incTimes();
      action(null);
    }

  };

  /**
   * Changes password of user. If the operation fails it calls 'setLastTime'
   *  with 'new Date.getTime()' and 'incTimes' and returns 'false', else
   *  returns * 'true'.
   * @param {!string} user
   * @param {!string} lastPass
   * @param {!string} newPass
   * @param {!boolean} captcha If its value is 'false' change will fail.
   * @param {!function(boolean)} action
   */
  this.changeLog = function (user, lastPass, newPass, captcha, action) {
    if (captcha) {
      changeLog(user, lastPass, newPass, function (value) {
        if (value) {
          resetTimes();
        } else {
          setLastTime(new Date().getTime());
          incTimes();
        }
        action(value);
      });
    } else {
      setLastTime(new Date().getTime());
      incTimes();
      action(false);
    }
  };

};
