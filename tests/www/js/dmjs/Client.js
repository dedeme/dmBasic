import Store from "./Store.js";
import Cryp from "./Cryp.js";
import B64 from "./B64.js";
const Klen = 300;
export default class Client {
  constructor (appName, fexpired) {
    this._appName = appName;
    this._fexpired = fexpired;
    this._pageId = "";
    this._connectionId = "";
    this._lock = false;
  }
  sessionId () {
    return Store.take("Client_sessionId_" + this._appName) || B64.encode("0");
  }
  setSessionId (value) {
    Store.put("Client_sessionId_" + this._appName, value);
  }
  key () {
    return Store.take("Client_key_" + this._appName) || B64.encode("0");
  }
  setKey (value) {
    Store.put("Client_key_" + this._appName, value);
  }
  user () {
    return Store.take("Client_user_" + this._appName) || "";
  }
  setPageId () {
    const value = Cryp.genK(250);
    Store.put("Client_pageId_" + this._appName, value);
    this._pageId = value;
  }
  sendServer (rq, f) {
    const self = this;
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        self._lock = false;
        f(request.responseText.trim());
      }
    };
    if (self._lock) {
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
  connect (f) {
    const self = this;
    self.sendServer(
      self.sessionId(),
      rp => {
        try {
          const jdata = Cryp.decryp(self.sessionId(), rp);
          const data = (JSON.parse(jdata));
          const key = data["key"];
          if (key === "") {
            f(false);
          } else {
            self.setKey(key);
            self._connectionId = data["connectionId"];
            f(true);
          }
        } catch (e) {
          console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:${e}`);
        }
      }
    );
  }
  authentication (user, pass, expiration, f) {
    const self = this;
    const key = Cryp.key(self._appName, Klen);
    const p = Client.crypPass(pass);
    const exp = expiration ? "1" : "0";
    self.sendServer(
      ":" + Cryp.cryp(key, `${user}:${p}:${exp}`),
      rp => {
        try {
          const jdata = Cryp.decryp(key, rp);
          const data = (JSON.parse(jdata));
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
          console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:${e}`);
        }
      }
    );
  }
  _send (data, f, withConnectionId) {
    const self = this;
    if (withConnectionId) {
      data["connectionId"] = self._connectionId;
    }
    self.sendServer(
      self.sessionId() + ":" + Cryp.cryp(self.key(), JSON.stringify(data)),
      rp => {
        try {
          const jdata = Cryp.decryp(self.key(), rp);
          const data = (JSON.parse(jdata));
          f(data);
        } catch (e) {
          try {
            const jdata = Cryp.decryp("nosession", rp);
            const data = (JSON.parse(jdata));
            const expired = data["expired"] || false;
            if (expired) {
              self._fexpired();
            } else {
              throw(e);
            }
          } catch (e2) {
            console.log(`RAW SERVER RESPONSE:\n${rp}\nCLIENT ERROR:${e}`);
          }
        }
      }
    );
  }
  send0 (data, f) {
    this._send(data, f, false);
  }
  send (data, f) {
    this._send(data, f, true);
  }
  static crypPass (pass) {
    return Cryp.key(pass, Klen);
  }
}
