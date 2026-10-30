/* ================= MISSION 6 : CONVOY ESCORT (painted morning) ================= */
const DDP_M6PAL = { top: [92, 122, 150], mid: [168, 180, 178], low: [236, 210, 166], hor: [252, 218, 156] };
function ddpTruck(x, y, s, t, o) { // GMC / Bedford 3-tonner, canvas tilt, facing right
    o = o || {}; const hz = o.haze || 0, C = function (c, k) { return ddpRGB(ddpMix(k ? ddpMix(c, [0, 0, 0], k) : c, DDP_FOG, hz)); }, bob = Math.sin(t * 9 + (o.seed || 0)) * 1.2, mv = o.move === undefined ? 1 : o.move;
    const od = [86, 90, 60], can = [132, 128, 92];
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,' + .35 * (1 - hz) + ')'; ctx.beginPath(); ctx.ellipse(0, 2, 120, 7, 0, 0, 7); ctx.fill();
    ctx.translate(0, bob);
    ctx.fillStyle = C(od, .5); ctx.fillRect(-110, -34, 216, 12);                                                         // chassis
    ctx.fillStyle = C(can); ctx.beginPath(); ctx.moveTo(-112, -34); ctx.lineTo(-112, -98); ctx.quadraticCurveTo(-110, -108, -96, -108); ctx.lineTo(16, -108); ctx.quadraticCurveTo(30, -108, 30, -98); ctx.lineTo(30, -34); ctx.fill();   // canvas tilt
    ctx.strokeStyle = C(can, .35); ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-112 + i * 23.6, -106); ctx.quadraticCurveTo(-110 + i * 23.6, -70, -112 + i * 23.6, -36); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,236,190,' + .3 * (1 - hz) + ')'; ctx.fillRect(-100, -108, 116, 3);
    ctx.fillStyle = C(od, .2); ctx.fillRect(-112, -46, 142, 12);
    ctx.fillStyle = C([236, 236, 224]); ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 14; ctx.lineTo(-40 + Math.cos(a) * r, -70 + Math.sin(a) * r); } ctx.closePath(); ctx.fill();
    // cab + bonnet
    ctx.fillStyle = C(od); ctx.beginPath(); ctx.moveTo(34, -34); ctx.lineTo(34, -92); ctx.lineTo(70, -92); ctx.lineTo(76, -62); ctx.lineTo(108, -60); ctx.lineTo(112, -34); ctx.fill();
    ctx.fillStyle = C([40, 54, 60]); ctx.beginPath(); ctx.moveTo(44, -86); ctx.lineTo(66, -86); ctx.lineTo(70, -66); ctx.lineTo(44, -66); ctx.fill(); ctx.fillStyle = 'rgba(255,240,210,' + .25 * (1 - hz) + ')'; ctx.fillRect(48, -84, 4, 16);
    if (o.driver !== false) { ctx.fillStyle = C([30, 26, 20]); ctx.beginPath(); ctx.arc(56, -76, 5, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,236,190,' + .4 * (1 - hz) + ')'; ctx.fillRect(76, -62, 32, 2);
    ctx.fillStyle = C(od, .4); for (let i = 0; i < 4; i++) ctx.fillRect(98 + i * 3, -58, 1.6, 20); ctx.fillStyle = C([255, 236, 180]); ctx.fillRect(108, -52, 4, 6);
    ctx.fillStyle = C(od, .3); ctx.beginPath(); ctx.arc(-80, -30, 22, Math.PI, 0); ctx.arc(-30, -30, 22, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(80, -30, 22, Math.PI, 0); ctx.fill();   // mudguards
    [-80, -30, 80].forEach(function (wx) { ctx.fillStyle = C([18, 18, 16]); ctx.beginPath(); ctx.arc(wx, -14, 17, 0, 7); ctx.fill(); ctx.fillStyle = C([70, 72, 60]); ctx.beginPath(); ctx.arc(wx, -14, 7, 0, 7); ctx.fill(); ctx.strokeStyle = C([40, 40, 36]); ctx.lineWidth = 2; for (let k = 0; k < 4; k++) { const a = t * 8 * mv + k * Math.PI / 2; ctx.beginPath(); ctx.moveTo(wx, -14); ctx.lineTo(wx + Math.cos(a) * 12, -14 + Math.sin(a) * 12); ctx.stroke(); } });
    if (o.burn) { ctx.restore(); ddpFire(x - 20 * s, y - 70 * s, .6 * s, t, 3); ddpSmoke(x - 20 * s, y - 90 * s, s, t, 5, 120, 380, .9); return; }
    ctx.restore();
}
function ddpJeep(x, y, s, t, o) {
    o = o || {}; const hz = o.haze || 0, C = function (c, k) { return ddpRGB(ddpMix(k ? ddpMix(c, [0, 0, 0], k) : c, DDP_FOG, hz)); }, bob = Math.sin(t * 12) * 1.4, od = [88, 92, 62];
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,' + .3 * (1 - hz) + ')'; ctx.beginPath(); ctx.ellipse(0, 2, 70, 5, 0, 0, 7); ctx.fill(); ctx.translate(0, bob);
    ctx.fillStyle = C(od); ctx.beginPath(); ctx.moveTo(-60, -20); ctx.lineTo(-60, -44); ctx.lineTo(10, -44); ctx.lineTo(16, -50); ctx.lineTo(60, -48); ctx.lineTo(62, -22); ctx.fill();
    ctx.fillStyle = 'rgba(255,236,190,' + .35 * (1 - hz) + ')'; ctx.fillRect(16, -50, 44, 2); ctx.fillStyle = C([236, 236, 224]); ctx.beginPath(); ctx.arc(-20, -32, 7, 0, 7); ctx.fill();
    ctx.strokeStyle = C(od, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, -44); ctx.lineTo(4, -70); ctx.stroke();                                   // windscreen frame
    ctx.fillStyle = C([30, 28, 22]); [[-34, -58], [-6, -60]].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fill(); ctx.fillRect(p[0] - 7, p[1] + 4, 14, 14); });
    ctx.strokeStyle = C([20, 20, 18]); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-50, -48); ctx.lineTo(-50, -100); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-40, -64); ctx.lineTo(-20, -70); ctx.stroke();   // aerial, MG
    [-38, 40].forEach(function (wx) { ctx.fillStyle = C([18, 18, 16]); ctx.beginPath(); ctx.arc(wx, -12, 13, 0, 7); ctx.fill(); ctx.fillStyle = C([70, 72, 60]); ctx.beginPath(); ctx.arc(wx, -12, 5, 0, 7); ctx.fill(); });
    ctx.restore();
}
function ddpHalftrack(x, y, s, t, o) { // Sd.Kfz. 251, facing right, MG34 behind a shield
    o = o || {}; const hz = o.haze || 0, C = function (c, k) { return ddpRGB(ddpMix(k ? ddpMix(c, [0, 0, 0], k) : c, DDP_FOG, hz)); }, base = [128, 116, 74], grn = [66, 78, 46], mv = o.move === undefined ? 1 : o.move, bob = Math.sin(t * 10) * 1.2 * mv;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,' + .35 * (1 - hz) + ')'; ctx.beginPath(); ctx.ellipse(0, 2, 120, 6, 0, 0, 7); ctx.fill(); ctx.translate(0, bob);
    ctx.fillStyle = C([24, 22, 18]); ctx.beginPath(); ctx.moveTo(-104, -26); ctx.quadraticCurveTo(-116, -14, -104, -2); ctx.lineTo(30, -2); ctx.quadraticCurveTo(44, -14, 30, -28); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = C(base, .4); ctx.beginPath(); ctx.arc(-88 + i * 22, -14, 11, 0, 7); ctx.fill(); }
    ctx.fillStyle = C([20, 20, 16]); ctx.beginPath(); ctx.arc(82, -14, 15, 0, 7); ctx.fill(); ctx.fillStyle = C(base, .3); ctx.beginPath(); ctx.arc(82, -14, 6, 0, 7); ctx.fill();
    ctx.fillStyle = C(base); ctx.beginPath(); ctx.moveTo(-112, -24); ctx.lineTo(-116, -66); ctx.lineTo(20, -70); ctx.lineTo(40, -54); ctx.lineTo(110, -44); ctx.lineTo(116, -26); ctx.lineTo(96, -20); ctx.lineTo(60, -24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C(grn); ctx.globalAlpha = .8; ctx.beginPath(); ctx.ellipse(-60, -48, 36, 10, .2, 0, 7); ctx.ellipse(70, -38, 26, 7, -.1, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,236,190,' + .4 * (1 - hz) + ')'; ctx.fillRect(-114, -67, 132, 2);
    ctx.fillStyle = C([236, 232, 220]); ctx.fillRect(-58, -54, 18, 18); ctx.fillStyle = C([20, 18, 14]); ctx.fillRect(-55, -51, 12, 12); ctx.fillStyle = C([236, 232, 220]); ctx.fillRect(-56, -47, 14, 4); ctx.fillRect(-51, -52, 4, 14);
    ctx.fillStyle = C(base, .15); ctx.fillRect(4, -92, 22, 24); ctx.fillStyle = C([20, 18, 14]); ctx.fillRect(14, -84, 46, 4);                                                    // MG shield + gun
    ctx.fillStyle = C([40, 44, 40]); [[-80, -74], [-40, -76], [-6, -80]].forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(p[0] - 8, p[1] - 1); ctx.lineTo(p[0] - 12, p[1] + 5); ctx.lineTo(p[0] - 4, p[1] + 2); ctx.fill(); });
    if (o.fire) { const g = o.fire; ddpFlashGlow(62, -82, 40, g); ctx.fillStyle = 'rgba(255,240,180,' + g + ')'; ctx.beginPath(); ctx.moveTo(60, -86); ctx.lineTo(84, -82); ctx.lineTo(60, -78); ctx.fill(); }
    ctx.restore();
}
function ddpM6Env(hv, t, pan, o) {
    o = o || {}; const hz = hv * (o.hz || .44), sx = o.sx || 1260;
    ddpSky(hz, t, pan * .2, sx - pan * .04, .3, 0, DDP_M6PAL);
    ddpBocage(hz + 4, 46, .78, pan * .15, t, 3, .1); ddpM4Fog(hz - 50, hz + 50, t, .5, 6, 1);
    for (let i = 0; i < 7; i++) { const x = ((i * 330 + 80 - pan * .3) % 2400 + 2400) % 2400 - 400; ctx.fillStyle = ddpRGB(ddpMix([30, 42, 26], DDP_FOG, .55)); ctx.beginPath(); ctx.ellipse(x, hz - 40, 18, 90, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,220,160,.18)'; ctx.beginPath(); ctx.ellipse(x + 6, hz - 60, 6, 60, 0, 0, 7); ctx.fill(); }
    const fx = 1080 - pan * .25; ctx.fillStyle = ddpRGB(ddpMix([90, 80, 70], DDP_FOG, .5)); ctx.fillRect(fx - 60, hz - 20, 120, 40); ctx.fillStyle = ddpRGB(ddpMix([110, 60, 50], DDP_FOG, .5)); ctx.beginPath(); ctx.moveTo(fx - 70, hz - 18); ctx.lineTo(fx, hz - 58); ctx.lineTo(fx + 70, hz - 18); ctx.fill();
    ddpBocage(hz + 46, 56, .4, pan * .5, t, 7, .2);
    const fg = ctx.createLinearGradient(0, hz + 60, 0, hz + 300); fg.addColorStop(0, ddpRGB(ddpMix([150, 150, 88], DDP_FOG, .3))); fg.addColorStop(1, 'rgb(104,112,60)'); ctx.fillStyle = fg; ctx.fillRect(-800, hz + 62, 3200, 2000);
    ctx.strokeStyle = 'rgba(255,230,160,.12)'; ctx.lineWidth = 2; for (let i = 0; i < 10; i++) { const yy = hz + 70 + i * i * 4; ctx.beginPath(); ctx.moveTo(-800, yy); ctx.lineTo(2400, yy); ctx.stroke(); }
    ddpBocage(hz + 150, 60, .15, pan * .8, t, 13, .25, true);
    const vg = ctx.createLinearGradient(0, hz + 180, 0, hz + 420); vg.addColorStop(0, 'rgb(84,96,50)'); vg.addColorStop(1, 'rgb(112,118,64)'); ctx.fillStyle = vg; ctx.fillRect(-800, hz + 182, 3200, 2000);
    ctx.fillStyle = 'rgba(40,52,24,.6)'; for (let i = 0; i < 120; i++) { const x = ((i * 29 - pan * .9) % 3200 + 3200) % 3200 - 800, y = hz + 186 + ddpR(i) * 120; ctx.fillRect(x, y, 2, -6 - ddpR(i + 1) * 10); }
    return hz;
}
function ddpM6Road(y, hv, pan) {
    const g = ctx.createLinearGradient(0, y - 40, 0, y + 50); g.addColorStop(0, 'rgb(150,128,92)'); g.addColorStop(1, 'rgb(118,100,70)'); ctx.fillStyle = g; ctx.fillRect(-800, y - 40, 3200, 90);
    ctx.strokeStyle = 'rgba(70,54,34,.4)'; ctx.lineWidth = 3; for (const dy of [-20, 0, 26]) { ctx.beginPath(); ctx.moveTo(-800, y + dy); ctx.lineTo(2400, y + dy); ctx.stroke(); }
    ctx.fillStyle = 'rgba(80,64,40,.5)'; for (let i = 0; i < 40; i++) { const x = ((ddpR(i) * 2800 - pan) % 2800 + 2800) % 2800 - 600; ctx.fillRect(x, y - 30 + ddpR(i + 3) * 70, 6 + ddpR(i) * 10, 3); }
    const gg = ctx.createLinearGradient(0, y + 50, 0, hv); gg.addColorStop(0, 'rgb(70,84,44)'); gg.addColorStop(1, 'rgb(30,36,20)'); ctx.fillStyle = gg; ctx.fillRect(-800, y + 50, 3200, hv);
}
function ddpDustTrail(x, y, s, t, seed) { const P = ddpEnsure(); for (let i = 0; i < 9; i++) { const k = (t * .8 + i / 9 + seed * .13) % 1, r = (20 + k * 70) * s; ctx.globalAlpha = (1 - k) * .4; ctx.drawImage(P.dust, x - k * 220 * s - r, y - (10 + k * 40) * s - r * .6, r * 2, r * 1.2); } ctx.globalAlpha = 1; }
function ddpM6Convoy(list, y, t, s) { list.forEach(function (v, i) { const x = v.x; ddpDustTrail(x - 100 * s, y, s, t, i);
    if (v.k === 'jeep') ddpJeep(x, y, s * 1.05, t, {}); else if (v.k === 'truck') ddpTruck(x, y, s, t, { seed: i, burn: v.burn }); else ddpSherman(x, y, s * .95, t, { gun: v.gun || .02, skin: v.k === 'you' ? ddpPlayerSkin() : null, exhaust: true });
    if (v.k === 'tank' || v.k === 'you') ddpBust(x - 17 * s * .95, y - 100 * s * .95, s * .95 * 1.35, i + 2, 0, t, .5); }); }

/* ---------- SHOT A : the convoy on the road ---------- */
function ddpM6ShotA(t, hv) {
    cs2Once('m6eng', t > .1, function () { playTone(70, 90, 6, .05, 'sawtooth'); });
    const pan = t * 120;
    ctx.save(); ddpCam(hv, -200 + t * 60, 0, 1.0, 0);
    const hz = ddpM6Env(hv, t, pan, { hz: .36 }), ry = hv * .82; ddpM6Road(ry, hv, pan);
    const base = 1500 + t * 12, order = ['jeep', 'tank', 'truck', 'you', 'truck', 'tank'], gaps = [0, 360, 760, 1160, 1560, 1960];
    ddpM6Convoy(order.map(function (k, i) { return { k: k, x: base - gaps[i] }; }), ry, t, 1.1);
    for (let i = 0; i < 20; i++) { const x = ((i * 190 - pan * 1.6) % 3200 + 3200) % 3200 - 600; ctx.fillStyle = '#1a2414'; ctx.beginPath(); ctx.ellipse(x, hv * 1.02, 70 + ddpR(i) * 40, 60 + ddpR(i + 1) * 50, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,220,150,.2)'; ctx.beginPath(); ctx.ellipse(x + 20, hv * .96, 30, 14, 0, Math.PI, 0); ctx.fill(); }
    ctx.restore();
}
/* ---------- SHOT B : behind the hedge, the raiders wait ---------- */
function ddpM6ShotB(u, hv) {
    const P = ddpEnsure(); cs2Once('m6idle', u > .1, function () { playTone(55, 60, 4.5, .05, 'square'); });
    ctx.save(); ddpCam(hv, -u * 10, 0, 1.0 + u * .012, 0);
    const hz = ddpM6Env(hv, u + 7, 0, { hz: .3, sx: 300 });
    ctx.fillStyle = 'rgb(140,124,84)'; ctx.fillRect(-800, hz + 92, 3200, 26);
    // the convoy passing in the distance through a gap
    for (let i = 0; i < 6; i++) { const x = ((u * 90 + i * 230) % 2000) - 200; if (i % 3 === 1) ddpTruck(x, hz + 110, .4, u, { haze: .45, seed: i }); else ddpSherman(x, hz + 110, .4, u, { haze: .45, exhaust: false }); }
    // the hedge they hide behind (foreground, with a gap)
    const hy = hv * .5; ctx.save(); ctx.beginPath(); ctx.rect(-800, -2000, 1460, 4000); ctx.rect(980, -2000, 2400, 4000); ctx.clip(); ddpBocage(hy, 120, 0, 0, u, 41, .25, true); ctx.restore();
    const g = ctx.createLinearGradient(0, hy + 30, 0, hv); g.addColorStop(0, 'rgb(64,70,40)'); g.addColorStop(1, 'rgb(22,26,14)'); ctx.fillStyle = g; ctx.fillRect(-800, hy + 60, 3200, hv);
    // German armour lined up in the lane
    ddpHalftrack(560, hv * .78, 1.5, u, { move: 0 }); ddpPanzer(1260, hv * .8, 1.45, 1, u, {});
    // officer with binoculars + MG gunner watching through the hedge gap
    ddpGI(860, hv * .9, 3.4, 1, { lean: -.15, bino: true, h1: [11, -52], h2: [7, -50] });
    ddpGI(200, hv * .95, 3.4, 1, { lean: .05, crouch: .4, h1: [24, -36], h2: [12, -34] });
    for (let i = 0; i < 18; i++) { const x = i * 100 - 100, sw = Math.sin(u * 1.4 + i) * 5; ctx.fillStyle = '#0d120a'; ctx.beginPath(); ctx.ellipse(x + sw, hv * 1.04, 80, 70, 0, 0, 7); ctx.fill(); }
    // dappled light
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 18; i++) { ctx.fillStyle = 'rgba(255,220,150,' + (.06 + .04 * Math.sin(u + i)) + ')'; ctx.beginPath(); ctx.ellipse(ddpR(i) * 1600, hv * (.6 + ddpR(i + 3) * .4), 40, 14, 0, 0, 7); ctx.fill(); } ctx.restore();
    ctx.restore();
}
/* ---------- SHOT D : the hedges open fire ---------- */
function ddpM6ShotD(u, hv) {
    const P = ddpEnsure(), b1 = .8, b2 = 2.2, crash = 1.4; cs2Once('m6mg', u > .2, function () { for (let i = 0; i < 8; i++) setTimeout(function () { try { playTone(900, 300, .05, .04, 'square'); } catch (e) {} }, i * 70); });
    cs2Once('m6b1', u > b1, function () { playExplosionSound(1.0); }); cs2Once('m6b2', u > b2, function () { playExplosionSound(1.2); }); cs2Once('m6cr', u > crash, function () { playExplosionSound(.6); });
    let shake = 0; [b1, b2].forEach(function (b) { const d = u - b; if (d >= 0 && d < .7) shake = Math.max(shake, (1 - d / .7) * 16); }); const sh = ddpShakeAt(u, shake + 1);
    const pan = 1500 + u * 120;
    ctx.save(); ddpCam(hv, sh[0] + u * 20, sh[1], 1.08, 0);
    const hz = ddpM6Env(hv, u + 17, pan, { hz: .36 }), ry = hv * .82; ddpM6Road(ry, hv, pan);
    const order = [['tank', 1460], ['truck', 1060], ['you', 640], ['truck', 220]]; ddpM6Convoy(order.map(function (v, i) { return { k: v[0], x: v[1] + u * 10, burn: i === 1 && u > b2, gun: v[0] === 'you' ? .02 + Math.min(.12, Math.max(0, u - 1.6) * .1) : .02 }; }), ry, u, 1.1);
    // halftrack bursting through the hedge on the far side
    const hx = 1700 - Math.max(0, u - crash) * 160; if (u > crash) { ddpLeaves(1640, hz + 170, 1.2, u - crash, 6); } ddpHalftrack(hx, hz + 200, 1.0, u, { haze: .15, fire: (u * 12) % 1 < .4 && u > crash + .3 ? 1 : 0 });
    // MG tracers raking the road from the hedge
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const q = ((u * 2.4 + i / 16) % 1), sx = 200 + (i % 4) * 30, sy = hz + 110, tx = 600 + i * 70, ty = ry - 40 + (i % 3) * 10, px = sx + (tx - sx) * q, py = sy + (ty - sy) * q; ctx.strokeStyle = 'rgba(255,220,140,' + (1 - q) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - (tx - sx) * .06, py - (ty - sy) * .06); ctx.stroke(); } ctx.restore();
    for (let i = 0; i < 3; i++) ddpFlashGlow(200 + i * 30, hz + 160, 40, (u * 14 + i) % 1 < .5 ? .9 : .2);
    // shells landing on the road
    ddpBlast(820, ry + 10, .9, u - b1, 3, .7); ddpBlast(1050, ry - 10, 1.1, u - b2, 7, .8); if (u > b1 && u - b1 < .15) ddpFlashGlow(820, ry, 300, 1 - (u - b1) / .15); if (u > b2 && u - b2 < .15) ddpFlashGlow(1050, ry, 400, 1 - (u - b2) / .15);
    ctx.restore();
    return (u > b2 && u - b2 < .08) ? .4 : 0;
}
function ddpM6Frame(t, w, h) {
    const U = w / 1600, hv = h / U, c = [6.4, 11.6, 17.0]; let flash = 0; DDP.ok = true;
    if (t >= c[1] && t < c[2]) { flash = m6Shot2(t - c[1] + M6CS.cuts[0], w, h); }
    else { ctx.save(); ctx.scale(U, U); if (t < c[0]) ddpM6ShotA(t, hv); else if (t < c[1]) ddpM6ShotB(t - c[0], hv); else flash = ddpM6ShotD(t - c[2], hv); ctx.restore(); ddpBloom(w, h); }
    [c[1], c[2]].forEach(function (cc) { const d = t - cc; if (d >= 0 && d < .16) flash = Math.max(flash, .5 * (1 - d / .16)); });
    return flash;
}
function ddpM6Scene4(t0, u, w, h) { // background for the radio / stamp shot
    const U = w / 1600, hv = h / U; ctx.save(); ctx.scale(U, U);
    const hz = ddpM6Env(hv, t0, u * 40, { hz: .36 }), ry = hv * .82; ddpM6Road(ry, hv, u * 40);
    ddpHalftrack(1450, hz + 200, .9, t0, { haze: .15, move: 0 }); ddpFire(1450, hz + 160, .5, t0, 1); ddpSmoke(1450, hz + 150, 1, t0, 2, 120, 420, .9);
    ddpM6Convoy([{ k: 'truck', x: 1500 + u * 30 }, { k: 'you', x: 1150 + u * 30 }, { k: 'truck', x: 820 + u * 30 }], ry + 20, t0, .9);
    ctx.restore(); ddpBloom(w, h); return 0;
}
