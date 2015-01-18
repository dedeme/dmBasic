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

/** Class for session control */
goog.provide("dmjs.Session");
goog.require("dmjs.store");

/**
 * @constructor
 * @param {!string} storeKey Key for HTML5 store
 * @param {!number} timeOut Seconds for keeping the session alive
 */
dmjs.Session = function (storeKey, timeOut) {//
  "use strict";

  var
    self,
    strData,
    data,
    close,
    setTime;

  self = this;

  close = function () {
    data = {
      "alive" : false,
      "time" : 0,
      "data" : "{}"
    };
    dmjs.store.put(storeKey, JSON.stringify(data));
  };

  setTime = function () {
    data["time"] = new Date().getTime();
    dmjs.store.put(storeKey, JSON.stringify(data));
  };

  strData = dmjs.store.get(storeKey);

  if (strData === null) {
    close();
  } else {
    data = JSON.parse(strData);
  }

  /**
   * @return {!number} Time (milliseconds from Date.getTime()) elapsed from
   *  last operation.
   */
  this.time = function () {
    return new Date().getTime() - data["time"];
  };

  /**
   * @return {!Object.<string, ?>} data recorded with open()
   */
  this.data = function () {
    /*jslint closure:true */
    return /** @type {!Object.<string, ?>} */(JSON.parse(data["data"]));
  };

  /**
   * Sets alive() to true and save 'd'
   * @param {!Object.<string, ?>} d Data which will be able to retrieve
   *  with data()
   */
  this.open = function (d) {
    data = {
      "alive" : true,
      "time" : new Date().getTime(),
      "data" : JSON.stringify(d)
    };
    dmjs.store.put(storeKey, JSON.stringify(data));
  };

  /**
   * @return {!boolean} 'true' if session is alive and is in time.
   */
  this.control = function () {
    if (data["alive"]) {
      if (self.time() > timeOut * 1000) {
        close();
        return false;
      }
      setTime();
      return true;
    }
    return false;
  };

  /**
   * Closes session
   */
  this.close = function () {
    close();
  };

};
