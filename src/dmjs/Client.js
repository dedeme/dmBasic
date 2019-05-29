// Copyright 14-Sep-2018 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
 * Client to connect via Ajax.
 *
 * *** Protocol ***
 * ****************
 *   1.- CONNECT: Client program try to connect with sessionId
 *     * Wrong -> (communicationKey = "") AUTHENTICATION
 *     * Right -> Returns connectionId and communicationKey
 *
 *   2.- NORMAL COMMUNICATION: Client send data with sessionId
 *
 *   3.- AUTHENTICATION: Client send user, password and persisitent.
 *     * Wrong -> AUTHENTICATION
 *     * RIGHT -> Returns sessionId, communicationKey and user level
 *
 * *** Client Messages ***
 * ***********************
 *   AUTHENTICATION: :userName:userKey:[0/1]
 *     userName -> in B64.
 *     userKey -> in Cryp.key.
 *     [0/1] -> "1" Indicates temporary connection. "0" Indicates permanent.
 *   CONNECT: sessionId
 *     sessionId -> As it comes from server.
 *   NORMAL COMMUNICATION: sessionId:data
 *     sessionId -> As it comes from server.
 *     data -> A pageId field is added. After that it is codified con
 *             Cryp.cryp and communicationKey
 *   SET COMMUNICATION: sessionId:connectionId:data
 *     sessionId -> As it comes from server.
 *     connectionId -> As it comes from connect.
 *     data -> A pageId field is added. After that it is codified con
 *             Cryp.cryp and communicationKey
 *
 * *** Server Messages ***
 * ***********************
 *   AUTHENTICATION: Data.key, Data.sessionId, Data.level
 *     Data is codified with the same key which sent user.
 *     Data.key is a fresh string or "" if connection failed.
 *     Data.sessionId is a fresh string or "".
 *     Data.level "0" for admin and "" if connection failed.
 *   CONNECT: Data.key, Data.connectionId
 *     Data is codified with sessionId.
 *     Data.key is a fresh string or "" if connection failed.
 *     Data.connectionId is a fresh string or "".
 *   NORMAL COMMUNICATION: Data.? | Data.expired
 *     Data.? is codified with communicationKey.
 *     Data.expired is codified with "nosession"
 *     Data.? | Data.expired Response fields. If session is expired the only
 *                           field returned is 'expired' with value 'true'.
 */

import Store from "./Store.js";
import Cryp from "./Cryp.js";
import B64 from "./B64.js";

const Klen = 300;

/** Class for AJAX communications */
export default class Client {
  /**
   * @param {boolean} isDmCgi If is 'true' server is accessed through 'dmcgi'
   * @param {string} appName Used to customize LocalStore
   * @param {function ():void} fexpired Function to launch expired page
   */
  constructor (isDmCgi, appName, fexpired) {
    /**
     * @private
     * @const {boolean}
     */
    this._isDmCgi = isDmCgi;

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
    this._connectionId = "";
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

  /**
   * @private
   * @param {string} rq data to send in B64
   * @return {!Promise}
   */
  sendServer (rq) {
    const self = this;
    return new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      request.onload = () => {
        if (request.status === 200) {
          resolve(request.responseText.trim());
        } else {
          reject(Error(request.statusText));
        }
      };

      request.onerror = () => {
        reject(Error("Network Error"));
      };

      request.open(
        "POST",
        "http://" + location.host + (self._isDmCgi ? "/cgi-bin/ccgi.sh" : ""),
        true
      );
      request.setRequestHeader(
        "Content-Type"
        , "text/plain"
      );

      request.send(self._appName + ":" + rq);
    });
  }

  /**
   * @return {!Promise}
   */
  async connect () {
    const self = this;
    const rp = await self.sendServer(self.sessionId());
    try {
      const jdata = Cryp.decryp(self.sessionId(), rp);
      const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
      const key = data["key"];
      if (key === "") {
        return false;
      }
      self.setKey(key);
      self._connectionId = data["connectionId"];
      return true;
    } catch (e) {
      //eslint-disable-next-line
      console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
      return null;
    }
  }

  /**
   * @param {string} user Param
   * @param {string} pass (As is written for user)
   * @param {boolean} expiration "true" means a temporary connection.
   * @return {!Promise}
   */
  async authentication (user, pass, expiration) {
    const self = this;
    const key = Cryp.key(self._appName, Klen);
    const p = Client.crypPass(pass);
    const exp = expiration ? "1" : "0";
    const rp = await self.sendServer(
      ":" + Cryp.cryp(key, `${user}:${p}:${exp}`)
    );
    try {
      const jdata = Cryp.decryp(key, rp);
      const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
      const sessionId = data["sessionId"];
      if (sessionId === "") {
        return false;
      }
      self.setKey(data["key"]);
      self.setSessionId(sessionId);
      Store.put("Client_user_" + self._appName, user);
      return true;
    } catch (e) {
      //eslint-disable-next-line
      console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
      return null;
    }
  }

  /**
   * @private
   * @param {!Object<string, ?>} data Param
   * @param {boolean} withConnectionId Param
   * @return {!Promise}
   */
  async _send (data, withConnectionId) {
    const self = this;
    if (withConnectionId) {
      data["connectionId"] = self._connectionId;
    }
    const rp = await self.sendServer(
      self.sessionId() + ":" + Cryp.cryp(self.key(), JSON.stringify(data))
    );

    try {
      const jdata = Cryp.decryp(self.key(), rp);
      const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
      return data;
    } catch (e) {
      try {
        const jdata = Cryp.decryp("nosession", rp);
        const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
        const expired = data["expired"] || false;
        if (expired) {
          self._fexpired();
          return null;
        }
        throw(e);
      } catch (e2) {
        //eslint-disable-next-line
        console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
        return null;
      }
    }
  }

  /**
   * [rq] does not check if connectionId is correct.
   * @param {!Object<string, ?>} data Param
   * @return {!Promise}
   */
  rq (data) {
    return this._send(data, false);
  }

  /**
   * [send] checks if connectionId is correct.
   * @param {!Object<string, ?>} data Param
   * @return {!Promise}
   */
  send (data) {
    return this._send(data, true);
  }

  /** @private */
  async longRun (isRq, data) {
    let rp = null;

    data["longRunFile"] = "";
    if (isRq) {
      rp = await this.rq(data);
    } else {
      rp = await this.send(data);
    }
    data["longRunFile"] = rp["longRunFile"];
    return new Promise((resolve) => {
      let counter = 0;
      const longRunInterval = setInterval(async () => {
        if (isRq) {
          rp = await this.rq(data);
        } else {
          rp = await this.send(data);
        }
        const longRunEnd = rp["longRunEnd"];
        if (longRunEnd || counter > 60) {
          clearInterval(longRunInterval);
          resolve(rp);
        } else {
          ++counter;
        }
      }, 1000);
    });
  }

  /**
   * Request to server a "long run" task.
   * Does not check if connectionId is correct.
   * Process:
   *    Client: Adds a string field called "longRunFile" set to "" and send 'rq'
   *    Server: Launch the task in thread apart and return "longRunFile" with
   *            the path of a file which will contain a response.
   *    Client: Set "longRunFile" with the value returned by server and send
   *            'rq' every second until server indicates the end of the task or
   *            it passes 1 minute.
   *    Server: Adds to response a field called "longRunEnd" set to 'true' if
   *            the task is finished or 'false' otherwise.
   * @param {!Object<string, ?>} data
   * @return {!Promise<!Object<string, ?>>} Object contains a added field called
   *         "longRunEnd" set to 'true' if the task was finished or 'false'
   *         otherwise.
   */
  rqLongRun (data) {
    return this.longRun(true, data);
  }

  /**
   * Sends to server a "long run" task.
   * Checks if connectionId is correct.
   * Process: See 'rqLongRun()'
   * @param {!Object<string, ?>} data
   * @return {!Promise<!Object<string, ?>>} Object contains a added field called
   *         "longRunEnd" set to 'true' if the task was finished or 'false'
   *         otherwise.
   */
  sendLongRun (data) {
    return this.longRun(false, data);
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

