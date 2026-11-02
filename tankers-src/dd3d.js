/* =====================================================
   MISSION 1 intro (D-Day) as a real 3D cutscene, using the shared three.js engine (tk3core).
   Four shots, timed to the existing captions, cuts and sounds of drawDDayCutscene (DD.dur 28.2, cuts 6.6/13.6/20.2):
     A 0–6.6     the invasion fleet at dawn, a battleship firing broadsides, landing craft heading in, Spitfires over
     B 6.6–13.6  inside a landing craft: men crouched, spray over the ramp, shells and tracers all around
     C 13.6–20.2 on the sand looking back: the ramp drops, the men run through the surf under fire
     D 20.2–28.2 a bigger landing craft beaches, its ramp drops and YOUR campaign tank rolls off and fires
   The 2D cutscene keeps doing titles, captions, fades, skip and sound; this file only replaces the picture
   (ddgInit / ddglRender are wrapped so the 3D frame is what gets drawn). If 3D can't run, the old picture is used.
===================================================== */
const DD3 = { idx: -1, state: 'off', saved: null, prev: 0, q: 1, flash: 0, ms: 16, loadAt: 0, err: null };
function dd3Hf(x, z) { const n = tk3Fbm(x * .04, z * .04, 3), bx = x - 170 + Math.sin(z * .013) * 7; let h = Math.max(-7, bx * (bx > 0 ? .065 : .055));
    if (bx > 70) h += Math.min(1.5, (bx - 70) * .15); if (bx > 95) h += Math.min(26, (bx - 95) * .75) * (.75 + tk3Fbm(z * .01, x * .01, 2) * .5); return h + n * (bx > 0 ? .7 : .25) - .2; }
function dd3Tank() { const fac = (typeof campaignFaction !== 'undefined' && campaignFaction) || 'american', cls = (typeof campaignTankClass !== 'undefined' && campaignTankClass) || 'medium', set = tanks[fac] || tanks.american, d = set[cls] || set.medium || {};
    let model = 'sherman'; try { model = sk3ModelName({ model: d.model, className: d.className }); } catch (e) {} return { fac: fac, model: model }; }
TK3.list.push({ name: 'D-DAY 3D', place: '', kind: '', hfov: 70, shift: [0, 0], grade: { bloom: .7, expo: .96, sat: .74, con: 1.14, tint: [.98, 1, 1.05], vig: .55, grain: .07, th: 1.25 },
    build: function (st) { const S = TK3.scene, R = tk3Rand(7); const sun = new THREE.Vector3(.75, .2, -.45).normalize(); st.sun = sun;
        tk3Sky({ top: '#56626e', hor: '#c6bca8', bot: '#7a7468', sunDir: sun, sunCol: '#ffe6c4', sunI: 1.8, sunSize: .9998, glow: .9, glowCol: '#e8b080', cov: .82, cLit: '#cfc6ba', cDark: '#565862', cScale: 1, wind: [.003, .001] }); tk3Fog('#9c9a92', .0036);
        tk3Water({ deep: '#14262a', shal: '#4a6a62', skyH: '#aaa89e', skyT: '#5a6878', sunDir: sun, sunCol: '#ffe0b8', sunI: 1.5, amp: .6, len: 16, steep: .6, dir: .05, spread: 1, n: 6, shine: 160, foam: .55, chop: 1.3, size: 900, seg: 300 });
        // the beach: wet sand, shingle bank, marsh, then the bluffs
        const g = tk3Terrain(460, 1000, 190, 300, function (x, z) { return dd3Hf(x + 330, z); }, function (x, z, h, ny, c) { const bx = x + 330 - 170; c.set('#968668'); if (h < .9) c.lerp(tk3C('#5e5646'), Math.min(1, (.9 - h) * .8)); if (bx > 70 && bx < 82) c.lerp(tk3C('#86827a'), .7); if (bx > 82) c.lerp(tk3C('#7a7656'), .6); if (h > 9) c.lerp(tk3C('#6a7248'), Math.min(1, (h - 9) * .12)); if (ny < .72) c.lerp(tk3C('#7a7262'), .7); });
        const land = new THREE.Mesh(g, tk3Std('#ffffff', .95, 0, { vertexColors: true })); land.position.x = 330; land.receiveShadow = true; land.castShadow = true; S.add(land);
        // bunkers on the bluff edge, slits facing the sea
        const con = tk3Std('#7a7a72', .92), dark = tk3Std('#0a0a0a', 1); st.bunk = []; for (const z of [-110, -30, 50, 130]) { const x = 268 + Math.sin(z * .013) * 6, y = dd3Hf(x, z); const b = tk3Mesh(tk3Box(10, 4.4, 9), con, x, y + 1.2, z, S); b.rotation.y = (R() - .5) * .3; tk3Mesh(tk3Box(.4, .7, 5.5), dark, x - 5.05, y + 2.3, z, S); st.bunk.push(new THREE.Vector3(x - 5.4, y + 2.3, z)); }
        // hedgehogs and stakes on the sand
        const hm = tk3Std('#3a2a20', .7, .5), wood = tk3Std('#5a4630', .9); for (let i = 0; i < 80; i++) { const x = 172 + R() * 34, z = -220 + R() * 440; if (Math.abs(z) < 14 && x < 200) continue; const h = tk3Hedgehog(hm); h.position.set(x, dd3Hf(x, z) - .3, z); h.rotation.y = R() * 3; h.scale.setScalar(1.1); S.add(h); }
        for (let i = 0; i < 30; i++) { const x = 165 + R() * 20, z = -220 + R() * 440, p = tk3Mesh(tk3Cyl(.12, .14, 3.2, 6), wood, x, dd3Hf(x, z) + .9, z, S); p.rotation.z = -.5; }
        st.L = tk3Lights({ sky: '#9aa4b4', ground: '#6a6050', hemi: 1.05, dir: sun, dirCol: '#ffe0c0', dirI: 2.1, shadowSize: 34 }); const fill = new THREE.DirectionalLight(tk3C('#8aa0c8'), .6); fill.position.set(-60, 30, 20); S.add(fill);
        // the fleet offshore
        st.ships = []; const ship = function (G, len, beam, x, z, head) { S.add(G); st.ships.push({ g: G, len: len, beam: beam, x: x, z: z, h: head }); return G; };
        st.bb = ship(tk3Destroyer({ len: 175, base: '#8a9294', sup: '#7a8486', camo: ['#6a7478', '#5a6468', '#7a8488'] }), 175, 14, -400, 70, .12);
        [[-330, -150], [-250, 170], [-470, -40], [-200, -260], [-560, 220]].forEach(function (p, i) { ship(tk3Destroyer({ len: 100 + i * 6 }), 100, 8, p[0], p[1], .15 * (i % 2 ? 1 : -1)); });
        [[-430, 260], [-520, -220], [-640, 120], [-380, -330], [-700, -60]].forEach(function (p, i) { ship(tk3Merchant({ col: ['#4e5458', '#5a5048', '#46505a', '#585a5c', '#50524e'][i] }), 120, 9, p[0], p[1], 0); });
        // landing craft heading in (the hero boat carries the men we ride with)
        st.lca = []; for (let i = 0; i < 14; i++) { const b = tk3LCA(); S.add(b); const hm2 = []; for (let k = 0; k < 8; k++) { const s = new THREE.SphereGeometry(.17, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2); tk3Xf(s, -3 + (k % 4) * 1.8, 1.42, (k < 4 ? -.5 : .5)); hm2.push(s); } tk3Mesh(tk3Merge(hm2), tk3Std('#4a4e34', .7, .2), 0, 0, 0, b); st.lca.push({ g: b, x0: -300 + R() * 200, z: -40 + (R() - .5) * 300, v: 6 + R() * 1.2, ph: R() * 9 }); }
        st.hero = tk3LCA(); S.add(st.hero); st.men = []; for (let row = 0; row < 4; row++) for (let c = 0; c < 3; c++) { const m = tk3Man({ gun: 'rifle', cap: 'helmet', col: '#5c5a42', helmCol: '#4a4e34' }); m.g.position.set(-2.3 + row * 1.95 + (R() - .5) * .3, .3, (c - 1) * .82 + (R() - .5) * .1); st.hero.add(m.g); tk3Pose2(m, ['crouch', 'portArms'], .55); m.base = m.g.position.clone(); m.ph = R() * 6; m.dl = (3 - row) * .22 + c * .12 + R() * .15; m.fall = (row === 1 && c === 2) ? 16.5 : (row === 2 && c === 0) ? 17.6 : 0; st.men.push(m); }
        // men already pinned down on the sand
        st.beach = []; for (let i = 0; i < 9; i++) { const m = tk3Man({ gun: 'rifle', cap: 'helmet', col: '#5c5a42', helmCol: '#4a4e34' }); const x = 176 + R() * 22, z = -30 + R() * 110; m.g.position.set(x, dd3Hf(x, z), z); m.g.rotation.y = (R() - .5) * .8; tk3Pose2(m, [R() < .5 ? 'kneel' : 'crouch', R() < .5 ? 'aim' : 'portArms'], R() < .5 ? .5 : .55); S.add(m.g); st.beach.push(m); }
        // the tank landing craft (a big LCT) and your tank
        st.lct = tk3LCA(); st.lct.scale.set(1.6, 1.3, 1.85); S.add(st.lct); const tk = dd3Tank(); st.tank = tk3TankModel(tk.model, tk.fac); S.add(st.tank.g); st.tank.g.rotation.order = 'YXZ';
        // effects
        st.spray = tk3Parts(700, { lightCol: '#ffe0c8' }); st.splash = tk3Parts(900, { tex: tk3SoftTex(), lightCol: '#ffe0c8' }); st.smoke = tk3Parts(900, { lightCol: '#ffc8a0' }); st.fire = tk3Parts(600, { tex: tk3SoftTex() }); st.trac = tk3Streaks(300);
        st.fl = tk3PL('#ffb060', 0, 120, 0, 0, 0); st.salvoL = tk3PL('#ffc070', 0, 260, 0, 0, 0);
        for (let i = 0; i < 14; i++) st.smoke.emit({ x: 215 + Math.random() * 80, y: 5 + Math.random() * 14, z: -220 + Math.random() * 440, vx: .6, vy: .25, vz: .8, life: 1e9, s0: 22 + Math.random() * 26, c0: [.32, .3, .29, .22], c1: [.32, .3, .29, .22] });
        st.burn = [[205, -60], [230, 90], [190, 150], [250, -140]].map(function (p) { return new THREE.Vector3(p[0], dd3Hf(p[0], p[1]) + .5, p[1]); });
        st.planes = []; for (let i = 0; i < 3; i++) { const p = tk3Spitfire({}); p.scale.setScalar(1); S.add(p); st.planes.push(p); }
        st.ev = {}; st.cuts = [6.6, 13.6, 20.2]; },
    update: function (st, t, dt) { const cam = TK3.cam, r = Math.random; let focus = new THREE.Vector3();
        const once = function (k, c, f) { if (c && !st.ev[k]) { st.ev[k] = 1; f(); } };
        const boom = function (x, z, s, water) { const y = water ? 0 : dd3Hf(x, z); if (water || y < .1) { for (let i = 0; i < 60; i++) st.splash.emit({ x: x + (r() - .5) * 2 * s, y: 0, z: z + (r() - .5) * 2 * s, vx: (r() - .5) * 5, vy: (9 + r() * 18) * s, vz: (r() - .5) * 5, life: 2.4, s0: .6 * s, s1: 3 * s, c0: [.9, .92, .95, .65], c1: [.9, .92, .95, 0], g: 12, drag: .3 }); }
            else { tk3Sandburst(st.splash, st.smoke, x, y, z, s); tk3Boom(st.fire, st.smoke, x, y + .5, z, .45 * s, { dark: true }); } st.fl.position.set(x, y + 3, z); st.fl.intensity = 2.2 * s; };
        const ahead = function (dmin, dmax, side) { const f = new THREE.Vector3(); cam.getWorldDirection(f); f.y = 0; f.normalize(); const rt = new THREE.Vector3(-f.z, 0, f.x), d = dmin + r() * (dmax - dmin), sd = (r() - .5) * 2 * side; return [cam.position.x + f.x * d + rt.x * sd, cam.position.z + f.z * d + rt.z * sd]; };
        // the fleet rides the swell; the battleship fires broadsides
        st.ships.forEach(function (s) { tk3Float(s.g, s.len, s.beam, s.x + t * 1.2, s.z, s.h, t, 2); });
        [1.7, 3.7, 5.4].forEach(function (ts, i) { once('salvo' + i, t > ts, function () { const b = st.bb; b.updateMatrixWorld(); for (let k = 0; k < 4; k++) { const p = new THREE.Vector3(-50 + k * 30, 9, 6).applyMatrix4(b.matrixWorld); for (let j = 0; j < 30; j++) st.fire.emit({ x: p.x, y: p.y, z: p.z, vx: 30 + r() * 30, vy: r() * 8, vz: (r() - .5) * 14, life: .25 + r() * .2, s0: 6, s1: 14, c0: [10, 6, 2, 1], c1: [3, .8, .2, 0], add: 1, drag: 2 }); for (let j = 0; j < 14; j++) st.smoke.emit({ x: p.x + 8, y: p.y, z: p.z, vx: 12 + r() * 10, vy: 1 + r() * 2, vz: (r() - .5) * 6, life: 9, s0: 6, s1: 30, c0: [.5, .48, .46, .7], c1: [.6, .58, .56, 0], drag: .6 }); }
            st.salvoL.position.set(b.position.x, 20, b.position.z + 20); st.salvoL.intensity = 18; DD3.flash = .35; TK3.shake = .25; }); });
        st.salvoL.intensity *= Math.pow(.004, dt); st.fl.intensity *= Math.pow(.01, dt); DD3.flash *= Math.pow(.02, dt);
        // landing craft wave
        st.lca.forEach(function (b, i) { const x = Math.min(150, b.x0 + t * b.v); tk3Float(b.g, 12, 1.6, x, b.z, 0, t + b.ph, 3); b.g.position.y += .35; });
        const land = 13.75, hx = land > t ? 162 - (land - t) * 7 : 162 + (1 - Math.exp(-(t - land) * 3)) * .8, hero = st.hero; tk3Float(hero, 12, 1.6, hx, 0, 0, t, t > land ? .4 : 3); hero.position.y += .35; if (t > land) hero.position.y = Math.max(hero.position.y, dd3Hf(hx + 4, 0) - .2);
        const ramp = hero.userData.ramp; ramp.rotation.z = -Math.min(1.5, Math.pow(Math.max(0, t - 14.0) * 2.2, 2));
        // the men: crouched aboard, then out through the surf
        st.men.forEach(function (m) { const go = 14.5 + m.dl; if (t < go) { tk3Pose2(m, ['crouch', 'portArms'], .55 + Math.sin(t * 1.4 + m.ph) * .02); m.g.position.copy(m.base); m.j.neck.rotation.y = Math.sin(t * .5 + m.ph) * .3; m.g.rotation.z = 0; return; }
            const k = t - go; if (m.fall && t > m.fall) { const f = Math.min(1, (t - m.fall) * 2.5); m.g.rotation.z = -f * 1.45; if (f < 1) tk3Run(m, (m.fall - go) * 9 + m.ph, 1 - f); return; }
            tk3Pose(m, { neck: [0, 0, 0] }); tk3Run(m, k * 9 + m.ph, 1); tk3Pose(m, { lsh: [-.3, 0, .55], lel: [0, 0, 1.3], rsh: [.25, 0, .25], rel: [0, 0, 1.45] }); const lx = m.base.x + k * 3.6, wx = hero.position.x + lx, gy = Math.max(-.9, dd3Hf(wx, m.base.z)) - hero.position.y; m.g.position.set(lx, lx < 6.3 ? m.base.y : Math.max(gy, m.base.y - .9), m.base.z * (1 + Math.min(1.5, k * .25))); });
        // the tank landing craft beaches and your tank drives off
        const lctLand = 21.3, lx = lctLand > t ? 160 - (lctLand - t) * 6.5 : 160 + (1 - Math.exp(-(t - lctLand) * 3)) * .6, lct = st.lct; tk3Float(lct, 20, 2.8, lx, 40, 0, t + 3, t > lctLand ? .4 : 3); lct.position.y += .45; if (t > lctLand) lct.position.y = Math.max(lct.position.y, dd3Hf(lx + 6, 40) - .3);
        lct.userData.ramp.rotation.z = -Math.min(1.35, Math.pow(Math.max(0, t - 21.6) * 1.7, 2)); lct.updateMatrixWorld();
        const T = st.tank, deck = new THREE.Vector3(-1.5, .35, 0).applyMatrix4(lct.matrixWorld), hinge = new THREE.Vector3(6.25, .35, 0).applyMatrix4(lct.matrixWorld), drive = Math.max(0, t - 22.5), tx = deck.x + drive * 3.4;
        const yAt = function (x) { if (x < hinge.x) return deck.y; if (x < hinge.x + 5) return Math.max(dd3Hf(x, 40) + .02, hinge.y - (x - hinge.x) * .5); return dd3Hf(x, 40) + .02; };
        T.g.position.set(tx, yAt(tx), 40); if (t < 22.5) { T.g.rotation.set(lct.rotation.x, 0, lct.rotation.z); } else T.g.rotation.set(0, 0, Math.atan2(yAt(tx + 2.2) - yAt(tx - 2.2), 4.4));
        // ...turns its gun on a bunker and fires
        const bk = st.bunk[1]; if (T.turret) { const want = Math.atan2(-(bk.z - 40), bk.x - tx), k = Math.min(1, Math.max(0, (t - 23) / 1.1)); T.turret.rotation.y = want * (k * k * (3 - 2 * k)); }
        once('tankfire', t > 24.4, function () { try { const md = exMuzzle(T), p = md[0], d = md[1]; for (let i = 0; i < 40; i++) st.fire.emit({ x: p.x, y: p.y, z: p.z, vx: d.x * (20 + r() * 25) + (r() - .5) * 6, vy: d.y * 20 + (r() - .5) * 6, vz: d.z * (20 + r() * 25) + (r() - .5) * 6, life: .14 + r() * .12, s0: .7, s1: 2, c0: [9, 5, 2, 1], c1: [3, .8, .2, 0], add: 1, drag: 3 }); for (let i = 0; i < 20; i++) st.smoke.emit({ x: p.x, y: p.y, z: p.z, vx: d.x * 8 + (r() - .5) * 3, vy: 1 + r(), vz: d.z * 8 + (r() - .5) * 3, life: 4, s0: 1.2, s1: 6, c0: [.6, .58, .55, .6], c1: [.7, .68, .66, 0], drag: 1 }); st.fl.position.copy(p); st.fl.intensity = 4; T.kick = 1; } catch (e) {} DD3.flash = .2; });
        if (T.gun && T.kick) { T.kick *= Math.pow(.02, dt); T.gun.position.x = (T.gun.userData.x0 == null ? (T.gun.userData.x0 = T.gun.position.x) : T.gun.userData.x0) - T.kick * .5; }
        once('bunkhit', t > 24.85, function () { tk3Boom(st.fire, st.smoke, bk.x, bk.y, bk.z, 2.2, { dark: true }); tk3Sandburst(st.splash, st.smoke, bk.x + 2, bk.y - 1, bk.z, 1.6); st.fl.position.copy(bk); st.fl.intensity = 8; });
        // shells landing all around, on the cue of the 2D cutscene's explosion sounds
        [7.1, 8.0, 8.9, 9.7, 10.5, 11.2, 11.9, 12.6].forEach(function (ts, i) { once('ws' + i, t > ts, function () { const hp = hero.position; boom(hp.x + 10 + r() * 40, (r() < .5 ? -1 : 1) * (8 + r() * 30), .9 + r() * .5, true); }); });
        [14.1, 14.9, 15.7, 16.3, 16.8, 17.4, 18.2, 19.0, 19.6].forEach(function (ts, i) { once('bs' + i, t > ts, function () { const p = ahead(18, 45, 22); boom(p[0], p[1], .8 + r() * .4, false); }); });
        [20.9, 22.0, 23.3, 26.0, 27.1].forEach(function (ts, i) { once('ds' + i, t > ts, function () { const p = ahead(20, 50, 26); boom(p[0], p[1], .9 + r() * .4, false); }); });
        // MG tracers from the bunkers
        if (t > 7 && t > (st.nt || 0)) { st.nt = t + .05 + r() * .09; const s = st.bunk[(r() * st.bunk.length) | 0], tg = t < 13.6 ? new THREE.Vector3(hero.position.x + (r() - .2) * 25, r() * 3, (r() - .5) * 18) : new THREE.Vector3(170 + r() * 25, r() * 2, (r() - .5) * 70 + (t > 20.2 ? 40 : 0)); const d = tg.sub(s).normalize(); st.trac.emit({ x: s.x, y: s.y, z: s.z, vx: d.x * 300, vy: d.y * 300, vz: d.z * 300, life: .8, len: 9, w: .2, c: [9, 5, 1.6, 1] }); }
        st.burn.forEach(function (p, i) { tk3Fire(st.fire, p.x, p.y, p.z, 1.6, dt, 14); if (r() < dt * 3) st.smoke.emit({ x: p.x, y: p.y + 2, z: p.z, vx: .8, vy: 2.5, vz: .4, life: 10, s0: 2.5, s1: 12, c0: [.12, .11, .1, .7], c1: [.3, .29, .28, 0] }); });
        // Spitfires low over the fleet
        st.planes.forEach(function (p, i) { const x = -560 + t * 72 - i * 18, z = 60 + i * 14 - (i % 2) * 22; p.position.set(x, 70 + i * 4 + Math.sin(t + i) * .6, z); p.rotation.set(Math.sin(t * .6 + i) * .06, 0, 0); (p.userData.props || []).forEach(function (pr) { pr.userData.blades.rotation.x = t * 41; }); });
        // ---- camera, shot by shot ----
        const e = function (a, b, k) { k = Math.max(0, Math.min(1, k)); k = k * k * (3 - 2 * k); return a + (b - a) * k; };
        if (t < 6.6) { const k = t / 6.6; cam.position.set(e(-560, -520, k), e(24, 18, k) + Math.sin(t * .7) * .25, e(-150, -120, k)); cam.lookAt(e(-330, -260, k), e(4, 2, k), e(20, 10, k)); focus.set(-400, 0, 40); }
        else if (t < 13.6) { hero.updateMatrixWorld(); const cp = new THREE.Vector3(-4.6, 2.55 + Math.sin(t * .9) * .05, -.2).applyMatrix4(hero.matrixWorld), lk = new THREE.Vector3(14, 1.6, .3).applyMatrix4(hero.matrixWorld); cam.position.copy(cp); cam.lookAt(lk); focus.copy(hero.position);
            if (t < land) { const pr = hero.userData.fp || 0, hit = Math.max(0, -pr) * 30 + .4; for (let i = 0; i < hit * dt * 22; i++) { const p = new THREE.Vector3(6.3, .9, (r() - .5) * 2.6).applyMatrix4(hero.matrixWorld); st.spray.emit({ x: p.x, y: p.y, z: p.z, vx: 3 - r() * 4, vy: 3 + r() * 4, vz: (r() - .5) * 4, life: 1.1, s0: .4, s1: 2.2, c0: [.9, .95, 1, .45], c1: [.9, .95, 1, 0], g: 9, drag: .3 }); } } }
        else if (t < 20.2) { const k = (t - 13.6) / 6.6, cx = e(189, 197, k), cz = e(4, -6, k); cam.position.set(cx, dd3Hf(cx, cz) + e(1.2, 1.9, k), cz); cam.lookAt(e(166, 172, k), e(1.6, 1.5, k), e(0, 2, k)); focus.set(175, 0, 0); }
        else { const k = (t - 20.2) / 8, cx = e(183, 190, k), cz = e(49, 53, k); cam.position.set(cx, dd3Hf(cx, cz) + e(1.0, 4.5, k), cz); cam.lookAt(e(168, tx + 2, Math.min(1, k * 1.6)), e(1.8, 2, k), e(40, 40, k)); focus.set(176, 0, 40); }
        cam.updateMatrixWorld(); tk3WaterFollow(cam); const L = st.L.dir; L.target.position.copy(focus); L.position.copy(focus).addScaledVector(st.sun, 90); L.target.updateMatrixWorld(); } });
DD3.idx = TK3.list.length - 1;
// size the render to the game canvas' shape
function dd3Size(w, h) { const W = Math.max(320, Math.round(Math.min(1500, w) * DD3.q)), H = Math.round(W * h / w); if (W === TK3.W && H === TK3.H) return; TK3.W = W; TK3.H = H; TK3.R.setPixelRatio(1); TK3.R.setSize(W, H, false); if (TK3.rts) { TK3.rts.scene.dispose(); TK3.rts.a.concat(TK3.rts.b).concat([TK3.rts.ray, TK3.rts.ray2]).forEach(function (r) { r && r.dispose(); }); } tk3Post(); if (TK3.cam) tk3Aspect(); }
function dd3Render(t, w, h) { const st = TK3.st, sc = TK3.list[DD3.idx], dt = Math.min(.05, Math.max(0, t - DD3.prev)), t0 = performance.now(); DD3.prev = t;
    sc.update(st, t, dt); for (let i = 0; i < TK3.parts.length; i++) TK3.parts[i].update(dt); if (TK3.sky) { TK3.sky.position.copy(TK3.cam.position); TK3.sky.userData.u.time.value = t; TK3.sky.userData.u.flash.value = DD3.flash * .6; } if (TK3.water) { TK3.water.userData.u.time.value = t; TK3.water.userData.u.flash.value = DD3.flash * .4; }
    if (TK3.shake > 0) { TK3.cam.position.x += (Math.random() - .5) * TK3.shake; TK3.cam.position.y += (Math.random() - .5) * TK3.shake; TK3.shake *= Math.pow(.03, dt); }
    TK3.fade = 1; dd3Size(w, h); tk3Render(t); const ms = performance.now() - t0; DD3.ms = DD3.ms * .9 + ms * .1; if (t > 2 && DD3.ms > 45 && DD3.q > .5) { DD3.q = Math.max(.5, DD3.q * .85); DD3.ms = 30; }
    return { flash: DD3.flash }; }
function dd3Begin() { DD3.err = null; DD3.prev = 0; DD3.flash = 0; DD3.q = 1; if (TK3.failed) { DD3.state = 'off'; return; } DD3.state = 'loading'; DD3.loadAt = performance.now();
    const build = function () { if (DD3.state !== 'loading') return; try { if (!tk3Init(null)) throw new Error('no WebGL'); tk3Build(DD3.idx); TK3.W = 0; DD3.state = 'on'; } catch (e) { DD3.err = e; DD3.state = 'off'; try { tk3Clear(); TK3.cur = -1; } catch (x) {} } };
    if (window.THREE) setTimeout(build, 30); else tk3Load(function (ok) { if (ok) build(); else DD3.state = 'off'; }); }
function dd3End() { if (DD3.state === 'on' || DD3.state === 'loading') { try { if (TK3.cur === DD3.idx) { tk3Clear(); TK3.cur = -1; } } catch (e) {} } if (DD3.saved) DDGL.cv = DD3.saved; DD3.saved = null; DD3.state = 'off'; }
(function () {
    const _dd = drawDDayCutscene; drawDDayCutscene = function (now) { if (!campaignCutsceneRunning) return _dd.apply(this, arguments);
        const t = (now - campaignCutsceneStart) / 1000; if (t < .05 && DD3.state === 'off' && !DD3.ran) { DD3.ran = true; dd3Begin(); }
        if (DD3.state === 'loading') { if (performance.now() - DD3.loadAt > 9000) DD3.state = 'off'; else { const w = canvas.width, h = canvas.height; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = 'rgba(239,230,198,.55)'; ctx.font = '13px "Special Elite", monospace'; ctx.textAlign = 'center'; ctx.fillText('LOADING…', w / 2, h / 2); campaignCutsceneStart = now; campaignCutsceneFrame = requestAnimationFrame(drawDDayCutscene); return; } }
        return _dd.apply(this, arguments); };
    const _gi = ddgInit; ddgInit = function (w, h) { if (DD3.state === 'on' && campaignCutsceneRunning) return true; return _gi.apply(this, arguments); };
    const _gr = ddglRender; ddglRender = function (t, w, h) { if (DD3.state === 'on' && campaignCutsceneRunning) { try { const S = dd3Render(t, w, h); if (!DD3.saved) DD3.saved = DDGL.cv; DDGL.cv = TK3.cv; return S; } catch (e) { DD3.err = e; dd3End(); } } return _gr.apply(this, arguments); };
    const _fin = finishCampaignCutscene; finishCampaignCutscene = function () { dd3End(); DD3.ran = false; return _fin.apply(this, arguments); };
})();
