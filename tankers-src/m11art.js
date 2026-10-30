/* =====================================================
   MISSION 11 — art: the castle floor plan, painted once; live actors, light and HUD
===================================================== */
function m11Noise(g, x, y, w, h, n, cols, rmin, rmax, seed) { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const r = rmin + m8R(seed + i * 3) * (rmax - rmin); g.beginPath(); g.ellipse(x + m8R(seed + i) * w, y + m8R(seed + i * 7) * h, r, r * (.5 + m8R(seed + i * 5) * .5), m8R(i) * 3, 0, 7); g.fill(); } }
function m11Planks(g, x, y, w, h, c0, c1, horiz, seed) { g.fillStyle = c0; g.fillRect(x, y, w, h); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); const step = 14;
    if (horiz) for (let yy = y; yy < y + h; yy += step) { const k = m8R(seed + yy); g.fillStyle = 'rgba(' + (k > .5 ? '255,230,190,' : '0,0,0,') + (.03 + k * .05) + ')'; g.fillRect(x, yy, w, step - 1); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, yy + step - 1, w, 1); for (let xx = x + (m8R(yy) * 120); xx < x + w; xx += 90 + m8R(xx + yy) * 80) g.fillRect(xx, yy, 1, step - 1); }
    else for (let xx = x; xx < x + w; xx += step) { const k = m8R(seed + xx); g.fillStyle = 'rgba(' + (k > .5 ? '255,230,190,' : '0,0,0,') + (.03 + k * .05) + ')'; g.fillRect(xx, y, step - 1, h); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(xx + step - 1, y, 1, h); for (let yy = y + (m8R(xx) * 120); yy < y + h; yy += 90 + m8R(xx + yy) * 80) g.fillRect(xx, yy, step - 1, 1); }
    g.restore(); }
function m11Cobbles(g, x, y, w, h, base, seed, sz) { g.fillStyle = base; g.fillRect(x, y, w, h); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); sz = sz || 10;
    for (let yy = y; yy < y + h; yy += sz) for (let xx = x - (Math.floor((yy - y) / sz) % 2) * sz / 2; xx < x + w; xx += sz) { const k = m8R(seed + xx * 1.3 + yy * 7.1); g.fillStyle = 'rgba(' + Math.round(110 + k * 50) + ',' + Math.round(104 + k * 44) + ',' + Math.round(92 + k * 36) + ',.55)'; g.beginPath(); g.ellipse(xx + sz / 2, yy + sz / 2, sz * .44, sz * .38, k, 0, 7); g.fill(); g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(xx + sz / 2 + 1, yy + sz / 2 + 1.5, sz * .4, sz * .3, k, 0, Math.PI); g.fill(); }
    g.restore(); }
function m11Flags(g, x, y, w, h, seed) { g.fillStyle = '#4a4840'; g.fillRect(x, y, w, h); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); for (let yy = y; yy < y + h; yy += 30) for (let xx = x + ((yy / 30) % 2) * 20; xx < x + w; xx += 40) { const k = m8R(seed + xx + yy * 3); g.fillStyle = 'rgba(' + Math.round(90 + k * 30) + ',' + Math.round(86 + k * 28) + ',' + Math.round(76 + k * 24) + ',1)'; g.fillRect(xx + 1, yy + 1, 38, 28); g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(xx + 1, yy + 24, 38, 5); } g.restore(); }
function m11Grass(g, x, y, w, h, seed) { const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, '#22301c'); gr.addColorStop(1, '#1a2616'); g.fillStyle = gr; g.fillRect(x, y, w, h); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); m11Noise(g, x, y, w, h, Math.floor(w * h / 900), ['rgba(60,80,40,.25)', 'rgba(10,16,8,.3)', 'rgba(80,96,50,.15)'], 6, 26, seed); for (let i = 0; i < w * h / 120; i++) { g.strokeStyle = m8R(seed + i) > .5 ? 'rgba(90,120,60,.25)' : 'rgba(20,30,14,.3)'; g.lineWidth = 1; const gx = x + m8R(seed + i * 3) * w, gy = y + m8R(seed + i * 5) * h; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + (m8R(i) - .5) * 3, gy - 3); g.stroke(); } g.restore(); }
function m11Tree(g, x, y, r, seed) { g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x + r * .4, y + r * .5, r, r * .85, 0, 0, 7); g.fill(); for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28 + seed, rr = r * (.45 + m8R(seed + i) * .3); m8Disc(g, x + Math.cos(a) * r * .45, y + Math.sin(a) * r * .45, rr, '#14200e', '#3a5226'); } m8Disc(g, x - r * .1, y - r * .15, r * .55, '#1a2a12', '#4a6430'); }
function m11DrawPow(n, now, me) { // a prisoner: battledress + greatcoat, side cap
    ctx.save(); ctx.translate(n.x, n.y); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(4, 5, 12, 10, 0, 0, 7); ctx.fill(); ctx.rotate(n.ang); ctx.scale(1.2, 1.2);
    const sw = n.moving ? Math.sin((n.walk || 0) * .22) : 0, coat = n.coat || '#6a6040';
    ctx.lineCap = 'round'; ctx.strokeStyle = '#3a3626'; ctx.lineWidth = 4.4; ctx.beginPath(); ctx.moveTo(-1, -4); ctx.lineTo(7 * sw, -4.4); ctx.moveTo(-1, 4); ctx.lineTo(-7 * sw, 4.4); ctx.stroke();
    ctx.fillStyle = '#16120e'; ctx.beginPath(); ctx.ellipse(7 * sw + 1.5, -4.4, 3.6, 2.3, 0, 0, 7); ctx.ellipse(-7 * sw + 1.5, 4.4, 3.6, 2.3, 0, 0, 7); ctx.fill();
    const tg = ctx.createRadialGradient(-2, -4, 1, 0, 0, 12); tg.addColorStop(0, ddpRGB(ddpMix(ddpHex(coat), [255, 240, 200], .25))); tg.addColorStop(1, coat); ctx.fillStyle = tg; ctx.beginPath(); ctx.ellipse(0, 0, 8, 11, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(3, -9); ctx.lineTo(3, 9); ctx.stroke(); ctx.fillStyle = '#c0a060'; ctx.fillRect(2, -3, 1.6, 1.6); ctx.fillRect(2, 2, 1.6, 1.6);
    ctx.strokeStyle = coat; ctx.lineWidth = 4; const arm = n.moving ? sw * 4 : 0; ctx.beginPath(); ctx.moveTo(1, -8); ctx.lineTo(7 - arm, -10); ctx.moveTo(1, 8); ctx.lineTo(7 + arm, 10); ctx.stroke(); ctx.fillStyle = '#d2aa84'; ctx.beginPath(); ctx.arc(8 - arm, -10, 2.2, 0, 7); ctx.arc(8 + arm, 10, 2.2, 0, 7); ctx.fill();
    ctx.fillStyle = '#d2aa84'; ctx.beginPath(); ctx.arc(2, 0, 5, 0, 7); ctx.fill(); ctx.fillStyle = ['#3a2a1a', '#6a4a2a', '#1a1410', '#8a6a3a'][(n.seed || 0) % 4]; ctx.beginPath(); ctx.arc(1, 0, 5, Math.PI * .5, Math.PI * 1.5); ctx.fill();
    ctx.fillStyle = me ? '#5a5030' : ['#4a3a5a', '#3a4a2a', '#5a2a2a'][(n.seed || 0) % 3]; ctx.beginPath(); ctx.ellipse(0, 0, 3, 5.2, 0, 0, 7); ctx.fill();
    ctx.restore(); }
function ddpHex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function m11DrawFences(now) { const M = M11;
    const post = function (x, y) { ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x - 1, y - 1, 7, 7); ctx.fillStyle = '#5a4a34'; ctx.fillRect(x - 3, y - 3, 6, 6); };
    ctx.lineWidth = 1; for (let y = M11_FIN.y0; y < M11_FIN.y1; y += 6) { const gap = M.gapsIn.some(function (g) { return Math.abs(g - y) < 26; }); if (gap) continue; ctx.strokeStyle = 'rgba(170,170,160,.6)'; ctx.beginPath(); ctx.moveTo(M11_FIN.x - 5, y); ctx.lineTo(M11_FIN.x + 5, y + 6); ctx.moveTo(M11_FIN.x + 5, y); ctx.lineTo(M11_FIN.x - 5, y + 6); ctx.stroke(); }
    for (let y = M11_FIN.y0; y <= M11_FIN.y1; y += 40) if (!M.gapsIn.some(function (g) { return Math.abs(g - y) < 26; })) post(M11_FIN.x, y);
    for (let x = M11_FOUT.x0; x < M11_FOUT.x1; x += 6) { if (M.gapsOut.some(function (g) { return Math.abs(g - x) < 26; })) continue; ctx.strokeStyle = 'rgba(170,170,160,.6)'; ctx.beginPath(); ctx.moveTo(x, M11_FOUT.y - 5); ctx.lineTo(x + 6, M11_FOUT.y + 5); ctx.moveTo(x, M11_FOUT.y + 5); ctx.lineTo(x + 6, M11_FOUT.y - 5); ctx.stroke(); }
    for (let x = M11_FOUT.x0; x <= M11_FOUT.x1; x += 40) if (!M.gapsOut.some(function (g) { return Math.abs(g - x) < 26; })) post(x, M11_FOUT.y);
    ctx.strokeStyle = 'rgba(170,170,160,.5)'; M.gapsIn.forEach(function (g) { ctx.beginPath(); ctx.moveTo(M11_FIN.x, g - 26); ctx.quadraticCurveTo(M11_FIN.x - 12, g - 18, M11_FIN.x - 8, g - 10); ctx.moveTo(M11_FIN.x, g + 26); ctx.quadraticCurveTo(M11_FIN.x + 12, g + 18, M11_FIN.x + 8, g + 10); ctx.stroke(); });
    M.gapsOut.forEach(function (g) { ctx.beginPath(); ctx.moveTo(g - 26, M11_FOUT.y); ctx.quadraticCurveTo(g - 18, M11_FOUT.y - 12, g - 10, M11_FOUT.y - 8); ctx.moveTo(g + 26, M11_FOUT.y); ctx.quadraticCurveTo(g + 18, M11_FOUT.y + 12, g + 10, M11_FOUT.y + 8); ctx.stroke(); });
    // gates + door
    const G = M11_CGATE; ctx.fillStyle = '#2a2018'; ctx.fillRect(G[0], G[1] + 10, G[2], 10); ctx.fillStyle = '#4a3a26'; for (let x = G[0] + 4; x < G[0] + G[2]; x += 12) ctx.fillRect(x, G[1] + 6, 6, 18); ctx.fillStyle = '#8a8a7a'; ctx.fillRect(G[0] + G[2] / 2 - 2, G[1] + 12, 4, 6);
    const B = M11_MGATE; ctx.fillStyle = '#3a3a30'; ctx.fillRect(B[0] - 8, B[1] - 4, 10, 38); ctx.save(); ctx.translate(B[0] - 3, B[1] + 15); ctx.rotate(M.mgateOpen ? -1.4 : 0); for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#d8d0c0' : '#b02020'; ctx.fillRect(i * 11, -3, 11, 6); } ctx.restore();
    // a striped sentry box by the main gate
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(1338, 1452, 30, 30); for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#d8d0c0' : '#2a2a2a'; ctx.fillRect(1332 + i * 7, 1446, 7, 28); }
    if (!M.tdoorOpen) { ctx.fillStyle = '#4a3420'; ctx.fillRect(M11_TDOOR[0] + 6, M11_TDOOR[1], 18, M11_TDOOR[3]); ctx.fillStyle = '#c0a060'; ctx.fillRect(M11_TDOOR[0] + 20, M11_TDOOR[1] + 22, 3, 6); } else { ctx.fillStyle = '#4a3420'; ctx.save(); ctx.translate(M11_TDOOR[0] + 6, M11_TDOOR[1]); ctx.rotate(-1.3); ctx.fillRect(0, 0, 6, 50); ctx.restore(); }
}
function m11DrawTower(T, now) { ctx.save(); ctx.translate(T.x, T.y); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-10, -8, 40, 40); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-17, -17, 34, 34); ctx.fillStyle = '#5a4026'; ctx.fillRect(-14, -14, 28, 28); ctx.strokeStyle = '#2a1e12'; ctx.lineWidth = 2; ctx.strokeRect(-14, -14, 28, 28); ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(14, 14); ctx.moveTo(14, -14); ctx.lineTo(-14, 14); ctx.stroke();
    ctx.fillStyle = '#4e3a24'; ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(20, -20); ctx.lineTo(0, -4); ctx.closePath(); ctx.fill(); ctx.rotate(T.ang); ctx.fillStyle = '#2a2a26'; ctx.fillRect(-4, -7, 14, 14); ctx.fillStyle = '#fffbe0'; ctx.fillRect(9, -6, 3, 12); ctx.fillStyle = '#1a1a18'; ctx.fillRect(-2, 8, 18, 3); ctx.restore(); }
function m11DrawItem(it, now) { if (it.taken) return; const p = .5 + .5 * Math.sin(now / 300 + it.x); ctx.save(); ctx.translate(it.x, it.y); const id = it.id === 'blank' ? 'papers' : it.id === 'tunic' ? 'uniform' : it.id; it = { id: id, x: it.x, hud: it.hud };
    if (!it.hud) { ctx.strokeStyle = 'rgba(255,220,120,' + (.25 + p * .4) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 14 + p * 4, 0, 7); ctx.stroke(); }
    if (it.id === 'papers') { ctx.rotate(-.2); ctx.fillStyle = '#d8d0b0'; ctx.fillRect(-9, -6, 18, 12); ctx.fillStyle = '#5a6a8a'; ctx.fillRect(-7, -4, 6, 7); ctx.fillStyle = '#8a2a20'; ctx.beginPath(); ctx.arc(4, 2, 3, 0, 7); ctx.fill(); }
    if (it.id === 'uniform') { ctx.fillStyle = '#5e6656'; ctx.fillRect(-10, -7, 20, 14); ctx.fillStyle = '#2a2c26'; ctx.fillRect(-2, -7, 4, 14); ctx.fillStyle = '#c0b080'; ctx.fillRect(-8, -5, 4, 2); }
    if (it.id === 'cutters') { ctx.strokeStyle = '#8a8a7a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(6, 2); ctx.moveTo(-9, 6); ctx.lineTo(6, -2); ctx.stroke(); ctx.strokeStyle = '#c02a20'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(-4, -3); ctx.moveTo(-9, 6); ctx.lineTo(-4, 3); ctx.stroke(); }
    if (it.id === 'key') { ctx.strokeStyle = '#d0b060'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(-5, 0, 4, 0, 7); ctx.moveTo(-1, 0); ctx.lineTo(9, 0); ctx.lineTo(9, 4); ctx.moveTo(6, 0); ctx.lineTo(6, 3); ctx.stroke(); }
    ctx.restore(); }
function m11Draw(now) {
    const M = M11, P = M.p, W = canvas.width, H = canvas.height; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#05080a'; ctx.fillRect(0, 0, W, H); ctx.scale(W / 1100, H / 700);
    const sh = M.shake; ctx.save(); ctx.scale(M11Z, M11Z); ctx.translate(-Math.round(M.cam.x) + (Math.random() - .5) * sh, -Math.round(M.cam.y) + (Math.random() - .5) * sh);
    ctx.drawImage(M.base, Math.round(M.cam.x) - 2, Math.round(M.cam.y) - 2, 1104 / M11Z, 704 / M11Z, Math.round(M.cam.x) - 2, Math.round(M.cam.y) - 2, 1104 / M11Z, 704 / M11Z);
    m11Ambient(now); m11DrawFences(now); M.items.forEach(function (it) { m11DrawItem(it, now); }); m11CraftDrawWorld(now);
    M.guards.forEach(function (g) { if (g.down) m8DrawMan({ x: g.x, y: g.y, team: 'en', kind: 'sold', gun: g.gun, seed: g.seed, hp: 0, maxHp: 1, dead: true, deathAng: g.deathAng || 0, r: 10 }, now); });
    // guard sight cones (subtle; red when they've seen something)
    M.guards.forEach(function (g) { if (g.down || g.bribedUntil > now) return; const rng = g.view * .8, warn = g.state === 'chase' ? 1 : Math.min(1, g.sus * 1.6); ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.ang); const cg = ctx.createRadialGradient(0, 0, 10, 0, 0, rng); cg.addColorStop(0, 'rgba(' + (warn > .3 ? '255,90,60,' : '255,230,150,') + (.13 + warn * .1) + ')'); cg.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, rng, -g.fov / 2, g.fov / 2); ctx.closePath(); ctx.fill(); ctx.restore(); });
    M.pows.forEach(function (n) { m11DrawPow(n, now); });
    if (M.dog.sleep) { ctx.save(); ctx.globalAlpha = .9; m9DrawDog(Object.assign({}, M.dog, { dead: true, deathAng: 0 }), now); ctx.restore(); ctx.fillStyle = 'rgba(220,240,255,.7)'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.fillText('z z', M.dog.x + 10, M.dog.y - 14 - Math.sin(now / 400) * 3); } else m9DrawDog(M.dog, now);
    M.guards.forEach(function (g) { if (g.down) return; if (g.bribedUntil > now) { ctx.fillStyle = '#c8f0a0'; ctx.font = '700 11px monospace'; ctx.textAlign = 'center'; ctx.fillText('$', g.x, g.y - 24); } m8DrawMan({ x: g.x, y: g.y, ang: g.ang, team: 'en', kind: 'sold', gun: g.gun, seed: g.seed + (g.officer ? 900 : 0), hp: 1, maxHp: 1, dead: false, moving: g.moving, walk: g.walk, r: 10 }, now);
        if (g.officer) { ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.ang); ctx.fillStyle = '#4a5440'; ctx.beginPath(); ctx.ellipse(2, 0, 7, 7.4, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1a14'; ctx.fillRect(7, -4, 4, 8); ctx.fillStyle = '#c0b070'; ctx.fillRect(4, -1, 2, 2); ctx.restore(); }
        if (g.sus > .05 && g.state !== 'chase') { ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(g.x - 12, g.y - 30, 24, 5); ctx.fillStyle = g.sus > .6 ? '#ff7050' : '#ffd070'; ctx.fillRect(g.x - 12, g.y - 30, 24 * g.sus, 5); }
        if (g.state === 'chase') { ctx.fillStyle = '#ff5040'; ctx.font = '700 18px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('!', g.x, g.y - 22); } else if (g.state === 'baited') { ctx.fillStyle = '#ffd070'; ctx.font = '700 14px monospace'; ctx.textAlign = 'center'; ctx.fillText('?', g.x, g.y - 22); } });
    // the player
    if (P.uni) m8DrawMan({ x: P.x, y: P.y, ang: P.ang, team: 'en', kind: 'sold', gun: null, seed: 4242, hp: 1, maxHp: 1, moving: P.moving, walk: P.walk, sneak: P.creep, r: 10 }, now);
    else m11DrawPow({ x: P.x, y: P.y, ang: P.ang, moving: P.moving, walk: P.walk, coat: '#7a6c44', seed: 3 }, now, true);
    ctx.strokeStyle = 'rgba(160,230,140,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(P.x, P.y, 17, 0, 7); ctx.stroke();
    if (P.changeT > 0) { ctx.strokeStyle = '#ffd040'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(P.x, P.y, 22, -Math.PI / 2, -Math.PI / 2 + (1 - P.changeT / 1.3) * 6.28); ctx.stroke(); }
    M.towers.forEach(function (T) { m11DrawTower(T, now); });
    M.parts.forEach(function (p) { if (p.k === 'dust') { ctx.fillStyle = 'rgba(160,140,110,' + p.life * .6 + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, 3 + (1 - p.life) * 8, 0, 7); ctx.fill(); } });
    M.fx.forEach(function (f) { if (f.k !== 'flash') return; ctx.fillStyle = 'rgba(255,230,160,' + Math.max(0, 1 - (now - f.t) / 300) + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, 8, 0, 7); ctx.fill(); });
    m11SmokeDraw(now); m11Overhead(now);
    ctx.restore();
    m11Dark(now);
    // floating speech
    ctx.save(); ctx.scale(M11Z, M11Z); ctx.translate(-M.cam.x, -M.cam.y); ctx.textAlign = 'center'; ctx.font = 'bold 12px "Special Elite", monospace'; M.texts.forEach(function (t) { const k = (now - t.at) / 2200; ctx.globalAlpha = Math.min(1, (1 - k) * 2); ctx.fillStyle = 'rgba(0,0,0,.6)'; const tw = ctx.measureText(t.t).width + 10; ctx.fillRect(t.x - tw / 2, t.y - 14 - k * 14, tw, 18); ctx.fillStyle = t.col; ctx.fillText(t.t, t.x, t.y - k * 14); }); ctx.restore();
    if (P.hurtAt && now - P.hurtAt < 350) { const g = ctx.createRadialGradient(550, 350, 200, 550, 350, 650); g.addColorStop(0, 'rgba(160,10,0,0)'); g.addColorStop(1, 'rgba(160,10,0,' + .45 * (1 - (now - P.hurtAt) / 350) + ')'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1100, 700); }
    m11Hud(now); if (!M.craftOpen) m11Hotbar(now);
    const st = (now - M.t0) / 1000; if (st < 1.2) { ctx.fillStyle = 'rgba(0,0,0,' + (1 - st / 1.2) + ')'; ctx.fillRect(0, 0, 1100, 700); }
    if (M.lost) { const k = Math.min(1, (now - (M.endAt - 3000)) / 600); ctx.fillStyle = 'rgba(0,0,0,' + .65 * k + ')'; ctx.fillRect(0, 250, 1100, 150); ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.font = '700 46px "Stardos Stencil", Impact, sans-serif'; ctx.fillStyle = '#ff5040'; ctx.fillText(M.failWhy === 'shot' ? 'SHOT ON THE WIRE' : 'RECAPTURED', 550, 320); ctx.font = '16px "Special Elite", monospace'; ctx.fillStyle = '#e8e0c0'; ctx.fillText(M.failWhy === 'shot' ? 'THE TOWER GUNNER DIDN\'T MISS.' : M.failWhy === 'dog' ? 'THE DOG GOT TO YOU FIRST. TWENTY-EIGHT DAYS IN THE COOLER.' : 'TWENTY-EIGHT DAYS IN THE COOLER. THE ESCAPE COMMITTEE WILL TRY AGAIN.', 550, 356); ctx.globalAlpha = 1; }
    ctx.restore();
}
function m11Dark(now) {
    const M = M11; if (!M.dk) { M.dk = document.createElement('canvas'); M.dk.width = 1100; M.dk.height = 700; }
    const d = M.dk.getContext('2d'); d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, 1100, 700); d.fillStyle = 'rgba(8,12,26,.5)'; d.fillRect(0, 0, 1100, 700); d.save(); d.scale(M11Z, M11Z); d.translate(-M.cam.x, -M.cam.y); d.globalCompositeOperation = 'destination-out';
    const hole = function (x, y, r, a) { const g = d.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = g; d.beginPath(); d.arc(x, y, r, 0, 7); d.fill(); };
    M.lamps.forEach(function (L) { hole(L.x, L.y, L.r, .85); });
    M.towers.forEach(function (T) { d.save(); d.translate(T.x, T.y); d.rotate(T.ang); const g = d.createLinearGradient(0, 0, T.len, 0); g.addColorStop(0, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = g; d.beginPath(); d.moveTo(0, 0); d.lineTo(T.len, -Math.tan(T.half) * T.len); d.lineTo(T.len, Math.tan(T.half) * T.len); d.closePath(); d.fill(); d.restore(); });
    hole(M.p.x, M.p.y, 80, .4); [[1690, 600, 90], [730, 252, 120], [800, 780, 90], [1680, 900, 80]].forEach(function (c) { hole(c[0], c[1], c[2], .5); });
    d.restore(); ctx.drawImage(M.dk, 0, 0);
    ctx.save(); ctx.scale(M11Z, M11Z); ctx.translate(-M.cam.x, -M.cam.y); ctx.globalCompositeOperation = 'lighter';
    M.towers.forEach(function (T) { ctx.save(); ctx.translate(T.x, T.y); ctx.rotate(T.ang); const g = ctx.createLinearGradient(0, 0, T.len, 0); g.addColorStop(0, 'rgba(210,225,255,.3)'); g.addColorStop(1, 'rgba(210,225,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(T.len, -Math.tan(T.half) * T.len); ctx.lineTo(T.len, Math.tan(T.half) * T.len); ctx.lineTo(0, 3); ctx.fill(); ctx.restore(); });
    M.lamps.forEach(function (L) { const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r); g.addColorStop(0, 'rgba(255,200,120,.13)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2); });
    ctx.restore();
    const vg = ctx.createRadialGradient(550, 350, 300, 550, 350, 720); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,10,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, 1100, 700);
}
function m11Objective() { const M = M11, P = M.p, h = P.has;
    if (M.mgateOpen) return 'WALK OUT DOWN THE ROAD — SOUTH';
    const gate = h.papers && h.uniform, wire = h.cutters && (h.key || M.tdoorOpen) && h.rope;
    if (M.gapsOut.length) return h.rope ? 'CLIMB THE PARK WALL (F)' : 'CRAFT A BEDSHEET ROPE FOR THE PARK WALL';
    if (M.gapsIn.length) return 'CUT THE OUTER WIRE AT THE BOTTOM OF THE PARK';
    if (gate && wire) return 'OUT BY THE MAIN GATE OR OVER THE WIRE';
    if (gate) return 'UNIFORM ON (U) · GATE ARCH · PASS AT THE MAIN GATE';
    if (wire) return M.tdoorOpen ? 'CROSS THE TERRACE, CUT BOTH WIRES, CLIMB THE WALL' : 'UNLOCK THE TERRACE DOOR (QUARTERS, WEST WALL)';
    return 'GATE: TUNIC→UNIFORM + BLANK→PASS · WIRE: KEY + CUTTERS + ROPE'; }
function m11Hud(now) {
    const M = M11, P = M.p; ctx.save();
    m8Panel(12, 12, 250, 170, M.alarm); ctx.textAlign = 'left'; ctx.font = '700 12px "Stardos Stencil", Impact'; ctx.fillStyle = '#d8c890'; ctx.fillText('CAPT. H. DOYLE · PRISONER 2316', 22, 30);
    ctx.font = 'bold 11px monospace'; ctx.fillStyle = '#e0e8ee'; ctx.fillText('HEALTH', 22, 50); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(100, 42, 150, 10); ctx.fillStyle = P.hp > 50 ? '#7fc06a' : '#e04030'; ctx.fillRect(100, 42, 150 * P.hp / 100, 10);
    ctx.fillStyle = P.uni ? '#a0c0ff' : '#e0d090'; ctx.font = 'bold 12px monospace'; ctx.fillText(P.uni ? '▣ DISGUISED — GERMAN UNIFORM' : '▢ PRISONER\'S BATTLEDRESS', 22, 72);
    const z = m11Zone(P.x, P.y); ctx.fillStyle = z.z === 'pow' ? '#8fd07a' : z.z === 'park' ? '#ff9a70' : '#ffd070'; ctx.font = '11px monospace'; ctx.fillText((z.n || '') + (z.z === 'pow' ? ' · PRISONERS ALLOWED' : z.z === 'park' ? ' · OUT OF BOUNDS — TOWERS' : ' · GERMANS ONLY'), 22, 90);
    ['papers', 'uniform', 'cutters', 'key', 'rope'].map(function (id) { return { id: id }; }).forEach(function (it, i) { const x = 22 + i * 46, y = 102, got = P.has[it.id]; ctx.fillStyle = got ? 'rgba(120,200,100,.25)' : 'rgba(255,255,255,.06)'; ctx.fillRect(x, y, 42, 32); ctx.strokeStyle = got ? '#7fc06a' : 'rgba(255,255,255,.15)'; ctx.strokeRect(x + .5, y + .5, 41, 31); if (it.id === 'rope') m11ToolIcon('rope', x + 21, y + 14, 1); else m11DrawItem({ id: it.id, x: x + 21, y: y + 14, taken: false, hud: 1 }, 0); ctx.fillStyle = got ? '#bfe0a0' : 'rgba(224,232,238,.45)'; ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.fillText(it.id.toUpperCase(), x + 21, y + 30); ctx.textAlign = 'left'; });
    ctx.fillStyle = 'rgba(224,232,238,.6)'; ctx.font = '10px monospace'; ctx.fillText('F search/use · C craft · U uniform · Q stooges ×' + M.stooges, 22, 150); ctx.fillText('SHIFT creep · SPACE sprint · E shiv · click', 22, 166);
    // roll call clock
    const R = M.roll; let rc, col = '#e0e8ee'; if (R.phase === 0) rc = 'NEXT APPELL IN ' + Math.max(0, Math.ceil((R.next - now) / 1000)) + 's'; else if (R.phase === 1) { rc = 'APPELL! GET IN THE RANKS — ' + Math.max(0, Math.ceil((R.countAt - now) / 1000)) + 's'; col = Math.floor(now / 300) % 2 ? '#ff7050' : '#ffd070'; } else { rc = 'COUNTING HEADS...'; col = '#ffd070'; }
    ctx.font = 'bold 13px monospace'; const rw = ctx.measureText(rc).width + 30; m8Panel(550 - rw / 2, 76, rw, 26, R.phase > 0); ctx.textAlign = 'center'; ctx.fillStyle = col; ctx.fillText(rc, 550, 94);
    // objective + status
    ctx.font = 'bold 12px monospace'; const ob = m11Objective(), ow = Math.min(600, ctx.measureText(ob).width + 40); m8Panel(550 - ow / 2, 10, ow, 30, false); ctx.fillStyle = '#e7edc9'; ctx.fillText(ob, 550, 30);
    const worst = M.guards.reduce(function (a, g) { return Math.max(a, g.state === 'chase' ? 2 : g.sus); }, 0), st = M.alarm ? 'ALARM — WHISTLES ALL OVER THE CASTLE' : worst > .05 ? 'A GOON IS WATCHING YOU...' : 'UNNOTICED';
    ctx.font = 'bold 13px monospace'; ctx.fillStyle = M.alarm ? (Math.floor(now / 300) % 2 ? '#ff5040' : '#ffb0a0') : worst > .05 ? '#ffd070' : '#8fd07a'; ctx.fillText('● ' + st, 550, 60);
    // minimap
    const mx = 1100 - 12 - 200, my = 12, sc = 200 / M11W; m8Panel(mx - 4, my - 4, 208, M11H * sc + 8); ctx.fillStyle = '#1c2616'; ctx.fillRect(mx, my, 200, M11H * sc);
    M11_WALLS.forEach(function (R) { ctx.fillStyle = R[4] === 'cliff' ? '#16150f' : R[4] === 'town' || R[4] === 'house' ? '#4a2a1a' : '#a8a290'; ctx.fillRect(mx + R[0] * sc, my + R[1] * sc, Math.max(1, R[2] * sc), Math.max(1, R[3] * sc)); });
    ctx.strokeStyle = '#c0c0b0'; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(mx + M11_FIN.x * sc, my + M11_FIN.y0 * sc); ctx.lineTo(mx + M11_FIN.x * sc, my + M11_FIN.y1 * sc); ctx.moveTo(mx + M11_FOUT.x0 * sc, my + M11_FOUT.y * sc); ctx.lineTo(mx + M11_FOUT.x1 * sc, my + M11_FOUT.y * sc); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,240,.25)'; ctx.fillRect(mx + M11_APPELL[0] * sc, my + M11_APPELL[1] * sc, M11_APPELL[2] * sc, M11_APPELL[3] * sc);
    M.items.forEach(function (it) { if (it.taken) return; ctx.fillStyle = Math.floor(now / 400) % 2 ? '#ffd040' : '#a08020'; ctx.fillRect(mx + it.x * sc - 2, my + it.y * sc - 2, 4, 4); });
    M.guards.forEach(function (g) { ctx.fillStyle = g.state === 'chase' ? '#ff4030' : '#d06a50'; ctx.fillRect(mx + g.x * sc - 1.5, my + g.y * sc - 1.5, 3, 3); });
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx + P.x * sc, my + P.y * sc, 2.6, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.strokeRect(mx + M.cam.x * sc, my + M.cam.y * sc, 1100 / M11Z * sc, 700 / M11Z * sc);
    // prompt
    const sx = (P.x - M.cam.x) * M11Z, sy = (P.y - M.cam.y) * M11Z; if (P.act) { ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; const tw = ctx.measureText(P.act.label).width + 16; ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(sx - tw / 2, sy - 48, tw, 20); ctx.fillStyle = P.act.need ? '#e7edc9' : '#ffb090'; ctx.fillText(P.act.label, sx, sy - 34); if (P.act.need) { const k = Math.min(1, P.actT / P.act.need); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(sx, sy, 22, 0, 7); ctx.stroke(); if (k > 0) { ctx.strokeStyle = '#ffd040'; ctx.beginPath(); ctx.arc(sx, sy, 22, -Math.PI / 2, -Math.PI / 2 + k * 6.28); ctx.stroke(); } } }
    if (M.msg && now - M.msgAt < M.msgDur) { ctx.textAlign = 'center'; ctx.font = 'bold 14px "Special Elite", "Courier New", monospace'; const wd = Math.min(1080, ctx.measureText(M.msg).width + 50); m8Panel(550 - wd / 2, 568, wd, 32); ctx.fillStyle = '#e7edc9'; ctx.fillText(M.msg, 550, 589); }
    ctx.restore();
}
