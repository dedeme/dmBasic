// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import It from "./It.js";
import Domo from "./Domo.js";

const /** !Array<string> */ scripts = [];

/**
    User interface resources.
**/
export default class Ui {

  /**
      Constructor for DomObjects.
         - If 's' starts with '#', returns element by id (e.g. $("#myTable")).
         - If 's' starts with '@', returns a querySelector.
           (e.g. $("@myTable") or $("@.example").
         - Otherwise creates the indicated object (e.g. Q("table")).
      @param {string} s
      @return {!Domo}
  **/
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

  /**
      Returns an Iterator of Domo objects.
         - If 's' is "" returns al elements in page.
         - if 's' is of form "%xxx" returns elements with name "xxx".
         - if 's' is of form ".xxx" returns elements of class 'xxx'.
         - if 's' is of form "xxx" returns elements with tag name 'xxx'.
      @param {string} s
      @return {!Array<!Domo>}
  **/
  static $$ (s) {
    const toDomo = arr => Array.from(arr).map(e => new Domo(e));

    return s === ""
      ? toDomo(document.getElementsByTagName("*"))
      : (s.charAt(0) === "%")
        ? toDomo(document.getElementsByName(s.substring(1)))
        : (s.charAt(0) === ".")
          ? toDomo(document.getElementsByClassName(s.substring(1)))
          : toDomo(document.getElementsByTagName(s));
  }

  /**
      Extracts variables of URL. Returns a map with next rules:
         -Expresions 'key = value' are changed in {"key" : "value"}.
         -Expresion only with value are changes by {"its-order-number" "value"}.
           (order-number is zero based).
      Example:
         foo.com/bar?v1&k1=v2&v3 -> {"0" : v1, "k1" : v2, "2" : v3}
      NOTE: keys and values are not trimized.
      NOTE: If there is no variable, return is an empty object.
      @return {!Object<string, string>}
  **/
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

  /**
      Loads dynamically a javascript or css file.
      @param {string} path
      @param {function ()} action
      @return {void}
  **/
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
    } else {
      throw "'#path' is not a .js or .css file";
    }

    head.appendChild(element);
    element.onload = () => action();
  }

  /**
      Loads dynamically several javascript or css files. (they can go mixed).
      @param {!Array<string>} paths Array with complete paths, including
             .js or .css extension.
      @param {function ()} action Action after loading.
      @return {void}
  **/
  static loads (paths, action) {
    const lload = () => {
      if (paths.length === 0) action();
      else Ui.load(paths.shift(), lload);
    };
    lload();
  }

  /**
      Loads a text file from the server which hosts the current page.
      @param {string} path Path of file. Can be absolute, but without protocol
             and name server (e.g. http://server.com/dir/file.txt, must be
             written "/dir/file.txt"), or relative to page.
      @param {function (string)} action : Callback which receives the text.
      @return {void}
  **/
  static upload (path, action) {
    const url = path.charAt(0) === "/"
      ? "http://" + location.host + path
      : path;
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4)
        action(request.responseText);
    };
    request.open("GET", url, true);
    request.send();
  }

  /**
      Allows user to download a text in a file called 'fileName'.
      @param {string} fileName
      @param {string} text
      @return {void}
  **/
  static download (fileName, text) {
    const a = Ui.$("a")
      .att("href", "data:text/plain;plain," + text)
      .att("download", fileName);
    const body = document.body;
    body.appendChild(a.e());
    a.e().click();
    body.removeChild(a.e());
  }

  /**
      Management of Drag and Drop of files over an object.
      NOTE: For accessing to single files use 'fileList.item(n)'. You
            can know the file number of files with 'fileList.length'.
      @param {!Domo} o Object over which is going to make Drag
             and Drop.
      @param {function (!FileList)} action Action to make with files.
      @param {string =} back Background indicative of DragOver efect. Default
             'rgb(240, 245, 250)'.
      @return {!Domo} The same object 'o'.
  **/
  static ifiles (o, action, back = "rgb(240, 245, 250)") {
    const style = /** @type {string} */ (o.style());
    const handleDragOver = evt => {
      o.style(style + `;background-color: ${back} ;`);
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "copy";
    };

    o.e.addEventListener("dragover", handleDragOver, false);

    o.e.addEventListener(
      "dragleave",
      () => o.style(style),
      false
    );

    const handleDrop = evt => {
      o.style(style);
      evt.stopPropagation();
      evt.preventDefault();
      action(evt.dataTransfer.files);
    };

    o.e.addEventListener("drop", handleDrop, false);

    return o;
  }

  /**
      Changes key point of keyboard number block by comma.
      @param {!Domo} input An input of text type.
      @return {!Domo} The same object 'input'.
  **/
  static changePoint (input) {
    const el = input.e;
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

  /**
      Creates a image with border='0'.
      @param {string} id Image name. If it has not extension, '.png' will be
             used. It must be placed in a directory named 'img'.
      @return {!Domo}
  **/
  static img (id) {
    if (id.indexOf(".") === -1) id = id + ".png";
    return Ui.$("img").att("src", "img/" + id);
  }

  /**
      Creates a image with border='0' and a 'opacity:0.4'.
      @param {string} id : Image name. If it has not extension, '.png' will be
             used. It must be placed in a directory named 'img'.
      @return {!Domo}
  **/
  static lightImg (id) {
    return Ui.img(id).att("style", "opacity:0.4");
  }

  /**
      Creates a text field which passes focus to another element.
      @param {string} targetId Id of element which will receive the focus.
      @return {!Domo}
  **/
  static field (targetId) {
    return Ui.$("input").att("type", "text")
      .on("keydown", e => {
        if (e.keyCode === 13) {
          e.preventDefault();
          Ui.$("#" + targetId).e.focus();
        }
      });
  }

  /**
      Creates a password field which passes focus to another element.
      @param {string} targetId Id of element which will receive the focus.
      @return {!Domo}
  **/
  static pass (targetId) {
    return Ui.$("input").att("type", "password")
      .on("keydown", e => {
        if (e.keyCode === 13) {
          e.preventDefault();
          Ui.$("#" + targetId).e.focus();
        }
      });
  }

  /**
      Create a link to a function.
      @param {function (MouseEvent)} f Function.
      @return {!Domo}
  **/
  static link (f) {
    return Ui.$("span").att("style", "cursor:pointer").on("click", f);
  }

  /**
      Create a select with list as entries. Every option has an id formed with
      'idPrefix' + "_" + 'its list name' and a name equals to 'idPrefix'.
      Also select widget has name 'idPrefix'.
      @param {string} idPrefix Prefix to make option id.
      @param {!Array<string>} list Entries of select. Default selected is
             marked with '+' (e.g. ["1", "+2", "3"])
      @return {!Domo}
  **/
  static select (idPrefix, list) {

    const /** !Domo */ r = Ui.$("select").att("id", idPrefix);
    It.from(list).each(tx => {
      const op = Ui.$("option");
      if (tx.length > 0 && tx.charAt(0) === "+") {
        tx = tx.substring(1);
        op.att("selected", "true");
      }
      op.text(tx)
        .att("name", idPrefix)
        .att("id", idPrefix + "_" + tx);
      r.e.add(op.e);
    });
    return r;
  }

  /**
      Emits a beep.
      @return {void}
  **/
  static beep () {
    const au = new AudioContext();
    const o = au.createOscillator();
    o.frequency.value = 990;
    o.connect(au.destination);
    o.start(0);
    setTimeout(() => o.stop(0), 80);
  }

  /**
      Shows a image to scroll to top.
      @param {string} img Image name. If it has not extension, '.png' will be
             used. It must be placed in a directory named 'img'.
      @return {!Domo}
  **/
  static upTop (img) {
    return Ui.$("div").style("position: fixed;bottom: 0px;right: 20px")
      .add(Ui.link(() => location.assign("#")).add(Ui.img(img)));
  }

  /**
      Circle with a color.
      @param {string} color Like "#d0ddde" or "rgb(245, 245, 248)".
      @return {!Domo}
  **/
  static led (color) {
    return Ui.$("div")
      .style(
        "padding:5px;" +
         "border: 1px solid #002040;border-radius: 6px;" +
         "background: " + color + ";"
      );
  }

  /**
      Returns x position of mouse in browser window.
      @param {!MouseEvent} evt
      @return {number}
  **/
  static winX (evt) {
    return document.documentElement.scrollLeft +
      document.body.scrollLeft +
      evt.clientX
    ;
  }

  /**
      Returns y position of mouse in browser window.
      @param {!MouseEvent} evt
      @return {number}
  **/
  static winY (evt) {
    return document.documentElement.scrollTop +
      document.body.scrollTop +
      evt.clientY
    ;
  }

}
