import Dec from "./Dec.js";
export default class Rnd {
  static i (n) {
    return Math.floor(Math.random() * (n < 0 ? 0 : n));
  }
  static dec (n1, n2, scale) {
    scale = scale || 0;
    return Dec.rnd(new Dec(n1, scale), new Dec(n2, scale));
  }
}
