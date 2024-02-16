import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import PressStartFont from "../assets/fonts/press_start.json";

const pressStartFont = new FontLoader().parse(PressStartFont);

const fonts = {
  pressStart: pressStartFont,
};

export default fonts;
