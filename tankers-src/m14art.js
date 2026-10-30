/* =====================================================
   MISSION 14 ART — the strait by night from above: moonlit swell, jungle shores with surf,
   Nishimura's ships in plan view, PT-137, searchlights, star shells, shell splashes, fire and smoke.
===================================================== */
const M14Q = 2; // base map is rendered at half resolution
function m14BuildBase() {
    const W = M14W / M14Q, H = M14H / M14Q, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), r = m12Rng(1414);
    // deep water, darker in the channel, lighter over shoals near the shores
    const sg = g.createLinearGradient(0, 0, W, 0); sg.addColorStop(0, '#0d1c26'); sg.addColorStop(.25, '#0a1720'); sg.addColorStop(.5, '#08131c'); sg.addColorStop(.75, '#0a1720'); sg.addColorStop(1, '#0d1c26'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) { const x = r() * W, y = r() * H, rr = 20 + r() * 90; g.fillStyle = 'rgba(' + (r() < .5 ? '30,60,80' : '0,0,0') + ',' + (.03 + r() * .05) + ')'; g.beginPath(); g.ellipse(x, y, rr, rr * .4, -.2, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(120,160,190,.05)'; g.lineWidth = 1; for (let i = 0; i < 5000; i++) { const x = r() * W, y = r() * H, l = 6 + r() * 16; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 2, x + l, y); g.stroke(); }
    const poly = function (P, s) { g.beginPath(); P.forEach(function (p, i) { const x = p[0] / M14Q, y = p[1] / M14Q; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); };
    // shoals and surf halo round every coast
    M14_LAND.forEach(function (L) { g.save(); poly(L.pts); g.strokeStyle = 'rgba(40,90,100,.35)'; g.lineWidth = 60; g.lineJoin = 'round'; g.stroke(); g.strokeStyle = 'rgba(60,120,120,.35)'; g.lineWidth = 26; g.stroke(); g.strokeStyle = 'rgba(200,220,220,.35)'; g.lineWidth = 7; g.stroke(); g.strokeStyle = 'rgba(150,140,110,.9)'; g.lineWidth = 4; g.stroke(); g.restore(); });
    // jungle: dark base, canopy crowns, ridgelines
    M14_LAND.forEach(function (L, li) { g.save(); poly(L.pts); g.fillStyle = '#0e1a0c'; g.fill(); g.clip();
        for (let i = 0; i < 9000; i++) { const x = r() * W, y = r() * H, rr = 4 + r() * 12; g.fillStyle = 'rgba(' + (20 + r() * 30 | 0) + ',' + (40 + r() * 40 | 0) + ',' + (18 + r() * 16 | 0) + ',' + (.4 + r() * .4) + ')'; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(x + rr * .3, y + rr * .3, rr * .7, 0, 7); g.fill(); }
        g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; for (let k = 0; k < 18; k++) { let x = r() * W, y = r() * H; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 14; s++) { x += (r() - .5) * 60; y += (r() - .5) * 60; g.lineTo(x, y); } g.stroke(); }
        g.restore(); });
    // the shore battery on Panaon point and a village of stilt huts
    const bx = M14.battery.x / M14Q, by = M14.battery.y / M14Q; g.fillStyle = '#2a2418'; g.beginPath(); g.arc(bx - 14, by, 22, 0, 7); g.fill(); g.strokeStyle = '#4a4030'; g.lineWidth = 3; g.stroke();
    for (let i = 0; i < 7; i++) { const x = 1100 / M14Q - 30 + i * 9, y = 2700 / M14Q + (i % 3) * 8; g.fillStyle = '#3a2a1a'; g.fillRect(x, y, 7, 6); g.fillStyle = '#5a4a2a'; g.fillRect(x - 1, y - 1, 9, 3); }
    // map lettering, like a chart
    g.fillStyle = 'rgba(160,180,170,.18)'; g.font = '700 30px "Stardos Stencil", Impact'; g.textAlign = 'center'; g.fillText('PANAON', 280, 900); g.fillText('DINAGAT', 2700, 1050); g.font = '700 16px "Stardos Stencil", Impact'; g.fillText('HIBUSON I.', 1940, 920); g.fillText('MINDANAO', 300, 2240);
    g.fillStyle = 'rgba(120,160,190,.07)'; g.font = '700 46px "Stardos Stencil", Impact'; g.save(); g.translate(1460, 1500); g.rotate(-Math.PI / 2); g.fillText('S U R I G A O   S T R A I T', 0, 0); g.restore();
    g.fillStyle = 'rgba(220,200,140,.2)'; g.font = '700 14px "Special Elite", monospace'; g.fillText('TO LEYTE GULF · U.S. BATTLE LINE ▲', 1500, 40);
    return c;
}
/* ---------- plan-view ships ---------- */
function m14HullPath(L, B) { const h = L / 2, b = B / 2; ctx.beginPath(); ctx.moveTo(h, 0); ctx.bezierCurveTo(h * .7, -b * .6, h * .45, -b, h * .2, -b); ctx.lineTo(-h * .7, -b); ctx.quadraticCurveTo(-h, -b * .9, -h, -b * .3); ctx.lineTo(-h, b * .3); ctx.quadraticCurveTo(-h, b * .9, -h * .7, b); ctx.lineTo(h * .2, b); ctx.bezierCurveTo(h * .45, b, h * .7, b * .6, h, 0); ctx.closePath(); }
function m14Turret(x, y, s, ang, big) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#4a4e52'; ctx.beginPath(); ctx.arc(0, 0, s, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.stroke(); ctx.rotate(ang); ctx.fillStyle = '#2a2e32'; const n = big ? 2 : 1; for (let i = 0; i < n; i++) ctx.fillRect(s * .4, (n === 2 ? (i ? 1.4 : -3) : -1) * s * .35, s * 1.6, s * .3); ctx.fillStyle = '#5a5e62'; ctx.fillRect(-s * .6, -s * .6, s * .9, s * 1.2); ctx.restore(); }
function m14DrawShip(S, now) { const M = M14, k = S.sinking ? Math.min(1, (now - S.sinking) / 9000) : 0;
    ctx.save(); ctx.translate(S.x, S.y);
    // wake and bow wave
    if (!S.sinking) { ctx.save(); ctx.rotate(S.ang); const sp = Math.min(1, S.spd / 1.2) * .7 + .3; const wg = ctx.createLinearGradient(-S.len / 2, 0, -S.len / 2 - 420 * sp, 0); wg.addColorStop(0, 'rgba(200,220,230,.35)'); wg.addColorStop(1, 'rgba(200,220,230,0)'); ctx.fillStyle = wg; ctx.beginPath(); ctx.moveTo(-S.len / 2, -S.beam * .4); ctx.lineTo(-S.len / 2 - 420 * sp, -S.beam * 1.6); ctx.lineTo(-S.len / 2 - 420 * sp, S.beam * 1.6); ctx.lineTo(-S.len / 2, S.beam * .4); ctx.fill();
        ctx.strokeStyle = 'rgba(210,230,240,.32)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(S.len / 2, 0); ctx.lineTo(S.len * .25, -S.beam * .9); ctx.moveTo(S.len / 2, 0); ctx.lineTo(S.len * .25, S.beam * .9); ctx.stroke(); ctx.fillStyle = 'rgba(220,235,245,.25)'; ctx.beginPath(); ctx.moveTo(S.len / 2 + 4, 0); ctx.lineTo(S.len * .35, -S.beam * .62); ctx.lineTo(S.len * .35, S.beam * .62); ctx.fill(); ctx.restore(); }
    ctx.rotate(S.ang + (S.sinking ? k * .25 : 0)); const sc = 1 - k * .15; ctx.scale(sc, sc); ctx.globalAlpha = 1 - k * .75; const L = S.len, B = S.beam;
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.save(); ctx.translate(4, 6); m14HullPath(L, B); ctx.fill(); ctx.restore();
    m14HullPath(L, B); const hg = ctx.createLinearGradient(0, -B / 2, 0, B / 2); hg.addColorStop(0, '#6a6e72'); hg.addColorStop(.5, '#585c60'); hg.addColorStop(1, '#3a3e42'); ctx.fillStyle = hg; ctx.fill(); ctx.strokeStyle = '#1a1c1e'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.save(); m14HullPath(L * .92, B * .78); ctx.clip(); ctx.fillStyle = '#4a4438'; ctx.fillRect(-L / 2, -B / 2, L, B); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1; for (let y = -B / 2; y < B / 2; y += 3) { ctx.beginPath(); ctx.moveTo(-L / 2, y); ctx.lineTo(L / 2, y); ctx.stroke(); } ctx.restore();
    if (S.type === 'bb') { // Fuso-class: six twin turrets, the towering pagoda, one funnel
        [[.36, 1], [.26, 1], [.02, -1], [-.1, 1], [-.28, -1], [-.38, -1]].forEach(function (t) { m14Turret(L * t[0], 0, B * .2, t[1] > 0 ? 0 : Math.PI, true); });
        ctx.fillStyle = '#5c6064'; ctx.fillRect(L * .1, -B * .28, L * .1, B * .56); ctx.fillStyle = '#787c80'; ctx.fillRect(L * .12, -B * .2, L * .06, B * .4); ctx.fillStyle = '#9a9e9e'; ctx.fillRect(L * .135, -B * .12, L * .03, B * .24);
        ctx.fillStyle = '#2a2a2a'; ctx.beginPath(); ctx.ellipse(-L * .02, 0, L * .03, B * .14, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#5a5e62'; ctx.fillRect(-L * .2, -B * .16, L * .08, B * .32); }
    else if (S.type === 'ca') { // Mogami: five turrets, raked funnel, aircraft deck aft
        [[.34, 1], [.25, 1], [.16, 1], [-.22, -1], [-.32, -1]].forEach(function (t) { m14Turret(L * t[0], 0, B * .2, t[1] > 0 ? 0 : Math.PI, true); });
        ctx.fillStyle = '#6a6e72'; ctx.fillRect(L * .04, -B * .26, L * .09, B * .52); ctx.fillStyle = '#8a8e90'; ctx.fillRect(L * .06, -B * .14, L * .05, B * .28); ctx.fillStyle = '#2a2a2a'; ctx.beginPath(); ctx.ellipse(-L * .04, 0, L * .06, B * .16, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#5a5246'; ctx.fillRect(-L * .46, -B * .34, L * .18, B * .68); ctx.fillStyle = '#7a7a70'; ctx.fillRect(-L * .42, -B * .1, L * .08, B * .2); }
    else { // destroyer: three single mounts, two funnels, torpedo tubes
        [[.3, 1], [-.22, -1], [-.34, -1]].forEach(function (t) { m14Turret(L * t[0], 0, B * .26, t[1] > 0 ? 0 : Math.PI, false); });
        ctx.fillStyle = '#6a6e72'; ctx.fillRect(L * .12, -B * .26, L * .1, B * .52); ctx.fillStyle = '#2a2a2a'; [.04, -.06].forEach(function (f) { ctx.beginPath(); ctx.ellipse(L * f, 0, L * .025, B * .2, 0, 0, 7); ctx.fill(); });
        ctx.fillStyle = '#3a3e42'; [-.13, -.03].forEach(function (f) { ctx.fillRect(L * f - 4, -B * .2, 8, B * .4); }); }
    // searchlight platform
    if (S.lightHp > 0) { ctx.fillStyle = S.light && S.light.on ? '#fffbe0' : '#6a6a60'; ctx.beginPath(); ctx.arc(L * .18, 0, 3.4, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1; ctx.restore();
    // fires burn on deck, then the ship goes under in a ring of foam and burning oil
    S.fires.forEach(function (F, i) { const ca = Math.cos(S.ang), sa = Math.sin(S.ang), fx = S.x + F.ox * ca - F.oy * sa, fy = S.y + F.ox * sa + F.oy * ca; const fl = .7 + .3 * Math.sin(now / 80 + i * 3);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(fx, fy, 70 * fl, '255,130,40', .45); h12Dot(fx, fy, 18, '255,230,160', .9 * fl); ctx.restore();
        const P = h12Puff('30,26,24', 41 + i); for (let j = 0; j < 5; j++) { const q = ((now / 2600) + j / 5) % 1, r = 18 + q * 60; ctx.globalAlpha = (1 - q) * .5; ctx.drawImage(P, fx - 20 - q * 140 - r, fy - q * 60 - r, r * 2, r * 2); } ctx.globalAlpha = 1; });
    if (S.sinking) { ctx.strokeStyle = 'rgba(220,235,240,' + (.4 * (1 - k)) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(S.x, S.y, S.len * (.5 + k * .3), S.beam * (1.4 + k * 2), S.ang, 0, 7); ctx.stroke(); }
}
function m14DrawPT(P, now) { ctx.save(); ctx.translate(P.x, P.y);
    // wake: twin white lines; muffled engines leave less of it
    ctx.restore(); ctx.save(); P.wake.forEach(function (w) { const a = 1 - (now - w.t) / 4000, r = 6 + (1 - a) * 30; ctx.fillStyle = 'rgba(210,230,240,' + (a * .14 * Math.min(1, w.v / 3)) + ')'; ctx.beginPath(); ctx.arc(w.x, w.y, r, 0, 7); ctx.fill(); }); ctx.restore();
    ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(P.ang); const sp = Math.abs(P.v);
    if (sp > 1) { ctx.strokeStyle = 'rgba(230,240,250,' + Math.min(.6, sp / 8) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(28, 0); ctx.quadraticCurveTo(10, -14, -30, -18 - sp * 2); ctx.moveTo(28, 0); ctx.quadraticCurveTo(10, 14, -30, 18 + sp * 2); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.save(); ctx.translate(3, 4); m14HullPath(62, 15); ctx.fill(); ctx.restore();
    m14HullPath(62, 15); const hg = ctx.createLinearGradient(0, -8, 0, 8); hg.addColorStop(0, '#4e6a52'); hg.addColorStop(1, '#2a3a2c'); ctx.fillStyle = hg; ctx.fill(); ctx.strokeStyle = '#0e140e'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#4a4232'; ctx.fillRect(-22, -4.5, 40, 9); // deck
    ctx.fillStyle = '#3a4a3c'; ctx.fillRect(2, -4, 10, 8); ctx.fillStyle = 'rgba(160,200,220,.5)'; ctx.fillRect(10, -3, 2, 6); // chartroom
    ctx.fillStyle = '#20281e'; [[-6, -6.5], [-6, 6.5], [-20, -6.5], [-20, 6.5]].forEach(function (t, i) { if (i < P.torps) { ctx.fillRect(t[0] - 7, t[1] - 1.6, 14, 3.2); ctx.fillStyle = '#5a6a50'; ctx.fillRect(t[0] + 5, t[1] - 1.2, 2, 2.4); ctx.fillStyle = '#20281e'; } else { ctx.strokeStyle = '#20281e'; ctx.lineWidth = .8; ctx.strokeRect(t[0] - 7, t[1] - 1.6, 14, 3.2); } });
    ctx.fillStyle = '#2a2a24'; ctx.beginPath(); ctx.arc(-25, 0, 2.5, 0, 7); ctx.fill(); // 20mm aft
    ctx.restore();
    // twin .50 tub, aimed with the mouse
    ctx.save(); ctx.translate(P.x + Math.cos(P.ang) * -2, P.y + Math.sin(P.ang) * -2); ctx.fillStyle = '#1e241c'; ctx.beginPath(); ctx.arc(0, 0, 4.4, 0, 7); ctx.fill(); ctx.rotate(P.tur); ctx.fillStyle = '#121410'; ctx.fillRect(2, -2.4, 12, 1.4); ctx.fillRect(2, 1, 12, 1.4); if (M14.mdown && P.heat < 1 && now - P.lastMG < 60) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(16, 0, 14, '255,210,120', .9); ctx.restore(); } ctx.restore();
    if (now - P.hurtAt < 200) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(P.x, P.y, 40, '255,120,60', .5); ctx.restore(); }
    if (M14.lost && M14.failWhy === 'sunk') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(P.x, P.y, 60, '255,140,50', .6); ctx.restore(); }
}
function m14DrawBoat(B, now) { if (B.dead) return; ctx.save(); ctx.translate(B.x, B.y); ctx.rotate(B.ang); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-14, -5, 30, 12); ctx.fillStyle = '#3a3428'; ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(8, -6); ctx.lineTo(-14, -6); ctx.lineTo(-14, 6); ctx.lineTo(8, 6); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#14120c'; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = '#5a5040'; ctx.fillRect(-8, -3.5, 10, 7); ctx.fillStyle = '#1a1a14'; ctx.fillRect(6, -1, 8, 2); ctx.restore();
    if (B.alert) { ctx.fillStyle = '#ff5a3a'; ctx.font = '700 13px Impact'; ctx.textAlign = 'center'; ctx.fillText('!', B.x, B.y - 16); } }
/* ---------- the darkness and its lights ---------- */
function m14Lights(now) { const M = M14, L = []; // [x,y,r,strength]
    M.ships.forEach(function (S) { if (S.dead) return; if (S.light && S.light.on && S.lightHp > 0) { const lx = S.x + Math.cos(S.ang) * S.len * .18, ly = S.y + Math.sin(S.ang) * S.len * .18; L.push({ beam: 1, x: lx, y: ly, ang: S.light.ang, len: S.light.len }); } S.fires.forEach(function () { L.push({ x: S.x, y: S.y, r: 260 + S.len * .4, a: .7 }); }); });
    const BT = M.battery; if (!BT.dead) L.push({ beam: 1, x: BT.x, y: BT.y, ang: BT.light.ang, len: BT.light.len });
    M.stars.forEach(function (s) { if (now < s.t) return; const k = (now - s.t) / s.dur; L.push({ x: s.x + k * 60, y: s.y + k * 30, r: 640 * (1 - k * .4), a: Math.min(1, (1 - k) * 2.5), star: 1 }); });
    M.booms.forEach(function (b) { const k = (now - b.t) / 1600; L.push({ x: b.x, y: b.y, r: (b.r || 60) * 4 * (1 - k * .5), a: (b.flash ? .9 : 1) * Math.max(0, 1 - k * (b.flash ? 5 : 1.4)) }); });
    M.oil.forEach(function (o) { L.push({ x: o.x, y: o.y, r: o.r * 2.2, a: .6 * (.85 + .15 * Math.sin(now / 200 + o.x)) }); });
    return L; }
function m14DrawDark(now, Ls) { const M = M14, D = M.dark || (M.dark = document.createElement('canvas')); if (D.width !== 1100) { D.width = 1100; D.height = 700; } const g = D.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, 1100, 700); g.fillStyle = 'rgba(2,5,14,.56)'; g.fillRect(0, 0, 1100, 700); g.globalCompositeOperation = 'destination-out'; const cx = M.cam.x, cy = M.cam.y;
    Ls.forEach(function (l) { if (l.beam) { g.save(); g.translate(l.x - cx, l.y - cy); g.rotate(l.ang); const gr = g.createLinearGradient(0, 0, l.len, 0); gr.addColorStop(0, 'rgba(0,0,0,.95)'); gr.addColorStop(.7, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, -3); g.lineTo(l.len, -l.len * .08); g.lineTo(l.len, l.len * .08); g.lineTo(0, 3); g.fill(); g.restore(); return; }
        const x = l.x - cx, y = l.y - cy; if (x < -l.r || y < -l.r || x > 1100 + l.r || y > 700 + l.r) return; const gr = g.createRadialGradient(x, y, 0, x, y, l.r); gr.addColorStop(0, 'rgba(0,0,0,' + l.a + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - l.r, y - l.r, l.r * 2, l.r * 2); });
    // the moon gives everything near the boat a faint shape
    const P = M.pt, px = P.x - cx, py = P.y - cy, mg = g.createRadialGradient(px, py, 0, px, py, 380); mg.addColorStop(0, 'rgba(0,0,0,.45)'); mg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = mg; g.fillRect(px - 380, py - 380, 760, 760);
    ctx.drawImage(D, 0, 0); }
function m14DrawLightsAdd(now, Ls) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; Ls.forEach(function (l) { if (l.beam) { ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.ang); const gr = ctx.createLinearGradient(0, 0, l.len, 0); gr.addColorStop(0, 'rgba(230,235,255,.22)'); gr.addColorStop(1, 'rgba(230,235,255,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(l.len, -l.len * .08); ctx.lineTo(l.len, l.len * .08); ctx.lineTo(0, 2); ctx.fill(); ctx.restore(); h12Dot(l.x, l.y, 24, '255,250,230', .9); }
        else if (l.star) { h12Dot(l.x, l.y, l.r * .5, '255,240,200', .06 * l.a); h12Dot(l.x, l.y, 10, '255,255,240', l.a); } }); ctx.restore(); }
/* ---------- main draw ---------- */
function m14Draw(now) {
    const M = M14, P = M.pt, W = canvas.width, H = canvas.height; if (!M.base) M.base = m14BuildBase();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#05080c'; ctx.fillRect(0, 0, W, H); ctx.scale(W / 1100, H / 700);
    const sh = M.shake; ctx.save(); ctx.translate(-Math.round(M.cam.x) + (Math.random() - .5) * sh, -Math.round(M.cam.y) + (Math.random() - .5) * sh);
    ctx.imageSmoothingEnabled = true; const sx = Math.max(0, M.cam.x / M14Q - 2), sy = Math.max(0, M.cam.y / M14Q - 2); ctx.drawImage(M.base, sx, sy, 560, 360, sx * M14Q, sy * M14Q, 560 * M14Q, 360 * M14Q);
    // moonlit swell sparkle, drifting
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = m12Rng(7); for (let i = 0; i < 160; i++) { const x = M.cam.x + ((r() * 1300 + now * .006 * (1 + r())) % 1300) - 100, y = M.cam.y + r() * 760 - 30, a = Math.max(0, Math.sin(now / 700 + i * 1.7)) * .12; if (a < .02 || m14InLand(x, y)) continue; ctx.strokeStyle = 'rgba(190,210,235,' + a + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 7, y - 2, x + 14, y); ctx.stroke(); } ctx.restore();
    M.oil.forEach(function (o) { const P2 = h12Puff('30,22,16', 61); ctx.globalAlpha = .7; ctx.drawImage(P2, o.x - o.r, o.y - o.r * .6, o.r * 2, o.r * 1.2); ctx.globalAlpha = 1; ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const fx = o.x + Math.cos(i * 1.3) * o.r * .5, fy = o.y + Math.sin(i * 2.1) * o.r * .3; h12Dot(fx, fy, 30 + 10 * Math.sin(now / 120 + i), '255,140,50', .5); } ctx.restore(); });
    // torpedo tracks: a line of pale bubbles
    M.torps.forEach(function (T) { T.trail.forEach(function (q) { const a = 1 - (now - q.t) / 2500; ctx.fillStyle = 'rgba(210,235,240,' + a * .5 + ')'; ctx.fillRect(q.x - 1.5, q.y - 1.5, 3, 3); }); ctx.save(); ctx.translate(T.x, T.y); ctx.rotate(T.ang); ctx.fillStyle = '#2a2e2a'; ctx.fillRect(-8, -1.5, 16, 3); ctx.restore(); });
    // splash warning rings where shells will land
    M.shells.forEach(function (S) { const k = Math.max(0, Math.min(1, (now - S.t) / (S.at - S.t))); ctx.strokeStyle = 'rgba(255,90,60,' + (.25 + k * .5) + ')'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(S.x, S.y, S.r * (1.6 - k * .6), 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,90,60,' + k * .12 + ')'; ctx.beginPath(); ctx.arc(S.x, S.y, S.r, 0, 7); ctx.fill();
        const hx = S.x0 + (S.x - S.x0) * k, hy = S.y0 + (S.y - S.y0) * k - Math.sin(k * Math.PI) * 240; ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(hx, hy, 12, '255,200,120', .9); ctx.restore(); });
    M.ships.forEach(function (S) { if (!S.dead) m14DrawShip(S, now); });
    M.boats.forEach(function (B) { m14DrawBoat(B, now); });
    const BT = M.battery; ctx.save(); ctx.translate(BT.x, BT.y); ctx.fillStyle = BT.dead ? '#1a1612' : '#3a3428'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.fill(); if (!BT.dead) { ctx.rotate(BT.light.ang); ctx.fillStyle = '#1a1a14'; ctx.fillRect(0, -2.5, 26, 5); ctx.fillStyle = '#fffbe0'; ctx.beginPath(); ctx.arc(-10, 0, 4, 0, 7); ctx.fill(); } ctx.restore();
    m14DrawPT(P, now);
    // tracers
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; M.tracers.forEach(function (t) { ctx.strokeStyle = t.mine ? 'rgba(255,200,110,.9)' : 'rgba(150,255,160,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(t.x - t.vx * .9, t.y - t.vy * .9); ctx.stroke(); }); ctx.restore();
    // splashes: a white column that rises and collapses
    M.splashes.forEach(function (s) { const k = (now - s.t) / 1800, Pf = h12Puff('225,238,245', 51); for (let i = 0; i < 6; i++) { const a = i * 1.05, rr = s.r * (.3 + k * .7), d = s.r * .3 * k; ctx.globalAlpha = Math.max(0, (1 - k)) * .7; ctx.drawImage(Pf, s.x + Math.cos(a) * d - rr, s.y + Math.sin(a) * d - rr - Math.sin(k * Math.PI) * 18, rr * 2, rr * 2); } ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(220,235,245,' + (1 - k) * .5 + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (.6 + k * 1.4), 0, 7); ctx.stroke(); });
    // explosions
    M.booms.forEach(function (b) { const k = (now - b.t) / 1600; if (b.flash) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(b.x, b.y, b.r * (1 - k), '255,220,150', Math.max(0, 1 - k * 4)); ctx.restore(); return; } const F = h12Puff('255,150,50', 71), S2 = h12Puff('40,34,30', 72), Wp = h12Puff('225,238,245', 51);
        for (let i = 0; i < 8; i++) { const a = i * .785 + b.x, rr = b.r * (.4 + k), d = b.r * .5 * k; ctx.globalAlpha = Math.max(0, 1 - k) * .7; ctx.drawImage(b.water ? Wp : S2, b.x + Math.cos(a) * d - rr, b.y + Math.sin(a) * d - rr, rr * 2, rr * 2); } ctx.globalAlpha = 1;
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.max(0, 1 - k * 1.6); ctx.drawImage(F, b.x - b.r * .8, b.y - b.r * .8, b.r * 1.6, b.r * 1.6); ctx.restore(); ctx.globalAlpha = 1; });
    // smoke screen
    M.smokes.forEach(function (s, i) { const a = (now - s.t) / 1000, rr = Math.min(s.r, 30 + a * 60) * Math.min(1, (s.dur - a) / 2), Pf = h12Puff('120,124,128', 81 + i % 3); ctx.globalAlpha = .75; ctx.drawImage(Pf, s.x - rr + a * 6, s.y - rr, rr * 2, rr * 2); ctx.globalAlpha = 1; });
    // star shells hang under parachutes
    M.stars.forEach(function (s) { if (now < s.t) return; const k = (now - s.t) / s.dur, x = s.x + k * 60, y = s.y + k * 30; ctx.strokeStyle = 'rgba(200,200,190,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y - 16, 8, Math.PI, 0); ctx.moveTo(x - 8, y - 16); ctx.lineTo(x, y); ctx.lineTo(x + 8, y - 16); ctx.stroke(); });
    ctx.restore();
    // night: everything sits under darkness except what something lights up
    const Ls = m14Lights(now); m14DrawDark(now, Ls); ctx.save(); ctx.translate(-Math.round(M.cam.x), -Math.round(M.cam.y)); m14DrawLightsAdd(now, Ls);
    // floating text above the dark
    M.texts.forEach(function (t) { const k = (now - t.at) / 1800; ctx.globalAlpha = 1 - k; ctx.fillStyle = t.col; ctx.font = '700 15px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 3; ctx.strokeText(t.t, t.x, t.y - k * 30); ctx.fillText(t.t, t.x, t.y - k * 30); }); ctx.globalAlpha = 1;
    // the torpedo director: where a fish fired now would run
    if (P.torps > 0 && !M.lost && !M.won) { ctx.strokeStyle = 'rgba(200,230,255,.28)'; ctx.setLineDash([4, 10]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(P.x + Math.cos(P.ang) * 34, P.y + Math.sin(P.ang) * 34); ctx.lineTo(P.x + Math.cos(P.ang) * 1300, P.y + Math.sin(P.ang) * 1300); ctx.stroke(); ctx.setLineDash([]); }
    // ships are marked when visible: name tags in the dark
    M.ships.forEach(function (S) { if (S.dead || S.sinking) return; const d = Math.hypot(S.x - P.x, S.y - P.y); if (d > 1000) return; ctx.font = '700 11px "Special Elite", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = S.type === 'ca' ? 'rgba(255,210,90,.85)' : S.alert ? 'rgba(255,120,90,.8)' : 'rgba(200,210,220,.55)'; ctx.fillText(S.name + (S.maxHp > 1 ? '  ' + '■'.repeat(S.hp) + '□'.repeat(S.maxHp - S.hp) : ''), S.x, S.y - S.beam - 20); });
    ctx.restore();
    m14Hud(now); ctx.restore();
}
function m14Hud(now) { const M = M14, P = M.pt;
    // crosshair
    ctx.save(); ctx.strokeStyle = 'rgba(255,220,150,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(M.mx, M.my, 9, 0, 7); ctx.moveTo(M.mx - 15, M.my); ctx.lineTo(M.mx - 5, M.my); ctx.moveTo(M.mx + 5, M.my); ctx.lineTo(M.mx + 15, M.my); ctx.moveTo(M.mx, M.my - 15); ctx.lineTo(M.mx, M.my - 5); ctx.moveTo(M.mx, M.my + 5); ctx.lineTo(M.mx, M.my + 15); ctx.stroke(); ctx.restore();
    const alert = M.alertAt && now - M.alertAt < 6000;
    m8Panel(12, 12, 262, 176, alert); ctx.textAlign = 'left'; ctx.font = '700 12px "Stardos Stencil", Impact'; ctx.fillStyle = '#d8c890'; ctx.fillText('PT-137 · LT(JG) I. KOVAR, USNR', 22, 30);
    ctx.font = 'bold 11px monospace'; ctx.fillStyle = '#e0e8ee'; ctx.fillText('HULL', 22, 50); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(100, 42, 160, 10); ctx.fillStyle = P.hp > 50 ? '#7fc06a' : P.hp > 25 ? '#e0b040' : '#e04030'; ctx.fillRect(100, 42, 160 * Math.max(0, P.hp) / 100, 10);
    const kn = Math.round(Math.abs(P.v) / 6.2 * 41); ctx.fillStyle = '#e0e8ee'; ctx.fillText('SPEED', 22, 70); ctx.fillStyle = M.k.ShiftLeft || M.k.ShiftRight ? '#9fd0ff' : '#f0e0a0'; ctx.fillText(kn + ' KNOTS' + (M.k.ShiftLeft || M.k.ShiftRight ? '  · MUFFLED' : '') + (P.v < -.1 ? ' ASTERN' : ''), 100, 70);
    ctx.fillStyle = '#e0e8ee'; ctx.fillText('FISH', 22, 92); for (let i = 0; i < 8; i++) { ctx.fillStyle = i < P.torps ? '#d8d0b0' : 'rgba(255,255,255,.12)'; ctx.fillRect(100 + i * 20, 85, 15, 6); if (i < P.torps) { ctx.fillStyle = '#8a3020'; ctx.fillRect(100 + i * 20 + 12, 85, 3, 6); } }
    ctx.fillStyle = '#e0e8ee'; ctx.fillText('.50 CAL', 22, 112); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(100, 104, 160, 8); ctx.fillStyle = P.heat > .8 ? '#e04030' : '#c0a060'; ctx.fillRect(100, 104, 160 * Math.min(1, P.heat), 8);
    const sr = P.smokeReady - now; ctx.fillStyle = '#e0e8ee'; ctx.fillText('SMOKE', 22, 132); ctx.fillStyle = P.smokeUntil > now ? '#9fd0ff' : sr > 0 ? '#8a8a80' : '#9fe07a'; ctx.fillText(P.smokeUntil > now ? 'MAKING SMOKE' : sr > 0 ? 'RELOADING ' + Math.ceil(sr / 1000) + 's' : 'READY — E', 100, 132);
    ctx.fillStyle = '#e0e8ee'; ctx.fillText('STATUS', 22, 152); ctx.fillStyle = alert ? '#ff6a4a' : '#9fe07a'; ctx.fillText(alert ? 'SPOTTED — UNDER FIRE' : 'UNSEEN IN THE DARK', 100, 152);
    ctx.fillStyle = 'rgba(220,210,170,.55)'; ctx.font = '10px monospace'; ctx.fillText('W/S THROTTLE · A/D HELM · SHIFT MUFFLE · SPACE/RMB FISH', 22, 172); ctx.fillText('HOLD LMB .50s · E SMOKE', 22, 183);
    // objectives
    const ca = M.ships.find(function (S) { return S.type === 'ca'; }), done = ca.hp <= 0 && M.kills.dd >= 2;
    m8Panel(1100 - 292, 12, 280, 98, false); ctx.font = '700 12px "Stardos Stencil", Impact'; ctx.fillStyle = '#d8c890'; ctx.fillText('ORDERS · SURIGAO STRAIT', 1100 - 280, 30); ctx.font = 'bold 11px monospace';
    [[ca.hp <= 0, 'TORPEDO MOGAMI  (' + (ca.maxHp - ca.hp) + '/' + ca.maxHp + ' HITS)'], [M.kills.dd >= 2, 'SINK TWO DESTROYERS  (' + Math.min(2, M.kills.dd) + '/2)'], [M.won, done ? 'RUN NORTH TO THE BATTLE LINE ▲' : 'THEN RUN NORTH TO THE BATTLE LINE']].forEach(function (o, i) { ctx.fillStyle = o[0] ? '#9fe07a' : i === 2 && !done ? 'rgba(220,220,200,.4)' : '#f0e8d0'; ctx.fillText((o[0] ? '☑ ' : '☐ ') + o[1], 1100 - 280, 52 + i * 18); });
    if (M.kills.bb) { ctx.fillStyle = '#ffd24a'; ctx.fillText('★ BATTLESHIP TORPEDOED', 1100 - 280, 104); }
    // chart: the whole strait, every contact the SO radar paints
    const mw = 150, mh = mw * M14H / M14W, mx = 1100 - mw - 14, my = 700 - mh - 14, s = mw / M14W; m8Panel(mx - 6, my - 6, mw + 12, mh + 12, false); ctx.save(); ctx.beginPath(); ctx.rect(mx, my, mw, mh); ctx.clip(); ctx.fillStyle = '#0a1620'; ctx.fillRect(mx, my, mw, mh);
    ctx.fillStyle = '#2a3a22'; M14_LAND.forEach(function (L) { ctx.beginPath(); L.pts.forEach(function (p, i) { const x = mx + p[0] * s, y = my + p[1] * s; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.fill(); });
    ctx.fillStyle = 'rgba(120,200,255,.2)'; ctx.fillRect(mx + M14_GOAL.x * s, my, M14_GOAL.w * s, M14_GOAL.h * s);
    const sw = (now / 2500) % 1; ctx.strokeStyle = 'rgba(120,255,140,.25)'; ctx.beginPath(); ctx.moveTo(mx + P.x * s, my + P.y * s); ctx.lineTo(mx + P.x * s + Math.cos(sw * 6.28) * 90, my + P.y * s + Math.sin(sw * 6.28) * 90); ctx.stroke();
    M.ships.forEach(function (S) { if (S.dead) return; ctx.fillStyle = S.sinking ? '#ff9a3a' : S.type === 'ca' ? '#ffd24a' : '#e05040'; ctx.fillRect(mx + S.x * s - (S.type === 'dd' ? 1.5 : 2.5), my + S.y * s - 1.5, S.type === 'dd' ? 3 : 5, 3); });
    M.boats.forEach(function (B) { if (!B.dead) { ctx.fillStyle = '#c08060'; ctx.fillRect(mx + B.x * s - 1, my + B.y * s - 1, 2, 2); } });
    ctx.fillStyle = '#9fe07a'; ctx.beginPath(); ctx.arc(mx + P.x * s, my + P.y * s, 2.6, 0, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(220,210,170,.6)'; ctx.font = '9px monospace'; ctx.textAlign = 'left'; ctx.fillText('SO RADAR', mx, my - 9);
    // off-screen arrow to Mogami while she floats
    if (ca.hp > 0) { const dx = ca.x - (M.cam.x + 550), dy = ca.y - (M.cam.y + 350); if (Math.abs(dx) > 560 || Math.abs(dy) > 360) { const a = Math.atan2(dy, dx), ax = 550 + Math.cos(a) * 300, ay = 350 + Math.sin(a) * 220; ctx.save(); ctx.translate(ax, ay); ctx.rotate(a); ctx.fillStyle = 'rgba(255,210,90,.8)'; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-6, -8); ctx.lineTo(-6, 8); ctx.fill(); ctx.restore(); ctx.fillStyle = 'rgba(255,210,90,.8)'; ctx.font = '700 10px monospace'; ctx.textAlign = 'center'; ctx.fillText('MOGAMI ' + Math.round(Math.hypot(dx, dy) / 30) * 10 + ' YDS', ax, ay + 20); } }
    if (done && !M.won) { ctx.fillStyle = 'rgba(160,220,255,' + (.6 + .3 * Math.sin(now / 200)) + ')'; ctx.font = '700 14px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('▲ RUN NORTH — ' + Math.max(0, Math.round((P.y - M14_GOAL.h) / 30) * 10) + ' YDS TO THE BATTLE LINE ▲', 550, 128); }
    // radio message
    if (M.msg && now - M.msgAt < M.msgDur) { const a = Math.min(1, (M.msgDur - (now - M.msgAt)) / 400); ctx.globalAlpha = a; ctx.font = '700 15px "Special Elite", monospace'; ctx.textAlign = 'center'; const lines = []; let cur = ''; M.msg.split(' ').forEach(function (w) { const tr = cur ? cur + ' ' + w : w; if (ctx.measureText(tr).width > 760 && cur) { lines.push(cur); cur = w; } else cur = tr; }); lines.push(cur); const tw = Math.max.apply(null, lines.map(function (l) { return ctx.measureText(l).width; })) + 40, th = 12 + lines.length * 20, ty = 672 - th; ctx.fillStyle = 'rgba(8,10,8,.78)'; ctx.fillRect(550 - tw / 2, ty, tw, th); ctx.fillStyle = '#d6a91c'; ctx.fillRect(550 - tw / 2, ty, 3, th); ctx.fillStyle = '#f2ead0'; lines.forEach(function (l, i) { ctx.fillText(l, 550, ty + 21 + i * 20); }); ctx.globalAlpha = 1; }
    if (now - P.hurtAt < 300) { const hk = 1 - (now - P.hurtAt) / 300, hg = ctx.createRadialGradient(550, 350, 250, 550, 350, 700); hg.addColorStop(0, 'rgba(200,40,20,0)'); hg.addColorStop(1, 'rgba(200,40,20,' + (.35 * hk) + ')'); ctx.fillStyle = hg; ctx.fillRect(0, 0, 1100, 700); }
    if (M.lost || M.won) { const k = Math.min(1, (now - (M.endAt - 3500)) / 1500); ctx.fillStyle = 'rgba(0,0,0,' + k * .5 + ')'; ctx.fillRect(0, 0, 1100, 700); }
    ctx.textAlign = 'left'; }
