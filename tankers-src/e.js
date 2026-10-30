/* ---------- explosions on sand / earth ---------- */
function ddpBlast(x, y, s, k, seed, dens) { // k = seconds since detonation
    if (k < 0 || k > 3.2) return; dens = dens === undefined ? 1 : dens; const P = ddpEnsure(), up = Math.min(1, k / .45), eu = 1 - Math.pow(1 - up, 2), fade = Math.min(1, (3.2 - k) / 1.4);
    ctx.save();
    if (k < .5) { ctx.globalCompositeOperation = 'lighter'; const a = 1 - k / .5, R = (90 + k * 340) * s; ctx.globalAlpha = a; ctx.drawImage(P.fire, x - R, y - R * .9, R * 2, R * 1.8); ctx.globalAlpha = a * .9; ctx.drawImage(P.white, x - R * .3, y - R * .45, R * .6, R * .9); ctx.globalCompositeOperation = 'source-over'; }
    for (let i = 0; i < 16; i++) { const u = i / 15, r = (30 + 34 * Math.sin(u * 3) + k * 20) * s * (.6 + .4 * eu), px = x + Math.sin(i * 2.4 + seed) * 22 * s * (.4 + u), py = y - u * 230 * s * eu;
        ctx.globalAlpha = fade * (.78 - u * .3) * dens; ctx.drawImage(P.dust, px - r, py - r, r * 2, r * 2); ctx.globalAlpha = fade * .55 * (1 - u) * dens; ctx.drawImage(P.dark, px - r * .8, py - r * .8, r * 1.6, r * 1.6); }
    if (k < 1.1) { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 8; i++) { const u = i / 7, kk = k / 1.1, r = (46 + 30 * Math.sin(u * 3)) * s * (.7 + kk * .8), px = x + Math.sin(i * 3.1 + seed) * 34 * s * (.3 + u), py = y - (20 + u * 140 * eu + kk * 60) * s; ctx.globalAlpha = (1 - kk) * .75 * dens; ctx.drawImage(P.fire, px - r, py - r, r * 2, r * 2); } ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = fade; ctx.fillStyle = 'rgba(70,56,38,.9)'; for (let i = 0; i < 20; i++) { const a = (ddpR(seed + i) - .5) * 2.2, v = (140 + ddpR(seed + i * 3) * 260) * s, tt = k * .9; const px = x + Math.sin(a) * v * tt, py = y - Math.cos(a) * v * tt * 1.15 + 420 * tt * tt * s; if (py < y + 8) ctx.fillRect(px, py, 4 * s + 1, 3 * s + 1); }
    ctx.restore();
}
function ddpFoot(x, y, s, t, seed, run) { // water ripple + foam around legs wading
    ctx.save(); ctx.fillStyle = 'rgba(210,226,222,.5)'; ctx.beginPath(); ctx.ellipse(x, y, 20 * s, 4.5 * s, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(240,248,244,.65)'; ctx.lineWidth = 1.4 * s; ctx.beginPath(); ctx.ellipse(x, y, 20 * s * (1 + (t * 1.2 + seed) % 1 * .6), 4.5 * s * (1 + (t * 1.2 + seed) % 1 * .6), 0, 0, 7); ctx.stroke(); ctx.restore();
    if (run) ddpSpray(x, y - 4 * s, s * .8, (t * 2.4 + seed) % 1, 0, seed, 9);
}

/* ================= SHOT C1 : the ramp drops (bow-on) ================= */
const DDP_GEY_C = [14.1, 14.9, 15.7, 16.3];
function ddpBowOn(Xc, Z0, openK, o) { // landing craft seen head-on; openK 0..1 ramp
    o = o || {}; const F = 900, vy = o.vy, Yc = o.Yc, t = o.t, hv = o.hv;
    const pj = function (X, Y, Z) { const f = F / Z; return [800 + (Xc + X) * f, vy + (Yc - Y) * f]; };
    function quad(a, b, c, d) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); }
    const lit = o.lit === undefined ? .6 : o.lit;
    // hull front plate
    quad(pj(-1.85, -.3, Z0), pj(1.85, -.3, Z0), pj(1.7, 2.3, Z0), pj(-1.7, 2.3, Z0)); let g = ctx.createLinearGradient(0, pj(0, 2.3, Z0)[1], 0, pj(0, -.3, Z0)[1]); g.addColorStop(0, '#2c3024'); g.addColorStop(1, '#12150f'); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(255,214,150,' + lit + ')'; ctx.lineWidth = 3.2; let a = pj(-1.7, 2.3, Z0), b = pj(1.7, 2.3, Z0); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    // opening + interior
    const o0 = pj(-1.35, .4, Z0), o1 = pj(1.35, .4, Z0), o2 = pj(1.35, 2.15, Z0), o3 = pj(-1.35, 2.15, Z0);
    if (o.men) { ctx.save(); quad(o0, o1, o2, o3); ctx.clip(); const ig = ctx.createLinearGradient(0, o3[1], 0, o0[1]); ig.addColorStop(0, '#0a0b08'); ig.addColorStop(1, '#171a14'); ctx.fillStyle = ig; ctx.fillRect(o3[0] - 5, o3[1] - 5, (o1[0] - o0[0]) + 10, (o0[1] - o3[1]) + 10);
        o.men(ctx, pj); ctx.restore(); }
    else { quad(o0, o1, o2, o3); ctx.fillStyle = '#0c0d0a'; ctx.fill(); }
    // ramp door
    const th = openK * 1.44, Zt = Z0 - 1.65 * Math.sin(th), Yt = .4 + 1.65 * Math.cos(th) + (openK < 1 ? .3 * (1 - openK) : 0);
    const d0 = pj(-1.35, .4, Z0), d1 = pj(1.35, .4, Z0), d2 = pj(1.35, Yt, Zt), d3 = pj(-1.35, Yt, Zt);
    quad(d0, d1, d2, d3); const dg = ctx.createLinearGradient(0, Math.min(d2[1], d0[1]), 0, Math.max(d2[1], d0[1])); dg.addColorStop(0, openK < .6 ? '#3d453a' : '#505a50'); dg.addColorStop(1, '#1b2019'); ctx.fillStyle = dg; ctx.fill();
    ctx.save(); quad(d0, d1, d2, d3); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 2.6; for (let i = 1; i < 4; i++) { const f = i / 4, p0 = [d0[0] + (d1[0] - d0[0]) * f, d0[1] + (d1[1] - d0[1]) * f], p1 = [d3[0] + (d2[0] - d3[0]) * f, d3[1] + (d2[1] - d3[1]) * f]; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); }
    for (let i = 1; i < 6; i++) { const f = i / 6, p0 = [d0[0] + (d3[0] - d0[0]) * f, d0[1] + (d3[1] - d0[1]) * f], p1 = [d1[0] + (d2[0] - d1[0]) * f, d1[1] + (d2[1] - d1[1]) * f]; ctx.strokeStyle = 'rgba(210,220,205,.12)'; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); }
    ctx.restore(); ctx.strokeStyle = 'rgba(255,224,170,' + (lit * .8) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(d3[0], d3[1]); ctx.lineTo(d2[0], d2[1]); ctx.stroke();
    // hinge shadow & surf at the hull
    const w0 = pj(-2.2, 0, Z0 + .2), w1 = pj(2.2, 0, Z0 + .2), wc = (w0[0] + w1[0]) / 2, ww = (w1[0] - w0[0]) / 2; for (let i = 0; i < 18; i++) { const u = i / 17 * 2 - 1, k = (t * .8 + i * .37) % 1; ctx.globalAlpha = .75 * (1 - k * .5); ctx.drawImage(ddpEnsure().white, wc + u * ww - 26, w0[1] - 14 - k * 10 + Math.abs(u) * 6, 52, 30); } ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(236,244,240,.45)'; ctx.beginPath(); ctx.ellipse(wc, w0[1] + 2, ww * 1.05, 9, 0, 0, 7); ctx.fill();
    return { pj: pj, d0: d0, d1: d1, d2: d2, d3: d3, Zt: Zt, Yt: Yt };
}
function ddpShotC1(t, hv) {
    const P = ddpEnsure(), s = t - DD.cuts[1], F = 900, vy = hv * .47, Yc = 1.05, sh = ddpShakeAt(t, 1.0 + Math.max(0, 1.4 - s) * 1.6);
    let jolt = 0; DDP_GEY_C.forEach(function (g) { const d = t - g; if (d > 0 && d < .5) jolt += Math.pow(1 - d / .5, 2); });
    const slam = s - 1.25, js = slam > 0 && slam < .5 ? Math.pow(1 - slam / .5, 2) : 0;
    const zoom = 1 + s * .012, roll = Math.sin(t * 1.3) * .012 + Math.sin(t * 6) * .003 * (jolt + js);
    ctx.save(); ctx.translate(800, hv / 2 + 40); ctx.rotate(roll); ctx.scale(zoom, zoom); ctx.translate(-800 + sh[0] + Math.sin(t * 31) * js * 7, -hv / 2 - 40 + sh[1] + Math.sin(t * 37) * (jolt + js) * 7);
    const sx = 830;
    ddpSky(vy, t, t * 6, sx, 1, .22); ddpSea(vy, vy + 900, t, sx, 2.4, .1);
    // far smoke on the horizon, ships
    [[200, .8], [520, .5], [1120, .9], [1450, .6]].forEach(function (p, i) { ddpSmoke(p[0], vy - 4, p[1], t, i * 1.9, 26, 300); });
    for (let i = 0; i < 6; i++) ddpShip(((i * 389 + 90 - t * 5) % 2200 + 2200) % 2200 - 300, vy + 6, 70 + ddpR(i) * 50, 'dd', 0, .8, t);
    // beached craft behind / beside
    ddpBowOn(-9.5, 20, .85, { vy, Yc, t, hv }); ddpBowOn(8.5, 15, .9, { vy, Yc, t, hv }); ddpBowOn(-5.5, 11.5, .75, { vy, Yc, t, hv, lit: .4 });
    // shell geysers
    [[-4.2, 8.5], [6.4, 9.2], [-3.5, 17], [4.2, 13.5]].forEach(function (q, i) { const f = F / q[1]; ddpGeyser(800 + q[0] * f, vy + (Yc + 0) * f, 8 * f / 190, t - DDP_GEY_C[i], i * 7 + 2); });
    // the lead craft
    const Z0 = 5.3 + (1 - cs2E(s / 1.0)) * 1.3, openK = cs2E(cs2C((s - .3) / 1.1, 0, 1)) * (1 - .0);
    const stage = [], Xl = [-.95, -.32, .32, .95];
    const res = ddpBowOn(0, Z0, Math.pow(cs2C((s - .25) / 1.0, 0, 1), 1.7), { vy, Yc, t, hv, lit: .75, men: function (c, pj) {
        // troops waiting inside, facing us
        for (let r = 4; r >= 0; r--) for (let l = 0; l < 4; l++) { const ts = 14.95 + r * .3 + ((l * 3) % 4) * .11 + ddpR(r * 4 + l) * .16, Zm = Z0 + .9 + r * .8; if (t > ts + .15) continue; const p = pj(Xl[l] + (ddpR(r * 4 + l) - .5) * .2, .45, Zm), f = F / Zm; ddpFront(p[0], p[1], 1.75 * f / 64, t, { run: 0, ph: r + l, haze: 0 }); }
    } });
    // runners
    const runners = [];
    for (let r = 0; r < 6; r++) for (let l = 0; l < 4; l++) { const j = r * 4 + l, ts = 14.95 + r * .3 + ((l * 3) % 4) * .11 + ddpR(j) * .16; if (t < ts) continue; const v = 3.0, Zs = Z0 + .9 + r * .8; let Z = Zs - v * (t - ts); if (Z < 1.15) continue; const off = Math.max(0, (Z0 - 1.65) - Z), X = Xl[l] * (1 + 2.4 * cs2C(off / 2.4, 0, 1)) + (l < 2 ? -1 : 1) * cs2C(off / 4, 0, 1) * .8; let Y = Z > Z0 ? .45 : Z > Z0 - 1.55 ? .45 - (Z0 - Z) / 1.55 * .4 : 0; let fall = 0; if (j % 7 === 3 && t > ts + 1.1) { fall = cs2C((t - ts - 1.1) / .5, 0, 1); Z = Zs - v * (1.1) - v * .35 * fall; } runners.push({ j, Z, X, Y, fall, l }); }
    runners.sort(function (a, b) { return b.Z - a.Z; });
    runners.forEach(function (m) { if (m.Z > Z0 + .5 && 0) return; const f = F / m.Z, x = 800 + m.X * f, y = vy + (Yc - m.Y) * f, sc = 1.75 * f / 64; ddpFront(x, y, sc, t, { run: m.fall ? .2 : 1, ph: m.j * 1.7, haze: 0, fall: m.fall, fallDir: m.l < 2 ? -1 : 1 });
        if (m.Y < .3) { ctx.fillStyle = 'rgba(30,52,56,.7)'; ctx.beginPath(); ctx.ellipse(x, y - 8 * sc, 26 * sc, 9 * sc, 0, 0, 7); ctx.fill(); ddpFoot(x, y - 11 * sc, sc, t, m.j, !m.fall); } });
    // ramp-down splash + geysers either side
    ddpSpray(800 - 1.5 * F / Z0, vy + Yc * F / Z0, 1.6, s - 1.25, -1, 3, 26); ddpSpray(800 + 1.5 * F / Z0, vy + Yc * F / Z0, 1.6, s - 1.25, 1, 9, 26);
    // enemy fire stitching the water toward the boat, tracers
    for (let i = 0; i < 6; i++) { const per = .9 + i * .11, k = ((t - 13.7 + i * .31) % per) / per, sd = i % 2 ? 1 : -1; if (t > 13.7) { const x0 = 800 + sd * (260 + ddpR(i) * 480), y0 = hv * .98, x1 = 800 + sd * (40 + ddpR(i + 4) * 90), y1 = vy + 10; ddpTracer(x0, y0, x1, y1, k, .16, 2); if (k > .7 && k < 1) ddpSpray(x1, y1 + 30 * ddpR(i), .5, (k - .7) * 3, sd, i, 7); } }
    // sparks off the hull
    for (let i = 0; i < 6; i++) { const k = (t * 7 + i * 1.3) % 3; if (k < .2 && Math.sin(t * 2.3 + i * 4.1) > -.2) { const p = res.pj((ddpR(Math.floor(t * 7) + i) - .5) * 2.8, .4 + ddpR(i * 3) * 1.8, Z0); ddpFlashGlow(p[0], p[1], 24, 1 - k / .2); } }
    ctx.restore();
    ddpLens(t, [14.2, 15.0, 15.8, 16.1], 1600, hv);
    return js > 0 ? js * .35 : 0;
}

/* ================= SHOT C2 : wading in, backs to us ================= */
const DDP_GEY_C2 = [16.7, 17.4, 18.2, 19.0, 19.6];
function ddpShotC2(t, hv) {
    const P = ddpEnsure(), s = t - 16.4, hz = hv * .365, sh = ddpShakeAt(t, 1.4), zoom = 1.02 + s * .022, drift = s * 8;
    let jolt = 0; DDP_GEY_C2.concat([18.6, 19.3]).forEach(function (g) { const d = t - g; if (d > 0 && d < .5) jolt += Math.pow(1 - d / .5, 2); });
    ctx.save(); ctx.translate(800, hv * .6); ctx.rotate(Math.sin(t * 1.2) * .01 + jolt * Math.sin(t * 40) * .004); ctx.scale(zoom, zoom); ctx.translate(-800 - drift + sh[0] + Math.sin(t * 37) * jolt * 6, -hv * .6 + sh[1] + Math.sin(t * 31) * jolt * 6);
    ddpSky(hz, t, t * 4, 360, 1, .45);
    // smoke drifting across the sky
    [[60, 1.6], [470, 1.3], [1010, 1.7], [1500, 1.4]].forEach(function (p, i) { ddpSmoke(p[0], hz + 20, p[1], t, i * 2.3, 60, 480, .9); });
    // headland, bunker, beach
    ddpHill(760, 2000, hz - 260, hz + 70, 4, .1, t);
    ddpBunker(1290, hz - 188, .55, t, { haze: .15, fire: (t * 7) % 1 < .6 });
    const sandG = ctx.createLinearGradient(0, hz + 20, 0, hz + 90); sandG.addColorStop(0, ddpRGB([172, 150, 112])); sandG.addColorStop(1, ddpRGB([128, 112, 84])); ctx.fillStyle = sandG; ctx.fillRect(-700, hz + 22, 2000, 68);
    ctx.fillStyle = ddpRGB([104, 100, 90]); ctx.fillRect(-700, hz + 10, 1500, 15); ctx.fillStyle = 'rgba(255,230,190,.3)'; ctx.fillRect(-700, hz + 10, 1500, 2);           // sea wall
    ctx.fillStyle = ddpRGB([80, 90, 58]); ctx.beginPath(); ctx.moveTo(-700, hz + 11); for (let x = -700; x < 800; x += 50) ctx.lineTo(x, hz - 6 - Math.sin(x * .02) * 5); ctx.lineTo(800, hz + 11); ctx.closePath(); ctx.fill();
    // wire + obstacles on the sand
    for (let i = 0; i < 14; i++) { const x = -300 + i * 120 + ddpR(i) * 40, y = hz + 36 + ddpR(i + 3) * 44; ddpHedgehog(x, y, .36 + (y - hz - 30) * .004, .35); }
    ddpFire(150, hz + 36, .5, t, 2); ddpSmoke(150, hz + 36, .8, t, 5, 50, 300);
    // distant runners on the beach (backs)
    for (let i = 0; i < 22; i++) { const u = ddpR(i * 4), x = -280 + u * 1000 + Math.sin(t * .6 + i) * 8, yy = hz + 70 - ((t * .12 + ddpR(i)) % 1) * 48; ddpBack(x, yy, .12 + (yy - hz - 22) * .003, t, { ph: i, haze: .25, spd: 8 }); }
    // sand blasts
    [[17.0, 120, 50], [17.9, 430, 64], [18.7, 60, 70], [19.4, 640, 54], [16.8, 310, 74], [19.8, 220, 60]].forEach(function (b, i) { ddpBlast(b[1], hz + b[2], .55 + (b[2] - 40) * .006, t - b[0], i * 3.1); });
    // water
    const wy = hz + 82, wg = ctx.createLinearGradient(0, wy, 0, hv + 100); wg.addColorStop(0, 'rgb(112,118,102)'); wg.addColorStop(.1, 'rgb(62,76,74)'); wg.addColorStop(1, 'rgb(22,34,38)'); ctx.fillStyle = wg; ctx.beginPath(); ctx.moveTo(-700, wy); for (let x = -700; x <= 2200; x += 40) ctx.lineTo(x, wy + Math.sin(x * .012 + t * 1.5) * 4 + Math.sin(x * .03 - t * 2.2) * 2); ctx.lineTo(2200, hv + 200); ctx.lineTo(-700, hv + 200); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 26; i++) { const u = i / 26, y = wy + 10 + Math.pow(u, 1.7) * (hv * .62) + ((t * (10 + u * 40)) % 40) * -.0, ps = .2 + u * 1.5; ctx.beginPath(); for (let x = -700; x <= 2200; x += 30) { const yy = y + Math.sin(x * .01 / (ps * .5 + .3) + t * (1 + ps) + i * 2) * 3 * ps; if (x === -700) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.strokeStyle = 'rgba(232,240,232,' + (.06 + .12 * ps) + ')'; ctx.lineWidth = .8 + ps * 1.6; ctx.stroke(); }
    ctx.fillStyle = 'rgba(236,244,238,.65)'; ctx.beginPath(); ctx.moveTo(-700, wy - 2); for (let x = -700; x <= 2200; x += 20) ctx.lineTo(x, wy - 2 + Math.sin(x * .05 + t * 3) * 2.4); for (let x = 2200; x >= -700; x -= 20) ctx.lineTo(x, wy + 7 + Math.sin(x * .04 - t * 2) * 3); ctx.closePath(); ctx.fill();
    // hedgehogs in the surf (mid)
    [[260, .0, 1.0], [700, .12, 1.25], [1010, .06, .95], [1360, .2, 1.4], [-60, .16, 1.15]].forEach(function (h, i) { ddpHedgehog(h[0], wy + 40 + h[1] * hv * .5, .9 * h[2] + h[1] * 2.4, 0); });
    // shell geysers in the surf
    DDP_GEY_C2.forEach(function (g, i) { const x = [240, 560, 940, 1180, 80][i], y = wy + 50 + [14, 60, 34, 70, 90][i]; ddpGeyser(x, y, .9 + (y - wy) * .007, t - g, i * 4 + 1); });
    // bunker tracers into the water
    for (let i = 0; i < 9; i++) { const per = .8 + i * .1, k = ((t - 16.4 + i * .27) % per) / per, x1 = 120 + ddpR(i * 3) * 1300, y1 = hv * (.7 + ddpR(i) * .26); ddpTracer(1330, hz - 190, x1, y1, k, .16, 2.6); if (k > .9) ddpSpray(x1, y1, 1.2, (k - .9) * 8, 0, i, 10); }
    // foreground wading men (backs)
    const men = [[220, hv * .66, 3.3, 0], [650, hv * .72, 3.9, 1.3], [1010, hv * .64, 3.0, 2.1], [1400, hv * .7, 3.6, .7], [-40, hv * .62, 2.6, 3.2], [860, hv * .6, 2.1, 4.1], [470, hv * .58, 1.9, 5.3], [1230, hv * .59, 2.2, 2.8]];
    men.sort(function (a, b) { return a[2] - b[2]; });
    men.forEach(function (m, i) { const bob = Math.sin(t * 2.3 + m[3]) * 5 * m[2] / 3, bx = m[0] + Math.sin(t * .9 + m[3]) * 8, by = m[1] + bob, wl = by + 24 * m[2];
        ctx.save(); ctx.beginPath(); ctx.rect(bx - 200, by - 200 * m[2], 400, wl - (by - 200 * m[2])); ctx.clip();
        ddpBack(bx, by, m[2], t, { ph: m[3], rim: .5, haze: Math.max(0, 1.5 - m[2]) * .1, spd: 2.4 }); ctx.restore();
        ctx.fillStyle = 'rgba(30,48,50,.55)'; ctx.beginPath(); ctx.ellipse(bx, wl + 3 * m[2], 40 * m[2], 8 * m[2], 0, 0, 7); ctx.fill();
        const rk = (t * 1.1 + m[3]) % 1; ctx.strokeStyle = 'rgba(236,246,240,' + (.8 * (1 - rk)) + ')'; ctx.lineWidth = 2 * m[2] * .6; ctx.beginPath(); ctx.ellipse(bx, wl, (30 + rk * 30) * m[2], (5 + rk * 4) * m[2], 0, 0, 7); ctx.stroke();
        ctx.fillStyle = 'rgba(236,244,238,.55)'; ctx.beginPath(); ctx.ellipse(bx, wl, 30 * m[2], 4.4 * m[2], 0, 0, 7); ctx.fill();
        ddpSpray(bx - 30 * m[2], wl, m[2] * .9, (t * 1.8 + m[3]) % 1, -1, i, 12); });
    ctx.restore();
    ddpLens(t, [17.1, 18.2, 19.1], 1600, hv);
    return 0;
}
