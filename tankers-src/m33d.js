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
const M33_CRATERS = [[470, 120], [650, 90], [300, 160], [820, 130], [350, 150], [470, 560], [640, 600], [380, 620], [760, 650], [950, 560], [560, 160], [530, 590], [200, 600], [1000, 640], [120, 180]];
// cover on the bridge deck (3D only): a knocked-out Panzer IV, a burnt-out Opel truck, a sandbagged gun pit
const M33_COVER = [[591, 282, 18, 36, 'm33Wreck', 'panzer'], [472, 230, 16, 38, 'm33Wreck', 'truck'], [452, 412, 44, 32, 'm33Bags', 'nest']];
function m33RoadX(py) { return 550 + Math.sin(py * .011) * 18; }
function m33Quay(px) { const R = M3_RIVER; return px > R.bx0 - 170 && px < R.bx1 + 170; }
// visual ground (pixel coords in, metres out): banks ~2.4 m above the water, stone quays either side of the bridge, the riverbed below
function m33HPx(px, py) { const R = M3_RIVER, e = Math.min(py - R.y0, R.y1 - py), dist = Math.max(0, -e), far = m33Sm(10, 140, dist);
    let h = 2.4 + (tk3Fbm(px * .006, py * .006, 3) - .45) * 1.6 * far + m33Sm(80, -320, py) * 6 + m33Sm(640, 1000, py) * 2.5;
    for (let i = 0; i < M33_CRATERS.length; i++) { const c = M33_CRATERS[i], d = Math.hypot(px - c[0], py - c[1]); if (d < 22) h -= (1 - d / 22) * .9; else if (d < 30) h += (1 - (d - 22) / 8) * .15; }
    const k = m33Quay(px) ? m33Sm(3, 7, e) : m33Sm(-14, 18, e); return h * (1 - k) - 2.6 * k; }
function m33OnDeck(px, py) { const R = M3_RIVER; return px > R.bx0 - 4 && px < R.bx1 + 4 && py > R.y0 - 26 && py < R.y1 + 26; }
function m33H(x3, z3) { const px = x3 / SK3D.S + 550, py = z3 / SK3D.S + 350; if (m33OnDeck(px, py)) return M33D.DECK; return Math.max(.03, m33HPx(px, py)); }
// dressed limestone blocks, weathered: rain streaks, soot, moss low down
function m33StoneTex() { return tk3Canvas(512, 512, function (g, W, H) { const r = tk3Rand(33); g.fillStyle = '#58544c'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 32) { let x = -r() * 60; while (x < W) { const w = 50 + r() * 60, v = .78 + r() * .3, t = r(); g.fillStyle = 'rgb(' + Math.round(176 * v) + ',' + Math.round((168 + t * 6) * v) + ',' + Math.round(150 * v) + ')'; g.fillRect(x + 2, y + 2, w - 3, 29);
        const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, 'rgba(255,255,255,.08)'); gr.addColorStop(1, 'rgba(0,0,0,.14)'); g.fillStyle = gr; g.fillRect(x + 2, y + 2, w - 3, 29);
        for (let k = 0; k < 14; k++) { g.fillStyle = 'rgba(' + (r() < .5 ? '40,36,30' : '220,214,200') + ',' + (r() * .14) + ')'; g.fillRect(x + 2 + r() * (w - 6), y + 3 + r() * 26, 1 + r() * 4, 1 + r() * 3); } x += w; } }
    for (let i = 0; i < 70; i++) { const x = r() * W, l = 40 + r() * 200, gr = g.createLinearGradient(0, 0, 0, l); gr.addColorStop(0, 'rgba(30,28,24,' + (.08 + r() * .14) + ')'); gr.addColorStop(1, 'rgba(30,28,24,0)'); g.fillStyle = gr; g.fillRect(x, r() * H, 2 + r() * 7, l); }
    for (let i = 0; i < 26; i++) { const x = r() * W, y = r() * H, rr = 20 + r() * 70, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .5 ? 'rgba(60,72,40,.28)' : 'rgba(20,18,16,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); } }, { repeat: true }); }
function m33CobbleTex() { return tk3Canvas(512, 512, function (g, W, H) { const r = tk3Rand(71); g.fillStyle = '#2a2724'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 26) { const off = ((y / 26) % 2) * 17; for (let x = -34 + off; x < W + 34; x += 34) { const v = .62 + r() * .5, t = r(); g.fillStyle = 'rgb(' + Math.round((150 + t * 22) * v) + ',' + Math.round(144 * v) + ',' + Math.round((134 - t * 10) * v) + ')'; g.beginPath(); if (g.roundRect) g.roundRect(x + 2, y + 2, 30 + r() * 2, 22, 6); else g.rect(x + 2, y + 2, 30, 22); g.fill();
        const gr = g.createLinearGradient(x, y, x, y + 24); gr.addColorStop(0, 'rgba(255,250,235,.16)'); gr.addColorStop(1, 'rgba(0,0,0,.25)'); g.fillStyle = gr; g.fill(); } }
    for (let i = 0; i < 30; i++) { const x = r() * W, y = r() * H, rr = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, r() < .6 ? 'rgba(30,24,18,.3)' : 'rgba(90,70,48,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); } }, { repeat: true }); }
function m33ScorchTex() { return tk3Canvas(256, 256, function (g, W, H) { const r = tk3Rand(5); for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = r() * 60, x = 128 + Math.cos(a) * d, y = 128 + Math.sin(a) * d, rr = 30 + r() * 50, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(12,10,8,.5)'); gr.addColorStop(1, 'rgba(12,10,8,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    for (let i = 0; i < 40; i++) { const a = r() * 6.28, l = 40 + r() * 80; g.strokeStyle = 'rgba(10,8,6,' + (.2 + r() * .3) + ')'; g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(128 + Math.cos(a) * 20, 128 + Math.sin(a) * 20); g.lineTo(128 + Math.cos(a) * l, 128 + Math.sin(a) * l); g.stroke(); } }); }
function m33SignTex() { return tk3Canvas(256, 128, function (g, W, H) { g.fillStyle = '#d8d0b8'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a1814'; g.font = 'bold 44px "Black Ops One", Impact, sans-serif'; g.textAlign = 'center'; g.fillText('PONT', W / 2, 52); g.font = 'bold 30px Impact, sans-serif'; g.fillText('CAEN  14 km', W / 2, 100); g.fillStyle = 'rgba(60,40,20,.3)'; for (let i = 0; i < 300; i++) g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }); }
function m33Build(st) { const S = TK3.scene, R = tk3Rand(303), RV = M3_RIVER, X = function (px) { return (px - 550) * SK3D.S; }, Z = function (py) { return (py - 350) * SK3D.S; }, D = M33D.DECK;
    st.map = 'river'; const from0 = S.children.length; st.fires = st.fires || []; st.m33plumes = []; st.m33foam = []; const sun = new THREE.Vector3(-.82, .1, -.3).normalize(); st.sun = sun; SK3D.tall = [];
    TK3.grade = { bloom: .4, expo: 1.15, sat: .92, con: 1.12, lift: [.02, .02, .025], th: 1.9, vig: .32, grain: .03, dirt: .05, tint: [1.03, 1, .97] }; TK3.sunDir = sun; TK3.rayK = .14; TK3.rayCol = tk3C('#ff9a5a');
    tk3Sky({ top: '#141d34', hor: '#d0804c', bot: '#38323a', sunDir: sun, sunCol: '#ffa060', sunI: 2, glow: 1.2, glowCol: '#ff8a48', cov: .72, cLit: '#b08a7c', cDark: '#20243a', cScale: 1.15, wind: [.007, .002] }); tk3Fog('#5e5650', .005);
    st.hgt = m33H;
    tk3Water({ deep: '#0e1a20', shal: '#30464a', skyH: '#b08066', skyT: '#2a3446', sunDir: sun, sunCol: '#ffa070', sunI: .9, amp: .05, len: 4, steep: .4, dir: 0, spread: .5, n: 6, shine: 220, foam: .1, chop: 1.8, size: 700, seg: 150 });
    // ---- ground: grass detail texture, wet mud banks, rutted road, scorched craters ----
    const SC = {}, sc = function (h) { return SC[h] || (SC[h] = new THREE.Color(h)); };
    const cf = function (x, z, h, ny, c) { const px = x / SK3D.S + 550, py = z / SK3D.S + 350, n = tk3Noise(x * .05, z * .05), n2 = tk3Noise(x * .21 + 7, z * .21); c.copy(sc(n > .52 ? '#4c6230' : '#566a32')).multiplyScalar(.8 + n * .3 + n2 * .1);
        if ((px < 140 && py < 130) || (px > 960 && py < 125) || (px < 120 && py > 560) || (px > 965 && py > 585)) { c.copy(sc('#5e4c34')).multiplyScalar(.8 + .3 * Math.max(0, Math.sin(px * 1.3)) + n2 * .1); }
        if (py < RV.y0 - 3 || py > RV.y1 + 3) { const rd = Math.abs(px - m33RoadX(py)); if (rd < 40) { c.lerp(sc('#4e4232'), rd < 30 ? .92 : (40 - rd) / 10 * .9); if (rd < 30 && (Math.abs(rd - 13) < 3)) c.multiplyScalar(.7); } }
        for (let i = 0; i < M33_CRATERS.length; i++) { const q = M33_CRATERS[i], d = Math.hypot(px - q[0], py - q[1]); if (d < 34) c.lerp(sc(d < 16 ? '#16120e' : '#3a2e22'), Math.min(1, (1 - d / 34) * 1.3)); }
        const e = Math.min(py - RV.y0, RV.y1 - py); if (e > -26 && !m33Quay(px)) c.lerp(sc('#3a3024'), m33Sm(-26, -2, e) * .85);
        if (h < .2) c.copy(sc('#262420')); if (ny < .8) c.lerp(sc('#4a3e2e'), .45); c.multiplyScalar(.82); };
    const gtex = sk3DetailTex('grass'); gtex.repeat.set(560 / 4, 440 / 4);
    const ground = new THREE.Mesh(tk3Terrain(560, 440, 230, 180, function (x, z) { return m33HPx(x / SK3D.S + 550, z / SK3D.S + 350); }, cf), tk3Std('#ffffff', .62, 0, { vertexColors: true, map: gtex })); ground.receiveShadow = true; S.add(ground);
    st.L = tk3Lights({ sky: '#a8acb4', ground: '#5a4c3e', hemi: 1.3, dir: sun, dirCol: '#ffb488', dirI: 1.55, shadowSize: 46 }); st.L.dir.shadow.mapSize.set(2048, 2048); st.L.dir.shadow.bias = -.0005; st.L.dir.shadow.camera.far = 400; st.L.dir.shadow.camera.updateProjectionMatrix();
    st.fill = new THREE.DirectionalLight(tk3C('#ffc8a0'), .45); S.add(st.fill); S.add(st.fill.target); const rim = new THREE.DirectionalLight(tk3C('#7a8cc0'), .5); rim.position.set(30, 25, 40); S.add(rim);
    const bt = sk3BrickTex(), pt = sk3PlasterTex(), stx = m33StoneTex(), mats = { brick: tk3Std('#ffffff', .9, 0, { map: bt, vertexColors: true }), plaster: tk3Std('#ffffff', .93, 0, { map: pt, vertexColors: true }), dark: tk3Std('#2e2a26', .95), ruin: tk3Std('#a49480', .94, 0, { map: bt }), ruinP: tk3Std('#9a8e7c', .96, 0, { map: pt }), plain: tk3Std('#ffffff', .88, 0, { vertexColors: true }) }; SK3D.mats = mats;
    const L = { B: [], P: [], W: [], ST: [], wire: [], bush: [], bank: [] };
    const stone = tk3Std('#ffffff', .82, 0, { map: stx }), stoneDk = tk3Std('#a49c8c', .86, 0, { map: stx }), wetStone = tk3Std('#8a847a', .55, 0, { map: stx });
    const scorch = new THREE.MeshStandardMaterial({ map: m33ScorchTex(), transparent: true, depthWrite: false, roughness: .9, polygonOffset: true, polygonOffsetFactor: -2 }), puddle = tk3Std('#4a4c52', .03, .2, { transparent: true, opacity: .55 });
    const decal = function (x, z, y, s, m) { const p = tk3Mesh(new THREE.PlaneGeometry(s, s * (.7 + R() * .5)).rotateX(-Math.PI / 2), m, x, y + .03, z, S); p.rotation.y = R() * 6.28; p.receiveShadow = true; p.renderOrder = 1; return p; };
    // ================= the bridge =================
    const x0 = X(RV.bx0), x1 = X(RV.bx1), zN = Z(RV.y0 - 24), zS = Z(RV.y1 + 24), BL = zS - zN, W = x1 - x0, zc = (zN + zS) / 2, pw = 14 * SK3D.S, walk = 3;
    tk3Mesh(tk3BoxUV(tk3Box(W, 1.6, BL), .2), stoneDk, 0, D - .8, zc, S, true, true);
    const ctex = m33CobbleTex(); const road = new THREE.PlaneGeometry(W - 2 * (pw + walk), BL).rotateX(-Math.PI / 2); sk3PlanarUV(road, .42); tk3Mesh(road, tk3Std('#ffffff', .66, 0, { map: ctex }), 0, D + .015, zc, S, false, true);
    [-1, 1].forEach(function (sd) { const cx = sd * (W / 2 - pw - walk / 2); tk3Mesh(tk3BoxUV(tk3Box(walk, .2, BL), .45), wetStone, cx, D + .1, zc, S, true, true); tk3Mesh(tk3BoxUV(tk3Box(.3, .24, BL), .4), stoneDk, sd * (W / 2 - pw - walk + .15), D + .12, zc, S, true, true); });
    // arched side walls, cornice, keystones
    const spans = 7, span = (Z(RV.y1) - Z(RV.y0)) / spans, piers = []; for (let i = 1; i < spans; i++) piers.push(Z(RV.y0) + span * i);
    const side = new THREE.Shape(); side.moveTo(-BL / 2, -3); side.lineTo(BL / 2, -3); side.lineTo(BL / 2, D); side.lineTo(-BL / 2, D); side.closePath();
    const zs = [Z(RV.y0)].concat(piers).concat([Z(RV.y1)]), crowns = [];
    for (let i = 0; i < zs.length - 1; i++) { const a = zs[i] + (i ? 1.4 : .5) - zc, b = zs[i + 1] - (i < zs.length - 2 ? 1.4 : .5) - zc, r = (b - a) / 2, sp = -.4, hole = new THREE.Path(); hole.moveTo(a, -3.2); hole.lineTo(a, sp); hole.absarc((a + b) / 2, sp, r, Math.PI, 0, true); hole.lineTo(b, -3.2); hole.closePath(); side.holes.push(hole); crowns.push([(a + b) / 2 + zc, sp + r]); }
    [-1, 1].forEach(function (sd) { const g = new THREE.ExtrudeGeometry(side, { depth: 1.3, bevelEnabled: false, curveSegments: 14 }); g.rotateY(Math.PI / 2); tk3BoxUV(g, .2); tk3Mesh(g, stone, sd > 0 ? x1 - 1.3 : x0, 0, zc, S, true, true);
        const ox = sd > 0 ? x1 : x0; tk3Mesh(tk3BoxUV(tk3Box(.5, .4, BL + .4), .3), stoneDk, ox + sd * .1, D - .25, zc, S, true, true);
        crowns.forEach(function (c) { tk3Mesh(tk3BoxUV(tk3Box(.4, 1.1, 1), .3), stoneDk, ox + sd * .08, c[1] - .2, c[0], S, true); });
        // arch soffits (the underside of each arch)
        for (let i = 0; i < zs.length - 1; i++) { const a = zs[i] + (i ? 1.4 : .5), b = zs[i + 1] - (i < zs.length - 2 ? 1.4 : .5), r = (b - a) / 2; if (sd > 0) { const cyl = new THREE.CylinderGeometry(r, r, W - 2.4, 22, 1, true, 0, Math.PI); cyl.rotateZ(Math.PI / 2); cyl.rotateX(Math.PI / 2); tk3BoxUV(cyl, .2); const m = tk3Mesh(cyl, tk3Std('#5a564e', .9, 0, { map: stx, side: THREE.DoubleSide }), 0, -.4, (a + b) / 2, S, false, true); } } });
    piers.forEach(function (z) { tk3Mesh(tk3BoxUV(tk3Box(W - .6, 6.4, 2.8), .2), stoneDk, 0, -1.8, z, S, true, true);
        [-1, 1].forEach(function (sd) { const ex = sd > 0 ? x1 : x0; const c = tk3Mesh(tk3BoxUV(new THREE.CylinderGeometry(1.98, 2.2, 6, 4), .2), wetStone, ex + sd * .25, -1.5, z, S, true, true); c.rotation.y = Math.PI / 4; c.scale.set(1, 1, .7); const cap = tk3Mesh(new THREE.ConeGeometry(1.98, 1.4, 4), stoneDk, ex + sd * .25, 2.2, z, S, true); cap.rotation.y = Math.PI / 4; cap.scale.set(1, 1, .7); st.m33foam.push([ex + sd * 1.6, z, sd]); }); });
    // balustrade on the strips the 2D map counts as water, with two shell-blasted gaps
    const balu = [], rails = [], gaps = [[-1, zc - 9, zc - 4.5], [1, zc + 12, zc + 16.5]], inGap = function (sd, z) { return gaps.some(function (g) { return g[0] === sd && z > g[1] && z < g[2]; }); };
    [-1, 1].forEach(function (sd) { const cx = sd < 0 ? x0 + pw / 2 : x1 - pw / 2;
        tk3Mesh(tk3BoxUV(tk3Box(pw, .55, BL), .3), stone, cx, D + .27, zc, S, true, true);
        for (let z = zN + .4; z < zS - .3; z += .48) { if (inGap(sd, z)) continue; const b = tk3Cyl(.1, .14, .66, 7); tk3Xf(b, cx, D + .55 + .33, z); balu.push(b); const b2 = tk3Box(.3, .1, .3); tk3Xf(b2, cx, D + .6, z); balu.push(b2); }
        let z = zN; const segs = []; let open = zN; for (z = zN; z <= zS; z += .25) { const g = inGap(sd, z); if (g && open != null) { segs.push([open, z]); open = null; } if (!g && open == null) open = z; } if (open != null) segs.push([open, zS]);
        segs.forEach(function (sg) { const l = sg[1] - sg[0]; if (l < .3) return; const r1 = tk3Box(pw * .55, .26, l); tk3Xf(r1, cx, D + 1.34, (sg[0] + sg[1]) / 2); rails.push(r1); });
        for (let k = 0; k <= 7; k++) { const pz = zN + .5 + k * (BL - 1) / 7; if (inGap(sd, pz)) continue; const p = tk3Box(1.1, 1.6, 1.1); tk3Xf(p, cx, D + .8, pz); rails.push(p); const c = tk3Box(1.3, .22, 1.3); tk3Xf(c, cx, D + 1.7, pz); rails.push(c); } });
    tk3Mesh(tk3BoxUV(tk3Merge(balu), .4), stone, 0, 0, 0, S, true, true); tk3Mesh(tk3BoxUV(tk3Merge(rails), .3), stoneDk, 0, 0, 0, S, true, true);
    gaps.forEach(function (g) { const cx = g[0] < 0 ? x0 + pw / 2 : x1 - pw / 2; for (let i = 0; i < 9; i++) { const q = new THREE.DodecahedronGeometry(.2 + R() * .35, 0); tk3Xf(q, cx + (R() - .5) * 2.4 - g[0] * R() * 1.5, D + .65 + R() * .2, g[1] + R() * (g[2] - g[1]), R() * 3, R() * 3, 0); sk3Add(L.ST, q, '#a49c8a', 0, 0, 0); } const lb = tk3Cyl(.1, .14, .66, 7); tk3Xf(lb, cx - g[0] * 2.2, D + .25, g[1] + 2, 0, 0, Math.PI / 2 - .2); sk3Add(L.ST, lb, '#b4ac9a', 0, 0, 0); });
    // cast-iron lamps on the pillars, some knocked askew, with glowing lanterns
    const iron = tk3Std('#1a1a18', .55, .6), glass = new THREE.MeshBasicMaterial({ color: tk3C('#ffcf88') }), halo = new THREE.SpriteMaterial({ map: tk3SoftTex(), color: tk3C('#ffaa55'), transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending }); st.m33lamps = [];
    [-1, 1].forEach(function (sd) { const cx = sd < 0 ? x0 + pw / 2 : x1 - pw / 2; for (let k = 0; k <= 7; k += 1) { const pz = zN + .5 + k * (BL - 1) / 7; if (inGap(sd, pz) || (k + (sd > 0 ? 1 : 0)) % 2) continue; const bent = R() < .2, g = new THREE.Group(); g.position.set(cx, D + 1.81, pz); if (bent) g.rotation.set(.35 * sd, 0, .25); S.add(g);
        tk3Mesh(tk3Cyl(.22, .26, .5, 10), iron, 0, .25, 0, g, true); tk3Mesh(tk3Cyl(.06, .1, 3.4, 8), iron, 0, 2.1, 0, g, true); tk3Mesh(tk3Cyl(.18, .06, .3, 8), iron, 0, 3.9, 0, g); const cap = tk3Mesh(new THREE.ConeGeometry(.32, .35, 6), iron, 0, 4.62, 0, g, true);
        const lit = !bent && R() < .85; tk3Mesh(tk3Box(.36, .5, .36), lit ? glass : tk3Std('#2a2a28', .3, .3), 0, 4.25, 0, g); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) { tk3Mesh(tk3Box(.04, .52, .04), iron, c[0] * .18, 4.25, c[1] * .18, g); });
        if (lit) { const h = new THREE.Sprite(halo); h.scale.set(3.2, 3.2, 1); h.position.set(0, 4.25, 0); g.add(h); st.m33lamps.push(h); } } });
    // cover on the deck (solid obstacles added in 3D only, see m33AddCover)
    const charM = (function () { try { return exCharMat(); } catch (e) { return tk3Std('#1c1a16', .9, .2); } })();
    M33_COVER.forEach(function (c) { const cx = X(c[0] + c[2] / 2), cz = Z(c[1] + c[3] / 2);
        if (c[5] === 'panzer') { try { const m = tk3TankModel('panzer4', 'german'); exBurn(m.g); m.g.scale.setScalar(Math.min(c[3] * SK3D.S * 1.05 / m.spec.len, 1.3)); m.g.position.set(cx, D, cz); m.g.rotation.set(0, -Math.PI / 2 + .12, .04); S.add(m.g); if (m.turret) m.turret.rotation.y = .7; } catch (e) { tk3Mesh(tk3Box(3, 2, 6), charM, cx, D + 1, cz, S, true); }
            st.fires.push([cx, D + 2.2, cz + .5, .7, 0, 1]); decal(cx + 1, cz - 2, D, 9, scorch); }
        else if (c[5] === 'truck') { const g = new THREE.Group(); g.position.set(cx, D, cz); g.rotation.set(0, .08, -.05); S.add(g); tk3Mesh(tk3Box(2.3, 1.1, 2.2), charM, 0, 1.45, -2.4, g, true); tk3Mesh(tk3Box(2.1, .9, 1.4), charM, 0, 1.4, -3.9, g, true);
            const bed = []; for (let k = 0; k < 7; k++) { const b = tk3Box(.12, 1.1, 4.2); tk3Xf(b, -1.1 + k * .37, 1.6 + (k % 3) * .05, 1, 0, 0, (R() - .5) * .3); bed.push(b); } tk3Mesh(tk3Merge(bed), charM, 0, 0, 0, g, true); tk3Mesh(tk3Box(2.4, .25, 6.6), charM, 0, .9, -.4, g, true);
            [[-1.1, -3.5], [1.1, -3.5], [-1.1, 1.8], [1.1, 1.8]].forEach(function (w, i) { const wh = tk3Cyl(.48, .48, .3, 12); wh.rotateZ(Math.PI / 2); tk3Mesh(wh, i === 1 ? tk3Std('#0e0d0c', .9) : charM, w[0], i === 1 ? .3 : .48, w[1], g, true); }); st.fires.push([cx, D + 1.6, cz + 1, .55, 0, 1]); decal(cx, cz, D, 7, scorch); }
        else { // horseshoe of sandbags with an abandoned anti-tank gun
            const bags = []; for (let row = 0; row < 3; row++) for (let a = -2.4; a <= 2.4; a += .32) { const rr = 3.6 - row * .05, x = Math.sin(a) * rr * 1.25, z = -Math.cos(a) * rr; if (Math.abs(a) > 2.3) continue; const b = new THREE.SphereGeometry(1, 8, 5); tk3Xf(b, cx + x, D + .2 + row * .36, cz + z, 0, -a, 0, .45, .2, .3); bags.push(b); }
            tk3Mesh(tk3BoxUV(tk3Merge(bags), .5), tk3Std('#8a7a56', .95, 0, { map: pt }), 0, 0, 0, S, true, true);
            const gn = new THREE.Group(); gn.position.set(cx, D, cz + .6); gn.rotation.y = .2; S.add(gn); const gm = tk3Std('#3e4430', .7, .3); tk3Mesh(tk3Box(1.8, 1.1, .08), gm, 0, 1.0, -.3, gn, true); const br = tk3Mesh(tk3Cyl(.06, .08, 3, 8), gm, 0, .95, -1.6, gn, true); br.rotation.x = Math.PI / 2 - .05;
            [-1, 1].forEach(function (s2) { const w = tk3Cyl(.42, .42, .16, 12); w.rotateZ(Math.PI / 2); tk3Mesh(w, tk3Std('#1a1a18', .9), s2 * .85, .42, 0, gn, true); const tr = tk3Mesh(tk3Box(.1, .1, 2.4), gm, s2 * .5, .2, 1.2, gn, true); tr.rotation.y = s2 * .25; });
            for (let k = 0; k < 5; k++) tk3Mesh(tk3Cyl(.06, .06, .5, 6), tk3Std('#b08a40', .4, .8), cx + .8 + R(), D + .06, cz + 1 + R(), S).rotation.set(Math.PI / 2, R() * 3, 0); } });
    // the deck: shell scorches, puddles, scattered stones
    for (let i = 0; i < 9; i++) decal(X(450 + R() * 200), Z(RV.y0 - 10 + R() * (RV.y1 - RV.y0 + 20)), D, 3 + R() * 4, scorch);
    for (let i = 0; i < 12; i++) { const p = tk3Mesh(new THREE.CircleGeometry(1, 14).rotateX(-Math.PI / 2), puddle, X(460 + R() * 180), D + .03, Z(RV.y0 - 20 + R() * (RV.y1 - RV.y0 + 40)), S); p.scale.set(.6 + R() * 1.6, 1, .4 + R() * .9); p.rotation.y = R() * 3; p.renderOrder = 2; }
    for (let i = 0; i < 50; i++) { const q = new THREE.DodecahedronGeometry(.08 + R() * .2, 0); tk3Xf(q, X(445 + R() * 210), D + .06, Z(RV.y0 - 20 + R() * (RV.y1 - RV.y0 + 40)), R() * 3, R() * 3, 0); sk3Add(L.ST, q, R() < .5 ? '#8a8478' : '#5a564e', 0, 0, 0); }
    SK3D.tall.push([x0 - 1, zN, x1 + 1, zS, D + 5]);
    // stone quays either side of the bridge, with mooring rings and steps
    [RV.y0 + 5, RV.y1 - 5].forEach(function (py, n) { [[RV.bx0 - 170, RV.bx0], [RV.bx1, RV.bx1 + 170]].forEach(function (rg) { const a = X(rg[0]), b = X(rg[1]), z = Z(py); tk3Mesh(tk3BoxUV(tk3Box(b - a, 5.6, 1.2), .2), wetStone, (a + b) / 2, -.2, z, S, true, true); tk3Mesh(tk3BoxUV(tk3Box(b - a, .3, 1.5), .3), stoneDk, (a + b) / 2, 2.62, z + (n ? .15 : -.15), S, true, true);
        for (let k = 0; k < 4; k++) { const t = tk3Mesh(new THREE.TorusGeometry(.18, .04, 6, 12), iron, a + (k + .5) * (b - a) / 4, 1.6, z + (n ? -.62 : .62), S); } }); });
    // a half-sunk rowing boat tied to the north quay
    (function () { const sh = new THREE.Shape(); sh.moveTo(-2.4, 0); sh.quadraticCurveTo(-2.2, .8, 0, .85); sh.lineTo(1.8, .7); sh.quadraticCurveTo(2.6, .3, 2.7, 0); sh.quadraticCurveTo(2.6, -.3, 1.8, -.7); sh.lineTo(0, -.85); sh.quadraticCurveTo(-2.2, -.8, -2.4, 0); const g = new THREE.ExtrudeGeometry(sh, { depth: .6, bevelEnabled: false }); g.rotateX(-Math.PI / 2); const b = tk3Mesh(g, tk3Std('#4a3a28', .8), X(300), -.25, Z(RV.y0 + 9), S, true); b.rotation.set(.12, .3, -.18); tk3Mesh(tk3Box(4.4, .1, 1.3), tk3Std('#1e1a14', .9), X(300) + .1, .32, Z(RV.y0 + 9), S); })();
    // ================= banks =================
    const blobs = [], blob = function (x, z, s) { const b = new THREE.IcosahedronGeometry(s, 1); const p = b.attributes.position; for (let i = 0; i < p.count; i++) { const k = .8 + tk3Noise(p.getX(i) * 1.7 + x, p.getZ(i) * 1.7 + z) * .45; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); } b.computeVertexNormals(); tk3Xf(b, x, m33H(x, z) + s * .62, z, 0, R() * 3, 0, 1, .8 + R() * .3, 1); tk3Tint(b, tk3C(['#2e4420', '#36502a', '#2a3e1e', '#3c5226'][(R() * 4) | 0]).multiplyScalar(.85 + R() * .3)); blobs.push(b); };
    const bags = [];
    obstacles.forEach(function (o) { if (o.type !== 'm2Hedge') return; const sand = o.x > 300 && o.x < 800;
        if (!sand) { for (let px = o.x + 5; px < o.x + o.width - 2; px += 7) blob(X(px), Z(o.y + o.height / 2) + (R() - .5) * 1.4, 1.6 + R() * .9); return; }
        for (let r = 0; r < 3; r++) for (let px = o.x + 4 + (r % 2) * 4; px < o.x + o.width - 2; px += 8) { const b = new THREE.SphereGeometry(1, 8, 5), x = X(px), z = Z(o.y + o.height / 2) + (r === 2 ? 0 : (r - .5) * 1.1); tk3Xf(b, x, m33H(x, z) + .22 + (r === 2 ? .42 : 0), z, 0, (R() - .5) * .3, 0, .82, .23, .5); bags.push(b); }
        for (let k = 0; k < 3; k++) { const x = X(o.x + o.width * (.2 + k * .3)), z = Z(o.y - 10); const coil = new THREE.TorusGeometry(.5, .015, 4, 40); for (let j = 0; j < 7; j++) { const c = coil.clone(); tk3Xf(c, x + j * .5 - 1.5, m33H(x, z) + .5, z, 0, Math.PI / 2 + (R() - .5) * .3, 0); sk3Add(L.wire, c, '#4a443c', 0, 0, 0); } } });
    for (let px = -500; px < 1600; px += 17) [-430, 1120].forEach(function (py) { blob(X(px), Z(py + (R() - .5) * 30), 2.4 + R()); });
    const hm = new THREE.Mesh(tk3Merge(blobs), tk3Std('#ffffff', .85, 0, { vertexColors: true })); hm.castShadow = hm.receiveShadow = true; S.add(hm);
    if (bags.length) tk3Mesh(tk3BoxUV(tk3Merge(bags), .5), tk3Std('#8a7a56', .95, 0, { map: pt }), 0, 0, 0, S, true, true);
    // trees: copses, poplars lining the roads, willows hanging over the water
    const trees = [], tree = function (x, z, v, s, sx, sy) { const g = sk3BroadGeo(v); tk3Xf(g, 0, 0, 0, 0, R() * 6.28, 0, s * (sx || 1), s * (sy || 1), s * (sx || 1)); tk3Xf(g, x, m33H(x, z) - .2, z); trees.push(g); };
    obstacles.forEach(function (o) { if (o.type !== 'm2Trees') return; for (let i = 0; i < 5; i++) tree(X(o.x + 6 + R() * (o.width - 12)), Z(o.y + 6 + R() * (o.height - 12)), i % 6, 1.6 + R() * .5); });
    for (let py = -420; py < 1150; py += 58) { if (py > RV.y0 - 60 && py < RV.y1 + 60) continue; if (py > -20 && py < 720) continue; [-1, 1].forEach(function (sd) { const px = m33RoadX(py) + sd * 52; tree(X(px), Z(py), 2, 1.5 + R() * .3, .42, 1.9); }); }
    for (let i = 0; i < 12; i++) { const px = -380 + R() * 1860; if (px > RV.bx0 - 200 && px < RV.bx1 + 200) continue; const north = i % 2, py = north ? RV.y0 - 18 - R() * 14 : RV.y1 + 18 + R() * 14; tree(X(px), Z(py), (i % 3) + 1, 1.5 + R() * .4, 1.5, .85); }
    for (let i = 0; i < 18; i++) { const px = -400 + R() * 1900, py = -380 + R() * 1450; if ((px > -40 && px < 1140 && py > -40 && py < 740) || (py > RV.y0 - 30 && py < RV.y1 + 30)) continue; tree(X(px), Z(py), i % 6, 1.6 + R() * .8); }
    if (trees.length) { const tm = new THREE.Mesh(tk3Merge(trees), tk3Std('#ffffff', .88, 0, { vertexColors: true })); tm.castShadow = tm.receiveShadow = true; S.add(tm); }
    // reeds and rushes along the natural banks
    const reeds = []; for (let i = 0; i < 500; i++) { const px = -250 + R() * 1600; if (m33Quay(px)) continue; const north = i % 2, py = north ? RV.y0 + 2 + R() * 14 : RV.y1 - 2 - R() * 14, x = X(px), z = Z(py), h = .9 + R() * 1.2, g = new THREE.ConeGeometry(.04, h, 3); tk3Xf(g, x, Math.max(0, m33HPx(px, py)) + h / 2 - .1, z, (R() - .5) * .5, 0, (R() - .5) * .5); tk3Tint(g, tk3C(R() < .3 ? '#7a7040' : '#4e5a2c')); reeds.push(g); }
    if (reeds.length) tk3Mesh(tk3Merge(reeds), tk3Std('#ffffff', .9, 0, { vertexColors: true }), 0, 0, 0, S);
    // grass tufts over the banks
    (function () { const geo = []; for (let k = 0; k < 7; k++) { const g = new THREE.BufferGeometry(), ang = k / 7 * Math.PI + R() * .4, ca = Math.cos(ang), sa = Math.sin(ang), w = .03, lean = (R() - .5) * .45; g.setAttribute('position', new THREE.Float32BufferAttribute([-w * ca, 0, -w * sa, w * ca, 0, w * sa, lean * -sa, 1, lean * ca], 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3)); geo.push(g); }
        const N = 15000, im = new THREE.InstancedMesh(tk3Merge(geo), tk3Std('#ffffff', .9, 0, { side: THREE.DoubleSide }), N), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3(), col = new THREE.Color(); let n = 0;
        for (let tries = 0; n < N && tries < N * 4; tries++) { const px = -20 + R() * 1140, py = -20 + R() * 740; if (py > RV.y0 - 4 && py < RV.y1 + 4) continue; if (Math.abs(px - m33RoadX(py)) < 32) continue; if (obstacles.some(function (o) { return px > o.x - 3 && px < o.x + o.width + 3 && py > o.y - 3 && py < o.y + o.height + 3; })) continue;
            const x = X(px), z = Z(py), h = .14 + R() * .34; e.set(0, R() * 6.28, 0); q.setFromEuler(e); v.set(x, m33HPx(px, py) - .02, z); s3.set(.8 + R() * .6, h, .8 + R() * .6); m4.compose(v, q, s3); im.setMatrixAt(n, m4); col.copy(tk3C(['#4a6228', '#5a6e2e', '#3e5622', '#6a6a34'][(R() * 4) | 0])).multiplyScalar(.7 + R() * .35); im.setColorAt(n, col); n++; }
        im.count = n; im.receiveShadow = true; im.frustumCulled = false; S.add(im); })();
    // craters: scorched with clods of earth thrown round the rim
    M33_CRATERS.forEach(function (c) { if (c[1] > RV.y0 - 30 && c[1] < RV.y1 + 30) return; decal(X(c[0]), Z(c[1]), m33HPx(c[0], c[1]), 7 + R() * 3, scorch); for (let k = 0; k < 12; k++) { const a = R() * 6.28, d = (24 + R() * 8) * SK3D.S, x = X(c[0]) + Math.cos(a) * d, z = Z(c[1]) + Math.sin(a) * d, q = new THREE.DodecahedronGeometry(.15 + R() * .3, 0); tk3Xf(q, x, m33H(x, z) + .05, z, R() * 3, R() * 3, 0, 1, .6, 1); sk3Add(L.ST, q, '#3a2e22', 0, 0, 0); } });
    // czech hedgehogs and wire on the north bank where they will come from
    for (let i = 0; i < 9; i++) { const px = 330 + i * 55 + (R() - .5) * 20; if (px > RV.bx0 - 10 && px < RV.bx1 + 10) continue; sk3Hog(L, X(px), Z(RV.y0 - 46 - R() * 20), R, m33H(X(px), Z(RV.y0 - 50))); }
    // telegraph poles along the roads with sagging wires
    (function () { const poles = [], wpts = []; [[-430, RV.y0 - 40], [RV.y1 + 40, 1120]].forEach(function (rg) { let prev = null; for (let py = rg[0]; py <= rg[1]; py += 150) { const px = m33RoadX(py) + 64, x = X(px), z = Z(py), y = m33HPx(px, py); const p = tk3Cyl(.12, .16, 7.5, 6); tk3Xf(p, x, y + 3.6, z, (R() - .5) * .08, 0, (R() - .5) * .08); poles.push(p); const cb = tk3Box(1.6, .12, .12); tk3Xf(cb, x, y + 6.9, z); poles.push(cb);
            const top = [x, y + 7, z]; if (prev) for (const o of [-.7, .7]) { for (let s = 0; s < 8; s++) { const t0 = s / 8, t1 = (s + 1) / 8, sag = function (t) { return -Math.sin(t * Math.PI) * .7; }; wpts.push(prev[0] + o + (top[0] - prev[0]) * t0, prev[1] + (top[1] - prev[1]) * t0 + sag(t0), prev[2] + (top[2] - prev[2]) * t0, prev[0] + o + (top[0] - prev[0]) * t1, prev[1] + (top[1] - prev[1]) * t1 + sag(t1), prev[2] + (top[2] - prev[2]) * t1); } } prev = top; } });
        tk3Mesh(tk3Merge(poles), tk3Std('#3a2e22', .9), 0, 0, 0, S, true); const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(wpts, 3)); S.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x141414 }))); })();
    // signpost at the south end of the bridge
    (function () { const x = X(RV.bx1 + 30), z = Z(RV.y1 + 46), y = m33HPx(RV.bx1 + 30, RV.y1 + 46); tk3Mesh(tk3Box(.14, 2.6, .14), tk3Std('#4a3a28', .9), x, y + 1.3, z, S, true); const sg = tk3Mesh(new THREE.PlaneGeometry(1.4, .7), tk3Std('#ffffff', .8, 0, { map: m33SignTex(), side: THREE.DoubleSide }), x, y + 2.2, z, S); sg.rotation.y = .5; })();
    // ================= buildings =================
    const wallB = ['#b8a088', '#c4b49a', '#a89078', '#9c8c7c'], wallP = ['#d4cab4', '#c8bea6', '#d8ccb0', '#bfb6a2'], roofC = ['#7a4632', '#6a3a2e', '#4a4c50', '#5a4a44'];
    const placeAt = function (y, fn) { const L2 = { B: [], P: [], W: [], ST: [], wire: [], bush: [], bank: [] }, fake = { fires: [] }; fn(L2, fake); Object.keys(L2).forEach(function (k) { L2[k].forEach(function (g) { g.translate(0, y, 0); L[k].push(g); }); }); fake.fires.forEach(function (f) { st.fires.push([f[0], f[1] + y, f[2], f[3], f[4], f[5]]); }); };
    const house = function (x, z, w, d, h, o) { const y = m33H(x, z) - .25; placeAt(y, function (L2, fk) { sk3House(L2, x, z, w, d, h, R, Object.assign({ st: fk, plaster: R() < .5 }, o, { wall: o.plaster ? wallP[(R() * 4) | 0] : wallB[(R() * 4) | 0], roof: roofC[(R() * 4) | 0] })); sk3Add(L2.W, new THREE.BoxGeometry(w + .2, 2.2, d + .2).translate(x, -1.05, z), '#5c5750', 0, 0, 0); }); SK3D.tall.push([x - w / 2, z - d / 2, x + w / 2, z + d / 2, y + h + 3]); return y; };
    obstacles.forEach(function (o) { if (o.type !== 'm2House') return; const w = o.width * SK3D.S, d = o.height * SK3D.S, x = X(o.x + o.width / 2), z = Z(o.y + o.height / 2), intact = o.x > 800 && o.y > 500;
        if (!intact) { const y = m33HPx(o.x + o.width / 2, o.y + o.height / 2) - .2, g = sk3Ruin(S, R() < .5 ? mats.ruinP : mats.ruin, mats.dark, x, z, w - .4, d - .4, 7 + R() * 2.5, 0, R); if (g) g.position.y += y; st.fires.push([x + (R() - .5) * w * .3, y + 1.2, z + (R() - .5) * d * .3, 1.4 + R() * .6, 0, 1]); st.m33plumes.push([x, y + 4, z, 1]); 
            for (let k = 0; k < 3; k++) placeAt(y + .1, function (L2) { sk3Rubble(L2, x + (R() - .5) * (w + 4), z + (R() < .5 ? -1 : 1) * (d / 2 + 1.6), 1.6 + R() * 1.4, R); }); SK3D.tall.push([x - w / 2, z - d / 2, x + w / 2, z + d / 2, y + 9]); return; }
        house(x, z, w - .4, d - .4, 7.5, { damage: 1, plaster: true }); });
    // the village on the ridge: a street of houses, half of them burning, and the church
    for (let i = 0; i < 14; i++) { const px = 60 + i * 76 + (R() - .5) * 20, row = i % 2, py = -250 - row * 64 - R() * 14; if (Math.abs(px - m33RoadX(py)) < 50) continue; const x = X(px), z = Z(py), w = 8 + R() * 5, d = 7 + R() * 3, h = 6.5 + R() * 5, burning = R() < .5;
        if (burning && R() < .4) { const y = m33HPx(px, py) - .2, g = sk3Ruin(S, mats.ruin, mats.dark, x, z, w, d, h * .8, 0, R); if (g) g.position.y += y; st.fires.push([x, y + 1.5, z, 1.8 + R(), 0, 1]); st.m33plumes.push([x, y + 5, z, 1.3]); continue; }
        const y = house(x, z, w, d, h, { damage: burning ? 2 : 1, plaster: R() < .5 }); if (burning) { if (R() < .5) st.fires.push([x + (R() - .5) * w * .3, y + h * .8, z, 1.6 + R(), 0, 1]); st.m33plumes.push([x, y + h + 2, z, 1.2]); } }
    (function () { const cx = X(700), cz = Z(-320), y = m33H(cx, cz) - .3; placeAt(y, function (L2) { sk3Add(L2.W, new THREE.BoxGeometry(22, 2.4, 14).translate(cx, -1.1, cz), '#5c5750', 0, 0, 0); sk3Church(L2, S, mats, cx, cz, 22, 13, false, R); }); st.fires.push([cx + 4, y + 9.5, cz, 2.4, 0, 1]); st.m33plumes.push([cx + 4, y + 13, cz, 2]); SK3D.tall.push([cx - 11, cz - 7, cx + 11, cz + 7, y + 31]); })();
    // burnt-out tanks on the verges (decor, not solid in 2D, so set back off the play lanes)
    [[255, 140, .3, 'sherman', 'american'], [880, 135, -.5, 'panzer4', 'german'], [800, 668, .6, 'sherman', 'american'], [270, 668, 2.9, 'panzer4', 'german']].forEach(function (p) { const x = X(p[0]), z = Z(p[1]), y = m33H(x, z); try { const m = tk3TankModel(p[3], p[4]); exBurn(m.g); m.g.scale.setScalar(1.05); m.g.position.set(x, y - .15, z); m.g.rotation.set(.03, -p[2], -.05); S.add(m.g); if (m.turret) m.turret.rotation.y = R() * 2 - 1; } catch (e) {} st.fires.push([x, y + 2.2, z, .5, 0, 1]); decal(x, z, y, 8, scorch); });
    sk3Mesh(L.B, mats.brick, .3); sk3Mesh(L.P, mats.plaster, .25); sk3Mesh(L.W, mats.plain, null); sk3Mesh(L.ST, mats.plain, null); sk3Mesh(L.wire, tk3Std('#ffffff', .6, .5, { vertexColors: true }), null);
    st.m33glow = tk3PL('#ff7030', 3, 140, X(550), 16, Z(-290)); st.m33glow2 = tk3PL('#ff8a40', 1.4, 60, X(150), 6, Z(-10));
    m33MergeStatic(S, from0, new Set([ground]));
    st.m33planes = []; M33D.st = st; }
// bake every static mesh the builder added into one mesh per material (hundreds of draw calls -> a few dozen); tanks, sprites, lights, lines stay as they are
function m33MergeStatic(S, from, keep) { const kids = S.children.slice(from), buckets = new Map(), whole = []; S.updateMatrixWorld(true);
    kids.forEach(function (o) { if (keep.has(o) || o.userData.keep || o.isLight || o.isSprite || o.isLineSegments || o.isInstancedMesh || o.isPoints) return; const meshes = []; let all = true;
        o.traverse(function (c) { if (c === o && !c.isMesh) return; if (c.isSprite || c.isLight || c.isInstancedMesh || c.isLineSegments || (c.userData && c.userData.keep)) { all = false; return; } if (!c.isMesh) return; const m = c.material; if (!c.visible) return; if (Array.isArray(m) || !m || m.transparent && !m.isMeshStandardMaterial || !(m.isMeshStandardMaterial || m.isMeshBasicMaterial) || c.geometry.attributes.position.count > 60000 || c.geometry.isInstancedBufferGeometry) { all = false; return; } meshes.push(c); });
        meshes.forEach(function (c) { const g = (c.geometry.index ? c.geometry.toNonIndexed() : c.geometry.clone()); g.applyMatrix4(c.matrixWorld); let b = buckets.get(c.material); if (!b) buckets.set(c.material, b = { g: [], cs: false, rs: false, ro: 0 }); b.g.push(g); b.cs = b.cs || c.castShadow; b.rs = b.rs || c.receiveShadow; b.ro = Math.max(b.ro, c.renderOrder || 0); if (!all && c.parent) c.parent.remove(c); });
        if (all && meshes.length) whole.push(o); });
    whole.forEach(function (o) { S.remove(o); }); let n = 0; buckets.forEach(function (b, m) { const mm = new THREE.Mesh(tk3Merge(b.g), m); mm.castShadow = b.cs; mm.receiveShadow = b.rs; mm.renderOrder = b.ro; S.add(mm); n++; }); return n; }
function m33Plane() { const fac = campaignRun && campaignRun.faction || selectedFaction; try { return fac === 'german' ? tk3Bf109() : tk3Spitfire(); } catch (e) { const g = new THREE.Group(); tk3Mesh(tk3Box(9, 1, 1), tk3Std('#4a5040', .6), 0, 0, 0, g); tk3Mesh(tk3Box(2, .2, 11), tk3Std('#4a5040', .6), .5, 0, 0, g); return g; } }
function m33Frame(st, t, dt) { if (TK3.water) { TK3.water.userData.u.time.value = t; try { tk3WaterFollow(TK3.cam); } catch (e) {} }
    if (st.m33lamps) st.m33lamps.forEach(function (l, i) { const f = .85 + .15 * Math.sin(t * 13 + i * 3) * Math.sin(t * 7 + i); l.scale.setScalar(3.2 * f); });
    const rnd = Math.random, RV = M3_RIVER;
    if (st.smoke) { (st.m33plumes || []).forEach(function (p) { if (rnd() < dt * .55 * p[3]) st.smoke.emit({ x: p[0] + (rnd() - .5) * 2, y: p[1], z: p[2], vx: 1.4 + rnd(), vy: 2.6 + rnd() * 1.6, vz: -.5, life: 16 + rnd() * 5, s0: 3 * p[3], s1: 18 * p[3], c0: [.05, .045, .04, .62], c1: [.15, .14, .14, 0], drag: .1, rv: .08, fadeIn: .06 }); });
        const cam = TK3.cam && TK3.cam.position; if (cam && rnd() < dt * 1.6) st.smoke.emit({ x: cam.x + (rnd() - .5) * 140, y: .5 + rnd() * .6, z: (RV.y0 + 10 + rnd() * (RV.y1 - RV.y0 - 20) - 350) * SK3D.S, vx: .5, vy: .02, vz: 0, life: 14, s0: 5, s1: 12, c0: [.62, .62, .66, .14], c1: [.62, .62, .66, 0], drag: .05, fadeIn: .35 }); }
    if (st.dust) (st.m33foam || []).forEach(function (f) { if (rnd() < dt * 2.2) st.dust.emit({ x: f[0], y: .08, z: f[1] + (rnd() - .5) * 2.4, vx: .9 + rnd() * .4, vy: .05, vz: (rnd() - .5) * .3, life: 2.6, s0: .35, s1: 1.6, c0: [.85, .87, .9, .4], c1: [.85, .87, .9, 0], drag: .2 }); });
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
    // 3D only: cover on the bridge deck (indestructible, blocks shells and tanks)
    if (typeof SK3_SOLID !== 'undefined') SK3_SOLID.push('m33Wreck', 'm33Bags');
    const _cm = createMission3Map; createMission3Map = function () { const r = _cm.apply(this, arguments); if (M33D.on) { M33_COVER.forEach(function (c) { addObstacle(c[0], c[1], c[2], c[3], c[4]); }); navCache = { key: '', grids: {} }; } return r; };
    const _tod = sk3Tod, _wx = sk3Wx; sk3Tod = function () { return M33D.on ? 'dusk' : _tod(); }; sk3Wx = function () { return M33D.on ? 'rain' : _wx(); };
    const _ts = getTankSpeed; getTankSpeed = function (t) { const v = _ts.apply(this, arguments); return M33D.on ? v * .7 : v; };
    const sc = TK3.list[SK3D.idx], _up = sc.update; sc.update = function (st, t, dt) { const r = _up.apply(this, arguments); if (M33D.on) try { m33Frame(st, t, dt); } catch (e) { M33D.err = e; } return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { m33Hud(); } catch (e) { M33D.err = e; } return r; };
    // E: airstrike aimed on the battle map (m23d's sk3ACall hook turns the click into the 2D strike)
    const _sk = m2SupportKey; m2SupportKey = function () { if (!(M33D.on && SK3D.on)) return _sk.apply(this, arguments); if (!M2.active || !gameRunning || !player || player.destroyed) return; const left = SUP.cd - Date.now(); if (left > 0) { showRadioText('SUPPORT RE-ARMING — ' + Math.ceil(left / 1000) + 'S.'); return; } SK3A.m2sup = true; SK3A.title = 'AIRSTRIKE — CLICK THE TARGET (THE BOMBERS FLY NORTH OVER IT)'; sk3AOpen(true); };
})();
