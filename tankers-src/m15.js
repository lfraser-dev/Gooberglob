/* =====================================================
   MISSION 15 — PACIFIC 03 · "THE LOST PATROL", Okinawa, May 1945
   The main tank engine on a large scrolling battlefield (3200×2000), bigger than Skirmish.
   A Marine patrol is cut off at an old shrine deep in the bamboo forest north of Wana. The player leads four
   Shermans up the narrow trails, holds the shrine while the patrol climbs aboard, then brings them back
   to the aid station while Japanese tanks and infantry close in through the bamboo.
===================================================== */
const M15 = { active: false, failWhy: '', result: null };
const M15W = 3200, M15H = 2000;
const M15_SURI = { x: -9999, y: -9999, r: 1 };
const M15_BOX = [], M15_DUG = [], M15_HOLES = [], M15_MINES = [], M15_PLANES = [], M15_REVET = [], M15_TERR = [];
// the bamboo forest: everything is thicket except the trails and glades below
const M15_CLEAR = [{ x: 1600, y: 1790, r: 210, k: 'aid' }, { x: 1600, y: 330, r: 230, k: 'shrine' }, { x: 1600, y: 1160, r: 150, k: 'bridge' }, { x: 700, y: 1180, r: 180, k: 'hut' }, { x: 2500, y: 1180, r: 180, k: 'pond' }, { x: 560, y: 560, r: 150, k: 'nw' }, { x: 2640, y: 560, r: 150, k: 'ne' },
    { x: 1100, y: 1520, r: 135, k: 'kiln' }, { x: 2100, y: 1520, r: 135, k: 'mill' }, { x: 1150, y: 800, r: 140, k: 'rw' }, { x: 2050, y: 800, r: 140, k: 're' }];
const M15_TRAIL = [{ w: 56, p: [[1600, 1790], [1580, 1520], [1600, 1160], [1630, 960], [1600, 790], [1600, 560], [1600, 330]] },
    { w: 60, p: [[1600, 1790], [1260, 1720], [1100, 1520], [900, 1370], [700, 1180], [880, 920], [1150, 800], [1360, 540], [1600, 330]] },
    { w: 60, p: [[1600, 1790], [1940, 1720], [2100, 1520], [2300, 1370], [2500, 1180], [2320, 920], [2050, 800], [1840, 540], [1600, 330]] },
    { w: 52, p: [[700, 1180], [600, 860], [560, 560], [1000, 380], [1600, 330]] }, { w: 52, p: [[2500, 1180], [2600, 860], [2640, 560], [2200, 380], [1600, 330]] },
    { w: 50, p: [[700, 1180], [1150, 1170], [1600, 1160], [2050, 1170], [2500, 1180]] }, { w: 48, p: [[1150, 800], [1600, 790], [2050, 800]] }, { w: 48, p: [[1100, 1520], [1580, 1520], [2100, 1520]] },
    { w: 52, p: [[1600, 330], [1600, -60]] }, { w: 46, p: [[560, 560], [60, 300]] }, { w: 46, p: [[2640, 560], [3140, 300]] }, { w: 46, p: [[700, 1180], [60, 1300]] }, { w: 46, p: [[2500, 1180], [3140, 1300]] }, { w: 60, p: [[1600, 1790], [1600, 2060]] }];
const M15_WRECK = [[1690, 1360, 1.9, 'jeep'], [1000, 1445, .6, 'truck'], [2290, 935, 2.2, 'jeep']];
const M15_DITCH = [], M15_HOUSES = [], M15_PINES = [], M15_CANE = [], M15_PADDY = [];
const M15_GOAL = { x: 1600, y: 1810, r: 90 }; // the aid station
const M15_PATROL = { x: 1600, y: 370 }; // the patrol, holed up at the old shrine
// where each glade's furniture was first painted (the art shifts it to the glade's new place)
const M15_OLD = { aid: [1200, 1340], shrine: [1200, 330], hut: [520, 810], pond: [1880, 810], nw: [420, 300], ne: [2000, 300] };
function m15Shift(k) { const o = M15_OLD[k], c = M15_CLEAR.filter(function (q) { return q.k === k; })[0]; return [c.x - o[0], c.y - o[1]]; }
function m15StreamY(x) { return 1250 + 60 * Math.sin(x / 500 + 1) + 14 * Math.sin(x / 120); }
function m15SegD(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, q = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0; return Math.hypot(px - ax - dx * q, py - ay - dy * q); }
function m15Open(x, y) { let o = -1e9; for (let i = 0; i < M15_CLEAR.length; i++) { const c = M15_CLEAR[i], v = c.r - Math.hypot(x - c.x, y - c.y); if (v > o) o = v; } for (let i = 0; i < M15_TRAIL.length; i++) { const t = M15_TRAIL[i], p = t.p; for (let k = 0; k < p.length - 1; k++) { const v = t.w - m15SegD(x, y, p[k][0], p[k][1], p[k + 1][0], p[k + 1][1]); if (v > o) o = v; } } return o; }
function m15TerrY(i, x) { return 0; }
function m15InPaddy(x, y) { if (Math.abs(y - m15StreamY(x)) > 28) return false; return !(Math.abs(x - 1600) < 50); } // in the stream (the plank bridge is dry)
function m15SuriEdge(x) { return -1e9; }
function m15JTank(x, y, kind, o) {
    const d = kind === 'hago' ? { name: 'Type 95 Ha-Go', health: 90, speed: 3.2, damage: 18, reload: 1650, size: 23, armor: .85, model: 'hago', className: 'LIGHT' } : { name: 'Type 97 Chi-Ha', health: 140, speed: 2.3, damage: 26, reload: 2500, size: 28, armor: .74, model: 'chiha', className: 'MEDIUM' };
    const t = m2Tank(x, y, 'light', o); Object.assign(t, { name: d.name, health: d.health, maxHealth: d.health, speed: d.speed * .78, damage: d.damage, reload: d.reload, size: d.size, armor: d.armor, model: d.model, faction: 'japanese', className: d.className, bodyCol: kind === 'hago' ? '#6e6844' : '#6a6240', turretCol: kind === 'hago' ? '#7c7650' : '#7a7048' }); return t; }
function m15Fake(x, y, ang, dmg) { return { x: x, y: y, angle: ang, turretAngle: ang, size: 30, damage: dmg, team: 'enemy', faction: 'japanese', model: 'chiha', gunJammed: false, gunDisabledUntil: 0, componentBroken: {}, componentDamage: {} }; }
function m15Ally(x, y, name) { const d = tanks.american.medium; return { x: x, y: y, angle: -Math.PI / 2, turretAngle: -Math.PI / 2, health: Math.round(d.health * 1.6), maxHealth: Math.round(d.health * 1.6), speed: d.speed * .78 * ALLY_SPEED_MULT, damage: Math.round(d.damage * 1.3), reload: Math.round(d.reload * ALLY_RELOAD_MULT), size: d.size,
    armor: Math.min(.95, d.armor + ALLY_ARMOR_BONUS), name: 'M4A3 Sherman (USMC)', model: d.model, faction: 'american', className: d.className, lastShot: 0, trackTimer: 0, fireSmoke: 0, burning: false, componentDamage: { engine: 0, tracks: 0, turret: 0, gun: 0 },
    componentBroken: { engine: false, tracks: false, turret: false, gun: false }, componentFlash: { engine: 0, tracks: 0, turret: 0, gun: 0 }, followSide: Math.random() < .5 ? 1 : -1, team: 'friendly', respawnAt: 0, aiRole: 'escort', aiTarget: null, aiTargetUntil: 0, destroyed: false,
    abilityType: null, abilityCooldownUntil: 0, armorLockUntil: 0, radioText: '', radioUntil: 0, voiceReadyAt: Date.now() + 2000, radioName: name, lastRadioState: 'idle', lastRadioAt: 0, aiLastUpdateAt: Date.now(), m15base: d.speed * .78 * ALLY_SPEED_MULT }; }
function m15Setup() {
    const now = Date.now();
    M15.active = true; M15.failWhy = ''; M15.result = null;
    Object.assign(M15, { boxes: [], holes: [], mines: [], japs: [], marines: [], bullets: [], fx: [], phase: 0, loadT: 0, holdStart: 0, waveAt: 0, waves: 0, spawned: {}, won: false, lost: false, startAt: now, kills: { tank: 0, inf: 0 }, crushed: 0, hurtAt: 0, rescued: 0, toldNear: false });
    M2.active = true; M2.aa = []; M2.phase = 0; M2.alerted = true; M2.endHandled = false; SUP.mode = 'off'; SUP.strikes = []; M15.counter = []; M15.ambushAt = 0; M15.toldMid = false; campaignBunkers = []; campaignRepairStation = { x: 1440, y: 1740, radius: 60 }; controlPoints = [];
    obstacles = [];
    // the bamboo: solid wherever there is no trail or glade (merged into horizontal runs)
    const C = 30, open = {}; let rects = []; for (let y = 0; y < M15H; y += C) { let run = -1; const row = []; for (let x = 0; x <= M15W; x += C) { const solid = x < M15W && m15Open(x + C / 2, y + C / 2) < -15; if (solid && run < 0) run = x; if (!solid && run >= 0) { row.push(run + ':' + x); run = -1; } }
        row.forEach(function (k) { if (open[k]) open[k].h += C; else { const q = k.split(':'); open[k] = { x: +q[0], y: y, w: +q[1] - +q[0], h: C }; rects.push(open[k]); } }); Object.keys(open).forEach(function (k) { if (row.indexOf(k) < 0) delete open[k]; }); }
    rects.forEach(function (r) { addObstacle(r.x, r.y, r.w, r.h, 'm15Rock'); }); M15.solidN = rects.length;
    const sh = function (k, x, y, w, h) { const d = m15Shift(k); addObstacle(x + d[0], y + d[1], w, h, 'm15Rock'); };
    sh('shrine', 1135, 190, 130, 84); sh('hut', 400, 690, 84, 64); sh('pond', 1915, 712, 96, 56); sh('nw', 330, 236, 70, 40); sh('ne', 2060, 250, 64, 34); // the shrine hall, the hut, the pond, the bivouac, the dead truck
    [[1060, 1420], [1340, 1420]].forEach(function (t) { sh('aid', t[0] - 40, t[1] - 26, 80, 52); }); // aid-station tents
    addObstacle(1060, 1440, 80, 56, 'm15Rock'); addObstacle(2130, 1440, 70, 50, 'm15Rock'); // the charcoal kiln, the cutters' shed
    M15_WRECK.forEach(function (w) { addObstacle(w[0] - 24, w[1] - 14, 48, 28, 'm15Rock'); });
    navCache = { key: '', grids: {} };
    // the player: an M4A3 Sherman of the 1st Tank Battalion, C-12
    const d = tanks.american.medium;
    Object.assign(player, { x: 1600, y: 1680, angle: -Math.PI / 2, turretAngle: -Math.PI / 2, health: Math.round(d.health * 1.9), maxHealth: Math.round(d.health * 1.9), speed: d.speed, damage: Math.round(d.damage * 1.15), reload: Math.round(d.reload * .92), size: d.size, armor: Math.min(.9, d.armor + .05),
        name: 'M4A3 SHERMAN C-12 · USMC', model: d.model, faction: 'american', className: 'MEDIUM', abilityType: null, missileAbility: null, abilityCooldownUntil: 0, m15base: d.speed, m15riders: 0 });
    try { document.getElementById('tankName').textContent = player.name; } catch (e) {}
    allies = [m15Ally(1500, 1740, 'CHARLIE 7'), m15Ally(1700, 1740, 'CHARLIE 9'), m15Ally(1600, 1800, 'CHARLIE 11')]; allies.forEach(function (a) { a.m15riders = 0; });
    // the patrol: six Marines (two of them wounded) at the old shrine
    for (let i = 0; i < 6; i++) M15.marines.push({ x: M15_PATROL.x + (i % 3 - 1) * 26, y: M15_PATROL.y + Math.floor(i / 3) * 22, hp: i < 2 ? 2 : 4, dead: false, ang: Math.PI / 2, lastShot: 0, pinned: 0, walk: 0, wounded: i < 2, onboard: false, name: ['SGT RUIZ', 'PFC OKAFOR', 'CPL HAYES', 'PVT KOWALSKI', 'PFC NAKAMURA', 'PVT LITTLEBEAR'][i] });
    // Japanese armour waiting in the glades all the way up to the shrine
    enemies = [[1560, 1110, 'hago'], [1660, 1090, 'chiha'], [700, 1120, 'hago'], [2500, 1120, 'hago'], [1150, 760, 'chiha'], [2050, 760, 'chiha'], [560, 520, 'hago'], [2640, 520, 'hago'], [1600, 620, 'hago']].map(function (q) { return m15JTank(q[0], q[1], q[2], { angle: Math.PI / 2, turretAngle: Math.PI / 2, lastShot: now + 6000 }); });
    enemies.forEach(function (e, i) { e.guard = { post: i, hx: e.x, hy: e.y, leash: 140, free: false }; });
    m2ShowHud(false);
}
function m15Alive() { return M15.marines.filter(function (m) { return !m.dead; }); }
function m15ObjText() { if (!M15.active) return ''; const al = m15Alive().length;
    if (M15.phase === 0) return 'Fight your way north up the trails to the old shrine where the patrol is trapped — ' + al + '/6 alive';
    if (M15.phase === 1) return 'HOLD THE SHRINE while the patrol climbs aboard — ' + Math.round(M15.loadT * 100) + '% · stay close to them';
    if (M15.phase === 3) { const left = (M15.counter || []).filter(function (e) { return !e.destroyed; }).length; return 'A Japanese tank column is attacking the shrine — knock out all ' + (M15.counter || []).length + ' tanks before you leave (' + left + ' left)'; }
    return 'Bring the patrol back to the aid station (south) — ' + al + ' Marines aboard'; }
function m15Say(t) { try { showRadioText(t, true); } catch (e) {} }
function m15Fx(p) { M15.fx.push(p); if (M15.fx.length > 600) M15.fx.splice(0, 100); }
function m15Blast(x, y, big) { const n = big ? 1.5 : 1; m15Fx({ k: 'flash', x: x, y: y, life: 8, max: 8, r: 60 * n }); for (let i = 0; i < 18 * n; i++) { const a = Math.random() * 6.28, sp = 1 + Math.random() * 4 * n; m15Fx({ k: Math.random() < .55 ? 'sand' : 'fire', x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - .6, life: 20 + Math.random() * 20, max: 40, r: 3 + Math.random() * 6 }); } m15Fx({ k: 'scorch', x: x, y: y, life: 3000, max: 3000, r: 18 * n }); }
function m15Hurt(t, amt, fromX, fromY) { if (!t || t.destroyed) return; t.health -= amt; if (amt >= 2) try { createDamageNumber(t, Math.round(amt), 'enemy', Math.atan2(fromY - t.y, fromX - t.x)); } catch (e) {} if (t === player) M15.hurtAt = Date.now(); if (t.health <= 0) { t.health = 0; try { destroyTank(t); } catch (e) {} } }
function m15ShellHit(shell) { if (!M15.active) return false; for (let i = 0; i < M15.japs.length; i++) { const j = M15.japs[i]; if (j.dead || Date.now() < j.born) continue; if (Math.hypot(shell.x - j.x, shell.y - j.y) < 16) { m15KillJap(j, 'shot'); M15.japs.forEach(function (o) { if (!o.dead && Math.hypot(o.x - j.x, o.y - j.y) < 40) m15KillJap(o, 'shot'); }); try { createImpact(shell.x, shell.y); } catch (e) {} return true; } } return false; }
function m15KillJap(j, how) { if (j.dead) return; j.dead = true; j.deadAt = Date.now(); j.how = how; M15.kills.inf++; if (how === 'crush') M15.crushed++; for (let i = 0; i < 6; i++) { const a = Math.random() * 6.28; m15Fx({ k: 'blood', x: j.x, y: j.y, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, life: 18, max: 18, r: 2 }); } }
function m15HurtMarine(m, n) { if (m.dead || m.onboard) return; m.hp -= n; m.hurtAt = Date.now(); if (m.hp <= 0) { m.dead = true; m.deadAt = Date.now(); m15Say('CORPSMAN! ' + m.name + ' IS DOWN!'); } }
function m15Spawn(kind, x, y, guard) { const t = m15JTank(x, y, kind, { angle: Math.PI / 2, lastShot: Date.now() + 1500, aiSmart: 1 }); enemies.push(t); try { createMuzzleFlash(t); } catch (e) {} return t; }
function m15Banzai(n, x0, y0, spread) { const now = Date.now(); for (let i = 0; i < n; i++) M15.japs.push({ x: x0 + (Math.random() - .5) * spread, y: y0 + (Math.random() - .5) * 60, born: now + i * 260, ang: 0 }); }
function m15Fail(why, text) { if (M15.lost || M15.won) return; M15.lost = true; M15.failWhy = why; campaignMissionComplete = false; gameRunning = false; m15Say(text); setTimeout(function () { showCampaignResult(false); }, 1400); }
function updateMission15() {
    if (!M15.active || !player || player.destroyed || M15.won || M15.lost) return;
    const now = Date.now(), prep = now < campaignPrepUntil;
    [player].concat(allies).forEach(function (t) { if (!t || t.destroyed || !t.m15base) return; let f = 1; if (m15InPaddy(t.x, t.y)) f = .7; t.speed = t.m15base * f; t.m15soft = f < 1; });
    const friends = [player].concat(allies).filter(function (t) { return t && !t.destroyed; }), patrol = m15Alive();
    const dP = Math.hypot(player.x - M15_PATROL.x, player.y - M15_PATROL.y);
    // the story
    if (M15.phase === 0) {
        if (!M15.toldNear && player.y < 1420) { M15.toldNear = true; m15Say('PATROL TO CHARLIE: WE HEAR YOUR ENGINES! TANKS AT THE BRIDGE — AND MORE IN EVERY GLADE BETWEEN YOU AND US!'); }
        if (!M15.toldMid && player.y < 900) { M15.toldMid = true; m15Say('THEY\'RE DUG IN ON THE RIDGE GLADES EITHER SIDE OF THE TRAIL — WATCH YOUR FLANKS!'); }
        if (now - M15.startAt > 45000 && !M15.spawned.p1) { M15.spawned.p1 = true; m15Banzai(7, 1100, 1300, 160); m15Banzai(6, 2100, 1300, 160); }
        if (now - M15.startAt > 20000 && !M15.spawned.p0) { M15.spawned.p0 = true; m15Banzai(6, 1600, 1500, 200); }
        if (dP < 240) { M15.phase = 1; M15.holdStart = now; M15.waveAt = now + 4000; m15Say('WE\'RE AT THE SHRINE! HOLD HERE WHILE THEY CLIMB ON — WOUNDED FIRST!'); try { [392, 523, 659].forEach(function (f, i) { setTimeout(function () { playTone(f, f, .2, .07, 'triangle'); }, i * 140); }); } catch (e) {} }
    } else if (M15.phase === 1) {
        if (dP < 290) M15.loadT = Math.min(1, M15.loadT + 1 / (46 * 60)); else if (!M15.toldStay || now - M15.toldStay > 6000) { M15.toldStay = now; m15Say('CHARLIE ONE-TWO, COME BACK! WE CAN\'T GET ABOARD IF YOU\'RE NOT HERE!'); }
        if (now > M15.waveAt) { M15.waves++; M15.waveAt = now + 10000; const w = M15.waves, sp = [[1600, 70], [560, 560], [2640, 560], [1100, 420], [2100, 420]][Math.floor(Math.random() * 5)]; m15Banzai(6 + w, sp[0], sp[1], 160); if (w === 1) m15Say('BANZAI! THEY\'RE COMING THROUGH THE BAMBOO!'); if (w === 2) { m15Spawn('hago', 560, 560); m15Spawn('hago', 2640, 560); m15Say('TWO TANKS — EAST AND WEST!'); } if (w === 3) { m15Spawn('chiha', 1600, 40); m15Say('CHI-HA COMING DOWN THE NORTH TRAIL!'); } if (w === 4) { m15Spawn('hago', 1150, 800); m15Spawn('hago', 2050, 800); m15Say('MORE TANKS FROM THE RIDGE GLADES — BEHIND YOU!'); } }
        // marines climb aboard one by one as loading progresses, onto whichever tank is closest
        const want = Math.floor(M15.loadT * patrol.length + .001), have = patrol.filter(function (m) { return m.onboard; }).length;
        if (want > have) { const m = patrol.filter(function (q) { return !q.onboard; })[0]; if (m) { let tk = player, bd = 1e9; friends.forEach(function (t) { const d = Math.hypot(t.x - m.x, t.y - m.y), cap = t === player ? 3 : 2; if ((t.m15riders || 0) < cap && d < bd) { bd = d; tk = t; } }); m.onboard = true; m.tank = tk; tk.m15riders = (tk.m15riders || 0) + 1; hitTexts.push({ x: m.x, y: m.y - 16, text: m.name + ' ABOARD', life: 50, maxLife: 50, color: '#9fe07a', size: 13, stroke: true, vy: .6 }); } }
        if (M15.loadT >= 1 || (patrol.length && patrol.every(function (m) { return m.onboard; }))) { M15.phase = 3; patrol.forEach(function (m) { if (!m.onboard) { m.onboard = true; m.tank = player; player.m15riders = (player.m15riders || 0) + 1; } }); M15.rescued = patrol.length;
            M15.counter = [m15Spawn('chiha', 1600, 40), m15Spawn('hago', 560, 560), m15Spawn('hago', 2640, 560), m15Spawn('chiha', 1000, 380)]; M15.counter.forEach(function (e) { e.m15hunt = true; }); m15Banzai(8, 1600, 90, 180);
            m15Say('EVERYONE\'S ABOARD — BUT A TANK COLUMN IS COMING DOWN ON THE SHRINE! KNOCK THEM OUT OR THEY\'LL CHASE US ALL THE WAY HOME!'); }
    } else if (M15.phase === 3) {
        if (M15.counter.every(function (e) { return e.destroyed; })) { M15.phase = 2; m15Say('COLUMN DESTROYED! BACK TO THE AID STATION — GO, GO, GO!'); m15Spawn('hago', 1100, 1520); m15Spawn('hago', 2100, 1520); m15Spawn('chiha', 1600, 1180); m15Banzai(8, 1600, 1000, 160); M15.ambushAt = now + 25000; }
    } else if (M15.phase === 2) {
        if (M15.ambushAt && now > M15.ambushAt) { M15.ambushAt = 0; m15Banzai(9, 1300, 1650, 160); m15Spawn('hago', 700, 1180); m15Say('AMBUSH IN THE BAMBOO — KEEP MOVING!'); }
        if (Math.hypot(player.x - M15_GOAL.x, player.y - M15_GOAL.y) < M15_GOAL.r + 20) { M15.won = true; campaignMissionComplete = true; gameRunning = false; addXP(400, 'victory'); progression.campaignM15Done = true; saveProgression();
            M15.kills.tank = enemies.filter(function (e) { return e.destroyed && e.faction === 'japanese'; }).length;
            M15.result = { ms: now - M15.startAt, hp: Math.round(player.health / player.maxHealth * 100), kills: M15.kills, crushed: M15.crushed, allies: allies.filter(function (a) { return !a.destroyed; }).length, rescued: m15Alive().length };
            m15Say('CHARLIE ONE-TWO TO BLUE 6: THE PATROL IS HOME. ' + M15.result.rescued + ' MARINES, ALL ACCOUNTED FOR.'); try { document.getElementById('battleMessage').textContent = 'MISSION COMPLETE — THE PATROL IS HOME'; } catch (e) {}
            setTimeout(function () { m15CutMode(true); m15PlayEnding(function () { showCampaignResult(true); }); }, 1200); return; }
    }
    // riders die if their tank is knocked out
    M15.marines.forEach(function (m) { if (m.onboard && !m.dead && m.tank && m.tank.destroyed) { m.dead = true; m.deadAt = now; m.onboard = false; m.x = m.tank.x; m.y = m.tank.y; } if (m.onboard && !m.dead && m.tank) { m.x = m.tank.x; m.y = m.tank.y; } });
    if (!m15Alive().length) { m15Fail('patrol', 'WE\'VE LOST THE WHOLE PATROL...'); return; }
    // the patrol on the ground: crouched in the ruins, firing at whatever comes
    M15.marines.forEach(function (m) { if (m.dead || m.onboard) return; let tg = null, bd = 380; M15.japs.forEach(function (j) { if (!j.dead && now >= j.born) { const d = Math.hypot(j.x - m.x, j.y - m.y); if (d < bd) { bd = d; tg = j; } } }); if (tg) { m.ang = Math.atan2(tg.y - m.y, tg.x - m.x); if (now - m.lastShot > 600 + Math.random() * 500) { m.lastShot = now; m15Fx({ k: 'tracer', x: m.x, y: m.y, vx: Math.cos(m.ang) * 16, vy: Math.sin(m.ang) * 16, life: 18, max: 18 }); if (Math.random() < .3) m15KillJap(tg, 'shot'); } } });
    // Japanese infantry: rush the patrol (or the nearest tank), grenades and bayonets
    M15.japs.forEach(function (j) { if (j.dead || now < j.born) return; let tg = null, bd = 1e9; patrol.forEach(function (m) { if (m.onboard) return; const d = Math.hypot(m.x - j.x, m.y - j.y); if (d < bd) { bd = d; tg = m; } }); friends.forEach(function (t) { const d = Math.hypot(t.x - j.x, t.y - j.y) + 60; if (d < bd) { bd = d; tg = t; } }); if (!tg) return;
        const a = Math.atan2(tg.y - j.y, tg.x - j.x); j.ang = a; j.x += Math.cos(a) * 1.7; j.y += Math.sin(a) * 1.7; j.walk = (j.walk || 0) + 1.7;
        friends.forEach(function (t) { if (j.dead) return; const d = Math.hypot(t.x - j.x, t.y - j.y), mv = t._v ? Math.hypot(t._v.x, t._v.y) : 0; if (d < t.size * .8 && mv > .3) { m15KillJap(j, 'crush'); if (t === player) hitTexts.push({ x: j.x, y: j.y - 14, text: 'CRUSHED', life: 40, maxLife: 40, color: '#e0d0a0', size: 13, stroke: true, vy: .6 }); } else if (d < t.size + 8) { j.dead = true; j.deadAt = now; j.how = 'blew'; m15Blast(j.x, j.y, false); try { addShake(t === player ? 5 : 2); } catch (e) {} m15Hurt(t, 8, j.x, j.y); } });
        if (!j.dead && tg && !tg.size && Math.hypot(tg.x - j.x, tg.y - j.y) < 12) { m15HurtMarine(tg, 1); m15KillJap(j, 'shot'); } });
    M15.japs = M15.japs.filter(function (j) { return !j.dead || now - j.deadAt < 90000; });
    for (let i = M15.fx.length - 1; i >= 0; i--) { const p = M15.fx[i]; p.life--; if (p.life <= 0) { M15.fx.splice(i, 1); continue; } if (p.vx !== undefined) { p.x += p.vx; p.y += p.vy; if (p.k !== 'tracer') { p.vx *= .93; p.vy *= .93; } } }
    updateCampaignObjectiveUI();
}
function m15Stars() { const R = M15.result || {}; return 1 + (R.hp >= 50 ? 1 : 0) + (R.rescued >= 6 ? 1 : 0); }
function m15Cleanup() { M15.active = false; }
function m15CutMode(on) { M8.cut = !!on; applyPointControlCanvasSize(); cameraX = 0; cameraY = 0; canvas.style.transform = 'translate3d(0px,0px,0px)'; }
(function () {
    const _ap = applyPointControlCanvasSize; applyPointControlCanvasSize = function () { const big = selectedGameMode === 'campaign' && campaignMission === 15; SKIRMISH_WORLD_WIDTH = big ? M15W : 2400; SKIRMISH_WORLD_HEIGHT = big ? M15H : 1500; const r = _ap.apply(this, arguments); const on = big && canvas.classList.contains('skirmishExpanded'); canvas.style.width = on ? M15W + 'px' : ''; canvas.style.height = on ? M15H + 'px' : ''; if (on) updateCamera(); return r; };
    m8LargeWorld = function () { return selectedGameMode === 'campaign' && campaignMission === 15; };
    m8IsLarge = function () { return selectedGameMode === 'campaign' && campaignMission === 15 && !M8.cut && canvas.width === SKIRMISH_WORLD_WIDTH; };
    const _cb = createBattle; createBattle = function () { const r = _cb.apply(this, arguments); if (selectedGameMode === 'campaign' && campaignMission === 15) { m15Setup(); updateCampaignObjectiveUI(); } return r; };
    const _na = navActive; navActive = function () { if (selectedGameMode === 'campaign' && campaignMission === 15) return true; return _na.apply(this, arguments); };
    const _uc = updateCampaignMission; updateCampaignMission = function () { if (selectedGameMode === 'campaign' && campaignMission === 15) { if (!player || player.destroyed) return; updateMission15(); return; } return _uc.apply(this, arguments); };
    const _dm = drawMap; drawMap = function () { if (selectedMap === 'campaignIwo') { m15DrawMap(); return; } return _dm.apply(this, arguments); };
    const _ov = m2DrawOverlay; m2DrawOverlay = function () { _ov.apply(this, arguments); if (M15.active && selectedGameMode === 'campaign' && campaignMission === 15) m15DrawOverlay(); };
    const _bh = checkCampaignBunkerHit; checkCampaignBunkerHit = function (shell) { if (campaignMission === 15) return m15ShellHit(shell); return _bh.apply(this, arguments); };
    const _sk = m2SupportKey; m2SupportKey = function () { if (campaignMission === 15 && M15.active) return; return _sk.apply(this, arguments); };
    const _ou = updateCampaignObjectiveUI; updateCampaignObjectiveUI = function () { if (selectedGameMode === 'campaign' && campaignMission === 15) { const box = document.getElementById('campaignObjectiveBox'), text = document.getElementById('campaignObjectiveText'); if (box && text) { box.style.display = M15.active ? 'block' : 'none'; const vp = document.getElementById('canvasViewport'); box.style.left = ((vp ? vp.offsetLeft : 0) + 22) + 'px'; box.style.right = 'auto'; box.style.top = ((vp ? vp.offsetTop : 0) + 22) + 'px'; text.textContent = m15ObjText(); } return; } { const box = document.getElementById('campaignObjectiveBox'); if (box && box.style.left) { box.style.left = ''; box.style.right = ''; box.style.top = ''; } } return _ou.apply(this, arguments); };
    const _sc = startCampaignMission; startCampaignMission = function () { if (campaignMission === 15) m15CutMode(false); const r = _sc.apply(this, arguments); if (campaignMission === 15) { showRadioText('CHARLIE ONE-TWO, THIS IS BLUE 6. THE PATROL IS AT THE OLD SHRINE, FAR NORTH THROUGH THE BAMBOO — GO GET THEM! (R TO REPAIR)', true); campaignPrepUntil = Date.now() + 3500; } return r; };
    const _dt = drawTank; drawTank = function (t) { _dt.apply(this, arguments); if (t && !t.destroyed && campaignMission === 15 && M15.active) m15DrawMarks(t); };
})();
