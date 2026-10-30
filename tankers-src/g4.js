/* ================= MISSION 4 : THE HEDGEROW GHOST (Tiger boss intro, painted) ================= */
const DDP_M4PAL = { top: [62, 72, 78], mid: [118, 128, 122], low: [172, 170, 150], hor: [222, 200, 160] };
const DDP_FOG = [164, 172, 164];
function ddpM4Fog(y0, y1, t, dens, drift, seed) { // drifting fog bank between y0 and y1
    const P = ddpEnsure(); seed = seed || 0;
    const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, ddpRGB(DDP_FOG, 0)); g.addColorStop(.4, ddpRGB(DDP_FOG, dens * .55)); g.addColorStop(1, ddpRGB(DDP_FOG, dens * .25)); ctx.fillStyle = g; ctx.fillRect(-800, y0, 3200, y1 - y0);
    for (let i = 0; i < 16; i++) { const wd = 420 + ddpR(i + seed) * 520, x = ((ddpR(i * 3 + seed) * 2800 + t * (drift || 14) * (.6 + ddpR(i + 5) * .8)) % 2800) - 600, y = y0 + ddpR(i * 7 + seed) * (y1 - y0); ctx.globalAlpha = dens * .32; ctx.drawImage(P.white, x - wd / 2, y - wd * .14, wd, wd * .28); }
    ctx.globalAlpha = 1;
}
function ddpBocage(y, hgt, haze, pan, t, seed, rim, noTrees) { // a row of hedgerow canopy + a few big trees
    const col = ddpRGB(ddpMix([30, 42, 26], DDP_FOG, haze)), col2 = ddpRGB(ddpMix([42, 58, 34], DDP_FOG, haze)), trunk = ddpRGB(ddpMix([26, 24, 18], DDP_FOG, haze));
    ctx.fillStyle = col; ctx.fillRect(-800, y, 3200, hgt * .6 + 400);
    if (!noTrees) for (let i = 0; i < 6; i++) { const x = ((i * 570 + seed * 97 - pan) % 3400 + 3400) % 3400 - 800, th = hgt * (1.5 + ddpR(i + seed) * 1.0); ctx.fillStyle = trunk; ctx.fillRect(x - 5, y - th * .55, 10, th * .6); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y - th * .7, hgt * .8, th * .36, 0, 0, 7); ctx.fill(); for (let k = 0; k < 7; k++) { ctx.fillStyle = k % 2 ? col2 : col; ctx.beginPath(); ctx.arc(x + Math.cos(k * 2.4) * hgt * .55, y - th * .72 + Math.sin(k * 2.4) * th * .26, hgt * (.3 + ddpR(k + i) * .2), 0, 7); ctx.fill(); } }
    for (let i = 0; i < 150; i++) { const x = ((i * 23 + seed * 31 - pan) % 3400 + 3400) % 3400 - 800, r = hgt * (.22 + ddpR(i * 3 + seed) * .22), yy = y - ddpR(i + seed) * hgt * .3; ctx.fillStyle = i % 3 ? col : col2; ctx.beginPath(); ctx.arc(x, yy, r, 0, 7); ctx.fill(); }
    if (rim) { ctx.strokeStyle = 'rgba(255,224,170,' + rim + ')'; ctx.lineWidth = 2; for (let i = 0; i < 150; i += 2) { const x = ((i * 23 + seed * 31 - pan) % 3400 + 3400) % 3400 - 800, r = hgt * (.22 + ddpR(i * 3 + seed) * .22), yy = y - ddpR(i + seed) * hgt * .3; ctx.beginPath(); ctx.arc(x, yy, r, -1.9, -.9); ctx.stroke(); } }
}
function ddpLane(y, hv, t, haze) { // sunken dirt lane with ruts and puddles
    const g = ctx.createLinearGradient(0, y - 30, 0, hv); g.addColorStop(0, ddpRGB(ddpMix([98, 92, 70], DDP_FOG, haze))); g.addColorStop(.3, ddpRGB(ddpMix([70, 64, 46], DDP_FOG, haze * .5))); g.addColorStop(1, 'rgb(24,24,16)'); ctx.fillStyle = g; ctx.fillRect(-800, y - 30, 3200, hv - y + 300);
    ctx.strokeStyle = 'rgba(30,26,18,.45)'; ctx.lineWidth = 3; for (const dy of [-12, 10, 34]) { ctx.beginPath(); ctx.moveTo(-800, y + dy); for (let x = -800; x < 2400; x += 60) ctx.lineTo(x, y + dy + Math.sin(x * .02 + dy) * 2); ctx.stroke(); }
    for (let i = 0; i < 9; i++) { const x = ddpR(i * 5) * 2000 - 200, yy = y + 4 + ddpR(i) * 50, rw = 40 + ddpR(i + 2) * 90; ctx.fillStyle = 'rgba(210,214,200,.35)'; ctx.beginPath(); ctx.ellipse(x, yy, rw, rw * .1, 0, 0, 7); ctx.fill(); }
}
function ddpCrows(t, n, x0, y0, seed) { ctx.strokeStyle = 'rgba(30,32,30,.85)'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const k = t - ddpR(i + seed) * .8; if (k < 0) continue; const x = x0 + (ddpR(i * 3 + seed) - .3) * 300 + k * (90 + i * 12), y = y0 - k * (60 + ddpR(i) * 50) + Math.sin(i) * 30, f = Math.sin(t * 14 + i * 2) * 7, s = 1 + ddpR(i + 7) * .6; ctx.beginPath(); ctx.moveTo(x - 12 * s, y - f * s); ctx.quadraticCurveTo(x - 5 * s, y - 3 * s, x, y); ctx.quadraticCurveTo(x + 5 * s, y - 3 * s, x + 12 * s, y - f * s); ctx.stroke(); } }

function ddpTiger(x, y, s, t, o) { // PzKpfw VI Tiger I, side view; dir +1 faces right
    o = o || {}; const P = ddpEnsure(), hz = o.haze || 0, mv = o.move === undefined ? 1 : o.move, dir = o.dir || 1, tr = o.tr || 0, cs = Math.cos(tr * Math.PI / 2), rec = o.rec || 0;
    const C = function (c, k, a) { return ddpRGB(ddpMix(k ? ddpMix(c, [0, 0, 0], k) : c, DDP_FOG, hz), a); };
    const base = [146, 128, 82], grn = [70, 82, 48], brn = [100, 70, 44], dk = [40, 36, 28], blk = [22, 20, 16], lit = [226, 210, 160];
    ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    ctx.fillStyle = 'rgba(10,10,8,' + (.4 * (1 - hz)) + ')'; ctx.beginPath(); ctx.ellipse(0, 3, 190, 11, 0, 0, 7); ctx.fill();
    // exhaust
    if (o.exhaust !== false) for (let i = 0; i < 9; i++) { const k = (t * .9 + i / 9) % 1, r = 12 + k * 46; ctx.globalAlpha = (1 - k) * .55 * (1 - hz * .6); ctx.drawImage(P.dark, -166 - k * 90 - r, -128 - k * 120 - r, r * 2, r * 2); } ctx.globalAlpha = 1;
    // track run
    ctx.fillStyle = C(blk); ctx.beginPath(); ctx.moveTo(-150, -56); ctx.lineTo(148, -56); ctx.quadraticCurveTo(180, -52, 172, -30); ctx.lineTo(150, -2); ctx.lineTo(-152, -2); ctx.quadraticCurveTo(-184, -22, -150, -56); ctx.fill();
    const off = (t * 70 * mv) % 10; ctx.fillStyle = C(dk); for (let i = -150; i < 150; i += 10) { ctx.fillRect(i - off + 10, -6, 6, 5); ctx.fillRect(i + off, -56, 6, 4); }
    // interleaved road wheels
    const a = t * mv * 2.6;
    for (let i = 0; i < 8; i++) { const wx = -126 + i * 36; ctx.fillStyle = C(dk, .1); ctx.beginPath(); ctx.arc(wx, -28, 25, 0, 7); ctx.fill(); }
    for (let i = 0; i < 7; i++) { const wx = -108 + i * 36; ctx.fillStyle = C(base, .28); ctx.beginPath(); ctx.arc(wx, -28, 26, 0, 7); ctx.fill(); ctx.strokeStyle = C(blk); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(wx, -28, 23.5, 0, 7); ctx.stroke();
        ctx.fillStyle = C(base, .45); ctx.beginPath(); ctx.arc(wx, -28, 10, 0, 7); ctx.fill(); ctx.fillStyle = C(blk); for (let k = 0; k < 8; k++) { const b = a + k * Math.PI / 4; ctx.beginPath(); ctx.arc(wx + Math.cos(b) * 16, -28 + Math.sin(b) * 16, 1.8, 0, 7); ctx.fill(); }
        ctx.fillStyle = 'rgba(62,50,32,' + (.55 * (1 - hz)) + ')'; ctx.beginPath(); ctx.arc(wx, -28, 26, .15, Math.PI - .15); ctx.fill(); }
    // sprocket + idler
    ctx.fillStyle = C(dk); ctx.beginPath(); ctx.arc(150, -36, 20, 0, 7); ctx.fill(); ctx.fillStyle = C(base, .4); for (let k = 0; k < 12; k++) { const b = a * 1.2 + k * Math.PI / 6; ctx.fillRect(150 + Math.cos(b) * 19 - 2.5, -36 + Math.sin(b) * 19 - 2.5, 5, 5); } ctx.beginPath(); ctx.arc(150, -36, 8, 0, 7); ctx.fill();
    ctx.fillStyle = C(dk); ctx.beginPath(); ctx.arc(-154, -36, 18, 0, 7); ctx.fill(); ctx.fillStyle = C(base, .45); ctx.beginPath(); ctx.arc(-154, -36, 8, 0, 7); ctx.fill();
    // hull
    const hull = new Path2D(); hull.moveTo(-170, -62); hull.lineTo(-172, -104); hull.lineTo(150, -104); hull.lineTo(170, -98); hull.lineTo(172, -62); hull.closePath();
    ctx.fillStyle = C(base); ctx.fill(hull);
    ctx.save(); ctx.clip(hull);
    ctx.fillStyle = C(grn, 0, .85); [[-120, -84, 50, 16], [10, -96, 60, 12], [110, -78, 46, 18]].forEach(function (b) { ctx.beginPath(); ctx.ellipse(b[0], b[1], b[2], b[3], .2, 0, 7); ctx.fill(); });
    ctx.fillStyle = C(brn, 0, .8); [[-40, -76, 44, 9], [70, -100, 40, 8], [-160, -98, 30, 8]].forEach(function (b) { ctx.beginPath(); ctx.ellipse(b[0], b[1], b[2], b[3], -.15, 0, 7); ctx.fill(); });
    ctx.fillStyle = 'rgba(0,0,0,' + (.06 * (1 - hz)) + ')'; for (let xx = -170; xx < 172; xx += 4) ctx.fillRect(xx, -100 + (xx % 3), 1.2, 30);
    ctx.fillStyle = 'rgba(0,0,0,' + (.3 * (1 - hz)) + ')'; ctx.fillRect(-172, -70, 344, 8);
    ctx.restore();
    ctx.fillStyle = C(lit, 0, .6 * (1 - hz)); ctx.fillRect(-172, -105, 322, 2.4);
    ctx.fillStyle = C(base, .15); ctx.fillRect(-176, -64, 352, 7);                                        // track guard
    ctx.strokeStyle = C(dk); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-150, -76); for (let xx = -150; xx < 130; xx += 20) ctx.lineTo(xx + 10, -77 + Math.sin(xx) * 1.4); ctx.stroke();   // tow cable
    ctx.fillStyle = C(dk); ctx.fillRect(152, -116, 10, 10); ctx.fillStyle = 'rgba(255,230,170,' + (.3 * (1 - hz)) + ')'; ctx.fillRect(160, -114, 3, 6);  // Bosch light
    ctx.fillStyle = C(dk); for (let i = 0; i < 3; i++) ctx.fillRect(126 + i * 12, -100, 9, 26);         // spare links
    ctx.fillStyle = C(dk); ctx.fillRect(-166, -132, 7, 30); ctx.fillRect(-152, -132, 7, 30); ctx.fillStyle = C(blk); ctx.fillRect(-168, -136, 11, 6); ctx.fillRect(-154, -136, 11, 6);
    // Balkenkreuz on hull side
    ctx.save(); ctx.translate(-92, -84); ctx.fillStyle = C([236, 232, 220]); ctx.fillRect(-13, -13, 26, 26); ctx.fillStyle = C(blk); ctx.fillRect(-9, -9, 18, 18); ctx.fillStyle = C([236, 232, 220]); ctx.fillRect(-11, -3, 22, 6); ctx.fillRect(-3, -11, 6, 22); ctx.fillStyle = C(blk); ctx.fillRect(-9, -1.6, 18, 3.2); ctx.fillRect(-1.6, -9, 3.2, 18); ctx.restore();
    // turret
    const tx = -10 + tr * 20, tur = new Path2D(); tur.moveTo(tx - 64, -104); tur.quadraticCurveTo(tx - 88, -106, tx - 88, -130); tur.quadraticCurveTo(tx - 86, -154, tx - 62, -158); tur.lineTo(tx + 58, -158); tur.lineTo(tx + 66, -152); tur.lineTo(tx + 66, -106); tur.closePath();
    ctx.fillStyle = C(base, .05); ctx.fillRect(tx - 112, -150, 30, 36); ctx.fillStyle = 'rgba(0,0,0,' + (.25 * (1 - hz)) + ')'; ctx.fillRect(tx - 112, -120, 30, 6);   // stowage bin
    ctx.fillStyle = C(base); ctx.fill(tur);
    ctx.save(); ctx.clip(tur); ctx.fillStyle = C(grn, 0, .85); ctx.beginPath(); ctx.ellipse(tx - 30, -146, 46, 12, .3, 0, 7); ctx.fill(); ctx.fillStyle = C(brn, 0, .8); ctx.beginPath(); ctx.ellipse(tx + 30, -120, 30, 9, -.3, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,' + (.06 * (1 - hz)) + ')'; for (let xx = tx - 90; xx < tx + 70; xx += 4) ctx.fillRect(xx, -152, 1.2, 42); ctx.restore();
    ctx.fillStyle = C(lit, 0, .65 * (1 - hz)); ctx.fillRect(tx - 62, -159, 120, 2.4);
    ctx.save(); ctx.translate(tx - 22, -126); ctx.scale(dir, 1); ctx.font = '700 22px "Stardos Stencil", Impact, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = C([236, 232, 220]); ctx.strokeText('007', 0, 0); ctx.fillStyle = C(blk); ctx.fillText('007', 0, 0); ctx.restore();
    ctx.fillStyle = C(base, .2); ctx.fillRect(tx - 62, -172, 34, 15); ctx.fillStyle = C(blk); for (let i = 0; i < 4; i++) ctx.fillRect(tx - 60 + i * 8, -166, 4, 3);   // cupola
    if (o.cmd) { ctx.fillStyle = C(blk); ctx.beginPath(); ctx.arc(tx - 45, -182, 8, 0, 7); ctx.fill(); ctx.fillRect(tx - 54, -178, 18, 6); ctx.fillStyle = C([60, 56, 50]); ctx.fillRect(tx - 51, -192, 14, 5); if (o.cmd > 1) { ctx.fillStyle = C(blk); ctx.fillRect(tx - 40, -186, 12, 5); } }
    ctx.fillStyle = C(dk); ctx.fillRect(tx + 30, -166, 6, 9); ctx.fillRect(tx + 40, -166, 6, 9);   // smoke dischargers
    // mantlet + 88
    const mx = tx + 66, my = -130;
    ctx.fillStyle = C(base, .12); ctx.beginPath(); ctx.roundRect(mx - 6, my - 24, 26, 48, 8); ctx.fill(); ctx.fillStyle = C(lit, 0, .4 * (1 - hz)); ctx.fillRect(mx - 4, my - 24, 20, 2);
    if (cs > .04) {
        const L = 250 * cs, r0 = 8, r1 = 6, b0 = mx + 18 - rec * cs;
        ctx.fillStyle = C(base, .18); ctx.beginPath(); ctx.moveTo(b0, my - r0); ctx.lineTo(b0 + L, my - r1); ctx.lineTo(b0 + L, my + r1); ctx.lineTo(b0, my + r0); ctx.closePath(); ctx.fill();
        ctx.fillStyle = C(lit, 0, .45 * (1 - hz)); ctx.fillRect(b0, my - r0, L, 1.6);
        ctx.fillStyle = C([236, 232, 220], 0, .9); for (let i = 0; i < 10; i++) ctx.fillRect(b0 + (14 + i * 4.4) * cs, my - r0 + .5, 1.8 * Math.max(cs, .3), r0 * 2 - 1);   // kill rings
        const e = b0 + L; ctx.fillStyle = C(dk); ctx.fillRect(e, my - 11, 12 * cs + 2, 22); ctx.fillRect(e + 16 * cs, my - 11, 12 * cs + 2, 22); ctx.fillRect(e, my - 4, 30 * cs + 2, 8);
        if (tr > .3) { ctx.fillStyle = C(dk); ctx.beginPath(); ctx.ellipse(e + 30 * cs, my, 12 * (1 - cs) + 2, 12, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(e + 30 * cs, my, 4.6 * (1 - cs) + .6, 4.6, 0, 0, 7); ctx.fill(); }
        o.muzzle = [x + dir * s * (e + 30 * cs), y + s * my];
    } else { ctx.fillStyle = C(dk); ctx.beginPath(); ctx.ellipse(mx + 8, my, 15, 12, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.arc(mx + 8, my, 5, 0, 7); ctx.fill(); o.muzzle = [x + dir * s * (mx + 8), y + s * my]; }
    ctx.restore();
}
function ddpTigerFront(cx, cy, s, t, o) { // head-on: hull, tracks, turret, muzzle brake staring at the camera
    o = o || {}; const hz = o.haze || 0, C = function (c, k, a) { return ddpRGB(ddpMix(k ? ddpMix(c, [0, 0, 0], k) : c, DDP_FOG, hz), a); };
    const base = [146, 128, 82], dk = [40, 36, 28], blk = [20, 18, 14], lit = [226, 210, 160], grn = [70, 82, 48];
    function shade(x0, x1) { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, C(base, .32)); g.addColorStop(.3, C(base, 0)); g.addColorStop(.75, C(base, .12)); g.addColorStop(1, C(base, .45)); return g; }
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,' + .4 * (1 - hz) + ')'; ctx.beginPath(); ctx.ellipse(0, 4, 270, 18, 0, 0, 7); ctx.fill();
    // tracks + guards
    [-1, 1].forEach(function (sd) { const x0 = sd > 0 ? 158 : -236; ctx.fillStyle = C(blk); ctx.fillRect(x0, -118, 78, 118); ctx.fillStyle = C(dk); for (let i = 0; i < 12; i++) ctx.fillRect(x0 + 4, -114 + ((i * 10 + t * 70) % 116), 70, 5);
        ctx.fillStyle = C(base, .2); ctx.fillRect(x0 - 6, -130, 90, 12); ctx.fillStyle = C(lit, 0, .45 * (1 - hz)); ctx.fillRect(x0 - 6, -131, 90, 2); ctx.fillStyle = C(dk); ctx.fillRect(x0 + (sd > 0 ? 70 : 4), -118, 8, 60); });
    // lower glacis + front plate
    ctx.fillStyle = shade(-160, 160); ctx.beginPath(); ctx.moveTo(-150, -70); ctx.lineTo(150, -70); ctx.lineTo(136, -22); ctx.lineTo(-136, -22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C(dk); for (let i = 0; i < 8; i++) ctx.fillRect(-128 + i * 32, -66, 26, 34);
    ctx.fillStyle = C(blk); ctx.beginPath(); ctx.arc(-110, -30, 8, 0, 7); ctx.arc(110, -30, 8, 0, 7); ctx.fill();
    ctx.fillStyle = shade(-158, 158); ctx.fillRect(-158, -170, 316, 100);
    ctx.save(); ctx.beginPath(); ctx.rect(-158, -170, 316, 100); ctx.clip(); ctx.fillStyle = C(grn, 0, .7); ctx.beginPath(); ctx.ellipse(-60, -120, 70, 20, .3, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(110, -150, 50, 14, -.4, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,' + (.06 * (1 - hz)) + ')'; for (let xx = -158; xx < 158; xx += 4) ctx.fillRect(xx, -166, 1.2, 92); ctx.restore();
    ctx.fillStyle = C(lit, 0, .5 * (1 - hz)); ctx.fillRect(-158, -171, 316, 2.4);
    ctx.fillStyle = C(dk); ctx.fillRect(-112, -146, 56, 18); ctx.fillStyle = '#050505'; ctx.fillRect(-106, -139, 44, 4);                         // driver visor
    ctx.fillStyle = C(dk); ctx.beginPath(); ctx.arc(84, -134, 15, 0, 7); ctx.fill(); ctx.fillStyle = C(base, .3); ctx.beginPath(); ctx.arc(84, -134, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.arc(84, -134, 3, 0, 7); ctx.fill();
    ctx.fillStyle = C(dk); ctx.fillRect(-150, -192, 18, 20); ctx.fillStyle = 'rgba(255,230,170,' + .35 * (1 - hz) + ')'; ctx.beginPath(); ctx.arc(-141, -182, 6, 0, 7); ctx.fill();
    // turret
    ctx.fillStyle = shade(-128, 128); ctx.beginPath(); ctx.moveTo(-128, -170); ctx.lineTo(-130, -236); ctx.quadraticCurveTo(-128, -262, -100, -264); ctx.lineTo(100, -264); ctx.quadraticCurveTo(128, -262, 130, -236); ctx.lineTo(128, -170); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C(lit, 0, .55 * (1 - hz)); ctx.fillRect(-100, -265, 200, 3);
    ctx.fillStyle = C(base, .25); ctx.fillRect(-82, -284, 46, 20); ctx.fillStyle = C(blk); for (let i = 0; i < 4; i++) ctx.fillRect(-80 + i * 11, -278, 6, 4);
    if (o.cmd) { ctx.fillStyle = C(blk); ctx.beginPath(); ctx.arc(-59, -296, 13, 0, 7); ctx.fill(); ctx.fillRect(-76, -292, 34, 9); ctx.fillStyle = C([60, 56, 50]); ctx.fillRect(-72, -309, 26, 7); }
    ctx.fillStyle = C(dk); ctx.fillRect(96, -258, 10, 12); ctx.fillRect(110, -256, 10, 12);
    // mantlet
    ctx.fillStyle = C(base, .08); ctx.beginPath(); ctx.roundRect(-98, -244, 196, 74, 18); ctx.fill(); ctx.fillStyle = C(lit, 0, .35 * (1 - hz)); ctx.fillRect(-90, -243, 180, 2);
    ctx.fillStyle = C(blk); ctx.fillRect(-70, -216, 10, 6); ctx.fillRect(-40, -230, 14, 4);
    // barrel toward camera + muzzle brake
    const mz = o.mz || 1, bx = 14, by = -206, fx = bx + 24 * mz, fy = by + 14 * mz, fr = 15 * (.85 + .3 * mz);
    { const an = Math.atan2(fy - by, fx - bx), nx = -Math.sin(an), ny = Math.cos(an), r0 = 13, r1 = fr * .55; ctx.fillStyle = C(dk); ctx.beginPath(); ctx.ellipse(bx, by, 22, 20, 0, 0, 7); ctx.fill(); ctx.fillStyle = C(base, .22); ctx.beginPath(); ctx.moveTo(bx + nx * r0, by + ny * r0); ctx.lineTo(fx + nx * r1, fy + ny * r1); ctx.lineTo(fx - nx * r1, fy - ny * r1); ctx.lineTo(bx - nx * r0, by - ny * r0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C(lit, 0, .5 * (1 - hz)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx - nx * r0 * .7, by - ny * r0 * .7); ctx.lineTo(fx - nx * r1 * .7, fy - ny * r1 * .7); ctx.stroke(); ctx.fillStyle = C([236, 232, 220], 0, .85); for (let i = 0; i < 6; i++) { const q = .1 + i * .05, qx = bx + (fx - bx) * q, qy = by + (fy - by) * q, rr = r0 + (r1 - r0) * q; ctx.save(); ctx.translate(qx, qy); ctx.rotate(an); ctx.fillRect(-1, -rr, 2.4, rr * 2); ctx.restore(); } }
    ctx.save(); ctx.translate(fx, fy); const k = fr / 15; ctx.scale(k, k);
    ctx.fillStyle = C(dk); ctx.beginPath(); ctx.roundRect(-30, -20, 60, 40, 9); ctx.fill(); ctx.fillStyle = '#060606'; ctx.fillRect(-30, -5, 13, 10); ctx.fillRect(17, -5, 13, 10);
    ctx.fillStyle = C(base, .35); ctx.beginPath(); ctx.arc(0, 0, 15, 0, 7); ctx.fill(); ctx.fillStyle = '#030303'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill();
    if (o.glow) { ctx.fillStyle = 'rgba(255,170,80,' + o.glow + ')'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill(); }
    ctx.strokeStyle = C(lit, 0, .45 * (1 - hz)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 15, -2.6, -1); ctx.stroke(); ctx.restore();
    o.muzzle = [cx + fx * s, cy + fy * s];
    ctx.restore();
}
function ddpShTurret(x, y, s, rot) { // blown-off Sherman turret
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = '#2e3020'; ctx.beginPath(); ctx.moveTo(-41, 20); ctx.lineTo(-47, 4); ctx.lineTo(-31, -14); ctx.lineTo(7, -18); ctx.lineTo(37, -8); ctx.lineTo(47, 4); ctx.lineTo(43, 19); ctx.closePath(); ctx.fill(); ctx.fillRect(43, 0, 96, 6); ctx.fillStyle = 'rgba(255,130,40,.8)'; ctx.fillRect(-40, 16, 82, 5); ctx.restore();
}
function ddpLeaves(x, y, s, k, seed) { // hedge burst: branches and leaves
    if (k < 0 || k > 2.4) return; const P = ddpEnsure(); ctx.globalAlpha = Math.max(0, .7 - k * .3); for (let i = 0; i < 8; i++) { const r = (60 + k * 120) * s; ctx.drawImage(P.dust, x + (i - 4) * 40 * s - r, y - 60 * s - r * .6 - k * 30 * s, r * 2, r * 1.3); } ctx.globalAlpha = 1;
    for (let i = 0; i < 60; i++) { const a = -Math.PI / 2 + (ddpR(i + seed) - .5) * 2.8, v = (200 + ddpR(i * 3 + seed) * 500) * s, px = x + Math.cos(a) * v * k * .8, py = y - 40 * s + Math.sin(a) * v * k * .9 + 500 * s * k * k; ctx.save(); ctx.translate(px, py); ctx.rotate(k * (6 + i % 5) + i); ctx.fillStyle = i % 4 ? 'rgba(46,66,34,' + Math.max(0, 1 - k / 2.4) + ')' : 'rgba(60,46,30,' + Math.max(0, 1 - k / 2.4) + ')'; if (i % 4) { ctx.beginPath(); ctx.ellipse(0, 0, 7 * s, 3.5 * s, 0, 0, 7); ctx.fill(); } else ctx.fillRect(-22 * s, -2 * s, 44 * s, 4 * s); ctx.restore(); }
}

/* ---------------- shots ---------------- */
function ddpM4Env(hv, t, pan, o) { // sky, distant bocage in fog, lane
    o = o || {}; const hz = hv * (o.hz || .48), sx = o.sx || 1180;
    ddpSky(hz, t, pan * .3, sx - pan * .05, 0, 0, DDP_M4PAL);
    ddpBocage(hz + 6, 50, .86, pan * .2, t, 3, 0); ddpM4Fog(hz - 80, hz + 60, t, .8, 8, 1);
    ddpBocage(hz + 40, 70, .62, pan * .45, t, 7, .12); ddpM4Fog(hz - 20, hz + 110, t, .7, 12, 4);
    return hz;
}
function ddpM4ShotA(t, hv) { // the column in the fog
    const pan = t * 34, P = ddpEnsure(); cs2Once('m4wind', t > .1, function () { playTone(180, 150, 3.6, .02, 'sawtooth'); }); cs2Once('m4art1', t > 2.6, function () { playDistantArtillery(); });
    ctx.save(); ddpCam(hv, pan * .6, 0, 1.04 + t * .008, 0);
    const hz = ddpM4Env(hv, t, pan, { hz: .42 }), ly = hv * .8;
    ddpBocage(hz + 100, 90, .38, pan * .7, t, 11, .16); ddpM4Fog(hz + 40, hz + 170, t, .55, 16, 7);
    ddpLane(ly, hv, t, .25);
    ddpCrows(t - 1.2, 7, 900, hz - 40, 3);
    for (let i = 0; i < 3; i++) { const x = 1060 - i * 440 + t * 46, s = 1.2, hzz = .16 + i * .12; ddpSherman(x, ly + i * 6, s, t, { gun: .02, haze: hzz, skin: i === 2 ? ddpPlayerSkin() : null }); ddpBust(x - 17 * s, ly + i * 6 - 100 * s, s * 1.35, i + 1, hzz, t, .3);
        for (let k = 0; k < 2; k++) ddpMan(x - 190 - k * 60, ly + 34 + i * 6, 1.7, t, { run: .4, spd: 5, ph: i * 2 + k, haze: hzz + .1 }); }
    ddpM4Fog(ly - 120, ly + 40, t, .45, 20, 9);
    // foreground hedge banks framing the lane
    ddpBocage(hv * 1.06, 120, 0, pan * 1.3, t, 21, .1, true);
    ctx.restore();
}
function ddpM4ShotB(u, hv) { // ambush from the fog
    const P = ddpEnsure(), F1 = 1.0, H1 = 1.14, F2 = 3.2, H2 = 3.34, tiger = [1470, hv * .7];
    cs2Once('m4f1', u > F1, function () { playExplosionSound(.6); try { playTone(900, 120, .3, .05, 'sawtooth'); } catch (e) {} }); cs2Once('m4h1', u > H1, function () { playExplosionSound(1.4); });
    cs2Once('m4f2', u > F2, function () { playExplosionSound(.6); try { playTone(900, 120, .3, .05, 'sawtooth'); } catch (e) {} }); cs2Once('m4h2', u > H2, function () { playExplosionSound(1.3); }); cs2Once('m4rum', u > 4.0, function () { playTone(52, 72, 3.6, .09, 'sawtooth'); });
    let shake = 0; [H1, H2].forEach(function (hh) { const d = u - hh; if (d >= 0 && d < .9) shake = Math.max(shake, Math.pow(1 - d / .9, 2) * 22); });
    const sh = ddpShakeAt(u, shake), push = cs2E(cs2C((u - 3.8) / 1.4, 0, 1));
    ctx.save(); ddpCam(hv, 120 + push * 360 + sh[0], sh[1] - push * 30, 1.0 + push * .3, 0);
    const hz = ddpM4Env(hv, u + 6, 0, { hz: .42, sx: 1300 }), ly = hv * .8;
    ddpBocage(hz + 100, 90, .38, 0, u, 11, .16); ddpM4Fog(hz + 40, hz + 170, u, .55, 16, 7);
    // the hidden Tiger, just a shape in the mist
    ddpTiger(tiger[0], tiger[1], .8, u, { dir: -1, haze: .8, move: 0, exhaust: false, tr: .05 });
    ddpLane(ly, hv, u, .25);
    const tanks = [{ x: 1000, hit: H1 }, { x: 600, hit: H2 }, { x: 250, hit: 99 }];
    tanks.forEach(function (k, i) { const d = u - k.hit, x = k.x + Math.min(u, k.hit) * 40 + (i === 2 && u > H2 ? -(u - H2) * 30 : 0), y = ly + i * 6, s = 1.1;
        ddpSherman(x, y, s, u, { gun: .02, haze: .18 + i * .08, noTurret: i === 0 && d > 0, move: d > 0 ? 0 : 1, skin: i === 2 ? ddpPlayerSkin() : null });
        if (d <= 0) ddpBust(x - 17 * s, y - 100 * s, s * 1.35, i + 1, .2, u, .3);
        if (d > 0) { ddpBlast(x, y - 50, 1.6, d, i * 7, .7); ddpSmoke(x, y - 70, 1.2, u, i * 3, 120, 380, Math.min(1, d)); ddpFire(x - 10, y - 60, .9, u, i);
            if (d < .3) ddpFlashGlow(x, y - 60, 380, 1 - d / .3);
            if (i === 0 && d < 2.4) { const tx = x - 3 * s + d * 120, ty = y - 80 * s - 900 * d + 980 * d * d; if (ty < y) { ddpShTurret(tx, ty, s, d * 7); ctx.globalAlpha = .6; ctx.drawImage(P.fire, tx - 60, ty - 40, 120, 80); ctx.globalAlpha = 1; } } } });
    // the flash in the mist + the shot
    [[F1, tanks[0]], [F2, tanks[1]]].forEach(function (f) { const d = u - f[0], mx = tiger[0] - 250 * .8 - 40, my = tiger[1] - 130 * .8; if (d >= 0 && d < .5) { ddpFlashGlow(mx, my, 420 * (1 - d / .5) + 80, 1 - d / .5); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = (1 - d / .5) * .7; ctx.drawImage(P.warm, mx - 700, my - 160, 1400, 320); ctx.restore(); }
        if (d >= 0 && d < .14) { const tk = f[1], tx = tk.x + f[0] * 40, ty = ly - 50; ddpTracer(mx, my, tx, ty, d / .14, .5, 6); } });
    ddpM4Fog(ly - 120, ly + 40, u, .4, 20, 9);
    ddpBocage(hv * 1.06, 120, 0, 0, u, 21, .1, true);
    ctx.restore();
    return (u - H1 >= 0 && u - H1 < .08) || (u - H2 >= 0 && u - H2 < .08) ? .45 : 0;
}
function ddpM4ShotC(u, hv) { // THE REVEAL: the ground shakes, the Ghost comes through the hedge
    const P = ddpEnsure(); cs2Once('m4rv', u > .1, function () { playTone(40, 60, 6.8, .12, 'sawtooth'); });
    const thud = (u % .62) < .1 ? 1 - (u % .62) / .1 : 0; if (thud > .9) cs2Once('m4th' + Math.floor(u / .62), true, function () { playTone(60, 30, .25, .08, 'sine'); });
    const burst = 2.3, bd = u - burst; cs2Once('m4burst', bd > 0, function () { playExplosionSound(.8); });
    const prog = cs2C(u / 4.8, 0, 1), e = 1 - Math.pow(1 - prog, 2.2), through = bd > 0;
    const shake = thud * (2 + prog * 5) + (bd > 0 && bd < .6 ? (1 - bd / .6) * 14 : 0), sh = ddpShakeAt(u, shake);
    ctx.save(); ddpCam(hv, sh[0] + 40 - u * 8, sh[1] - 40, 1.06 + u * .012, 0);
    const hz = ddpM4Env(hv, u + 12, 0, { hz: .52, sx: 1100 }), gy = hv * .84;
    const tx = cs2L(1380, 1000, e), ty = through ? cs2L(hv * .8, gy, cs2E(cs2C(bd / 1.4, 0, 1))) : hv * .8, ts = through ? cs2L(1.35, 2.15, cs2E(cs2C(bd / 1.4, 0, 1))) : 1.35, th = Math.max(0, .85 - u * .3) * (through ? Math.max(0, 1 - bd * .8) : 1);
    const tr = cs2E(cs2C((u - 4.4) / 1.4, 0, 1)) * .82, cmd = u > 3.6 ? 2 : 1;
    if (!through) ddpTiger(tx, ty, ts, u, { dir: -1, haze: th, tr: tr, cmd: cmd });
    ddpBocage(hv * .8, 110, .12, 0, u, 31, .14);
    if (through) ddpTiger(tx, ty, ts, u, { dir: -1, haze: th, tr: tr, cmd: cmd });
    ddpLeaves(tx - 260, hv * .78, 1.3, bd, 4);
    // ground + the puddle
    const gg = ctx.createLinearGradient(0, gy - 20, 0, hv); gg.addColorStop(0, 'rgba(60,58,40,0)'); gg.addColorStop(.3, 'rgb(46,44,30)'); gg.addColorStop(1, 'rgb(16,16,10)'); ctx.fillStyle = gg; ctx.fillRect(-800, gy - 20, 3200, hv);
    const px = 520, py = hv * .965; ctx.fillStyle = 'rgba(176,186,176,.55)'; ctx.beginPath(); ctx.ellipse(px, py, 230, 26, 0, 0, 7); ctx.fill();
    for (let k = 0; k < 4; k++) { const ph = ((u % .62) / .62 + k * .25) % 1; ctx.strokeStyle = 'rgba(240,244,236,' + (.6 * (1 - ph)) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(px, py, 20 + ph * 200, 2 + ph * 22, 0, 0, 7); ctx.stroke(); }
    ctx.fillStyle = '#0d0e09'; for (let i = 0; i < 50; i++) { const x = i * 38 - 200 + ddpR(i) * 20, hh = 30 + ddpR(i * 3) * 90, sw = Math.sin(u * 1.5 + i) * 6 + thud * 4; ctx.beginPath(); ctx.moveTo(x - 4, hv + 30); ctx.quadraticCurveTo(x + sw * .4, hv - hh * .5, x + sw, hv - hh); ctx.quadraticCurveTo(x + sw * .5 + 5, hv - hh * .5, x + 6, hv + 30); ctx.fill(); }
    ddpM4Fog(hv * .55, hv * .9, u, .3 * (1 - prog * .5), 18, 13);
    ctx.restore();
}
function ddpM4ShotD(u, hv) { // close-ups: tracks, then the muzzle staring down the camera
    const P = ddpEnsure();
    if (u < 2.4) { // track macro
        const sh = ddpShakeAt(u, 3 + Math.sin(u * 20) * 1.5); cs2Once('m4trk', u > .05, function () { playTone(90, 70, 2.2, .07, 'square'); });
        ctx.save(); ctx.translate(sh[0], sh[1]);
        ddpSky(hv * .3, u, 0, 1300, 0, 0, DDP_M4PAL); ddpBocage(hv * .32, 60, .7, 0, u, 5, 0); ddpM4Fog(hv * .1, hv * .5, u, .8, 20, 2);
        const gy = hv * .84; ctx.fillStyle = 'rgb(40,38,26)'; ctx.fillRect(-100, hv * .7, 1800, hv);
        ddpTiger(1100 - u * 320, gy, 3.9, u * 1.6, { dir: -1, haze: 0, move: 1.5, exhaust: false });
        for (let i = 0; i < 40; i++) { const k = (u * 1.6 + ddpR(i)) % 1, x = 300 + ddpR(i * 3) * 1000 + k * 200, y = hv * .9 - Math.sin(k * Math.PI) * (100 + ddpR(i) * 160); ctx.fillStyle = 'rgba(52,42,26,' + (1 - k) + ')'; ctx.beginPath(); ctx.arc(x, y, 3 + ddpR(i + 5) * 5, 0, 7); ctx.fill(); }
        ddpM4Fog(hv * .6, hv, u, .25, 30, 3);
        ctx.restore(); return 0;
    }
    const v = u - 2.4, fire = 3.3, fd = v - fire; cs2Once('m4bigshot', fd > 0, function () { playExplosionSound(1.6); try { playTone(700, 60, .6, .08, 'sawtooth'); } catch (e) {} });
    const push = cs2E(cs2C(v / 3.3, 0, 1)), z = 1 + push * 1.6, sh = ddpShakeAt(v, .8 + (fd > 0 ? 20 : 0) + push * 1.5), TS = 1.3, cy = hv * .95, mxF = 800 + 24 * TS, myF = cy - 192 * TS;
    ctx.save(); ctx.translate(800 + sh[0], hv * .5 + sh[1]); ctx.scale(z, z); ctx.translate(-cs2L(800, mxF, push), -cs2L(hv * .58, myF, push));
    ddpSky(hv * .62, u, 0, 1200, 0, 0, DDP_M4PAL); ddpBocage(hv * .64, 70, .75, 0, u, 9, 0); ddpM4Fog(hv * .3, hv * .8, u, .8, 14, 5);
    const lane = ctx.createLinearGradient(0, hv * .66, 0, hv); lane.addColorStop(0, 'rgb(112,112,98)'); lane.addColorStop(1, 'rgb(30,30,20)'); ctx.fillStyle = lane; ctx.fillRect(-400, hv * .66, 2400, hv);
    ddpTigerFront(800, cy, TS, u, { haze: cs2C(.55 - v * .25, 0, .55), cmd: 1, mz: 1 + push * .4, glow: fd > -0.5 && fd < 0 ? (fd + .5) / .5 * .8 : 0 });
    ddpM4Fog(hv * .72, hv * 1.05, u, .35, 20, 8);
    ctx.restore();
    if (fd > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ddpFlashGlow(800, hv * .5, 1400, 1); ctx.restore(); ctx.fillStyle = 'rgba(255,248,230,' + Math.min(1, .6 + fd * 4) + ')'; ctx.fillRect(-100, -100, 1800, hv + 200); }
    return fd > 0 ? 1 : 0;
}
function ddpM4Card(u, w, h) { // the boss title card
    if (u < 0) return; const k = cs2E(cs2C(u / .28, 0, 1)), out = cs2C((2.0 - u) / .25, 0, 1);
    cs2Once('m4card', true, function () { playExplosionSound(1.2); playTone(70, 40, 1.4, .12, 'sawtooth'); });
    ctx.save(); ctx.globalAlpha = out;
    ctx.fillStyle = 'rgba(0,0,0,' + (.35 * k) + ')'; ctx.fillRect(0, 0, w, h);
    const rv = ctx.createRadialGradient(w / 2, h / 2, w * .3, w / 2, h / 2, w * .7); rv.addColorStop(0, 'rgba(120,0,0,0)'); rv.addColorStop(1, 'rgba(140,10,10,' + (.35 + Math.sin(u * 8) * .08) * k + ')'); ctx.fillStyle = rv; ctx.fillRect(0, 0, w, h);
    const sx = cs2L(-w * .7, 0, k); ctx.translate(sx, 0);
    const py = h * .5, ph = 250; ctx.save(); ctx.transform(1, 0, -.18, 1, 0, 0); ctx.fillStyle = 'rgba(10,8,6,.88)'; ctx.fillRect(-80, py - ph / 2 + 30, w * .62, ph); ctx.fillStyle = '#a3170f'; ctx.fillRect(-80, py - ph / 2 + 30, w * .62, 7); ctx.fillRect(-80, py + ph / 2 + 23, w * .62, 4); ctx.restore();
    const x0 = w * .07; ctx.textAlign = 'left';
    ctx.fillStyle = '#c9a85a'; ctx.font = '700 14px "Special Elite", "Courier New", monospace'; ctx.fillText('PANZERKAMPFWAGEN VI AUSF. E', x0 + 6, py - 74);
    ctx.font = '700 104px "Stardos Stencil", Impact, sans-serif'; ctx.fillStyle = '#7a0f0a'; ctx.fillText('TIGER', x0 + 6, py + 14); ctx.fillStyle = '#f2ead2'; ctx.fillText('TIGER', x0, py + 8);
    ctx.font = '700 18px "Special Elite", "Courier New", monospace'; ctx.fillStyle = '#e8c968'; ctx.fillText('« DER GEIST »  ·  THE HEDGEROW GHOST', x0 + 4, py + 40);
    const rows = [['FRONT ARMOUR', '100 mm', 1], ['MAIN GUN', '88 mm KwK 36', .9], ['KILLS', '', 0]];
    rows.forEach(function (r, i) { const st = .45 + i * .3, kk = cs2C((u - st) / .25, 0, 1); if (kk <= 0) return; cs2Once('m4row' + i, true, function () { playTone(1500, 1300, .04, .05, 'square'); }); const y = py + 70 + i * 22; ctx.globalAlpha = out * kk; ctx.font = '700 12px monospace'; ctx.fillStyle = '#b8ad8a'; ctx.fillText(r[0], x0 + 4, y);
        if (i < 2) { for (let b = 0; b < 12; b++) { ctx.fillStyle = b < Math.round(12 * r[2] * kk) ? '#e2b13a' : 'rgba(255,255,255,.12)'; ctx.fillRect(x0 + 120 + b * 13, y - 10, 10, 11); } ctx.fillStyle = '#f2ead2'; ctx.fillText(r[1], x0 + 290, y); }
        else { const n = Math.min(27, Math.floor(cs2C((u - st) / .7, 0, 1) * 27)); ctx.strokeStyle = '#e2b13a'; ctx.lineWidth = 2; for (let j = 0; j < n; j++) { const gx = x0 + 120 + Math.floor(j / 5) * 34 + (j % 5) * 5; ctx.beginPath(); if (j % 5 === 4) { ctx.moveTo(gx - 22, y - 9); ctx.lineTo(gx + 2, y); } else { ctx.moveTo(gx, y - 11); ctx.lineTo(gx, y); } ctx.stroke(); } ctx.fillStyle = '#ff5a40'; ctx.font = '700 18px "Stardos Stencil", Impact, sans-serif'; ctx.fillText(String(n), x0 + 330, y + 2); } });
    ctx.globalAlpha = out;
    const hb = cs2C((u - .3) / .8, 0, 1), by = py + 150, bw = w * .44; ctx.fillStyle = '#e04a32'; ctx.font = '700 13px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('☠  BOSS', x0 + 4, by - 8); ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(x0, by, bw, 14); ctx.fillStyle = '#b81d12'; ctx.fillRect(x0 + 2, by + 2, (bw - 4) * hb, 10); ctx.fillStyle = 'rgba(255,190,150,.5)'; ctx.fillRect(x0 + 2, by + 2, (bw - 4) * hb, 3); ctx.strokeStyle = '#e2b13a'; ctx.lineWidth = 1.5; ctx.strokeRect(x0, by, bw, 14);
    ctx.restore();
}
function ddpM4Frame(t, w, h) {
    const U = w / 1600, hv = h / U, c = [6.4, 11.6, 18.6, 25.0]; let flash = 0; DDP.ok = true;
    ctx.save(); ctx.scale(U, U);
    if (t < c[0]) ddpM4ShotA(t, hv);
    else if (t < c[1]) flash = ddpM4ShotB(t - c[0], hv);
    else if (t < c[2]) ddpM4ShotC(t - c[1], hv);
    else flash = ddpM4ShotD(t - c[2], hv);
    ctx.restore();
    ddpBloom(w, h);
    if (t >= c[1] + 5.0 && t < c[2]) ddpM4Card(t - c[1] - 5.0, w, h);
    { const d = t - c[2]; if (d >= 0 && d < .16) flash = Math.max(flash, .5 * (1 - d / .16)); }
    return flash;
}
/* ---------- final shot background: wrecks burning in the fog, the Ghost waiting ---------- */
function ddpM4Scene4(t0, u, w, h) {
    const U = w / 1600, hv = h / U; ctx.save(); ctx.scale(U, U);
    const hz = ddpM4Env(hv, t0, 0, { hz: .46, sx: 1250 }), ly = hv * .76;
    ddpBocage(hz + 100, 90, .38, 0, t0, 11, .16); ddpM4Fog(hz + 40, hz + 170, t0, .55, 16, 7);
    ddpTiger(1380, hv * .7, .7, t0, { dir: -1, haze: .88, move: 0, tr: .3, exhaust: false });
    ddpLane(ly, hv, t0, .25);
    [[1050, 0], [720, 1]].forEach(function (k) { ddpSherman(k[0], ly + k[1] * 6, .9, t0, { gun: .1, haze: .2, noTurret: k[1] === 0, move: 0, exhaust: false }); ddpFire(k[0], ly - 50, .9, t0, k[1]); ddpSmoke(k[0], ly - 70, 1.2, t0, k[1] * 5, 130, 420, 1); });
    { const go = cs2C((u - 1.6) / 4, 0, 1), x = 860 + go * 140, s = 1.15; ddpSherman(x, ly + 70, s, t0, { gun: .02, haze: .08, move: go > 0 && go < 1 ? 1 : 0, skin: ddpPlayerSkin() }); ddpBust(x - 17 * s, ly + 70 - 100 * s, s * 1.35, 4, .08, t0, .3); }
    ddpM4Fog(ly - 120, ly + 40, t0, .45, 20, 9);
    const gnd = ctx.createLinearGradient(0, ly + 60, 0, hv); gnd.addColorStop(0, 'rgba(14,16,8,0)'); gnd.addColorStop(1, 'rgba(8,10,5,.9)'); ctx.fillStyle = gnd; ctx.fillRect(-800, ly + 60, 3200, hv);
    ctx.restore(); ddpBloom(w, h); return 0;
}
