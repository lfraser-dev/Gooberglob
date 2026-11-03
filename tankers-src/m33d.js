/* =====================================================
   CAMPAIGN MISSION 3 (HOLD THE BRIDGE) in 3D.
   Like mission 2 the 2D mission keeps its fixed 1100 x 700 coordinates and the 3D view is drawn at 0.2 m per
   pixel: a 220 x 140 m stretch of river at dusk, in the rain, with the German armour coming over the north bank.
   - `m33Build` (from sk3BuildWorld): the river (real water at y = 0, banks 2.4 m above it), the long stone bridge
     with arches, cutwaters, parapets and lamps, roads up both banks, the ruined and burning farmhouses, the copses,
     the hedges and sandbag barricades of the 2D map, craters, and a burning village on the far ridge.
   - `m33H` is what the game stands on: the deck over the bridge, the water surface over the river (so shells and
     blasts land on the water), the terrain everywhere else.
   - E (airstrike) opens the battle map; click and a flight of fighter-bombers sweeps north along the line, bombing
     it (the 2D mission's own SUP strike does the damage; the planes are flown over the same line in 3D).
   - HUD: "first wave in", the wave / breakthrough banners and the airstrike recharge.
===================================================== */
const M33D = { want: true, on: false, S: .2, err: null, st: null, DECK: 2.5 };
function m33Sm(a, b, v) { const k = Math.max(0, Math.min(1, (v - a) / (b - a))); return k * k * (3 - 2 * k); }
const M33_CRATERS = [[470, 120], [650, 90], [300, 160], [820, 130], [350, 150], [470, 560], [640, 600], [380, 620], [760, 650], [950, 560], [560, 160], [530, 590]];
function m33RoadX(py) { return 550 + Math.sin(py * .011) * 18; }
// visual ground (pixel coords in, metres out): banks ~2.4 m above the water, the riverbed below it
function m33HPx(px, py) { const R = M3_RIVER, e = Math.min(py - R.y0, R.y1 - py), dist = Math.max(0, -e), far = m33Sm(10, 140, dist);
    let h = 2.4 + (tk3Fbm(px * .006, py * .006, 3) - .45) * 1.6 * far + m33Sm(80, -320, py) * 6 + m33Sm(640, 1000, py) * 2.5;
    for (let i = 0; i < M33_CRATERS.length; i++) { const c = M33_CRATERS[i], d = Math.hypot(px - c[0], py - c[1]); if (d < 22) h -= (1 - d / 22) * .7; }
    const k = m33Sm(-14, 18, e); return h * (1 - k) - 2.6 * k; }
function m33OnDeck(px, py) { const R = M3_RIVER; return px > R.bx0 - 4 && px < R.bx1 + 4 && py > R.y0 - 26 && py < R.y1 + 26; }
function m33H(x3, z3) { const px = x3 / SK3D.S + 550, py = z3 / SK3D.S + 350; if (m33OnDeck(px, py)) return M33D.DECK; return Math.max(.03, m33HPx(px, py)); }
function m33Build(st) { const S = TK3.scene, R = tk3Rand(303), RV = M3_RIVER, X = function (px) { return (px - 550) * SK3D.S; }, Z = function (py) { return (py - 350) * SK3D.S; }, D = M33D.DECK;
    st.map = 'river'; st.fires = st.fires || []; const sun = new THREE.Vector3(-.8, .12, -.35).normalize(); st.sun = sun; SK3D.tall = []; SK3D.mats = { plain: tk3Std('#ffffff', .9, 0, { vertexColors: true }), dark: tk3Std('#2e2a26', .95) };
    TK3.grade = { bloom: .34, expo: 1.02, sat: .82, con: 1.14, lift: [.016, .014, .02], th: 2.0, vig: .42, grain: .035, dirt: .06, tint: [1.05, .97, .95] }; TK3.sunDir = sun; TK3.rayK = .1; TK3.rayCol = tk3C('#ff9a5a');
    tk3Sky({ top: '#1c2230', hor: '#a86a4a', bot: '#3e3430', sunDir: sun, sunCol: '#ff9a5a', sunI: 1.5, glow: 1, glowCol: '#ff8040', cov: .86, cLit: '#b88468', cDark: '#262832', cScale: 1, wind: [.006, .002] }); tk3Fog('#4c4446', .0062);
    st.hgt = m33H;
    // river water (follows the camera; the banks hide it everywhere else)
    tk3Water({ deep: '#141e24', shal: '#3a4c50', skyH: '#8a7a74', skyT: '#3a4252', sunDir: sun, sunCol: '#ffa070', sunI: .7, amp: .07, len: 5, steep: .4, dir: 0, spread: .5, n: 6, shine: 110, foam: .12, chop: 1.5, size: 700, seg: 220 });
    // ground
    const cf = function (x, z, h, ny, c) { const px = x / SK3D.S + 550, py = z / SK3D.S + 350, n = tk3Noise(x * .07, z * .07); c.set(n > .5 ? '#465a2c' : '#50622f'); c.multiplyScalar(.82 + n * .28);
        if ((px < 140 && py < 130) || (px > 960 && py < 125) || (px < 120 && py > 560) || (px > 965 && py > 585)) { c.set(((px * .11 | 0) + (py > 300 ? 1 : 0)) % 2 ? '#6e5c3a' : '#7e6e40').multiplyScalar(.86 + n * .2); }
        if (py < RV.y0 || py > RV.y1) { const rd = Math.abs(px - m33RoadX(py)); if (rd < 36) c.lerp(tk3C('#6a5a40'), rd < 28 ? .9 : .5).multiplyScalar(.9 + n * .15); }
        for (let i = 0; i < M33_CRATERS.length; i++) { const q = M33_CRATERS[i], d = Math.hypot(px - q[0], py - q[1]); if (d < 26) c.lerp(tk3C(d < 14 ? '#1e1812' : '#3a2e20'), (1 - d / 26) * .9); }
        if (h < 1.6) c.lerp(tk3C('#3e3426'), Math.min(1, (1.6 - h) * .55)); if (h < .1) c.set('#2a2620'); if (ny < .85) c.lerp(tk3C('#4a3e2e'), .4); };
    const ground = new THREE.Mesh(tk3Terrain(560, 440, 280, 220, function (x, z) { return m33HPx(x / SK3D.S + 550, z / SK3D.S + 350); }, cf), tk3Std('#ffffff', .93, 0, { vertexColors: true })); ground.receiveShadow = true; S.add(ground);
    st.L = tk3Lights({ sky: '#7a86a8', ground: '#4a3a30', hemi: .9, dir: sun, dirCol: '#ffb488', dirI: 1.6, shadowSize: 46 }); st.L.dir.shadow.mapSize.set(2048, 2048); st.L.dir.shadow.camera.far = 400; st.L.dir.shadow.camera.updateProjectionMatrix();
    st.fill = new THREE.DirectionalLight(tk3C('#ffcaa0'), .4); S.add(st.fill); S.add(st.fill.target); const rim = new THREE.DirectionalLight(tk3C('#8090b8'), .35); rim.position.set(30, 25, 40); S.add(rim);
    // ---- the bridge ----
    const bt = sk3BrickTex(), stoneM = tk3Std('#b0a890', .94, 0, { map: bt }), stoneD = tk3Std('#8a8272', .95, 0, { map: bt }), deckM = tk3Std('#7e786a', .9), dark = tk3Std('#1a1814', .95);
    const x0 = X(RV.bx0), x1 = X(RV.bx1), zN = Z(RV.y0 - 24), zS = Z(RV.y1 + 24), L = zS - zN, W = x1 - x0, zc = (zN + zS) / 2;
    // deck: cobbles with tyre-worn middle
    const deckTex = tk3Canvas(512, 1024, function (g, w, h) { g.fillStyle = '#6e6a5e'; g.fillRect(0, 0, w, h); for (let r = 0; r < 96; r++) for (let k = 0; k < 44; k++) { const v = .78 + ((r * 31 + k * 17) % 13) / 40; g.fillStyle = 'rgb(' + (128 * v | 0) + ',' + (122 * v | 0) + ',' + (106 * v | 0) + ')'; g.fillRect(k * 11.6 + (r % 2) * 5.8 + 1, r * 10.7 + 1, 10, 9); }
        g.fillStyle = 'rgba(70,52,34,.32)'; g.fillRect(w * .28, 0, w * .44, h); g.fillStyle = 'rgba(20,16,10,.25)'; for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(((i * 97) % 400) + 56, (i * 173) % h, 14 + i % 3 * 8, 10 + i % 4 * 4, 0, 0, 7); g.fill(); }
        g.strokeStyle = 'rgba(230,220,170,.3)'; g.lineWidth = 5; g.setLineDash([60, 46]); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); });
    const deck = tk3Mesh(tk3Box(W, 1.4, L), [stoneD, stoneD, tk3Std('#ffffff', .88, 0, { map: deckTex }), stoneD, stoneD, stoneD], 0, D - .7, zc, S, true, true);
    // side walls with the arches cut out, piers with cutwaters
    const spans = 7, span = (Z(RV.y1) - Z(RV.y0)) / spans, piers = []; for (let i = 1; i < spans; i++) piers.push(Z(RV.y0) + span * i);
    const side = new THREE.Shape(); side.moveTo(-L / 2, -3); side.lineTo(L / 2, -3); side.lineTo(L / 2, D); side.lineTo(-L / 2, D); side.closePath();
    const zs = [Z(RV.y0)].concat(piers).concat([Z(RV.y1)]); for (let i = 0; i < zs.length - 1; i++) { const a = zs[i] + (i ? 1.3 : .4) - zc, b = zs[i + 1] - (i < zs.length - 2 ? 1.3 : .4) - zc, r = (b - a) / 2, sp = -.2, hole = new THREE.Path();
        hole.moveTo(a, -3.2); hole.lineTo(a, sp); hole.absarc((a + b) / 2, sp, r, Math.PI, 0, true); hole.lineTo(b, -3.2); hole.closePath(); side.holes.push(hole); }
    [-1, 1].forEach(function (sd) { const g = tk3BoxUV(new THREE.ExtrudeGeometry(side, { depth: 1.1, bevelEnabled: false, curveSegments: 10 }), .25); g.rotateY(Math.PI / 2); const m = tk3Mesh(g, stoneM, sd > 0 ? x1 - 1.1 : x0, 0, zc, S, true, true); });
    piers.forEach(function (z) { tk3Mesh(tk3Box(W - .4, 6, 2.6), stoneD, 0, -1.6, z, S, true, true); [-1, 1].forEach(function (sd) { const c = tk3Mesh(tk3BoxUV(new THREE.CylinderGeometry(1.84, 1.84, 6, 4), .3), stoneD, (sd > 0 ? x1 : x0) + sd * .2, -1.4, z, S, true, true); c.rotation.y = Math.PI / 4; c.scale.set(1, 1, .7); const cap = tk3Mesh(new THREE.ConeGeometry(1.84, 1.2, 4), stoneM, (sd > 0 ? x1 : x0) + sd * .2, 2.2, z, S, true); cap.rotation.y = Math.PI / 4; cap.scale.set(1, 1, .7); }); });
    // parapets on the strips the 2D map treats as water (the deck you can drive on is 14 px in from each edge)
    const pw = 14 * SK3D.S; [-1, 1].forEach(function (sd) { const px = sd < 0 ? x0 + pw / 2 : x1 - pw / 2; tk3Mesh(tk3BoxUV(tk3Box(pw, 1.1, L), .25), stoneM, px, D + .55, zc, S, true, true); tk3Mesh(tk3Box(pw + .3, .22, L + .3), stoneD, px, D + 1.2, zc, S, true, true);
        for (let i = 0; i < 4; i++) { const z = zN + 3 + R() * (L - 6); tk3Mesh(tk3Box(pw * .9, .6, 1 + R() * 1.4), dark, px, D + 1.05, z, S); } });
    // lamps along the parapets
    const lampM = tk3Std('#1e1e1c', .6, .5), glowM = new THREE.MeshBasicMaterial({ color: tk3C('#ffcf80') }); st.m33lamps = [];
    for (let py = RV.y0 - 18; py < RV.y1 + 10; py += 70) [x0 + pw / 2, x1 - pw / 2].forEach(function (x, i) { const z = Z(py), broken = R() < .25; tk3Mesh(tk3Cyl(.09, .14, 3.6, 8), lampM, x, D + 1.1 + 1.8, z, S, true); tk3Mesh(tk3Box(.7, .12, .12), lampM, x + (i ? -.3 : .3), D + 4.8, z, S);
        if (!broken) { const gl = tk3Mesh(tk3Sphere(.2, 10, 8), glowM, x + (i ? -.6 : .6), D + 4.6, z, S); st.m33lamps.push(gl); } });
    SK3D.tall.push([x0 - 1, zN, x1 + 1, zS, D + 5]);
    // ---- hedges, copses, sandbag barricades ----
    const blobs = [], blob = function (x, z, s) { const b = new THREE.IcosahedronGeometry(s, 1); tk3Xf(b, x, m33H(x, z) + s * .7, z, 0, R() * 3, 0, 1, .85 + R() * .3, 1); blobs.push(b); };
    const bags = [];
    obstacles.forEach(function (o) { if (o.type !== 'm2Hedge') return; const sand = o.x > 300 && o.x < 800;
        if (!sand) { for (let px = o.x + 6; px < o.x + o.width; px += 9) blob(X(px), Z(o.y + o.height / 2) + (R() - .5) * 1.4, 1.9 + R() * .8); return; }
        for (let r = 0; r < 3; r++) for (let px = o.x + 4 + (r % 2) * 4; px < o.x + o.width - 2; px += 8.5) { const b = tk3Box(1.55, .5, .95); const x = X(px), z = Z(o.y + o.height / 2) + (r === 2 ? 0 : (r - .5) * 1.2); tk3Xf(b, x, m33H(x, z) + .25 + (r === 2 ? .5 : 0), z, 0, (R() - .5) * .25, 0); bags.push(b); } });
    for (let px = -500; px < 1600; px += 12) [-430, 1120].forEach(function (py) { blob(X(px), Z(py + (R() - .5) * 30), 2.4 + R()); });
    const bm = tk3Merge(blobs); tk3Tint(bm, tk3C('#2e4420')); const hm = new THREE.Mesh(bm, tk3Std('#ffffff', .9, 0, { vertexColors: true })); hm.castShadow = hm.receiveShadow = true; S.add(hm);
    if (bags.length) tk3Mesh(tk3BoxUV(tk3Merge(bags), .4), tk3Std('#9a8a5c', .97), 0, 0, 0, S, true, true);
    const trees = [], tree = function (x, z, v, s) { const g = sk3BroadGeo(v); tk3Xf(g, 0, 0, 0, 0, R() * 6.28, 0, s, s, s); tk3Xf(g, x, m33H(x, z) - .2, z); trees.push(g); };
    obstacles.forEach(function (o) { if (o.type !== 'm2Trees') return; for (let i = 0; i < 6; i++) tree(X(o.x + 6 + R() * (o.width - 12)), Z(o.y + 6 + R() * (o.height - 12)), i % 6, 1.7 + R() * .5); });
    for (let i = 0; i < 40; i++) { const px = -400 + R() * 1900, py = -380 + R() * 1450; if ((px > -40 && px < 1140 && py > -40 && py < 740) || (py > RV.y0 - 30 && py < RV.y1 + 30)) continue; tree(X(px), Z(py), i % 6, 1.6 + R() * .8); }
    if (trees.length) { const tm = new THREE.Mesh(tk3Merge(trees), tk3Std('#ffffff', .9, 0, { vertexColors: true })); tm.castShadow = tm.receiveShadow = true; S.add(tm); }
    // reeds along both banks
    const reeds = []; for (let i = 0; i < 420; i++) { const px = -300 + R() * 1700, north = i % 2, py = north ? RV.y0 + 4 + R() * 10 : RV.y1 - 4 - R() * 10; if (px > RV.bx0 - 20 && px < RV.bx1 + 20) continue; const x = X(px), z = Z(py), h = .8 + R() * .9, g = new THREE.ConeGeometry(.05, h, 3); tk3Xf(g, x, Math.max(0, m33HPx(px, py)) + h / 2, z, (R() - .5) * .4, 0, (R() - .5) * .4); reeds.push(g); }
    if (reeds.length) tk3Mesh(tk3Merge(reeds), tk3Std('#5a6232', .9), 0, 0, 0, S);
    // ---- farmhouses: three burning ruins and one still standing ----
    const ruinM = tk3Std('#a49480', .94, 0, { map: bt }), stone = tk3Std('#a89a84', .95), tile = tk3Std('#7a3e2a', .85), wood = tk3Std('#4a3a2a', .92), win = tk3Std('#14120e', .5);
    obstacles.forEach(function (o, i) { if (o.type !== 'm2House') return; const w = o.width * SK3D.S, d = o.height * SK3D.S, x = X(o.x + o.width / 2), z = Z(o.y + o.height / 2), y = m33HPx(o.x + o.width / 2, o.y + o.height / 2) - .2, intact = o.x > 800 && o.y > 500;
        if (!intact) { const g = sk3Ruin(S, ruinM, SK3D.mats.dark, x, z, w - .4, d - .4, 7 + R() * 2, 0, R); if (g) g.position.y += y; st.fires.push([x + (R() - .5) * w * .3, y + 1, z + (R() - .5) * d * .3, 1.3 + R() * .6, 0, 1]); if (R() < .7) st.fires.push([x + (R() - .5) * w * .5, y + .8, z + (R() - .5) * d * .5, .9, 0, 1]); SK3D.tall.push([x - w / 2, z - d / 2, x + w / 2, z + d / 2, y + 8]); return; }
        const g = new THREE.Group(); g.position.set(x, y, z); S.add(g); const h = 7; tk3Mesh(tk3Box(w, h, d), stone, 0, h / 2, 0, g, true, true); const roof = new THREE.Mesh(sk3Prism(d + 1.2, 5, w + 1.2), tile); roof.rotation.y = Math.PI / 2; roof.position.set(0, h, 0); roof.castShadow = true; g.add(roof);
        for (let k = -2; k <= 2; k++) [-1, 1].forEach(function (s) { tk3Mesh(tk3Box(1.4, 1.8, .2), k === 1 && s < 0 ? tk3Std('#ffb060', .5, 0, { emissive: tk3C('#ff9a40'), emissiveIntensity: .8 }) : win, k * w / 5.5, h * .55, s * (d / 2 + .05), g); }); tk3Mesh(tk3Box(1.6, 3, .25), wood, 0, 1.5, d / 2 + .06, g);
        SK3D.tall.push([x - w / 2 - 1, z - d / 2 - 1, x + w / 2 + 1, z + d / 2 + 1, y + h + 4]); });
    // burnt-out wrecks pushed off the road (not solid in 2D, so kept flat and small: just hulks sunk in the verge)
    const wreckM = tk3Std('#24221c', .9, .3); [[255, 150, .3], [880, 150, -.5], [790, 660, .6], [290, 660, 0]].forEach(function (p) { const x = X(p[0]), z = Z(p[1]), y = m33H(x, z); const g = new THREE.Group(); g.position.set(x, y - .35, z); g.rotation.y = -p[2]; S.add(g); tk3Mesh(tk3Box(5.6, 1.1, 3.1), wreckM, 0, .5, 0, g, true, true); tk3Mesh(tk3Box(2.4, .7, 2), wreckM, -.3, 1.3, 0, g, true); const b = tk3Mesh(tk3Cyl(.09, .1, 3, 6), wreckM, 1.8, 1.4, 0, g); b.rotation.z = Math.PI / 2 - .25; st.fires.push([x, y + .9, z, .5, 0, 1]); });
    // ---- the burning village on the far ridge ----
    for (let i = 0; i < 9; i++) { const px = 120 + i * 110 + (R() - .5) * 50, py = -230 - R() * 140, x = X(px), z = Z(py), y = m33HPx(px, py), w = 7 + R() * 5, d = 6 + R() * 4; if (R() < .55) { const g = sk3Ruin(S, ruinM, SK3D.mats.dark, x, z, w, d, 6 + R() * 3, R() * .4, R); if (g) g.position.y += y; st.fires.push([x, y + 1.5, z, 1.6 + R(), 0, 1]); }
        else { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = R() * .4; S.add(g); tk3Mesh(tk3Box(w, 6, d), stone, 0, 3, 0, g, true); const rf = new THREE.Mesh(sk3Prism(d + 1, 4, w + 1), tile); rf.rotation.y = Math.PI / 2; rf.position.y = 6; g.add(rf); } }
    const ch = new THREE.Group(), cx = X(640), cz = Z(-330); ch.position.set(cx, m33HPx(640, -330), cz); S.add(ch); tk3Mesh(tk3Box(9, 10, 18), stone, 0, 5, 0, ch, true); tk3Mesh(tk3Box(5, 17, 5), stone, 0, 8.5, -10, ch, true); const spire = tk3Mesh(new THREE.ConeGeometry(3.4, 6, 4), tk3Std('#3e4448', .8), .6, 19.5, -10, ch, true); spire.rotation.set(0, Math.PI / 4, .3);
    st.fires.push([cx, ch.position.y + 10, cz - 3, 2.2, 0, 1]);
    st.m33glow = tk3PL('#ff7030', 2.2, 120, X(550), 14, Z(-300));
    st.m33planes = []; M33D.st = st; }
function m33Plane() { const fac = campaignRun && campaignRun.faction || selectedFaction; try { return fac === 'german' ? tk3Bf109() : tk3Spitfire(); } catch (e) { const g = new THREE.Group(); tk3Mesh(tk3Box(9, 1, 1), tk3Std('#4a5040', .6), 0, 0, 0, g); tk3Mesh(tk3Box(2, .2, 11), tk3Std('#4a5040', .6), .5, 0, 0, g); return g; } }
function m33Frame(st, t, dt) { if (TK3.water) { TK3.water.userData.u.time.value = t; try { tk3WaterFollow(TK3.cam); } catch (e) {} }
    if (st.m33lamps) st.m33lamps.forEach(function (l, i) { const f = .75 + .25 * Math.sin(t * 13 + i * 3) * Math.sin(t * 7 + i); l.scale.setScalar(f); });
    if (st.m33glow) st.m33glow.intensity = 2 + Math.sin(t * 3.1) * .4 + Math.sin(t * 7.3) * .3;
    // fighter-bombers flying the airstrike line
    const now = Date.now(), strikes = (typeof SUP !== 'undefined' ? SUP.strikes : []).filter(function (s) { return s.type === 'air'; }); let n = 0;
    strikes.forEach(function (s) { const el = now - s.t0, sp = (el - s.delay - 240) / s.dur * 1700 - 850; if (sp < -1500 || sp > 1500) return;
        [[0, 0], [-24, 40], [24, 40]].forEach(function (f) { let p = st.m33planes[n]; if (!p) { p = m33Plane(); p.scale.setScalar(1.2); TK3.scene.add(p); st.m33planes.push(p); } n++;
            const px = s.x + f[0], py = s.y + s.dir * sp + f[1], x = (px - 550) * SK3D.S, z = (py - 350) * SK3D.S; p.visible = true; p.position.set(x, 24 + f[1] * .05 + Math.sin(t * 2 + f[0]) * .4, z); p.rotation.set(Math.sin(t * 1.3 + f[0]) * .08, s.dir < 0 ? Math.PI / 2 : -Math.PI / 2, 0);
            if (p.userData.prop) p.userData.prop.rotation.x += dt * 60; }); });
    for (let i = n; i < st.m33planes.length; i++) st.m33planes[i].visible = false;
    if (n && !st.m33roar) { st.m33roar = true; try { playTone(90, 60, 2.6, .05, 'sawtooth'); } catch (e) {} } if (!n) st.m33roar = false; }
function m33Hud() { if (!M33D.on || !SK3D.hud || SK3D.map) return; const g = SK3D.hud.getContext('2d'), now = Date.now();
    g.save(); g.textAlign = 'center';
    if (now < M3.prepUntil) { const s = 'FIRST WAVE IN ' + Math.ceil((M3.prepUntil - now) / 1000); g.font = 'bold 26px "Black Ops One", Impact, monospace'; g.lineWidth = 5; g.strokeStyle = 'rgba(0,0,0,.8)'; g.strokeText(s, 550, 250); g.fillStyle = '#ffe2a8'; g.fillText(s, 550, 250);
        g.font = 'bold 13px "Special Elite", monospace'; g.fillStyle = 'rgba(255,240,210,.85)'; g.fillText('TAKE POSITION ON THE BRIDGE — NOTHING CROSSES', 550, 274); }
    if (now < M3.bannerUntil) { const el = M3.bannerUntil - now; g.globalAlpha = Math.max(0, Math.min(1, el / 400)); g.fillStyle = 'rgba(10,8,4,.72)'; g.fillRect(0, 280, 1100, 54); g.font = 'bold 30px "Black Ops One", Impact, monospace'; g.lineWidth = 5; g.strokeStyle = '#000'; g.strokeText(M3.bannerText, 550, 318); g.fillStyle = M3.won ? '#a8e88a' : '#ff8a5a'; g.fillText(M3.bannerText, 550, 318); g.globalAlpha = 1; }
    // markers over the tanks of the wave that just came over the ridge
    if (M3.wave && now - M3.wave.at < 6000 && TK3.cam) { const v = new THREE.Vector3(), fl = .45 + .55 * Math.abs(Math.sin(now / 140)); g.font = 'bold 18px monospace'; g.fillStyle = 'rgba(255,80,50,' + fl + ')';
        enemies.forEach(function (e) { if (e.destroyed || !e.m3 || now - e.m3.born > 6000) return; v.set((e.x - 550) * SK3D.S, m33H((e.x - 550) * SK3D.S, (e.y - 350) * SK3D.S) + 5.5, (e.y - 350) * SK3D.S).project(TK3.cam); if (v.z >= 1) return; g.fillText('▼', Math.max(20, Math.min(1080, (v.x + 1) * 550)), Math.max(60, Math.min(660, (1 - v.y) * 350))); }); }
    const left = Math.max(0, SUP.cd - now); g.font = 'bold 11px "Special Elite", monospace'; g.textAlign = 'left'; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(12, 576, 170, 20); g.fillStyle = left ? '#a8a090' : '#9ad0ff'; g.fillText('E AIRSTRIKE ' + (left ? Math.ceil(left / 1000) + 's' : 'READY'), 18, 590);
    g.restore(); }
function m33Stop() { if (!M33D.on) return; M33D.on = false; M33D.st = null; try { if (SK3D.on) sk3Stop(); } catch (e) {} SK3D.want = false; SK3D.S = .1; SKIRMISH_WORLD_WIDTH = 2400; SKIRMISH_WORLD_HEIGHT = 1500; }
(function () {
    const _scm = startCampaignMission; startCampaignMission = function () { m33Stop(); const go = selectedGameMode === 'campaign' && campaignMission === 3 && M33D.want && window.THREE && !TK3.failed; if (go) { M33D.on = true; SK3D.want = true; SK3D.S = M33D.S; }
        const r = _scm.apply(this, arguments); if (M33D.on) { try { sk3Start(); if (!SK3D.on) throw new Error('3D did not start'); setTimeout(function () { try { if (M33D.on) showRadioText('3D — E AIRSTRIKE (CLICK THE MAP) · R REPAIR · 1/2/3 AMMO · Q MG · G ARTILLERY · B BINOCULARS', true); } catch (e) {} }, 7600); } catch (e) { M33D.err = e; m33Stop(); } } return r; };
    const _ap = applyPointControlCanvasSize; applyPointControlCanvasSize = function () { const r = _ap.apply(this, arguments); if (M33D.on && selectedGameMode === 'campaign' && campaignMission === 3) { SKIRMISH_WORLD_WIDTH = canvas.width; SKIRMISH_WORLD_HEIGHT = canvas.height; SK3D.S = M33D.S; } return r; };
    ['startCampaignLanding', 'openCampaign', 'startMission2', 'startMission3', 'startMission4', 'returnToMenu'].forEach(function (n) { if (typeof window[n] !== 'function') return; const f = window[n]; window[n] = function () { m33Stop(); return f.apply(this, arguments); }; });
    const _tod = sk3Tod, _wx = sk3Wx; sk3Tod = function () { return M33D.on ? 'dusk' : _tod(); }; sk3Wx = function () { return M33D.on ? 'rain' : _wx(); };
    const _ts = getTankSpeed; getTankSpeed = function (t) { const v = _ts.apply(this, arguments); return M33D.on ? v * .7 : v; };
    const sc = TK3.list[SK3D.idx], _up = sc.update; sc.update = function (st, t, dt) { const r = _up.apply(this, arguments); if (M33D.on) try { m33Frame(st, t, dt); } catch (e) { M33D.err = e; } return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { m33Hud(); } catch (e) { M33D.err = e; } return r; };
    // E: airstrike aimed on the battle map (m23d's sk3ACall hook turns the click into the 2D strike)
    const _sk = m2SupportKey; m2SupportKey = function () { if (!(M33D.on && SK3D.on)) return _sk.apply(this, arguments); if (!M2.active || !gameRunning || !player || player.destroyed) return; const left = SUP.cd - Date.now(); if (left > 0) { showRadioText('SUPPORT RE-ARMING — ' + Math.ceil(left / 1000) + 'S.'); return; } SK3A.m2sup = true; SK3A.title = 'AIRSTRIKE — CLICK THE TARGET (THE BOMBERS FLY NORTH OVER IT)'; sk3AOpen(true); };
})();
