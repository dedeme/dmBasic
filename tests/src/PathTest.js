// Copyright 02.Apr-2020 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Test from "./dmjs/Test.js";
import Path from "./dmjs/Path.js";

export default class PathTest {
  static run () {
    const t = new Test("Path");


    t.eq(Path.base("/a/b"), "b");
    t.eq(Path.base("/"), "/");
    t.eq(Path.base(""), ".");
    t.eq(Path.clean("a/c"), "a/c");
    t.eq(Path.clean("a//c"), "a/c");
    t.eq(Path.clean("a/c/."), "a/c");
    t.eq(Path.clean("a/c/b/.."), "a/c");
    t.eq(Path.clean("/../a/c"), "/a/c");
    t.eq(Path.clean("/../a/b/../././/c"), "/a/c");
    t.eq(Path.clean(""), ".");
    t.eq(Path.dir("/a/b/c"), "/a/b");
    t.eq(Path.dir("a/b/c"), "a/b");
    t.eq(Path.dir("/a/"), "/a");
    t.eq(Path.dir("a/"), "a");
    t.eq(Path.dir("/"), "/");
    t.eq(Path.dir(""), ".");
    t.eq(Path.ext("/a/b/c/bar.css"), ".css");
    t.eq(Path.ext("/"), "");
    t.eq(Path.ext(""), "");
    t.yes(Path.isAbs("/dev/null"));
    t.eq(Path.join("a", "b", "c"), "a/b/c");
    t.eq(Path.join("a", "b/c"), "a/b/c");
    t.eq(Path.join("a/b", "c"), "a/b/c");
    t.eq(Path.join("", ""), "");
    t.eq(Path.join("a", ""), "a");
    t.eq(Path.join("", "a"), "a");
    let tp = Path.split("static/myfile.css");
    t.eq(tp.e1, "static/");
    t.eq(tp.e2, "myfile.css");
    tp = Path.split("myfile.css");
    t.eq(tp.e1, "");
    t.eq(tp.e2, "myfile.css");
    tp = Path.split("");
    t.eq(tp.e1, "");
    t.eq(tp.e2, "");

    t.log();
  }
}
