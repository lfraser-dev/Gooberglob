/* =====================================================
   MISSION 12 — HIGH-DETAIL ART PASS
   m12BuildingsHD(g): redraws the five main buildings in design units (crisp at any scale)
   m12DetailPass(g):  a final pass at full world resolution: grit, needles, tyre ruts, puddles,
                      oil, cracks, ambient occlusion round every solid, rim light, weathering
===================================================== */
function m12Rng(seed) { let s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function m12Bevel(g, x, y, w, h, b, light, dark) { // raised edge: light on N/W faces, dark on S/E
    g.fillStyle = light; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w - b, y + b); g.lineTo(x + b, y + b); g.lineTo(x + b, y + h - b); g.lineTo(x, y + h); g.closePath(); g.fill();
    g.fillStyle = dark; g.beginPath(); g.moveTo(x + w, y); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.lineTo(x + b, y + h - b); g.lineTo(x + w - b, y + h - b); g.lineTo(x + w - b, y + b); g.closePath(); g.fill();
}
function m12Stain(g, x, y, w, h, n, seed, col) { const r = m12Rng(seed); for (let i = 0; i < n; i++) { const sx = x + r() * w, sy = y + r() * h, rr = 6 + r() * 26; const gr = g.createRadialGradient(sx, sy, 0, sx, sy, rr); gr.addColorStop(0, col || 'rgba(20,16,10,.28)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(sx, sy, rr, rr * (.5 + r() * .5), r() * 3, 0, 7); g.fill(); } }
function m12Streaks(g, x, y, w, len, n, seed) { const r = m12Rng(seed); for (let i = 0; i < n; i++) { const sx = x + r() * w, l = len * (.4 + r() * .6); const gr = g.createLinearGradient(0, y, 0, y + l); gr.addColorStop(0, 'rgba(10,8,6,.35)'); gr.addColorStop(1, 'rgba(10,8,6,0)'); g.fillStyle = gr; g.fillRect(sx, y, 1 + r() * 3, l); } }
function m12Fan(g, cx, cy, r, rot) {
    m8Disc(g, cx + 2, cy + 3, r + 2, 'rgba(0,0,0,.4)', 'rgba(0,0,0,.4)');
    const rim = g.createRadialGradient(cx - r * .3, cy - r * .3, 1, cx, cy, r + 2); rim.addColorStop(0, '#9a9a92'); rim.addColorStop(1, '#3a3a36'); g.fillStyle = rim; g.beginPath(); g.arc(cx, cy, r + 2, 0, 7); g.fill();
    g.fillStyle = '#121210'; g.beginPath(); g.arc(cx, cy, r - 1, 0, 7); g.fill();
    for (let i = 0; i < 6; i++) { const a = rot + i / 6 * Math.PI * 2; g.fillStyle = '#5a5a54'; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r - 2, a, a + .45); g.closePath(); g.fill(); }
    g.strokeStyle = 'rgba(150,150,140,.6)'; g.lineWidth = .8; for (let k = 1; k < 4; k++) { g.beginPath(); g.arc(cx, cy, (r - 1) * k / 4, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(cx - r, cy); g.lineTo(cx + r, cy); g.moveTo(cx, cy - r); g.lineTo(cx, cy + r); g.stroke();
    m8Disc(g, cx, cy, r * .22, '#2a2a26', '#8a8a82');
}
function m12Pipe(g, pts, w, tone) { g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = w + 3; g.beginPath(); pts.forEach(function (p, i) { i ? g.lineTo(p[0] + 2, p[1] + 3) : g.moveTo(p[0] + 2, p[1] + 3); }); g.stroke(); g.strokeStyle = tone || '#7a7a72'; g.lineWidth = w; g.beginPath(); pts.forEach(function (p, i) { i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }); g.stroke(); g.strokeStyle = 'rgba(255,255,245,.35)'; g.lineWidth = Math.max(1, w * .25); g.beginPath(); pts.forEach(function (p, i) { i ? g.lineTo(p[0] - w * .2, p[1] - w * .2) : g.moveTo(p[0] - w * .2, p[1] - w * .2); }); g.stroke();
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let d = 30; d < L; d += 60) { const x = a[0] + (b[0] - a[0]) * d / L, y = a[1] + (b[1] - a[1]) * d / L; g.fillStyle = '#4a4a44'; g.beginPath(); g.arc(x, y, w * .75, 0, 7); g.fill(); } } g.lineCap = 'butt'; }
function m12Stencil(g, txt, x, y, size, rot, a) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.font = '700 ' + size + 'px "Stardos Stencil", Impact'; g.textAlign = 'center'; g.fillStyle = 'rgba(235,225,190,' + (a || .22) + ')'; g.fillText(txt, 0, 0); g.restore(); }
function m12Hatch(g, x, y, w, h) { g.fillStyle = '#3a3a34'; g.fillRect(x, y, w, h); g.fillStyle = '#1a1a18'; g.fillRect(x + 2, y + 2, w - 4, h - 4); g.strokeStyle = 'rgba(200,200,190,.35)'; g.lineWidth = 1; g.strokeRect(x + .5, y + .5, w - 1, h - 1); for (let i = 0; i < 3; i++) { g.fillStyle = '#5a5a52'; g.fillRect(x + 3, y + 3 + i * (h - 6) / 3, w - 6, 1.6); } }
function m12Ladder(g, x, y, len, vert) { g.strokeStyle = '#8a8a80'; g.lineWidth = 1.4; g.beginPath(); if (vert) { g.moveTo(x, y); g.lineTo(x, y + len); g.moveTo(x + 8, y); g.lineTo(x + 8, y + len); for (let k = 4; k < len; k += 6) { g.moveTo(x, y + k); g.lineTo(x + 8, y + k); } } else { g.moveTo(x, y); g.lineTo(x + len, y); g.moveTo(x, y + 8); g.lineTo(x + len, y + 8); for (let k = 4; k < len; k += 6) { g.moveTo(x + k, y); g.lineTo(x + k, y + 8); } } g.stroke(); }
function m12FlatRoof(g, x, y, w, h, tone, seed) {
    m12Concrete(g, x, y, w, h, tone, seed);
    const r = m12Rng(seed); g.fillStyle = 'rgba(30,28,24,.25)'; for (let i = 0; i < 4; i++) g.fillRect(x + r() * w * .8, y + r() * h * .8, 30 + r() * 60, 20 + r() * 40); // tar patches
    m12Stain(g, x + 10, y + 10, w - 20, h - 20, Math.round(w * h / 3000), seed + 3);
    m12Bevel(g, x, y, w, h, 7, 'rgba(200,200,185,.38)', 'rgba(0,0,0,.45)'); // parapet
    g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1.2; g.strokeRect(x + 7.5, y + 7.5, w - 15, h - 15);
    g.strokeStyle = '#141412'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2);
}
function m12BuildingsHD(g) {
    // ---------- LOX plant ----------
    (function () { const x = 330, y = 230, w = 310, h = 240; m12FlatRoof(g, x, y, w, h, '#5c5d58', 31);
        g.fillStyle = 'rgba(200,220,255,.07)'; g.fillRect(x + 8, y + 8, w - 16, h - 16);
        for (let i = 0; i < 6; i++) m12Fan(g, 385 + (i % 3) * 95, 290 + Math.floor(i / 3) * 112, 22, i * .7);
        m12Pipe(g, [[x + 16, y + 200], [x + 290, y + 200], [x + 290, y + 120], [x + 330, y + 120]], 6, '#8a8e92'); m12Pipe(g, [[x + 16, y + 214], [x + 300, y + 214], [x + 300, y + 60], [x + 330, y + 60]], 5, '#6e7a86');
        // frost blooming on the cold pipes
        for (let i = 0; i < 18; i++) { const px = x + 30 + i * 15, gr = g.createRadialGradient(px, y + 207, 0, px, y + 207, 14); gr.addColorStop(0, 'rgba(230,240,255,.35)'); gr.addColorStop(1, 'rgba(230,240,255,0)'); g.fillStyle = gr; g.fillRect(px - 14, y + 193, 28, 28); }
        g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x + 236, y + 20, 56, 44); g.fillStyle = '#4a4a44'; g.fillRect(x + 232, y + 14, 56, 44); m12Bevel(g, x + 232, y + 14, 56, 44, 4, 'rgba(220,220,200,.3)', 'rgba(0,0,0,.4)'); m12Hatch(g, x + 244, y + 24, 16, 22); // stair hut
        m12Ladder(g, x + 12, y + 30, 120, true); m12Stencil(g, 'W 2', x + 160, y + 172, 30, 0, .16); m12Stencil(g, 'FLÜSSIGER SAUERSTOFF', x + 150, y + 36, 11, 0, .25);
        m12Streaks(g, x + 8, y + h - 8, w - 16, 18, 24, 7); })();
    // LOX storage spheres: polished, frosted, with walkways
    [[650, 250], [650, 340]].forEach(function (p, i) { const cx = p[0] + 35, cy = p[1] + 35; g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(cx + 8, cy + 10, 37, 33, 0, 0, 7); g.fill();
        const tg = g.createRadialGradient(cx - 12, cy - 14, 2, cx, cy, 38); tg.addColorStop(0, '#ffffff'); tg.addColorStop(.25, '#dfe6f2'); tg.addColorStop(.7, '#8e98aa'); tg.addColorStop(1, '#3e4656'); g.fillStyle = tg; g.beginPath(); g.arc(cx, cy, 35, 0, 7); g.fill();
        g.strokeStyle = 'rgba(40,50,60,.5)'; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, 35, 0, 7); g.stroke(); g.beginPath(); g.ellipse(cx, cy, 35, 10, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(cx, cy, 10, 35, 0, 0, 7); g.stroke();
        g.strokeStyle = 'rgba(160,165,170,.8)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 40, -2.6, .5); g.stroke(); m8Disc(g, cx, cy, 5, '#4a4e56', '#c8ccd4');
        const fr = g.createRadialGradient(cx, cy + 20, 2, cx, cy + 20, 30); fr.addColorStop(0, 'rgba(240,248,255,.4)'); fr.addColorStop(1, 'rgba(240,248,255,0)'); g.fillStyle = fr; g.beginPath(); g.arc(cx, cy + 20, 30, 0, 7); g.fill(); });
    // ---------- assembly hall: sawtooth roof with glowing north lights ----------
    (function () { const x = 330, y = 620, w = 370, h = 280, n = 9, bh = h / n;
        g.fillStyle = '#3a3e30'; g.fillRect(x, y, w, h);
        for (let i = 0; i < n; i++) { const yy = y + i * bh;
            const rg = g.createLinearGradient(0, yy, 0, yy + bh); rg.addColorStop(0, '#2e3226'); rg.addColorStop(.12, '#565c48'); rg.addColorStop(.7, '#6a705a'); rg.addColorStop(.72, '#22261c'); rg.addColorStop(1, '#22261c'); g.fillStyle = rg; g.fillRect(x, yy, w, bh);
            // glazing strip: panes, mullions, warm light from the night shift inside, a few panes blacked out
            const gy = yy + bh * .72, gh = bh * .26; const r = m12Rng(70 + i);
            for (let px = x + 4; px < x + w - 4; px += 12) { const lit = r() > .15; g.fillStyle = lit ? 'rgba(255,196,120,' + (.35 + r() * .35) + ')' : '#0c0e10'; g.fillRect(px, gy, 10, gh); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(px, gy, 10, 1.2); }
            g.fillStyle = '#16180f'; for (let px = x + 2; px < x + w; px += 12) g.fillRect(px, gy, 2, gh);
            g.fillStyle = 'rgba(255,190,110,.06)'; g.fillRect(x, gy + gh, w, bh * .3);
            // corrugations
            g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; for (let px = x + 3; px < x + w; px += 6) { g.beginPath(); g.moveTo(px, yy + bh * .14); g.lineTo(px, yy + bh * .68); g.stroke(); } }
        // camouflage netting over half the roof
        const r = m12Rng(9); for (let i = 0; i < 26; i++) { const cx = x + 30 + r() * (w - 60), cy = y + 20 + r() * (h * .55); g.fillStyle = ['rgba(52,66,34,.75)', 'rgba(82,72,44,.7)', 'rgba(30,38,22,.75)'][i % 3]; g.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr = 18 + r() * 22; g.lineTo(cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr); } g.closePath(); g.fill(); }
        g.save(); g.beginPath(); g.rect(x + 10, y + 10, w - 20, h * .6); g.clip(); g.strokeStyle = 'rgba(20,20,12,.35)'; g.lineWidth = .7; for (let k = -h; k < w; k += 8) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k + h, y + h); g.moveTo(x + k + h, y); g.lineTo(x + k, y + h); g.stroke(); } g.restore();
        for (let i = 0; i < 5; i++) { const vx = x + 40 + i * 72; g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(vx + 3, y + 4, 18, 14); g.fillStyle = '#5a5e52'; g.fillRect(vx, y, 18, 14); m8Disc(g, vx + 9, y + 7, 5, '#2a2c26', '#8a8e82'); }
        g.strokeStyle = '#121410'; g.lineWidth = 3; g.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3); m12Bevel(g, x, y, w, h, 4, 'rgba(210,210,190,.25)', 'rgba(0,0,0,.45)');
        m12Stencil(g, 'HALLE 4', x + w - 70, y + h - 16, 18, 0, .2); })();
    // ---------- launch bunker: monolithic concrete, chamfered, turfed ----------
    (function () { const x = 1380, y = 640, w = 180, h = 120;
        g.fillStyle = '#4a4a44'; g.beginPath(); g.moveTo(x + 14, y); g.lineTo(x + w - 14, y); g.lineTo(x + w, y + 14); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.lineTo(x, y + 14); g.closePath(); g.fill();
        const bv = g.createLinearGradient(x, y, x + w, y + h); bv.addColorStop(0, '#8a8a80'); bv.addColorStop(1, '#3a3a34'); g.strokeStyle = bv; g.lineWidth = 8; g.stroke();
        m12Concrete(g, x + 12, y + 12, w - 24, h - 24, '#62625a', 51); for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 12, y + 18 + i * 12, w - 24, 1); }
        // turf and moss creeping on the north side
        const r = m12Rng(55); for (let i = 0; i < 40; i++) { g.fillStyle = ['rgba(50,70,30,.7)', 'rgba(70,90,40,.6)', 'rgba(30,44,20,.7)'][i % 3]; g.beginPath(); g.ellipse(x + 14 + r() * (w - 28), y + 14 + r() * 30, 4 + r() * 10, 3 + r() * 5, r() * 3, 0, 7); g.fill(); }
        [[x + 48, y + 46], [x + 128, y + 46]].forEach(function (p) { m8Disc(g, p[0] + 3, p[1] + 4, 15, 'rgba(0,0,0,.45)', 'rgba(0,0,0,.45)'); const dg = g.createRadialGradient(p[0] - 4, p[1] - 5, 1, p[0], p[1], 14); dg.addColorStop(0, '#b8b8ae'); dg.addColorStop(1, '#3a3a34'); g.fillStyle = dg; g.beginPath(); g.arc(p[0], p[1], 14, 0, 7); g.fill(); g.fillStyle = '#060606'; g.fillRect(p[0] - 8, p[1] - 2, 16, 4); g.fillStyle = 'rgba(140,200,255,.5)'; g.fillRect(p[0] - 6, p[1] - 1, 4, 2); });
        g.strokeStyle = '#2a2a26'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 90, y + 80); g.lineTo(x + 90, y + 20); g.stroke(); m8Disc(g, x + 90, y + 20, 3, '#2a2a26', '#c0c0b8'); // aerial
        m12Stencil(g, 'XII', x + 90, y + 100, 22, 0, .22); m12Streaks(g, x + 4, y + h - 6, w - 8, 14, 18, 57); })();
    // ---------- guidance lab: hipped tile roof, dormers, chimneys ----------
    (function () { const x = 1760, y = 220, w = 320, h = 220, inset = 70, ry = y + h / 2;
        const plane = function (pts, c0, c1) { const gr = g.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1]); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.beginPath(); pts.forEach(function (p, i) { i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }); g.closePath(); g.fill(); };
        plane([[x, y], [x + w, y], [x + w - inset, ry], [x + inset, ry]], '#8a4e34', '#6a3a26'); // north (lit by the moon)
        plane([[x + inset, ry], [x + w - inset, ry], [x + w, y + h], [x, y + h]], '#3e2216', '#5a3020'); // south
        plane([[x, y], [x + inset, ry], [x, y + h]], '#7a442c', '#5a321e'); plane([[x + w, y], [x + w, y + h], [x + w - inset, ry]], '#4a2818', '#3a1e12');
        g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1; for (let yy = y + 5; yy < y + h; yy += 7) { g.beginPath(); for (let xx = x; xx < x + w; xx += 8) { g.moveTo(xx, yy); g.quadraticCurveTo(xx + 4, yy + 3, xx + 8, yy); } g.stroke(); }
        const r = m12Rng(17); for (let i = 0; i < 60; i++) { g.fillStyle = r() > .5 ? 'rgba(40,60,30,.35)' : 'rgba(120,70,40,.25)'; g.fillRect(x + r() * w, y + r() * h, 8, 6); } g.restore(); // moss, replaced tiles
        g.strokeStyle = '#2a160c'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + inset, ry); g.lineTo(x + w - inset, ry); g.lineTo(x + w, y); g.moveTo(x, y + h); g.lineTo(x + inset, ry); g.moveTo(x + w, y + h); g.lineTo(x + w - inset, ry); g.stroke();
        g.strokeStyle = 'rgba(255,220,180,.25)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + inset, ry - 2); g.lineTo(x + w - inset, ry - 2); g.stroke();
        g.strokeStyle = '#a0683a'; g.lineWidth = 3; g.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3); // copper gutter
        [[x + 110, y + 150], [x + 160, y + 150], [x + 210, y + 150]].forEach(function (p) { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(p[0] + 3, p[1] + 4, 28, 26); g.fillStyle = '#4a2a1a'; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + 28, p[1]); g.lineTo(p[0] + 28, p[1] + 24); g.lineTo(p[0] + 14, p[1] + 30); g.lineTo(p[0], p[1] + 24); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,200,120,.85)'; g.fillRect(p[0] + 6, p[1] + 14, 16, 10); g.fillStyle = '#2a160c'; g.fillRect(p[0] + 13, p[1] + 14, 2, 10); g.fillRect(p[0] + 6, p[1] + 18, 16, 1.4); });
        [[x + 60, y + 40], [x + 250, y + 52]].forEach(function (p) { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(p[0] + 4, p[1] + 5, 20, 20); g.fillStyle = '#6a4030'; g.fillRect(p[0], p[1], 20, 20); g.strokeStyle = '#3a2016'; g.lineWidth = 1; for (let k = 4; k < 20; k += 5) { g.beginPath(); g.moveTo(p[0], p[1] + k); g.lineTo(p[0] + 20, p[1] + k); g.stroke(); } g.fillStyle = '#121010'; g.fillRect(p[0] + 4, p[1] + 4, 12, 12); });
        g.strokeStyle = '#2a2a2a'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x + 290, y + 20); g.lineTo(x + 290, y - 30); g.moveTo(x + 280, y - 22); g.lineTo(x + 300, y - 22); g.moveTo(x + 283, y - 14); g.lineTo(x + 297, y - 14); g.stroke(); })();
    // ---------- barracks huts: tar-paper roofs, stove pipes ----------
    for (let i = 0; i < 3; i++) { const x = 1760 + i * 108, y = 760, w = 100, h = 140;
        const hg = g.createLinearGradient(x, 0, x + w, 0); hg.addColorStop(0, '#3e3a32'); hg.addColorStop(.49, '#2e2a24'); hg.addColorStop(.51, '#191712'); hg.addColorStop(1, '#24211b'); g.fillStyle = hg; g.fillRect(x, y, w, h);
        g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1; for (let yy = y + 10; yy < y + h; yy += 18) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); } g.strokeStyle = 'rgba(255,255,240,.1)'; for (let xx = x + 8; xx < x + w; xx += 16) { g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + h); g.stroke(); }
        g.fillStyle = '#121010'; g.fillRect(x + w / 2 - 1.5, y, 3, h); m12Stain(g, x, y, w, h, 6, 300 + i);
        m8Disc(g, x + 72, y + 40, 5, '#1a1a1a', '#5a5a5a'); const sm = g.createRadialGradient(x + 84, y + 30, 1, x + 84, y + 30, 22); sm.addColorStop(0, 'rgba(180,180,170,.25)'); sm.addColorStop(1, 'rgba(180,180,170,0)'); g.fillStyle = sm; g.fillRect(x + 60, y + 8, 48, 48);
        g.fillStyle = 'rgba(255,200,120,.55)'; g.fillRect(x + 44, y + h - 3, 12, 3); g.strokeStyle = '#0c0c0a'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2); }
    // ---------- radar platform ----------
    g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(1888, 610, 60, 60); g.fillStyle = '#4a4e44'; g.fillRect(1880, 600, 60, 60); m12Bevel(g, 1880, 600, 60, 60, 5, 'rgba(220,220,200,.3)', 'rgba(0,0,0,.4)'); m12Ladder(g, 1884, 604, 50, true);
}
/* ---------- full-resolution finishing pass (world pixels, no scale) ---------- */
function m12DetailPass(g) {
    const W = M8W, H = M8H, S = M12S, r = m12Rng(1234), solids = M8.obs.filter(function (o) { return ['loxplant', 'hall', 'bunker', 'lab', 'barracks', 'radar', 'loxtank', 'truck', 'halftrack', 'meiller', 'ltruck', 'crates', 'drums', 'pad', 'gantry'].indexOf(o.kind) >= 0; });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    // long soft shadows to the south-east + ambient occlusion where every solid meets the ground
    solids.forEach(function (o) { const big = ['loxplant', 'hall', 'bunker', 'lab', 'barracks'].indexOf(o.kind) >= 0, d = big ? 34 : 12;
        g.save(); g.beginPath(); g.rect(0, 0, W, H); g.rect(o.x, o.y, o.w, o.h); g.clip('evenodd');
        g.fillStyle = 'rgba(0,0,0,' + (big ? .42 : .3) + ')'; g.filter = 'blur(' + (big ? 10 : 5) + 'px)'; g.beginPath(); g.moveTo(o.x + o.w, o.y); g.lineTo(o.x + o.w + d, o.y + d * 1.2); g.lineTo(o.x + o.w + d, o.y + o.h + d * 1.2); g.lineTo(o.x + d, o.y + o.h + d * 1.2); g.lineTo(o.x, o.y + o.h); g.lineTo(o.x + o.w, o.y + o.h); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = big ? 10 : 5; g.strokeRect(o.x, o.y, o.w, o.h); g.filter = 'none'; g.restore();
        if (big) { g.strokeStyle = 'rgba(190,205,235,.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(o.x, o.y + o.h); g.lineTo(o.x, o.y); g.lineTo(o.x + o.w, o.y); g.stroke(); } }); // moonlit rim on the N/W edges
    // grit, gravel and needles everywhere (skipping roofs)
    const onRoof = function (x, y) { for (let i = 0; i < solids.length; i++) { const o = solids[i]; if (x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h) return true; } return false; };
    for (let i = 0; i < 90000; i++) { const x = r() * W, y = r() * H * .93; if (onRoof(x, y)) continue; const k = r(); g.fillStyle = k < .4 ? 'rgba(170,160,130,.16)' : k < .75 ? 'rgba(0,0,0,.2)' : 'rgba(90,110,60,.14)'; g.fillRect(x, y, 1 + r() * 1.6, 1 + r() * 1.6); }
    const F = M12X ? M12X.fence : { x0: 0, y0: 0, x1: W, y1: H };
    g.lineWidth = .9; for (let i = 0; i < 26000; i++) { const x = r() * W, y = r() * H * .82; if (x > F.x0 && x < F.x1 && y > F.y0 && y < F.y1) continue; const a = r() * Math.PI; g.strokeStyle = r() > .5 ? 'rgba(150,110,60,.32)' : 'rgba(40,30,18,.35)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6); g.stroke(); }
    // tyre ruts down the roads, puddles catching the light, oil under the vehicles
    const roads = [[[1180, 1120], [1180, 620]], [[300, 580], [2120, 580]], [[880, 580], [880, 980]], [[515, 580], [515, 930]], [[1470, 580], [1470, 790]], [[1920, 470], [1920, 760]]];
    roads.forEach(function (rd) { const a = rd[0], b = rd[1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) * S, nx = -(b[1] - a[1]) * S / L, ny = (b[0] - a[0]) * S / L; [-9, 9].forEach(function (o) { g.strokeStyle = 'rgba(10,10,8,.32)'; g.lineWidth = 4; g.beginPath(); for (let t = 0; t <= 1; t += .02) { const x = (a[0] + (b[0] - a[0]) * t) * S + nx * (o + Math.sin(t * 40) * 1.5), y = (a[1] + (b[1] - a[1]) * t) * S + ny * (o + Math.sin(t * 40) * 1.5); t ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); });
        for (let k = 0; k < L / 300; k++) { const t = r(), x = (a[0] + (b[0] - a[0]) * t) * S + nx * (r() - .5) * 30, y = (a[1] + (b[1] - a[1]) * t) * S + ny * (r() - .5) * 30, rw = 9 + r() * 16, ang = Math.atan2(b[1] - a[1], b[0] - a[0]); const pg = g.createRadialGradient(x, y, 0, x, y, rw); pg.addColorStop(0, 'rgba(26,34,48,.55)'); pg.addColorStop(.85, 'rgba(26,34,48,.4)'); pg.addColorStop(1, 'rgba(26,34,48,0)'); g.fillStyle = pg; g.beginPath(); g.ellipse(x, y, rw, rw * .4, ang, 0, 7); g.fill(); g.strokeStyle = 'rgba(170,190,220,.22)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, rw * .7, rw * .22, ang, 3.6, 5.4); g.stroke(); } });
    M8.obs.forEach(function (o) { if (['truck', 'halftrack', 'meiller', 'ltruck'].indexOf(o.kind) < 0) return; const gr = g.createRadialGradient(o.x + o.w / 2, o.y + o.h / 2, 2, o.x + o.w / 2, o.y + o.h / 2, Math.max(o.w, o.h) * .8); gr.addColorStop(0, 'rgba(10,8,6,.5)'); gr.addColorStop(1, 'rgba(10,8,6,0)'); g.globalCompositeOperation = 'destination-over'; g.fillStyle = gr; g.fillRect(o.x - o.w, o.y - o.h, o.w * 3, o.h * 3); g.globalCompositeOperation = 'source-over'; });
    for (let i = 0; i < 40; i++) { const x = (900 + r() * 700) * S, y = (840 + r() * 140) * S; if (onRoof(x, y)) continue; const gr = g.createRadialGradient(x, y, 0, x, y, 10 + r() * 18); gr.addColorStop(0, 'rgba(6,6,8,.5)'); gr.addColorStop(.8, 'rgba(60,40,80,.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - 30, y - 30, 60, 60); }
    // cracked concrete in the test stand + hazard stripes round the launch table
    const A = M12_ARENA; g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; for (let i = 0; i < 70; i++) { let x = (A.cx + (r() - .5) * A.rx * 1.4) * S, y = (A.cy + (r() - .5) * A.ry * 1.4) * S; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - .5) * 26; y += (r() - .5) * 26; g.lineTo(x, y); } g.stroke(); }
    const P = M12X ? M12X.pad : { x: 1150 * S, y: 330 * S, w: 60 * S, h: 60 * S }; g.save(); g.beginPath(); g.rect(P.x - 26, P.y - 26, P.w + 52, P.h + 52); g.rect(P.x - 12, P.y - 12, P.w + 24, P.h + 24); g.clip('evenodd'); for (let k = -200; k < 300; k += 18) { g.fillStyle = 'rgba(214,170,30,.55)'; g.beginPath(); g.moveTo(P.x - 26 + k, P.y - 26); g.lineTo(P.x - 26 + k + 9, P.y - 26); g.lineTo(P.x - 26 + k + 9 + 200, P.y + 174); g.lineTo(P.x - 26 + k + 200, P.y + 174); g.fill(); } g.restore();
    // scattered junk lying flat: pallets, tarps, cable runs, jerrycans
    for (let i = 0; i < 46; i++) { const x = (250 + r() * 1950) * S, y = (150 + r() * 860) * S; if (onRoof(x, y) || M8.obs.some(function (o) { return x > o.x - 20 && x < o.x + o.w + 20 && y > o.y - 20 && y < o.y + o.h + 20; })) continue; const k = i % 4; g.save(); g.translate(x, y); g.rotate(r() * 3);
        if (k === 0) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-14, -9, 32, 22); g.fillStyle = '#6a5636'; for (let j = 0; j < 5; j++) g.fillRect(-16, -11 + j * 4.4, 30, 3); }
        else if (k === 1) { g.fillStyle = 'rgba(52,60,40,.85)'; g.beginPath(); g.moveTo(-18, -10); g.lineTo(16, -14); g.lineTo(20, 12); g.lineTo(-14, 14); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 1; g.stroke(); }
        else if (k === 2) { g.strokeStyle = 'rgba(10,10,10,.75)'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-40, 0); g.bezierCurveTo(-10, -20, 10, 20, 40, 0); g.stroke(); }
        else { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(-5, -7, 13, 17); g.fillStyle = '#4a5434'; g.fillRect(-7, -9, 12, 16); g.fillStyle = '#2a2e1e'; g.fillRect(-4, -11, 4, 3); }
        g.restore(); }
    g.restore();
}
