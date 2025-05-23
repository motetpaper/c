// SealChopObject.js
// job  : generates a SealChopObject
// git  : https://github.com/motetpaper/sealchop-js
// lic  : MIT
//

export class SealChopObject {

  // builds default chop, returns this object
  constructor() {
    this.#make();
    return this;
  }

  #hanx   = '姓名字';

  #colorp = '#ffffff';
  #colorb = '#33aa55';
  #colorf = '#ffffff';
  #colori = '#003300';

  #dataUrl = null;

  // sets the name, returns this object
  setName(str) {

    str = str ? str : '姓名字'

    // removes non-Han, non-Hangul, and ASCII characters
    const re = /(\P{Script=Han})(\P{Script=Hangul})([ -~])/gu
    str = str.replace(re, '');

    this.#hanx = str;
    this.#make();

    return this;
  }

  // sets the paper color, returns this object
  setPaperColor(str) {
    this.#colorp = this.#isHexColor(str) ? str : null;
    this.#make();
    return this;
  }

  // sets the background color, returns this object
  setBackgroundColor(str) {
    this.#colorb = this.#isHexColor(str) ? str : null;
    this.#make();
    return this;
  }

  // sets the foreground color, returns this object
  setForegroundColor(str) {
    this.#colorf = this.#isHexColor(str) ? str : null;
    this.#make();
    return this;
  }

  // sets the ink color, returns this object
  setInkColor(str) {
    this.#colori = this.#isHexColor(str) ? str : null;
    this.#make();
    return this;
  }

  // LEGACY FUNCTION, WILL BE REMOVED SOON
  // sets the name, return this object
  setXingMing(str) {
    return this.setName(str);
  }

  // returns an HTML Image element using base64 data
  asImageElement() {
    return `<img src="${this.#dataUrl}">`;
  }


  // returns the JSON object
  asJSON() {
    return {
      p: this.#colorp,
      b: this.#colorb,
      f: this.#colorf,
      i: this.#colori,
      x: this.#hanx,
    }
  }


  // returns the base64 data of this object
  toDataURL() {
    return this.#dataUrl;
  }

  // returns the JSON representation of this object
  toJSON() {
    return JSON.stringify(this.asJSON(), null, 2);
  }

  // returns the JSON representation of this object
  toString() {
    return this.toJSON();
  }

  // returns true if string is hashed six-digit hex color
  // otherwise, returns false
  #isHexColor(str) {
    const re = /^#[A-Fa-f0-9]{6}$/
    return !!re.test(str);
  }

  // builds the chop
  #make() {

    const [ w, h ] = [ 1000, 1000 ];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = w;
    canvas.height = h;

    // background rounded rectangle radius
    const br = 125;
    // foreground rounded rectangle radius
    const fr = 50;


    // default values
    // get custom values from YAML

    // name or character
    // e.g., 姓名字
    // set name or use default name
    const xm    = this.#hanx ?? '姓名字';

    // set color or use default color
    const ppr   = this.#colorp ?? '#ffffff';
    const bgc   = this.#colorb ?? '#33aa55';
    const fgc   = this.#colorf ?? '#ffffff';
    const ink   = this.#colori ?? '#003300';


    // p - paper area
    ctx.beginPath();
    ctx.fillStyle = ppr;

    ctx.fillRect(0, 0, w, h);


    // b - background area
    ctx.beginPath();
    ctx.fillStyle = bgc;

    ctx.roundRect(0, 0, w, h, [br]);
    ctx.fill();


    // dims for the foreground area and ink area
    let dims = [];
    const xmarr = xm.split('');

    switch(xmarr.length) {
      case 1:
        // one character seal chop
        dims = [
          { x: 100, y: 100, w: 800, h: 800, r: fr , fx: 200, fy: 700, fs: 400 }
        ];
        break;
      case 2:
        // two character seal chop
        dims = [
          { x: 50, y: 100, w: 450, h: 800, r: fr , fx: 55, fy: 700, fs: 300 },
          { x: 550, y: 250, w: 400, h: 500, r: fr , fx: 625, fy: 625, fs: 200 }
        ];
        break;
      case 4:
        // four character seal chop
        dims = [
          { x: 50, y: 50, w: 400, h: 400, r: fr , fx: 125, fy: 350, fs: 200 },
          { x: 550, y: 50, w: 400, h: 400, r: fr , fx: 625, fy: 350, fs: 200 },
          { x: 550, y: 550, w: 400, h: 400, r: fr , fx: 625, fy: 850, fs: 200 },
          { x: 50, y: 550, w: 400, h: 400, r: fr , fx: 125, fy: 850, fs: 200 }
        ];
        break;
      default:
        // three character seal chop
        dims = [
          { x: 50, y: 200, w: 450, h: 600, r: fr , fx: 75, fy: 675, fs: 300 },
          { x: 550, y: 50, w: 400, h: 400, r: fr , fx: 625, fy: 350, fs: 200 },
          { x: 550, y: 550, w: 400, h: 400, r: fr , fx: 625, fy: 850, fs: 200 }
        ];
        break;
    }

    for(let i = 0; i < dims.length; i++) {


      // f - foreground area
      ctx.beginPath();
      ctx.strokeStyle = fgc;
      ctx.fillStyle = fgc;
      ctx.lineWidth = 4;

      ctx.roundRect(dims[i].x, dims[i].y,
        dims[i].w, dims[i].h, [ dims[i].r ]);
      ctx.stroke();
      ctx.fill();


      // ink area
      ctx.beginPath();
      ctx.fillStyle = ink;

      ctx.font = `${dims[i].fs}pt bold`;
      ctx.fillText(xmarr[i], dims[i].fx, dims[i].fy);
    }

    /// CONTEXT AREA ENDS

    this.#dataUrl = canvas.toDataURL()
  }
}
