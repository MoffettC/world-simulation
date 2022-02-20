import { rgb2lab, lab2rgb, deltaE } from 'rgb-lab';
import {Constants} from '../utils/Constants.jsx';

function log(b, n) {
    return Math.log(n) / Math.log(b);
}

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const getRandomFloatInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min; //The maximum is inclusive and the minimum is inclusive
}
/* 
    https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    Box–Muller transform for normal dist numbers, 
    0 < x < 1 = skew right
    1 = no skew
    1 < x = skew left
*/
const normalDist_bm = (min, max, skew) => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) 
      num = normalDist_bm(min, max, skew) // resample between 0 and 1 if out of range
    
    else{
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    return num
  }

  const findColorDiff = (r1, g1, b1, r2, g2, b2) => {
    return deltaE(rgb2lab([r1, g1, b1]), rgb2lab([r2, g2, b2]));
}

const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

const getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return hexToRgb(color);
}

const randomLand = () => {
        // let val = getRandomIntInclusive(1, 99);
        let val = normalDist_bm(1, 100, 1.05)
        if (val < 50) {
            return hexToRgb('#b6d2fb'); //light blue
        } else {
            return hexToRgb('3caa13'); //dark green
        }
}

const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}


export const MathUtils = {
    findColorDiff,
    log,
    shuffle,
    randomLand,
    getRandomColor,
    rgbToHex,
    normalDist_bm,
    getRandomFloatInclusive,
    getRandomIntInclusive,
} 