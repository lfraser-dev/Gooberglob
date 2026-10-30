/* =====================================================
   MISSION 13 — "THE RAILWAY": Chindits behind Japanese lines, Burma, March 1944 (Pacific route 01)
   Runs on the commando engine (M8.lvl === 'burma'). Monsoon jungle, the river, the rail bridge,
   Mawlu station camp. Four charges: godown, radio hut, HQ basha, and the bridge girders (outdoors).
===================================================== */
const M13 = { failWhy: '' };
const M13W = 3200, M13H = 2200, M13_DUR = 660;
const M13_RIVER = { y0: 1180, y1: 1340, fords: [[640, 800], [2560, 2720]], bridge: [1556, 1644] };
const M13_FENCE = { x0: 900, y0: 280, x1: 2440, y1: 1060, gate: [1700, 1800], gaps: [['w', 600, 690], ['e', 880, 960]] };
const M13_DOORS = [
    { id: 'godown', name: 'AMMUNITION GODOWN', x: 1150, y: 606, side: 1, ex: 1150, ey: 640 },
    { id: 'radio', name: 'RADIO HUT', x: 2150, y: 546, side: 1, ex: 2150, ey: 580 },
    { id: 'hq', name: 'HQ BASHA', x: 2080, y: 926, side: 1, ex: 2080, ey: 960 }];
const M13_PAD = { x: 1700, y: 520, w: 80, h: 160 }; // the station water tower block (stands in for 'gus')
const M13_BRIDGE = { x: 1568, y: 1226, w: 64, h: 68 };
const M13_EXFIL = { x: 60, y: 1880, w: 460, h: 260 };
const M13_START = { x: 420, y: 2020 };
const M13_REINF = [[1200, 860], [1300, 860]];
const M13_GRASS = [[300, 1420, 420, 200], [820, 1500, 360, 240], [1300, 1440, 220, 300], [1900, 1420, 360, 220], [2500, 1520, 420, 260], [2300, 1800, 300, 200], [700, 1880, 300, 160], [400, 1100, 380, 60], [2700, 1080, 360, 80], [600, 300, 260, 300], [2550, 380, 300, 340]];
function m13InGrass(x, y) { for (let i = 0; i < M13_GRASS.length; i++) { const g = M13_GRASS[i]; if (x > g[0] && x < g[0] + g[2] && y > g[1] && y < g[1] + g[3]) return true; } return false; }
function m13GrassLOS(x0, y0, x1, y1) { // elephant grass: more than ~60px of it between two men and they can't see each other
    const d = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(d / 12); let inG = 0; for (let i = 1; i < n; i++) { const k = i / n; if (m13InGrass(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k)) inG += 12; } return inG < 60; }
function m13BuildOutside() {
    M8.obs = []; const F = M13_FENCE, fw = 10, R = M13_RIVER;
    // the river, deep except at the two fords and the bridge deck
    const wet = function (a, b) { if (b > a) m8Obs(a, R.y0, b - a, R.y1 - R.y0, 'river', true); };
    wet(-50, R.fords[0][0]); wet(R.fords[0][1], R.bridge[0]); wet(R.bridge[1], R.fords[1][0]); wet(R.fords[1][1], M13W + 50);
    m8Obs(R.bridge[0] - 14, R.y0 - 10, 14, R.y1 - R.y0 + 20, 'girder', true); m8Obs(R.bridge[1], R.y0 - 10, 14, R.y1 - R.y0 + 20, 'girder', true);
    // the bamboo stockade round the station camp
    const seg = function (x0, y0, x1, y1) { if (x0 === x1) m8Obs(x0 - fw / 2, Math.min(y0, y1), fw, Math.abs(y1 - y0), 'stockade'); else m8Obs(Math.min(x0, x1), y0 - fw / 2, Math.abs(x1 - x0), fw, 'stockade'); };
    seg(F.x0, F.y0, 1560, F.y0); seg(1640, F.y0, F.x1, F.y0); seg(F.x0, F.y1, 1560, F.y1); seg(1640, F.y1, F.gate[0], F.y1); seg(F.gate[1], F.y1, F.x1, F.y1);
    seg(F.x0, F.y0, F.x0, F.gaps[0][1]); seg(F.x0, F.gaps[0][2], F.x0, F.y1); seg(F.x1, F.y0, F.x1, F.gaps[1][1]); seg(F.x1, F.gaps[1][2], F.x1, F.y1);
    // buildings
    m8Obs(1000, 420, 300, 180, 'godown'); m8Obs(2050, 400, 200, 140, 'radiohut'); m8Obs(2200, 330, 30, 30, 'mast'); m8Obs(1950, 760, 260, 160, 'hq');
    m8Obs(1050, 780, 300, 110, 'barracks'); m8Obs(1660, 380, 30, 260, 'platform', true); m8Obs(M13_PAD.x, M13_PAD.y, 70, 70, 'watertower'); m8Obs(1700, 420, 140, 60, 'station');
    m8Obs(1380, 520, 60, 130, 'truck'); m8Obs(1300, 940, 120, 60, 'crates'); m8Obs(2300, 640, 70, 46, 'drums'); m8Obs(1680, 760, 40, 120, 'wagon');
    [[1120, 280], [2300, 280], [920, 1050], [2420, 1050]].forEach(function () {});
    // sandbagged MG pit at the north end of the bridge + a pillbox at the south end
    m8Obs(1500, 1110, 22, 60, 'sand', true); m8Obs(1680, 1110, 22, 60, 'sand', true); m8Obs(1560, 1400, 80, 40, 'pillbox');
    // the jungle: canopy masses round the edges, trees, bamboo, the elephant lines west of the camp
    const r = m12Rng(1313);
    for (let i = 0; i < 70; i++) { const x = r() * M13W, y = r() * 230; if (x > 1500 && x < 1700) continue; m8Obs(x - 30, y - 30, 60, 60, 'tree', false, { seed: i, big: 1 }); }
    for (let i = 0; i < 90; i++) { const x = r() * M13W, y = 260 + r() * (M13H - 300); if (x > 880 && x < 2460 && y < 1090) continue; if (y > 1150 && y < 1370) continue; if (Math.abs(x - 1600) < 90) continue; if (x < 600 && y > 1850) continue; if (m13InGrass(x, y)) continue; m8Obs(x - 26, y - 26, 52, 52, 'tree', false, { seed: i + 100 }); }
    for (let i = 0; i < 26; i++) { const x = r() * M13W, y = 1380 + r() * 760; if (Math.abs(x - 1600) < 120 || m13InGrass(x, y) || (x < 600 && y > 1850)) continue; m8Obs(x - 20, y - 20, 40, 40, 'bamboo', false, { seed: i }); }
    [[600, 760], [660, 860], [560, 900]].forEach(function (p, i) { m8Obs(p[0] - 40, p[1] - 22, 80, 44, 'elephant', false, { seed: i }); });
    // paddy dikes (low) on the south bank
    [[300, 1660, 900, 10], [300, 1780, 900, 10], [740, 1600, 10, 300]].forEach(function (b) { m8Obs(b[0], b[1], b[2], b[3], 'dike', true); });
    M8.lamps = [{ x: 1150, y: 640, r: 150 }, { x: 2150, y: 580, r: 140 }, { x: 2080, y: 960, r: 140 }, { x: 1600, y: 1150, r: 200 }, { x: 1600, y: 1420, r: 150 }, { x: 1750, y: 720, r: 170 }, { x: 1750, y: 1080, r: 130 }, { x: 1200, y: 930, r: 120 }];
}
function m13Populate() {
    const U = [], F = M13_FENCE, S = M13_START;
    U.push(m8Unit({ team: 'sq', kind: 'leader', x: S.x, y: S.y, ang: -.8, hp: 120, maxHp: 120, name: M8_NAMES[0] }));
    for (let i = 0; i < 4; i++) U.push(m8Unit({ team: 'sq', kind: 'cmdo', slot: i, gun: M8_SQUAD_GUNS[i], x: S.x + M8_FORM[i][0], y: S.y + M8_FORM[i][1], ang: -.8, hp: 85, maxHp: 85, name: M8_NAMES[i + 1] }));
    [[F.x0, F.y0, .7], [F.x1, F.y0, 2.45], [F.x0, F.y1, -.7], [F.x1, F.y1, -2.4], [1480, 1110, Math.PI / 2], [1720, 1440, -Math.PI / 2]].forEach(function (p, i) { U.push(m8Unit({ team: 'en', kind: 'tower', x: p[0], y: p[1], base: p[2], la: p[2], view: 330, fov: .42, hp: 50, maxHp: 50, ph: i * 1.9, state: 'post' })); });
    let n = 0; const pat = function (route, spd, gun) { U.push(m8Unit({ team: 'en', kind: 'sold', gun: gun || ((n++) % 2 ? 'mp40' : 'kar98'), x: route[0][0], y: route[0][1], route: route, ri: 0, spd: spd || 1 })); };
    pat([[880, 250], [2480, 250]], .95);                       // outside the north stockade
    pat([[950, 1100], [1500, 1100]], .9, 'mp40');              // river road west
    pat([[1720, 1100], [2400, 1100]], .9);                     // river road east
    pat([[860, 330], [860, 1040]], 1);                         // outside the west stockade
    pat([[2480, 330], [2480, 1040]], 1, 'mp40');               // outside the east stockade
    pat([[960, 340], [1500, 340], [1500, 720], [960, 720]], .85);   // round the godown
    pat([[1900, 340], [2400, 340], [2400, 700], [1900, 700]], .85, 'mp40'); // round the radio hut
    pat([[1880, 740], [2380, 740], [2380, 1000], [1880, 1000]], .85); // round the HQ
    pat([[1600, 160], [1600, 1150]], .9, 'mp40');              // along the line
    pat([[960, 960], [1500, 960]], .9);                        // barracks yard
    pat([[1480, 1420], [1480, 1560], [1720, 1560], [1720, 1420]], .9, 'mp40'); // south bridgehead
    pat([[400, 1400], [1300, 1400]], .9);                      // the south bank path
    pat([[1900, 1400], [2900, 1400]], .9, 'mp40');             // the south bank path east
    pat([[2200, 1700], [2900, 1700], [2900, 2000]], .85);      // jungle edge
    [[1130, 640, Math.PI / 2, 'kar98'], [1180, 640, Math.PI / 2, 'mp40'], [2120, 580, Math.PI / 2, 'kar98'], [2050, 960, Math.PI / 2, 'mp40'], [2110, 960, Math.PI / 2, 'kar98'], [1730, 1090, Math.PI / 2, 'kar98'], [1810, 1090, Math.PI / 2, 'mp40'], [1580, 1160, Math.PI / 2, 'kar98'], [1620, 1460, -Math.PI / 2, 'kar98'], [1750, 600, Math.PI, 'mp40']].forEach(function (s) { U.push(m8Unit({ team: 'en', kind: 'sold', gun: s[3], x: s[0], y: s[1], ang: s[2], base: s[2], state: 'post', view: 230 })); });
    U.push(m8Unit({ team: 'en', kind: 'mg', gun: 'mg42', x: 1530, y: 1100, ang: Math.PI / 2, base: Math.PI / 2, state: 'post', view: 320, fov: 1.3 }));
    U.push(m8Unit({ team: 'en', kind: 'mg', gun: 'mg42', x: 1590, y: 1380, ang: Math.PI / 2, base: Math.PI / 2, state: 'post', view: 300, fov: 1.3 }));
    U.push(m8Unit({ team: 'en', kind: 'dog', x: 1100, y: 1060, route: [[900, 1080], [1500, 1080]], ri: 0, spd: 1, hp: 45, maxHp: 45, view: 190, fov: 2.6, r: 8 }));
    M8.units = U;
}
function m13ClearRoutes() { const segs = []; M8.units.forEach(function (u) { if (u.team !== 'en' || !u.route) return; for (let i = 0; i < u.route.length; i++) { const a = u.route[i], b = u.route[(i + 1) % u.route.length]; segs.push([a[0], a[1], b[0], b[1]]); } });
    M8.obs = M8.obs.filter(function (o) { if (o.kind !== 'tree' && o.kind !== 'bamboo') return true; const cx = o.x + o.w / 2, cy = o.y + o.h / 2; return !segs.some(function (s) { return m8SegDist(s[0], s[1], s[2], s[3], cx, cy) < o.w / 2 + 22; }); }); }
function m13RoomDef(id) {
    const R = { id: id, style: 'burma', obs: [], target: null, units: [], exit: { x: 500, y: 650, w: 100, h: 50 }, bell: null, planted: false, cleared: false, lamps: [] };
    const box = function (x, y, w, h, k, low) { R.obs.push({ x: x, y: y, w: w, h: h, kind: k, low: !!low }); };
    box(0, 0, 1100, 40, 'wall'); box(0, 0, 40, 700, 'wall'); box(1060, 0, 40, 700, 'wall'); box(0, 660, 500, 40, 'wall'); box(600, 660, 500, 40, 'wall');
    const g = function (x, y, route, gun) { R.units.push(m8Unit({ team: 'en', kind: 'sold', gun: gun || 'mp40', x: x, y: y, route: route, view: 260, spd: .9 })); };
    const e = function (x, y, a, tool) { R.units.push(m8Unit({ team: 'en', kind: 'eng', tool: tool || 'clip', x: x, y: y, ang: a, base: a, state: 'work', hp: 60, maxHp: 60, view: 190, fov: 1.2 })); };
    if (id === 'godown') { R.title = 'DANYAKU-KO · AMMUNITION GODOWN'; [[100, 90], [330, 90], [560, 90], [790, 90]].forEach(function (p) { box(p[0], p[1], 180, 120, 'shells'); }); [[100, 330], [330, 330]].forEach(function (p) { box(p[0], p[1], 180, 100, 'shells'); }); box(790, 330, 180, 100, 'cases'); box(560, 470, 140, 60, 'desk');
        R.target = { x: 660, y: 380, name: 'SHELL STACKS' }; R.bell = { x: 1035, y: 560 }; R.lamps = [{ x: 260, y: 270, r: 230 }, { x: 700, y: 270, r: 230, flick: 1 }, { x: 600, y: 560, r: 200 }];
        g(80, 600, [[80, 600], [80, 270], [1000, 270], [1000, 600]], 'mp40'); g(600, 600, [[600, 600], [300, 600]], 'kar98'); e(640, 460, -Math.PI / 2, 'clip'); e(900, 470, Math.PI, 'clip'); e(250, 470, Math.PI / 2, 'wrench'); }
    if (id === 'radio') { R.title = 'MUSEN-SHITSU · SIGNALS HUT'; box(120, 70, 300, 80, 'radios'); box(600, 70, 360, 80, 'radios'); box(140, 330, 160, 90, 'generator'); box(460, 300, 220, 120, 'table'); box(820, 330, 160, 90, 'cases');
        R.target = { x: 270, y: 200, name: 'W/T TRANSMITTER' }; R.bell = { x: 1035, y: 300 }; R.lamps = [{ x: 270, y: 200, r: 240 }, { x: 760, y: 200, r: 240 }, { x: 560, y: 480, r: 220, flick: 1 }];
        g(1000, 600, [[1000, 600], [1000, 230], [520, 230], [520, 560]], 'mp40'); g(80, 600, [[80, 600], [80, 250], [400, 250]], 'kar98'); e(200, 170, -Math.PI / 2, 'clip'); e(700, 170, -Math.PI / 2, 'clip'); e(560, 440, Math.PI / 2, 'clip'); }
    if (id === 'hq') { R.title = 'SHIREIBU · HQ BASHA'; box(380, 220, 340, 160, 'maptable'); box(120, 90, 160, 80, 'desk'); box(820, 90, 160, 80, 'desk'); box(110, 450, 120, 120, 'safe'); box(880, 450, 120, 120, 'files'); box(470, 60, 160, 50, 'shrine', true);
        R.target = { x: 550, y: 410, name: 'OPERATIONS MAPS' }; R.bell = { x: 65, y: 330 }; R.lamps = [{ x: 550, y: 300, r: 260 }, { x: 200, y: 160, r: 200 }, { x: 900, y: 160, r: 200, flick: 1 }];
        g(1000, 600, [[1000, 600], [1000, 220], [760, 220], [760, 420]], 'mp40'); g(80, 600, [[80, 600], [80, 400], [330, 400]], 'kar98'); e(200, 190, Math.PI / 2, 'clip'); e(900, 190, Math.PI / 2, 'clip'); e(550, 200, Math.PI / 2, 'clip'); }
    return R;
}
/* ---------- the train clock, the monsoon, the bridge ---------- */
function m13Begin() { const now = performance.now(); Object.assign(M13, { t0: now, timer: M13_DUR, failWhy: '', bridge: false, plantB: 0, rain: [], bolt: 0, nextBolt: now + 9000, whistle: 0, warned2: false, warned60: false, trainAt: 0 }); M8.cam = { x: 0, y: 1500 }; m8Say('GLIDERS DOWN AND HIDDEN. THE BRIDGE AT MAWLU — THREE HUTS AND THE GIRDERS. THE SUPPLY TRAIN IS DUE IN ELEVEN MINUTES.', 7500); }
function m13Update(dt, now, L) {
    const M = M13; if (M8.failed || M8.done) return;
    if (M8.planted < 4 && !M.trainAt) { M.timer -= dt / 60; if (M.timer < 120 && !M.warned2) { M.warned2 = true; m8Say('THE TRAIN HAS LEFT INDAW — TWO MINUTES!', 4000); try { playTone(520, 420, .8, .05, 'square'); } catch (e) {} }
        if (M.timer < 60 && !M.warned60) { M.warned60 = true; m8Say('I CAN HEAR THE WHISTLE! ONE MINUTE!', 3500); try { playTone(900, 860, .9, .05, 'sine'); } catch (e) {} }
        if (M.timer <= 0) { M.timer = 0; M.trainAt = now; m8Say('THE TRAIN IS ACROSS — SIX HUNDRED TONS OF SHELLS FOR KOHIMA.', 4500); } }
    if (M.trainAt && now - M.trainAt > 5000 && !M8.failed) { M.failWhy = 'train'; m8Fail('train'); }
    // the bridge charge, set outdoors: hold F on the centre girders
    if (M8.scene === 'out' && !M.bridge) { const B = M13_BRIDGE, on = L.x > B.x - 10 && L.x < B.x + B.w + 10 && L.y > B.y - 10 && L.y < B.y + B.h + 10, f = M8.k.KeyF || M8.k.KeyE;
        if (on && f) { M.plantB += dt / 60; if (Math.random() < .25) M8.parts.push({ k: 'spark', x: B.x + 32 + (Math.random() - .5) * 30, y: B.y + 34 + (Math.random() - .5) * 30, vx: 0, vy: -.5, life: .6, decay: .05, scene: 'out' }); if (M.plantB >= 3.2) { M.bridge = true; M8.planted++; M.plantB = 0; m8Say('CHARGES ON THE GIRDERS. ' + (4 - M8.planted ? (4 - M8.planted) + ' TO GO.' : 'ALL FOUR SET — BACK TO THE GLIDER STRIP!'), 4000); try { playTone(700, 1100, .3, .06, 'triangle'); } catch (e) {} } }
        else M.plantB = Math.max(0, M.plantB - dt / 30); M.onBridge = on; }
    // the monsoon: thunder and lightning now and then
    if (now > M.nextBolt) { M.bolt = now; M.nextBolt = now + 12000 + Math.random() * 16000; setTimeout(function () { try { playExplosionSound(.5); playTone(60, 40, 1.6, .05, 'sawtooth'); } catch (e) {} }, 400 + Math.random() * 900); }
}
function m13Objective(R) {
    if (M13.trainAt) return 'THE TRAIN IS THROUGH...';
    if (M8.exfil) return 'ALL FOUR CHARGES SET — BACK TO THE GLIDER STRIP (SOUTH-WEST)';
    if (R) return R.planted ? 'CHARGE SET — OUT BY THE DOOR (SOUTH)' : R.cleared ? 'HUT CLEAR — HOLD [F] ON THE ' + R.target.name : 'KILL THEM BEFORE THEY RAISE THE ALARM';
    if (M13.onBridge && !M13.bridge) return 'HOLD [F] TO SET CHARGES ON THE GIRDERS';
    return 'DEMOLITION: GODOWN · RADIO HUT · HQ BASHA · THE BRIDGE  ' + M8.planted + '/4';
}
function m13MinimapBase(mx, my, mw, mh, sx, sy) {
    ctx.fillStyle = '#16240f'; ctx.fillRect(mx, my, mw, mh); ctx.fillStyle = '#2e4a5a'; ctx.fillRect(mx, my + M13_RIVER.y0 * sy, mw, (M13_RIVER.y1 - M13_RIVER.y0) * sy);
    ctx.fillStyle = '#3a3a28'; ctx.fillRect(mx + M13_FENCE.x0 * sx, my + M13_FENCE.y0 * sy, (M13_FENCE.x1 - M13_FENCE.x0) * sx, (M13_FENCE.y1 - M13_FENCE.y0) * sy);
    ctx.fillStyle = '#5a4a30'; ctx.fillRect(mx + 1596 * sx, my, 3, mh); ctx.fillStyle = 'rgba(160,170,80,.35)'; M13_GRASS.forEach(function (g) { ctx.fillRect(mx + g[0] * sx, my + g[1] * sy, g[2] * sx, g[3] * sy); });
    ctx.fillStyle = '#8a7a58'; M8.obs.forEach(function (o) { if (['godown', 'radiohut', 'hq', 'barracks', 'station'].indexOf(o.kind) >= 0) ctx.fillRect(mx + o.x * sx, my + o.y * sy, o.w * sx, o.h * sy); });
    ctx.fillStyle = M13.bridge ? '#8fd07a' : '#ffd24a'; ctx.fillRect(mx + 1592 * sx, my + 1250 * sy, 6, 6);
}
function m13DarkExtras(hole, lights, now) {
    const k = (now - M13.bolt) / 1000; if (k >= 0 && k < .5) { const a = (k < .08 || (k > .16 && k < .24)) ? .85 : .25 * (1 - k / .5); hole(M8.cam.x + 550, M8.cam.y + 350, 1400, a); lights.push([M8.cam.x + 550, M8.cam.y + 200, 900, '200,215,255', .12 * a]); }
    if (!M13.bridge) lights.push([1600, 1260, 60, '255,210,90', .12 + .08 * Math.sin(now / 200)]);
}
function m13Hud(now) {
    const M = M13, t = Math.max(0, M.timer), mm = Math.floor(t / 60), ss = Math.floor(t % 60), urgent = t < 120 && M8.planted < 4;
    ctx.save(); m8Panel(870, 12, 218, 78, urgent); ctx.textAlign = 'left'; ctx.font = '700 11px "Stardos Stencil", Impact'; ctx.fillStyle = '#d9c88c'; ctx.fillText('SUPPLY TRAIN · INDAW → MAWLU', 882, 30);
    ctx.font = '700 30px "Stardos Stencil", Impact, monospace'; ctx.fillStyle = M8.planted >= 4 ? '#8fd07a' : urgent ? (Math.floor(now / 300) % 2 ? '#ff4030' : '#ffd070') : '#efe6c6'; ctx.fillText(M8.planted >= 4 ? 'WIRED' : mm + ':' + String(ss).padStart(2, '0'), 882, 62);
    ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(239,230,198,.7)'; ctx.fillText(M.bridge ? 'BRIDGE CHARGES SET ✓' : 'BRIDGE NOT YET WIRED', 882, 80);
    if (M8.scene === 'out' && M.onBridge && !M.bridge && M.plantB > 0) { ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(450, 420, 200, 14); ctx.fillStyle = '#ffd24a'; ctx.fillRect(452, 422, 196 * Math.min(1, M.plantB / 3.2), 10); ctx.fillStyle = '#efe6c6'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.fillText('WIRING THE GIRDERS…', 550, 414); }
    if (M.trainAt) { const k = Math.min(1, (now - M.trainAt) / 1500); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 300, 1100, 80); ctx.textAlign = 'center'; ctx.font = '700 36px "Stardos Stencil", Impact'; ctx.fillStyle = '#ff5040'; ctx.fillText('THE TRAIN GOT THROUGH TO THE FRONT', 550, 352); }
    ctx.restore();
}
