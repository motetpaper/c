//
// app.js
// job    : makes a personal seal chop
// job    : makes custom printable paper with the chop
// git    : https://github.com/motetpaper/c
// lic    : MIT
//
//
//
//
import { SealChopObject } from './obj/SealChopObject.js'
import { GridsObject } from './obj/GridsObject.js';

// keeps namespace clear and predictable
window.jspdf = jspdf.jsPDF;

// the chop object
const chop = new SealChopObject();

// branding for digital paper products
const branding = 'MOTETPAPER © 2025, <https://chop.ink>';

// parameters (params) collected in built-in browser object
let params = new URLSearchParams();

// buttons
const btns = document.querySelectorAll('button');

// the color boxes
const colors = document.querySelectorAll('input[type=color]');

// the text input box
const xm = document.querySelector('#xm');

// the preview image
const img = document.querySelector('#preview');

// when loaded, replace placeholder with actual rendered image
document.addEventListener('DOMContentLoaded', (evt)=>{
  upd();
});

// removes non-Han characters from text input box
[ 'keyup', 'change', 'input' ].forEach((t)=>{
  xm.addEventListener(t, (evt)=>{
    evt.target.value = cleantext(evt.target.value);
    upd();
  });
});

// input event fires when a color is selected
// change event fires when the color dialog is dismissed
[ 'input', 'change' ].forEach((t)=>{
  colors.forEach((c)=>{
    c.addEventListener(t, (evt)=>{
      upd();
    });
  });
});


[ 'click' ].forEach((t)=>{
  btns.forEach((b)=>{
    b.addEventListener(t, (evt)=>{
      switch(evt.target.id) {
        case 'savebtn':
          savethat(evt);
          break;
        case 'printbtn':
          save_paper(evt);
          break;
        default:
          // nothing
          break;
      }
    });
  });
});


// refreshes the chop preview
async function upd() {

  // iterate through all color boxes
  // to obtain the color params
  colors.forEach((c)=>{
    params.set(c.name, c.value);
  });

  params.set(xm.name, xm.value);

  // build a fresh chop with new params
  chop.setPaperColor(params.get('p'))
    .setBackgroundColor(params.get('b'))
    .setForegroundColor(params.get('f'))
    .setInkColor(params.get('i'))
    .setName(params.get('x'));

  // display the chop in the image element
  img.src = chop.toDataURL();
  localStorage.setItem('chopimg', img.src);

  // update the text box to match the foreground/ink colors
  xm.style.color = chop.asJSON().i;
  xm.style.background = chop.asJSON().f;
}

// 姓名字
// 도장도장

// returns cleaned text
function cleantext(str) {

  // ASCII, read as "from SPACE to TILDE"
  const re_ascii = /[ -~]|\w/ig

  // Han or Hangul, two different Unicode ranges
  const re_han_hangul = /(\p{Script=Han})|(\p{Script=Hangul})/gu

  // removes ASCII characters
  str = str.replace(re_ascii,'').trim();

  return str ? str.match(re_han_hangul).slice(0,4).join('') : '';

}

// saves a PNG to desktop or mobile device
async function savethat(evt) {

  // uses the Data URI in IMAGE element
  // to extract the blob information
  fetch(img.src)
    .then((r)=>r.blob())
    .then((b)=>{

      const xm = params.get('x');
      const url = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = url;
      a.download = `motetpaper-chop.png`;
      a.click();

      console.log( '[app.js] chop saved!' );

      const tmp = evt.target.innerText;
      evt.target.innerText = 'SAVED!'
      setTimeout(function(){
        evt.target.innerText = tmp;
      }, 1500);

    });
}


// EXPERIMENTAL, creates tianzige paper with chop
async function save_paper(evt) {

  // create new jsPDF instance using inches
  const doc = new jspdf({
    unit: 'in'
  });

  // grid box (sq, tzg, mzg)
  // tzg (size is matter of clarity, now functoin)
  const boximg = GridsObject.tzg({
    size: 300,
  })

  const chopimg = localStorage.getItem('chopimg');

  // default tzg box size
  const bx = 0.75;

  // margins around the paper
  const margin = 0.5;

  // spaces (distance) between the boxes
  const dx = 0.125;

  // page dims
  const w = doc.getPageWidth();
  const h = doc.getPageHeight();

  // initials and finals
  const xi = margin;
  const yi = margin;
  const xf = w - margin;
  const yf = h - margin;

  // paper print offset
  const yoffset = bx;

  // chop pocket dims
  const cx = bx * 2 + dx;
  const xpocket = xf - cx - (bx / 2);
  const ypocket = yi + yoffset;

  // for loops that draw boxes within the margins
  for(let y = yi+yoffset; y < (yf-bx); y+=(bx+dx)) {
    for(let x = xi; x < (xf-bx); x+=(bx+dx)) {
      doc.addImage(boximg,'PNG', x, y, bx, bx);
    }
  }

  // put a big outline rectangle behind the chop
  // covers the four corner boxes in the pocket
  doc.setDrawColor('white')
  doc.rect(xpocket,ypocket,cx,cx);

  // add the chop to the pocket
  doc.addImage(chopimg,'PNG',xpocket, ypocket, cx, cx);

  // add branding
  doc.text(xi,yf+dx, branding)

  // work complete
  doc.save('motetpaper-tianzige-chop.pdf');

  console.log( '[app.js] paper saved!' );

  const tmp = evt.target.innerText;
    evt.target.innerText = 'SAVED!'
    setTimeout(function(){
      evt.target.innerText = tmp;
    }, 1500);
}
