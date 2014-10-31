goog.provide("main");

goog.require("decTest");
goog.require("dateTest");
goog.require('itTest');
goog.require("mapTest");
// goog.require('cookieTest');
// goog.require("strTest");
// goog.require("crypTest");
// goog.require("rndTest");
// goog.require("i18nTest");
// goog.require("sessionTest");

main = function () {
  'use strict';

  decTest.run();
  dateTest.run();
  itTest();
  mapTest();
//  cookieTest();
//  strTest.run();
//  crypTest.run();
//  rndTest();
//  i18nTest();
//  sessionTest();
};

goog.exportSymbol('main', main);
