goog.provide("main");

goog.require("decTest");
// goog.require('itTest');
// goog.require('cookieTest');
// goog.require("dateTest");
// goog.require("strTest");
// goog.require("crypTest");
// goog.require("rndTest");
// goog.require("i18nTest");
// goog.require("sessionTest");
// goog.require("mapTest");

main = function () {
  'use strict';

  decTest.run();
//  itTest();
//  cookieTest();
//  dateTest.run();
//  strTest.run();
//  crypTest.run();
//  rndTest();
//  i18nTest();
//  sessionTest();
//  mapTest();
};

goog.exportSymbol('main', main);
