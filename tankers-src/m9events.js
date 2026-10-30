/* =====================================================
   MISSION 9 CHASE — set pieces: the burning barn, the spotter plane's flares,
   the forest ambush (felled tree + infantry + MG nest) and the train at the level crossing
===================================================== */
const CH_BARN_D = 5150, CH_TRACK_D = 17800, CH_AMBUSH_D = 9400;
function chEvInit() {
    const C = CH; C.flares = []; C.plane = null; C.planeRuns = [2300, 10300, 14200]; C.litUntil = 0; C.ambush = false; C.train = { state: 0 }; C.barnT = 0;
    C.props.push({ k: 'log', d: CH_AMBUSH_D, x: chRoadX(CH_AMBUSH_D) + 62, solid: 1, w: 104, h: 30 });
    C.props.push({ k: 'barn', d: CH_BARN_D, x: chEdge(CH_BARN_D, 1, 92) });
}
/* ---------- infantry ---------- */
function chInf(f, dt, now) {
    const C = CH; f.ang = m8Turn(f.ang, Math.atan2(chSY(C.d) - chSY(f.d), C.x - f.x), .15);
    const dist = Math.hypot(f.x - C.x, f.d - C.d);
    if (dist < 400 && f.d > C.d - 120 && now - f.lastShot > f.rate && !C.won && !C.lost) { f.lastShot = now; const aa = Math.atan2(-(C.d - f.d), C.x - f.x) + (Math.random() - .5) * (C.litUntil > now ? .06 : .14); C.bullets.push({ x: f.x, d: f.d, vx: Math.cos(aa) * 20, vd: -Math.sin(aa) * 20, life: 30, dmg: f.dmg, team: 'en' }); C.parts.push({ k: 'flash', x: f.x + Math.cos(aa) * 12, d: f.d - Math.sin(aa) * 12, t: now, en: 1 }); try { playTone(f.mg ? 340 : 280, 110, .05, .035, 'sawtooth'); } catch (e) {} }
}
function chFoeDie(f, now) {
    const C = CH; if (f.deadAt) return; f.deadAt = now; C.kills++;
    if (f.k === 'inf') { f.v = 0; for (let i = 0; i < 6; i++) C.parts.push({ k: 'spark', x: f.x, d: f.d, vx: (Math.random() - .5) * 3, vd: (Math.random() - .5) * 3, life: .6, decay: .06 }); chSay(f.mg ? 'MG NEST SILENCED!' : 'GOT HIM!', 900); return; }
    chBoom(f.x, f.d, f.k === 'armour' ? 1.4 : .8); chSay(f.k === 'bike' ? 'BIKE DOWN!' : f.k === 'kubel' ? 'GOT THE KÜBELWAGEN!' : 'ARMOURED CAR\'S BURNING!', 1300);
}
function chSpawnAmbush() {
    const C = CH; C.ambush = true; chSay('AMBUSH! THEY\'VE FELLED A TREE — LEFT LANE!', 2600);
    [[9260, -1, 40], [9320, 1, 36], [9470, 1, 44], [9520, -1, 30], [9600, 1, 40], [9300, -1, 70]].forEach(function (q, i) { C.foes.push({ k: 'inf', d: q[0], x: chEdge(q[0], q[1], q[2]), v: 0, hp: 30, maxHp: 30, r: 11, ang: 0, lastShot: performance.now() + 400 + i * 230, rate: 560 + i * 60, dmg: 1, seed: i * 7 + 3, gun: i % 2 ? 'mp40' : 'kar98', offset: 0, side: q[1] }); });
    C.foes.push({ k: 'inf', mg: 1, d: 9440, x: chEdge(9440, -1, 52), v: 0, hp: 70, maxHp: 70, r: 14, ang: 0, lastShot: performance.now() + 900, rate: 140, dmg: .7, seed: 41, gun: 'mg42', offset: 0, side: -1 });
}
/* ---------- update ---------- */
function chEvUpdate(dt, now) {
    const C = CH;
    // spotter plane
    if (!C.plane && C.planeRuns.length && C.d > C.planeRuns[0]) { C.planeRuns.shift(); C.plane = { x: C.cx - 260, dOff: 420, t: now, drops: [.32, .55, .78], dropped: 0 }; chSay('SPOTTER PLANE OVERHEAD!', 1800); }
    if (C.plane) { const P = C.plane; P.x += 7.5 * dt; P.dOff -= 1.2 * dt; const k = (P.x - C.cx) / 1100; while (P.drops.length && k > P.drops[0]) { P.drops.shift(); C.flares.push({ x: P.x, d: C.d + P.dOff, t: now, until: now + 11000 }); try { playTone(1200, 600, .25, .03, 'triangle'); } catch (e) {} }
        if (Math.floor(now / 120) % 2 === 0) try { playTone(95, 92, .1, .012, 'sawtooth'); } catch (e) {} if (P.x > C.cx + 1400) C.plane = null; }
    C.flares = C.flares.filter(function (f) { return now < f.until; });
    let lit = false; C.flares.forEach(function (f) { const h = Math.max(0, 1 - (now - f.t) / 11000); f.d -= .25 * dt; if (Math.hypot(f.x - C.x, f.d - C.d) < 260 + 140 * h) lit = true; });
    if (lit) { if (C.litUntil < now - 2000) chSay('FLARE! WE\'RE LIT UP — THEY CAN SEE US!', 1800); C.litUntil = now + 300; }
    // ambush
    if (!C.ambush && C.d > CH_AMBUSH_D - 650) chSpawnAmbush();
    // burning barn embers
    if (Math.abs(C.d - CH_BARN_D) < 700 && Math.random() < .5 * dt) { const bx = chEdge(CH_BARN_D, 1, 92); C.parts.push({ k: 'ember', x: bx + (Math.random() - .5) * 90, d: CH_BARN_D + (Math.random() - .5) * 80, vx: -.4 - Math.random() * .8, vd: (Math.random() - .5) * .6, life: 1, decay: .012 }); if (Math.random() < .4) C.parts.push({ k: 'smoke', x: bx + (Math.random() - .5) * 60, d: CH_BARN_D + (Math.random() - .5) * 60, vx: -1.2 - Math.random(), vd: (Math.random() - .5) * .4, life: 1, decay: .006, r: 24 + Math.random() * 20 }); }
    // the train
    const T = C.train, rx = chRoadX(CH_TRACK_D);
    if (T.state === 0 && C.d > CH_TRACK_D - 1050) { T.state = 1; T.t = now; T.xF = rx - CH_ROADW - 610; T.len = 870; chSay('TRAIN COMING — THE GATES ARE DROPPING!', 2200); try { [0, 300, 600].forEach(function (ms) { setTimeout(function () { try { playTone(1300, 1300, .18, .03, 'square'); } catch (e) {} }, ms); }); playTone(330, 330, .9, .05, 'sawtooth'); } catch (e) {} }
    if (T.state === 1) { T.xF += 7 * dt; T.gate = Math.min(1, (now - T.t) / 1400); if (Math.random() < .5 * dt) C.parts.push({ k: 'smoke', x: T.xF - 30, d: CH_TRACK_D + 6, vx: -2.5, vd: (Math.random() - .3) * .8, life: 1, decay: .012, r: 14 + Math.random() * 10 }); if (Math.floor(now / 260) !== T.chuff) { T.chuff = Math.floor(now / 260); try { playTone(70, 50, .12, .03, 'sawtooth'); } catch (e) {} }
        const x0 = T.xF - T.len, onTrack = function (x, d, r) { return Math.abs(d - CH_TRACK_D) < 26 + r && x > x0 - r && x < T.xF + r; };
        if (onTrack(C.x, C.d, 26)) { C.d = CH_TRACK_D - 54; C.v = 0; if (!T.hitAt) { T.hitAt = now; chHurt(15); C.shake = 10; try { playExplosionSound(.5); } catch (e) {} chSay('WE HIT THE TRAIN!', 1200); } }
        C.foes.forEach(function (f) { if (f.hp > 0 && f.k !== 'inf' && onTrack(f.x, f.d, f.r)) { f.d = CH_TRACK_D - 50; f.v = 0; } });
        if (x0 > rx + CH_ROADW + 900) { T.state = 2; T.up = now; chSay('TRAIN\'S PASSED — GO GO GO!', 1400); } }
    if (T.state === 2) T.gate = Math.max(0, 1 - (now - T.up) / 900);
}
/* ---------- drawing (world space, after the props) ---------- */
function chEvDrawGround(now) {
    const C = CH;
    // burning barn
    const by = chSY(CH_BARN_D); if (by > -220 && by < 920) { const bx = chEdge(CH_BARN_D, 1, 92); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 18; ctx.shadowOffsetX = 12; ctx.shadowOffsetY = 14; ctx.fillStyle = '#1a1410'; ctx.fillRect(bx - 70, by - 95, 140, 190); ctx.restore(); m9Roof(ctx, bx - 70, by - 95, 140, 190, false, ['#5a4030', '#3a2a1e', '#22180e']); ctx.fillStyle = '#100a06'; ctx.beginPath(); ctx.moveTo(bx - 40, by - 70); ctx.lineTo(bx + 30, by - 80); ctx.lineTo(bx + 50, by + 20); ctx.lineTo(bx - 10, by + 60); ctx.lineTo(bx - 50, by + 10); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 5; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(bx - 40 + i * 20, by - 70); ctx.lineTo(bx - 40 + i * 22, by + 50); ctx.stroke(); } [[-20, -30, .55], [20, 0, .7], [-5, 40, .5], [35, -60, .45]].forEach(function (q, i) { ddpFire(bx + q[0], by + q[1], q[2], now / 1000, i + 3); }); ctx.fillStyle = '#c8b060'; ctx.beginPath(); ctx.ellipse(bx - 110, by + 40, 18, 12, .3, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(bx - 98, by + 70, 16, 11, -.2, 0, 7); ctx.fill(); }
    // felled tree
    C.props.forEach(function (p) { if (p.k !== 'log') return; const y = chSY(p.d); if (y < -100 || y > 800) return; ctx.save(); ctx.translate(p.x, y); ctx.rotate(-.06); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-58, -10, 130, 30); ctx.fillStyle = m8Grad(ctx, 0, -14, 0, 14, [[0, '#7a5a3a'], [.5, '#4a3420'], [1, '#2a1c10']]); ctx.fillRect(-54, -14, 108, 28); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; for (let x = -56; x < 60; x += 9) { ctx.beginPath(); ctx.moveTo(x, -13); ctx.lineTo(x + 4, 13); ctx.stroke(); } ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.ellipse(-54, 0, 6, 14, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a6a40'; ctx.beginPath(); ctx.ellipse(-54, 0, 3, 8, 0, 0, 7); ctx.stroke(); for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? '#22341a' : '#2c4220'; ctx.beginPath(); ctx.arc(58 + (i % 3) * 14, -18 + Math.floor(i / 3) * 18, 14, 0, 7); ctx.fill(); } ctx.restore(); });
    // MG nest sandbags
    C.foes.forEach(function (f) { if (f.k === 'inf' && f.mg) { const y = chSY(f.d); m8Sandbags(ctx, f.x - 30, y - 30, 60, 14); m8Sandbags(ctx, f.x + 16, y - 26, 14, 50); } });
    // rails: gates + train
    const ty = chSY(CH_TRACK_D), T = C.train; if (ty > -140 && ty < 840) { const rx = chRoadX(CH_TRACK_D), g = T.gate || 0;
        [[rx - CH_ROADW - 18, ty - 44, 1], [rx + CH_ROADW + 18, ty + 44, -1]].forEach(function (q) { ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(q[2] > 0 ? -(1 - g) * 1.4 : Math.PI - (1 - g) * 1.4); for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#e8e0d0' : '#c02a1c'; ctx.fillRect(i * 16, -3.5, 16, 7); } ctx.restore(); m8Disc(ctx, q[0], q[1], 7, '#2a2a26', '#8a8a80'); if (T.state === 1 && Math.floor(now / 300) % 2) { ctx.fillStyle = '#ff3020'; ctx.beginPath(); ctx.arc(q[0] + 10 * q[2], q[1], 4, 0, 7); ctx.fill(); } });
        if (T.state === 1) chDrawTrain(T, ty, now); }
}
function chDrawTrain(T, ty, now) {
    let x = T.xF; const sh = function (x0, w, h) { ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x0 + 8, ty - h / 2 + 10, w, h); };
    // locomotive (facing +x)
    sh(x - 150, 150, 46); ctx.fillStyle = '#16181a'; ctx.fillRect(x - 150, ty - 23, 150, 46); const bg = ctx.createLinearGradient(0, ty - 17, 0, ty + 17); bg.addColorStop(0, '#5a5e62'); bg.addColorStop(.5, '#2a2e32'); bg.addColorStop(1, '#0e1012'); ctx.fillStyle = bg; ctx.fillRect(x - 108, ty - 17, 104, 34); ctx.strokeStyle = 'rgba(200,200,200,.2)'; for (let i = x - 100; i < x - 6; i += 14) { ctx.beginPath(); ctx.moveTo(i, ty - 17); ctx.lineTo(i, ty + 17); ctx.stroke(); } m8Disc(ctx, x - 2, ty, 17, '#121416', '#4a4e52'); ctx.fillStyle = '#c02a1c'; ctx.fillRect(x + 6, ty - 22, 6, 44); m8Disc(ctx, x - 70, ty, 7, '#0a0a0a', '#3a3a3a'); m8Disc(ctx, x - 46, ty, 5, '#2a2a2a', '#6a6a6a'); ctx.fillStyle = '#26282a'; ctx.fillRect(x - 150, ty - 25, 40, 50); ctx.fillStyle = '#ffb860'; ctx.fillRect(x - 140, ty - 8, 12, 16);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hl = ctx.createLinearGradient(x + 10, 0, x + 360, 0); hl.addColorStop(0, 'rgba(255,240,190,.35)'); hl.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = hl; ctx.beginPath(); ctx.moveTo(x + 10, ty - 6); ctx.lineTo(x + 360, ty - 90); ctx.lineTo(x + 360, ty + 90); ctx.lineTo(x + 10, ty + 6); ctx.fill(); ctx.restore();
    x -= 158; sh(x - 70, 70, 42); ctx.fillStyle = '#1a1c1e'; ctx.fillRect(x - 70, ty - 21, 70, 42); ctx.fillStyle = '#0a0a0a'; for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.arc(x - 62 + (i % 6) * 10, ty - 12 + Math.floor(i / 6) * 11, 5, 0, 7); ctx.fill(); }
    x -= 78; for (let w = 0; w < 6; w++) { const flat = w % 3 !== 1; sh(x - 100, 100, 44); if (flat) { ctx.fillStyle = '#3a3226'; ctx.fillRect(x - 100, ty - 22, 100, 44); ctx.fillStyle = m8Grad(ctx, 0, ty - 18, 0, ty + 18, [[0, '#6a6a4a'], [1, '#3a3a28']]); ctx.beginPath(); ctx.moveTo(x - 92, ty - 18); ctx.quadraticCurveTo(x - 50, ty - 24, x - 8, ty - 18); ctx.lineTo(x - 8, ty + 18); ctx.quadraticCurveTo(x - 50, ty + 24, x - 92, ty + 18); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.2; for (let i = x - 86; i < x - 10; i += 12) { ctx.beginPath(); ctx.moveTo(i, ty - 20); ctx.lineTo(i, ty + 20); ctx.stroke(); } ctx.fillStyle = '#2a2a1e'; ctx.fillRect(x - 6, ty - 3, 30, 6); }
        else { ctx.fillStyle = m8Grad(ctx, 0, ty - 22, 0, ty + 22, [[0, '#6a4a32'], [.5, '#4a3020'], [1, '#2a1a10']]); ctx.fillRect(x - 100, ty - 22, 100, 44); ctx.fillStyle = '#5a5e62'; ctx.fillRect(x - 100, ty - 3, 100, 6); ctx.fillStyle = 'rgba(240,230,210,.6)'; ctx.font = 'bold 8px monospace'; ctx.fillText('DEUTSCHE REICHSBAHN', x - 96, ty + 16); }
        ctx.fillStyle = '#121212'; ctx.fillRect(x - 2, ty - 4, 8, 8); x -= 106; }
}
function chEvDrawAir(now) {
    const C = CH;
    C.flares.forEach(function (f) { const y = chSY(f.d), k = (now - f.t) / 11000, fl = .8 + Math.random() * .4; ctx.strokeStyle = 'rgba(220,220,220,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f.x, y); ctx.bezierCurveTo(f.x - 20, y - 40, f.x + 10, y - 80, f.x - 10, y - 120 - k * 60); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,240,' + fl + ')'; ctx.beginPath(); ctx.arc(f.x, y, 5, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(230,230,220,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(f.x, y - 16, 10, Math.PI, 0); ctx.moveTo(f.x - 10, y - 16); ctx.lineTo(f.x, y); ctx.lineTo(f.x + 10, y - 16); ctx.stroke(); });
    if (C.plane) { const P = C.plane, y = chSY(C.d + P.dOff); ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.translate(P.x + 60, y + 90); chPlaneShape(1.1); ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(P.x, y); chPlaneShape(1.1); ctx.fillStyle = '#5a6050'; ctx.fill(); ctx.strokeStyle = '#1a1c16'; ctx.lineWidth = 1.4; ctx.stroke(); ctx.fillStyle = '#7a8268'; ctx.fillRect(-4, -54, 12, 108); ctx.fillStyle = '#222'; ctx.fillRect(8, -50, 3, 100); ctx.fillStyle = '#e8e8e0'; ctx.fillRect(-2, -44, 10, 4); ctx.fillRect(-2, 40, 10, 4); ctx.fillStyle = '#121212'; ctx.fillRect(-1, -42, 6, 2); ctx.fillRect(-1, 42, 6, 2); ctx.globalAlpha = .5; ctx.strokeStyle = '#ddd'; ctx.beginPath(); ctx.ellipse(34, 0, 2, 14 + Math.random() * 3, 0, 0, 7); ctx.stroke(); ctx.restore(); }
}
function chPlaneShape(s) { ctx.beginPath(); ctx.moveTo(34 * s, 0); ctx.lineTo(20 * s, -6 * s); ctx.lineTo(-40 * s, -3 * s); ctx.lineTo(-48 * s, -16 * s); ctx.lineTo(-54 * s, -16 * s); ctx.lineTo(-52 * s, 16 * s); ctx.lineTo(-48 * s, 16 * s); ctx.lineTo(-40 * s, 3 * s); ctx.lineTo(20 * s, 6 * s); ctx.closePath(); ctx.moveTo(4 * s, -56 * s); ctx.lineTo(14 * s, -56 * s); ctx.lineTo(14 * s, 56 * s); ctx.lineTo(4 * s, 56 * s); ctx.closePath(); }
function chEvDark(hole, beam, now) {
    const C = CH; C.flares.forEach(function (f) { const k = Math.max(0, 1 - (now - f.t) / 11000); hole(f.x, chSY(f.d), 260 + 160 * k, .95); });
    if (Math.abs(chSY(CH_BARN_D) - CH_CY) < 900) hole(chEdge(CH_BARN_D, 1, 92), chSY(CH_BARN_D), 300, .9);
    if (C.train.state === 1) { hole(C.train.xF + 120, chSY(CH_TRACK_D), 200, .7); hole(C.train.xF - 140, chSY(CH_TRACK_D), 90, .5); }
}
function chEvLighter(now) { // warm/white additive glows, world space
    const C = CH, glow = function (x, y, r, col) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); };
    C.flares.forEach(function (f) { const k = Math.max(0, 1 - (now - f.t) / 11000); glow(f.x, chSY(f.d), 300 + 120 * k, 'rgba(220,230,255,' + (.16 + .1 * k) * (.85 + Math.random() * .3) + ')'); });
    const by = chSY(CH_BARN_D); if (by > -400 && by < 1100) glow(chEdge(CH_BARN_D, 1, 92), by, 280, 'rgba(255,140,50,' + (.24 + Math.random() * .06) + ')');
}
