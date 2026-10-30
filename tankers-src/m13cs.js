/* =====================================================
   MISSION 13 CUTSCENES — Operation Thursday: Lalaghat at dusk, the tow over the Chindwin, the glider landing
   at "Broadway", the monsoon march, the bridge at Mawlu. Ending: the train on the bridge, dawn and supply drops.
===================================================== */
function h13Dakota(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); const c = o.col || '#0c0e10';
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-96, -2); ctx.quadraticCurveTo(-98, -12, -80, -14); ctx.lineTo(70, -12); ctx.quadraticCurveTo(92, -10, 98, 0); ctx.quadraticCurveTo(92, 8, 70, 8); ctx.lineTo(-80, 6); ctx.closePath(); ctx.fill(); // fuselage
    ctx.beginPath(); ctx.moveTo(-86, -12); ctx.lineTo(-100, -44); ctx.lineTo(-88, -44); ctx.lineTo(-66, -12); ctx.fill(); ctx.fillRect(-104, -4, 34, 4); // fin + tailplane
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(36, 0); ctx.lineTo(38, 6); ctx.lineTo(-22, 6); ctx.fill(); [6, 24].forEach(function (ex) { ctx.beginPath(); ctx.ellipse(ex + 14, 2, 14, 7, 0, 0, 7); ctx.fill(); }); // wing + engines
    if (o.lit) { ctx.fillStyle = 'rgba(255,200,120,.8)'; for (let i = 0; i < 6; i++) ctx.fillRect(-60 + i * 16, -9, 5, 4); }
    if (o.rim) { ctx.strokeStyle = o.rim; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-80, -14); ctx.lineTo(70, -12); ctx.quadraticCurveTo(92, -10, 98, 0); ctx.stroke(); }
    const sp = t * 40; [6, 24].forEach(function (ex) { ctx.strokeStyle = 'rgba(200,210,220,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(ex + 30, 2, 2, 16, 0, 0, 7); ctx.stroke(); ctx.save(); ctx.translate(ex + 30, 2); ctx.rotate(sp); ctx.fillStyle = 'rgba(30,30,30,.4)'; ctx.fillRect(-1, -16, 2, 32); ctx.restore(); });
    ctx.restore(); }
function h13Glider(x, y, s, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0); const c = o.col || '#0e1012';
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-70, -2); ctx.lineTo(-60, -10); ctx.lineTo(40, -16); ctx.quadraticCurveTo(64, -14, 68, 0); ctx.quadraticCurveTo(60, 10, 40, 10); ctx.lineTo(-60, 4); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-60, -8); ctx.lineTo(-74, -36); ctx.lineTo(-62, -36); ctx.lineTo(-46, -10); ctx.fill(); ctx.fillRect(-14, -18, 50, 5); ctx.fillRect(-76, -4, 26, 3);
    if (o.rim) { ctx.strokeStyle = o.rim; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-60, -10); ctx.lineTo(40, -16); ctx.quadraticCurveTo(64, -14, 68, 0); ctx.stroke(); }
    ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 10); ctx.lineTo(16, 20); ctx.moveTo(40, 10); ctx.lineTo(44, 20); ctx.stroke(); ctx.restore(); }
function h13Mule(x, y, s, t, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col || '#0a0a08'; const st = Math.sin(t * 6) * 4;
    ctx.beginPath(); ctx.ellipse(0, -30, 26, 12, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(20, -34); ctx.lineTo(34, -52); ctx.lineTo(44, -48); ctx.lineTo(28, -28); ctx.fill(); ctx.beginPath(); ctx.ellipse(40, -50, 9, 5, .5, 0, 7); ctx.fill(); ctx.fillRect(30, -64, 3, 10); ctx.fillRect(36, -62, 3, 10);
    ctx.fillRect(-18 + st, -22, 4, 22); ctx.fillRect(-10 - st, -22, 4, 22); ctx.fillRect(12 + st, -22, 4, 22); ctx.fillRect(18 - st, -22, 4, 22); ctx.fillRect(-14, -48, 30, 14); ctx.fillRect(-8, -56, 18, 8); ctx.restore(); }
function h13Truss(x0, x1, y, h, col, rim) { ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0 + 30, y - h); ctx.lineTo(x1 - 30, y - h); ctx.moveTo(x0, y); ctx.lineTo(x0 + 30, y - h); ctx.moveTo(x1, y); ctx.lineTo(x1 - 30, y - h); ctx.stroke(); ctx.lineWidth = 3; const n = Math.round((x1 - x0) / 60); for (let i = 0; i < n; i++) { const a = x0 + 30 + (x1 - x0 - 60) * i / n, b = x0 + 30 + (x1 - x0 - 60) * (i + 1) / n; ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y - h); ctx.moveTo(a, y - h); ctx.lineTo(b, y); ctx.moveTo(b, y); ctx.lineTo(b, y - h); ctx.stroke(); } if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x0 + 30, y - h - 3); ctx.lineTo(x1 - 30, y - h - 3); ctx.stroke(); } }
function h13Loco(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0); const c = '#0c0c0e';
    ctx.fillStyle = c; ctx.fillRect(-90, -54, 130, 40); ctx.beginPath(); ctx.ellipse(-20, -40, 70, 22, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(40, -80, 50, 66); ctx.fillRect(34, -84, 62, 6); ctx.fillRect(-70, -84, 16, 30); ctx.fillRect(-40, -72, 22, 18); ctx.fillRect(-100, -20, 200, 10);
    ctx.beginPath(); ctx.moveTo(-100, -14); ctx.lineTo(-122, 4); ctx.lineTo(-100, 4); ctx.fill();
    [-70, -36, -2, 60].forEach(function (wx, i) { ctx.fillStyle = '#16161a'; ctx.beginPath(); ctx.arc(wx, -2, i < 3 ? 15 : 11, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(200,180,140,.35)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(wx, -2, i < 3 ? 15 : 11, 0, 7); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(200,180,140,.5)'; ctx.lineWidth = 3; const ph = t * 8; ctx.beginPath(); ctx.moveTo(-70 + Math.cos(ph) * 8, -2 + Math.sin(ph) * 8); ctx.lineTo(-2 + Math.cos(ph) * 8, -2 + Math.sin(ph) * 8); ctx.stroke();
    ctx.fillStyle = 'rgba(255,190,90,.9)'; ctx.fillRect(48, -72, 14, 12); h12Glow(-100, -44, 30, '255,230,170', .9); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hb = ctx.createLinearGradient(-100, 0, -700, 0); hb.addColorStop(0, 'rgba(255,230,170,.35)'); hb.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = hb; ctx.beginPath(); ctx.moveTo(-100, -48); ctx.lineTo(-700, -120); ctx.lineTo(-700, 40); ctx.lineTo(-100, -40); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#c02020'; ctx.beginPath(); ctx.arc(66, -40, 8, 0, 7); ctx.fill(); ctx.restore(); }
function h13Wagon(x, y, s, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0); ctx.fillStyle = '#0e0c0a'; ctx.fillRect(-70, -60, 140, 50); ctx.fillRect(-74, -12, 148, 6); [-44, 44].forEach(function (wx) { ctx.beginPath(); ctx.arc(wx - 12, -2, 10, 0, 7); ctx.arc(wx + 12, -2, 10, 0, 7); ctx.fill(); }); if (o.ammo) { ctx.fillStyle = 'rgba(200,170,90,.5)'; ctx.font = '700 12px "Stardos Stencil", Impact'; ctx.fillText('火気厳禁', -30, -32); } ctx.strokeStyle = 'rgba(200,180,140,.25)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-70, -60); ctx.lineTo(70, -60); ctx.stroke(); ctx.restore(); }
function h13Hills(y, h, seed, col, x0, x1, rough) { const r = m12Rng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0, y + 400); let px = x0; ctx.lineTo(x0, y); while (px < x1) { px += 40; ctx.lineTo(px, y - h * (.5 + .5 * Math.sin(px * .004 + seed)) - Math.sin(px * .013 + seed * 3) * h * .2 - r() * (rough || 8)); } ctx.lineTo(x1, y + 400); ctx.closePath(); ctx.fill(); }
function h13Canopy(y, seed, col, x0, x1, sz) { const r = m12Rng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0, y + 300); for (let x = x0; x <= x1; x += 10) ctx.lineTo(x, y - Math.abs(Math.sin(x * .03 + seed)) * sz - Math.abs(Math.sin(x * .011 + seed * 2)) * sz * 1.4 - r() * sz * .3); ctx.lineTo(x1, y + 300); ctx.closePath(); ctx.fill(); }
/* =====================================================
   MISSION 13 CUTSCENES v2 — painted, layered and lit.
   Intro: Lalaghat at sunset · the lamp-lit briefing hut · take-off on the tow · over the Chindwin by moonlight ·
   Broadway from the glider cockpit · the monsoon march · Mawlu through binoculars.
   Ending: the exploder · the plunger · the bridge goes · dawn and the supply drop.
===================================================== */
const M13CS = { dur: 50, cuts: [7.5, 14, 20.5, 27.5, 34.5, 41.5] };
function h13bLayer(key, w, h, fn) { if (H12.c[key]) return H12.c[key]; const c = h12Cv(w, h); fn(c.getContext('2d'), w, h); H12.c[key] = c; return c; }
function h13bGrass() { return h13bLayer('m13gr', 1900, 400, function (g, W, H) { const r = m12Rng(41); g.strokeStyle = '#020403'; g.lineCap = 'round'; for (let i = 0; i < 700; i++) { const x = r() * W, h = 120 + r() * 260; g.lineWidth = 2 + r() * 3; g.beginPath(); g.moveTo(x, H); g.quadraticCurveTo(x + (r() - .5) * 30, H - h * .6, x + (r() - .5) * 80, H - h); g.stroke(); } }); }
function h13bSky(hz, stops) { const g = ctx.createLinearGradient(0, -100, 0, hz); stops.forEach(function (c, i) { g.addColorStop(i / (stops.length - 1), c); }); ctx.fillStyle = g; ctx.fillRect(-200, -200, 2000, hz + 200); }
/* ---------- the C-47 Dakota, three-quarter side view, nose to the right ---------- */
function h13bDakota(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); ctx.rotate(o.rot || 0);
    const base = o.col || '#3a3a2c', dark = o.dark || '#0c0d0a', rim = o.rim, sil = o.sil;
    // far wing and nacelle (behind the fuselage)
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(70, -14); ctx.lineTo(-10, -16); ctx.lineTo(10, -40); ctx.lineTo(56, -40); ctx.fill(); ctx.beginPath(); ctx.ellipse(52, -22, 26, 8, 0, 0, 7); ctx.fill();
    const prop = function (px, py, ry) { ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = 'rgba(200,205,210,.5)'; ctx.beginPath(); ctx.ellipse(px, py, 3, ry, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.translate(px, py); ctx.scale(.12, 1); ctx.rotate(t * 30); ctx.fillStyle = 'rgba(15,15,15,.55)'; ctx.fillRect(-3, -ry, 6, ry * 2); ctx.restore(); };
    prop(82, -22, 24);
    // fuselage
    ctx.beginPath(); ctx.moveTo(198, -4); ctx.bezierCurveTo(196, -22, 176, -30, 150, -32); ctx.lineTo(-60, -34); ctx.bezierCurveTo(-130, -33, -180, -26, -212, -16); ctx.lineTo(-214, -8); ctx.bezierCurveTo(-170, -4, -110, 10, -40, 18); ctx.lineTo(120, 18); ctx.bezierCurveTo(170, 16, 196, 10, 198, -4); ctx.closePath();
    if (sil) { ctx.fillStyle = dark; ctx.fill(); } else { const g = ctx.createLinearGradient(0, -34, 0, 18); g.addColorStop(0, ddpRGB(ddpMix(ddpHex(base), [255, 230, 190], .35))); g.addColorStop(.35, base); g.addColorStop(1, dark); ctx.fillStyle = g; ctx.fill(); }
    // fin + tailplane
    ctx.fillStyle = sil ? dark : base; ctx.beginPath(); ctx.moveTo(-150, -30); ctx.bezierCurveTo(-168, -66, -184, -94, -202, -100); ctx.lineTo(-216, -98); ctx.lineTo(-214, -16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-196, -12, 42, 5, 0, 0, 7); ctx.fill();
    if (!sil) { ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1; [-150, -90, -30, 40, 110].forEach(function (px) { ctx.beginPath(); ctx.moveTo(px, -33); ctx.lineTo(px + 2, 17); ctx.stroke(); });
        ctx.fillStyle = 'rgba(10,12,14,.85)'; for (let i = 0; i < 7; i++) ctx.fillRect(108 - i * 30, -24, 9, 7); ctx.fillStyle = '#0a0c10'; ctx.beginPath(); ctx.moveTo(158, -28); ctx.lineTo(186, -22); ctx.lineTo(186, -14); ctx.lineTo(160, -16); ctx.fill(); ctx.strokeStyle = 'rgba(200,220,240,.35)'; ctx.beginPath(); ctx.moveTo(162, -26); ctx.lineTo(182, -21); ctx.stroke();
        ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-128, -26, 18, 34);
        ctx.fillStyle = '#1e2a5a'; ctx.beginPath(); ctx.arc(-80, -6, 12, 0, 7); ctx.fill(); ctx.fillStyle = '#8ab0d8'; ctx.beginPath(); ctx.arc(-80, -6, 5, 0, 7); ctx.fill(); // SEAC roundel
        ctx.fillStyle = 'rgba(232,226,200,.7)'; ctx.font = '700 9px "Stardos Stencil", Impact'; ctx.fillText(o.code || 'KG 653', -176, -4); }
    if (o.lit) { ctx.fillStyle = 'rgba(255,200,120,.85)'; for (let i = 0; i < 7; i++) ctx.fillRect(109 - i * 30, -23, 7, 5); }
    // near wing, nacelle, propeller
    ctx.fillStyle = sil ? dark : ddpRGB(ddpMix(ddpHex(base), [0, 0, 0], .25)); ctx.beginPath(); ctx.moveTo(84, 8); ctx.lineTo(-34, 10); ctx.lineTo(-96, 58); ctx.lineTo(-30, 62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sil ? dark : base; ctx.beginPath(); ctx.ellipse(46, 14, 38, 13, -.08, 0, 7); ctx.fill(); ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(84, 12, 6, 11, 0, 0, 7); ctx.fill();
    if (o.exhaust) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(18, 20, 22, '120,170,255', .6 * o.exhaust); h12Dot(18, 20, 8, '255,220,180', .9 * o.exhaust); ctx.restore(); }
    prop(92, 12, 38);
    if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.moveTo(-212, -16); ctx.bezierCurveTo(-180, -26, -130, -33, -60, -34); ctx.lineTo(150, -32); ctx.bezierCurveTo(176, -30, 196, -22, 198, -4); ctx.moveTo(-150, -30); ctx.bezierCurveTo(-168, -66, -184, -94, -202, -100); ctx.moveTo(84, 8); ctx.lineTo(-34, 10); ctx.stroke(); }
    ctx.restore(); }
/* ---------- the Waco CG-4A glider ---------- */
function h13bGlider(x, y, s, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); ctx.rotate(o.rot || 0); const base = o.col || '#3e3c2c', dark = o.dark || '#0c0c0a', sil = o.sil;
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(70, -46); ctx.lineTo(-20, -46); ctx.lineTo(0, -60); ctx.lineTo(56, -60); ctx.fill(); // far wing
    ctx.beginPath(); ctx.moveTo(130, -8); ctx.lineTo(126, -34); ctx.lineTo(100, -44); ctx.lineTo(-40, -42); ctx.lineTo(-150, -20); ctx.lineTo(-160, -12); ctx.lineTo(-40, 6); ctx.lineTo(110, 8); ctx.closePath();
    if (sil) ctx.fillStyle = dark; else { const g = ctx.createLinearGradient(0, -44, 0, 8); g.addColorStop(0, ddpRGB(ddpMix(ddpHex(base), [255, 230, 190], .3))); g.addColorStop(.4, base); g.addColorStop(1, dark); ctx.fillStyle = g; } ctx.fill();
    ctx.fillStyle = sil ? dark : base; ctx.beginPath(); ctx.moveTo(-128, -22); ctx.lineTo(-146, -72); ctx.lineTo(-168, -72); ctx.lineTo(-164, -14); ctx.fill(); ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-150, -12, 30, 4, 0, 0, 7); ctx.fill();
    if (!sil) { ctx.fillStyle = 'rgba(20,30,40,.85)'; ctx.beginPath(); ctx.moveTo(126, -32); ctx.lineTo(100, -42); ctx.lineTo(84, -42); ctx.lineTo(90, -16); ctx.lineTo(128, -12); ctx.fill(); ctx.strokeStyle = 'rgba(180,170,140,.6)'; ctx.lineWidth = 1.2; [[96, -42, 102, -14], [110, -38, 114, -13], [86, -30, 128, -24]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); });
        ctx.strokeStyle = 'rgba(0,0,0,.3)'; for (let px = -110; px < 80; px += 26) { ctx.beginPath(); ctx.moveTo(px, -40 + (px < -40 ? (px + 40) * -.2 : 0)); ctx.lineTo(px, 6 + (px < -40 ? (px + 40) * .15 : 0)); ctx.stroke(); }
        ctx.fillStyle = '#1e2a5a'; ctx.beginPath(); ctx.arc(-70, -14, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#8ab0d8'; ctx.beginPath(); ctx.arc(-70, -14, 4, 0, 7); ctx.fill(); if (o.chalk) { ctx.fillStyle = 'rgba(240,236,220,.85)'; ctx.font = '700 12px "Special Elite", monospace'; ctx.fillText(o.chalk, -10, -18); } }
    ctx.fillStyle = sil ? dark : ddpRGB(ddpMix(ddpHex(base), [0, 0, 0], .2)); ctx.beginPath(); ctx.moveTo(72, -44); ctx.lineTo(-24, -44); ctx.lineTo(-80, -10); ctx.lineTo(-14, -8); ctx.fill(); // near wing
    ctx.strokeStyle = dark; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, 6); ctx.lineTo(22, 22); ctx.moveTo(60, 7); ctx.lineTo(66, 22); ctx.moveTo(-30, -9); ctx.lineTo(10, -40); ctx.stroke(); ctx.fillStyle = dark; [[22, 24], [66, 24]].forEach(function (w) { ctx.beginPath(); ctx.arc(w[0], w[1], 6, 0, 7); ctx.fill(); });
    if (o.rim) { ctx.strokeStyle = o.rim; ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.moveTo(-150, -20); ctx.lineTo(-40, -42); ctx.lineTo(100, -44); ctx.lineTo(126, -34); ctx.moveTo(-128, -22); ctx.lineTo(-146, -72); ctx.lineTo(-168, -72); ctx.moveTo(72, -44); ctx.lineTo(-24, -44); ctx.stroke(); }
    ctx.restore(); }
/* ---------- figures ---------- */
function h13bMan(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale((o.dir || 1) * s, s); const c = o.col || '#06080a', w = o.walk === undefined ? 1 : o.walk, ph = t * 5 + (o.ph || 0), st = Math.sin(ph) * w, bob = Math.abs(Math.cos(ph)) * 2.5 * w, cr = o.crouch || 0, ln = .14 + cr * .35 + (o.lean || 0);
    ctx.translate(0, -bob + cr * 16); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = c; ctx.fillStyle = c;
    const hy = -46 + cr * 8; ctx.lineWidth = 9.5; [[st, 1], [-st, -1]].forEach(function (L) { const kx = L[0] * 10 + cr * 8, fx = L[0] * 18 - cr * 4; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(kx, -24 + cr * 10); ctx.lineTo(fx, -2); ctx.stroke(); ctx.fillRect(fx - 3, -6, 12, 6); });
    const sx = ln * 40; ctx.beginPath(); ctx.moveTo(-10, hy + 4); ctx.lineTo(10, hy + 4); ctx.quadraticCurveTo(15 + sx, -66 + cr * 6, 12 + sx, -83 + cr * 6); ctx.lineTo(-11 + sx, -85 + cr * 6); ctx.quadraticCurveTo(-14 + sx * .5, -64 + cr * 6, -10, hy + 4); ctx.closePath(); ctx.fill();
    if (o.pack !== false) { ctx.beginPath(); ctx.moveTo(-10 + sx * .7, -84 + cr * 6); ctx.lineTo(-24 + sx * .7, -82 + cr * 6); ctx.quadraticCurveTo(-27 + sx * .5, -68 + cr * 6, -22 + sx * .45, -58 + cr * 6); ctx.lineTo(-10 + sx * .4, -58 + cr * 6); ctx.fill(); ctx.beginPath(); ctx.ellipse(-16 + sx * .72, -86 + cr * 6, 9, 4, 0, 0, 7); ctx.fill(); }
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(4 + sx, -78 + cr * 6); ctx.lineTo(10 + sx - st * 6, -56 + cr * 6); ctx.lineTo(16 + sx - st * 4, -44 + cr * 6); ctx.stroke();
    if (o.gun === 'sling') { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-2 + sx, -56 + cr * 6); ctx.lineTo(-14 + sx, -118 + cr * 6); ctx.stroke(); }
    else if (o.gun === 'port') { ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(-6 + sx, -50 + cr * 6); ctx.lineTo(34 + sx, -78 + cr * 6); ctx.stroke(); }
    else if (o.gun === 'knife') { ctx.lineWidth = 3; ctx.strokeStyle = o.blade || c; ctx.beginPath(); ctx.moveTo(16 + sx, -46 + cr * 6); ctx.quadraticCurveTo(30 + sx, -50 + cr * 6, 36 + sx, -40 + cr * 6); ctx.stroke(); ctx.strokeStyle = c; }
    const hx = 3 + sx * 1.08, hdy = -93 + cr * 6; ctx.beginPath(); ctx.arc(hx, hdy, 7.5, 0, 7); ctx.fill();
    if (o.hat === 'jap') { ctx.beginPath(); ctx.arc(hx, hdy - 3, 8, Math.PI, 0); ctx.fill(); ctx.fillRect(hx - 9, hdy - 3, 6, 10); ctx.fillRect(hx + 4, hdy - 4, 7, 2.4); }
    else if (o.hat === 'helmet') { ctx.beginPath(); ctx.ellipse(hx, hdy - 3, 13, 3.4, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(hx, hdy - 3, 8.5, Math.PI, 0); ctx.fill(); }
    else { ctx.beginPath(); ctx.ellipse(hx, hdy - 5, 14, 3.6, -.08, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(hx, hdy - 8, 8, 6, 0, Math.PI, 0); ctx.fill(); if (o.hat === 'gurkha') { ctx.fillRect(hx - 10, hdy - 8, 4, 4); } }
    if (o.rim) { ctx.strokeStyle = o.rim; ctx.lineWidth = 1.6; const rs = o.rimSide || 1; ctx.beginPath(); if (rs > 0) { ctx.arc(hx, hdy, 7.5, -1.4, 1.2); ctx.moveTo(hx + 14, hdy - 5); ctx.lineTo(hx - 2, hdy - 9); ctx.moveTo(12 + sx, -82 + cr * 6); ctx.lineTo(9, hy + 2); } else { ctx.arc(hx, hdy, 7.5, 1.9, 4.6); ctx.moveTo(-24 + sx * .7, -82 + cr * 6); ctx.quadraticCurveTo(-27 + sx * .5, -68 + cr * 6, -22 + sx * .45, -58 + cr * 6); ctx.moveTo(hx - 14, hdy - 5); ctx.lineTo(hx, hdy - 9); } ctx.stroke(); }
    ctx.restore(); }
function h13bPeek(x, y, s, rim, look) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (look || 1), s); ctx.fillStyle = '#020403'; ctx.beginPath(); ctx.moveTo(-34, 30); ctx.quadraticCurveTo(-32, -4, -12, -10); ctx.lineTo(14, -10); ctx.quadraticCurveTo(34, -4, 36, 30); ctx.fill(); ctx.beginPath(); ctx.arc(2, -22, 11, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(2, -29, 20, 5, -.06, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(2, -33, 11, 8, 0, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = '#020403'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(8, 4); ctx.lineTo(70, -12); ctx.stroke();
    if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(2, -22, 11, -1.4, .9); ctx.moveTo(22, -29); ctx.lineTo(2, -34); ctx.moveTo(14, -10); ctx.quadraticCurveTo(34, -4, 36, 30); ctx.moveTo(30, -6); ctx.lineTo(70, -14); ctx.stroke(); } ctx.restore(); }
function h13bMule(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale((o.dir || 1) * s, s); const c = o.col || '#06080a', st = Math.sin(t * 5 + (o.ph || 0)) * 5 * (o.walk === undefined ? 1 : o.walk); ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.ellipse(0, -40, 32, 15, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(24, -46); ctx.lineTo(42, -66); ctx.lineTo(54, -60); ctx.lineTo(34, -36); ctx.fill(); ctx.beginPath(); ctx.ellipse(52, -60, 12, 6, .6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(42, -68); ctx.lineTo(40, -86); ctx.lineTo(46, -70); ctx.moveTo(47, -68); ctx.lineTo(50, -85); ctx.lineTo(51, -68); ctx.fill();
    ctx.lineWidth = 6; [[-22, st], [-14, -st], [18, -st], [26, st]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], -32); ctx.lineTo(l[0] + l[1] * .6, -16); ctx.lineTo(l[0] + l[1], 0); ctx.stroke(); });
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -44); ctx.quadraticCurveTo(-40, -30, -36, -16); ctx.stroke();
    ctx.fillRect(-20, -66, 38, 18); ctx.fillRect(-26, -60, 10, 22); ctx.fillRect(14, -60, 10, 22); ctx.fillRect(-8, -78, 20, 12); // pack saddle, radio, mortar
    if (o.rim) { ctx.strokeStyle = o.rim; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-20, -66); ctx.lineTo(18, -66); ctx.moveTo(42, -66); ctx.lineTo(54, -60); ctx.moveTo(-30, -48); ctx.quadraticCurveTo(0, -58, 26, -50); ctx.stroke(); }
    ctx.restore(); }
function h13bPalm(x, y, h, col, t, seed) { const r = m12Rng(seed); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round'; const lean = (r() - .5) * .4, tx = x + Math.sin(lean) * h, ty = y - h; ctx.lineWidth = h * .035; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * h * .2, y - h * .5, tx, ty); ctx.stroke();
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i / 8 - .5) * 3.6 + Math.sin(t * 1.3 + i) * .05, L = h * (.35 + r() * .15); ctx.lineWidth = h * .012; ctx.beginPath(); ctx.moveTo(tx, ty); const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .6 + L * .35; ctx.quadraticCurveTo(tx + Math.cos(a) * L * .5, ty + Math.sin(a) * L * .5 - L * .1, ex, ey); ctx.stroke();
        for (let k = 1; k < 9; k++) { const q = k / 9, px = tx + (ex - tx) * q, py = ty + (ey - ty) * q - Math.sin(q * Math.PI) * L * .12; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a + 1.2) * L * .12, py + L * .12); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a - 1.2) * L * .12, py + L * .12); ctx.stroke(); } } }
function h13bLeaves(g, x, y, r, seed, col, n) { const R = m12Rng(seed); g.fillStyle = col; for (let i = 0; i < (n || 40); i++) { const a = R() * 6.28, d = Math.pow(R(), .6) * r; g.beginPath(); g.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d * .7, r * (.12 + R() * .1), r * (.05 + R() * .04), a + R(), 0, 7); g.fill(); } }
function h13bTrunk(g, x, y0, y1, w, col, rim) { g.fillStyle = col; g.beginPath(); g.moveTo(x - w / 2, y0); g.lineTo(x - w * .55, y1 - w * 1.6); g.quadraticCurveTo(x - w * .7, y1 - w * .3, x - w * 2.4, y1); g.lineTo(x + w * 2.4, y1); g.quadraticCurveTo(x + w * .7, y1 - w * .3, x + w * .55, y1 - w * 1.6); g.lineTo(x + w / 2, y0); g.fill();
    if (rim) { g.strokeStyle = rim; g.lineWidth = 2; g.beginPath(); g.moveTo(x + w / 2, y0); g.lineTo(x + w * .55, y1 - w * 1.6); g.quadraticCurveTo(x + w * .7, y1 - w * .3, x + w * 2.4, y1); g.stroke(); } }
function h13bRain(hv, u, n, a, ang, sp) { ctx.strokeStyle = 'rgba(190,210,230,' + a + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < n; i++) { const L = 18 + ddpR(i * 7) * 30, x = ((ddpR(i) * 1900 + u * 300 * ang) % 1900 + 1900) % 1900 - 150, y = (ddpR(i * 3) * (hv + 100) + u * (sp || 1400) * (.8 + ddpR(i) * .4)) % (hv + 100) - 50; ctx.moveTo(x, y); ctx.lineTo(x - L * ang, y + L); } ctx.stroke(); }
function h13bGoose(x, y, s, u, i) { const fl = .8 + .2 * Math.sin(u * 13 + i * 3); h12Glow(x, y - 4 * s, 26 * s, '255,170,80', .5 * fl); h12Glow(x, y - 4 * s, 8 * s, '255,240,190', .9 * fl); ctx.fillStyle = '#0a0806'; ctx.fillRect(x - 2 * s, y - 2 * s, 4 * s, 4 * s); }
/* ---------- INTRO 1: Lalaghat at sunset ---------- */
function h13bShotAirfield(u, hv) { const hz = hv * .6, pan = u * 16, sx = 980 - pan * .15;
    h13bSky(hz, ['#160f2a', '#3a1c40', '#8a3a44', '#e0703a', '#ffb862', '#ffe0a0']);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(sx, hz - 96, 760, '255,150,70', .45); h12Dot(sx, hz - 96, 180, '255,220,150', .75); ctx.restore(); ctx.fillStyle = '#fff4d6'; ctx.beginPath(); ctx.arc(sx, hz - 96, 44, 0, 7); ctx.fill();
    ctx.globalAlpha = .9; ctx.drawImage(h12CloudBank(51, '255,170,110', '70,30,60'), -500 - pan * .25, hz - 560, 2800, 420); ctx.globalAlpha = .6; ctx.drawImage(h12CloudBank(53, '255,200,140', '90,40,60'), -300 - pan * .4, hz - 250, 2400, 200); ctx.globalAlpha = 1;
    // sun rays through the dust
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const a = Math.PI * (.62 + i * .085) + Math.sin(u * .2 + i) * .01; const g = ctx.createLinearGradient(sx, hz, sx + Math.cos(a) * 1400, hz + Math.sin(a) * 1400); g.addColorStop(0, 'rgba(255,190,110,.12)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, hz - 20); ctx.lineTo(sx + Math.cos(a - .025) * 1600, hz + Math.sin(a - .025) * 1600); ctx.lineTo(sx + Math.cos(a + .025) * 1600, hz + Math.sin(a + .025) * 1600); ctx.fill(); } ctx.restore();
    h13Hills(hz - 6, 80, 3, '#4a2440', -100 - pan * .1, 1800, 6); h13Hills(hz + 4, 46, 4, '#2e1830', -100 - pan * .2, 1800, 8);
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#6a4428'); gg.addColorStop(.25, '#3a2414'); gg.addColorStop(1, '#0e0806'); ctx.fillStyle = gg; ctx.fillRect(-100, hz, 1800, hv - hz + 100);
    // the strip: sunlit dust and lines of gliders receding
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createRadialGradient(sx, hz, 0, sx, hz, 900); sg.addColorStop(0, 'rgba(255,170,90,.35)'); sg.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = sg; ctx.fillRect(-100, hz, 1800, 500); ctx.restore();
    for (let i = 0; i < 9; i++) { const k = i / 8, gy = hz + 14 + k * k * 60, gs = .18 + k * .3; h13bGlider(140 + i * 175 - pan * (.4 + k * .4), gy, gs, { sil: true, dark: '#1a0e0c', rim: 'rgba(255,190,110,.7)' }); }
    for (let i = 0; i < 5; i++) h13bPalm(60 + i * 380 - pan * .5 + (i % 2) * 60, hz + 20, 160 + (i % 3) * 40, '#120a0c', u, 31 + i);
    // long shadows and the big Dakota, back-lit
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(1150 - pan * 1.1, hv * .84, 420, 34, -.05, 0, 7); ctx.fill();
    h13bDakota(1130 - pan * 1.1, hv * .72, 1.55, u * .4, { sil: true, dark: '#0e0a0a', rim: 'rgba(255,190,110,.95)', code: 'KG 653' });
    // the loading: a Waco with its nose swung up, men and a mule going aboard
    ctx.save(); ctx.translate(380 - pan * 1.3, hv * .82); ctx.scale(1.4, 1.4); h13bGlider(0, 0, 1, { sil: true, dark: '#0c0808', rim: 'rgba(255,190,110,.85)' }); ctx.restore();
    [[600, 0], [660, 1], [730, 2]].forEach(function (m) { h13bMan(m[0] - pan * 1.3, hv * .9, 1.9, u + m[1], { walk: .6, dir: -1, gun: 'sling', col: '#0a0706', rim: 'rgba(255,190,110,.9)', rimSide: -1, ph: m[1] }); });
    h13bMule(830 - pan * 1.3, hv * .905, 1.6, u, { dir: -1, col: '#0a0706', rim: 'rgba(255,190,110,.9)' });
    const P = h12Puff('230,170,110', 81, 1); for (let i = 0; i < 10; i++) { const k = (u * .05 + i / 10) % 1, r = 260; ctx.globalAlpha = .22 * Math.sin(k * Math.PI); ctx.drawImage(P, -200 + ((i * 197) % 1900) - pan - r, hv * .78 - r * .3, r * 2, r * .6); } ctx.globalAlpha = 1;
    h12Grade(hv, 'rgba(255,150,90,1)', 'rgba(40,20,40,1)', .4); h12Motes(hv, u, 70, '255,210,160'); }
/* ---------- INTRO 2: the briefing hut ---------- */
function h13bMap() { return h13bLayer('m13map', 900, 600, function (g, W, H) { g.fillStyle = '#d8c89a'; g.fillRect(0, 0, W, H); const r = m12Rng(5); for (let i = 0; i < 600; i++) { g.fillStyle = 'rgba(120,90,50,' + r() * .06 + ')'; g.beginPath(); g.arc(r() * W, r() * H, 4 + r() * 40, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(80,110,140,.8)'; g.lineWidth = 5; g.beginPath(); g.moveTo(170, 0); g.bezierCurveTo(200, 160, 120, 300, 190, 600); g.stroke(); g.lineWidth = 3; g.beginPath(); g.moveTo(640, 0); g.bezierCurveTo(600, 220, 700, 380, 660, 600); g.stroke(); // Chindwin, Irrawaddy
    g.strokeStyle = 'rgba(120,90,60,.35)'; g.lineWidth = 1.2; for (let i = 0; i < 26; i++) { g.beginPath(); const y = r() * H, x = r() * W; g.ellipse(x, y, 30 + r() * 60, 14 + r() * 26, r(), 0, 7); g.stroke(); }
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 3; g.setLineDash([10, 6]); g.beginPath(); g.moveTo(560, 600); g.lineTo(580, 380); g.lineTo(540, 160); g.lineTo(560, 0); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#1a1a1a'; g.font = '700 22px "Special Elite", monospace'; g.fillText('CHINDWIN', 70, 120); g.fillText('IRRAWADDY', 670, 520); g.fillText('RAILWAY', 470, 300); g.font = '700 18px "Special Elite", monospace';
    [['BROADWAY', 430, 210], ['PICCADILLY', 320, 330], ['CHOWRINGHEE', 690, 420], ['MAWLU', 590, 250], ['INDAW', 600, 450]].forEach(function (p) { g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(p[1], p[2], 6, 0, 7); g.fill(); g.fillText(p[0], p[1] + 12, p[2] + 6); });
    g.strokeStyle = 'rgba(180,30,20,.85)'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(-20, 560); g.quadraticCurveTo(200, 420, 420, 220); g.stroke(); g.beginPath(); g.moveTo(420, 220); g.lineTo(390, 230); g.moveTo(420, 220); g.lineTo(414, 250); g.stroke();
    g.beginPath(); g.moveTo(450, 220); g.lineTo(580, 250); g.stroke(); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, 290, W, 3); g.fillRect(445, 0, 3, H); }); }
function h13bMapX() { return h13bLayer('m13mapx', 900, 600, function (g, W, H) { g.drawImage(h13bMap(), 0, 0); g.strokeStyle = 'rgba(190,20,10,.9)'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(290, 300); g.lineTo(350, 360); g.moveTo(350, 300); g.lineTo(290, 360); g.stroke(); g.beginPath(); g.arc(430, 210, 30, 0, 7); g.stroke(); }); }
function h13bTrap(img, a, x0t, x1t, yt, x0b, x1b, yb) { const n = 70, ih = img.height, iw = img.width; ctx.globalAlpha = a; for (let i = 0; i < n; i++) { const q0 = i / n, q1 = (i + 1) / n, e0 = Math.pow(q0, 1.35), e1 = Math.pow(q1, 1.35), y0 = yt + (yb - yt) * e0, y1 = yt + (yb - yt) * e1, xa = x0t + (x0b - x0t) * e0, xb = x1t + (x1b - x1t) * e0; ctx.drawImage(img, 0, q0 * ih, iw, ih / n + .5, xa, y0, xb - xa, y1 - y0 + .8); } ctx.globalAlpha = 1; }
function h13bShotBriefing(u, hv) { const zoom = 1 + u * .02, sw = Math.sin(u * 1.4) * .08, lx = 800 + Math.sin(sw) * 150, ly = 150 + Math.cos(sw) * 16;
    ctx.save(); ctx.translate(800, hv * .55); ctx.scale(zoom, zoom); ctx.translate(-800, -hv * .55);
    ctx.fillStyle = '#140c06'; ctx.fillRect(-200, -200, 2000, hv + 400);
    const wall = h13bLayer('m13wall', 1800, 800, function (g, W, H) { for (let x = 0; x < W; x += 26) { const r = m12Rng(x); const gr = g.createLinearGradient(x, 0, x + 24, 0); gr.addColorStop(0, '#3a2814'); gr.addColorStop(.5, '#6a4c26'); gr.addColorStop(1, '#2a1c0c'); g.fillStyle = gr; g.fillRect(x, 0, 24, H); g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 40 + r() * 80; y < H; y += 140 + r() * 60) g.fillRect(x, y, 24, 5); } g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, 300, W, 16); });
    ctx.drawImage(wall, -100, -120, 1800, 800);
    // the window at the back: last light on the strip, a Dakota on the apron
    const wg = ctx.createLinearGradient(0, 120, 0, 300); wg.addColorStop(0, '#4a2440'); wg.addColorStop(.7, '#e07a44'); wg.addColorStop(1, '#ffb066'); ctx.fillStyle = wg; ctx.fillRect(1060, 120, 300, 180); ctx.fillStyle = '#2a141a'; ctx.fillRect(1060, 266, 300, 34); h13bDakota(1220, 262, .32, u, { sil: true, dark: '#1a0c10' }); h13bPalm(1100, 270, 90, '#1a0c10', u, 3);
    ctx.strokeStyle = '#120a04'; ctx.lineWidth = 10; ctx.strokeRect(1060, 120, 300, 180); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1210, 120); ctx.lineTo(1210, 300); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const wl = ctx.createLinearGradient(1060, 300, 900, 700); wl.addColorStop(0, 'rgba(255,150,80,.18)'); wl.addColorStop(1, 'rgba(255,150,80,0)'); ctx.fillStyle = wl; ctx.beginPath(); ctx.moveTo(1060, 300); ctx.lineTo(1360, 300); ctx.lineTo(1200, 700); ctx.lineTo(820, 700); ctx.fill(); ctx.restore();
    // pinned photographs: the Piccadilly reconnaissance shot, circled
    [[300, 150, -.06, 0], [440, 170, .05, 1], [580, 140, -.02, 2]].forEach(function (p) { ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(p[2]); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-56, -40, 120, 92); ctx.fillStyle = '#e8e2d0'; ctx.fillRect(-60, -44, 120, 92); ctx.fillStyle = '#4a4a40'; ctx.fillRect(-52, -36, 104, 70); ctx.fillStyle = '#6a6a5a'; ctx.beginPath(); ctx.ellipse(0, 0, 36, 22, .3, 0, 7); ctx.fill(); if (p[3] === 1) { ctx.strokeStyle = '#2a2a22'; ctx.lineWidth = 2; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.moveTo(-26 + k * 6, -12 + (k % 3) * 6); ctx.lineTo(-14 + k * 6, -4 + (k % 2) * 8); ctx.stroke(); } if (u > 2.6) { ctx.strokeStyle = '#c02a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 40 * Math.min(1, (u - 2.6) * 2), 0, 7); ctx.stroke(); } } ctx.fillStyle = '#b02020'; ctx.beginPath(); ctx.arc(0, -40, 4, 0, 7); ctx.fill(); ctx.restore(); });
    // the table and the map in true perspective
    const ty = hv * .52; ctx.fillStyle = '#24160a'; ctx.beginPath(); ctx.moveTo(330, ty); ctx.lineTo(1270, ty); ctx.lineTo(1800, hv + 100); ctx.lineTo(-200, hv + 100); ctx.fill(); ctx.fillStyle = '#3a2412'; ctx.fillRect(-200, ty - 6, 2000, 0); 
    h13bTrap(h13bMap(), 1, 420, 1180, ty + 14, 40, 1560, hv * 1.02); if (u > 3) h13bTrap(h13bMapX(), Math.min(1, (u - 3) * 1.6), 420, 1180, ty + 14, 40, 1560, hv * 1.02);
    // things on the map: a compass, a mug, the pointer's shadow
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(1240, hv * .9, 70, 22, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#d8d0b8'; ctx.beginPath(); ctx.ellipse(1230, hv * .86, 50, 16, 0, 0, 7); ctx.fill(); ctx.fillRect(1180, hv * .78, 100, 80); ctx.fillStyle = '#c8c0a8'; ctx.beginPath(); ctx.ellipse(1230, hv * .78, 50, 16, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#3a2210'; ctx.beginPath(); ctx.ellipse(1230, hv * .78, 42, 12, 0, 0, 7); ctx.fill();
    // the lamp, hanging and swinging, throwing the room into warm light
    ctx.strokeStyle = '#0a0604'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(800, -120); ctx.lineTo(lx, ly - 40); ctx.stroke(); ctx.fillStyle = '#1a1208'; ctx.fillRect(lx - 14, ly - 44, 28, 8); ctx.fillStyle = 'rgba(255,224,160,.95)'; ctx.beginPath(); ctx.ellipse(lx, ly - 18, 13, 20, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1208'; ctx.fillRect(lx - 16, ly + 2, 32, 10); ctx.strokeStyle = '#1a1208'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx - 14, ly - 36); ctx.lineTo(lx - 14, ly + 2); ctx.moveTo(lx + 14, ly - 36); ctx.lineTo(lx + 14, ly + 2); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(lx, ly - 18, 1000, '255,170,80', .3); h12Dot(lx, ly - 18, 170, '255,220,150', .55); const pool = ctx.createRadialGradient(lx, hv * .75, 0, lx, hv * .75, 600); pool.addColorStop(0, 'rgba(255,200,120,.22)'); pool.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = pool; ctx.fillRect(lx - 600, hv * .4, 1200, 700); ctx.restore();
    for (let i = 0; i < 6; i++) { const a = u * (2 + i * .4) + i * 2, mx = lx + Math.cos(a) * (30 + i * 9), my = ly - 18 + Math.sin(a * 1.3) * (20 + i * 6); ctx.fillStyle = 'rgba(255,230,190,.8)'; ctx.fillRect(mx, my, 3, 2); }
    ctx.restore();
    // foreground: two officers framing the table on the left, the Brigadier on the right in his old Wolseley helmet with the pointer
    h13bMan(150, hv * 1.32, 7.2, 0, { walk: 0, dir: 1, pack: false, col: '#080503', rim: 'rgba(255,190,110,.9)', rimSide: 1, lean: .02 });
    h13bMan(420, hv * 1.42, 5.2, 0, { walk: 0, dir: 1, pack: false, hat: 'helmet', col: '#0a0604', rim: 'rgba(255,190,110,.8)', rimSide: 1, lean: .1 });
    const wx = 1430, wy = hv * 1.18; ctx.save(); ctx.translate(wx, wy); ctx.scale(5.6, 5.6); ctx.fillStyle = '#080503'; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-14, -48); ctx.quadraticCurveTo(-24, -70, -20, -86); ctx.lineTo(14, -90); ctx.quadraticCurveTo(18, -70, 12, -48); ctx.lineTo(16, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(-4, -100, 9, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-13, -99); ctx.quadraticCurveTo(-16, -86, -7, -87); ctx.lineTo(-1, -94); ctx.fill(); // beard
    ctx.beginPath(); ctx.ellipse(-4, -106, 17, 4, -.05, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-4, -112, 10, 11, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-14, -109, 20, 3); // the Wolseley helmet with its puggaree
    const pa = Math.sin(u * .8) * .04; ctx.strokeStyle = '#080503'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-12, -84); ctx.lineTo(-30, -64); ctx.lineTo(-40, -62); ctx.stroke(); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-40, -62); ctx.lineTo(-40 - Math.cos(.35 + pa) * 120, -62 + Math.sin(.35 + pa) * 40); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,190,110,.95)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.arc(-4, -100, 9, 2.2, 4.4); ctx.moveTo(-21, -106); ctx.lineTo(-4, -110); ctx.moveTo(-14, -112); ctx.arc(-4, -112, 10, Math.PI, Math.PI * 1.45); ctx.moveTo(-20, -86); ctx.quadraticCurveTo(-24, -70, -14, -48); ctx.moveTo(-12, -84); ctx.lineTo(-30, -64); ctx.stroke(); ctx.restore();
    h12Grade(hv, 'rgba(255,170,90,1)', 'rgba(20,10,5,1)', .4);
    const vg = ctx.createRadialGradient(lx, hv * .45, 260, lx, hv * .45, 1100); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.65)'); ctx.fillStyle = vg; ctx.fillRect(-100, -100, 1800, hv + 200); h12Motes(hv, u, 40, '255,210,150'); }

/* ---------- INTRO 3: take-off ---------- */
function h13bShotTakeoff(u, hv) { const hz = hv * .58;
    h13bSky(hz, ['#0a0c22', '#2a2448', '#6a3a50', '#d0704a', '#f0a060']); ctx.drawImage(h12Stars(hv), -100, -100); ctx.globalAlpha = .7; ctx.drawImage(h12CloudBank(57, '230,140,110', '40,26,50'), -400 - u * 10, hz - 420, 2600, 340); ctx.globalAlpha = 1;
    h13Hills(hz, 60, 6, '#1e1428', -100, 1800, 6);
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#3a2418'); gg.addColorStop(1, '#0a0604'); ctx.fillStyle = gg; ctx.fillRect(-100, hz, 1800, hv);
    // the runway in perspective with flare pots running away from us
    ctx.fillStyle = 'rgba(120,90,60,.35)'; ctx.beginPath(); ctx.moveTo(760, hz); ctx.lineTo(840, hz); ctx.lineTo(1800, hv); ctx.lineTo(-200, hv); ctx.fill();
    for (let i = 0; i < 14; i++) { const p = Math.pow(((i / 14) + u * .06) % 1, 2.2), y = hz + 4 + p * (hv - hz), half = 40 + p * 1000; h13bGoose(800 - half, y, .3 + p * 2.4, u, i); h13bGoose(800 + half, y, .3 + p * 2.4, u, i + 30); }
    // the tug climbs away with the glider still on the ground, then lifting
    const k = h12K(u, 0, 6.5), dx = 280 + k * 1100, dy = hv * .78 - h12E(h12K(u, 1.6, 6.5)) * 420, rot = -h12K(u, 1.2, 2.6) * .14;
    const gx = dx - 520, gl = h12K(u, 2.4, 4.4), gy = hv * .86 - h12E(gl) * 160 - Math.max(0, u - 4.4) * 30, gr = -gl * .1;
    const P = h12Puff('200,150,100', 61); for (let i = 0; i < 18; i++) { const q = (u * .9 + i / 18) % 1, r = 50 + q * 220; ctx.globalAlpha = (1 - q) * .45 * (1 - h12K(u, 3, 6)); ctx.drawImage(P, dx - 260 - q * 600 - r, hv * .86 - r * .5, r * 2, r); ctx.globalAlpha = (1 - q) * .35 * (1 - gl * .7); ctx.drawImage(P, gx - 120 - q * 300 - r * .6, hv * .9 - r * .3, r * 1.2, r * .6); } ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(30,24,20,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx + 140, gy - 20); ctx.quadraticCurveTo((gx + dx) / 2, Math.max(gy, dy) + 30, dx - 260, dy - 10); ctx.stroke();
    h13bGlider(gx, gy, 1.1, { rot: gr, col: '#3a3628', dark: '#100c08', rim: 'rgba(255,170,110,.75)' });
    h13bDakota(dx, dy, 1.2, u * 3, { rot: rot, col: '#36342a', dark: '#100c08', rim: 'rgba(255,170,110,.8)', exhaust: 1, code: 'KG 572' });
    ctx.fillStyle = '#060404'; ctx.beginPath(); ctx.moveTo(-100, hv + 40); ctx.lineTo(-100, hv * .9); ctx.quadraticCurveTo(200, hv * .86, 340, hv * .95); ctx.lineTo(340, hv + 40); ctx.fill();
    [[60, 0], [150, 1]].forEach(function (m) { h13bMan(m[0], hv * .9, 2.1, 0, { walk: 0, dir: 1, gun: 'sling', col: '#060404', rim: 'rgba(255,160,100,.7)', rimSide: 1 }); }); // ground crew watching
    h12Grade(hv, 'rgba(255,140,90,1)', 'rgba(10,10,30,1)', .4); h12Motes(hv, u, 40, '255,200,150'); }
/* ---------- INTRO 4: over the Chindwin ---------- */
function h13bShotTow(u, hv) { const bob = Math.sin(u * 1.1) * 10, roll = Math.sin(u * .7) * .03;
    h13bSky(hv, ['#01030a', '#081430', '#16284a', '#2a3a5a']); ctx.drawImage(h12Stars(hv), -100 - u * 6, -80); h12Moon(1350, 150, 40, 1.6);
    // far below: ranges and the river catching the moon through gaps in the cloud
    ctx.save(); ctx.translate(0, 80); h13Hills(hv * .55, 60, 21, '#0c1626', -100 - u * 8, 1800, 6); h13Hills(hv * .62, 50, 22, '#0a1220', -100 - u * 12, 1800, 6);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(200,215,245,.55)'; ctx.lineWidth = 5; ctx.beginPath(); for (let x = -100; x <= 1800; x += 30) { const y = hv * .66 + Math.sin(x * .004 - u * .04) * 40; if (x === -100) ctx.moveTo(x - u * 14, y); else ctx.lineTo(x - u * 14, y); } ctx.stroke(); ctx.restore(); ctx.restore();
    ctx.globalAlpha = .9; ctx.drawImage(h12CloudBank(61, '190,205,235', '14,22,40'), -600 - u * 30, hv * .5, 3000, 420); ctx.drawImage(h12CloudBank(63, '170,185,220', '12,18,34'), -400 - u * 50, hv * .72, 2800, 380); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(800, hv * .5); ctx.rotate(roll); ctx.translate(-800, -hv * .5 + bob);
    const tx = 1230 + Math.sin(u * .5) * 20, ty = 230 + Math.sin(u * .8) * 8; h13bDakota(tx, ty, .75, u * 3, { sil: true, dark: '#05070c', rim: 'rgba(210,225,255,.85)', exhaust: .9 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(tx - 160, ty - 18, 10, '255,60,40', .7 + .3 * Math.sin(u * 6)); ctx.restore(); // tail light
    const gx = 520, gy = hv * .62 + Math.sin(u * 1.3) * 12; ctx.strokeStyle = 'rgba(190,200,220,.6)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(gx + 300, gy - 30); ctx.quadraticCurveTo(900, gy - 30 + Math.sin(u * 2) * 20, tx - 150, ty); ctx.stroke();
    h13bGlider(gx, gy, 2.3, { col: '#2a2c2a', dark: '#05070a', rim: 'rgba(210,225,255,.9)', rot: Math.sin(u * 1.1) * .02 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,200,120,.35)'; for (let i = 0; i < 3; i++) ctx.fillRect(gx - 40 + i * 50, gy - 66, 12, 9); ctx.restore(); // cabin chinks
    ctx.restore();
    // cloud wisps tearing past the camera
    const W = h12Puff('200,212,235', 67, 1); for (let i = 0; i < 7; i++) { const k = (u * .22 + i / 7) % 1, r = 300 + (i % 3) * 120; ctx.globalAlpha = .35 * Math.sin(k * Math.PI); ctx.drawImage(W, 1900 - k * 2400 - r, (i * 173) % hv - r * .3, r * 2, r * .6); } ctx.globalAlpha = 1;
    h12Grade(hv, 'rgba(80,110,180,1)', 'rgba(0,5,20,1)', .45); }
/* ---------- INTRO 5: Broadway from the cockpit ---------- */
function h13bShotCockpit(u, hv) { const td = 4.2, k = u - td, sh = k > 0 && k < 1.6 ? (1.6 - k) * 16 : 0, roll = k < 0 ? Math.sin(u * 1.7) * .03 : 0; ctx.save(); ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    const desc = Math.min(1, u / td), hz = hv * (.28 + h12E(desc) * .14), z = u < td ? u * 1.25 : td * 1.25 + (1 - Math.pow(1 - Math.min(1, k / 2.4), 2)) * 1.4;
    ctx.translate(800, hv * .4); ctx.rotate(roll); ctx.translate(-800, -hv * .4);
    h13bSky(hz, ['#02040a', '#0a1428', '#1e2c48']); ctx.drawImage(h12Stars(hv), -100, -100); h12Moon(300, 120, 22, 1);
    const tl = h13bLayer('m13tl', 1900, 260, function (g, W, H) { for (let x = 0; x < W; x += 30) h13bLeaves(g, x, H * .6, 60 + ((x * 7) % 40), x + 3, '#04080a', 30); g.fillStyle = '#04080a'; g.fillRect(0, H * .6, W, H * .4); });
    const ts = 1 + z * .12; ctx.drawImage(tl, 800 - 950 * ts, hz - 180 * ts, 1900 * ts, 260 * ts);
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#12160e'); gg.addColorStop(1, '#2a2618'); ctx.fillStyle = gg; ctx.fillRect(-200, hz, 2000, hv);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fp = ctx.createRadialGradient(800, hz + 60, 0, 800, hz + 60, 900); fp.addColorStop(0, 'rgba(255,170,80,.14)'); fp.addColorStop(1, 'rgba(255,170,80,0)'); ctx.fillStyle = fp; ctx.fillRect(-100, hz, 1800, hv); ctx.restore();
    ctx.strokeStyle = 'rgba(20,16,10,.5)'; ctx.lineWidth = 3; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(800 + i * 14, hz); ctx.lineTo(800 + i * 260, hv); ctx.stroke(); } // ruts
    // flare path: two rows of goosenecks streaming at us
    for (let i = 0; i < 12; i++) { const d = ((i - z * 2.2) % 12 + 12) % 12, p = 1 / (1 + d * .9), y = hz + 8 + p * (hv * 1.1 - hz), half = 20 + p * 900; if (y > hv + 80) continue; h13bGoose(800 - half, y, .5 + p * 5, u, i); h13bGoose(800 + half, y, .5 + p * 5, u, i + 50); }
    const wz = Math.min(3.2, .6 + z * .5); ctx.save(); ctx.translate(800 - 240 * wz, hz + 20 * wz); ctx.rotate(-.35); h13bGlider(0, 0, .35 * wz, { sil: true, dark: '#040404' }); ctx.restore(); h12Fire(800 - 230 * wz, hz + 26 * wz, .35 * wz, u, 3);
    if (k > 0) { const P = h12Puff('170,140,100', 95); for (let i = 0; i < 18; i++) { const q = (k * .8 + i / 18) % 1, r = 140 + q * 500; ctx.globalAlpha = (1 - q) * .55 * Math.min(1, k * 2) * Math.max(0, 1 - k / 2.6); ctx.drawImage(P, 800 + (ddpR(i) - .5) * 1600 - r, hv * .75 - q * 400 - r * .5, r * 2, r); } ctx.globalAlpha = 1; }
    ctx.restore();
    // the Waco's greenhouse nose: framed glazing, two pilots, the yoke
    ctx.save(); ctx.translate((Math.random() - .5) * sh * .6, (Math.random() - .5) * sh * .6); const fb = hv * .7;
    ctx.fillStyle = '#040404'; ctx.beginPath(); ctx.rect(-200, -200, 2000, hv + 400); ctx.moveTo(60, 30); ctx.lineTo(1540, 30); ctx.lineTo(1600, fb); ctx.lineTo(0, fb); ctx.closePath(); ctx.fill('evenodd');
    ctx.strokeStyle = '#060606'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(800, 30); ctx.lineTo(800, fb); ctx.moveTo(420, 30); ctx.lineTo(300, fb); ctx.moveTo(1180, 30); ctx.lineTo(1300, fb); ctx.moveTo(30, hv * .3); ctx.lineTo(1570, hv * .3); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,190,120,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(808, 30); ctx.lineTo(808, fb); ctx.moveTo(428, 30); ctx.lineTo(308, fb); ctx.moveTo(30, hv * .3 - 8); ctx.lineTo(1570, hv * .3 - 8); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(200,215,245,.04)'; ctx.beginPath(); ctx.moveTo(900, 30); ctx.lineTo(1050, 30); ctx.lineTo(820, fb); ctx.lineTo(700, fb); ctx.fill(); ctx.restore(); // reflection on the perspex
    const dg = ctx.createLinearGradient(0, fb, 0, hv); dg.addColorStop(0, '#16120c'); dg.addColorStop(1, '#050403'); ctx.fillStyle = dg; ctx.fillRect(-200, fb, 2000, hv);
    [[620, fb + 60], [700, fb + 56], [900, fb + 58], [980, fb + 62]].forEach(function (d, i) { ctx.fillStyle = '#0a0a08'; ctx.beginPath(); ctx.arc(d[0], d[1], 24, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,200,130,.5)'; ctx.lineWidth = 2; ctx.stroke(); ctx.strokeStyle = 'rgba(255,230,180,.8)'; ctx.beginPath(); ctx.moveTo(d[0], d[1]); const a = -1 + i * .7 + (k > 0 ? Math.sin(u * 20 + i) * .4 : Math.sin(u + i) * .1); ctx.lineTo(d[0] + Math.cos(a) * 18, d[1] + Math.sin(a) * 18); ctx.stroke(); });
    [[290, 1], [1310, -1]].forEach(function (p) { ctx.fillStyle = '#020202'; ctx.beginPath(); ctx.ellipse(p[0], hv * .86, 190, 120, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(p[0] - p[1] * 10, hv * .64, 56, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(p[0] - p[1] * 10, hv * .6, 64, 26, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(p[0] - 190, hv * .86, 380, 300); ctx.fillRect(p[0] - p[1] * 10 - 50, hv * .64, 100, 160);
        ctx.strokeStyle = 'rgba(255,190,120,.55)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p[0] - p[1] * 10, hv * .64, 56, -2.5, -.6); ctx.moveTo(p[0] - 160, hv * .78); ctx.quadraticCurveTo(p[0], hv * .72, p[0] + 160, hv * .78); ctx.stroke(); });
    const yk = k > 0 ? Math.sin(u * 25) * 8 * Math.max(0, 1 - k) : Math.sin(u * 3) * 6; ctx.strokeStyle = '#020202'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(800, hv + 40); ctx.lineTo(800 + yk, hv * .82); ctx.stroke(); ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(800 + yk, hv * .82, 60, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.restore(); h12Grade(hv, 'rgba(255,170,100,1)', 'rgba(10,15,30,1)', .35); }

/* ---------- INTRO 6: the monsoon march ---------- */
function h13bShotMarch(u, hv) { const dr = u * 26, bolt = (u % 4.4) < .1 || ((u % 4.4) > .18 && (u % 4.4) < .26), bk = bolt ? 1 : 0;
    h13bSky(hv, bolt ? ['#5a6a7a', '#7a8a90', '#4a5a50'] : ['#0e1a1a', '#1e3028', '#26382c']);
    const back = h13bLayer('m13jb', 2400, 900, function (g, W, H) { const r = m12Rng(9); for (let i = 0; i < 40; i++) { const x = r() * W; h13bTrunk(g, x, 0, H * .8, 10 + r() * 14, '#0e1a12'); } for (let i = 0; i < 120; i++) h13bLeaves(g, r() * W, r() * H * .5, 60 + r() * 60, i, 'rgba(14,30,18,.9)', 30); g.fillStyle = '#0c160e'; g.fillRect(0, H * .8, W, H * .2); });
    const mid = h13bLayer('m13jm', 2400, 1000, function (g, W, H) { const r = m12Rng(19); for (let i = 0; i < 16; i++) { const x = r() * W; h13bTrunk(g, x, 0, H * .86, 22 + r() * 18, '#08100a', 'rgba(120,150,120,.18)'); } for (let i = 0; i < 60; i++) h13bLeaves(g, r() * W, r() * H * .35, 80 + r() * 80, i + 300, '#081008', 36);
        g.strokeStyle = '#08100a'; g.lineWidth = 4; for (let i = 0; i < 30; i++) { const x = r() * W; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 40, H * .3, x + (r() - .5) * 60, H * (.3 + r() * .4)); g.stroke(); } });
    ctx.drawImage(back, -((dr * .3) % 800) - 200, -40, 2400, 900); if (bolt) { ctx.fillStyle = 'rgba(200,220,255,.18)'; ctx.fillRect(-100, -100, 1800, hv + 200); }
    { const mg = h12Puff('120,150,140', 71, 1); for (let i = 0; i < 6; i++) { const r = 420; ctx.globalAlpha = .22; ctx.drawImage(mg, ((i * 330 - dr * .45) % 2100 + 2100) % 2100 - 300, hv * .45 + (i % 2) * 60, r * 2, r * .7); } ctx.globalAlpha = 1; }
    ctx.drawImage(mid, -((dr * .6) % 800) - 200, -60, 2400, 1000);
    // the chaung: the column wades a stream, rain dimpling the water
    const wy = hv * .74; const wg = ctx.createLinearGradient(0, wy - 20, 0, hv); wg.addColorStop(0, bolt ? '#5a6a70' : '#1a2a26'); wg.addColorStop(1, '#050806'); ctx.fillStyle = wg; ctx.fillRect(-100, wy - 10, 1800, hv);
    ctx.strokeStyle = 'rgba(180,200,210,.18)'; ctx.lineWidth = 1; for (let i = 0; i < 80; i++) { const x = (ddpR(i) * 1700 + u * 40) % 1700, y = wy + ddpR(i * 5) * (hv - wy), r = ((u * 2 + ddpR(i)) % 1) * 12; ctx.beginPath(); ctx.ellipse(x, y, r, r * .3, 0, 0, 7); ctx.stroke(); }
    for (let i = 0; i < 11; i++) { const x = ((i * 170 + 2200 - dr) % 2200) - 300, y = wy + 18; if (i % 4 === 1) h13bMule(x, y, 1.45, u + i, { col: '#050806', rim: bolt ? 'rgba(220,235,255,.8)' : 'rgba(140,170,160,.25)', ph: i }); else h13bMan(x, y, 1.55, u + i * .3, { walk: .7, gun: i % 3 ? 'sling' : 'port', col: '#050806', rim: bolt ? 'rgba(220,235,255,.9)' : 'rgba(140,170,160,.3)', ph: i }); ctx.fillStyle = 'rgba(200,220,230,.15)'; ctx.fillRect(x - 24, y - 2, 48, 3); }
    // the Gurkha at the front, very close, khukuri drawn
    h13bMan(1260 + Math.sin(u * .5) * 10, hv * .95, 3.6, u * .8, { walk: .35, gun: 'knife', hat: 'gurkha', col: '#030504', blade: bolt ? '#e8f0ff' : '#6a7a80', rim: bolt ? 'rgba(230,240,255,.95)' : 'rgba(140,170,160,.35)', rimSide: 1 });
    const fg = h13bLayer('m13jf', 2400, 1100, function (g, W, H) { const r = m12Rng(29); for (let i = 0; i < 6; i++) { const x = 200 + i * 420 + r() * 100; h13bTrunk(g, x, 0, H, 50 + r() * 30, '#020403', 'rgba(150,180,170,.2)'); } for (let i = 0; i < 12; i++) h13bLeaves(g, r() * W, H * (.85 + r() * .15), 140, i + 900, '#020403', 50); for (let i = 0; i < 10; i++) h13bLeaves(g, r() * W, r() * 120, 160, i + 700, '#020403', 50); });
    ctx.globalAlpha = .96; ctx.drawImage(fg, -((dr * 1.6) % 800) - 300, -60, 2400, hv + 120); ctx.globalAlpha = 1;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const x = (ddpR(i) * 1700 + Math.sin(u + i) * 30) % 1700, y = hv * .3 + ddpR(i * 3) * hv * .45 + Math.cos(u * .7 + i) * 20, a = .5 + .5 * Math.sin(u * 4 + i * 2); if (a > .4) h12Dot(x, y, 6, '200,255,120', a * .8); } ctx.restore();
    h13bRain(hv, u, 420, bolt ? .5 : .28, .25, 1500); h13bRain(hv, u * 1.3, 120, bolt ? .4 : .18, .3, 2200);
    h12Grade(hv, 'rgba(80,130,110,1)', 'rgba(5,15,10,1)', .45); }
/* ---------- INTRO 7: Mawlu through binoculars, then the section in the grass ---------- */
function h13bBridgeScene(u, hv, hz) { h13bSky(hz, ['#02040a', '#0e1626', '#1c2638']); ctx.drawImage(h12Stars(hv), -100, -60); h12Moon(1340, 120, 28, 1.1);
    ctx.globalAlpha = .7; ctx.drawImage(h12CloudBank(31, '150,165,200', '14,20,34'), -400 + u * 10, hz - 420, 2600, 380); ctx.globalAlpha = 1;
    h13Hills(hz, 90, 13, '#0a1218', -100, 1800, 10); h13Canopy(hz + 20, 15, '#060c0a', -100, 1800, 50);
    const ry = hz + 140; h12Sea(ry - 10, hv + 60, u * .5, { gx: 1340, ga: .7, far: '#2a3446', mid: '#141c28', near: '#05080c', haze: .1 });
    ctx.fillStyle = '#05080a'; ctx.beginPath(); ctx.moveTo(-100, ry + 10); ctx.lineTo(380, ry - 4); ctx.lineTo(420, ry + 40); ctx.lineTo(-100, ry + 60); ctx.fill(); ctx.beginPath(); ctx.moveTo(1700, ry + 10); ctx.lineTo(1220, ry - 4); ctx.lineTo(1180, ry + 40); ctx.lineTo(1700, ry + 60); ctx.fill();
    [560, 800, 1040].forEach(function (px) { ctx.fillStyle = '#0a0c10'; ctx.fillRect(px - 16, ry - 30, 32, 120); ctx.strokeStyle = 'rgba(200,215,240,.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + 16, ry - 30); ctx.lineTo(px + 16, ry + 80); ctx.stroke(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(200,215,245,.08)'; ctx.fillRect(px - 16, ry + 100, 32, 60); ctx.restore(); });
    h13Truss(380, 1220, ry - 30, 80, '#1a2028', 'rgba(220,230,250,.8)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(520, ry - 70, 160, '255,190,110', .18); h12Dot(1080, ry - 70, 160, '255,190,110', .18); ctx.restore();
    // the station: godown, water tower, signal; lanterns and sentries
    ctx.fillStyle = '#080a0c'; ctx.fillRect(1250, ry - 120, 170, 90); ctx.beginPath(); ctx.moveTo(1240, ry - 120); ctx.lineTo(1335, ry - 160); ctx.lineTo(1430, ry - 120); ctx.fill(); ctx.fillRect(1460, ry - 200, 50, 40); ctx.fillRect(1466, ry - 160, 6, 130); ctx.fillRect(1498, ry - 160, 6, 130); ctx.fillRect(220, ry - 150, 6, 120); ctx.fillRect(210, ry - 152, 26, 8);
    ctx.fillStyle = 'rgba(255,190,110,.85)'; ctx.fillRect(1290, ry - 90, 14, 12); ctx.fillRect(1350, ry - 90, 14, 12); h12Glow(1325, ry - 84, 90, '255,180,100', .35); h12Glow(222, ry - 150, 12, '255,60,40', .9);
    [[520, 1], [1080, -1]].forEach(function (s, i) { const x = s[0] + Math.sin(u * .4 + i * 2) * 30; h13bMan(x, ry - 32, .55, u + i, { walk: .5, dir: s[1], hat: 'jap', gun: 'sling', pack: false, col: '#06080a', rim: 'rgba(255,190,110,.6)', rimSide: -s[1] }); h12Glow(x + s[1] * 8, ry - 62, 50, '255,200,120', .55); });
    ctx.fillStyle = '#e8e4dc'; ctx.fillRect(1290, ry - 210, 46, 30); ctx.fillStyle = '#c02020'; ctx.beginPath(); ctx.arc(1313, ry - 195, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#0a0a0a'; ctx.fillRect(1286, ry - 212, 3, 90);
    const tx = 1680 - u * 6; h12Glow(tx, hz + 4, 60, '255,230,170', .6 + .2 * Math.sin(u * 3)); h12Column(tx + 10, hz - 6, u, { h: 160, w: 30, lean: .9, seed: 4, rgb: '90,95,110', lit: null, a: .5, n: 12, speed: .08 }); return ry; }
function h13bShotMawlu(u, hv) { const hz = hv * .5, open = h12E(h12K(u, 2.2, 4.4));
    ctx.save(); const zm = 1.9 - open * .9, zc = hv * (.47 + .13 * (1 - open)); ctx.translate(800, hv * .47); ctx.scale(zm, zm); ctx.translate(-800 + Math.sin(u * .9) * 6 * (1 - open), -zc + Math.cos(u * .7) * 4 * (1 - open)); h13bBridgeScene(u, hv, hz); ctx.restore();
    // foreground: the section in elephant grass, appears as the glasses come down
    if (open > 0) { ctx.globalAlpha = open; const grass = h13bGrass();
        ctx.drawImage(grass, -150, hv - 380, 1900, 400); [[230, 2.6, 1], [440, 2.3, 1], [1310, 2.8, -1]].forEach(function (m) { h13bPeek(m[0], hv * .86, m[1], 'rgba(200,215,245,.7)', m[2]); });
         ctx.globalAlpha = 1; }
    // the binocular mask
    if (open < 1) { const r = 330 + open * 900, cy = hv * .47, MK = H12.c.m13mask || (H12.c.m13mask = h12Cv(1800, 1200)), mg = MK.getContext('2d'); mg.globalCompositeOperation = 'source-over'; mg.clearRect(0, 0, 1800, 1200); mg.fillStyle = '#000'; mg.fillRect(0, 0, 1800, 1200); mg.globalCompositeOperation = 'destination-out'; [-1, 1].forEach(function (sd) { const gr = mg.createRadialGradient(900 + sd * r * .62, cy + 100, r * .9, 900 + sd * r * .62, cy + 100, r); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)'); mg.fillStyle = gr; mg.beginPath(); mg.arc(900 + sd * r * .62, cy + 100, r, 0, 7); mg.fill(); });
        ctx.globalAlpha = 1 - open * .9; ctx.drawImage(MK, -100, -100); ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(200,220,240,' + .25 * (1 - open) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(800 - 60, cy); ctx.lineTo(800 + 60, cy); for (let i = -3; i <= 3; i++) { ctx.moveTo(800 + i * 20, cy - 6); ctx.lineTo(800 + i * 20, cy + 6); } ctx.stroke(); }
    h12Grade(hv, 'rgba(60,90,160,1)', 'rgba(0,10,20,1)', .45); }
function h13IntroFrame(t, w, h) { const U = w / 1600, hv = h / U, c = M13CS.cuts; ctx.save(); ctx.scale(U, U); ctx.textAlign = 'left';
    if (t < c[0]) h13bShotAirfield(t, hv); else if (t < c[1]) h13bShotBriefing(t - c[0], hv); else if (t < c[2]) h13bShotTakeoff(t - c[1], hv); else if (t < c[3]) h13bShotTow(t - c[2], hv); else if (t < c[4]) h13bShotCockpit(t - c[3], hv); else if (t < c[5]) h13bShotMarch(t - c[4], hv); else h13bShotMawlu(t - c[5], hv);
    ctx.restore(); ddpBloom(w, h); }
function drawM13Cutscene(now) {
    if (!campaignCutsceneRunning) return;
    const C = M13CS, t = Math.max(0, (now - campaignCutsceneStart) / 1000), w = canvas.width, h = canvas.height; if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    try { h13IntroFrame(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    let flash = 0; C.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .18) flash = Math.max(flash, .18 * (1 - d / .18)); });
    { const k = t - C.cuts[3] - 4.2; if (k > 0 && k < .25) flash = Math.max(flash, .5 * (1 - k / .25)); }
    cs2Once('m13eng', t > .3, function () { try { playTone(80, 76, 6, .05, 'sawtooth'); } catch (e) {} }); cs2Once('m13roll', t > C.cuts[1] + .2, function () { try { playTone(70, 120, 5, .07, 'sawtooth'); } catch (e) {} }); cs2Once('m13wind', t > C.cuts[2] + .1, function () { try { playTone(200, 160, 6, .02, 'triangle'); } catch (e) {} });
    cs2Once('m13land', t > C.cuts[3] + 4.2, function () { try { playExplosionSound(.9); playTone(90, 40, .8, .1, 'sawtooth'); } catch (e) {} }); cs2Once('m13thunder', t > C.cuts[4] + .1, function () { try { playExplosionSound(.5); playTone(50, 40, 2, .05, 'sawtooth'); } catch (e) {} }); cs2Once('m13thunder2', t > C.cuts[4] + 4.5, function () { try { playExplosionSound(.4); } catch (e) {} }); cs2Once('m13whistle', t > C.cuts[5] + 2, function () { try { playTone(880, 840, 1.2, .04, 'sine'); setTimeout(function () { try { playTone(880, 820, .8, .04, 'sine'); } catch (e) {} }, 1300); } catch (e) {} });
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .5, w * .22, w / 2, h * .5, w * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(240,230,210,' + flash + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = h12Letterbox(w, h, h12E(Math.min(1, t / 1.2)));
    const ta = Math.min(h12K(t, .6, 1.6), 1 - h12K(t, 5.4, 6.4)); if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; const cy = h * .28; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, cy - 70, w, 132); ctx.strokeStyle = 'rgba(214,169,28,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w * .3, cy - 50); ctx.lineTo(w * .7, cy - 50); ctx.moveTo(w * .3, cy + 44); ctx.lineTo(w * .7, cy + 44); ctx.stroke();
        ctx.fillStyle = '#d9c88c'; ctx.font = '700 ' + Math.round(w * .0105) + 'px "Special Elite", monospace'; ctx.fillText('— THE PACIFIC WAR · BURMA · MISSION 01 —', w / 2, cy - 28); ctx.fillStyle = '#f6eed4'; ctx.shadowColor = 'rgba(255,150,80,.6)'; ctx.shadowBlur = 24; ctx.font = '700 ' + Math.round(w * .05) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('OPERATION THURSDAY', w / 2, cy + 24); ctx.shadowBlur = 0; ctx.fillStyle = '#d9c88c'; ctx.font = Math.round(w * .0105) + 'px "Special Elite", monospace'; ctx.fillText('5 MARCH 1944   ·   LALAGHAT AIRFIELD, ASSAM   ·   77th INDIAN INFANTRY BRIGADE', w / 2, cy + 62); ctx.restore(); }
    const caps = [[6.4, 'THE CHINDITS: BRITISH, GURKHA AND BURMESE TROOPS WHO FIGHT BEHIND JAPANESE LINES.'], [7.8, 'FOUR HOURS BEFORE TAKE-OFF, A RECONNAISSANCE PHOTOGRAPH COMES IN.'], [10.8, 'LANDING ZONE PICCADILLY IS BLOCKED WITH TREE TRUNKS. EVERYTHING GOES TO BROADWAY.'],
        [14.3, 'DUSK. THE FIRST DAKOTA ROLLS, A GLIDER ON THE TOW BEHIND IT.'], [17.4, 'EACH WACO CARRIES FIFTEEN MEN, OR MULES, OR A BULLDOZER FOR THE STRIP.'], [20.8, 'OVER THE CHIN HILLS AND THE CHINDWIN: TWO HUNDRED MILES INTO OCCUPIED BURMA.'], [24.2, 'THE TOW ROPES SNAP IN THE TURBULENCE. SOME GLIDERS NEVER ARRIVE.'],
        [27.8, 'BROADWAY. A JUNGLE CLEARING LIT BY FLARES, AND THE GROUND IS RUTTED.'], [31.8, 'THE FIRST GLIDERS CRASH. THE REST COME IN AROUND THEM.'], [34.8, 'THREE NIGHTS MARCHING THROUGH THE MONSOON TOWARDS THE RAILWAY.'], [38.2, 'THE ONE LINE THAT FEEDS THE JAPANESE ARMY ATTACKING INDIA.'],
        [41.8, 'MAWLU. A STATION, A CAMP, AND A STEEL BRIDGE OVER THE MEZA.'], [44, 'A SUPPLY TRAIN IS DUE. CUT THE LINE BEFORE IT CROSSES.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); const sd = t - 46.2; if (ci >= 0 && sd < 0) h12Caption(w, h, bar, caps[ci][1], t - caps[ci][0], Math.round(w * .0104));
    cs2Once('m13stamp', sd > 0, function () { try { playExplosionSound(1.3); playTone(160, 50, .5, .12, 'square'); } catch (e) {} });
    if (sd > 0) { const k = h12K(sd, 0, .24), sc = 3.2 + (1 - 3.2) * h12E(k), fade = h12K(C.dur - .2 - t, 0, .7); ctx.save(); ctx.translate(w / 2, h * .42); ctx.rotate(-.04); ctx.scale(sc, sc); ctx.globalAlpha = k * fade;
        ctx.fillStyle = 'rgba(6,8,4,.88)'; ctx.fillRect(-w, -96, w * 2, 192); [-96, 80].forEach(function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 16); ctx.clip(); ctx.fillStyle = '#5a8a3a'; ctx.fillRect(-w, y, w * 2, 16); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x + 20, y); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y + 16); ctx.fill(); } ctx.restore(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#c8d8a0'; ctx.font = '700 15px "Special Elite", monospace'; ctx.fillText('— THE PACIFIC WAR · CHINDIT RAID · MISSION 01 —', 0, -52); ctx.fillStyle = '#f6eed4'; ctx.strokeStyle = '#000'; ctx.lineWidth = 8; ctx.shadowColor = 'rgba(120,200,90,.55)'; ctx.shadowBlur = 30; ctx.font = '700 84px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('THE RAILWAY', 0, 26); ctx.fillText('THE RAILWAY', 0, 26); ctx.shadowBlur = 0; ctx.fillStyle = '#e8c968'; ctx.font = '700 18px "Special Elite", monospace'; ctx.fillText('CUT THE LINE.', 0, 60); ctx.restore(); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8); ctx.textAlign = 'left';
    const fa = Math.max(h12K(1 - t, 0, 1), h12K(t, C.dur - 1, C.dur)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < C.dur) campaignCutsceneFrame = requestAnimationFrame(drawM13Cutscene); else finishCampaignCutscene();
}
/* =========================== ENDING =========================== */
const M13E = { dur: 26, cuts: [6, 7.6, 14] };
function h13bEndWait(u, hv) { const hz = hv * .5; ctx.save(); ctx.translate(800, hv * .5); ctx.scale(1.15 + u * .02, 1.15 + u * .02); ctx.translate(-800, -hv * .5);
    const ry = h13bBridgeScene(u + 20, hv, hz); const tx = 1500 - u * 40, deckY = ry - 30;
    for (let i = 0; i < 4; i++) h13Wagon(tx + 230 + i * 160, deckY - 2, .9, { ammo: i < 3 }); h13Loco(tx, deckY - 2, 1, u, {}); h12Column(tx + 30, deckY - 90, u, { h: 280, w: 50, lean: .8, seed: 6, rgb: '80,84,95', lit: null, a: .6, n: 16, speed: .15 });
    ctx.restore();
    // foreground: the officer at the exploder, wire snaking away into the grass
    const grass = h13bGrass(); ctx.drawImage(grass, -150, hv - 380, 1900, 400);
    ctx.strokeStyle = '#1a1a14'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, hv * .8); ctx.bezierCurveTo(900, hv * .98, 700, hv * .8, 400, hv * .74); ctx.stroke();
    ctx.fillStyle = '#0a0a08'; ctx.fillRect(1100, hv * .74, 130, 80); ctx.fillRect(1158, hv * .64, 14, 90); ctx.fillRect(1122, hv * .63, 86, 12); ctx.strokeStyle = 'rgba(200,215,245,.6)'; ctx.lineWidth = 1.5; ctx.strokeRect(1100, hv * .74, 130, 80); ctx.beginPath(); ctx.moveTo(1122, hv * .63); ctx.lineTo(1208, hv * .63); ctx.stroke();
    h13bPeek(1330, hv * .8, 3, 'rgba(200,215,245,.65)', -1);
    h12Grade(hv, 'rgba(60,90,160,1)', 'rgba(0,10,20,1)', .45); return 0; }
function h13bEndPlunger(u, hv) { const push = h12E(h12K(u, .8, 1.15)), sh = u > 1.15 && u < 1.5 ? 14 : 0; ctx.save(); ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    const bg = ctx.createRadialGradient(700, hv * .3, 0, 700, hv * .3, 1200); bg.addColorStop(0, '#1e2a24'); bg.addColorStop(1, '#030504'); ctx.fillStyle = bg; ctx.fillRect(-100, -100, 1800, hv + 200);
    ctx.strokeStyle = '#020302'; ctx.lineCap = 'round'; const r = m12Rng(77); for (let i = 0; i < 90; i++) { const x = r() * 1800 - 100, h = 200 + r() * 400; ctx.lineWidth = 3 + r() * 5; ctx.beginPath(); ctx.moveTo(x, hv); ctx.quadraticCurveTo(x + (r() - .5) * 60, hv - h * .6, x + (r() - .5) * 160, hv - h); ctx.stroke(); } // grass
    // the box, three-quarter view: lid, front, brass terminals, stencil
    const bx = 470, by = hv * .5, bw = 640, bh = 380, dp = 90;
    ctx.fillStyle = '#6a4a28'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + dp, by - dp * .6); ctx.lineTo(bx + bw + dp, by - dp * .6); ctx.lineTo(bx + bw, by); ctx.fill();
    ctx.fillStyle = '#2a1a0c'; ctx.beginPath(); ctx.moveTo(bx + bw, by); ctx.lineTo(bx + bw + dp, by - dp * .6); ctx.lineTo(bx + bw + dp, by + bh - dp * .6); ctx.lineTo(bx + bw, by + bh); ctx.fill();
    const wg = ctx.createLinearGradient(0, by, 0, by + bh); wg.addColorStop(0, '#5a3e22'); wg.addColorStop(1, '#1a1008'); ctx.fillStyle = wg; ctx.fillRect(bx, by, bw, bh); ctx.fillStyle = 'rgba(0,0,0,.28)'; for (let i = 0; i < 6; i++) ctx.fillRect(bx, by + 30 + i * 60, bw, 3);
    ctx.fillStyle = '#8a7a50'; [[bx, by], [bx + bw - 30, by], [bx, by + bh - 30], [bx + bw - 30, by + bh - 30]].forEach(function (c) { ctx.fillRect(c[0], c[1], 30, 30); });
    ctx.fillStyle = 'rgba(232,222,190,.85)'; ctx.font = '700 46px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('EXPLODER', bx + bw / 2, by + 130); ctx.font = '700 20px "Special Elite", monospace'; ctx.fillText('No. 3 MK II  ·  10 CIRCUITS  ·  DANGER', bx + bw / 2, by + 170); ctx.textAlign = 'left';
    [[bx + 120, by - 26], [bx + bw - 60, by - 26]].forEach(function (p, i) { ctx.fillStyle = '#c8a850'; ctx.beginPath(); ctx.ellipse(p[0], p[1], 16, 8, 0, 0, 7); ctx.fill(); ctx.fillRect(p[0] - 8, p[1] - 22, 16, 22); ctx.strokeStyle = i ? '#7a2018' : '#202020'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 18); ctx.bezierCurveTo(p[0] + (i ? 200 : -200), p[1] - 60, p[0] + (i ? 300 : -400), p[1] + 200, p[0] + (i ? 500 : -600), hv); ctx.stroke(); });
    // the plunger rod and T-handle, driven down
    const hx = bx + bw / 2 + dp / 2, top = by - dp * .3, hy = top - 300 + push * 270; ctx.fillStyle = '#1a1a14'; ctx.beginPath(); ctx.ellipse(hx, top, 34, 14, 0, 0, 7); ctx.fill(); const rg = ctx.createLinearGradient(hx - 14, 0, hx + 14, 0); rg.addColorStop(0, '#5a5a52'); rg.addColorStop(.4, '#d0d0c4'); rg.addColorStop(1, '#4a4a42'); ctx.fillStyle = rg; ctx.fillRect(hx - 13, hy, 26, top - hy);
    const hg = ctx.createLinearGradient(0, hy - 30, 0, hy + 14); hg.addColorStop(0, '#5a3a20'); hg.addColorStop(1, '#1a0e06'); ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(hx - 190, hy - 8, 24, 22, 0, 0, 7); ctx.ellipse(hx + 190, hy - 8, 24, 22, 0, 0, 7); ctx.fill(); ctx.fillRect(hx - 190, hy - 30, 380, 44);
    // two fists wrapped round the handle, sleeves rolled, coming from above
    [[-1, hx - 120], [1, hx + 120]].forEach(function (H) { const s = H[0], fx = H[1], fy = hy - 10;
        const sl = ctx.createLinearGradient(fx - 80, 0, fx + 80, 0); sl.addColorStop(0, '#1c2416'); sl.addColorStop(.5, '#3a4a2c'); sl.addColorStop(1, '#141a10'); ctx.fillStyle = sl; ctx.beginPath(); ctx.moveTo(fx - 70, fy - 70); ctx.lineTo(fx + s * 260 - 110, -200); ctx.lineTo(fx + s * 260 + 110, -200); ctx.lineTo(fx + 70, fy - 70); ctx.fill();
        ctx.fillStyle = '#2e3a22'; ctx.beginPath(); ctx.ellipse(fx + s * 70, fy - 160, 92, 34, s * -.5, 0, 7); ctx.fill(); // rolled cuff
        const sk = ctx.createLinearGradient(fx - 70, fy - 80, fx + 70, fy + 40); sk.addColorStop(0, '#b0805a'); sk.addColorStop(.6, '#7a5236'); sk.addColorStop(1, '#3a2414'); ctx.fillStyle = sk; ctx.beginPath(); ctx.moveTo(fx - 62, fy - 90); ctx.quadraticCurveTo(fx - 80, fy - 10, fx - 60, fy + 26); ctx.lineTo(fx + 62, fy + 26); ctx.quadraticCurveTo(fx + 80, fy - 10, fx + 62, fy - 90); ctx.fill();
        for (let f = 0; f < 4; f++) { const ox = fx - 48 + f * 32; ctx.fillStyle = f % 2 ? '#8a5c3c' : '#7a5034'; ctx.beginPath(); ctx.ellipse(ox, fy + 12, 17, 24, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(40,20,10,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - 12, fy + 4); ctx.quadraticCurveTo(ox, fy - 2, ox + 12, fy + 4); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(255,230,190,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(fx - 60, fy - 80); ctx.quadraticCurveTo(fx - 76, fy - 10, fx - 58, fy + 20); ctx.stroke(); });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(300, 0, 900, '120,150,210', .14); if (u > 1.15) h12Dot(800, hv * .2, 1400, '255,180,100', .5 * Math.max(0, 1 - (u - 1.15) * 2)); ctx.restore();
    ctx.restore(); h12Grade(hv, 'rgba(80,110,150,1)', 'rgba(0,0,10,1)', .4); return u > 1.15 && u < 1.35 ? .6 : 0; }

function h13bEndBlast(k, hv) { const hz = hv * .46, sh = k < 2.5 ? (2.5 - k) * 10 : 0; ctx.save(); ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    h13bSky(hz, ['#04050c', '#2a1410', '#7a3418']); ctx.drawImage(h12Stars(hv), -100, -60); h12Moon(260, 110, 24, .9);
    h13Hills(hz, 100, 33, '#140c0c', -100, 1800, 10); h13Canopy(hz + 40, 35, '#080606', -100, 1800, 50);
    const ry = hz + 260, deckY = hz + 150; h12Sea(ry, hv + 60, k * .6, { gx: 800, gc: '255,160,90', ga: 1.4, far: '#3a2a26', mid: '#181010', near: '#050404', haze: .15 });
    ctx.fillStyle = '#050404'; ctx.beginPath(); ctx.moveTo(-100, deckY); ctx.lineTo(240, deckY); ctx.lineTo(320, ry + 20); ctx.lineTo(-100, ry + 80); ctx.fill(); ctx.beginPath(); ctx.moveTo(1700, deckY); ctx.lineTo(1360, deckY); ctx.lineTo(1280, ry + 20); ctx.lineTo(1700, ry + 80); ctx.fill();
    // charges go pier by pier, the centre span folds, the train goes in
    [480, 800, 1120].forEach(function (px, i) { ctx.save(); if (i === 1) { ctx.translate(px, ry + 80); ctx.rotate(Math.min(.6, k * .4)); ctx.translate(-px, -(ry + 80)); } ctx.fillStyle = '#0a0808'; ctx.fillRect(px - 18, deckY, 36, ry - deckY + 80); ctx.restore(); });
    const sag = Math.min(1, k * .6); h13Truss(240, 794, deckY, 80, '#0c0a0a', 'rgba(255,170,100,.55)'); ctx.save(); ctx.translate(800, deckY); ctx.rotate(sag * .6); ctx.translate(-800, -deckY + sag * 80); h13Truss(806, 1360, deckY, 80, '#0c0a0a', 'rgba(255,170,100,.55)'); ctx.restore();
    const tx = 860; let lx = tx - k * 60, ly = deckY - 2 + Math.max(0, k - .3) * Math.max(0, k - .3) * 220, lr = -Math.min(1.3, Math.max(0, k - .3) * .8); if (ly < hv + 140) h13Loco(lx, ly, 1.1, k, { rot: lr });
    for (let i = 0; i < 5; i++) { let wx = tx + 230 + i * 160, wy = deckY - 2, wr = 0; const f = Math.max(0, k - .5 - i * .3); if (wx < 1400) { wx -= f * 70; wy += f * f * 170; wr = -Math.min(1, f * .55); } if (wy < hv + 100) h13Wagon(wx, wy, 1, { rot: wr, ammo: i < 3 }); }
    if (ly > ry - 40) { const sk2 = Math.max(0, (ly - ry + 40) / 200); const P = h12Puff('230,236,245', 27); for (let i = 0; i < 16; i++) { const q = ((k - 1) * .35 + i / 16) % 1, r = 80 + q * 300; ctx.globalAlpha = (1 - q) * .3 * Math.min(1, sk2); ctx.drawImage(P, lx - 100 + (i % 5) * 50 - r, ry - q * 340 - r, r * 2, r * 2); } ctx.globalAlpha = 1; } // steam where the loco hits the water
    [[480, 0], [800, .25], [1120, .5], [800, .9]].forEach(function (c, i) { const d = k - c[1]; if (d > 0) { h13bBurst(c[0], deckY + 20, d, i === 3 ? 1.3 : .8, 21 + i * 2); if (d < .15) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(c[0], deckY + 20, 420, '255,220,170', .45 * (1 - d / .15)); ctx.restore(); } } });
    if (k > 1.6) h12Fire(820, ry - 10, 1.2, k, 7); if (k > 2.2) h12Fire(1080, ry - 30, .8, k, 9);
    for (let i = 0; i < 50; i++) { const kk = k - (i % 5) * .08; if (kk < 0) continue; const a = -Math.PI / 2 + (ddpR(i) - .5) * 2.6, sp = 260 + ddpR(i * 3) * 520, x = 800 + Math.cos(a) * sp * kk, y = deckY + Math.sin(a) * sp * kk + 280 * kk * kk; if (y > hv) continue; if (i % 6 === 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(kk * 5 + i); ctx.fillStyle = '#0a0806'; ctx.fillRect(-14, -2, 28, 4); ctx.restore(); } else { ctx.fillStyle = 'rgba(255,' + (150 + ddpR(i) * 90 | 0) + ',70,' + Math.max(0, 1 - kk / 2.6) + ')'; ctx.fillRect(x, y, 3, 3); } }
    h12Column(800, ry - 60, k + 2, { h: 520, w: 120, lean: .2, seed: 13, rgb: '34,28,26', lit: '255,130,60', a: Math.min(.85, k * .3), n: 20, speed: .05 });
    ctx.restore(); h12Grade(hv, 'rgba(255,140,60,1)', 'rgba(10,15,30,1)', .4); return k < .15 ? .8 * (1 - k / .15) : 0; }
function h13bBurst(x, y, k, s, seed) { if (k < 0) return; const F = h12Puff('255,140,50', seed), Hh = h12Puff('255,240,200', seed + 1), S = h12Puff('30,24,22', seed + 2), R = s * (60 + 240 * (1 - Math.exp(-k * 3)));
    for (let i = 0; i < 18; i++) { const a = ddpR(seed + i) * 6.28, d = Math.pow(ddpR(seed + i * 3), .7) * R, px = x + Math.cos(a) * d, py = y - Math.abs(Math.sin(a)) * d * .8 - k * 60 * s - k * k * 20, r = R * (.4 + ddpR(i + 5) * .4); ctx.globalAlpha = Math.min(.75, k * 1.5) * Math.min(1, k * .6); ctx.drawImage(S, px - r, py - r - k * 40, r * 2, r * 2); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fk = Math.max(0, 1 - k / 2.2); for (let i = 0; i < 26; i++) { const a = ddpR(seed + i * 7) * 6.28, d = Math.pow(ddpR(seed + i * 11), .8) * R * .8, px = x + Math.cos(a) * d, py = y - Math.abs(Math.sin(a)) * d * .7 - k * 50 * s, r = R * (.25 + ddpR(i + 9) * .3) * (1 - k * .15); ctx.globalAlpha = fk * (.55 + ddpR(i) * .3); ctx.drawImage(k < .5 && i % 3 === 0 ? Hh : F, px - r, py - r, r * 2, r * 2); } ctx.restore(); ctx.globalAlpha = 1;
    if (k < 1) for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (ddpR(seed + i) - .5) * 2.2, L = R * 1.6 * Math.min(1, k * 4); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,200,120,' + (1 - k) * .7 + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); ctx.restore(); } }
function h13bEndDawn(u, hv) { const hz = hv * .55, sunY = hz + 20 - h12E(h12K(u, 0, 10)) * 90;
    h13bSky(hz, ['#1a2234', '#4a4a64', '#9a7070', '#e8a46a', '#fbdca0']);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(420, sunY, 700, '255,190,120', .45); h12Dot(420, sunY, 160, '255,236,190', .8); ctx.restore(); ctx.fillStyle = '#fff2d0'; ctx.beginPath(); ctx.arc(420, sunY, 30, 0, 7); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 8; i++) { const a = Math.PI * (.08 + i * .1); const g = ctx.createLinearGradient(420, sunY, 420 + Math.cos(a) * 1500, sunY + Math.sin(a) * 1500); g.addColorStop(0, 'rgba(255,210,150,.12)'); g.addColorStop(1, 'rgba(255,210,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(420, sunY); ctx.lineTo(420 + Math.cos(a - .03) * 1700, sunY + Math.sin(a - .03) * 1700); ctx.lineTo(420 + Math.cos(a + .03) * 1700, sunY + Math.sin(a + .03) * 1700); ctx.fill(); } ctx.restore();
    h13Hills(hz, 90, 41, '#6a5a6a', -100, 1800, 6); h13Hills(hz + 60, 80, 42, '#4a3c4c', -100, 1800, 8);
    const M = h12Puff('255,232,210', 97, 1); for (let i = 0; i < 12; i++) { const r = 360; ctx.globalAlpha = .4; ctx.drawImage(M, ((i * 223 + u * 12) % 2200) - 300, hz + 70 + (i % 3) * 34, r * 2, r * .5); } ctx.globalAlpha = 1;
    // the broken bridge down in the valley, still smoking
    ctx.save(); ctx.translate(1240, hz + 66); ctx.scale(.22, .22); h13Truss(-560, -10, 0, 80, '#2a2230'); ctx.rotate(.5); h13Truss(10, 400, 80, 80, '#2a2230'); ctx.restore(); h12Column(1250, hz + 76, u + 20, { h: 600, w: 120, lean: .3, seed: 9, rgb: '54,44,48', lit: '255,170,110', la: .3, a: .85, n: 28, speed: .035 });
    const dx = 1750 - u * 120; h13bDakota(dx, 170, .9, u * 3, { flip: true, col: '#4a4a3c', rim: 'rgba(255,220,170,.8)' });
    for (let i = 0; i < 8; i++) { const t0 = i * .55, kk = u - t0 - 1; if (kk < 0) continue; const x = 1750 - (t0 + 1.2) * 120 - 120 + Math.sin(kk + i) * 10, y = 190 + kk * 30; if (y > hz + 90) continue; const col = ['#e8e4d8', '#c8402a', '#e8d070', '#5a8a3a'][i % 4]; const cg = ctx.createRadialGradient(x - 5, y - 8, 2, x, y, 22); cg.addColorStop(0, '#fff'); cg.addColorStop(.3, col); cg.addColorStop(1, ddpRGB(ddpMix(ddpHex(col), [0, 0, 0], .4))); ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y, 20, Math.PI, 0); ctx.quadraticCurveTo(x, y - 4, x - 20, y); ctx.fill(); ctx.strokeStyle = 'rgba(30,20,10,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x, y + 26); ctx.lineTo(x + 20, y); ctx.stroke(); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x - 6, y + 24, 12, 10); }
    // the column on the ridge, walking into the sunrise
    ctx.fillStyle = '#16101a'; ctx.beginPath(); ctx.moveTo(-100, hv + 40); ctx.lineTo(-100, hv * .8); ctx.quadraticCurveTo(500, hv * .72, 1000, hv * .83); ctx.lineTo(1700, hv * .92); ctx.lineTo(1700, hv + 40); ctx.fill();
    for (let i = 0; i < 9; i++) { const x = ((i * 180 + 1900 - u * 30) % 1900) - 150, y = hv * (.8 - Math.sin(Math.max(0, Math.min(1, (x + 100) / 1100)) * Math.PI) * .045) + (x > 1000 ? (x - 1000) * .09 : 0); if (i % 4 === 2) h13bMule(x, y, 1.15, u + i, { dir: -1, col: '#16101a', rim: 'rgba(255,200,140,.8)', ph: i }); else h13bMan(x, y, 1.2, u + i * .3, { walk: .6, dir: -1, gun: 'sling', hat: i % 3 === 0 ? 'gurkha' : 'bush', col: '#16101a', rim: 'rgba(255,200,140,.85)', rimSide: -1, ph: i }); }
    h12Grade(hv, 'rgba(255,180,120,1)', 'rgba(40,40,70,1)', .35); h12Motes(hv, u, 40, '255,220,180'); return 0; }
function m13PlayEnding(done) { const E = M13E; E.t0 = performance.now(); E.done = done; E.fired = {}; M12E.fired = {}; canvas.style.cursor = ''; if (!CS2.grain) CS2.grain = cs2Grain();
    E.skip = function (e) { if (e.code === 'Space' || e.code === 'Escape') { e.preventDefault(); E.t0 -= 60000; } }; window.addEventListener('keydown', E.skip); cancelAnimationFrame(E.raf); E.raf = requestAnimationFrame(m13EndFrame); }
function m13EndFrame(now) {
    const E = M13E, c = E.cuts, t = Math.max(0, (now - E.t0) / 1000), w = canvas.width, h = canvas.height, U = w / 1600, hv = h / U;
    if (t >= E.dur) { window.removeEventListener('keydown', E.skip); if (E.done) E.done(); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.scale(U, U); ctx.textAlign = 'left';
    let flash = 0; try { if (t < c[0]) flash = h13bEndWait(t, hv); else if (t < c[1]) flash = h13bEndPlunger(t - c[0], hv); else if (t < c[2]) flash = h13bEndBlast(t - c[1], hv); else flash = h13bEndDawn(t - c[2], hv); } catch (e) { DDP.err = e; }
    m12EOnce('t13', t > .3, function () { try { playTone(880, 840, 1.4, .04, 'sine'); } catch (e) {} }); m12EOnce('p13', t > c[0] + 1.15, function () { try { playTone(300, 80, .2, .1, 'square'); } catch (e) {} });
    m12EOnce('b13', t > c[1], function () { try { playExplosionSound(2.2); playTone(55, 25, 2.4, .16, 'sawtooth'); } catch (e) {} }); m12EOnce('b13b', t > c[1] + .5, function () { try { playExplosionSound(1.8); } catch (e) {} }); m12EOnce('b13c', t > c[1] + 1, function () { try { playExplosionSound(2); } catch (e) {} });
    ctx.restore(); try { ddpBloom(w, h); } catch (e) {}
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .5, w * .22, w / 2, h * .5, w * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    c.forEach(function (cc) { const d = t - cc; if (d >= 0 && d < .2) flash = Math.max(flash, .2 * (1 - d / .2)); }); if (flash > 0) { ctx.fillStyle = 'rgba(255,240,215,' + Math.min(.95, flash) + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = h12Letterbox(w, h, 1);
    const caps = [[.5, '04:10. THE SUPPLY TRAIN FROM INDAW: SIX HUNDRED TONS OF SHELLS FOR KOHIMA.'], [3.2, 'THE WIRE RUNS DOWN TO FOUR CHARGES ON THE GIRDERS. WAIT FOR THE ENGINE.'], [6, 'NOW.'], [9, 'THE CENTRE SPAN FOLDS INTO THE MEZA, AND THE TRAIN GOES WITH IT.'], [14.4, 'DAWN. THE LINE TO MYITKYINA IS CUT, AND IT WILL STAY CUT.'], [17.4, 'THE DAKOTAS BRING RICE, AMMUNITION AND MAIL. THE COLUMN MOVES ON.']];
    let ci = -1; caps.forEach(function (cc, i) { if (t >= cc[0]) ci = i; }); if (ci >= 0 && t < 20.4 && !(t > 6.8 && t < 9)) h12Caption(w, h, bar, caps[ci][1], t - caps[ci][0], Math.round(w * .0106));
    if (t > 20.6) { const k = h12E(h12K(t, 20.6, 21.8)); ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; const cy = h * .34; ctx.fillStyle = 'rgba(0,0,0,' + .45 * k + ')'; ctx.fillRect(0, cy - 90, w, 190); ctx.strokeStyle = 'rgba(214,169,28,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w * .22, cy - 66); ctx.lineTo(w * .78, cy - 66); ctx.moveTo(w * .22, cy + 76); ctx.lineTo(w * .78, cy + 76); ctx.stroke();
        ctx.fillStyle = '#e8d8a0'; ctx.font = '700 ' + Math.round(w * .011) + 'px "Special Elite", monospace'; ctx.fillText('OPERATION THURSDAY — THE PACIFIC WAR, MISSION 01', w / 2, cy - 40); ctx.fillStyle = '#ffd24a'; ctx.shadowColor = 'rgba(255,150,40,.7)'; ctx.shadowBlur = 30; ctx.font = '700 ' + Math.round(w * .056) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE LINE IS CUT', w / 2, cy + 24); ctx.shadowBlur = 0;
        ctx.fillStyle = '#f0e6c8'; ctx.font = Math.round(w * .0125) + 'px "Special Elite", monospace'; ctx.fillText('MAWLU BRIDGE DOWN  ·  THE SUPPLY TRAIN IN THE MEZA  ·  KOHIMA HOLDS', w / 2, cy + 58); ctx.restore(); }
    const fa = Math.max(h12K(.8 - t, 0, .8), h12K(t, E.dur - 1.2, E.dur)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8); ctx.textAlign = 'left';
    E.raf = requestAnimationFrame(m13EndFrame);
}

/* ---------- start + brief ---------- */
function startMission13(skipIntro) {
    returnToMenu(); campaignMission = 13; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; M13.failWhy = '';
    document.getElementById('menu').style.display = 'none'; const cs = document.getElementById('campaignScreen'); if (cs) cs.style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = true; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)'; if (typeof minimapPanel !== 'undefined' && minimapPanel) minimapPanel.style.display = 'none';
    M8.pendingLvl = 'burma';
    if (skipIntro) { m13ShowBrief(); return; }
    if (typeof CS2 !== 'undefined') CS2.fired = {};
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM13Cutscene);
}
function m13ShowBrief() {
    m2InjectStyle(); M8.pendingLvl = 'burma';
    let b = document.getElementById('m2Brief'); if (!b) { b = document.createElement('div'); b.id = 'm2Brief'; document.body.appendChild(b); }
    b.innerHTML = '<div class="bSheet"><div class="bTape"><span>OPERATION THURSDAY · MOST SECRET</span><span>PACIFIC 01</span></div><div class="bBody">' +
        '<h2>THE RAILWAY</h2><p class="bText" id="m13Typed"></p>' +
        '<ul><li>Your section starts at the <b>glider strip</b> (south-west). Cross the <b>Meza</b> at one of the two <b>fords</b>, or rush the guarded <b>bridge</b>.</li>' +
        '<li>Set charges in the <b>AMMUNITION GODOWN</b>, the <b>RADIO HUT</b> and the <b>HQ BASHA</b>: clear each hut before anyone raises the alarm, then <b>hold F</b> on the target.</li>' +
        '<li>The fourth charge goes on the <b>bridge girders</b>, out in the open: stand on the middle of the bridge and <b>hold F</b>.</li>' +
        '<li><b>Elephant grass</b> hides you: guards can\'t see through more than a few yards of it. The monsoon thunder lights up everything for a second.</li>' +
        '<li>The <b>supply train</b> is due in <b>eleven minutes</b>. If it crosses before all four charges are set, the mission fails. With all four set, get back to the <b>glider strip</b>.</li></ul>' +
        '<div class="bNote">Bamboo watchtowers, MG pits at both ends of the bridge, a camp dog, and reinforcements from the barracks if the alarm goes up. The quartermaster at Lalaghat has a whole new armoury.</div>' +
        '<button class="bGo" id="m13ToQM">TO THE ARMOURY ▶</button></div></div>';
    b.hidden = false; b.style.display = '';
    const txt = 'March 1944. The Japanese are marching on India at Kohima and Imphal, fed by one railway. 77th Brigade is behind their lines. Cut the railway at Mawlu, and the offensive starves.';
    const el = document.getElementById('m13Typed'); let i = 0; const iv = setInterval(function () { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(iv); }, 20);
    document.getElementById('m13ToQM').onclick = function () { clearInterval(iv); b.hidden = true; try { playTone(520, 760, .1, .05, 'triangle'); } catch (e) {} m8ShowArmoury(); };
}
