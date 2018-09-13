// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
 * Client to connect via Ajax.
 *
 * *** Protocol ***
 * ****************
 *   1.- CONNECT: Client program try to connect with sessionId
 *     * Wrong -> (communicationKey = "") AUTHENTICATION
 *     * Right -> Returns pageId and communicationKey
 *
 *   2.- NORMAL COMMUNICATION: Client send data with sessionId
 *
 *   3.- AUTHENTICATION: Client send user, password and persisitent.
 *     * Wrong -> AUTHENTICATION
 *     * RIGHT -> Returns sessionId, pageId, communicationKey and user level
 *
 * *** Client Messages ***
 * ***********************
 *   AUTHENTICATION: :userName:userKey:[0/1]
 *     userName -> in B64.
 *     userKey -> in Cryp.key.
 *     [0/1] -> "1" Indicates temporary connection. "0" Indicates permanent.
 *   CONNECT: sessionId
 *     sessionId -> As came from server.
 *   NORMAL COMMUNICATION: sessionId:data
 *     sessionId -> As came from server.
 *     data -> A pageId field is added. After that it is codified con
 *             Cryp.cryp and communicationKey
 *
 * *** Server Messages ***
 * ***********************
 *   AUTHENTICATION: Data.key, Data.sessionId, Data.pageId, Data.level
 *     Data is codified with the same key which sent user.
 *     Data.key is a fresh string or "" if connection failed.
 *     Data.sessionId is a fresh string or "".
 *     Data.pageId is a fresh string or "".
 *     Data.level "0" for admin and "" if connection failed.
 *   CONNECT: Data.key, Data.PageId
 *     Data is codified with sessionId.
 *     Data.key is a fresh string or "" if connection failed.
 *     Data.PageId is a fresh string or "". It is consumed by Client
 *   NORMAL COMMUNICATION: Data.? | Data.expired
 *     Data is codified with communicationKey.
 *     Data.? | Data.expired Response fields. If session is expired the only
 *                           field returned is expired with value true.
 */

import Store from "./Store.js";
import Cryp from "./Cryp.js";
import B64 from "./B64.js";

const Klen = 300;

/** Class for AJAX communications */
export default class Client {
  /**
   * @param {string} appName Used to customize LocalStore
   * @param {function ():void} fexpired Function to launch expired page
   */
  constructor (appName, fexpired) {
    /**
     * @private
     * @const {string}
     */
    this._appName = appName;

    /**
     * @private
     * @const {function ():void}
     */
    this._fexpired = fexpired;

    /**
     * @private
     * @type {string}
     */
    this._pageId = "";

    /**
     * @private
     * @type {string}
     */
    this._connectionId = "";

    /**
     * When a request is sent 'this._lock' is set to 'true' and is not posible
     * to send new requests until request.readyState === 4.
     * @private
     * @type {boolean}
     */
    this._lock = false;
  }

  /**
   * @private
   * @return {string} Result
   */
  sessionId () {
    return Store.take("Client_sessionId_" + this._appName) || B64.encode("0");
  }

  /**
   * @private
   * @param {string} value Param
   * @return {void}
   */
  setSessionId (value) {
    Store.put("Client_sessionId_" + this._appName, value);
  }

  /**
   * @private
   * @return {string} Result
   */
  key () {
    return Store.take("Client_key_" + this._appName) || B64.encode("0");
  }

  /**
   * @private
   * @param {string} value Param
   * @return {void}
   */
  setKey (value) {
    Store.put("Client_key_" + this._appName, value);
  }

  /** @return {string} Result */
  user () {
    return Store.take("Client_user_" + this._appName) || "";
  }

  /** @return {void} */
  setPageId () {
    const value = Cryp.genK(250);
    Store.put("Client_pageId_" + this._appName, value);
    this._pageId = value;
  }

  /**
   * @private
   * @param {boolean} asynch If connection is asynchronic.
   * @param {string} rq data to send in B64
   * @param {function (string):void} f Action to do. The string of 'f' is
   *        B64 codified.
   * @return {void}
   */
  sendServer (asynch, rq, f) {
    const self = this;

    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        self._lock = false;
        f(request.responseText.trim());
      }
    };
    if (self._lock && !asynch) {
      return;
    }
    self._lock = true;
    request.open(
      "POST",
      "http://" + location.host + "/cgi-bin/ccgi.sh",
      true
    );
    request.setRequestHeader(
      "Content-Type"
      , "text/plain"
    );
    request.send(this._appName + ":" + rq);
  }

  /**
   * @param {function (boolean):void} f 'f' receives ok
   * @return {void}
   */
  connect (f) {
    const self = this;
    self.sendServer(
      false,
      self.sessionId(),
      rp => {
        try {
          const jdata = Cryp.decryp(self.sessionId(), rp);
          const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
          const key = data["key"];
          if (key === "") {
            f(false);
          } else {
            self.setKey(key);
            self._connectionId = data["connectionId"];
            f(true);
          }
        } catch (e) {
          //eslint-disable-next-line
          console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
        }
      }
    );
  }

  /**
   * @param {string} user Param
   * @param {string} pass (As is written for user)
   * @param {boolean} expiration "true" means a temporary connection.
   * @param {function (boolean):void} f Function
   * @return {void}
   */
  authentication (user, pass, expiration, f) {
    const self = this;
    const key = Cryp.key(self._appName, Klen);
    const p = Client.crypPass(pass);
    const exp = expiration ? "1" : "0";
    self.sendServer(
      false,
      ":" + Cryp.cryp(key, `${user}:${p}:${exp}`),
      rp => {
        try {
          const jdata = Cryp.decryp(key, rp);
          const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
          const sessionId = data["sessionId"];
          if (sessionId === "") {
            f(false);
          } else {
            self.setKey(data["key"]);
            self.setSessionId(sessionId);
            Store.put("Client_user_" + self._appName, user);
            f(true);
          }
        } catch (e) {
          //eslint-disable-next-line
          console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
        }
      }
    );
  }

  /**
   * @private
   * @param {!Object<string, ?>} data Param
   * @param {function (!Object<string, ?>):void} f Function
   * @param {boolean} asynch If connection is asynchronic.
   * @param {boolean} withConnectionId Param
   * @return {void}
   */
  _send (data, f, asynch, withConnectionId) {
    const self = this;
    if (withConnectionId) {
      data["connectionId"] = self._connectionId;
    }
    self.sendServer(
      asynch,
      self.sessionId() + ":" + Cryp.cryp(self.key(), JSON.stringify(data)),
      rp => {
        try {
          const jdata = Cryp.decryp(self.key(), rp);
          const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
          f(data);
        } catch (e) {
          try {
            const jdata = Cryp.decryp("nosession", rp);
            const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
            const expired = data["expired"] || false;
            if (expired) {
              self._fexpired();
            } else {
              throw(e);
            }
          } catch (e2) {
            //eslint-disable-next-line
            console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
          }
        }
      }
    );
  }

  /**
   * [send0] does not check if connectionId is correct.
   * @param {!Object<string, ?>} data Param
   * @param {function (!Object<string, ?>):void} f Function
   * @return {void}
   */
  send0 (data, f) {
    this._send(data, f, false, false);
  }

  /**
   * [send] checks if connectionId is correct.
   * @param {!Object<string, ?>} data Param
   * @param {function (!Object<string, ?>):void} f Function
   * @return {void}
   */
  send (data, f) {
    this._send(data, f, false, true);
  }

  /**
   * [sendAsync] sends asynchronically 'data' and does not check if
   * connectionId is correct.
   * @param {!Object<string, ?>} data Param
   * @param {function (!Object<string, ?>):void} f Function
   * @return {void}
   */
  sendAsync (data, f) {
    this._send(data, f, true, false);
  }

  /**
   * Processing of user password before sending it to server.
   * @param {string} pass Param
   * @return {string} Result
   */
  static crypPass (pass) {
    return Cryp.key(pass, Klen);
  }

}

