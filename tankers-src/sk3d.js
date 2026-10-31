/* =====================================================
   3D SKIRMISH (TEST) — the normal Skirmish battle drawn in 3D with a third-person camera.
   The 2D game still runs the whole battle (AI, physics, shells, damage, rules). This file only
   draws it in 3D and swaps the controls for tank driving:
     W / S  drive forward / back      A / D  turn the hull
     MOUSE  swing the camera — the turret follows it     CLICK / SPACE  fire
     RIGHT MOUSE or SHIFT  gunner's sight      WHEEL  camera distance
   Scale: 1 game pixel = 0.1 m, so the 2400 x 1500 battlefield is 240 x 150 m.
   It shares the 3D engine (tk3core) with the menu, loading screens and executions; an execution
   borrows the renderer and the battlefield is rebuilt when it hands it back.
===================================================== */
const SK3D = { want: false, on: false, ready: false, loading: false, S: .1, idx: -1, yaw: 0, pitch: .3, dist: 12.5, scope: false, rmb: false, locked: false,
    models: new Map(), wrecks: [], st: null, t0: 0, prev: 0, hint: 0, aimD: 60, camP: null, tall: [] };
function sk3X(x) { return (x - SKIRMISH_WORLD_WIDTH / 2) * SK3D.S; }
function sk3Z(y) { return (y - SKIRMISH_WORLD_HEIGHT / 2) * SK3D.S; }
function sk3Map() { return { town: 'town', snow: 'snow', bocage: 'bocage', trenches: 'trenches' }[selectedMap] || 'town'; }
function sk3EnemyFaction() { return { british: 'german', german: 'soviet', soviet: 'american' }[selectedFaction] || 'british'; }
function sk3ModelName(t) { if (TK3_TSPEC[t.model]) return t.model; const c = String(t.className || '').toUpperCase(); return c === 'LIGHT' ? 'm3stuart' : c === 'HEAVY' ? 'tiger' : 'sherman'; }

/* ---------- the battlefield ---------- */
function sk3Prism(w, h, len) { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0); const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false }); g.translate(0, 0, -len / 2); return g.index ? g.toNonIndexed() : g; }
function sk3Add(list, g, col, x, y, z, ry) { tk3Xf(g, x, y, z, 0, ry || 0, 0); tk3Tint(g, tk3C(col)); if (g.index) g = g.toNonIndexed(); list.push(g); return g; }
function sk3Mesh(list, mat, uv) { if (!list.length) return null; let g = tk3Merge(list); if (uv) tk3BoxUV(g, uv); const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; TK3.scene.add(m); return m; }
/* ---------- tanks ---------- */
function sk3Model(t) { let m = SK3D.models.get(t); if (m) return m; const mn = sk3ModelName(t), fac = t.faction || (t.team === 'enemy' || enemies.indexOf(t) >= 0 ? sk3EnemyFaction() : selectedFaction);
    m = tk3TankModel(mn, fac); const k = Math.max(.85, Math.min(1.35, (t.size || 26) * 2 * SK3D.S * 1.12 / m.spec.len)); m.g.scale.setScalar(k); m.k = k; m.g.rotation.order = 'YXZ';
    const blob = new THREE.Mesh(new THREE.CircleGeometry(1, 28).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 })); blob.scale.set(m.spec.len * .62, 1, m.spec.wid * .68); blob.position.y = .05; blob.renderOrder = 1; m.g.add(blob);
    m.tp = 0; m.tr = 0; TK3.scene.add(m.g); SK3D.models.set(t, m); return m; }
function sk3SyncTank(st, t, dt) { const m = sk3Model(t); m.seen = true; const g = m.g, x = sk3X(t.x), z = sk3Z(t.y), a = t.angle || 0, ca = Math.cos(a), sa = Math.sin(a), hl = m.spec.len * m.k * .42, hw2 = m.spec.wid * m.k * .4;
    // sit on the ground and tilt with it (sampled under the front, back and both tracks)
    const hF = st.hgt(x + ca * hl, z + sa * hl), hB = st.hgt(x - ca * hl, z - sa * hl), hP = st.hgt(x - sa * hw2, z + ca * hw2), hN = st.hgt(x + sa * hw2, z - ca * hw2), y = Math.max(-1.2, Math.max((hF + hB) / 2, (hP + hN) / 2, st.hgt(x, z)));
    const k8 = Math.min(1, dt * 7); m.tp += (Math.atan2(hF - hB, hl * 2) - m.tp) * k8; m.tr += (-Math.atan2(hP - hN, hw2 * 2) - m.tr) * k8; g.position.set(x, y, z); g.rotation.set(m.dead ? g.rotation.x : m.tr, -a, m.dead ? g.rotation.z : m.tp);
    if (m.turret && !m.dead) m.turret.rotation.y = -((t.turretAngle || 0) - (t.angle || 0));
    if (t.destroyed && !m.dead) sk3KillModel(st, m, t); if (!t.destroyed && m.dead) { TK3.scene.remove(m.g); SK3D.models.delete(t); return sk3SyncTank(st, t, dt); }
    const far = SK3D.camP ? SK3D.camP.distanceTo(g.position) > 55 : false; if (far !== m.far) { m.far = far; (m.wheels || []).forEach(function (w) { w.visible = !far; }); }
    if (!m.dead) { try { exDyn(st, m, dt); } catch (e) {} } return m; }
function sk3KillModel(st, m, t) { m.dead = true; m.deadAt = SK3D.now; try { exBurn(m.g); EX_BURN.heat.value = .7; } catch (e) {} const p = m.g.position; tk3Boom(st.fire, st.smoke, p.x, 1.5, p.z, .9 * m.k, {}); st.boomL.position.set(p.x, 3, p.z); st.boomL.intensity = 70; sk3Debris(st, p.x, 1.6, p.z, 1.3);
    if (m.turret && Math.random() < .45) { const T = m.turret, wp = new THREE.Vector3(); const wq = new THREE.Quaternion(); T.getWorldPosition(wp); T.getWorldQuaternion(wq); if (T.parent) T.parent.remove(T); TK3.scene.add(T); T.position.copy(wp); T.quaternion.copy(wq); T.scale.setScalar(m.k); st.fly.push({ o: T, v: new THREE.Vector3((Math.random() - .5) * 5, 11 + Math.random() * 5, (Math.random() - .5) * 5), r: new THREE.Vector3((Math.random() - .5) * 4, (Math.random() - .5) * 3, (Math.random() - .5) * 4), y0: 0 }); }
    SK3D.wrecks.push(m); while (SK3D.wrecks.length > 18) { const o = SK3D.wrecks.shift(); TK3.scene.remove(o.g); SK3D.models.forEach(function (v, k) { if (v === o) SK3D.models.delete(k); }); } }

/* ---------- effects, fed by the 2D game's own effect calls ---------- */
function sk3Debris(st, x, y, z, s) { for (let i = 0; i < 24 * s; i++) { const a = Math.random() * 6.28, v = 4 + Math.random() * 10; st.spark.emit({ x: x, y: y, z: z, vx: Math.cos(a) * v, vy: 3 + Math.random() * 9, vz: Math.sin(a) * v, life: .5 + Math.random() * .6, len: .5, w: .05, c: [9, 4, 1.2, 1], g: 14, fade: 1 }); } }
function sk3Boom(x2, y2, sc) { const st = SK3D.st; if (!st) return; const x = sk3X(x2), z = sk3Z(y2), h0 = st.hgt ? st.hgt(x, z) : 0; let y = h0 + .4; enemies.concat(allies, [player]).forEach(function (t) { if (t && Math.hypot(t.x - x2, t.y - y2) < (t.size || 20) * 1.3) y = h0 + 1.3; });
    const s = Math.max(.4, Math.min(2.4, sc || 1)); tk3Boom(st.fire, st.smoke, x, y, z, .55 * s, {}); st.boomL.position.set(x, y + 2, z); st.boomL.intensity = Math.max(st.boomL.intensity, 26 * s); sk3Debris(st, x, y, z, .5 * s);
    const dc = exDust(st); for (let i = 0; i < 16 * s; i++) { const a = Math.random() * 6.28, sp = 3 + Math.random() * 6; st.dust.emit({ x: x, y: h0 + .3, z: z, vx: Math.cos(a) * sp, vy: .6 + Math.random() * 2, vz: Math.sin(a) * sp, life: 1.6 + Math.random(), s0: .8 * s, s1: 3.2 * s, c0: [dc[0], dc[1], dc[2], .5], c1: [dc[0], dc[1], dc[2], 0], drag: 2.4 }); }
    if (player) { const d = Math.hypot(player.x - x2, player.y - y2) * SK3D.S; if (d < 30) TK3.shake = Math.max(TK3.shake, .5 * s * (1 - d / 30)); } }
function sk3Muzzle(t) { const st = SK3D.st, m = st && SK3D.models.get(t); if (!m || m.dead) return; let p, d; try { const md = exMuzzle(m); p = md[0]; d = md[1]; } catch (e) { return; } const b = t.className === 'HEAVY' ? 1.3 : t.className === 'LIGHT' ? .75 : 1, r = Math.random;
    m.kick = (m.kick || 0) + .45 * b; m.recoil = 1; st.flashL.position.copy(p).addScaledVector(d, 1.2); st.flashL.intensity = 30 * b;
    st.fire.emit({ x: p.x + d.x * .4, y: p.y + d.y * .4, z: p.z + d.z * .4, life: .06, s0: 1.3 * b, s1: 2.2 * b, c0: [9, 6.5, 3.5, 1], c1: [5, 2, .5, 0], add: 1 });
    for (let i = 0; i < 16 * b; i++) { const sp = 5 + r() * 22; st.fire.emit({ x: p.x, y: p.y, z: p.z, vx: d.x * sp + (r() - .5) * 3, vy: d.y * sp + (r() - .5) * 3, vz: d.z * sp + (r() - .5) * 3, life: .08 + r() * .12, s0: .3 * b, s1: (1.1 + r()) * b, c0: [11, 6, 2, 1], c1: [2, .5, .1, 0], add: 1, drag: 9 }); }
    for (let i = 0; i < 10 * b; i++) st.smoke.emit({ x: p.x, y: p.y, z: p.z, vx: d.x * (2 + r() * 9) + (r() - .5) * 2, vy: (r() - .2) * 1.4, vz: d.z * (2 + r() * 9) + (r() - .5) * 2, life: 2 + r() * 2, s0: .5 * b, s1: (2.4 + r() * 2) * b, c0: [.6, .57, .53, .4], c1: [.62, .6, .57, 0], drag: 2.4, rv: (r() - .5) * .6, ease: 2 });
    if (t === player) TK3.shake = Math.max(TK3.shake, .12 * b); }
function sk3Sparks(x2, y2) { const st = SK3D.st; if (!st) return; const x = sk3X(x2), z = sk3Z(y2), h0 = st.hgt ? st.hgt(x, z) : 0; for (let i = 0; i < 14; i++) { const a = Math.random() * 6.28, v = 3 + Math.random() * 9; st.spark.emit({ x: x, y: h0 + 1.3, z: z, vx: Math.cos(a) * v, vy: 1 + Math.random() * 6, vz: Math.sin(a) * v, life: .25 + Math.random() * .3, len: .4, w: .04, c: [12, 8, 4, 1], g: 10, fade: 1 }); } st.fire.emit({ x: x, y: h0 + 1.3, z: z, life: .08, s0: 1.2, s1: 1.8, c0: [10, 7, 3, 1], c1: [3, 1, .2, 0], add: 1 }); }


/* ---------- shells: hot tracer + glow + faint smoke trail, drawn exactly where the 2D game has them ---------- */
// particles must outlive one frame (dt) or they're culled before they're ever drawn
function sk3Shells(st, dt) { const L = dt + .004, seen = st.shSeen || (st.shSeen = new Map()), live = new Set();
    (shells || []).forEach(function (s) { live.add(s); const x = sk3X(s.x), z = sk3Z(s.y), sp = Math.hypot(s.vx || 0, s.vy || 0) || 1, ux = (s.vx || 0) / sp, uz = (s.vy || 0) / sp;
        const prev = seen.get(s), moved = prev ? Math.hypot(x - prev[0], z - prev[1]) : sp * SK3D.S, len = Math.max(2.4, Math.min(10, moved * 1.15 + 1.4));
        const y = st.hgt(x, z) + 1.65, big = !!s.specialExplosion, flak = s.kind === 'flak', hot = s.enemy ? [16, 6, 2.4, 1] : [16, 11, 5, 1], glow = s.enemy ? [2.6, .6, .2, .55] : [2.6, 1.8, .6, .55];
        st.trac.emit({ x: x, y: y, z: z, vx: ux * .001, vy: 0, vz: uz * .001, life: L, len: len, w: big ? .17 : flak ? .06 : .1, c: hot, fade: 0 });
        st.trac.emit({ x: x, y: y, z: z, vx: ux * .001, vy: 0, vz: uz * .001, life: L, len: len * 1.7, w: big ? .55 : .32, c: glow, fade: 0 });
        st.fire.emit({ x: x + ux * .15, y: y, z: z + uz * .15, life: L, s0: big ? 1.2 : .75, c0: hot, c1: hot, add: 1 });
        if (Math.random() < .8) st.smoke.emit({ x: x - ux * len * .6, y: y, z: z - uz * len * .6, vx: (Math.random() - .5) * .3, vy: .2, vz: (Math.random() - .5) * .3, life: 1 + Math.random() * .7, s0: .16, s1: .9, c0: [.78, .76, .72, .15], c1: [.78, .76, .72, 0], drag: 2 });
        seen.set(s, [x, z, s.life == null ? 99 : s.life]); });
    // a shell that vanished before running out of range hit something: kick up dirt where it stopped
    seen.forEach(function (v, s) { if (live.has(s)) return; seen.delete(s); if (v[2] > 3) sk3Impact(st, v[0], v[1]); }); }
function sk3Impact(st, x, z) { const dc = exDust(st), r = Math.random, h0 = st.hgt ? st.hgt(x, z) : 0;
    for (let i = 0; i < 12; i++) { const a = r() * 6.28, sp = 1.5 + r() * 4.5; st.dust.emit({ x: x, y: h0 + .5, z: z, vx: Math.cos(a) * sp, vy: 1 + r() * 3.5, vz: Math.sin(a) * sp, life: 1.3 + r(), s0: .5, s1: 2.4, c0: [dc[0], dc[1], dc[2], .55], c1: [dc[0], dc[1], dc[2], 0], drag: 2.5 }); }
    for (let i = 0; i < 9; i++) { const a = r() * 6.28, v = 3 + r() * 8; st.spark.emit({ x: x, y: h0 + 1.4, z: z, vx: Math.cos(a) * v, vy: 1 + r() * 5, vz: Math.sin(a) * v, life: .25 + r() * .3, len: .35, w: .035, c: [12, 7, 3, 1], g: 10, fade: 1 }); }
    for (let i = 0; i < 5; i++) st.dust.emit({ x: x, y: h0 + .3, z: z, vx: (r() - .5) * 3, vy: 3 + r() * 5, vz: (r() - .5) * 3, life: .9, s0: .1, s1: .08, c0: [dc[0] * .5, dc[1] * .45, dc[2] * .4, 1], c1: [dc[0] * .5, dc[1] * .45, dc[2] * .4, 0], g: 12 });
    st.fire.emit({ x: x, y: h0 + 1.3, z: z, life: .1, s0: 1.5, s1: 2.6, c0: [9, 5, 2, 1], c1: [2, .6, .1, 0], add: 1 }); }

/* ---------- battlefield events: artillery / MG barrage warnings, supply drops ---------- */
function sk3Events(st, t, dt) { const ev = typeof battlefieldEvents !== 'undefined' ? battlefieldEvents : [], M = st.evm || (st.evm = new Map()), keep = new Set(), r = Math.random;
    ev.forEach(function (e) { keep.add(e); let o = M.get(e); const x = sk3X(e.x), z = sk3Z(e.y), p = 1 - e.life / (e.maxLife || 1);
        if (!o) { o = new THREE.Group(); if (e.type === 'supply') { const c = new THREE.Group(); tk3Mesh(tk3Box(1.6, 1.1, 1.1), tk3Std('#5b4328', .8), 0, .55, 0, c, true); tk3Mesh(tk3Box(1.64, .14, 1.14), tk3Std('#b38d52', .7), 0, .7, 0, c); tk3Mesh(tk3Box(.14, 1.14, 1.14), tk3Std('#b38d52', .7), -.3, .55, 0, c); o.add(c); o.userData.crate = c; }
                else { const R = (e.type === 'artillery' ? 92 : 115) * SK3D.S, mat = new THREE.MeshBasicMaterial({ color: 0xff3020, transparent: true, opacity: .55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }); const ring = new THREE.Mesh(new THREE.RingGeometry(R * .93, R, 64).rotateX(-Math.PI / 2), mat); ring.position.y = .12; o.add(ring); const disc = new THREE.Mesh(new THREE.CircleGeometry(R * .93, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xd52f25, transparent: true, opacity: .14, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); disc.position.y = .1; o.add(disc); o.userData.ring = ring; o.userData.disc = disc; }
            TK3.scene.add(o); M.set(e, o); }
        o.position.set(x, st.hgt ? st.hgt(x, z) : 0, z);
        if (e.type === 'supply') { if (r() < dt * 7) st.smoke.emit({ x: x + .9, y: .3, z: z, vx: .5 + r() * .4, vy: 1.8 + r(), vz: (r() - .5) * .4, life: 5, s0: .5, s1: 3.2, c0: [.25, .8, .3, .55], c1: [.4, .75, .45, 0], drag: .5 }); o.userData.crate.rotation.y = t * .3; return; }
        const pulse = 1 + Math.sin(p * Math.PI * 14) * .06; o.visible = !e.impacted; o.userData.ring.scale.setScalar(pulse); o.userData.ring.material.opacity = .45 + Math.sin(p * Math.PI * 10) * .2; o.userData.disc.material.opacity = .1 + Math.sin(p * Math.PI * 10) * .05;
        if (!e.impacted && r() < dt * 5) st.smoke.emit({ x: x, y: .3, z: z, vx: (r() - .5) * .5, vy: 1.5 + r(), vz: (r() - .5) * .5, life: 4, s0: .4, s1: 2.6, c0: [.85, .2, .12, .5], c1: [.6, .25, .2, 0], drag: .6 });
        if (e.type === 'artillery' && !e.impacted && p > .72 && r() < dt * 10) { const ox = x + (r() - .5) * 10, oz = z + (r() - .5) * 10; st.trac.emit({ x: ox, y: 70, z: oz, vx: 0, vy: -140, vz: 0, life: .45, len: 7, w: .12, c: [14, 8, 3, 1], fade: 0 }); }
        if (e.type === 'mg') { const len = Math.max(SKIRMISH_WORLD_WIDTH * .45, 420) * SK3D.S, ca = Math.cos(e.angle || 0), sa = Math.sin(e.angle || 0); for (let k = 0; k < 2; k++) if (r() < dt * 30) { const u = (r() - .5) * len, ox = x + ca * u - sa * (r() - .5) * 3, oz = z + sa * u + ca * (r() - .5) * 3; st.trac.emit({ x: ox, y: 1 + r() * .6, z: oz, vx: ca * 140, vy: 0, vz: sa * 140, life: .22, len: 2.2, w: .045, c: [14, 11, 5, 1], fade: 0 }); } } });
    M.forEach(function (o, e) { if (!keep.has(e)) { TK3.scene.remove(o); M.delete(e); } }); }

/* ---------- weather + distant battle ---------- */
function sk3Ambient(st, t, dt) { const r = Math.random, c = SK3D.camP; if (!c) return;
    if (st.flakes) { const n = dt * 420; for (let i = 0; i < n; i++) st.flakes.emit({ x: c.x + (r() - .5) * 60, y: c.y + 4 + r() * 22, z: c.z + (r() - .5) * 60, vx: 1.1, vy: -2.4 - r(), vz: .4, life: 7, len: .2, w: .06, c: [1, 1, 1, .9], fade: 1 }); }
    (st.cols || []).forEach(function (q) { if (r() < dt * q[3]) st.smoke.emit({ x: q[0] + (r() - .5) * 4, y: q[1], z: q[2] + (r() - .5) * 4, vx: 1.6 + r(), vy: 3.5 + r() * 2, vz: -.4, life: 16 + r() * 8, s0: 4, s1: 22, c0: [.05, .045, .04, .65], c1: [.3, .28, .26, 0], drag: .12, rv: .1, fadeIn: .08 }); if (q[4] && r() < dt * 12) st.fire.emit({ x: q[0] + (r() - .5) * 5, y: q[1] + r() * 2, z: q[2] + (r() - .5) * 5, vy: 2, life: .7, s0: 3, s1: 1, c0: [5, 2, .5, .9], c1: [1.5, .3, .05, 0], add: .9 }); }); }

/* ---------- the scene ---------- */
TK3.list.push({ name: 'SKIRMISH 3D', place: '', kind: '', hfov: 72, shift: [0, 0], grade: {},
    build: function (st) { SK3D.st = st; st.fires = []; st.fly = []; SK3D.models = new Map(); SK3D.wrecks = []; SK3D.camP = null;
        st.fire = tk3Parts(2400, { tex: tk3SoftTex() }); st.smoke = tk3Parts(2600, { lightCol: '#c8c0b8' }); st.dust = tk3Parts(2200, { lightCol: '#fff0e0' }); st.ember = tk3Parts(600, { tex: tk3SoftTex() }); st.spark = tk3Streaks(900); st.trac = tk3Streaks(900); st.flakes = sk3Map() === 'snow' ? tk3Streaks(3200, { normal: true }) : null;
        sk3BuildWorld(st);
        const mk = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .3, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), 2400); mk.count = 0; mk.frustumCulled = false; TK3.scene.add(mk); st.marks = { im: mk, n: 0, max: 2400, m: new THREE.Matrix4() };
        st.flashL = tk3PL('#ffb060', 0, 40, 0, 0, 0); st.boomL = tk3PL('#ff9040', 0, 70, 0, 0, 0); st.fireL = tk3PL('#ff8030', 0, 28, 0, 0, 0);
        TK3.cam.near = .2; TK3.cam.far = 1500; TK3.cam.updateProjectionMatrix(); },
    update: function (st, t, dt) { SK3D.now = t; const now = Date.now();
        // tanks
        const live = [player].concat(allies || [], enemies || []).filter(Boolean); SK3D.models.forEach(function (m) { m.seen = false; });
        live.forEach(function (tk) { sk3SyncTank(st, tk, dt); });
        SK3D.models.forEach(function (m, tk) { if (m.seen) return; if (m.dead) return; if (tk.destroyed) { sk3SyncTank(st, tk, dt); return; } TK3.scene.remove(m.g); SK3D.models.delete(tk); });
        // wrecks keep burning, then smoulder
        let near = null, nd = 1e9; SK3D.wrecks.forEach(function (m) { const age = t - m.deadAt, h = Math.max(.15, 1.6 - age * .06), p = m.g.position; m.g.updateMatrixWorld(true); const w = m.body.localToWorld(new THREE.Vector3(0, m.spec.tt + .6, 0)); tk3Fire(st.fire, w.x, w.y, w.z, .9 * m.k, dt, 18 * h); if (Math.random() < dt * 4) st.smoke.emit({ x: w.x, y: w.y + 1, z: w.z, vx: 1 + Math.random(), vy: 2.4 + Math.random() * 2, vz: -.4, life: 8 + Math.random() * 4, s0: 1.2, s1: 7 + Math.random() * 4, c0: [.05, .045, .04, .75 * Math.min(1, h)], c1: [.2, .19, .18, 0], drag: .35, rv: .2, fadeIn: .05 }); if (Math.random() < dt * 4 * h) st.ember.emit({ x: w.x, y: w.y + .4, z: w.z, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, vz: (Math.random() - .5) * 2, life: 2 + Math.random() * 2, s0: .1, s1: .03, c0: [7, 2.4, .4, 1], c1: [2, .4, .05, 0], add: 1, drag: .6, g: -.5 }); const dd = SK3D.camP ? SK3D.camP.distanceTo(p) : 0; if (dd < nd) { nd = dd; near = w; } });
        if (near) { st.fireL.position.set(near.x, near.y + 1, near.z); st.fireL.intensity = 26 + Math.sin(t * 23) * 6; } else st.fireL.intensity = 0;
        st.fires.forEach(function (f) { if (f[5]) { tk3Fire(st.fire, f[0], f[1], f[2], f[3], dt, 16); if (Math.random() < dt * 2.5) st.smoke.emit({ x: f[0], y: f[1] + 1, z: f[2], vx: .9, vy: 2.2, vz: -.3, life: 9, s0: 1, s1: 6, c0: [.06, .055, .05, .55], c1: [.22, .21, .2, 0], drag: .35, rv: .2, fadeIn: .05 }); } else if (f[4] && Math.random() < dt * 1.5) st.smoke.emit({ x: f[0], y: f[1] + .5, z: f[2], vx: .8, vy: 1.6, vz: -.3, life: 6, s0: .8, s1: 4.5, c0: [.12, .11, .1, .4], c1: [.25, .24, .23, 0], drag: .4 }); });
        // flying turrets
        for (let i = st.fly.length - 1; i >= 0; i--) { const q = st.fly[i]; q.v.y -= 22 * dt; q.o.position.addScaledVector(q.v, dt); q.o.rotation.x += q.r.x * dt; q.o.rotation.z += q.r.z * dt; if (Math.random() < .6) st.smoke.emit({ x: q.o.position.x, y: q.o.position.y, z: q.o.position.z, life: 2, s0: .5, s1: 2, c0: [.08, .07, .06, .6], c1: [.2, .2, .2, 0] }); if (q.o.position.y < .5 && q.v.y < 0) { q.o.position.y = .5; q.v.set(0, 0, 0); q.r.set(0, 0, 0); st.fly.splice(i, 1); sk3Boom((q.o.position.x / SK3D.S) + SKIRMISH_WORLD_WIDTH / 2, (q.o.position.z / SK3D.S) + SKIRMISH_WORLD_HEIGHT / 2, .5); } }
        // shells, rockets, flames, smoke screens
        sk3Shells(st, dt); sk3Events(st, t, dt); sk3Ambient(st, t, dt);
        (typeof missileRockets !== 'undefined' ? missileRockets : []).forEach(function (r) { if (r.x == null) return; const h = 1.5 + Math.sin(Math.min(1, r.progress || 0) * Math.PI) * 14, x = sk3X(r.x), z = sk3Z(r.y); st.fire.emit({ x: x, y: h, z: z, life: dt + .004, s0: .9, c0: [12, 7, 2.5, 1], c1: [4, 1, .2, 0], add: 1 }); st.smoke.emit({ x: x, y: h, z: z, vx: (Math.random() - .5) * .4, vy: .2, vz: (Math.random() - .5) * .4, life: 3, s0: .35, s1: 2, c0: [.72, .7, .67, .45], c1: [.72, .7, .67, 0], drag: 1.2 }); });
        (typeof flameEffects !== 'undefined' ? flameEffects : []).forEach(function (f) { const src = f.source; if (!src || src.destroyed) return; const m = SK3D.models.get(src); let p, d; if (m) { try { const md = exMuzzle(m); p = md[0]; d = md[1]; } catch (e) {} } if (!p) { p = new THREE.Vector3(sk3X(src.x), 1.5, sk3Z(src.y)); d = new THREE.Vector3(Math.cos(f.angle || 0), 0, Math.sin(f.angle || 0)); } for (let i = 0; i < 6; i++) { const sp = 10 + Math.random() * 8; st.fire.emit({ x: p.x, y: p.y, z: p.z, vx: d.x * sp + (Math.random() - .5) * 2, vy: d.y * sp + Math.random() * 1.5, vz: d.z * sp + (Math.random() - .5) * 2, life: .5 + Math.random() * .4, s0: .3, s1: 2.6, c0: [6, 2.6, .6, 1], c1: [1.4, .3, .05, 0], add: .9, add1: .5, drag: 1.4, ease: 1.5 }); } });
        (typeof abilitySmokeClouds !== 'undefined' ? abilitySmokeClouds : []).forEach(function (c) { if (Math.random() < dt * 14) { const a = Math.random() * 6.28, r = Math.random() * (c.radius || 60) * SK3D.S; st.smoke.emit({ x: sk3X(c.x) + Math.cos(a) * r, y: .6, z: sk3Z(c.y) + Math.sin(a) * r, vx: (Math.random() - .5) * .5, vy: .4, vz: (Math.random() - .5) * .5, life: 4, s0: 2.5, s1: 7, c0: [.8, .8, .78, .7], c1: [.82, .82, .8, 0], drag: .5, fadeIn: .2 }); } });
        if (typeof PK !== 'undefined' && PK.list) { st.pk = st.pk || new Map(); const keep = new Set(); PK.list.forEach(function (p) { keep.add(p.id); let o = st.pk.get(p.id); if (!o) { o = new THREE.Group(); tk3Mesh(tk3Box(1.1, .8, .8), tk3Std('#6a5a34', .8), 0, 0, 0, o, true); tk3Mesh(tk3Box(1.14, .12, .84), tk3Std('#3a3020', .7, .3), 0, .1, 0, o); const gl = tk3Mesh(new THREE.SphereGeometry(.9, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd060, transparent: true, opacity: .18, depthWrite: false }), 0, 0, 0, o); TK3.scene.add(o); st.pk.set(p.id, o); } o.position.set(sk3X(p.x), .9 + Math.sin(t * 2.5 + (p.phase || 0)) * .25, sk3Z(p.y)); o.rotation.y = t * 1.2; }); st.pk.forEach(function (o, id) { if (!keep.has(id)) { TK3.scene.remove(o); st.pk.delete(id); } }); }
        st.flashL.intensity *= Math.pow(.0005, dt); st.boomL.intensity *= Math.pow(.002, dt);
        sk3Camera(st, dt);
        // keep the sun's shadow box centred on the action
        const L = st.L.dir, c = SK3D.camT || new THREE.Vector3(); if (st.fill && SK3D.camP) { st.fill.position.copy(SK3D.camP).add(new THREE.Vector3(0, 6, 0)); st.fill.target.position.copy(c); st.fill.target.updateMatrixWorld(); } L.target.position.set(c.x, 0, c.z); L.position.copy(st.sun).multiplyScalar(120).add(L.target.position); L.target.updateMatrixWorld(); }
});
SK3D.idx = TK3.list.length - 1;

/* ---------- camera + aim ---------- */
function sk3Camera(st, dt) { const cam = TK3.cam, t = player; if (!t) return; const m = SK3D.models.get(t), k = m ? m.k : 1, px = sk3X(t.x), pz = sk3Z(t.y), fy = Math.cos(SK3D.yaw), fz = Math.sin(SK3D.yaw);
    const scope = SK3D.scope && !t.destroyed, hf = scope ? 18 : 72; if (cam.userData.hfov !== hf) { cam.userData.hfov = hf; tk3Aspect(); }
    const tgt = new THREE.Vector3(px, 2.3 * k, pz); SK3D.camT = tgt; let want;
    if (scope) { let mz = null; if (m) try { mz = exMuzzle(m)[0]; } catch (e) {} const top = (m ? m.spec.tt + m.spec.th : 2.4) * k, reach = mz ? Math.hypot(mz.x - px, mz.z - pz) + .7 : 4; want = new THREE.Vector3(px + fy * reach, top + .25, pz + fz * reach); cam.position.copy(want); SK3D.camP = want.clone(); const D = Math.max(30, SK3D.aimD || 60); cam.lookAt(px + fy * D, 1.5 - (SK3D.pitch - .3) * 12, pz + fz * D); }
    else { const d = SK3D.dist * (t.destroyed ? 1.4 : 1), cp = Math.cos(SK3D.pitch), sp = Math.sin(SK3D.pitch); want = new THREE.Vector3(px - fy * d * cp, tgt.y + d * sp + .8, pz - fz * d * cp);
        // pull the camera in front of any building behind the tank
        let f = 1; for (let i = 1; i <= 14; i++) { const u = i / 14, x = tgt.x + (want.x - tgt.x) * u, y = tgt.y + (want.y - tgt.y) * u, z = tgt.z + (want.z - tgt.z) * u; if (SK3D.tall.some(function (b) { return x > b[0] && x < b[2] && z > b[1] && z < b[3] && y < b[4] + .6; })) { f = Math.max(.18, (i - 1.2) / 14); break; } }
        want.lerpVectors(tgt, want, f); want.y = Math.max(want.y, st.hgt(want.x, want.z) + .8);
        if (!SK3D.camP || SK3D.camP.distanceTo(want) > 25) SK3D.camP = want.clone(); else SK3D.camP.lerp(want, 1 - Math.pow(.0004, dt)); cam.position.copy(SK3D.camP);
        cam.lookAt(tgt.x + fy * 24, 1.6 - (SK3D.pitch - .3) * 22, tgt.z + fz * 24); }
    if (scope) { mouse.active = true; return; } cam.updateMatrixWorld(); // where the crosshair lands on the ground (used for abilities / artillery aim)
    const ray = new THREE.Vector3(0, 0, .5).unproject(cam).sub(cam.position).normalize(); let D = 60; if (ray.y < -.01) { const tt = (cam.position.y - .0) / -ray.y, hx = cam.position.x + ray.x * tt, hz = cam.position.z + ray.z * tt; D = Math.max(8, Math.min(140, Math.hypot(hx - px, hz - pz))); } SK3D.aimD = D;
    mouse.x = Math.max(0, Math.min(SKIRMISH_WORLD_WIDTH, t.x + fy * D / SK3D.S)); mouse.y = Math.max(0, Math.min(SKIRMISH_WORLD_HEIGHT, t.y + fz * D / SK3D.S)); mouse.active = true; }
function sk3Turret() { const t = player; if (!t || t.destroyed) return; if (t.turretDisabledUntil && Date.now() < t.turretDisabledUntil) return; const rate = sk3TurretRate(t) / 60;
    let d = SK3D.yaw - (t.turretAngle || 0); while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; t.turretAngle = (t.turretAngle || 0) + Math.max(-rate, Math.min(rate, d)); if (t.model === 't35' && typeof setT35TurretAim === 'function') setT35TurretAim(t, mouse.x, mouse.y, .08); }

/* ---------- on-screen HUD (crosshair, name tags, prompts) ---------- */
function sk3Hud() { const c = SK3D.hud; if (!c) return; const q = Math.max(1, Math.min(2, (window.devicePixelRatio || 1) * (FIT.k || 1))); if (c.width !== Math.round(1100 * q)) { c.width = Math.round(1100 * q); c.height = Math.round(700 * q); } const g = c.getContext('2d'); g.setTransform(q, 0, 0, q, 0, 0); g.clearRect(0, 0, 1100, 700); if (!player || !TK3.cam) return;
    const cam = TK3.cam, v = new THREE.Vector3(), proj = function (x, y, z) { v.set(x, y, z).project(cam); return v.z < 1 && v.z > -1 ? [(v.x + 1) * 550, (1 - v.y) * 350] : null; };
    // name tags + health bars
    const tag = function (t, foe) { if (!t || t.destroyed) return; const m = SK3D.models.get(t), top = m ? (m.spec.tt + m.spec.th + .9) * m.k : 3.6, p = proj(sk3X(t.x), top, sk3Z(t.y)); if (!p) return; const dist = Math.hypot(t.x - player.x, t.y - player.y) * SK3D.S; if (dist > 170) return; const a = Math.max(.35, 1 - dist / 220);
        g.globalAlpha = a; g.textAlign = 'center'; g.font = 'bold 12px "Stardos Stencil", Impact, sans-serif'; g.fillStyle = foe ? '#ffb0a0' : '#b8d4ff'; g.shadowColor = '#000'; g.shadowBlur = 4; g.fillText(String(t.name || '').toUpperCase() + '  ' + Math.round(dist) + 'm', p[0], p[1] - 10); g.shadowBlur = 0;
        const w = 56, hp = Math.max(0, t.health / t.maxHealth); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(p[0] - w / 2 - 1, p[1] - 5, w + 2, 7); g.fillStyle = foe ? (hp < .3 ? '#ff4030' : '#d8503c') : '#4a90e0'; g.fillRect(p[0] - w / 2, p[1] - 4, w * hp, 5); g.globalAlpha = 1;
        if (foe && window.EXE && EXE.cand === t) { const lab = 'F  EXECUTE', tw = g.measureText(lab).width + 22; g.fillStyle = 'rgba(120,20,10,.92)'; g.fillRect(p[0] - tw / 2, p[1] - 44, tw, 22); g.strokeStyle = '#ffb08a'; g.strokeRect(p[0] - tw / 2, p[1] - 44, tw, 22); g.fillStyle = '#fff0e0'; g.font = 'bold 14px "Stardos Stencil", Impact, sans-serif'; g.fillText(lab, p[0], p[1] - 28); } };
    (enemies || []).forEach(function (e) { tag(e, true); }); (allies || []).forEach(function (a) { tag(a, false); });
    if (player.destroyed) return;
    // where the gun is actually pointing (lags behind the crosshair while the turret traverses)
    const ta = player.turretAngle || 0, gp = proj(sk3X(player.x) + Math.cos(ta) * SK3D.aimD, 1.2, sk3Z(player.y) + Math.sin(ta) * SK3D.aimD);
    const cx = 550, cy = 350, ready = Math.min(1, (Date.now() - (player.lastShot || 0)) / (player.reload || 1000)), ok = ready >= 1 && (typeof canTankFire !== 'function' || canTankFire(player));
    if (gp) { g.strokeStyle = 'rgba(255,240,200,.85)'; g.lineWidth = 1.5; g.beginPath(); g.arc(gp[0], gp[1], 9, 0, 6.29); g.stroke(); g.beginPath(); g.moveTo(gp[0] - 4, gp[1]); g.lineTo(gp[0] + 4, gp[1]); g.stroke(); }
    if (!SK3D.scope) { g.strokeStyle = ok ? 'rgba(140,255,120,.95)' : 'rgba(255,190,90,.95)'; g.lineWidth = 2; [[-1, 0], [1, 0], [0, 1]].forEach(function (d) { g.beginPath(); g.moveTo(cx + d[0] * 7, cy + d[1] * 7); g.lineTo(cx + d[0] * 17, cy + d[1] * 17); g.stroke(); }); g.fillStyle = g.strokeStyle; g.fillRect(cx - 1, cy - 1, 2, 2); }
    g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.arc(cx, cy, 26, -Math.PI / 2, Math.PI * 1.5); g.stroke(); g.strokeStyle = ok ? 'rgba(140,255,120,.9)' : 'rgba(255,190,90,.9)'; g.beginPath(); g.arc(cx, cy, 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ready); g.stroke();
    if (!ok && player.gunJammed) { g.font = 'bold 13px "Special Elite", monospace'; g.fillStyle = '#ff8060'; g.textAlign = 'center'; g.fillText('GUN JAMMED — R TO REPAIR', cx, cy + 50); }
    // driving hint for the first few seconds / while the mouse isn't captured
    if (!SK3D.locked || performance.now() - SK3D.hint < 9000) { g.textAlign = 'center'; g.font = '13px "Special Elite", monospace'; const msg = SK3D.locked ? 'W/S THROTTLE · A/D TURN THE HULL · MOUSE AIMS (THE TURRET TRAVERSES) · CLICK/SPACE FIRE · RIGHT-CLICK/SHIFT: GUNSIGHT' : 'CLICK THE BATTLEFIELD TO TAKE THE GUNNER\'S SEAT (MOUSE AIMS THE TURRET)'; const w = g.measureText(msg).width + 30; g.fillStyle = 'rgba(10,10,8,.7)'; g.fillRect(cx - w / 2, 640, w, 28); g.fillStyle = SK3D.locked ? '#e8dcb8' : '#ffd27a'; g.fillText(msg, cx, 659); }
    g.textAlign = 'left'; g.font = 'bold 11px "Special Elite", monospace'; g.fillStyle = 'rgba(255,220,140,.75)'; g.fillText('3D SKIRMISH · TEST BUILD', 14, 22); }

/* ---------- start / stop ---------- */
function sk3Style() { if (document.getElementById('sk3Style')) return; const s = document.createElement('style'); s.id = 'sk3Style'; s.textContent = 'body.sk3d #canvasViewport::before,body.sk3d #canvasViewport::after{display:none!important}body.sk3d #gameCanvas{visibility:hidden}#sk3Hud{position:absolute;left:0;top:0;width:1100px;height:700px;z-index:2;pointer-events:none}#sk3Scope{position:absolute;inset:0;z-index:3;pointer-events:none;display:none}#sk3Scope svg{position:absolute;left:50%;top:50%;width:1100px;height:1100px;transform:translate(-50%,-50%)}#sk3Load{position:absolute;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;background:#0b0d09;color:#e8dcb8;font:16px "Special Elite",monospace;letter-spacing:.3em}' +
    '#menu .modeGrid #sk3Button{border-color:#c8a040}#menu .modeGrid #sk3Button .mNum::before{content:""}'; document.head.appendChild(s); }
function sk3Size() { const k = FIT.k || 1, dpr = Math.min(window.devicePixelRatio || 1, 2); let s = (TK3.scale || 1) * dpr * k, W = Math.round(1100 * s), H = Math.round(700 * s); const mx = 1800; if (W > mx) { H = Math.round(H * mx / W); W = mx; } if (W === TK3.W && H === TK3.H) return; TK3.W = W; TK3.H = H; TK3.R.setPixelRatio(1); TK3.R.setSize(W, H, false); if (TK3.rts) { TK3.rts.scene.dispose(); TK3.rts.a.concat(TK3.rts.b).concat([TK3.rts.ray, TK3.rts.ray2]).forEach(function (r) { r && r.dispose(); }); } tk3Post(); if (TK3.cam) tk3Aspect(); }
function sk3Frame(now) { if (!SK3D.ready || TK3.cur !== SK3D.idx || !TK3.scene) return; const t = Math.max(0, (now - TK3.t0) / 1000), dt = Math.min(.05, Math.max(0, t - TK3.prev)); TK3.prev = t; const sc = TK3.list[SK3D.idx]; TK3.fade = Math.min(1, t / .8); TK3.flash *= Math.pow(.02, dt);
    try { sc.update(TK3.st, t, dt); for (let i = 0; i < TK3.parts.length; i++) TK3.parts[i].update(dt); if (TK3.sky) { TK3.sky.position.copy(TK3.cam.position); TK3.sky.userData.u.time.value = t; TK3.sky.userData.u.flash.value = TK3.flash * .6; }
        if (TK3.shake > 0) { TK3.cam.position.x += (Math.random() - .5) * TK3.shake; TK3.cam.position.y += (Math.random() - .5) * TK3.shake; TK3.shake *= Math.pow(.02, dt); }
        sk3Size(); tk3Render(t); } catch (e) { SK3D.err = e; if ((SK3D.errs = (SK3D.errs || 0) + 1) < 4) try { console.warn('3D skirmish', e); } catch (x) {} }
    try { sk3Hud(); } catch (e) {} }
function sk3Build() { const vp = document.getElementById('canvasViewport'); if (!vp || !tk3Init(vp)) return false; TK3.failed = false; TK3.err = null; SK3D.ready = false; const ld = sk3LoadMsg(true);
    try { tk3Build(SK3D.idx); } catch (e) { SK3D.err = e; try { console.warn('3D skirmish build', e); } catch (x) {} sk3LoadMsg(false); return false; }
    vp.insertBefore(TK3.cv, document.getElementById('minimapPanel')); TK3.cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;cursor:crosshair;'; TK3.W = 0; sk3Size();
    if (!SK3D.hud) { SK3D.hud = document.createElement('canvas'); SK3D.hud.id = 'sk3Hud'; const sc = document.createElement('div'); sc.id = 'sk3Scope'; SK3D.scopeEl = sc; } vp.insertBefore(SK3D.hud, document.getElementById('minimapPanel')); vp.insertBefore(SK3D.scopeEl, document.getElementById('minimapPanel')); SK3D.hud.style.display = 'block';
    if (!TK3.cv.sk3Bound) { TK3.cv.sk3Bound = true; sk3Bind(TK3.cv); } SK3D.ready = true; sk3LoadMsg(false); return true; }
function sk3LoadMsg(on) { const vp = document.getElementById('canvasViewport'); let e = document.getElementById('sk3Load'); if (!on) { if (e) e.remove(); return; } if (!e && vp) { e = document.createElement('div'); e.id = 'sk3Load'; e.textContent = 'BUILDING THE 3D BATTLEFIELD…'; vp.appendChild(e); } return e; }
function sk3Start() { if (!SK3D.want || selectedGameMode !== 'skirmish' || (typeof DUEL !== 'undefined' && DUEL.active)) return; sk3Style(); SK3D.on = true; SK3D.yaw = player ? player.angle || 0 : 0; SK3D.pitch = .3; SK3D.scope = false; SK3D.hint = performance.now(); document.body.classList.add('sk3d'); clearMovementKeys();
    const go = function () { if (!SK3D.on || !gameRunning) return; if (!sk3Build()) { sk3Stop(); try { showRadioText('3D COULD NOT START ON THIS COMPUTER — PLAYING IN 2D.', true); } catch (e) {} } };
    if (window.THREE) { sk3LoadMsg(true); setTimeout(go, 30); } else { sk3LoadMsg(true); TK3.failed = false; tk3Load(function (ok) { if (ok) go(); else { sk3Stop(); try { showRadioText('3D COULD NOT LOAD (NO CONNECTION TO THE 3D LIBRARY) — PLAYING IN 2D.', true); } catch (e) {} } }); } }
function sk3Stop() { const was = SK3D.on; SK3D.on = false; SK3D.ready = false; SK3D.scope = false; document.body.classList.remove('sk3d'); sk3LoadMsg(false); if (SK3D.hud) SK3D.hud.style.display = 'none'; if (SK3D.scopeEl) SK3D.scopeEl.style.display = 'none'; try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {}
    if (TK3.cv && TK3.cv.parentNode && TK3.cv.parentNode.id === 'canvasViewport') TK3.cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:none;'; if (was && TK3.cur === SK3D.idx) { try { tk3Clear(); TK3.cur = -1; } catch (e) {} } SK3D.models = new Map(); SK3D.wrecks = []; SK3D.st = null; }

/* ---------- mouse + keys ---------- */
function sk3Bind(cv) { cv.addEventListener('contextmenu', function (e) { if (SK3D.on) e.preventDefault(); });
    cv.addEventListener('mousedown', function (e) { if (!SK3D.on) return; e.preventDefault(); if (e.button === 2) { SK3D.rmb = true; sk3SetScope(true); return; } if (e.button !== 0) return; if (!SK3D.locked) { try { const p = cv.requestPointerLock(); if (p && p.catch) p.catch(function () {}); } catch (x) {} SK3D.hint = performance.now(); if (SK3D.clicked) shoot(); SK3D.clicked = true; return; } shoot(); });
    window.addEventListener('mouseup', function (e) { if (e.button === 2 && SK3D.rmb) { SK3D.rmb = false; sk3SetScope(false); } });
    cv.addEventListener('wheel', function (e) { if (!SK3D.on) return; e.preventDefault(); SK3D.dist = Math.max(5.5, Math.min(22, SK3D.dist * Math.exp(e.deltaY * .0012))); }, { passive: false });
    document.addEventListener('pointerlockchange', function () { SK3D.locked = document.pointerLockElement === cv; });
    document.addEventListener('mousemove', function (e) { if (!SK3D.on || !gameRunning || (typeof gamePaused !== 'undefined' && gamePaused)) return; const free = !SK3D.locked; if (free && e.target !== cv) return; const k = SK3D.scope ? .0007 : .0026; SK3D.yaw += (e.movementX || 0) * k * (free ? .6 : 1); SK3D.pitch = Math.max(-.08, Math.min(.62, SK3D.pitch + (e.movementY || 0) * k * .7)); }); }
function sk3SetScope(on) { SK3D.scope = !!on && !!player && !player.destroyed; const el = SK3D.scopeEl; if (!el) return; if (SK3D.scope) { el.innerHTML = window.exScopeSvg ? exScopeSvg(player.faction === 'german' ? 'de' : '') : ''; el.style.display = 'block'; } else el.style.display = 'none'; }

/* ---------- hooks into the 2D game ---------- */
(function () {
    // driving: W/S throttle along the hull, A/D turn it (the 2D game drives by screen direction)
    const _mp = movePlayer; movePlayer = function () { if (!SK3D.on) return _mp.apply(this, arguments); if (!player || player.destroyed) return; if (player.repairing) { player.skV = 0; return; }
        // tank driving: throttle along the hull with real acceleration and braking, A/D slew the hull at a tank's pace
        const fw = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0), tr = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0);
        const sp = getTankSpeed(player), full = (player.speed || 1) * SK3W.speedK, mob = Math.min(1, sp / full * 1.4), turn = sk3HullRate(player) * Math.max(.35, mob) * (fw ? 1 : 1.2);
        if (tr) { player.angle = (player.angle || 0) + tr * turn; engineMovedAt = Date.now(); }
        const v0 = player.skV || 0, target = fw > 0 ? sp : fw < 0 ? -sp * .5 : 0, speeding = Math.abs(target) > Math.abs(v0) && (v0 === 0 || Math.sign(target) === Math.sign(v0)), acc = speeding ? .028 : .06;
        player.skV = v0 + Math.max(-acc, Math.min(acc, target - v0)); if (Math.abs(player.skV) < .004) { player.skV = 0; return; }
        engineMovedAt = Date.now(); const mx = Math.cos(player.angle) * player.skV, my = Math.sin(player.angle) * player.skV; let blocked = false;
        if (!tankHitsObstacle(player, player.x + mx, player.y)) player.x += mx; else blocked = true; if (!tankHitsObstacle(player, player.x, player.y + my)) player.y += my; else blocked = true; if (blocked) player.skV *= .6;
        player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x)); player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
        addTrackMarks(player); };
    const _ap = aimPlayer; aimPlayer = function () { if (!SK3D.on) return _ap.apply(this, arguments); sk3Turret(); };
    // in 3D the 2D battlefield canvas is hidden, so don't spend time painting it; just keep the execution prompt check running
    const _de = drawEverything; drawEverything = function () { if (!(SK3D.on && SK3D.ready)) return _de.apply(this, arguments); if (SK3D.skip) return; if (window.EXE && EXE.on) return;
        try { drawAlliedRadioBoxes(); } catch (e) {} if (TK3.cur !== SK3D.idx) { SK3D.ready = false; setTimeout(function () { if (SK3D.on && gameRunning && !(window.EXE && EXE.on)) sk3Build(); }, 0); return; } sk3Frame(performance.now()); };
    if (typeof drawMinimap === 'function') { const _mm = drawMinimap; drawMinimap = function () { if (SK3D.skip) return; return _mm.apply(this, arguments); }; }
    // The 2D game moves everything one step per screen refresh. 3D frames take longer, which would slow the whole battle
    // (shells included), so in 3D the battle runs at a fixed 60 steps a second and only the last step of each frame is drawn.
    const STEP = 1000 / 60, _gl = gameLoop; gameLoop = function () { if (!SK3D.on || !SK3D.ready || !gameRunning || (typeof gamePaused !== 'undefined' && gamePaused) || (window.EXE && EXE.on)) { SK3D.simT = 0; return _gl.apply(this, arguments); }
        const now = performance.now(); if (!SK3D.simT || now - SK3D.simT > 250) SK3D.simT = now - STEP; let n = Math.floor((now - SK3D.simT) / STEP);
        if (n < 1) { requestAnimationFrame(gameLoop); return; } if (n > 5) { n = 5; SK3D.simT = now - 5 * STEP; } SK3D.simT += n * STEP; SK3D.steps = (SK3D.steps || 0) + n;
        if (n > 1) { const raf = window.requestAnimationFrame, later = []; window.requestAnimationFrame = function (f) { if (f !== gameLoop) later.push(f); return 0; }; SK3D.skip = true;
            try { for (let i = 1; i < n && gameRunning; i++) _gl.apply(this, arguments); } finally { window.requestAnimationFrame = raf; SK3D.skip = false; later.forEach(function (f) { raf(f); }); } }
        return _gl.apply(this, arguments); };
    const _mf = createMuzzleFlash; createMuzzleFlash = function (t) { const r = _mf.apply(this, arguments); if (SK3D.on && SK3D.ready) try { sk3Muzzle(t); } catch (e) {} return r; };
    const _ce = createExplosion; createExplosion = function (x, y, s) { const r = _ce.apply(this, arguments); if (SK3D.on && SK3D.ready) try { sk3Boom(x, y, s); } catch (e) {} return r; };
    const _hs = createHitSparks; createHitSparks = function (x, y) { const r = _hs.apply(this, arguments); if (SK3D.on && SK3D.ready) try { sk3Sparks(x, y); } catch (e) {} return r; };
    // starting / leaving a battle
    const _sg = startGame; startGame = function () { if (SK3D.on) sk3Stop(); const r = _sg.apply(this, arguments); try { sk3Start(); } catch (e) { try { console.warn('3D skirmish start', e); } catch (x) {} sk3Stop(); } return r; };
    const _rm = returnToMenu; returnToMenu = function () { sk3Stop(); SK3D.want = false; sk3Badge(); return _rm.apply(this, arguments); };
    const _cg = chooseGameMode; chooseGameMode = function (mode, three) { SK3D.want = !!three && mode === 'skirmish'; const r = _cg.apply(this, arguments); sk3Badge(); return r; };
    if (typeof openDuel === 'function') { const _od = openDuel; openDuel = function () { SK3D.want = false; return _od.apply(this, arguments); }; }
    // SHIFT toggles the gunner's sight
    window.addEventListener('keydown', function (e) { if (!SK3D.on || e.repeat) return; if (e.key === 'Shift') { e.preventDefault(); sk3SetScope(!SK3D.scope); } }, true);
    // the menu button
    sk3Style(); const grid = document.querySelector('#menu .modeGrid'); if (grid && !document.getElementById('sk3Button')) { const b = document.createElement('button'); b.id = 'sk3Button'; b.onclick = function () { chooseGameMode('skirmish', true); }; b.innerHTML = '<span class="mNum">3D</span><span class="mName">3D SKIRMISH <small style="font-size:.55em;color:#ffcf6a;letter-spacing:.15em">TEST</small></span><span class="mSub">Skirmish in full 3D, driven from behind your tank. An early test of a 3D Tankers.</span>'; grid.appendChild(b); }
})();
// a little banner on the Skirmish setup screen so you know you're setting up the 3D version
function sk3Badge() { const sc = document.getElementById('skirmishScreen'); if (!sc) return; let b = document.getElementById('sk3Badge'); if (!b) { b = document.createElement('div'); b.id = 'sk3Badge'; b.style.cssText = 'margin:8px auto 14px;max-width:760px;padding:10px 16px;border:2px solid #c8a040;background:rgba(40,30,10,.85);color:#ffe6a8;font:14px "Special Elite",monospace;letter-spacing:.12em;text-align:center;'; b.innerHTML = '<b style="font-family:Stardos Stencil,Impact,sans-serif;letter-spacing:.2em;font-size:17px">3D SKIRMISH — TEST</b><br>W/S drive · A/D turn the hull · mouse aims the turret · click or SPACE fires · right-click or SHIFT for the gunsight'; sc.insertBefore(b, sc.firstChild.nextSibling); } b.style.display = SK3D.want ? 'block' : 'none'; }
