/* =====================================================
   MISSION 10 — painted pieces: Type VII U-boat, MGB, the frogman, the Keroman bunker, night sea
===================================================== */
function ddpNightSea(hz, bot, t, pan, o) {
    o = o || {}; const g = ctx.createLinearGradient(0, hz, 0, bot); g.addColorStop(0, o.top || '#2c3850'); g.addColorStop(.08, '#18242e'); g.addColorStop(1, '#04080c'); ctx.fillStyle = g; ctx.fillRect(-600, hz, 2800, bot - hz + 4);
    for (let i = 0; i < 260; i++) { const y = hz + Math.pow(ddpR(i * 3), 1.7) * (bot - hz), sc = .15 + (y - hz) / (bot - hz), x = ((ddpR(i * 7) * 2600 + t * 18 * sc - pan * sc) % 2600 + 2600) % 2600 - 500, w = 16 + sc * 110; ctx.strokeStyle = 'rgba(150,170,205,' + (.04 + sc * .1) * (.5 + .5 * Math.sin(t * 1.7 + i)) + ')'; ctx.lineWidth = .8 + sc * 2.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w / 2, y - 3 * sc, x + w, y); ctx.stroke(); }
    if (o.moonX !== undefined) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) { const y = hz + 6 + Math.pow(ddpR(i + 300), 1.4) * (bot - hz) * .8, sp = (y - hz) / (bot - hz), x = o.moonX + (ddpR(i * 5 + 1) - .5) * (40 + sp * 260) + Math.sin(t * 2 + i) * 6; if (Math.sin(t * 3 + i * 2.1) < .2) continue; ctx.fillStyle = 'rgba(210,220,255,' + (.25 - sp * .15) + ')'; ctx.fillRect(x, y, 8 + sp * 40, 1.4 + sp * 2); } ctx.restore(); }
}
function ddpUboat(x, y, s, t, o) { // Type VIIC, side view, facing +x; y = waterline
    o = o || {}; const dir = o.dir || 1, hz = o.haze || 0, C = function (c) { return ddpRGB(ddpMix(c, [28, 34, 48], hz)); }, roll = Math.sin(t * 1.1 + (o.seed || 0)) * .012;
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.4) * 2 * s); ctx.rotate(roll); ctx.scale(dir * s, s);
    // reflection
    if (!o.noRefl) { ctx.save(); ctx.globalAlpha = .18; ctx.scale(1, -.6); ctx.fillStyle = C([60, 66, 74]); ctx.fillRect(-250, -10, 500, 40); ctx.fillRect(-50, -10, 110, 110); ctx.restore(); }
    // hull above water
    const hg = ctx.createLinearGradient(0, -34, 0, 8); hg.addColorStop(0, C([128, 136, 142])); hg.addColorStop(.35, C([96, 104, 110])); hg.addColorStop(1, C([40, 46, 52])); ctx.fillStyle = hg;
    ctx.beginPath(); ctx.moveTo(-262, 6); ctx.lineTo(-236, -20); ctx.lineTo(210, -22); ctx.quadraticCurveTo(250, -26, 266, -34); ctx.lineTo(250, 8); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C([18, 22, 26]); ctx.lineWidth = 1.4; ctx.stroke();
    // saddle tank + limber holes + rust
    ctx.fillStyle = C([70, 78, 84]); ctx.beginPath(); ctx.moveTo(-130, -6); ctx.quadraticCurveTo(0, -12, 130, -6); ctx.lineTo(130, 6); ctx.lineTo(-130, 6); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.6)'; for (let i = -220; i < 200; i += 9) ctx.fillRect(i, -16, 5, 3);
    ctx.fillStyle = 'rgba(130,70,40,.35)'; for (let i = 0; i < 18; i++) { const rx = -230 + ddpR(i + 11) * 460; ctx.fillRect(rx, -18 + ddpR(i) * 6, 2, 12 + ddpR(i + 4) * 10); }
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-230, -21, 440, 1.6);
    // net cutter + stem
    ctx.strokeStyle = C([30, 34, 38]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(266, -34); ctx.lineTo(282, -44); ctx.stroke(); ctx.lineWidth = 1.4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(268 + i * 4, -36 - i * 2.4); ctx.lineTo(270 + i * 4, -31 - i * 2.4); ctx.stroke(); }
    // 88 mm deck gun
    ctx.fillStyle = C([60, 66, 72]); ctx.fillRect(98, -36, 16, 14); ctx.save(); ctx.translate(108, -38); ctx.rotate(-.06); ctx.fillStyle = C([40, 46, 52]); ctx.fillRect(-14, -6, 22, 10); ctx.fillRect(4, -3.4, 66, 4.6); ctx.fillRect(66, -4.4, 6, 6.6); ctx.restore();
    // conning tower
    const tg = ctx.createLinearGradient(-90, 0, 70, 0); tg.addColorStop(0, C([70, 78, 84])); tg.addColorStop(.6, C([128, 136, 142])); tg.addColorStop(1, C([88, 96, 102])); ctx.fillStyle = tg;
    ctx.beginPath(); ctx.moveTo(-58, -22); ctx.lineTo(-58, -70); ctx.lineTo(-92, -70); ctx.lineTo(-96, -62); ctx.lineTo(-96, -54); ctx.lineTo(-58, -54); ctx.moveTo(-58, -22); ctx.lineTo(56, -22); ctx.quadraticCurveTo(66, -50, 52, -88); ctx.lineTo(-56, -88); ctx.lineTo(-58, -22); ctx.fill(); ctx.strokeStyle = C([18, 22, 26]); ctx.stroke();
    ctx.fillStyle = C([40, 46, 52]); ctx.fillRect(-56, -92, 110, 5); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-52, -86, 100, 1.4);
    // Wintergarten rails + 20 mm flak
    ctx.strokeStyle = C([60, 66, 72]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-96, -62); ctx.lineTo(-96, -76); ctx.lineTo(-60, -76); for (let i = -94; i < -60; i += 6) { ctx.moveTo(i, -62); ctx.lineTo(i, -76); } ctx.stroke();
    ctx.fillStyle = C([30, 34, 38]); ctx.fillRect(-82, -80, 10, 12); ctx.save(); ctx.translate(-77, -80); ctx.rotate(-.7); ctx.fillRect(0, -1.4, 30, 2.8); ctx.restore();
    // periscopes, DF loop, mast
    ctx.fillStyle = C([30, 34, 38]); ctx.fillRect(-6, -150, 4, 62); ctx.fillRect(-22, -130, 3.4, 42); ctx.fillRect(-8, -154, 8, 6); ctx.strokeStyle = C([30, 34, 38]); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(34, -100, 8, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(34, -92); ctx.lineTo(34, -88); ctx.stroke();
    // jumping wires
    ctx.strokeStyle = 'rgba(180,186,190,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(282, -44); ctx.lineTo(-4, -150); ctx.lineTo(-250, -22); ctx.stroke();
    // emblem + bridge crew + lamp
    ctx.fillStyle = 'rgba(230,226,210,.75)'; ctx.beginPath(); ctx.moveTo(14, -66); ctx.lineTo(26, -66); ctx.lineTo(26, -56); ctx.quadraticCurveTo(20, -48, 14, -56); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(40,30,20,.8)'; ctx.beginPath(); ctx.arc(20, -59, 3, 0, 7); ctx.fill();
    if (o.crew !== false) [[-30, 0], [-10, 1], [14, 2]].forEach(function (q) { ctx.fillStyle = C([14, 16, 18]); ctx.beginPath(); ctx.arc(q[0], -98, 5.4, 0, 7); ctx.fill(); ctx.fillRect(q[0] - 5, -96, 10, 6); ctx.fillStyle = C([200, 196, 180]); ctx.fillRect(q[0] - 5, -104, 10, 2.4); });
    if (o.lights) { ddpFlashGlow(48, -84, 26, .5); ctx.fillStyle = '#ffe8b0'; ctx.fillRect(46, -86, 4, 3); }
    // waterline foam / bow wave
    ctx.strokeStyle = 'rgba(210,225,235,.45)'; ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = -262; i <= 262; i += 12) ctx.lineTo(i, 6 + Math.sin(t * 4 + i * .1) * 1.6); ctx.stroke();
    if (o.speed) { ctx.fillStyle = 'rgba(220,235,245,.55)'; for (let i = 0; i < 10; i++) { const k = (t * 1.6 + i / 10) % 1; ctx.beginPath(); ctx.ellipse(250 + k * 30, 2 - k * 10, 10 + k * 16, 4 + k * 4, 0, 0, 7); ctx.fill(); } }
    ctx.restore();
}
function ddpMGBSide(x, y, s, t, o) { // Fairmile D motor gunboat, side view, facing +x
    o = o || {}; const dir = o.dir || 1, sp = o.speed || 0, pitch = -sp * .03 + Math.sin(t * 2.2) * .012 * (1 + sp);
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.8) * 2 * s); ctx.rotate(pitch * dir); ctx.scale(dir * s, s);
    // hull: dazzle camouflage
    ctx.save(); ctx.beginPath(); ctx.moveTo(-170, 6); ctx.lineTo(-166, -24); ctx.lineTo(130, -26); ctx.quadraticCurveTo(170, -32, 186, -44); ctx.lineTo(150, 8); ctx.closePath(); ctx.clip();
    ctx.fillStyle = '#5e6c78'; ctx.fillRect(-200, -60, 400, 80); ctx.fillStyle = '#26323e'; [[-160, -20, -100, 6], [-60, -26, 10, 6], [60, -26, 140, 6]].forEach(function (q, i) { ctx.beginPath(); ctx.moveTo(q[0], q[3]); ctx.lineTo(q[0] + 30, q[1]); ctx.lineTo(q[2], q[1]); ctx.lineTo(q[2] - 30, q[3]); ctx.fill(); }); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-200, -4, 400, 12); ctx.restore();
    ctx.strokeStyle = '#1a2026'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-170, 6); ctx.lineTo(-166, -24); ctx.lineTo(130, -26); ctx.quadraticCurveTo(170, -32, 186, -44); ctx.lineTo(150, 8); ctx.stroke();
    // bridge, mast, guns
    ctx.fillStyle = '#4e5c66'; ctx.fillRect(-20, -48, 60, 22); ctx.fillStyle = '#ffd890'; ctx.fillRect(-14, -44, 10, 6); ctx.fillRect(2, -44, 10, 6); ctx.fillRect(18, -44, 10, 6); ctx.fillStyle = '#3a4650'; ctx.fillRect(-24, -52, 70, 5); ctx.fillStyle = 'rgba(170,190,230,.35)'; ctx.fillRect(-166, -25, 296, 1.6);
    ctx.strokeStyle = '#2a3036'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(8, -52); ctx.lineTo(4, -112); ctx.stroke(); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-10, -96); ctx.lineTo(20, -96); ctx.moveTo(4, -112); ctx.lineTo(-160, -26); ctx.moveTo(4, -112); ctx.lineTo(180, -42); ctx.stroke();
    ctx.fillStyle = '#4a5864'; ctx.fillRect(96, -38, 22, 12); ctx.fillStyle = '#2a3036'; ctx.fillRect(110, -36, 44, 4); ctx.fillRect(110, -32, 44, 3);
    ctx.fillStyle = '#4a5864'; ctx.fillRect(-110, -36, 18, 10); ctx.save(); ctx.translate(-100, -36); ctx.rotate(-.4); ctx.fillStyle = '#2a3036'; ctx.fillRect(0, -2, 34, 2.4); ctx.fillRect(0, 2, 34, 2.4); ctx.restore();
    // ensign
    ctx.save(); ctx.translate(-166, -24); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-4, -40); ctx.stroke(); const wv = Math.sin(t * 6) * 3; ctx.fillStyle = '#b8b4ac'; ctx.beginPath(); ctx.moveTo(-4, -40); ctx.lineTo(-38, -38 + wv); ctx.lineTo(-38, -22 + wv); ctx.lineTo(-4, -24); ctx.fill(); ctx.fillStyle = '#b02a1c'; ctx.fillRect(-24, -40 + wv * .5, 4, 17); ctx.fillRect(-38, -33 + wv, 34, 3.4); ctx.fillStyle = '#1e2c6a'; ctx.fillRect(-14, -40, 10, 7); ctx.restore();
    // crew
    [[-4, 0], [16, 1], [-130, 2], [130, 3]].forEach(function (q) { ctx.fillStyle = '#121418'; ctx.beginPath(); ctx.arc(q[0], q[0] > 100 || q[0] < -100 ? -40 : -56, 5, 0, 7); ctx.fill(); });
    // spray + wake
    if (sp > 0) { ctx.fillStyle = 'rgba(225,238,245,.6)'; for (let i = 0; i < 18; i++) { const k = (t * 2.2 + i / 18) % 1; ctx.globalAlpha = (1 - k) * .7; ctx.beginPath(); ctx.ellipse(170 - k * 90 * sp, -10 - Math.sin(k * 3.1) * 40 * sp, 8 + k * 22, 4 + k * 8, -.4, 0, 7); ctx.fill(); } for (let i = 0; i < 14; i++) { const k = (t * 1.6 + i / 14) % 1; ctx.globalAlpha = (1 - k) * .55; ctx.beginPath(); ctx.ellipse(-170 - k * 300, 4 + k * 4, 20 + k * 40, 4 + k * 3, 0, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
    ctx.strokeStyle = 'rgba(210,225,235,.4)'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = -170; i <= 160; i += 10) ctx.lineTo(i, 6 + Math.sin(t * 5 + i * .1) * 1.5); ctx.stroke();
    ctx.restore();
}
function ddpFrogmanBust(x, y, s, t, o) { // the Sladen suit: one big twin-eyed face glass, rubber hood, breathing bag
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const rim = 'rgba(170,190,230,'; // moonlight from the right
    // shoulders + breathing bag
    ctx.fillStyle = '#121618'; ctx.beginPath(); ctx.moveTo(-240, 260); ctx.quadraticCurveTo(-220, 40, -60, 20); ctx.lineTo(60, 20); ctx.quadraticCurveTo(220, 40, 240, 260); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2a2e26'; ctx.beginPath(); ctx.ellipse(-10, 150, 110, 80, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 4; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-100, 150 + i * 30); ctx.quadraticCurveTo(-10, 170 + i * 30, 90, 150 + i * 30); ctx.stroke(); }
    ctx.strokeStyle = '#1a1e1a'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-50, 30); ctx.bezierCurveTo(-90, 70, -70, 110, -40, 120); ctx.moveTo(50, 30); ctx.bezierCurveTo(90, 70, 70, 110, 40, 120); ctx.stroke();
    // hood
    const hg = ctx.createRadialGradient(40, -120, 20, 0, -80, 190); hg.addColorStop(0, '#2e3434'); hg.addColorStop(1, '#0a0c0c'); ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(0, -80, 120, 140, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = rim + '.45)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0, -80, 120, 140, 0, -1.3, .9); ctx.stroke();
    // face plate with twin windows
    ctx.fillStyle = '#3a3a30'; ctx.beginPath(); ctx.ellipse(0, -70, 92, 64, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a8a70'; ctx.lineWidth = 4; ctx.stroke();
    [-38, 38].forEach(function (ex, i) { const gg = ctx.createRadialGradient(ex + 10, -84, 4, ex, -74, 40); gg.addColorStop(0, '#5a6a70'); gg.addColorStop(.5, '#1a2428'); gg.addColorStop(1, '#0a0e10'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(ex, -74, 34, 0, 7); ctx.fill(); ctx.strokeStyle = '#a8a888'; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = 'rgba(220,230,255,.55)'; ctx.beginPath(); ctx.ellipse(ex + 12, -90, 9, 5, -.6, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(230,200,170,.35)'; ctx.beginPath(); ctx.arc(ex + (i ? -4 : 4), -70, 6, 0, 7); ctx.fill(); });
    m8Disc(ctx, 0, -30, 12, '#2a2a20', '#8a8a6a');
    // limpet in the hands
    if (o.limpet) { ctx.save(); ctx.translate(-150, 150 + Math.sin(t * 1.4) * 4); ctx.rotate(-.2); ctx.fillStyle = '#2a2a1e'; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-70, -40, 140, 80, 12); else ctx.rect(-70, -40, 140, 80); ctx.fill(); ctx.fillStyle = '#4a4a34'; ctx.fillRect(-60, -30, 120, 10); [-50, 50].forEach(function (mx) { m8Disc(ctx, mx, 34, 14, '#3a3a3a', '#9a9a9a'); }); ctx.fillStyle = '#c8a040'; ctx.fillRect(-6, -52, 12, 14); ctx.fillStyle = 'rgba(230,220,180,.6)'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center'; ctx.fillText('LIMPET', 0, 6); ctx.restore(); ctx.fillStyle = '#121614'; ctx.beginPath(); ctx.ellipse(-110, 190, 50, 34, -.4, 0, 7); ctx.fill(); }
    ctx.restore();
}
function ddpKeroman(x, y, s, t, o) { // the bunker at a three-quarter angle, y = waterline
    o = o || {}; const blast = o.blast || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    // receding side face
    ctx.fillStyle = '#22262c'; ctx.beginPath(); ctx.moveTo(520, 0); ctx.lineTo(760, -60); ctx.lineTo(760, -330); ctx.lineTo(520, -380); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(520 + i * 30, -i * 7.5); ctx.lineTo(520 + i * 30, -380 + i * 6.2); ctx.lineTo(522 + i * 30, -380 + i * 6.2); ctx.lineTo(522 + i * 30, -i * 7.5); ctx.fill(); }
    // roof slab thickness + Fangrost beams
    ctx.fillStyle = '#5a5e64'; ctx.beginPath(); ctx.moveTo(-560, -380); ctx.lineTo(520, -380); ctx.lineTo(760, -330); ctx.lineTo(760, -360); ctx.lineTo(540, -420); ctx.lineTo(-540, -420); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#6e7278'; ctx.fillRect(-560, -420, 1080, 40); ctx.fillStyle = '#3e4248'; for (let i = -540; i < 520; i += 36) ctx.fillRect(i, -436, 18, 16);
    // front face
    const fg = ctx.createLinearGradient(0, -380, 0, 0); fg.addColorStop(0, '#4a4e54'); fg.addColorStop(1, '#2a2e34'); ctx.fillStyle = fg; ctx.fillRect(-560, -380, 1080, 380); ctx.fillStyle = 'rgba(0,0,0,.18)'; for (let i = -560; i < 520; i += 30) ctx.fillRect(i, -380, 2, 380); for (let i = 0; i < 40; i++) { ctx.fillStyle = 'rgba(120,80,50,.15)'; ctx.fillRect(-560 + ddpR(i) * 1080, -380, 3, 60 + ddpR(i + 3) * 120); }
    for (let b = 0; b < 4; b++) { const bx = -500 + b * 260, bw = 200; ctx.fillStyle = '#040608'; ctx.fillRect(bx, -250, bw, 250); const lg = ctx.createRadialGradient(bx + bw / 2, -220, 4, bx + bw / 2, -120, 220); lg.addColorStop(0, 'rgba(255,200,120,' + (.55 + blast * .4) + ')'); lg.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = lg; ctx.fillRect(bx, -250, bw, 250); for (let k = 0; k < 3; k++) { ctx.fillStyle = '#fff1c8'; ctx.fillRect(bx + 30 + k * 60, -244, 16, 4); }
        ctx.fillStyle = 'rgba(30,26,22,.9)'; ctx.fillRect(bx, -250, bw, 16); ctx.strokeStyle = 'rgba(60,56,50,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + 20, -234); ctx.lineTo(bx + 20, -150); ctx.moveTo(bx + bw - 20, -234); ctx.lineTo(bx + bw - 20, -150); ctx.stroke();
        if (o.subs && o.subs[b]) { ctx.save(); ctx.beginPath(); ctx.rect(bx, -250, bw, 250); ctx.clip(); ddpUboat(bx + bw / 2 - 40, 0, .36, t, { haze: .2, noRefl: 1, crew: false, lights: true }); ctx.restore(); } }
    ctx.fillStyle = 'rgba(230,220,190,.25)'; ctx.font = '700 46px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('KEROMAN III', -20, -300);
    // flak on the roof
    [[-420, 0], [120, 1], [420, 2]].forEach(function (q) { ctx.fillStyle = '#2a2e32'; ctx.fillRect(q[0] - 20, -452, 40, 16); ctx.save(); ctx.translate(q[0], -452); ctx.rotate(-.9 + Math.sin(t * .3 + q[1]) * .15); ctx.fillStyle = '#1a1e22'; ctx.fillRect(0, -3, 46, 3); ctx.fillRect(0, 2, 46, 3); ctx.restore(); });
    ctx.restore();
}
function ddpCanoeSide(x, y, s, t, paddle) { ctx.save(); ctx.translate(x, y + Math.sin(t * 1.6) * 3 * s); ctx.rotate(Math.sin(t * 1.3) * .02); ctx.scale(s, s);
    ctx.fillStyle = '#0c1014'; ctx.beginPath(); ctx.moveTo(-160, -6); ctx.quadraticCurveTo(0, 14, 160, -10); ctx.lineTo(150, 6); ctx.quadraticCurveTo(0, 22, -150, 6); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a3226'; ctx.beginPath(); ctx.moveTo(-160, -6); ctx.quadraticCurveTo(0, 6, 160, -10); ctx.lineTo(160, -6); ctx.quadraticCurveTo(0, 12, -160, -2); ctx.fill(); ctx.strokeStyle = 'rgba(170,190,230,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-150, -6); ctx.quadraticCurveTo(0, 6, 150, -9); ctx.stroke();
    [[-50, 0], [50, 1]].forEach(function (m) { const px = m[0], ph = t * 2.2 + m[1] * 1.2, a = Math.sin(ph); ctx.fillStyle = '#121618'; ctx.beginPath(); ctx.ellipse(px, -26, 16, 22, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(px + 2, -56, 11, 0, 7); ctx.fill(); ctx.fillStyle = '#0a0c0e'; ctx.beginPath(); ctx.ellipse(px + 2, -62, 13, 6, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = 'rgba(170,190,230,.3)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(px + 2, -56, 11, -1.2, .6); ctx.stroke(); if (paddle) { ctx.strokeStyle = '#1a1e1c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px - 40 * Math.cos(a * .6), -44 + a * 26); ctx.lineTo(px + 40 * Math.cos(a * .6), -10 - a * 26); ctx.stroke(); ctx.fillStyle = '#1a1e1c'; ctx.beginPath(); ctx.ellipse(px + 44 * Math.cos(a * .6), -6 - a * 28, 5, 12, a, 0, 7); ctx.fill(); } });
    ctx.restore(); }
