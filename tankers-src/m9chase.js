/* =====================================================
   MISSION 9 - THE CHASE: a stolen Horch staff car, night roads, the whole garrison behind you
   W/S throttle · A/D steer · mouse + click: your pistol · right-click / G: drop a grenade · Hollis works the Bren
===================================================== */
const CH_END = 24000, CH_ROADW = 116;
const CH = { running: false };
function chRoadX(d) { return 550 + 210 * Math.sin(d * .0011) + 110 * Math.sin(d * .00037 + 1.3) + 40 * Math.sin(d * .0029 + .4); }
function chZone(d) { if (d < 3200) return 'fields'; if (d < 6400) return 'village'; if (d < 7600) return 'bridge'; if (d < 11800) return 'forest'; if (d < 13400) return 'roadblock'; if (d < 17200) return 'orchard'; if (d < 18400) return 'rail'; if (d < 22000) return 'ruins'; return 'lines'; }
function chHalfW(d) { return Math.abs(d - 7000) < 260 ? 80 : CH_ROADW; }
function m9StartChase(o) {
    const C = CH; Object.assign(C, { running: true, o: o, d: 80, x: chRoadX(80), v: 2, vx: 0, ang: 0, hp: 100, foes: [], bullets: [], parts: [], decals: [], props: [], texts: [], nades: [], t0: performance.now(), last: performance.now(), k: {}, mx: 550, my: 300, mdown: false, kills: 0, shake: 0, lastShot: 0, nadeCount: 0, hollisAt: 0, finchAt: 0, won: false, lost: false, endAt: 0, spawnI: 0, msg: '', msgAt: 0, hurtAt: 0, bumpAt: 0 });
    const L = o.loadout || { s: 'webley', e1: 'mills' }; const sw = M8_SECONDARY[L.s]; C.gun = sw && sw.type === 'gun' ? sw : M8_SECONDARY.webley; C.ammo = 99; const pick = [L.e1, L.e2].map(function (k) { return M8_EQUIP[k]; }).filter(Boolean), cal = pick.find(function (w) { return w.caltrop; }), bomb = pick.find(function (w) { return !w.caltrop && !w.lure && !w.drug && !w.loud && !w.decoy && !w.smoke && !w.gas && !w.mine && (w.blast || 0) > 0; }); C.nadeW = cal || bomb || M8_EQUIP.egg39 || M8_EQUIP.mills; C.nadeCount = cal ? 8 : 4; C.spikes = [];
    C.crew = o.squad; // commandos still alive
    chBuildProps(); chEvInit();
    const n = o.radioOut ? 0 : 1, a = o.alarm ? 1 : 0;
    C.spawns = [[500, ['bike', 'bike']], [2600, ['kubel']], [4600, ['bike']], [6200, ['kubel', 'bike']], [9000, ['bike', 'bike'].slice(0, 1 + n)], [10800, ['kubel']], [13800, ['kubel', 'kubel'].slice(0, 1 + n)], [15600, a ? ['armour'] : ['bike']], [17800, ['bike', 'kubel']], [19600, ['kubel'].concat(a ? ['bike'] : [])], [21000, ['bike', 'bike']]].filter(function (s, i) { return !(o.radioOut && i % 3 === 2); });
    C.roadblockManned = !o.radioOut;
    chSay(o.radioOut ? 'THEY CAN\'T RADIO AHEAD — BUT THE WHOLE GARRISON\'S COMING! FOOT DOWN!' : 'THEY\'LL HAVE PHONED AHEAD — EXPECT A ROADBLOCK! FOOT DOWN, SIR!', 4200);
    ['m9Safe', 'm8Arm'].forEach(function (id) { const e = document.getElementById(id); if (e) e.hidden = true; });
    const mb = document.getElementById('battleMainMenuButton'); if (mb) { mb.style.display = 'block'; mb.textContent = '↩️ ABORT MISSION'; }
    canvas.style.cursor = 'none';
    if (!CH.listeners) { CH.listeners = true;
        window.addEventListener('keydown', function (e) { if (!CH.running) return; CH.k[e.code] = true; if (e.code === 'KeyG' || e.code === 'Space') { e.preventDefault(); chDropNade(); } });
        window.addEventListener('keyup', function (e) { CH.k[e.code] = false; });
        canvas.addEventListener('mousedown', function (e) { if (!CH.running) return; if (e.button === 2) chDropNade(); else CH.mdown = true; });
        canvas.addEventListener('contextmenu', function (e) { if (CH.running) e.preventDefault(); });
        window.addEventListener('mouseup', function () { CH.mdown = false; });
        canvas.addEventListener('mousemove', function (e) { const r = canvas.getBoundingClientRect(); CH.mx = (e.clientX - r.left) * 1100 / r.width; CH.my = (e.clientY - r.top) * 700 / r.height; });
        window.addEventListener('blur', function () { CH.k = {}; CH.mdown = false; });
    }
    try { initAudio(); } catch (e) {}
    cancelAnimationFrame(CH.raf); CH.raf = requestAnimationFrame(chLoop);
}
function m9Cleanup() { CH.running = false; M8.chaseStarting = false; M8.safeOpen = false; cancelAnimationFrame(CH.raf); if (typeof SAFE !== 'undefined') { SAFE.open = false; const s = document.getElementById('m9Safe'); if (s) { s.hidden = true; s.style.display = 'none'; } } }
function chSay(t, ms) { CH.msg = t; CH.msgAt = performance.now(); CH.msgDur = ms || 3000; }
function chR(i) { return m8R(i * 1.37 + 11); }
function chBuildProps() {
    const P = CH.props = []; chLayout();
    P.push({ k: 'lines', d: CH_END });
    // road hazards (solid unless noted)
    [[1900, -50, 'cart'], [4100, 40, 'cart'], [5400, -60, 'wreck'], [9400, 50, 'wreck'], [15000, -40, 'cart'], [19800, 30, 'wreck'], [20800, -50, 'cart']].forEach(function (h) { P.push({ k: h[2], d: h[0], x: chRoadX(h[0]) + h[1], solid: 1, w: h[2] === 'cart' ? 46 : 60, h: h[2] === 'cart' ? 70 : 80 }); });
    P.push({ k: 'roadblock', d: 12600, x: chRoadX(12600), solid: 1, gap: 1 });
    P.push({ k: 'oncoming', d: 10900, x: chRoadX(10900) - 55, v: 3 }); P.push({ k: 'oncoming', d: 18600, x: chRoadX(18600) - 55, v: 3.4 });
}
function chDropNade() { const C = CH; if (!C.running || C.won || C.lost || C.nadeCount <= 0) return; C.nadeCount--; if (C.nadeW.caltrop) { C.spikes.push({ x: C.x, d: C.d - 50, t: performance.now() }); try { playTone(1400, 900, .1, .03, 'square'); } catch (e) {} chSay('CALTROPS OUT!', 1000); return; } C.nades.push({ x: C.x + (Math.random() - .5) * 20, d: C.d - 40, at: performance.now() + 750, w: C.nadeW }); try { playTone(500, 300, .08, .03, 'triangle'); } catch (e) {} chSay('GRENADE OUT!', 1000); }
function chSpawn(kind) {
    const C = CH, d = C.d - 520 - Math.random() * 120, side = Math.random() < .5 ? -1 : 1;
    const T = { bike: { hp: 60, max: 9.8, r: 14 }, kubel: { hp: 110, max: 9.2, r: 20 }, armour: { hp: 300, max: 8.7, r: 24 } }[kind];
    C.foes.push({ k: kind, d: d, x: chRoadX(d) + side * 40, v: C.v + 1.5, hp: T.hp, maxHp: T.hp, max: T.max, r: T.r, lastShot: performance.now() + 1500, side: side, ang: 0, offset: (Math.random() - .5) * 120 });
    try { playTone(160, 220, .5, .03, 'sawtooth'); } catch (e) {}
}
function chLoop(now) { if (!CH.running) return; if (typeof minimapPanel !== 'undefined' && minimapPanel && minimapPanel.style.display !== 'none') minimapPanel.style.display = 'none'; const dt = Math.min(50, now - CH.last) / 16.67; CH.last = now; try { chUpdate(dt, now); chDraw(now); } catch (e) { console.error(e); DDP.err = e; } if (CH.endAt && now > CH.endAt) { chEnd(); return; } CH.raf = requestAnimationFrame(chLoop); }
function chHurt(d) { const C = CH; if (C.won || C.lost) return; d *= .5; C.hp -= d; C.hurtAt = performance.now(); C.shake = Math.max(C.shake, Math.min(8, d * .6)); if (C.hp <= 0) { C.hp = 0; C.lost = true; C.endAt = performance.now() + 2800; chBoom(C.x, C.d, 1.6); chSay('WE\'RE HIT — SHE\'S GOING OVER!', 3000); } }
function chBoom(x, d, s) { const C = CH, now = performance.now(); C.parts.push({ k: 'boom', x: x, d: d, t: now, s: s || 1 }); for (let i = 0; i < 18; i++) { const a = Math.random() * 7; C.parts.push({ k: 'spark', x: x, d: d, vx: Math.cos(a) * 5, vd: Math.sin(a) * 5, life: 1, decay: .03 }); } for (let i = 0; i < 8; i++) C.parts.push({ k: 'smoke', x: x + (Math.random() - .5) * 30, d: d + (Math.random() - .5) * 30, vx: (Math.random() - .5) * .6, vd: (Math.random() - .5) * .6, life: 1, decay: .01, r: 20 + Math.random() * 20 }); C.decals.push({ x: x, d: d, r: 40 * s }); C.shake = Math.max(C.shake, 10 * s); try { playExplosionSound(Math.min(2, s)); } catch (e) {} }
function chUpdate(dt, now) {
    const C = CH, k = C.k; C.shake = Math.max(0, C.shake - .5 * dt);
    if (!C.won && !C.lost) {
        const thr = (k.KeyW || k.ArrowUp) ? 1 : 0, brk = (k.KeyS || k.ArrowDown) ? 1 : 0, steer = ((k.KeyD || k.ArrowRight) ? 1 : 0) - ((k.KeyA || k.ArrowLeft) ? 1 : 0);
        const rx = chRoadX(C.d), hw = chHalfW(C.d), off = Math.abs(C.x - rx) > hw - 14, maxV = (off ? 3.6 : 8) * (C.hp < 30 ? .85 : 1);
        C.v += (thr ? .09 : -.025) * dt - brk * .2 * dt; C.v = Math.max(0, Math.min(maxV, C.v)); if (C.v > maxV) C.v -= .3 * dt;
        C.vx += steer * .55 * dt * Math.min(1, .3 + C.v / 6); C.vx *= Math.pow(.86, dt); C.x += C.vx * dt; C.ang = m8Turn(C.ang, C.vx * .06, .3);
        C.d += C.v * dt;
        if (off && C.v > 2 && Math.random() < .2) { C.parts.push({ k: 'dust', x: C.x, d: C.d - 30, vx: (Math.random() - .5), vd: -.5, life: 1, decay: .03, r: 10 }); if (Math.random() < .05) chHurt(.6); }
        if (Math.abs(C.x - rx) > hw + 120) { C.x -= Math.sign(C.x - rx) * 3; chHurt(.4); C.v *= .9; }
        if (chZone(C.d) === 'bridge' && Math.abs(C.d - 7000) < 260 && Math.abs(C.x - rx) > 78) { C.x = rx + Math.sign(C.x - rx) * 78; C.vx *= -.4; chHurt(4); C.v *= .7; chSay('THE PARAPET — STEADY!', 900); try { playTone(120, 60, .15, .08, 'square'); } catch (e) {} }
        // props: solid hazards, craters, roadblock, oncoming lorries
        C.props.forEach(function (p) { if (Math.abs(p.d - C.d) > 90) return;
            if (p.solid && !p.broken && p.k !== 'roadblock' && Math.abs(p.x - C.x) < (p.w || 50) / 2 + 22 && Math.abs(p.d - C.d) < (p.h || 60) / 2 + 30) { if (now - (C.solidAt || 0) < 600) { C.v *= .5; C.vx = (C.x > p.x ? 1 : -1) * 4; return; } C.solidAt = now; const hit = C.v * 3 + 6; chHurt(hit); C.v *= .35; C.vx = (C.x > p.x ? 1 : -1) * 6; C.bumpAt = now; try { playTone(140, 60, .2, .1, 'square'); } catch (e) {} if (p.k === 'cart') { p.broken = 1; chBoom(p.x, p.d, .4); } }
            if (p.k === 'crater' && Math.hypot(p.x - C.x, (p.d - C.d) * .6) < p.r && !p.hit) { p.hit = 1; if (C.v > 4) { chHurt(4); C.shake = 6; } C.v *= .75; }
            if (p.k === 'roadblock' && !p.broken && Math.abs(p.d - C.d) < 40) { const gapX = p.x + CH_ROADW - 50; if (C.x < gapX - 30) { if (C.v > 5.5) { p.broken = 1; chHurt(12); C.v *= .6; chSay('THROUGH THE BARRIER!', 1400); try { playExplosionSound(.6); } catch (e) {} for (let i = 0; i < 14; i++) C.parts.push({ k: 'plank', x: p.x - 60 + Math.random() * 120, d: p.d, vx: (Math.random() - .5) * 6, vd: 2 + Math.random() * 6, life: 1, decay: .02, rot: Math.random() * 6 }); } else { C.v = 0; C.d = p.d - 41; chHurt(3); chSay('TOO SLOW — WE NEED SPEED TO BREAK IT!', 1500); } } }
        });
        // shooting: your pistol
        const sx = C.x, sy = CH_CY, a = Math.atan2(C.my - (sy - 10), C.mx - (sx - C.camX())), gun = C.gun;
        if (C.mdown && now - C.lastShot > gun.rate) { C.lastShot = now; if (!gun.auto) C.mdown = false; const sp = (Math.random() - .5) * .1; C.bullets.push({ x: C.x, d: C.d + 10, vx: Math.cos(a + sp) * 22, vd: -Math.sin(a + sp) * 22 + C.v, life: 26, dmg: gun.dmg, team: 'sq' }); C.parts.push({ k: 'flash', x: C.x + Math.cos(a) * 18, d: C.d + 10 - Math.sin(a) * 18, t: now }); try { playTone(260, 90, .07, .06, 'sawtooth'); } catch (e) {} }
        // Hollis on the Bren, Finch with the De Lisle
        const behind = C.foes.filter(function (f) { return f.hp > 0 && Math.hypot(f.x - C.x, f.d - C.d) < 460; }).sort(function (p, q) { return Math.hypot(p.x - C.x, p.d - C.d) - Math.hypot(q.x - C.x, q.d - C.d); });
        if (C.crew >= 1 && behind[0] && now - C.hollisAt > 115) { C.hollisAt = now; const f = behind[0], aa = Math.atan2(-(f.d - (C.d - 24)), f.x - C.x) + (Math.random() - .5) * .1; C.hollisAng = aa; C.bullets.push({ x: C.x, d: C.d - 24, vx: Math.cos(aa) * 24, vd: -Math.sin(aa) * 24 + C.v, life: 24, dmg: 9, team: 'sq' }); C.parts.push({ k: 'flash', x: C.x + Math.cos(aa) * 20, d: C.d - 24 - Math.sin(aa) * 20, t: now }); if (Math.random() < .5) try { playTone(300, 90, .05, .05, 'sawtooth'); } catch (e) {} }
        if (C.crew >= 2 && behind[1] && now - C.finchAt > 1300) { C.finchAt = now; const f = behind[1], aa = Math.atan2(-(f.d - (C.d - 10)), f.x - (C.x - 12)); C.bullets.push({ x: C.x - 12, d: C.d - 10, vx: Math.cos(aa) * 28, vd: -Math.sin(aa) * 28 + C.v, life: 22, dmg: 60, team: 'sq' }); }
        // spawns
        while (C.spawnI < C.spawns.length && C.d > C.spawns[C.spawnI][0]) { C.spawns[C.spawnI][1].forEach(function (kd, i) { setTimeout(function () { if (CH.running && !CH.won && !CH.lost) chSpawn(kd); }, i * 900); }); if (C.spawnI === 0) chSay('MOTORCYCLES BEHIND US!', 2000); C.spawnI++; }
        if (C.d > CH_END) { C.won = true; C.endAt = now + 3800; chSay('BRITISH LINES! HOLD YOUR FIRE, WE\'RE FRIENDLY!', 3600); try { [523, 659, 784, 1047].forEach(function (f, i) { setTimeout(function () { try { playTone(f, f, .25, .06, 'triangle'); } catch (e) {} }, i * 140); }); } catch (e) {} }
    } else { C.v *= Math.pow(.96, dt); C.d += C.v * dt; }
    // foes
    chEvUpdate(dt, now);
    C.foes.forEach(function (f) { if (f.hp <= 0) chFoeDie(f, now);
        if (f.k === 'inf') { if (f.hp > 0) chInf(f, dt, now); return; }
        if (f.hp <= 0) { f.v *= Math.pow(.95, dt); f.d += f.v * dt; f.spin = (f.spin || 0) + .1 * dt; return; }
        const want = C.d - (f.k === 'armour' ? 230 : f.k === 'kubel' ? 70 : 40) - Math.max(0, f.offset * .3), dd = want - f.d; f.v += Math.max(-.2, Math.min(.2, dd * .004 + (C.v - f.v) * .05)) * dt; f.v = Math.max(0, Math.min(f.max + (dd > 300 ? 2 : 0), f.v)); f.d += f.v * dt;
        const rx = chRoadX(f.d), tx = f.k === 'kubel' && Math.abs(dd) < 90 ? C.x : Math.max(rx - CH_ROADW + 24, Math.min(rx + CH_ROADW - 24, C.x + f.side * 46 + f.offset * .2)); f.x += Math.max(-2.4, Math.min(2.4, (tx - f.x) * .05)) * dt; f.ang = m8Turn(f.ang, (tx - f.x) * .02, .2);
        if (f.k === 'kubel' && Math.hypot(f.x - C.x, f.d - C.d) < 38 && now - (f.ramAt || 0) > 900 && !C.won) { f.ramAt = now; chHurt(5); C.vx += (C.x > f.x ? 1 : -1) * 5; f.hp -= 6; try { playTone(130, 70, .15, .09, 'square'); } catch (e) {} chSay('THEY\'RE RAMMING US!', 1200); }
        const dist = Math.hypot(f.x - C.x, f.d - C.d), rate = f.k === 'bike' ? 380 : f.k === 'kubel' ? 760 : 1000;
        if (dist < 420 && now - f.lastShot > rate && !C.won && !C.lost) { f.lastShot = now; const aa = Math.atan2(-(C.d - f.d), C.x - f.x) + (Math.random() - .5) * (f.k === 'armour' ? .08 : .16) * (C.litUntil > now ? .5 : 1), dmg = f.k === 'armour' ? 5 : f.k === 'bike' ? 1.4 : 2.2; C.bullets.push({ x: f.x, d: f.d + 18, vx: Math.cos(aa) * 20, vd: -Math.sin(aa) * 20 + f.v, life: 30, dmg: dmg, team: 'en', big: f.k === 'armour' }); C.parts.push({ k: 'flash', x: f.x + Math.cos(aa) * 16, d: f.d + 18 - Math.sin(aa) * 16, t: now, en: 1 }); try { playTone(f.k === 'armour' ? 150 : 320, 100, .06, .04, 'sawtooth'); } catch (e) {} }
        C.spikes.forEach(function (sp) { if ((sp.hit || 0) < 3 && !f.flat && f.hp > 0 && Math.abs(sp.x - f.x) < 70 && Math.abs(sp.d - f.d) < 26) { sp.hit = (sp.hit || 0) + 1; f.hp -= f.k === 'armour' ? 60 : 35; f.v *= .3; f.offset = (Math.random() - .5) * 200; f.flat = true; chSay(f.k === 'armour' ? 'HIS TYRES ARE SHREDDED!' : 'TYRES GONE!', 1100); try { playTone(200, 80, .3, .05, 'sawtooth'); } catch (e) {} } });
        // hazards hurt them too
        C.props.forEach(function (p) { if (p.solid && !p.broken && p.k !== 'roadblock' && Math.abs(p.x - f.x) < (p.w || 50) / 2 + f.r && Math.abs(p.d - f.d) < (p.h || 60) / 2 + f.r) { f.hp -= 60; f.v *= .3; } if (p.k === 'roadblock' && !p.broken && Math.abs(p.d - f.d) < 40 && f.x < p.x + CH_ROADW - 80) { f.hp = 0; } });
        if (f.hp <= 0) chFoeDie(f, now);
    });
    C.foes = C.foes.filter(function (f) { return f.d > C.d - 1200; });
    // roadblock gunners
    C.props.forEach(function (p) { if (p.k === 'roadblock' && C.roadblockManned && !p.broken && p.d > C.d && p.d - C.d < 520 && now - (p.lastShot || 0) > 420) { p.lastShot = now; const gx = p.x + (Math.random() - .5) * 120, aa = Math.atan2(-(C.d - p.d), C.x - gx) + (Math.random() - .5) * .14; C.bullets.push({ x: gx, d: p.d - 10, vx: Math.cos(aa) * 20, vd: -Math.sin(aa) * 20, life: 34, dmg: 2.5, team: 'en' }); }
        if (p.k === 'oncoming') { if (p.d - C.d < 900) { p.d -= p.v * dt; if (!p.honk) { p.honk = 1; chSay('LORRY COMING THE OTHER WAY!', 1500); } } if (Math.abs(p.d - C.d) < 60 && Math.abs(p.x - C.x) < 40 && !p.hit) { p.hit = 1; chHurt(18); C.v *= .3; C.vx = (C.x > p.x ? 1 : -1) * 7; try { playExplosionSound(.5); } catch (e) {} } } });
    // bullets
    C.bullets.forEach(function (b) { b.life -= dt; const n = Math.max(1, Math.ceil(Math.hypot(b.vx, b.vd) * dt / 8)); for (let st = 0; st < n && b.life > 0; st++) { b.x += b.vx * dt / n; b.d += b.vd * dt / n;
        if (b.team === 'sq') { const f = C.foes.find(function (f) { return f.hp > 0 && Math.hypot(f.x - b.x, f.d - b.d) < f.r; }); if (f) { f.hp -= b.dmg; b.life = 0; C.parts.push({ k: 'spark', x: b.x, d: b.d, vx: (Math.random() - .5) * 3, vd: (Math.random() - .5) * 3, life: .6, decay: .06 }); } }
        else if (Math.abs(b.x - C.x) < 22 && Math.abs(b.d - C.d) < 34 && !C.won) { chHurt(b.dmg); b.life = 0; C.parts.push({ k: 'spark', x: b.x, d: b.d, vx: (Math.random() - .5) * 3, vd: (Math.random() - .5) * 3, life: .6, decay: .06 }); try { playTone(900, 500, .03, .03, 'square'); } catch (e) {} } } });
    C.bullets = C.bullets.filter(function (b) { return b.life > 0; });
    // grenades dropped behind
    C.nades = C.nades.filter(function (n) { if (now < n.at) return true; chBoom(n.x, n.d, 1); C.foes.forEach(function (f) { if (f.hp > 0 && Math.hypot(f.x - n.x, f.d - n.d) < (n.w.blast || 95) + 20) f.hp -= n.w.dmg || 170; }); return false; });
    C.parts.forEach(function (p) { if (p.vx !== undefined) { p.x += p.vx * dt; p.d += p.vd * dt; p.vx *= .95; p.vd *= .95; } if (p.life !== undefined) p.life -= p.decay * dt; if (p.k === 'smoke') p.r += .4 * dt; });
    C.parts = C.parts.filter(function (p) { return p.life === undefined ? now - p.t < 900 : p.life > 0; });
    // engine note
    if (!C.engAt || now - C.engAt > 140) { C.engAt = now; if (C.running && !C.lost) try { playTone(50 + C.v * 9, 45 + C.v * 8, .14, .012, 'sawtooth'); } catch (e) {} }
}
CH.camX = function () { return CH.cx || 0; };
function chEnd() {
    const C = CH; C.running = false; cancelAnimationFrame(C.raf); canvas.style.cursor = '';
    M9.result = { kills: C.kills + (C.o ? C.o.kills : 0), carHp: Math.round(C.hp), alarm: C.o && C.o.alarm, crew: C.crew, radioOut: C.o && C.o.radioOut };
    campaignMission = 9; selectedGameMode = 'campaign';
    if (C.won) { progression.campaignM9Done = true; try { addXP(1000, 'victory'); saveProgression(); } catch (e) {} showCampaignResult(true); }
    else { M9.failWhy = 'chase'; showCampaignResult(false); }
}
function m9Stars() { const r = M9.result || {}; return 1 + (r.alarm ? 0 : 1) + ((r.crew || 0) >= 4 && (r.carHp || 0) > 40 ? 1 : 0); }

/* ---------- drawing ---------- */
const CH_CY = 360;
function chSY(d) { return CH_CY - (d - CH.d); }
function chDraw(now) {
    const C = CH, W = canvas.width, H = canvas.height; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0a0c08'; ctx.fillRect(0, 0, W, H); ctx.scale(W / 1100, H / 700);
    C.cx = (C.cx === undefined ? C.x - 550 : C.cx + (C.x - 550 - C.cx) * .12);
    const sh = [(Math.random() - .5) * C.shake, (Math.random() - .5) * C.shake]; ctx.save(); ctx.translate(sh[0], sh[1]);
    ctx.save(); ctx.translate(-C.cx, 0);
    chDrawTerrain();
    // tyre marks + scorch decals
    C.decals.forEach(function (dc) { const y = chSY(dc.d); if (y < -60 || y > 760) return; const g = ctx.createRadialGradient(dc.x, y, 0, dc.x, y, dc.r); g.addColorStop(0, 'rgba(30,24,18,.32)'); g.addColorStop(1, 'rgba(30,24,18,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(dc.x, y, dc.r, 0, 7); ctx.fill(); });
    // props
    C.props.forEach(function (p) { const y = chSY(p.d); if (y < -160 || y > 860) return; chDrawProp(p, y, now); });
    chEvDrawGround(now);
    (C.spikes || []).forEach(function (sp) { const y = chSY(sp.d); if (y < -20 || y > 720) return; for (let i = 0; i < 9; i++) { const x = sp.x - 60 + i * 15 + Math.sin(i * 3.1) * 4, yy = y + Math.cos(i * 2.3) * 6; ctx.strokeStyle = '#c8ccd0'; ctx.lineWidth = 1.6; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + Math.cos(k * 2.1 + i) * 5, yy + Math.sin(k * 2.1 + i) * 5); ctx.stroke(); } } });
    // grenades
    C.nades.forEach(function (n) { const y = chSY(n.d); m8Disc(ctx, n.x, y, 5, '#2e3220', '#7a8058'); if (Math.floor(now / 100) % 2) { ctx.fillStyle = '#ff5030'; ctx.beginPath(); ctx.arc(n.x, y - 6, 2, 0, 7); ctx.fill(); } });
    // foes + the car
    C.foes.forEach(function (f) { chDrawFoe(f, chSY(f.d), now); });
    chDrawCar(now);
    C.bullets.forEach(function (b) { const y = chSY(b.d); ctx.strokeStyle = b.team === 'sq' ? 'rgba(255,240,180,.9)' : 'rgba(255,160,100,.9)'; ctx.lineWidth = b.big ? 3 : 1.6; ctx.beginPath(); ctx.moveTo(b.x, y); ctx.lineTo(b.x - b.vx * .7, y + b.vd * .7); ctx.stroke(); });
    C.parts.forEach(function (p) { const y = chSY(p.d); const a = p.life === undefined ? 1 : Math.max(0, p.life);
        if (p.k === 'flash') { const k = (now - p.t) / 80; if (k < 1) { ctx.fillStyle = 'rgba(255,230,150,' + (1 - k) + ')'; ctx.beginPath(); ctx.arc(p.x, y, 7, 0, 7); ctx.fill(); } }
        else if (p.k === 'ember') { ctx.fillStyle = 'rgba(255,' + (120 + Math.random() * 80 | 0) + ',40,' + a + ')'; ctx.fillRect(p.x - 1.5, y - 1.5, 3, 3); }
        else if (p.k === 'spark') { ctx.fillStyle = 'rgba(255,220,140,' + a + ')'; ctx.fillRect(p.x - 1, y - 1, 3, 3); }
        else if (p.k === 'smoke' || p.k === 'dust') { const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, p.r); g.addColorStop(0, (p.k === 'dust' ? 'rgba(140,120,90,' : 'rgba(40,36,32,') + a * .55 + ')'); g.addColorStop(1, 'rgba(40,36,32,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, 7); ctx.fill(); }
        else if (p.k === 'plank') { ctx.save(); ctx.translate(p.x, y); ctx.rotate(p.rot + (1 - a) * 8); ctx.fillStyle = a > .5 ? '#d8d0c0' : '#b02a1c'; ctx.fillRect(-10, -2, 20, 4); ctx.restore(); }
        else if (p.k === 'boom') { const k = (now - p.t) / 900; if (k < 1) { const r = 30 * p.s + k * 90 * p.s; const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, r); g.addColorStop(0, 'rgba(255,250,220,' + (1 - k) + ')'); g.addColorStop(.4, 'rgba(255,150,50,' + (.9 - k) + ')'); g.addColorStop(1, 'rgba(120,40,10,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, y, r, 0, 7); ctx.fill(); } } });
    chEvDrawAir(now);
    ctx.restore(); ctx.restore();
    chDrawDark(now);
    chDrawHud(now);
    if (C.hurtAt && now - C.hurtAt < 300) { const g = ctx.createRadialGradient(550, 350, 200, 550, 350, 650); g.addColorStop(0, 'rgba(160,10,0,0)'); g.addColorStop(1, 'rgba(160,10,0,' + .45 * (1 - (now - C.hurtAt) / 300) + ')'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1100, 700); }
    const st = (now - C.t0) / 1000; if (st < 1) { ctx.fillStyle = 'rgba(0,0,0,' + (1 - st) + ')'; ctx.fillRect(0, 0, 1100, 700); }
    if (C.won) { const k = Math.min(1, (now - (C.endAt - 3800)) / 800); ctx.fillStyle = 'rgba(0,0,0,' + .45 * k + ')'; ctx.fillRect(0, 280, 1100, 110); ctx.textAlign = 'center'; ctx.font = '700 46px "Stardos Stencil", Impact, sans-serif'; ctx.fillStyle = '#ffd24a'; ctx.globalAlpha = k; ctx.fillText('THROUGH THE LINES', 550, 345); ctx.font = '15px "Special Elite", monospace'; ctx.fillStyle = '#e8e0c0'; ctx.fillText('THE KEY SHEETS ARE ON THEIR WAY TO BLETCHLEY PARK', 550, 372); ctx.globalAlpha = 1; }
    if (C.lost) { ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 280, 1100, 110); ctx.textAlign = 'center'; ctx.font = '700 46px "Stardos Stencil", Impact, sans-serif'; ctx.fillStyle = '#ff5040'; ctx.fillText('THE CAR IS WRECKED', 550, 345); }
    ctx.restore();
}
function chDrawProp(p, y, now) {
    if (p.k === 'tree') { m8Tree(ctx, p.x, y, p.r, p.s); }
    else if (p.k === 'hedge') { const hw = 16 + m8R(p.d) * 4; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(p.x - hw + 8, y - 41, hw * 2, 84); ctx.fillStyle = '#18280f'; ctx.fillRect(p.x - hw, y - 42, hw * 2, 84); for (let i = 0; i < 7; i++) { const yy = y - 40 + i * 12, r = 9 + m8R(p.d + i) * 6; ctx.fillStyle = i % 2 ? '#22381a' : '#1c3014'; ctx.beginPath(); ctx.arc(p.x + (m8R(p.d * 3 + i) - .5) * hw, yy, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(110,150,80,.25)'; ctx.beginPath(); ctx.arc(p.x + (m8R(p.d * 3 + i) - .5) * hw - 3, yy - 3, r * .5, 0, 7); ctx.fill(); } }
    else if (p.k === 'pole') { ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(p.x + 3, y + 3, 20, 3); m8Disc(ctx, p.x, y, 4, '#2a2016', '#6a5030'); ctx.strokeStyle = 'rgba(40,40,40,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x - 14, y); ctx.lineTo(p.x + 14, y); ctx.stroke(); }
    else if (p.k === 'house') { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 10; ctx.shadowOffsetY = 12; ctx.fillStyle = '#000'; ctx.fillRect(p.x - p.w / 2, y - p.h / 2, p.w, p.h); ctx.restore();
        if (p.ruin) { ctx.fillStyle = '#3a342a'; ctx.fillRect(p.x - p.w / 2, y - p.h / 2, p.w, p.h); ctx.fillStyle = '#1a1612'; ctx.fillRect(p.x - p.w / 2 + 10, y - p.h / 2 + 10, p.w - 20, p.h - 20); for (let i = 0; i < 10; i++) m8Disc(ctx, p.x - p.w / 2 + 14 + m8R(p.s + i) * (p.w - 28), y - p.h / 2 + 14 + m8R(p.s + i * 3) * (p.h - 28), 4 + m8R(i) * 6, '#3a342a', '#8a8070'); ctx.fillStyle = '#4a3a2a'; ctx.fillRect(p.x - p.w / 2 + 20, y - 4, p.w - 40, 6); }
        else { m9Roof(ctx, p.x - p.w / 2, y - p.h / 2, p.w, p.h, false, m8R(p.s) > .5 ? ['#7a4a34', '#5a3424', '#3a2016'] : ['#5a5e68', '#3a3e48', '#22242c']); m8Disc(ctx, p.x + p.w * .2, y - p.h * .3, 6, '#3a2a20', '#7a5a40'); if (m8R(p.s + 4) > .5) { ctx.fillStyle = 'rgba(255,190,110,.6)'; ctx.fillRect(p.x - p.side * (p.w / 2) - (p.side > 0 ? 0 : 0) - 2, y - 8, 4, 16); } } }
    else if (p.k === 'lamp') m8LampPost(ctx, p.x, y);
    else if (p.k === 'cart') { if (p.broken) { ctx.fillStyle = '#4a3420'; for (let i = 0; i < 5; i++) ctx.fillRect(p.x - 20 + i * 9, y - 20 + (i % 2) * 18, 16, 4); return; } ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(p.x - 20, y - 30, 46, 72); ctx.fillStyle = '#6a4a28'; ctx.fillRect(p.x - 23, y - 35, 46, 60); ctx.strokeStyle = '#3a2410'; ctx.lineWidth = 2; for (let i = -18; i < 23; i += 8) { ctx.beginPath(); ctx.moveTo(p.x + i, y - 35); ctx.lineTo(p.x + i, y + 25); ctx.stroke(); } ctx.fillStyle = '#c8b060'; ctx.beginPath(); ctx.ellipse(p.x, y - 10, 16, 22, 0, 0, 7); ctx.fill(); m8Disc(ctx, p.x - 26, y, 8, '#2a1a0e', '#6a4a28'); m8Disc(ctx, p.x + 26, y, 8, '#2a1a0e', '#6a4a28'); ctx.strokeStyle = '#4a3420'; ctx.beginPath(); ctx.moveTo(p.x - 6, y + 25); ctx.lineTo(p.x - 6, y + 50); ctx.moveTo(p.x + 6, y + 25); ctx.lineTo(p.x + 6, y + 50); ctx.stroke(); }
    else if (p.k === 'wreck') { ctx.save(); ctx.translate(p.x, y); ctx.rotate(.4); ctx.fillStyle = '#1e1c18'; ctx.fillRect(-28, -40, 56, 80); ctx.fillStyle = '#3a2a1e'; ctx.fillRect(-22, -32, 44, 30); ctx.restore(); ddpFire(p.x, y - 10, .35, now / 1000, p.d); if (Math.random() < .3) CH.parts.push({ k: 'smoke', x: p.x, d: p.d + 10, vx: .3, vd: .4, life: .8, decay: .01, r: 10 }); }
    else if (p.k === 'crater') { const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, p.r); g.addColorStop(0, 'rgba(8,6,4,.85)'); g.addColorStop(.7, 'rgba(40,32,24,.6)'); g.addColorStop(1, 'rgba(90,80,60,.0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(p.x, y, p.r, p.r * .7, 0, 0, 7); ctx.fill(); }
    else if (p.k === 'roadblock') { const gapX = p.x + CH_ROADW - 50; if (!p.broken) { for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? '#d8d0c0' : '#b02a1c'; ctx.fillRect(p.x - CH_ROADW + i * ((gapX - 30 - (p.x - CH_ROADW)) / 10), y - 4, (gapX - 30 - (p.x - CH_ROADW)) / 10, 8); } } m8Sandbags(ctx, p.x - CH_ROADW - 60, y - 22, 60, 22); m8Sandbags(ctx, p.x + CH_ROADW + 4, y - 22, 60, 22); if (CH.roadblockManned) { [[p.x - CH_ROADW - 30, y - 34], [p.x + CH_ROADW + 30, y - 34], [p.x - CH_ROADW - 10, y - 50]].forEach(function (s, i) { const u = { x: s[0], y: s[1], ang: Math.PI / 2, team: 'en', kind: 'sold', gun: i ? 'mp40' : 'mg42', seed: i * 7 + 3, hp: 1, maxHp: 1, moving: false }; m8DrawMan(u, now); }); } m8Sign(ctx, p.x - CH_ROADW - 70, y + 10, 64, 26, 'HALT!', 'KONTROLLE'); }
    else if (p.k === 'oncoming') { ctx.save(); ctx.translate(p.x, y); ctx.rotate(Math.PI); m8Truck(ctx, -26, -60, 52, 120); ctx.restore(); }
    else if (p.k === 'lines') { for (let i = -1; i <= 1; i += 2) { m8Sandbags(ctx, chRoadX(p.d) + i * (CH_ROADW + 30) - 60, y, 120, 22); } [[chRoadX(p.d) - 320, y - 60], [chRoadX(p.d) + 320, y - 50]].forEach(function (q, i) { ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate((i ? 1 : -1) * .25); m8Truck(ctx, -24, -50, 48, 100); ctx.restore(); }); for (let i = 0; i < 6; i++) { const u = { x: chRoadX(p.d) + (i < 3 ? -1 : 1) * (CH_ROADW + 50 + (i % 3) * 60), y: y - 30 - (i % 2) * 20, ang: Math.PI / 2, team: 'sq', kind: 'cmdo', slot: 3, gun: i % 2 ? 'no4' : 'bren', seed: i, hp: 1, maxHp: 1 }; m8DrawMan(u, now); } ctx.fillStyle = 'rgba(255,255,240,.85)'; ctx.font = '700 16px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('— BRITISH LINES —', chRoadX(p.d), y + 50); }
}
function chDrawCar(now) {
    const C = CH, y = CH_CY; ctx.save(); ctx.translate(C.x, y); ctx.rotate(C.ang); ctx.translate(-28, -62);
    ctx.save(); ctx.translate(28, 62); ctx.rotate(-Math.PI / 2); m9DrawCarTop(-62, -28, 124, 56, now, false); ctx.restore();
    const heads = [[12, 40, 'leader'], [44, 40, 'hollis'], [12, 66, 'f'], [44, 66, 'd'], [28, 84, 'm']].slice(0, 2 + C.crew);
    heads.forEach(function (h, i) { m8Disc(ctx, h[0], h[1], 7, '#1e1610', '#4a3a2a'); ctx.fillStyle = i < 2 ? '#2e5a2a' : '#4a4430'; ctx.beginPath(); ctx.ellipse(h[0] - 1, h[1] - 1, 7, 6.4, 0, 0, 7); ctx.fill(); });
    if (C.crew >= 1) { ctx.save(); ctx.translate(44, 66); ctx.rotate(-(C.hollisAng || -Math.PI / 2) - C.ang); const bw = M8_PRIMARY.bren, ic = m8HandIcon('bren'); if (ic) { ctx.scale(.26, .26 * .7); ctx.drawImage(ic, -10, -46, ic.width / 2, ic.height / 2); } ctx.restore(); }
    ctx.restore();
    // headlights glow on the road + exhaust
    if (Math.random() < .5) C.parts.push({ k: 'smoke', x: C.x + (Math.random() - .5) * 10, d: C.d - 64, vx: (Math.random() - .5) * .4, vd: -.6, life: .5, decay: .03, r: 4 });
}
function chDrawFoe(f, y, now) {
    if (f.k === 'inf') { if (y < -60 || y > 760) return; m8DrawMan({ x: f.x, y: y, ang: f.ang, team: 'en', kind: f.mg ? 'mg' : 'sold', gun: f.gun, seed: f.seed, hp: f.hp, maxHp: f.maxHp, dead: f.hp <= 0, deathAng: f.seed, moving: false, r: 10 }, now); return; }
    if (y < -100 || y > 820) return; ctx.save(); ctx.translate(f.x, y); ctx.rotate((f.ang || 0) + (f.spin || 0));
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-f.r + 5, -f.r * 1.6 + 6, f.r * 2, f.r * 3.2);
    if (f.k === 'bike') { ctx.fillStyle = '#121210'; ctx.fillRect(-3, -20, 6, 10); ctx.fillRect(-3, 12, 6, 10); ctx.fillStyle = '#4a4e3a'; m8RR(ctx, -5, -14, 10, 30, 4, '#4a4e3a'); ctx.fillStyle = '#3e4232'; m8RR(ctx, 6, -10, 14, 24, 6, '#3e4232'); ctx.fillStyle = '#121210'; ctx.fillRect(20, -2, 4, 8); m8Disc(ctx, 0, 4, 5, '#3a3e36', '#7a8070'); m8Disc(ctx, 13, -2, 5, '#3a3e36', '#7a8070'); ctx.fillStyle = '#121210'; ctx.fillRect(11, -16, 3, 10); if (f.hp <= 0) ddpFire(0, 0, .25, now / 1000, f.d); }
    else if (f.k === 'kubel') { ctx.fillStyle = '#121210'; [[-22, -24], [14, -24], [-22, 14], [14, 14]].forEach(function (p) { ctx.fillRect(p[0], p[1], 8, 12); }); ctx.fillStyle = m8Grad(ctx, -18, 0, 18, 0, [[0, '#4a4a36'], [.5, '#6a6a4e'], [1, '#3a3a2a']]); ctx.beginPath(); ctx.moveTo(-16, -30); ctx.lineTo(16, -30); ctx.lineTo(18, 30); ctx.lineTo(-18, 30); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a2a1e'; ctx.fillRect(-13, -12, 26, 30); ctx.fillStyle = 'rgba(140,170,190,.4)'; ctx.fillRect(-14, -16, 28, 3); [[-6, -4], [6, -4], [-6, 10], [6, 10]].forEach(function (p) { m8Disc(ctx, p[0], p[1], 4.6, '#2a2e26', '#5a6052'); }); if (f.hp <= 0) ddpFire(0, 0, .35, now / 1000, f.d); }
    else { ctx.fillStyle = '#121210'; [[-26, -26], [18, -26], [-26, 16], [18, 16]].forEach(function (p) { ctx.fillRect(p[0], p[1], 8, 14); }); ctx.fillStyle = m8Grad(ctx, -22, 0, 22, 0, [[0, '#4a4e44'], [.5, '#6a6e5e'], [1, '#3a3e34']]); ctx.beginPath(); ctx.moveTo(-14, -36); ctx.lineTo(14, -36); ctx.lineTo(22, -20); ctx.lineTo(22, 30); ctx.lineTo(-22, 30); ctx.lineTo(-22, -20); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#1a1c16'; ctx.lineWidth = 1.4; ctx.stroke(); m8Disc(ctx, 0, 4, 12, '#2a2e26', '#7a8070'); const ta = Math.atan2(-(CH.d - f.d), CH.x - f.x) - (f.ang || 0) - Math.PI / 2; ctx.save(); ctx.translate(0, 4); ctx.rotate(ta + Math.PI / 2); ctx.fillStyle = '#1a1a14'; ctx.fillRect(-2, -30, 4, 26); ctx.restore(); if (f.hp <= 0) ddpFire(0, 0, .5, now / 1000, f.d); }
    ctx.restore();
    if (f.hp > 0 && f.hp < f.maxHp) { ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(f.x - 16, y - f.r * 1.8 - 6, 32, 4); ctx.fillStyle = '#e06040'; ctx.fillRect(f.x - 16, y - f.r * 1.8 - 6, 32 * f.hp / f.maxHp, 4); }
}
function chDrawDark(now) {
    const C = CH; if (!C.dk) { C.dk = document.createElement('canvas'); C.dk.width = 1100; C.dk.height = 700; }
    const d = C.dk.getContext('2d'); d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, 1100, 700); d.fillStyle = 'rgba(6,10,26,.36)'; d.fillRect(0, 0, 1100, 700); d.save(); d.translate(-C.cx, 0); d.globalCompositeOperation = 'destination-out';
    const hole = function (x, y, r, a) { const g = d.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = g; d.beginPath(); d.arc(x, y, r, 0, 7); d.fill(); };
    const beam = function (x, y, ang, len, a) { d.save(); d.translate(x, y); d.rotate(ang); const g = d.createLinearGradient(0, 0, len, 0); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = g; d.beginPath(); d.moveTo(0, -8); d.lineTo(len, -len * .32); d.lineTo(len, len * .32); d.lineTo(0, 8); d.closePath(); d.fill(); d.restore(); };
    beam(C.x + Math.sin(C.ang) * 60, CH_CY - Math.cos(C.ang) * 60, -Math.PI / 2 + C.ang, 420, .95); hole(C.x, CH_CY, 150, .6);
    C.foes.forEach(function (f) {
        if (f.hp <= 0) { hole(f.x, chSY(f.d), 120, .7); return; } beam(f.x, chSY(f.d) - 20, -Math.PI / 2 + (f.ang || 0), 220, .7); });
    (C.L ? C.L.lights : []).forEach(function (l) { const y = chSY(l.d); if (y < -200 || y > 900) return; hole(l.x, y, l.r, l.lamp ? .85 : .6); });
    chEvDark(hole, beam, now);
    C.props.forEach(function (p) { const y = chSY(p.d); if (y < -200 || y > 900) return; if (p.k === 'lamp') hole(p.x, y, 160, .8); if (p.k === 'wreck') hole(p.x, y, 140, .8); if (p.k === 'roadblock') hole(p.x, y - 20, 220, .7); if (p.k === 'lines') hole(chRoadX(p.d), y, 420, .9); if (p.k === 'house' && !p.ruin && m8R(p.s + 4) > .5) hole(p.x, y, 70, .5); });
    C.parts.forEach(function (p) { if (p.k === 'boom' && now - p.t < 700) hole(p.x, chSY(p.d), 260 * p.s, 1 - (now - p.t) / 700); if (p.k === 'flash' && now - p.t < 70) hole(p.x, chSY(p.d), 70, .8); });
    d.restore(); ctx.drawImage(C.dk, 0, 0);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; (C.L ? C.L.lights : []).forEach(function (l) { const y = chSY(l.d), x = l.x - C.cx; if (y < -200 || y > 900) return; const r = l.r * (l.lamp ? .9 : .7), g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,190,110,' + (l.lamp ? .22 : .14) + ')'); g.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }); ctx.translate(-C.cx, 0); chEvLighter(now); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gx = C.x + Math.sin(C.ang) * 60, gy = CH_CY - Math.cos(C.ang) * 60; ctx.translate(gx - C.cx, gy); ctx.rotate(-Math.PI / 2 + C.ang); const g = ctx.createLinearGradient(0, 0, 340, 0); g.addColorStop(0, 'rgba(255,240,200,.18)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(340, -110); ctx.lineTo(340, 110); ctx.lineTo(0, 8); ctx.closePath(); ctx.fill(); ctx.restore();
}
function chDrawHud(now) {
    const C = CH; ctx.save();
    // progress strip
    m8Panel(240, 10, 620, 44); ctx.textAlign = 'left'; ctx.font = '700 12px "Stardos Stencil", Impact'; ctx.fillStyle = '#d9c88c'; ctx.fillText('CHÂTEAU', 254, 30); ctx.textAlign = 'right'; ctx.fillText('BRITISH LINES', 846, 30);
    const k = Math.min(1, C.d / CH_END); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(254, 36, 592, 8); ctx.fillStyle = '#7fc06a'; ctx.fillRect(254, 36, 592 * k, 8); [3200, 6400, 7600, 11800, 13400, 17200, 18400, 22000].forEach(function (z) { ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(254 + 592 * z / CH_END - 1, 34, 2, 12); }); m8Disc(ctx, 254 + 592 * k, 40, 6, '#2e5a2a', '#9fe08a');
    C.foes.forEach(function (f) { if (f.hp <= 0) return; const fk = Math.max(0, Math.min(1, f.d / CH_END)); ctx.fillStyle = '#ff5040'; ctx.fillRect(254 + 592 * fk - 2, 36, 4, 8); });
    ctx.textAlign = 'center'; ctx.font = '11px monospace'; ctx.fillStyle = 'rgba(239,230,198,.7)'; ctx.fillText({ fields: 'OPEN FIELDS', village: 'THE VILLAGE', bridge: 'THE BRIDGE', forest: 'THE FOREST ROAD', roadblock: 'ROADBLOCK AHEAD', orchard: 'ORCHARDS', rail: 'LEVEL CROSSING', ruins: 'THE RUINED TOWN', lines: 'FRIENDLY LINES' }[chZone(C.d)] + '  ·  ' + Math.round((CH_END - Math.min(CH_END, C.d)) / 100) / 10 + ' KM TO GO', 550, 68);
    // car + crew
    m8Panel(12, 12, 210, 108); ctx.textAlign = 'left'; ctx.font = '700 12px "Stardos Stencil", Impact'; ctx.fillStyle = '#d9c88c'; ctx.fillText('HORCH 901 · STAFF CAR', 22, 30); ctx.font = 'bold 11px monospace'; ctx.fillStyle = '#e8e0c0'; ctx.fillText('BODYWORK', 22, 50); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(100, 42, 112, 9); ctx.fillStyle = C.hp > 50 ? '#7fc06a' : C.hp > 25 ? '#e0a040' : '#e04030'; ctx.fillRect(100, 42, 112 * C.hp / 100, 9);
    ctx.fillStyle = '#e8e0c0'; ctx.fillText('SPEED', 22, 70); ctx.fillText(Math.round(C.v * 13) + ' KM/H', 100, 70); ctx.fillText('CREW', 22, 90); ctx.fillText((C.crew + 1) + ' MEN' + (C.crew >= 1 ? ' · HOLLIS ON BREN' : ''), 100, 90); ctx.fillText('KILLS', 22, 110); ctx.fillText(String(C.kills), 100, 110);
    // weapon box
    m8Panel(860, 590, 228, 98); const ic = m8Icon(C.gun, 120, 34); ctx.drawImage(ic, 872, 600, ic.width / 2, ic.height / 2); ctx.textAlign = 'right'; ctx.font = '700 13px "Stardos Stencil", Impact'; ctx.fillStyle = '#ffe2a0'; ctx.fillText(C.gun.short, 1078, 612); ctx.font = '11px monospace'; ctx.fillStyle = '#e8e0c0'; ctx.fillText('CLICK — FIRE', 1078, 630);
    const nc = m8Icon(C.nadeW, 40, 24); ctx.drawImage(nc, 872, 650, nc.width / 2, nc.height / 2); ctx.fillText((C.nadeW.caltrop ? 'G / RIGHT-CLICK — SCATTER ' : 'G / RIGHT-CLICK — DROP ') + C.nadeW.short + ' ×' + C.nadeCount, 1078, 672);
    ctx.textAlign = 'left'; ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(239,230,198,.5)'; ctx.fillText('W/S throttle & brake · A/D steer · stay on the road', 14, 690);
    if (C.msg && now - C.msgAt < C.msgDur) { ctx.textAlign = 'center'; ctx.font = 'bold 15px "Special Elite", "Courier New", monospace'; const wd = ctx.measureText(C.msg).width + 50; m8Panel(550 - wd / 2, 84, wd, 32); ctx.fillStyle = '#e7edc9'; ctx.fillText(C.msg, 550, 106); }
    // speedo needle
    m8Gauge(ctx, 190, 640, 34, Math.min(1, C.v / 8.5), false);
    // crosshair
    ctx.strokeStyle = 'rgba(255,240,200,.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(C.mx, C.my, 8, 0, 7); ctx.moveTo(C.mx - 13, C.my); ctx.lineTo(C.mx - 4, C.my); ctx.moveTo(C.mx + 4, C.my); ctx.lineTo(C.mx + 13, C.my); ctx.moveTo(C.mx, C.my - 13); ctx.lineTo(C.mx, C.my - 4); ctx.moveTo(C.mx, C.my + 4); ctx.lineTo(C.mx, C.my + 13); ctx.stroke();
    ctx.restore();
}
