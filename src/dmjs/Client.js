// Copyright 14-Sep-2018 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
    Client to connect via Ajax.

     *** Protocol ***
     ****************
       1.- CONNECT: Client program try to connect with sessionId
         * Wrong -> (communicationKey = "") AUTHENTICATION
         * Right -> Returns communicationKey, user name and user level

       2.- NORMAL COMMUNICATION: Client send data with sessionId and encrypted
                                 with communicationKey.

       3.- AUTHENTICATION: Client send user, password and persisitent.
         * Wrong -> AUTHENTICATION
         * RIGHT -> Returns sessionId, communicationKey and user level

     *** Client Messages ***
     ***********************
       AUTHENTICATION: :userName:userKey:[0/1] (codified with appName)
         userName -> String.
         userKey -> in Cryp.key.
         [0/1] -> "1" Indicates temporary connection. "0" Indicates permanent.
       CONNECT: sessionId
         sessionId -> As it comes from server.
       NORMAL COMMUNICATION: sessionId:data
         sessionId -> As it comes from server.
         data -> Data to send, codified with Cryp.cryp and communicationKey.

     *** Server Messages    **
     ***********************
       AUTHENTICATION: Data.key, Data.sessionId, Data.level
         Data is codified with appName.
         Data.key is a fresh string or "" if connection failed.
         Data.sessionId is a fresh string or "".
         Data.level "0" for admin, another value for users and
                    "" if connection failed.
       CONNECT: Data.key, Data.connectionId
         Data is codified with sessionId.
         Data.key is the communication key or "" if connection failed.
         Data.user is the user name or "".
         Data.level "0" for admin, another value for users and
                    "" if connection failed.
       NORMAL COMMUNICATION: Data.? | Data.expired
         Data.? is a response codified with communicationKey.
         Data.expired with value 'true', codified with "nosession"
**/

import Store from "./Store.js";
import Cryp from "./Cryp.js";
import B64 from "./B64.js";

const Klen = 300;

/**
  Class for AJAX communications.
*/
export default class Client {
  /**
      @param {boolean} isDmCgi If is 'true' server is accessed through 'dmcgi'.
      @param {string} appName Used to customize LocalStore.
      @param {function ():void} fexpired Function to launch an expired page.
  **/
  constructor (isDmCgi, appName, fexpired) {
    /**
        @private
        @const {boolean}
    **/
    this._isDmCgi = isDmCgi;

    /**
        @private
        @const {string}
    **/
    this._appName = appName;

    /**
        @private
        @const {function ():void}
    **/
    this._fexpired = fexpired;

    /**
        @private
        @type {string}
    **/
    this._key = B64.encode("0");

    /**
        @private
        @type {string}
    **/
    this._user = "";

    /**
        @private
        @type {string}
    **/
    this._level = "";

  }

  /** @return {string} */
  get user () {
    return this._user;
  }

  /** @return {string} */
  get level () {
    return this._level;
  }

  /**
      @private
      @return {string}
  **/
  sessionId () {
    return Store.take("Client_sessionId_" + this._appName) || B64.encode("0");
  }

  /**
      @private
      @param {string} value
      @return {void}
  **/
  setSessionId (value) {
    Store.put("Client_sessionId_" + this._appName, value);
  }

  /**
      @private
      @param {string} rq data to send in B64.
      @return {!Promise}
  **/
  sendServer (rq) {
    const self = this;
    return new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      request.onload = () => {
        if (request.status === 200) resolve(request.responseText.trim());
        else reject(Error(request.statusText));
      };

      request.onerror = () => reject(Error("Network Error"));

      request.open(
        "POST",
        "http://" + location.host + (self._isDmCgi ? "/cgi-bin/ccgi.sh" : ""),
        true
      );
      request.setRequestHeader(
        "Content-Type",
        "text/plain"
      );

      request.send(self._appName + ":" + rq);
    });
  }

  /**
      @return {!Promise}
  **/
  async connect () {
    const self = this;
    const rp = await self.sendServer(self.sessionId());
    try {
      const jdata = Cryp.decryp(self.sessionId(), rp);
      const data = /** @type {!Object<string, string>} */(JSON.parse(jdata));
      const key = data["key"];
      if (key === "")
        return false;
      self._key = key;
      self._user = data["user"];
      self._level = data["level"];
      return true;
    } catch (e) {
      //eslint-disable-next-line
      console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
      return null;
    }
  }

  /**
      @param {string} user
      @param {string} pass (As is written for user).
      @param {boolean} expiration "true" means a temporary connection.
      @return {!Promise}
  **/
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
      const data = /** !Object<string, string> */(JSON.parse(jdata));
      const sessionId = data["sessionId"];
      if (sessionId === "") {
        return false;
      }
      self._key = data["key"];
      self._user = data["user"];
      self._level = data["level"];
      return true;
    } catch (e) {
      //eslint-disable-next-line
      console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:\n${e}`);
      return null;
    }
  }

  /**
      Sends data to server.
      @param {!Object<string, ?>} data
      @return {!Promise}
  **/
  async send (data) {
    const self = this;
    const rp = await self.sendServer(
      self.sessionId() + ":" + Cryp.cryp(self._key, JSON.stringify(data))
    );

    try {
      const jdata = Cryp.decryp(self._key, rp);
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
      Request to server a "long run" task.
      Process:
         Client: Adds a string field called "longRunFile" set to "" and send
                'rq'.
         Server: Launch the task in thread apart and return "longRunFile" with
                 the path of a file which will contain a response.
         Client: Set "longRunFile" with the value returned by server and send
                 'rq' every second until server indicates the end of the task or
                 it passes 1 minute.
         Server: Adds to response a field called "longRunEnd" set to 'true' if
                 the task is finished or 'false' otherwise.
      @param {!Object<string, ?>} data
      @return {!Promise<!Object<string, ?>>} Object contains a added field
              called "longRunEnd" set to 'true' if the task was finished or
              'false' otherwise.
  **/
  async longRun (data) {
    data["longRunFile"] = "";
    let rp = await this.send(data);

    data["longRunFile"] = rp["longRunFile"];
    return new Promise((resolve) => {
      let counter = 0;
      const longRunInterval = setInterval(async () => {
        rp = await this.send(data);

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
      Processing of user password before sending it to server.
      @param {string} pass
      @return {string}
  **/
  static crypPass (pass) {
    return Cryp.key(pass, Klen);
  }

}

