/* =====================================================
   CAMPAIGN MISSION 8 - OPERATION DEADFALL (stealth commando raid on Schwerer Gustav) - GAME LOGIC
   Data: m8w.js (armoury) · Art: m8art.js · Briefing/armoury UI: m8ui.js
===================================================== */
let M8W = 2400, M8H = 1500;
const M8 = { active: false, cut: false, running: false, raf: 0, scene: 'out', units: [], bullets: [], proj: [], fx: [], parts: [], bodies: [], decals: [], smokes: [], flares: [], texts: [], fires: [], mines: [], gases: [], obs: [], lamps: [], alarm: false, alarmAt: 0, reinf: 0, k: {}, mdown: false, cam: { x: 0, y: 0 }, rooms: {}, outPos: null, planted: 0, done: false, failed: false, msg: '', msgAt: 0, loadout: null, wi: 0, ammo: [0, 0, 0, 0], res: [0, 0], reloadUntil: [0, 0], lastShot: 0, plantT: 0, fade: 0, fadeTo: null, kills: 0, shots: 0, endAt: 0, mx: 550, my: 200, shake: 0 };
function m8LargeWorld() { return false; } function m8IsLarge() { return false; }
function m8Hit() { return false; } function m8Splash() {} function m8Enemy() {} function updateMission8() {} function createMission8() {} function createMission8Map() {} function drawGustavMap() {} function m8DrawOverlay() {}
function m8ObjectiveText() { return M8.obj || ''; }

const M8_NAMES = ['MAJ. (YOU)', 'SGT. HOLLIS', 'CPL. FINCH', 'L/CPL. DUNN', 'PTE. MACKAY'];
const M8_SQUAD_GUNS = ['sten2s', 'delisle', 'sten6', 'sten2s'];
const M8_FORM = [[-30, -30], [30, -30], [-30, 30], [30, 30]];
let M8_GUS = { x: 1090, y: 240, w: 220, h: 620 };
let M8_DOORS = [
    { id: 'engine', name: 'ENGINE ROOM', x: 1078, y: 380, side: -1 }, { id: 'ammo', name: 'AMMUNITION ROOM', x: 1078, y: 700, side: -1 },
    { id: 'breech', name: 'BREECH ROOM', x: 1322, y: 470, side: 1 }, { id: 'gears', name: 'ELEVATION ROOM', x: 1322, y: 760, side: 1 }];
let M8_FENCE = { x0: 520, y0: 200, x1: 1880, y1: 1090, gate: [1140, 1260], gaps: [['w', 640, 720], ['e', 820, 900]] };
const M8_LV0 = { gus: M8_GUS, doors: M8_DOORS, fence: M8_FENCE };
const M8_BARK = { inv: ['Hm?', 'Wer da?', 'Was war das?', 'Hallo?'], alert: ['HALT!', 'ALARM!', 'Da drüben!', 'Achtung!'], flee: ['Hilfe!', 'Die Glocke!', 'Tommies!'], hunt: ['Wo sind sie?', 'Sucht sie!', 'Schnell!'] };

/* ---------- geometry ---------- */
function m8R(i) { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
function m8RectHit(x, y, r, o) { const cx = Math.max(o.x, Math.min(x, o.x + o.w)), cy = Math.max(o.y, Math.min(y, o.y + o.h)); return (x - cx) * (x - cx) + (y - cy) * (y - cy) < r * r; }
function m8Blocked(x, y, r) { for (let i = 0; i < M8.obs.length; i++) if (m8RectHit(x, y, r, M8.obs[i])) return true; const W = M8.scene === 'out' ? M8W : 1100, H = M8.scene === 'out' ? M8H : 700; return x < r || y < r || x > W - r || y > H - r; }
function m8SegRect(x0, y0, x1, y1, o) { let t0 = 0, t1 = 1; const dx = x1 - x0, dy = y1 - y0; const p = [-dx, dx, -dy, dy], q = [x0 - o.x, o.x + o.w - x0, y0 - o.y, o.y + o.h - y0]; for (let i = 0; i < 4; i++) { if (p[i] === 0) { if (q[i] < 0) return false; } else { const t = q[i] / p[i]; if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; } } } return true; }
function m8SegDist(x0, y0, x1, y1, px, py) { const dx = x1 - x0, dy = y1 - y0, l = dx * dx + dy * dy || 1; let t = ((px - x0) * dx + (py - y0) * dy) / l; t = Math.max(0, Math.min(1, t)); return Math.hypot(x0 + dx * t - px, y0 + dy * t - py); }
function m8SmokeK(s, now) { const a = (now - s.t) / 1000; return Math.min(1, a / 1.2) * Math.min(1, Math.max(0, (s.dur - a) / 2)); }
function m8LOS(x0, y0, x1, y1) {
    if (M8.lvl === 'burma' && M8.scene === 'out' && !m13GrassLOS(x0, y0, x1, y1)) return false;
    for (let i = 0; i < M8.obs.length; i++) { const o = M8.obs[i]; if (o.low) continue; if (m8SegRect(x0, y0, x1, y1, o)) return false; }
    if (M8.smokes.length) { const now = performance.now(); for (let i = 0; i < M8.smokes.length; i++) { const s = M8.smokes[i]; if (s.scene !== M8.scene || now - s.t < 500) continue; if (m8SegDist(x0, y0, x1, y1, s.x, s.y) < s.r * .8 * m8SmokeK(s, now)) return false; } }
    return true;
}
function m8Move(u, dx, dy) { if (!m8Blocked(u.x + dx, u.y, u.r)) u.x += dx; if (!m8Blocked(u.x, u.y + dy, u.r)) u.y += dy; }
function m8Turn(a, b, k) { return a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k; }
function m8AngDiff(a, b) { return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))); }
/* ---------- navigation: grid A* + string-pulling so guards walk round things instead of jittering ---------- */
function m8Nav() { const o = M8.obs; if (M8.navFor === o && M8.nav) return M8.nav; const out = M8.scene === 'out', W = out ? M8W : 1100, H = out ? M8H : 700, C = 20, cw = Math.ceil(W / C), ch = Math.ceil(H / C), g = new Uint8Array(cw * ch); for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) g[y * cw + x] = m8Blocked(x * C + 10, y * C + 10, 11) ? 1 : 0; M8.navFor = o; M8.nav = { C: C, cw: cw, ch: ch, g: g }; return M8.nav; }
function m8Clear(x0, y0, x1, y1, r) { const d = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(d / 9); for (let i = 1; i <= n; i++) { const k = i / n; if (m8Blocked(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, r)) return false; } return true; }
function m8NavFree(N, cx, cy) { const ok = function (x, y) { return x >= 0 && y >= 0 && x < N.cw && y < N.ch && !N.g[y * N.cw + x]; }; if (ok(cx, cy)) return [cx, cy]; for (let r = 1; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; if (ok(cx + dx, cy + dy)) return [cx + dx, cy + dy]; } return null; }
function m8FindPath(sx, sy, tx, ty, r) {
    const N = m8Nav(), C = N.C, cw = N.cw, s = m8NavFree(N, Math.floor(sx / C), Math.floor(sy / C)), t = m8NavFree(N, Math.floor(tx / C), Math.floor(ty / C)); if (!s || !t) return null;
    const S = s[1] * cw + s[0], T = t[1] * cw + t[0], tot = cw * N.ch, gS = new Float32Array(tot).fill(1e9), from = new Int32Array(tot).fill(-1), closed = new Uint8Array(tot), heap = [];
    const hz = function (i) { const x = i % cw, y = (i / cw) | 0, dx = Math.abs(x - t[0]), dy = Math.abs(y - t[1]); return Math.max(dx, dy) + .414 * Math.min(dx, dy); };
    const push = function (i, f) { heap.push([f, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; const tmp = heap[p]; heap[p] = heap[k]; heap[k] = tmp; k = p; } };
    const pop = function () { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = k * 2 + 1, rr = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (rr < heap.length && heap[rr][0] < heap[m][0]) m = rr; if (m === k) break; const tmp = heap[m]; heap[m] = heap[k]; heap[k] = tmp; k = m; } } return top; };
    gS[S] = 0; push(S, hz(S)); let found = false, it = 0;
    while (heap.length && it++ < 45000) { const cur = pop()[1]; if (cur === T) { found = true; break; } if (closed[cur]) continue; closed[cur] = 1; const x = cur % cw, y = (cur / cw) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= cw || ny >= N.ch) continue; const ni = ny * cw + nx; if (N.g[ni] || closed[ni]) continue; if (dx && dy && (N.g[y * cw + nx] || N.g[ny * cw + x])) continue; const ng = gS[cur] + (dx && dy ? 1.414 : 1); if (ng < gS[ni]) { gS[ni] = ng; from[ni] = cur; push(ni, ng + hz(ni)); } } }
    if (!found) return null;
    const cells = []; for (let i = T; i !== -1; i = from[i]) cells.push([(i % cw) * C + 10, ((i / cw) | 0) * C + 10]); cells.reverse(); cells.push([tx, ty]);
    const out = []; let ax = sx, ay = sy, k = 0; const rr = (r || 9) + 1;
    while (k < cells.length - 1) { let far = k + 1; for (let j = cells.length - 1; j > k + 1; j--) { if (m8Clear(ax, ay, cells[j][0], cells[j][1], rr)) { far = j; break; } } out.push(cells[far]); ax = cells[far][0]; ay = cells[far][1]; k = far; }
    return out;
}
function m8Steer(u, tx, ty, sp) {
    const d = Math.hypot(tx - u.x, ty - u.y); if (d < Math.max(2, sp)) { if (!m8Blocked(tx, ty, u.r)) { u.x = tx; u.y = ty; } u.nav = null; return true; }
    if (d < 50 && m8Blocked(tx, ty, u.r)) { u.nav = null; return true; }
    if (m8Blocked(u.x, u.y, u.r)) { const N = m8Nav(), f = m8NavFree(N, Math.floor(u.x / N.C), Math.floor(u.y / N.C)); if (f) { const fx = f[0] * N.C + 10, fy = f[1] * N.C + 10, fd = Math.hypot(fx - u.x, fy - u.y) || 1; u.x += (fx - u.x) / fd * Math.min(fd, Math.max(sp, 2)); u.y += (fy - u.y) / fd * Math.min(fd, Math.max(sp, 2)); u.moving = true; return false; } }
    const now = performance.now(); let gx = tx, gy = ty;
    if (!u.clrAt || now - u.clrAt > 300 || u.clrObs !== M8.obs) { u.clrAt = now; u.clrObs = M8.obs; u.clr = m8Clear(u.x, u.y, tx, ty, u.r + 1); }
    if (!u.clr) { const key = Math.round(tx / 20) + ',' + Math.round(ty / 20); if (!u.nav || u.nav.obs !== M8.obs || (u.nav.key !== key && now - u.nav.t > 450) || (u.nav.pts && !u.nav.pts.length)) u.nav = { key: key, t: now, obs: M8.obs, pts: m8FindPath(u.x, u.y, tx, ty, u.r) };
        const P = u.nav.pts; if (P && P.length) { while (P.length > 1 && Math.hypot(P[0][0] - u.x, P[0][1] - u.y) < sp + 4) P.shift(); gx = P[0][0]; gy = P[0][1]; } }
    else u.nav = null;
    const a = Math.atan2(gy - u.y, gx - u.x), bias = u.sideBias || 1, offs = [0, .5 * bias, -.5 * bias, 1.1 * bias, -1.1 * bias, 1.8 * bias, -1.8 * bias];
    for (let i = 0; i < offs.length; i++) { const off = offs[i], nx = u.x + Math.cos(a + off) * sp, ny = u.y + Math.sin(a + off) * sp; if (!m8Blocked(nx, ny, u.r)) { u.x = nx; u.y = ny; if (off) u.sideBias = Math.sign(off); u.ang = m8Turn(u.ang, a + off * .5, .12); u.moving = true; u.stuck = 0; return false; } }
    u.stuck = (u.stuck || 0) + 1; u.moving = false; if (u.stuck % 20 === 0) { u.nav = null; u.clrAt = 0; } if (u.stuck > 30 && d < 40) { u.stuck = 0; return true; } return u.stuck > 120 ? (u.stuck = 0, true) : false;
}
function m8Lit(x, y) {
    let L = 0;
    M8.flares.forEach(function (f) { if (f.scene !== M8.scene) return; const d = Math.hypot(x - f.x, y - f.y); if (d < f.r) L = Math.max(L, 1 - d / f.r * .5); });
    if (M8.scene !== 'out') { const R = M8.rooms[M8.scene]; let l2 = .25; R.lamps.forEach(function (l) { const d = Math.hypot(x - l.x, y - l.y); if (d < l.r) l2 = Math.max(l2, .85 * (1 - d / l.r)); }); return Math.max(L, l2); }
    M8.units.forEach(function (u) { if (u.kind !== 'tower' || u.dead) return; const lx = u.x + Math.cos(u.la) * 230, ly = u.y + Math.sin(u.la) * 230; const d = Math.hypot(x - lx, y - ly); if (d < 95) L = Math.max(L, 1 - d / 95 * .4); });
    M8.lamps.forEach(function (l) { const d = Math.hypot(x - l.x, y - l.y); if (d < l.r) L = Math.max(L, .8 * (1 - d / l.r)); });
    return L;
}

/* ---------- world ---------- */
function m8Obs(x, y, w, h, kind, low, extra) { M8.obs.push(Object.assign({ x: x, y: y, w: w, h: h, kind: kind, low: !!low }, extra || {})); }
function m8BuildOutside() {
    M8.obs = [];
    m8Obs(-50, -50, M8W + 100, 230, 'ridge');
    m8Obs(M8_GUS.x, M8_GUS.y, M8_GUS.w, M8_GUS.h, 'gustav');
    const F = M8_FENCE, fw = 10;
    const seg = function (x0, y0, x1, y1) { if (x0 === x1) m8Obs(x0 - fw / 2, Math.min(y0, y1), fw, Math.abs(y1 - y0), 'fence', true); else m8Obs(Math.min(x0, x1), y0 - fw / 2, Math.abs(x1 - x0), fw, 'fence', true); };
    seg(F.x0, F.y1, F.gate[0], F.y1); seg(F.gate[1], F.y1, F.x1, F.y1);
    seg(F.x0, F.y0, F.x0, F.gaps[0][1]); seg(F.x0, F.gaps[0][2], F.x0, F.y1);
    seg(F.x1, F.y0, F.x1, F.gaps[1][1]); seg(F.x1, F.gaps[1][2], F.x1, F.y1);
    [[640, 320, 210, 90, 'hut'], [1560, 320, 210, 90, 'hut'], [700, 860, 130, 70, 'crates'], [900, 600, 70, 150, 'truck'], [1500, 880, 150, 66, 'truckH'], [1700, 600, 110, 80, 'crates'], [1440, 1150, 120, 60, 'hut2'], [300, 1200, 140, 60, 'crates'], [840, 1180, 110, 60, 'crates'], [1880, 1200, 70, 140, 'truck'],
        [820, 720, 90, 90, 'aa'], [1440, 560, 60, 50, 'drums'], [690, 520, 110, 70, 'tent'], [1430, 700, 90, 50, 'gentrailer'], [1226, 925, 50, 66, 'wagon'], [1580, 1000, 130, 50, 'halftrack'], [600, 250, 60, 40, 'drums'], [1720, 250, 90, 40, 'crates'], [1400, 300, 50, 46, 'drums']].forEach(function (b) { m8Obs(b[0], b[1], b[2], b[3], b[4]); });
    [[1150, 1000, 100, 22], [600, 520, 22, 110], [1760, 480, 22, 110]].forEach(function (b) { m8Obs(b[0], b[1], b[2], b[3], 'sand', true); });
    for (let i = 0; i < 46; i++) { const x = m8R(i + 3) * M8W, y = 1180 + m8R(i + 9) * 300; if (Math.abs(x - 1200) < 150 && y > 1330) continue; if (x > 480 && x < 1920 && y < 1300) continue; m8Obs(x - 24, y - 24, 48, 48, 'tree', false, { seed: i }); }
    for (let i = 0; i < 26; i++) { const side = i % 2, x = side ? 2000 + m8R(i) * 360 : 40 + m8R(i) * 400, y = 260 + m8R(i + 4) * 900; m8Obs(x - 26, y - 26, 52, 52, 'tree', false, { seed: i + 100 }); }
    M8.lamps = [{ x: 1200, y: 1060, r: 170 }, { x: 745, y: 420, r: 150 }, { x: 1665, y: 420, r: 150 }, { x: 1200, y: 230, r: 220 }, { x: 1050, y: 540, r: 120 }, { x: 1350, y: 620, r: 120 }, { x: 860, y: 800, r: 110 }];
}
function m8Unit(o) { return Object.assign({ r: 9, ang: Math.PI / 2, hp: 100, maxHp: 100, dead: false, state: 'patrol', sus: 0, lastShot: 0, ri: 0, spd: 1.1, fov: 1.05, view: 230, alertAt: 0, seen: 0, stun: 0, seed: Math.random() * 1000 }, o); }
function m8Populate() {
    const U = [];
    U.push(m8Unit({ team: 'sq', kind: 'leader', x: 1200, y: 1430, ang: -Math.PI / 2, hp: 120, maxHp: 120, name: M8_NAMES[0] }));
    for (let i = 0; i < 4; i++) U.push(m8Unit({ team: 'sq', kind: 'cmdo', slot: i, gun: M8_SQUAD_GUNS[i], x: 1200 + M8_FORM[i][0], y: 1430 + M8_FORM[i][1], ang: -Math.PI / 2, hp: 80, maxHp: 80, name: M8_NAMES[i + 1] }));
    const F = M8_FENCE;
    [[F.x0, F.y0, .6], [F.x1, F.y0, 2.5], [F.x0, F.y1, -.6], [F.x1, F.y1, -2.5]].forEach(function (p, i) { U.push(m8Unit({ team: 'en', kind: 'tower', x: p[0], y: p[1], base: p[2], la: p[2], view: 340, fov: .42, hp: 50, maxHp: 50, ph: i * 1.7, state: 'post' })); });
    let n = 0; const pat = function (route, cnt, spd) { for (let k = 0; k < cnt; k++) U.push(m8Unit({ team: 'en', kind: 'sold', gun: (n++) % 2 ? 'mp40' : 'kar98', x: route[0][0], y: route[0][1], route: route, ri: 0, spd: spd || 1.0, delay: k * 26 })); };
    pat([[560, 1150], [1080, 1150], [1080, 1270], [560, 1270]], 2);
    pat([[1320, 1150], [1840, 1150], [1840, 1270], [1320, 1270]], 2);
    pat([[640, 480], [640, 980], [1020, 980], [1020, 480]], 2);
    pat([[1760, 480], [1760, 980], [1380, 980], [1380, 480]], 2);
    pat([[1030, 300], [1370, 300], [1370, 900], [1030, 900]], 1, .9);
    [[1155, 1110, Math.PI / 2], [1245, 1110, Math.PI / 2], [1200, 970, Math.PI / 2], [745, 450, Math.PI / 2], [1665, 450, Math.PI / 2], [1040, 420, Math.PI], [1360, 520, 0], [865, 700, -Math.PI / 2]].forEach(function (s, i) { U.push(m8Unit({ team: 'en', kind: i === 2 ? 'mg' : 'sold', gun: i === 2 ? 'mg42' : i % 2 ? 'mp40' : 'kar98', x: s[0], y: s[1], ang: s[2], base: s[2], state: 'post', view: i === 2 ? 300 : 220, fov: i === 2 ? 1.3 : 1.05 })); });
    M8.units = U;
}
function m8RoomDef(id) {
    const R = { id: id, obs: [], target: null, units: [], exit: { x: 500, y: 650, w: 100, h: 50 }, bell: null, planted: false, cleared: false, lamps: [] };
    const box = function (x, y, w, h, k, low, ex) { R.obs.push(Object.assign({ x: x, y: y, w: w, h: h, kind: k, low: !!low }, ex || {})); };
    box(0, 0, 1100, 40, 'wall'); box(0, 0, 40, 700, 'wall'); box(1060, 0, 40, 700, 'wall'); box(0, 660, 500, 40, 'wall'); box(600, 660, 500, 40, 'wall');
    const g = function (x, y, route, gun) { R.units.push(m8Unit({ team: 'en', kind: 'sold', gun: gun || 'mp40', x: x, y: y, route: route, view: 260, spd: .9 })); };
    const e = function (x, y, a, tool) { R.units.push(m8Unit({ team: 'en', kind: 'eng', tool: tool || 'wrench', x: x, y: y, ang: a, base: a, state: 'work', hp: 60, maxHp: 60, view: 190, fov: 1.2 })); };
    if (id === 'engine') {
        R.title = 'MASCHINENRAUM'; box(150, 110, 300, 130, 'engine'); box(150, 420, 300, 130, 'engine'); box(560, 190, 170, 150, 'gen'); box(780, 470, 140, 54, 'desk'); box(960, 80, 60, 360, 'pipes'); box(820, 80, 100, 70, 'drums'); box(270, 296, 70, 60, 'crates');
        R.target = { x: 645, y: 392, name: 'GENERATOR' }; R.bell = { x: 1035, y: 560 }; R.lamps = [{ x: 300, y: 340, r: 230 }, { x: 645, y: 400, r: 210 }, { x: 880, y: 260, r: 190, flick: 1 }];
        g(520, 100, [[520, 100], [520, 600], [940, 600], [940, 380], [760, 380]], 'mp40'); g(100, 600, [[100, 600], [100, 380], [230, 380]], 'kar98'); e(470, 175, Math.PI, 'wrench'); e(620, 370, -Math.PI / 2, 'clip'); e(110, 340, 0, 'oil'); e(850, 450, Math.PI / 2, 'clip');
    }
    if (id === 'ammo') {
        R.title = 'MUNITIONSRAUM'; for (let i = 0; i < 4; i++) box(110 + i * 230, 70, 180, 96, 'shellrack', false, { i: i }); for (let i = 0; i < 3; i++) box(170 + i * 270, 330, 130, 100, 'cases', false, { i: i }); box(70, 520, 100, 70, 'crates'); box(900, 520, 110, 70, 'pallet');
        R.target = { x: 505, y: 470, name: 'PROPELLANT STACK' }; R.bell = { x: 65, y: 330 }; R.lamps = [{ x: 240, y: 250, r: 220 }, { x: 760, y: 250, r: 220, flick: 1 }, { x: 505, y: 520, r: 200 }];
        g(100, 260, [[100, 260], [1000, 260]], 'kar98'); g(1000, 600, [[1000, 600], [1000, 440], [760, 470]], 'mp40'); e(300, 210, -Math.PI / 2, 'clip'); e(720, 300, Math.PI / 2, 'wrench'); e(980, 460, Math.PI, 'oil');
    }
    if (id === 'breech') {
        R.title = 'VERSCHLUSSRAUM'; box(400, 40, 300, 240, 'breech'); box(320, 40, 60, 280, 'cyl'); box(720, 40, 60, 280, 'cyl'); box(470, 280, 160, 190, 'tray', true); box(470, 470, 160, 60, 'rammer'); box(80, 100, 70, 220, 'panel'); box(850, 380, 130, 64, 'trolley');
        R.target = { x: 440, y: 330, name: 'BREECH MECHANISM' }; R.bell = { x: 1035, y: 200 }; R.lamps = [{ x: 550, y: 330, r: 240 }, { x: 200, y: 450, r: 200 }, { x: 900, y: 250, r: 190, flick: 1 }];
        g(960, 600, [[960, 600], [960, 90], [820, 90], [820, 300]], 'mp40'); g(900, 300, [[900, 300], [900, 360]], 'kar98'); e(340, 360, 0, 'clip'); e(760, 360, Math.PI, 'wrench'); e(170, 380, -Math.PI / 2, 'clip');
    }
    if (id === 'gears') {
        R.title = 'RICHTRAUM'; box(140, 100, 240, 240, 'gear', false, { dir: 1 }); box(720, 100, 240, 240, 'gear', false, { dir: -1 }); box(470, 170, 160, 120, 'gearbox'); box(140, 440, 120, 80, 'motor'); box(840, 440, 120, 80, 'motor'); box(380, 430, 40, 160, 'hyd'); box(680, 430, 40, 160, 'hyd');
        R.target = { x: 550, y: 340, name: 'ELEVATION GEARBOX' }; R.bell = { x: 65, y: 600 }; R.lamps = [{ x: 260, y: 380, r: 220 }, { x: 840, y: 380, r: 220 }, { x: 550, y: 330, r: 200, flick: 1 }];
        g(550, 80, [[550, 80], [550, 140], [1000, 140], [1000, 400]], 'mp40'); g(120, 620, [[120, 620], [120, 400], [300, 400]], 'kar98'); e(430, 250, Math.PI, 'wrench'); e(670, 250, 0, 'clip'); e(310, 400, -Math.PI / 2, 'oil');
    }
    return R;
}

/* ---------- loadout + ammo ---------- */
function m8Slots() { const L = M8.loadout; return [M8_PRIMARY[L.p], M8_SECONDARY[L.s], M8_EQUIP[L.e1], M8_EQUIP[L.e2]]; }
function m8Gun() { return m8Slots()[M8.wi]; }
function m8StartRes(w) { if (!w.mag) return 0; if (w.res !== undefined) return w.res; if (w.type === 'flame') return w.mag * 2; if (w.mag === 1) return w.type === 'bow' ? 9 : 5; return w.mag * 3; }
function m8Switch(i) { if (i === M8.wi || i < 0 || i > 3) return; M8.wi = i; M8.lastShot = 0; M8.mdown = false; try { playTone(900, 700, .05, .04, 'square'); } catch (e) {} }
function m8Reload() { const w = m8Gun(); if (M8.wi > 1 || w.type === 'melee') return; const now = performance.now(); if (M8.reloadUntil[M8.wi] > now || M8.ammo[M8.wi] >= w.mag) return; if (M8.res[M8.wi] <= 0) { m8Float(m8Leader(), 'NO AMMO', '#ff9a70'); return; } M8.reloadUntil[M8.wi] = now + w.reload; try { playTone(300, 500, .08, .04, 'square'); setTimeout(function () { try { playTone(520, 260, .06, .05, 'square'); } catch (e) {} }, Math.max(200, w.reload - 250)); } catch (e) {} }
function m8Float(u, t, col) { M8.texts.push({ x: u.x, y: u.y - 22, t: t, col: col || '#efe6c6', at: performance.now(), scene: M8.scene }); }
function m8Bark(u, set) { if (u.lastBark && performance.now() - u.lastBark < 2500) return; u.lastBark = performance.now(); const a = M8_BARK[set]; m8Float(u, a[Math.floor(Math.random() * a.length)], set === 'alert' || set === 'flee' ? '#ff8a70' : '#ffd88a'); }

/* ---------- start / stop ---------- */
function m8Begin(lvl) {
    try { resetBattleStats(); } catch (e) {}
    M8.lvl = lvl === 'chateau' ? 'chateau' : lvl === 'peene' ? 'peene' : lvl === 'burma' ? 'burma' : 'gustav'; const CH = M8.lvl === 'chateau', PE = M8.lvl === 'peene', BU = M8.lvl === 'burma';
    M8W = BU ? M13W : PE ? 2400 * M12S : 2400; M8H = BU ? M13H : PE ? 1500 * M12S : 1500;
    if (BU) { M8_GUS = M13_PAD; M8_DOORS = M13_DOORS; M8_FENCE = M13_FENCE; } else if (PE) { M8_GUS = M12_PAD; M8_DOORS = M12_DOORS; M8_FENCE = M12_FENCE; } else if (CH) { M8_GUS = M9_HOUSE; M8_DOORS = M9_DOORS; M8_FENCE = M9_WALL; } else { M8_GUS = M8_LV0.gus; M8_DOORS = M8_LV0.doors; M8_FENCE = M8_LV0.fence; }
    const DEF = BU ? M13_DEF_LOADOUT : PE ? M12_DEF_LOADOUT : CH ? M9_DEF_LOADOUT : { p: 'delisle', s: 'welrod', e1: 'mills', e2: 'stones' }, P = Object.assign({}, DEF, (BU ? progression.m13Loadout : PE ? progression.m12Loadout : CH ? progression.m9Loadout : progression.m8Loadout) || {}), LVN = M8.lvl, okw = function (T, k) { return T[k] && m8LvOf(T[k]) === LVN; };
    M8.loadout = { p: okw(M8_PRIMARY, P.p) ? P.p : DEF.p, s: okw(M8_SECONDARY, P.s) ? P.s : DEF.s, e1: okw(M8_EQUIP, P.e1) ? P.e1 : DEF.e1, e2: okw(M8_EQUIP, P.e2) ? P.e2 : DEF.e2 };
    Object.assign(M8, { active: true, running: true, cut: true, scene: 'out', bullets: [], proj: [], fx: [], parts: [], bodies: [], decals: [], smokes: [], flares: [], texts: [], fires: [], mines: [], gases: [], lures: [], safeOpen: false, chaseStarting: false, nearDoor: null, nearCar: false, alarm: false, alarmAt: 0, reinf: 0, last: performance.now(), k: {}, mdown: false, rooms: {}, outPos: null, planted: 0, done: false, failed: false, failWhy: '', msg: '', msgAt: 0, wi: 0, reloadUntil: [0, 0], lastShot: 0, plantT: 0, fade: 1, fadeTo: null, kills: 0, shots: 0, endAt: 0, detonated: 0, exfil: false, cam: { x: 650, y: 800 }, shake: 0, swingAt: 0, throwAt: 0, bellAt: 0 });
    const S = m8Slots(); M8.ammo = [S[0].mag, S[1].mag || 0, S[2].count, M8.loadout.e1 === M8.loadout.e2 ? 0 : S[3].count]; M8.res = [m8StartRes(S[0]), m8StartRes(S[1])];
    M8.docs = false; M8.radioOut = false; M8.reinfPts = BU ? M13_REINF : PE ? M12_REINF : CH ? [[1760, 1000], [1860, 1000]] : [[745, 440], [1665, 440]];
    M8_DOORS.forEach(function (d) { if (!M8.rooms[d.id]) M8.rooms[d.id] = BU ? m13RoomDef(d.id) : PE ? m12RoomDef(d.id) : CH ? m9RoomDef(d.id) : m8RoomDef(d.id); });
    if (BU) { m13BuildOutside(); m13Populate(); m13ClearRoutes(); m13Begin(); } else if (PE) { m12BuildOutside(); m12Populate(); m12ClearRoutes(); m12Scale(); m12Begin(); } else if (CH) { m9BuildOutside(); m9Populate(); M8.cam = { x: 0, y: 800 }; } else { m8BuildOutside(); m8Populate(); }
    gameRunning = false; campaignMissionComplete = false; try { for (const kk in keys) keys[kk] = false; } catch (e) {}
    ['controls', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    ['m2Hud', 'm4Hud', 'm8Hud'].forEach(function (id) { const e = document.getElementById(id); if (e) e.hidden = true; });
    const mb = document.getElementById('battleMainMenuButton'); if (mb) { mb.style.display = 'block'; mb.textContent = '↩️ ABORT MISSION'; }
    canvas.style.cursor = 'none';
    if (!M8.listeners) { M8.listeners = true;
        window.addEventListener('keydown', function (e) { if (!M8.running) return; M8.k[e.code] = true; if (e.code === 'Digit1') m8Switch(0); if (e.code === 'Digit2') m8Switch(1); if (e.code === 'Digit3') m8Switch(2); if (e.code === 'Digit4') m8Switch(3); if (e.code === 'KeyQ') m8Switch(M8.wi === 0 ? 1 : 0); if (e.code === 'KeyG') m8Switch(M8.wi === 2 ? 3 : 2); if (e.code === 'KeyR') m8Reload(); if (e.code === 'Space') e.preventDefault(); });
        window.addEventListener('keyup', function (e) { M8.k[e.code] = false; });
        canvas.addEventListener('mousedown', function (e) { if (M8.running && e.button === 0) M8.mdown = true; });
        window.addEventListener('mouseup', function () { M8.mdown = false; });
        canvas.addEventListener('wheel', function (e) { if (!M8.running) return; e.preventDefault(); m8Switch((M8.wi + (e.deltaY > 0 ? 1 : 3)) % 4); }, { passive: false });
        window.addEventListener('blur', function () { M8.k = {}; M8.mdown = false; });
        canvas.addEventListener('mousemove', function (e) { const r = canvas.getBoundingClientRect(); M8.mx = (e.clientX - r.left) * 1100 / r.width; M8.my = (e.clientY - r.top) * 700 / r.height; });
    }
    M8.mx = 550; M8.my = 200;
    if (!PE && !BU) m8Say(CH ? 'THROUGH THE BREACH IN THE WEST WALL, LADS. WATCH FOR THE DOGS — THEY SMELL YOU BEFORE THEY SEE YOU.' : 'WE GO IN QUIET, LADS. KEEP OUT OF THE LIGHTS AND THEIR EYELINES. SHIFT TO CREEP.', 6500);
    try { initAudio(); } catch (e) {}
    cancelAnimationFrame(M8.raf); M8.raf = requestAnimationFrame(m8Loop);
}
function m8Stop() { M8.running = false; cancelAnimationFrame(M8.raf); canvas.style.cursor = ''; const mb = document.getElementById('battleMainMenuButton'); if (mb) mb.textContent = '↩️ RETURN TO MAIN MENU'; }
function m8Cleanup() { if (typeof m9Cleanup === "function") m9Cleanup(); if (typeof m10Cleanup === "function") m10Cleanup(); if (typeof m11Cleanup === "function") m11Cleanup(); if (typeof m14Cleanup === "function") m14Cleanup(); if (typeof m15Cleanup === "function") m15Cleanup(); if (M8.running) m8Stop(); M8.active = false; M8.cut = false; const h = document.getElementById('m8Hud'); if (h) h.hidden = true; const a = document.getElementById('m8Arm'); if (a) a.hidden = true; }
function m8Say(t, ms) { M8.msg = t; M8.msgAt = performance.now(); M8.msgDur = ms || 4200; }
function m8Leader() { return M8.units[0]; }
function m8Units() { return M8.scene === 'out' ? M8.units : M8.units.slice(0, 5).concat(M8.rooms[M8.scene].units); }

/* ---------- alerting ---------- */
function m8Noise(x, y, r) { if (r <= 0) return; m8Units().forEach(function (u) { if (u.team !== 'en' || u.dead || u.kind === 'tower') return; const d = Math.hypot(u.x - x, u.y - y); if (d < r) { if (r > 300 || d < r * .45) m8Alerting(u, x, y); else if (u.state !== 'alert' && u.state !== 'alerting' && u.state !== 'flee' && u.state !== 'cower') { if (u.state !== 'investigate') m8Bark(u, 'inv'); u.state = 'investigate'; u.ix = x; u.iy = y; u.sus = Math.max(u.sus, .5); } } }); }
function m8LoudDecoy(x, y) { m8Units().filter(function (u) { return u.team === 'en' && !u.dead && u.kind !== 'tower' && u.kind !== 'mg' && u.kind !== 'dog' && u.state !== 'alert' && u.state !== 'alerting' && Math.hypot(u.x - x, u.y - y) < 700; }).sort(function (a, b) { return Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y); }).slice(0, 7).forEach(function (u) { u.state = 'investigate'; u.ix = x + (Math.random() - .5) * 60; u.iy = y + (Math.random() - .5) * 60; u.sus = Math.max(u.sus, .45); m8Bark(u, 'inv'); }); }
function m8Decoy(x, y) { m8Units().filter(function (u) { return u.team === 'en' && !u.dead && u.kind !== 'tower' && u.kind !== 'mg' && (u.state === 'patrol' || u.state === 'post' || u.state === 'work' || u.state === 'investigate') && Math.hypot(u.x - x, u.y - y) < 420; }).sort(function (a, b) { return Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y); }).slice(0, 2).forEach(function (u) { u.state = 'investigate'; u.ix = x + (Math.random() - .5) * 20; u.iy = y + (Math.random() - .5) * 20; u.sus = Math.max(u.sus, .35); m8Bark(u, 'inv'); }); }
function m8Alerting(u, x, y) { if (x !== undefined) { u.lx = x; u.ly = y; } if (u.dead || u.state === 'alert' || u.state === 'alerting' || u.state === 'flee' || u.state === 'cower') return; if (M8.alarm && u.kind !== 'eng') { u.state = 'alert'; return; } u.state = u.kind === 'eng' ? 'flee' : 'alerting'; u.alertAt = performance.now() + (u.kind === 'tower' ? 1600 : 1300); u.sus = 1; if (u.kind !== 'tower') m8Bark(u, u.kind === 'eng' ? 'flee' : 'alert'); }
function m8RaiseAlarm(why) { if (M8.alarm) return; M8.alarm = true; M8.alarmAt = performance.now(); m8Say('ALARM! ' + (why || 'WE\'VE BEEN SPOTTED') + ' — FIGHT THROUGH!', 5000);
    try { playTone(500, 800, .7, .05, 'sawtooth'); setTimeout(function () { try { playTone(800, 500, .7, .05, 'sawtooth'); } catch (e) {} }, 700); } catch (e) {}
    const L = m8Leader(); M8.units.concat(Object.keys(M8.rooms).reduce(function (a, k) { return a.concat(M8.rooms[k].units); }, [])).forEach(function (u) { if (u.team === 'en' && !u.dead && u.kind !== 'eng') { u.state = 'alert'; u.lx = L.x; u.ly = L.y; } }); }

/* ---------- firing ---------- */
function m8Muzzle(u, ang, w) { const len = w && w.type !== 'melee' ? 22 : 14; return { x: u.x + Math.cos(ang) * len - Math.sin(ang) * 2, y: u.y + Math.sin(ang) * len + Math.cos(ang) * 2 }; }
function m8Fire(u, ang, w, team, tx, ty) {
    const now = performance.now(); M8.shots++; const leader = u.kind === 'leader';
    if (w.type === 'melee') { M8.swingAt = now; const tgt = m8Units().filter(function (e) { return e.team !== team && !e.dead && e.kind !== 'tower' && Math.hypot(e.x - u.x, e.y - u.y) < w.range + e.r && m8AngDiff(Math.atan2(e.y - u.y, e.x - u.x), ang) < 1.1; }).sort(function (a, b) { return Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y); })[0];
        M8.fx.push({ k: 'slash', x: u.x + Math.cos(ang) * 18, y: u.y + Math.sin(ang) * 18, a: ang, t: now, r: w.range * .5 }); try { playTone(1400, 400, .08, .04, 'triangle'); } catch (e) {}
        if (tgt) { if (w.backOnly && m8AngDiff(tgt.ang, Math.atan2(tgt.y - u.y, tgt.x - u.x)) > 1.2 && tgt.stun < now) { m8Float(tgt, 'HE SEES YOU', '#ff9a70'); m8Alerting(tgt, u.x, u.y); return; } m8DamageUnit(tgt, w.dmg, ang, u, true); if (w.noise) m8Noise(u.x, u.y, w.noise); }
        return; }
    const m = m8Muzzle(u, ang, w);
    if (w.type === 'throw' || w.type === 'throwknife') {
        M8.throwAt = now; const d = Math.min(w.range, Math.hypot(tx - u.x, ty - u.y)), ex = u.x + Math.cos(ang) * d, ey = u.y + Math.sin(ang) * d;
        if (w.type === 'throwknife') M8.proj.push({ k: 'knife', x: m.x, y: m.y, vx: Math.cos(ang) * w.speed, vy: Math.sin(ang) * w.speed, life: w.range / w.speed, dmg: w.dmg, team: team, from: u, a: ang, w: w });
        else M8.proj.push({ k: 'nade', x: u.x, y: u.y, sx: u.x, sy: u.y, ex: ex, ey: ey, t0: now, dur: 280 + d * 1.5, fuseAt: w.fuse ? now + w.fuse : 0, w: w, team: team, from: u, spin: Math.random() * 6, landed: false, h: 0 });
        try { playTone(500, 300, .08, .03, 'triangle'); } catch (e) {} return; }
    if (w.type === 'launcher') { M8.proj.push({ k: 'rocket', x: m.x, y: m.y, vx: Math.cos(ang) * w.speed, vy: Math.sin(ang) * w.speed, life: w.range / w.speed, w: w, team: team, from: u, a: ang }); M8.fx.push({ k: 'flash', x: m.x, y: m.y, a: ang, t: now, big: true }); m8Smoke(m.x - Math.cos(ang) * 30, m.y - Math.sin(ang) * 30, 6, 'grey'); try { playTone(160, 60, .25, .1, 'sawtooth'); } catch (e) {} m8Noise(u.x, u.y, w.noise); M8.shake = Math.max(M8.shake, 4); return; }
    if (w.type === 'bow') { M8.proj.push({ k: 'bolt', x: m.x, y: m.y, vx: Math.cos(ang) * w.speed, vy: Math.sin(ang) * w.speed, life: w.range / w.speed, dmg: w.dmg, team: team, from: u, a: ang }); try { playTone(220, 120, .05, .04, 'triangle'); } catch (e) {} return; }
    if (w.type === 'flare') { const d = Math.min(w.range, Math.hypot(tx - u.x, ty - u.y)); M8.proj.push({ k: 'flare', x: m.x, y: m.y, vx: Math.cos(ang) * w.speed, vy: Math.sin(ang) * w.speed, life: Math.max(4, d / w.speed), dmg: w.dmg, team: team, from: u, a: ang }); try { playTone(700, 200, .3, .05, 'sawtooth'); } catch (e) {} m8Noise(u.x, u.y, w.noise); return; }
    if (w.type === 'flame') { for (let i = 0; i < 3; i++) { const a = ang + (Math.random() - .5) * w.spread * 2, sp = w.speed * (.8 + Math.random() * .5); M8.parts.push({ k: 'flame', x: m.x, y: m.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: sp / w.range * 1.1, r: 4, team: team, dmg: w.dmg, from: u, scene: M8.scene }); } if (Math.random() < .3) try { playTone(90 + Math.random() * 40, 60, .08, .03, 'sawtooth'); } catch (e) {} m8Noise(u.x, u.y, w.noise); return; }
    const sneak = leader && (M8.k.ShiftLeft || M8.k.ShiftRight), n = w.pellets || 1;
    for (let i = 0; i < n; i++) { const a = ang + (Math.random() - .5) * 2 * (w.spread || .05) * (sneak ? .6 : 1) * (leader && u.moving ? 1.4 : 1); const sp = (w.speed || 24) * (n > 1 ? .85 + Math.random() * .3 : 1); M8.bullets.push({ x: m.x, y: m.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, dmg: w.dmg, life: (w.range || 400) / sp, team: team, from: u, pierce: w.pierce ? 3 : 0, hit: [], big: w.dmg >= 150, curve: w.curve || 0 }); }
    M8.fx.push({ k: 'flash', x: m.x, y: m.y, a: ang, t: now, big: (w.noise || 0) > 300, sup: (w.noise || 0) <= 140 });
    if (leader || Math.random() < .5) M8.parts.push({ k: 'casing', x: u.x + Math.cos(ang) * 6, y: u.y + Math.sin(ang) * 6, vx: Math.cos(ang + 1.6) * (1.5 + Math.random()), vy: Math.sin(ang + 1.6) * (1.5 + Math.random()), life: 1, decay: .025, rot: Math.random() * 6, scene: M8.scene });
    if (leader && (w.noise || 0) > 300) M8.shake = Math.max(M8.shake, w.dmg > 100 ? 5 : 2);
    try { const nz = w.noise || 0; if (nz > 300) { if (w.dmg > 150) playTone(140, 40, .3, .12, 'sawtooth'); else if (w.dmg > 80) playTone(200, 60, .2, .1, 'sawtooth'); else playTone(280 + Math.random() * 40, 90, .07, .07, 'sawtooth'); } else if (team === 'sq') playTone(1200, 600, .03, .025, 'square'); else playTone(320, 120, .06, .045, 'sawtooth'); } catch (e) {}
    m8Noise(u.x, u.y, w.noise || 0);
}
function m8DamageUnit(t, d, ang, src, melee) {
    if (t.dead) return; const now = performance.now();
    t.hp -= d; if (t.kind !== 'tower' && d >= 3) { M8.fx.push({ k: 'blood', x: t.x, y: t.y, a: ang, t: now }); for (let i = 0; i < 4; i++) M8.parts.push({ k: 'blood', x: t.x, y: t.y, vx: Math.cos(ang + (Math.random() - .5)) * (1 + Math.random() * 2.5), vy: Math.sin(ang + (Math.random() - .5)) * (1 + Math.random() * 2.5), life: 1, decay: .05, scene: M8.scene }); }
    if (t.team === 'en' && t.hp > 0) m8Alerting(t, src ? src.x : t.x, src ? src.y : t.y);
    if (t.team === 'sq' && t.hp > 0 && t.kind === 'leader') { M8.hurtAt = now; M8.shake = Math.max(M8.shake, 3); }
    if (t.hp <= 0) { t.dead = true; t.deadAt = now; t.deathAng = ang; t.silent = !!melee;
        if (t.team === 'en') { M8.kills++; try { battleStats.kills++; } catch (e) {}
            if (t.kind === 'tower') { for (let i = 0; i < 18; i++) M8.parts.push({ k: 'spark', x: t.x, y: t.y, vx: (Math.random() - .5) * 6, vy: (Math.random() - .5) * 6, life: 1, decay: .03, scene: M8.scene }); m8Say('SEARCHLIGHT OUT.', 1800); try { playTone(900, 200, .3, .05, 'square'); } catch (e) {} }
            else { M8.bodies.push({ x: t.x, y: t.y, scene: M8.scene, found: false, u: t }); M8.decals.push({ k: 'pool', x: t.x + Math.cos(ang) * 6, y: t.y + Math.sin(ang) * 6, r: 10 + Math.random() * 6, t: now, scene: M8.scene }); try { playTone(160, 80, .12, .04, 'triangle'); } catch (e) {} } }
        else { m8Say(t.name + ' IS DOWN!', 3000); M8.decals.push({ k: 'pool', x: t.x, y: t.y, r: 14, t: now, scene: M8.scene }); if (t.kind === 'leader') m8Fail('leader'); } }
}
function m8Fail(why) { if (M8.failed || M8.done) return; M8.failed = true; M8.endAt = performance.now() + 2600; M8.failWhy = why; }
function m8Smoke(x, y, n, kind) { for (let i = 0; i < n; i++) M8.parts.push({ k: 'smoke', x: x + (Math.random() - .5) * 10, y: y + (Math.random() - .5) * 10, vx: (Math.random() - .5) * .8, vy: (Math.random() - .5) * .8 - .2, life: 1, decay: .008 + Math.random() * .008, r: 8 + Math.random() * 10, grow: .5, col: kind || 'dark', scene: M8.scene }); }
function m8Explode(x, y, w, src) {
    const now = performance.now(), R = w.blast || 80;
    if (w.smoke) { M8.smokes.push({ x: x, y: y, r: 120, t: now, dur: 10, scene: M8.scene }); try { playTone(300, 200, .4, .04, 'triangle'); } catch (e) {} m8Noise(x, y, w.noise); return; }
    if (w.gas) { M8.gases.push({ x: x, y: y, r: 115, t: now, dur: 8, scene: M8.scene }); try { playTone(260, 180, .5, .04, 'triangle'); } catch (e) {} m8Noise(x, y, w.noise); return; }
    if (w.lure || w.drug) { M8.lures.push({ x: x, y: y, t: now, until: now + (w.drug ? 22000 : 15000), drug: !!w.drug, scene: M8.scene }); M8.fx.push({ k: 'ping', x: x, y: y, t: now }); try { playTone(500, 420, .08, .02, 'triangle'); } catch (e) {} return; }
    if (w.loud) { M8.fx.push({ k: 'boom', x: x, y: y, t: now, r: 34 }); for (let i = 0; i < 14; i++) { const a = Math.random() * 7; M8.parts.push({ k: 'spark', x: x, y: y, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, life: 1, decay: .05, scene: M8.scene }); } try { playExplosionSound(.35); } catch (e) {} M8.shake = Math.max(M8.shake, 2); m8LoudDecoy(x, y); return; }
    if (w.caltrop) { m8Units().forEach(function (u) { if (u.dead || u.team !== 'en' || u.kind === 'tower' || Math.hypot(u.x - x, u.y - y) > 48) return; u.stun = now + (w.stun || 2500); m8DamageUnit(u, w.dmg || 55, 0, src); m8Float(u, 'AAARGH!', '#ff9a70'); }); try { playTone(900, 300, .12, .03, 'square'); } catch (e) {} return; }
    if (w.decoy) { M8.fx.push({ k: 'ping', x: x, y: y, t: now }); try { playTone(1800, 1400, .04, .03, 'square'); setTimeout(function () { try { playTone(1500, 1300, .03, .02, 'square'); } catch (e) {} }, 90); } catch (e) {} m8Decoy(x, y); return; }
    m8Units().forEach(function (u) { if (u.dead) return; const d = Math.hypot(u.x - x, u.y - y); if (d > R + u.r) return; const f = Math.max(.25, 1 - d / R * .7), dmg = w.dmg * f * (u.team === 'sq' ? .45 : 1); if (w.stun && u.team === 'en') u.stun = now + w.stun; if (dmg > 0) m8DamageUnit(u, dmg, Math.atan2(u.y - y, u.x - x), src); });
    M8.fx.push({ k: 'boom', x: x, y: y, t: now, r: R, burn: !!w.burn }); M8.decals.push({ k: 'scorch', x: x, y: y, r: R * .55, t: now, scene: M8.scene });
    for (let i = 0; i < 26; i++) { const a = Math.random() * 7, sp = 1 + Math.random() * (R / 14); M8.parts.push({ k: w.burn ? 'ember' : 'spark', x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: .02 + Math.random() * .03, scene: M8.scene }); }
    for (let i = 0; i < 12; i++) { const a = Math.random() * 7, sp = Math.random() * 2; M8.parts.push({ k: 'fire', x: x + Math.cos(a) * R * .2, y: y + Math.sin(a) * R * .2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: .03 + Math.random() * .02, r: R * (.18 + Math.random() * .2), scene: M8.scene }); }
    m8Smoke(x, y, 14, 'dark');
    if (w.burn) M8.fires.push({ x: x, y: y, r: R * .7, until: now + 4000, scene: M8.scene });
    M8.shake = Math.max(M8.shake, R / 9); try { playExplosionSound(Math.min(2, R / 70)); } catch (e) {}
    m8Noise(x, y, w.noise || 900);
    if (M8.scene === 'out') M8.units.forEach(function (u) { if (u.kind === 'tower' && !u.dead && Math.hypot(u.x - x, u.y - y) < R + 18) m8DamageUnit(u, 999, 0, src); });
}

/* ---------- loop ---------- */
function m8Loop(ts) {
    if (!M8.running) return;
    const dt = Math.min(50, ts - (M8.last || ts)) / 16.67; M8.last = ts;
    try { m8Update(dt, ts); m8Draw(ts); } catch (e) { console.error(e); if (typeof DDP !== 'undefined') DDP.err = e; }
    if (M8.endAt && ts > M8.endAt) { m8End(); return; }
    M8.raf = requestAnimationFrame(m8Loop);
}
function m8End() {
    m8Stop();
    if (M8.lvl === 'burma') { campaignMission = 13; selectedGameMode = 'campaign'; if (M8.done) { progression.campaignM13Done = true; try { addXP(1500, 'victory'); saveProgression(); } catch (e) {} m13PlayEnding(function () { showCampaignResult(true); }); } else showCampaignResult(false); return; }
    if (M8.lvl === 'peene') { campaignMission = 12; selectedGameMode = 'campaign'; if (M8.done) { progression.campaignM12Done = true; try { addXP(1500, 'victory'); saveProgression(); } catch (e) {} m12PlayEnding(function () { showCampaignResult(true); }); } else showCampaignResult(false); return; }
    if (M8.done) { progression.campaignM8Done = true; try { addXP(900, 'victory'); } catch (e) {} try { saveProgression(); } catch (e) {} }
    selectedGameMode = 'campaign';
    if (M8.lvl === 'chateau') { campaignMission = 9; M9.failWhy = M8.failWhy || 'leader'; showCampaignResult(false); return; }
    campaignMission = 8;
    if (M8.done) m8PlayEnding(function () { showCampaignResult(true); }); else showCampaignResult(false);
}
function m8Stars() { return 1 + (M8.alarm ? 0 : 1) + (M8.units.slice(1, 5).every(function (u) { return !u.dead; }) ? 1 : 0); }

function m8Update(dt, now) {
    if (M8.safeOpen) return;
    const L = m8Leader(), units = m8Units(), sneak = !!(M8.k.ShiftLeft || M8.k.ShiftRight);
    M8.shake = Math.max(0, M8.shake - .4 * dt);
    m8UpdateParts(dt, now);
    if (M8.fadeTo) { M8.fade = Math.min(1, M8.fade + .08 * dt); if (M8.fade >= 1) { const f = M8.fadeTo; M8.fadeTo = null; f(); } return; } else M8.fade = Math.max(0, M8.fade - .05 * dt);
    if (M8.scene === 'out') m8Camera(L, dt);
    if (M8.failed || M8.done) return;
    // ---- leader
    let dx = 0, dy = 0; if (keys.w || M8.k.KeyW || M8.k.ArrowUp) dy--; if (keys.s || M8.k.KeyS || M8.k.ArrowDown) dy++; if (keys.a || M8.k.KeyA || M8.k.ArrowLeft) dx--; if (keys.d || M8.k.KeyD || M8.k.ArrowRight) dx++;
    const heavy = M8_PRIMARY[M8.loadout.p].heavy || 1, lsp = (sneak ? 1.05 : 2.2) * dt * (M8.wi === 0 ? heavy : Math.min(1, heavy + .12)); L.moving = !!(dx || dy); if (L.moving) { const l = Math.hypot(dx, dy); m8Move(L, dx / l * lsp, dy / l * lsp); L.mvAng = m8Turn(L.mvAng === undefined ? -Math.PI / 2 : L.mvAng, Math.atan2(dy, dx), .12); L.walk = (L.walk || 0) + lsp; }
    if (L.moving && !sneak) m8Noise(L.x, L.y, M8.scene === 'out' ? 55 : 70);
    L.sneak = sneak;
    const wx = M8.mx + (M8.scene === 'out' ? M8.cam.x : 0), wy = M8.my + (M8.scene === 'out' ? M8.cam.y : 0); L.ang = Math.atan2(wy - L.y, wx - L.x); M8.aimX = wx; M8.aimY = wy;
    const w = m8Gun(), wi = M8.wi;
    if (wi < 2 && M8.reloadUntil[wi] && now > M8.reloadUntil[wi]) { M8.reloadUntil[wi] = 0; const need = Math.min(w.mag - M8.ammo[wi], M8.res[wi]); M8.ammo[wi] += need; M8.res[wi] -= need; }
    if ((M8.mdown || M8.k.Space) && now - M8.lastShot > (w.rate || 700) && !(wi < 2 && M8.reloadUntil[wi])) {
        if (w.type === 'melee') { M8.lastShot = now; m8Fire(L, L.ang, w, 'sq'); M8.mdown = false; }
        else if (M8.ammo[wi] > 0) { M8.lastShot = now; M8.ammo[wi]--; m8Fire(L, L.ang, w, 'sq', wx, wy); if (wi < 2 && M8.ammo[wi] === 0) m8Reload(); if (!w.auto) M8.mdown = false; }
        else { if (wi < 2) m8Reload(); else { m8Float(L, 'NONE LEFT', '#ff9a70'); M8.mdown = false; M8.lastShot = now; } }
    }
    // ---- loot bodies
    M8.bodies.forEach(function (b) { if (b.looted || b.scene !== M8.scene || Math.hypot(b.x - L.x, b.y - L.y) > 20) return; b.looted = true; const S = m8Slots(), got = []; [0, 1].forEach(function (i) { if (S[i].mag) { const add = Math.max(1, Math.ceil(S[i].mag * (S[i].mag === 1 ? 2 : .6))); M8.res[i] += add; got.push('+' + add + ' ' + S[i].short); } }); if (b.u && b.u.kind === 'sold' && Math.random() < .35) { M8.ammo[2]++; got.push('+1 ' + S[2].short); } m8Float(L, got.join('  ') || 'NOTHING', '#bfe8a0'); try { playTone(660, 880, .06, .03, 'triangle'); } catch (e) {} });
    // ---- squad
    const fa = L.mvAng === undefined ? -Math.PI / 2 : L.mvAng, ca = Math.cos(fa + Math.PI / 2), sa = Math.sin(fa + Math.PI / 2);
    units.forEach(function (u) { if (u.kind !== 'cmdo' || u.dead) return; const o = M8_FORM[u.slot], tx = L.x + o[0] * ca - o[1] * sa, ty = L.y + o[0] * sa + o[1] * ca, d = Math.hypot(tx - u.x, ty - u.y);
        u.moving = false; u.sneak = sneak; const px = u.x, py = u.y; if (d > 3) m8Steer(u, tx, ty, Math.min(d * .25, (sneak ? 1.3 : 2.6) + d * .02) * dt); u.walk = (u.walk || 0) + Math.hypot(u.x - px, u.y - py); if (d > 240 || (d > 90 && m8Blocked(u.x, u.y, u.r))) { if (!m8Blocked(tx, ty, u.r)) { u.x = tx; u.y = ty; } else { u.x = L.x; u.y = L.y; } }
        let best = null, bd = 1e9; units.forEach(function (e) { if (e.team !== 'en' || e.dead) return; const aware = e.state === 'alert' || e.state === 'alerting' || e.state === 'flee' || (M8.lastTarget === e && now - M8.lastTargetAt < 2500); if (!aware || (e.kind === 'tower' && !M8.alarm)) return; const dd = Math.hypot(e.x - u.x, e.y - u.y); if (dd < 420 && dd < bd && m8LOS(u.x, u.y, e.x, e.y)) { bd = dd; best = e; } });
        if (best) { const a = Math.atan2(best.y - u.y, best.x - u.x); u.ang = m8Turn(u.ang, a, .25); if (now - u.lastShot > 650 + m8R(u.slot * 13 + Math.floor(now / 500)) * 350) { u.lastShot = now; m8Fire(u, a, { dmg: u.gun === 'delisle' ? 90 : 32, spread: .07, range: 430, speed: 24, noise: M8.alarm ? 400 : 90 }, 'sq'); } }
        else u.ang = m8Turn(u.ang, L.moving ? fa + (u.slot < 2 ? (u.slot ? .5 : -.5) : (u.slot === 2 ? -2.6 : 2.6)) : L.ang, .08); });
    // ---- enemies
    const sq = units.filter(function (u) { return u.team === 'sq' && !u.dead; });
    units.forEach(function (e) { if (e.team !== 'en' || e.dead) return;
        if (e.stun > now) { e.moving = false; e.sus = 0; return; }
        if (e.kind === 'dog') { m9Dog(e, sq, now, dt, L); return; }
        if (e.kind === 'tower') e.la = (e.state === 'alert' && e.lx !== undefined) ? m8Turn(e.la, Math.atan2(e.ly - e.y, e.lx - e.x), .05) : e.base + Math.sin(now / 2200 + e.ph) * .75;
        let sees = null, sd = 1e9; const vang = e.kind === 'tower' ? e.la : e.ang, vr = (e.state === 'alert' ? 1.25 : 1) * e.view;
        if (e.state !== 'cower') sq.forEach(function (s) { const d = Math.hypot(s.x - e.x, s.y - e.y); if (d > vr) return; const aa = Math.atan2(s.y - e.y, s.x - e.x); if (m8AngDiff(aa, vang) > e.fov / 2 && d > 30) return; if (!m8LOS(e.x, e.y, s.x, s.y)) return; if (d < sd) { sd = d; sees = s; } });
        if (sees && e.state !== 'alert' && now - (M8.enterAt || 0) > 1600) { const lit = m8Lit(sees.x, sees.y), k = (1.3 - sd / vr) * (sneak ? .45 : 1) * (.5 + lit * 1.4) * (e.kind === 'tower' ? 1.5 : 1) * (sd < 60 ? 3 : 1); e.sus = Math.min(1, e.sus + .02 * k * dt); if (e.sus >= 1) m8Alerting(e, sees.x, sees.y); else if (e.sus > .35 && (e.state === 'patrol' || e.state === 'post' || e.state === 'work' || e.state === 'investigate') && e.kind !== 'tower') { if (e.state !== 'investigate') m8Bark(e, 'inv'); e.state = 'investigate'; e.ix = sees.x; e.iy = sees.y; } }
        else if (e.state !== 'alert' && e.state !== 'alerting') e.sus = Math.max(0, e.sus - .003 * dt);
        if (sees) { e.lx = sees.x; e.ly = sees.y; e.seen = now; }
        if (e.kind !== 'tower' && (e.state === 'patrol' || e.state === 'post' || e.state === 'work' || e.state === 'investigate')) M8.bodies.forEach(function (b) { if (b.found || b.scene !== M8.scene) return; const d = Math.hypot(b.x - e.x, b.y - e.y), aa = Math.atan2(b.y - e.y, b.x - e.x); if (d < 170 && m8AngDiff(aa, e.ang) < e.fov / 2 && m8LOS(e.x, e.y, b.x, b.y)) { b.found = true; m8Float(e, 'Ein Toter!', '#ff8a70'); m8Alerting(e, b.x, b.y); } });
        if (e.state === 'alerting' && now > e.alertAt) { m8RaiseAlarm(e.kind === 'tower' ? 'A SEARCHLIGHT HAS US' : 'A SENTRY RAISED THE ALARM'); e.state = 'alert'; }
        if (e.kind === 'tower') { if ((e.state === 'alert' || M8.alarm) && sees && now - e.lastShot > 900) { e.lastShot = now; m8Fire(e, Math.atan2(sees.y - e.y, sees.x - e.x), { dmg: 10, spread: .07, range: 520, speed: 24, noise: 0 }, 'en'); } return; }
        const sp = e.spd * dt, px = e.x, py = e.y;
        if (e.state === 'patrol' && e.route) { if (e.delay > 0) { e.delay -= dt; e.moving = false; } else { const p = e.route[e.ri]; e.moving = true; if (m8Steer(e, p[0], p[1], sp)) e.ri = (e.ri + 1) % e.route.length; } }
        else if (e.state === 'post' || e.state === 'work') { e.moving = false; e.ang = m8Turn(e.ang, (e.base || 0) + Math.sin(now / 3000 + e.seed) * (e.state === 'work' ? .35 : .6), .03); }
        else if (e.state === 'investigate') { e.moving = true; if (m8Steer(e, e.ix, e.iy, sp * .9)) { e.state = e.route ? 'patrol' : (e.kind === 'eng' ? 'work' : 'post'); e.sus = .3; } }
        else if (e.state === 'flee') { e.moving = true; const R = M8.scene !== 'out' ? M8.rooms[M8.scene] : null; if (R && R.bell) { m8Steer(e, R.bell.x, R.bell.y, 1.5 * dt); if (Math.hypot(e.x - R.bell.x, e.y - R.bell.y) < 30) { m8RaiseAlarm('AN ENGINEER RANG THE ALARM BELL'); e.state = 'cower'; M8.bellAt = now; } } else e.state = 'cower'; }
        else if (e.state === 'alerting') { e.moving = false; if (e.lx !== undefined) e.ang = m8Turn(e.ang, Math.atan2(e.ly - e.y, e.lx - e.x), .15); }
        else if (e.state === 'cower') { e.moving = false; }
        else if (e.state === 'alert') {
            if (sees) { const a = Math.atan2(sees.y - e.y, sees.x - e.x); e.ang = m8Turn(e.ang, a, .2); e.moving = sd > 170 && e.kind !== 'mg'; if (e.moving) m8Steer(e, sees.x, sees.y, sp * .7); const rate = e.kind === 'mg' ? 150 : e.gun === 'mp40' ? 420 : 1000; if (now - e.lastShot > rate) { e.lastShot = now; m8Fire(e, e.ang, { dmg: e.kind === 'mg' ? 8 : e.gun === 'mp40' ? 9 : 15, spread: e.kind === 'mg' ? .13 : .09, range: 520, speed: 22, noise: 0 }, 'en'); } }
            else if (e.lx !== undefined && e.kind !== 'mg') { e.moving = true; if (Math.random() < .002) m8Bark(e, 'hunt'); if (m8Steer(e, e.lx, e.ly, sp * 1.3)) { e.lx = L.x + (Math.random() - .5) * 200; e.ly = L.y + (Math.random() - .5) * 200; } }
            else e.moving = false;
        }
        e.walk = (e.walk || 0) + Math.hypot(e.x - px, e.y - py);
    });
    if (M8.alarm && M8.scene === 'out' && M8.reinf < 4 && now - M8.alarmAt > 9000 + M8.reinf * 16000) { M8.reinf++; for (let k = 0; k < 3; k++) { const h = M8.reinfPts[k % 2]; M8.units.push(m8Unit({ team: 'en', kind: 'sold', gun: k % 2 ? 'mp40' : 'kar98', x: h[0] + k * 14, y: h[1] + 30, state: 'alert', spd: 1.3, lx: L.x, ly: L.y })); } m8Say('REINFORCEMENTS FROM THE BARRACKS!', 2600); }
    // ---- bullets
    M8.bullets.forEach(function (b) { for (let s = 0; s < 3 && b.life > 0; s++) { b.x += b.vx / 3 * dt; b.y += b.vy / 3 * dt; if (b.curve) { const cc = Math.cos(b.curve * dt / 3), sn = Math.sin(b.curve * dt / 3), vx = b.vx * cc - b.vy * sn; b.vy = b.vx * sn + b.vy * cc; b.vx = vx; }
        if (m8BlockedBullet(b.x, b.y, b.pierce)) { b.life = 0; for (let i = 0; i < 3; i++) M8.parts.push({ k: 'spark', x: b.x, y: b.y, vx: -b.vx * .08 + (Math.random() - .5) * 2, vy: -b.vy * .08 + (Math.random() - .5) * 2, life: 1, decay: .08, scene: M8.scene }); if (M8.decals.length < 600) M8.decals.push({ k: 'hole', x: b.x, y: b.y, scene: M8.scene }); break; }
        const hit = units.find(function (u) { return !u.dead && u.team !== b.team && b.hit.indexOf(u) < 0 && Math.hypot(u.x - b.x, u.y - b.y) < (u.kind === 'tower' ? 18 : u.r + 2); });
        if (hit) { b.hit.push(hit); m8DamageUnit(hit, b.dmg, Math.atan2(b.vy, b.vx), b.from); if (b.team === 'sq') { M8.lastTarget = hit; M8.lastTargetAt = now; } if (b.pierce > 0) b.pierce--; else { b.life = 0; break; } } } b.life -= dt; });
    M8.bullets = M8.bullets.filter(function (b) { return b.life > 0; });
    m8UpdateProj(dt, now, units);
    M8.fx = M8.fx.filter(function (f) { return now - f.t < 1400; });
    M8.texts = M8.texts.filter(function (t) { return now - t.at < 1600; });
    M8.smokes = M8.smokes.filter(function (s) { return (now - s.t) / 1000 < s.dur; });
    M8.flares = M8.flares.filter(function (f) { return now < f.until; });
    M8.mines = M8.mines.filter(function (m) { if (m.scene !== M8.scene || now < m.armAt) return true; const v = units.find(function (u) { return u.team === 'en' && !u.dead && u.kind !== 'tower' && Math.hypot(u.x - m.x, u.y - m.y) < 38; }); if (v) { m8Explode(m.x, m.y, m.w, m.from); return false; } return true; });
    M8.gases = M8.gases.filter(function (gz) { const a = (now - gz.t) / 1000; if (a > gz.dur) return false; if (gz.scene === M8.scene && a > .5) units.forEach(function (u) { if (u.dead || u.kind === 'tower' || Math.hypot(u.x - gz.x, u.y - gz.y) > gz.r * Math.min(1, a / 1.5)) return; if (u.team === 'en') { u.stun = Math.max(u.stun, now + 500); u.sus = 0; if (Math.random() < .01) m8Float(u, '*hust* *hust*', '#d8e0a0'); } else if (u.kind === 'leader' && Math.random() < .02) m8Float(u, '*cough*', '#d8e0a0'); }); return true; });
    M8.fires.forEach(function (f) { if (f.scene !== M8.scene) return; units.forEach(function (u) { if (!u.dead && Math.hypot(u.x - f.x, u.y - f.y) < f.r) m8DamageUnit(u, .9 * dt * (u.team === 'sq' ? .5 : 1), 0, null); }); if (Math.random() < .5) M8.parts.push({ k: 'fire', x: f.x + (Math.random() - .5) * f.r, y: f.y + (Math.random() - .5) * f.r, vx: 0, vy: -.3, life: 1, decay: .05, r: 8 + Math.random() * 10, scene: f.scene }); }); M8.fires = M8.fires.filter(function (f) { return now < f.until; });
    // ---- doors, planting, exfil
    const fPress = M8.k.KeyF || M8.k.KeyE;
    if (M8.lvl === 'chateau') { m9Interact(L, fPress, dt, now); return; }
    if (M8.lvl === 'peene') m12Update(dt, now, L);
    if (M8.lvl === 'burma') m13Update(dt, now, L);
    if (M8.scene === 'out') {
        M8.nearDoor = null; M8_DOORS.forEach(function (d) { if (Math.hypot(L.x - d.x, L.y - d.y) < 46) M8.nearDoor = d; });
        if (M8.nearDoor && !M8.rooms[M8.nearDoor.id].planted && fPress) { M8.k.KeyF = M8.k.KeyE = false; m8Enter(M8.nearDoor); }
        if (M8.planted >= 4) { M8.exfil = true; const EX = m8ExfilRect(); if (L.x > EX.x && L.x < EX.x + EX.w && L.y > EX.y && L.y < EX.y + EX.h && !M8.done) { M8.done = true; M8.detonated = now; M8.endAt = now + 1500; m8Say('CLEAR! BLOW IT!', 3000); try { playTone(300, 200, .3, .05, 'square'); } catch (e) {} } }
    } else {
        const R = M8.rooms[M8.scene]; R.cleared = R.units.every(function (u) { return u.dead; });
        const nt = Math.hypot(L.x - R.target.x, L.y - R.target.y) < 70;
        if (nt && !R.planted && fPress) { if (!R.cleared) { if (!M8.clearMsg || now - M8.clearMsg > 2500) { M8.clearMsg = now; m8Say('CLEAR THE ROOM FIRST — NO WITNESSES.', 2400); } } else { M8.plantT += dt / 60; if (Math.random() < .2) M8.parts.push({ k: 'spark', x: R.target.x + (Math.random() - .5) * 20, y: R.target.y + (Math.random() - .5) * 20, vx: 0, vy: -.5, life: .6, decay: .05, scene: M8.scene }); if (M8.plantT >= 2.2) { R.planted = true; M8.planted++; M8.plantT = 0; m8Say('CHARGE SET ON THE ' + R.target.name + '. ' + (4 - M8.planted ? (4 - M8.planted) + ' TO GO.' : 'ALL FOUR SET — GET OUT AND GET CLEAR!'), 4000); try { playTone(700, 1100, .3, .06, 'triangle'); } catch (e) {} } } } else M8.plantT = Math.max(0, M8.plantT - dt / 30);
        const ex = R.exit; if (L.x > ex.x && L.x < ex.x + ex.w && L.y > 640) m8Exit();
    }
}
function m8UpdateParts(dt, now) {
    const units = m8Units();
    M8.parts.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt;
        if (p.k === 'flame') { p.vx *= .97; p.vy *= .97; p.r += .5 * dt; if (p.scene === M8.scene) { if (m8BlockedBullet(p.x, p.y)) { p.vx *= -.2; p.vy *= -.2; } units.forEach(function (u) { if (!u.dead && u.team !== p.team && Math.hypot(u.x - p.x, u.y - p.y) < p.r + u.r) { m8DamageUnit(u, p.dmg * dt * .6, Math.atan2(p.vy, p.vx), p.from); u.burnUntil = now + 2500; } }); } }
        else if (p.k === 'smoke') { p.r += (p.grow || .3) * dt; p.vx *= .99; p.vy *= .99; }
        else if (p.k === 'casing' || p.k === 'blood' || p.k === 'spark' || p.k === 'ember') { p.vx *= .9; p.vy *= .9; if (p.k === 'blood' && p.life < .15 && !p.dec) { p.dec = 1; if (M8.decals.length < 600) M8.decals.push({ k: 'drop', x: p.x, y: p.y, r: 1.5 + Math.random() * 2, scene: p.scene }); } if (p.k === 'casing' && p.life < .05 && !p.dec && M8.decals.length < 600) { p.dec = 1; M8.decals.push({ k: 'brass', x: p.x, y: p.y, a: p.rot, scene: p.scene }); } }
        else if (p.k === 'fire') { p.vx *= .95; p.vy = p.vy * .95 - .05 * dt; p.r *= 1 + .01 * dt; }
    });
    M8.parts = M8.parts.filter(function (p) { return p.life > 0; }); if (M8.parts.length > 900) M8.parts.splice(0, M8.parts.length - 900);
    units.forEach(function (u) { if (!u.dead && u.burnUntil > now) { m8DamageUnit(u, .5 * dt, 0, null); if (Math.random() < .4) M8.parts.push({ k: 'fire', x: u.x + (Math.random() - .5) * 10, y: u.y + (Math.random() - .5) * 10, vx: 0, vy: -.4, life: 1, decay: .06, r: 5 + Math.random() * 5, scene: M8.scene }); if (u.team === 'en' && u.state !== 'alert' && u.state !== 'flee' && u.state !== 'cower') m8Alerting(u, u.x, u.y); } });
}
function m8UpdateProj(dt, now, units) {
    M8.proj.forEach(function (p) {
        if (p.k === 'nade') {
            if (!p.landed) { const k = Math.min(1, (now - p.t0) / p.dur); const nx = p.sx + (p.ex - p.sx) * k, ny = p.sy + (p.ey - p.sy) * k; if (m8BlockedBullet(nx, ny)) p.landed = true; else { p.x = nx; p.y = ny; } p.h = Math.sin(k * Math.PI) * Math.min(60, p.dur / 12); p.spin += .3 * dt; if (k >= 1) p.landed = true;
                if (p.landed) { p.h = 0; try { playTone(240, 160, .04, .03, 'triangle'); } catch (e) {} if (p.w.mine) { M8.mines.push({ x: p.x, y: p.y, armAt: now + 2000, w: p.w, from: p.from, scene: M8.scene }); p.dead = true; } else if (p.w.impact || p.w.decoy) { m8Explode(p.x, p.y, p.w, p.from); p.dead = true; } } }
            if (!p.dead && p.fuseAt && now > p.fuseAt) { m8Explode(p.x, p.y, p.w, p.from); p.dead = true; }
            return;
        }
        for (let s = 0; s < 3 && !p.dead; s++) { p.x += p.vx / 3 * dt; p.y += p.vy / 3 * dt; p.life -= dt / 3;
            if (p.k === 'rocket' && Math.random() < .5) M8.parts.push({ k: 'smoke', x: p.x, y: p.y, vx: 0, vy: 0, life: .7, decay: .03, r: 4, grow: .4, col: 'grey', scene: M8.scene });
            if (p.k === 'flare' && Math.random() < .5) M8.parts.push({ k: 'ember', x: p.x, y: p.y, vx: (Math.random() - .5), vy: (Math.random() - .5), life: 1, decay: .06, scene: M8.scene });
            const wall = m8BlockedBullet(p.x, p.y), hit = units.find(function (u) { return !u.dead && u.team !== p.team && Math.hypot(u.x - p.x, u.y - p.y) < (u.kind === 'tower' ? 18 : u.r + 3); });
            if (hit || wall || p.life <= 0) {
                if (p.k === 'rocket') m8Explode(p.x - p.vx * .5, p.y - p.vy * .5, p.w, p.from);
                else if (p.k === 'flare') { M8.flares.push({ x: p.x, y: p.y, r: 230, until: now + 10000, scene: M8.scene, t: now }); if (hit) { m8DamageUnit(hit, p.dmg, p.a, p.from); hit.burnUntil = now + 3000; } }
                else { if (hit) { m8DamageUnit(hit, p.dmg, p.a, p.from, true); if (hit.dead) hit.pinned = p.k; } else if (M8.decals.length < 600) M8.decals.push({ k: p.k === 'bolt' ? 'bolt' : 'knife', x: p.x, y: p.y, a: p.a, scene: M8.scene }); try { playTone(p.k === 'bolt' ? 300 : 900, 200, .04, .03, 'triangle'); } catch (e) {} }
                p.dead = true; }
        }
    });
    M8.proj = M8.proj.filter(function (p) { return !p.dead; });
}
function m8Camera(L, dt) { const tx = L.x - 550 + (M8.mx - 550) * .25, ty = L.y - 350 + (M8.my - 350) * .25; M8.cam.x += (Math.max(0, Math.min(M8W - 1100, tx)) - M8.cam.x) * Math.min(1, .12 * dt); M8.cam.y += (Math.max(0, Math.min(M8H - 700, ty)) - M8.cam.y) * Math.min(1, .12 * dt); }
function m8BlockedBullet(x, y, pierce) { for (let i = 0; i < M8.obs.length; i++) { const o = M8.obs[i]; if (o.low && o.kind !== 'sand') continue; if (o.kind === 'ridge') continue; if (pierce && (o.kind === 'crates' || o.kind === 'drums' || o.kind === 'hut' || o.kind === 'hut2' || o.kind === 'pallet')) continue; if (x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h) return true; } return false; }
function m8Enter(d) {
    M8.fadeTo = function () {
        M8.outPos = { x: d.ex !== undefined ? d.ex : d.x + d.side * 30, y: d.ey !== undefined ? d.ey : d.y + 30, saveObs: M8.obs }; M8.scene = d.id; const R = M8.rooms[d.id]; M8.obs = R.obs; M8.bullets = []; M8.proj = [];
        M8.enterAt = performance.now(); const L = m8Leader(); L.x = 550; L.y = 615; L.mvAng = -Math.PI / 2; M8.units.slice(1, 5).forEach(function (u, i) { if (!u.dead) { u.x = 550 + M8_FORM[i][0]; u.y = 600 + M8_FORM[i][1] * .5; } });
        try { playTone(220, 120, .25, .05, 'square'); } catch (e) {}
        m8Say(M8.lvl === 'chateau' ? m9EnterMsg(d, R) : d.name + (R.planted ? ' — ALREADY SET.' : ' — KILL THE CREW, THEN HOLD F ON THE ' + R.target.name + '.'), 4200);
    };
}
function m8Exit() {
    M8.fadeTo = function () { M8.scene = 'out'; M8.obs = M8.outPos.saveObs; M8.bullets = []; M8.proj = []; const L = m8Leader(); L.x = M8.outPos.x; L.y = M8.outPos.y; M8.units.slice(1, 5).forEach(function (u) { if (!u.dead) { u.x = L.x; u.y = L.y + 4; } }); if (M8.lvl === 'chateau') { if (M8.docs) m8Say('WE HAVE THE KEYS. TO THE STAFF CAR IN THE COURTYARD — MOVE!', 5000); } else if (M8.planted >= 4) m8Say(M8.lvl === 'burma' ? 'ALL FOUR SET — BACK TO THE GLIDER STRIP BEFORE THE TRAIN COMES!' : M8.lvl === 'peene' ? 'ALL FOUR SET — THE FUSES ARE BURNING. TO THE BEACH AND THE BOAT!' : 'ALL CHARGES SET — BACK TO THE SOUTH TREELINE AND WE BLOW IT!', 5000); };
}
function m8ExfilRect() { return M8.lvl === 'burma' ? M13_EXFIL : M8.lvl === 'peene' ? M12X.exfil : { x: 900, y: 1320, w: 600, h: 170 };
}
function startMission8(skipIntro) {
    returnToMenu(); campaignMission = 8; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; M8.pendingLvl = 'gustav';
    document.getElementById('menu').style.display = 'none'; const cs = document.getElementById('campaignScreen'); if (cs) cs.style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = true; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)'; if (typeof minimapPanel !== 'undefined' && minimapPanel) minimapPanel.style.display = 'none';
    if (skipIntro) { m8ShowBrief(); return; }
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM8Cutscene);
}
