/* =====================================================
   MISSION 10 CUTSCENES — repaint: richer night sky, volumetric beams, layered coast,
   a detailed Fairmile D, the Cockle canoe, the Sladen-suited frogman, underwater light
===================================================== */
const DQ = {};
function dqPuff(rgb, soft) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(' + rgb + ',1)'); gr.addColorStop(soft || .45, 'rgba(' + rgb + ',.45)'); gr.addColorStop(1, 'rgba(' + rgb + ',0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; }
function dqEnsure() { if (DQ.ok) return DQ; DQ.mist = dqPuff('170,190,225'); DQ.moonlit = dqPuff('120,135,170', .3); DQ.ink = dqPuff('6,9,16', .5); DQ.teal = dqPuff('90,170,180'); DQ.amber = dqPuff('255,190,110'); DQ.ok = 1; return DQ; }
function dqLerp(a, b, k) { return a + (b - a) * k; }
/* ---------- sky ---------- */
function dqSky(hz, t, pan, o) {
    o = o || {}; const D = dqEnsure(), mx = (o.moonX === undefined ? 1240 : o.moonX) - pan * .02, my = o.moonY === undefined ? hz - 430 : o.moonY;
    const g = ctx.createLinearGradient(0, hz - 1000, 0, hz); g.addColorStop(0, '#03050c'); g.addColorStop(.45, '#0b1224'); g.addColorStop(.8, '#1a2238'); g.addColorStop(1, o.warm ? '#3a2a2c' : '#262c40'); ctx.fillStyle = g; ctx.fillRect(-300, hz - 1200, 2200, 1204);
    for (let i = 0; i < 260; i++) { const x = ((ddpR(i * 3) * 2200 - pan * .03) % 2200 + 2200) % 2200 - 300, y = hz - 40 - Math.pow(ddpR(i * 7), .8) * 1000, a = (.15 + .65 * ddpR(i + 1)) * (.7 + .3 * Math.sin(t * 1.7 + i)) * Math.min(1, Math.hypot(x - mx, y - my) / 300); ctx.fillStyle = 'rgba(225,230,255,' + a + ')'; ctx.fillRect(x, y, ddpR(i + 9) > .93 ? 2.2 : 1.3, ddpR(i + 9) > .93 ? 2.2 : 1.3); }
    // moon halo + disc
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55; ctx.drawImage(D.mist, mx - 420, my - 420, 840, 840); ctx.globalAlpha = .5; ctx.drawImage(D.mist, mx - 120, my - 120, 240, 240); ctx.restore();
    const mg = ctx.createRadialGradient(mx - 10, my - 12, 4, mx, my, 38); mg.addColorStop(0, '#fbfcff'); mg.addColorStop(.85, '#dfe4f4'); mg.addColorStop(1, '#b8c0d8'); ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, 38, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(150,158,190,.18)'; [[-12, -8, 9], [10, 10, 7], [6, -16, 5], [-4, 14, 4]].forEach(function (c) { ctx.beginPath(); ctx.arc(mx + c[0], my + c[1], c[2], 0, 7); ctx.fill(); });
    // cloud banks: dark bodies with moon-lit upper edges
    for (let L = 0; L < 3; L++) for (let i = 0; i < 9; i++) { const cx = ((ddpR(i * 5 + L * 31) * 2400 + t * (4 + L * 3) - pan * (.06 + L * .04)) % 2400 + 2400) % 2400 - 400, cy = hz - 120 - L * 150 - ddpR(i * 3 + L) * 120, w = 380 + ddpR(i + L * 7) * 420, h = w * .16, near = Math.max(0, 1 - Math.hypot(cx - mx, cy - my) / 900);
        ctx.globalAlpha = .62 - L * .12; ctx.drawImage(D.ink, cx - w / 2, cy - h / 2, w, h); ctx.drawImage(D.ink, cx - w * .35, cy - h * .8, w * .7, h * 1.1);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .1 + near * .3; ctx.drawImage(D.moonlit, cx - w * .4, cy - h * 1.05, w * .8, h * .55); ctx.restore(); }
    ctx.globalAlpha = 1;
}
/* ---------- volumetric searchlight ---------- */
function dqBeam(x, y, ang, len, half, a, t) {
    const D = dqEnsure(); ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, 0, len, 0); g.addColorStop(0, 'rgba(215,228,255,' + a + ')'); g.addColorStop(.6, 'rgba(190,205,240,' + a * .35 + ')'); g.addColorStop(1, 'rgba(180,200,240,0)'); ctx.fillStyle = g; const w = Math.tan(half) * len;
    ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(len, -w); ctx.lineTo(len, w); ctx.lineTo(0, 3); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = a * .7; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(len * .9, -w * .25); ctx.lineTo(len * .9, w * .25); ctx.lineTo(0, 1); ctx.fill();
    ctx.globalAlpha = a * .9; for (let i = 0; i < 10; i++) { const k = (i / 10 + t * .03) % 1, d = k * len * .85, r = 10 + d * Math.tan(half) * 1.6; ctx.drawImage(D.mist, d - r, -r * .5 + Math.sin(t + i) * r * .2, r * 2, r); }
    ctx.globalAlpha = 1; ctx.drawImage(D.mist, -30, -30, 60, 60); ctx.restore();
}
/* ---------- sea ---------- */
function dqSea(hz, bot, t, pan, o) {
    o = o || {}; const mx = o.moonX === undefined ? 1240 : o.moonX;
    const g = ctx.createLinearGradient(0, hz, 0, bot); g.addColorStop(0, '#3a4660'); g.addColorStop(.04, '#1c2838'); g.addColorStop(.35, '#0c1620'); g.addColorStop(1, '#03070a'); ctx.fillStyle = g; ctx.fillRect(-300, hz, 2200, bot - hz + 4);
    // swell bands in perspective
    for (let r = 0; r < 70; r++) { const k = r / 70, y = hz + Math.pow(k, 2.1) * (bot - hz), amp = 1 + k * 10, sp = .4 + k * 2; ctx.strokeStyle = 'rgba(' + (k < .1 ? '140,155,190' : '80,100,130') + ',' + (.05 + k * .12) + ')'; ctx.lineWidth = .6 + k * 2.6; ctx.beginPath(); for (let x = -300; x <= 1900; x += 24) { const yy = y + Math.sin(x * (.012 - k * .006) + t * sp + r * 1.7 - pan * .002 * (1 + k * 6)) * amp; x === -300 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
    // dark troughs
    for (let i = 0; i < 40; i++) { const k = ddpR(i * 3), y = hz + Math.pow(k, 1.8) * (bot - hz), w = 60 + k * 400, x = ((ddpR(i * 9) * 2200 + t * 10 * (1 + k) - pan * k) % 2200 + 2200) % 2200 - 300; ctx.fillStyle = 'rgba(0,4,8,' + (.12 + k * .25) + ')'; ctx.beginPath(); ctx.ellipse(x, y, w, 3 + k * 16, 0, 0, 7); ctx.fill(); }
    // moon path
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 220; i++) { const k = Math.pow(ddpR(i + 300), 1.5), y = hz + 2 + k * (bot - hz) * .9, spread = 20 + k * 380, x = mx + (ddpR(i * 5 + 1) - .5) * spread * 2 + Math.sin(t * 2.2 + i) * (4 + k * 10), on = Math.sin(t * 3.1 + i * 2.7); if (on < -.1) continue; ctx.fillStyle = 'rgba(205,215,250,' + (.35 - k * .25) * (.4 + on * .6) + ')'; ctx.fillRect(x, y, 6 + k * 50, 1 + k * 3); } ctx.restore();
    // horizon haze
    const hg = ctx.createLinearGradient(0, hz - 30, 0, hz + 40); hg.addColorStop(0, 'rgba(70,82,110,0)'); hg.addColorStop(.5, 'rgba(70,82,110,.35)'); hg.addColorStop(1, 'rgba(70,82,110,0)'); ctx.fillStyle = hg; ctx.fillRect(-300, hz - 30, 2200, 70);
}
/* ---------- the coast at Lorient ---------- */
function dqCoast(hz, t, pan, o) {
    o = o || {}; const lit = o.lit === undefined ? 1 : o.lit;
    // far hills
    ctx.fillStyle = '#141a28'; ctx.beginPath(); ctx.moveTo(-300, hz); for (let x = -300; x <= 1900; x += 20) ctx.lineTo(x, hz - 34 - Math.sin(x * .004 + 1) * 16 - Math.sin(x * .013) * 6); ctx.lineTo(1900, hz); ctx.fill();
    // town & harbour: cranes, the bunker roof, a lighthouse
    ctx.fillStyle = '#0b0f18'; ctx.beginPath(); ctx.moveTo(-300, hz + 1); for (let x = -300; x <= 1900; x += 14) { let h = 10 + ddpR(Math.floor(x / 14)) * 10; if (x > 380 && x < 1220) h += 8 + ddpR(Math.floor(x / 28) + 9) * 18; ctx.lineTo(x, hz - h); ctx.lineTo(x + 14, hz - h); } ctx.lineTo(1900, hz + 1); ctx.fill();
    ctx.fillRect(560, hz - 52, 300, 50); ctx.fillStyle = '#121824'; ctx.fillRect(560, hz - 58, 300, 7);
    [[470, 1], [920, -1], [1010, 1], [1150, -1]].forEach(function (c) { ctx.strokeStyle = '#0b0f18'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c[0], hz - 10); ctx.lineTo(c[0], hz - 90); ctx.lineTo(c[0] + c[1] * 70, hz - 104); ctx.moveTo(c[0], hz - 86); ctx.lineTo(c[0] - c[1] * 22, hz - 80); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(c[0] + c[1] * 66, hz - 102); ctx.lineTo(c[0] + c[1] * 66, hz - 60); ctx.stroke(); if (Math.floor(t * 1.5 + c[0]) % 3 === 0) { ctx.fillStyle = 'rgba(255,80,60,.9)'; ctx.fillRect(c[0] - 1, hz - 93, 3, 3); } });
    ctx.fillStyle = '#0b0f18'; ctx.fillRect(1460, hz - 120, 14, 118); ctx.fillRect(1454, hz - 128, 26, 10); const la = t * 1.2; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .25 + .2 * Math.max(0, Math.cos(la)); ctx.drawImage(dqEnsure().amber, 1467 - 30, hz - 154, 60, 60); ctx.restore();
    // window lights + their streaks on the water
    for (let i = 0; i < 46; i++) { const x = 300 + ddpR(i * 3) * 1100, y = hz - 6 - ddpR(i * 5) * 34, on = ddpR(i + 77) > .3; if (!on) continue; const a = (.55 + .35 * Math.sin(t * .7 + i)) * lit; ctx.fillStyle = 'rgba(255,196,120,' + a + ')'; ctx.fillRect(x, y, 2.4, 2.4); ctx.fillStyle = 'rgba(255,180,100,' + a * .16 + ')'; ctx.fillRect(x - 1, hz + 3, 4, 10 + ddpR(i) * 26); }
    // low sea mist along the shore
    const D = dqEnsure(); ctx.globalAlpha = .22; for (let i = 0; i < 14; i++) { const x = ((ddpR(i * 7) * 2200 + t * 6) % 2200) - 300; ctx.drawImage(D.mist, x - 220, hz - 30, 440, 50); } ctx.globalAlpha = 1;
}
/* ---------- Fairmile D motor gunboat, detailed side view (facing +x) ---------- */
function dqMGB(x, y, s, t, o) {
    o = o || {}; const dir = o.dir || 1, sp = o.speed || 0, pitch = -sp * .025 + Math.sin(t * 1.6) * .01 * (1 + sp), rim = o.rim === undefined ? 1 : o.rim;
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.3) * 2.4 * s); ctx.rotate(pitch * dir); ctx.scale(dir * s, s);
    // reflection
    ctx.save(); ctx.globalAlpha = .22; ctx.scale(1, -.5); ctx.fillStyle = '#4a5a6a'; ctx.fillRect(-180, -14, 360, 30); ctx.restore();
    const hull = function () { ctx.beginPath(); ctx.moveTo(-178, 8); ctx.lineTo(-180, -22); ctx.quadraticCurveTo(0, -20, 120, -26); ctx.quadraticCurveTo(170, -32, 194, -48); ctx.quadraticCurveTo(178, -12, 152, 9); ctx.closePath(); };
    ctx.save(); hull(); ctx.clip();
    const hg = ctx.createLinearGradient(0, -48, 0, 10); hg.addColorStop(0, '#6a7884'); hg.addColorStop(.5, '#4a5864'); hg.addColorStop(1, '#1c242c'); ctx.fillStyle = hg; ctx.fillRect(-200, -60, 420, 80);
    ctx.fillStyle = 'rgba(24,34,48,.85)'; [[-170, -120], [-60, 10], [70, 150]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(q[0], 10); ctx.lineTo(q[0] + 34, -40); ctx.lineTo(q[1] + 20, -40); ctx.lineTo(q[1] - 14, 10); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(-200, -24, 420, 4); ctx.fillStyle = '#121820'; ctx.fillRect(-200, -9, 420, 3);
    ctx.fillStyle = 'rgba(0,0,0,.6)'; for (let i = -120; i < 120; i += 28) { ctx.beginPath(); ctx.arc(i, -14, 2.2, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-200, 0, 420, 12); ctx.restore();
    hull(); ctx.strokeStyle = '#0c1014'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.strokeStyle = 'rgba(190,205,240,' + .55 * rim + ')'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-180, -22); ctx.quadraticCurveTo(0, -20, 120, -26); ctx.quadraticCurveTo(170, -32, 194, -48); ctx.stroke();
    // guard rails
    ctx.strokeStyle = 'rgba(120,130,140,.6)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-176, -32); ctx.lineTo(120, -36); for (let i = -170; i < 120; i += 18) { ctx.moveTo(i, -22); ctx.lineTo(i, -32); } ctx.stroke();
    // bridge + wheelhouse with lit slits
    ctx.fillStyle = '#3e4c58'; ctx.beginPath(); ctx.moveTo(-34, -22); ctx.lineTo(-30, -58); ctx.lineTo(44, -60); ctx.lineTo(56, -22); ctx.fill(); ctx.fillStyle = '#56646e'; ctx.fillRect(-34, -64, 86, 7); ctx.fillStyle = '#1a222a'; ctx.fillRect(-24, -52, 64, 9); ctx.fillStyle = 'rgba(255,200,130,.75)'; [-18, -2, 14, 30].forEach(function (wx) { ctx.fillRect(wx, -50, 9, 4); });
    ctx.strokeStyle = 'rgba(190,205,240,' + .4 * rim + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-34, -64); ctx.lineTo(52, -64); ctx.lineTo(56, -22); ctx.stroke();
    // mast, yard, aerials, radar lantern
    ctx.strokeStyle = '#1c242c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, -64); ctx.lineTo(4, -142); ctx.stroke(); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-16, -120); ctx.lineTo(26, -122); ctx.stroke(); ctx.fillStyle = '#2a343e'; ctx.fillRect(-2, -152, 12, 12); ctx.strokeStyle = 'rgba(160,170,180,.35)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(4, -146); ctx.lineTo(-176, -34); ctx.moveTo(4, -146); ctx.lineTo(192, -50); ctx.stroke();
    // 2-pdr pom-pom forward with shield, twin Oerlikon aft, depth charges, Carley floats
    ctx.fillStyle = '#2a3440'; ctx.fillRect(90, -38, 26, 14); ctx.fillStyle = '#4a5864'; ctx.beginPath(); ctx.moveTo(88, -36); ctx.lineTo(96, -54); ctx.lineTo(118, -54); ctx.lineTo(122, -36); ctx.fill(); ctx.save(); ctx.translate(112, -46); ctx.rotate(-.12); ctx.fillStyle = '#1a222a'; ctx.fillRect(0, -2.4, 52, 4.8); ctx.fillRect(48, -3.4, 6, 6.8); ctx.restore();
    ctx.fillStyle = '#2a3440'; ctx.fillRect(-96, -36, 20, 12); ctx.save(); ctx.translate(-86, -38); ctx.rotate(-.55); ctx.fillStyle = '#1a222a'; ctx.fillRect(0, -3, 38, 2.4); ctx.fillRect(0, 1.4, 38, 2.4); ctx.restore();
    ctx.fillStyle = '#1e262e'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(-150 + i * 12, -27, 5, 6, 0, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#7a6a4a'; ctx.beginPath(); ctx.ellipse(-50, -27, 18, 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#5a4c34'; ctx.beginPath(); ctx.ellipse(-50, -27, 13, 3, 0, 0, 7); ctx.fill();
    // crew: helmets and duffel coats, gun layers at their weapons
    [[100, -40, 1], [124, -38, 0], [-90, -40, 1], [-6, -68, 0], [18, -68, 0], [-140, -36, 0]].forEach(function (q, i) { ctx.fillStyle = '#0e1216'; ctx.beginPath(); ctx.ellipse(q[0], q[1] + 6, 6, 9, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(q[0], q[1] - 4, 5, 0, 7); ctx.fill(); ctx.fillStyle = '#26303a'; ctx.beginPath(); ctx.ellipse(q[0], q[1] - 7, 8, 3, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(190,205,240,' + .35 * rim + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(q[0], q[1] - 6, 7, -1.3, .2); ctx.stroke(); });
    // white ensign
    ctx.save(); ctx.translate(-178, -22); ctx.strokeStyle = '#1a1e22'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-4, -44); ctx.stroke(); const wv = Math.sin(t * 5) * 3 * (1 + sp); ctx.fillStyle = '#a8aaa8'; ctx.beginPath(); ctx.moveTo(-4, -44); ctx.quadraticCurveTo(-22, -46 + wv, -40, -42 + wv); ctx.lineTo(-40, -26 + wv); ctx.quadraticCurveTo(-22, -30 + wv, -4, -28); ctx.fill(); ctx.fillStyle = '#7a2a22'; ctx.fillRect(-25, -44 + wv * .5, 4, 17); ctx.fillRect(-40, -37 + wv, 36, 3.4); ctx.fillStyle = '#1e2a54'; ctx.fillRect(-16, -44, 12, 8); ctx.restore();
    // waterline + spray
    ctx.strokeStyle = 'rgba(200,215,235,.45)'; ctx.lineWidth = 2.2; ctx.beginPath(); for (let i = -178; i <= 158; i += 8) ctx.lineTo(i, 7 + Math.sin(t * 4 + i * .09) * 1.6); ctx.stroke();
    if (sp > 0) { const P = ddpEnsure(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 24; i++) { const k = (t * 2.4 + i / 24) % 1; ctx.globalAlpha = (1 - k) * .22 * sp; const r = 8 + k * 26; ctx.drawImage(P.white, 180 - k * 120 - r, -12 - Math.sin(k * 3.1) * 50 * sp - r * .6, r * 2, r * 1.2); } for (let i = 0; i < 18; i++) { const k = (t * 1.8 + i / 18) % 1; ctx.globalAlpha = (1 - k) * .3 * sp; const r = 30 + k * 70; ctx.drawImage(P.white, -180 - k * 360 - r, 2 - r * .2, r * 2, r * .5); } ctx.restore(); }
    ctx.restore();
}
/* ---------- the Cockle Mk II canoe with two paddlers ---------- */
function dqCockle(x, y, s, t, o) {
    o = o || {}; ctx.save(); ctx.translate(x, y + Math.sin(t * 1.7) * 2.6 * s); ctx.rotate(Math.sin(t * 1.2) * .025); ctx.scale((o.dir || 1) * s, s);
    ctx.fillStyle = '#0c1014'; ctx.beginPath(); ctx.moveTo(-150, -4); ctx.quadraticCurveTo(0, 10, 150, -8); ctx.quadraticCurveTo(140, 8, 0, 14); ctx.quadraticCurveTo(-140, 10, -150, -4); ctx.fill();
    ctx.fillStyle = '#323a2c'; ctx.beginPath(); ctx.moveTo(-150, -4); ctx.quadraticCurveTo(0, 4, 150, -8); ctx.quadraticCurveTo(0, 0, -150, -4); ctx.fill(); ctx.strokeStyle = 'rgba(190,205,240,.45)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-148, -5); ctx.quadraticCurveTo(0, 3, 148, -9); ctx.stroke();
    [[-46, 0], [50, 1]].forEach(function (m) { const px = m[0], ph = t * 2.2 + m[1] * 1.3, a = Math.sin(ph), paddle = o.paddle !== false;
        ctx.fillStyle = '#121618'; ctx.beginPath(); ctx.moveTo(px - 16, -2); ctx.quadraticCurveTo(px - 18, -34, px - 2, -44); ctx.quadraticCurveTo(px + 16, -40, px + 16, -2); ctx.fill();
        ctx.beginPath(); ctx.arc(px + 2, -54, 10, 0, 7); ctx.fill(); ctx.fillStyle = '#1e2620'; ctx.beginPath(); ctx.ellipse(px + 2, -59, 12, 5, 0, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = 'rgba(190,205,240,.4)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(px + 2, -54, 10, -1.4, .4); ctx.moveTo(px + 15, -36); ctx.quadraticCurveTo(px + 17, -20, px + 16, -4); ctx.stroke();
        if (paddle) { const ang = a * .7, L = 48; ctx.strokeStyle = '#161a18'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(px - Math.cos(ang) * L, -34 - Math.sin(ang) * L * .5); ctx.lineTo(px + Math.cos(ang) * L, -34 + Math.sin(ang) * L * .5); ctx.stroke(); [-1, 1].forEach(function (e) { ctx.fillStyle = '#161a18'; ctx.beginPath(); ctx.ellipse(px + e * Math.cos(ang) * (L + 8), -34 + e * Math.sin(ang) * L * .5, 4, 11, ang + .3, 0, 7); ctx.fill(); }); ctx.strokeStyle = '#121618'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px, -36); ctx.lineTo(px + Math.cos(ang) * 16, -34 + Math.sin(ang) * 8); ctx.stroke(); }
        else { ctx.strokeStyle = '#121618'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px + 4, -36); ctx.lineTo(px + 22, -24); ctx.stroke(); } });
    ctx.strokeStyle = 'rgba(200,215,235,.4)'; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = -150; i <= 150; i += 10) ctx.lineTo(i, 9 + Math.sin(t * 4 + i * .1) * 1.2); ctx.stroke();
    ctx.restore();
}
/* ---------- soft out-of-focus harbour lights ---------- */
function dqBokeh(n, y0, y1, t, seed, a) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) { const r = 14 + ddpR(i * 7 + seed) * 46, x = ddpR(i * 3 + seed) * 1700 - 50 + Math.sin(t * .3 + i) * 6, y = y0 + ddpR(i * 5 + seed) * (y1 - y0), warm = ddpR(i + seed) > .35, c = warm ? '255,186,110' : '190,210,255', al = a * (.25 + ddpR(i * 11 + seed) * .5) * (.85 + .15 * Math.sin(t * 1.3 + i * 2));
        const g = ctx.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, 'rgba(' + c + ',' + al * .5 + ')'); g.addColorStop(.82, 'rgba(' + c + ',' + al * .7 + ')'); g.addColorStop(1, 'rgba(' + c + ',0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    ctx.restore();
}
/* ---------- the frogman, three-quarter medium close-up: Sladen suit, face glass, breathing bag ---------- */
function dqFrogman(x, y, s, t, o) {
    o = o || {}; const br = Math.sin(t * 1.4), turn = Math.sin(t * .35) * .04, wl = o.water === undefined ? 210 : o.water;
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.1) * 5); ctx.scale(s, s); ctx.rotate(turn);
    const rim = 'rgba(200,214,250,', suitG = function (y0, y1) { const g = ctx.createLinearGradient(-200, y0, 200, y1); g.addColorStop(0, '#07090b'); g.addColorStop(.55, '#151a1c'); g.addColorStop(1, '#2a3236'); return g; };
    // oxygen bottles over the left shoulder (screen right, catching the moon)
    ctx.fillStyle = '#1c2226'; ctx.save(); ctx.translate(150, 70); ctx.rotate(.25); ctx.fillRect(-18, -70, 36, 170); ctx.beginPath(); ctx.arc(0, -70, 18, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#3a4246'; ctx.fillRect(-6, -98, 12, 14); ctx.strokeStyle = rim + '.5)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(16, -70); ctx.lineTo(16, 100); ctx.stroke(); ctx.restore();
    // shoulders and suit
    ctx.fillStyle = suitG(60, 300); ctx.beginPath(); ctx.moveTo(-250, 330); ctx.quadraticCurveTo(-240, 150, -130, 110); ctx.quadraticCurveTo(-60, 86, 0, 92); ctx.quadraticCurveTo(80, 86, 150, 110); ctx.quadraticCurveTo(250, 150, 260, 330); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 3; [[-170, 160, -120, 260], [-80, 130, -60, 230], [110, 140, 140, 250], [190, 170, 210, 280]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[0] + 18, (q[1] + q[3]) / 2, q[2], q[3]); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(120,135,160,.18)'; ctx.lineWidth = 2; [[-160, 158, -112, 256], [118, 138, 148, 248]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(q[0] + 4, q[1]); ctx.quadraticCurveTo(q[0] + 24, (q[1] + q[3]) / 2, q[2] + 4, q[3]); ctx.stroke(); });
    ctx.strokeStyle = rim + '.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, 110); ctx.quadraticCurveTo(250, 150, 260, 300); ctx.stroke();
    // breathing bag on the chest, swelling with each breath
    const bg = 1 + br * .05; ctx.save(); ctx.translate(-10, 190); ctx.scale(bg, bg); const bgr = ctx.createRadialGradient(30, -30, 10, 0, 0, 120); bgr.addColorStop(0, '#4a4636'); bgr.addColorStop(.5, '#2a281e'); bgr.addColorStop(1, '#100f0a'); ctx.fillStyle = bgr; ctx.beginPath(); ctx.moveTo(-110, -60); ctx.quadraticCurveTo(0, -84, 110, -60); ctx.quadraticCurveTo(130, 20, 100, 70); ctx.quadraticCurveTo(0, 90, -100, 70); ctx.quadraticCurveTo(-130, 20, -110, -60); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(0, 14, 90, 0); ctx.moveTo(-60, 40); ctx.quadraticCurveTo(0, 50, 60, 40); ctx.stroke(); ctx.fillStyle = '#6a6250'; ctx.beginPath(); ctx.arc(70, -40, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1810'; ctx.beginPath(); ctx.arc(70, -40, 4, 0, 7); ctx.fill(); ctx.strokeStyle = rim + '.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, -76); ctx.quadraticCurveTo(110, -64, 122, 0); ctx.stroke(); ctx.restore();
    // harness webbing
    ctx.strokeStyle = '#3a3a2a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-120, 110); ctx.lineTo(-80, 320); ctx.moveTo(120, 110); ctx.lineTo(80, 320); ctx.stroke(); ctx.fillStyle = '#6a6a5a'; ctx.fillRect(-92, 230, 20, 14); ctx.fillRect(72, 230, 20, 14);
    // corrugated hoses from face glass to bag
    [[-34, 1], [34, -1]].forEach(function (h) { ctx.strokeStyle = '#121414'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(h[0], 60); ctx.bezierCurveTo(h[0] - h[1] * 60, 100, h[0] - h[1] * 50, 130, h[0] * 1.6, 135); ctx.stroke(); ctx.strokeStyle = 'rgba(160,170,190,.25)'; ctx.lineWidth = 2; for (let k = 0; k <= 1; k += .09) { const bx = (1 - k) ** 3 * h[0] + 3 * (1 - k) ** 2 * k * (h[0] - h[1] * 60) + 3 * (1 - k) * k * k * (h[0] - h[1] * 50) + k ** 3 * h[0] * 1.6, by = (1 - k) ** 3 * 60 + 3 * (1 - k) ** 2 * k * 100 + 3 * (1 - k) * k * k * 130 + k ** 3 * 135; ctx.beginPath(); ctx.arc(bx, by, 7, -2.2, -.6); ctx.stroke(); } });
    // the rubber hood
    const hg = ctx.createRadialGradient(60, -90, 20, 0, -20, 170); hg.addColorStop(0, '#2c3236'); hg.addColorStop(.6, '#121618'); hg.addColorStop(1, '#060708'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(-120, 70); ctx.bezierCurveTo(-150, -40, -110, -160, 0, -168); ctx.bezierCurveTo(110, -170, 150, -60, 128, 60); ctx.quadraticCurveTo(0, 104, -120, 70); ctx.fill();
    ctx.strokeStyle = rim + '.75)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -168); ctx.bezierCurveTo(110, -170, 150, -60, 128, 60); ctx.stroke(); ctx.strokeStyle = rim + '.25)'; ctx.lineWidth = 10; ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 2.5; [[-110, -60, -96, 30], [96, -100, 116, -10]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[0] - 8, (q[1] + q[3]) / 2, q[2], q[3]); ctx.stroke(); });
    // the face glass: bronze frame in three-quarter view
    ctx.save(); ctx.translate(-22, -36); ctx.transform(.84, .03, -.06, 1, 0, 0);
    const rr = function (w, h, r) { ctx.beginPath(); ctx.moveTo(-w + r, -h); ctx.lineTo(w - r, -h); ctx.quadraticCurveTo(w, -h, w, -h + r); ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h); ctx.lineTo(-w + r, h); ctx.quadraticCurveTo(-w, h, -w, h - r); ctx.lineTo(-w, -h + r); ctx.quadraticCurveTo(-w, -h, -w + r, -h); ctx.closePath(); };
    const fg = ctx.createLinearGradient(-100, -80, 100, 80); fg.addColorStop(0, '#2a2016'); fg.addColorStop(.4, '#6a5232'); fg.addColorStop(.6, '#a88a52'); fg.addColorStop(1, '#3a2c1a'); ctx.fillStyle = fg; rr(104, 80, 34); ctx.fill();
    ctx.fillStyle = '#1a140c'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, bx = Math.cos(a) * 92, by = Math.sin(a) * 68; ctx.beginPath(); ctx.arc(bx, by, 4.4, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,220,160,.5)'; ctx.beginPath(); ctx.arc(bx - 1, by - 1, 1.6, 0, 7); ctx.fill(); ctx.fillStyle = '#1a140c'; }
    // glass
    const gg = ctx.createLinearGradient(0, -66, 0, 66); gg.addColorStop(0, '#1c2638'); gg.addColorStop(.5, '#0a1018'); gg.addColorStop(1, '#05080c'); ctx.fillStyle = gg; rr(84, 62, 26); ctx.fill(); ctx.save(); rr(84, 62, 26); ctx.clip();
    // the man behind the glass: eyes catching the moon
    ctx.fillStyle = 'rgba(70,58,50,.55)'; ctx.beginPath(); ctx.ellipse(-4, 6, 60, 52, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(20,16,14,.8)'; [-28, 22].forEach(function (ex) { ctx.beginPath(); ctx.ellipse(ex, -8, 15, 8, 0, 0, 7); ctx.fill(); }); ctx.fillStyle = 'rgba(230,236,255,.85)'; [-24, 26].forEach(function (ex) { ctx.beginPath(); ctx.arc(ex, -10, 2.4, 0, 7); ctx.fill(); });
    ctx.strokeStyle = 'rgba(40,32,28,.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-2, -4); ctx.quadraticCurveTo(-8, 18, 4, 22); ctx.stroke(); ctx.fillStyle = '#1a1612'; ctx.beginPath(); ctx.ellipse(0, 40, 22, 10, 0, 0, 7); ctx.fill();
    // reflections on the glass: the moon, the searchlights, harbour lights
    ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createLinearGradient(20, -62, 80, 40); rg.addColorStop(0, 'rgba(210,225,255,.55)'); rg.addColorStop(.4, 'rgba(210,225,255,.12)'); rg.addColorStop(1, 'rgba(210,225,255,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(10, -62); ctx.quadraticCurveTo(70, -50, 84, 10); ctx.lineTo(84, -62); ctx.fill();
    ctx.fillStyle = 'rgba(230,240,255,.8)'; ctx.beginPath(); ctx.ellipse(52, -40, 9, 5, -.5, 0, 7); ctx.fill();
    for (let i = 0; i < 9; i++) { ctx.fillStyle = 'rgba(255,190,110,' + (.4 + .3 * Math.sin(t * 2 + i)) + ')'; ctx.fillRect(-70 + i * 14 + ddpR(i) * 6, 26 + ddpR(i + 3) * 8, 3, 2); }
    const sx = Math.sin(t * .6) * 60; ctx.fillStyle = 'rgba(200,215,255,.18)'; ctx.beginPath(); ctx.moveTo(sx - 10, -62); ctx.lineTo(sx + 14, -62); ctx.lineTo(sx - 30, 62); ctx.lineTo(sx - 52, 62); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // water droplets running down the glass
    for (let i = 0; i < 16; i++) { const dx = -76 + ddpR(i * 3) * 150, dy = -60 + ((ddpR(i * 7) * 130 + t * (6 + ddpR(i) * 22)) % 130), r = 2 + ddpR(i + 5) * 4; ctx.fillStyle = 'rgba(10,16,24,.6)'; ctx.beginPath(); ctx.arc(dx, dy, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(220,232,255,.75)'; ctx.beginPath(); ctx.arc(dx - r * .35, dy - r * .35, r * .35, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(200,215,240,.12)'; ctx.lineWidth = r * .8; ctx.beginPath(); ctx.moveTo(dx, dy - r); ctx.lineTo(dx, dy - r - 14); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,230,180,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-60, -80); ctx.lineTo(70, -80); ctx.quadraticCurveTo(104, -80, 104, -46); ctx.stroke();
    // mouthpiece valve under the glass
    ctx.fillStyle = '#5a4428'; ctx.fillRect(-30, 78, 60, 22); ctx.fillStyle = '#2a2014'; ctx.fillRect(-24, 84, 48, 10);
    ctx.restore();
    // waterline across the chest: the sea laps at him
    ctx.save(); ctx.beginPath(); ctx.moveTo(-900, wl); for (let i = -900; i <= 900; i += 10) ctx.lineTo(i, wl + Math.sin(t * 2.4 + i * .03) * 6 + Math.sin(t * 1.3 + i * .011) * 8); ctx.lineTo(900, 520); ctx.lineTo(-900, 520); ctx.closePath(); const wg = ctx.createLinearGradient(0, wl, 0, 420); wg.addColorStop(0, 'rgba(14,24,36,.55)'); wg.addColorStop(.3, 'rgba(8,14,22,.85)'); wg.addColorStop(1, 'rgba(4,8,12,.97)'); ctx.fillStyle = wg; ctx.fill(); ctx.clip();
    ctx.strokeStyle = 'rgba(190,210,250,.18)'; ctx.lineWidth = 2; for (let r = 0; r < 8; r++) { ctx.beginPath(); for (let i = -900; i <= 900; i += 14) ctx.lineTo(i, wl + 14 + r * 26 + Math.sin(t * 2 + i * .025 + r) * (4 + r)); ctx.stroke(); } ctx.restore();
    ctx.strokeStyle = 'rgba(225,235,255,.7)'; ctx.lineWidth = 2.6; ctx.beginPath(); for (let i = -260; i <= 270; i += 8) { const yy = wl + Math.sin(t * 2.4 + i * .03) * 6 + Math.sin(t * 1.3 + i * .011) * 8; i === -260 ? ctx.moveTo(i, yy) : ctx.lineTo(i, yy); } ctx.stroke();
    ctx.restore();
}
/* ---------- underwater: Snell's window, god rays, murk and marine snow ---------- */
function dqUnder(hv, t, o) {
    o = o || {}; const D = dqEnsure(), sy = o.surf === undefined ? 70 : o.surf, deep = o.deep || 0;
    const g = ctx.createLinearGradient(0, sy, 0, hv); g.addColorStop(0, deep ? '#1a3a44' : '#24505a'); g.addColorStop(.25, '#10303a'); g.addColorStop(.6, '#071a20'); g.addColorStop(1, '#02070a'); ctx.fillStyle = g; ctx.fillRect(-200, -200, 2000, hv + 400);
    // the underside of the surface
    if (sy > -60) { const sg = ctx.createLinearGradient(0, -200, 0, sy + 10); sg.addColorStop(0, '#3a6a74'); sg.addColorStop(1, '#1c4450'); ctx.fillStyle = sg; ctx.fillRect(-200, -200, 2000, sy + 200);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const wx = o.winX === undefined ? 900 : o.winX, wg = ctx.createRadialGradient(wx, sy - 30, 20, wx, sy - 30, 520); wg.addColorStop(0, 'rgba(170,215,230,.5)'); wg.addColorStop(.6, 'rgba(110,170,190,.18)'); wg.addColorStop(1, 'rgba(110,170,190,0)'); ctx.fillStyle = wg; ctx.fillRect(wx - 600, -200, 1200, sy + 230);
        for (let i = 0; i < 90; i++) { const x = (ddpR(i * 3) * 2000 + t * (8 + ddpR(i) * 10)) % 2000 - 200, y = sy - 4 - ddpR(i * 5) * (sy + 150), wd = 30 + ddpR(i + 1) * 90, near = Math.max(0, 1 - Math.abs(x - wx) / 700); ctx.strokeStyle = 'rgba(200,235,240,' + (.08 + near * .35) * (.6 + .4 * Math.sin(t * 2 + i)) + ')'; ctx.lineWidth = 1.4 + near * 1.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + wd / 2, y + 8 * Math.sin(t * 3 + i), x + wd, y); ctx.stroke(); } ctx.restore();
        ctx.strokeStyle = 'rgba(200,230,235,.4)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = -200; x <= 1800; x += 12) ctx.lineTo(x, sy + Math.sin(x * .02 + t * 2) * 4 + Math.sin(x * .007 - t) * 6); ctx.stroke(); }
    // god rays
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 12; i++) { const x = -100 + i * 160 + Math.sin(t * .4 + i * 1.7) * 50, w0 = 14 + ddpR(i) * 40, lean = 90 + ddpR(i * 3) * 120, a = (.07 + .07 * Math.sin(t * .9 + i * 2.3)) * (o.rays === undefined ? 1 : o.rays); const rg = ctx.createLinearGradient(0, sy, 0, hv * .95); rg.addColorStop(0, 'rgba(150,215,225,' + a + ')'); rg.addColorStop(1, 'rgba(150,215,225,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(x - w0, sy); ctx.lineTo(x + w0, sy); ctx.lineTo(x + lean + w0 * 3, hv * .95); ctx.lineTo(x + lean - w0 * 1.5, hv * .95); ctx.fill(); } ctx.restore();
    // murk banks
    ctx.globalAlpha = .18; for (let i = 0; i < 12; i++) { const x = (ddpR(i * 9) * 2000 + t * 5) % 2000 - 200, y = sy + 80 + ddpR(i * 4) * (hv - sy - 80); ctx.drawImage(D.teal, x - 300, y - 90, 600, 180); } ctx.globalAlpha = 1;
}
function dqSnow(hv, t, n, near) { // marine snow at three depths
    for (let i = 0; i < n; i++) { const L = i % 3, sp = (L + 1) * 6, x = ((ddpR(i) * 1800 + t * sp * .6 + Math.sin(t * .5 + i) * 8) % 1800 + 1800) % 1800 - 100, y = ((ddpR(i * 9) * (hv + 40) + t * sp * .8) % (hv + 40)) - 20, r = (.8 + L * 1.1) * (near && L === 2 && ddpR(i + 4) > .9 ? 3 : 1); ctx.fillStyle = 'rgba(190,220,215,' + (.12 + L * .1) + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
}
function dqSeabed(hv, y, t, o) {
    o = o || {}; const g = ctx.createLinearGradient(0, y - 40, 0, hv); g.addColorStop(0, '#16261e'); g.addColorStop(1, '#040806'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-200, hv + 10); for (let x = -200; x <= 1800; x += 30) ctx.lineTo(x, y + Math.sin(x * .009 + 1) * 22 + Math.sin(x * .031) * 6); ctx.lineTo(1800, hv + 10); ctx.fill();
    for (let i = 0; i < 26; i++) { const x = ddpR(i * 5 + 1) * 1700 - 50, yy = y + 10 + ddpR(i) * (hv - y); ctx.fillStyle = 'rgba(30,44,36,.9)'; ctx.beginPath(); ctx.ellipse(x, yy, 14 + ddpR(i + 2) * 30, 7 + ddpR(i + 3) * 10, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(120,160,150,.12)'; ctx.beginPath(); ctx.ellipse(x - 4, yy - 4, 10 + ddpR(i + 2) * 20, 3, 0, 0, 7); ctx.fill(); }
    for (let i = 0; i < (o.weed || 40); i++) { const x = ddpR(i * 7) * 1700 - 50, by = y + 6 + ddpR(i * 2) * 30, hgt = 60 + ddpR(i + 2) * 120, sw = Math.sin(t * .8 + i) * 16; ctx.strokeStyle = 'rgba(' + (40 + ddpR(i) * 20) + ',' + (70 + ddpR(i) * 30) + ',46,.85)'; ctx.lineWidth = 2 + ddpR(i + 9) * 3; ctx.beginPath(); ctx.moveTo(x, by); ctx.bezierCurveTo(x + 8, by - hgt * .3, x - 10 + sw * .5, by - hgt * .6, x + sw, by - hgt); ctx.stroke(); }
}
/* ---------- the anti-submarine net: interlocked steel grommets, in perspective ---------- */
function dqNet(hv, t, cut, hole) {
    const f = 700, camY = 260, cy = hv * .44, P = function (X, Y) { const Z = 900 + X * .6; return [800 + X * f / Z, cy + (Y - camY) * f / Z, Z]; }, H = hole || [-160, 330, 150];
    const cols = []; for (let X = 1300; X >= -1100; X -= 64) cols.push(X);
    cols.forEach(function (X) { for (let Y = 20; Y <= 640; Y += 64) { const p = P(X, Y + Math.sin(t * .6 + X * .004) * 4), fog = Math.min(1, (p[2] - 300) / 1300), d = Math.hypot(X - H[0], (Y - H[1]) * 1.2);
            if (d < H[2] * cut) continue; const r = 27 * f / p[2], lw = Math.max(1, 4.2 * f / p[2]); 
            ctx.strokeStyle = 'rgba(' + ddpMix([120, 128, 118], [22, 54, 62], fog).map(Math.round).join(',') + ',' + (.95 - fog * .55) + ')'; ctx.lineWidth = lw;
            const broken = d < H[2] * cut + 70 && cut > 0; ctx.beginPath(); if (broken) { const a0 = Math.atan2(Y - H[1], X - H[0]); ctx.ellipse(p[0], p[1], r * .78, r, 0, a0 - .6, a0 + Math.PI + .6); } else ctx.ellipse(p[0], p[1], r * .78, r, 0, 0, 7); ctx.stroke();
            if (!broken && fog < .5) { ctx.strokeStyle = 'rgba(170,215,215,' + (.35 - fog * .6) + ')'; ctx.lineWidth = lw * .4; ctx.beginPath(); ctx.ellipse(p[0], p[1], r * .78, r, 0, 3.6, 5.2); ctx.stroke(); }
            // grommet links to the next ring right and below
            if (!broken) { const pr = P(X + 32, Y), pd = P(X, Y + 32); ctx.strokeStyle = 'rgba(' + ddpMix([90, 96, 88], [22, 54, 62], fog).map(Math.round).join(',') + ',' + (.9 - fog * .5) + ')'; ctx.lineWidth = lw * .9; ctx.beginPath(); ctx.ellipse(pr[0], pr[1], r * .3, r * .16, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(pd[0], pd[1], r * .12, r * .3, 0, 0, 7); ctx.stroke(); } } });
    // weed and rust fronds hanging from the net
    for (let i = 0; i < 30; i++) { const X = -1000 + ddpR(i * 3) * 2200, Y = 40 + ddpR(i * 5) * 560, p = P(X, Y), fog = Math.min(1, (p[2] - 300) / 1300), L = (20 + ddpR(i) * 40) * 700 / p[2]; ctx.strokeStyle = 'rgba(50,80,50,' + (.7 - fog * .5) + ')'; ctx.lineWidth = Math.max(1, 3 * 700 / p[2]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(p[0] + Math.sin(t + i) * L * .3, p[1] + L * .5, p[0] + Math.sin(t * .8 + i) * L * .4, p[1] + L); ctx.stroke(); }
    // the floats and the jackstay at the surface
    const top = P(-1100, 0), topR = P(1300, 0); ctx.strokeStyle = 'rgba(20,30,30,.9)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(topR[0], topR[1]); ctx.stroke();
    for (let X = -1100; X <= 1300; X += 256) { const p = P(X, -10), r = 60 * f / p[2]; ctx.fillStyle = '#0a1616'; ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * .3, r * 1.2, r * .6, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(150,200,210,.3)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * .3, r * 1.2, r * .6, 0, 3.4, 6); ctx.stroke(); }
    return P(H[0], H[1]);
}
/* ---------- a swimming frogman, side view, facing +x, lit from the surface ---------- */
function dqDiver(x, y, s, t, o) {
    o = o || {}; const kick = Math.sin(t * (o.kick || 4)) * .35, top = 'rgba(130,200,210,';
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale((o.dir || 1) * s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const limb = function (pts, w) { ctx.strokeStyle = '#05090a'; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.strokeStyle = top + '.28)'; ctx.lineWidth = w * .25; ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1] - w * .38) : ctx.moveTo(p[0], p[1] - w * .38); }); ctx.stroke(); };
    // legs + fins
    [[1, kick], [-1, -kick]].forEach(function (L, i) { const k = L[1], kx = -150, ky = 6 + k * 30, fx = -230, fy = 4 + k * 70; limb([[-86, 4 + i * 6], [kx, ky], [fx, fy]], 26 - i * 3); ctx.fillStyle = i ? '#0a1010' : '#060a0a'; ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.atan2(fy - ky, fx - kx) + Math.PI + k * .6); ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(-60, -22, -110, -34); ctx.lineTo(-104, 34); ctx.quadraticCurveTo(-60, 22, 0, 10); ctx.fill(); ctx.strokeStyle = top + '.2)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(-60, -22, -110, -34); ctx.stroke(); ctx.restore(); });
    // torso
    const tg = ctx.createLinearGradient(0, -40, 0, 40); tg.addColorStop(0, '#2a4448'); tg.addColorStop(.35, '#0e1a1c'); tg.addColorStop(1, '#030607'); ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(-100, 0); ctx.bezierCurveTo(-96, -34, 10, -44, 64, -30); ctx.quadraticCurveTo(92, -20, 88, 6); ctx.quadraticCurveTo(70, 36, 0, 34); ctx.bezierCurveTo(-60, 32, -102, 26, -100, 0); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 2; [-60, -30, 4, 34].forEach(function (wx) { ctx.beginPath(); ctx.moveTo(wx, -34); ctx.quadraticCurveTo(wx + 6, 0, wx - 2, 30); ctx.stroke(); });
    ctx.fillStyle = '#26281e'; ctx.fillRect(-74, -8, 12, 40); ctx.fillStyle = '#5a5a4a'; ctx.fillRect(-72, 4, 8, 8);
    // oxygen bottle on the back, breathing bag under the chest
    ctx.fillStyle = '#16201e'; ctx.beginPath(); ctx.moveTo(-60, -34); ctx.lineTo(50, -46); ctx.quadraticCurveTo(62, -52, 58, -60); ctx.lineTo(-56, -50); ctx.quadraticCurveTo(-68, -44, -60, -34); ctx.fill(); ctx.strokeStyle = top + '.5)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-56, -51); ctx.lineTo(58, -60); ctx.stroke();
    ctx.fillStyle = '#2a281c'; ctx.beginPath(); ctx.ellipse(30, 30, 40, 16 + Math.sin(t * 1.4) * 2, .05, 0, 7); ctx.fill();
    // head + face glass
    ctx.fillStyle = '#060a0b'; ctx.beginPath(); ctx.ellipse(104, -14, 32, 28, -.2, 0, 7); ctx.fill(); ctx.strokeStyle = top + '.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(104, -14, 32, 28, -.2, -2.8, -.6); ctx.stroke();
    ctx.fillStyle = '#5a4428'; ctx.beginPath(); ctx.ellipse(126, -12, 11, 20, -.2, 0, 7); ctx.fill(); ctx.fillStyle = '#9ad0d4'; ctx.globalAlpha = .8; ctx.beginPath(); ctx.ellipse(128, -13, 7, 15, -.2, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(129, -22, 2.4, 0, 7); ctx.fill();
    ctx.strokeStyle = '#0a0e0e'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(118, 6); ctx.quadraticCurveTo(90, 30, 60, 30); ctx.stroke();
    // arms: one reaching forward with the cutters, one trailing
    const rc = o.reach || 0, cl = o.snip ? Math.abs(Math.sin(t * 10)) : .4; limb([[64, -6], [118 + rc * 30, 26 + rc * 10], [170 + rc * 60, 36 + rc * 6]], 18);
    ctx.save(); ctx.translate(170 + rc * 60, 36 + rc * 6); ctx.strokeStyle = '#7a7a6a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(54, -6 - cl * 10); ctx.moveTo(0, 4); ctx.lineTo(54, 6 + cl * 10); ctx.stroke(); ctx.fillStyle = '#9a9a8a'; ctx.beginPath(); ctx.moveTo(52, -8 - cl * 10); ctx.lineTo(78, -2); ctx.lineTo(52, -2 - cl * 6); ctx.fill(); ctx.beginPath(); ctx.moveTo(52, 8 + cl * 10); ctx.lineTo(78, 2); ctx.lineTo(52, 2 + cl * 6); ctx.fill(); ctx.restore();
    if (o.trail !== false) limb([[40, 10], [10, 40 + Math.sin(t * 2) * 6], [-30, 46]], 16);
    // a few escaping bubbles from the relief valve
    ctx.strokeStyle = 'rgba(200,235,240,.5)'; ctx.lineWidth = 1.2; for (let i = 0; i < 6; i++) { const k = (t * .5 + i / 6) % 1; ctx.beginPath(); ctx.arc(110 + Math.sin(k * 9 + i) * 8, -40 - k * 260, 2 + k * 5, 0, 7); ctx.stroke(); }
    ctx.restore();
}
/* ---------- U-boat seen from below, silhouetted against the surface light, moving +x ---------- */
function dqUboatBelow(x, y, s, t, o) {
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const L = 640;
    // shadow cone thrown down through the water
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; const shg = ctx.createLinearGradient(0, 0, 0, 900); shg.addColorStop(0, 'rgba(10,30,36,.75)'); shg.addColorStop(1, 'rgba(10,30,36,0)'); ctx.fillStyle = shg; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.lineTo(L + 300, 900); ctx.lineTo(-L + 200, 900); ctx.fill(); ctx.restore();
    // conning tower against the light
    ctx.fillStyle = '#081214'; ctx.beginPath(); ctx.moveTo(-60, -40); ctx.lineTo(-40, -150); ctx.lineTo(80, -150); ctx.quadraticCurveTo(110, -120, 120, -40); ctx.fill(); ctx.fillRect(10, -230, 6, 90); ctx.fillRect(40, -210, 5, 70); ctx.strokeStyle = 'rgba(150,215,220,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-40, -150); ctx.lineTo(80, -150); ctx.stroke();
    // hull, foreshortened from below: deck casing behind, pressure hull, saddle tanks
    const hg = ctx.createLinearGradient(0, -70, 0, 80); hg.addColorStop(0, '#1e3438'); hg.addColorStop(.25, '#0c1a1c'); hg.addColorStop(.7, '#050b0c'); hg.addColorStop(1, '#030607'); ctx.fillStyle = hg;
    ctx.beginPath(); ctx.moveTo(-L, -6); ctx.bezierCurveTo(-L * .6, -60, -L * .2, -70, 0, -70); ctx.bezierCurveTo(L * .5, -70, L * .8, -50, L + 40, -16); ctx.quadraticCurveTo(L + 30, 10, L * .8, 30); ctx.bezierCurveTo(L * .4, 70, -L * .4, 70, -L * .8, 30); ctx.quadraticCurveTo(-L - 10, 14, -L, -6); ctx.fill();
    ctx.strokeStyle = 'rgba(150,215,220,.55)'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(-L, -6); ctx.bezierCurveTo(-L * .6, -60, -L * .2, -70, 0, -70); ctx.bezierCurveTo(L * .5, -70, L * .8, -50, L + 40, -16); ctx.stroke();
    // saddle tank bulge
    ctx.fillStyle = 'rgba(30,54,58,.6)'; ctx.beginPath(); ctx.moveTo(-L * .45, 20); ctx.bezierCurveTo(-L * .2, 0, L * .3, 0, L * .5, 20); ctx.bezierCurveTo(L * .3, 50, -L * .2, 52, -L * .45, 20); ctx.fill(); ctx.strokeStyle = 'rgba(120,180,190,.22)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-L * .45, 20); ctx.bezierCurveTo(-L * .2, 0, L * .3, 0, L * .5, 20); ctx.stroke();
    // limber holes along the casing
    ctx.fillStyle = 'rgba(0,0,0,.8)'; for (let i = 0; i < 26; i++) { const k = -.8 + i * .062, xx = k * L, yy = -54 + Math.abs(k) * k * 18 + Math.abs(k) * 22; ctx.beginPath(); ctx.ellipse(xx, yy, 7, 2.6, 0, 0, 7); ctx.fill(); }
    // keel line, weld seams, a riveted strake
    ctx.strokeStyle = 'rgba(100,150,160,.18)'; ctx.lineWidth = 1.2; for (let i = 1; i < 10; i++) { const xx = -L * .8 + i * L * .17; ctx.beginPath(); ctx.moveTo(xx, -60 + Math.abs(xx / L) * 30); ctx.quadraticCurveTo(xx + 10, 0, xx, 50 - Math.abs(xx / L) * 20); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-L * .8, 30); ctx.bezierCurveTo(-L * .4, 66, L * .4, 66, L * .8, 30); ctx.stroke();
    // bow planes, stern planes, twin rudders
    ctx.fillStyle = '#060c0d'; ctx.beginPath(); ctx.moveTo(L * .82, 0); ctx.lineTo(L * .9, 44); ctx.lineTo(L * .98, 40); ctx.lineTo(L * .92, -4); ctx.fill(); ctx.beginPath(); ctx.moveTo(-L * .84, 6); ctx.lineTo(-L * .94, 56); ctx.lineTo(-L * 1.04, 50); ctx.lineTo(-L * .98, 0); ctx.fill(); [-1, 1].forEach(function (k) { ctx.fillRect(-L - 30, -2 + k * 22, 26, 6); });
    // twin screws turning, with cavitation boiling off the blades
    [-26, 22].forEach(function (py, i) { ctx.save(); ctx.translate(-L - 20, py); ctx.scale(.35, 1); ctx.rotate(t * 11 + i * 1.1); for (let b = 0; b < 3; b++) { ctx.rotate(2.094); ctx.fillStyle = '#0a1414'; ctx.beginPath(); ctx.ellipse(0, 22, 11, 24, 0, 0, 7); ctx.fill(); } ctx.fillStyle = '#1a2a2c'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill(); ctx.restore();
        for (let j = 0; j < 30; j++) { const k = (t * 1.2 + j / 30) % 1, bx = -L - 30 - k * 520, by = py + Math.sin(j * 2.3 + k * 8) * (6 + k * 50); ctx.strokeStyle = 'rgba(210,240,245,' + .5 * (1 - k) + ')'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(bx, by, 1.5 + k * 7 * ddpR(j + i), 0, 7); ctx.stroke(); } });
    // light catching the underside edge
    ctx.strokeStyle = 'rgba(90,150,160,.2)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-L * .8, 30); ctx.bezierCurveTo(-L * .4, 70, L * .4, 70, L * .8, 30); ctx.stroke();
    ctx.restore();
}
/* ---------- the Keroman pens: perspective block, Fangrost roof, lit bays, cranes, U-boats, flak ---------- */
const DQK_BAYS = [-400, -140, 120, 380];
function dqKeroman(cx, hz, s, t, o) {
    o = o || {}; const D = dqEnsure(), subs = o.subs || [1, 1, 0, 1], dmg = o.dmg || 0, lit = o.lit === undefined ? 1 : o.lit;
    ctx.save(); ctx.translate(cx, hz); ctx.scale(s, s);
    // receding side wall (left)
    ctx.fillStyle = '#121519'; ctx.beginPath(); ctx.moveTo(-560, 0); ctx.lineTo(-560, -380); ctx.lineTo(-820, -330); ctx.lineTo(-820, -6); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 6; i++) { ctx.fillRect(-800 + i * 42, -310 + i * 8, 4, 300 - i * 6); }
    // front face
    const fg = ctx.createLinearGradient(-560, -380, 520, 0); fg.addColorStop(0, '#2a2f36'); fg.addColorStop(.5, '#1d2127'); fg.addColorStop(1, '#14171b'); ctx.fillStyle = fg; ctx.fillRect(-560, -380, 1080, 380);
    // formwork strakes and rain staining
    ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = 1.4; for (let y = -360; y < 0; y += 24) { ctx.beginPath(); ctx.moveTo(-560, y); ctx.lineTo(520, y); ctx.stroke(); } for (let i = 0; i < 40; i++) { const sx = -550 + ddpR(i * 3) * 1060; ctx.fillStyle = 'rgba(10,12,14,' + (.08 + ddpR(i) * .14) + ')'; ctx.fillRect(sx, -380, 3 + ddpR(i + 1) * 10, 60 + ddpR(i + 2) * 240); }
    const shg = ctx.createLinearGradient(0, -380, 0, 0); shg.addColorStop(0, 'rgba(160,175,210,.08)'); shg.addColorStop(.4, 'rgba(0,0,0,0)'); shg.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = shg; ctx.fillRect(-560, -380, 1080, 380);
    // roof slab and the Fangrost beams standing on it
    ctx.fillStyle = '#343a42'; ctx.fillRect(-580, -420, 1120, 44); ctx.fillStyle = '#2a2e34'; ctx.fillRect(-580, -380, 1120, 6); ctx.fillStyle = '#22262c'; ctx.beginPath(); ctx.moveTo(-580, -420); ctx.lineTo(-840, -370); ctx.lineTo(-840, -330); ctx.lineTo(-580, -376); ctx.fill();
    for (let i = 0; i < 28; i++) { const bx = -570 + i * 40; ctx.fillStyle = '#2e3238'; ctx.fillRect(bx, -452, 20, 32); ctx.fillStyle = 'rgba(190,205,240,.25)'; ctx.fillRect(bx, -452, 20, 2); }
    ctx.strokeStyle = 'rgba(190,205,240,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-580, -420); ctx.lineTo(540, -420); ctx.stroke();
    // flak on the roof, a rangefinder, searchlight towers
    [[-380, 1], [300, -1]].forEach(function (f) { ctx.fillStyle = '#14181c'; ctx.fillRect(f[0] - 40, -480, 80, 28); ctx.save(); ctx.translate(f[0], -486); ctx.rotate(-.8 * f[1] + Math.sin(t * .5) * .1); ctx.fillRect(0, -3, 60, 3); ctx.fillRect(0, 4, 60, 3); ctx.restore(); for (let m = 0; m < 3; m++) { ctx.beginPath(); ctx.arc(f[0] - 28 + m * 26, -490, 6, 0, 7); ctx.fill(); ctx.fillRect(f[0] - 33 + m * 26, -486, 10, 14); } });
    ctx.fillStyle = '#14181c'; ctx.fillRect(-60, -500, 100, 48); ctx.fillRect(-90, -470, 160, 18);
    // the bays
    DQK_BAYS.forEach(function (bx, b) { const bw = 100, bh = 230;
        ctx.save(); ctx.beginPath(); ctx.rect(bx - bw, -bh, bw * 2, bh); ctx.clip();
        const ig = ctx.createLinearGradient(0, -bh, 0, 0); ig.addColorStop(0, dmg ? '#2a0e04' : '#2a1e10'); ig.addColorStop(.5, dmg ? '#6a2a0a' : '#8a6a3a'); ig.addColorStop(1, dmg ? '#3a1404' : '#5a4224'); ctx.fillStyle = ig; ctx.fillRect(bx - bw, -bh, bw * 2, bh);
        // perspective interior: the back wall and side walls
        ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.moveTo(bx - bw, -bh); ctx.lineTo(bx - 50, -bh + 50); ctx.lineTo(bx - 50, -40); ctx.lineTo(bx - bw, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(bx + bw, -bh); ctx.lineTo(bx + 50, -bh + 50); ctx.lineTo(bx + 50, -40); ctx.lineTo(bx + bw, 0); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(bx - 50, -bh + 50, 100, 10);
        // the travelling crane girder and its hook
        ctx.fillStyle = '#120c06'; ctx.fillRect(bx - bw, -bh + 22, bw * 2, 12); for (let k = -bw; k < bw; k += 14) { ctx.fillRect(bx + k, -bh + 22, 2, 12); } ctx.fillRect(bx - 20 + Math.sin(t * .2 + b) * 30, -bh + 34, 20, 12); ctx.fillRect(bx - 11 + Math.sin(t * .2 + b) * 30, -bh + 46, 2, 70);
        // hanging lamps
        if (!dmg) for (let l = -1; l <= 1; l++) { const lx = bx + l * 50, ly = -bh + 64; ctx.fillStyle = '#ffe4b0'; ctx.beginPath(); ctx.arc(lx, ly, 4, 0, 7); ctx.fill(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .45 * lit; ctx.drawImage(D.amber, lx - 40, ly - 30, 80, 70); ctx.restore(); }
        // a U-boat bow in the berth
        if (subs[b]) { ctx.fillStyle = '#0c0a08'; ctx.beginPath(); ctx.moveTo(bx - 80, -6); ctx.lineTo(bx - 70, -40); ctx.lineTo(bx + 40, -46); ctx.quadraticCurveTo(bx + 64, -30, bx + 80, -6); ctx.fill(); ctx.fillRect(bx - 30, -96, 48, 52); ctx.fillRect(bx - 10, -130, 4, 36); ctx.strokeStyle = 'rgba(255,200,130,.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx - 30, -96); ctx.lineTo(bx + 18, -96); ctx.lineTo(bx + 18, -44); ctx.stroke(); }
        // dockyard men on the quay
        for (let m = 0; m < 3; m++) { const mx = bx - 86 + m * 70 + Math.sin(t * .4 + m + b) * 6; ctx.fillStyle = '#0a0806'; ctx.fillRect(mx - 3, -34, 6, 14); ctx.beginPath(); ctx.arc(mx, -38, 3.5, 0, 7); ctx.fill(); }
        // welding arcs
        if (!dmg && (Math.floor(t * 9 + b * 3) % 5 < 2)) { const wx = bx - 20 + b * 7, wy = -70; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9; ctx.fillStyle = '#d8ecff'; ctx.beginPath(); ctx.arc(wx, wy, 3, 0, 7); ctx.fill(); ctx.globalAlpha = .5; ctx.drawImage(D.mist, wx - 50, wy - 50, 100, 100); for (let sp = 0; sp < 8; sp++) { const a = ddpR(sp + Math.floor(t * 30)) * 3.14, r = 8 + ddpR(sp * 3 + Math.floor(t * 30)) * 20; ctx.fillStyle = 'rgba(255,230,160,.9)'; ctx.fillRect(wx + Math.cos(a) * r, wy + Math.sin(a) * r * .4 + r * .5, 2, 2); } ctx.restore(); }
        if (dmg) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5 + .3 * Math.sin(t * 9 + b); ctx.drawImage(ddpEnsure().fire, bx - 90, -150, 180, 150); ctx.restore(); }
        // haze inside
        ctx.globalAlpha = .25; ctx.drawImage(D.amber, bx - 140, -bh, 280, bh * 1.2); ctx.globalAlpha = 1; ctx.restore();
        // the massive lintel and pillars
        ctx.fillStyle = '#2a3038'; ctx.fillRect(bx - bw - 6, -bh - 16, bw * 2 + 12, 16); ctx.strokeStyle = 'rgba(190,205,240,.25)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx - bw - 6, -bh - 16); ctx.lineTo(bx + bw + 6, -bh - 16); ctx.stroke();
        // light spilling onto the water + reflections
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let r = 0; r < 18; r++) { const ry = 4 + r * r * 1.4, rw = bw * (1.6 - r * .04) * (.8 + .2 * Math.sin(t * 2 + r + b)); ctx.fillStyle = 'rgba(' + (dmg ? '255,120,40,' : '255,190,110,') + (.32 - r * .016) * lit + ')'; ctx.fillRect(bx - rw / 2 + Math.sin(t * 3 + r) * 8, ry, rw, 2 + r * .2); } ctx.restore();
    });
    // number stencils between bays
    ctx.fillStyle = 'rgba(200,200,190,.35)'; ctx.font = '700 22px "Stardos Stencil", Impact, sans-serif'; ctx.textAlign = 'center'; ['K3', '1', '2', '3', '4'].forEach(function (n, i) { ctx.fillText(n, -530 + i * 260 + (i ? 0 : 30), -300); });
    // rim light on the top edge, mist at the base
    ctx.strokeStyle = 'rgba(190,205,240,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(520, -380); ctx.lineTo(520, 0); ctx.stroke();
    ctx.globalAlpha = .28; for (let i = 0; i < 10; i++) ctx.drawImage(D.mist, -900 + i * 160 + Math.sin(t * .3 + i) * 20, -70, 300, 90); ctx.globalAlpha = 1;
    ctx.restore();
}
/* ---------- harbour tug ---------- */
function dqTug(x, y, s, t, dir) {
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.5) * 2 * s); ctx.scale((dir || 1) * s, s);
    ctx.fillStyle = '#0c0e10'; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-96, -24); ctx.lineTo(80, -28); ctx.quadraticCurveTo(100, -30, 106, -40); ctx.quadraticCurveTo(100, -6, 80, 6); ctx.lineTo(-80, 6); ctx.fill(); ctx.fillStyle = '#16181c'; ctx.fillRect(-40, -60, 70, 34); ctx.fillRect(-10, -96, 24, 40); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(-12, -100, 28, 6);
    ctx.fillStyle = 'rgba(255,200,130,.8)'; ctx.fillRect(-30, -52, 8, 6); ctx.fillRect(-14, -52, 8, 6); ctx.fillStyle = 'rgba(255,80,60,.9)'; ctx.fillRect(28, -64, 4, 4); ctx.strokeStyle = 'rgba(190,205,240,.4)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-96, -24); ctx.lineTo(80, -28); ctx.stroke();
    const P = ddpEnsure(); for (let i = 0; i < 5; i++) { const k = (t * .3 + i / 5) % 1; ctx.globalAlpha = (1 - k) * .4; ctx.drawImage(P.smoke, -20 - k * 120, -130 - k * 120, 50 + k * 120, 50 + k * 120); } ctx.globalAlpha = 1;
    ctx.restore();
}
