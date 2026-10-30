/* ================= MISSION 2 : painted upgrade (dusk over the bocage) ================= */
const DDP_M2PAL = { top: [52, 40, 96], mid: [176, 100, 120], low: [250, 160, 98], hor: [255, 196, 120], streaks: true };
function ddpHedge(y0, hgt, par, t, seed, rim) { // layered hedgerow with poplar tops, lit from the right
    for (let row = 0; row < 2; row++) {
        const yy = y0 + row * hgt * .35, sc = 1 - row * .12;
        ctx.fillStyle = row ? 'rgb(30,42,28)' : 'rgb(40,58,32)'; ctx.fillRect(-700, yy, 3000, hgt * (1.1 - row * .2));
        for (let i = 0; i < 70; i++) { const x = ((i * 46 + row * 23 - par * (1 + row * .25)) % 3200 + 3200) % 3200 - 700, r = (30 + ddpR(i * 3 + seed + row) * 24) * sc, y = yy + ddpR(i + seed) * 10;
            ctx.fillStyle = row ? 'rgb(34,48,30)' : 'rgb(46,66,36)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
            ctx.strokeStyle = 'rgba(255,190,110,' + (.32 - row * .12) + ')'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, r, -1.1, .1); ctx.stroke(); }
    }
    for (let i = 0; i < 9; i++) { const x = ((i * 410 + 120 - par * 1.1) % 3700 + 3700) % 3700 - 800, th = 120 + ddpR(i + seed) * 80; ctx.fillStyle = 'rgb(28,40,26)'; ctx.beginPath(); ctx.moveTo(x, y0 + 14); ctx.quadraticCurveTo(x - 26, y0 - th * .5, x, y0 - th); ctx.quadraticCurveTo(x + 26, y0 - th * .5, x, y0 + 14); ctx.fill(); ctx.strokeStyle = 'rgba(255,190,110,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y0 - th); ctx.quadraticCurveTo(x + 24, y0 - th * .5, x, y0 + 14); ctx.stroke(); }
}
function ddpM2Env(hv, t, pan, o) {
    o = o || {}; const P = ddpEnsure(), hz = hv * (o.hz || .4), sx = o.sx || 1180;
    if (!o.skyDone) ddpSky(hz, t, pan, sx - pan * .03, 1.1, 0, DDP_M2PAL);
    // purple ridges
    [[.16, [92, 66, 112], .55, 70, 1.2], [.3, [70, 56, 96], .35, 46, 2.7]].forEach(function (r) { ctx.fillStyle = ddpRGB(ddpMix(r[1], [255, 170, 110], r[2] * .35)); ctx.beginPath(); ctx.moveTo(-700, hz + 40); for (let x = -700; x <= 2300; x += 40) ctx.lineTo(x, hz - r[3] * (.5 + .5 * Math.sin((x - pan * r[0]) * .0034 + r[4])) - 14 * Math.sin((x - pan * r[0]) * .011 + r[4] * 3)); ctx.lineTo(2300, hz + 40); ctx.closePath(); ctx.fill(); });
    // farmhouse + church spire + crashed-plane smoke
    const fx = 930 - pan * .2;
    ctx.fillStyle = 'rgb(34,28,40)'; ctx.fillRect(fx - 60, hz - 30, 120, 44); ctx.beginPath(); ctx.moveTo(fx - 72, hz - 28); ctx.lineTo(fx - 30, hz - 62); ctx.lineTo(fx + 40, hz - 62); ctx.lineTo(fx + 72, hz - 28); ctx.closePath(); ctx.fill(); ctx.fillRect(fx + 30, hz - 84, 12, 30);
    ctx.fillRect(fx - 150, hz - 22, 22, 40); ctx.beginPath(); ctx.moveTo(fx - 152, hz - 22); ctx.lineTo(fx - 139, hz - 96); ctx.lineTo(fx - 126, hz - 22); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,120,.55)'; ctx.fillRect(fx - 54, hz - 62, 96, 2); ctx.fillRect(fx - 76, hz - 30, 4, 4);
    ddpSmoke(fx + 36, hz - 80, .5, t, 2, 20, 160, .6);
    ddpSmoke(130 - pan * .12, hz + 10, 1.1, t, 4, 40, 420, .9); ddpSmoke(1620 - pan * .12, hz + 8, 1.0, t, 7, 30, 400, .9);
    ddpHedge(hz + (o.hedgeY === undefined ? 28 : o.hedgeY), 70, pan * .6, t, 3);
    // haze between hedge and field
    const hg = ctx.createLinearGradient(0, hz + 60, 0, hz + 130); hg.addColorStop(0, 'rgba(255,170,110,.35)'); hg.addColorStop(1, 'rgba(255,170,110,0)'); ctx.fillStyle = hg; ctx.fillRect(-700, hz + 60, 3000, 70);
    // field in perspective
    const fy = hz + (o.fieldY === undefined ? 100 : o.fieldY), fg = ctx.createLinearGradient(0, fy, 0, hv + 120); fg.addColorStop(0, 'rgb(138,106,70)'); fg.addColorStop(.35, 'rgb(106,88,56)'); fg.addColorStop(1, 'rgb(44,40,26)'); ctx.fillStyle = fg; ctx.fillRect(-700, fy, 3000, hv - fy + 200);
    ctx.strokeStyle = 'rgba(255,196,120,.12)'; ctx.lineWidth = 1.4; for (let i = -30; i < 40; i++) { ctx.beginPath(); ctx.moveTo(800 + i * 18, fy); ctx.lineTo(800 + i * 150 - pan * .4 % 150, hv + 100); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(30,20,10,.18)'; for (let i = -30; i < 40; i++) { ctx.beginPath(); ctx.moveTo(800 + i * 18 + 6, fy); ctx.lineTo(800 + i * 150 + 40 - pan * .4 % 150, hv + 100); ctx.stroke(); }
    if (!o.noTrack) {
    // dirt track
    const tg = ctx.createLinearGradient(0, hv * .5, 0, hv * .93); tg.addColorStop(0, 'rgba(180,140,86,.55)'); tg.addColorStop(1, 'rgba(110,84,52,.85)'); ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(-700, hv * .5); ctx.lineTo(2300, hv * .5); ctx.lineTo(2300, hv * .93); ctx.lineTo(-700, hv * .93); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(40,26,14,.35)'; ctx.lineWidth = 3; for (const yy of [.6, .66, .82, .88]) { ctx.beginPath(); ctx.moveTo(-700, hv * yy); ctx.lineTo(2300, hv * yy); ctx.stroke(); }
    }
    return { hz: hz };
}
function ddpTankRoll(x, y, s, t, o) { // Sherman + long shadow + dust + commander + antenna
    o = o || {}; const P = ddpEnsure();
    ctx.fillStyle = 'rgba(24,14,34,.4)'; ctx.beginPath(); ctx.ellipse(x - 70 * s, y + 3 * s, 200 * s, 12 * s, 0, 0, 7); ctx.fill();
    for (let i = 0; i < 12; i++) { const k = (t * .7 + i / 12) % 1, r = (16 + k * 56) * s; ctx.globalAlpha = (1 - k) * .5; ctx.drawImage(P.dust, x - 118 * s - k * 150 * s - r, y - (8 + k * 36) * s - r * .7, r * 2, r * 1.5); ctx.globalAlpha = (1 - k) * .22; ctx.drawImage(P.warm, x - 118 * s - k * 150 * s - r * .8, y - (8 + k * 36) * s - r * .6, r * 1.6, r * 1.2); } ctx.globalAlpha = 1;
    ddpSherman(x, y, s, t, { gun: o.gun === undefined ? .02 : o.gun, move: 1, wet: 0, haze: o.haze || 0, exhaust: true });
    if (o.cmd !== false) { ddpBust(x - 17 * s, y - 100 * s, s * 1.35, o.seed || 1, o.haze || 0, t, .5); }
    ctx.strokeStyle = 'rgba(20,14,12,.9)'; ctx.lineWidth = Math.max(1, 1.6 * s); const ax = x - 104 * s, ay = y - 66 * s; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(ax - 6 * s, ay - 90 * s, ax + Math.sin(t * 2 + (o.seed || 0)) * 6 * s - 4 * s, ay - 150 * s); ctx.stroke();
    ctx.fillStyle = '#b5261c'; ctx.beginPath(); ctx.moveTo(ax - 4 * s, ay - 150 * s); ctx.lineTo(ax + 24 * s + Math.sin(t * 6) * 3 * s, ay - 143 * s); ctx.lineTo(ax - 4 * s, ay - 134 * s); ctx.fill();
}
function ddpM2Walkers(list, t, hv) { list.forEach(function (m) { ctx.fillStyle = 'rgba(24,14,34,.35)'; ctx.beginPath(); ctx.ellipse(m.x - 40 * m.s, m.y + 2 * m.s, 70 * m.s, 6 * m.s, 0, 0, 7); ctx.fill(); ddpMan(m.x, m.y, m.s, t, { ph: m.ph, run: .5, spd: 5.5, haze: m.haze || 0 }); }); }
function ddpM2Shot1(t, hv) {
    const P = ddpEnsure(), pan = t * 46, sh = ddpShakeAt(t, .5), zoom = 1.03 + t * .004;
    ctx.save(); ctx.translate(800, hv * .6); ctx.rotate(Math.sin(t * .6) * .004); ctx.scale(zoom, zoom); ctx.translate(-800 + sh[0], -hv * .6 + sh[1]);
    const env = ddpM2Env(hv, t, pan, { hz: .4 });
    // friendly bombers + contrails
    for (let g = 0; g < 2; g++) for (let i = 0; i < 4; i++) { const px = ((t * (70 + g * 30) + g * 500 + i * 120 - 200) % 2400) - 400, py = env.hz - 230 - g * 70 - i * 10; ctx.fillStyle = 'rgba(255,214,170,.2)'; for (let k = 1; k < 16; k++) { ctx.beginPath(); ctx.arc(px - 40 - k * 16, py + 2, 2.4 + k * .4, 0, 7); ctx.fill(); } ddpPlane(px, py, .65 - g * .1, -.02, true); }
    // flak puffs on the ridge
    for (let i = 0; i < 8; i++) { const st = .8 + i * .7, k = t - st; if (k > 0 && k < 2.4) { const bx = 500 + ddpR(i * 7) * 1000, by = env.hz - 260 + ddpR(i * 3) * 80; ctx.globalAlpha = (1 - k / 2.4) * .8; const R = 12 + k * 16; ctx.drawImage(P.dark, bx - R, by - R, R * 2, R * 2); ctx.globalAlpha = 1; if (k < .1) ddpFlashGlow(bx, by, 28, 1 - k / .1); } }
    const gy = [hv * .56, hv * .68, hv * .84];
    // far tank + walkers
    ddpTankRoll(1420 + t * 8, gy[0], 1.0, t, { seed: 1, haze: .15 });
    ddpM2Walkers([{ x: 1180 + t * 8, y: gy[0] + 6, s: 1.0, ph: 1, haze: .15 }, { x: 1250 + t * 8, y: gy[0] + 14, s: 1.0, ph: 3, haze: .15 }, { x: 1730 + t * 8, y: gy[0] + 8, s: 1.0, ph: 5, haze: .15 }], t, hv);
    ddpTankRoll(960 + t * 12, gy[1], 1.7, t, { seed: 2, haze: .05 });
    ddpM2Walkers([{ x: 1290 + t * 12, y: gy[1] + 12, s: 1.6, ph: 0 }, { x: 1400 + t * 12, y: gy[1] + 22, s: 1.65, ph: 2 }, { x: 1510 + t * 12, y: gy[1] + 10, s: 1.6, ph: 4 }], t, hv);
    ddpTankRoll(420 + t * 16, gy[2], 2.25, t, { seed: 3 });
    ddpM2Walkers([{ x: 800 + t * 16, y: gy[2] + 30, s: 2.2, ph: 1 }, { x: 960 + t * 16, y: gy[2] + 44, s: 2.3, ph: 3 }, { x: 1110 + t * 16, y: gy[2] + 28, s: 2.2, ph: 5 }], t, hv);
    // foreground grass silhouettes
    ctx.fillStyle = '#0b0a06'; for (let i = 0; i < 70; i++) { const x = ((i * 53 - pan * 2.2) % 1900 + 1900) % 1900 - 150, hh = 90 + ddpR(i * 3) * 190, sw = Math.sin(t * 1.3 + i) * 10; ctx.beginPath(); ctx.moveTo(x - 7, hv + 40); ctx.quadraticCurveTo(x + sw * .4, hv - hh * .55, x + sw + 4, hv - hh); ctx.quadraticCurveTo(x + sw * .5 + 6, hv - hh * .5, x + 8, hv + 40); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,184,100,.45)'; ctx.lineWidth = 1.6; for (let i = 0; i < 70; i += 2) { const x = ((i * 53 - pan * 2.2) % 1900 + 1900) % 1900 - 150, hh = 90 + ddpR(i * 3) * 190, sw = Math.sin(t * 1.3 + i) * 10; ctx.beginPath(); ctx.moveTo(x + 6, hv + 40); ctx.quadraticCurveTo(x + sw * .5 + 6, hv - hh * .5, x + sw + 4, hv - hh); ctx.stroke(); }
    ctx.restore();
    return 0;
}
// the scenery for shot 4, drawn under the existing commander/radio/stamp overlay (real-pixel ctx, already camera-transformed)
function ddpM2Scene4(t0, w, h, u) {
    const U = w / 1600, hv = h / U, P = ddpEnsure(); ctx.save(); ctx.scale(U, U);
    const pan = u * 14; ddpM2Env(hv, t0, pan, { hz: .4, sx: 1180 });
    // far guns popping on the ridge
    for (let i = 0; i < 6; i++) { const k = (t0 * .9 + i * .37) % 2.4; if (k < .12) ddpFlashGlow(300 + i * 220, hv * .4 - 4, 34, 1 - k / .12); }
    // column setting off
    const go = cs2C((u - 1.8) / 2.2, 0, 1); [[1220, 1.15, hv * .62], [980, 1.3, hv * .66], [760, 1.5, hv * .71], [520, 1.7, hv * .77]].forEach(function (c, i) { ddpTankRoll(c[0] + go * go * 260, c[2], c[1] * .95, t0, { seed: i + 4, haze: .08, cmd: true }); });
    ctx.restore();
}
