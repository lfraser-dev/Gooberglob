/* =====================================================
   MISSION 11 — the castle repainted: walls with height, lived-in rooms, light and weather
===================================================== */
function m11RR(g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
function m11Shadow(g, x, y, w, h, blur, a, oy) { g.save(); g.shadowColor = 'rgba(0,0,0,' + (a || .6) + ')'; g.shadowBlur = blur || 18; g.shadowOffsetX = 4; g.shadowOffsetY = oy === undefined ? 9 : oy; g.fillStyle = '#000'; g.fillRect(x, y, w, h); g.restore(); }
function m11WallFace(g, R) { // the visible south face of a wall, giving it height
    const x = R[0], y = R[1] + R[3], w = R[2], FH = 20, outer = R[5];
    const gr = g.createLinearGradient(0, y, 0, y + FH); gr.addColorStop(0, '#8e8672'); gr.addColorStop(1, '#4e483c'); g.fillStyle = gr; g.fillRect(x, y, w, FH);
    g.fillStyle = 'rgba(0,0,0,.22)'; for (let yy = y + 5; yy < y + FH; yy += 6) g.fillRect(x, yy, w, 1); for (let xx = x + (m8R(x) * 14); xx < x + w; xx += 14) g.fillRect(xx, y + ((xx / 14) % 2 ? 0 : 6), 1, 6);
    if (outer) for (let xx = x + 30; xx < x + w - 20; xx += 64) { const lit = m8R(xx * 3 + y) > .45; g.fillStyle = '#16140f'; g.fillRect(xx, y + 3, 10, 13); if (lit) { g.fillStyle = 'rgba(255,196,110,.85)'; g.fillRect(xx + 1, y + 4, 8, 11); g.fillStyle = 'rgba(255,196,110,.08)'; g.beginPath(); g.moveTo(xx - 6, y + FH); g.lineTo(xx + 16, y + FH); g.lineTo(xx + 30, y + FH + 60); g.lineTo(xx - 20, y + FH + 60); g.fill(); } g.fillStyle = '#2a2620'; g.fillRect(xx + 4, y + 3, 1.5, 13); }
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y + FH - 2, w, 2); }
function m11Wall(g, R) { const x = R[0], y = R[1], w = R[2], h = R[3], k = R[4];
    if (k === 'cliff' || k === 'town' || k === 'house') return;
    const gr = g.createLinearGradient(x, y, x + w * .3, y + h); gr.addColorStop(0, '#ddd5bf'); gr.addColorStop(1, '#b5ad97'); g.fillStyle = gr; g.fillRect(x, y, w, h);
    // coping stones along the top
    g.fillStyle = 'rgba(0,0,0,.12)'; if (w > h) for (let xx = x; xx < x + w; xx += 22) g.fillRect(xx, y, 1, h); else for (let yy = y; yy < y + h; yy += 22) g.fillRect(x, yy, w, 1);
    g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(x, y, w, 2); g.fillRect(x, y, 2, h); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x + w - 2, y, 2, h);
    g.fillStyle = 'rgba(90,80,60,.14)'; for (let i = 0; i < (w * h) / 220; i++) g.fillRect(x + m8R(x + i) * w, y + m8R(y + i * 3) * h, 2 + m8R(i) * 7, 1 + m8R(i + 1) * 3);
    g.fillStyle = 'rgba(70,90,50,.25)'; for (let i = 0; i < (w + h) / 40; i++) { g.beginPath(); g.arc(x + m8R(x * 3 + i) * w, y + m8R(y * 5 + i) * h, 2 + m8R(i) * 4, 0, 7); g.fill(); } }
function m11Bed(g, x, y, w, h, seed) { m11Shadow(g, x, y, w, h, 10, .55, 5); g.fillStyle = '#3a2a1a'; g.fillRect(x, y, w, h); g.fillStyle = '#5a4630'; g.fillRect(x + 2, y + 2, w - 4, h - 4);
    const bl = ['#5a4a6a', '#4a5a3a', '#6a3a30', '#3a4a5a', '#6a6040'][seed % 5]; g.fillStyle = '#d8d0c0'; g.fillRect(x + 4, y + 4, w - 8, 16); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x + 4, y + 16, w - 8, 4);
    g.fillStyle = bl; g.fillRect(x + 3, y + 22, w - 6, h - 26); g.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 3; i++) g.fillRect(x + 3, y + 30 + i * 18, w - 6, 3); g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.moveTo(x + 3, y + 40); g.quadraticCurveTo(x + w / 2, y + 48, x + w - 3, y + 38); g.lineTo(x + w - 3, y + 44); g.quadraticCurveTo(x + w / 2, y + 54, x + 3, y + 46); g.fill(); }
function m11Furn(g, F) { const x = F[0], y = F[1], w = F[2], h = F[3], k = F[4];
    if (k === 'tower') return;
    if (k === 'bunk') { m11Bed(g, x, y, w, h, x + y); return; }
    m11Shadow(g, x, y, w, h, 12, .5, 6);
    if (k === 'table' || k === 'desk') { const tg = g.createLinearGradient(x, y, x, y + h); tg.addColorStop(0, '#7a5634'); tg.addColorStop(1, '#4e3620'); g.fillStyle = tg; g.fillRect(x, y, w, h); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; for (let i = 6; i < w; i += 18) { g.beginPath(); g.moveTo(x + i, y); g.lineTo(x + i, y + h); g.stroke(); } g.fillStyle = 'rgba(255,220,170,.14)'; g.fillRect(x, y, w, 2);
        for (let i = 0; i < Math.floor(w / 26); i++) { const px = x + 12 + i * 26, py = y + h / 2; m8Disc(g, px, py, 5, '#9a9a90', '#e8e4d8'); if (m8R(px) > .5) { m8Disc(g, px + 8, py - 6, 3, '#5a5a5a', '#b0b0b0'); } }
        if (k === 'desk') { g.fillStyle = '#d8d0b8'; g.fillRect(x + 10, y + 8, 30, 22); g.fillStyle = '#2a2a2a'; g.fillRect(x + 80, y + 10, 20, 14); g.fillStyle = '#c0a060'; g.beginPath(); g.arc(x + w - 16, y + 14, 6, 0, 7); g.fill(); }
        // chairs
        for (let i = 0; i < Math.floor(w / 40); i++) { g.fillStyle = '#4a3420'; g.fillRect(x + 10 + i * 40, y - 12, 14, 9); g.fillRect(x + 22 + i * 40, y + h + 3, 14, 9); } return; }
    if (k === 'stove') { m8Disc(g, x + w / 2, y + h / 2, w / 2, '#141414', '#5a5a5a'); m8Disc(g, x + w / 2, y + h / 2, w / 2 - 6, '#2a2a2a', '#4a4a4a'); g.fillStyle = '#ff8a3a'; g.fillRect(x + w / 2 - 6, y + h / 2 - 2, 12, 4); g.fillStyle = '#3a3a3a'; g.fillRect(x + w / 2 - 3, y - 10, 6, 12); return; }
    if (k === 'stage') { g.fillStyle = '#2a1a10'; g.fillRect(x, y, w, h + 6); m11Planks(g, x + 4, y + 10, w - 8, h - 12, '#6a4428', 0, true, 7); g.fillStyle = '#7a1a1a'; g.fillRect(x, y, w, 14); for (let i = 0; i < w; i += 8) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x + i, y, 2, 14); g.fillStyle = 'rgba(255,160,140,.12)'; g.fillRect(x + i + 4, y, 2, 14); } g.fillStyle = '#c0a060'; g.fillRect(x, y + 13, w, 2);
        g.fillStyle = '#7a1a1a'; [[x, 30], [x + w - 30, 30]].forEach(function (c) { g.fillRect(c[0], y, c[1], h); for (let i = 0; i < c[1]; i += 6) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(c[0] + i, y, 2, h); g.fillStyle = '#7a1a1a'; } });
        g.fillStyle = '#3a2a1a'; g.fillRect(x + 60, y + 24, 40, 20); g.fillStyle = '#d8d0b8'; g.fillRect(x + 140, y + 30, 20, 26); g.fillStyle = '#1a1a1a'; g.fillRect(x + w - 70, y + 22, 30, 36); return; }
    if (k === 'bench' || k === 'pew') { const c = k === 'pew' ? ['#5a3a1c', '#3a2410'] : ['#6a4a2a', '#4a3018']; const bg = g.createLinearGradient(x, y, x, y + h); bg.addColorStop(0, c[0]); bg.addColorStop(1, c[1]); g.fillStyle = bg; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,220,170,.16)'; g.fillRect(x, y, w, 2); if (k === 'pew') { g.fillStyle = c[1]; g.fillRect(x, y - 4, w, 4); g.fillRect(x - 3, y - 4, 4, h + 4); g.fillRect(x + w - 1, y - 4, 4, h + 4); } return; }
    if (k === 'altar') { g.fillStyle = '#e0dac8'; g.fillRect(x, y, w, h); g.fillStyle = '#8a1a1a'; g.fillRect(x + 4, y, w - 8, h); g.fillStyle = '#d0b060'; g.fillRect(x + 4, y + 4, w - 8, 3); g.fillRect(x + 4, y + h - 7, w - 8, 3); g.fillRect(x + w / 2 - 2, y + h / 2 - 14, 4, 28); g.fillRect(x + w / 2 - 9, y + h / 2 - 7, 18, 4); return; }
    if (k === 'bench2') { g.fillStyle = '#5a4430'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,220,170,.1)'; g.fillRect(x, y, w, 2); g.fillStyle = '#3a3a34'; g.fillRect(x + 6, y + 6, 26, 10); g.fillStyle = '#8a8a7a'; for (let i = 0; i < 5; i++) { g.save(); g.translate(x + 40 + i * (w - 50) / 5, y + h / 2); g.rotate(m8R(i + x) * 3); g.fillRect(-7, -1.5, 14, 3); g.fillStyle = '#6a4a2a'; g.fillRect(-9, -2, 5, 4); g.restore(); g.fillStyle = '#8a8a7a'; } return; }
    if (k === 'parcels') { for (let i = 0; i < 6; i++) { const cx = x + (i % 3) * 33, cy = y + Math.floor(i / 3) * 20; g.fillStyle = '#c8b080'; g.fillRect(cx, cy, 32, 19); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(cx, cy + 14, 32, 5); g.fillStyle = '#c02a20'; g.fillRect(cx + 13, cy + 5, 7, 2.5); g.fillRect(cx + 15.2, cy + 2.6, 2.5, 7); g.strokeStyle = 'rgba(0,0,0,.4)'; g.strokeRect(cx + .5, cy + .5, 31, 18); } return; }
    if (k === 'rack') { g.fillStyle = '#3a2a1a'; g.fillRect(x, y, w, h); for (let i = 0; i < 10; i++) { g.fillStyle = '#1e1e1a'; g.fillRect(x + 6 + i * 15, y + 3, 3.5, h - 6); g.fillStyle = '#6a4a2a'; g.fillRect(x + 4.5 + i * 15, y + h - 15, 6.5, 12); } return; }
    if (k === 'lorry') { g.fillStyle = '#2a3022'; m11RR(g, x, y, w, h, 6); g.fill(); g.fillStyle = '#4e5640'; m11RR(g, x + 2, y + 38, w - 4, h - 40, 3); g.fill(); g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 7; i++) g.fillRect(x + 2, y + 44 + i * 12, w - 4, 2); g.fillStyle = '#3a4230'; g.fillRect(x + 4, y + 4, w - 8, 30); g.fillStyle = '#7a8a96'; g.fillRect(x + 8, y + 6, w - 16, 7); g.fillStyle = '#e8e0b0'; g.fillRect(x + 6, y, 8, 3); g.fillRect(x + w - 14, y, 8, 3); [[-4, 14], [w - 4, 14], [-4, h - 30], [w - 4, h - 30]].forEach(function (p) { g.fillStyle = '#121212'; g.fillRect(x + p[0], y + p[1], 8, 20); }); return; }
    if (k === 'car') { g.fillStyle = '#1a1c20'; m11RR(g, x, y, w, h, 14); g.fill(); g.fillStyle = '#2e3238'; m11RR(g, x + 26, y + 6, 50, h - 12, 6); g.fill(); g.fillStyle = 'rgba(160,180,200,.35)'; g.fillRect(x + 24, y + 8, 6, h - 16); g.fillStyle = '#5a5e64'; g.fillRect(x + w - 6, y + 8, 4, h - 16); g.fillStyle = '#e8e0b0'; g.fillRect(x + w - 4, y + 4, 3, 7); g.fillRect(x + w - 4, y + h - 11, 3, 7); g.fillStyle = '#b02020'; g.fillRect(x + w - 20, y + h / 2 - 2, 6, 4); return; }
    if (k === 'crates') { for (let i = 0; i < 4; i++) { const cx = x + (i % 2) * 35, cy = y + Math.floor(i / 2) * 25; g.fillStyle = '#7a6040'; g.fillRect(cx, cy, 34, 24); g.fillStyle = 'rgba(255,230,180,.12)'; g.fillRect(cx, cy, 34, 3); g.strokeStyle = '#3a2a16'; g.lineWidth = 1.5; g.strokeRect(cx + .5, cy + .5, 33, 23); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + 34, cy + 24); g.stroke(); g.fillStyle = 'rgba(0,0,0,.6)'; g.font = '700 7px monospace'; g.fillText('WH', cx + 4, cy + 20); } return; }
    if (k === 'wood') { for (let i = 0; i < 10; i++) { m8Disc(g, x + 8 + (i % 5) * 24, y + 10 + Math.floor(i / 5) * 20, 9.5, '#4a3420', '#a8865a'); g.strokeStyle = 'rgba(80,50,20,.6)'; g.beginPath(); g.arc(x + 8 + (i % 5) * 24, y + 10 + Math.floor(i / 5) * 20, 4, 0, 7); g.stroke(); } return; }
    if (k === 'well') { m8Disc(g, x + w / 2, y + h / 2, w / 2 + 2, '#4a4438', '#b0a890'); m8Disc(g, x + w / 2, y + h / 2, w / 2 - 6, '#050505', '#121212'); g.strokeStyle = '#3a2a1a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 4, y + h / 2); g.lineTo(x + w + 4, y + h / 2); g.stroke(); return; }
}
function m11Roofs(g, R) { const x = R[0], y = R[1], w = R[2], h = R[3]; let cx = x;
    while (cx < x + w - 20) { const hw = 70 + m8R(cx) * 60, ww = Math.min(hw, x + w - cx); for (let row = 0; row < 2; row++) { const ry = y + row * h / 2, rh = h / 2 - 6, c = ['#6a3020', '#7a3a24', '#5a2a1a', '#82462a'][Math.floor(m8R(cx + row) * 4)];
        m11Shadow(g, cx, ry, ww - 4, rh, 14, .6, 8); const rg = g.createLinearGradient(0, ry, 0, ry + rh); rg.addColorStop(0, ddpRGB(ddpMix(ddpHex(c), [255, 220, 180], .18))); rg.addColorStop(.48, c); rg.addColorStop(.52, ddpRGB(ddpMix(ddpHex(c), [0, 0, 0], .35))); rg.addColorStop(1, ddpRGB(ddpMix(ddpHex(c), [0, 0, 0], .2))); g.fillStyle = rg; g.fillRect(cx, ry, ww - 4, rh);
        g.fillStyle = 'rgba(0,0,0,.2)'; for (let t = ry + 3; t < ry + rh; t += 5) { g.fillRect(cx, t, ww - 4, 1); for (let tx = cx + (t % 2) * 4; tx < cx + ww - 4; tx += 8) g.fillRect(tx, t - 4, 1, 4); }
        g.fillStyle = 'rgba(40,60,30,.25)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(cx + m8R(cx + i) * ww, ry + m8R(ry + i) * rh, 3 + m8R(i) * 5, 0, 7); g.fill(); }
        if (m8R(cx * 3 + row) > .35) { const chx = cx + ww * .6, chy = ry + rh * .2; g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(chx + 4, chy + 4, 12, 14); g.fillStyle = '#5a3a2a'; g.fillRect(chx, chy, 12, 14); g.fillStyle = '#1a1210'; g.fillRect(chx + 2, chy + 2, 8, 5); } } cx += ww; } }
function m11Lantern(g, x, y) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x - 3, y - 3, 10, 10); g.fillStyle = '#1e1e1a'; g.fillRect(x - 5, y - 5, 10, 10); g.fillStyle = '#ffe4a0'; g.fillRect(x - 3, y - 3, 6, 6); }
function m11BuildBase() {
    const c = document.createElement('canvas'); c.width = M11W; c.height = M11H; const g = c.getContext('2d');
    m11Grass(g, 0, 0, M11W, M11H, 3);
    // mown stripes across the park
    g.save(); g.beginPath(); g.rect(40, 270, 630, 1530); g.clip(); for (let i = 0; i < 40; i++) { g.fillStyle = i % 2 ? 'rgba(90,120,60,.07)' : 'rgba(0,0,0,.06)'; g.fillRect(40 + i * 36, 270, 36, 1530); } g.restore();
    // rock + river to the east
    const rk = g.createLinearGradient(1760, 0, 2300, 0); rk.addColorStop(0, '#3a3630'); rk.addColorStop(.5, '#24221d'); rk.addColorStop(1, '#16150f'); g.fillStyle = rk; g.fillRect(1760, 0, 640, 1080); g.fillRect(1900, 1080, 500, 720);
    for (let i = 0; i < 160; i++) { const x = 1770 + m8R(i * 3) * 420, y = m8R(i * 5) * 1800, w = 20 + m8R(i) * 60, h = 12 + m8R(i + 1) * 30; g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x + 4, y + 5, w / 2, h / 2, m8R(i) * 3, 0, 7); g.fill(); g.fillStyle = 'rgba(' + (80 + m8R(i * 7) * 40 | 0) + ',' + (74 + m8R(i * 7) * 36 | 0) + ',' + (62 + m8R(i * 7) * 30 | 0) + ',.9)'; g.beginPath(); g.ellipse(x, y, w / 2, h / 2, m8R(i) * 3, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.ellipse(x - w * .1, y - h * .2, w * .3, h * .2, m8R(i) * 3, 0, 7); g.fill(); }
    const rv = g.createLinearGradient(2160, 0, 2400, 0); rv.addColorStop(0, '#0c1a22'); rv.addColorStop(.5, '#14303c'); rv.addColorStop(1, '#0e202a'); g.fillStyle = rv; g.beginPath(); g.moveTo(2220, 0); for (let y = 0; y <= 1800; y += 40) g.lineTo(2200 + Math.sin(y * .004) * 30, y); g.lineTo(2400, 1800); g.lineTo(2400, 0); g.fill();
    g.strokeStyle = 'rgba(160,190,210,.16)'; g.lineWidth = 1.5; for (let i = 0; i < 70; i++) { const y = m8R(i) * 1800, x = 2230 + m8R(i * 3) * 160; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 15, y + 4, x + 34, y + 2); g.stroke(); }
    for (let i = 0; i < 30; i++) m11Tree(g, 1800 + m8R(i * 7) * 340, 60 + m8R(i * 11) * 1700, 22 + m8R(i) * 18, i);
    // the northern slope + woods
    g.fillStyle = '#24221c'; g.fillRect(0, 0, 2400, 140); g.fillRect(0, 140, 560, 130); for (let i = 0; i < 120; i++) { const x = m8R(i * 13) * 2400, y = m8R(i * 17) * 260; if (y > 140 && x > 560) continue; g.fillStyle = 'rgba(' + (70 + m8R(i) * 30 | 0) + ',' + (66 + m8R(i) * 28 | 0) + ',56,.6)'; g.beginPath(); g.ellipse(x, y, 16 + m8R(i) * 30, 8 + m8R(i + 1) * 14, m8R(i) * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 40; i++) { const x = m8R(i * 13) * 2400, y = 10 + m8R(i * 17) * 110; if (x < 560 || m8R(i) > .45) m11Tree(g, x, y + (x < 560 ? m8R(i + 2) * 140 : 0), 18 + m8R(i + 4) * 16, i + 40); }
    g.fillStyle = '#1a1914'; g.fillRect(0, 270, 40, 1530);
    // park: gravel walks with edging, rose beds, a stone bench, an ornamental pond
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 22; g.lineCap = 'round'; g.lineJoin = 'round'; const walk = function () { g.beginPath(); g.moveTo(100, 340); g.lineTo(280, 350); g.lineTo(280, 1200); g.lineTo(600, 1200); g.lineTo(600, 1520); g.lineTo(100, 1520); g.lineTo(100, 340); g.stroke(); }; walk(); g.strokeStyle = '#6a5e4a'; g.lineWidth = 18; walk(); g.strokeStyle = 'rgba(160,145,120,.25)'; g.lineWidth = 12; walk(); g.lineCap = 'butt';
    for (let i = 0; i < 300; i++) { g.fillStyle = 'rgba(30,26,20,.3)'; const t = m8R(i), pts = [[100, 340], [280, 350], [280, 1200], [600, 1200], [600, 1520], [100, 1520], [100, 340]], seg = Math.floor(t * 6), k = (t * 6) % 1, a = pts[seg], b = pts[seg + 1]; g.fillRect(a[0] + (b[0] - a[0]) * k + (m8R(i * 3) - .5) * 14, a[1] + (b[1] - a[1]) * k + (m8R(i * 5) - .5) * 14, 2, 2); }
    [[150, 700], [180, 1000], [400, 1330], [470, 1430]].forEach(function (b, i) { g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(b[0] + 4, b[1] + 5, 40, 18, 0, 0, 7); g.fill(); g.fillStyle = '#2a3a1c'; g.beginPath(); g.ellipse(b[0], b[1], 40, 18, 0, 0, 7); g.fill(); for (let j = 0; j < 14; j++) { g.fillStyle = ['#8a2030', '#a03040', '#c06070', '#702030'][j % 4]; g.beginPath(); g.arc(b[0] + (m8R(i * 9 + j) - .5) * 64, b[1] + (m8R(i * 7 + j * 3) - .5) * 24, 3, 0, 7); g.fill(); } });
    g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(424, 1636, 70, 34, 0, 0, 7); g.fill(); g.fillStyle = '#6a6458'; g.beginPath(); g.ellipse(420, 1630, 70, 34, 0, 0, 7); g.fill(); const pg = g.createRadialGradient(410, 1622, 4, 420, 1630, 60); pg.addColorStop(0, '#2a4a5a'); pg.addColorStop(1, '#0e1e26'); g.fillStyle = pg; g.beginPath(); g.ellipse(420, 1630, 60, 26, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(200,220,240,.2)'; g.beginPath(); g.ellipse(400, 1622, 18, 4, 0, 0, 7); g.fill(); [[395, 1640], [440, 1625]].forEach(function (l) { g.fillStyle = '#2a4a24'; g.beginPath(); g.arc(l[0], l[1], 6, 0, 7); g.fill(); });
    [[90, 600, 30], [160, 860, 34], [80, 1040, 26], [210, 1080, 22], [140, 1320, 36], [380, 1260, 30], [520, 1360, 24], [260, 1720, 40], [540, 1740, 34], [110, 1720, 30], [640, 1700, 22], [230, 1420, 20], [60, 470, 22], [480, 1180, 18]].forEach(function (t, i) { m11Tree(g, t[0], t[1], t[2], i + 80); });
    // the terrace: a gravel walk, a lawn strip with a low wall
    const tg = g.createLinearGradient(338, 0, 560, 0); tg.addColorStop(0, '#4a4234'); tg.addColorStop(1, '#3a3428'); g.fillStyle = tg; g.fillRect(338, 300, 222, 800); m11Noise(g, 338, 300, 222, 800, 500, ['rgba(140,130,110,.25)', 'rgba(0,0,0,.2)'], 1, 3, 41); m11Grass(g, 338, 300, 70, 800, 45); g.fillStyle = '#7a7262'; g.fillRect(406, 300, 6, 800); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(406, 300, 2, 800);
    // Kommandantur yard: gravel, a cobbled drive, sandbags, a flagpole
    const yg = g.createLinearGradient(700, 1080, 1900, 1500); yg.addColorStop(0, '#4a463c'); yg.addColorStop(1, '#3a362e'); g.fillStyle = yg; g.fillRect(700, 1080, 1200, 420); m11Noise(g, 700, 1080, 1200, 420, 2400, ['rgba(140,130,110,.22)', 'rgba(0,0,0,.2)', 'rgba(100,94,80,.3)'], 1, 3, 51);
    m11Cobbles(g, 1060, 1080, 120, 420, '#3a362e', 61, 12); m11Cobbles(g, 1180, 1400, 180, 100, '#3a362e', 62, 12);
    g.strokeStyle = 'rgba(30,26,20,.35)'; g.lineWidth = 6; for (const xx of [1080, 1158]) { g.beginPath(); g.moveTo(xx, 1080); g.lineTo(xx, 1500); g.stroke(); }
    for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI, sx = 1640 + Math.cos(a) * 46, sy = 1420 + Math.sin(a) * 30; g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(sx + 2, sy + 3, 12, 7, a, 0, 7); g.fill(); g.fillStyle = '#8a7a58'; g.beginPath(); g.ellipse(sx, sy, 12, 7, a + Math.PI / 2, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 1; g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(1306, 1166, 8, 8); m8Disc(g, 1300, 1160, 6, '#3a3a3a', '#9a9a9a');
    for (let i = 0; i < 6; i++) m8Disc(g, 1820 + (i % 3) * 22, 1180 + Math.floor(i / 3) * 22, 10, '#2a3020', '#5a6a4a');
    // the road south through the town
    m11Cobbles(g, 1120, 1530, 320, 270, '#34302a', 71, 12); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(1120, 1530, 10, 270); g.fillRect(1430, 1530, 10, 270); m11Roofs(g, [700, 1560, 420, 240]); m11Roofs(g, [1440, 1560, 460, 240]); m11Roofs(g, [1520, 1180, 240, 150]);
    // ---- interiors ----
    m11Planks(g, 590, 170, 470, 200, '#5a3e24', 0, true, 101); // theatre
    // canteen: chequered tiles
    for (let yy = 170; yy < 370; yy += 20) for (let xx = 1090; xx < 1730; xx += 20) { g.fillStyle = ((xx + yy) / 20) % 2 ? '#5a5448' : '#3e3a32'; g.fillRect(xx, yy, 20, 20); } g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(1090, 170, 640, 200);
    g.fillStyle = '#4a4a46'; g.fillRect(1640, 180, 80, 50); m8Disc(g, 1660, 200, 9, '#1a1a1a', '#5a5a5a'); m8Disc(g, 1690, 200, 9, '#1a1a1a', '#5a5a5a'); g.fillStyle = '#7a7a72'; g.fillRect(1600, 180, 36, 30);
    m11Planks(g, 590, 400, 240, 420, '#5a4228', 0, false, 105); // quarters
    // braided rug + scattered life in the quarters
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(752, 660, 58, 40, 0, 0, 7); g.fill(); [['#7a4a2a', 56, 38], ['#4a5a3a', 46, 30], ['#8a6a3a', 36, 22], ['#5a3a4a', 24, 14]].forEach(function (r) { g.fillStyle = r[0]; g.beginPath(); g.ellipse(750, 656, r[1], r[2], 0, 0, 7); g.fill(); });
    [[640, 780, '#d8d0b8'], [700, 520, '#c0a060'], [810, 640, '#d8d0b8'], [760, 540, '#8a4a3a']].forEach(function (p, i) { g.save(); g.translate(p[0], p[1]); g.rotate(m8R(i) * 3); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-5, -3, 12, 9); g.fillStyle = p[2]; g.fillRect(-6, -4, 12, 9); g.restore(); });
    for (let i = 0; i < 5; i++) { g.fillStyle = '#e8e4d8'; g.save(); g.translate(745 + i * 8, 446); g.rotate((m8R(i) - .5) * .8); g.fillRect(-3, -4, 6, 8); g.fillStyle = i % 2 ? '#a02020' : '#1a1a1a'; g.fillRect(-1, -1, 2, 2); g.restore(); }
    m11Flags(g, 1490, 400, 240, 420, 107); // chapel
    g.fillStyle = 'rgba(140,20,20,.6)'; g.fillRect(1590, 420, 36, 380); g.fillStyle = 'rgba(200,170,80,.4)'; g.fillRect(1590, 420, 3, 380); g.fillRect(1623, 420, 3, 380);
    m11Flags(g, 590, 850, 440, 200, 109); g.fillStyle = 'rgba(30,26,20,.3)'; g.fillRect(590, 850, 440, 200); for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(10,8,6,.25)'; g.beginPath(); g.ellipse(620 + m8R(i * 3) * 400, 870 + m8R(i * 5) * 170, 14 + m8R(i) * 20, 8 + m8R(i) * 10, 0, 0, 7); g.fill(); } // workshop oil stains
    g.fillStyle = '#4a3a28'; g.fillRect(960, 1032, 70, 16); for (let i = 0; i < 6; i++) { g.fillStyle = '#8a8a7a'; g.fillRect(966 + i * 10, 1030, 3, 14); } // tool board
    m11Planks(g, 1190, 850, 540, 200, '#4a3a28', 0, true, 111); // guard room
    g.fillStyle = '#c8bca0'; g.fillRect(1240, 856, 60, 4); g.fillStyle = '#2a4a6a'; g.fillRect(1420, 853, 70, 6); // notices, map
    m11Flags(g, 1060, 820, 100, 260, 113); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(1060, 820, 100, 260); g.strokeStyle = 'rgba(20,16,12,.5)'; g.lineWidth = 5; for (const xx of [1084, 1136]) { g.beginPath(); g.moveTo(xx, 820); g.lineTo(xx, 1080); g.stroke(); }
    // the prisoners' courtyard: cobbles, drain gutter, moss in the corners, puddles
    m11Cobbles(g, 860, 400, 600, 420, '#34322c', 121, 11);
    g.fillStyle = 'rgba(20,18,14,.4)'; g.fillRect(860, 604, 600, 12); for (let xx = 866; xx < 1460; xx += 20) { g.fillStyle = '#1a1814'; g.fillRect(xx, 607, 12, 6); }
    [[880, 420], [1440, 420], [880, 800], [1440, 800]].forEach(function (c, i) { const mg = g.createRadialGradient(c[0], c[1], 4, c[0], c[1], 80); mg.addColorStop(0, 'rgba(60,80,40,.45)'); mg.addColorStop(1, 'rgba(60,80,40,0)'); g.fillStyle = mg; g.fillRect(c[0] - 80, c[1] - 80, 160, 160); });
    [[990, 720, 46, 16], [1290, 470, 34, 12], [1210, 760, 28, 10], [930, 520, 22, 8]].forEach(function (p) { const pgr = g.createLinearGradient(p[0] - p[2], p[1], p[0] + p[2], p[1]); pgr.addColorStop(0, 'rgba(30,44,60,.7)'); pgr.addColorStop(.5, 'rgba(70,90,110,.7)'); pgr.addColorStop(1, 'rgba(30,44,60,.7)'); g.fillStyle = pgr; g.beginPath(); g.ellipse(p[0], p[1], p[2], p[3], 0, 0, 7); g.fill(); g.fillStyle = 'rgba(200,220,240,.25)'; g.beginPath(); g.ellipse(p[0] - p[2] * .3, p[1] - p[3] * .3, p[2] * .3, 2, 0, 0, 7); g.fill(); });
    g.fillStyle = 'rgba(255,255,240,.04)'; g.fillRect(M11_APPELL[0], M11_APPELL[1], M11_APPELL[2], M11_APPELL[3]); g.strokeStyle = 'rgba(255,255,240,.22)'; g.setLineDash([10, 8]); g.lineWidth = 2; g.strokeRect(M11_APPELL[0], M11_APPELL[1], M11_APPELL[2], M11_APPELL[3]); g.setLineDash([]); g.fillStyle = 'rgba(255,255,240,.18)'; g.font = '700 12px "Stardos Stencil", Impact'; g.textAlign = 'center'; g.fillText('APPELL', M11_APPELL[0] + M11_APPELL[2] / 2, M11_APPELL[1] + 16);
    // the bin + woodpile in the courtyard corners
    g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(1412, 778, 24, 24); m8Disc(g, 1420, 788, 11, '#2a2a28', '#6a6a64'); for (let i = 0; i < 6; i++) m8Disc(g, 880 + (i % 3) * 14, 780 + Math.floor(i / 3) * 12, 6, '#4a3420', '#9a7a50');
    // walls: shadows, faces, tops
    const outerSet = { '560,1050': 1, '1160,1050': 1 };
    M11_WALLS.forEach(function (R) { if (R[4]) return; m11Shadow(g, R[0], R[1], R[2], R[3], 22, .65, 10); });
    M11_WALLS.forEach(function (R) { if (R[4]) return; if (R[2] > 8) m11WallFace(g, [R[0], R[1], R[2], R[3], 0, outerSet[R[0] + ',' + R[1]] || (R[1] === 140 ? 0 : 0)]); });
    M11_WALLS.forEach(function (R) { m11Wall(g, R); }); M11_FURN.forEach(function (F) { m11Furn(g, F); });
    // stained glass light on the chapel floor
    for (let i = 0; i < 4; i++) { const y = 430 + i * 100; [['200,60,60', 0], ['60,90,200', 14], ['220,180,60', 28]].forEach(function (c) { g.fillStyle = 'rgba(' + c[0] + ',.16)'; g.beginPath(); g.moveTo(1730, y + c[1]); g.lineTo(1730, y + c[1] + 14); g.lineTo(1660, y + c[1] + 34); g.lineTo(1660, y + c[1] + 20); g.fill(); }); }
    // wall lanterns
    [[960, 412], [1360, 412], [960, 806], [1360, 806], [1110, 1094], [1280, 1490], [1660, 1340], [1000, 1180], [440, 690]].forEach(function (l) { m11Lantern(g, l[0], l[1]); });
    // room names, stencilled on the floor
    g.font = '700 14px "Stardos Stencil", Impact, sans-serif'; g.textAlign = 'center'; g.fillStyle = 'rgba(255,240,200,.13)';
    [['THEATRE', 760, 350], ['CANTEEN', 1410, 352], ['QUARTERS', 710, 800], ['CHAPEL', 1610, 812], ['PARCELS OFFICE', 810, 1040], ['WACHE', 1460, 1040], ['KOMMANDANTUR', 1300, 1250]].forEach(function (l) { g.fillText(l[0], l[1], l[2]); });
    return c;
}
/* ---------- live atmosphere ---------- */
const M11_LINES = [[[880, 470], [1050, 432]], [[1250, 772], [1446, 724]]];
function m11Ambient(now) { // moths, flickering candles and footlights, the stove glow (under the dark layer)
    const M = M11; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    [[1690, 572], [1690, 640]].forEach(function (c, i) { const f = .7 + .3 * Math.sin(now / 90 + i * 2) * Math.sin(now / 37 + i); ctx.fillStyle = 'rgba(255,200,110,' + .25 * f + ')'; ctx.beginPath(); ctx.arc(c[0], c[1], 26, 0, 7); ctx.fill(); ctx.fillStyle = '#fff3c0'; ctx.fillRect(c[0] - 1, c[1] - 3, 2, 3); });
    for (let i = 0; i < 9; i++) { const x = 612 + i * 25, f = .8 + .2 * Math.sin(now / 200 + i); ctx.fillStyle = 'rgba(255,200,120,' + .2 * f + ')'; ctx.beginPath(); ctx.arc(x, 252, 14, 0, 7); ctx.fill(); }
    [[800, 780], [1680, 900]].forEach(function (s, i) { const f = .7 + .3 * Math.sin(now / 160 + i * 3); ctx.fillStyle = 'rgba(255,120,40,' + .18 * f + ')'; ctx.beginPath(); ctx.arc(s[0], s[1], 40, 0, 7); ctx.fill(); });
    ctx.restore();
    // moths round the lanterns
    ctx.fillStyle = 'rgba(255,240,210,.7)'; [[960, 412], [1360, 412], [960, 806], [1360, 806], [1280, 1490], [1000, 1180]].forEach(function (l, j) { for (let i = 0; i < 3; i++) { const a = now / (300 + i * 70) + i * 2 + j, r = 10 + i * 6; ctx.fillRect(l[0] + Math.cos(a) * r, l[1] + 8 + Math.sin(a * 1.3) * r * .6, 1.6, 1.6); } });
}
function m11Overhead(now) { // things above the actors: washing lines, park mist
    ctx.save(); M11_LINES.forEach(function (L, li) { const a = L[0], b = L[1]; ctx.strokeStyle = 'rgba(30,26,20,.8)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 14, b[0], b[1]); ctx.stroke();
        for (let i = 1; i < 7; i++) { const k = i / 7, x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k + Math.sin(k * Math.PI) * 14, sw = Math.sin(now / 700 + i + li) * 3; ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x - 7 + 6, y + 8, 14, 16); ctx.fillStyle = ['#d8d0c0', '#6a6a5a', '#8a3a30', '#c8c0a8', '#4a5a6a', '#e0d8c8'][(i + li) % 6]; ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y); ctx.lineTo(x + 7 + sw, y + 16); ctx.lineTo(x - 7 + sw, y + 16); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(x - 7 + sw, y + 12, 14, 4); } });
    const D = dqEnsure(); ctx.globalAlpha = .16; for (let i = 0; i < 14; i++) { const x = ((m8R(i) * 700 + now * .006 * (1 + m8R(i * 3))) % 800) - 60, y = 300 + m8R(i * 7) * 1450; ctx.drawImage(D.mist, x - 140, y - 50, 280, 100); } ctx.globalAlpha = 1;
    ctx.restore(); }
