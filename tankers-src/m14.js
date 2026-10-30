/* =====================================================
   MISSION 14 — PACIFIC 02 · "SURIGAO STRAIT", 25 October 1944, 02:00
   A standalone night naval engine: you command PT-137 against Nishimura's Southern Force.
   Throttle/steer with momentum, torpedoes, twin .50s, smoke; searchlights, star shells, shellfire.
===================================================== */
const M14 = { running: false, failWhy: '' };
const M14W = 6000, M14H = 4600;
const M14_LAND = [ // [lon-ish world polygons]: Leyte/Panaon west shore, Dinagat east shore, Hibuson island, Mindanao tip south-west
    { name: 'PANAON', pts: [[-200, -200], [1500, -200], [1350, 400], [1180, 900], [1250, 1400], [1080, 1900], [900, 2300], [1020, 2800], [820, 3300], [600, 3800], [300, 4300], [-200, 4800]] },
    { name: 'DINAGAT', pts: [[6200, -200], [4500, -200], [4650, 500], [4800, 1000], [4600, 1500], [4720, 2100], [4950, 2600], [4800, 3100], [5050, 3600], [5300, 4100], [6200, 4800]] },
    { name: 'HIBUSON', pts: [[3700, 1450], [3880, 1380], [4060, 1460], [4100, 1640], [3980, 1780], [3780, 1760], [3660, 1620]] },
    { name: 'MINDANAO', pts: [[-200, 4300], [700, 4250], [1300, 4450], [1500, 4800], [-200, 4800]] }];
const M14_GOAL = { x: 1500, y: 0, w: 3000, h: 420 };
function m14InLand(x, y) { for (let i = 0; i < M14_LAND.length; i++) if (m14PIP(x, y, M14_LAND[i].pts)) return true; return x < 0 || y < -50 || x > M14W || y > M14H; }
function m14PIP(x, y, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c; } return c; }
function m14Ship(o) { return Object.assign({ x: 0, y: 0, ang: -Math.PI / 2, spd: .14, hp: 1, maxHp: 1, len: 230, beam: 26, sinking: 0, dead: false, alert: false, seenAt: 0, lastShot: 0, reload: 3200, light: null, lightHp: 4, fires: [], chase: false, wpi: 0 }, o); }
function m14Begin() {
    const now = performance.now(), M = M14;
    Object.assign(M, { running: true, t0: now, last: now, k: {}, mx: 550, my: 350, mdown: false, failWhy: '', won: false, lost: false, endAt: 0, msg: '', msgAt: 0, msgDur: 0, cam: { x: 3300, y: 1700 }, shake: 0,
        pt: { x: 3900, y: 2150, ang: Math.PI * .9, v: 0, hp: 100, torps: 8, smokeUntil: 0, smokeReady: now, tur: 0, heat: 0, lastMG: 0, lastTorp: 0, hurtAt: 0, wake: [] },
        torps: [], tracers: [], shells: [], splashes: [], stars: [], smokes: [], booms: [], texts: [], oil: [], alertAt: 0, everAlert: false, kills: { dd: 0, ca: 0, bb: 0, boat: 0 }, hits: 0, shotsTaken: 0 });
    const col = [['dd', 'MICHISHIO', 0], ['dd', 'ASAGUMO', 1], ['dd', 'YAMAGUMO', 2], ['bb', 'YAMASHIRO', 3], ['bb', 'FUSO', 4], ['ca', 'MOGAMI', 5], ['dd', 'SHIGURE', 6]];
    let cy = 1900; M.ships = col.map(function (c) { const t = c[0], i = c[2], sz = t === 'bb' ? { len: 330, beam: 46, hp: 3, reload: 3000 } : t === 'ca' ? { len: 250, beam: 32, hp: 2, reload: 3400 } : { len: 170, beam: 20, hp: 1, reload: 4000 }; cy += (i ? 140 : 0) + sz.len / 2; const S = m14Ship(Object.assign({ type: t, name: c[1], x: 2700, y: cy, light: { ang: 0, sweep: i * 1.3, len: t === 'bb' ? 900 : 700, patrol: i % 3 === 0 } }, sz, { maxHp: sz.hp })); cy += sz.len / 2; return S; });
    M.boats = [[1500, 1500], [4300, 2900], [1500, 3300]].map(function (p, i) { return { x: p[0], y: p[1], ang: 0, hp: 60, dead: false, route: i === 1 ? [[4300, 2900], [4300, 2200], [3900, 2600]] : i === 0 ? [[1500, 1500], [1500, 2500]] : [[1500, 3300], [2100, 3600], [1600, 3900]], wi: 0, lastShot: 0, alert: false, seenAt: 0 }; });
    M.battery = { x: 1150, y: 2050, ang: 0, hp: 3, dead: false, lastShot: 0, light: { sweep: 0, len: 1500 } };
    m14Say('PT-137, ENGINES MUFFLED. THE JAPS ARE COMING UP THE STRAIT FROM THE SOUTH. TORPEDO MOGAMI AND TWO DESTROYERS, THEN RUN NORTH TO THE BATTLE LINE.', 7500);
    ['m2Brief', 'm8Arm'].forEach(function (id) { const e = document.getElementById(id); if (e) e.hidden = true; });
    const mb = document.getElementById('battleMainMenuButton'); if (mb) { mb.style.display = 'block'; mb.textContent = '↩️ ABORT MISSION'; }
    canvas.style.cursor = 'none';
    if (!M.listeners) { M.listeners = true;
        window.addEventListener('keydown', function (e) { if (!M14.running) return; M14.k[e.code] = true; if (e.code === 'Space') { e.preventDefault(); m14Torpedo(performance.now()); } if (e.code === 'KeyE') m14Smoke(performance.now()); });
        window.addEventListener('keyup', function (e) { M14.k[e.code] = false; });
        canvas.addEventListener('mousemove', function (e) { const r = canvas.getBoundingClientRect(); M14.mx = (e.clientX - r.left) * 1100 / r.width; M14.my = (e.clientY - r.top) * 700 / r.height; });
        canvas.addEventListener('mousedown', function (e) { if (!M14.running) return; if (e.button === 0) M14.mdown = true; if (e.button === 2) m14Torpedo(performance.now()); });
        canvas.addEventListener('contextmenu', function (e) { if (M14.running) e.preventDefault(); });
        window.addEventListener('mouseup', function () { M14.mdown = false; }); window.addEventListener('blur', function () { M14.k = {}; M14.mdown = false; }); }
    try { initAudio(); } catch (e) {}
    cancelAnimationFrame(M.raf); M.raf = requestAnimationFrame(m14Loop);
}
function m14Cleanup() { M14.running = false; cancelAnimationFrame(M14.raf); }
function m14Say(t, ms) { M14.msg = t; M14.msgAt = performance.now(); M14.msgDur = ms || 3000; }
function m14Float(x, y, t, col) { M14.texts.push({ x: x, y: y, t: t, col: col || '#ffd88a', at: performance.now() }); }
function m14Loop(now) { if (!M14.running) return; const dt = Math.min(50, now - M14.last) / 16.67; M14.last = now; try { m14Update(dt, now); if (!M14.running) return; m14Draw(now); } catch (e) { console.error(e); DDP.err = e; } if (M14.endAt && now > M14.endAt) { m14End(); return; } M14.raf = requestAnimationFrame(m14Loop); }
function m14Torpedo(now) { const M = M14, P = M.pt; if (M.lost || M.won || P.torps <= 0 || now - P.lastTorp < 900) return; P.torps--; P.lastTorp = now; const side = P.torps % 2 ? 1 : -1, ox = Math.cos(P.ang + Math.PI / 2) * 10 * side, oy = Math.sin(P.ang + Math.PI / 2) * 10 * side;
    M.torps.push({ x: P.x + ox, y: P.y + oy, ang: P.ang, v: 7.2, life: 2900, trail: [] }); try { playTone(180, 90, .5, .08, 'sawtooth'); setTimeout(function () { try { playTone(900, 700, .2, .02, 'triangle'); } catch (e) {} }, 200); } catch (e) {} m14Float(P.x, P.y - 30, 'FISH AWAY!', '#e8f0ff'); }
function m14Smoke(now) { const P = M14.pt; if (now < P.smokeReady) return; P.smokeUntil = now + 7000; P.smokeReady = now + 26000; m14Say('MAKING SMOKE!', 1800); try { playTone(120, 90, 1, .04, 'sawtooth'); } catch (e) {} }
function m14Spotted(src, now) { const M = M14; src.alert = true; src.seenAt = now; if (!M.alertAt || now - M.alertAt > 9000) { m14Say(['THEY\'VE SEEN US! EVASIVE!', 'SEARCHLIGHT ON US — HARD OVER!', 'STAR SHELL! THEY\'VE GOT US!'][Math.floor(Math.random() * 3)], 2400); try { playTone(700, 500, .4, .05, 'square'); } catch (e) {} } M.alertAt = now; M.everAlert = true; }
function m14Smoked(x0, y0, x1, y1) { const now = performance.now(); for (let i = 0; i < M14.smokes.length; i++) { const s = M14.smokes[i], a = (now - s.t) / 1000; if (a > s.dur) continue; const r = Math.min(s.r, 30 + a * 60) * Math.min(1, (s.dur - a) / 2); if (m8SegDist(x0, y0, x1, y1, s.x, s.y) < r * .85) return true; } return false; }
function m14HitShip(S, now) { const M = M14; S.hp--; M.hits++; S.fires.push({ ox: (Math.random() - .5) * S.len * .6, oy: (Math.random() - .5) * S.beam * .4, t: now }); M.booms.push({ x: S.x, y: S.y, t: now, r: 120, water: 1 }); M.shake = Math.max(M.shake, 10); try { playExplosionSound(1.8); } catch (e) {}
    m14Float(S.x, S.y - 60, S.hp > 0 ? 'HIT! ' + S.name : S.name + ' IS GOING DOWN!', '#ffd24a'); S.alert = true; m14Spotted(S, now);
    if (S.hp <= 0 && !S.sinking) { S.sinking = now; M.kills[S.type]++; m14Say(S.type === 'ca' ? 'MOGAMI HIT AGAIN — SHE\'S BURNING FROM END TO END!' : S.type === 'bb' ? 'A BATTLESHIP! WE PUT A FISH IN ' + S.name + '!' : S.name + ' HAS BROKEN IN TWO!', 3500); } }
function m14Update(dt, now) {
    const M = M14, P = M.pt, K = M.k; if (M.lost || M.won) { M.shake *= .9; m14UpdateFx(dt, now); return; }
    // the boat: throttle, steering, muffled engines
    const muff = K.ShiftLeft || K.ShiftRight, vmax = muff ? 2.6 : 6.2;
    if (K.KeyW || K.ArrowUp) P.v = Math.min(vmax, P.v + .07 * dt); else if (K.KeyS || K.ArrowDown) P.v = Math.max(-1.4, P.v - .12 * dt); else P.v *= Math.pow(.992, dt); if (P.v > vmax) P.v -= .1 * dt;
    const turn = (K.KeyA || K.ArrowLeft ? -1 : 0) + (K.KeyD || K.ArrowRight ? 1 : 0); P.ang += turn * .03 * dt * Math.min(1, .3 + Math.abs(P.v) / 3) * (P.v < 0 ? -1 : 1);
    const nx = P.x + Math.cos(P.ang) * P.v * dt, ny = P.y + Math.sin(P.ang) * P.v * dt; if (!m14InLand(nx, ny)) { P.x = nx; P.y = ny; } else { P.v *= -.3; P.hp -= Math.abs(P.v) * 2; M.shake = 6; m14Say('ROCKS! WATCH THE SHORE!', 1500); }
    if (Math.abs(P.v) > .8 && Math.random() < .5) P.wake.push({ x: P.x - Math.cos(P.ang) * 26, y: P.y - Math.sin(P.ang) * 26, t: now, v: Math.abs(P.v) }); P.wake = P.wake.filter(function (w) { return now - w.t < 4000; });
    if (P.smokeUntil > now && Math.random() < .35 * dt) M.smokes.push({ x: P.x - Math.cos(P.ang) * 30, y: P.y - Math.sin(P.ang) * 30, t: now, dur: 16, r: 120 });
    // twin .50s: aim at the mouse, fire on hold
    const wx = M.cam.x + M.mx, wy = M.cam.y + M.my; P.tur = Math.atan2(wy - P.y, wx - P.x); P.heat = Math.max(0, P.heat - .006 * dt);
    if (M.mdown && P.heat < 1 && now - P.lastMG > 70) { P.lastMG = now; P.heat += .025; const a = P.tur + (Math.random() - .5) * .06; M.tracers.push({ x: P.x, y: P.y, vx: Math.cos(a) * 22, vy: Math.sin(a) * 22, life: 34, mine: true }); if (Math.random() < .3) try { playTone(160, 120, .04, .02, 'square'); } catch (e) {}
        M.ships.forEach(function (S) { if (!S.dead && Math.hypot(S.x - P.x, S.y - P.y) < 1100 && Math.random() < .02) m14Spotted(S, now); }); }
    // the column steams north; alerted destroyers break off and hunt
    const alertOn = M.alertAt && now - M.alertAt < 9000;
    M.ships.forEach(function (S, i) { if (S.dead) return;
        if (S.sinking) { const k = (now - S.sinking) / 1000; S.spd = Math.max(0, S.spd - .002 * dt); if (k > 9) { S.dead = true; M.oil.push({ x: S.x, y: S.y, r: S.len * .6, t: now }); } S.x += Math.cos(S.ang) * S.spd * dt; S.y += Math.sin(S.ang) * S.spd * dt; return; }
        let ta = -Math.PI / 2; if (S.chase && S.type === 'dd') { ta = Math.atan2(P.y - S.y, P.x - S.x); S.spd = Math.min(1.9, S.spd + .004 * dt); } else { const lx = 2700 + Math.sin(S.y * .0009 + i) * 120; ta = Math.atan2(-60, lx - S.x); S.spd += (.3 - S.spd) * .01 * dt; }
        S.ang = m8Turn(S.ang, ta, .006 * dt); const sx = S.x + Math.cos(S.ang) * S.spd * dt, sy = S.y + Math.sin(S.ang) * S.spd * dt; if (!m14InLand(sx + Math.cos(S.ang) * S.len * .5, sy + Math.sin(S.ang) * S.len * .5)) { S.x = sx; S.y = sy; } else S.ang += .02 * dt;
        if (S.y < 470 && !S.chase) { S.dead = true; S.passed = true; m14Say(S.name + ' HAS SLIPPED PAST US TO THE NORTH.', 2600); return; }
        if (Math.hypot(P.x - S.x, P.y - S.y) < S.len * .5) { const dx = P.x - S.x, dy = P.y - S.y, ca = Math.cos(-S.ang), sa = Math.sin(-S.ang), lx = dx * ca - dy * sa, ly = dx * sa + dy * ca; if (Math.abs(lx) < S.len / 2 && Math.abs(ly) < S.beam / 2 + 8) { const n = ly >= 0 ? 1 : -1; P.x += -Math.sin(S.ang) * n * 6 * dt; P.y += Math.cos(S.ang) * n * 6 * dt; if (now - (P.rammed || 0) > 900) { P.rammed = now; P.hp -= 18; P.hurtAt = now; M.shake = 12; m14Say('WE\'VE BEEN RAMMED!', 1600); m14Spotted(S, now); } } }
        // searchlight sweep or track
        const L = S.light; if (L && S.lightHp > 0) { const base = S.ang + Math.PI / 2 * (i % 2 ? 1 : -1); if (S.alert && now - S.seenAt < 6000) L.ang = m8Turn(L.ang, Math.atan2(P.y - S.y, P.x - S.x), .05 * dt); else L.ang = base + Math.sin(now / 2600 + L.sweep) * 1.2; L.on = S.alert || (L.patrol && Math.sin(now / 9000 + L.sweep) > -.4); }
        // detection: searchlight cone, proximity/wake, star shell light, burning ships nearby
        const d = Math.hypot(P.x - S.x, P.y - S.y); let lit = M.stars.some(function (st) { return Math.hypot(st.x - P.x, st.y - P.y) < 520 && now - st.t < st.dur; }) || M.ships.some(function (o) { return o.sinking && Math.hypot(o.x - P.x, o.y - P.y) < 420; });
        const det = (220 + Math.abs(P.v) * 70) * (muff ? .55 : 1) * (lit ? 2.6 : 1);
        if (!m14Smoked(S.x, S.y, P.x, P.y)) { if (L && L.on && S.lightHp > 0 && d < L.len && m8AngDiff(Math.atan2(P.y - S.y, P.x - S.x), L.ang) < .1) m14Spotted(S, now); else if (d < det) m14Spotted(S, now); }
        if (S.alert && now - S.seenAt > 12000) S.alert = false; if (S.alert && S.type === 'dd' && d < 1600) S.chase = true; if (!alertOn && S.chase && d > 1800) S.chase = false;
        // guns: shells with flight time and a splash warning; star shells over the target
        if (S.alert && now - S.seenAt < 6000 && d < 1600 && now - S.lastShot > S.reload && M.shells.length < 3) { S.lastShot = now + Math.random() * 800; const lead = Math.min(80, d / 22), tx = P.x + Math.cos(P.ang) * P.v * lead + (Math.random() - .5) * 190, ty = P.y + Math.sin(P.ang) * P.v * lead + (Math.random() - .5) * 190, fl = 900 + d * .7;
            M.shells.push({ x0: S.x, y0: S.y, x: tx, y: ty, t: now, at: now + fl, big: S.type === 'bb', r: S.type === 'bb' ? 70 : 46 }); M.booms.push({ x: S.x + Math.cos(Math.atan2(ty - S.y, tx - S.x)) * S.beam, y: S.y + Math.sin(Math.atan2(ty - S.y, tx - S.x)) * S.beam, t: now, r: S.type === 'bb' ? 70 : 40, flash: 1 }); try { playExplosionSound(S.type === 'bb' ? .7 : .35); } catch (e) {}
            if (Math.random() < .3 && !M.stars.some(function (st) { return now - st.t < 5000; })) M.stars.push({ x: P.x + (Math.random() - .5) * 200, y: P.y + (Math.random() - .5) * 200, t: now + fl * .6, dur: 8000 }); }
        if (S.type === 'dd' && S.alert && d < 520 && Math.random() < .12 * dt) { const a = Math.atan2(P.y - S.y, P.x - S.x) + (Math.random() - .5) * .12; M.tracers.push({ x: S.x, y: S.y, vx: Math.cos(a) * 18, vy: Math.sin(a) * 18, life: 32, mine: false }); }
    });
    // patrol barges + shore battery
    M.boats.forEach(function (B) { if (B.dead) return; const tg = B.alert ? [P.x, P.y] : B.route[B.wi], a = Math.atan2(tg[1] - B.y, tg[0] - B.x); B.ang = m8Turn(B.ang, a, .04 * dt); const bv = B.alert ? 2.4 : 1.1, bx = B.x + Math.cos(B.ang) * bv * dt, by = B.y + Math.sin(B.ang) * bv * dt; if (!m14InLand(bx, by)) { B.x = bx; B.y = by; } if (!B.alert && Math.hypot(tg[0] - B.x, tg[1] - B.y) < 30) B.wi = (B.wi + 1) % B.route.length;
        const d = Math.hypot(P.x - B.x, P.y - B.y); if (d < (180 + Math.abs(P.v) * 50) * (muff ? .6 : 1) && !m14Smoked(B.x, B.y, P.x, P.y)) { B.alert = true; B.seenAt = now; } if (B.alert && now - B.seenAt > 14000 && d > 700) B.alert = false;
        if (B.alert && d < 560 && now - B.lastShot > 160) { B.lastShot = now; const aa = Math.atan2(P.y - B.y, P.x - B.x) + (Math.random() - .5) * .14; M.tracers.push({ x: B.x, y: B.y, vx: Math.cos(aa) * 17, vy: Math.sin(aa) * 17, life: 34, mine: false }); } });
    const BT = M.battery; if (!BT.dead) { const d = Math.hypot(P.x - BT.x, P.y - BT.y); BT.light.ang = BT.alert ? m8Turn(BT.light.ang, Math.atan2(P.y - BT.y, P.x - BT.x), .04 * dt) : Math.sin(now / 3200) * .9; if (d < BT.light.len && m8AngDiff(Math.atan2(P.y - BT.y, P.x - BT.x), BT.light.ang) < .09 && !m14Smoked(BT.x, BT.y, P.x, P.y)) { BT.alert = true; BT.seenAt = now; m14Spotted(BT, now); } if (BT.alert && now - BT.seenAt > 7000) BT.alert = false;
        if (BT.alert && d < 1700 && now - BT.lastShot > 3200) { BT.lastShot = now; const fl = 900 + d * .6; M.shells.push({ x0: BT.x, y0: BT.y, x: P.x + Math.cos(P.ang) * P.v * 40 + (Math.random() - .5) * 160, y: P.y + Math.sin(P.ang) * P.v * 40 + (Math.random() - .5) * 160, t: now, at: now + fl, r: 50 }); M.booms.push({ x: BT.x, y: BT.y, t: now, r: 40, flash: 1 }); } }
    // torpedoes
    M.torps.forEach(function (T) { T.x += Math.cos(T.ang) * T.v * dt; T.y += Math.sin(T.ang) * T.v * dt; T.life -= T.v * dt; if (Math.random() < .6) T.trail.push({ x: T.x, y: T.y, t: now }); T.trail = T.trail.filter(function (q) { return now - q.t < 2500; }); if (m14InLand(T.x, T.y)) { T.life = 0; M.booms.push({ x: T.x, y: T.y, t: now, r: 60, water: 1 }); }
        M.ships.forEach(function (S) { if (S.dead || S.sinking || T.life <= 0) return; const dx = T.x - S.x, dy = T.y - S.y, ca = Math.cos(-S.ang), sa = Math.sin(-S.ang), lx = dx * ca - dy * sa, ly = dx * sa + dy * ca; if (Math.abs(lx) < S.len / 2 && Math.abs(ly) < S.beam / 2 + 4) { T.life = 0; m14HitShip(S, now); } });
        M.boats.forEach(function (B) { if (!B.dead && T.life > 0 && Math.hypot(T.x - B.x, T.y - B.y) < 26) { T.life = 0; B.dead = true; M.kills.boat++; M.booms.push({ x: B.x, y: B.y, t: now, r: 80, water: 1 }); } }); });
    M.torps = M.torps.filter(function (T) { return T.life > 0; });
    // tracers: ours chew up barges and searchlights; theirs hurt us
    M.tracers.forEach(function (Tr) { Tr.x += Tr.vx * dt; Tr.y += Tr.vy * dt; Tr.life -= dt;
        if (Tr.mine) { M.boats.forEach(function (B) { if (!B.dead && Math.hypot(Tr.x - B.x, Tr.y - B.y) < 22) { B.hp -= 6; Tr.life = 0; B.alert = true; B.seenAt = now; if (B.hp <= 0) { B.dead = true; M.kills.boat++; M.booms.push({ x: B.x, y: B.y, t: now, r: 70 }); m14Float(B.x, B.y - 20, 'BARGE SUNK', '#9fe07a'); } } });
            M.ships.forEach(function (S) { if (S.dead || S.lightHp <= 0) return; const lx = S.x + Math.cos(S.ang) * S.len * .18, ly = S.y + Math.sin(S.ang) * S.len * .18; if (Math.hypot(Tr.x - lx, Tr.y - ly) < 18) { Tr.life = 0; if (Math.random() < .35) { S.lightHp--; if (S.lightHp <= 0) { m14Float(lx, ly - 20, 'SEARCHLIGHT OUT!', '#9fe07a'); try { playTone(1400, 300, .2, .03, 'square'); } catch (e) {} } } } });
            if (!BT.dead && Math.hypot(Tr.x - BT.x, Tr.y - BT.y) < 22) { Tr.life = 0; if (Math.random() < .08) { BT.hp--; if (BT.hp <= 0) { BT.dead = true; M.booms.push({ x: BT.x, y: BT.y, t: now, r: 60 }); m14Float(BT.x, BT.y - 30, 'BATTERY SILENCED', '#9fe07a'); } } } }
        else if (Math.hypot(Tr.x - P.x, Tr.y - P.y) < 20) { Tr.life = 0; P.hp -= 2.2; P.hurtAt = now; } });
    M.tracers = M.tracers.filter(function (t) { return t.life > 0; });
    M.shells = M.shells.filter(function (S) { if (now < S.at) return true; M.splashes.push({ x: S.x, y: S.y, t: now, r: S.r }); const d = Math.hypot(S.x - P.x, S.y - P.y); if (d < S.r) { P.hp -= (S.big ? 38 : 22) * (1 - d / S.r * .5); P.hurtAt = now; M.shake = 14; M.shotsTaken++; m14Say(['WE\'RE HIT!', 'NEAR MISS — TAKING WATER!', 'SHRAPNEL ACROSS THE DECK!'][Math.floor(Math.random() * 3)], 1600); } else if (d < S.r * 2.4) M.shake = Math.max(M.shake, 5); try { playExplosionSound(Math.max(.3, 1.2 - d / 900)); } catch (e) {} return false; });
    M.stars = M.stars.filter(function (s) { return now < s.t + s.dur; }); M.smokes = M.smokes.filter(function (s) { return (now - s.t) / 1000 < s.dur; });
    if (P.hp <= 0 && !M.lost) { P.hp = 0; M.lost = true; M.failWhy = 'sunk'; M.endAt = now + 3800; M.booms.push({ x: P.x, y: P.y, t: now, r: 110 }); m14Say('ABANDON SHIP! PT-137 IS GOING DOWN!', 4000); try { playExplosionSound(2); } catch (e) {} }
    // objectives + the run north
    const CA = M.ships.find(function (S) { return S.type === 'ca'; }), objA = CA.hp <= 0, objB = M.kills.dd >= 2, ddLeft = M.ships.filter(function (S) { return S.type === 'dd' && !S.dead && !S.sinking; }).length;
    if (!M.lost && !M.won && ((CA.passed && !objA) || (!objB && M.kills.dd + ddLeft < 2))) { M.lost = true; M.failWhy = 'passed'; M.endAt = now + 3800; m14Say('THEY\'VE GOT PAST THE PT LINE. IT\'S UP TO THE BATTLESHIPS NOW.', 4000); }
    if (objA && objB && !M.toldRun) { M.toldRun = true; m14Say('MOGAMI AND TWO DESTROYERS! NOW RUN NORTH — THE BATTLE LINE IS WAITING.', 5000); try { [520, 660, 780].forEach(function (f, i) { setTimeout(function () { try { playTone(f, f, .25, .05, 'triangle'); } catch (e) {} }, i * 160); }); } catch (e) {} }
    if (objA && objB && P.y < M14_GOAL.y + M14_GOAL.h && P.x > M14_GOAL.x && P.x < M14_GOAL.x + M14_GOAL.w && !M.won) { M.won = true; M.endAt = now + 2600; m14Say('SIGNAL THE BATTLE LINE: "ENEMY COMING UP THE STRAIT. ALL YOURS."', 4000); }
    m14UpdateFx(dt, now);
    // camera with lookahead
    const tx = P.x + Math.cos(P.ang) * P.v * 40 - 550 + (M.mx - 550) * .2, ty = P.y + Math.sin(P.ang) * P.v * 40 - 350 + (M.my - 350) * .2; M.cam.x += (tx - M.cam.x) * .08 * dt; M.cam.y += (ty - M.cam.y) * .08 * dt; M.cam.x = Math.max(0, Math.min(M14W - 1100, M.cam.x)); M.cam.y = Math.max(-100, Math.min(M14H - 700, M.cam.y));
    M.shake *= Math.pow(.9, dt);
}
function m14UpdateFx(dt, now) { const M = M14; M.booms = M.booms.filter(function (b) { return now - b.t < 1600; }); M.splashes = M.splashes.filter(function (s) { return now - s.t < 1800; }); M.texts = M.texts.filter(function (t) { return now - t.at < 1800; }); }
function m14End() { const M = M14; M.running = false; cancelAnimationFrame(M.raf); canvas.style.cursor = ''; campaignMission = 14; selectedGameMode = 'campaign';
    M.result = { ms: performance.now() - M.t0, hp: Math.round(M.pt.hp), torps: M.pt.torps, kills: M.kills, spotted: M.everAlert, hits: M.hits };
    if (M.won) { progression.campaignM14Done = true; try { addXP(1500, 'victory'); saveProgression(); } catch (e) {} m14PlayEnding(function () { showCampaignResult(true); }); } else showCampaignResult(false); }
function m14Stars() { const R = M14.result || {}; return 1 + (R.kills && R.kills.bb ? 1 : 0) + (R.hp >= 50 ? 1 : 0); }
