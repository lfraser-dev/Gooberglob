/* =====================================================
   CAMPAIGN MISSION 2 (PUSH INLAND) in 3D.
   The 2D mission is built on fixed 1100 x 700 coordinates, so instead of enlarging the battlefield the 3D view is
   drawn at 0.2 m per game pixel (SK3D.S, normally 0.1): a 220 x 140 m Normandy farm on a low ridge.
   - `m23Build` (from sk3BuildWorld): fields and a lane up the middle, the two hedgerows with the gap, copses,
     the stone farmhouse and barn (solid, as in 2D), the two 88 mm flak guns in sandbag pits on the ridge with
     their crews (they track you, and turn into burning wrecks when the 2D gun is destroyed), bocage all round.
   - E (naval barrage) opens the battle map; click to bring the battleship's shells down there (the 2D mission's
     own SUP strike does the damage). G artillery, ammo types, MG, binoculars all work as in 3D skirmish.
   - HUD: AA gun names with health bars.
===================================================== */
const M23D = { want: true, on: false, S: .2, err: null, st: null };
function sk3CampaignOn() { return (typeof M13D !== 'undefined' && M13D.on) || M23D.on || (typeof M33D !== 'undefined' && M33D.on); }
function m23HPx(x, y) { const sm = function (a, b, v) { const k = Math.max(0, Math.min(1, (v - a) / (b - a))); return k * k * (3 - 2 * k); }; return sm(430, 140, y) * 9 + (tk3Fbm(x * .006, y * .006, 3) - .44) * 2.2 - sm(560, 900, y) * 1.5 + sm(-60, -400, y) * 4; }
function m23H(x3, z3) { return m23HPx(x3 / SK3D.S + 550, z3 / SK3D.S + 350); }
function m23Build(st) { const S = TK3.scene, R = tk3Rand(77), X = function (px) { return (px - 550) * SK3D.S; }, Z = function (py) { return (py - 350) * SK3D.S; };
    st.map = 'farm'; const sun = new THREE.Vector3(-.55, .4, .45).normalize(); st.sun = sun; SK3D.tall = []; SK3D.mats = { plain: tk3Std('#ffffff', .9, 0, { vertexColors: true }), dark: tk3Std('#2e2a26', .95) };
    TK3.grade = { bloom: .2, expo: .9, sat: .88, con: 1.1, lift: [.012, .012, .014], th: 2.3, vig: .3, grain: .025, dirt: .05, tint: [1.04, 1, .94] }; TK3.sunDir = sun; TK3.rayK = .16; TK3.rayCol = tk3C('#ffe0b0');
    tk3Sky({ top: '#4e6c92', hor: '#e8d0a8', bot: '#8a7a60', sunDir: sun, sunCol: '#ffe0b0', sunI: 2.4, glow: .8, glowCol: '#ffc080', cov: .5, cLit: '#ffeedd', cDark: '#7a7e8c', cScale: 1.1, wind: [.004, .001] }); tk3Fog('#c4b8a0', .0035);
    st.hgt = m23H;
    const crop = ['#b9a552', '#6e8a3a', '#8a7448', '#a8a050', '#5e7a34'];
    const cf = function (x, z, h, ny, c) { const px = x / SK3D.S + 550, py = z / SK3D.S + 350, n = tk3Noise(x * .07, z * .07); if (py > 420) { const k = (Math.floor((px + 600) / 270) * 3 + Math.floor((py + 600) / 240)) % 5; c.set(crop[k]); if (k === 0 || k === 3) c.multiplyScalar(.9 + .12 * Math.sin(px * .7)); } else c.set(n > .5 ? '#5e7a32' : '#6a843a');
        c.multiplyScalar(.86 + n * .26); if (Math.abs(px - 550 - Math.sin(py * .01) * 12) < 22 && py > 200) c.set('#8a7a5c').multiplyScalar(.9 + n * .15); if (ny < .9) c.lerp(tk3C('#6a6048'), .3); };
    const ground = new THREE.Mesh(tk3Terrain(420, 320, 210, 160, m23H, cf), tk3Std('#ffffff', .95, 0, { vertexColors: true })); ground.receiveShadow = true; S.add(ground);
    st.L = tk3Lights({ sky: '#a8b8d0', ground: '#7a6a50', hemi: .95, dir: sun, dirCol: '#ffe0b8', dirI: 2.3, shadowSize: 42 }); st.L.dir.shadow.mapSize.set(2048, 2048); st.L.dir.shadow.camera.far = 400; st.L.dir.shadow.camera.updateProjectionMatrix();
    const rim = new THREE.DirectionalLight(tk3C('#9aaccc'), .4); rim.position.set(-sun.x * 50, 25, -sun.z * 50); S.add(rim); st.fill = new THREE.DirectionalLight(tk3C('#fff2e0'), .5); S.add(st.fill); S.add(st.fill.target);
    // hedgerows (the 2D hedges) and bocage round the edges
    const blobs = [], blob = function (x, z, s) { const b = new THREE.IcosahedronGeometry(s, 1); tk3Xf(b, x, m23H(x, z) + s * .75, z, 0, R() * 3, 0, 1, .85 + R() * .3, 1); blobs.push(b); };
    obstacles.forEach(function (o) { if (o.type !== 'm2Hedge') return; for (let px = o.x + 6; px < o.x + o.width; px += 9) blob(X(px), Z(o.y + o.height / 2) + (R() - .5) * 1.5, 2 + R() * .9); });
    for (let px = -200; px < 1300; px += 11) { [-260, 980].forEach(function (py) { blob(X(px), Z(py + (R() - .5) * 30), 2.4 + R()); }); } for (let py = -250; py < 980; py += 11) [-220, 1320].forEach(function (px) { blob(X(px + (R() - .5) * 30), Z(py), 2.4 + R()); });
    const bm = tk3Merge(blobs); tk3Tint(bm, tk3C('#3e5a28')); const hedges = new THREE.Mesh(bm, tk3Std('#ffffff', .9, 0, { vertexColors: true })); hedges.castShadow = true; hedges.receiveShadow = true; S.add(hedges);
    // copses (the 2D tree clumps) + a few field trees
    const trees = []; const tree = function (x, z, v, s) { const g = sk3BroadGeo(v); tk3Xf(g, 0, 0, 0, 0, R() * 6.28, 0, s, s, s); tk3Xf(g, x, m23H(x, z) - .2, z); trees.push(g); };
    obstacles.forEach(function (o) { if (o.type !== 'm2Trees') return; for (let i = 0; i < 6; i++) tree(X(o.x + R() * o.width), Z(o.y + R() * o.height), i % 6, 1.8 + R() * .5); });
    for (let i = 0; i < 26; i++) { const px = -150 + R() * 1400, py = -200 + R() * 1100; if (px > -20 && px < 1120 && py > -20 && py < 720 && R() < .8) continue; tree(X(px), Z(py), i % 6, 1.7 + R() * .7); }
    if (trees.length) { const tm = new THREE.Mesh(tk3Merge(trees), tk3Std('#ffffff', .9, 0, { vertexColors: true })); tm.castShadow = true; tm.receiveShadow = true; S.add(tm); }
    // the farmhouse and barn (solid in 2D)
    const stone = tk3Std('#b0a28a', .95), wood = tk3Std('#6a5038', .92), tile = tk3Std('#8a4a32', .85), slate = tk3Std('#4a4a4e', .8), win = tk3Std('#14120e', .5);
    obstacles.forEach(function (o, i) { if (o.type !== 'm2House') return; const w = o.width * SK3D.S, d = o.height * SK3D.S, x = X(o.x + o.width / 2), z = Z(o.y + o.height / 2), y = m23H(x, z) - .3, barn = w < 25, h = barn ? 5.5 : 7.5, g = new THREE.Group(); g.position.set(x, y, z); S.add(g);
        tk3Mesh(tk3Box(w, h, d), barn ? wood : stone, 0, h / 2, 0, g, true, true); const roof = new THREE.Mesh(sk3Prism(d + 1.2, barn ? 4 : 5.5, w + 1.2), barn ? slate : tile); roof.rotation.y = Math.PI / 2; roof.position.set(0, h, 0); roof.castShadow = true; g.add(roof);
        if (!barn) { for (let k = -2; k <= 2; k++) [-1, 1].forEach(function (s) { tk3Mesh(tk3Box(1.4, 1.8, .2), win, k * w / 5.5, h * .55, s * (d / 2 + .05), g); }); tk3Mesh(tk3Box(1.6, 3, .25), wood, 0, 1.5, d / 2 + .06, g); tk3Mesh(tk3Box(1.4, 3.5, 1.4), stone, w * .3, h + 2.6, 0, g, true); }
        else tk3Mesh(tk3Box(5, 4.2, .25), tk3Std('#3a2a1c', .9), 0, 2.1, d / 2 + .06, g);
        SK3D.tall.push([x - w / 2 - 1, z - d / 2 - 1, x + w / 2 + 1, z + d / 2 + 1, y + h + 4]); });
    // the 88s on the ridge
    const mat = { gun: tk3Std('#4e5240', .65, .4), dark: tk3Std('#1c1c16', .8, .4), sand: tk3Std('#9a8a62', .97) };
    st.m23a = M2.aa.map(function (a) { const x = X(a.x), z = Z(a.y), y = m23H(x, z), g = m2c3Flak(mat); g.position.set(x, y - .2, z); S.add(g);
        const ring = []; for (let k = 0; k < 22; k++) { const an = k / 22 * Math.PI * 2, b = tk3Box(1.5, .75, .8); tk3Xf(b, x + Math.cos(an) * 6.2, m23H(x + Math.cos(an) * 6.2, z + Math.sin(an) * 6.2) + .35, z + Math.sin(an) * 6.2, 0, -an, 0); ring.push(b); } tk3Mesh(tk3Merge(ring), mat.sand, 0, 0, 0, S, true, true);
        const crew = []; for (let k = 0; k < 3; k++) { const m = tk3Man({ gun: false, cap: 'helmet', col: '#5a6050', helmCol: '#4a5048' }), an = 2 + k * 1.1; m.g.position.set(x + Math.cos(an) * 3.2, y, z + Math.sin(an) * 3.2); m.g.rotation.y = -an + Math.PI; tk3Pose2(m, [k === 1 ? 'kneel' : 'stand']); S.add(m.g); crew.push(m); }
        const ruin = new THREE.Group(); ruin.visible = false; S.add(ruin); for (let k = 0; k < 8; k++) { const c = tk3Mesh(tk3Box(.8 + R() * 1.6, .3 + R() * .6, .5 + R()), mat.gun, x + (R() - .5) * 7, y + .3, z + (R() - .5) * 7, ruin, true); c.rotation.set(R(), R() * 3, R()); } const bb = tk3Mesh(tk3Cyl(.1, .14, 6, 8), mat.dark, x + 1, y + .5, z, ruin, true); bb.rotation.set(.3, .4, 1.4);
        return { a: a, g: g, crew: crew, ruin: ruin, dead: false, top: new THREE.Vector3(x, y + 6, z) }; });
    // a church spire and farm smoke on the horizon
    const ch = new THREE.Group(); ch.position.set(X(820), m23H(X(820), Z(-420)), Z(-420)); S.add(ch); tk3Mesh(tk3Box(8, 9, 16), stone, 0, 4.5, 0, ch, true); tk3Mesh(tk3Box(5, 16, 5), stone, 0, 8, -9, ch, true); tk3Mesh(new THREE.ConeGeometry(3.4, 9, 4), slate, 0, 20.5, -9, ch, true).rotation.y = Math.PI / 4;
    st.fires = st.fires || []; M23D.st = st; }
function m23Frame(st, t, dt) { if (!st.m23a) return; st.m23a.forEach(function (q, i) { const a = q.a; if (a.destroyed) { if (!q.dead) { q.dead = true; q.g.visible = false; q.crew.forEach(function (m) { m.g.rotation.z = -1.4; m.g.position.y -= .2; }); q.ruin.visible = true; st.fires.push([q.top.x, q.top.y - 5.5, q.top.z, 1.6, 1, 1]); } return; }
        const top = q.g.userData.top, el = q.g.userData.el; top.rotation.y = -(a.ang || 0); el.rotation.z = M2.alerted ? .08 + Math.sin(t * .7 + i) * .03 : .7 + Math.sin(t * .4 + i) * .1; });
    if (M2.alerted && t > (st.m23nf || 0)) { st.m23nf = t + 2.5 + Math.random() * 2; const live = st.m23a.filter(function (q) { return !q.a.destroyed; }); const q = live[(Math.random() * live.length) | 0]; if (q) { try { m2c3Muzzle(st, { g: q.g }, .9); } catch (e) {} } } }
function m23Hud() { if (!M23D.on || !SK3D.hud || !TK3.cam || SK3D.map || !M23D.st || !M23D.st.m23a) return; const g = SK3D.hud.getContext('2d'), v = new THREE.Vector3();
    M23D.st.m23a.forEach(function (q) { if (q.a.destroyed) return; v.copy(q.top).project(TK3.cam); if (v.z >= 1) return; const x = Math.max(60, Math.min(1040, (v.x + 1) * 550)), y = Math.max(70, Math.min(640, (1 - v.y) * 350)), k = q.a.hp / q.a.maxHp;
        g.textAlign = 'center'; g.font = 'bold 12px "Special Elite", monospace'; g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x - 52, y - 30, 104, 30); g.fillStyle = '#ffb070'; g.fillText('◆ ' + q.a.name, x, y - 17); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(x - 44, y - 11, 88, 6); g.fillStyle = k > .5 ? '#ffb070' : '#ff6a4a'; g.fillRect(x - 44, y - 11, 88 * k, 6); });
    const left = Math.max(0, SUP.cd - Date.now()); g.font = 'bold 11px "Special Elite", monospace'; g.textAlign = 'left'; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(12, 576, 170, 20); g.fillStyle = left ? '#a8a090' : '#9ad0ff'; g.fillText('E NAVAL BARRAGE ' + (left ? Math.ceil(left / 1000) + 's' : 'READY'), 18, 590); }
function m23Stop() { if (!M23D.on) return; M23D.on = false; M23D.st = null; try { if (SK3D.on) sk3Stop(); } catch (e) {} SK3D.want = false; SK3D.S = .1; SKIRMISH_WORLD_WIDTH = 2400; SKIRMISH_WORLD_HEIGHT = 1500; }
(function () {
    const _scm = startCampaignMission; startCampaignMission = function () { m23Stop(); if (selectedGameMode === 'campaign' && campaignMission === 2 && M23D.want && window.THREE && !TK3.failed) { M23D.on = true; SK3D.want = true; SK3D.S = M23D.S; }
        const r = _scm.apply(this, arguments); if (M23D.on) { try { sk3Start(); setTimeout(function () { try { showRadioText('3D — E NAVAL BARRAGE (CLICK THE MAP) · R REPAIR · 1/2/3 AMMO · Q MG · G ARTILLERY · B BINOCULARS', true); } catch (e) {} }, 5200); } catch (e) { M23D.err = e; m23Stop(); } } return r; };
    const _ap = applyPointControlCanvasSize; applyPointControlCanvasSize = function () { const r = _ap.apply(this, arguments); if (M23D.on && selectedGameMode === 'campaign' && campaignMission === 2) { SKIRMISH_WORLD_WIDTH = canvas.width; SKIRMISH_WORLD_HEIGHT = canvas.height; SK3D.S = M23D.S; } return r; };
    ['startCampaignLanding', 'openCampaign', 'startMission2', 'returnToMenu'].forEach(function (n) { if (typeof window[n] !== 'function') return; const f = window[n]; window[n] = function () { m23Stop(); return f.apply(this, arguments); }; });
    if (typeof startMission3 === 'function') { const f3 = startMission3; startMission3 = function () { m23Stop(); return f3.apply(this, arguments); }; }
    const _tod = sk3Tod, _wx = sk3Wx; sk3Tod = function () { return M23D.on ? 'day' : _tod(); }; sk3Wx = function () { return M23D.on ? 'clear' : _wx(); };
    // the map is drawn at 0.2 m per pixel, so slow the tanks a little more to keep real-life speeds
    const _ts = getTankSpeed; getTankSpeed = function (t) { const v = _ts.apply(this, arguments); return M23D.on ? v * .7 : v; };
    const sc = TK3.list[SK3D.idx], _up = sc.update; sc.update = function (st, t, dt) { const r = _up.apply(this, arguments); if (M23D.on) try { m23Frame(st, t, dt); } catch (e) { M23D.err = e; } return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { m23Hud(); } catch (e) {} return r; };
    // E: naval barrage, aimed on the battle map
    const _sk = m2SupportKey; m2SupportKey = function () { if (!(M23D.on && SK3D.on)) return _sk.apply(this, arguments); if (!M2.active || !gameRunning || !player || player.destroyed) return; const left = SUP.cd - Date.now(); if (left > 0) { showRadioText('SUPPORT RE-ARMING — ' + Math.ceil(left / 1000) + 'S.'); return; } SK3A.m2sup = true; SK3A.title = 'NAVAL BARRAGE — CLICK THE TARGET'; sk3AOpen(true); };
    const _call = sk3ACall; sk3ACall = function () { if (!SK3A.m2sup) return _call.apply(this, arguments); const g = sk3AGround(SK3A.mx, SK3A.my); if (!g) return; SK3A.m2sup = false; SK3A.title = null; mouse.x = Math.max(30, Math.min(canvas.width - 30, g.x)); mouse.y = Math.max(30, Math.min(canvas.height - 30, g.y)); SUP.mode = 'target'; m2CallSupport(); setTimeout(function () { sk3AOpen(false); }, 600); };
    const _ao = sk3AOpen; sk3AOpen = function (on) { if (!on) { SK3A.m2sup = false; SK3A.title = null; } return _ao.apply(this, arguments); };
})();
