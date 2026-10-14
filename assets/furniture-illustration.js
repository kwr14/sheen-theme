/*
  Furniture illustration — Sheen Upholstery
  Draws a simple picture of a piece (sofa, armchair, headboard, footstool) in a
  chosen fabric colour, with a light texture hint for the fabric family.
  Used by sections/furniture-configurator.liquid when a colour has no photos yet.

  window.SheenFurnitureIllustration.render({ kind, colour, family }) → data: URI (SVG)
  window.SheenFurnitureIllustration.kindFor(productType)            → a drawing kind, e.g. 'sofa', 'curved-sofa',
      'modular-sofa', 'roll-arm-sofa', 'armchair', 'tub-chair', 'swivel-chair', 'wingback-chair', 'headboard',
      'scalloped-headboard', 'wing-headboard', 'footstool', 'storage-ottoman', 'round-footstool', 'bench-footstool',
      'pencil-pleat', 'wave-curtain', 'pinch-pleat', 'roman-blind', 'roller-blind', 'austrian-blind'
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
    function has(w) { return t.indexOf(w) > -1; }
    if (has('headboard')) {
      if (has('scallop') || has('arch')) return 'scalloped-headboard';
      if (has('wing')) return 'wing-headboard';
      return 'headboard';
    }
    if (has('curtain')) {
      if (has('wave')) return 'wave-curtain';
      if (has('pinch') || has('euro')) return 'pinch-pleat';
      return 'pencil-pleat';
    }
    if (has('blind')) {
      if (has('roller')) return 'roller-blind';
      if (has('austrian')) return 'austrian-blind';
      return 'roman-blind';
    }
    if (has('footstool') || has('ottoman') || has('pouf')) {
      if (has('round') || has('drum') || has('pouf')) return 'round-footstool';
      if (has('bench')) return 'bench-footstool';
      if (has('storage')) return 'storage-ottoman';
      return 'footstool';
    }
    if (has('curved')) return 'curved-sofa';
    if (has('tub') || has('barrel')) return 'tub-chair';
    if (has('swivel')) return 'swivel-chair';
    if (has('wingback')) return 'wingback-chair';
    if (has('armchair') || has('chair')) return 'armchair';
    if (has('modular') || has('corner')) return 'modular-sofa';
    if (has('roll-arm') || has('roll arm')) return 'roll-arm-sofa';
    return 'sofa';
  }

  // Style drawings (from the Sheen Style Shortlist), 400 x 300, drawn at 2x.
  // @@n@@ = the fabric colour shaded by n (see shade()).
  var STYLE_TPL = {
    'modular-sofa': '<ellipse cx="200" cy="248" rx="175" ry="10" fill="#000" opacity=".08"/> <rect x="36" y="128" width="248" height="66" rx="10" fill="@@0.0@@"/> <rect x="44" y="140" width="76" height="52" rx="12" fill="@@0.13@@"/><rect x="124" y="140" width="76" height="52" rx="12" fill="@@0.13@@"/><rect x="204" y="140" width="76" height="52" rx="12" fill="@@0.13@@"/> <rect x="36" y="188" width="248" height="44" rx="8" fill="@@0.223@@"/> <line x1="119" y1="190" x2="119" y2="230" stroke="@@0.0@@" stroke-width="2"/><line x1="201" y1="190" x2="201" y2="230" stroke="@@0.0@@" stroke-width="2"/> <rect x="280" y="128" width="86" height="66" rx="10" fill="@@0.0@@"/> <rect x="280" y="176" width="86" height="64" rx="8" fill="@@0.329@@"/> <rect x="36" y="228" width="330" height="8" fill="#5f5a50"/>',
    'roll-arm-sofa': '<ellipse cx="200" cy="248" rx="160" ry="10" fill="#000" opacity=".08"/> <path d="M70 118 Q200 96 330 118 L330 190 L70 190 Z" fill="@@0.0@@"/> <rect x="88" y="168" width="110" height="34" rx="14" fill="@@0.236@@"/><rect x="202" y="168" width="110" height="34" rx="14" fill="@@0.236@@"/> <rect x="44" y="160" width="54" height="64" rx="8" fill="@@0.0@@"/><ellipse cx="71" cy="160" rx="31" ry="20" fill="@@0.172@@"/> <rect x="302" y="160" width="54" height="64" rx="8" fill="@@0.0@@"/><ellipse cx="329" cy="160" rx="31" ry="20" fill="@@0.172@@"/> <rect x="70" y="200" width="260" height="26" rx="4" fill="@@-0.079@@"/> <path d="M60 224 h14 l-3 14 h-8 z M326 224 h14 l-3 14 h-8 z M150 226 h12 l-2 12 h-8 z M238 226 h12 l-2 12 h-8 z" fill="#5b4636"/> <circle cx="66" cy="240" r="3" fill="#a88b56"/><circle cx="334" cy="240" r="3" fill="#a88b56"/>',
    'swivel-chair': ' <path d="M120 186 C116 112, 284 112, 280 186 Z" fill="@@0.0@@"/> <rect x="114" y="166" width="172" height="42" rx="20" fill="@@0.107@@"/> <rect x="128" y="160" width="144" height="26" rx="12" fill="@@0.211@@"/> <rect x="194" y="206" width="12" height="22" fill="#6d6a64"/> <ellipse cx="200" cy="232" rx="58" ry="9" fill="#6d6a64"/>',
    'wingback-chair': '<ellipse cx="200" cy="246" rx="95" ry="9" fill="#000" opacity=".08"/> <path d="M150 70 Q200 58 250 70 L254 180 L146 180 Z" fill="@@0.0@@"/> <path d="M146 92 Q118 96 120 140 L128 176 L150 176 L150 96 Z" fill="@@-0.136@@"/> <path d="M254 92 Q282 96 280 140 L272 176 L250 176 L250 96 Z" fill="@@-0.136@@"/> <rect x="120" y="150" width="34" height="62" rx="10" fill="@@0.0@@"/><rect x="246" y="150" width="34" height="62" rx="10" fill="@@0.0@@"/> <rect x="150" y="168" width="100" height="30" rx="10" fill="@@0.083@@"/> <rect x="124" y="196" width="152" height="24" rx="4" fill="@@-0.136@@"/> <path d="M132 220 h10 l-2 18 h-6 z M258 220 h10 l-2 18 h-6 z" fill="#5b4636"/>',
    'scalloped-headboard': ' <path d="M100 210 L100 92 Q100 70 122 70 Q144 50 166 70 Q188 50 210 70 Q232 50 254 70 Q276 50 298 70 Q300 70 300 92 L300 210 Z" fill="@@0.0@@"/> <path d="M112 206 L112 98 Q112 84 126 84 Q144 68 166 84 Q188 68 210 84 Q232 68 254 84 Q274 68 286 84 Q288 84 288 98 L288 206 Z" fill="@@0.157@@"/> <rect x="78" y="190" width="244" height="30" rx="6" fill="#f4f1ec"/><rect x="112" y="172" width="78" height="26" rx="12" fill="#fbfaf8"/><rect x="210" y="172" width="78" height="26" rx="12" fill="#fbfaf8"/> <rect x="78" y="216" width="244" height="18" rx="4" fill="@@-0.089@@"/>',
    'wing-headboard': ' <rect x="118" y="56" width="164" height="156" rx="10" fill="@@0.108@@"/> <path d="M118 66 L82 82 L82 212 L118 212 Z" fill="@@0.0@@"/> <path d="M282 66 L318 82 L318 212 L282 212 Z" fill="@@0.0@@"/> <rect x="78" y="190" width="244" height="30" rx="6" fill="#f4f1ec"/><rect x="112" y="172" width="78" height="26" rx="12" fill="#fbfaf8"/><rect x="210" y="172" width="78" height="26" rx="12" fill="#fbfaf8"/> <rect x="78" y="216" width="244" height="18" rx="4" fill="@@-0.094@@"/>',
    'storage-ottoman': '<ellipse cx="200" cy="244" rx="130" ry="9" fill="#000" opacity=".08"/> <rect x="80" y="132" width="240" height="30" rx="10" fill="@@0.0@@"/> <rect x="84" y="160" width="232" height="66" rx="6" fill="@@-0.097@@"/> <line x1="84" y1="162" x2="316" y2="162" stroke="@@-0.242@@" stroke-width="3"/> <rect x="84" y="224" width="232" height="10" fill="#5b4636"/>',
    'round-footstool': '<ellipse cx="200" cy="244" rx="88" ry="9" fill="#000" opacity=".08"/> <rect x="120" y="150" width="160" height="80" fill="@@0.0@@"/> <ellipse cx="200" cy="230" rx="80" ry="14" fill="@@0.0@@"/> <ellipse cx="200" cy="150" rx="80" ry="18" fill="@@0.099@@"/> <path d="M120 160 Q200 180 280 160" stroke="@@-0.187@@" stroke-width="2" fill="none"/>',
    'bench-footstool': '<ellipse cx="200" cy="246" rx="150" ry="8" fill="#000" opacity=".07"/> <rect x="62" y="160" width="276" height="44" rx="14" fill="@@0.0@@"/> <g fill="@@-0.176@@"><circle cx="110" cy="176" r="3"/><circle cx="160" cy="176" r="3"/><circle cx="210" cy="176" r="3"/><circle cx="260" cy="176" r="3"/><circle cx="135" cy="190" r="3"/><circle cx="185" cy="190" r="3"/><circle cx="235" cy="190" r="3"/><circle cx="290" cy="176" r="3"/></g> <rect x="66" y="200" width="268" height="12" rx="3" fill="@@-0.107@@"/> <path d="M78 210 h12 l-2 30 h-8 z M310 210 h12 l-2 30 h-8 z" fill="#5b4636"/>',
    'pencil-pleat': ' <rect x="120" y="50" width="160" height="200" fill="#dfe7ec"/><line x1="200" y1="50" x2="200" y2="250" stroke="#f6f3ee" stroke-width="6"/> <line x1="40" y1="40" x2="360" y2="40" stroke="#6d6a64" stroke-width="5" stroke-linecap="round"/> <rect x="52" y="44" width="92" height="214" fill="@@0.0@@"/><rect x="256" y="44" width="92" height="214" fill="@@0.0@@"/> <g stroke="@@-0.171@@" stroke-width="2"><path d="M58 46 v210 M66 46 v210 M74 46 v210 M82 46 v210 M90 46 v210 M98 46 v210 M106 46 v210 M114 46 v210 M122 46 v210 M130 46 v210 M138 46 v210 M262 46 v210 M270 46 v210 M278 46 v210 M286 46 v210 M294 46 v210 M302 46 v210 M310 46 v210 M318 46 v210 M326 46 v210 M334 46 v210 M342 46 v210"/></g> <rect x="52" y="44" width="92" height="12" fill="@@-0.088@@"/><rect x="256" y="44" width="92" height="12" fill="@@-0.088@@"/>',
    'wave-curtain': ' <rect x="120" y="50" width="160" height="200" fill="#dfe7ec"/><line x1="200" y1="50" x2="200" y2="250" stroke="#f6f3ee" stroke-width="6"/> <line x1="40" y1="40" x2="360" y2="40" stroke="#6d6a64" stroke-width="5" stroke-linecap="round"/> <path d="M50 44 q12 10 24 0 q12 -10 24 0 q12 10 24 0 q12 -10 24 0 V258 q-12 6 -24 0 q-12 -6 -24 0 q-12 6 -24 0 q-12 -6 -24 0 Z" fill="@@0.0@@"/> <path d="M254 44 q12 10 24 0 q12 -10 24 0 q12 10 24 0 q12 -10 24 0 V258 q-12 6 -24 0 q-12 -6 -24 0 q-12 6 -24 0 q-12 -6 -24 0 Z" fill="@@0.0@@"/> <g stroke="@@-0.119@@" stroke-width="10" opacity=".55"><path d="M62 52 V256 M110 52 V256 M266 52 V256 M314 52 V256"/></g>',
    'pinch-pleat': ' <rect x="120" y="50" width="160" height="200" fill="#dfe7ec"/><line x1="200" y1="50" x2="200" y2="250" stroke="#f6f3ee" stroke-width="6"/> <line x1="40" y1="40" x2="360" y2="40" stroke="#5b4636" stroke-width="6" stroke-linecap="round"/> <path d="M52 44 H144 V250 Q120 262 98 250 Q76 262 52 250 Z" fill="@@0.0@@"/> <path d="M256 44 H348 V250 Q324 262 302 250 Q280 262 256 250 Z" fill="@@0.0@@"/> <g fill="@@-0.142@@"><path d="M62 44 h10 l-3 26 h-4 z M90 44 h10 l-3 26 h-4 z M118 44 h10 l-3 26 h-4 z M266 44 h10 l-3 26 h-4 z M294 44 h10 l-3 26 h-4 z M322 44 h10 l-3 26 h-4 z"/></g> <g stroke="@@-0.142@@" stroke-width="2" opacity=".7"><path d="M67 70 V250 M95 70 V250 M123 70 V250 M271 70 V250 M299 70 V250 M327 70 V250"/></g>',
    'roman-blind': ' <rect x="100" y="40" width="200" height="220" fill="#f6f3ee"/><rect x="110" y="50" width="180" height="200" fill="#dfe7ec"/> <rect x="110" y="50" width="180" height="40" fill="@@0.0@@"/> <path d="M110 90 h180 v10 q-90 14 -180 0 z" fill="@@-0.121@@"/> <path d="M110 104 h180 v10 q-90 14 -180 0 z" fill="@@0.0@@"/> <path d="M110 118 h180 v12 q-90 16 -180 0 z" fill="@@-0.121@@"/> <path d="M110 134 h180 v12 q-90 16 -180 0 z" fill="@@0.0@@"/> <line x1="110" y1="50" x2="290" y2="50" stroke="#5f5a50" stroke-width="4"/>',
    'roller-blind': ' <rect x="100" y="40" width="200" height="220" fill="#f6f3ee"/><rect x="110" y="50" width="180" height="200" fill="#dfe7ec"/> <rect x="104" y="42" width="192" height="12" rx="6" fill="#8f8a80"/> <rect x="112" y="54" width="176" height="120" fill="@@0.0@@"/> <rect x="110" y="172" width="180" height="6" rx="3" fill="#8f8a80"/> <circle cx="200" cy="186" r="5" fill="none" stroke="#8f8a80" stroke-width="2"/>',
    'austrian-blind': ' <rect x="100" y="40" width="200" height="220" fill="#f6f3ee"/><rect x="110" y="50" width="180" height="200" fill="#dfe7ec"/> <rect x="110" y="50" width="180" height="70" fill="@@0.0@@"/> <g stroke="@@-0.121@@" stroke-width="2" opacity=".8"><path d="M125 52 v70 M140 52 v74 M155 52 v70 M170 52 v74 M185 52 v70 M200 52 v74 M215 52 v70 M230 52 v74 M245 52 v70 M260 52 v74 M275 52 v70"/></g> <path d="M110 118 Q140 160 170 118 Q200 160 230 118 Q260 160 290 118 V124 Q260 166 230 124 Q200 166 170 124 Q140 166 110 124 Z" fill="@@-0.082@@"/> <line x1="110" y1="50" x2="290" y2="50" stroke="#5f5a50" stroke-width="4"/>'
  };
  function styleDrawing(kind, colour) {
    return '<g transform="translate(0,96) scale(2)">' +
      STYLE_TPL[kind].replace(/@@(-?[0-9.]+)@@/g, function (m, a) { return shade(colour, parseFloat(a)); }) + '</g>';
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
      (STYLE_TPL[kind] ? styleDrawing(kind, colour) :
        '<ellipse cx="400" cy="600" rx="330" ry="26" fill="url(#shadow)"/>' + piece(kind, colour)) +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  window.SheenFurnitureIllustration = { render: render, kindFor: kindFor, shade: shade };
})();
