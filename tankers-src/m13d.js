/* =====================================================
   CAMPAIGN MISSION 1 (THE LANDING) in 3D.
   The 2D mission logic is unchanged (2 bunkers to destroy, then push inland past 30 % of the map; 3 German tanks;
   2 allied Shermans; repair point), but when 3D is available the mission runs on a bigger 2400 x 1500 battlefield
   (positions are fractions of the canvas, so everything scales) and is drawn by the 3D skirmish renderer (sk3d):
   - `m13Build` (called from sk3BuildWorld) builds Omaha-style terrain: sea and surf at the bottom (+z), wet sand,
     shingle, the bluffs (cosmetic slopes exactly where the 2D hill barrier is) with a draw / road up the middle gap,
     the plateau with trenches; hedgehogs, stakes, wire, craters, wrecked landing craft and burning Shermans;
     the fleet offshore with landing craft bringing more men in; concrete casemates for the two objective bunkers
     (wrecked versions swap in when the 2D bunker is destroyed) and pillboxes firing MG tracers at the beach.
   - infantry (sk3inf): 3 American squads on the beach (they come back in fresh waves), 3 German squads dug in on the
     plateau (they hold their trenches and don't come back).
   - HUD: bunker names and health bars, and a PUSH INLAND marker once both are down.
   Turn it off with M13D.want = false (the old 2D mission plays).
===================================================== */
const M13D = { want: true, on: false, W: 2400, H: 1500, err: null, st: null };
function m13Ok() { return M13D.want && !!window.THREE && !TK3.failed; }
// height of the battlefield at a 2D game point (px)
function m13HPx(x, y) { const W = M13D.W, H = M13D.H, yW = H * .933, n = tk3Fbm(x * .004, y * .004, 3) - .44;
    let beach; if (y > yW) beach = -Math.min(3.2, (y - yW) * .006); else beach = (yW - y) * .0032 + Math.min(.55, (yW - y) * .012) + Math.max(0, 1 - Math.abs(y - 905) / 40) * .8;
    const sm = function (a, b, v) { const k = Math.max(0, Math.min(1, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
    const bluff = y >= H * .56 ? beach : beach + sm(H * .56, H * .375, y) * (13.5 - beach) + (y < H * .375 ? n * 1.6 : n * 2.2 * sm(H * .56, H * .45, y));
    const gapH = y >= H * .573 ? beach : beach + sm(H * .573, H * .28, y) * (12.6 - beach) + n * .6, gf = 1 - sm(300, 395, Math.abs(x - W / 2));
    return bluff + (gapH - bluff) * gf + (y < yW ? n * .35 : 0); }
function m13H(x3, z3) { return m13HPx(x3 / SK3D.S + M13D.W / 2, z3 / SK3D.S + M13D.H / 2); }
function m13Build(st) { const S = TK3.scene, R = tk3Rand(1944), W = M13D.W, H = M13D.H, X = function (px) { return (px - W / 2) * SK3D.S; }, Z = function (py) { return (py - H / 2) * SK3D.S; };
    st.map = 'beach'; const sun = new THREE.Vector3(.35, .32, -.6).normalize(); st.sun = sun; SK3D.tall = []; SK3D.mats = { plain: tk3Std('#ffffff', .9, 0, { vertexColors: true }), dark: tk3Std('#2e2a26', .95) };
    TK3.grade = { bloom: .22, expo: 1, sat: .8, con: 1.1, lift: [.012, .012, .016], th: 2.2, vig: .32, grain: .03, dirt: .06, tint: [.98, 1, 1.04] }; TK3.sunDir = sun; TK3.rayK = .08; TK3.rayCol = tk3C('#ffe6c4');
    tk3Sky({ top: '#5a6676', hor: '#c8c0ae', bot: '#7a766a', sunDir: sun, sunCol: '#ffe6c4', sunI: 2, glow: .7, glowCol: '#e8c090', cov: .78, cLit: '#d0c8bc', cDark: '#5a5c66', cScale: 1, wind: [.003, .001] }); tk3Fog('#a8a69c', .0042);
    st.hgt = m13H;
    // ---- ground ----
    const cf = function (x, z, h, ny, c) { const px = x / SK3D.S + W / 2, py = z / SK3D.S + H / 2, n1 = tk3Noise(x * .05, z * .05), n2 = tk3Noise(x * .21 + 3, z * .21);
        if (py > H * .6) { c.set('#a49676'); if (h < .55) c.lerp(tk3C('#6a604c'), Math.min(1, (.55 - h) * 1.6)); if (Math.abs(py - 905) < 40) c.lerp(tk3C('#8a867c'), .75); c.multiplyScalar(.9 + n2 * .16); }
        else { c.set(n1 > .5 ? '#66703e' : '#6e7646'); if (ny < .82) c.lerp(tk3C('#7a6e52'), Math.min(1, (.82 - ny) * 3)); c.multiplyScalar(.84 + n1 * .26 + n2 * .06); if (py > H * .5 && py < H * .6) c.lerp(tk3C('#8e8466'), .4); }
        if (Math.abs(px - W / 2) < 46 && py < H * .62 && py > H * .05) c.lerp(tk3C('#857862'), .75); };
    const ground = new THREE.Mesh(tk3Terrain(330, 300, 220, 200, m13H, cf), tk3Std('#ffffff', .95, 0, { vertexColors: true })); ground.receiveShadow = true; S.add(ground);
    tk3Water({ deep: '#1a2c2e', shal: '#4c6e66', skyH: '#b0aea2', skyT: '#5e6a78', sunDir: sun, sunCol: '#ffe6c4', sunI: 1.3, amp: .35, len: 11, steep: .55, dir: -1.57, spread: .8, n: 6, shine: 150, foam: .7, chop: 1.1, size: 700, seg: 240 });
    st.L = tk3Lights({ sky: '#a8b0bc', ground: '#6e6656', hemi: 1, dir: sun, dirCol: '#ffe8cc', dirI: 2.1, shadowSize: 42 }); st.L.dir.shadow.mapSize.set(2048, 2048); st.L.dir.shadow.camera.far = 400; st.L.dir.shadow.camera.updateProjectionMatrix();
    const rim = new THREE.DirectionalLight(tk3C('#9aaccc'), .45); rim.position.set(-sun.x * 50, 25, -sun.z * 50); S.add(rim); st.fill = new THREE.DirectionalLight(tk3C('#fff2e0'), .5); S.add(st.fill); S.add(st.fill.target);
    const mat = { con: tk3Std('#8a8a80', .92), conD: tk3Std('#4a4a44', .95), dark: tk3Std('#0b0b0a', 1), iron: tk3Std('#3a2c22', .7, .5), wood: tk3Std('#5a4630', .92), earth: tk3Std('#6a6448', .97), sand: tk3Std('#9a8a6a', .97), wire: new THREE.LineBasicMaterial({ color: 0x2a2620 }) };
    // ---- the objective bunkers (casemates facing the sea) ----
    st.m13b = (campaignBunkers || []).map(function (b, i) { const x = X(b.x), z = Z(b.y), y = m13H(x, z), g = new THREE.Group(), w = b.w * SK3D.S * .92, d = b.h * SK3D.S * .9; g.position.set(x, y - .4, z); S.add(g);
        const body = tk3Mesh(tk3Box(w, 5.4, d), mat.con, 0, 2.7, 0, g, true, true); const roof = tk3Mesh(tk3Box(w + 1.2, .8, d + 1.6), mat.con, 0, 5.6, .3, g, true, true); tk3Mesh(tk3Box(w * .55, 2, .6), mat.dark, 0, 2.9, d / 2 + .02, g); const gun = tk3Mesh(tk3Cyl(.22, .26, 6, 10), mat.conD, 0, 2.9, d / 2 + 2.5, g); gun.rotation.x = Math.PI / 2;
        // earth banked over the back and sides
        const bank = tk3Mesh(tk3Box(w + 6, 4, d * .8), mat.earth, 0, 1.6, -d * .5, g, false, true); bank.rotation.x = -.35; [-1, 1].forEach(function (s) { const sb = tk3Mesh(tk3Box(3.5, 4, d + 2), mat.earth, s * (w / 2 + 1.4), 1.4, 0, g, false, true); sb.rotation.z = s * .45; });
        const ruin = new THREE.Group(); g.add(ruin); ruin.visible = false; const RR = tk3Rand(70 + i); for (let k = 0; k < 14; k++) { const s = 1 + RR() * 3, c = tk3Mesh(tk3Box(s, s * .6, s * .9), RR() < .5 ? mat.con : mat.conD, (RR() - .5) * w, s * .3, (RR() - .5) * d, ruin, true, true); c.rotation.set(RR(), RR() * 3, RR()); }
        const wall = tk3Mesh(tk3Box(w * .9, 2.6, d * .8), mat.conD, 0, 1.3, -.5, ruin, true, true); wall.rotation.z = .08; const slab = tk3Mesh(tk3Box(w * .7, .7, d * .8), mat.con, -w * .1, 2.4, .5, ruin, true, true); slab.rotation.set(.25, .1, -.2);
        SK3D.tall.push([x - w / 2 - 1, z - d / 2 - 1, x + w / 2 + 1, z + d / 2 + 1, y + 6.2]);
        return { b: b, g: g, intact: [body, roof, gun], ruin: ruin, slit: new THREE.Vector3(x, y + 2.5, z + d / 2 + .5), top: new THREE.Vector3(x, y + 8, z), dead: false }; });
    // pillboxes along the bluff edge (cosmetic, firing at the beach)
    st.m13p = [[.13, .53], [.31, .55], [.69, .55], [.87, .53], [.39, .31], [.61, .31]].map(function (q) { const x = X(W * q[0]), z = Z(H * q[1]), y = m13H(x, z), g = new THREE.Group(); g.position.set(x, y - .3, z); S.add(g); tk3Mesh(new THREE.CylinderGeometry(2.4, 2.8, 2.4, 10), mat.con, 0, 1.2, 0, g, true, true); tk3Mesh(tk3Box(2.2, .35, .4), mat.dark, 0, 1.5, 2.45, g); return new THREE.Vector3(x, y + 1.4, z + 2.6); });
    // trenches and sandbags on the plateau
    const sb = []; for (let i = 0; i < 140; i++) { const px = W * (.05 + R() * .9), py = H * (.39 + Math.sin(px * .01) * .012), x = X(px), z = Z(py); if (Math.abs(px - W / 2) < 120) continue; const b = tk3Box(1.1, .45, .6); tk3Xf(b, x, m13H(x, z) + .25, z, 0, R() * .4, 0); sb.push(b); } tk3Mesh(tk3Merge(sb), mat.sand, 0, 0, 0, S, true, true);
    const tr = []; for (let i = 0; i < 60; i++) { const px = W * (.04 + i / 60 * .92), py = H * (.405 + Math.sin(px * .01) * .012), x = X(px), z = Z(py); if (Math.abs(px - W / 2) < 120) continue; const b = tk3Box(4.2, .2, 1.6); tk3Xf(b, x, m13H(x, z) + .02, z); tr.push(b); } tk3Mesh(tk3Merge(tr), tk3Std('#2a2418', 1), 0, 0, 0, S, false, true);
    // beach obstacles (visual only, like the 2D mission)
    for (let i = 0; i < 120; i++) { const px = W * (.02 + R() * .96), py = H * (.66 + R() * .26); if (Math.abs(py - H * .82) < 80 && Math.abs(px - W / 2) < 330) continue; const x = X(px), z = Z(py); if (R() < .72) { const h = tk3Hedgehog(mat.iron); h.position.set(x, m13H(x, z) - .25, z); h.rotation.y = R() * 3; h.scale.setScalar(1.15); S.add(h); } else { const p = tk3Mesh(tk3Cyl(.13, .15, 3.4, 6), mat.wood, x, m13H(x, z) + 1, z, S, true); p.rotation.x = .55; p.rotation.y = R() * .4; } }
    // barbed wire along the foot of the bluff (not across the draw)
    const wp = []; for (let px = 30; px < W - 30; px += 22) { if (Math.abs(px - W / 2) < 360) continue; const py = H * .6 + Math.sin(px * .05) * 8, x = X(px), z = Z(py), y = m13H(x, z); wp.push(x, y + .9, z, X(px + 22), m13H(X(px + 22), z) + .7 + Math.sin(px) * .2, z); wp.push(x, y + .4, z + .3, X(px + 22), m13H(X(px + 22), z) + .5, z + .3); } const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3)); S.add(new THREE.LineSegments(wg, mat.wire));
    // craters
    const cr = new THREE.MeshBasicMaterial({ color: 0x2a2418, transparent: true, opacity: .55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }); for (let i = 0; i < 26; i++) { const px = W * (.04 + R() * .92), py = H * (.62 + R() * .28), x = X(px), z = Z(py), m = new THREE.Mesh(new THREE.CircleGeometry(1.4 + R() * 1.6, 16).rotateX(-Math.PI / 2), cr); m.position.set(x, m13H(x, z) + .06, z); S.add(m); }
    // wrecked landing craft in the surf and burning Shermans on the sand
    st.fires = st.fires || []; [[.12, .945, .3], [.33, .95, -.2], [.64, .948, .15], [.85, .95, -.35]].forEach(function (q, i) { const b = tk3LCA(), x = X(W * q[0]), z = Z(H * q[1]); b.position.set(x, -.2, z); b.rotation.set(.04, -Math.PI / 2 + q[2], (i % 2 ? .05 : -.06)); b.userData.ramp.rotation.z = -1.4; S.add(b); if (i % 2) st.fires.push([x, .8, z - 2, 1.1, 1, 1]); });
    [[.2, .77], [.79, .72]].forEach(function (q) { const m = tk3TankModel('sherman', 'american'), x = X(W * q[0]), z = Z(H * q[1]); m.g.position.set(x, m13H(x, z), z); m.g.rotation.y = 1.4 + R(); m.g.traverse(function (o) { if (o.isMesh && o.material && o.material.color) { o.material = o.material.clone(); o.material.color.multiplyScalar(.28); } }); if (m.turret) m.turret.rotation.y = .7; S.add(m.g); st.fires.push([x, m13H(x, z) + 2.4, z, 1.3, 1, 1]); });
    // the fleet offshore and boats bringing in more men
    st.m13s = []; [[-90, 175, 140], [40, 210, 120], [150, 160, 110], [-170, 240, 160], [95, 300, 175]].forEach(function (q, i) { const g = i % 2 ? tk3Merchant({}) : tk3Destroyer({ len: q[2] }); S.add(g); st.m13s.push({ g: g, x: q[0], z: q[1], len: q[2], beam: i % 2 ? 9 : 8 }); });
    st.m13l = []; for (let i = 0; i < 5; i++) { const b = tk3LCA(); S.add(b); st.m13l.push({ g: b, x: -90 + i * 45 + R() * 10, ph: i * 7 + R() * 4 }); }
    // smoke over the beach
    for (let i = 0; i < 12; i++) st.smoke && st.smoke.emit({ x: X(W * R()), y: 8 + R() * 10, z: Z(H * (.35 + R() * .5)), vx: .4, vy: .15, vz: .3, life: 1e9, s0: 20 + R() * 24, c0: [.42, .41, .39, .14], c1: [.42, .41, .39, .14] });
    M13D.st = st; }
// per frame: water, ships, boats, bunker states, MG fire from the bluffs
function m13Frame(st, t, dt) { if (!st.m13b) return; const r = Math.random;
    if (TK3.water) { TK3.water.userData.u.time.value = t; tk3WaterFollow(TK3.cam); }
    st.m13s.forEach(function (s, i) { tk3Float(s.g, s.len, s.beam, s.x, s.z, -Math.PI / 2 + .2 * (i % 3 - 1), t, 2); });
    st.m13l.forEach(function (b) { const c = 34, k = ((t + b.ph) % c) / c, z = 190 - Math.min(1, k * 1.25) * 122; tk3Float(b.g, 12, 1.6, b.x, z, -Math.PI / 2, t + b.ph, k > .8 ? .4 : 3); b.g.position.y += .35; b.g.userData.ramp.rotation.z = k > .82 ? -Math.min(1.45, (k - .82) * 20) : 0; b.g.visible = k < .97; });
    st.m13b.forEach(function (q) { if (q.b.destroyed && !q.dead) { q.dead = true; q.intact.forEach(function (m) { m.visible = false; }); q.ruin.visible = true; st.fires.push([q.top.x, q.top.y - 5, q.top.z, 2, 1, 1]); st.fires.push([q.top.x + 5, q.top.y - 6, q.top.z + 2, 1.3, 1, 1]); const i = SK3D.tall.findIndex(function (b) { return Math.abs((b[0] + b[2]) / 2 - q.top.x) < 1; }); if (i >= 0) SK3D.tall.splice(i, 1); } });
    // MG tracers from the slits towards the beach
    if (t > (st.m13nt || 0)) { st.m13nt = t + .08 + r() * .14; const src = st.m13b.filter(function (q) { return !q.dead; }).map(function (q) { return q.slit; }).concat(st.m13p); const s = src[(r() * src.length) | 0]; if (s) { const tg = new THREE.Vector3(s.x + (r() - .5) * 60, .5 + r() * 2, s.z + 30 + r() * 60), d = tg.sub(s).normalize(); st.trac.emit({ x: s.x, y: s.y, z: s.z, vx: d.x * 260, vy: d.y * 260, vz: d.z * 260, life: .6, len: 7, w: .16, c: [9, 5, 1.6, 1] }); } } }
// per sim step: the bunkers' MGs pin and hit American infantry in the open
function m13Step() { if (!M13D.on || !gameRunning || typeof SK3I === 'undefined' || !SK3I.on) return; M13D.k = (M13D.k || 0) + 1; if (M13D.k % 150) return;
    (campaignBunkers || []).forEach(function (b) { if (b.destroyed) return; const near = SK3I.men.filter(function (m) { return !m.dead && m.team === 0 && Math.hypot(m.x - b.x, m.y - b.y) < 900; }); if (!near.length || Math.random() > .45) return; const m = near[(Math.random() * near.length) | 0]; if (m.sq.escort && Math.random() < .6) return; m.crouch = 1; if (Math.random() < .3) sk3IKill(m, null, 'mg'); }); }
function m13Infantry() { if (typeof SK3I === 'undefined') return; SK3I.on = true; SK3I.men = []; SK3I.squads = []; SK3I.fx = []; const W = M13D.W, H = M13D.H;
    [[.3, .86], [.5, .87], [.7, .86]].forEach(function (q, k) { const at = [W * q[0], H * q[1]], sq = sk3ISquad(0, k, at); sq.home = [W * q[0], H * .9]; if (k === 1) sq.escort = true; });
    [[.29, .4], [.5, .3], [.71, .4]].forEach(function (q, k) { const at = [W * q[0], H * q[1]], sq = sk3ISquad(1, k, at); sq.hold = at; sq.noRespawn = true; }); }
// HUD: bunker labels and the push-inland marker
function m13Hud() { if (!M13D.on || !SK3D.hud || !TK3.cam || SK3D.map || !M13D.st || !M13D.st.m13b) return; const g = SK3D.hud.getContext('2d'), v = new THREE.Vector3();
    M13D.st.m13b.forEach(function (q) { if (q.b.destroyed) return; v.copy(q.top).project(TK3.cam); if (v.z >= 1) return; const x = Math.max(60, Math.min(1040, (v.x + 1) * 550)), y = Math.max(70, Math.min(640, (1 - v.y) * 350)), k = q.b.hp / q.b.maxHp;
        g.textAlign = 'center'; g.font = 'bold 12px "Special Elite", monospace'; g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x - 52, y - 30, 104, 30); g.fillStyle = '#ffb070'; g.fillText('◆ ' + String(q.b.name).toUpperCase(), x, y - 17); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(x - 44, y - 11, 88, 6); g.fillStyle = k > .5 ? '#ffb070' : '#ff6a4a'; g.fillRect(x - 44, y - 11, 88 * k, 6); });
    if (campaignObjectiveStage >= 2) { v.set(0, m13H(0, (M13D.H * .27 - M13D.H / 2) * SK3D.S) + 4, (M13D.H * .27 - M13D.H / 2) * SK3D.S).project(TK3.cam); if (v.z < 1) { const x = Math.max(60, Math.min(1040, (v.x + 1) * 550)), y = Math.max(70, Math.min(640, (1 - v.y) * 350)); g.textAlign = 'center'; g.font = 'bold 14px "Special Elite", monospace'; g.fillStyle = '#9be08a'; g.fillText('▼ PUSH INLAND', x, y); } } }
function m13Stop() { if (!M13D.on) return; M13D.on = false; M13D.st = null; try { if (SK3D.on) sk3Stop(); } catch (e) {} SK3D.want = false; if (typeof SK3I !== 'undefined') { SK3I.on = false; SK3I.men = []; SK3I.squads = []; } SKIRMISH_WORLD_WIDTH = 2400; SKIRMISH_WORLD_HEIGHT = 1500; }
(function () {
    const _scm = startCampaignMission; startCampaignMission = function () { m13Stop(); if (selectedGameMode === 'campaign' && campaignMission === 1 && m13Ok()) { M13D.on = true; SK3D.want = true; }
        const r = _scm.apply(this, arguments); if (M13D.on) { try { sk3Start(); m13Infantry(); setTimeout(function () { try { showRadioText('3D — W/S DRIVE, A/D TURN, MOUSE AIMS · R REPAIR · 1/2/3 AMMO · Q MG · G ARTILLERY · B BINOCULARS', true); } catch (e) {} }, 5200); } catch (e) { M13D.err = e; m13Stop(); } } return r; };
    const _ap = applyPointControlCanvasSize; applyPointControlCanvasSize = function () { const r = _ap.apply(this, arguments); if (M13D.on && selectedGameMode === 'campaign' && campaignMission === 1) { SKIRMISH_WORLD_WIDTH = M13D.W; SKIRMISH_WORLD_HEIGHT = M13D.H; canvas.width = M13D.W; canvas.height = M13D.H; const vp = document.getElementById('canvasViewport'); if (vp) { vp.style.width = SKIRMISH_VIEW_WIDTH + 'px'; vp.style.height = SKIRMISH_VIEW_HEIGHT + 'px'; } canvas.classList.add('skirmishExpanded'); } return r; };
    const _ccm = createCampaignMap; createCampaignMap = function () { if (!(M13D.on && campaignMission === 1)) return _ccm.apply(this, arguments); const W = M13D.W, H = M13D.H; const ob = function (x, y, w, h, type) { obstacles.push({ x: x, y: y, width: w, height: h, type: type }); }; // already in battlefield pixels (addObstacle would rescale them)
        obstacles = []; campaignBunkers.forEach(function (b) { if (!b.destroyed) ob(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 'campaignBunker'); }); ob(0, H * .364, W * .355, H * .193, 'campaignHillBarrier'); ob(W * .645, H * .364, W * .355, H * .193, 'campaignHillBarrier'); };
    ['startCampaignLanding', 'openCampaign', 'startMission2', 'returnToMenu'].forEach(function (n) { if (typeof window[n] !== 'function') return; const f = window[n]; window[n] = function () { m13Stop(); return f.apply(this, arguments); }; });
    // field repairs anywhere on the 3D beach (the 2D mission only allowed them at its repair point)
    const _rep = startPlayerRepair; startPlayerRepair = function () { if (!M13D.on) return _rep.apply(this, arguments); const st = campaignRepairStation; campaignRepairStation = player ? { x: player.x, y: player.y, radius: 9999 } : st; try { return _rep.apply(this, arguments); } finally { campaignRepairStation = st; } };
    const _tod = sk3Tod, _wx = sk3Wx; sk3Tod = function () { return M13D.on ? 'day' : _tod(); }; sk3Wx = function () { return M13D.on ? 'clear' : _wx(); };
    const sc = TK3.list[SK3D.idx], _up = sc.update; sc.update = function (st, t, dt) { const r = _up.apply(this, arguments); if (M13D.on) try { m13Frame(st, t, dt); } catch (e) { M13D.err = e; } return r; };
    const _us = updateShells; updateShells = function () { const r = _us.apply(this, arguments); try { m13Step(); } catch (e) { M13D.err = e; } return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { m13Hud(); } catch (e) {} return r; };
})();
