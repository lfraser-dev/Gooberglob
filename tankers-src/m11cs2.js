/* =====================================================
   MISSION 11 CUTSCENES — repaint: a solid, lit Colditz; a deep courtyard; the train; the border at dawn
===================================================== */
// oblique box: front face (x..x+w, yb-h..yb), side face receding by (dx,dy) to the right
function dqWin(x, y, w, h, lit, t, k) { ctx.fillStyle = 'rgba(30,30,36,.9)'; ctx.fillRect(x - 2, y - 2, w + 4, h + 4); if (lit) { const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#ffd790'); g.addColorStop(1, '#e09040'); ctx.fillStyle = g; ctx.globalAlpha = .75 + .25 * Math.sin(t * 1.3 + k * 7); ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1; } else { ctx.fillStyle = '#1a1e28'; ctx.fillRect(x, y, w, h); ctx.fillStyle = 'rgba(160,180,220,.18)'; ctx.fillRect(x, y, w, h * .35); }
    ctx.fillStyle = 'rgba(20,18,16,.85)'; ctx.fillRect(x + w / 2 - .7, y, 1.4, h); ctx.fillRect(x, y + h * .45, w, 1.4); ctx.fillStyle = 'rgba(230,226,214,.5)'; ctx.fillRect(x - 3, y + h + 1, w + 6, 2.4); }
function dqBox(x, yb, w, h, dx, dy, o) {
    o = o || {}; const t = o.t || 0, seed = o.seed || 0, rh = o.roof || 80;
    // side face (moonlit, the moon is to the right)
    ctx.save(); ctx.beginPath(); ctx.moveTo(x + w, yb); ctx.lineTo(x + w + dx, yb + dy); ctx.lineTo(x + w + dx, yb - h + dy); ctx.lineTo(x + w, yb - h); ctx.closePath(); const sg = ctx.createLinearGradient(x + w, 0, x + w + dx, 0); sg.addColorStop(0, '#b8bccc'); sg.addColorStop(1, '#8a90a4'); ctx.fillStyle = sg; ctx.fill(); ctx.clip();
    ctx.transform(dx, dy, 0, 1, x + w, yb - h); const fl = Math.floor(h / 38); for (let r = 0; r < fl; r++) for (let c = 0; c < 3; c++) { const lit = m8R(seed * 7 + r * 13 + c) > .78; ctx.save(); ctx.fillStyle = lit ? 'rgba(255,200,120,.9)' : 'rgba(30,34,44,.9)'; ctx.fillRect(.15 + c * .28, 12 + r * 38, .12, 18); ctx.restore(); }
    ctx.restore();
    // front face (in shadow, cooler)
    const fg = ctx.createLinearGradient(0, yb - h, 0, yb); fg.addColorStop(0, '#6a7082'); fg.addColorStop(1, '#4a5062'); ctx.fillStyle = fg; ctx.fillRect(x, yb - h, w, h);
    ctx.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 30; i++) ctx.fillRect(x + m8R(seed + i) * w, yb - h + m8R(seed + i * 3) * h, 2 + m8R(i) * 4, 20 + m8R(i * 5) * 60); // weathering
    ctx.fillStyle = 'rgba(200,205,220,.18)'; for (let r = 1; r < Math.floor(h / 38); r++) ctx.fillRect(x, yb - h + r * 38 - 4, w, 2); // string courses
    ctx.fillStyle = 'rgba(230,230,240,.12)'; for (let yy = yb - h; yy < yb; yy += 16) { ctx.fillRect(x + w - 10, yy, 10, 8); } // quoins
    const fl2 = Math.floor(h / 38), cols = Math.max(1, Math.floor((w - 20) / 34)); for (let r = 0; r < fl2; r++) for (let c = 0; c < cols; c++) { const k = m8R(seed * 3 + r * 31 + c * 7), wx = x + 16 + c * ((w - 32) / Math.max(1, cols - 1 || 1)) - (cols === 1 ? -w / 2 + 22 : 0); dqWin(wx - 6, yb - h + 10 + r * 38, 12, 20, k > .72, t, k); }
    ctx.strokeStyle = 'rgba(210,215,235,.45)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x + w, yb); ctx.lineTo(x + w, yb - h); ctx.stroke();
    // roof: front slope, hipped end, ridge
    const ey = yb - h, rx0 = x - 8, rx1 = x + w + 8, r0 = [x + dx * .5, ey + dy * .5 - rh], r1 = [x + w + dx * .5, ey + dy * .5 - rh];
    ctx.beginPath(); ctx.moveTo(rx0, ey + 2); ctx.lineTo(rx1, ey + 2); ctx.lineTo(r1[0], r1[1]); ctx.lineTo(r0[0], r0[1]); ctx.closePath(); const rg = ctx.createLinearGradient(0, r0[1], 0, ey); rg.addColorStop(0, '#2e3240'); rg.addColorStop(1, '#1c1f28'); ctx.fillStyle = rg; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; for (let i = 0; i < 14; i++) { const k = i / 14; ctx.beginPath(); ctx.moveTo(rx0 + (r0[0] - rx0) * k, ey + (r0[1] - ey) * k); ctx.lineTo(rx1 + (r1[0] - rx1) * k, ey + (r1[1] - ey) * k); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.moveTo(rx1, ey + 2); ctx.lineTo(x + w + dx + 6, ey + dy + 2); ctx.lineTo(r1[0], r1[1]); ctx.closePath(); const hg = ctx.createLinearGradient(rx1, 0, x + w + dx, 0); hg.addColorStop(0, '#5a6074'); hg.addColorStop(1, '#3e4252'); ctx.fillStyle = hg; ctx.fill();
    ctx.strokeStyle = 'rgba(200,210,235,.55)'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(r0[0], r0[1]); ctx.lineTo(r1[0], r1[1]); ctx.lineTo(x + w + dx + 6, ey + dy + 2); ctx.stroke();
    // dormers + chimneys
    for (let d = 0; d < Math.floor(w / 60); d++) { const k = .45, dxp = x + 26 + d * 60, dyp = ey + (r0[1] - ey) * k; ctx.fillStyle = '#2a2e3a'; ctx.fillRect(dxp, dyp, 18, 16); ctx.beginPath(); ctx.moveTo(dxp - 3, dyp); ctx.lineTo(dxp + 9, dyp - 10); ctx.lineTo(dxp + 21, dyp); ctx.fill(); const lit = m8R(seed + d * 9) > .55; ctx.fillStyle = lit ? 'rgba(255,200,120,.9)' : '#10131a'; ctx.fillRect(dxp + 5, dyp + 4, 8, 9); }
    if (o.chim !== false) for (let c = 0; c < 2; c++) { const cx = x + w * (.25 + c * .5) + dx * .3, cy = ey + dy * .3 - rh * .8; ctx.fillStyle = '#3a3a40'; ctx.fillRect(cx, cy - 22, 12, 26); ctx.fillStyle = '#2a2a30'; ctx.fillRect(cx - 2, cy - 24, 16, 4); if (o.smoke) ddpSmoke(cx + 6, cy - 26, .35, t, seed + c, -30, 120, .5); }
}
function dqColditz(cx, base, s, t, o) {
    o = o || {}; ctx.save(); ctx.translate(cx, base); ctx.scale(s, s);
    // the rock: strata, ledges, scrub, retaining walls
    ctx.fillStyle = '#1a1a20'; ctx.beginPath(); ctx.moveTo(-780, 0); ctx.bezierCurveTo(-740, -90, -700, -150, -620, -200); ctx.lineTo(-540, -250); ctx.lineTo(560, -250); ctx.bezierCurveTo(640, -220, 700, -150, 760, -60); ctx.lineTo(800, 0); ctx.fill();
    for (let i = 0; i < 14; i++) { const y = -240 + i * 17; ctx.strokeStyle = 'rgba(' + (i % 2 ? '160,170,200,.12' : '0,0,0,.35') + ')'; ctx.lineWidth = 2 + (i % 3); ctx.beginPath(); ctx.moveTo(-620 + i * 6 - Math.sin(i) * 40, y); ctx.bezierCurveTo(-200, y + 10 + Math.sin(i * 2) * 8, 200, y - 6, 640 - i * 4, y + 4); ctx.stroke(); }
    for (let i = 0; i < 40; i++) { const x = -700 + m8R(i * 3) * 1420, y = -10 - m8R(i * 7) * 220; if (Math.abs(x) > 760 + y * .3) continue; ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(x, y, 20 + m8R(i) * 30, 6 + m8R(i + 1) * 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(180,190,220,.14)'; ctx.fillRect(x - 14, y - 7, 18 + m8R(i) * 20, 2); }
    for (let i = 0; i < 26; i++) { const x = -740 + m8R(i * 11) * 1500, y = -6 - m8R(i * 13) * 150, r = 10 + m8R(i) * 16; ctx.fillStyle = '#0e140f'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.arc(x + r * .8, y + 3, r * .8, 0, 7); ctx.arc(x - r * .7, y + 4, r * .7, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(160,190,200,.12)'; ctx.beginPath(); ctx.arc(x + r * .3, y - r * .4, r * .55, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#4a4e5a'; ctx.fillRect(-560, -266, 1120, 18); for (let x = -560; x < 560; x += 18) { ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x, -266, 1, 18); } ctx.fillStyle = 'rgba(200,210,235,.25)'; ctx.fillRect(-560, -266, 1120, 2);
    // wings, back to front
    const T = { t: t, smoke: true };
    dqBox(-520, -266, 300, 170, 70, -40, Object.assign({ seed: 1, roof: 70 }, T));
    dqBox(-190, -266, 360, 230, 90, -52, Object.assign({ seed: 2, roof: 100 }, T));
    dqBox(250, -266, 260, 190, 80, -46, Object.assign({ seed: 3, roof: 82 }, T));
    // the tower with its baroque cap
    const tx = 150, tw = 84, th = 330, yb = -266; dqBox(tx, yb, tw, th, 34, -20, { t: t, seed: 9, roof: 0, chim: false });
    const ty = yb - th, mx = tx + tw / 2 + 17; ctx.fillStyle = '#2a2e3a'; ctx.beginPath(); ctx.moveTo(tx - 6, ty); ctx.quadraticCurveTo(tx, ty - 46, mx, ty - 64); ctx.quadraticCurveTo(tx + tw + 40, ty - 46, tx + tw + 40, ty - 18); ctx.lineTo(tx + tw + 34, ty - 20); ctx.lineTo(tx + tw, ty); ctx.fill();
    ctx.strokeStyle = 'rgba(200,210,235,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, ty - 64); ctx.quadraticCurveTo(tx + tw + 40, ty - 46, tx + tw + 40, ty - 18); ctx.stroke();
    ctx.fillStyle = '#2a2e3a'; ctx.fillRect(mx - 13, ty - 96, 26, 34); ctx.fillStyle = 'rgba(255,200,120,.85)'; ctx.fillRect(mx - 7, ty - 90, 6, 18); ctx.fillRect(mx + 2, ty - 90, 6, 18);
    ctx.fillStyle = '#2a2e3a'; ctx.beginPath(); ctx.moveTo(mx - 17, ty - 94); ctx.quadraticCurveTo(mx - 20, ty - 120, mx, ty - 136); ctx.quadraticCurveTo(mx + 20, ty - 120, mx + 17, ty - 94); ctx.fill(); ctx.fillRect(mx - 1.5, ty - 172, 3, 40); ctx.beginPath(); ctx.arc(mx, ty - 150, 5, 0, 7); ctx.fill();
    ctx.fillStyle = '#e0dcd0'; ctx.beginPath(); ctx.arc(tx + tw / 2, ty + 46, 15, 0, 7); ctx.fill(); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx + tw / 2, ty + 46); ctx.lineTo(tx + tw / 2, ty + 36); ctx.moveTo(tx + tw / 2, ty + 46); ctx.lineTo(tx + tw / 2 + 8, ty + 46); ctx.stroke();
    // a gate tower + arch on the left
    dqBox(-640, -266, 110, 210, 40, -24, { t: t, seed: 5, roof: 90, chim: false });
    ctx.fillStyle = '#0c0e14'; ctx.beginPath(); ctx.moveTo(-615, -266); ctx.lineTo(-615, -310); ctx.quadraticCurveTo(-585, -340, -555, -310); ctx.lineTo(-555, -266); ctx.fill();
    // window glow bloom
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .18 * (o.lit === undefined ? 1 : o.lit); ctx.drawImage(dqEnsure().amber, -500, -560, 1000, 400); ctx.restore();
    ctx.restore();
}
function dqTownBelow(y, t, n, seed, lit) { // half-timbered houses stepping down to the river, a church spire
    for (let i = 0; i < n; i++) { const x = -200 + (i / n) * 2000 + m8R(seed + i * 3) * 40, w = 70 + m8R(seed + i) * 50, h = 50 + m8R(seed + i * 5) * 40, yy = y + 10 + m8R(seed + i * 7) * 40, dx = 16, dy = -10;
        ctx.fillStyle = '#20232c'; ctx.beginPath(); ctx.moveTo(x + w, yy); ctx.lineTo(x + w + dx, yy + dy); ctx.lineTo(x + w + dx, yy - h + dy); ctx.lineTo(x + w, yy - h); ctx.fill();
        const fg = ctx.createLinearGradient(0, yy - h, 0, yy); fg.addColorStop(0, '#3a3e4c'); fg.addColorStop(1, '#22252e'); ctx.fillStyle = fg; ctx.fillRect(x, yy - h, w, h + 80);
        ctx.strokeStyle = 'rgba(30,24,20,.75)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x, yy - h / 2); ctx.lineTo(x + w, yy - h / 2); for (let b = 0; b <= 3; b++) { ctx.moveTo(x + b * w / 3, yy - h); ctx.lineTo(x + b * w / 3, yy); } ctx.moveTo(x, yy - h); ctx.lineTo(x + w / 3, yy - h / 2); ctx.moveTo(x + w, yy - h); ctx.lineTo(x + w * 2 / 3, yy - h / 2); ctx.stroke();
        ctx.fillStyle = '#2a1e1c'; ctx.beginPath(); ctx.moveTo(x - 6, yy - h + 2); ctx.lineTo(x + w / 2 + dx / 2, yy - h - 40 + dy / 2); ctx.lineTo(x + w + dx + 4, yy - h + dy + 2); ctx.lineTo(x + w + 6, yy - h + 2); ctx.fill(); ctx.strokeStyle = 'rgba(200,210,235,.3)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + w / 2 + dx / 2, yy - h - 40 + dy / 2); ctx.lineTo(x + w + dx + 4, yy - h + dy + 2); ctx.stroke();
        for (let k = 0; k < 4; k++) { if (m8R(seed + i * 11 + k) > .45) { const wx = x + 8 + (k % 2) * (w / 2), wy = yy - h + 8 + Math.floor(k / 2) * h / 2; ctx.fillStyle = 'rgba(255,190,110,' + (.75 + .2 * Math.sin(t + i + k)) * (lit || 1) + ')'; ctx.fillRect(wx, wy, 10, 12); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,170,90,.06)'; ctx.beginPath(); ctx.arc(wx + 5, wy + 6, 26, 0, 7); ctx.fill(); ctx.restore(); } } }
    const sx = 1180, sy = y + 20; ctx.fillStyle = '#2a2e38'; ctx.fillRect(sx, sy - 160, 40, 170); ctx.beginPath(); ctx.moveTo(sx - 4, sy - 160); ctx.lineTo(sx + 20, sy - 260); ctx.lineTo(sx + 44, sy - 160); ctx.fill(); ctx.strokeStyle = 'rgba(200,210,235,.35)'; ctx.beginPath(); ctx.moveTo(sx + 20, sy - 260); ctx.lineTo(sx + 44, sy - 160); ctx.stroke(); ctx.fillStyle = 'rgba(255,190,110,.7)'; ctx.fillRect(sx + 15, sy - 130, 10, 18);
}
function ddpM11ShotA(t, hv) { // Colditz on its rock above the town and the Mulde
    const hz = hv * .8, z = 1 + t * .014; ctx.save(); ctx.translate(800, hz - 200); ctx.scale(z, z); ctx.translate(-800, -(hz - 200));
    dqSky(hz, t, t * 6, { moonX: 1330, moonY: hz - 600 });
    ctx.fillStyle = '#121725'; ctx.beginPath(); ctx.moveTo(-300, hz); for (let x = -300; x <= 1900; x += 30) ctx.lineTo(x, hz - 140 - Math.sin(x * .003 + 1) * 50 - Math.sin(x * .011) * 12); ctx.lineTo(1900, hz); ctx.fill();
    ctx.fillStyle = '#0e121c'; ctx.beginPath(); ctx.moveTo(-300, hz); for (let x = -300; x <= 1900; x += 24) ctx.lineTo(x, hz - 90 - Math.sin(x * .005 + 3) * 30); ctx.lineTo(1900, hz); ctx.fill();
    dqBeam(560, hz - 380, -Math.PI / 2 - .4 + Math.sin(t * .4) * .4, 900, .035, .2, t); dqBeam(1120, hz - 370, -Math.PI / 2 + .5 + Math.sin(t * .35 + 2) * .35, 900, .035, .17, t + 2);
    dqColditz(820, hz - 40, .72, t);
    ctx.globalAlpha = .4; for (let i = 0; i < 10; i++) ctx.drawImage(dqEnsure().mist, -200 + i * 200 + Math.sin(t * .2 + i) * 30, hz - 130, 420, 110); ctx.globalAlpha = 1;
    dqTownBelow(hz - 40, t, 18, 5);
    const rg = ctx.createLinearGradient(0, hz + 30, 0, hv + 60); rg.addColorStop(0, '#1e2840'); rg.addColorStop(1, '#05080e'); ctx.fillStyle = rg; ctx.fillRect(-300, hz + 30, 2200, hv);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 90; i++) { const x = ddpR(i * 3) * 1600, y = hz + 50 + ddpR(i * 5) * (hv - hz - 40); ctx.fillStyle = 'rgba(255,190,110,' + (.14 + .1 * Math.sin(t * 2 + i)) + ')'; ctx.fillRect(x + Math.sin(t + i) * 6, y, 14 + ddpR(i) * 40, 2); } for (let i = 0; i < 40; i++) { const y = hz + 50 + ddpR(i + 300) * (hv - hz - 40); ctx.fillStyle = 'rgba(200,215,250,.12)'; ctx.fillRect(1250 + (ddpR(i * 9) - .5) * 160 + Math.sin(t * 2 + i) * 8, y, 30, 2); } ctx.restore();
    ctx.fillStyle = '#10121a'; ctx.fillRect(-300, hz + 30, 2200, 14); for (let i = 0; i < 9; i++) { const x = 100 + i * 180; ctx.beginPath(); ctx.moveTo(x, hz + 44); ctx.quadraticCurveTo(x + 90, hz + 112, x + 180, hz + 44); ctx.lineTo(x + 180, hz + 54); ctx.quadraticCurveTo(x + 90, hz + 122, x, hz + 54); ctx.closePath(); ctx.fill(); ctx.fillRect(x - 8, hz + 44, 16, 120); } ctx.fillStyle = 'rgba(200,210,235,.25)'; ctx.fillRect(-300, hz + 30, 2200, 2);
    for (let i = 0; i < 12; i++) { const x = 60 + i * 140; ctx.fillStyle = '#0a0c12'; ctx.fillRect(x, hz + 6, 3, 26); ctx.fillStyle = '#ffe0a0'; ctx.fillRect(x - 2, hz + 4, 7, 5); }
    ctx.restore();
}
function ddpM11ShotB(u, hv) { // the Appell: a deep courtyard in one-point perspective
    const vx = 800 - u * 6, hz = hv * .5, fy = hv * .66; // floor meets the back wall at fy
    const sk = ctx.createLinearGradient(0, 0, 0, 120); sk.addColorStop(0, '#060a16'); sk.addColorStop(1, '#1a2238'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1900, 260);
    const bx0 = vx - 330, bx1 = vx + 330, by0 = 40; // back wall rectangle
    // floor
    const cg = ctx.createLinearGradient(0, fy, 0, hv); cg.addColorStop(0, '#3a3832'); cg.addColorStop(1, '#14130f'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(bx0, fy); ctx.lineTo(bx1, fy); ctx.lineTo(1900, hv + 10); ctx.lineTo(-300, hv + 10); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1.2; for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(vx + i * 24, fy); ctx.lineTo(vx + i * 160, hv + 10); ctx.stroke(); } for (let r = 0; r < 26; r++) { const k = Math.pow(r / 26, 1.8), y = fy + k * (hv - fy); ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(1900, y); ctx.stroke(); }
    // side walls
    const side = function (sgn) { const ex = sgn < 0 ? bx0 : bx1, ox = sgn < 0 ? -200 : 1800; ctx.beginPath(); ctx.moveTo(ex, by0); ctx.lineTo(ox, -260); ctx.lineTo(ox, hv + 220); ctx.lineTo(ex, fy); ctx.closePath(); const g = ctx.createLinearGradient(ox, 0, ex, 0); g.addColorStop(0, sgn < 0 ? '#2a2e3a' : '#4a5062'); g.addColorStop(1, sgn < 0 ? '#3e4352' : '#5e6476'); ctx.fillStyle = g; ctx.fill();
        for (let c = 0; c < 6; c++) { const k0 = c / 6, k1 = k0 + .07, pk = function (k) { return 1 - 1 / (1 + k * 4); }; const a = pk(k0) / pk(1), b = pk(k1) / pk(1); for (let r = 0; r < 5; r++) { const ya = function (k, frac) { const top = -260 + (by0 + 260) * k, bot = hv + 220 + (fy - hv - 220) * k; return top + (bot - top) * frac; }; const f0 = .1 + r * .15, f1 = f0 + .08, xa = ox + (ex - ox) * a, xb = ox + (ex - ox) * b, lit = m8R(c * 9 + r * 5 + (sgn > 0 ? 50 : 0)) > .7;
            ctx.beginPath(); ctx.moveTo(xa, ya(a, f0)); ctx.lineTo(xb, ya(b, f0)); ctx.lineTo(xb, ya(b, f1)); ctx.lineTo(xa, ya(a, f1)); ctx.closePath(); ctx.fillStyle = lit ? 'rgba(255,190,110,.85)' : 'rgba(18,20,28,.9)'; ctx.fill(); ctx.strokeStyle = 'rgba(210,210,220,.25)'; ctx.lineWidth = 1.5; ctx.stroke(); } } };
    side(-1); side(1);
    // back wall
    const bg = ctx.createLinearGradient(0, by0, 0, fy); bg.addColorStop(0, '#4a5060'); bg.addColorStop(1, '#6a6c70'); ctx.fillStyle = bg; ctx.fillRect(bx0, by0, bx1 - bx0, fy - by0);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) { const x = bx0 + 34 + c * 80, y = by0 + 22 + r * (fy - by0 - 120) / 5, k = m8R(r * 17 + c * 5 + 3); dqWin(x, y, 22, 34, k > .66, u, k); if (k > .86) { ctx.fillStyle = '#1a140e'; ctx.beginPath(); ctx.arc(x + 11, y + 16, 6, 0, 7); ctx.fill(); ctx.fillRect(x + 4, y + 22, 14, 12); } }
    ctx.fillStyle = '#2a1e14'; ctx.beginPath(); ctx.moveTo(vx - 50, fy); ctx.lineTo(vx - 50, fy - 90); ctx.quadraticCurveTo(vx, fy - 140, vx + 50, fy - 90); ctx.lineTo(vx + 50, fy); ctx.fill(); ctx.strokeStyle = '#7a7a78'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(vx - 56, fy); ctx.lineTo(vx - 56, fy - 90); ctx.quadraticCurveTo(vx, fy - 146, vx + 56, fy - 90); ctx.lineTo(vx + 56, fy); ctx.stroke();
    // lamps on the side walls throwing pools of light
    [[bx0 - 120, fy - 150], [bx1 + 120, fy - 150]].forEach(function (L) { ctx.fillStyle = '#1a1a1a'; ctx.fillRect(L[0] - 3, L[1] - 20, 6, 20); ctx.fillStyle = '#ffe4b0'; ctx.beginPath(); ctx.arc(L[0], L[1] + 4, 7, 0, 7); ctx.fill(); ddpFlashGlow(L[0], L[1] + 4, 260, .3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pg = ctx.createRadialGradient(L[0], fy + 60, 10, L[0], fy + 60, 260); pg.addColorStop(0, 'rgba(255,190,110,.22)'); pg.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(L[0], fy + 60, 260, 80, 0, 0, 7); ctx.fill(); ctx.restore(); });
    // the Hauptmann and guards in front of the back wall
    ddpMan(vx - 20, fy + 18, .62, u, { ger: true, run: 0, dir: 1 }); ddpMan(vx + 40, fy + 16, .6, u, { ger: true, run: 0, dir: -1 }); ddpMan(bx0 + 40, fy + 22, .64, u, { ger: true, run: 0, dir: 1 }); ddpMan(bx1 - 40, fy + 22, .64, u, { ger: true, run: 0, dir: -1 });
    ctx.fillStyle = '#d8d0b8'; ctx.fillRect(vx - 14, fy - 14, 9, 11);
    // the ranks, back to camera, receding
    for (let r = 5; r >= 0; r--) { const k = r / 6, y = fy + 30 + Math.pow(1 - k, 1.7) * (hv - fy + 40) - 40, s = .38 + (1 - k) * .75, n = 7 + r * 2, span = (bx1 - bx0) * (.9 + (1 - k) * 1.3); for (let i = 0; i < n; i++) dqPrisonerBack(vx - span / 2 + (i + .5) * span / n, y, s, u, i * 7 + r * 3); }
    // mist + window light
    ctx.globalAlpha = .2; for (let i = 0; i < 6; i++) ctx.drawImage(dqEnsure().mist, -100 + i * 320, fy - 60, 480, 140); ctx.globalAlpha = 1;
}
function ddpM11ShotD(u, hv) { // the park at night: the wire, a tower, the dog, the castle above
    const hz = hv * .5; dqSky(hz, u + 40, 0, { moonX: 1350, moonY: hz - 330 });
    ctx.save(); dqColditz(330, hz + 70, .55, u, { lit: .8 }); ctx.restore();
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#18241c'); gg.addColorStop(1, '#070a06'); ctx.fillStyle = gg; ctx.fillRect(-100, hz + 60, 1800, hv - hz);
    for (let i = 0; i < 200; i++) { const k = ddpR(i * 3), y = hz + 60 + Math.pow(k, 1.5) * (hv - hz - 60), x = ddpR(i * 7) * 1700 - 50; ctx.strokeStyle = 'rgba(80,110,60,' + (.2 + k * .35) + ')'; ctx.lineWidth = 1 + k * 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(u + i) * 3, y - 6 - k * 22); ctx.stroke(); }
    const tx = 1150, ty = hz + 70; ctx.fillStyle = '#100c08'; ctx.lineWidth = 6; ctx.strokeStyle = '#100c08'; ctx.beginPath(); ctx.moveTo(tx - 50, ty + 20); ctx.lineTo(tx - 22, ty - 200); ctx.moveTo(tx + 50, ty + 20); ctx.lineTo(tx + 22, ty - 200); ctx.moveTo(tx - 44, ty); ctx.lineTo(tx + 30, ty - 120); ctx.moveTo(tx + 44, ty); ctx.lineTo(tx - 30, ty - 120); ctx.moveTo(tx - 36, ty - 60); ctx.lineTo(tx + 36, ty - 60); ctx.stroke(); ctx.fillStyle = '#18120c'; ctx.fillRect(tx - 48, ty - 254, 96, 56); ctx.beginPath(); ctx.moveTo(tx - 60, ty - 252); ctx.lineTo(tx, ty - 296); ctx.lineTo(tx + 60, ty - 252); ctx.fill(); ctx.fillStyle = 'rgba(255,200,130,.55)'; ctx.fillRect(tx - 38, ty - 240, 76, 12); ctx.fillStyle = '#0a0806'; ctx.fillRect(tx - 10, ty - 240, 8, 12);
    const ba = Math.PI / 2 + .4 + Math.sin(u * .55) * .75; dqBeam(tx, ty - 226, ba, 1100, .06, .28, u);
    const lx = tx + Math.cos(ba) * 520, ly = Math.min(hv - 40, ty - 226 + Math.sin(ba) * 520); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .4; ctx.drawImage(dqEnsure().mist, lx - 280, ly - 70, 560, 140); ctx.restore();
    dqWireFence(u, [-60, hv + 20], [1500, hz + 60], 0, { h: 300 }); dqWireFence(u, [400, hv + 60], [1700, hz + 90], 0, { h: 200 });
    const hx = 1500 - u * 70; ddpMan(hx, hz + 160, .55, u, { ger: true, run: .5, dir: -1, haze: .3 }); ctx.save(); ctx.translate(hx - 40, hz + 160); ctx.scale(-.9, .9); ctx.fillStyle = '#1a140e'; ctx.beginPath(); ctx.ellipse(0, -14, 20, 8, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(20, -20, 8, 6, -.3, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(24, -26); ctx.lineTo(22, -34); ctx.lineTo(28, -26); ctx.fill(); const lg = Math.sin(u * 9) * 5; ctx.strokeStyle = '#1a140e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, -10); ctx.lineTo(-14 + lg, 0); ctx.moveTo(12, -10); ctx.lineTo(12 - lg, 0); ctx.moveTo(-18, -14); ctx.lineTo(-28, -18); ctx.stroke(); ctx.restore();
    ctx.globalAlpha = .3; for (let i = 0; i < 8; i++) ctx.drawImage(dqEnsure().mist, -200 + i * 260 + Math.sin(u * .3 + i) * 40, hv - 170, 500, 150); ctx.globalAlpha = 1;
}
/* ---------- ending ---------- */
function dqLoco(x, y, t) { // a German 01-class express engine, side view, facing right; y = rail
    ctx.save(); ctx.translate(x, y);
    // tender
    ctx.fillStyle = '#16181c'; ctx.fillRect(-250, -88, 150, 70); ctx.fillStyle = '#22252b'; ctx.fillRect(-252, -94, 154, 8); ctx.fillStyle = '#0a0a0a'; ctx.fillRect(-244, -104, 138, 12); for (let i = 0; i < 4; i++) m8Disc(ctx, -230 + i * 38, -12, 13, '#0a0a0a', '#3a3a3a');
    // boiler
    const bg = ctx.createLinearGradient(0, -110, 0, -40); bg.addColorStop(0, '#3a3e48'); bg.addColorStop(.35, '#22252c'); bg.addColorStop(1, '#0e0f12'); ctx.fillStyle = bg; m11RR(ctx, -60, -112, 250, 70, 34); ctx.fill(); ctx.fillStyle = 'rgba(200,210,235,.3)'; ctx.fillRect(-40, -108, 220, 3); ctx.fillStyle = '#2a2d34'; for (let i = 0; i < 5; i++) ctx.fillRect(-30 + i * 46, -112, 4, 70);
    ctx.fillStyle = '#c02020'; ctx.fillRect(-60, -42, 280, 10); // red running board / frame
    ctx.fillStyle = '#1c1e24'; ctx.fillRect(160, -116, 44, 76); m8Disc(ctx, 204, -78, 34, '#0e0f12', '#3a3e48'); ctx.fillStyle = '#d8d0b0'; ctx.beginPath(); ctx.arc(214, -78, 6, 0, 7); ctx.fill(); // smokebox
    ctx.fillStyle = '#16181c'; ctx.fillRect(170, -140, 22, 30); ctx.fillRect(166, -144, 30, 6); m11RR(ctx, 70, -132, 40, 24, 12); ctx.fill(); m11RR(ctx, 10, -128, 30, 18, 9); ctx.fill(); // chimney + domes
    ctx.fillStyle = '#1a1c22'; ctx.fillRect(170, -140, 46, 100); ctx.fillStyle = '#202228'; ctx.fillRect(196, -150, 4, 110); // smoke deflectors
    // cab with the firebox glow
    ctx.fillStyle = '#1a1c22'; ctx.fillRect(-100, -140, 46, 100); ctx.fillStyle = '#22252b'; ctx.fillRect(-106, -146, 58, 8); ctx.fillStyle = 'rgba(255,140,50,.85)'; ctx.fillRect(-92, -128, 22, 22); ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.arc(-80, -118, 6, 0, 7); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fg = ctx.createRadialGradient(-80, -60, 6, -80, -60, 140); fg.addColorStop(0, 'rgba(255,130,40,.55)'); fg.addColorStop(1, 'rgba(255,130,40,0)'); ctx.fillStyle = fg; ctx.fillRect(-220, -200, 280, 220); ctx.restore();
    // driving wheels + rods
    const ph = t * 9; [[-20, 30], [50, 30], [120, 30]].forEach(function (w) { ctx.save(); ctx.translate(w[0], -w[1] + 2); ctx.rotate(ph); m8Disc(ctx, 0, 0, w[1], '#0a0a0a', '#4a4a4a'); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 3; for (let s = 0; s < 8; s++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(s * .785) * w[1] * .9, Math.sin(s * .785) * w[1] * .9); ctx.stroke(); } ctx.fillStyle = '#c02020'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill(); ctx.restore(); });
    const cx = Math.cos(ph) * 18, cy = Math.sin(ph) * 18; ctx.strokeStyle = '#8a8e96'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-20 + cx, -28 + cy); ctx.lineTo(120 + cx, -28 + cy); ctx.moveTo(50 + cx, -28 + cy); ctx.lineTo(170, -34); ctx.stroke();
    [[175, 16], [205, 16]].forEach(function (w) { m8Disc(ctx, w[0], -14, w[1], '#0a0a0a', '#3a3a3a'); });
    ctx.fillStyle = '#ffe8b0'; ctx.beginPath(); ctx.arc(226, -60, 5, 0, 7); ctx.fill(); ddpFlashGlow(236, -60, 180, .5);
    ctx.restore(); }
function m11EShotA(t, hv) { // the night express over a viaduct, the valley below
    const hz = hv * .5; dqSky(hz + 80, t, t * 30, { moonX: 380, moonY: hz - 280 });
    ctx.fillStyle = '#121828'; ctx.beginPath(); ctx.moveTo(-300, hz + 80); for (let x = -300; x <= 1900; x += 30) ctx.lineTo(x, hz - 40 - Math.sin(x * .004 + t * .03) * 50); ctx.lineTo(1900, hz + 80); ctx.fill();
    ctx.fillStyle = '#0c1018'; ctx.beginPath(); ctx.moveTo(-300, hz + 120); for (let x = -300; x <= 1900; x += 20) ctx.lineTo(x, hz + 30 - Math.sin(x * .007 + 2) * 30); ctx.lineTo(1900, hz + 120); ctx.fill();
    for (let i = 0; i < 30; i++) { const x = ddpR(i * 3) * 1700 - 50, y = hz + 30 - ddpR(i) * 20; ctx.fillStyle = '#080c10'; ctx.beginPath(); ctx.moveTo(x - 10, y + 20); ctx.lineTo(x, y - 20 - ddpR(i * 5) * 20); ctx.lineTo(x + 10, y + 20); ctx.fill(); }
    // the river under the viaduct, with the moon in it
    const rg = ctx.createLinearGradient(0, hv * .82, 0, hv); rg.addColorStop(0, '#1a2438'); rg.addColorStop(1, '#070a10'); ctx.fillStyle = rg; ctx.fillRect(-100, hv * .82, 1800, hv * .2); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const y = hv * .83 + ddpR(i) * hv * .16; ctx.fillStyle = 'rgba(200,215,250,' + (.2 - (y - hv * .83) / hv) + ')'; ctx.fillRect(380 + (ddpR(i * 3) - .5) * 120 + Math.sin(t * 2 + i) * 6, y, 24 + ddpR(i) * 30, 2); } ctx.restore();
    // the viaduct: stone piers and arches
    const vy = hz + 120; const sg = ctx.createLinearGradient(0, vy, 0, hv); sg.addColorStop(0, '#3a3e4a'); sg.addColorStop(1, '#1a1c24'); ctx.fillStyle = sg; ctx.fillRect(-100, vy, 1800, 26);
    for (let i = 0; i < 9; i++) { const x = -80 + i * 210; ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(x, vy + 26); ctx.lineTo(x + 34, vy + 26); ctx.lineTo(x + 44, hv + 10); ctx.lineTo(x - 10, hv + 10); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 34, vy + 26); ctx.lineTo(x + 210, vy + 26); ctx.lineTo(x + 210, vy + 190); ctx.quadraticCurveTo(x + 122, vy - 10, x + 34, vy + 190); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(200,210,235,.22)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 34, vy + 190); ctx.quadraticCurveTo(x + 122, vy - 10, x + 210, vy + 190); ctx.stroke(); ctx.fillStyle = 'rgba(0,0,0,.2)'; for (let s = vy + 40; s < hv; s += 14) ctx.fillRect(x, s, 34, 1); }
    ctx.fillStyle = 'rgba(200,210,235,.3)'; ctx.fillRect(-100, vy, 1800, 2); ctx.fillStyle = '#2a2a30'; ctx.fillRect(-100, vy - 4, 1800, 4);
    // the carriages + the engine
    const tx = -250 + t * 250; for (let c = 0; c < 5; c++) { const x = tx - 360 - c * 236; ctx.fillStyle = '#1e2a22'; m11RR(ctx, x, vy - 74, 226, 64, 6); ctx.fill(); ctx.fillStyle = '#2a3a30'; ctx.fillRect(x, vy - 80, 226, 10); ctx.fillStyle = 'rgba(200,210,235,.25)'; ctx.fillRect(x, vy - 80, 226, 2); for (let wi = 0; wi < 7; wi++) { const wx = x + 12 + wi * 30; ctx.fillStyle = 'rgba(255,200,120,.9)'; ctx.fillRect(wx, vy - 62, 20, 22); if ((c * 7 + wi) % 5 === 2) { ctx.fillStyle = '#1a140e'; ctx.beginPath(); ctx.arc(wx + 10, vy - 48, 5, 0, 7); ctx.fill(); ctx.fillRect(wx + 4, vy - 44, 12, 6); } ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,190,110,.06)'; ctx.fillRect(wx - 6, vy - 10, 32, 60); ctx.restore(); } for (let wh = 0; wh < 2; wh++) { m8Disc(ctx, x + 30 + wh * 18, vy - 6, 8, '#0a0a0a', '#3a3a3a'); m8Disc(ctx, x + 180 + wh * 18, vy - 6, 8, '#0a0a0a', '#3a3a3a'); } }
    dqLoco(tx, vy - 4, t);
    ddpSmoke(tx + 181, vy - 150, 1.4, t, 3, -280, 260, 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const k = (t * 1.6 + i / 30) % 1; ctx.fillStyle = 'rgba(255,170,70,' + (1 - k) + ')'; ctx.fillRect(tx + 181 - k * 320 + Math.sin(i * 7) * 20 * k, vy - 150 - k * 140 + Math.cos(i * 3) * 30 * k, 2.4, 2.4); } ctx.restore();
}
function m11EShotB(u, hv) { // dawn: the Hegau hills, the Hohentwiel, the Swiss border post
    const hz = hv * .6, g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#20305a'); g.addColorStop(.45, '#8a5a70'); g.addColorStop(.8, '#f0a070'); g.addColorStop(1, '#ffd8a0'); ctx.fillStyle = g; ctx.fillRect(-100, -100, 1800, hz + 104);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.drawImage(dqEnsure().amber, 1000, hz - 300, 700, 420); ctx.restore();
    for (let i = 0; i < 9; i++) { const cx = ddpR(i * 3) * 1800 - 100 + u * 4, cy = 80 + ddpR(i * 5) * (hz - 260), w = 260 + ddpR(i) * 300; ctx.fillStyle = 'rgba(120,70,90,.5)'; ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, 18, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,190,150,.5)'; ctx.beginPath(); ctx.ellipse(cx + 10, cy + 8, w * .45, 6, 0, 0, 7); ctx.fill(); }
    // the Alps far off, snow catching the first light
    ctx.fillStyle = '#7a6a8a'; ctx.beginPath(); ctx.moveTo(-100, hz - 60); for (let x = -100; x <= 1700; x += 23) ctx.lineTo(x, hz - 120 - Math.abs(Math.sin(x * .0107 + Math.sin(x * .003))) * (60 + 50 * m8R(Math.floor(x / 23))) - Math.sin(x * .003) * 30); ctx.lineTo(1700, hz - 60); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,220,.7)'; for (let x = -100; x <= 1700; x += 23) { const y = hz - 120 - Math.abs(Math.sin(x * .0107 + Math.sin(x * .003))) * (60 + 50 * m8R(Math.floor(x / 23))) - Math.sin(x * .003) * 30; if (y < hz - 175) { ctx.beginPath(); ctx.moveTo(x - 12, y + 10 + m8R(x) * 8); ctx.lineTo(x, y); ctx.lineTo(x + 10, y + 12); ctx.fill(); } }
    // the Hohentwiel: a volcanic plug with a ruined fortress
    ctx.fillStyle = '#4a3a50'; ctx.beginPath(); ctx.moveTo(250, hz); ctx.quadraticCurveTo(380, hz - 60, 430, hz - 200); ctx.lineTo(520, hz - 210); ctx.quadraticCurveTo(570, hz - 70, 720, hz); ctx.fill(); ctx.fillStyle = '#3a2e40'; for (let i = 0; i < 6; i++) ctx.fillRect(430 + i * 15, hz - 228 - (i % 2) * 10, 10, 22 + (i % 2) * 10);
    // the lake glinting
    ctx.fillStyle = '#c08a7a'; ctx.fillRect(800, hz - 20, 900, 14); ctx.fillStyle = 'rgba(255,230,190,.6)'; for (let i = 0; i < 20; i++) ctx.fillRect(1200 + ddpR(i) * 300, hz - 18 + ddpR(i * 3) * 10, 20 + ddpR(i) * 30, 1.5);
    // forest edge
    ctx.fillStyle = '#2a2a30'; for (let i = 0; i < 60; i++) { const x = -100 + i * 32 + ddpR(i) * 10, h = 40 + ddpR(i * 3) * 50; ctx.beginPath(); ctx.moveTo(x - 14, hz + 2); ctx.lineTo(x, hz - h); ctx.lineTo(x + 14, hz + 2); ctx.fill(); }
    const mg = ctx.createLinearGradient(0, hz, 0, hv); mg.addColorStop(0, '#6a7a44'); mg.addColorStop(1, '#1e2814'); ctx.fillStyle = mg; ctx.fillRect(-100, hz, 1800, hv - hz + 10);
    ctx.globalAlpha = .5; for (let i = 0; i < 12; i++) ctx.drawImage(dqEnsure().mist, -200 + i * 180 + u * 12, hz - 30, 420, 100); ctx.globalAlpha = 1;
    // the border: wire on posts, a striped barrier, a sign, the Swiss flag
    ctx.strokeStyle = 'rgba(40,40,40,.8)'; ctx.lineWidth = 1.4; for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.moveTo(-100, hz + 60 + r * 12); ctx.lineTo(1080, hz + 60 + r * 12); ctx.moveTo(1150, hz + 62 + r * 12); ctx.lineTo(1700, hz + 60 + r * 12); ctx.stroke(); } for (let x = -80; x < 1700; x += 90) { if (x > 1060 && x < 1160) continue; ctx.fillStyle = '#2a2018'; ctx.fillRect(x, hz + 40, 5, 70); }
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(1196, hz + 10, 8, 110); for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#e8e0d0' : '#c02a20'; ctx.fillRect(1192, hz + 12 + i * 18, 16, 18); }
    ctx.fillStyle = '#c02a20'; const fw = Math.sin(u * 3) * 4; ctx.beginPath(); ctx.moveTo(1290, hz - 70); ctx.lineTo(1380, hz - 70 + fw); ctx.lineTo(1380, hz - 10 + fw); ctx.lineTo(1290, hz - 10); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(1328, hz - 60 + fw / 2, 14, 40); ctx.fillRect(1315, hz - 47 + fw / 2, 40, 14); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(1286, hz - 74, 4, 190);
    ctx.fillStyle = '#d8d0b8'; ctx.fillRect(960, hz + 20, 130, 36); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 2; ctx.strokeRect(960, hz + 20, 130, 36); ctx.fillStyle = '#2a2a2a'; ctx.font = '700 14px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('REICHSGRENZE', 1025, hz + 44); ctx.fillRect(1022, hz + 56, 5, 60);
    // dew-wet grass in the foreground, the man running for it
    const k = Math.min(1, u / 5.4), x = 380 + k * 880, y = hv * .92 - k * 170, s = 1.5 - k * .95; ddpMan(x, y, s, u, { run: 1, dir: 1, haze: .05 + k * .2, spd: 11 });
    for (let i = 0; i < 140; i++) { const gx = ddpR(i * 3) * 1700 - 50, gy = hz + 60 + Math.pow(ddpR(i * 7), .6) * (hv - hz - 60), hh = 8 + (gy - hz) * .08; ctx.strokeStyle = 'rgba(' + (40 + ddpR(i) * 30 | 0) + ',' + (60 + ddpR(i) * 30 | 0) + ',30,.8)'; ctx.lineWidth = 1 + (gy - hz) / 200; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + 2, gy - hh * .6, gx + Math.sin(u + i) * 4, gy - hh); ctx.stroke(); if (i % 5 === 0) { ctx.fillStyle = 'rgba(255,230,200,.7)'; ctx.fillRect(gx + Math.sin(u + i) * 4, gy - hh, 1.6, 1.6); } }
    for (let i = 0; i < 5; i++) { const bx = (u * 60 + i * 140) % 1800 - 100, by = 160 + Math.sin(u * 2 + i) * 20 + i * 14; ctx.strokeStyle = '#2a1e2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx - 8, by - 3 * Math.sin(u * 9 + i)); ctx.lineTo(bx, by); ctx.lineTo(bx + 8, by - 3 * Math.sin(u * 9 + i)); ctx.stroke(); }
}
