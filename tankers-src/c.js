/* ---------- camera + helpers ---------- */
function ddpCam(hv, x, y, zoom, roll) { ctx.translate(800, hv / 2); ctx.rotate(roll || 0); ctx.scale(zoom, zoom); ctx.translate(-800 - x, -hv / 2 - y); }
function ddpShakeAt(t, a) { return [(Math.sin(t * 23.1) * .6 + Math.sin(t * 41.7 + 1) * .4) * a, (Math.sin(t * 29.3 + 2) * .6 + Math.sin(t * 53.9) * .4) * a]; }
function ddpHeadland(hz, pan, col, haze, h0) { // distant coast silhouette, right side
    ctx.fillStyle = ddpRGB(ddpMix(col, [170, 168, 150], haze)); ctx.beginPath(); ctx.moveTo(900 - pan, hz + 2);
    for (let x = 900; x <= 2300; x += 40) { const u = (x - 900) / 1400, yy = hz - h0 * Math.pow(Math.min(1, u * 1.6), .7) * (1 + .12 * Math.sin(x * .02)) - Math.sin(x * .05) * 3; ctx.lineTo(x - pan, yy); }
    ctx.lineTo(2300 - pan, hz + 2); ctx.closePath(); ctx.fill();
}
const DDP_SALVO = [1.7, 3.7, 5.4];
function ddpShotA(t, hv) {
    const P = ddpEnsure(), hz = hv * .5, pan = t * 30, sh = ddpShakeAt(t, .6);
    const heroX = 560 + t * 24, heroY = hz + 130, e = cs2E((t - 2.2) / 4.2), camX = 800 + (heroX + 20 - 800) * e, camY = hv / 2 + (hz + 30 - hv / 2) * e, zz = 1.0 + e * .5;
    ctx.save(); ddpCam(hv, camX - 800 + sh[0], camY - hv / 2 + sh[1] + Math.sin(t * .7) * 3, zz, Math.sin(t * .5) * .004 - e * .01);
    const sx = 1090 - pan * .06;
    ddpSky(hz, t, pan, sx, .8, .22);
    ddpHeadland(hz, pan * .1, [66, 78, 66], .55, 36);
    ddpSea(hz, hz + 560, t, sx, 1.1, 0);
    [[1330, .5], [1560, .8], [1830, .6], [2100, .9]].forEach(function (p, i) { ddpSmoke(p[0] - pan * .1, hz - 14, .8 * p[1], t, i * 1.7, 40, 360); ddpFire(p[0] - pan * .1, hz - 2, .3, t, i); });
    for (let i = 0; i < 10; i++) { const st = 1.2 + i * .52, k = t - st; if (k > 0 && k < .5) ddpFlashGlow(1200 + ddpR(i * 5) * 800 - pan * .1, hz - 12, 110 * (1 - k / .5) + 10, 1 - k / .5); }
    for (let i = 0; i < 12; i++) { const x = ((i * 200 + 80 - pan * .08) % 2400 + 2400) % 2400 - 400; ddpShip(x, hz + 5, 70 + ddpR(i) * 60, 'dd', 0, .8, t); }
    function salvoK(off) { let f = 0; DDP_SALVO.forEach(function (st) { const d = t - st - off; if (d >= 0 && d < .7) f = Math.max(f, 1 - d / .7); }); return f; }
    ddpShip(250 - pan * .22, hz + 26, 600, 'bb', salvoK(0), .36, t);
    ddpShip(1380 - pan * .18, hz + 18, 380, 'bb', salvoK(.35), .52, t);
    DDP_SALVO.forEach(function (st) { const k = t - st; if (k > 0 && k < 5) { ctx.globalAlpha = Math.max(0, 1 - k / 5) * .7; const R = 70 + k * 80; ctx.drawImage(P.grey, 330 - pan * .22 - R, hz - 50 - k * 8 - R * .6, R * 2, R * 1.2); ctx.globalAlpha = 1; } });
    for (let g = 0; g < 3; g++) for (let i = 0; i < 6; i++) { const px = ((t * (90 + g * 25) + g * 700 + i * 70 - 300) % 2600) - 500, py = hz - 300 - g * 80 - i * 9 + Math.sin(i + g) * 6; ddpPlane(px, py, .6 - g * .09, -.03 + Math.sin(t * .4 + i) * .02, true); }
    for (let i = 0; i < 12; i++) { const st = .8 + i * .5, k = t - st; if (k > 0 && k < 1.8) { const bx = 300 + ddpR(i * 9) * 1100, by = hz - 330 + ddpR(i * 4) * 140; ctx.globalAlpha = (1 - k / 1.8) * .9; const R = 14 + k * 24; ctx.drawImage(P.dark, bx - R, by - R, R * 2, R * 2); ctx.globalAlpha = 1; if (k < .12) ddpFlashGlow(bx, by, 30, 1 - k / .12); } }
    if (t > 2.2 && t < 4.8) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const st = 2.2 + ddpR(i * 3) * 1.8, k = (t - st) / 1.1; if (k > 0 && k < 1) { const x0 = 500 + ddpR(i) * 500 - pan * .2, y0 = hz + 60 + ddpR(i + 4) * 40, x1 = 1250 + ddpR(i + 8) * 800 - pan * .1, y1 = hz - 6, ax = x0 + (x1 - x0) * k, ay = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 170, k2 = Math.max(0, k - .08), bx = x0 + (x1 - x0) * k2, by = y0 + (y1 - y0) * k2 - Math.sin(k2 * Math.PI) * 170, lg = ctx.createLinearGradient(bx, by, ax, ay); lg.addColorStop(0, 'rgba(255,140,50,0)'); lg.addColorStop(1, 'rgba(255,230,170,.95)'); ctx.strokeStyle = lg; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ax, ay); ctx.stroke(); } if (k >= 1 && k < 1.25) ddpFlashGlow(1250 + ddpR(i + 8) * 800 - pan * .1, hz - 8, 60 * (1.25 - k) * 4, (1.25 - k) * 4); } ctx.restore(); }
    // mid-distance armada, bows right
    const boats = [];
    for (let i = 0; i < 8; i++) { const u = i / 7; boats.push({ i, y: hz + 22 + u * 70, s: .5 + u * 1.15, par: .25 + u * .5, x0: ((i * 411) % 2100) - 200, sp: 8 + u * 14 }); }
    boats.forEach(function (b) { const x = (((b.x0 + t * b.sp - pan * b.par * .5) % 2700) + 2700) % 2700 - 520; ddpBoatSide(x, b.y, b.s, t, { seed: b.i * 1.9, troops: 12, haze: Math.max(0, .45 - b.s * .25), busts: b.s > 1.2, rim: .6 }); });
    // geysers away from the hero
    [[.6, 760, .1], [1.5, 1460, .3], [2.4, 280, .5], [3.1, 1760, .2], [3.9, 160, .6], [4.6, 1900, .4], [5.2, 1250, .2], [5.9, -80, .3]].forEach(function (g, i) { ddpGeyser(g[1] - pan * (.2 + g[2] * .3), hz + 36 + g[2] * 130, .42 + g[2] * .9, t - g[0], i * 3); });
    // hero craft, troops silhouetted against the dawn
    ddpBoatSide(heroX, heroY, 3.2, t, { seed: 3.3, troops: 13, haze: 0, busts: true, rim: .9, speed: 1.1 });
    // foreground swell with spray
    const fy = hz + 330; ctx.fillStyle = 'rgba(6,14,18,.94)'; ctx.beginPath(); ctx.moveTo(-700, hv + 200); ctx.lineTo(-700, fy + 40); for (let x = -700; x <= 2300; x += 30) ctx.lineTo(x, fy + Math.sin(x * .005 + t * 1.0) * 26 + Math.sin(x * .017 + t * 1.8) * 6 + 40 * Math.sin(x * .0011 - 1)); ctx.lineTo(2300, hv + 200); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(210,226,224,.35)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = -700; x <= 2300; x += 30) { const yy = fy + Math.sin(x * .005 + t * 1.0) * 26 + Math.sin(x * .017 + t * 1.8) * 6 + 40 * Math.sin(x * .0011 - 1); if (x === -700) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke();
    ctx.restore();
    for (let i = 0; i < 18; i++) { const k = (t * .3 + i * .21) % 1; ctx.fillStyle = 'rgba(255,255,255,' + (.35 * (1 - k)) + ')'; ctx.fillRect(((i * 211) % 1600) + k * 40, hv * (.82 + .16 * ddpR(i)) - k * 40, 2, 3 + k * 8); }
    return 0;
}
function ddpBloom(w, h) { if (DDP.q < 1) return; const bl = DDP.bl || (DDP.bl = ddpCv(160, 100)), bg = bl.getContext('2d'), b2 = DDP.b2 || (DDP.b2 = ddpCv(40, 25)), g2 = b2.getContext('2d'); bg.globalCompositeOperation = 'copy'; bg.drawImage(canvas, 0, 0, 160, 100); g2.globalCompositeOperation = 'copy'; g2.drawImage(bl, 0, 0, 40, 25); ctx.save(); ctx.imageSmoothingEnabled = true; ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .12; ctx.drawImage(bl, 0, 0, w, h); ctx.globalAlpha = .18; ctx.drawImage(b2, 0, 0, w, h); ctx.restore(); }
function ddpPost(t, w, h, flash) {
    const P = ddpEnsure(), bl = DDP.bl || (DDP.bl = ddpCv(160, 100)), bg = bl.getContext('2d'), b2 = DDP.b2 || (DDP.b2 = ddpCv(40, 25)), g2 = b2.getContext('2d');
    if (DDP.q > 0) { bg.globalCompositeOperation = 'copy'; bg.drawImage(canvas, 0, 0, 160, 100); g2.globalCompositeOperation = 'copy'; g2.drawImage(bl, 0, 0, 40, 25);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .13; ctx.drawImage(bl, 0, 0, w, h); ctx.globalAlpha = .2; ctx.drawImage(b2, 0, 0, w, h); ctx.restore(); }
    if (DDP.q > 1) { ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = 'rgba(128,128,128,.1)'; ctx.fillRect(0, 0, w, h); ctx.restore(); }
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; const cg = ctx.createLinearGradient(0, 0, 0, h); cg.addColorStop(0, 'rgba(90,120,160,.22)'); cg.addColorStop(.5, 'rgba(160,150,130,.08)'); cg.addColorStop(1, 'rgba(30,70,90,.2)'); ctx.fillStyle = cg; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.save(); ctx.globalAlpha = .1; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    if (Math.random() < .35) { ctx.fillStyle = 'rgba(255,245,220,.10)'; ctx.fillRect(Math.random() * w, 0, 1.3, h); }
    if (Math.random() < .1) { ctx.fillStyle = 'rgba(255,245,220,.12)'; ctx.fillRect(0, Math.random() * h, w, 1); }
    const vg = ctx.createRadialGradient(w / 2, h * .5, w * .22, w / 2, h * .5, w * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
}
function ddpFrame(t, w, h) {
    const nowp = performance.now(); if (t < .1) { DDP.ema = 0; DDP.last = 0; DDP.q = 2; DDP.cool = 0; } if (DDP.last) { const dt = Math.min(nowp - DDP.last, 120); DDP.ema = DDP.ema ? DDP.ema * .92 + dt * .08 : dt; if (--DDP.cool < 0) { if (DDP.ema > 38 && DDP.q > 0) { DDP.q--; DDP.cool = 24; DDP.ema = 28; } else if (DDP.ema < 19 && DDP.q < 2) { DDP.q++; DDP.cool = 90; } } } DDP.last = nowp;
    const U = w / 1600, hv = h / U, fl = [0]; ctx.save(); ctx.scale(U, U); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1600, hv);
    let f = 0;
    if (t < DD.cuts[0]) f = ddpShotA(t, hv);
    else if (t < DD.cuts[1]) f = ddpShotB(t, hv);
    else if (t < 16.4) f = ddpShotC1(t, hv);
    else if (t < DD.cuts[2]) f = ddpShotC2(t, hv);
    else f = ddpShotD(t, hv);
    ctx.restore(); if (!window.DDP_NOPOST) ddpPost(t, w, h, f); DDP.ok = true; return f || 0;
}
/* ===== DDP END ===== */
