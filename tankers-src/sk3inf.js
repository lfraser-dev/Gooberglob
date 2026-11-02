/* =====================================================
   3D SKIRMISH infantry: squads of riflemen on both sides (not online).
   - 3 squads of 5 per side start near their tanks, advance on the nearest enemy, take a knee and shoot.
   - Rifles kill infantry; against tanks they only spark off the armour.
   - Tanks kill infantry: running them over, shell blasts, artillery, and machine guns (AI tanks hose nearby
     infantry with their own MGs; you use Q).
   - A wiped-out squad is replaced after ~40 s. You get XP for infantry you kill.
   Drawn with instanced meshes (a handful of draw calls for everyone). Positions are 2D game px like the tanks.
===================================================== */
const SK3I = { men: [], squads: [], on: false, step: 0, sid: 0, stats: { shots: 0, kills: [0, 0], runover: 0 }, fx: [] };
const SK3I_FAC = { american: { uni: '#5a563a', pants: '#4d4a34', helm: '#454a30' }, german: { uni: '#4c534a', pants: '#42473f', helm: '#3f443d' } };
function sk3IOn() { return !!SK3W.on && !!SK3W.gen && !(typeof DUEL !== 'undefined' && DUEL.active); }
function sk3TT(t) { return t === player || (allies || []).indexOf(t) >= 0 ? 0 : 1; }
function sk3IFac(team) { const pf = (player && player.faction) || selectedFaction || 'american'; return team === 0 ? pf : (pf === 'german' ? 'american' : 'german'); }
function sk3IBlocked(x, y) { if (x < 20 || y < 20 || x > SKIRMISH_WORLD_WIDTH - 20 || y > SKIRMISH_WORLD_HEIGHT - 20) return true; return !!tankHitsObstacle({ x: x, y: y, size: 5, sk3inf: true }, x, y); }
function sk3ILos(x1, y1, x2, y2) { const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 22); for (let k = 1; k < n; k++) { const x = x1 + (x2 - x1) * k / n, y = y1 + (y2 - y1) * k / n; if (tankHitsObstacle({ x: x, y: y, size: 2, sk3inf: true }, x, y)) return false; } return true; }
function sk3ISquad(team, k) { const W = SKIRMISH_WORLD_WIDTH, H = SKIRMISH_WORLD_HEIGHT, bx = team === 0 ? 300 : W - 300, by = H * (k + 1) / 4, sq = { id: ++SK3I.sid, team: team, men: [], goal: { x: W / 2, y: by }, re: 0, wipedAt: 0, k: k };
    for (let i = 0; i < 5; i++) { let x = bx, y = by; for (let t = 0; t < 60; t++) { x = bx + (Math.random() - .5) * 160; y = by + (i - 2) * 34 + (Math.random() - .5) * 40; if (!sk3IBlocked(x, y)) break; }
        const m = { x: x, y: y, team: team, hp: 2, ang: team === 0 ? 0 : Math.PI, sq: sq, i: i, crouch: 0, cd: 40 + Math.random() * 120, tgt: null, look: (Math.random() * 30) | 0, dead: false, deadAt: 0, fall: 0, ph: Math.random() * 6, moved: 0, avoid: 0, avoidA: 0, stuck: 0, flash: 0 };
        sq.men.push(m); SK3I.men.push(m); }
    SK3I.squads.push(sq); return sq; }
function sk3ISpawnAll() { SK3I.men = []; SK3I.squads = []; SK3I.fx = []; for (let k = 0; k < 3; k++) { sk3ISquad(0, k); sk3ISquad(1, k); } }
function sk3IKill(m, by, how) { if (m.dead) return; m.dead = true; m.deadAt = performance.now(); m.hp = 0; m.fallDir = Math.random() < .5 ? 1 : -1; m.how = how; SK3I.stats.kills[m.team]++;
    if (how === 'run') SK3I.stats.runover++;
    if (by === player && m.team === 1) { try { addXP(15, 'infantry'); } catch (e) {} if (typeof SK3F !== 'undefined' && SK3F.marks) try { SK3F.marks.push({ text: 'INFANTRY KILLED', col: '#ffd27a', at: performance.now() }); } catch (e) {} }
    const st = SK3D.st; if (st && SK3D.ready) { const x = sk3X(m.x), z = sk3Z(m.y), h = st.hgt ? st.hgt(x, z) : 0; for (let i = 0; i < 6; i++) st.dust.emit({ x: x, y: h + .5, z: z, vx: (Math.random() - .5) * 2, vy: Math.random() * 1.5, vz: (Math.random() - .5) * 2, life: .9, s0: .2, s1: .8, c0: [.45, .4, .34, .5], c1: [.45, .4, .34, 0] }); } }
// blasts, MG bullets and shells passing through
function sk3InfBlast(x, y, r) { if (!SK3I.on) return; SK3I.men.forEach(function (m) { if (m.dead) return; const d = Math.hypot(m.x - x, m.y - y); if (d < r) sk3IKill(m, null, 'blast'); else if (d < r * 1.6) { m.hp -= 1; m.crouch = 1; if (m.hp <= 0) sk3IKill(m, null, 'blast'); } }); }
function sk3InfBulletHit(b, x2, y2) { if (!SK3I.on || !b.o) return false; const team = sk3TT(b.o), x1 = x2 - b.vx, y1 = y2 - b.vy, L2 = b.vx * b.vx + b.vy * b.vy || 1;
    for (const m of SK3I.men) { if (m.dead || m.team === team) continue; const u = Math.max(0, Math.min(1, ((m.x - x1) * b.vx + (m.y - y1) * b.vy) / L2)), d = Math.hypot(x1 + b.vx * u - m.x, y1 + b.vy * u - m.y); if (d < (m.crouch > .5 ? 6 : 8)) { m.hp -= 1.5; if (m.hp <= 0) sk3IKill(m, b.o, 'mg'); return true; } } return false; }
function sk3IShells() { (shells || []).forEach(function (s) { if (s.oldX == null) return; const vx = s.x - s.oldX, vy = s.y - s.oldY, L2 = vx * vx + vy * vy || 1; SK3I.men.forEach(function (m) { if (m.dead) return; const u = Math.max(0, Math.min(1, ((m.x - s.oldX) * vx + (m.y - s.oldY) * vy) / L2)); if (Math.hypot(s.oldX + vx * u - m.x, s.oldY + vy * u - m.y) < 10) sk3IKill(m, !s.enemy && player && s.sourceName === player.name ? player : null, 'shell'); }); }); }
// rifle shot
function sk3IFire(m, t) { SK3I.stats.shots++; const isMan = t.team != null && t.hp != null, d = Math.hypot(t.x - m.x, t.y - m.y); m.cd = 95 + Math.random() * 80; m.flash = 4;
    let hit; if (isMan) { hit = Math.random() < .4 * Math.max(.15, 1 - d / 900) * (t.crouch > .5 ? .6 : 1); if (hit) { t.hp -= Math.random() < .2 ? 2 : 1; if (t.hp <= 0) sk3IKill(t, m, 'rifle'); } }
    else { hit = Math.random() < .75; if (hit) t.health = Math.min(t.health, Math.max(1, t.health - .12)); if (hit && t === player && Math.random() < .08) try { showRadioText('TAKING SMALL-ARMS FIRE', false); } catch (e) {} }
    const st = SK3D.st; if (!st || !SK3D.ready) return; const sx = sk3X(m.x) + Math.cos(m.ang) * .6, sz = sk3Z(m.y) + Math.sin(m.ang) * .6, sy = (st.hgt ? st.hgt(sk3X(m.x), sk3Z(m.y)) : 0) + 1.4 - m.crouch * .45;
    const tx = sk3X(t.x) + (hit ? 0 : (Math.random() - .5) * 4), tz = sk3Z(t.y) + (hit ? 0 : (Math.random() - .5) * 4), ty = (st.hgt ? st.hgt(tx, tz) : 0) + (isMan ? 1.1 : 1.6) + (hit ? 0 : (Math.random() - .3) * 1.5);
    st.fire.emit({ x: sx, y: sy, z: sz, life: .05, s0: .25, s1: .4, c0: [10, 7, 3, 1], c1: [4, 1.5, .3, 0], add: 1 }); SK3I.fx.push({ x: sx, y: sy, z: sz, tx: tx, ty: ty, tz: tz, k: 0, hit: hit && !isMan });
    const S = sk3SPlace(sx, sy, sz, { ref: 6, vol: .55 }); if (S) { sk3SNoise(S, .16, 3400, 600, 'bandpass', .8, .55, .001); sk3STone(S, .08, 240, 90, 'triangle', .18, .001); } }
function sk3IStep() { if (!SK3I.on || !gameRunning) return; SK3I.step++; const now = performance.now(), W = SKIRMISH_WORLD_WIDTH, tanks = [player].concat(allies || [], enemies || []).filter(function (t) { return t && !t.destroyed; });
    // squads: pick the nearest enemy to head for; replace wiped squads
    SK3I.squads.forEach(function (sq) { const alive = sq.men.filter(function (m) { return !m.dead; }); if (!alive.length) { if (!sq.wipedAt) sq.wipedAt = now; return; }
        if (SK3I.step >= sq.re) { sq.re = SK3I.step + 90; const cx = alive.reduce(function (a, m) { return a + m.x; }, 0) / alive.length, cy = alive.reduce(function (a, m) { return a + m.y; }, 0) / alive.length; let best = null, bd = 1e9;
            tanks.forEach(function (t) { if (sk3TT(t) === sq.team) return; const d = Math.hypot(t.x - cx, t.y - cy); if (d < bd) { bd = d; best = t; } }); SK3I.men.forEach(function (m) { if (m.dead || m.team === sq.team) return; const d = Math.hypot(m.x - cx, m.y - cy) * .8; if (d < bd) { bd = d; best = m; } });
            sq.goal = best ? { x: best.x, y: best.y } : { x: sq.team === 0 ? W - 300 : 300, y: cy }; sq.cx = cx; sq.cy = cy; } });
    for (let i = SK3I.squads.length - 1; i >= 0; i--) { const sq = SK3I.squads[i]; if (sq.wipedAt && now - sq.wipedAt > 40000) { SK3I.squads.splice(i, 1); sk3ISquad(sq.team, sq.k); } }
    SK3I.men = SK3I.men.filter(function (m) { return !m.dead || now - m.deadAt < 30000; });
    // each soldier
    SK3I.men.forEach(function (m, idx) { if (m.dead) { m.fall = Math.min(1, m.fall + .045); return; } if (m.flash > 0) m.flash--;
        // tanks: get out of the way, or get run over
        for (const t of tanks) { const d = Math.hypot(t.x - m.x, t.y - m.y), sz = (t.size || 26) * .8; if (d < sz) { sk3IKill(m, t, 'run'); return; } if (d < 90 && Math.abs(t.skV || t.speed || 1) > .05 && !m.avoid) { const a = Math.atan2(m.y - t.y, m.x - t.x); m.avoid = 40; m.avoidA = a + (Math.random() < .5 ? .6 : -.6); } }
        // look for something to shoot (staggered)
        if (++m.look >= 30) { m.look = 0; let best = null, bd = 650; SK3I.men.forEach(function (o) { if (o.dead || o.team === m.team) return; const d = Math.hypot(o.x - m.x, o.y - m.y); if (d < bd && sk3ILos(m.x, m.y, o.x, o.y)) { bd = d; best = o; } });
            if (!best) { bd = 650; tanks.forEach(function (t) { if (sk3TT(t) === m.team) return; const d = Math.hypot(t.x - m.x, t.y - m.y); if (d < bd && sk3ILos(m.x, m.y, t.x, t.y)) { bd = d; best = t; } }); } m.tgt = best; }
        if (m.tgt && (m.tgt.dead || m.tgt.destroyed)) m.tgt = null;
        let sp = 0, head = m.ang;
        if (m.avoid > 0) { m.avoid--; sp = .62; head = m.avoidA; }
        else if (m.tgt) { m.crouch = Math.min(1, m.crouch + .05); m.ang = Math.atan2(m.tgt.y - m.y, m.tgt.x - m.x); if (--m.cd <= 0) sk3IFire(m, m.tgt); }
        else { m.crouch = Math.max(0, m.crouch - .05); const g = m.sq.goal, dx = g.x - m.x, dy = g.y - m.y, d = Math.hypot(dx, dy) || 1, px = -dy / d, py = dx / d, off = (m.i - 2) * 32, ax = g.x - dx / d * 380 + px * off, ay = g.y - dy / d * 380 + py * off, dd = Math.hypot(ax - m.x, ay - m.y);
            if (dd > 20) { sp = dd > 600 ? .5 : .32; head = Math.atan2(ay - m.y, ax - m.x); } }
        if (sp > 0) { m.crouch = Math.max(0, m.crouch - .08); let moved = false; for (const o of [0, .5, -.5, 1, -1, 1.6, -1.6, 2.4, -2.4]) { const a = head + o + (m.stuck > 30 ? (Math.random() - .5) * 2 : 0), nx = m.x + Math.cos(a) * sp, ny = m.y + Math.sin(a) * sp; if (!sk3IBlocked(nx, ny)) { m.x = nx; m.y = ny; m.ang = m.ang + sk3Wrap(a - m.ang) * .15; moved = true; break; } }
            if (moved) { m.ph += sp * .55; m.stuck = Math.max(0, m.stuck - 1); } else m.stuck++; if (m.stuck > 90) m.stuck = 0; }
        // keep a little apart from squad mates
        m.sq.men.forEach(function (o) { if (o === m || o.dead) return; const dx = m.x - o.x, dy = m.y - o.y, d = Math.hypot(dx, dy); if (d > 0 && d < 16) { const nx = m.x + dx / d * .3, ny = m.y + dy / d * .3; if (!sk3IBlocked(nx, ny)) { m.x = nx; m.y = ny; } } }); });
    // AI tanks hose infantry with their machine guns
    tanks.forEach(function (t) { if (t === player || typeof sk3MgFireAt !== 'function') return; t.sk3ic = (t.sk3ic || 0) - 1; if (t.sk3burst > 0) { t.sk3burst--; if (t.sk3burst % 6 === 0 && t.sk3mt && !t.sk3mt.dead) sk3MgFireAt(t, Math.atan2(t.sk3mt.y - t.y, t.sk3mt.x - t.x)); return; }
        if (t.sk3ic > 0) return; t.sk3ic = 40 + (Math.random() * 30 | 0); const tm = sk3TT(t); let best = null, bd = 480; SK3I.men.forEach(function (m) { if (m.dead || m.team === tm) return; const d = Math.hypot(m.x - t.x, m.y - t.y); if (d < bd && sk3ILos(t.x, t.y, m.x, m.y)) { bd = d; best = m; } }); if (best) { t.sk3mt = best; t.sk3burst = 60 + (Math.random() * 40 | 0); } }); }
// ---------- drawing ----------
function sk3IBuild(st) { const mk = function (fac) { const F = SK3I_FAC[fac] || SK3I_FAC.american, N = 80, parts = {};
        const torso = tk3Box(.26, .58, .4); tk3Xf(torso, 0, 1.24, 0); const arm1 = tk3Box(.5, .1, .1); tk3Xf(arm1, .22, 1.36, .16); const arm2 = tk3Box(.36, .1, .1); tk3Xf(arm2, .2, 1.3, -.17); const pack = tk3Box(.12, .3, .28); tk3Xf(pack, -.18, 1.3, 0); const belt = tk3Box(.29, .07, .43); tk3Xf(belt, 0, 1.0, 0);
        parts.body = new THREE.InstancedMesh(tk3Merge([torso, arm1, arm2, pack, tk3Tint ? belt : belt]), tk3Std(F.uni, .9, 0), N);
        const head = new THREE.SphereGeometry(.11, 8, 6); tk3Xf(head, .02, 1.66, 0); parts.head = new THREE.InstancedMesh(head, tk3Std('#c49a7c', .8, 0), N);
        const hel = fac === 'german' ? tk3Merge([(function () { const g = new THREE.SphereGeometry(.15, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2); tk3Xf(g, .01, 1.7, 0, 0, 0, 0, 1, 1.05, 1); return g; })(), (function () { const g = tk3Cyl(.16, .18, .08, 10); tk3Xf(g, -.01, 1.66, 0); return g; })()]) : (function () { const g = new THREE.SphereGeometry(.16, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2); tk3Xf(g, .02, 1.69, 0, 0, 0, 0, 1, .9, 1); return g; })();
        parts.helm = new THREE.InstancedMesh(hel, tk3Std(F.helm, .7, .2), N);
        const rifle = tk3Box(1.05, .05, .05); tk3Xf(rifle, .45, 1.38, .12); const stock = tk3Box(.25, .1, .06); tk3Xf(stock, -.02, 1.34, .12); parts.rifle = new THREE.InstancedMesh(tk3Merge([rifle, stock]), tk3Std('#3a2c1e', .6, .3), N);
        const leg = tk3Box(.15, .88, .16); tk3Xf(leg, 0, -.44, 0); parts.leg = new THREE.InstancedMesh(leg, tk3Std(F.pants, .9, 0), N * 2);
        Object.keys(parts).forEach(function (k) { const im = parts[k]; im.count = 0; im.castShadow = k !== 'rifle'; im.receiveShadow = true; im.frustumCulled = false; TK3.scene.add(im); }); return parts; };
    st.inf = { american: mk('american'), german: mk('german') }; }
function sk3IDraw(st, dt) { if (!st.inf) return; const M = new THREE.Matrix4(), R = new THREE.Matrix4(), L = new THREE.Matrix4(), T = new THREE.Matrix4(), cnt = {}, cam = TK3.cam ? TK3.cam.position : null;
    Object.keys(st.inf).forEach(function (f) { cnt[f] = 0; });
    SK3I.men.forEach(function (m) { const fac = sk3IFac(m.team), P = st.inf[fac]; if (!P) return; const x = sk3X(m.x), z = sk3Z(m.y), h = st.hgt ? st.hgt(x, z) : 0; if (cam && Math.hypot(cam.x - x, cam.z - z) > 420) return; const n = cnt[fac]++; if (n >= 80) return;
        M.makeTranslation(x, h, z); R.makeRotationY(-m.ang); M.multiply(R);
        if (m.dead) { const f = Math.min(1, m.fall); R.makeRotationZ(-f * 1.5 * (m.fallDir || 1)); T.makeTranslation(0, .1 * f, 0); M.multiply(T).multiply(R); if (sk3INow() - m.deadAt > 25000) { T.makeTranslation(0, -(sk3INow() - m.deadAt - 25000) / 2500, 0); M.premultiply(T); } }
        else if (m.crouch > 0) { T.makeTranslation(0, -.5 * m.crouch, 0); M.multiply(T); }
        T.makeScale(1.08, 1.08, 1.08); M.multiply(T);
        P.body.setMatrixAt(n, M); P.head.setMatrixAt(n, M); P.helm.setMatrixAt(n, M); P.rifle.setMatrixAt(n, M);
        const sw = m.dead ? 0 : Math.sin(m.ph) * .55 * (1 - m.crouch);
        [-1, 1].forEach(function (s, j) { L.copy(M); T.makeTranslation(0, .95, s * .1); L.multiply(T); R.makeRotationZ(sw * s + (m.crouch > 0 && !m.dead ? (j ? -1.15 : .12) * m.crouch : 0)); L.multiply(R); if (!m.dead && m.crouch > 0 && !j) { T.makeScale(1, 1 - .5 * m.crouch, 1); L.multiply(T); } P.leg.setMatrixAt(n * 2 + j, L); }); });
    Object.keys(st.inf).forEach(function (f) { const P = st.inf[f], n = Math.min(80, cnt[f]); ['body', 'head', 'helm', 'rifle'].forEach(function (k) { P[k].count = n; P[k].instanceMatrix.needsUpdate = true; }); P.leg.count = n * 2; P.leg.instanceMatrix.needsUpdate = true; });
    // rifle tracers (fast, faint)
    const life = dt + .004; SK3I.fx = SK3I.fx.filter(function (b) { b.k += dt * 6; if (b.k >= 1) { if (b.hit) st.spark.emit({ x: b.tx, y: b.ty, z: b.tz, vx: (Math.random() - .5) * 5, vy: Math.random() * 3, vz: (Math.random() - .5) * 5, life: .15, len: .15, w: .02, c: [12, 8, 4, 1], g: 8, fade: 1 }); return false; }
        const x = b.x + (b.tx - b.x) * b.k, y = b.y + (b.ty - b.y) * b.k, z = b.z + (b.tz - b.z) * b.k, d = Math.hypot(b.tx - b.x, b.ty - b.y, b.tz - b.z) || 1; st.trac.emit({ x: x, y: y, z: z, vx: (b.tx - b.x) / d * .001, vy: (b.ty - b.y) / d * .001, vz: (b.tz - b.z) / d * .001, life: life, len: 1.4, w: .015, c: [5, 4.2, 3, .35], fade: 0 }); return true; }); }
function sk3INow() { return performance.now(); }
// MG fire at a chosen angle (AI tanks shooting at infantry)
function sk3MgFireAt(t, a) { const off = (t.size || 26) * 1.1; a += (Math.random() - .5) * .06; SK3X.bullets.push({ x: t.x + Math.cos(a) * off, y: t.y + Math.sin(a) * off, vx: Math.cos(a) * 26, vy: Math.sin(a) * 26, life: 22, o: t, n: SK3X.n++, own: false });
    const st = SK3D.st; if (st && SK3D.ready) { const x = sk3X(t.x + Math.cos(a) * off), z = sk3Z(t.y + Math.sin(a) * off), y = (st.hgt ? st.hgt(x, z) : 0) + 1.7; st.fire.emit({ x: x, y: y, z: z, life: .05, s0: .4, s1: .6, c0: [10, 7, 3, 1], c1: [4, 1.5, .3, 0], add: 1 }); if (Math.random() < .5) sk3SndMG(x, y, z, false); } }
function sk3IHud() { if (!SK3I.on || !SK3D.hud || SK3D.map) return; const g = SK3D.hud.getContext('2d'), a = SK3I.men.filter(function (m) { return !m.dead && m.team === 0; }).length, b = SK3I.men.filter(function (m) { return !m.dead && m.team === 1; }).length;
    g.font = 'bold 11px "Special Elite", monospace'; g.textAlign = 'left'; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(12, 624, 170, 20); g.fillStyle = '#8fc8ff'; g.fillText('INFANTRY ' + a, 18, 638); g.fillStyle = '#ff9a80'; g.fillText('v ' + b, 104, 638); }
(function () {
    const _pop = sk3Populate; sk3Populate = function () { const r = _pop.apply(this, arguments); try { SK3I.on = sk3IOn(); if (SK3I.on) sk3ISpawnAll(); } catch (e) { SK3I.err = e; } return r; };
    const _us = updateShells; updateShells = function () { const r = _us.apply(this, arguments); if (SK3I.on && SK3D.on) try { sk3IShells(); sk3IStep(); } catch (e) { SK3I.err = e; } return r; };
    const _bw = sk3BuildWorld; sk3BuildWorld = function (st) { const r = _bw.apply(this, arguments); try { sk3IBuild(st); } catch (e) { SK3I.err = e; } return r; };
    const sc = TK3.list[SK3D.idx], _up = sc.update; sc.update = function (st, t, dt) { const r = _up.apply(this, arguments); try { if (SK3I.on) sk3IDraw(st, dt); } catch (e) { SK3I.err = e; } return r; };
    const _ce = createExplosion; createExplosion = function (x, y, s) { const r = _ce.apply(this, arguments); try { if (SK3I.on && SK3D.on) sk3InfBlast(x, y, 50 * (s || 1)); } catch (e) {} return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { sk3IHud(); } catch (e) {} return r; };
    const _stop = sk3Stop; sk3Stop = function () { SK3I.on = false; SK3I.men = []; SK3I.squads = []; return _stop.apply(this, arguments); };
})();
