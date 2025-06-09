//
// app.js
// job    :
// git    : https://github.com/motetpaper/chop9
// lic    : MIT
//
//
//
//
//
import { SealChopObject } from './obj/SealChopObject.js'
import { GridsObject } from './obj/GridsObject.js';

window.jspdf = jspdf.jsPDF;

// the chop object
const chop = new SealChopObject();

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
        case 'copybtn':
//          copythat(evt);
          break;
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

      const tmp = evt.target.innerText;
      evt.target.innerText = 'SAVED!'
      setTimeout(function(){
        evt.target.innerText = tmp;
      }, 1500);
      console.log( '[app.js] chop saved!' );
    });
}


async function copythat(evt) {
  navigator.clipboard.writeText( img.src ).then(() => {
    const tmp = evt.target.innerText;
    evt.target.innerText = 'COPIED!'
    setTimeout(function(){
      evt.target.innerText = tmp;
    }, 1500);
    console.log( '[app.js] chop copied!' );
  });
}

  // EXPERIMENTAL, creates tianzige paper with chop
  async function save_paper(evt) {

    const doc = new jspdf();

    // grid box (sq, tzg, mzg)
    const boximg = GridsObject.tzg({
      size: 300,
    })

    const chopimg = localStorage.getItem('chopimg');

    for(let i = 1; i < 15; i++) {
      for(let j = 1; j < 11; j++) {
        if(i < 3 && j > 8) {
            // four squares in upper right corner
            if( i === 1 && j === 9) {
              doc.addImage(chopimg,'PNG',j*18,i*18,33,33);
            }
        } else {

            // the rest of the grid
            doc.addImage(boximg,'PNG',j*18,i*18,15,15);
        }
     }
    }

    doc.save('motetpaper-tianzige-chop.pdf')


    const tmp = evt.target.innerText;
      evt.target.innerText = 'SAVED!'
      setTimeout(function(){
        evt.target.innerText = tmp;
      }, 1500);
    console.log( '[app.js] paper saved!' );
  }