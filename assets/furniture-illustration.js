/*
  Furniture illustration — Sheen Upholstery
  Draws a simple picture of a piece (sofa, armchair, headboard, footstool) in a
  chosen fabric colour, with a light texture hint for the fabric family.
  Used by sections/furniture-configurator.liquid when a colour has no photos yet.

  window.SheenFurnitureIllustration.render({ kind, colour, family }) → data: URI (SVG)
  window.SheenFurnitureIllustration.kindFor(productType)            → 'sofa' | 'curved-sofa' | 'armchair' | 'tub-chair' | 'headboard' | 'footstool'
*/
(function () {
  function clamp(n) { return Math.max(0, Math.min(255, Math.round(n))); }
  function parseHex(hex) {
    var h = String(hex || '').replace('#', '').trim();
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-fA-F]{6}$/.test(h)) h = 'B9AE9C';
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function toHex(rgb) { return '#' + rgb.map(function (v) { return ('0' + clamp(v).toString(16)).slice(-2); }).join(''); }
  // amt > 0 lightens towards white, amt < 0 darkens towards black
  function shade(hex, amt) {
    var c = parseHex(hex);
    return toHex(c.map(function (v) { return amt >= 0 ? v + (255 - v) * amt : v * (1 + amt); }));
  }
  function luminance(hex) {
    var c = parseHex(hex);
    return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
  }

  function kindFor(type) {
    var t = String(type || '').toLowerCase();
    if (t.indexOf('headboard') > -1) return 'headboard';
    if (t.indexOf('curved') > -1) return 'curved-sofa';
    if (t.indexOf('tub') > -1 || t.indexOf('barrel') > -1) return 'tub-chair';
    if (t.indexOf('footstool') > -1 || t.indexOf('ottoman') > -1 || t.indexOf('pouf') > -1) return 'footstool';
    if (t.indexOf('armchair') > -1 || t.indexOf('chair') > -1) return 'armchair';
    return 'sofa';
  }

  // Texture overlay per fabric family (drawn on top of the fabric colour)
  function texture(family, base) {
    var f = String(family || '').toLowerCase();
    var light = luminance(base) < 0.35;
    var ink = light ? '#ffffff' : '#000000';
    if (f.indexOf('velvet') > -1 || f.indexOf('chenille') > -1) {
      return '<linearGradient id="tex" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>' +
        '<stop offset=".7" stop-color="#000" stop-opacity=".10"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>';
    }
    if (f.indexOf('boucl') > -1 || f.indexOf('teddy') > -1) {
      return '<pattern id="tex" width="9" height="9" patternUnits="userSpaceOnUse">' +
        '<circle cx="2.5" cy="2.5" r="1.6" fill="none" stroke="' + ink + '" stroke-opacity=".16" stroke-width="1"/>' +
        '<circle cx="7" cy="6.5" r="1.4" fill="none" stroke="' + ink + '" stroke-opacity=".12" stroke-width="1"/></pattern>';
    }
    if (f.indexOf('herringbone') > -1) {
      return '<pattern id="tex" width="12" height="12" patternUnits="userSpaceOnUse">' +
        '<path d="M0 12 L6 0 L12 12" fill="none" stroke="' + ink + '" stroke-opacity=".13" stroke-width="1.3"/></pattern>';
    }
    if (f.indexOf('twill') > -1) {
      return '<pattern id="tex" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">' +
        '<line x1="0" y1="0" x2="0" y2="8" stroke="' + ink + '" stroke-opacity=".12" stroke-width="2"/></pattern>';
    }
    // linen, cotton, plain, commercial texture: a fine weave
    return '<pattern id="tex" width="6" height="6" patternUnits="userSpaceOnUse">' +
      '<path d="M0 3 H6 M3 0 V6" stroke="' + ink + '" stroke-opacity=".08" stroke-width="1"/></pattern>';
  }

  // Shapes are drawn on an 800 × 700 canvas (the product stage is 8:7)
  function piece(kind, c) {
    var main = c, dark = shade(c, -0.18), darker = shade(c, -0.3), lite = shade(c, 0.12);
    var leg = '#5b4636';
    var t = 'fill="url(#tex)"';
    function r(x, y, w, h, rx, fill) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + fill + '"/>' +
             '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" ' + t + '/>';
    }
    function pth(d, fill) {
      return '<path d="' + d + '" fill="' + fill + '"/><path d="' + d + '" ' + t + '/>';
    }
    if (kind === 'curved-sofa') {
      return pth('M100 470 A300 240 0 0 1 700 470 Z', dark) +            // curved back, outer
        pth('M165 470 A235 175 0 0 1 635 470 Z', main) +                 // inner back
        pth('M225 470 A175 80 0 0 1 575 470 Z', lite) +                  // seat
        r(100, 440, 600, 112, 56, main) +                                // rounded front
        '<rect x="130" y="546" width="540" height="14" rx="7" fill="' + leg + '"/>';
    }
    if (kind === 'tub-chair') {
      return pth('M245 455 A155 215 0 0 1 555 455 Z', dark) +            // wraparound back
        pth('M290 455 A110 165 0 0 1 510 455 Z', main) +                 // inner back
        r(290, 405, 220, 58, 28, lite) +                                 // seat cushion
        r(245, 430, 310, 118, 58, main) +                                // rounded front
        '<rect x="272" y="540" width="14" height="40" rx="4" fill="' + leg + '"/><rect x="514" y="540" width="14" height="40" rx="4" fill="' + leg + '"/>';
    }
    if (kind === 'headboard') {
      var hb = r(190, 150, 420, 300, 18, main);
      for (var i = 1; i < 7; i++) {
        var x = 190 + i * 60;
        hb += '<line x1="' + x + '" y1="166" x2="' + x + '" y2="434" stroke="' + darker + '" stroke-opacity=".45" stroke-width="3"/>';
      }
      hb += '<rect x="150" y="430" width="500" height="80" rx="10" fill="#f4f1ec"/>' +
            '<rect x="150" y="430" width="500" height="18" rx="9" fill="#e7e2da"/>' +
            '<rect x="215" y="398" width="160" height="50" rx="22" fill="#fbfaf8"/>' +
            '<rect x="425" y="398" width="160" height="50" rx="22" fill="#fbfaf8"/>' +
            r(150, 505, 500, 70, 8, dark) +
            '<rect x="170" y="575" width="16" height="30" fill="' + leg + '"/><rect x="614" y="575" width="16" height="30" fill="' + leg + '"/>';
      return hb;
    }
    if (kind === 'footstool') {
      return r(240, 360, 320, 150, 26, main) + r(240, 470, 320, 40, 14, dark) +
        '<rect x="262" y="508" width="14" height="70" rx="4" fill="' + leg + '"/><rect x="524" y="508" width="14" height="70" rx="4" fill="' + leg + '"/>';
    }
    if (kind === 'armchair') {
      return r(240, 210, 320, 230, 40, dark) +            // back
        r(275, 400, 250, 70, 22, lite) +                     // seat cushion
        r(195, 300, 85, 230, 38, main) +                     // left arm
        r(520, 300, 85, 230, 38, main) +                     // right arm
        r(250, 455, 300, 75, 16, main) +                     // base
        '<rect x="222" y="528" width="14" height="72" rx="4" fill="' + leg + '"/><rect x="564" y="528" width="14" height="72" rx="4" fill="' + leg + '"/>';
    }
    // sofa
    return r(140, 230, 520, 200, 40, dark) +                 // back
      r(205, 275, 125, 120, 28, main) + r(338, 275, 125, 120, 28, main) + r(470, 275, 125, 120, 28, main) + // back cushions
      r(185, 385, 145, 72, 22, lite) + r(328, 385, 145, 72, 22, lite) + r(471, 385, 145, 72, 22, lite) + // seat cushions
      r(95, 300, 90, 230, 38, main) + r(615, 300, 90, 230, 38, main) +   // arms
      r(150, 450, 500, 80, 16, main) +                       // base
      '<rect x="125" y="528" width="14" height="72" rx="4" fill="' + leg + '"/><rect x="661" y="528" width="14" height="72" rx="4" fill="' + leg + '"/>';
  }

  function render(opts) {
    var colour = toHex(parseHex(opts && opts.colour));
    var kind = (opts && opts.kind) || 'sofa';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 700" width="800" height="700">' +
      '<defs>' + texture(opts && opts.family, colour) +
      '<radialGradient id="shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="700" fill="#efebe5"/>' +
      '<rect y="560" width="800" height="140" fill="#e2dcd2"/>' +
      '<ellipse cx="400" cy="600" rx="330" ry="26" fill="url(#shadow)"/>' +
      piece(kind, colour) +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  window.SheenFurnitureIllustration = { render: render, kindFor: kindFor, shade: shade };
})();
