//
// grids.js
// job    : create chinese practice paper grid patterns
// git    : https://github.com/motetpaper/grids-js
// lic    : MIT
//
//
// This object only contains STATIC methods.
// Given a parameter object, each method returns a data URL
//
export class GridsObject {

  // returns mizige grid as PNG data URL
  static mzg(obj) {

    const default_size = 300;
    const default_color = 'red';
    const default_dashcolor = 'red';

    // default object
    obj = obj ?? {
      size: default_size,
      color: default_color,
      dashColor: default_dashcolor,
    }

    const size = +obj.size ?? default_size;
    const color = obj.color ?? default_color;
    const dashcolor = obj.dashColor ?? default_dashcolor;

    const canvas = document.createElement('canvas');
    const [ w, h ] = [ size, size ];

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');


    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,w,h);

    ctx.beginPath();

    // guidelines for the grid, diagonals and midpoints

    ctx.setLineDash([50,25]);
    ctx.lineWidth = 10;
    ctx.strokeStyle = dashcolor;

    ctx.moveTo(0,0);
    ctx.lineTo(size,size);
    ctx.stroke();

    ctx.moveTo(size,0);
    ctx.lineTo(0,size);
    ctx.stroke();

    ctx.moveTo(size/2,0);
    ctx.lineTo(size/2,size);
    ctx.stroke();

    ctx.moveTo(0,size/2);
    ctx.lineTo(size,size/2);
    ctx.stroke();

    // box border
    ctx.lineWidth = 20;
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.strokeRect(0, 0, w, h);

    return canvas.toDataURL();
  }


  // returns tianzige grid as PNG data URL
  static tzg(obj) {

    const default_size = 225;
    const default_color = 'black';
    const default_dashcolor = '#cccccc';

    // default object
    obj = obj ?? {
      size: default_size,
    }

    const size = +obj.size ?? default_size;
    const color = obj.color ?? default_color;
    const dashcolor = obj.dashColor ?? default_dashcolor;

    const canvas = document.createElement('canvas');
    const [ w, h ] = [ size, size ];

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');


    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,w,h);

    ctx.beginPath();

    // guidelines for the grid, midpoints

    ctx.setLineDash([50,25]);
    ctx.lineWidth = 8;
    ctx.strokeStyle = dashcolor;

    ctx.moveTo(size/2,0);
    ctx.lineTo(size/2,size);
    ctx.stroke();

    ctx.moveTo(0,size/2);
    ctx.lineTo(size,size/2);
    ctx.stroke();

    // box border
    ctx.lineWidth = 20;
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.strokeRect(0, 0, w, h);

    return canvas.toDataURL();
  }

  // returns square grid as PNG data URL
  static sq(obj) {

    const default_size = 150;
    const default_color = 'black';

    // default object
    obj = obj ?? {
      size: default_size,
    }

    const size = +obj.size ?? default_size;
    const color = obj.color ?? default_color;

    const canvas = document.createElement('canvas');
    const [ w, h ] = [ size, size ];

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,w,h);

    ctx.beginPath();

    // no guide lines for this grid

    // box border
    ctx.lineWidth = 20;
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.strokeRect(0, 0, w, h);

    return canvas.toDataURL();
  }
}
