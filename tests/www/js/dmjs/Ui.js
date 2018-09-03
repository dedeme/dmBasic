import It from "./It.js";
import Domo from "./Domo.js";
const scripts = [];
export default class Ui {
  static $ (s) {
    if (s === "") {
      throw ("'s' is empty");
    }
    return s.charAt(0) === "#"
      ? new Domo(document.getElementById(s.substring(1)))
      : s.charAt(0) === "@"
        ? new Domo(document.querySelector(s.substring(1)))
        : new Domo(document.createElement(s));
  }
  static $$ (s) {
    const toDomo = arr => arr.map(e => new Domo(e));
    return s === ""
      ? toDomo(document.getElementsByTagName("*"))
      : (s.charAt(0) === "%")
        ? toDomo(document.getElementsByName(s.substring(1)))
        : (s.charAt(0) === ".")
          ? toDomo(document.getElementsByClassName(s.substring(1)))
          : toDomo(document.getElementsByTagName(s));
  }
  static url () {
    const search = window.location.search;
    if (search === "") return {};
    const r = {};
    let c = 0;
    It.from(search.substring(1).split("&")).each(e => {
      const ix = e.indexOf("=");
      if (ix === -1) r[`${c}`] = decodeURI(e);
      else r[decodeURI(e.substring(0, ix))] = decodeURI(e.substring(ix + 1));
      ++c;
    });
    return r;
  }
  static load (path, action) {
    const head = document.getElementsByTagName("head")[0];
    if (It.from(scripts).contains(path)) {
      action();
      return;
    }
    scripts.push(path);
    let element;
    if (path.substring(path.length - 3) === ".js") {
      element = document.createElement("script");
      element.setAttribute("type", "text/javascript");
      element.setAttribute("src", path);
    } else if (path.substring(path.length - 4) === ".css") {
      element = document.createElement("link");
      element.setAttribute("rel", "stylesheet");
      element.setAttribute("type", "text/css");
      element.setAttribute("href", path);
    } else throw "'#path' is not a .js or .css file";
    head.appendChild(element);
    element.onload = () => {
      action();
    };
  }
  static loads (paths, action) {
    const lload = () => {
      if (paths.length === 0) action();
      else Ui.load(paths.shift(), lload);
    };
    lload();
  }
  static upload (path, action) {
    const url = path.charAt(0) === "/"
      ? "http://" + location.host + path
      : path;
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        action(request.responseText);
      }
    };
    request.open("GET", url, true);
    request.send();
  }
  static download (fileName, text) {
    const a = Ui.$("a")
      .att("href", "data:text/plain;plain," + text)
      .att("download", fileName);
    const body = document.body;
    body.appendChild(a.e());
    a.e().click();
    body.removeChild(a.e());
  }
  static ifiles (o, action, back) {
    back = back || "rgb(240, 245, 250)";
    const style =  (o.style());
    const handleDragOver = evt => {
      o.style(style + `;background-color: ${back} ;`);
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "copy";
    };
    o.e().addEventListener("dragover", handleDragOver, false);
    o.e().addEventListener(
      "dragleave",
      () => {
        o.style(style);
      },
      false
    );
    const handleDrop = evt => {
      o.style(style);
      evt.stopPropagation();
      evt.preventDefault();
      action(evt.dataTransfer.files);
    };
    o.e().addEventListener("drop", handleDrop, false);
    return o;
  }
  static changePoint (input) {
    const el = input.e();
    el.onkeydown = e => {
      if (e.keyCode === 110) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const text = el.value;
        el.value = text.substring(0, start) + "," + text.substring(end);
        el.selectionStart = start + 1;
        el.selectionEnd = start + 1;
        return false;
      }
      return true;
    };
    return input;
  }
  static img (id) {
    return Ui.$("img").att("src", "img/" + id + ".png");
  }
  static lightImg (id) {
    return Ui.img(id).att("style", "opacity:0.4");
  }
  static field (targetId) {
    return Ui.$("input").att("type", "text")
      .on("keydown", e => {
        if (e.keyCode === 13) {
          e.preventDefault();
          Ui.$("#" + targetId).e().focus();
        }
      });
  }
  static pass (targetId) {
    return Ui.$("input").att("type", "password")
      .on("keydown", e => {
        if (e.keyCode === 13) {
          e.preventDefault();
          Ui.$("#" + targetId).e().focus();
        }
      });
  }
  static link (f) {
    return Ui.$("span").att("style", "cursor:pointer")
      .on("click", f);
  }
  static select (idPrefix, list) {
    const r =  (
      Ui.$("select").att("id", idPrefix)
    );
    It.from(list).each(tx => {
      const op = Ui.$("option");
      if (tx.length > 0 && tx.charAt(0) === "+") {
        tx = tx.substring(1);
        op.att("selected", "true");
      }
      op.text(tx)
        .att("name", idPrefix)
        .att("id", idPrefix + "_" + tx);
      r.e().add(op.e());
    });
    return r;
  }
  static beep () {
    const au = new AudioContext();
    const o = au.createOscillator();
    o.frequency.value = 990;
    o.connect(au.destination);
    o.start(0);
    setTimeout(() => {
      o.stop(0);
    }, 80);
  }
  static winX (evt) {
    return document.documentElement.scrollLeft +
    document.body.scrollLeft +
    evt.clientX;
  }
  static winY (evt) {
    return document.documentElement.scrollTop +
    document.body.scrollTop +
    evt.clientY;
  }
}
