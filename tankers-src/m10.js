/* =====================================================
   MISSION 10 — THE U-BOAT PENS (frogman raid, Lorient, night)
   WASD swim · SPACE dive / surface · F plant limpet / cut net · mouse + click: Welrod (surfaced only)
===================================================== */
const M10W = 2400, M10H = 1700;
const M10 = { running: false, failWhy: '', result: null };
const M10_LAND = [[0, 0, 2400, 140], [760, 140, 900, 60], [0, 140, 520, 910], [1880, 140, 520, 910], [0, 1180, 1050, 60], [1350, 1180, 1050, 60]];
const M10_PIERS = [760, 970, 1180, 1390, 1600]; // each 60 wide, y 200..560
const M10_BAYS = [820, 1030, 1240, 1450];        // each 150 wide
const M10_PEN = { x0: 760, x1: 1660, y0: 140, y1: 560 };
const M10_NET = { x0: 1050, x1: 1350, y: 1210 };
const M10_PICK = { x: 2180, y: 1560 }, M10_START = { x: 300, y: 1560 };
function m10Land() { const L = M10_LAND.slice(); M10_PIERS.forEach(function (x) { L.push([x, 200, 60, 360]); }); return L; }
function m10Caps(ax, ay, bx, by, r, extra) { return Object.assign({ ax: ax, ay: ay, bx: bx, by: by, r: r }, extra || {}); }
function m10CapDist(c, x, y) { const dx = c.bx - c.ax, dy = c.by - c.ay, L2 = dx * dx + dy * dy || 1; let t = ((x - c.ax) * dx + (y - c.ay) * dy) / L2; t = Math.max(0, Math.min(1, t)); return Math.hypot(x - (c.ax + dx * t), y - (c.ay + dy * t)) - c.r; }
function m10Blocked(x, y, r) {
    const M = M10; if (x < r || y < r || x > M10W - r || y > M10H - r) return true;
    for (let i = 0; i < M.land.length; i++) { const R = M.land[i]; const cx = Math.max(R[0], Math.min(x, R[0] + R[2])), cy = Math.max(R[1], Math.min(y, R[1] + R[3])); if (Math.hypot(x - cx, y - cy) < r) return true; }
    for (let i = 0; i < M.hulls.length; i++) if (m10CapDist(M.hulls[i], x, y) < r) return true;
    return false;
}
function m10NetBlocks(y0, y1, x) { const N = M10_NET; if (x < N.x0 || x > N.x1) return false; if ((y0 - N.y) * (y1 - N.y) > 0 && Math.abs(y1 - N.y) > 0) return false; if (M10.gateOpen && x > 1120 && x < 1280) return false; return !M10.netGaps.some(function (g) { return Math.abs(g - x) < 30; }); }
/* ---------- setup ---------- */
function m10Begin() {
    const M = M10, now = performance.now();
    Object.assign(M, { running: true, t0: now, last: now, k: {}, mx: 550, my: 350, mdown: false, failWhy: '', result: null, won: false, lost: false, endAt: 0, msg: '', msgAt: 0, msgDur: 0, alarm: false, alarmUntil: 0, sus: 0, lastSeen: null, kills: 0, shots: 0, seenEver: false,
        p: { x: M10_START.x + 40, y: M10_START.y - 10, vx: 0, vy: 0, ang: -.4, sub: false, o2: 100, hp: 100, kick: 0, diveAt: 0, hurtAt: 0, plantT: 0 }, ammo: 8, limpets: 4, netGaps: [], cutT: 0, timer: 0, blown: false, blowAt: 0, fx: [], parts: [], charges: [], bullets: [], cam: { x: 0, y: 950 }, cine: null, sirenAt: 0, gateOpen: false, flares: [], hydroSus: 0, precAt: now + 25000 });
    M.cmines = [[700, 1420], [880, 1330], [1130, 1360], [1290, 1440], [1500, 1350], [1680, 1450], [960, 1100], [1440, 1080], [800, 950], [1600, 900], [1100, 760], [1350, 700], [700, 700], [1760, 1060], [1250, 1000], [1000, 620]].map(function (q) { return { x: q[0], y: q[1], dead: false }; });
    M.hydros = [{ x: 1200, y: 1430 }, { x: 1180, y: 860 }, { x: 1230, y: 640 }];
    M.land = m10Land();
    M.subs = [0, 1].map(function (b, i) { return m10SubMake(M10_BAYS[b] + 75, 385, Math.PI / 2, 'U-' + [255, 618][i]); });
    const arr = m10SubMake(1200, 1790, -Math.PI / 2, 'U-981'); arr.arriving = true; arr.path = [[1200, 1500], [1200, 1240], [1200, 900], [1360, 760], [1525, 640], [1525, 385]]; arr.pi = 0; arr.spd = 0; M.subs.push(arr); M.arrival = { state: 0 };
    M.tanker = m10Caps(566, 560, 566, 1000, 36, { kind: 'tanker', name: 'TANKER "ROSENHEIM"', mined: false });
    M.moored = [m10Caps(1850, 300, 1850, 380, 14, { kind: 'boat' }), m10Caps(1850, 760, 1850, 830, 14, { kind: 'boat' }), m10Caps(1700, 1150, 1780, 1150, 12, { kind: 'boat' })];
    M.hulls = M.subs.concat([M.tanker]).concat(M.moored); M.subs.forEach(m10SubCaps);
    M.lights = [{ x: 1035, y: 1205, base: Math.PI / 2 + .35, amp: 1.0, spd: .00042, ph: 0 }, { x: 1365, y: 1205, base: -Math.PI / 2, amp: 1.05, spd: .00036, ph: 2 }, { x: 1210, y: 570, base: Math.PI / 2, amp: 1.0, spd: .0004, ph: 4 }, { x: 515, y: 1020, base: -.25, amp: .8, spd: .0005, ph: 1 }, { x: 1885, y: 620, base: Math.PI + .2, amp: .85, spd: .00045, ph: 3 }, { x: 580, y: 760, base: .15, amp: .9, spd: .00052, ph: 5 }, { x: 1630, y: 570, base: Math.PI / 2 + .3, amp: .9, spd: .00048, ph: 6 }].map(function (L) { return Object.assign(L, { ang: L.base, len: 640, half: .11, dead: false }); });
    M.lamps = M10_BAYS.map(function (x) { return { x: x + 75, y: 330, r: 150, dead: false, pen: 1 }; }).concat([{ x: 470, y: 400, r: 120 }, { x: 1930, y: 1000, r: 120 }, { x: 260, y: 1190, r: 90 }, { x: 2140, y: 1190, r: 90 }]);
    M.launches = [{ path: [[700, 700], [1700, 700], [1700, 1100], [700, 1100]] }, { path: [[1200, 640], [1760, 900], [1200, 1120], [650, 900]] }, { path: [[400, 1330], [2000, 1330]] }, { path: [[880, 640], [1580, 640]] }].map(function (L, i) { return Object.assign(L, { x: L.path[0][0], y: L.path[0][1], ang: 0, wi: 1, spd: 1.35, dcAt: 0, i: i, dead: false, wake: [] }); });
    const S = function (path, gun) { return { path: path, x: path[0][0], y: path[0][1], ang: 0, wi: 1, spd: .55, wait: 0, gun: gun || 'kar98', seed: Math.random() * 99 | 0, dead: false, lastShot: 0, hp: 1 }; };
    M.sentries = [S([[120, 1208], [1000, 1208]]), S([[1400, 1208], [2300, 1208]], 'mp40'), S([[492, 220], [492, 1030]]), S([[1908, 220], [1908, 1030]], 'mp40'), S([[1000, 230], [1000, 540]], 'mp40'), S([[1210, 540], [1210, 230]]), S([[1420, 230], [1420, 540]], 'mp40'), S([[790, 540], [790, 230]]), S([[200, 1150], [480, 1150]]), S([[1920, 1150], [2300, 1150]], 'mp40')];
    if (!M.base) M.base = m10BuildBase();
    m10Say('SLIP OVER THE SIDE. THE HARBOUR MOUTH IS EAST, PAST THE SEARCHLIGHTS. SPACE TO DIVE.', 5200);
    ['m2Brief', 'm8Arm', 'm9Safe'].forEach(function (id) { const e = document.getElementById(id); if (e) e.hidden = true; });
    const mb = document.getElementById('battleMainMenuButton'); if (mb) { mb.style.display = 'block'; mb.textContent = '↩️ ABORT MISSION'; }
    canvas.style.cursor = 'none';
    if (!M.listeners) { M.listeners = true;
        window.addEventListener('keydown', function (e) { if (!M10.running) return; M10.k[e.code] = true; if (e.code === 'Space') { e.preventDefault(); m10Dive(); } });
        window.addEventListener('keyup', function (e) { M10.k[e.code] = false; });
        canvas.addEventListener('mousedown', function (e) { if (M10.running && e.button === 0) M10.mdown = true; });
        window.addEventListener('mouseup', function () { M10.mdown = false; });
        canvas.addEventListener('mousemove', function (e) { const r = canvas.getBoundingClientRect(); M10.mx = (e.clientX - r.left) * 1100 / r.width; M10.my = (e.clientY - r.top) * 700 / r.height; });
        window.addEventListener('blur', function () { M10.k = {}; M10.mdown = false; });
    }
    try { initAudio(); } catch (e) {}
    cancelAnimationFrame(M.raf); M.raf = requestAnimationFrame(m10Loop);
}
function m10Cleanup() { M10.running = false; cancelAnimationFrame(M10.raf); }
function m10Say(t, ms) { M10.msg = t; M10.msgAt = performance.now(); M10.msgDur = ms || 3000; }
function m10Dive() { const P = M10.p, now = performance.now(); if (now - P.diveAt < 450 || M10.won || M10.lost) return; if (!P.sub && P.o2 < 12) { m10Say('NOT ENOUGH AIR YET — BREATHE FOR A FEW SECONDS.', 1600); return; } P.sub = !P.sub; P.diveAt = now; try { if (P.sub) playTone(300, 120, .3, .04, 'sine'); else playTone(160, 420, .25, .04, 'sine'); } catch (e) {} for (let i = 0; i < 10; i++) M10.parts.push({ k: 'bub', x: P.x + (Math.random() - .5) * 18, y: P.y + (Math.random() - .5) * 18, vx: 0, vy: 0, life: 1, decay: .03, r: 2 + Math.random() * 3 }); }
/* ---------- loop ---------- */
function m10Loop(now) { if (!M10.running) return; if (typeof minimapPanel !== 'undefined' && minimapPanel && minimapPanel.style.display !== 'none') minimapPanel.style.display = 'none'; const dt = Math.min(50, now - M10.last) / 16.67; M10.last = now; try { m10Update(dt, now); if (!M10.running) return; m10Draw(now); } catch (e) { console.error(e); DDP.err = e; } if (M10.endAt && now > M10.endAt) { m10End(); return; } M10.raf = requestAnimationFrame(m10Loop); }
function m10Hurt(d, why) { const P = M10.p; if (M10.lost || M10.won) return; P.hp -= d; P.hurtAt = performance.now(); M10.shake = Math.max(M10.shake || 0, Math.min(10, d * .4)); try { playTone(180, 80, .15, .06, 'square'); } catch (e) {} if (P.hp <= 0) { P.hp = 0; M10.lost = true; M10.failWhy = why || 'killed'; M10.endAt = performance.now() + 2600; m10Say(why === 'drown' ? 'OUT OF OXYGEN...' : why === 'blast' ? 'CAUGHT IN THE BLAST.' : 'YOU\'VE BEEN HIT. THE RAID IS OVER.', 3000); } }
function m10Seen(x, y, k, by) { const M = M10, now = performance.now(); M.sus = Math.min(1.2, M.sus + k); M.lastSeen = { x: x, y: y, t: now }; if (M.sus >= 1 && !M.alarm) { M.alarm = true; M.seenEver = true; m10Say(by === 'light' ? 'SEARCHLIGHT! THEY\'VE SPOTTED YOU — DIVE!' : 'ALARM! THEY\'VE SEEN YOU — GET UNDER!', 2600); } if (M.alarm) M.alarmUntil = now + 22000; }
function m10Update(dt, now) {
    const M = M10, P = M.p, k = M.k;
    if (M.cine) { m10CineUpdate(dt, now); return; }
    // swim
    if (!M.lost && !M.won) {
        const ix = ((k.KeyD || k.ArrowRight) ? 1 : 0) - ((k.KeyA || k.ArrowLeft) ? 1 : 0), iy = ((k.KeyS || k.ArrowDown) ? 1 : 0) - ((k.KeyW || k.ArrowUp) ? 1 : 0), il = Math.hypot(ix, iy) || 1, slow = k.ShiftLeft || k.ShiftRight; P.slow = slow; const sp = (P.sub ? 1.75 : 1.95) * (slow ? .5 : 1);
        P.vx += (ix / il * sp - P.vx) * .08 * dt; P.vy += (iy / il * sp - P.vy) * .08 * dt; if (ix || iy) { P.ang = m8Turn(P.ang, Math.atan2(iy, ix), .12); P.kick += .25 * dt; }
        M.hulls.forEach(function (h) { const d = m10CapDist(h, P.x, P.y); if (d < 10) { const dx = h.bx - h.ax, dy = h.by - h.ay, L2 = dx * dx + dy * dy || 1; let t = ((P.x - h.ax) * dx + (P.y - h.ay) * dy) / L2; t = Math.max(0, Math.min(1, t)); const qx = h.ax + dx * t, qy = h.ay + dy * t, dd = Math.hypot(P.x - qx, P.y - qy) || 1; P.x = qx + (P.x - qx) / dd * (h.r + 11); P.y = qy + (P.y - qy) / dd * (h.r + 11); } });
        const nx = P.x + P.vx * dt, ny = P.y + P.vy * dt;
        if (!m10Blocked(nx, P.y, 10)) P.x = nx; else P.vx *= -.2;
        if (!m10Blocked(P.x, ny, 10) && !m10NetBlocks(P.y, ny, P.x)) P.y = ny; else { if (m10NetBlocks(P.y, ny, P.x) && (!M.netHint || now - M.netHint > 4000)) { M.netHint = now; m10Say('ANTI-SUBMARINE NET. DIVE AND HOLD F TO CUT THROUGH IT.', 2600); } P.vy *= -.2; }
        // oxygen
        if (!P.sub) P.o2 = Math.min(100, P.o2 + dt * .17); if (P.sub) { P.o2 = Math.max(0, P.o2 - dt * .042); if (P.o2 <= 0) { P.sub = false; P.diveAt = now + 1500; m10Say('OUT OF AIR — YOU HAVE TO COME UP!', 2400); } if (P.o2 < 20 && Math.floor(now / 900) !== M.o2beep) { M.o2beep = Math.floor(now / 900); try { playTone(880, 880, .05, .02, 'square'); } catch (e) {} } }
        // interact: F
        const F = k.KeyF || k.KeyE; let act = null;
        if (P.sub) { M.subs.concat([M.tanker]).forEach(function (h) { if (!h.mined && m10CapDist(h, P.x, P.y) < 26 && M.limpets > 0) act = { k: 'limpet', h: h }; }); if (!act && Math.abs(P.y - M10_NET.y) < 46 && P.x > M10_NET.x0 && P.x < M10_NET.x1 && !M.netGaps.some(function (g) { return Math.abs(g - P.x) < 30; })) act = { k: 'net' }; }
        M.act = act;
        if (act && F) { P.plantT += dt / 60; const need = act.k === 'net' ? 2.2 : 2.4; if (Math.random() < .2) M.parts.push({ k: 'bub', x: P.x + (Math.random() - .5) * 10, y: P.y + (Math.random() - .5) * 10, vx: 0, vy: 0, life: 1, decay: .04, r: 1.5 }); if (P.plantT >= need) { P.plantT = 0; if (act.k === 'net') { M.netGaps.push(P.x); m10Say('THROUGH THE NET. INTO THE HARBOUR.', 2200); try { playTone(700, 300, .1, .03, 'square'); } catch (e) {} } else { act.h.mined = true; act.h.mineAt = { x: P.x, y: P.y }; if (act.h.kind === 'sub') { const c = Math.cos(-act.h.a), s2 = Math.sin(-act.h.a); act.h.mineLocal = [(P.x - act.h.cx) * c - (P.y - act.h.cy) * s2, (P.x - act.h.cx) * s2 + (P.y - act.h.cy) * c]; } M.limpets--; try { playTone(240, 240, .12, .05, 'triangle'); setTimeout(function () { try { playTone(240, 240, .12, .05, 'triangle'); } catch (e) {} }, 160); } catch (e) {} const left = M.subs.filter(function (s) { return !s.mined; }).length; if (act.h.kind === 'tanker') m10Say('LIMPET ON THE TANKER. A BONUS FOR THE NAVY.', 2400); else if (left > 0) m10Say('LIMPET ON ' + act.h.name + '. ' + left + ' MORE U-BOAT' + (left > 1 ? 'S' : '') + '.', 2600); else { M.timer = 150; m10Say('ALL THREE U-BOATS MINED. TIME PENCILS RUNNING — 2½ MINUTES. GET TO THE GUNBOAT!', 4200); try { [600, 800, 1000].forEach(function (f, i) { setTimeout(function () { try { playTone(f, f, .12, .05, 'triangle'); } catch (e) {} }, i * 140); }); } catch (e) {} } } } }
        else P.plantT = Math.max(0, P.plantT - dt / 30);
        // Welrod
        if (M.mdown && !P.sub && M.ammo > 0 && now - (M.lastShot || 0) > 900) { M.mdown = false; M.lastShot = now; M.ammo--; M.shots++; const wx = M.mx + M.cam.x, wy = M.my + M.cam.y, a = Math.atan2(wy - P.y, wx - P.x); M.bullets.push({ x: P.x, y: P.y, vx: Math.cos(a) * 26, vy: Math.sin(a) * 26, life: 22 }); try { playTone(180, 90, .06, .04, 'square'); } catch (e) {} M.fx.push({ k: 'flash', x: P.x + Math.cos(a) * 14, y: P.y + Math.sin(a) * 14, t: now }); m10Noise(P.x, P.y, 70); }
        else if (M.mdown && P.sub) { M.mdown = false; m10Say('YOU CAN\'T FIRE UNDERWATER — SURFACE FIRST (SPACE).', 1600); }
        // pickup
        if (Math.hypot(P.x - M10_PICK.x, P.y - M10_PICK.y) < 80) { if (M.subs.every(function (s) { return s.mined; })) { M.won = true; M.running = false; cancelAnimationFrame(M.raf); try { playTone(300, 600, .3, .05, 'triangle'); } catch (e) {} m10PlayEnding(function () { m10End(); }); return; } else if (!M.pickHint || now - M.pickHint > 5000) { M.pickHint = now; m10Say('THE GUNBOAT WAITS — BUT NOT UNTIL ALL THREE U-BOATS ARE MINED.', 2600); } }
        // in the pen when it goes up
        if (M.timer > 0) { M.timer -= dt / 60; if (M.timer <= 0) { M.timer = 0; m10Blow(now); } }
    }
    // searchlights sweep / track
    M.lights.forEach(function (L) { if (L.dead) return; if (M.alarm && M.lastSeen && Math.hypot(M.lastSeen.x - L.x, M.lastSeen.y - L.y) < L.len) L.ang = m8Turn(L.ang, Math.atan2(M.lastSeen.y - L.y, M.lastSeen.x - L.x), .03 * dt); else L.ang = m8Turn(L.ang, L.base + Math.sin(now * L.spd + L.ph) * L.amp, .05 * dt);
        if (!P.sub && !M.lost) { const d = Math.hypot(P.x - L.x, P.y - L.y), a = Math.atan2(P.y - L.y, P.x - L.x); if (d < L.len && m8AngDiff(a, L.ang) < L.half + 12 / Math.max(40, d)) m10Seen(P.x, P.y, 2, 'light'); } });
    m10ExtraUpdate(dt, now);
    // sentries
    M.sentries.forEach(function (s) { if (s.dead) return;
        if (M.alarm && M.lastSeen && !P.sub && Math.hypot(P.x - s.x, P.y - s.y) < 420) { s.ang = m8Turn(s.ang, Math.atan2(P.y - s.y, P.x - s.x), .15 * dt); if (now - s.lastShot > 1100 && m10SeesSurface(s.x, s.y, s.ang, 420, 1.4)) { s.lastShot = now; const d = Math.hypot(P.x - s.x, P.y - s.y); M.fx.push({ k: 'flash', x: s.x + Math.cos(s.ang) * 12, y: s.y + Math.sin(s.ang) * 12, t: now }); try { playTone(300, 120, .06, .04, 'sawtooth'); } catch (e) {} if (Math.random() < Math.max(.25, .85 - d / 600)) m10Hurt(9, 'shot'); else M.parts.push({ k: 'splash', x: P.x + (Math.random() - .5) * 40, y: P.y + (Math.random() - .5) * 40, life: 1, decay: .05, r: 4 }); } return; }
        if (s.wait > 0) { s.wait -= dt; s.ang += Math.sin(now / 700 + s.seed) * .01 * dt; } else { const t = s.path[s.wi], d = Math.hypot(t[0] - s.x, t[1] - s.y); if (d < 2) { s.wi = (s.wi + 1) % s.path.length; s.wait = 120 + Math.random() * 120; } else { s.x += (t[0] - s.x) / d * s.spd * dt; s.y += (t[1] - s.y) / d * s.spd * dt; s.ang = m8Turn(s.ang, Math.atan2(t[1] - s.y, t[0] - s.x), .1 * dt); s.walk = (s.walk || 0) + s.spd * dt; } }
        if (!P.sub && !M.lost) { const lit = m10LitAt(P.x, P.y), rng = 170 + lit * 160; if (m10SeesSurface(s.x, s.y, s.ang, rng, 1.1)) m10Seen(P.x, P.y, (.03 + lit * .045) * dt * (1 - Math.hypot(P.x - s.x, P.y - s.y) / rng * .6), 'man'); } });
    // launches
    M.launches.forEach(function (L) { if (L.dead) return; let tx, ty; const hunting = M.alarm && M.lastSeen && L.i !== 2 + (M.timer > 0 ? 9 : 0);
        if (hunting) { tx = M.lastSeen.x; ty = M.lastSeen.y; } else { const w = L.path[L.wi]; tx = w[0]; ty = w[1]; if (Math.hypot(tx - L.x, ty - L.y) < 30) L.wi = (L.wi + 1) % L.path.length; }
        const a = Math.atan2(ty - L.y, tx - L.x); L.ang = m8Turn(L.ang, a, .025 * dt); const sp = (hunting ? 2.5 : L.spd) * (Math.hypot(tx - L.x, ty - L.y) < 60 && hunting ? .4 : 1); const nx = L.x + Math.cos(L.ang) * sp * dt, ny = L.y + Math.sin(L.ang) * sp * dt; if (!m10Blocked(nx, ny, 18)) { L.x = nx; L.y = ny; } else L.ang += .08 * dt;
        if (Math.random() < .5) L.wake.push({ x: L.x - Math.cos(L.ang) * 34, y: L.y - Math.sin(L.ang) * 34, t: now, a: L.ang }); L.wake = L.wake.filter(function (w) { return now - w.t < 2400; });
        // spotlight
        if (!P.sub && !M.lost && m10SeesSurface(L.x, L.y, L.ang, 300, .5)) m10Seen(P.x, P.y, .05 * dt, 'light');
        // propeller
        if (Math.hypot(P.x - (L.x - Math.cos(L.ang) * 36), P.y - (L.y - Math.sin(L.ang) * 36)) < 24 && now - (P.propAt || 0) > 1200) { P.propAt = now; m10Hurt(16, 'prop'); m10Say('THE PROPELLER! GET CLEAR!', 1400); }
        if (Math.hypot(P.x - L.x, P.y - L.y) < 26) { const a2 = Math.atan2(P.y - L.y, P.x - L.x); P.vx += Math.cos(a2) * 1.5; P.vy += Math.sin(a2) * 1.5; }
        // depth charges
        if (hunting && Math.hypot(M.lastSeen.x - L.x, M.lastSeen.y - L.y) < 170 && now - L.dcAt > 2400) { L.dcAt = now; const ox = (Math.random() - .5) * 120, oy = (Math.random() - .5) * 120; M.charges.push({ x: M.lastSeen.x + ox, y: M.lastSeen.y + oy, t: now, at: now + 1500 }); try { playTone(200, 120, .1, .04, 'triangle'); } catch (e) {} } });
    M.charges = M.charges.filter(function (c) { if (now < c.at) return true; m10Splash(c.x, c.y, 1); const d = Math.hypot(P.x - c.x, P.y - c.y); if (d < 140 && !M.lost) m10Hurt((P.sub ? 42 : 24) * (1 - d / 140) + 6, 'charge'); return false; });
    // alarm decay
    if (!M.alarm) M.sus = Math.max(0, M.sus - .004 * dt); else if (now > M.alarmUntil) { M.alarm = false; M.sus = .4; m10Say('THE SEARCH IS DYING DOWN...', 2000); }
    if (M.alarm && now - M.sirenAt > 1800) { M.sirenAt = now; try { playTone(420, 640, .8, .025, 'sawtooth'); setTimeout(function () { try { playTone(640, 420, .8, .025, 'sawtooth'); } catch (e) {} }, 850); } catch (e) {} }
    // bullets (ours)
    M.bullets.forEach(function (b) { for (let st = 0; st < 3 && b.life > 0; st++) { b.x += b.vx * dt / 3; b.y += b.vy * dt / 3;
        M.lights.forEach(function (L) { if (!L.dead && Math.hypot(b.x - L.x, b.y - L.y) < 14) { L.dead = true; b.life = 0; m10Say('SEARCHLIGHT SHOT OUT.', 1400); try { playTone(1400, 300, .2, .04, 'square'); } catch (e) {} for (let i = 0; i < 10; i++) M.parts.push({ k: 'spark', x: L.x, y: L.y, vx: (Math.random() - .5) * 4, vy: (Math.random() - .5) * 4, life: 1, decay: .05 }); m10Noise(L.x, L.y, 260); } });
        M.lamps.forEach(function (L) { if (!L.dead && Math.hypot(b.x - L.x, b.y - L.y) < 12) { L.dead = true; b.life = 0; try { playTone(1600, 400, .12, .03, 'square'); } catch (e) {} m10Noise(L.x, L.y, 180); } });
        M.sentries.forEach(function (s) { if (!s.dead && Math.hypot(b.x - s.x, b.y - s.y) < 12) { s.dead = true; s.deathAng = Math.atan2(b.vy, b.vx); b.life = 0; M.kills++; m10Noise(s.x, s.y, 120); } });
        } b.life -= dt; });
    M.bullets = M.bullets.filter(function (b) { return b.life > 0; });
    M.parts.forEach(function (p) { if (p.vx !== undefined) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .95; p.vy *= .95; } if (p.k === 'smoke') p.r += .3 * dt; p.life -= p.decay * dt; });
    M.parts = M.parts.filter(function (p) { return p.life > 0; });
    M.fx = M.fx.filter(function (f) { return now - f.t < (f.k === 'boom' ? 1800 : 400); });
    if (P.sub && (Math.abs(P.vx) + Math.abs(P.vy)) > .4 && Math.random() < .08) M.parts.push({ k: 'bub', x: P.x - Math.cos(P.ang) * 10, y: P.y - Math.sin(P.ang) * 10, vx: 0, vy: 0, life: 1, decay: .03, r: 1.4 });
    if (!P.sub && (Math.abs(P.vx) + Math.abs(P.vy)) > .5 && Math.random() < .15) M.parts.push({ k: 'ring', x: P.x, y: P.y, life: 1, decay: .025, r: 8 });
    M.shake = Math.max(0, (M.shake || 0) - .5 * dt);
    // camera
    const tcx = Math.max(0, Math.min(M10W - 1100, P.x - 550)), tcy = Math.max(0, Math.min(M10H - 700, P.y - 350)); M.cam.x += (tcx - M.cam.x) * .1; M.cam.y += (tcy - M.cam.y) * .1;
}
function m10Noise(x, y, r) { const M = M10; M.sentries.forEach(function (s) { if (!s.dead && Math.hypot(s.x - x, s.y - y) < r) { s.ang = Math.atan2(y - s.y, x - s.x); s.wait = 180; } }); if (r > 200) { M.sus = Math.min(.95, M.sus + .35); } }
function m10LitAt(x, y) { let L = 0; M10.lamps.forEach(function (l) { if (l.dead) return; const d = Math.hypot(x - l.x, y - l.y); if (d < l.r) L = Math.max(L, 1 - d / l.r); }); if (M10.blown) L = Math.max(L, (y < 700 && x > 700 && x < 1700) ? .8 : .3); return L; }
function m10SeesSurface(x, y, ang, rng, fov) { const P = M10.p; if (P.sub) return false; const d = Math.hypot(P.x - x, P.y - y); if (d > rng) return false; return m8AngDiff(Math.atan2(P.y - y, P.x - x), ang) < fov / 2; }
function m10Splash(x, y, s) { const now = performance.now(), M = M10; M.fx.push({ k: 'geyser', x: x, y: y, t: now, s: s }); for (let i = 0; i < 24; i++) { const a = Math.random() * 7, sp = 1 + Math.random() * 4 * s; M.parts.push({ k: 'drop', x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: .025 }); } M.shake = Math.max(M.shake || 0, 6 * s); try { playExplosionSound(.6 * s); } catch (e) {} }
function m10Blow(now) { // the time pencils go off
    const M = M10, P = M.p; M.blown = true; M.blowAt = now;
    M.subs.concat([M.tanker]).forEach(function (h, i) { if (!h.mined) return; setTimeout(function () { const mw = h.kind === 'sub' ? m10SubMineWorld(h) : h.mineAt, x = mw ? mw.x : (h.ax + h.bx) / 2, y = mw ? mw.y : (h.ay + h.by) / 2; M.fx.push({ k: 'boom', x: x, y: y, t: performance.now(), s: 1.6 }); m10Splash(x, y, 2); h.sunk = performance.now(); for (let k = 0; k < 18; k++) M.parts.push({ k: 'smoke', x: x + (Math.random() - .5) * 60, y: y + (Math.random() - .5) * 120, vx: (Math.random() - .5) * .4, vy: -.2, life: 1, decay: .004, r: 20 + Math.random() * 30 }); if (!M.won && !M.lost && Math.hypot(P.x - x, P.y - y) < 260) m10Hurt(200, 'blast'); }, i * 700); });
    if (!M.won) { M.alarm = true; M.alarmUntil = now + 60000; m10Say('THE PENS ARE GOING UP! THE WHOLE HARBOUR IS AWAKE — GET TO THE GUNBOAT!', 3600); }
}
/* ---------- victory cinematic ---------- */
function m10CineStart(now) { const M = M10; M.cine = { t0: now, fromX: M.cam.x, fromY: M.cam.y }; M.p.sub = false; if (!M.blown) setTimeout(function () { m10Blow(performance.now()); }, 2600); }
function m10CineUpdate(dt, now) { const M = M10, C = M.cine; if (M.blown && now - M.blowAt > 2200 && Math.random() < .05 * dt) { const x = 780 + Math.random() * 860, y = 200 + Math.random() * 360; M.fx.push({ k: 'boom', x: x, y: y, t: now, s: .6 + Math.random() * .7 }); for (let i = 0; i < 10; i++) { const a = Math.random() * 7; M.parts.push({ k: 'chunk', x: x, y: y, vx: Math.cos(a) * (3 + Math.random() * 5), vy: Math.sin(a) * (3 + Math.random() * 5), life: 1, decay: .02, rot: Math.random() * 6, r: 3 + Math.random() * 6 }); } M.parts.push({ k: 'smoke', x: x, y: y, vx: .3, vy: -.3, life: 1, decay: .005, r: 40 }); M.shake = Math.max(M.shake || 0, 5); try { playExplosionSound(.5 + Math.random() * .5); } catch (e) {} }
    const k = Math.min(1, (now - C.t0) / 2400), e = k * k * (3 - 2 * k); M.cam.x = C.fromX + (760 - C.fromX) * e; M.cam.y = C.fromY + (80 - C.fromY) * e; M.parts.forEach(function (p) { if (p.vx !== undefined) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .95; p.vy *= .95; } if (p.k === 'smoke') p.r += .3 * dt; p.life -= p.decay * dt; }); M.parts = M.parts.filter(function (p) { return p.life > 0; }); M.fx = M.fx.filter(function (f) { return now - f.t < (f.k === 'boom' ? 1800 : 600); }); M.shake = Math.max(0, (M.shake || 0) - .4 * dt); if (now - C.t0 > 8200 && !M.endAt) M.endAt = now + 600; }
function m10End() {
    const M = M10; M.running = false; cancelAnimationFrame(M.raf); canvas.style.cursor = ''; campaignMission = 10; selectedGameMode = 'campaign';
    M.result = { alarm: M.seenEver, tanker: M.tanker.mined, kills: M.kills, hp: Math.round(M.p.hp), o2: Math.round(M.p.o2) };
    if (M.won) { progression.campaignM10Done = true; try { addXP(1100, 'victory'); saveProgression(); } catch (e) {} showCampaignResult(true); } else showCampaignResult(false);
}
function m10Stars() { const r = M10.result || {}; return 1 + (r.alarm ? 0 : 1) + (r.tanker ? 1 : 0); }

/* ---------- U-boat model (centre, heading) ---------- */
function m10SubMake(cx, cy, a, name) { return { kind: 'sub', name: name, cx: cx, cy: cy, a: a, hl: 135, r: 23, mined: false }; }
function m10SubCaps(h) { const c = Math.cos(h.a), s = Math.sin(h.a); h.ax = h.cx - c * h.hl; h.ay = h.cy - s * h.hl; h.bx = h.cx + c * h.hl; h.by = h.cy + s * h.hl; }
function m10SubMineWorld(h) { if (!h.mineLocal) return h.mineAt; const c = Math.cos(h.a), s = Math.sin(h.a); return { x: h.cx + h.mineLocal[0] * c - h.mineLocal[1] * s, y: h.cy + h.mineLocal[0] * s + h.mineLocal[1] * c }; }
/* ---------- new dangers + the arriving U-boat ---------- */
function m10ExtraUpdate(dt, now) {
    const M = M10, P = M.p, A = M.arrival, U = M.subs[2];
    // the third U-boat comes home
    if (A.state === 0 && (M.netGaps.length || P.y < 1170 || now - M.t0 > 75000)) { A.state = 1; A.t = now; m10Say('A U-BOAT IS COMING IN — U-981, BACK FROM PATROL. THE BOOM GATE IS OPENING!', 3800); try { playTone(110, 90, 1.6, .05, 'sawtooth'); } catch (e) {} }
    if (A.state === 1) { const w = U.path[U.pi]; if (w) { const d = Math.hypot(w[0] - U.cx, w[1] - U.cy); U.spd = Math.min(1.05, U.spd + .006 * dt); if (U.pi === U.path.length - 1) U.spd = Math.min(U.spd, Math.max(.15, d / 120)); U.a = m8Turn(U.a, Math.atan2(w[1] - U.cy, w[0] - U.cx), .012 * dt); U.cx += Math.cos(U.a) * U.spd * dt; U.cy += Math.sin(U.a) * U.spd * dt; if (d < 18) { U.pi++; if (U.pi >= U.path.length) { A.state = 2; U.a = -Math.PI / 2; m10Say('U-981 IS IN HER BAY. THREE TARGETS.', 2400); } } }
        m10SubCaps(U); M.gateOpen = U.cy > 1080 && U.cy < 1700; if (!M.gateWas && M.gateOpen) { try { playTone(90, 70, 1, .05, 'square'); } catch (e) {} } M.gateWas = M.gateOpen;
        if (Math.random() < .6) M.parts.push({ k: 'ring', x: U.cx - Math.cos(U.a) * 150, y: U.cy - Math.sin(U.a) * 150, life: 1, decay: .012, r: 10 });
        // the tug ahead lights the water
        A.tx = U.cx + Math.cos(U.a) * 230; A.ty = U.cy + Math.sin(U.a) * 230;
        if (!P.sub && !M.lost && m10SeesSurface(A.tx, A.ty, U.a, 320, .6)) m10Seen(P.x, P.y, .06 * dt, 'light');
        // propeller wash
        if (P.sub && Math.hypot(P.x - (U.cx - Math.cos(U.a) * 160), P.y - (U.cy - Math.sin(U.a) * 160)) < 34 && now - (P.propAt || 0) > 1000 && U.spd > .3) { P.propAt = now; m10Hurt(20, 'prop'); m10Say('THE U-BOAT\'S SCREWS! GET AWAY FROM THE STERN!', 1600); }
        if (U.pi < U.path.length && P.sub && m10CapDist(U, P.x, P.y) < 40) { M.shadowed = now; } }
    else M.gateOpen = false;
    // contact mines
    M.cmines.forEach(function (m) { if (m.dead) return; if (P.sub && Math.hypot(P.x - m.x, P.y - m.y) < 15) { m.dead = true; M.fx.push({ k: 'boom', x: m.x, y: m.y, t: now, s: .9 }); m10Splash(m.x, m.y, 1.4); m10Hurt(48, 'mine'); m10Seen(m.x, m.y, 2, 'man'); m10Say('A MINE! THE WHOLE HARBOUR HEARD THAT!', 2400); } });
    // hydrophones
    let heard = false; if (P.sub && !P.slow && Math.hypot(P.vx, P.vy) > 1.1) M.hydros.forEach(function (h) { if (Math.hypot(P.x - h.x, P.y - h.y) < 240) heard = true; });
    M.heard = heard; if (heard) { m10Seen(P.x, P.y, .006 * dt, 'man'); if (!M.hydroHint || now - M.hydroHint > 6000) { M.hydroHint = now; m10Say('HYDROPHONE BUOY — THEY CAN HEAR YOU KICKING. HOLD SHIFT TO SWIM SLOW.', 2600); } }
    // precautionary depth charges along the patrol routes
    if (now > M.precAt && !M.won) { M.precAt = now + 18000 + Math.random() * 10000; const L = M.launches[Math.floor(Math.random() * M.launches.length)]; for (let i = 0; i < 3; i++) M.charges.push({ x: L.x - Math.cos(L.ang) * (40 + i * 70), y: L.y - Math.sin(L.ang) * (40 + i * 70), t: now, at: now + 1700 + i * 400 }); try { playTone(200, 120, .1, .04, 'triangle'); } catch (e) {} if (Math.hypot(P.x - L.x, P.y - L.y) < 700) m10Say('A LAUNCH IS DROPPING PRECAUTIONARY CHARGES — GET CLEAR!', 2200); }
    // star shells when the alarm is up
    if (M.alarm && M.lastSeen && (!M.flareAt || now - M.flareAt > 9000)) { M.flareAt = now; M.flares.push({ x: M.lastSeen.x + (Math.random() - .5) * 200, y: M.lastSeen.y + (Math.random() - .5) * 200, t: now }); try { playTone(900, 300, .4, .03, 'triangle'); } catch (e) {} }
    M.flares = M.flares.filter(function (f) { return now - f.t < 9000; });
    M.flares.forEach(function (f) { if (!P.sub && Math.hypot(P.x - f.x, P.y - f.y) < 380) m10Seen(P.x, P.y, .08 * dt, 'light'); });
}
