/* =====================================================
   MISSION 12 — OPERATION HYDRA: Peenemünde, the V-2 test stand, a launch countdown and the RAF overhead
   Runs on the commando engine (M8.lvl === 'peene'): squad, armoury, rooms, charges.
===================================================== */
const M12 = { failWhy: '' };
const M12_PAD = { x: 1150, y: 330, w: 60, h: 60 };
const M12_ARENA = { cx: 1180, cy: 400, rx: 330, ry: 225, open: [1.2, 1.94] }; // gap in the earth wall to the south
const M12_FENCE = { x0: 180, y0: 120, x1: 2220, y1: 1040, gate: [1110, 1250], gaps: [['w', 690, 760], ['e', 820, 890]] };
const M12_DOORS = [
    { id: 'lox', name: 'LOX PLANT', x: 485, y: 486, side: 1, ex: 485, ey: 516 },
    { id: 'hall', name: 'ASSEMBLY HALL', x: 515, y: 916, side: 1, ex: 515, ey: 946 },
    { id: 'bunker', name: 'LAUNCH BUNKER', x: 1470, y: 776, side: 1, ex: 1470, ey: 806 },
    { id: 'lab', name: 'GUIDANCE LAB', x: 1920, y: 456, side: 1, ex: 1920, ey: 486 }];
const M12_REINF = [[1900, 930], [2000, 930]];
const M12_EXFIL = { x: 1880, y: 1250, w: 420, h: 130 };
const M12_START = { x: 260, y: 1300 };
const M12_DUR = 720; // seconds to launch
const M12S = 1.5; // the level is laid out in 2400x1500 design units, then everything is scaled up into a 3600x2250 world
let M12X = null;  // world-space copies of the layout constants
function m12Scale() {
    const S = M12S, sp = function (p) { return [p[0] * S, p[1] * S]; }, sr = function (o) { return Object.assign({}, o, { x: o.x * S, y: o.y * S, w: o.w * S, h: o.h * S }); };
    M12.dObs = M8.obs.map(function (o) { return Object.assign({}, o); }); M12.dLamps = M8.lamps.map(function (l) { return Object.assign({}, l); });
    M8.obs.forEach(function (o) { o.x *= S; o.y *= S; o.w *= S; o.h *= S; });
    M8.lamps.forEach(function (l) { l.x *= S; l.y *= S; l.r *= S; });
    M8.units.forEach(function (u) { u.x *= S; u.y *= S; if (u.route) u.route = u.route.map(sp); });
    const F = M12_FENCE;
    M12X = { pad: sr(M12_PAD), exfil: sr(M12_EXFIL), reinf: M12_REINF.map(sp),
        fence: { x0: F.x0 * S, y0: F.y0 * S, x1: F.x1 * S, y1: F.y1 * S, gate: [F.gate[0] * S, F.gate[1] * S], gaps: F.gaps.map(function (g) { return [g[0], g[1] * S, g[2] * S]; }) },
        doors: M12_DOORS.map(function (d) { return Object.assign({}, d, { x: d.x * S, y: d.y * S, ex: d.ex * S, ey: d.ey * S }); }) };
    M8_GUS = M12X.pad; M8_DOORS = M12X.doors; M8_FENCE = M12X.fence; M8.reinfPts = M12X.reinf;
}
function m12ArenaWall() { const A = M12_ARENA, out = []; for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2; if (a > A.open[0] && a < A.open[1]) continue; out.push([A.cx + Math.cos(a) * A.rx, A.cy + Math.sin(a) * A.ry]); } return out; }
function m12BuildOutside() {
    M8.obs = []; const F = M12_FENCE, fw = 10;
    m8Obs(-50, 1390, 2500, 160, 'sea', true); // the Baltic
    const seg = function (x0, y0, x1, y1) { if (x0 === x1) m8Obs(x0 - fw / 2, Math.min(y0, y1), fw, Math.abs(y1 - y0), 'fence', true); else m8Obs(Math.min(x0, x1), y0 - fw / 2, Math.abs(x1 - x0), fw, 'fence', true); };
    seg(F.x0, F.y0, F.x1, F.y0); seg(F.x0, F.y1, F.gate[0], F.y1); seg(F.gate[1], F.y1, F.x1, F.y1);
    seg(F.x0, F.y0, F.x0, F.gaps[0][1]); seg(F.x0, F.gaps[0][2], F.x0, F.y1); seg(F.x1, F.y0, F.x1, F.gaps[1][1]); seg(F.x1, F.gaps[1][2], F.x1, F.y1);
    // the earth wall of Prüfstand VII
    m12ArenaWall().forEach(function (p) { m8Obs(p[0] - 30, p[1] - 30, 60, 60, 'berm'); });
    m8Obs(M12_PAD.x, M12_PAD.y, M12_PAD.w, M12_PAD.h, 'pad'); m8Obs(1240, 300, 40, 110, 'gantry'); m8Obs(1060, 470, 60, 30, 'ltruck');
    // buildings
    m8Obs(330, 230, 310, 240, 'loxplant'); m8Obs(650, 250, 70, 70, 'loxtank'); m8Obs(650, 340, 70, 70, 'loxtank');
    m8Obs(330, 620, 370, 280, 'hall');
    m8Obs(1380, 640, 180, 120, 'bunker');
    m8Obs(1760, 220, 320, 220, 'lab');
    m8Obs(1760, 760, 320, 140, 'barracks'); m8Obs(1880, 600, 60, 60, 'radar');
    // motor pool, a V-2 on its Meillerwagen by the railway, flak pits, crates, drums
    m8Obs(880, 830, 60, 130, 'truck'); m8Obs(960, 830, 60, 130, 'truck'); m8Obs(1080, 860, 130, 56, 'halftrack');
    m8Obs(640, 975, 260, 36, 'meiller');
    [[840, 560], [1640, 480], [1040, 160]].forEach(function (p) { m8Obs(p[0] - 46, p[1] - 46, 92, 92, 'flak'); });
    [[800, 420, 'crates'], [1320, 900, 'crates'], [1600, 900, 'drums'], [800, 640, 'drums'], [1620, 980, 'crates'], [420, 1075, 'drums']].forEach(function (b) { m8Obs(b[0], b[1], 70, 46, b[2]); });
    [[1100, 1100, 120, 22], [1240, 1100, 120, 22], [1590, 680, 16, 90]].forEach(function (b) { m8Obs(b[0], b[1], b[2], b[3], 'sand', true); });
    // pine woods between the wire and the dunes, and outside the fence
    for (let i = 0; i < 90; i++) { const x = m8R(i + 700) * 2400, y = 1060 + m8R(i + 760) * 170; if (Math.abs(x - 1180) < 120) continue; if (x < 360 && y > 1180) continue; if (x > 1860) continue; m8Obs(x - 22, y - 22, 44, 44, 'tree', false, { seed: i + 700, pine: 1 }); }
    for (let i = 0; i < 40; i++) { const side = i % 2, x = side ? 2240 + m8R(i + 800) * 140 : 20 + m8R(i + 800) * 140, y = 140 + m8R(i + 840) * 880; m8Obs(x - 22, y - 22, 44, 44, 'tree', false, { seed: i + 800, pine: 1 }); }
    // beach obstacles: hedgehogs and coils of wire
    [[500, 1330], [760, 1350], [1050, 1320], [1400, 1345], [1650, 1330]].forEach(function (p) { m8Obs(p[0] - 14, p[1] - 14, 28, 28, 'hedgehog'); });
    [[600, 1260, 140], [1300, 1260, 160]].forEach(function (p) { m8Obs(p[0], p[1], p[2], 12, 'coil', true); });
    M8.lamps = [{ x: 1180, y: 300, r: 260 }, { x: 1180, y: 560, r: 180 }, { x: 485, y: 520, r: 150 }, { x: 515, y: 950, r: 150 }, { x: 1470, y: 810, r: 140 }, { x: 1920, y: 490, r: 150 }, { x: 1180, y: 1060, r: 180 }, { x: 1900, y: 940, r: 150 }, { x: 980, y: 760, r: 130 }];
}
function m12Populate() {
    const U = [], F = M12_FENCE, S = M12_START;
    U.push(m8Unit({ team: 'sq', kind: 'leader', x: S.x, y: S.y, ang: -.8, hp: 120, maxHp: 120, name: M8_NAMES[0] }));
    for (let i = 0; i < 4; i++) U.push(m8Unit({ team: 'sq', kind: 'cmdo', slot: i, gun: M8_SQUAD_GUNS[i], x: S.x + M8_FORM[i][0], y: S.y + M8_FORM[i][1], ang: -.8, hp: 85, maxHp: 85, name: M8_NAMES[i + 1] }));
    [[F.x0, F.y0, .7], [F.x1, F.y0, 2.45], [F.x0, F.y1, -.7], [F.x1, F.y1, -2.4], [1180, 150, Math.PI / 2], [700, 1040, -1.2]].forEach(function (p, i) { U.push(m8Unit({ team: 'en', kind: 'tower', x: p[0], y: p[1], base: p[2], la: p[2], view: 360, fov: .42, hp: 50, maxHp: 50, ph: i * 1.9, state: 'post' })); });
    let n = 0; const pat = function (route, spd, gun, extra) { U.push(m8Unit(Object.assign({ team: 'en', kind: 'sold', gun: gun || ((n++) % 2 ? 'mp40' : 'kar98'), x: route[0][0], y: route[0][1], route: route, ri: 0, spd: spd || 1 }, extra || {}))); };
    pat([[240, 160], [2160, 160]], .95, 'mp40');                     // north wire
    pat([[240, 1000], [1060, 1000], [1060, 960], [240, 960]], .9);    // south wire west
    pat([[1300, 990], [2160, 990]], .9, 'mp40');                      // south wire east
    pat([[250, 200], [250, 980]], 1);                                  // west wire
    pat([[2150, 200], [2150, 980]], 1, 'mp40');                        // east wire
    pat([[300, 560], [740, 560], [740, 960], [300, 960]], .85);       // round the hall
    pat([[300, 200], [760, 200], [760, 500], [300, 500]], .85, 'mp40'); // round the LOX plant
    pat([[1180, 650], [1600, 620], [1700, 520], [1600, 820], [1180, 700]], .9); // bunker loop
    pat([[1720, 200], [2120, 200], [2120, 520], [1720, 520]], .85);   // lab loop
    pat([[850, 720], [1300, 960], [1000, 990]], .9, 'mp40');            // motor pool
    pat([[1000, 360], [1000, 520], [1360, 520], [1360, 300]], .75, 'kar98'); // inside the test stand
    pat([[800, 1120], [1700, 1120]], .9, 'kar98');                     // the dunes
    pat([[400, 1200], [1500, 1200]], .95, 'mp40');                     // beach road
    pat([[1700, 1060], [2300, 1060], [2300, 1300], [1700, 1300]], .9, 'mp40'); // the east beach, where the MTB waits
    pat([[1520, 230], [1700, 230], [1700, 560]], .85, 'kar98');            // between the stand and the lab
    pat([[400, 1100], [400, 1330], [900, 1330]], .9, 'kar98');             // the landing beach
    pat([[60, 300], [60, 1000]], .9, 'mp40');                              // outside the west wire
    // dogs
    U.push(m8Unit({ team: 'en', kind: 'dog', x: 600, y: 160, route: [[600, 160], [1900, 160]], ri: 0, spd: 1, hp: 45, maxHp: 45, view: 190, fov: 2.6, r: 8 }));
    U.push(m8Unit({ team: 'en', kind: 'dog', x: 1100, y: 1080, route: [[400, 1080], [1700, 1080]], ri: 0, spd: 1, hp: 45, maxHp: 45, view: 190, fov: 2.6, r: 8 }));
    U.push(m8Unit({ team: 'en', kind: 'dog', x: 1700, y: 600, route: [[1700, 600], [2100, 600], [2100, 950], [1700, 950]], ri: 0, spd: 1.05, hp: 45, maxHp: 45, view: 190, fov: 2.6, r: 8 }));
    // posts at the doors, the gate, the pad
    [[440, 515, Math.PI / 2, 'kar98'], [530, 515, Math.PI / 2, 'mp40'], [470, 945, Math.PI / 2, 'kar98'], [1430, 805, Math.PI / 2, 'mp40'], [1960, 485, Math.PI / 2, 'kar98'], [1130, 1060, Math.PI / 2, 'kar98'], [1230, 1060, Math.PI / 2, 'mp40'], [1110, 420, Math.PI / 2, 'mp40'], [1250, 440, Math.PI / 2, 'kar98'], [1840, 730, Math.PI / 2, 'kar98'], [2000, 1250, Math.PI / 2, 'kar98'], [2200, 1250, Math.PI, 'mp40']].forEach(function (s) { U.push(m8Unit({ team: 'en', kind: 'sold', gun: s[3], x: s[0], y: s[1], ang: s[2], base: s[2], state: 'post', view: 230 })); });
    // technicians fuelling the rocket — they run for the bell if they see you
    [[1120, 300, 0], [1230, 380, Math.PI], [1180, 450, -Math.PI / 2]].forEach(function (s) { U.push(m8Unit({ team: 'en', kind: 'eng', tool: 'clip', x: s[0], y: s[1], ang: s[2], base: s[2], state: 'work', hp: 60, maxHp: 60, view: 180, fov: 1.2 })); });
    U.push(m8Unit({ team: 'en', kind: 'mg', gun: 'mg42', x: 1180, y: 1020, ang: Math.PI / 2, base: Math.PI / 2, state: 'post', view: 320, fov: 1.3 }));
    U.push(m8Unit({ team: 'en', kind: 'mg', gun: 'mg42', x: 1617, y: 725, ang: 0, base: 0, state: 'post', view: 300, fov: 1.3 }));
    M8.units = U;
}
function m12ClearRoutes() { // no pine may stand on a patrol line: guards were dithering against trunks
    const segs = []; M8.units.forEach(function (u) { if (u.team !== 'en' || !u.route) return; for (let i = 0; i < u.route.length; i++) { const a = u.route[i], b = u.route[(i + 1) % u.route.length]; segs.push([a[0], a[1], b[0], b[1]]); } });
    M8.obs = M8.obs.filter(function (o) { if (o.kind !== 'tree') return true; const cx = o.x + o.w / 2, cy = o.y + o.h / 2; return !segs.some(function (s) { return m8SegDist(s[0], s[1], s[2], s[3], cx, cy) < o.w / 2 + 22; }); });
}
function m12RoomDef(id) {
    const R = { id: id, style: 'peene', obs: [], target: null, units: [], exit: { x: 500, y: 650, w: 100, h: 50 }, bell: null, planted: false, cleared: false, lamps: [] };
    const box = function (x, y, w, h, k, low, ex) { R.obs.push(Object.assign({ x: x, y: y, w: w, h: h, kind: k, low: !!low }, ex || {})); };
    box(0, 0, 1100, 40, 'wall'); box(0, 0, 40, 700, 'wall'); box(1060, 0, 40, 700, 'wall'); box(0, 660, 500, 40, 'wall'); box(600, 660, 500, 40, 'wall');
    const g = function (x, y, route, gun) { R.units.push(m8Unit({ team: 'en', kind: 'sold', gun: gun || 'mp40', x: x, y: y, route: route, view: 260, spd: .9 })); };
    const e = function (x, y, a, tool) { R.units.push(m8Unit({ team: 'en', kind: 'eng', tool: tool || 'wrench', x: x, y: y, ang: a, base: a, state: 'work', hp: 60, maxHp: 60, view: 190, fov: 1.2 })); };
    if (id === 'lox') { R.title = 'SAUERSTOFFWERK'; box(120, 90, 180, 180, 'sphere'); box(380, 90, 180, 180, 'sphere'); box(640, 90, 180, 180, 'sphere'); box(900, 80, 110, 300, 'column'); box(120, 400, 260, 70, 'compressor'); box(480, 420, 200, 60, 'pipes'); box(760, 470, 150, 54, 'desk');
        R.target = { x: 470, y: 330, name: 'LOX MANIFOLD' }; R.bell = { x: 1035, y: 560 }; R.lamps = [{ x: 210, y: 300, r: 230 }, { x: 600, y: 300, r: 240, flick: 1 }, { x: 900, y: 520, r: 200 }];
        g(80, 600, [[80, 600], [80, 320], [860, 320], [1035, 420], [1035, 600]], 'mp40'); g(600, 600, [[600, 600], [300, 600]], 'kar98'); e(470, 290, -Math.PI / 2, 'wrench'); e(835, 535, Math.PI / 2, 'clip'); e(250, 380, Math.PI / 2, 'oil'); e(1000, 420, Math.PI, 'clip'); }
    if (id === 'hall') { R.title = 'FERTIGUNGSHALLE'; box(100, 120, 760, 70, 'rocket'); box(100, 330, 520, 70, 'rocket2'); box(700, 300, 220, 120, 'warheads'); box(900, 480, 120, 90, 'crates'); box(80, 480, 140, 80, 'lathe');
        R.target = { x: 800, y: 450, name: 'WARHEAD STORE' }; R.bell = { x: 65, y: 600 }; R.lamps = [{ x: 300, y: 250, r: 240 }, { x: 750, y: 250, r: 240 }, { x: 500, y: 520, r: 220, flick: 1 }];
        g(960, 600, [[960, 600], [960, 240], [620, 240], [620, 440]], 'mp40'); g(80, 260, [[80, 260], [80, 600], [400, 600]], 'kar98'); g(400, 450, [[400, 450], [650, 450]], 'mp40'); e(300, 220, -Math.PI / 2, 'wrench'); e(680, 220, -Math.PI / 2, 'clip'); e(400, 420, Math.PI / 2, 'oil'); e(1000, 300, Math.PI, 'clip'); }
    if (id === 'bunker') { R.title = 'BLOCKHAUS — FEUERLEITSTAND'; box(300, 60, 500, 90, 'console'); box(120, 70, 100, 100, 'periscope'); box(880, 70, 100, 100, 'periscope'); box(150, 330, 200, 60, 'desk'); box(750, 330, 200, 60, 'desk'); box(470, 300, 160, 110, 'plot', true);
        R.target = { x: 550, y: 190, name: 'FIRING PANEL' }; R.bell = { x: 1035, y: 300 }; R.lamps = [{ x: 550, y: 200, r: 260 }, { x: 250, y: 450, r: 200 }, { x: 850, y: 450, r: 200, flick: 1 }];
        g(80, 600, [[80, 600], [80, 250], [1000, 250], [1000, 600]], 'mp40'); g(550, 560, [[550, 560], [300, 560], [800, 560]], 'kar98'); e(400, 175, -Math.PI / 2, 'clip'); e(700, 175, -Math.PI / 2, 'clip'); e(250, 420, Math.PI / 2, 'clip'); e(850, 420, Math.PI / 2, 'wrench'); }
    if (id === 'lab') { R.title = 'VERSUCHSANSTALT — STEUERUNG'; box(110, 100, 220, 70, 'bench'); box(110, 260, 220, 70, 'bench'); box(440, 120, 220, 220, 'gyro'); box(770, 100, 220, 70, 'drafting'); box(770, 260, 220, 70, 'drafting'); box(110, 450, 120, 120, 'files'); box(880, 450, 120, 120, 'files');
        R.target = { x: 550, y: 380, name: 'GYRO TEST RIG' }; R.bell = { x: 65, y: 380 }; R.lamps = [{ x: 220, y: 200, r: 210 }, { x: 550, y: 230, r: 250 }, { x: 880, y: 200, r: 210, flick: 1 }];
        g(1000, 600, [[1000, 600], [1000, 220], [700, 220], [700, 420]], 'mp40'); g(80, 600, [[80, 600], [80, 400], [350, 400]], 'kar98'); e(220, 200, Math.PI / 2, 'clip'); e(390, 230, 0, 'clip'); e(880, 200, Math.PI / 2, 'clip'); e(880, 360, -Math.PI / 2, 'wrench'); }
    return R;
}
/* ---------- the countdown, the RAF, the rocket ---------- */
function m12Begin() {
    const now = performance.now(); Object.assign(M12, { t0: now, timer: M12_DUR, raid: 0, raidAt: now + 210000, nextBomb: 0, bombs: [], tis: [], bombers: [], flak: [], launch: 0, failWhy: '', lastDrone: 0, warnedFuel: false, warned60: false, kills0: 0 });
    M8.cam = { x: 0, y: 800 * M12S };
    m8Say('THE BEACH IS OURS. INTO THE PINES, THROUGH THE WIRE. FOUR CHARGES — AND THEY LAUNCH IN TWELVE MINUTES.', 7000);
}
function m12Cleanup() {}
function m12Bomb(x, y, now, big) { M12.bombs.push({ x: x, y: y, at: now + 1300, big: big ? 1 : 0, t: now }); }
function m12BombBurst(B, now) {
    const R = B.big ? 140 : 95, out = M8.scene === 'out'; if (!out) { M8.shake = Math.max(M8.shake, 3); try { playExplosionSound(.35); } catch (e) {} return; }
    M8.fx.push({ k: 'boom', x: B.x, y: B.y, t: now, r: R }); M8.decals.push({ k: 'scorch', x: B.x, y: B.y, r: R * .6, t: now, scene: 'out' });
    for (let i = 0; i < 30; i++) { const a = Math.random() * 7, sp = 1 + Math.random() * 6; M8.parts.push({ k: i % 3 ? 'spark' : 'ember', x: B.x, y: B.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: .02 + Math.random() * .03, scene: 'out' }); }
    for (let i = 0; i < 10; i++) { const a = Math.random() * 7; M8.parts.push({ k: 'fire', x: B.x + Math.cos(a) * 20, y: B.y + Math.sin(a) * 20, vx: Math.cos(a), vy: Math.sin(a), life: 1, decay: .03, r: R * .25, scene: 'out' }); }
    m8Smoke(B.x, B.y, 16, 'dark'); if (Math.random() < .55) M8.fires.push({ x: B.x, y: B.y, r: R * .45, until: now + 14000, scene: 'out' });
    M8.units.forEach(function (u) { if (u.dead) return; const d = Math.hypot(u.x - B.x, u.y - B.y); if (u.kind === 'tower') { if (d < R + 18) m8DamageUnit(u, 999, 0, null); return; } if (d < R) m8DamageUnit(u, (u.team === 'sq' ? 70 : 160) * (1 - d / R * .6), Math.atan2(u.y - B.y, u.x - B.x), null); else if (d < R * 2.6 && u.team === 'en' && u.state !== 'alert') { u.state = 'cower'; u.cowerUntil = now + 3500 + Math.random() * 2500; } });
    const L = m8Leader(), dl = Math.hypot(L.x - B.x, L.y - B.y); M8.shake = Math.max(M8.shake, Math.max(2, 16 - dl / 60)); try { playExplosionSound(Math.max(.4, 1.8 - dl / 600)); } catch (e) {}
}
function m12Update(dt, now, L) {
    const M = M12; if (M8.failed || M8.done) return;
    // the countdown (stops once all four charges are set — the launch crew are dead or running)
    if (M8.planted < 4 && !M.launch) { M.timer -= dt / 60; if (M.timer < 120 && !M.warnedFuel) { M.warnedFuel = true; m8Say('THE ROCKET IS FUELLED. VENTING HAS STOPPED — TWO MINUTES!', 4000); try { playTone(880, 440, .8, .05, 'sawtooth'); } catch (e) {} } if (M.timer < 60 && !M.warned60) { M.warned60 = true; m8Say('ONE MINUTE TO X-ZEIT! FINISH IT!', 3500); }
        if (M.timer <= 0) { M.timer = 0; M.launch = now; m8Say('IGNITION — THE V-2 IS LIFTING OFF!', 4000); try { playExplosionSound(2); } catch (e) {} } }
    if (M.launch && now - M.launch > 6500 && !M8.failed) { M.failWhy = 'launch'; m8Fail('launch'); }
    // un-cower after a near miss
    M8.units.forEach(function (u) { if (u.cowerUntil && now > u.cowerUntil && u.state === 'cower' && !u.dead) { u.cowerUntil = 0; u.state = u.route ? 'patrol' : (u.kind === 'eng' ? 'work' : 'post'); } });
    // Operation Hydra: the bombers arrive
    if (!M.raid && now > M.raidAt) { M.raid = now; m8Say('BOMBERS! THE RAF IS EARLY — 600 OF THEM. GET UNDER COVER AND KEEP MOVING!', 6000); try { playTone(90, 80, 3, .08, 'sawtooth'); } catch (e) {} for (let i = 0; i < 8; i++) M.tis.push({ x: (300 + Math.random() * 1800) * M12S, y: (180 + Math.random() * 820) * M12S, t: now + i * 900, col: i % 2 ? 'red' : 'green' }); }
    if (M.raid) {
        if (now - M.lastDrone > 2200) { M.lastDrone = now; try { playTone(70 + Math.random() * 10, 64, 2.2, .045, 'sawtooth'); } catch (e) {} }
        if (now > M.nextBomb) { M.nextBomb = now + 600 + Math.random() * 1100; const near = Math.random() < .16; const x = near ? L.x + (Math.random() - .5) * 420 : (260 + Math.random() * 1900) * M12S, y = near ? L.y + (Math.random() - .5) * 320 : (160 + Math.random() * 1000) * M12S; if (!(Math.hypot(x - 1180 * M12S, y - 360 * M12S) < 130)) { m12Bomb(Math.max(60, Math.min(2340 * M12S, x)), Math.max(60, Math.min(1360 * M12S, y)), now, Math.random() < .25); } }
        if (Math.random() < .015 * dt) M.bombers.push({ x: -300, y: (100 + Math.random() * 1200) * M12S, vx: 3 + Math.random() * 1.5, vy: -.4 + Math.random() * .3, s: .8 + Math.random() * .6 });
        if (Math.random() < .2 * dt) { const fi = Math.floor(Math.random() * 3); M.flak.push({ x: [840, 1640, 1040][fi] * M12S, y: [560, 480, 160][fi] * M12S, t: now, a: -Math.PI / 2 + (Math.random() - .5) * 1.2 }); }
    }
    M.bombs = M.bombs.filter(function (B) { if (now < B.at) return true; m12BombBurst(B, now); return false; });
    M.bombers.forEach(function (b) { b.x += b.vx * dt * 2.2; b.y += b.vy * dt; }); M.bombers = M.bombers.filter(function (b) { return b.x < 2800 * M12S; });
    M.flak = M.flak.filter(function (f) { return now - f.t < 700; });
    M.tis = M.tis.filter(function (T) { return now < T.t + 60000; });
    // German smoke generators fog the site once the raid starts (blocks searchlights + eyes)
    if (M.raid && M8.scene === 'out' && Math.random() < .02 * dt && M8.smokes.length < 14) M8.smokes.push({ x: (300 + Math.random() * 1800) * M12S, y: (200 + Math.random() * 800) * M12S, r: 180, t: now, dur: 14, scene: 'out' });
}
function m12Objective(R) {
    if (M12.launch) return 'THE ROCKET IS AWAY...';
    if (M8.exfil) return 'ALL FOUR CHARGES SET — TO THE BOAT ON THE BEACH (SOUTH-EAST)';
    if (R) return R.planted ? 'CHARGE SET — OUT BY THE DOOR (SOUTH)' : R.cleared ? 'ROOM CLEAR — HOLD [F] ON THE ' + R.target.name : 'KILL THE CREW BEFORE THEY RING THE BELL';
    return 'SABOTAGE: LOX PLANT · ASSEMBLY HALL · LAUNCH BUNKER · GUIDANCE LAB  ' + M8.planted + '/4';
}
function m12MinimapBase(mx, my, mw, mh, wsx, wsy) {
    const sx = wsx * M12S, sy = wsy * M12S;
    ctx.fillStyle = '#1c2616'; ctx.fillRect(mx, my, mw, mh); ctx.fillStyle = '#c8b88a'; ctx.fillRect(mx, my + 1230 * sy, mw, 160 * sy); ctx.fillStyle = '#16283a'; ctx.fillRect(mx, my + 1390 * sy, mw, mh - 1390 * sy);
    ctx.fillStyle = '#3a382c'; ctx.fillRect(mx + 180 * sx, my + 120 * sy, 2040 * sx, 920 * sy);
    ctx.strokeStyle = '#6a7a40'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(mx + M12_ARENA.cx * sx, my + M12_ARENA.cy * sy, M12_ARENA.rx * sx, M12_ARENA.ry * sy, 0, 0, 7); ctx.stroke();
    ctx.fillStyle = '#7a7a70'; (M12.dObs || M8.obs).forEach(function (o) { if (['loxplant', 'hall', 'bunker', 'lab', 'barracks'].indexOf(o.kind) >= 0) ctx.fillRect(mx + o.x * sx, my + o.y * sy, o.w * sx, o.h * sy); });
    ctx.fillStyle = '#fff'; ctx.fillRect(mx + 1176 * sx, my + 356 * sy, 3, 3);
}
function m12DarkExtras(hole, lights, now) {
    const PX = 1180 * M12S, PY = 360 * M12S; hole(PX, PY, 380, .9); lights.push([PX, PY, 360, '220,230,255', .14]); // floodlit pad
    M12.tis.forEach(function (T) { if (now < T.t) return; const k = Math.min(1, (now - T.t) / 2000), fade = Math.max(0, 1 - (now - T.t) / 60000); hole(T.x, T.y, 200 * k, .9 * fade); lights.push([T.x, T.y, 180 * k, T.col === 'red' ? '255,80,60' : '90,255,120', .22 * fade]); });
    if (M12.launch) { const k = (now - M12.launch) / 1000; hole(1180 * M12S, 360 * M12S, 800 + k * 260, 1); lights.push([1180 * M12S, 360 * M12S, 700, '255,200,120', .5]); }
}
function m12Hud(now) {
    const M = M12, t = Math.max(0, M.timer), mm = Math.floor(t / 60), ss = Math.floor(t % 60), urgent = t < 120 && M8.planted < 4;
    ctx.save(); m8Panel(870, 12, 218, M.raid ? 92 : 72, urgent); ctx.textAlign = 'left'; ctx.font = '700 11px "Stardos Stencil", Impact'; ctx.fillStyle = '#d9c88c'; ctx.fillText('V-2 · PRÜFSTAND VII · X-ZEIT', 882, 30);
    ctx.font = '700 30px "Stardos Stencil", Impact, monospace'; ctx.fillStyle = M8.planted >= 4 ? '#8fd07a' : urgent ? (Math.floor(now / 300) % 2 ? '#ff4030' : '#ffd070') : '#efe6c6'; ctx.fillText(M8.planted >= 4 ? 'HALTED' : 'T-' + mm + ':' + String(ss).padStart(2, '0'), 882, 62);
    ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(239,230,198,.7)'; const fuel = Math.min(1, 1 - t / M12_DUR); ctx.fillText(M8.planted >= 4 ? 'LAUNCH CREW DEAD OR FLED' : 'FUELLING ' + Math.round(fuel * 100) + '%', 882, 76); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(1000, 68, 78, 8); ctx.fillStyle = fuel > .85 ? '#ff6040' : '#7ab0e0'; ctx.fillRect(1000, 68, 78 * fuel, 8);
    if (M.raid) { ctx.fillStyle = Math.floor(now / 400) % 2 ? '#ff9a70' : '#ffd070'; ctx.font = 'bold 11px monospace'; ctx.fillText('✈ OPERATION HYDRA — BOMBS FALLING', 882, 96); } else { ctx.fillStyle = 'rgba(239,230,198,.5)'; ctx.font = '10px monospace'; ctx.fillText('RAF DUE IN ' + Math.max(0, Math.ceil((M.raidAt - now) / 1000)) + 's', 882, 92); }
    if (M.launch) { const k = Math.min(1, (now - M.launch) / 1500); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 300, 1100, 80); ctx.textAlign = 'center'; ctx.font = '700 40px "Stardos Stencil", Impact'; ctx.fillStyle = '#ff5040'; ctx.fillText('THE V-2 IS AWAY — LONDON IN FIVE MINUTES', 550, 352); }
    ctx.restore();
}
