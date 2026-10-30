/* =====================================================
   MISSION 11 — THE CASTLE (escape from Oflag IV-C, Colditz)
   WASD walk · SHIFT creep · SPACE sprint · F use / pick up · U uniform on/off · Q call the stooges
===================================================== */
const M11W = 2400, M11H = 1800, M11Z = 1.22;
const M11 = { running: false, failWhy: '', result: null };
/* ---------- geometry ---------- */
const M11_WALLS = [
    // cliffs + map edges
    [0, 0, 2400, 140, 'cliff'], [0, 140, 560, 130, 'cliff'], [1760, 140, 640, 940, 'cliff'], [1900, 1080, 500, 720, 'cliff'], [0, 270, 40, 1530, 'cliff'],
    // castle shell
    [560, 140, 1200, 30], [560, 170, 30, 510], [560, 730, 30, 350], [1730, 170, 30, 910], [560, 1050, 500, 30], [1160, 1050, 600, 30],
    // north wing (theatre | canteen)
    [590, 370, 290, 30], [930, 370, 450, 30], [1430, 370, 300, 30], [1060, 170, 30, 200],
    // west wing (quarters), east wing (chapel)
    [830, 400, 30, 160], [830, 620, 30, 200], [1460, 400, 30, 200], [1460, 660, 30, 160],
    // south wing: workshop door (from the quarters), the courtyard gate arch, guard room
    [590, 820, 110, 30], [760, 820, 300, 30], [1160, 820, 570, 30], [1030, 850, 30, 200], [1160, 850, 30, 50], [1160, 960, 30, 90], [40, 1690, 630, 22],
    // terrace walls, Kommandantur yard walls, the town
    [330, 270, 230, 30], [330, 1100, 340, 30], [670, 1080, 30, 450], [670, 1530, 30, 270], [670, 1500, 570, 30], [1320, 1500, 580, 30],
    [700, 1560, 420, 240, 'town'], [1440, 1560, 460, 240, 'town'], [1520, 1180, 240, 150, 'house']
];
const M11_FURN = [ // block feet, not eyes
    // quarters: two-tier bunks + stove + table
    [600, 420, 40, 90, 'bunk'], [600, 540, 40, 90, 'bunk'], [690, 560, 40, 90, 'bunk'], [700, 430, 90, 36, 'table'], [780, 760, 40, 40, 'stove'],
    // theatre: stage + benches
    [600, 180, 240, 70, 'stage'], [700, 290, 160, 18, 'bench'], [900, 290, 140, 18, 'bench'], [900, 240, 140, 18, 'bench'],
    // canteen tables
    [1150, 220, 160, 30, 'table'], [1400, 220, 160, 30, 'table'], [1150, 300, 160, 30, 'table'], [1600, 290, 100, 30, 'table'],
    // chapel pews + altar
    [1520, 450, 110, 16, 'pew'], [1520, 510, 110, 16, 'pew'], [1520, 690, 110, 16, 'pew'], [1520, 750, 110, 16, 'pew'], [1680, 560, 36, 90, 'altar'],
    // workshop benches + parcels
    [600, 880, 80, 34, 'bench2'], [840, 880, 150, 34, 'bench2'], [600, 990, 100, 40, 'parcels'], [900, 990, 110, 40, 'bench2'],
    // guard room
    [1260, 880, 120, 50, 'desk'], [1500, 980, 160, 40, 'rack'], [1650, 870, 60, 60, 'stove'],
    // yard: lorry, staff car, crates, woodpile; park: towers; courtyard: well
    [900, 1250, 60, 130, 'lorry'], [1100, 1380, 110, 48, 'car'], [1400, 1120, 70, 50, 'crates'], [780, 1120, 120, 40, 'wood'], [180, 285, 34, 34, 'tower'], [585, 1545, 34, 34, 'tower'], [1385, 735, 40, 40, 'well']
];
const M11_ZONES = [
    { r: [590, 170, 470, 200], z: 'pow', n: 'THE THEATRE' }, { r: [1090, 170, 640, 200], z: 'pow', n: 'THE CANTEEN' }, { r: [590, 400, 240, 420], z: 'pow', n: 'BRITISH QUARTERS' },
    { r: [1490, 400, 240, 420], z: 'pow', n: 'THE CHAPEL' }, { r: [860, 400, 600, 420], z: 'pow', n: 'PRISONERS\' COURTYARD' }, { r: [590, 850, 440, 200], z: 'pow', n: 'PARCELS OFFICE' },
    { r: [1060, 820, 100, 260], z: 'ger', n: 'THE GATE ARCH' }, { r: [1190, 850, 540, 200], z: 'ger', n: 'GUARD ROOM' }, { r: [700, 1080, 1200, 420], z: 'ger', n: 'KOMMANDANTUR YARD' },
    { r: [338, 300, 222, 800], z: 'park', n: 'WEST TERRACE' }, { r: [40, 270, 282, 860], z: 'park', n: 'THE PARK' }, { r: [40, 1130, 630, 670], z: 'park', n: 'THE PARK' }, { r: [1120, 1530, 320, 270], z: 'out', n: 'THE ROAD SOUTH' }];
const M11_ITEMS = [
    { id: 'blank', name: 'BLANK AUSWEIS', where: 'THEATRE — under the stage', x: 720, y: 262 },
    { id: 'tunic', name: 'HALF-SEWN TUNIC', where: 'QUARTERS — behind the stove', x: 760, y: 780 },
    { id: 'key', name: 'TERRACE KEY', where: 'CHAPEL — behind the altar', x: 1720, y: 670 }];
const M11_CGATE = [1060, 820, 100, 30], M11_MGATE = [1240, 1500, 80, 30], M11_TDOOR = [560, 680, 30, 50];
const M11_FIN = { x: 330, y0: 300, y1: 1100 }, M11_FOUT = { y: 1600, x0: 40, x1: 670 };
const M11_APPELL = [1020, 530, 280, 160];
function m11In(r, x, y, pad) { pad = pad || 0; return x > r[0] - pad && x < r[0] + r[2] + pad && y > r[1] - pad && y < r[1] + r[3] + pad; }
function m11Zone(x, y) { for (let i = 0; i < M11_ZONES.length; i++) if (m11In(M11_ZONES[i].r, x, y)) return M11_ZONES[i]; return { z: 'ger', n: '' }; }
function m11HitR(x, y, r, R) { const cx = Math.max(R[0], Math.min(x, R[0] + R[2])), cy = Math.max(R[1], Math.min(y, R[1] + R[3])); return (x - cx) * (x - cx) + (y - cy) * (y - cy) < r * r; }
function m11Blocked(x, y, r, who) {
    const M = M11; if (x < r || y < r || x > M11W - r || y > M11H - r) return true;
    for (let i = 0; i < M11_WALLS.length; i++) if (m11HitR(x, y, r, M11_WALLS[i])) return true;
    for (let i = 0; i < M11_FURN.length; i++) if (m11HitR(x, y, r, M11_FURN[i])) return true;
    if (!M.tdoorOpen && m11HitR(x, y, r, M11_TDOOR)) return true;
    if (who === 'p') {
        if (!M.mgateOpen && m11HitR(x, y, r, M11_MGATE)) return true;
        if (!(M.p.uni && !M.alarm) && !(M.archBribed > performance.now()) && m11HitR(x, y, r, M11_CGATE)) return true;
        // the wire
        if (Math.abs(x - M11_FIN.x) < r + 6 && y > M11_FIN.y0 && y < M11_FIN.y1 && !M.gapsIn.some(function (g) { return Math.abs(g - y) < 26; })) return true;
        if (Math.abs(y - M11_FOUT.y) < r + 6 && x > M11_FOUT.x0 && x < M11_FOUT.x1 && !M.gapsOut.some(function (g) { return Math.abs(g - x) < 26; })) return true;
    } else {
        if (Math.abs(x - M11_FIN.x) < r + 4 && y > M11_FIN.y0 && y < M11_FIN.y1) return true;
        if (Math.abs(y - M11_FOUT.y) < r + 4 && x > M11_FOUT.x0 && x < M11_FOUT.x1) return true;
    }
    return false;
}
function m11SegHits(x0, y0, x1, y1, R) { return m8SegRect(x0, y0, x1, y1, { x: R[0], y: R[1], w: R[2], h: R[3] }); }
function m11LOS(x0, y0, x1, y1) { for (let i = 0; i < M11_WALLS.length; i++) if (m11SegHits(x0, y0, x1, y1, M11_WALLS[i])) return false; if (!M11.tdoorOpen && m11SegHits(x0, y0, x1, y1, M11_TDOOR)) return false; return m11SmokeLOS(x0, y0, x1, y1); }
/* ---------- path-finding for guards (grid A*, string-pulled) ---------- */
function m11Nav() { const M = M11; if (M.nav) return M.nav; const C = 20, cw = M11W / C, ch = M11H / C, g = new Uint8Array(cw * ch); for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) g[y * cw + x] = m11Blocked(x * C + 10, y * C + 10, 11, 'g') ? 1 : 0; M.nav = { C: C, cw: cw, ch: ch, g: g }; return M.nav; }
function m11Clear(x0, y0, x1, y1, r) { const d = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(d / 9); for (let i = 1; i <= n; i++) { const k = i / n; if (m11Blocked(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, r, 'g')) return false; } return true; }
function m11Path(sx, sy, tx, ty) {
    const N = m11Nav(), C = N.C, cw = N.cw, free = function (cx, cy) { const ok = function (x, y) { return x >= 0 && y >= 0 && x < cw && y < N.ch && !N.g[y * cw + x]; }; if (ok(cx, cy)) return [cx, cy]; for (let r = 1; r < 6; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (ok(cx + dx, cy + dy)) return [cx + dx, cy + dy]; return null; };
    const s = free(Math.floor(sx / C), Math.floor(sy / C)), t = free(Math.floor(tx / C), Math.floor(ty / C)); if (!s || !t) return null;
    const S = s[1] * cw + s[0], T = t[1] * cw + t[0], tot = cw * N.ch, gS = new Float32Array(tot).fill(1e9), from = new Int32Array(tot).fill(-1), closed = new Uint8Array(tot), heap = [];
    const hz = function (i) { const x = i % cw, y = (i / cw) | 0, dx = Math.abs(x - t[0]), dy = Math.abs(y - t[1]); return Math.max(dx, dy) + .414 * Math.min(dx, dy); };
    const push = function (i, f) { heap.push([f, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; const q = heap[p]; heap[p] = heap[k]; heap[k] = q; k = p; } };
    const pop = function () { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = k * 2 + 1, rr = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (rr < heap.length && heap[rr][0] < heap[m][0]) m = rr; if (m === k) break; const q = heap[m]; heap[m] = heap[k]; heap[k] = q; k = m; } } return top; };
    gS[S] = 0; push(S, hz(S)); let found = false, it = 0;
    while (heap.length && it++ < 16000) { const cur = pop()[1]; if (cur === T) { found = true; break; } if (closed[cur]) continue; closed[cur] = 1; const x = cur % cw, y = (cur / cw) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= cw || ny >= N.ch) continue; const ni = ny * cw + nx; if (N.g[ni] || closed[ni]) continue; if (dx && dy && (N.g[y * cw + nx] || N.g[ny * cw + x])) continue; const ng = gS[cur] + (dx && dy ? 1.414 : 1); if (ng < gS[ni]) { gS[ni] = ng; from[ni] = cur; push(ni, ng + hz(ni)); } } }
    if (!found) return null;
    const cells = []; for (let i = T; i !== -1; i = from[i]) cells.push([(i % cw) * C + 10, ((i / cw) | 0) * C + 10]); cells.reverse(); cells.push([tx, ty]);
    const out = []; let ax = sx, ay = sy, k = 0;
    while (k < cells.length - 1) { let far = k + 1; for (let j = Math.min(cells.length - 1, k + 40); j > k + 1; j--) { if (m11Clear(ax, ay, cells[j][0], cells[j][1], 11)) { far = j; break; } } out.push(cells[far]); ax = cells[far][0]; ay = cells[far][1]; k = far; }
    return out;
}
function m11Go(u, tx, ty, sp, dt) { // walk toward (tx,ty), path-finding round walls; true when there
    const d = Math.hypot(tx - u.x, ty - u.y); if (d < sp * dt + 2) { u.x = tx; u.y = ty; u.path = null; u.moving = false; return true; }
    const now = performance.now(); let gx = tx, gy = ty;
    if (!u.clrAt || now - u.clrAt > 350) { u.clrAt = now; u.clr = m11Clear(u.x, u.y, tx, ty, 9); }
    if (!u.clr) { const key = Math.round(tx / 30) + ',' + Math.round(ty / 30); if (!u.path || u.pathKey !== key || !u.path.length) { u.path = m11Path(u.x, u.y, tx, ty) || []; u.pathKey = key; } const P = u.path; while (P.length > 1 && Math.hypot(P[0][0] - u.x, P[0][1] - u.y) < sp * dt + 6) P.shift(); if (P.length) { gx = P[0][0]; gy = P[0][1]; } } else u.path = null;
    const a = Math.atan2(gy - u.y, gx - u.x), offs = [0, .5, -.5, 1.1, -1.1, 1.7, -1.7];
    for (let i = 0; i < offs.length; i++) { const nx = u.x + Math.cos(a + offs[i]) * sp * dt, ny = u.y + Math.sin(a + offs[i]) * sp * dt; if (!m11Blocked(nx, ny, 9, 'g')) { u.x = nx; u.y = ny; u.ang = m8Turn(u.ang, a, .14 * dt); u.moving = true; u.walk = (u.walk || 0) + sp * dt; u.stuck = 0; return false; } }
    u.stuck = (u.stuck || 0) + 1; u.moving = false; if (u.stuck > 90) { u.stuck = 0; u.path = null; return true; } return false;
}
/* ---------- setup ---------- */
function m11Begin() {
    const M = M11, now = performance.now();
    Object.assign(M, { running: true, t0: now, last: now, k: {}, failWhy: '', result: null, won: false, lost: false, endAt: 0, msg: '', msgAt: 0, msgDur: 0, alarm: false, alarmUntil: 0, alarmEver: false, missedRoll: false, rolls: 0, lastSeen: null, cam: { x: 600, y: 300 }, fx: [], parts: [], texts: [], shake: 0, nav: null,
        p: { x: 760, y: 600, ang: -Math.PI / 2, hp: 100, uni: false, has: {}, act: null, actT: 0, changeT: 0, walk: 0, moving: false, hurtAt: 0, sprint: false, creep: false },
        tdoorOpen: false, mgateOpen: false, gapsIn: [], gapsOut: [], stooges: 3, stoogeUntil: 0, stoogeAt: null, roll: { phase: 0, next: now + 90000, countAt: 0 }, items: M11_ITEMS.map(function (i) { return Object.assign({ taken: false }, i); }) });
    const G = function (o) { return Object.assign({ ang: Math.PI / 2, wi: 0, wait: 0, spd: .85, sus: 0, state: 'patrol', seed: Math.random() * 99 | 0, gun: 'kar98', view: 250, fov: 1.25, hp: 1, maxHp: 1, team: 'en', kind: 'sold', r: 10 }, o, { x: (o.route ? o.route[0][0] : o.x), y: (o.route ? o.route[0][1] : o.y), hx: o.x, hy: o.y }); };
    M.guards = [
        G({ name: 'ferret', route: [[900, 450], [1420, 450], [1420, 790], [900, 790]], spd: .7 }),
        G({ name: 'ferret', route: [[905, 440], [905, 330], [640, 320], [1000, 330], [905, 330], [905, 440], [1405, 440], [1405, 330], [1150, 340], [1680, 330], [1405, 330], [1405, 440]], gun: 'mp40' }),
        G({ name: 'ferret', route: [[890, 590], [790, 590], [730, 700], [810, 950], [960, 955], [650, 955], [810, 950], [730, 700], [790, 590]] }),
        G({ name: 'ferret', route: [[1430, 630], [1550, 630], [1650, 470], [1550, 630], [1650, 790], [1550, 630]], gun: 'mp40' }),
        G({ name: 'gate', x: 1110, y: 885, ang: -Math.PI / 2, post: true, view: 220 }),
        G({ name: 'guard', route: [[1110, 930], [1250, 930], [1450, 920], [1700, 1020], [1450, 1020], [1250, 930]], gun: 'mp40' }),
        G({ name: 'officer', officer: true, route: [[800, 1200], [1360, 1200], [1440, 1440], [800, 1440]], gun: 'luger', spd: .7, view: 270 }),
        G({ name: 'guard', route: [[1100, 1110], [1860, 1110], [1860, 1420], [1480, 1420], [1480, 1110]] }),
        G({ name: 'guard', route: [[740, 1300], [1460, 1300]], gun: 'mp40' }),
        G({ name: 'gate', main: true, x: 1280, y: 1470, ang: -Math.PI / 2, post: true, view: 230 }),
        G({ name: 'guard', route: [[1280, 1580], [1280, 1770]], spd: .75 }),
        G({ name: 'guard', route: [[450, 330], [450, 1070]], spd: .8 }),
        G({ name: 'handler', route: [[100, 350], [280, 350], [280, 1200], [600, 1200], [600, 1520], [100, 1520]], spd: .8, gun: 'mp40', dog: true })];
    M.dog = { x: 110, y: 360, ang: 0, walk: 0, moving: false, kind: 'dog', team: 'en', state: 'patrol', hp: 1 };
    M.towers = [{ x: 197, y: 302, base: Math.PI / 2 + .25, amp: .75, spd: .00045, ph: 0 }, { x: 602, y: 1562, base: Math.PI + .3, amp: .7, spd: .0005, ph: 2 }].map(function (T) { return Object.assign(T, { ang: T.base, len: 520, half: .12, lastShot: 0 }); });
    M.lamps = [[960, 470, 150], [1360, 470, 150], [960, 760, 150], [1360, 760, 150], [710, 600, 140], [820, 260, 150], [1400, 270, 170], [1610, 600, 150], [800, 950, 150], [1110, 950, 110], [1450, 940, 160], [1000, 1200, 200], [1650, 1400, 200], [1280, 1440, 160], [1280, 1640, 140], [450, 700, 120]].map(function (l) { return { x: l[0], y: l[1], r: l[2] }; });
    M.pows = []; for (let i = 0; i < 22; i++) { const room = i < 14 ? [880, 420, 560, 380] : i < 18 ? [620, 440, 180, 330] : [1120, 200, 580, 150]; M.pows.push({ x: room[0] + m8R(i * 3) * room[2], y: room[1] + m8R(i * 7) * room[3], room: room, ang: m8R(i) * 6, tx: 0, ty: 0, wait: m8R(i + 5) * 200, walk: 0, seed: i, coat: ['#6a6040', '#4e5a6a', '#5a5636', '#3e4a5e', '#6e5a3c'][i % 5], slot: i }); }
    M.pows.forEach(function (n) { n.tx = n.x; n.ty = n.y; });
    m11CraftInit(M);
    if (!M.base) M.base = m11BuildBase();
    m11Say('THE COMMITTEE HAS HIDDEN YOUR KIT. SEARCH THE CASTLE (F) FOR ODDS AND ENDS AND CRAFT (C). FIRST ROLL CALL IN 90 SECONDS.', 6400);
    ['m2Brief', 'm8Arm', 'm9Safe'].forEach(function (id) { const e = document.getElementById(id); if (e) e.hidden = true; });
    const mb = document.getElementById('battleMainMenuButton'); if (mb) { mb.style.display = 'block'; mb.textContent = '↩️ ABORT MISSION'; }
    canvas.style.cursor = 'none';
    if (!M.listeners) { M.listeners = true;
        window.addEventListener('keydown', function (e) { if (!M11.running) return; M11.k[e.code] = true; if (e.code === 'Space') e.preventDefault(); if (e.code === 'KeyC' || (e.code === 'Escape' && M11.craftOpen)) { M11.craftOpen = !M11.craftOpen; M11.craftMsg = ''; M11.k = {}; return; } if (M11.craftOpen) return; if (e.code === 'KeyU') m11ToggleUniform(); if (e.code === 'KeyQ') m11Stooges(); if (e.code === 'KeyE') m11Takedown(); const dg = ['Digit1', 'Digit2', 'Digit3', 'Digit4'].indexOf(e.code); if (dg >= 0) M11.hot = dg; });
        canvas.addEventListener('mousemove', function (e) { const r = canvas.getBoundingClientRect(); M11.mx = (e.clientX - r.left) * 1100 / r.width; M11.my = (e.clientY - r.top) * 700 / r.height; });
        canvas.addEventListener('mousedown', function (e) { if (!M11.running || e.button !== 0) return; if (M11.craftOpen) m11CraftClick(); else m11Use(performance.now()); });
        window.addEventListener('keyup', function (e) { M11.k[e.code] = false; });
        window.addEventListener('blur', function () { M11.k = {}; });
    }
    try { initAudio(); } catch (e) {}
    cancelAnimationFrame(M.raf); M.raf = requestAnimationFrame(m11Loop);
}
function m11Cleanup() { M11.running = false; cancelAnimationFrame(M11.raf); }
function m11Say(t, ms) { M11.msg = t; M11.msgAt = performance.now(); M11.msgDur = ms || 3000; }
function m11Float(x, y, t, col) { M11.texts.push({ x: x, y: y - 24, t: t, col: col || '#ffd88a', at: performance.now() }); }
function m11ToggleUniform() { const M = M11, P = M.p; if (!P.has.uniform || M.lost || M.won || P.changeT > 0) return; P.changeT = 1.3; P.changeTo = !P.uni; try { playTone(300, 260, .2, .03, 'triangle'); } catch (e) {} }
function m11Stooges() { const M = M11, now = performance.now(); if (M.stooges <= 0 || M.lost || M.won) return; if (M.alarm) { m11Say('NOT NOW — THE WHOLE CASTLE IS ON ALERT.', 1800); return; } M.stooges--; M.stoogeUntil = now + 12000; M.stoogeAt = { x: 1160, y: 610 };
    m11Say('THE STOOGES START A RUCKUS IN THE COURTYARD — THE GOONS GO TO LOOK. (' + M.stooges + ' LEFT)', 3200);
    M.guards.forEach(function (g) { if (g.state === 'chase' || g.main || g.name === 'handler') return; if (Math.hypot(g.x - 1160, g.y - 610) < 750) { g.state = 'baited'; g.ix = 1060 + Math.random() * 200; g.iy = 520 + Math.random() * 180; g.sus = 0; m11Float(g.x, g.y, ['Was ist los?', 'Ruhe!', 'Schon wieder!'][Math.floor(Math.random() * 3)], '#ffd88a'); } });
    try { [520, 640, 470, 700].forEach(function (f, i) { setTimeout(function () { try { playTone(f, f * .8, .15, .03, 'square'); } catch (e) {} }, i * 160); }); } catch (e) {} }
function m11Loop(now) { if (!M11.running) return; if (typeof minimapPanel !== 'undefined' && minimapPanel && minimapPanel.style.display !== 'none') minimapPanel.style.display = 'none'; const dt = Math.min(50, now - M11.last) / 16.67; M11.last = now; if (M11.craftOpen) { try { m11Draw(now); m11CraftPanel(now); } catch (e) { console.error(e); DDP.err = e; } M11.raf = requestAnimationFrame(m11Loop); return; } try { m11Update(dt, now); if (!M11.running) return; m11Draw(now); } catch (e) { console.error(e); DDP.err = e; } if (M11.endAt && now > M11.endAt) { m11End(); return; } M11.raf = requestAnimationFrame(m11Loop); }
function m11Lose(why) { const M = M11; if (M.lost || M.won) return; M.lost = true; M.failWhy = why; M.endAt = performance.now() + 3000; try { playTone(300, 120, .6, .06, 'sawtooth'); } catch (e) {} }
function m11Hurt(d) { const P = M11.p; if (M11.lost || M11.won) return; P.hp -= d; P.hurtAt = performance.now(); M11.shake = Math.max(M11.shake, 5); try { playTone(180, 80, .15, .06, 'square'); } catch (e) {} if (P.hp <= 0) { P.hp = 0; m11Lose('shot'); } }
function m11Alarm(x, y, why) { const M = M11, now = performance.now(); M.lastSeen = { x: x, y: y, t: now }; if (!M.alarm) { M.alarm = true; M.alarmEver = true; m11Say(why || 'ALARM! THE WHISTLES ARE GOING — GET OUT OF SIGHT!', 3000); M.guards.forEach(function (g) { if (g.post || g.state === 'chase') return; if (Math.hypot(g.x - x, g.y - y) < 650) { g.state = 'hunt'; g.ix = x; g.iy = y; } }); } M.alarmUntil = now + 40000; }
function m11Light(x, y) { const M = M11; let L = m11Zone(x, y).z === 'park' ? .15 : .3; M.lamps.forEach(function (l) { const d = Math.hypot(x - l.x, y - l.y); if (d < l.r) L = Math.max(L, 1 - d / l.r * .6); }); M.towers.forEach(function (T) { const d = Math.hypot(x - T.x, y - T.y); if (d < T.len && m8AngDiff(Math.atan2(y - T.y, x - T.x), T.ang) < T.half) L = 1; }); return Math.min(1, L); }
/* ---------- update ---------- */
function m11Update(dt, now) {
    const M = M11, P = M.p, k = M.k;
    if (!M.lost && !M.won) {
        // move
        const ix = ((k.KeyD || k.ArrowRight) ? 1 : 0) - ((k.KeyA || k.ArrowLeft) ? 1 : 0), iy = ((k.KeyS || k.ArrowDown) ? 1 : 0) - ((k.KeyW || k.ArrowUp) ? 1 : 0), il = Math.hypot(ix, iy) || 1;
        P.creep = !!(k.ShiftLeft || k.ShiftRight); P.sprint = !!k.Space && !P.creep; const busy = P.changeT > 0 || (P.act && (k.KeyF || k.KeyE));
        const sp = busy ? 0 : P.creep ? .85 : P.sprint ? 2.6 : 1.55;
        P.moving = (ix || iy) && sp > 0;
        if (P.moving) { const dx = ix / il * sp * dt, dy = iy / il * sp * dt; if (!m11Blocked(P.x + dx, P.y, 10, 'p')) P.x += dx; if (!m11Blocked(P.x, P.y + dy, 10, 'p')) P.y += dy; P.ang = m8Turn(P.ang, Math.atan2(iy, ix), .2 * dt); P.walk += sp * dt; }
        // the courtyard gate turns prisoners back
        if (!P.uni && m11In(M11_CGATE, P.x, P.y, 26) && (!M.gateHint || now - M.gateHint > 4000)) { M.gateHint = now; m11Float(1110, 860, 'ZURÜCK! Gefangene bleiben drin!', '#ff9a70'); m11Say('ONLY GERMANS GO THROUGH THE GATE ARCH. YOU NEED THE UNIFORM (U).', 2600); }
        if (P.uni && M.alarm && m11In(M11_CGATE, P.x, P.y, 26) && (!M.gateHint || now - M.gateHint > 4000)) { M.gateHint = now; m11Say('THE ARCH IS LOCKED DOWN WHILE THE ALARM IS ON.', 2200); }
        // uniform change
        if (P.changeT > 0) { P.changeT -= dt / 60; if (P.changeT <= 0) { P.changeT = 0; P.uni = P.changeTo; m11Say(P.uni ? 'GEFREITER DOYLE. WALK LIKE YOU OWN THE PLACE — DON\'T RUN, DON\'T LINGER NEAR OFFICERS.' : 'BACK IN BATTLEDRESS.', 2800); } }
        // what can I do here?
        let act = null;
        M.items.forEach(function (it) { if (!it.taken && Math.hypot(P.x - it.x, P.y - it.y) < 40) act = { k: 'item', it: it, need: 1.6, label: 'HOLD F — TAKE THE ' + it.name }; });
        if (!act) act = m11CraftAct(P, M, now);
        if (!act && !M.tdoorOpen && Math.hypot(P.x - 600, P.y - 705) < 50) act = P.has.key ? { k: 'tdoor', need: 1.4, label: 'HOLD F — UNLOCK THE TERRACE DOOR' } : { k: 'none', label: 'LOCKED. THE KEY IS HIDDEN IN THE CHAPEL.' };
        if (!act && Math.abs(P.x - M11_FIN.x) < 34 && P.y > M11_FIN.y0 + 20 && P.y < M11_FIN.y1 - 20 && !M.gapsIn.some(function (g) { return Math.abs(g - P.y) < 26; })) act = P.has.cutters ? { k: 'cutIn', need: 2.6, label: 'HOLD F — CUT THE WIRE' } : { k: 'none', label: 'BARBED WIRE. CRAFT SOME CUTTERS (C).' };
        if (!act && P.y > 1640 && P.y < 1690 && P.x > 50 && P.x < 660) act = P.has.rope ? { k: 'climb', need: 2.4, label: 'HOLD F — THROW THE ROPE OVER THE PARK WALL', sus: 2 } : { k: 'none', label: 'THE PARK WALL IS TOO HIGH. MAKE A BEDSHEET ROPE (C).' };
        if (!act && Math.abs(P.y - M11_FOUT.y) < 34 && P.x > M11_FOUT.x0 + 20 && P.x < M11_FOUT.x1 - 20 && !M.gapsOut.some(function (g) { return Math.abs(g - P.x) < 26; })) act = P.has.cutters ? { k: 'cutOut', need: 2.6, label: 'HOLD F — CUT THE OUTER WIRE' } : { k: 'none', label: 'THE OUTER WIRE. CRAFT SOME CUTTERS (C).' };
        if (!act && !M.mgateOpen && Math.hypot(P.x - 1280, P.y - 1430) < 60) act = (P.uni && P.has.papers) ? (M.alarm ? { k: 'none', label: '"NIEMAND VERLÄSST DAS LAGER!" — NOBODY LEAVES DURING THE ALARM.' } : { k: 'papers', need: 2.4, label: 'HOLD F — SHOW YOUR PAPERS' }) : { k: 'none', label: P.uni ? 'THE SENTRY WANTS PAPERS. FORGE A PASS ON THE WORKBENCH (C).' : 'A PRISONER AT THE MAIN GATE? GET AWAY!' };
        P.act = act;
        if (act && act.need && (k.KeyF || k.KeyE)) { P.actT += dt / 60; if (Math.random() < .1) try { playTone(600 + Math.random() * 300, 500, .03, .015, 'square'); } catch (e) {}
            if (P.actT >= act.need) { P.actT = 0;
                if (act.k === 'item') { act.it.taken = true; if (act.it.id === 'key') P.has.key = true; else M.mat[act.it.id] = (M.mat[act.it.id] || 0) + 1; try { playTone(500, 900, .15, .05, 'triangle'); } catch (e) {} const left = M.items.filter(function (i) { return !i.taken; }).length; m11Say(act.it.name + ' — GOT IT. ' + (act.it.id === 'tunic' ? 'FINISH IT ON THE WORKBENCH (C): CLOTH + SCRAP FOR BUTTONS. ' : '') + (act.it.id === 'blank' ? 'IT NEEDS INK AND A STAMP — BOOT POLISH AND A CARVED SLAT (C). ' : '') + (act.it.id === 'key' ? 'IT OPENS THE TERRACE DOOR IN THE QUARTERS. ' : ''), 3800); }
                m11CraftDo(act, now);
                if (act.k === 'tdoor') { M.tdoorOpen = true; M.nav = null; m11Say('THE TERRACE DOOR SWINGS OPEN. MIND THE SENTRY AND THE TOWERS.', 2600); try { playTone(200, 160, .3, .05, 'triangle'); } catch (e) {} }
                if (act.k === 'cutIn') { M.gapsIn.push(P.y); m11Say('THROUGH THE INNER WIRE. THE OUTER WIRE IS AT THE BOTTOM OF THE PARK.', 2600); try { playTone(1200, 600, .08, .04, 'square'); } catch (e) {} }
                if (act.k === 'climb') { P.y = 1745; m11Say('OVER THE WALL AND DOWN THE ROPE. INTO THE WOODS!', 2400); try { playTone(300, 500, .2, .04, 'triangle'); } catch (e) {} }
                if (act.k === 'cutOut') { M.gapsOut.push(P.x); m11Say('THE OUTER WIRE IS OPEN. NOW THE PARK WALL — YOU\'LL NEED A ROPE.', 2600); try { playTone(1200, 600, .08, .04, 'square'); } catch (e) {} }
                if (act.k === 'papers') { const off = M.guards.find(function (g) { return g.officer && !g.down && Math.hypot(g.x - P.x, g.y - P.y) < 220 && m11LOS(g.x, g.y, P.x, P.y); });
                    if (off) { m11Float(off.x, off.y, 'Moment mal... wer sind Sie?', '#ff9a70'); off.sus = 1; off.state = 'chase'; m11Alarm(P.x, P.y, 'THE OFFICER LOOKED TOO CLOSELY — RUN!'); }
                    else { M.mgateOpen = true; m11Float(1280, 1470, 'In Ordnung. Gute Nacht.', '#c8f0a0'); m11Say('"IN ORDNUNG." THE BARRIER LIFTS. WALK — DON\'T RUN — DOWN THE ROAD.', 3200); try { playTone(400, 600, .3, .04, 'triangle'); } catch (e) {} } } } }
        else P.actT = Math.max(0, P.actT - dt / 30);
        // escaped?
        if ((P.y > 1745 && P.x > 1120 && P.x < 1440) || (P.y > 1730 && P.x < 670)) { M.won = true; M.running = false; cancelAnimationFrame(M.raf); M.route = P.x < 670 ? 'wire' : 'gate'; try { playTone(300, 600, .3, .05, 'triangle'); } catch (e) {} m11PlayEnding(function () { m11End(); }); return; }
        // the tower guns
        M.towers.forEach(function (T) { const d = Math.hypot(P.x - T.x, P.y - T.y); if (d < T.len && m8AngDiff(Math.atan2(P.y - T.y, P.x - T.x), T.ang) < T.half + 10 / Math.max(40, d) && m11Zone(P.x, P.y).z === 'park') { if (!P.uni || P.y > 1100 || P.x < 330) m11Alarm(P.x, P.y, 'SEARCHLIGHT! THE TOWER HAS YOU — GET OUT OF THE BEAM!'); if (M.alarm && now - T.lastShot > 420) { T.lastShot = now; M.fx.push({ k: 'flash', x: T.x, y: T.y, t: now }); try { playTone(260, 90, .05, .05, 'sawtooth'); } catch (e) {} if (Math.random() < .45) m11Hurt(7); else M.parts.push({ k: 'dust', x: P.x + (Math.random() - .5) * 40, y: P.y + (Math.random() - .5) * 40, life: 1, decay: .05 }); } } });
    }
    // searchlights
    M.towers.forEach(function (T) { if (M.alarm && M.lastSeen && Math.hypot(M.lastSeen.x - T.x, M.lastSeen.y - T.y) < T.len) T.ang = m8Turn(T.ang, Math.atan2(M.lastSeen.y - T.y, M.lastSeen.x - T.x), .035 * dt); else T.ang = m8Turn(T.ang, T.base + Math.sin(now * T.spd + T.ph) * T.amp, .05 * dt); });
    // roll call
    m11RollCall(dt, now);
    // guards
    const zone = m11Zone(P.x, P.y), lit = m11Light(P.x, P.y), contraband = (P.act && P.act.need && (k.KeyF || k.KeyE) && P.actT > .1) ? (P.act.sus === undefined ? 2.4 : P.act.sus) : 0;
    M.guards.forEach(function (g) { m11Guard(g, dt, now, zone, lit, contraband); });
    m11CraftUpdate(dt, now);
    m11Dog(dt, now);
    // prisoners mill about
    M.pows.forEach(function (n) { if (M.roll.phase >= 1 && n.slot < 16) { const sx = M11_APPELL[0] + 30 + (n.slot % 6) * 44, sy = M11_APPELL[1] + 30 + Math.floor(n.slot / 6) * 44; if (Math.hypot(sx - n.x, sy - n.y) > 3) m11Go(n, sx, sy, 1.2, dt); else { n.moving = false; n.ang = m8Turn(n.ang, -Math.PI / 2, .1 * dt); } return; }
        if (n.wait > 0) { n.wait -= dt; n.moving = false; return; } if (Math.hypot(n.tx - n.x, n.ty - n.y) < 4) { n.tx = n.room[0] + 20 + Math.random() * (n.room[2] - 40); n.ty = n.room[1] + 20 + Math.random() * (n.room[3] - 40); n.wait = 60 + Math.random() * 300; return; } if (m11Go(n, n.tx, n.ty, .6, dt)) n.wait = 80; });
    // alarm decay
    if (M.alarm && now > M.alarmUntil) { M.alarm = false; m11Say('THE ALARM DIES DOWN. THEY\'RE STILL JUMPY.', 2200); M.guards.forEach(function (g) { if (g.state === 'hunt') g.state = 'return'; }); }
    if (M.alarm && now - (M.sirenAt || 0) > 2600) { M.sirenAt = now; try { playTone(1900, 1700, .25, .02, 'square'); setTimeout(function () { try { playTone(1900, 1700, .25, .02, 'square'); } catch (e) {} }, 320); } catch (e) {} }
    // bits
    M.parts.forEach(function (p) { p.life -= p.decay * dt; }); M.parts = M.parts.filter(function (p) { return p.life > 0; });
    M.fx = M.fx.filter(function (f) { return now - f.t < 300; }); M.texts = M.texts.filter(function (t) { return now - t.at < 2200; });
    M.shake = Math.max(0, M.shake - .4 * dt);
    const tcx = Math.max(0, Math.min(M11W - 1100 / M11Z, P.x - 550 / M11Z)), tcy = Math.max(0, Math.min(M11H - 700 / M11Z, P.y - 350 / M11Z)); M.cam.x += (tcx - M.cam.x) * .1; M.cam.y += (tcy - M.cam.y) * .1;
}
function m11Guard(g, dt, now, zone, lit, contraband) {
    const M = M11, P = M.p; if (g.down) return;
    // can he see me?
    const d = Math.hypot(P.x - g.x, P.y - g.y), rng = g.view * (.55 + lit * .45) * (P.creep ? .8 : 1) * (M.alarm ? 1.15 : 1);
    let sees = !(g.bribedUntil > now) && !M.lost && !M.won && d < rng && m8AngDiff(Math.atan2(P.y - g.y, P.x - g.x), g.ang) < g.fov / 2 && m11LOS(g.x, g.y, P.x, P.y);
    if (!(g.bribedUntil > now) && !M.lost && !M.won && d < 34 && m11LOS(g.x, g.y, P.x, P.y) && !P.creep) sees = true; // he hears you right behind him
    g.sees = sees;
    if (sees) { let m = 0;
        if (zone.z === 'pow') m = P.uni ? (d < 90 ? 1.3 : 0) : 0;
        else if (zone.z === 'out') m = P.uni ? (P.sprint ? .9 : 0) : 1.6;
        else m = P.uni ? (g.officer ? (d < 180 ? 1.1 : 0) : (P.sprint ? .9 : d < 55 ? .45 : 0)) : 1.7;
        if (contraband) m = Math.max(m, contraband);
        if (M.alarm) m = Math.max(m * 2, zone.z === 'pow' && !P.uni ? .35 : 1.2);
        if (M.roll.phase === 2 && zone.z === 'pow' && !m11In(M11_APPELL, P.x, P.y)) m = Math.max(m, 1.2);
        if (g.state === 'baited') m *= .25;
        if (m > 0) { const before = g.sus; g.sus = Math.min(1, g.sus + .02 * m * (1.6 - d / rng) * dt); if (before < .3 && g.sus >= .3) m11Float(g.x, g.y, ['Hm?', 'Halt... ?', 'Sie da!'][Math.floor(Math.random() * 3)], '#ffd88a'); }
        if (g.sus >= 1 && g.state !== 'chase') { g.state = 'chase'; m11Float(g.x, g.y, g.officer ? 'Ein Gefangener! ALARM!' : 'HALT! STEHENBLEIBEN!', '#ff8a70'); try { playTone(2000, 1800, .5, .03, 'square'); } catch (e) {} m11Alarm(P.x, P.y); }
        if (g.state === 'chase') { M.lastSeen = { x: P.x, y: P.y, t: now }; g.lx = P.x; g.ly = P.y; g.lostAt = now; }
    } else g.sus = Math.max(0, g.sus - .003 * dt);
    if (g.sus > .3 && !sees && g.state === 'patrol') { g.state = 'look'; g.ix = P.x; g.iy = P.y; g.lookUntil = now + 4000; }
    // act
    if (g.state === 'chase') {
        if (!sees && now - g.lostAt > 900) { g.state = 'hunt'; g.ix = g.lx; g.iy = g.ly; }
        else { m11Go(g, P.x, P.y, g.post ? 1.6 : 2.25, dt); g.ang = m8Turn(g.ang, Math.atan2(P.y - g.y, P.x - g.x), .25 * dt);
            if (d < 22 && !M.lost && !M.won) { m11Float(g.x, g.y, 'HAB ICH DICH!', '#ff8a70'); m11Lose('caught'); }
            if (sees && zone.z !== 'pow' && d > 90 && now - (g.lastShot || 0) > 1500 && !g.officer) { g.lastShot = now; M.fx.push({ k: 'flash', x: g.x + Math.cos(g.ang) * 14, y: g.y + Math.sin(g.ang) * 14, t: now }); try { playTone(300, 110, .07, .05, 'sawtooth'); } catch (e) {} if (Math.random() < Math.max(.2, .7 - d / 700)) m11Hurt(14); } }
        return; }
    if (g.state === 'hunt' || g.state === 'look' || g.state === 'baited') {
        const there = m11Go(g, g.ix, g.iy, g.state === 'hunt' ? 1.7 : g.state === 'baited' ? 1.3 : .8, dt);
        if (there) { if (!g.searchUntil) g.searchUntil = now + (g.state === 'baited' ? Math.max(0, M.stoogeUntil - now) : 3500); g.ang += Math.sin(now / 500 + g.seed) * .05 * dt; if (now > g.searchUntil) { g.searchUntil = 0; g.state = M.alarm && g.state === 'hunt' ? 'hunt' : 'return'; if (g.state === 'hunt') { const a = Math.random() * 6.28; g.ix = M.lastSeen ? M.lastSeen.x + Math.cos(a) * 200 : g.x; g.iy = M.lastSeen ? M.lastSeen.y + Math.sin(a) * 200 : g.y; if (m11Blocked(g.ix, g.iy, 10, 'g')) g.state = 'return'; } } }
        if (g.state === 'look' && now > (g.lookUntil || 0)) g.state = 'return';
        return; }
    if (g.state === 'return') { const tx = g.post ? g.hx : g.route[g.wi][0], ty = g.post ? g.hy : g.route[g.wi][1]; if (m11Go(g, tx, ty, 1.0, dt)) { g.state = g.post ? 'post' : 'patrol'; if (g.post) g.ang = -Math.PI / 2; } return; }
    if (g.post) { g.moving = false; g.ang = m8Turn(g.ang, -Math.PI / 2 + Math.sin(now / 1800 + g.seed) * .7, .03 * dt); return; }
    if (g.wait > 0) { g.wait -= dt; g.moving = false; g.ang += Math.sin(now / 900 + g.seed) * .012 * dt; return; }
    const w = g.route[g.wi]; if (m11Go(g, w[0], w[1], g.spd, dt)) { g.wi = (g.wi + 1) % g.route.length; g.wait = 50 + Math.random() * 110; }
}
function m11Dog(dt, now) {
    const M = M11, P = M.p, D = M.dog, H = M.guards.find(function (g) { return g.dog; }); if (!H) return;
    if (D.sleep) { D.moving = false; return; } if (D.eating) { if (m11Go(D, D.eating.x, D.eating.y, 2, dt)) { M.treats.splice(M.treats.indexOf(D.eating), 1); D.eating = null; D.sleep = true; m11Float(D.x, D.y, 'zzz...', '#c8f0a0'); m11Say('THE DOG WOLFS DOWN THE CHOCOLATE AND KEELS OVER, SNORING.', 2600); } return; }
    const d = Math.hypot(P.x - D.x, P.y - D.y), nose = P.creep ? 80 : P.sprint ? 190 : 130;
    if (!M.lost && !M.won && d < nose && m11Zone(P.x, P.y).z === 'park') { D.sus = (D.sus || 0) + .03 * dt; if (D.sus > .4 && (!D.barkAt || now - D.barkAt > 900)) { D.barkAt = now; m11Float(D.x, D.y, 'WUFF! WUFF!', '#ff9a70'); try { playTone(180, 120, .12, .05, 'sawtooth'); } catch (e) {} if (D.sus > 1) { H.state = 'chase'; H.sus = 1; H.lx = P.x; H.ly = P.y; H.lostAt = now; m11Alarm(P.x, P.y, 'THE DOG HAS YOUR SCENT!'); } } } else D.sus = Math.max(0, (D.sus || 0) - .01 * dt);
    if (D.sus > 1 && d < 320) { D.state = 'alert'; m11Go(D, P.x, P.y, 2.5, dt); if (d < 18 && !M.lost) { m11Float(D.x, D.y, 'GRRRR!', '#ff8a70'); m11Lose('dog'); } }
    else { D.state = 'patrol'; const tx = H.x + Math.cos(H.ang + 1.2) * 22, ty = H.y + Math.sin(H.ang + 1.2) * 22; if (Math.hypot(tx - D.x, ty - D.y) > 4) m11Go(D, tx, ty, Math.max(1, H.spd * 1.4), dt); else D.moving = false; }
}
function m11RollCall(dt, now) {
    const M = M11, R = M.roll, P = M.p; if (M.won || M.lost) return;
    if (R.phase === 0 && now > R.next) { R.phase = 1; R.countAt = now + 60000; m11Say('APPELL! ROLL CALL IN THE COURTYARD — 60 SECONDS. BE IN THE RANKS, IN BATTLEDRESS' + (M.dummy ? ' (OR LET THE DUMMY ANSWER).' : '.'), 4600); for (let i = 0; i < 6; i++) setTimeout(function () { try { playTone(880, 860, .5, .05, 'triangle'); } catch (e) {} }, i * 450); }
    if (R.phase === 1 && now > R.countAt) { R.phase = 2; R.endAt = now + 7000; m11Say('THE HAUPTMANN COUNTS HEADS...', 3000); }
    if (R.phase === 2 && now > R.endAt) { R.phase = 0; R.next = now + 240000; M.rolls++;
        if (m11In(M11_APPELL, P.x, P.y, 10) && !P.uni) m11Say('"ALLE ANWESEND." EVERYONE PRESENT. DISMISSED — NEXT ROLL CALL IN 4 MINUTES.', 3600);
        else if (M.dummy) { M.dummy = null; m11Say('THE DUMMY ANSWERED "HIER!" FOR YOU. NOBODY NOTICED. NEXT ROLL CALL IN 4 MINUTES.', 4200); }
        else if (m11Zone(P.x, P.y).z === 'park' || m11Zone(P.x, P.y).z === 'out' || m11Zone(P.x, P.y).z === 'ger') { M.missedRoll = true; m11Alarm(P.x, P.y, 'ONE PRISONER MISSING AT ROLL CALL! THE WHOLE CASTLE IS SEARCHING!'); M.lastSeen = null; M.guards.forEach(function (g) { if (!g.post && g.state !== 'chase') { g.state = 'hunt'; g.ix = 1160 + (Math.random() - .5) * 900; g.iy = 900 + (Math.random() - .5) * 700; if (m11Blocked(g.ix, g.iy, 10, 'g')) { g.ix = g.x; g.iy = g.y; } } }); }
        else { M.missedRoll = true; m11Alarm(P.x, P.y, P.uni ? 'A PRISONER IN A GERMAN UNIFORM AT ROLL CALL?! ALARM!' : 'YOU MISSED ROLL CALL! THEY\'RE SEARCHING THE CASTLE!'); } }
}
function m11Stars() { const r = M11.result || {}; return 1 + (r.alarm ? 0 : 1) + (r.missed ? 0 : 1); }
function m11End() {
    const M = M11; M.running = false; cancelAnimationFrame(M.raf); canvas.style.cursor = ''; campaignMission = 11; selectedGameMode = 'campaign';
    M.result = { alarm: M.alarmEver, missed: M.missedRoll, rolls: M.rolls, route: M.route || '', hp: Math.round(M.p.hp), kit: Object.keys(M.p.has).length, crafted: Object.keys(M.tools || {}).length };
    if (M.won) { progression.campaignM11Done = true; try { addXP(1200, 'victory'); saveProgression(); } catch (e) {} showCampaignResult(true); } else showCampaignResult(false);
}
