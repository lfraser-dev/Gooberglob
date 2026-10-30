/* =====================================================
   MISSION 9 CHASE — painted night countryside, pre-rendered in 800-unit chunks
   (bocage fields & hedgerows, a village with a church, a river & stone bridge,
    a forest, orchards, a level crossing, a ruined town and the British lines)
===================================================== */
const CHK = 800, CHX0 = -400, CHW = 2000;
function chH(a, b, c) { return m8R(a * 12.9898 + (b || 0) * 78.233 + (c || 0) * 37.719 + 4.1); }
function chEdge(d, s, off) { return chRoadX(d) + s * (chHalfW(d) + off); }
/* ---------- tileable textures (200px so they line up across chunks) ---------- */
function chTexMake(base, draw) { const c = document.createElement('canvas'); c.width = c.height = 200; const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 200, 200); draw(g); return c; }
function chSpeck(g, cols, n, w, h, seed) { for (let i = 0; i < n; i++) { const x = chH(i, seed) * 200, y = chH(i, seed, 1) * 200; g.fillStyle = cols[i % cols.length]; g.globalAlpha = .35 + chH(i, seed, 2) * .5; const ww = w * (.5 + chH(i, seed, 3)), hh = h * (.5 + chH(i, seed, 4)); for (let ox = -200; ox <= 200; ox += 200) for (let oy = -200; oy <= 200; oy += 200) if (x + ox > -ww && x + ox < 200 && y + oy > -hh && y + oy < 200) g.fillRect(x + ox, y + oy, ww, hh); } g.globalAlpha = 1; }
function chTex() {
    if (CH.tex) return CH.tex; const T = {};
    T.grass = chTexMake('#465a34', function (g) { chSpeck(g, ['#4a5a36', '#34422a', '#566640', '#2e3a24'], 2400, 1.4, 4, 1); });
    T.pasture = chTexMake('#506a3a', function (g) { chSpeck(g, ['#5e7844', '#46603a', '#6a8450'], 2200, 1.4, 3.4, 2); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(30,40,20,.12)'; g.beginPath(); g.arc(chH(i, 9) * 200, chH(i, 9, 1) * 200, 20 + chH(i, 9, 2) * 30, 0, 7); g.fill(); } });
    T.wheat = chTexMake('#8a804c', function (g) { chSpeck(g, ['#9a8e56', '#76703e', '#a89c62', '#6a6236'], 2600, 1.2, 6, 3); g.fillStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < 200; x += 10) g.fillRect(x, 0, 2, 200); });
    T.plough = chTexMake('#5a4a36', function (g) { for (let y = 0; y < 200; y += 8) { g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(0, y, 200, 3); g.fillStyle = 'rgba(140,120,90,.16)'; g.fillRect(0, y + 4, 200, 2); } chSpeck(g, ['#5a4c38', '#3a3024'], 900, 2, 2, 4); });
    T.forest = chTexMake('#26301c', function (g) { chSpeck(g, ['#3a3420', '#1c2414', '#2e3a20', '#4a3e26'], 2200, 2.4, 2.4, 5); });
    T.dirt = chTexMake('#544a3a', function (g) { chSpeck(g, ['#62574a', '#463c30', '#6e6352'], 2000, 2, 2, 6); });
    T.rubble = chTexMake('#4e4a42', function (g) { chSpeck(g, ['#6a645a', '#3a3630', '#7a7266', '#2a2622'], 1400, 4, 3, 7); });
    T.tarmac = chTexMake('#5a554a', function (g) { chSpeck(g, ['#5a5750', '#423f38', '#66625a', '#38352f'], 3200, 1.6, 1.6, 8); g.strokeStyle = 'rgba(20,18,14,.35)'; g.lineWidth = 1; for (let i = 0; i < 5; i++) { let x = chH(i, 30) * 200, y = chH(i, 31) * 200; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (chH(i, k, 32) - .5) * 26; y += (chH(i, k, 33) - .5) * 26; g.lineTo(x, y); } g.stroke(); } });
    T.cobble = chTexMake('#3e3a34', function (g) { for (let y = 0; y < 200; y += 10) for (let x = (y / 10) % 2 * 5; x < 205; x += 10) { const v = 80 + Math.floor(chH(x, y, 34) * 40); g.fillStyle = 'rgb(' + v + ',' + (v - 4) + ',' + (v - 12) + ')'; g.beginPath(); g.ellipse(x, y + 5, 4.4, 4, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x - 3, y + 2, 3, 2); } });
    T.deck = chTexMake('#6a665c', function (g) { for (let y = 0; y < 200; y += 20) for (let x = (y / 20) % 2 * 20; x < 220; x += 40) { const v = 92 + Math.floor(chH(x, y, 35) * 26); g.fillStyle = 'rgb(' + v + ',' + (v - 4) + ',' + (v - 12) + ')'; g.fillRect(x + 1, y + 1, 38, 18); } chSpeck(g, ['rgba(0,0,0,.3)'], 600, 1.6, 1.6, 36); });
    T.garden = chTexMake('#3a4a2a', function (g) { for (let y = 0; y < 200; y += 12) { g.fillStyle = 'rgba(70,56,40,.6)'; g.fillRect(0, y, 200, 5); for (let x = 3; x < 200; x += 7) { g.fillStyle = chH(x, y, 37) > .5 ? '#4e6a34' : '#3a5428'; g.beginPath(); g.arc(x, y + 8, 2.6, 0, 7); g.fill(); } } });
    T.mud = chTexMake('#3e3628', function (g) { chSpeck(g, ['#4a4030', '#2e281e', '#544838'], 1800, 2.4, 2, 38); });
    Object.keys(T).forEach(function (k) { T[k] = { c: T[k] }; }); CH.tex = T; return T;
}
function chPat(g, k) { const T = chTex()[k]; if (!T.p || T.g !== g) { T.p = g.createPattern(T.c, 'repeat'); T.g = g; } return T.p; }
/* ---------- deterministic layout of the whole road ---------- */
function chLayout() {
    const L = { fields: [], hedges: [], trees: [], houses: [], lamps: [], lights: [], craters: [], walls: [], trench: [] };
    const FT = ['wheat', 'pasture', 'plough', 'pasture', 'wheat', 'grass'];
    for (let k = 0; k * 360 < CH_END + 1200; k++) { const dA = k * 360, dB = dA + 360, zm = chZone(dA + 180); if (['fields', 'roadblock', 'rail', 'orchard', 'lines'].indexOf(zm) < 0 || Math.abs(dA + 180 - 7000) < 700) continue;
        for (let s = -1; s <= 1; s += 2) { let off = 40; for (let j = 0; j < 7 && off < 1300; j++) { const w = 200 + chH(k, s, j) * 200, type = zm === 'orchard' ? 'orchard' : zm === 'lines' ? 'pasture' : FT[Math.floor(chH(k, j, s + 7) * FT.length)]; L.fields.push({ dA: dA, dB: dB, s: s, o0: off, o1: off + w, type: type, k: k, j: j });
            L.hedges.push({ pts: [[chEdge(dB, s, off), dB], [chEdge(dB, s, off + w), dB]], seed: k * 31 + j * 7 + s }); const op = []; for (let d = dA; d <= dB; d += 40) op.push([chEdge(d, s, off + w), d]); L.hedges.push({ pts: op, seed: k * 17 + j * 5 + s * 3 });
            if (j === 0) { const ip = []; for (let d = dA + 30; d <= dB - (chH(k, s, 9) > .5 ? 110 : 30); d += 40) ip.push([chEdge(d, s, off - 8), d]); L.hedges.push({ pts: ip, seed: k * 13 + s, road: 1 }); }
            off += w; } } }
    // village houses, gardens, walls, a church and lamps
    for (let s = -1; s <= 1; s += 2) { let d = 3300 + (s > 0 ? 40 : 0); while (d < 6300) { const w = 76 + chH(d, s) * 50, h = 64 + chH(d, s, 1) * 46; if (s < 0 && d > 4560 && d < 4900) { L.houses.push({ church: 1, x: chEdge(4730, s, 40 + 95), d: 4730, w: 150, h: 300, s: s }); d = 4920; continue; } if (chH(d, s, 2) > .14) { const x = chEdge(d, s, 26 + w / 2); L.houses.push({ x: x, d: d, w: w, h: h, s: s, roof: chH(d, s, 3) > .45 ? 'tile' : 'slate', garden: chH(d, s, 4) > .3 }); if (chH(d, s, 5) > .55) L.lights.push({ x: chEdge(d, s, 18), d: d + (chH(d, s, 6) - .5) * h * .6, r: 70, warm: 1 }); } else L.walls.push({ x: chEdge(d, s, 30), d: d, h: h }); d += h + 8 + chH(d, s, 7) * 30; } }
    for (let d = 3400; d < 6300; d += 380) { const s = Math.floor(d / 380) % 2 ? 1 : -1; L.lamps.push({ x: chEdge(d, s, 14), d: d }); L.lights.push({ x: chEdge(d, s, 14), d: d, r: 150, lamp: 1 }); }
    // ruined town
    for (let s = -1; s <= 1; s += 2) { let d = 18500 + (s > 0 ? 60 : 0); while (d < 21900) { const w = 80 + chH(d, s, 11) * 60, h = 70 + chH(d, s, 12) * 50; if (chH(d, s, 13) > .2) L.houses.push({ x: chEdge(d, s, 34 + w / 2), d: d, w: w, h: h, s: s, ruin: chH(d, s, 14) > .25 ? 1 : 0, roof: 'slate', garden: 0 }); d += h + 20 + chH(d, s, 15) * 60; } }
    for (let i = 0; i < 46; i++) { const d = 18500 + chH(i, 50) * 3500, s = chH(i, 51) > .5 ? 1 : -1; L.craters.push({ x: chEdge(d, s, 60 + chH(i, 52) * 500), d: d, r: 18 + chH(i, 53) * 26 }); }
    for (let i = 0; i < 18; i++) { const d = 11900 + chH(i, 60) * 1400, s = chH(i, 61) > .5 ? 1 : -1; L.craters.push({ x: chEdge(d, s, 80 + chH(i, 62) * 500), d: d, r: 16 + chH(i, 63) * 20 }); }
    // trees: forest, river banks, field oaks
    for (let d = 7560; d < 11860; d += 22) for (let s = -1; s <= 1; s += 2) { let off = 26 + chH(d, s) * 30; while (off < 1200) { L.trees.push({ x: chEdge(d + chH(d, off, s) * 20, s, off), d: d + chH(off, d) * 22, r: 26 + chH(d, off, 1) * 20, t: chH(off, d, 3) > .7 ? 'pine' : 'oak', s: d * 3 + off }); off += 46 + chH(d, off, 2) * 40; } }
    for (let i = 0; i < 70; i++) { const s = chH(i, 70) > .5 ? 1 : -1, d = 7000 + (chH(i, 71) > .5 ? -1 : 1) * (225 + chH(i, 72) * 70), off = 60 + chH(i, 73) * 1000; L.trees.push({ x: chEdge(d, s, off), d: d, r: 22 + chH(i, 74) * 14, t: 'willow', s: i * 7 }); }
    for (let d = 6400; d < 7600; d += 60) for (let s = -1; s <= 1; s += 2) if (Math.abs(d - 7000) > 260 && chH(d, s, 80) > .55) L.trees.push({ x: chEdge(d, s, 40 + chH(d, s, 81) * 500), d: d, r: 24 + chH(d, s, 82) * 16, t: 'oak', s: d + s });
    for (let d = 22200; d < CH_END + 900; d += 70) { L.trench.push([chRoadX(d) - 300 + ((Math.floor(d / 70) % 2) ? 40 : -40), d]); }
    CH.L = L; return L;
}
/* ---------- painters ---------- */
const CH_TREE = { oak: ['#16220f', '#2a3e1c', '#40582c', '#5e7e40'], pine: ['#0e1a10', '#16261a', '#22382a', '#2e4a36'], willow: ['#1a2614', '#2a3c20', '#3e5630', '#5a7442'], fruit: ['#1e2c14', '#34502a', '#4e7036', '#6e9450'] };
function chTree(g, x, y, r, s, t) { const P = CH_TREE[t || 'oak']; g.fillStyle = 'rgba(0,0,0,.38)'; g.beginPath(); g.ellipse(x + r * .4, y + r * .45, r * 1.05, r * .9, 0, 0, 7); g.fill();
    g.fillStyle = P[0]; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); const n = 6; for (let pass = 1; pass < 4; pass++) { g.fillStyle = P[pass]; const k = 1 - (pass - 1) * .28; for (let i = 0; i < n; i++) { const a = i / n * 6.28 + chH(s, i, pass) * .9, dd = r * (.38 + chH(s, i) * .2) * k, rr = r * (.38 + chH(i, s, pass) * .18) * k; g.beginPath(); g.arc(x + Math.cos(a) * dd - pass * r * .07, y + Math.sin(a) * dd - pass * r * .09, rr, 0, 7); g.fill(); } }
    if (t === 'pine') { g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 1; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9); g.stroke(); } } }
function chHedge(g, pts, seed, X, Y) { for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / 9)); for (let k = 0; k < n; k++) { const t = k / n, x = a[0] + (b[0] - a[0]) * t, d = a[1] + (b[1] - a[1]) * t, h = chH(Math.round(x), Math.round(d), seed), r = 8 + h * 5; g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.arc(X(x) + 5, Y(d) + 6, r, 0, 7); g.fill(); g.fillStyle = h > .5 ? '#1c2a14' : '#22321a'; g.beginPath(); g.arc(X(x), Y(d), r, 0, 7); g.fill(); g.fillStyle = h > .5 ? '#2e4420' : '#36502a'; g.beginPath(); g.arc(X(x) - r * .25, Y(d) - r * .3, r * .62, 0, 7); g.fill(); g.fillStyle = 'rgba(130,170,90,.35)'; g.beginPath(); g.arc(X(x) - r * .4, Y(d) - r * .45, r * .3, 0, 7); g.fill(); } } }
function chHedgeTrees(g, pts, seed, X, Y) { for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let t = 60; t < len; t += 130) { const h = chH(Math.round(a[0] + t), Math.round(a[1]), seed); if (h > .55) continue; const x = a[0] + (b[0] - a[0]) * t / len, d = a[1] + (b[1] - a[1]) * t / len; chTree(g, X(x), Y(d), 20 + h * 22, Math.round(x + d), 'oak'); } } }
function chHouse(g, H, X, Y) {
    const x = X(H.x) - H.w / 2, y = Y(H.d) - H.h / 2;
    if (H.church) { g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 20; g.shadowOffsetX = 16; g.shadowOffsetY = 20; g.fillStyle = '#000'; g.fillRect(x, y, H.w, H.h); g.restore(); m9Roof(g, x, y + 70, H.w, H.h - 70, false, ['#4a4e58', '#2e323a', '#1a1c22']); const tx = X(H.x) - 45, ty = y; g.fillStyle = '#5a564c'; g.fillRect(tx, ty, 90, 80); [['#6a6658', [[tx, ty], [tx + 45, ty + 40], [tx + 90, ty]]], ['#3a3830', [[tx + 90, ty], [tx + 45, ty + 40], [tx + 90, ty + 80]]], ['#2a2822', [[tx, ty + 80], [tx + 45, ty + 40], [tx + 90, ty + 80]]], ['#4e4a40', [[tx, ty], [tx + 45, ty + 40], [tx, ty + 80]]]].forEach(function (f) { g.fillStyle = f[0]; g.beginPath(); f[1].forEach(function (p, i) { i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }); g.fill(); }); g.strokeStyle = '#c8c0a0'; g.lineWidth = 2; g.beginPath(); g.moveTo(tx + 45, ty + 30); g.lineTo(tx + 45, ty + 50); g.moveTo(tx + 38, ty + 37); g.lineTo(tx + 52, ty + 37); g.stroke(); g.fillStyle = '#3a3a34'; for (let i = 0; i < 16; i++) { g.fillRect(x - 30 + (i % 4) * 14 - 40 + (H.s > 0 ? H.w + 100 : 0), y + 120 + Math.floor(i / 4) * 22, 8, 12); } return; }
    if (H.garden) { const gx = H.s > 0 ? x + H.w + 6 : x - 96, gw = 90; g.fillStyle = chPat(g, 'garden'); g.fillRect(gx, y + 4, gw, H.h - 8); g.strokeStyle = '#5e5a50'; g.lineWidth = 3; g.strokeRect(gx, y + 4, gw, H.h - 8); }
    if (H.ruin) { g.fillStyle = chPat(g, 'rubble'); g.fillRect(x, y, H.w, H.h); g.strokeStyle = '#9a9282'; g.lineWidth = 9; g.beginPath(); const gap = chH(H.d, H.s) * H.w; g.moveTo(x + gap * .3, y); g.lineTo(x, y); g.lineTo(x, y + H.h); g.lineTo(x + H.w * .6, y + H.h); g.moveTo(x + H.w, y + H.h * .4); g.lineTo(x + H.w, y); g.lineTo(x + gap * .3 + 30, y); g.stroke(); g.strokeStyle = '#1a1612'; g.lineWidth = 5; for (let i = 0; i < 4; i++) { g.beginPath(); const bx = x + 10 + chH(H.d, i) * (H.w - 20), by = y + 10 + chH(i, H.d) * (H.h - 20); g.moveTo(bx, by); g.lineTo(bx + 30 * Math.cos(i * 1.7), by + 30 * Math.sin(i * 1.7)); g.stroke(); } for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#7a7266' : '#55504a'; g.beginPath(); g.arc(x + chH(i, H.d, 1) * H.w, y + chH(H.d, i, 2) * H.h, 4 + chH(i, H.s) * 6, 0, 7); g.fill(); } return; }
    m9Roof(g, x, y, H.w, H.h, H.h > H.w * .8, H.roof === 'tile' ? ['#8a5038', '#6a3826', '#3e2016'] : ['#5a5e68', '#3a3e48', '#22242c']);
    m8Disc(g, x + H.w * (H.s > 0 ? .75 : .25), y + H.h * .3, 6, '#2a2420', '#7a6a58');
}
function chRiver(g, d0, d1, X, Y) { const top = 7000 + 180, bot = 7000 - 180; if (top < d0 - 50 || bot > d1 + 50) return; const yT = Y(top), yB = Y(bot); g.fillStyle = chPat(g, 'mud'); g.beginPath(); g.moveTo(0, yT - 26); for (let x = 0; x <= CHW; x += 40) g.lineTo(x, yT - 26 + Math.sin(x * .02) * 10); for (let x = CHW; x >= 0; x -= 40) g.lineTo(x, yB + 26 + Math.sin(x * .017 + 2) * 10); g.fill(); const wg = g.createLinearGradient(0, yT, 0, yB); wg.addColorStop(0, '#1a2a30'); wg.addColorStop(.5, '#2a3e48'); wg.addColorStop(1, '#1a2a30'); g.fillStyle = wg; g.beginPath(); g.moveTo(0, yT); for (let x = 0; x <= CHW; x += 40) g.lineTo(x, yT + Math.sin(x * .02) * 10); for (let x = CHW; x >= 0; x -= 40) g.lineTo(x, yB + Math.sin(x * .017 + 2) * 10); g.fill(); g.strokeStyle = 'rgba(170,200,220,.12)'; g.lineWidth = 1.4; for (let i = 0; i < 90; i++) { const x = chH(i, 90) * CHW, y = yT + 12 + chH(i, 91) * (yB - yT - 24); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20 + chH(i, 92) * 30, y); g.stroke(); } for (let i = 0; i < 140; i++) { const x = chH(i, 93) * CHW, edge = i % 2 ? yT + Math.sin(x * .02) * 10 : yB + Math.sin(x * .017 + 2) * 10; g.strokeStyle = '#3a4a26'; g.lineWidth = 1.4; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + k * 3, edge); g.lineTo(x + k * 3 + (k - 2) * 2, edge + (i % 2 ? 1 : -1) * (8 + k * 3)); g.stroke(); } } }
function chRoadPaint(g, d0, d1, X, Y) {
    const strip = function (off, fill) { g.fillStyle = fill; g.beginPath(); let first = true; for (let d = d0 - 20; d <= d1 + 20; d += 10) { const x = X(chEdge(d, -1, off)); first ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); first = false; } for (let d = d1 + 20; d >= d0 - 20; d -= 10) g.lineTo(X(chEdge(d, 1, off)), Y(d)); g.closePath(); g.fill(); };
    strip(34, 'rgba(98,104,74,.55)'); strip(12, chPat(g, 'dirt'));
    // surface: per zone segment
    for (let d = d0 - 20; d < d1 + 20; d += 10) { const z = chZone(d), bridge = Math.abs(d - 7000) < 260, p = bridge ? 'deck' : (z === 'village' ? 'cobble' : z === 'ruins' ? 'cobble' : 'tarmac'); g.fillStyle = chPat(g, p); g.beginPath(); g.moveTo(X(chEdge(d, -1, 0)), Y(d)); g.lineTo(X(chEdge(d, 1, 0)), Y(d)); g.lineTo(X(chEdge(d + 10.5, 1, 0)), Y(d + 10.5)); g.lineTo(X(chEdge(d + 10.5, -1, 0)), Y(d + 10.5)); g.closePath(); g.fill(); }
    const line = function (side, off, col, w) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); for (let d = d0 - 20; d <= d1 + 20; d += 10) { const x = X(chEdge(d, side, off)); d === d0 - 20 ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); } g.stroke(); };
    line(-1, -4, 'rgba(0,0,0,.25)', 8); line(1, -4, 'rgba(0,0,0,.25)', 8);
    g.strokeStyle = 'rgba(160,150,120,.08)'; g.lineWidth = 12; [-.45, .45].forEach(function (k) { g.beginPath(); for (let d = d0 - 20; d <= d1 + 20; d += 10) { const x = X(chRoadX(d) + chHalfW(d) * k); d === d0 - 20 ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); } g.stroke(); });
    // bridge parapets
    if (d1 > 6740 && d0 < 7260) for (let s = -1; s <= 1; s += 2) { g.fillStyle = 'rgba(0,0,0,.4)'; for (let d = Math.max(d0 - 20, 6740); d < Math.min(d1 + 20, 7260); d += 10) g.fillRect(X(chEdge(d, s, 4)) + 6, Y(d) - 10 + 6, 12, 11); for (let d = Math.max(d0 - 20, 6740); d < Math.min(d1 + 20, 7260); d += 10) { g.fillStyle = Math.floor(d / 20) % 2 ? '#8a8476' : '#7a7468'; g.fillRect(X(chEdge(d, s, 4)) - 6, Y(d) - 10, 12, 11); } }
}
function chChunk(i) {
    CH.chunks = CH.chunks || new Map(); if (CH.chunks.has(i)) return CH.chunks.get(i);
    const L = CH.L || chLayout(), c = document.createElement('canvas'); c.width = CHW; c.height = CHK; const g = c.getContext('2d'), d0 = i * CHK, d1 = d0 + CHK, X = function (x) { return x - CHX0; }, Y = function (d) { return d1 - d; }, M = 80, inR = function (d, m) { return d > d0 - (m || M) && d < d1 + (m || M); };
    // ground per zone band
    for (let d = d0 - 10; d < d1 + 10; d += 40) { const z = chZone(d); g.fillStyle = chPat(g, z === 'forest' ? 'forest' : z === 'ruins' ? 'rubble' : z === 'village' ? 'grass' : 'pasture'); g.fillRect(0, Y(d + 40), CHW, 41); }
    // fields
    L.fields.forEach(function (F) { if (F.dB < d0 - 10 || F.dA > d1 + 10) return; g.fillStyle = chPat(g, F.type === 'orchard' ? 'grass' : F.type); g.beginPath(); for (let d = F.dA; d <= F.dB; d += 40) { const x = X(chEdge(d, F.s, F.o0)); d === F.dA ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); } for (let d = F.dB; d >= F.dA; d -= 40) g.lineTo(X(chEdge(d, F.s, F.o1)), Y(d)); g.closePath(); g.fill();
        if (F.type === 'orchard') for (let dd = F.dA + 40; dd < F.dB - 20; dd += 66) for (let o = F.o0 + 44; o < F.o1 - 24; o += 66) if (inR(dd)) chTree(g, X(chEdge(dd, F.s, o)), Y(dd), 15 + chH(dd, o) * 5, dd + o, 'fruit'); });
    chRiver(g, d0, d1, X, Y);
    L.craters.forEach(function (C) { if (!inR(C.d)) return; const x = X(C.x), y = Y(C.d); g.fillStyle = 'rgba(140,124,96,.6)'; g.beginPath(); g.ellipse(x, y, C.r * 1.35, C.r * 1.2, 0, 0, 7); g.fill(); const cg = g.createRadialGradient(x - C.r * .2, y - C.r * .2, 1, x, y, C.r); cg.addColorStop(0, '#5a4e3c'); cg.addColorStop(1, '#6e604a'); g.fillStyle = cg; g.beginPath(); g.ellipse(x, y, C.r, C.r * .85, 0, 0, 7); g.fill(); });
    // rails + crossing
    if (inR(17800, 60)) { const y = Y(17800); g.fillStyle = '#5a5246'; g.fillRect(0, y - 26, CHW, 52); g.fillStyle = '#3a2e22'; for (let x = 0; x < CHW; x += 14) g.fillRect(x, y - 20, 8, 40); g.fillStyle = '#9a9a92'; g.fillRect(0, y - 13, CHW, 3); g.fillRect(0, y + 10, CHW, 3); const rx = X(chRoadX(17800)); g.fillStyle = '#4a3e30'; g.fillRect(rx + CH_ROADW + 70, y - 90, 60, 50); m9Roof(g, rx + CH_ROADW + 70, y - 90, 60, 50, true, ['#8a5038', '#6a3826', '#3e2016']); [-1, 1].forEach(function (s) { g.fillStyle = '#d8d0c0'; g.fillRect(rx + s * (CH_ROADW + 20) - 4, y - 44, 8, 8); }); }
    // trench line + wire at the British lines
    if (d1 > 22100) { g.strokeStyle = '#2a2418'; g.lineWidth = 16; g.beginPath(); L.trench.forEach(function (p, k) { const x = X(p[0]), y = Y(p[1]); k ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); g.strokeStyle = 'rgba(120,110,80,.5)'; g.lineWidth = 3; g.stroke(); g.strokeStyle = 'rgba(160,160,150,.5)'; g.lineWidth = 1; for (let d = Math.max(d0, 22300); d < d1; d += 24) [-1, 1].forEach(function (s) { const x = X(chEdge(d, s, 120 + 200)); g.beginPath(); g.arc(x, Y(d), 8, 0, 7); g.stroke(); }); }
    chRoadPaint(g, d0, d1, X, Y);
    // garden walls / village walls
    L.walls.forEach(function (W) { if (!inR(W.d)) return; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(X(W.x) - 3 + 4, Y(W.d) - W.h / 2 + 5, 7, W.h); g.fillStyle = '#7a7466'; g.fillRect(X(W.x) - 3, Y(W.d) - W.h / 2, 7, W.h); });
    L.hedges.forEach(function (Hd) { if (!Hd.pts.some(function (p) { return inR(p[1], 120); })) return; chHedge(g, Hd.pts, Hd.seed, X, Y); });
    L.houses.forEach(function (H) { if (!inR(H.d, 200)) return; chHouse(g, H, X, Y); });
    L.lamps.forEach(function (l) { if (inR(l.d)) m8LampPost(g, X(l.x), Y(l.d)); });
    L.hedges.forEach(function (Hd) { if (Hd.road || !Hd.pts.some(function (p) { return inR(p[1], 120); })) return; chHedgeTrees(g, Hd.pts, Hd.seed, X, Y); });
    L.trees.forEach(function (T) { if (!inR(T.d, 60)) return; chTree(g, X(T.x), Y(T.d), T.r, T.s, T.t); });
    // moonlight grade baked in
    g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgb(168,176,200)'; g.fillRect(0, 0, CHW, CHK); g.globalCompositeOperation = 'source-over';
    CH.chunks.set(i, c); CH.chunks.forEach(function (v, k) { if (k < i - 2 || k > i + 3) CH.chunks.delete(k); });
    return c;
}
function chDrawTerrain() {
    const C = CH, lo = Math.floor((C.d - (700 - CH_CY) - 40) / CHK), hi = Math.floor((C.d + CH_CY + 40) / CHK);
    for (let i = lo; i <= hi; i++) { const c = chChunk(i), top = CH_CY - ((i + 1) * CHK - C.d); ctx.drawImage(c, CHX0, top); }
    // build the next chunk ahead during a quiet frame so it never stalls when it scrolls in
    if (!C.chunks.has(hi + 1) && (!C.prefAt || performance.now() - C.prefAt > 250)) { C.prefAt = performance.now(); chChunk(hi + 1); }
}
