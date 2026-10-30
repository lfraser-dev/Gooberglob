/* =====================================================
   CAMPAIGN MISSION 9 - OPERATION NIGHTJAR: the château, the safe, the staff car
   Stealth phase reuses the Mission 8 commando engine (M8.lvl === 'chateau').
   Safe: m9safe.js · Chase: m9chase.js · Cutscene: g8.js
===================================================== */
const M9 = { failWhy: '', chase: null };
const M9_HOUSE = { x: 900, y: 300, w: 580, h: 300 };
const M9_WALL = { x0: 380, y0: 150, x1: 2020, y1: 1250, gate: [1140, 1260], breach: [880, 960] };
const M9_DOORS = [
    { id: 'study', name: 'THE COLONEL\'S STUDY', x: 1300, y: 290, side: -1, ex: 1300, ey: 258, face: 'n' },
    { id: 'study', name: 'FRONT DOOR · TO THE STUDY', x: 1200, y: 610, side: 1, ex: 1200, ey: 642, face: 's', front: 1 },
    { id: 'signals', name: 'SIGNALS ROOM', x: 1590, y: 520, side: 1, ex: 1622, ey: 520, face: 'e' },
    { id: 'kitchen', name: 'KITCHENS', x: 810, y: 650, side: -1, ex: 778, ey: 650, face: 'w' }];
const M9_CAR = { x: 1140, y: 836, w: 124, h: 56 };

/* ---------- world ---------- */
function m9BuildOutside() {
    M8.obs = []; const W = M9_WALL, t = 16;
    const wall = function (x, y, w, h) { m8Obs(x, y, w, h, 'cwall'); };
    wall(W.x0 - t / 2, W.y0 - t / 2, W.x1 - W.x0 + t, t);
    wall(W.x0 - t / 2, W.y1 - t / 2, W.gate[0] - W.x0 + t / 2, t); wall(W.gate[1], W.y1 - t / 2, W.x1 - W.gate[1] + t / 2, t);
    wall(W.x0 - t / 2, W.y0, t, W.breach[0] - W.y0); wall(W.x0 - t / 2, W.breach[1], t, W.y1 - W.breach[1]);
    wall(W.x1 - t / 2, W.y0, t, W.y1 - W.y0);
    m8Obs(900, 300, 580, 300, 'house'); m8Obs(820, 300, 100, 480, 'wingW'); m8Obs(1480, 300, 100, 480, 'wingE');
    m8Obs(M9_CAR.x, M9_CAR.y, M9_CAR.w, M9_CAR.h, 'car'); m8Obs(1170, 690, 60, 60, 'fountain');
    [[600, 900, 160, 26], [880, 900, 160, 26], [1360, 900, 160, 26], [1640, 900, 160, 26], [600, 1040, 26, 120], [1774, 1040, 26, 120], [760, 1100, 180, 26], [1460, 1100, 180, 26]].forEach(function (b) { m8Obs(b[0], b[1], b[2], b[3], 'hedge'); });
    [[700, 960, 120, 14], [700, 1000, 120, 14], [1580, 960, 120, 14], [1580, 1000, 120, 14], [990, 975, 18, 90], [1392, 975, 18, 90]].forEach(function (b) { m8Obs(b[0], b[1], b[2], b[3], 'box', true); });
    [[1000, 1160], [1380, 1160], [1188, 960]].forEach(function (p) { m8Obs(p[0], p[1], 24, 24, 'statue'); });
    m8Obs(1640, 1130, 90, 90, 'gazebo');
    m8Obs(480, 420, 160, 90, 'glass', true);
    m8Obs(1700, 250, 240, 110, 'stable'); m8Obs(1700, 420, 200, 100, 'garage'); m8Obs(1700, 960, 250, 110, 'barracks'); m8Obs(1650, 600, 24, 24, 'mast'); m8Obs(1640, 700, 60, 40, 'genset'); m8Obs(880, 1180, 90, 46, 'kubel');
    for (let i = 0; i < 22; i++) { const x = 450 + m8R(i + 300) * 320, y = 230 + m8R(i + 330) * 620; if (x > 470 && x < 650 && y > 400 && y < 530) continue; m8Obs(x - 20, y - 20, 40, 40, 'tree', false, { seed: i + 300, small: 1 }); }
    for (let i = 0; i < 70; i++) { const x = m8R(i + 500) * M8W, y = m8R(i + 520) * M8H; const inside = x > W.x0 - 40 && x < W.x1 + 40 && y > W.y0 - 40 && y < W.y1 + 40; if (inside) continue; if (x < 340 && y > 1280) continue; if (Math.abs(x - 1200) < 110 && y > 1250) continue; m8Obs(x - 26, y - 26, 52, 52, 'tree', false, { seed: i + 600 }); }
    M8.lamps = [{ x: 1200, y: 1240, r: 170 }, { x: 1000, y: 760, r: 150 }, { x: 1400, y: 760, r: 150 }, { x: 1200, y: 625, r: 120 }, { x: 1300, y: 250, r: 140 }, { x: 1820, y: 940, r: 140 }, { x: 1820, y: 390, r: 120 }, { x: 1620, y: 560, r: 110 }];
}
function m9Populate() {
    const U = [], W = M9_WALL;
    U.push(m8Unit({ team: 'sq', kind: 'leader', x: 230, y: 1350, ang: -.6, hp: 120, maxHp: 120, name: M8_NAMES[0] }));
    for (let i = 0; i < 4; i++) U.push(m8Unit({ team: 'sq', kind: 'cmdo', slot: i, gun: M8_SQUAD_GUNS[i], x: 230 + M8_FORM[i][0], y: 1350 + M8_FORM[i][1], ang: -.6, hp: 80, maxHp: 80, name: M8_NAMES[i + 1] }));
    [[W.x0, W.y0, .7], [W.x1, W.y0, 2.45], [W.x1, W.y1, -2.4]].forEach(function (p, i) { U.push(m8Unit({ team: 'en', kind: 'tower', x: p[0], y: p[1], base: p[2], la: p[2], view: 340, fov: .42, hp: 50, maxHp: 50, ph: i * 2.1, state: 'post' })); });
    let n = 0; const pat = function (route, spd, gun, extra) { U.push(m8Unit(Object.assign({ team: 'en', kind: 'sold', gun: gun || ((n++) % 2 ? 'mp40' : 'kar98'), x: route[0][0], y: route[0][1], route: route, ri: 0, spd: spd || 1 }, extra || {}))); };
    pat([[470, 1180], [470, 300], [760, 300], [760, 1180]]);
    pat([[580, 1215], [1820, 1215]], .95);
    pat([[960, 640], [1440, 640], [1440, 925], [960, 925]], .9);
    pat([[560, 205], [1960, 205]], .9, 'mp40');
    pat([[1640, 240], [1640, 1180]], 1);
    pat([[1600, 620], [1960, 620], [1960, 1000], [1600, 1000]], .9, 'mp40');
    pat([[480, 420], [700, 600], [480, 820], [700, 1020]], .85);
    pat([[1000, 690], [1420, 690]], .8, 'kar98'); pat([[1420, 760], [1000, 760]], .8, 'mp40');
    pat([[2150, 120], [2150, 1360]], 1, 'kar98'); pat([[300, 90], [2100, 90]], .95, 'mp40');
    // dogs: one with the terrace sentry, one loose in the gardens
    U.push(m8Unit({ team: 'en', kind: 'dog', x: 540, y: 205, route: [[560, 205], [1960, 205]], ri: 0, spd: .9, delay: 30, hp: 45, maxHp: 45, view: 180, fov: 2.6, r: 8 }));
    U.push(m8Unit({ team: 'en', kind: 'dog', x: 700, y: 1170, route: [[700, 1170], [1700, 1170], [1700, 960], [1220, 940], [700, 960]], ri: 0, spd: 1.1, hp: 45, maxHp: 45, view: 180, fov: 2.6, r: 8 }));
    [[1155, 1232, Math.PI / 2, 'kar98'], [1245, 1232, Math.PI / 2, 'mp40'], [1160, 625, Math.PI / 2, 'kar98'], [1240, 625, Math.PI / 2, 'kar98'], [1300, 866, Math.PI, 'mp40'], [1625, 565, 0, 'mp40'], [775, 690, Math.PI, 'kar98'], [1300, 240, -Math.PI / 2, 'kar98'], [640, 470, Math.PI / 2, 'kar98'], [1660, 330, Math.PI, 'mp40'], [1660, 470, Math.PI, 'kar98'], [1660, 1010, Math.PI, 'mp40'], [1780, 1150, -Math.PI / 2, 'kar98'], [1040, 260, -Math.PI / 2, 'mp40'], [1560, 260, -Math.PI / 2, 'kar98']].forEach(function (s) { U.push(m8Unit({ team: 'en', kind: 'sold', gun: s[3], x: s[0], y: s[1], ang: s[2], base: s[2], state: 'post' })); });
    U.push(m8Unit({ team: 'en', kind: 'dog', x: 1600, y: 660, route: [[1600, 660], [1600, 1100], [1900, 1100], [1900, 660]], ri: 0, spd: 1, hp: 45, maxHp: 45, view: 180, fov: 2.6, r: 8 }));
    U.push(m8Unit({ team: 'en', kind: 'mg', gun: 'mg42', x: 1200, y: 1150, ang: Math.PI / 2, base: Math.PI / 2, state: 'post', view: 300, fov: 1.3 }));
    M8.units = U;
}
function m9RoomDef(id) {
    const R = { id: id, style: 'chateau', obs: [], target: null, units: [], exit: { x: 500, y: 650, w: 100, h: 50 }, bell: null, planted: false, cleared: false, lamps: [] };
    const box = function (x, y, w, h, k, low, ex) { R.obs.push(Object.assign({ x: x, y: y, w: w, h: h, kind: k, low: !!low }, ex || {})); };
    box(0, 0, 1100, 40, 'wall'); box(0, 0, 40, 700, 'wall'); box(1060, 0, 40, 700, 'wall'); box(0, 660, 500, 40, 'wall'); box(600, 660, 500, 40, 'wall');
    const g = function (x, y, route, gun, ang) { R.units.push(m8Unit({ team: 'en', kind: 'sold', gun: gun || 'mp40', x: x, y: y, route: route, view: 250, spd: .85, ang: ang === undefined ? Math.PI / 2 : ang, base: ang, state: route ? 'patrol' : 'post' })); };
    const e = function (x, y, a, tool) { R.units.push(m8Unit({ team: 'en', kind: 'eng', tool: tool || 'clip', x: x, y: y, ang: a, base: a, state: 'work', hp: 60, maxHp: 60, view: 190, fov: 1.2 })); };
    if (id === 'study') {
        R.title = 'ARBEITSZIMMER'; R.action = 'safe'; R.doneText = '✓ SAFE EMPTIED';
        box(420, 130, 260, 90, 'desk'); box(40, 90, 44, 420, 'shelf'); box(1016, 230, 44, 170, 'fireplace'); box(150, 470, 190, 64, 'sofa'); box(185, 375, 120, 60, 'ctable'); box(95, 385, 56, 56, 'chair'); box(345, 385, 56, 56, 'chair'); box(720, 380, 190, 110, 'maptable'); box(900, 160, 50, 50, 'globe'); box(950, 70, 90, 56, 'files'); box(90, 600, 200, 30, 'clock', true);
        R.target = { x: 780, y: 96, name: 'WALL SAFE' }; R.bell = { x: 655, y: 252 }; R.lamps = [{ x: 550, y: 330, r: 270 }, { x: 520, y: 175, r: 150 }, { x: 990, y: 320, r: 180, flick: 1, warm: 1 }];
        R.units.push(m8Unit({ team: 'en', kind: 'off', gun: 'p38', x: 550, y: 250, ang: -Math.PI / 2, base: -Math.PI / 2, state: 'work', hp: 70, maxHp: 70, view: 220, fov: 1.3 }));
        g(300, 580, [[300, 590], [960, 590], [960, 470]], 'mp40'); g(980, 470, null, 'kar98', Math.PI); g(120, 160, [[120, 160], [360, 160], [360, 330], [120, 330]], 'kar98'); g(1000, 620, null, 'mp40', -Math.PI * .75); e(990, 160, -Math.PI / 2, 'clip');
    }
    if (id === 'signals') {
        R.title = 'NACHRICHTENZENTRALE'; R.action = 'smash'; R.doneText = '✓ RADIO SMASHED'; R.holdT = 1.8;
        box(90, 52, 420, 56, 'racks'); box(600, 52, 420, 56, 'racks'); box(120, 230, 280, 70, 'opdesk'); box(700, 230, 280, 70, 'opdesk'); box(480, 380, 140, 60, 'teleprinter'); box(40, 300, 28, 200, 'board'); box(880, 410, 140, 150, 'transmitter'); box(110, 420, 100, 80, 'files');
        R.target = { x: 950, y: 600, name: 'TRANSMITTER' }; R.bell = { x: 62, y: 590 }; R.lamps = [{ x: 260, y: 330, r: 220 }, { x: 840, y: 330, r: 220 }, { x: 550, y: 500, r: 180, flick: 1 }];
        e(260, 320, -Math.PI / 2, 'phones'); e(840, 320, -Math.PI / 2, 'phones'); e(550, 470, -Math.PI / 2, 'clip'); g(1010, 600, [[1010, 600], [1010, 200]], 'mp40'); g(110, 560, null, 'kar98', 0); g(550, 170, [[300, 170], [800, 170]], 'kar98');
    }
    if (id === 'kitchen') {
        R.title = 'KÜCHE'; R.action = 'supply'; R.doneText = '✓ RESUPPLIED'; R.holdT = 1.2;
        box(90, 52, 340, 66, 'stove'); box(300, 270, 300, 80, 'ktable'); box(700, 270, 200, 80, 'ktable'); box(1016, 90, 44, 420, 'shelf'); box(80, 440, 130, 110, 'barrels'); box(820, 440, 130, 80, 'supplies'); box(520, 52, 200, 50, 'sink');
        R.target = { x: 885, y: 580, name: 'SUPPLY CRATES' }; R.bell = { x: 1035, y: 600 }; R.lamps = [{ x: 300, y: 300, r: 240 }, { x: 780, y: 300, r: 230 }, { x: 250, y: 120, r: 160, warm: 1, flick: 1 }];
        e(260, 200, -Math.PI / 2, 'ladle'); g(760, 395, null, 'mp40', Math.PI / 2); g(560, 600, [[560, 600], [140, 600], [140, 380]], 'kar98'); g(980, 200, [[980, 200], [620, 200]], 'mp40');
    }
    return R;
}

/* ---------- interaction / objectives ---------- */
function m9EnterMsg(d, R) { if (R.planted) return d.name + ' — NOTHING MORE HERE.'; if (d.id === 'study') return 'THE STUDY — DEAL WITH THE COLONEL AND HIS MEN, THEN GET TO THE SAFE BEHIND THE PAINTING.'; if (d.id === 'signals') return 'SIGNALS ROOM — SMASH THEIR TRANSMITTER AND THEY CAN\'T CALL AHEAD WHEN WE RUN.'; return 'KITCHENS — CLEAR IT AND WE CAN RESUPPLY FROM THEIR STORES.'; }
function m9Objective(R) {
    if (!R) return M8.docs ? 'KEY SHEETS SECURED — GET TO THE STAFF CAR IN THE COURTYARD [F]' : 'REACH THE COLONEL\'S STUDY — FRONT DOOR (GUARDED) OR NORTH TERRACE · CRACK THE SAFE';
    if (R.planted) return R.doneText.replace('✓ ', '') + ' — LEAVE BY THE DOOR (SOUTH)';
    if (!R.cleared) return 'CLEAR THE ROOM — ' + R.units.filter(function (u) { return !u.dead; }).length + ' LEFT';
    return R.action === 'safe' ? 'ROOM CLEAR — PRESS [F] AT THE WALL SAFE' : 'ROOM CLEAR — HOLD [F] AT THE ' + R.target.name;
}
function m9Targets() {
    if (M8.docs) return [{ x: M9_CAR.x + 62, y: M9_CAR.y + 28, c: '#7fc06a', t: 'CAR' }];
    return M9_DOORS.filter(function (d) { return !M8.rooms[d.id].planted && !d.front; }).map(function (d) { return { x: d.x, y: d.y, c: d.id === 'study' ? '#ffd24a' : '#a8a080', t: d.id === 'study' ? 'STUDY' : d.id === 'signals' ? 'RADIO' : 'STORES' }; });
}
function m9Interact(L, fPress, dt, now) {
    if (M8.safeOpen || M8.chaseStarting) return;
    if (M8.scene === 'out') {
        M8.nearDoor = null; M9_DOORS.forEach(function (d) { if (Math.hypot(L.x - d.x, L.y - d.y) < 50) M8.nearDoor = d; });
        if (M8.nearDoor && !M8.rooms[M8.nearDoor.id].planted && fPress) { M8.k.KeyF = M8.k.KeyE = false; m8Enter(M8.nearDoor); return; }
        const cx = M9_CAR.x + M9_CAR.w / 2, cy = M9_CAR.y + M9_CAR.h / 2; M8.nearCar = Math.hypot(L.x - cx, L.y - cy) < 100;
        if (M8.nearCar && fPress) { M8.k.KeyF = M8.k.KeyE = false; if (!M8.docs) { m8Say('WE\'RE NOT LEAVING WITHOUT THE KEY SHEETS. THE STUDY, SIR.', 2600); return; } m9BeginChase(); }
        return;
    }
    const R = M8.rooms[M8.scene]; R.cleared = R.units.every(function (u) { return u.dead; });
    const nt = Math.hypot(L.x - R.target.x, L.y - R.target.y) < 72;
    if (nt && !R.planted && fPress) {
        if (!R.cleared) { if (!M8.clearMsg || now - M8.clearMsg > 2500) { M8.clearMsg = now; m8Say('CLEAR THE ROOM FIRST — NO WITNESSES.', 2400); } }
        else if (R.action === 'safe') { M8.k.KeyF = M8.k.KeyE = false; m9OpenSafe(R); }
        else { M8.plantT += dt / 60; if (Math.random() < .25) M8.parts.push({ k: R.action === 'smash' ? 'spark' : 'ember', x: R.target.x + (Math.random() - .5) * 30, y: R.target.y - 30 + (Math.random() - .5) * 20, vx: (Math.random() - .5) * 2, vy: -1, life: .7, decay: .05, scene: M8.scene }); if (R.action === 'smash' && Math.random() < .15) try { playTone(200 + Math.random() * 300, 80, .05, .04, 'square'); } catch (e) {}
            if (M8.plantT >= (R.holdT || 1.5)) { R.planted = true; M8.plantT = 0;
                if (R.action === 'smash') { M8.radioOut = true; m8Say('TRANSMITTER\'S WRECKED. THEY WON\'T BE PHONING AHEAD — FEWER CARS ON OUR TAIL.', 4200); try { playExplosionSound(.5); } catch (e) {} for (let i = 0; i < 20; i++) M8.parts.push({ k: 'spark', x: R.target.x + (Math.random() - .5) * 60, y: R.target.y - 120 + Math.random() * 60, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5, life: 1, decay: .03, scene: M8.scene }); m8Smoke(R.target.x, R.target.y - 90, 8, 'grey'); }
                else { M8.units.slice(0, 5).forEach(function (u) { if (!u.dead) u.hp = u.maxHp; }); const S = m8Slots(); M8.res[0] += m8StartRes(S[0]); M8.res[1] += m8StartRes(S[1]); M8.ammo[2]++; if (M8.ammo[3] || M8.loadout.e2 !== M8.loadout.e1) M8.ammo[3]++; m8Say('BANDAGED UP AND POCKETS FULL. GOOD GERMAN BREAD TOO.', 3400); try { playTone(500, 900, .3, .05, 'triangle'); } catch (e) {} }
            } }
    } else M8.plantT = Math.max(0, M8.plantT - dt / 30);
    const ex = R.exit; if (L.x > ex.x && L.x < ex.x + ex.w && L.y > 640) m8Exit();
}
function m9SafeDone(R, ok) { // called by the safe minigame
    M8.safeOpen = false; if (!ok) return;
    R.planted = true; M8.docs = true; m8Say('GOT THEM — THE JUNE KEY SHEETS AND THE CODE BOOK. NOW OUT, TO THE CAR!', 5000); try { playTone(600, 1200, .4, .06, 'triangle'); } catch (e) {}
}
function m9SafeAlarm(R) { // too much noise at the safe: the guard from the corridor walks in
    m8Say('SOMEONE HEARD THAT — A GUARD IS COMING IN!', 2600); const u = m8Unit({ team: 'en', kind: 'sold', gun: 'mp40', x: 550, y: 660, ang: -Math.PI / 2, state: 'investigate', ix: R.target.x, iy: R.target.y + 60, sus: .6, view: 260 }); R.units.push(u); R.cleared = false;
}
function m9BeginChase() {
    M8.chaseStarting = true; m8Say('IN! EVERYBODY IN! HOLLIS, ON THE GUN!', 2500); try { playTone(120, 260, .6, .06, 'sawtooth'); } catch (e) {}
    M8.fadeTo = function () { const alive = M8.units.slice(1, 5).filter(function (u) { return !u.dead; }).length; m8Stop(); M8.active = false; m9StartChase({ alarm: M8.alarm, radioOut: M8.radioOut, squad: alive, hp: m8Leader().hp / m8Leader().maxHp, kills: M8.kills, loadout: M8.loadout }); };
}
function m9MinimapBase(mx, my, mw, mh, sx, sy) {
    ctx.fillStyle = '#1e281a'; ctx.fillRect(mx, my, mw, mh); ctx.fillStyle = '#2e3a24'; ctx.fillRect(mx + M9_WALL.x0 * sx, my + M9_WALL.y0 * sy, (M9_WALL.x1 - M9_WALL.x0) * sx, (M9_WALL.y1 - M9_WALL.y0) * sy);
    ctx.fillStyle = '#6a6458'; [[900, 300, 580, 300], [820, 300, 100, 480], [1480, 300, 100, 480]].forEach(function (b) { ctx.fillRect(mx + b[0] * sx, my + b[1] * sy, b[2] * sx, b[3] * sy); }); ctx.fillStyle = M8.docs ? '#7fc06a' : '#9a8a5a'; ctx.fillRect(mx + M9_CAR.x * sx, my + M9_CAR.y * sy, M9_CAR.w * sx, M9_CAR.h * sy);
}

/* ---------- dogs ---------- */
function m9Dog(e, sq, now, dt, L) {
    const lure = e.state !== 'alert' ? (M8.lures || []).find(function (l) { return l.scene === M8.scene && now < l.until && !l.taken && Math.hypot(l.x - e.x, l.y - e.y) < (l.drug ? 540 : 640); }) : null;
    if (lure) { e.sus = 0; if (e.state === 'alerting') e.state = 'patrol'; const d = Math.hypot(lure.x - e.x, lure.y - e.y); if (d > 44 && !(e.stuck > 20)) { e.moving = true; m8Steer(e, lure.x, lure.y, 2.3 * dt); e.walk = (e.walk || 0) + 2.3 * dt; } else { e.moving = false; if (lure.drug) { lure.taken = true; e.dead = true; e.hp = 0; e.asleep = true; e.deathAng = Math.random() * 6; m8Float(e, 'zzz...', '#a8c8ff'); } else { e.ang += .08 * dt; if (Math.random() < .01) m8Float(e, '*sniff*', '#d8e8a8'); } } return; }
    if ((M8.gases || []).some(function (gz) { return gz.scene === M8.scene && (now - gz.t) / 1000 < gz.dur && Math.hypot(gz.x - e.x, gz.y - e.y) < gz.r * 1.2; })) { e.sus = Math.max(0, e.sus - .05 * dt); e.moving = false; e.ang += .15 * dt; return; }
    const smellR = L.sneak ? 62 : 95; let tgt = null, td = 1e9;
    sq.forEach(function (s) { const d = Math.hypot(s.x - e.x, s.y - e.y); const aa = Math.atan2(s.y - e.y, s.x - e.x); const sees = d < e.view && m8AngDiff(aa, e.ang) < e.fov / 2 && m8LOS(e.x, e.y, s.x, s.y); if ((d < smellR || sees) && d < td) { td = d; tgt = s; } });
    if (e.state !== 'alert' && e.state !== 'alerting') { if (tgt) { e.sus = Math.min(1, e.sus + (td < smellR ? .03 : .02) * dt * (L.sneak ? .6 : 1)); e.ang = m8Turn(e.ang, Math.atan2(tgt.y - e.y, tgt.x - e.x), .15); if (e.sus > .35 && (!e.lastBark || now - e.lastBark > 1400)) { e.lastBark = now; m8Float(e, 'Grrr...', '#ffd88a'); try { playTone(140, 90, .2, .04, 'sawtooth'); } catch (er) {} } if (e.sus >= 1) { m8Float(e, 'WUFF! WUFF!', '#ff8a70'); try { playTone(260, 120, .12, .07, 'square'); setTimeout(function () { try { playTone(240, 110, .12, .07, 'square'); } catch (er) {} }, 180); } catch (er) {} m8Alerting(e, tgt.x, tgt.y); } return; } e.sus = Math.max(0, e.sus - .004 * dt); }
    if (e.state === 'alerting' && now > e.alertAt) { m8RaiseAlarm('THE DOGS ARE BARKING'); e.state = 'alert'; }
    if ((e.state === 'alert' || e.state === 'alerting') && (tgt || e.lx !== undefined)) { const tx = tgt ? tgt.x : e.lx, ty = tgt ? tgt.y : e.ly, d = Math.hypot(tx - e.x, ty - e.y); e.moving = true; if (d > 16) m8Steer(e, tx, ty, 2.7 * dt); else { e.moving = false; if (tgt && now - e.lastShot > 700) { e.lastShot = now; m8DamageUnit(tgt, 14, Math.atan2(tgt.y - e.y, tgt.x - e.x), e, true); try { playTone(500, 200, .06, .06, 'square'); } catch (er) {} } } if (tgt) { e.lx = tgt.x; e.ly = tgt.y; } return; }
    if (e.route) { if (e.delay > 0) { e.delay -= dt; e.moving = false; return; } const p = e.route[e.ri]; e.moving = true; if (m8Steer(e, p[0], p[1], e.spd * dt)) e.ri = (e.ri + 1) % e.route.length; }
    e.walk = (e.walk || 0) + e.spd * dt;
}
function m9DrawDog(u, now, ghost) {
    ctx.save(); ctx.translate(u.x, u.y); if (ghost) ctx.globalAlpha = ghost;
    if (u.dead) { ctx.rotate(u.deathAng || 0); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(2, 3, 16, 9, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7a5a34'; ctx.beginPath(); ctx.ellipse(0, 0, 13, 7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2a1e14'; ctx.beginPath(); ctx.ellipse(-2, -2, 9, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#6a4a28'; ctx.beginPath(); ctx.ellipse(13, 3, 5, 4, .4, 0, 7); ctx.fill(); ctx.strokeStyle = '#5a3e20'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(-10, 12); ctx.moveTo(4, 6); ctx.lineTo(8, 12); ctx.moveTo(-12, 0); ctx.lineTo(-20, 3); ctx.stroke(); ctx.restore(); return; }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(4, 5, 15, 9, 0, 0, 7); ctx.fill();
    ctx.rotate(u.ang); ctx.scale(1.15, 1.15); const run = u.moving ? Math.sin((u.walk || 0) * .35 + now / 60) : 0;
    ctx.strokeStyle = '#3a2614'; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; [[7, -4, 1], [7, 4, -1], [-6, -4, -1], [-6, 4, 1]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[0] + run * 4 * l[2], l[1] * 1.7); ctx.stroke(); });
    const wag = Math.sin(now / (u.state === 'alert' ? 60 : 160)) * .5; ctx.strokeStyle = '#5a3e20'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.quadraticCurveTo(-17, wag * 6, -21, wag * 10); ctx.stroke();
    const bg = ctx.createRadialGradient(-1, -2, 1, 0, 0, 12); bg.addColorStop(0, '#a0784a'); bg.addColorStop(1, '#5a3e20'); ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, 0, 12, 6, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#1e1610'; ctx.beginPath(); ctx.ellipse(-2, 0, 8, 4.2, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#8a6438'; ctx.beginPath(); ctx.ellipse(13, 0, 5.4, 4.2, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2a1c10'; ctx.beginPath(); ctx.ellipse(18, 0, 2.6, 2, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#3a2614'; [[11, -4], [11, 4]].forEach(function (p) { ctx.beginPath(); ctx.moveTo(p[0], p[1] * .6); ctx.lineTo(p[0] - 2, p[1] * 1.5); ctx.lineTo(p[0] + 2.6, p[1] * 1.2); ctx.fill(); });
    ctx.strokeStyle = '#a02818'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(9, 0, 3.8, -1.2, 1.2); ctx.stroke();
    ctx.restore();
}

/* ---------- art: outside ---------- */
function m9Roof(g, x, y, w, h, ridgeH, col) {
    const c = col || ['#4a4e58', '#2e323a', '#1a1c22']; g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 24; g.shadowOffsetX = 14; g.shadowOffsetY = 20; g.fillStyle = '#000'; g.fillRect(x, y, w, h); g.restore();
    if (ridgeH) { g.fillStyle = m8Grad(g, 0, y, 0, y + h / 2, [[0, c[0]], [1, c[1]]]); g.fillRect(x, y, w, h / 2); g.fillStyle = m8Grad(g, 0, y + h / 2, 0, y + h, [[0, c[2]], [1, c[1]]]); g.fillRect(x, y + h / 2, w, h / 2); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1; for (let yy = y + 6; yy < y + h; yy += 7) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); } g.fillStyle = '#5a5e68'; g.fillRect(x, y + h / 2 - 2, w, 4); }
    else { g.fillStyle = m8Grad(g, x, 0, x + w, 0, [[0, c[0]], [.5, c[1]], [1, c[2]]]); g.fillRect(x, y, w, h); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1; for (let xx = x + 6; xx < x + w; xx += 7) { g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + h); g.stroke(); } g.fillStyle = '#5a5e68'; g.fillRect(x + w / 2 - 2, y, 4, h); }
    g.strokeStyle = '#121418'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
}
function m9Turret(g, x, y, r) { g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 16; g.shadowOffsetX = 10; g.shadowOffsetY = 14; m8Disc(g, x, y, r, '#1e2026', '#5a5e68'); g.restore(); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke(); } m8Disc(g, x, y, 3, '#2a2a22', '#c8b060'); }
function m9Hedge(g, o) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(o.x + 6, o.y + 8, o.w, o.h); g.fillStyle = '#1c3016'; g.fillRect(o.x, o.y, o.w, o.h); for (let i = 0; i < (o.w * o.h) / 60; i++) { const x = o.x + m8R(i + o.x) * o.w, y = o.y + m8R(i + o.y) * o.h; g.fillStyle = m8R(i * 3 + o.x) > .5 ? 'rgba(80,120,60,.45)' : 'rgba(10,20,8,.5)'; g.beginPath(); g.arc(x, y, 3 + m8R(i) * 3, 0, 7); g.fill(); } g.strokeStyle = 'rgba(120,160,90,.35)'; g.lineWidth = 1.2; g.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2); }
function m9BuildArt() {
    const c = document.createElement('canvas'); c.width = M8W; c.height = M8H; const g = c.getContext('2d'), W = M9_WALL;
    g.fillStyle = '#26321e'; g.fillRect(0, 0, M8W, M8H);
    for (let i = 0; i < 400; i++) { const x = m8R(i + 17) * M8W, y = m8R(i + 9917) * M8H, r = 30 + m8R(i + 1917) * 110, k = m8R(i + 2917); g.fillStyle = k < .4 ? 'rgba(60,80,40,.18)' : k < .7 ? 'rgba(16,22,12,.25)' : 'rgba(70,74,46,.14)'; g.beginPath(); g.ellipse(x, y, r, r * .7, k * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 22000; i++) { const x = m8R(i * 1.31 + 4) * M8W, y = m8R(i * 1.73 + 7) * M8H, k = m8R(i + 15); g.strokeStyle = k < .33 ? 'rgba(90,120,60,.45)' : k < .66 ? 'rgba(40,58,30,.5)' : 'rgba(120,130,80,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (k - .5) * 4, y - 3 - k * 4); g.stroke(); }
    // mown lawn stripes inside
    g.save(); g.beginPath(); g.rect(W.x0, W.y0, W.x1 - W.x0, W.y1 - W.y0); g.clip(); for (let x = W.x0; x < W.x1; x += 60) { g.fillStyle = (x / 60) % 2 ? 'rgba(80,110,60,.12)' : 'rgba(0,0,0,.06)'; g.fillRect(x, W.y0, 30, W.y1 - W.y0); } g.restore();
    // gravel: drive from the gate to the courtyard, courtyard, north terrace, service tracks
    const gravel = function (x, y, w, h, base) { g.fillStyle = base || '#6a6454'; g.fillRect(x, y, w, h); for (let i = 0; i < w * h / 30; i++) { const k = m8R(i + x + y); g.fillStyle = k > .6 ? 'rgba(170,165,145,.45)' : k > .3 ? 'rgba(40,36,30,.35)' : 'rgba(120,112,96,.3)'; g.fillRect(x + m8R(i * 1.7 + x) * w, y + m8R(i * 2.3 + y) * h, 2, 2); } };
    gravel(1110, 880, 180, 380); gravel(920, 600, 560, 290, '#726a58'); gravel(820, 225, 760, 72, '#7a7466'); gravel(1580, 380, 140, 300); gravel(1160, 1250, 80, 260, '#5a5444'); gravel(1580, 1060, 120, 100);
    g.strokeStyle = 'rgba(30,26,20,.35)'; g.lineWidth = 6; [-16, 16].forEach(function (o) { g.beginPath(); g.moveTo(1200 + o, 1500); g.lineTo(1200 + o, 900); g.quadraticCurveTo(1200 + o, 860, 1150 + o, 860); g.stroke(); });
    // terrace flagstones
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; for (let x = 820; x < 1580; x += 38) for (let y = 225; y < 297; y += 24) g.strokeRect(x + (y % 48 ? 19 : 0), y, 38, 24);
    // the great wall: stone with coping and buttresses
    M8.obs.forEach(function (o) { if (o.kind !== 'cwall') return; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(o.x + 6, o.y + 8, o.w, o.h); g.fillStyle = m8Grad(g, o.x, o.y, o.x + o.w, o.y + o.h, [[0, '#8a8272'], [1, '#5a5446']]); g.fillRect(o.x, o.y, o.w, o.h); g.strokeStyle = 'rgba(30,26,20,.5)'; g.lineWidth = 1; const hor = o.w > o.h; for (let k = 0; k < (hor ? o.w : o.h); k += 22) { g.beginPath(); if (hor) { g.moveTo(o.x + k, o.y); g.lineTo(o.x + k, o.y + o.h); } else { g.moveTo(o.x, o.y + k); g.lineTo(o.x + o.w, o.y + k); } g.stroke(); } g.fillStyle = 'rgba(255,250,230,.15)'; if (hor) g.fillRect(o.x, o.y, o.w, 3); else g.fillRect(o.x, o.y, 3, o.h); for (let k = 0; k < (hor ? o.w : o.h); k += 140) { g.fillStyle = '#6a6252'; if (hor) g.fillRect(o.x + k, o.y - 5, 14, o.h + 10); else g.fillRect(o.x - 5, o.y + k, o.w + 10, 14); } });
    // the breach: tumbled stones + fallen tree
    for (let i = 0; i < 26; i++) m8Disc(g, W.x0 - 30 + m8R(i + 70) * 70, W.breach[0] + m8R(i + 80) * 80, 4 + m8R(i + 90) * 8, '#4a4438', '#9a9282'); g.save(); g.translate(W.x0 - 120, W.breach[0] + 30); g.rotate(-.25); g.fillStyle = m8Grad(g, 0, -10, 0, 10, [[0, '#6a4a2a'], [1, '#2a1a0c']]); g.fillRect(0, -9, 110, 18); g.restore(); m8Tree(g, W.x0 - 140, W.breach[0] + 10, 30, 901);
    // gate pillars + iron gates (open)
    [W.gate[0] - 14, W.gate[1] - 10].forEach(function (x) { g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x + 6, W.y1 - 14, 28, 28); g.fillStyle = m8Grad(g, x, 0, x + 24, 0, [[0, '#9a9282'], [1, '#5a5446']]); g.fillRect(x, W.y1 - 18, 24, 30); m8Disc(g, x + 12, W.y1 - 4, 9, '#6a6252', '#c8c0a8'); });
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 2; [[W.gate[0] + 6, W.y1, 60, 1], [W.gate[1] - 8, W.y1, 60, -1]].forEach(function (q) { g.save(); g.translate(q[0], q[1]); g.rotate(q[3] * 1.1); g.beginPath(); g.moveTo(0, 0); g.lineTo(q[2] * q[3], 0); g.stroke(); for (let i = 6; i < q[2]; i += 6) { g.beginPath(); g.arc(i * q[3], 0, 2, 0, 7); g.stroke(); } g.restore(); });
    m8Sign(g, 1060, 1270, 70, 30, 'HALT!', 'Stab · Zutritt verboten');
    // hedges, box parterres, statues, gazebo, greenhouse
    M8.obs.forEach(function (o) {
        if (o.kind === 'hedge') m9Hedge(g, o);
        else if (o.kind === 'box') { g.fillStyle = '#28401c'; g.beginPath(); if (g.roundRect) g.roundRect(o.x, o.y, o.w, o.h, 5); else g.rect(o.x, o.y, o.w, o.h); g.fill(); g.fillStyle = 'rgba(120,160,80,.3)'; g.fillRect(o.x + 2, o.y + 2, o.w - 4, 3); }
        else if (o.kind === 'statue') { g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(o.x + 18, o.y + 20, 18, 10, .6, 0, 7); g.fill(); g.fillStyle = '#8a8478'; g.fillRect(o.x, o.y, 24, 24); m8Disc(g, o.x + 12, o.y + 12, 9, '#9a948a', '#e0dcd0'); m8Disc(g, o.x + 12, o.y + 8, 4, '#a09a8e', '#f0ece0'); }
        else if (o.kind === 'gazebo') { g.save(); g.translate(o.x + 45, o.y + 45); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 12; g.shadowOffsetX = 8; g.shadowOffsetY = 10; g.fillStyle = '#3a4a3a'; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + Math.PI / 8; g.lineTo(Math.cos(a) * 48, Math.sin(a) * 48); } g.closePath(); g.fill(); g.restore(); g.strokeStyle = 'rgba(0,0,0,.4)'; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + Math.PI / 8; g.beginPath(); g.moveTo(o.x + 45, o.y + 45); g.lineTo(o.x + 45 + Math.cos(a) * 48, o.y + 45 + Math.sin(a) * 48); g.stroke(); } m8Disc(g, o.x + 45, o.y + 45, 5, '#2a2a22', '#c8b060'); }
        else if (o.kind === 'glass') { g.fillStyle = 'rgba(150,180,190,.25)'; g.fillRect(o.x, o.y, o.w, o.h); g.strokeStyle = 'rgba(220,230,230,.5)'; g.lineWidth = 1; for (let x = o.x; x <= o.x + o.w; x += 20) { g.beginPath(); g.moveTo(x, o.y); g.lineTo(x, o.y + o.h); g.stroke(); } g.strokeRect(o.x, o.y, o.w, o.h); g.beginPath(); g.moveTo(o.x, o.y + o.h / 2); g.lineTo(o.x + o.w, o.y + o.h / 2); g.stroke(); for (let i = 0; i < 8; i++) m8Disc(g, o.x + 14 + i * 19, o.y + 24 + (i % 2) * 40, 6, '#2a4a1c', '#6a9a4a'); }
        else if (o.kind === 'tree') m8Tree(g, o.x + o.w / 2, o.y + o.h / 2, o.w * (o.small ? .7 : .66), o.seed || 1);
        else if (o.kind === 'stable' || o.kind === 'garage' || o.kind === 'barracks') { m9Roof(g, o.x, o.y, o.w, o.h, true, o.kind === 'barracks' ? ['#5a4a3a', '#3a3026', '#2a2018'] : ['#7a4a34', '#5a3424', '#3a2016']); m8Stencil(g, o.kind === 'stable' ? 'STALLUNGEN' : o.kind === 'garage' ? 'GARAGE' : 'WACHE', o.x + o.w / 2, o.y + o.h - 8, 11, 'rgba(230,220,180,.3)'); }
        else if (o.kind === 'mast') { g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.moveTo(o.x + 12, o.y + 12); g.lineTo(o.x + 160, o.y + 120); g.lineTo(o.x + 166, o.y + 112); g.closePath(); g.fill(); g.strokeStyle = '#3a3a3a'; g.lineWidth = 2; g.strokeRect(o.x, o.y, o.w, o.h); g.beginPath(); g.moveTo(o.x, o.y); g.lineTo(o.x + o.w, o.y + o.h); g.moveTo(o.x + o.w, o.y); g.lineTo(o.x, o.y + o.h); g.stroke(); g.strokeStyle = 'rgba(160,160,150,.4)'; g.lineWidth = .8; [[-60, -50], [80, -40], [-40, 70], [70, 60]].forEach(function (q) { g.beginPath(); g.moveTo(o.x + 12, o.y + 12); g.lineTo(o.x + 12 + q[0], o.y + 12 + q[1]); g.stroke(); }); }
        else if (o.kind === 'genset') { m8SoftShadow(g, o.x, o.y, o.w, o.h, 10); m8Bevel(g, o.x, o.y, o.w, o.h, '#4a4e3a'); g.strokeStyle = 'rgba(0,0,0,.4)'; for (let i = o.x + 6; i < o.x + o.w - 20; i += 5) { g.beginPath(); g.moveTo(i, o.y + 4); g.lineTo(i, o.y + o.h - 4); g.stroke(); } g.strokeStyle = '#0a0a08'; g.lineWidth = 3; g.beginPath(); g.moveTo(o.x, o.y + 20); g.quadraticCurveTo(1620, 640, 1584, 560); g.stroke(); }
        else if (o.kind === 'kubel') { m8SoftShadow(g, o.x, o.y, o.w, o.h, 10); g.fillStyle = m8Grad(g, 0, o.y, 0, o.y + o.h, [[0, '#6a6a50'], [1, '#3a3a2a']]); g.beginPath(); g.moveTo(o.x, o.y + 6); g.lineTo(o.x + o.w - 14, o.y); g.lineTo(o.x + o.w, o.y + 8); g.lineTo(o.x + o.w, o.y + o.h - 8); g.lineTo(o.x + o.w - 14, o.y + o.h); g.lineTo(o.x, o.y + o.h - 6); g.closePath(); g.fill(); g.fillStyle = '#2a2a1e'; g.fillRect(o.x + 26, o.y + 8, 36, o.h - 16); g.fillStyle = 'rgba(140,170,190,.35)'; g.fillRect(o.x + o.w - 30, o.y + 6, 3, o.h - 12); }
    });
    // the château: roofs, gables, chimneys, dormers, corner turrets
    m9Roof(g, 900, 300, 580, 300, true, ['#5a5e6a', '#363a44', '#22242c']); m9Roof(g, 820, 300, 100, 480, false); m9Roof(g, 1480, 300, 100, 480, false);
    for (let i = 0; i < 9; i++) { const x = 940 + i * 60; [312, 556].forEach(function (y) { g.fillStyle = '#2a2c34'; g.fillRect(x, y, 20, 18); g.fillStyle = 'rgba(255,200,120,.55)'; g.fillRect(x + 4, y + (y < 400 ? 2 : 8), 12, 6); }); }
    [[1000, 360], [1180, 470], [1360, 360], [870, 420], [1530, 640]].forEach(function (p) { m8SoftShadow(g, p[0], p[1], 26, 18, 8); g.fillStyle = '#6a5a4e'; g.fillRect(p[0], p[1], 26, 18); g.fillStyle = '#1a1412'; g.fillRect(p[0] + 4, p[1] + 4, 7, 10); g.fillRect(p[0] + 15, p[1] + 4, 7, 10); });
    [[820, 300], [1580, 300], [820, 780], [1580, 780], [900, 600], [1480, 600]].forEach(function (p, i) { m9Turret(g, p[0], p[1], i < 4 ? 34 : 26); });
    // main entrance steps and porch
    g.fillStyle = '#8a8478'; g.fillRect(1150, 600, 100, 22); g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 3; i++) g.fillRect(1150, 606 + i * 6, 100, 1.4); g.fillStyle = '#3a2a1c'; g.fillRect(1180, 596, 40, 8);
    // window light spilling onto the gravel and lawn
    g.save(); g.globalCompositeOperation = 'lighter'; [[960, 610], [1060, 610], [1340, 610], [1440, 610], [1000, 292], [1140, 292], [1440, 292], [918, 680], [1484, 680]].forEach(function (p) { const gg = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], 46); gg.addColorStop(0, 'rgba(255,190,110,.22)'); gg.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gg; g.beginPath(); g.ellipse(p[0], p[1], 46, 30, 0, 0, 7); g.fill(); }); g.restore();
    return c;
}
function m9DrawOutsideLive(now) {
    M8.lamps.forEach(function (l) { m8LampPost(ctx, l.x, l.y); });
    // fountain: basin + rippling water
    const fx = 1200, fy = 720; m8Disc(ctx, fx + 4, fy + 6, 34, 'rgba(0,0,0,.5)', 'rgba(0,0,0,.3)'); m8Disc(ctx, fx, fy, 32, '#6a6458', '#b8b0a0'); ctx.fillStyle = '#1e2c34'; ctx.beginPath(); ctx.arc(fx, fy, 26, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(160,190,210,.35)'; ctx.lineWidth = 1; for (let i = 0; i < 3; i++) { const r = ((now / 30 + i * 9) % 26); ctx.beginPath(); ctx.arc(fx, fy, r, 0, 7); ctx.stroke(); } m8Disc(ctx, fx, fy, 6, '#8a8478', '#e0dcd0');
    // the staff car
    m9DrawCarTop(M9_CAR.x, M9_CAR.y, M9_CAR.w, M9_CAR.h, now, M8.docs);
    // doors
    M9_DOORS.forEach(function (d) { const R = M8.rooms[d.id], near = M8.nearDoor === d, vert = d.face === 'e' || d.face === 'w', w = vert ? 10 : 34, h = vert ? 34 : 10; ctx.fillStyle = R && R.planted ? '#2a4a20' : '#4a2e18'; ctx.fillRect(d.x - w / 2, d.y - h / 2, w, h); ctx.strokeStyle = near ? '#ffd24a' : '#c8a060'; ctx.lineWidth = 2; ctx.strokeRect(d.x - w / 2, d.y - h / 2, w, h); ctx.fillStyle = 'rgba(255,200,120,.8)'; ctx.fillRect(d.x - (vert ? 1 : 1), d.y - (vert ? 1 : 1), 2, 2);
        if (near && !R.planted) { const p = .5 + .5 * Math.sin(now / 160); ctx.strokeStyle = 'rgba(255,210,74,' + (.3 + p * .5) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(d.x, d.y, 30 + p * 4, 0, 7); ctx.stroke(); } });
    if (M8.nearCar) { const p = .5 + .5 * Math.sin(now / 160); ctx.strokeStyle = M8.docs ? 'rgba(120,230,100,' + (.4 + p * .5) + ')' : 'rgba(255,210,74,.4)'; ctx.lineWidth = 3; ctx.strokeRect(M9_CAR.x - 8, M9_CAR.y - 8, M9_CAR.w + 16, M9_CAR.h + 16); ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = M8.docs ? '#9fe08a' : '#ffd24a'; ctx.fillText(M8.docs ? '[F] GET IN — DRIVE!' : 'NEED THE KEY SHEETS FIRST', M9_CAR.x + M9_CAR.w / 2, M9_CAR.y - 16); }
    // radio mast warning light
    if (!M8.radioOut && Math.floor(now / 600) % 2) { ctx.fillStyle = '#ff3020'; ctx.beginPath(); ctx.arc(1662, 612, 3, 0, 7); ctx.fill(); }
}
function m9DrawCarTop(x, y, w, h, now, ready) { // Horch staff car, open tourer, nose to the right
    ctx.save(); m8RR(ctx, x + 6, y + 8, w, h, 16, 'rgba(0,0,0,.4)');
    ctx.fillStyle = '#121210'; [[x + 14, y - 4], [x + w - 34, y - 4], [x + 14, y + h - 4], [x + w - 34, y + h - 4]].forEach(function (p) { m8RR(ctx, p[0], p[1], 22, 8, 3, '#121210'); });
    const bg = ctx.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, '#5a5e48'); bg.addColorStop(.5, '#3e4232'); bg.addColorStop(1, '#262a1e'); ctx.fillStyle = bg; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y + 2, w, h - 4, 14); else ctx.rect(x, y + 2, w, h - 4); ctx.fill(); ctx.strokeStyle = '#0e0e0a'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(x + 4, y + 6, w - 8, 3);
    ctx.fillStyle = '#2a2a20'; ctx.fillRect(x + w - 44, y + 8, 38, h - 16); ctx.strokeStyle = 'rgba(0,0,0,.4)'; for (let i = x + w - 40; i < x + w - 8; i += 4) { ctx.beginPath(); ctx.moveTo(i, y + 10); ctx.lineTo(i, y + h - 10); ctx.stroke(); }
    ctx.fillStyle = 'rgba(150,180,200,.4)'; ctx.fillRect(x + w - 52, y + 6, 4, h - 12);
    ctx.fillStyle = '#5a3a22'; ctx.fillRect(x + 22, y + 9, 56, h - 18); ctx.fillStyle = '#6a4a2a'; [[x + 26, y + 11], [x + 26, y + h / 2 + 1], [x + 52, y + 11], [x + 52, y + h / 2 + 1]].forEach(function (p) { m8RR(ctx, p[0], p[1], 22, h / 2 - 12, 3, '#6a4a2a'); });
    m8Disc(ctx, x + 58, y + h / 2 - 8, 5, '#1a1a14', '#4a4a3a');
    ctx.fillStyle = '#2a2820'; ctx.fillRect(x + 4, y + 8, 16, h - 16); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.moveTo(x + 8, y + 8); ctx.lineTo(x + 8, y + h - 8); ctx.moveTo(x + 14, y + 8); ctx.lineTo(x + 14, y + h - 8); ctx.stroke();
    ctx.fillStyle = '#d8c060'; ctx.fillRect(x + w - 3, y + 8, 3, 6); ctx.fillRect(x + w - 3, y + h - 14, 3, 6);
    if (ready && Math.random() < .4) M8.parts.push({ k: 'smoke', x: x - 4, y: y + h - 10, vx: -.6, vy: .1, life: .7, decay: .03, r: 3, grow: .4, col: 'grey', scene: 'out' });
    ctx.restore();
}

/* ---------- art: rooms ---------- */
function m9Parquet(g) { const p = document.createElement('canvas'); p.width = 48; p.height = 48; const q = p.getContext('2d'); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = (i + j) % 2; q.fillStyle = ['#6a4426', '#7a5030', '#5e3c20', '#734a2a'][(i * 3 + j) % 4]; if (v) q.fillRect(i * 12, j * 12, 12, 12); else q.fillRect(i * 12, j * 12, 12, 12); q.strokeStyle = 'rgba(30,14,4,.55)'; q.lineWidth = .8; q.strokeRect(i * 12 + .4, j * 12 + .4, 11.2, 11.2); q.strokeStyle = 'rgba(30,14,4,.25)'; q.lineWidth = .4; for (let k = 2; k < 12; k += 3) { q.beginPath(); if (v) { q.moveTo(i * 12 + k, j * 12); q.lineTo(i * 12 + k, j * 12 + 12); } else { q.moveTo(i * 12, j * 12 + k); q.lineTo(i * 12 + 12, j * 12 + k); } q.stroke(); } } return p; }
function m9Rug(g, x, y, w, h, col) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x + 4, y + 5, w, h); g.fillStyle = col[0]; g.fillRect(x, y, w, h); g.strokeStyle = col[1]; g.lineWidth = 6; g.strokeRect(x + 10, y + 10, w - 20, h - 20); g.lineWidth = 2; g.strokeRect(x + 20, y + 20, w - 40, h - 40); g.fillStyle = col[1]; g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w * .2, h * .2, 0, 0, 7); g.fill(); g.fillStyle = col[2]; g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w * .12, h * .12, 0, 0, 7); g.fill(); for (let i = 0; i < 10; i++) { g.fillStyle = col[2]; g.beginPath(); g.arc(x + 30 + i * (w - 60) / 9, y + 15, 3, 0, 7); g.arc(x + 30 + i * (w - 60) / 9, y + h - 15, 3, 0, 7); g.fill(); } g.strokeStyle = 'rgba(230,220,190,.6)'; g.lineWidth = 1; for (let i = x; i < x + w; i += 4) { g.beginPath(); g.moveTo(i, y); g.lineTo(i, y - 4); g.moveTo(i, y + h); g.lineTo(i, y + h + 4); g.stroke(); } }
function m9BuildRoomArt(R) {
    const c = document.createElement('canvas'); c.width = 1100; c.height = 700; const g = c.getContext('2d'), id = R.id;
    // floor
    if (id === 'kitchen') { for (let x = 40; x < 1060; x += 34) for (let y = 40; y < 660; y += 34) { g.fillStyle = ((x + y) / 34) % 2 ? '#8a7a64' : '#6a5a46'; g.fillRect(x, y, 34, 34); } g.strokeStyle = 'rgba(0,0,0,.3)'; for (let x = 40; x < 1060; x += 34) { g.beginPath(); g.moveTo(x, 40); g.lineTo(x, 660); g.stroke(); } for (let y = 40; y < 660; y += 34) { g.beginPath(); g.moveTo(40, y); g.lineTo(1060, y); g.stroke(); } }
    else { g.fillStyle = g.createPattern(M9.parq || (M9.parq = m9Parquet()), 'repeat'); g.fillRect(40, 40, 1020, 620); }
    g.fillStyle = m8Grad(g, 0, 40, 0, 660, [[0, 'rgba(0,0,0,.3)'], [.5, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.35)']]); g.fillRect(40, 40, 1020, 620);
    for (let i = 0; i < 40; i++) { const x = 60 + m8R(i + id.length * 7) * 980, y = 60 + m8R(i + 33) * 580; g.fillStyle = 'rgba(255,220,170,.04)'; g.beginPath(); g.ellipse(x, y, 30, 8, m8R(i) * 3, 0, 7); g.fill(); }
    if (id === 'study') { m9Rug(g, 130, 340, 300, 230, ['#6a1c18', '#c8a040', '#2a3a5a']); m9Rug(g, 660, 340, 290, 200, ['#2a3a5a', '#c8a040', '#6a1c18']); }
    if (id === 'signals') { m9Rug(g, 380, 330, 340, 160, ['#3a3a2a', '#8a7a40', '#1a1a10']); }
    // walls: panelled wood below, wallpaper above (north face visible)
    g.fillStyle = '#1e140c'; g.fillRect(0, 0, 1100, 40); g.fillRect(0, 0, 40, 700); g.fillRect(1060, 0, 40, 700); g.fillRect(0, 660, 1100, 40);
    const wp = id === 'kitchen' ? ['#c8bc9a', '#b0a480'] : id === 'signals' ? ['#7a7e6a', '#6a6e5a'] : ['#6a2a24', '#5a221c'];
    g.fillStyle = wp[0]; g.fillRect(40, 22, 1020, 26); g.fillStyle = wp[1]; for (let x = 40; x < 1060; x += 18) { g.beginPath(); g.ellipse(x + 9, 30, 3, 5, 0, 0, 7); g.fill(); }
    g.fillStyle = id === 'kitchen' ? '#e0d8c0' : '#5a3a22'; g.fillRect(40, 48, 1020, 16); g.fillStyle = 'rgba(0,0,0,.35)'; for (let x = 40; x < 1060; x += 85) g.fillRect(x, 48, 2, 16); g.fillStyle = 'rgba(255,230,180,.2)'; g.fillRect(40, 48, 1020, 2); g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(40, 64, 1020, 6);
    [[0, 0, 40, 700], [1060, 0, 40, 700], [0, 660, 500, 40], [600, 660, 500, 40]].forEach(function (b) { g.fillStyle = m8Grad(g, b[0], b[1], b[0] + b[2], b[1] + b[3], [[0, '#4a3020'], [1, '#2a1a0e']]); g.fillRect(b[0], b[1], b[2], b[3]); g.strokeStyle = 'rgba(200,160,100,.25)'; g.lineWidth = 1; g.strokeRect(b[0] + 4, b[1] + 4, b[2] - 8, b[3] - 8); });
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(40, 40, 8, 620); g.fillRect(1052, 40, 8, 620);
    // windows with curtains on the side walls
    [[1060, 120], [1060, 500], [0, 560]].forEach(function (w) { if (id === 'study' && w[1] === 120) return; g.fillStyle = '#0a0e18'; g.fillRect(w[0] + 8, w[1], 24, 70); g.fillStyle = 'rgba(120,140,190,.25)'; g.fillRect(w[0] + 10, w[1] + 2, 20, 66); g.fillStyle = '#6a1c18'; g.fillRect(w[0] + (w[0] ? 0 : 30), w[1] - 8, 10, 86); });
    // door out (south)
    g.fillStyle = '#0a0806'; g.fillRect(500, 660, 100, 40); g.fillStyle = '#5a3a22'; g.save(); g.translate(500, 664); g.rotate(.5); g.fillRect(0, -4, 50, 8); g.restore(); g.save(); g.translate(600, 664); g.rotate(-.5); g.fillRect(-50, -4, 50, 8); g.restore(); m9Rug(g, 510, 600, 80, 56, ['#3a2a1a', '#8a6a3a', '#1a120a']);
    m8Stencil(g, R.title, 1040, 36, 13, 'rgba(240,230,200,.4)', 0, 'right');
    // furniture
    R.obs.forEach(function (o) { const x = o.x, y = o.y, w = o.w, h = o.h; if (o.kind === 'wall') return; if (o.kind !== 'clock') m8SoftShadow(g, x, y, w, h, 14);
        if (o.kind === 'desk') { g.fillStyle = m8Grad(g, x, y, x + w, y + h, [[0, '#7a4a28'], [1, '#3a2010']]); g.fillRect(x, y, w, h); g.strokeStyle = '#2a1408'; g.lineWidth = 3; g.strokeRect(x + 2, y + 2, w - 4, h - 4); g.fillStyle = '#2a4a2a'; g.fillRect(x + 30, y + 14, w - 60, h - 28); g.fillStyle = '#e8e0c8'; g.save(); g.translate(x + 90, y + 40); g.rotate(-.15); g.fillRect(0, 0, 40, 30); g.fillStyle = '#3a3a30'; for (let i = 0; i < 6; i++) g.fillRect(4, 4 + i * 4, 30, 1); g.restore(); g.fillStyle = '#111'; g.fillRect(x + 200, y + 24, 30, 22); m8Disc(g, x + 215, y + 35, 8, '#1a1a1a', '#4a4a4a'); m8Disc(g, x + 60, y + 30, 10, '#5a4a20', '#e0c070'); g.fillStyle = '#e8e0c8'; g.fillRect(x + 150, y + 50, 22, 28); m8Disc(g, x + 130, y + h + 22, 18, '#3a1a10', '#7a3a20'); }
        else if (o.kind === 'shelf') { g.fillStyle = '#3a2410'; g.fillRect(x, y, w, h); for (let j = y + 4; j < y + h - 4; j += 4.5) { g.fillStyle = ['#7a2018', '#2a3a5a', '#4a5a2a', '#8a6a30', '#5a3a5a', '#1a1a1a'][Math.floor(m8R(j + x) * 6)]; g.fillRect(x + 4 + m8R(j) * 6, j, w - 10 - m8R(j + 1) * 10, 3.6); } g.fillStyle = 'rgba(0,0,0,.4)'; for (let j = y; j < y + h; j += 70) g.fillRect(x, j, w, 3); }
        else if (o.kind === 'fireplace') { g.fillStyle = '#8a8478'; g.fillRect(x, y, w, h); g.fillStyle = '#c8c0b0'; g.fillRect(x, y, w, 10); g.fillRect(x, y + h - 10, w, 10); g.fillStyle = '#100a06'; g.fillRect(x + 4, y + 30, w - 8, h - 60); }
        else if (o.kind === 'sofa' || o.kind === 'chair') { g.fillStyle = m8Grad(g, 0, y, 0, y + h, [[0, '#8a2a20'], [1, '#4a1410']]); m8RR(g, x, y, w, h, 10, g.fillStyle); g.fillStyle = 'rgba(0,0,0,.25)'; m8RR(g, x + 8, y + 10, w - 16, h - 20, 6, g.fillStyle); g.fillStyle = 'rgba(255,200,170,.15)'; g.fillRect(x + 6, y + 4, w - 12, 4); if (o.kind === 'sofa') { g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x + w / 3, y + 10, 2, h - 20); g.fillRect(x + w * 2 / 3, y + 10, 2, h - 20); } }
        else if (o.kind === 'ctable') { g.fillStyle = m8Grad(g, x, y, x + w, y + h, [[0, '#6a3e20'], [1, '#3a2010']]); m8RR(g, x, y, w, h, 6, g.fillStyle); g.fillStyle = 'rgba(255,230,180,.15)'; g.fillRect(x + 4, y + 4, w - 8, 3); m8Disc(g, x + 30, y + 30, 8, '#c8c0a8', '#ffffff'); g.fillStyle = '#8a6a30'; g.fillRect(x + 60, y + 18, 34, 22); }
        else if (o.kind === 'maptable') { g.fillStyle = '#4a2e18'; g.fillRect(x, y, w, h); g.fillStyle = '#d8ccaa'; g.fillRect(x + 6, y + 6, w - 12, h - 12); g.strokeStyle = 'rgba(60,90,140,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 10, y + 70); g.quadraticCurveTo(x + 80, y + 40, x + w - 10, y + 60); g.stroke(); g.fillStyle = 'rgba(80,120,60,.35)'; g.beginPath(); g.ellipse(x + 70, y + 30, 40, 18, 0, 0, 7); g.fill(); [[40, 50, '#c02818'], [110, 66, '#1a3a8a'], [140, 40, '#c02818'], [90, 80, '#1a3a8a']].forEach(function (p) { g.fillStyle = p[2]; g.beginPath(); g.arc(x + p[0], y + p[1], 3.4, 0, 7); g.fill(); }); }
        else if (o.kind === 'globe') { g.fillStyle = '#3a2410'; g.fillRect(x, y, w, h); m8Disc(g, x + w / 2, y + h / 2, 20, '#2a4a6a', '#8ab0c8'); g.fillStyle = 'rgba(120,150,80,.6)'; g.beginPath(); g.ellipse(x + w / 2 - 4, y + h / 2 - 3, 7, 10, .4, 0, 7); g.fill(); }
        else if (o.kind === 'files') { g.fillStyle = m8Grad(g, x, 0, x + w, 0, [[0, '#6a6a5a'], [1, '#3a3a2e']]); g.fillRect(x, y, w, h); for (let i = 0; i < 3; i++) { g.strokeStyle = 'rgba(0,0,0,.4)'; g.strokeRect(x + 4 + i * (w - 8) / 3, y + 4, (w - 8) / 3 - 2, h - 8); g.fillStyle = '#c8c0a0'; g.fillRect(x + 10 + i * (w - 8) / 3, y + h / 2 - 2, 12, 4); } }
        else if (o.kind === 'clock') { g.fillStyle = '#3a2410'; g.fillRect(x + 80, y - 10, 40, 40); m8Disc(g, x + 100, y + 6, 12, '#c8b070', '#f0e8d0'); }
        else if (o.kind === 'racks') { for (let i = 0; i < w; i += 70) { g.fillStyle = '#3a3e34'; g.fillRect(x + i + 2, y, 66, h); g.fillStyle = '#26281e'; g.fillRect(x + i + 6, y + 6, 58, h - 12); for (let k = 0; k < 3; k++) m8Gauge(g, x + i + 18 + k * 18, y + 18, 6, .3 + m8R(i + k) * .5); g.fillStyle = '#c8b060'; for (let k = 0; k < 6; k++) m8Disc(g, x + i + 12 + k * 9, y + 40, 2.4, '#3a3a2a', '#c8c0a0'); } }
        else if (o.kind === 'opdesk') { g.fillStyle = m8Grad(g, x, y, x + w, y + h, [[0, '#5a4a30'], [1, '#2e2414']]); g.fillRect(x, y, w, h); for (let i = 0; i < 2; i++) { const ex = x + 30 + i * 140; g.fillStyle = '#3a2a18'; g.fillRect(ex, y + 8, 90, h - 16); g.fillStyle = '#1a1a14'; for (let r = 0; r < 3; r++) for (let k = 0; k < 9 - r; k++) { g.beginPath(); g.arc(ex + 10 + k * 8.5 + r * 4, y + 32 + r * 9, 3, 0, 7); g.fill(); } g.fillStyle = '#2a2a22'; g.fillRect(ex + 8, y + 12, 74, 12); for (let k = 0; k < 3; k++) m8Disc(g, ex + 30 + k * 12, y + 14, 4, '#1a1a14', '#8a8a78'); } }
        else if (o.kind === 'teleprinter') { g.fillStyle = '#4a4e44'; g.fillRect(x, y, w, h); g.fillStyle = '#1e201a'; g.fillRect(x + 10, y + 10, w - 20, 26); g.fillStyle = '#e8e0c8'; g.fillRect(x + w / 2 - 16, y - 18, 32, 22); }
        else if (o.kind === 'board') { g.fillStyle = '#3a2a18'; g.fillRect(x, y, w, h); g.fillStyle = '#d8ccaa'; g.fillRect(x + 4, y + 6, w - 8, h - 12); g.strokeStyle = '#c02818'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 8, y + 30); g.lineTo(x + 20, y + 90); g.lineTo(x + 10, y + 160); g.stroke(); }
        else if (o.kind === 'transmitter') { g.fillStyle = m8Grad(g, x, 0, x + w, 0, [[0, '#5a5e50'], [1, '#2a2c24']]); g.fillRect(x, y, w, h); g.fillStyle = '#16180f'; g.fillRect(x + 10, y + 10, w - 20, h - 20); for (let i = 0; i < 4; i++) m8Gauge(g, x + 30 + (i % 2) * 70, y + 40 + Math.floor(i / 2) * 50, 12, .4 + i * .1, i === 3); g.fillStyle = '#8a8a78'; for (let k = 0; k < 6; k++) m8Disc(g, x + 24 + k * 18, y + h - 22, 4, '#2a2a22', '#c8c0a0'); m8Stencil(g, 'Lorenz 100W', x + w / 2, y + h - 4, 10, 'rgba(220,210,170,.5)'); }
        else if (o.kind === 'stove') { g.fillStyle = '#2a2a28'; g.fillRect(x, y, w, h); for (let i = 0; i < 5; i++) { m8Disc(g, x + 34 + i * 66, y + h / 2, 22, '#121210', '#5a5a52'); g.strokeStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(x + 34 + i * 66, y + h / 2, 14, 0, 7); g.stroke(); } m8Disc(g, x + 100, y + h / 2, 18, '#5a4a38', '#a08a68'); m8Disc(g, x + 232, y + h / 2, 20, '#3a3a38', '#9a9a90'); }
        else if (o.kind === 'ktable') { g.fillStyle = m8Grad(g, x, y, x + w, y + h, [[0, '#a8885a'], [1, '#6a5030']]); g.fillRect(x, y, w, h); g.strokeStyle = 'rgba(60,40,20,.4)'; for (let i = x; i < x + w; i += 30) { g.beginPath(); g.moveTo(i, y); g.lineTo(i, y + h); g.stroke(); } [[30, 30, '#e8e0c8'], [90, 40, '#c8a040'], [160, 30, '#8a2a20']].forEach(function (q) { m8Disc(g, x + q[0], y + q[1], 12, q[2], '#ffffff'); }); g.fillStyle = '#e0c890'; g.beginPath(); g.ellipse(x + w - 50, y + 40, 26, 12, 0, 0, 7); g.fill(); }
        else if (o.kind === 'barrels') { for (let i = 0; i < 4; i++) m8Drum(g, x + 30 + (i % 2) * 64, y + 28 + Math.floor(i / 2) * 54, 24, '#6a4a2a', '#9a7a4a'); }
        else if (o.kind === 'supplies') { m8Crate(g, x, y, 60, 40, 1, 'MUNITION'); m8Crate(g, x + 64, y, 60, 40, 2, 'VERPFLEGUNG'); m8Crate(g, x + 10, y + 42, 56, 36, 3, ''); g.fillStyle = '#e8e0c8'; g.fillRect(x + 76, y + 46, 40, 28); g.fillStyle = '#c02818'; g.fillRect(x + 92, y + 49, 8, 22); g.fillRect(x + 85, y + 56, 22, 8); }
        else if (o.kind === 'sink') { g.fillStyle = '#c8c4b8'; g.fillRect(x, y, w, h); g.fillStyle = '#6a7a84'; g.fillRect(x + 10, y + 8, w - 20, h - 16); m8Disc(g, x + w / 2, y + 6, 5, '#8a8a80', '#e0e0d8'); }
    });
    // the painting hiding the safe (study, north wall)
    if (id === 'study') { g.fillStyle = '#c8a040'; g.fillRect(730, 18, 100, 52); g.fillStyle = '#2a3a2a'; g.fillRect(736, 22, 88, 44); g.fillStyle = 'rgba(160,140,90,.6)'; g.beginPath(); g.ellipse(780, 50, 30, 10, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(200,180,140,.5)'; g.beginPath(); g.arc(760, 36, 6, 0, 7); g.fill(); }
    if (R.bell) { m8Bevel(g, R.bell.x - 12, R.bell.y - 14, 24, 28, '#2a2a22'); m8Disc(g, R.bell.x, R.bell.y - 2, 8, '#1a1a14', '#4a4a3a'); m8Stencil(g, 'TELEFON', R.bell.x + (R.bell.x > 550 ? -42 : 42), R.bell.y + 4, 10, 'rgba(255,170,140,.6)'); }
    return c;
}
function m9DrawRoomLive(R, now) {
    const t = now / 1000;
    R.obs.forEach(function (o) { const x = o.x, y = o.y, w = o.w, h = o.h;
        if (o.kind === 'fireplace') { for (let i = 0; i < 4; i++) { const f = .7 + .3 * Math.sin(t * 9 + i * 2); const gg = ctx.createRadialGradient(x + w / 2, y + 60 + i * 26, 0, x + w / 2, y + 60 + i * 26, 18 * f); gg.addColorStop(0, 'rgba(255,230,150,.95)'); gg.addColorStop(.5, 'rgba(255,130,40,.7)'); gg.addColorStop(1, 'rgba(120,30,10,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x + w / 2, y + 60 + i * 26, 18 * f, 0, 7); ctx.fill(); } }
        if (o.kind === 'opdesk') { for (let i = 0; i < 2; i++) { const ex = x + 30 + i * 140; const lit = Math.floor(t * 4 + i * 3) % 26; ctx.fillStyle = 'rgba(255,230,120,.95)'; ctx.beginPath(); ctx.arc(ex + 14 + (lit % 9) * 8.5, y + 32 + Math.floor(lit / 9) * 9 - 0, 2.6, 0, 7); ctx.fill(); } }
        if (o.kind === 'racks') { for (let i = 0; i < w; i += 70) { ctx.fillStyle = (Math.floor(t * 2 + i) % 3) ? 'rgba(100,220,110,.9)' : 'rgba(230,80,50,.9)'; ctx.beginPath(); ctx.arc(x + i + 58, y + 12, 2.4, 0, 7); ctx.fill(); } }
        if (o.kind === 'transmitter' && !M8.radioOut) { ctx.fillStyle = Math.floor(t * 3) % 2 ? '#ff4030' : '#601008'; ctx.beginPath(); ctx.arc(x + w - 18, y + 18, 4, 0, 7); ctx.fill(); }
        if (o.kind === 'teleprinter') { const len = 10 + (t * 6) % 30; ctx.fillStyle = '#e8e0c8'; ctx.fillRect(x + w / 2 - 16, y - 18 - len, 32, len); ctx.fillStyle = 'rgba(0,0,0,.4)'; for (let k = 0; k < len; k += 3) ctx.fillRect(x + w / 2 - 12, y - 18 - k, 22, .6); }
        if (o.kind === 'stove' && Math.random() < .08) M8.parts.push({ k: 'smoke', x: x + 100 + Math.random() * 140, y: y + h / 2, vx: (Math.random() - .5) * .3, vy: -.4, life: .7, decay: .02, r: 5, grow: .5, col: 'steam', scene: M8.scene });
        if (o.kind === 'clock') { const a = Math.sin(t * 3) * .5; ctx.strokeStyle = '#c8a040'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x + 100, y + 6); ctx.lineTo(x + 100 + Math.sin(t) * 8, y + 6 - Math.cos(t) * 8); ctx.stroke(); }
    });
    if (R.id === 'study' && R.planted) { ctx.fillStyle = '#2a2a26'; ctx.fillRect(752, 26, 56, 40); ctx.fillStyle = '#0a0a08'; ctx.fillRect(758, 30, 44, 32); }
}
function m9DrawRoomOverhead(R, now) {
    R.lamps.forEach(function (l) { if (l.warm) return; ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(l.x + 6, l.y + 8, 16, 0, 7); ctx.fill(); m8Disc(ctx, l.x, l.y, 14, '#5a4a20', '#e0c070'); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .3; ctx.fillStyle = '#fff2c0'; ctx.beginPath(); ctx.arc(l.x + Math.cos(a) * 11, l.y + Math.sin(a) * 11, 3, 0, 7); ctx.fill(); } });
}
