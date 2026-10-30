/* =====================================================
   MISSION 10 — art: the harbour, the pens, boats, the frogman, HUD
===================================================== */
function m10H(a, b, c) { return m8R(a * 12.9898 + (b || 0) * 78.233 + (c || 0) * 37.719 + 9.7); }
function m10IsWater(x, y) { return !m10Land().some(function (R) { return x > R[0] - 4 && x < R[0] + R[2] + 4 && y > R[1] - 4 && y < R[1] + R[3] + 4; }); }
function m10Concrete(g, x, y, w, h, tone, slab) {
    g.fillStyle = tone || '#6a6862'; g.fillRect(x, y, w, h); const S = slab || 40;
    for (let yy = y; yy < y + h; yy += S) for (let xx = x; xx < x + w; xx += S) { const v = m10H(xx, yy) * 18 - 9; g.fillStyle = 'rgba(' + (v > 0 ? '255,255,255,' + v / 120 : '0,0,0,' + (-v) / 80) + ')'; g.fillRect(xx, yy, Math.min(S, x + w - xx), Math.min(S, y + h - yy)); }
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; for (let yy = y + S; yy < y + h; yy += S) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); } for (let xx = x + S; xx < x + w; xx += S) { g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + h); g.stroke(); }
    for (let i = 0; i < w * h / 900; i++) { g.fillStyle = m10H(i, x, y) > .5 ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.06)'; g.fillRect(x + m10H(i, 1, x) * w, y + m10H(i, 2, y) * h, 2 + m10H(i, 3) * 3, 2); }
}
function m10QuayEdge(g, x0, y0, x1, y1, side) { // waterline: dark wall face, bollards, tyre fenders
    const hor = y0 === y1; g.fillStyle = '#2a2a28'; if (hor) g.fillRect(x0, y0 - (side < 0 ? 8 : 0), x1 - x0, 8); else g.fillRect(x0 - (side < 0 ? 8 : 0), y0, 8, y1 - y0);
    g.strokeStyle = 'rgba(220,200,80,.55)'; g.lineWidth = 2; g.setLineDash([14, 10]); g.beginPath(); if (hor) { g.moveTo(x0, y0 - side * 14); g.lineTo(x1, y0 - side * 14); } else { g.moveTo(x0 - side * 14, y0); g.lineTo(x0 - side * 14, y1); } g.stroke(); g.setLineDash([]);
    const L = hor ? x1 - x0 : y1 - y0; for (let t = 30; t < L; t += 90) { const bx = hor ? x0 + t : x0 - side * 18, by = hor ? y0 - side * 18 : y0 + t; m8Disc(g, bx, by, 5, '#1a1a18', '#6a6a60'); const fx = hor ? x0 + t + 40 : x0 + side * 3, fy = hor ? y0 + side * 3 : y0 + t + 40; g.fillStyle = '#121212'; g.beginPath(); g.ellipse(fx, fy, hor ? 9 : 5, hor ? 5 : 9, 0, 0, 7); g.fill(); g.strokeStyle = '#3a3a38'; g.lineWidth = 1.5; g.stroke(); }
}
function m10Rails(g, x0, y0, x1, y1) { const hor = y0 === y1, L = hor ? x1 - x0 : y1 - y0; g.fillStyle = '#3a3026'; for (let t = 0; t < L; t += 12) { if (hor) g.fillRect(x0 + t, y0 - 10, 6, 20); else g.fillRect(x0 - 10, y0 + t, 20, 6); } g.fillStyle = '#8a8a84'; if (hor) { g.fillRect(x0, y0 - 6, L, 2); g.fillRect(x0, y0 + 5, L, 2); } else { g.fillRect(x0 - 6, y0, 2, L); g.fillRect(x0 + 5, y0, 2, L); } }
function m10Crane(g, x, y, ang) { g.save(); g.translate(x, y); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(-22 + 10, -22 + 12, 44, 44); g.strokeStyle = '#5a4a2a'; g.lineWidth = 5; g.strokeRect(-22, -22, 44, 44); g.beginPath(); g.moveTo(-22, -22); g.lineTo(22, 22); g.moveTo(22, -22); g.lineTo(-22, 22); g.stroke(); g.fillStyle = '#7a6a3a'; g.fillRect(-14, -14, 28, 28); g.fillStyle = '#3a3220'; g.fillRect(-8, -8, 16, 16); g.rotate(ang); g.strokeStyle = '#8a7840'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(130, 0); g.stroke(); g.strokeStyle = '#4a3e20'; g.lineWidth = 1.5; for (let i = 10; i < 130; i += 10) { g.beginPath(); g.moveTo(i, -3); g.lineTo(i + 5, 3); g.stroke(); } g.strokeStyle = '#2a2a28'; g.lineWidth = 1; g.beginPath(); g.moveTo(126, 0); g.lineTo(126, 18); g.stroke(); g.fillStyle = '#2a2a28'; g.fillRect(122, 18, 8, 6); g.restore(); }
function m10Crates(g, x, y, n, seed) { for (let i = 0; i < n; i++) { const cx = x + (i % 3) * 24, cy = y + Math.floor(i / 3) * 24; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(cx + 5, cy + 6, 22, 22); g.fillStyle = m10H(i, seed) > .5 ? '#7a6038' : '#6a5230'; g.fillRect(cx, cy, 22, 22); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 1; g.strokeRect(cx + 2, cy + 2, 18, 18); g.beginPath(); g.moveTo(cx + 2, cy + 2); g.lineTo(cx + 20, cy + 20); g.stroke(); } }
function m10Drums(g, x, y, n) { for (let i = 0; i < n; i++) m8Disc(g, x + (i % 4) * 15, y + Math.floor(i / 4) * 15, 7, '#2a3020', '#6a7a4a'); }
function m10BuildBase() {
    const c = document.createElement('canvas'); c.width = M10W; c.height = M10H; const g = c.getContext('2d');
    // water
    const wg = g.createLinearGradient(0, 0, 0, M10H); wg.addColorStop(0, '#1a2c32'); wg.addColorStop(.7, '#1c3038'); wg.addColorStop(1, '#203640'); g.fillStyle = wg; g.fillRect(0, 0, M10W, M10H);
    for (let i = 0; i < 2600; i++) { const x = m10H(i, 1) * M10W, y = m10H(i, 2) * M10H; g.strokeStyle = m10H(i, 3) > .5 ? 'rgba(120,160,170,.08)' : 'rgba(0,0,0,.12)'; g.lineWidth = 1 + m10H(i, 4); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - 3, x + 20 + m10H(i, 5) * 20, y); g.stroke(); }
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(10,20,26,.25)'; g.beginPath(); g.ellipse(m10H(i, 6) * M10W, 1300 + m10H(i, 7) * 400, 160, 30, 0, 0, 7); g.fill(); }
    // land
    const land = m10Land();
    // north dockyard
    m10Concrete(g, 0, 0, M10W, 140, '#5e5c56', 50); m10Rails(g, 0, 40, M10W, 40); m10Rails(g, 0, 90, 700, 90);
    [[100, 20, 120, 40], [1720, 10, 160, 50], [2080, 30, 140, 60]].forEach(function (b, i) { m9Roof(g, b[0], b[1], b[2], b[3], true, i % 2 ? ['#5a5e68', '#3a3e48', '#22242c'] : ['#6a4a36', '#4a3020', '#2a1a10']); });
    [[2300, 70], [2360, 70], [400, 70]].forEach(function (t) { m8Disc(g, t[0], t[1], 26, '#3a3c38', '#9a9c92'); g.strokeStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.arc(t[0], t[1], 18, 0, 7); g.stroke(); });
    // west & east quays
    [[0, 140, 520, 910, 1], [1880, 140, 520, 910, -1]].forEach(function (Q) { m10Concrete(g, Q[0], Q[1], Q[2], Q[3], '#625f58', 44); const edge = Q[4] > 0 ? Q[0] + Q[2] : Q[0]; m10QuayEdge(g, edge, Q[1] + 60, edge, Q[1] + Q[3], Q[4] > 0 ? -1 : 1); m10QuayEdge(g, Q[0], Q[1] + Q[3], Q[0] + Q[2], Q[1] + Q[3], 1);
        const rx = Q[4] > 0 ? 410 : 1990; m10Rails(g, rx, 140, rx, 1050); m10Rails(g, rx + Q[4] * -70, 140, rx + Q[4] * -70, 1050);
        const wx = Q[4] > 0 ? 40 : 2080; [[200, 220], [480, 200], [740, 240]].forEach(function (b, i) { m9Roof(g, wx, b[0], 260, b[1], false, i % 2 ? ['#5a5e68', '#3a3e48', '#22242c'] : ['#6e665a', '#4e463a', '#2e2820']); g.fillStyle = 'rgba(230,220,180,.4)'; g.font = '700 22px "Stardos Stencil", Impact'; g.textAlign = 'center'; });
        m10Crates(g, Q[4] > 0 ? 320 : 2010, 980, 6, Q[0]); m10Drums(g, Q[4] > 0 ? 330 : 2020, 160, 12); });
    m10Crane(g, 470, 330, 0); m10Crane(g, 470, 820, .2); m10Crane(g, 1930, 480, Math.PI); m10Crane(g, 1930, 900, Math.PI - .3);
    // moles
    [[0, 1180, 1050], [1350, 1180, 1050]].forEach(function (Mo) { for (let i = 0; i < Mo[2] / 9; i++) { const x = Mo[0] + i * 9 + m10H(i, Mo[0]) * 6; [1172 - m10H(i, 3) * 8, 1248 + m10H(i, 4) * 8].forEach(function (y, k) { g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x + 3, y + 3, 9, 7, 0, 0, 7); g.fill(); g.fillStyle = ['#5a5852', '#6a6862', '#4a4842'][(i + k) % 3]; g.beginPath(); g.ellipse(x, y, 8 + m10H(i, k) * 4, 6 + m10H(k, i) * 3, m10H(i, k, 1), 0, 7); g.fill(); }); } m10Concrete(g, Mo[0], Mo[1], Mo[2], 60, '#6e6c66', 30); g.strokeStyle = 'rgba(220,200,80,.4)'; g.setLineDash([12, 12]); g.beginPath(); g.moveTo(Mo[0], 1210); g.lineTo(Mo[0] + Mo[2], 1210); g.stroke(); g.setLineDash([]); });
    [[1035, 1205], [1365, 1205]].forEach(function (t) { m8Disc(g, t[0], t[1], 24, '#3a3a36', '#8a8a80'); m8Disc(g, t[0], t[1], 14, '#2a2a26', '#5a5a54'); });
    m8Sandbags(g, 980, 1186, 40, 14); m8Sandbags(g, 1380, 1186, 40, 14);
    // the pen: piers and bays (roof drawn separately)
    m10Concrete(g, 760, 140, 900, 60, '#5a5852', 30);
    M10_PIERS.forEach(function (x) { m10Concrete(g, x, 200, 60, 360, '#6a6862', 30); g.fillStyle = 'rgba(220,190,60,.6)'; g.fillRect(x + 2, 200, 3, 360); g.fillRect(x + 55, 200, 3, 360); for (let y = 220; y < 560; y += 60) m8Disc(g, x + 8, y, 3.4, '#1a1a18', '#6a6a60'); });
    M10_BAYS.forEach(function (x) { const bg = g.createLinearGradient(0, 200, 0, 560); bg.addColorStop(0, '#0e1a1e'); bg.addColorStop(1, '#16262c'); g.fillStyle = bg; g.fillRect(x, 200, 150, 360); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x, 200, 150, 14); });
    // channel buoys + entrance
    g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(1050, 1240, 300, 460);
    // moon-grade
    g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgb(150,160,192)'; g.fillRect(0, 0, M10W, M10H); g.globalCompositeOperation = 'source-over';
    // pen roof as its own layer
    const r = document.createElement('canvas'); r.width = 900; r.height = 420; const rg = r.getContext('2d');
    m10Concrete(rg, 0, 0, 900, 420, '#7a7872', 60); rg.strokeStyle = 'rgba(0,0,0,.35)'; rg.lineWidth = 3; for (let x = 0; x <= 900; x += 150) { rg.beginPath(); rg.moveTo(x, 0); rg.lineTo(x, 420); rg.stroke(); }
    [[180, 120, 34], [520, 260, 26], [700, 90, 40], [330, 330, 22]].forEach(function (cr) { const cg = rg.createRadialGradient(cr[0], cr[1], 2, cr[0], cr[1], cr[2]); cg.addColorStop(0, '#4a4842'); cg.addColorStop(.8, '#5e5c56'); cg.addColorStop(1, 'rgba(140,136,128,.9)'); rg.fillStyle = cg; rg.beginPath(); rg.arc(cr[0], cr[1], cr[2], 0, 7); rg.fill(); });
    [[120, 60], [780, 60], [450, 200]].forEach(function (f) { m8Disc(rg, f[0], f[1], 26, '#3a3c34', '#7a7c70'); m8Sandbags(rg, f[0] - 34, f[1] - 34, 68, 12); rg.strokeStyle = '#1a1a18'; rg.lineWidth = 3; for (let i = 0; i < 4; i++) { rg.beginPath(); rg.moveTo(f[0] + (i % 2 ? 4 : -4), f[1] + (i > 1 ? 4 : -4)); rg.lineTo(f[0] + (i % 2 ? 4 : -4) + 26, f[1] + (i > 1 ? 4 : -4) - 14); rg.stroke(); } });
    rg.fillStyle = 'rgba(230,220,180,.25)'; rg.font = '700 46px "Stardos Stencil", Impact'; rg.textAlign = 'center'; rg.fillText('KEROMAN III', 450, 380);
    rg.fillStyle = 'rgba(0,0,0,.5)'; rg.fillRect(0, 400, 900, 20);
    rg.globalCompositeOperation = 'multiply'; rg.fillStyle = 'rgb(150,160,192)'; rg.fillRect(0, 0, 900, 420);
    M10.roof = r;
    // ripple sample points on water
    M10.ripples = []; for (let i = 0; i < 900; i++) { const x = m10H(i, 11) * M10W, y = m10H(i, 12) * M10H; if (m10IsWater(x, y)) M10.ripples.push([x, y, m10H(i, 13) * 6.28, 8 + m10H(i, 14) * 18]); }
    return c;
}
/* ---------- vessels ---------- */
function m10DrawSub(h, now) {
    const L = h.hl + h.r, w = h.r, sunkK = h.sunk ? Math.min(1, (now - h.sunk) / 4000) : 0, moving = h.arriving && h.spd > .05 && !h.sunk;
    if (moving) { for (let i = 0; i < 6; i++) { const k = ((now / 900) + i / 6) % 1, d = L + 10 + k * 160, sp = 10 + k * 50; ctx.fillStyle = 'rgba(210,225,235,' + .18 * (1 - k) + ')'; [-1, 1].forEach(function (s2) { ctx.beginPath(); ctx.ellipse(h.cx - Math.cos(h.a) * d - Math.sin(h.a) * sp * s2, h.cy - Math.sin(h.a) * d + Math.cos(h.a) * sp * s2, 7 + k * 8, 3, h.a, 0, 7); ctx.fill(); }); } ctx.fillStyle = 'rgba(230,240,245,.18)'; ctx.beginPath(); ctx.ellipse(h.cx + Math.cos(h.a) * (L + 6), h.cy + Math.sin(h.a) * (L + 6), 10, 18, h.a, 0, 7); ctx.fill(); }
    ctx.save(); ctx.translate(h.cx, h.cy); ctx.rotate(h.a); ctx.globalAlpha = 1 - sunkK * .7;
    // shadow + waterline foam
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(6, 8, L + 2, w + 3, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(200,215,225,.22)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, L + 3, w + 3, 0, 0, 7); ctx.stroke();
    // pressure hull + saddle tanks (wider in the middle)
    const hg = ctx.createLinearGradient(0, -w, 0, w); hg.addColorStop(0, '#1a1e24'); hg.addColorStop(.35, '#5e6872'); hg.addColorStop(.5, '#6e7882'); hg.addColorStop(.65, '#4e5862'); hg.addColorStop(1, '#14181c'); ctx.fillStyle = hg;
    ctx.beginPath(); ctx.moveTo(L, 0); ctx.quadraticCurveTo(L - 40, -w * .75, L - 90, -w * .95); ctx.quadraticCurveTo(0, -w * 1.08, -L + 80, -w * .85); ctx.quadraticCurveTo(-L + 20, -w * .5, -L, 0); ctx.quadraticCurveTo(-L + 20, w * .5, -L + 80, w * .85); ctx.quadraticCurveTo(0, w * 1.08, L - 90, w * .95); ctx.quadraticCurveTo(L - 40, w * .75, L, 0); ctx.fill(); ctx.strokeStyle = '#0a0c10'; ctx.lineWidth = 1.5; ctx.stroke();
    // rust streaks + limber holes
    ctx.fillStyle = 'rgba(120,70,40,.28)'; for (let i = 0; i < 10; i++) { const x = -L + 40 + i * (2 * L - 80) / 10; ctx.fillRect(x, w * .55, 2, w * .35); ctx.fillRect(x + 6, -w * .9, 2, w * .3); }
    ctx.fillStyle = 'rgba(0,0,0,.55)'; for (let x = -L + 60; x < L - 70; x += 9) { ctx.fillRect(x, -w * .82, 4, 2); ctx.fillRect(x, w * .74, 4, 2); }
    // teak deck casing
    ctx.fillStyle = '#3e3428'; ctx.beginPath(); ctx.moveTo(L - 30, 0); ctx.lineTo(L - 70, -7); ctx.lineTo(-L + 50, -7); ctx.lineTo(-L + 30, 0); ctx.lineTo(-L + 50, 7); ctx.lineTo(L - 70, 7); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = .7; for (let x = -L + 48; x < L - 60; x += 5) { ctx.beginPath(); ctx.moveTo(x, -7); ctx.lineTo(x, 7); ctx.stroke(); }
    // net cutter at the bow + jumping wire
    ctx.strokeStyle = '#2a2e32'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L + 6, 0); ctx.lineTo(L - 24, 0); ctx.stroke(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(L - 20 + i * 5, 0); ctx.lineTo(L - 22 + i * 5, -3); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(200,200,190,.35)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(L - 4, 0); ctx.lineTo(24, 0); ctx.moveTo(-40, 0); ctx.lineTo(-L + 10, 0); ctx.stroke();
    // 88mm deck gun
    m8Disc(ctx, 70, 0, 8, '#1a1e22', '#6a747e'); ctx.fillStyle = '#20262c'; ctx.fillRect(70, -2, 46, 4); ctx.fillStyle = '#4a545e'; ctx.fillRect(64, -6, 14, 12);
    // conning tower with the Wintergarten and 20mm flak
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(6, 8, 44, 16, 0, 0, 7); ctx.fill();
    const tg = ctx.createLinearGradient(0, -15, 0, 15); tg.addColorStop(0, '#3a424a'); tg.addColorStop(.5, '#6a747e'); tg.addColorStop(1, '#2a3036'); ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(34, 0); ctx.quadraticCurveTo(30, -14, 10, -15); ctx.lineTo(-38, -13); ctx.quadraticCurveTo(-50, 0, -38, 13); ctx.lineTo(10, 15); ctx.quadraticCurveTo(30, 14, 34, 0); ctx.fill(); ctx.strokeStyle = '#0e1014'; ctx.stroke();
    ctx.fillStyle = '#121418'; ctx.beginPath(); ctx.ellipse(12, 0, 14, 9, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a9096'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(12, 0, 14, 9, 0, 0, 7); ctx.stroke();
    m8Disc(ctx, -24, 0, 7, '#20262c', '#7a848e'); ctx.strokeStyle = '#121418'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-24 + Math.cos(now / 3000) * 16, Math.sin(now / 3000) * 16); ctx.stroke();
    m8Disc(ctx, 0, -3, 2.6, '#121418', '#9aa4ae'); m8Disc(ctx, 4, 4, 2.2, '#121418', '#9aa4ae');
    ctx.fillStyle = '#e8e4d8'; ctx.beginPath(); ctx.moveTo(26, -10); ctx.lineTo(30, -6); ctx.lineTo(26, -2); ctx.lineTo(22, -6); ctx.closePath(); ctx.fill();
    // stern planes / screws
    ctx.fillStyle = '#2a3036'; ctx.fillRect(-L + 6, -w * .9, 10, w * 1.8);
    ctx.restore();
    // crew on deck when docked (with torches)
    if (!h.arriving && !h.sunk) { [[40, 12], [-70, -10]].forEach(function (q, i) { const c = Math.cos(h.a), s2 = Math.sin(h.a), x = h.cx + q[0] * c - q[1] * s2, y = h.cy + q[0] * s2 + q[1] * c; m8Disc(ctx, x, y, 4, '#1a1e22', '#5a646e'); ctx.fillStyle = '#e8e4d8'; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill(); }); }
    ctx.save(); ctx.fillStyle = 'rgba(230,230,220,.6)'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.fillText(h.name, h.cx + Math.sin(h.a) * 36, h.cy - Math.cos(h.a) * 36); ctx.restore();
    if (h.mined && !h.sunk) { const m = m10SubMineWorld(h); ctx.fillStyle = '#2a2a1e'; ctx.beginPath(); ctx.arc(m.x, m.y, 5, 0, 7); ctx.fill(); if (Math.floor(now / 500) % 2) { ctx.fillStyle = '#ff4020'; ctx.beginPath(); ctx.arc(m.x, m.y, 2, 0, 7); ctx.fill(); } }
    if (h.sunk) { ctx.fillStyle = 'rgba(20,16,10,' + .5 * sunkK + ')'; ctx.beginPath(); ctx.ellipse(h.cx, h.cy, h.r * 2.6, L * 1.1, h.a + Math.PI / 2, 0, 7); ctx.fill(); [-1, 0, 1].forEach(function (i) { ddpFire(h.cx + Math.cos(h.a) * i * 80, h.cy + Math.sin(h.a) * i * 80, .5 - sunkK * .2, now / 1000, i + 3 + h.cx); }); }
}
function m10DrawTanker(h, now) {
    const cx = h.ax, y0 = h.ay - h.r, y1 = h.by + h.r, w = h.r, sunkK = h.sunk ? Math.min(1, (now - h.sunk) / 5000) : 0;
    ctx.save(); ctx.translate(cx, (y0 + y1) / 2); ctx.rotate(sunkK * .08); ctx.translate(-cx, -(y0 + y1) / 2);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(cx - w + 8, y0 + 10, w * 2, y1 - y0);
    ctx.fillStyle = '#1a1a1c'; ctx.beginPath(); ctx.moveTo(cx, y0); ctx.quadraticCurveTo(cx + w, y0 + 50, cx + w, y0 + 110); ctx.lineTo(cx + w, y1 - 30); ctx.quadraticCurveTo(cx + w, y1, cx, y1); ctx.quadraticCurveTo(cx - w, y1, cx - w, y1 - 30); ctx.lineTo(cx - w, y0 + 110); ctx.quadraticCurveTo(cx - w, y0 + 50, cx, y0); ctx.fill();
    ctx.fillStyle = '#4a3a2a'; ctx.beginPath(); ctx.moveTo(cx, y0 + 10); ctx.quadraticCurveTo(cx + w - 6, y0 + 56, cx + w - 6, y0 + 112); ctx.lineTo(cx + w - 6, y1 - 34); ctx.quadraticCurveTo(cx + w - 6, y1 - 6, cx, y1 - 6); ctx.quadraticCurveTo(cx - w + 6, y1 - 6, cx - w + 6, y1 - 34); ctx.lineTo(cx - w + 6, y0 + 112); ctx.quadraticCurveTo(cx - w + 6, y0 + 56, cx, y0 + 10); ctx.fill();
    ctx.fillStyle = '#2a2018'; for (let y = y0 + 90; y < y1 - 160; y += 50) { ctx.fillRect(cx - 18, y, 36, 26); } ctx.strokeStyle = '#7a6a50'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, y0 + 70); ctx.lineTo(cx, y1 - 140); ctx.stroke();
    m9Roof(ctx, cx - w + 10, y1 - 140, (w - 10) * 2, 90, false, ['#d8d0c0', '#a8a090', '#6a6458']); m8Disc(ctx, cx, y1 - 40, 13, '#2a1a10', '#7a3a20'); ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.arc(cx, y1 - 40, 7, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(230,220,200,.55)'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.fillText('ROSENHEIM', cx, y0 + 40); ctx.restore();
    if (h.mined && !h.sunk) { const m = h.mineAt; ctx.fillStyle = '#2a2a1e'; ctx.beginPath(); ctx.arc(m.x, m.y, 5, 0, 7); ctx.fill(); if (Math.floor(now / 500) % 2) { ctx.fillStyle = '#ff4020'; ctx.beginPath(); ctx.arc(m.x, m.y, 2, 0, 7); ctx.fill(); } }
    if (h.sunk) { ctx.fillStyle = 'rgba(10,8,6,.45)'; ctx.beginPath(); ctx.ellipse(cx + 40, (y0 + y1) / 2, 120, 300, 0, 0, 7); ctx.fill(); [0, 1, 2, 3].forEach(function (i) { ddpFire(cx + (i % 2 ? 12 : -12), y0 + 80 + i * 90, .6, now / 1000, i * 3 + 1); }); }
}
function m10DrawBoat(b) { const L = Math.hypot(b.bx - b.ax, b.by - b.ay), a = Math.atan2(b.by - b.ay, b.bx - b.ax); ctx.save(); ctx.translate(b.ax, b.ay); ctx.rotate(a); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(L / 2 + 5, 6, L / 2 + b.r, b.r, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#3a3e3a'; ctx.beginPath(); ctx.moveTo(-b.r, -b.r); ctx.lineTo(L, -b.r); ctx.quadraticCurveTo(L + b.r * 1.6, 0, L, b.r); ctx.lineTo(-b.r, b.r); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#5a5e56'; ctx.fillRect(L * .3, -b.r * .6, L * .3, b.r * 1.2); ctx.restore(); }
function m10DrawLaunch(L, now) {
    L.wake.forEach(function (w) { const k = (now - w.t) / 2400, a = w.a === undefined ? L.ang : w.a, px = -Math.sin(a), py = Math.cos(a), sp = 8 + k * 46; ctx.fillStyle = 'rgba(210,225,235,' + .22 * (1 - k) + ')'; [-1, 1].forEach(function (s2) { ctx.beginPath(); ctx.ellipse(w.x + px * sp * s2, w.y + py * sp * s2, 5 + k * 6, 2 + k * 2, a, 0, 7); ctx.fill(); }); if (k < .4) { ctx.fillStyle = 'rgba(230,240,245,' + .2 * (1 - k / .4) + ')'; ctx.beginPath(); ctx.ellipse(w.x, w.y, 7, 4, a, 0, 7); ctx.fill(); } });
    ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(L.ang);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(4, 8, 46, 16, 0, 0, 7); ctx.fill();
    ctx.fillStyle = m8Grad(ctx, 0, -15, 0, 15, [[0, '#6a6e68'], [.5, '#4a4e48'], [1, '#2a2e2a']]); ctx.beginPath(); ctx.moveTo(-38, -13); ctx.lineTo(18, -14); ctx.quadraticCurveTo(44, -8, 48, 0); ctx.quadraticCurveTo(44, 8, 18, 14); ctx.lineTo(-38, 13); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#121412'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = '#7a6a50'; ctx.fillRect(-30, -8, 46, 16); ctx.fillStyle = '#5a5e58'; ctx.fillRect(-14, -9, 22, 18); ctx.fillStyle = 'rgba(160,200,220,.5)'; ctx.fillRect(6, -7, 2, 14);
    m8Disc(ctx, 30, 0, 5, '#1a1c1a', '#5a5e58'); ctx.strokeStyle = '#121212'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(44, 0); ctx.stroke();
    ctx.fillStyle = '#2a2a24'; [[-34, -8], [-34, 0], [-34, 8]].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 3.4, 0, 7); ctx.fill(); });
    [[-4, -11], [-22, 9]].forEach(function (p) { m8Disc(ctx, p[0], p[1], 4, '#3a3e30', '#7a8060'); }); m8Disc(ctx, 0, 0, 4, '#1a1a18', '#d8d4c0');
    ctx.restore();
}
function m10DrawFrogman(P, now) {
    ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(P.ang);
    if (P.sub) { ctx.globalAlpha = .95; ctx.strokeStyle = 'rgba(140,220,230,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 16, 9, 0, 0, 7); ctx.stroke(); const kick = Math.sin(P.kick) * 5; ctx.fillStyle = '#16242a'; [[-1, kick], [1, -kick]].forEach(function (s) { ctx.beginPath(); ctx.moveTo(-10, s[0] * 4); ctx.lineTo(-24, s[0] * 4 + s[1]); ctx.lineTo(-30, s[0] * 7 + s[1]); ctx.lineTo(-28, s[0] * 1 + s[1]); ctx.closePath(); ctx.fill(); }); ctx.fillStyle = '#1e2c34'; ctx.beginPath(); ctx.ellipse(0, 0, 13, 6.4, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#4a5a40'; ctx.beginPath(); ctx.ellipse(-2, 0, 6, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#1a242a'; ctx.beginPath(); ctx.arc(13, 0, 4.6, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(160,200,210,.5)'; ctx.fillRect(14, -2.6, 2, 5.2); ctx.globalAlpha = 1; }
    else { const st = Math.sin(P.kick * 1.3); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(-4, 0, 16, 8, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#141a1c'; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(12 + st * 8, -12 - st * 2); ctx.moveTo(4, 6); ctx.lineTo(12 - st * 8, 12 + st * 2); ctx.stroke(); ctx.fillStyle = '#1a2226'; ctx.beginPath(); ctx.ellipse(0, 0, 9, 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#20282c'; ctx.beginPath(); ctx.arc(7, 0, 5.4, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(180,210,220,.75)'; ctx.fillRect(10.4, -3, 2.2, 6); ctx.strokeStyle = 'rgba(200,220,230,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, 14 + (now / 90) % 6, 0, 7); ctx.stroke(); }
    ctx.restore();
}
function m10DrawCanoe(x, y, now) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.3); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(4, 5, 50, 9, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#4a4a36'; ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(0, -11, 50, 0); ctx.quadraticCurveTo(0, 11, -50, 0); ctx.fill(); ctx.fillStyle = '#1a1a12'; ctx.beginPath(); ctx.ellipse(-12, 0, 9, 5, 0, 0, 7); ctx.fill(); m8Disc(ctx, 12, 0, 6, '#2a2a20', '#5a5a44'); ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 2; const p = Math.sin(now / 900) * .4; ctx.beginPath(); ctx.moveTo(12 - 18 * Math.cos(p), -18 * Math.sin(p) - 10); ctx.lineTo(12 + 18 * Math.cos(p), 18 * Math.sin(p) + 10); ctx.stroke(); ctx.restore(); }
function m10DrawMGB(x, y, now, ready) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(6, 10, 74, 22, 0, 0, 7); ctx.fill(); ctx.fillStyle = m8Grad(ctx, 0, -20, 0, 20, [[0, '#5a6a5a'], [.5, '#3a4a3a'], [1, '#1e2a1e']]); ctx.beginPath(); ctx.moveTo(-64, -18); ctx.lineTo(30, -19); ctx.quadraticCurveTo(70, -10, 78, 0); ctx.quadraticCurveTo(70, 10, 30, 19); ctx.lineTo(-64, 18); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#0e140e'; ctx.lineWidth = 1.6; ctx.stroke(); ctx.fillStyle = '#6a7462'; ctx.fillRect(-20, -11, 34, 22); ctx.fillStyle = '#2a3a2a'; ctx.fillRect(-6, -9, 12, 18); m8Disc(ctx, 44, 0, 8, '#1a201a', '#6a7a6a'); ctx.strokeStyle = '#121812'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(44, 0); ctx.lineTo(66, 0); ctx.stroke(); m8Disc(ctx, -44, 0, 7, '#1a201a', '#6a7a6a'); ctx.fillStyle = '#e8e0d0'; ctx.font = 'bold 9px monospace'; ctx.save(); ctx.rotate(Math.PI); ctx.textAlign = 'center'; ctx.fillText('MGB 314', 0, 24); ctx.restore(); ctx.restore(); if (ready && Math.floor(now / 600) % 2) { ctx.fillStyle = '#80b0ff'; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); } }
/* ---------- frame ---------- */
function m10Draw(now) {
    const M = M10, P = M.p, W = canvas.width, H = canvas.height; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#05080a'; ctx.fillRect(0, 0, W, H); ctx.scale(W / 1100, H / 700);
    const sh = M.shake || 0; ctx.save(); ctx.translate(-Math.round(M.cam.x) + (Math.random() - .5) * sh, -Math.round(M.cam.y) + (Math.random() - .5) * sh);
    ctx.drawImage(M.base, Math.round(M.cam.x) - 2, Math.round(M.cam.y) - 2, 1104, 704, Math.round(M.cam.x) - 2, Math.round(M.cam.y) - 2, 1104, 704);
    M.subK = (M.subK || 0) + ((P.sub ? 1 : 0) - (M.subK || 0)) * .12;
    // animated ripples
    ctx.lineWidth = 1.2; if (M.subK < .9) M.ripples.forEach(function (r) { if (r[0] < M.cam.x - 40 || r[0] > M.cam.x + 1140 || r[1] < M.cam.y - 20 || r[1] > M.cam.y + 720) return; const a = .06 + .06 * Math.sin(now / 900 + r[2]); ctx.strokeStyle = 'rgba(170,200,210,' + a + ')'; const off = Math.sin(now / 1400 + r[2]) * 6; ctx.beginPath(); ctx.moveTo(r[0] + off, r[1]); ctx.quadraticCurveTo(r[0] + off + r[3] / 2, r[1] - 2, r[0] + off + r[3], r[1]); ctx.stroke(); });
    m10DrawUnder(now);
    // net
    ctx.strokeStyle = 'rgba(160,160,150,.55)'; ctx.lineWidth = 1; for (let x = M10_NET.x0; x < M10_NET.x1; x += 8) { if (M.netGaps.some(function (gp) { return Math.abs(gp - x) < 30; })) continue; ctx.beginPath(); ctx.moveTo(x, M10_NET.y - 4); ctx.lineTo(x + 8, M10_NET.y + 4); ctx.moveTo(x, M10_NET.y + 4); ctx.lineTo(x + 8, M10_NET.y - 4); ctx.stroke(); } for (let x = M10_NET.x0 + 10; x < M10_NET.x1; x += 30) { m8Disc(ctx, x, M10_NET.y, 5, '#3a2a18', '#a06030'); }
    M.netGaps.forEach(function (gp) { ctx.strokeStyle = 'rgba(160,160,150,.5)'; ctx.beginPath(); ctx.moveTo(gp - 30, M10_NET.y); ctx.quadraticCurveTo(gp - 20, M10_NET.y + 14, gp - 26, M10_NET.y + 22); ctx.moveTo(gp + 30, M10_NET.y); ctx.quadraticCurveTo(gp + 20, M10_NET.y - 14, gp + 26, M10_NET.y - 22); ctx.stroke(); });
    // channel buoys
    [[1060, 1300], [1340, 1300], [1060, 1460], [1340, 1460]].forEach(function (b, i) { m8Disc(ctx, b[0], b[1], 7, i % 2 ? '#3a1010' : '#103a10', i % 2 ? '#c03020' : '#30a040'); if (Math.floor(now / 1000 + i) % 3 === 0) { ctx.fillStyle = i % 2 ? '#ff6050' : '#60ff70'; ctx.beginPath(); ctx.arc(b[0], b[1], 3, 0, 7); ctx.fill(); } });
    M.moored.forEach(m10DrawBoat); m10DrawTanker(M.tanker, now); M.subs.forEach(function (h) { m10DrawSub(h, now); });
    M.charges.forEach(function (c) { const k = Math.min(1, (now - c.t) / (c.at - c.t)); ctx.strokeStyle = 'rgba(220,230,240,' + (.5 - k * .4) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(c.x, c.y, 6 + k * 18, 0, 7); ctx.stroke(); m8Disc(ctx, c.x, c.y, 4 * (1 - k * .6), '#1a1a18', '#5a5a50'); });
    if (P.sub) m10DrawFrogman(P, now);
    m10DrawCanoe(M10_START.x, M10_START.y, now); m10DrawMGB(M10_PICK.x, M10_PICK.y, now, M.subs.every(function (s) { return s.mined; }));
    M.launches.forEach(function (L) { m10DrawLaunch(L, now); });
    m10DrawExtras(now);
    if (!P.sub) m10DrawFrogman(P, now);
    M.sentries.forEach(function (s) { m8DrawMan({ x: s.x, y: s.y, ang: s.ang, team: 'en', kind: 'sold', gun: s.gun, seed: s.seed, hp: 1, maxHp: 1, dead: s.dead, deathAng: s.deathAng, moving: !s.wait && !s.dead, walk: s.walk, r: 10 }, now); });
    M.lights.forEach(function (L) { m8Disc(ctx, L.x, L.y, 9, '#1a1a18', L.dead ? '#3a3a36' : '#d8d4c0'); ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(L.ang); ctx.fillStyle = '#2a2a26'; ctx.fillRect(-4, -7, 14, 14); ctx.fillStyle = L.dead ? '#202020' : '#fffbe0'; ctx.fillRect(9, -6, 3, 12); ctx.restore(); });
    // pen roof (fades when you're underneath it)
    const inPen = M.cine ? 1 : (P.x > M10_PEN.x0 - 10 && P.x < M10_PEN.x1 + 10 && P.y < M10_PEN.y1 + 10 ? 1 : 0); M.roofA = (M.roofA === undefined ? 1 : M.roofA) + ((inPen ? .15 : 1) - (M.roofA === undefined ? 1 : M.roofA)) * .12; ctx.save(); ctx.globalAlpha = M.roofA; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(M10_PEN.x0 + 14, M10_PEN.y0 + 20, 900, 420); ctx.drawImage(M.roof, M10_PEN.x0, M10_PEN.y0 - 20); ctx.restore();
    // particles + fx
    M.parts.forEach(function (p) { const a = Math.max(0, p.life); if (p.k === 'bub') { ctx.strokeStyle = 'rgba(200,230,240,' + a * .6 + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y - (1 - a) * 8, p.r, 0, 7); ctx.stroke(); } else if (p.k === 'ring') { ctx.strokeStyle = 'rgba(200,220,230,' + a * .3 + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (1 - a) * 22, 0, 7); ctx.stroke(); } else if (p.k === 'drop' || p.k === 'splash') { ctx.fillStyle = 'rgba(220,235,245,' + a * .8 + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r || 2.4, 0, 7); ctx.fill(); } else if (p.k === 'spark') { ctx.fillStyle = 'rgba(255,230,160,' + a + ')'; ctx.fillRect(p.x - 1, p.y - 1, 3, 3); } else if (p.k === 'chunk') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot + (1 - a) * 6); ctx.fillStyle = 'rgba(120,118,110,' + a + ')'; ctx.fillRect(-p.r, -p.r * .6, p.r * 2, p.r * 1.2); ctx.restore(); } else if (p.k === 'smoke') { const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); gg.addColorStop(0, 'rgba(30,26,22,' + a * .55 + ')'); gg.addColorStop(1, 'rgba(30,26,22,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); } });
    M.fx.forEach(function (f) { const k = (now - f.t) / (f.k === 'boom' ? 1800 : 400); if (f.k === 'flash') { ctx.fillStyle = 'rgba(255,230,160,' + (1 - k) + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, 7, 0, 7); ctx.fill(); }
        else if (f.k === 'geyser') { const kk = (now - f.t) / 600; if (kk < 1) { ctx.fillStyle = 'rgba(230,240,250,' + (1 - kk) * .8 + ')'; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; ctx.beginPath(); ctx.arc(f.x + Math.cos(a) * 20 * kk * f.s, f.y + Math.sin(a) * 20 * kk * f.s, (14 - kk * 8) * f.s, 0, 7); ctx.fill(); } } }
        else if (f.k === 'boom') { const r = 40 * f.s + k * 160 * f.s, gg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r); gg.addColorStop(0, 'rgba(255,250,220,' + Math.max(0, 1 - k * 1.4) + ')'); gg.addColorStop(.4, 'rgba(255,140,40,' + Math.max(0, .9 - k) + ')'); gg.addColorStop(1, 'rgba(120,40,10,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, 7); ctx.fill(); } });
    M.bullets.forEach(function (b) { ctx.strokeStyle = 'rgba(255,240,180,.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .6, b.y - b.vy * .6); ctx.stroke(); });
    ctx.restore();
    m10Dark(now);
    if (P.sub) { const ug = ctx.createRadialGradient(550, 350, 180, 550, 350, 700); ug.addColorStop(0, 'rgba(10,40,60,.1)'); ug.addColorStop(1, 'rgba(4,20,34,.62)'); ctx.fillStyle = ug; ctx.fillRect(0, 0, 1100, 700); }
    if (P.hurtAt && now - P.hurtAt < 350) { const g = ctx.createRadialGradient(550, 350, 200, 550, 350, 650); g.addColorStop(0, 'rgba(160,10,0,0)'); g.addColorStop(1, 'rgba(160,10,0,' + .45 * (1 - (now - P.hurtAt) / 350) + ')'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1100, 700); }
    if (!M.cine) m10Hud(now); else m10CineHud(now);
    const st = (now - M.t0) / 1000; if (st < 1.2) { ctx.fillStyle = 'rgba(0,0,0,' + (1 - st / 1.2) + ')'; ctx.fillRect(0, 0, 1100, 700); }
    if (M.lost) { ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 280, 1100, 110); ctx.textAlign = 'center'; ctx.font = '700 44px "Stardos Stencil", Impact, sans-serif'; ctx.fillStyle = '#ff5040'; ctx.fillText(M.failWhy === 'drown' ? 'LOST IN THE HARBOUR' : 'THE RAID HAS FAILED', 550, 345); }
    ctx.restore();
}
function m10Dark(now) {
    const M = M10; if (!M.dk) { M.dk = document.createElement('canvas'); M.dk.width = 1100; M.dk.height = 700; }
    const d = M.dk.getContext('2d'); d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, 1100, 700); d.fillStyle = 'rgba(4,8,20,.5)'; d.fillRect(0, 0, 1100, 700); d.save(); d.translate(-M.cam.x, -M.cam.y); d.globalCompositeOperation = 'destination-out';
    const hole = function (x, y, r, a) { const g = d.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = g; d.beginPath(); d.arc(x, y, r, 0, 7); d.fill(); };
    const cone = function (x, y, ang, len, half, a) { d.save(); d.translate(x, y); d.rotate(ang); const g = d.createLinearGradient(0, 0, len, 0); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = g; d.beginPath(); d.moveTo(0, 0); d.lineTo(len, -Math.tan(half) * len); d.lineTo(len, Math.tan(half) * len); d.closePath(); d.fill(); d.restore(); };
    M.lights.forEach(function (L) { if (!L.dead) { cone(L.x, L.y, L.ang, L.len, L.half, .95); hole(L.x, L.y, 40, .6); } });
    M.lamps.forEach(function (L) { if (!L.dead) hole(L.x, L.y, L.r, .8); });
    M.launches.forEach(function (L) { cone(L.x, L.y, L.ang, 300, .25, .8); hole(L.x, L.y, 60, .4); });
    M.sentries.forEach(function (s) { if (!s.dead) cone(s.x, s.y, s.ang, 170, .3, .45); });
    M.fx.forEach(function (f) { if (f.k === 'boom') hole(f.x, f.y, 420 * f.s, Math.max(0, 1 - (now - f.t) / 1800)); if (f.k === 'flash') hole(f.x, f.y, 60, .8); });
    M.subs.concat([M.tanker]).forEach(function (h) { if (h.sunk) hole((h.ax + h.bx) / 2, (h.ay + h.by) / 2, 300, .8); });
    hole(M10_PICK.x, M10_PICK.y, 80, .4); m10DarkExtras(hole, cone, now);
    d.restore(); ctx.drawImage(M.dk, 0, 0);
    // beams: additive
    ctx.save(); ctx.translate(-M.cam.x, -M.cam.y); ctx.globalCompositeOperation = 'lighter';
    M.lights.forEach(function (L) { if (L.dead) return; ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(L.ang); const g = ctx.createLinearGradient(0, 0, L.len, 0); g.addColorStop(0, 'rgba(210,225,255,.28)'); g.addColorStop(1, 'rgba(210,225,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(L.len, -Math.tan(L.half) * L.len); ctx.lineTo(L.len, Math.tan(L.half) * L.len); ctx.lineTo(0, 3); ctx.fill(); ctx.restore(); });
    m10LighterExtras(now); if (!M.p.sub) { ctx.restore(); ctx.save(); ctx.translate(-M.cam.x, -M.cam.y); m10SurfaceReflections(now); ctx.globalCompositeOperation = 'lighter'; }
    M.lamps.forEach(function (L) { if (L.dead) return; const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r); g.addColorStop(0, 'rgba(255,200,120,.16)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2); });
    M.subs.concat([M.tanker]).forEach(function (h) { if (!h.sunk) return; const x = (h.ax + h.bx) / 2, y = (h.ay + h.by) / 2, g = ctx.createRadialGradient(x, y, 0, x, y, 300); g.addColorStop(0, 'rgba(255,140,50,.3)'); g.addColorStop(1, 'rgba(255,140,50,0)'); ctx.fillStyle = g; ctx.fillRect(x - 300, y - 300, 600, 600); });
    ctx.restore();
}
function m10Objective() { const M = M10, n = M.subs.filter(function (s) { return s.mined; }).length; if (M.timer > 0 || n === 3) return 'GET TO THE GUNBOAT (EAST, OUTSIDE THE MOLE)' + (M.timer > 0 ? ' · ' + Math.floor(M.timer / 60) + ':' + String(Math.floor(M.timer % 60)).padStart(2, '0') : ''); if (!M.netGaps.length && M.p.y > 1100) return 'CUT THROUGH THE BOOM NET AT THE HARBOUR MOUTH'; if (M.arrival.state < 2 && n === 2 && !M.subs[2].mined) return 'U-981 IS STILL COMING IN — WAIT FOR HER, OR CATCH HER ON THE WAY' + (M.tanker.mined ? '' : ' · OPTIONAL: TANKER'); return 'MINE THE U-BOATS · ' + n + ' / 3' + (M.arrival.state === 0 ? ' (2 IN THE PENS, 1 DUE HOME)' : '') + (M.tanker.mined ? ' · TANKER ✓' : ' · OPTIONAL: THE TANKER'); }
function m10Hud(now) {
    const M = M10, P = M.p; ctx.save();
    m8Panel(12, 12, 236, 136, M.alarm); ctx.textAlign = 'left'; ctx.font = '700 12px "Stardos Stencil", Impact'; ctx.fillStyle = '#9ab8d0'; ctx.fillText('LT. HAYES · RNVR FROGMAN', 22, 30);
    const bar = function (y, label, v, col) { ctx.font = 'bold 11px monospace'; ctx.fillStyle = '#e0e8ee'; ctx.fillText(label, 22, y + 8); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(100, y, 136, 10); ctx.fillStyle = col; ctx.fillRect(100, y, 136 * Math.max(0, v) / 100, 10); };
    bar(42, 'HEALTH', P.hp, P.hp > 50 ? '#7fc06a' : P.hp > 25 ? '#e0a040' : '#e04030'); bar(60, 'OXYGEN', P.o2, P.o2 > 30 ? '#60b0e0' : (Math.floor(now / 300) % 2 ? '#e04030' : '#60b0e0'));
    ctx.font = 'bold 12px monospace'; ctx.fillStyle = P.sub ? '#60c0f0' : '#f0d070'; ctx.fillText(P.sub ? '▼ SUBMERGED — HIDDEN' : '▲ SURFACED — VISIBLE', 22, 92);
    ctx.fillStyle = '#e0e8ee'; ctx.font = 'bold 11px monospace'; ctx.fillText('LIMPETS ×' + M.limpets + '   WELROD ×' + M.ammo, 22, 112); ctx.fillStyle = 'rgba(224,232,238,.55)'; ctx.font = '10px monospace'; ctx.fillText('SPACE dive · SHIFT quiet · F plant/cut · click', 22, 132); if (M.heard) { ctx.font = 'bold 12px monospace'; ctx.fillStyle = Math.floor(now / 250) % 2 ? '#ff7050' : '#ffc0a0'; ctx.textAlign = 'center'; ctx.fillText('◉ HYDROPHONE — THEY CAN HEAR YOU', 550, 82); ctx.textAlign = 'left'; }
    // objective + alert
    ctx.font = 'bold 12px monospace'; const ob = m10Objective(), ow = ctx.measureText(ob).width + 40; m8Panel(550 - ow / 2, 10, ow, 30, M.timer > 0); ctx.textAlign = 'center'; ctx.fillStyle = M.timer > 0 ? '#ffb0a0' : '#e7edc9'; ctx.fillText(ob, 550, 30);
    const st = M.alarm ? 'ALARM — THEY\'RE HUNTING YOU' : M.sus > .05 ? 'SOMEONE\'S LOOKING...' : 'UNDETECTED'; ctx.font = 'bold 13px monospace'; ctx.fillStyle = M.alarm ? (Math.floor(now / 300) % 2 ? '#ff5040' : '#ffb0a0') : M.sus > .05 ? '#ffd070' : '#8fd07a'; ctx.fillText('● ' + st, 550, 58); if (!M.alarm && M.sus > .02) { ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(480, 64, 140, 5); ctx.fillStyle = '#ffd070'; ctx.fillRect(480, 64, 140 * Math.min(1, M.sus), 5); }
    // minimap
    const mx = 1100 - 12 - 240, my = 12, sc = 240 / M10W; m8Panel(mx - 4, my - 4, 248, M10H * sc + 8); ctx.fillStyle = '#1c3038'; ctx.fillRect(mx, my, 240, M10H * sc); ctx.fillStyle = '#6a6862'; M.land.forEach(function (R) { ctx.fillRect(mx + R[0] * sc, my + R[1] * sc, R[2] * sc, R[3] * sc); });
    M.subs.forEach(function (h) { if (h.arriving && M.arrival.state === 0) return; ctx.strokeStyle = h.mined ? '#7fc06a' : '#ffd040'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + h.ax * sc, my + h.ay * sc); ctx.lineTo(mx + h.bx * sc, my + h.by * sc); ctx.stroke(); ctx.lineWidth = 1; }); ctx.fillStyle = M.tanker.mined ? '#7fc06a' : '#c0a060'; ctx.fillRect(mx + (M.tanker.ax - 20) * sc, my + M.tanker.ay * sc, 40 * sc, (M.tanker.by - M.tanker.ay) * sc);
    M.lights.forEach(function (L) { if (L.dead) return; ctx.strokeStyle = 'rgba(220,230,255,.5)'; ctx.beginPath(); ctx.moveTo(mx + L.x * sc, my + L.y * sc); ctx.lineTo(mx + (L.x + Math.cos(L.ang) * L.len) * sc, my + (L.y + Math.sin(L.ang) * L.len) * sc); ctx.stroke(); });
    M.launches.forEach(function (L) { ctx.fillStyle = '#ff6040'; ctx.fillRect(mx + L.x * sc - 2, my + L.y * sc - 2, 4, 4); });
    ctx.strokeStyle = '#d0c070'; ctx.beginPath(); ctx.moveTo(mx + M10_NET.x0 * sc, my + M10_NET.y * sc); ctx.lineTo(mx + M10_NET.x1 * sc, my + M10_NET.y * sc); ctx.stroke();
    ctx.fillStyle = '#80b0ff'; ctx.fillRect(mx + M10_PICK.x * sc - 3, my + M10_PICK.y * sc - 3, 6, 6); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx + P.x * sc, my + P.y * sc, 3, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.strokeRect(mx + M.cam.x * sc, my + M.cam.y * sc, 1100 * sc, 700 * sc);
    // interaction prompt
    const sx = P.x - M.cam.x, sy = P.y - M.cam.y; if (M.act) { const need = M.act.k === 'net' ? 2.2 : 2.4, k = Math.min(1, P.plantT / need); ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#e7edc9'; ctx.fillText(M.act.k === 'net' ? 'HOLD F — CUT THE NET' : 'HOLD F — LIMPET ON ' + M.act.h.name, sx, sy - 30); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(sx, sy, 20, 0, 7); ctx.stroke(); if (k > 0) { ctx.strokeStyle = '#ffd040'; ctx.beginPath(); ctx.arc(sx, sy, 20, -Math.PI / 2, -Math.PI / 2 + k * 6.28); ctx.stroke(); } }
    else if (!P.sub && M.subs.concat([M.tanker]).some(function (h) { return !h.mined && m10CapDist(h, P.x, P.y) < 40; })) { ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd070'; ctx.fillText('DIVE (SPACE) TO PLACE A LIMPET BELOW THE WATERLINE', sx, sy - 30); }
    if (M.msg && now - M.msgAt < M.msgDur) { ctx.textAlign = 'center'; ctx.font = 'bold 14px "Special Elite", "Courier New", monospace'; const wd = ctx.measureText(M.msg).width + 50; m8Panel(550 - wd / 2, 620, wd, 32); ctx.fillStyle = '#e7edc9'; ctx.fillText(M.msg, 550, 641); }
    if (!P.sub) { ctx.strokeStyle = 'rgba(255,240,200,.85)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(M.mx, M.my, 8, 0, 7); ctx.moveTo(M.mx - 13, M.my); ctx.lineTo(M.mx - 4, M.my); ctx.moveTo(M.mx + 4, M.my); ctx.lineTo(M.mx + 13, M.my); ctx.moveTo(M.mx, M.my - 13); ctx.lineTo(M.mx, M.my - 4); ctx.moveTo(M.mx, M.my + 4); ctx.lineTo(M.mx, M.my + 13); ctx.stroke(); }
    ctx.restore();
}
function m10CineHud(now) { const M = M10, k = Math.min(1, (now - M.cine.t0 - 3000) / 900); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 560, 1100, 100); ctx.textAlign = 'center'; ctx.font = '700 44px "Stardos Stencil", Impact, sans-serif'; ctx.fillStyle = '#ffd24a'; ctx.fillText('THE PENS ARE BURNING', 550, 612); ctx.font = '15px "Special Elite", monospace'; ctx.fillStyle = '#e8e0c0'; ctx.fillText('MGB 314 RUNS FOR HOME AT FORTY KNOTS', 550, 640); ctx.restore(); }
