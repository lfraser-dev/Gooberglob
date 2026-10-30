/* ---------- shared shore scenery ---------- */
function ddpHill(x0, x1, yTop, yBase, seed, haze, t) { // grassy rise with craters, wire and fire; right-side high ground
    const g = ctx.createLinearGradient(0, yTop, 0, yBase); g.addColorStop(0, ddpRGB(ddpMix([76, 88, 56], [160, 160, 140], haze))); g.addColorStop(.55, ddpRGB(ddpMix([92, 98, 62], [170, 166, 140], haze))); g.addColorStop(1, ddpRGB(ddpMix([150, 130, 92], [190, 176, 146], haze)));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, yBase);
    for (let x = x0; x <= x1; x += 24) { const u = (x - x0) / (x1 - x0), prof = Math.pow(Math.min(1, u * 1.25), .6); ctx.lineTo(x, yBase - (yBase - yTop) * prof + Math.sin(x * .03 + seed) * 5); }
    ctx.lineTo(x1, yBase); ctx.closePath(); ctx.fill();
    // grass tufts + crater scars
    for (let i = 0; i < 90; i++) { const u = ddpR(seed + i * 1.9), x = x0 + u * (x1 - x0), yy = yBase - (yBase - yTop) * Math.pow(Math.min(1, u * 1.25), .6) * (.1 + ddpR(seed + i) * .9); ctx.fillStyle = 'rgba(' + (ddpR(i) < .5 ? '40,56,30' : '120,110,70') + ',.28)'; ctx.fillRect(x, yy, 6 + ddpR(i + 3) * 14, 2 + ddpR(i + 5) * 3); }
    for (let i = 0; i < 9; i++) { const u = .1 + ddpR(seed + i * 4.1) * .85, x = x0 + u * (x1 - x0), yy = yBase - (yBase - yTop) * Math.pow(Math.min(1, u * 1.25), .6) * (.12 + ddpR(seed + i * 2) * .7); ctx.fillStyle = 'rgba(36,28,18,.4)'; ctx.beginPath(); ctx.ellipse(x, yy, 22 + ddpR(i) * 26, 6 + ddpR(i + 1) * 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(190,170,120,.25)'; ctx.fillRect(x - 20, yy - 6, 40, 1.5); }
}
function ddpBunker(x, y, s, t, o) { // concrete pillbox, front face, slit, gun flash
    o = o || {}; const haze = o.haze || 0, c = ddpRGB(ddpMix([118, 114, 100], [170, 168, 156], haze)), d = ddpRGB(ddpMix([66, 64, 56], [140, 140, 132], haze)), l = ddpRGB(ddpMix([170, 164, 140], [196, 194, 184], haze));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(10, 2, 128, 10, 0, 0, 7); ctx.fill();
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(-104, -52); ctx.lineTo(-84, -64); ctx.lineTo(96, -64); ctx.lineTo(116, -48); ctx.lineTo(124, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = l; ctx.fillRect(-84, -64, 180, 3); ctx.fillStyle = d; ctx.fillRect(-110, -6, 234, 6);
    ctx.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 12; i++) ctx.fillRect(-100 + i * 19, -60, 1.4, 54);
    ctx.fillStyle = '#080706'; ctx.fillRect(-52, -42, 104, 15); ctx.fillStyle = d; ctx.fillRect(-56, -44, 112, 3); ctx.fillRect(-56, -27, 112, 4);
    ctx.fillStyle = ddpRGB(ddpMix([70, 84, 52], [150, 156, 140], haze)); ctx.globalAlpha = .85; ctx.beginPath(); ctx.moveTo(-100, -62); for (let i = 0; i < 12; i++) ctx.lineTo(-100 + i * 19, -66 - ((i * 7) % 5) * 3); ctx.lineTo(112, -62); ctx.lineTo(100, -48); ctx.lineTo(-96, -48); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; // camo net
    ctx.restore();
    if (o.fire) { const fl = Math.random() < .6 ? 1 : .3; ddpFlashGlow(x + 56 * s, y - 34 * s, 46 * s * fl, .95 * fl); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,224,150,' + fl + ')'; ctx.fillRect(x - 40 * s, y - 36 * s, 96 * s, 5 * s); ctx.restore(); }
}
function ddpTracer(x0, y0, x1, y1, k, len, w) { // bright streak, k 0..1 along the path
    if (k < 0 || k > 1) return; const ax = x0 + (x1 - x0) * k, ay = y0 + (y1 - y0) * k, k2 = Math.max(0, k - len), bx = x0 + (x1 - x0) * k2, by = y0 + (y1 - y0) * k2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(bx, by, ax, ay); lg.addColorStop(0, 'rgba(255,120,30,0)'); lg.addColorStop(.7, 'rgba(255,170,70,.8)'); lg.addColorStop(1, 'rgba(255,246,210,1)'); ctx.strokeStyle = lg; ctx.lineWidth = w || 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ax, ay); ctx.stroke();
    ctx.globalAlpha = .5; ctx.lineWidth = (w || 2.6) * 3; ctx.stroke(); ctx.restore();
}
function ddpLens(t, evs, w, hv) { // water droplets sliding down the lens after each splash event
    evs.forEach(function (e, n) { const k = t - e; if (k < 0 || k > 2.6) return; for (let i = 0; i < 14; i++) { const x = ddpR(n * 31 + i * 7) * 1600, y0 = hv * (.12 + ddpR(n * 17 + i * 3) * .75), r = 3 + ddpR(n * 5 + i) * 9, y = y0 + k * k * 22 * (.4 + ddpR(i)), a = Math.min(1, (2.6 - k) / 1.2) * .5;
        ctx.fillStyle = 'rgba(255,255,255,' + (a * .25) + ')'; ctx.beginPath(); ctx.ellipse(x, y, r * .8, r * 1.15, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,240,210,' + a + ')'; ctx.beginPath(); ctx.arc(x - r * .2, y - r * .3, r * .28, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,' + (a * .5) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, r * .8, r * 1.15, 0, 0, 7); ctx.stroke(); } });
}

/* ================= SHOT B : inside the landing craft ================= */
const DDP_GEY_B = [7.1, 8.0, 8.9, 9.7, 10.5, 11.2, 11.9, 12.6];
const DDP_GEY_BP = [[-8, 17], [9, 13], [-5.5, 10], [10, 20], [-12, 24], [4, 28], [-4, 13], [7, 9.5]];
function ddpShotB(t, hv) {
    const P = ddpEnsure(), s = t - DD.cuts[0], vy = hv * .40, F = 900, sh = ddpShakeAt(t, .8 + s * .45);
    let jolt = 0; DDP_GEY_B.forEach(function (g) { const d = t - g; if (d > 0 && d < .55) jolt += Math.pow(1 - d / .55, 2); });
    const roll = Math.sin(t * 1.7) * .024 + Math.sin(t * .8 + 1) * .016 + jolt * Math.sin(t * 41) * .004, pitch = Math.sin(t * 1.3) * 16 + Math.sin(t * 2.7) * 6 + jolt * Math.sin(t * 33) * 7;
    const pj = function (X, Y, Z) { const f = F / Z; return [800 + X * f, vy + (1.75 - Y) * f]; };
    // ---- outside world (rolls with the horizon) ----
    ctx.save(); ctx.translate(800, hv / 2); ctx.rotate(roll); ctx.translate(-800 + sh[0] * .6, -hv / 2 + pitch + sh[1] * .6);
    ddpSky(vy, t, t * 14, 1020, .9, .22);
    // low shoreline with burning positions
    ctx.fillStyle = ddpRGB([72, 82, 66]); ctx.beginPath(); ctx.moveTo(-600, vy + 3); for (let x = -600; x <= 2200; x += 40) ctx.lineTo(x, vy - 10 - 16 * Math.abs(Math.sin(x * .004 + 1)) - 8 * Math.sin(x * .02)); ctx.lineTo(2200, vy + 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(210,190,150,.4)'; ctx.fillRect(-600, vy - 3, 2800, 6);
    [[220, .9], [560, .6], [930, 1.1], [1280, .7], [1620, 1]].forEach(function (p, i) { ddpSmoke(p[0], vy - 6, p[1], t, i * 2.1, 30, 330); ddpFire(p[0], vy - 2, .35, t, i); });
    for (let i = 0; i < 14; i++) { const st = 6.8 + i * .5, k = t - st; if (k > 0 && k < .4) ddpFlashGlow(80 + ddpR(i * 3) * 1500, vy - 12, 70 * (1 - k / .4) + 8, 1 - k / .4); }
    ddpSea(vy, vy + 760, t, 1020, 2.2, .15);
    // far ships and planes
    for (let i = 0; i < 6; i++) ddpShip(((i * 337 + 60 - t * 6) % 2400 + 2400) % 2400 - 400, vy + 5, 70 + ddpR(i) * 50, 'dd', 0, .78, t);
    for (let i = 0; i < 7; i++) { const px = (((t * 120 + i * 140 + 90) % 2400) - 400), py = vy - 340 - (i % 3) * 36; ddpPlane(px, py, .6, -.02, true); }
    // geysers (metres → screen)
    DDP_GEY_B.forEach(function (g, i) { const q = DDP_GEY_BP[i], f = F / q[1], x = 800 + q[0] * f, y = vy + 2.05 * f; ddpGeyser(x, y, 9 * f / 190, t - g, i * 5 + 1); });
    // tracers over the bow
    if (t > 8.6) for (let i = 0; i < 9; i++) { const per = 1.1 + i * .13, k = ((t - 8.6 + i * .37) % per) / per, sd = i % 2 ? 1 : -1, x0 = 800 + sd * (180 + ddpR(i) * 300), y0 = vy + 120 + ddpR(i + 4) * 60, x1 = 800 + sd * (40 + ddpR(i + 9) * 500), y1 = vy - 6; ddpTracer(x0, y0, x1, y1, k * 1.25, .22, 3); }
    ctx.restore();
    // ---- boat interior ----
    ctx.save(); ctx.translate(sh[0] * 1.3, sh[1] * 1.3 + jolt * Math.sin(t * 37) * 6);
    const Z0 = .3, Z1 = 7.3, WX = 1.55, WY = 1.3, RY = 1.45;
    function quad(a, b, c, d) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); }
    // floor
    quad(pj(-WX, 0, Z0), pj(WX, 0, Z0), pj(WX, 0, Z1), pj(-WX, 0, Z1)); let fg = ctx.createLinearGradient(0, vy + 150, 0, hv); fg.addColorStop(0, '#1c2220'); fg.addColorStop(1, '#0c100f'); ctx.fillStyle = fg; ctx.fill();
    ctx.save(); quad(pj(-WX, 0, Z0), pj(WX, 0, Z0), pj(WX, 0, Z1), pj(-WX, 0, Z1)); ctx.clip();
    for (let i = 0; i < 16; i++) { const z = 1.2 + ddpR(i * 3) * 5.8, x = (ddpR(i * 7) - .5) * 2.6, f = F / z, w = (40 + ddpR(i) * 90) * (f / 120), y = vy + 1.75 * f; ctx.fillStyle = 'rgba(190,205,205,' + (.08 + .06 * Math.sin(t * 2 + i)) + ')'; ctx.beginPath(); ctx.ellipse(800 + x * f, y, w, w * .07 + 2, 0, 0, 7); ctx.fill(); }
    ctx.restore();
    // side walls
    [-1, 1].forEach(function (sd) {
        const a = pj(sd * WX, 0, Z0), b = pj(sd * WX, WY, Z0), c = pj(sd * WX, WY, Z1), d = pj(sd * WX, 0, Z1); quad(a, b, c, d);
        const wg = ctx.createLinearGradient(800 + sd * 700, 0, 800 + sd * 150, 0); wg.addColorStop(0, '#0e1210'); wg.addColorStop(1, '#3a443c'); ctx.fillStyle = wg; ctx.fill();
        ctx.save(); quad(a, b, c, d); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 3; for (let z = .8; z < 7.3; z += .75) { const p1 = pj(sd * WX, 0, z), p2 = pj(sd * WX, WY, z); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(150,170,160,.22)'; ctx.lineWidth = 2; const m1 = pj(sd * WX, .65, Z0), m2 = pj(sd * WX, .65, Z1); ctx.beginPath(); ctx.moveTo(m1[0], m1[1]); ctx.lineTo(m2[0], m2[1]); ctx.stroke();
        for (let z = .9; z < 7.2; z += .38) for (const yy of [.2, 1.1]) { const p = pj(sd * WX, yy, z); ctx.fillStyle = 'rgba(210,220,210,.18)'; ctx.fillRect(p[0] - 2, p[1] - 2, 4, 4); }
        for (let i = 0; i < 6; i++) { const z = 1 + ddpR(i * 4 + sd) * 5.5, p = pj(sd * WX, WY, z), p2 = pj(sd * WX, .2 + ddpR(i) * .6, z); ctx.strokeStyle = 'rgba(110,64,34,.28)'; ctx.lineWidth = 4 * (F / z / 100); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
        ctx.restore();
        const tp1 = pj(sd * WX, WY, Z0), tp2 = pj(sd * WX, WY, Z1); ctx.strokeStyle = 'rgba(255,236,200,.55)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tp1[0], tp1[1]); ctx.lineTo(tp2[0], tp2[1]); ctx.stroke();
    });
    // bow ramp wall
    const r0 = pj(-WX, 0, Z1), r1 = pj(WX, 0, Z1), r2 = pj(WX, RY, Z1), r3 = pj(-WX, RY, Z1); quad(r0, r1, r2, r3); const rg = ctx.createLinearGradient(0, r3[1], 0, r0[1]); rg.addColorStop(0, '#59645a'); rg.addColorStop(.12, '#2c342e'); rg.addColorStop(1, '#141916'); ctx.fillStyle = rg; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 3; for (const xx of [-.6, 0, .6]) { const a = pj(xx, 0, Z1), b = pj(xx, RY, Z1); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,238,205,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(r3[0], r3[1]); ctx.lineTo(r2[0], r2[1]); ctx.stroke();
    // incoming fire sparks on the ramp
    if (t > 9.2) for (let i = 0; i < 5; i++) { const k = (t * 6 + i * 1.7) % 4; if (k < .25 && Math.sin(t * 3 + i * 5) > .2) { const x = r3[0] + (r2[0] - r3[0]) * ddpR(Math.floor(t * 6) * 3 + i), y = r3[1] + 14 + ddpR(Math.floor(t * 6) + i * 9) * (r0[1] - r3[1]) * .7; ddpFlashGlow(x, y, 26, 1 - k / .25); } }
    // ---- the men: rows far→near, backs to us ----
    const rows = [5.7, 4.8, 3.9, 3.05, 2.2], lanes = [-1.12, -.38, .38, 1.1], flick = .35 + .55 * Math.max(0, Math.sin(t * 5.3)) * (t > 8 ? 1 : .4) + Math.min(.6, jolt);
    rows.forEach(function (Z, ri) { const f = F / Z; lanes.forEach(function (X, li) { const jx = (ddpR(ri * 9 + li * 3) - .5) * .3, jz = (ddpR(ri * 5 + li) - .5) * .5, ff = F / (Z + jz), sc = (.46 * ff) / 44 * (.93 + ddpR(ri * 3 + li * 11) * .14), px = 800 + (X + jx) * ff, py = vy + (1.75 - 1.43) * ff + Math.sin(t * 2.1 + ri + li * .8) * 2.2 * ff / 300;
        ddpBack(px, py, sc, t, { ph: ri * 2 + li, rim: .35 + flick * .6 * (li < 2 ? 1 : .7), haze: Math.max(0, (Z - 3) * .015), spd: 2 + li * .2, turn: (ddpR(ri * 13 + li * 5) - .5) * 2 * (Math.sin(t * .5 + ri + li) > .6 ? 1.6 : .4) }); }); });
    // dark water rope-spray curtains
    [1.3, 2.9, 4.3, 5.6, 6.5, 9.6, 11.0].forEach(function (e, n) { const k = s - e; if (k < 0 || k > 1.3) return; ctx.save(); ctx.globalAlpha = Math.min(1, (1.3 - k) / .5);
        for (let i = 0; i < 90; i++) { const sx = 800 + (ddpR(n * 23 + i) - .5) * 900, y0 = vy + 60, kk = Math.min(1, k * 1.3 + ddpR(i) * .08), x = 800 + (sx - 800) * (1 + kk * 2.6), y = y0 + kk * kk * hv * .85 + ddpR(i + 2) * 30, r = 1.6 + ddpR(i + 4) * 4.5 * (1 + kk * 2); ctx.fillStyle = 'rgba(244,248,244,' + (.45 + ddpR(i + 6) * .45) + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
        const g = ctx.createLinearGradient(0, vy + 40, 0, vy + 40 + k * 520); g.addColorStop(0, 'rgba(244,248,244,.22)'); g.addColorStop(1, 'rgba(244,248,244,0)'); ctx.fillStyle = g; ctx.fillRect(-100, vy + 40, 1800, k * 420); ctx.restore(); });
    ctx.restore();
    ddpLens(t, [8.2, 9.3, 10.8, 12.5], 1600, hv);
    // dark vignette inside the boat + final blast
    let fl = 0; const fk = t - 12.4; if (fk > -.04 && fk < .4) fl = Math.max(0, 1 - Math.max(0, fk) / .4) * .9;
    return fl;
}
