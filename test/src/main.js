goog.provide("main");

goog.require("decTest");
goog.require("dateTest");
goog.require('itTest');
goog.require("mapTest");
goog.require("crypTest");
goog.require("strTest");
goog.require("rndTest");
goog.require("i18nTest");
goog.require("uiTest");
goog.require("dmjs.ui");

main = function () {
  'use strict';

  decTest();
  dateTest();
  itTest();
  mapTest();
  crypTest();
  strTest();
  rndTest();
  i18nTest();
//  uiTest();
};

goog.exportSymbol('main', main);
