/* ================= SHOT D : the Sherman and the bunker ================= */
function ddpHillY(x, x0, x1, yTop, yBase, seed) { const u = cs2C((x - x0) / (x1 - x0), 0, 1), prof = Math.pow(Math.min(1, u * 1.25), .6); return yBase - (yBase - yTop) * prof + Math.sin(x * .03 + seed) * 5; }
function ddpTankPos(t) { // world distance travelled by the tank
    if (t < 23.9) return 55 * (t - 20.2); if (t < 24.3) { const d = t - 23.9; return 55 * 3.7 + 55 * d - 55 * d * d / .8; } if (t < 26.5) return 214.5; const d = t - 26.5; return 214.5 + 14 * d * d;
}
function ddpRuin(x, y, s, t, k) { // shattered pillbox, burning
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(30,22,14,.55)'; ctx.beginPath(); ctx.ellipse(0, 4, 150, 14, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#6e6a5c'; ctx.beginPath(); ctx.moveTo(-108, 0); ctx.lineTo(-100, -34); ctx.lineTo(-76, -30); ctx.lineTo(-60, -52); ctx.lineTo(-30, -38); ctx.lineTo(-8, -26); ctx.lineTo(20, -44); ctx.lineTo(54, -30); ctx.lineTo(78, -40); ctx.lineTo(112, -14); ctx.lineTo(124, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3c3a32'; ctx.beginPath(); ctx.moveTo(-60, -30); ctx.lineTo(-30, -38); ctx.lineTo(-8, -26); ctx.lineTo(20, -44); ctx.lineTo(54, -30); ctx.lineTo(40, -6); ctx.lineTo(-40, -6); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? '#5a574a' : '#7c786a'; ctx.fillRect(-130 + i * 30 + ddpR(i) * 10, -6 - ddpR(i + 3) * 8, 9 + ddpR(i + 5) * 10, 8 + ddpR(i + 7) * 7); }
    ctx.restore(); ddpFire(x - 10 * s, y - 20 * s, .55 * s, t, 8); ddpFire(x + 50 * s, y - 16 * s, .4 * s, t, 3);
}
function ddpShotD(t, hv) {
    const s = t - DD.cuts[2];
    if (t >= 24.62 && t < 26.5) return ddpBunkerCU(t, hv);
    const P = ddpEnsure(), hz = hv * .385, pos = ddpTankPos(t), gy = hv * .79, ts = 2.5;
    const fireT = 24.4, fk = t - fireT, fired = fk > 0 ? Math.pow(Math.max(0, 1 - fk / 1.2), 2) : 0, blast = fk > 0 && fk < .5 ? Math.pow(1 - fk / .5, 2) : 0;
    let sh = ddpShakeAt(t, .9 + blast * 14 + (t > 24.0 && t < 24.4 ? 1 : 0));
    const zoom = 1.04 + (t - 20.2) * .003 + blast * .03 + (t > 26.5 ? -(t - 26.5) * .01 : 0);
    ctx.save(); ctx.translate(800, hv * .62); ctx.rotate(Math.sin(t * .8) * .004 + blast * Math.sin(t * 50) * .004); ctx.scale(zoom, zoom); ctx.translate(-800 + sh[0], -hv * .62 + sh[1]);
    const sx = 360 - pos * .05;
    ddpSky(hz, t, pos * .2, sx, 1, .3);
    [[-100, 1.7], [330, 1.4], [820, 1.6], [1300, 1.2], [1760, 1.6]].forEach(function (p, i) { ddpSmoke(((p[0] - pos * .15) % 2400 + 2400) % 2400 - 400, hz + 10, p[1], t, i * 2.7, 70, 500, .85); });
    ddpSea(hz, hz + 96, t, sx, .8, .1);
    for (let i = 0; i < 8; i++) ddpShip(((i * 301 + 40 - pos * .08) % 2200 + 2200) % 2200 - 300, hz + 6, 80 + ddpR(i) * 70, 'dd', 0, .75, t);
    // hill + bunker (parallax .3)
    const hx0 = 880 - pos * .3, hx1 = 2800 - pos * .3, hyT = hz - 190, hyB = hz + 100;
    ddpHill(hx0, hx1, hyT, hyB, 7, .12, t);
    const bx = 1500 - pos * .3, by = ddpHillY(bx, hx0, hx1, hyT, hyB, 7) + 6, destroyed = t > 24.85;
    if (!destroyed) ddpBunker(bx, by, .85, t, { haze: .12, fire: t < 24.4 ? (t * 8) % 1 < .6 : false }); else { ddpRuin(bx, by, .85, t, 0); ddpSmoke(bx, by - 30, 1.7, t, 4, 40, 520, 1); }
    // beach
    const gg = ctx.createLinearGradient(0, hz + 92, 0, hv); gg.addColorStop(0, 'rgb(96,86,66)'); gg.addColorStop(.18, 'rgb(150,132,100)'); gg.addColorStop(1, 'rgb(108,92,68)'); ctx.fillStyle = gg; ctx.fillRect(-700, hz + 92, 3000, hv - hz);
    ctx.fillStyle = 'rgba(236,244,238,.5)'; ctx.fillRect(-700, hz + 94, 3000, 3);
    for (let i = 0; i < 70; i++) { const x = (((ddpR(i * 3) * 2600 - pos * (.8 + ddpR(i) * .3)) % 2600) + 2600) % 2600 - 500, y = hz + 110 + ddpR(i + 5) * (hv * .42); ctx.fillStyle = 'rgba(' + (ddpR(i) < .5 ? '60,48,32' : '190,170,130') + ',' + (.1 + ddpR(i + 1) * .16) + ')'; ctx.fillRect(x, y, 20 + ddpR(i + 2) * 50, 2 + ddpR(i + 8) * 3); }
    // wet sheen where the tank came ashore
    ctx.fillStyle = 'rgba(70,84,84,.35)'; ctx.fillRect(-700, hz + 100, 3000, 50);
    // scenery on the beach (parallax 1.0): hedgehogs, craters, wreck
    for (let i = 0; i < 10; i++) { const x = (((i * 360 + 140 - pos) % 3600) + 3600) % 3600 - 700, y = hz + 150 + ddpR(i * 4) * (hv * .22); if (i % 4 === 1) { ddpFire(x, y, .8, t, i); ddpSmoke(x, y, 1.1, t, i, 40, 400); ctx.save(); ctx.translate(x, y); ctx.rotate(.06); ctx.translate(-x, -y); ddpBoatSide(x, y + 6, 1.5, t, { troops: 0, speed: 0, haze: .1, seed: i }); ctx.restore(); } else ddpHedgehog(x, y, .8 + (y - hz - 150) / hv * 1.8, .1); }
    for (let i = 0; i < 6; i++) { const x = (((i * 520 + 60 - pos) % 3100) + 3100) % 3100 - 600, y = gy + 12 + ddpR(i) * 40; ctx.fillStyle = 'rgba(40,30,20,.5)'; ctx.beginPath(); ctx.ellipse(x, y, 60 + ddpR(i) * 40, 12, 0, 0, 7); ctx.fill(); }
    // distant explosions
    [[20.9, 700], [21.9, 300], [22.9, 1200], [23.5, 160], [26.7, 900], [27.3, 1400]].forEach(function (b, i) { ddpBlast(b[1], hz + 130 + (i % 3) * 14, .55, t - b[0], i * 5); });
    // wake of water + spray at the tank's tracks while it drains
    const tx = 600 + Math.max(0, t - 26.5) * 10, wet = cs2C(1 - (t - 20.2) / 4.5, 0, 1) * .9;
    // infantry in the stream
    const men = [[-470, 30, .8], [-340, 14, .9], [-230, 52, .85], [380, 22, .8], [520, 48, .85], [650, 8, .75], [-80, 112, 1.05], [300, 118, 1.0]];
    const advance = t > 26.5 ? (t - 26.5) * 60 : 0;
    const crew = men.map(function (m, i) { return { x: tx + m[0] + (m[0] > 0 ? advance * 1.4 : advance * .6) + Math.sin(t * 1.1 + i) * 8, y: gy + m[1] * 1.3, s: ts * m[2] * .96, i: i }; });
    const back = crew.filter(function (c) { return c.y <= gy + 40; }), front = crew.filter(function (c) { return c.y > gy + 40; });
    const mS = 1; function drawMen(a) { a.forEach(function (c) { const firing = t > 24.4 && t < 26.5 && c.i % 2, still = t > 24.0 && t < 26.6; ddpMan(c.x, c.y, c.s, t, { ph: c.i * 1.9, run: still ? (firing ? .15 : .5) : 1, aim: firing ? 1 : (c.i % 3 === 0 ? 1 : 0), crouch: still ? .6 : 0, haze: 0, spd: 9 }); ddpFoot(c.x, c.y, c.s * .6, t, c.i, false); }); }
    drawMen(back);
    // the Sherman
    const rock = fk > 0 ? Math.sin(fk * 18) * fired * 4 : 0, recoilX = fk > 0 ? -fired * 10 : 0;
    const gunA = t < 23.6 ? .02 : t < 24.4 ? .02 + cs2E((t - 23.6) / .8) * .05 : .07;
    ddpSherman(tx + recoilX, gy + rock * .2, ts, t, { gun: gunA, recoil: fk > 0 ? fired * 16 : 0, wet: wet, move: t < 24.3 || t > 26.5 ? 1 : 0, exhaust: true });
    drawMen(front);
    // bunker fire onto the tank, sparks
    if (t < 24.4) for (let i = 0; i < 5; i++) { const per = .55 + i * .07, k = ((t - 20.4 + i * .23) % per) / per; ddpTracer(bx + 34, by - 20, tx + 200 + ddpR(i) * 80, gy - 120 + ddpR(i + 3) * 60, k, .2, 2.6); if (k > .9) ddpFlashGlow(tx + 200 + ddpR(i) * 80, gy - 120 + ddpR(i + 3) * 60, 30, (1 - k) * 10); }
    // muzzle blast + shell
    const tipx = tx + recoilX + (40 + 104 * Math.cos(gunA)) * ts, tipy = gy - (76 + 104 * Math.sin(gunA)) * ts;
    if (fk > 0 && fk < .5) { const a = Math.pow(1 - fk / .5, 1.4); ddpFlashGlow(tipx, tipy, 260 * a + 30, a); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.fillStyle = 'rgba(255,238,190,1)'; ctx.beginPath(); ctx.moveTo(tipx, tipy - 14); ctx.lineTo(tipx + 230 * a, tipy - 4); ctx.lineTo(tipx + 330 * a, tipy); ctx.lineTo(tipx + 230 * a, tipy + 4); ctx.lineTo(tipx, tipy + 14); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (fk > 0 && fk < 3) { for (let i = 0; i < 10; i++) { const k = cs2C(fk / 3, 0, 1), r = (28 + k * 90 + i * 5) * 1.2, px = tipx + 30 + i * 22 * (1 + k * 1.5), py = tipy - k * 40 - i * 2; ctx.globalAlpha = (1 - k) * .55; ctx.drawImage(P.grey, px - r, py - r, r * 2, r * 2); } ctx.globalAlpha = 1; }
    if (fk > 0 && fk < 1.4) { for (let i = 0; i < 8; i++) { const k = cs2C(fk / 1.4, 0, 1), r = (30 + k * 120) * (1 - i * .06); ctx.globalAlpha = (1 - k) * .6; ctx.drawImage(P.dust, tx + 260 * ts / 2 * (.4 + i * .1) + k * 160 - r, gy - r * .3, r * 2, r * .8); } ctx.globalAlpha = 1; }
    if (fk > 0 && fk < .2) ddpTracer(tipx, tipy, bx, by - 30, fk / .2, .35, 4.5);
    ctx.restore();
    ddpLens(t, [20.9, 24.45], 1600, hv);
    return blast * .5;
}
function ddpBunkerCU(t, hv) {
    const P = ddpEnsure(), hz = hv * .3, k = t - 24.85, boom = k > 0, sh = ddpShakeAt(t, boom ? 16 * Math.pow(Math.max(0, 1 - k / 1.0), 2) + 1.4 : 1.4);
    const zoom = 1.04 + (boom ? Math.min(.07, k * .07) : (t - 24.62) * .05), bx = 900, bs = 2.5, by = hv * .76;
    ctx.save(); ctx.translate(800, hv * .55); ctx.rotate(boom ? Math.sin(k * 30) * Math.max(0, .01 - k * .008) : 0); ctx.scale(zoom, zoom); ctx.translate(-800 + sh[0], -hv * .55 + sh[1]);
    ddpSky(hz, t, 120, 300, 1, .4);
    [[160, 1.9], [700, 1.5], [1350, 2.1]].forEach(function (p, i) { ddpSmoke(p[0], hz + 30, p[1], t, i * 2.9, 70, 520, .9); });
    ctx.fillStyle = 'rgb(150,150,132)'; ctx.fillRect(-700, hz - 2, 2900, 260);
    // grassy slope
    const hg = ctx.createLinearGradient(0, hz, 0, hv + 100); hg.addColorStop(0, 'rgb(104,112,78)'); hg.addColorStop(.35, 'rgb(84,92,56)'); hg.addColorStop(1, 'rgb(70,64,42)'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(-600, hv + 200); ctx.lineTo(-600, hz + 80); for (let x = -600; x <= 2200; x += 40) ctx.lineTo(x, hz + 30 + Math.sin(x * .004 + 1) * 40 + Math.sin(x * .017) * 8); ctx.lineTo(2200, hv + 200); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 260; i++) { const x = -500 + ddpR(i * 3) * 2600, y = hz + 100 + ddpR(i + 7) * (hv - hz), sc = .4 + (y - hz) / hv; ctx.strokeStyle = 'rgba(' + (ddpR(i) < .5 ? '40,56,28' : '150,140,90') + ',' + (.18 + ddpR(i + 2) * .2) + ')'; ctx.lineWidth = 1.4 * sc; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (ddpR(i + 4) - .5) * 8, y - (6 + ddpR(i + 5) * 12) * sc); ctx.stroke(); }
    for (let i = 0; i < 6; i++) { const x = 80 + i * 300 + ddpR(i) * 80, y = hz + 150 + ddpR(i + 3) * 300; ctx.fillStyle = 'rgba(34,26,16,.45)'; ctx.beginPath(); ctx.ellipse(x, y, 60 + ddpR(i) * 50, 14 + ddpR(i + 1) * 8, 0, 0, 7); ctx.fill(); }
    // dirt apron + sandbags
    ctx.fillStyle = 'rgba(96,80,56,.8)'; ctx.beginPath(); ctx.ellipse(bx, by + 6, 360, 36, 0, 0, 7); ctx.fill();
    function bags(x0, y0, n, dir) { for (let r = 0; r < 3; r++) for (let i = 0; i < n - r; i++) { ctx.fillStyle = (i + r) % 2 ? '#8a7a56' : '#7c6e4c'; ctx.beginPath(); ctx.ellipse(x0 + dir * (i * 46 + r * 23), y0 - r * 20, 24, 11, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.stroke(); } }
    bags(bx - 330, by + 18, 5, 1); bags(bx + 330, by + 18, 5, -1);
    if (!boom) { ddpBunker(bx, by, bs, t, { fire: (t * 9) % 1 < .6 }); for (let i = 0; i < 4; i++) { const kk = (t * 7 + i * .31) % 1; ddpTracer(bx + 50 * bs, by - 34 * bs, 200 + i * 280, hv * 1.02, kk, .2, 3.4); } }
    else {
        const cx = bx + 6, cy = by - 40 * bs;
        if (k < .08) ddpBunker(bx, by, bs, t, {}); else ddpRuin(bx, by, bs, t, 0);
        const fb = Math.min(1, k / .35); if (k < 1.5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = (140 + fb * 380) * (1 - Math.max(0, k - .35) / 1.5 * .4); ctx.globalAlpha = Math.max(0, 1 - k / 1.3); ctx.drawImage(P.fire, cx - R, cy - R * .9, R * 2, R * 1.8); ctx.globalAlpha = Math.max(0, 1 - k / .3) * .8; ctx.drawImage(P.white, cx - R * .4, cy - R * .5, R * .8, R * .9); ctx.restore(); }
        ddpBlast(bx, by - 20, 3.0, k, 5, .55); ddpBlast(bx - 170, by - 10, 2.0, k - .08, 9, .5); ddpBlast(bx + 190, by - 10, 2.2, k - .14, 13, .5);
        if (k > 0 && k < .5) { ctx.strokeStyle = 'rgba(255,240,210,' + (.45 * (1 - k / .5)) + ')'; ctx.lineWidth = 14 * (1 - k / .5) + 2; ctx.beginPath(); ctx.ellipse(cx, cy + 50, 100 + k * 1400, 30 + k * 360, 0, 0, 7); ctx.stroke(); }
        for (let i = 0; i < 28; i++) { const a = (ddpR(i * 2.3) - .5) * 2.6, v = 300 + ddpR(i * 5.1) * 700, g = 980, px = cx + Math.sin(a) * v * k * 1.3, py = cy - Math.cos(a) * v * k * 1.4 + .5 * g * k * k; if (k > 0 && k < 2.6 && py < hv + 100) { ctx.save(); ctx.translate(px, py); ctx.rotate(k * (3 + ddpR(i) * 9) * (i % 2 ? 1 : -1)); ctx.fillStyle = i % 3 ? '#6a665a' : '#3a372f'; const sz = 10 + ddpR(i + 7) * 28; ctx.fillRect(-sz / 2, -sz / 3, sz, sz * .66); ctx.restore(); } }
        ddpSmoke(bx, by - 30, 3, t, 6, 40, 760, Math.min(1, k * 2));
    }
    if (t < 24.85) ddpTracer(-100, hz + 200, bx, by - 40 * bs, cs2C((t - 24.62) / .23, 0, 1), .5, 5);
    ctx.restore();
    ddpLens(t, [24.9, 25.3], 1600, hv);
    return boom ? Math.max(0, 1 - k / .5) * .7 : 0;
}
