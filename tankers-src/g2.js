/* ================= MISSION 2 : flak battery + gun line (painted) ================= */

function ddpLimb(ax, ay, bx, by, l1, l2, bend) { const dx = bx - ax, dy = by - ay, d = Math.max(.01, Math.min(Math.hypot(dx, dy), l1 + l2 - .02)), a = Math.atan2(dy, dx), c = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))); return { k: [ax + Math.cos(a + bend * c) * l1, ay + Math.sin(a + bend * c) * l1], e: [ax + Math.cos(a) * d, ay + Math.sin(a) * d] }; }
function ddpShell(x, y, ang, len) { // 88mm round: brass case + steel head
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const L = len, W = len * .15;
    ctx.fillStyle = '#c79a32'; ctx.fillRect(-L * .5, -W / 2, L * .58, W); ctx.fillStyle = '#7b5a16'; ctx.fillRect(-L * .5, -W / 2, L * .05, W); ctx.fillRect(L * .02, -W / 2 - .5, L * .04, W + 1);
    ctx.fillStyle = 'rgba(255,240,170,.7)'; ctx.fillRect(-L * .45, -W / 2 + 1, L * .5, W * .22);
    ctx.fillStyle = '#4f5246'; ctx.beginPath(); ctx.moveTo(L * .08, -W / 2 + .4); ctx.lineTo(L * .3, -W / 2 + .4); ctx.quadraticCurveTo(L * .5, -W * .3, L * .56, 0); ctx.quadraticCurveTo(L * .5, W * .3, L * .3, W / 2 - .4); ctx.lineTo(L * .08, W / 2 - .4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,230,170,.45)'; ctx.fillRect(L * .1, -W / 2 + 1, L * .24, W * .2); ctx.fillStyle = '#9a3a20'; ctx.fillRect(L * .3, -W / 2 + .4, L * .04, W - .8);
    ctx.restore();
}
function ddpGI(x, y, s, dir, o) { // articulated gun crewman. local: +x forward, y up negative, feet at 0
    o = o || {}; const ger = o.ger !== false, col = ger ? '#5d6258' : '#58593c', dkc = ger ? '#2a2e29' : '#2e301f', skin = '#b58b6a';
    const cr = o.crouch || 0, lean = o.lean === undefined ? .12 : o.lean, w = o.walk || 0, hipY = -29 + cr * 13, hip = [-1 - cr * 3, hipY];
    ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(10,6,14,.3)'; ctx.beginPath(); ctx.ellipse(0, 1, 16, 3.2, 0, 0, 7); ctx.fill();
    const sh = [hip[0] + Math.sin(lean) * 19, hip[1] - Math.cos(lean) * 19], hd = [sh[0] + Math.sin(lean) * 9 + 1, sh[1] - Math.cos(lean) * 9 - 2];
    function arm(h, shade) { if (!h) h = [sh[0] + 3, sh[1] + 25]; const L = ddpLimb(sh[0], sh[1], h[0], h[1], 13, 13, 1); ctx.strokeStyle = shade ? dkc : col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(L.k[0], L.k[1]); ctx.lineTo(L.e[0], L.e[1]); ctx.stroke(); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(L.e[0], L.e[1], 2.6, 0, 7); ctx.fill(); }
    arm(o.h2, true);
    for (let i = 0; i < 2; i++) { const ph = w + i * Math.PI, fx = w ? Math.sin(ph) * 10 : (i ? -7 : 6), fy = w ? -Math.max(0, Math.cos(ph)) * 5 : 0, L = ddpLimb(hip[0], hip[1], fx, fy - 1, 15, 15, -1); ctx.strokeStyle = i ? dkc : col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(L.k[0], L.k[1]); ctx.lineTo(L.e[0], L.e[1]); ctx.stroke(); ctx.fillStyle = '#17120e'; ctx.beginPath(); ctx.ellipse(L.e[0] + 2.2, L.e[1] + .6, 5, 2.6, 0, 0, 7); ctx.fill(); }
    ctx.strokeStyle = col; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(sh[0], sh[1]); ctx.stroke();
    ctx.strokeStyle = dkc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hip[0] - 5, hip[1] - 1); ctx.lineTo(hip[0] + 5, hip[1] - 3); ctx.stroke();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hd[0] + 1, hd[1] + 1, 4.3, 0, 7); ctx.fill();
    ctx.fillStyle = dkc; ctx.beginPath(); ctx.ellipse(hd[0], hd[1] - 1, 6.6, 5.2, -.1, Math.PI, 0); ctx.lineTo(hd[0] + 7, hd[1] + .8); ctx.lineTo(hd[0] - 9, hd[1] + 3.6); ctx.lineTo(hd[0] - 6.6, hd[1] - 1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,214,150,.4)'; ctx.fillRect(hd[0] - 3, hd[1] - 5.4, 6, 1.1);
    if (o.bino) { ctx.fillStyle = '#16140f'; ctx.fillRect(hd[0] + 2, hd[1] - 1.5, 8, 4); }
    arm(o.h1, false);
    if (o.shell) ddpShell(o.shell[0], o.shell[1], o.shell[2], o.shell[3]);
    ctx.restore();
}
function ddpCasing(x, y, age, dir, len) { if (age < 0 || age > 1) return; const vx = -dir * 150, px = x + vx * age, py = y - 130 * age + 520 * age * age; if (py > y + 60) return; ctx.save(); ctx.translate(px, py); ctx.rotate(age * 14 * dir); ctx.globalAlpha = Math.min(1, 2 * (1 - age)); ctx.fillStyle = '#d3a62c'; ctx.fillRect(-len * .4, -len * .075, len * .8, len * .15); ctx.fillStyle = '#7b5a16'; ctx.fillRect(-len * .4, -len * .075, len * .06, len * .15); ctx.restore(); }
// loader cycle (p 0..1): fetch shell -> carry -> ram into breech -> walk back
function ddpLoaderPose(p, f, gx, gy, s, aim, sc) {
    const bx = gx + f * s * (-30 * Math.cos(aim)), by = gy - 70 * s + s * (-30 * Math.sin(aim)), x1 = bx - f * 20 * sc, x0 = x1 - f * 62 * sc;
    const ease = function (k) { return k * k * (3 - 2 * k); };
    const r = { x: x0, walk: 0, crouch: 0, lean: .12, h1: null, h2: null, shell: null };
    function hold(cx, cy, ang) { const c = Math.cos(ang), n = Math.sin(ang); r.h1 = [cx + 11 * c, cy + 11 * n]; r.h2 = [cx - 9 * c, cy - 9 * n]; r.shell = [cx, cy, ang, 46]; }
    if (p < .16) { const k = Math.sin(p / .16 * Math.PI * .5); r.crouch = .75 * k; r.lean = .35 * k; r.h1 = [24, -6 - 4 * k]; r.h2 = [10, -6 - 4 * k]; if (p > .1) { const q = (p - .1) / .06; hold(18, -7 - 14 * q, .1 - .3 * q); } }
    else if (p < .5) { const k = ease((p - .16) / .34); r.x = x0 + (x1 - x0) * k; r.walk = (p - .16) * 38; r.lean = .1; hold(17, -26, -.28); }
    else if (p < .7) { const k = ease((p - .5) / .2); r.x = x1; r.lean = .06; const hx = (bx - x1) * f / sc, hy = (by - gy) / sc, c = Math.cos(aim), n = Math.sin(aim), d = -30 + 36 * k; hold(hx + c * d, hy + n * d, aim); if (k > .97) { r.shell = null; r.h1 = [hx + 8, hy + 6]; r.h2 = [hx - 8, hy + 8]; } }
    else { const k = ease((p - .7) / .3); r.x = x1 + (x0 - x1) * k; r.walk = k > 0 && k < 1 ? (p - .7) * 38 : 0; r.h1 = [6 + Math.sin(r.walk) * 4, -22]; r.h2 = [-6 - Math.sin(r.walk) * 4, -22]; }
    return r;
}

function ddpBomber(x, y, s, t, o) { // B-26 Marauder, side/below view, nose to the right, lit by a low sun behind
    o = o || {}; const seed = o.seed || 0, roll = Math.sin(t * .9 + seed) * .025;
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.3 + seed * 2) * 1.5); ctx.rotate((o.ang || 0) + roll); ctx.scale(s, s);
    const od = '#3d4130', odL = '#59603f', belly = '#7d8278', dk = '#1d1f17', rim = 'rgba(255,206,140,.85)';
    // far wing + far engine (behind fuselage)
    ctx.fillStyle = '#2a2d22'; ctx.beginPath(); ctx.moveTo(10, -3); ctx.lineTo(-6, -3); ctx.lineTo(-16, -15); ctx.lineTo(-9, -15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2f3226'; ctx.beginPath(); ctx.ellipse(10, -6, 9, 3.2, 0, 0, 7); ctx.fill();
    // horizontal tail (far side) + tall fin
    ctx.fillStyle = '#2a2d22'; ctx.beginPath(); ctx.moveTo(-34, -3); ctx.lineTo(-44, -9); ctx.lineTo(-48, -9); ctx.lineTo(-44, -2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = od; ctx.beginPath(); ctx.moveTo(-30, -3); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-45, -24, -48, -21); ctx.lineTo(-46, -2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rim; ctx.beginPath(); ctx.moveTo(-40, -22); ctx.quadraticCurveTo(-45, -24.4, -48, -21); ctx.lineTo(-47.4, -20); ctx.quadraticCurveTo(-45, -23, -40.4, -21); ctx.closePath(); ctx.fill();
    // fuselage (cigar)
    const fg = ctx.createLinearGradient(0, -6, 0, 6); fg.addColorStop(0, odL); fg.addColorStop(.45, od); fg.addColorStop(.75, '#5a5e54'); fg.addColorStop(1, belly);
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(40, 0); ctx.bezierCurveTo(40, -5, 32, -6.4, 22, -6.4); ctx.lineTo(-20, -5.4); ctx.quadraticCurveTo(-40, -4, -50, -1.4); ctx.lineTo(-50, 1.6); ctx.quadraticCurveTo(-40, 4, -20, 5.6); ctx.lineTo(22, 6.2); ctx.bezierCurveTo(32, 6.2, 40, 5, 40, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rim; ctx.beginPath(); ctx.moveTo(38, -2.6); ctx.bezierCurveTo(36, -5.6, 30, -6.4, 22, -6.4); ctx.lineTo(-20, -5.4); ctx.quadraticCurveTo(-40, -4, -50, -1.4); ctx.lineTo(-50, -.6); ctx.quadraticCurveTo(-40, -3, -20, -4.4); ctx.lineTo(22, -5.4); ctx.bezierCurveTo(30, -5.4, 35, -4.6, 38, -2.6); ctx.closePath(); ctx.fill();
    // invasion stripes round the rear fuselage
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#141410' : '#d8d4c4'; ctx.fillRect(-26 + i * 2.4, -5.2, 2.4, 10.6); }
    // glazed nose + cockpit + turret
    ctx.fillStyle = 'rgba(150,170,180,.85)'; ctx.beginPath(); ctx.moveTo(40, 0); ctx.bezierCurveTo(40, -4, 36, -5.4, 33, -5.6); ctx.lineTo(33, 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(20,20,16,.7)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(36, -5); ctx.lineTo(36, 1.4); ctx.moveTo(33, -2); ctx.lineTo(40, -2); ctx.stroke();
    ctx.fillStyle = 'rgba(150,170,180,.85)'; ctx.beginPath(); ctx.moveTo(28, -6.2); ctx.quadraticCurveTo(24, -9.4, 18, -7.6); ctx.lineTo(18, -6.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,200,.9)'; ctx.fillRect(22, -8.4, 3, 1);
    ctx.fillStyle = 'rgba(150,170,180,.8)'; ctx.beginPath(); ctx.arc(-8, -5.6, 3, Math.PI, 0); ctx.fill(); ctx.fillStyle = dk; ctx.fillRect(-7, -7.6, 7, .8);
    // star roundel
    ctx.fillStyle = '#1e2a4a'; ctx.beginPath(); ctx.arc(-14, 0, 3, 0, 7); ctx.fill(); ctx.fillStyle = '#d8d4c4'; ctx.fillRect(-18.6, -.8, 9.2, 1.8); ctx.beginPath(); ctx.arc(-14, 0, 1.6, 0, 7); ctx.fill();
    // near wing (seen slightly from below) + nacelle + prop disc
    ctx.fillStyle = '#2c2f24'; ctx.beginPath(); ctx.moveTo(14, 2); ctx.lineTo(-6, 2.4); ctx.lineTo(-20, 15); ctx.lineTo(-11, 15.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,206,140,.35)'; ctx.beginPath(); ctx.moveTo(14, 2); ctx.lineTo(-11, 15.6); ctx.lineTo(-13, 15.6); ctx.lineTo(11, 2); ctx.closePath(); ctx.fill();
    const ng = ctx.createLinearGradient(0, 2, 0, 10); ng.addColorStop(0, odL); ng.addColorStop(1, '#2a2c22'); ctx.fillStyle = ng; ctx.beginPath(); ctx.moveTo(22, 5.6); ctx.quadraticCurveTo(22, 2, 16, 2); ctx.lineTo(-4, 3); ctx.lineTo(-4, 8); ctx.lineTo(16, 9.4); ctx.quadraticCurveTo(22, 9.4, 22, 5.6); ctx.fill();
    ctx.fillStyle = 'rgba(230,230,220,.22)'; ctx.beginPath(); ctx.ellipse(23.4, 5.6, 1.6, 9.6, 0, 0, 7); ctx.fill();
    const pa = t * 40 + seed; ctx.strokeStyle = 'rgba(20,20,16,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(23.4, 5.6 + Math.cos(pa) * 9); ctx.lineTo(23.4, 5.6 - Math.cos(pa) * 9); ctx.stroke();
    ctx.fillStyle = 'rgba(255,170,90,.75)'; ctx.beginPath(); ctx.arc(-5, 6.6, 1.3, 0, 7); ctx.fill();
    ctx.restore();
}
function ddpFlak88(x, y, s, flip, aim, rec, t, o) { // 88mm FlaK 36 on its cruciform mount; flip = +1 faces right
    o = o || {}; const haze = o.haze || 0, sand = ddpMix([84, 76, 46], [140, 130, 110], haze), dk = ddpMix([30, 30, 22], [110, 110, 100], haze), lt = ddpMix([220, 190, 120], [230, 210, 170], .2);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
    ctx.fillStyle = 'rgba(14,8,18,.38)'; ctx.beginPath(); ctx.ellipse(-24, 3, 190, 10, 0, 0, 7); ctx.fill();
    // cruciform legs
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-168, -8, 336, 7); ctx.fillRect(-176, -12, 22, 12); ctx.fillRect(154, -12, 22, 12);
    ctx.fillStyle = ddpRGB(ddpMix(sand, dk, .3)); ctx.beginPath(); ctx.moveTo(-26, -8); ctx.lineTo(26, -8); ctx.lineTo(18, -42); ctx.lineTo(-18, -42); ctx.closePath(); ctx.fill();
    // carriage + elevating gear
    ctx.fillStyle = ddpRGB(sand); ctx.beginPath(); ctx.moveTo(-34, -42); ctx.lineTo(34, -42); ctx.lineTo(30, -66); ctx.lineTo(-30, -66); ctx.closePath(); ctx.fill();
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-34, -48, 68, 5); ctx.beginPath(); ctx.arc(-34, -54, 9, 0, 7); ctx.fill(); ctx.strokeStyle = ddpRGB(sand); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-34, -54, 9, 0, 7); ctx.stroke();
    // barrel assembly rotates about the trunnion
    ctx.save(); ctx.translate(0, -70); ctx.rotate(aim);
    const rb = rec;
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-14 - rb, 8, 96, 6);                                   // recoil cylinder
    ctx.fillStyle = ddpRGB(ddpMix(sand, dk, .15)); ctx.fillRect(-46 - rb, -11, 54, 24);              // breech housing
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-46 - rb, 9, 54, 4); ctx.fillRect(-52 - rb, -6, 8, 14);
    ctx.fillStyle = ddpRGB(sand); ctx.beginPath(); ctx.moveTo(6 - rb, -8); ctx.lineTo(110 - rb, -7); ctx.lineTo(214 - rb, -4.6); ctx.lineTo(214 - rb, 4.6); ctx.lineTo(110 - rb, 7); ctx.lineTo(6 - rb, 9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(108 - rb, -8.4, 4, 16.8); ctx.fillRect(200 - rb, -6, 3, 12); ctx.fillRect(214 - rb, -7.4, 16, 14.8);
    ctx.fillStyle = 'rgba(255,214,150,.5)'; ctx.fillRect(10 - rb, -8, 200, 1.4);                  // sun rim on top edge
    ctx.fillStyle = ddpRGB(dk); for (let i = 0; i < 5; i++) { ctx.fillRect(160 - rb + i * 9, -3, 5, 3); }                 // kill rings
    ctx.restore();
    // gun shield
    ctx.fillStyle = ddpRGB(ddpMix(sand, dk, .1)); ctx.beginPath(); ctx.moveTo(14, -44); ctx.lineTo(20, -112); ctx.lineTo(34, -108); ctx.lineTo(38, -60); ctx.lineTo(30, -44); ctx.closePath(); ctx.fill();
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(18, -88, 17, 3); ctx.fillStyle = 'rgba(255,214,150,.45)'; ctx.fillRect(19, -111, 14, 2);
    // kill marks on the shield
    ctx.fillStyle = '#e9e4d0'; for (let i = 0; i < 5; i++) ctx.fillRect(22 + (i % 3) * 4, -104 + Math.floor(i / 3) * 6, 2, 4);
    ctx.restore();
}
function ddpPanzer(x, y, s, flip, t, o) { // Panzer IV, dunkelgelb with camo, side view, flip = +1 faces right
    o = o || {}; const haze = o.haze || 0, sand = ddpMix([104, 90, 52], [168, 156, 132], haze), grn = ddpMix([48, 54, 32], [130, 134, 110], haze), dk = ddpMix([30, 28, 20], [110, 110, 100], haze);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
    ctx.fillStyle = 'rgba(14,8,18,.36)'; ctx.beginPath(); ctx.ellipse(-30, 3, 124, 8, 0, 0, 7); ctx.fill();
    ctx.fillStyle = ddpRGB(dk); ctx.beginPath(); ctx.moveTo(-100, -22); ctx.quadraticCurveTo(-112, -12, -102, -2); ctx.lineTo(96, -2); ctx.quadraticCurveTo(110, -10, 98, -28); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 8; i++) { ctx.fillStyle = ddpRGB(ddpMix(dk, sand, .25)); ctx.beginPath(); ctx.arc(-80 + i * 24, -11, 9, 0, 7); ctx.fill(); }
    ctx.fillStyle = ddpRGB(sand); ctx.beginPath(); ctx.moveTo(-98, -26); ctx.lineTo(-98, -56); ctx.lineTo(66, -56); ctx.lineTo(100, -34); ctx.lineTo(100, -26); ctx.closePath(); ctx.fill();
    // Schuerzen skirt plates
    ctx.fillStyle = ddpRGB(ddpMix(sand, grn, .45)); ctx.fillRect(-92, -48, 150, 24); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1.4; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-92 + i * 18.7, -48); ctx.lineTo(-92 + i * 18.7, -24); ctx.stroke(); }
    // camo bands
    ctx.fillStyle = ddpRGB(grn); ctx.globalAlpha = .75; ctx.beginPath(); ctx.moveTo(-90, -54); ctx.lineTo(-60, -44); ctx.lineTo(-30, -56); ctx.lineTo(-10, -46); ctx.lineTo(10, -56); ctx.lineTo(-8, -56); ctx.lineTo(-30, -52); ctx.lineTo(-60, -56); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,214,150,.5)'; ctx.fillRect(-98, -56.4, 164, 1.6);
    // turret
    ctx.fillStyle = ddpRGB(sand); ctx.beginPath(); ctx.moveTo(-34, -56); ctx.lineTo(-40, -76); ctx.lineTo(-24, -92); ctx.lineTo(24, -92); ctx.lineTo(38, -78); ctx.lineTo(38, -56); ctx.closePath(); ctx.fill();
    ctx.fillStyle = ddpRGB(grn); ctx.globalAlpha = .7; ctx.beginPath(); ctx.moveTo(-40, -76); ctx.lineTo(-10, -70); ctx.lineTo(14, -90); ctx.lineTo(-24, -92); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,214,150,.5)'; ctx.fillRect(-24, -92.4, 48, 1.6);
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-8, -100, 18, 9); ctx.fillRect(34, -84, 12, 12);                       // cupola, mantlet
    ctx.fillRect(46, -80.6, 92, 5); ctx.fillRect(136, -83, 10, 10);                                                    // long 75
    ctx.fillStyle = '#ece8d8'; ctx.fillRect(-14, -78, 22, 22); ctx.fillStyle = '#16140e'; ctx.fillRect(-10, -74, 14, 14); ctx.fillStyle = '#ece8d8'; ctx.fillRect(-12, -69, 18, 4); ctx.fillRect(-4, -76, 4, 18); // Balkenkreuz
    ctx.restore();
}
function ddpM2Flak(t, u, w, h, S) {
    const U = w / 1600, hv = h / U, P = ddpEnsure(), yH = S.yH / U, shots = S.shots; let flash = 0;
    ctx.save(); ctx.scale(U, U);
    ddpM2Env(hv, t, 0, { hz: yH / hv, sx: 1180, hedgeY: -4, fieldY: 54, noTrack: true });
    const gyv = yH + 128; { const gg = ctx.createLinearGradient(0, yH + 20, 0, hv); gg.addColorStop(0, 'rgba(60,44,30,.3)'); gg.addColorStop(.4, 'rgba(36,28,18,.8)'); gg.addColorStop(1, 'rgb(14,12,8)'); ctx.fillStyle = gg; ctx.fillRect(-700, yH + 20, 3000, hv); }
    // bombers with contrails
    const alive = [];
    for (let i = 0; i < 5; i++) { if (i === 2 && t >= S.hitT) continue; const p = m2csPlane(i, t, w, h); if (p.x > -150 && p.x < w + 150) { const px = p.x / U, py = p.y / U; for (let k = 1; k < 16; k++) { const r = 4 + k * 1.4; ctx.globalAlpha = .16 * (1 - k / 16); ctx.drawImage(P.white, px - 60 - k * 18 - r, py + 8 - r, r * 2, r * 2); } ctx.globalAlpha = 1; ddpBomber(px, py, 1.75, t, { seed: i }); alive.push({ x: p.x, y: p.y }); } }
    // lingering flak bursts
    shots.forEach(function (s, i) { const tp = m2csPlane(s.plane, s.t + .45, w, h), bx = (tp.x + s.off) / U, by = (tp.y + s.offY) / U, age = t - (s.t + .45); if (age < 0 || age > 5) return;
        const R = 22 + Math.min(age, 1.2) * 44, a = Math.max(0, 1 - age / 5); ctx.globalAlpha = a * .85; for (let k = 0; k < 5; k++) { const ox = Math.sin(i * 3 + k * 2.1) * R * .5 + age * 5 * (k - 2), oy = Math.cos(i + k * 1.7) * R * .4 - age * 6; ctx.drawImage(P.dark, bx + ox - R, by + oy - R, R * 2, R * 2); } ctx.globalAlpha = a * .4; ctx.drawImage(P.smoke, bx - R * 1.3, by - R * 1.2, R * 2.6, R * 2.4);
        if (age < .14) ddpFlashGlow(bx, by, 80 * (1 - age / .14) + 20, 1 - age / .14); ctx.globalAlpha = 1; });
    // the bomber that gets hit
    const ph = S.planeHit;
    if (t >= S.hitT && ph < S.crashDt) {
        const x = (S.P0.x + 70 * ph) / U, y = (S.P0.y + 24 * ph * ph) / U, ang = Math.atan2(48 * ph, 70);
        for (let k = 40; k >= 0; k--) { const tt = ph - k * .07; if (tt < 0) continue; const px = (S.P0.x + 70 * tt) / U, py = (S.P0.y + 24 * tt * tt) / U, r = 10 + k * .95; ctx.globalAlpha = k < 7 ? .6 : (.7 * (1 - k / 42)); ctx.drawImage(k < 7 ? P.fire : P.dark, px - 52 + Math.sin(k) * 4 - r, py + Math.cos(k * 1.3) * 4 - r, r * 2, r * 2); } ctx.globalAlpha = 1;
        for (let i = 0; i < 7; i++) { const dd = ph * (1 + i * .1), dx = (S.P0.x + 70 * ph) / U - 30 * dd + (cs2R(i + 4) - .5) * 110 * dd, dy = y + 40 * dd * dd + (cs2R(i + 8) - .3) * 30 * dd; ctx.save(); ctx.translate(dx, dy); ctx.rotate(dd * 6 + i); ctx.fillStyle = '#17150f'; ctx.fillRect(-9, -3, 18, 6); ctx.restore(); }
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang * .8 + Math.sin(t * 6) * .05); ddpBomber(0, 0, 1.75, t, { seed: 2 }); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .95; ctx.drawImage(P.fire, -70, -26, 80, 56); ctx.restore();
        [0, 1, 2].forEach(function (i) { const pt = ph - .5 - i * .35; if (pt > 0) { const px = (S.P0.x + 70 * pt) / U + 30 * pt, py = (S.P0.y + 24 * Math.pow(ph - .5 - i * .35, 2)) / U + 55 * pt * Math.min(1, pt * .6); if (py < gyv - 14) { ctx.save(); m2csParachute(px, py, .8 / U * .7, t, i); ctx.restore(); } } });
    }
    // gun pits
    const GUNS = [{ x: w * .14, flip: 1, seed: 1 }, { x: w * .86, flip: -1, seed: 2 }], rec = [0, 0];
    shots.forEach(function (s) { const d = t - s.t; if (d >= 0 && d < .4) rec[s.gun] = Math.max(rec[s.gun], 34 * Math.pow(1 - d / .4, 1.5)); });
    GUNS.forEach(function (g, gi) {
        g.aim = -.8 - .2 * Math.sin(t * .55 + gi * 1.9) + (t > 11 ? .05 : 0);
        const gx = g.x / U, f = g.flip;
        // panzers behind and beside
        ddpPanzer((g.x + f * 265) / U, gyv + 12, .96, f, t, { haze: .06 }); ddpPanzer((g.x - f * 285) / U, gyv + 26, .9, -f, t, { haze: .1 });
        // sandbag ring
        for (let r = 0; r < 3; r++) for (let i = 0; i < 12 - r * 2; i++) { const bx = gx - 150 + i * 28 + r * 14, by = gyv + 16 - r * 15 - 2; ctx.fillStyle = (i + r) % 2 ? '#8a7650' : '#9a8460'; ctx.beginPath(); ctx.ellipse(bx, by, 16, 8, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.stroke(); ctx.strokeStyle = 'rgba(255,200,120,.35)'; ctx.beginPath(); ctx.ellipse(bx, by - 1, 14, 6, 0, Math.PI * 1.1, Math.PI * 1.85); ctx.stroke(); }
        // ammo crates
        ctx.fillStyle = '#4a4430'; ctx.fillRect(gx - f * 170 - 14, gyv - 4, 34, 18); ctx.fillRect(gx - f * 140 - 14, gyv - 2, 30, 16);
        ddpFlak88(gx, gyv, 1.2, f, g.aim, rec[gi], t, { haze: 0 });
        // crew
        { const sc = 1.3, lp = ddpLoaderPose(((t * .34 + gi * .45) % 1 + 1) % 1, f, gx, gyv + 14, 1.2, g.aim, sc); ddpGI(lp.x, gyv + 14, sc, f, { walk: lp.walk, crouch: lp.crouch, lean: lp.lean, h1: lp.h1, h2: lp.h2, shell: lp.shell });
          const pulse = 1 - Math.min(1, ((t + gi * .6) % 1.9) / .5); ddpGI(gx - f * 330, gyv + 24, 1.35, f, { lean: -.05, h1: [18, -56 - 8 * pulse], h2: [10, -30] });
          ddpGI(gx + f * 120, gyv + 12, 1.3, f, { lean: -.18, bino: true, h1: [11, -52], h2: [7, -50] }); }
        // muzzle position
        const L = (230 - rec[gi]) * 1.2, a = g.aim * f; g.muz = { x: g.x + f * Math.cos(g.aim) * L * U, y: (gyv - 70 * 1.2 + Math.sin(g.aim) * L) * U };
    });
    // muzzle flash, blast, tracer
    shots.forEach(function (s, i) { const g = GUNS[s.gun], d = t - s.t; if (d < 0 || !g.muz) return; const mx = g.muz.x / U, my = g.muz.y / U, tp = m2csPlane(s.plane, s.t + .45, w, h), tx = (tp.x + s.off) / U, ty = (tp.y + s.offY) / U;
        if (d < .16) { const k = 1 - d / .16; ddpFlashGlow(mx, my, 150 * k + 30, k); flash = Math.max(flash, k * .04); }
        if (d < 1.2) for (let k = 0; k < 7; k++) { ctx.globalAlpha = (1 - d / 1.2) * .5; const r = 20 + k * 8 * d + 8; ctx.drawImage(P.grey, mx - g.flip * (14 * k * d) - r, my - k * 6 * d - d * 24 - r, r * 2, r * 2); } ctx.globalAlpha = 1;
        if (d < .22) { const gxx = g.x / U; for (let k = 0; k < 6; k++) { const r = (30 + d * 260) * (1 - k * .08); ctx.globalAlpha = (1 - d / .22) * .4; ctx.drawImage(P.smoke, gxx - r - k * 18 * g.flip, gyv - r * .3, r * 2, r * .6); } ctx.globalAlpha = 1; }
        if (d < .45) ddpTracer(mx, my, tx, ty, d / .45, .22, 3.4);
        { const bxx = g.x / U, byy = gyv - 70 * 1.2; ddpCasing(bxx, byy, d / 1.0, g.flip, 30); }
    });
    // crash
    if (t >= S.crashT) { const d = t - S.crashT, bx = S.crashX / U, by = S.groundY / U; ddpBlast(bx, by, 1.6, d, 4, .8); if (d < 2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.max(0, 1 - d / 1.6); ctx.drawImage(P.fire, bx - 160, by - 140, 320, 220); ctx.restore(); } ddpSmoke(bx, by - 6, 1.7, t, 9, 20, 420, Math.min(1, d * 1.2)); ddpFire(bx, by, .8, t, 3); }
    // foreground earth and grass
    const fy = hv * .68; const fgG = ctx.createLinearGradient(0, fy, 0, hv + 100); fgG.addColorStop(0, 'rgba(36,34,20,0)'); fgG.addColorStop(.18, 'rgb(36,34,20)'); fgG.addColorStop(1, 'rgb(16,14,8)'); ctx.fillStyle = fgG; ctx.fillRect(-700, fy, 3000, hv - fy + 160);
    ctx.fillStyle = '#0b0a06'; for (let i = 0; i < 80; i++) { const x = ((i * 41) % 2200) - 300, hh = 40 + ddpR(i * 3) * 110, sw = Math.sin(t * 1.6 + i) * 8; ctx.beginPath(); ctx.moveTo(x - 6, hv + 60); ctx.quadraticCurveTo(x + sw * .4, hv - hh * .5 + 40, x + sw + 3, hv - hh + 40); ctx.quadraticCurveTo(x + sw * .5 + 6, hv - hh * .5 + 40, x + 7, hv + 60); ctx.fill(); }
    ctx.restore();
    return { GUNS: GUNS, gy: S.yH + 128 * U - 30, flash: flash };
}

/* ================= SHOT 3 : on the gun line (low angle) ================= */
function ddpM2Shot3(u, w, h) {
    const U = w / 1600, hv = h / U, P = ddpEnsure(); const fires = [.35, 1.55, 2.75]; let age = 99, which = -1; fires.forEach(function (f, i) { if (u >= f) { age = u - f; which = i; } });
    const kk = age < .55 ? Math.pow(1 - age / .55, 2) : 0, sh = ddpShakeAt(u, .6 + kk * 16);
    ctx.save(); ctx.scale(U, U);
    ctx.save(); ctx.translate(800, hv * .6); ctx.rotate(Math.sin(u * 40) * kk * .008); ctx.scale(1.03 + u * .02 + kk * .05, 1.03 + u * .02 + kk * .05); ctx.translate(-800 + sh[0], -hv * .6 + sh[1]);
    const hz = hv * .5;
    ddpSky(hz, 10 + u, 0, 1130, 1.2, 0, DDP_M2PAL);
    ddpM2Env(hv, 10 + u, 0, { hz: .5, sx: 1130, hedgeY: -2, fieldY: 40, noTrack: true, skyDone: true });
    { const gg = ctx.createLinearGradient(0, hv * .52, 0, hv); gg.addColorStop(0, 'rgba(50,38,28,.35)'); gg.addColorStop(.3, 'rgb(40,32,22)'); gg.addColorStop(1, 'rgb(14,12,8)'); ctx.fillStyle = gg; ctx.fillRect(-700, hv * .52, 3000, hv); }
    // flak puffs in the sky + friendly bombers
    for (let i = 0; i < 6; i++) { const px = ((10 + u) * 60 + i * 260) % 2000 - 200, py = hz - 330 + (i % 3) * 40; ddpBomber(px, py, 1.1, 10 + u, { seed: i, ang: -.03 }); }
    for (let i = 0; i < 7; i++) { const k = ((u * .6 + i * .31) % 1.4), bx = 200 + ddpR(i * 7) * 1250, by = hz - 330 + ddpR(i * 3) * 100; ctx.globalAlpha = Math.max(0, .85 - k * .6); const R = 18 + k * 30; ctx.drawImage(P.dark, bx - R, by - R, R * 2, R * 2); ctx.globalAlpha = 1; }
    // the gun, low angle, silhouetted against the sun
    const gx = 560, gy = hv * .84, f = 1, rec = which >= 0 && age < .5 ? 40 * Math.pow(1 - age / .5, 1.5) : 0, aim = -.52 + (which >= 0 && age < .2 ? -.02 : 0);
    ddpFlak88(gx, gy, 3.1, f, aim, rec, u, { haze: 0 });
    // muzzle position (barrel 214 + brake 16 from trunnion at (0,-70))
    const L = (230 - rec) * 3.1, mx = gx + Math.cos(aim) * L, my = gy - 70 * 3.1 + Math.sin(aim) * L;
    if (which >= 0 && age < .22) { const k = 1 - age / .22; ddpFlashGlow(mx, my, 340 * k + 60, k); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = k; ctx.translate(mx, my); ctx.rotate(aim); ctx.fillStyle = 'rgba(255,238,190,1)'; ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(300 * k, -6); ctx.lineTo(420 * k, 0); ctx.lineTo(300 * k, 6); ctx.lineTo(0, 26); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (which >= 0 && age < 3) for (let k = 0; k < 9; k++) { const a2 = age, r = (40 + a2 * 120 + k * 9) * 1.3; ctx.globalAlpha = Math.max(0, .6 - a2 * .22); ctx.drawImage(P.grey, mx + 40 + k * 46 * (1 + a2) - r, my - a2 * 60 - k * 4 - r, r * 2, r * 2); } ctx.globalAlpha = 1;
    if (which >= 0 && age < .6) { for (let k = 0; k < 7; k++) { const r = (60 + age * 520) * (1 - k * .08); ctx.globalAlpha = Math.max(0, .32 - age * .5); ctx.drawImage(P.smoke, gx - r + (k - 3) * 40, gy - r * .25, r * 2, r * .5); } ctx.globalAlpha = 1; }
    // crew: loader cycles a shell into the breech, commander signals, spotter watches
    { const sc = 2.9, per = 1.2, p = (((u + .5) / per) % 1 + 1) % 1, lp = ddpLoaderPose(p, f, gx, gy + 14, 3.1, aim, sc); ddpGI(lp.x, gy + 14, sc, f, { walk: lp.walk, crouch: lp.crouch, lean: lp.lean, h1: lp.h1, h2: lp.h2, shell: lp.shell });
      const pulse = which >= 0 && age < .5 ? 1 : 0; ddpGI(gx - 560, gy + 24, 2.7, f, { lean: -.05, crouch: .2, h1: [18, -52 - 8 * pulse], h2: [10, -30] });
      ddpGI(gx + 330, gy + 12, 2.6, -1, { lean: -.18, bino: true, h1: [11, -52], h2: [7, -50] }); ddpCasing(gx - 100, gy - 70 * 3.1 + 40, which >= 0 ? age / 1.0 : 9, f, 70); }
    // sandbag wall in front
    for (let r = 0; r < 3; r++) for (let i = 0; i < 22 - r; i++) { const bx = -180 + i * 86 + r * 43, by = hv * .97 - r * 46; ctx.fillStyle = (i + r) % 2 ? '#5a4c32' : '#66563a'; ctx.beginPath(); ctx.ellipse(bx, by, 48, 24, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 2; ctx.stroke(); ctx.strokeStyle = 'rgba(255,196,120,.3)'; ctx.beginPath(); ctx.ellipse(bx, by - 2, 42, 18, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    ctx.restore();
    // drifting embers / dust motes lit by the sun
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 50; i++) { const x = ((i * 97 + u * (20 + i % 5 * 12)) % 1700) - 50, y = hv * (.2 + ddpR(i * 3) * .7) - (u * 14 * (1 + i % 3)) % 200; ctx.fillStyle = 'rgba(255,214,150,' + (.15 + .35 * ddpR(i + 4)) + ')'; ctx.fillRect(x, y, 2 + ddpR(i) * 3, 2); } ctx.restore();
    ctx.restore();
    return age < .08 ? (1 - age / .08) * .5 : 0;
}
