/* =====================================================
   CAMPAIGN MISSION 8 - SCHWERER GUSTAV (boss, large map 2400x1500)
   Phase 1: kill the two flak wagons on the armoured escort train circling the yard.
   Phase 2: the gun shells you from the tunnel - dodge the shadows, destroy both spotter towers.
   Phase 3: Gustav rolls out. Fire cycle: RELOAD (hit the shell on the hoist) -> ELEVATE (hit the
            exposed elevation gears) -> FIRE (shockwave; one more hit on the beachhead). 3 beach hits = fail.
===================================================== */
const M8W = 2400, M8H = 1500;
const M8 = { active: false, phase: 0, art: null, artKey: '', train: null, towers: [], gears: [], shots: [], craters: [], gus: null, won: false, wonAt: 0, endHandled: false, failWhy: '', nextShot: 0, phaseAt: 0, msgs: {}, waves: 0 };
const M8_LOOP = { cx: 1200, cy: 1030, rx: 950, ry: 300 };
const M8_GY = 470, M8_SHADOW = 3300, M8_SHOT_EVERY = 11000, M8_BEACH_MAX = 3;
const M8_CYCLE = { reload: 8500, elevate: 5200, fire: 1600 };
function m8LargeWorld() { return selectedGameMode === 'campaign' && campaignMission === 8; }
function m8IsLarge() { return typeof M8 !== 'undefined' && !M8.cut && selectedGameMode === 'campaign' && campaignMission === 8 && canvas.width === M8W; }
function m8LoopPt(s) { const a = s / 1000; return { x: M8_LOOP.cx + Math.cos(a) * M8_LOOP.rx, y: M8_LOOP.cy + Math.sin(a) * M8_LOOP.ry, ang: Math.atan2(Math.cos(a) * M8_LOOP.ry, -Math.sin(a) * M8_LOOP.rx) }; }
function m8CarPos(i) { return m8LoopPt(M8.train.s - i * 128); }
const M8_ROCKS = [[300, 640, 90, 60], [560, 420, 70, 50], [840, 300, 80, 46], [1560, 300, 80, 46], [1850, 400, 70, 50], [2090, 680, 90, 60], [140, 1100, 80, 60], [2200, 1120, 90, 60], [700, 1420, 80, 40], [1640, 1420, 90, 40], [980, 1180, 60, 44], [1420, 1180, 60, 44]];
const M8_SANDS = [[700, 650, 160, 24], [1540, 650, 160, 24], [460, 980, 24, 150], [1916, 980, 24, 150], [1060, 1360, 120, 22], [1220, 1360, 120, 22]];
const M8_HOUSES = [[520, 1180, 130, 90], [1760, 1170, 140, 90]];
const M8_WOODS = [[90, 330, 150, 120], [2160, 300, 160, 130], [100, 1330, 170, 120], [2130, 1340, 180, 110]];
function createMission8Map() {
    obstacles = [];
    addObstacle(-40, -40, M8W + 80, 270, 'm8Rock');
    M8_ROCKS.forEach(function (b) { addObstacle(b[0], b[1], b[2], b[3], 'm8Rock'); });
    M8_SANDS.forEach(function (b) { addObstacle(b[0], b[1], b[2], b[3], 'm8Sand'); });
    M8_HOUSES.forEach(function (b) { addObstacle(b[0], b[1], b[2], b[3], 'm8House'); });
    M8_WOODS.forEach(function (b) { addObstacle(b[0], b[1], b[2], b[3], 'm8Wood'); });
    M8.towers.forEach(function (t) { if (!t.destroyed) addObstacle(t.x - 34, t.y - 34, 68, 68, 'm8Tower'); });
    if (M8.phase >= 3 && M8.gus && M8.gus.out >= 1) addObstacle(1108, M8_GY - 200, 184, 400, 'm8Gustav');
    navCache = { key: '', grids: {} };
}
function createMission8() {
    M2.active = true; M2.aa = []; M2.phase = 0; M2.alerted = true; M2.endHandled = false;
    SUP.mode = 'off'; SUP.type = 'air'; SUP.cd = 0; SUP.strikes = []; SUP.CD = 30000;
    const now = Date.now();
    Object.assign(M8, { active: true, phase: 1, shots: [], craters: [], won: false, wonAt: 0, endHandled: false, failWhy: '', nextShot: 0, phaseAt: now, msgs: {}, waves: 0,
        gus: { y: -300, out: 0, hp: 100, state: 'hidden', stateAt: 0, el: 0, hoist: 0, beach: 0, stun: 0, fireAt: 0, ring: 0, droop: 0, shellLive: false, cycles: 0 } });
    M8.train = { s: 2600, v: 82, alive: true, stopped: false, lastT: 0, cars: [
        { k: 'loco', armoured: true, hp: 1 }, { k: 'flak', hp: 380, maxHp: 380, name: 'FLAK WAGON 1', last: 0, burst: 0, ang: 0 }, { k: 'box', armoured: true, hp: 1 },
        { k: 'flak', hp: 380, maxHp: 380, name: 'FLAK WAGON 2', last: 0, burst: 0, ang: 0 }, { k: 'van', armoured: true, hp: 1 }] };
    M8.towers = [{ x: 330, y: 470, hp: 360, maxHp: 360, destroyed: false, name: 'WEST SPOTTER' }, { x: 2070, y: 490, hp: 360, maxHp: 360, destroyed: false, name: 'EAST SPOTTER' }];
    M8.gears = [{ dx: -104, hp: 300, maxHp: 300, destroyed: false, name: 'LEFT ELEVATION GEAR' }, { dx: 104, hp: 300, maxHp: 300, destroyed: false, name: 'RIGHT ELEVATION GEAR' }];
    enemies = []; allies = [];
    createMission8Map();
    player.x = 1200; player.y = 1420; player.angle = -Math.PI / 2; player.turretAngle = -Math.PI / 2; player.abilityType = null; player.componentDamage = null; player.componentBroken = null;
    m8Spawn(420, 1300, 'light');
    m2ShowHud(true); m8ShowHud(true);
    setTimeout(function () { if (M8.active) showRadioText('THE ESCORT TRAIN IS ARMOURED — ONLY THE TWO FLAK WAGONS WILL BREAK!', true); }, 1500);
}
function m8Spawn(x, y, cls) { const t = m2Tank(x, y, cls, { lastShot: Date.now() + 2400, aiSmart: 1 }); t.m8 = { born: Date.now() }; enemies.push(t); return t; }
function m8Alive() { return enemies.filter(function (e) { return !e.destroyed; }).length; }
function m8Enemy(e, now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - (e.aiLastUpdateAt || now)) / 1000)); e.aiLastUpdateAt = now;
    if (M8.won) return;
    const S = aiS(e), nt = m4NearestTarget(e), target = nt.t;
    if (target && nt.d > 320) m4Move(e, target.x, target.y, .75, 0, dt);
    e.x = Math.max(e.size + 6, Math.min(M8W - e.size - 6, e.x)); e.y = Math.max(250 + e.size, Math.min(M8H - e.size - 6, e.y));
    separateTankFromOthers(e, [player].concat(allies).concat(enemies));
    if (target && !(e.turretDisabledUntil && Date.now() < e.turretDisabledUntil) && nt.d < 700) m4Aim(e, target, dt, [0.16, 0.10, 0.07, 0.05][S], true, now);
}
function m8GearPos(g) { return { x: 1200 + g.dx, y: M8.gus.y + 70 }; }
function m8HoistPos() { const G = M8.gus; return { x: 1200, y: G.y - 196 + G.hoist * 44 }; }
function m8Text(x, y, txt, col, size) { hitTexts.push({ x: x, y: y, text: txt, life: 60, maxLife: 60, color: col || '#ffd24a', size: size || 13, stroke: true, vy: .6 }); }
function m8Hit(shell) {
    if (!M8.active) return false;
    const dmg = shell.damage || (player && player.damage) || 40, G = M8.gus;
    if (M8.train && M8.train.alive) for (let i = 0; i < M8.train.cars.length; i++) { const c = M8.train.cars[i], p = m8CarPos(i); if (Math.hypot(shell.x - p.x, shell.y - p.y) < 34) {
        createImpact(shell.x, shell.y); createHitSparks(shell.x, shell.y);
        if (c.armoured || c.hp <= 0) { if (Math.random() < .4) m8Text(p.x, p.y - 26, 'ARMOURED', '#c9c3a6', 12); return true; }
        m8Damage(c, dmg, p.x, p.y); return true; } }
    for (let i = 0; i < M8.towers.length; i++) { const t = M8.towers[i]; if (!t.destroyed && Math.hypot(shell.x - t.x, shell.y - t.y) < 38) { createImpact(shell.x, shell.y); createHitSparks(shell.x, shell.y); m8Damage(t, dmg, t.x, t.y); return true; } }
    if (M8.phase >= 3 && G.out >= 1 && !M8.won) {
        if (G.state === 'reload' && G.shellLive) { const h = m8HoistPos(); if (Math.hypot(shell.x - h.x, shell.y - h.y) < 30) { m8Detonate(h.x, h.y); return true; } }
        for (let i = 0; i < M8.gears.length; i++) { const g = M8.gears[i], p = m8GearPos(g); if (g.destroyed || Math.hypot(shell.x - p.x, shell.y - p.y) > 36) continue; createImpact(shell.x, shell.y); createHitSparks(shell.x, shell.y);
            if (G.state !== 'elevate') { m8Text(p.x, p.y - 30, 'COVERED — WAIT FOR IT TO ELEVATE', '#ffb070', 12); return true; }
            m8Damage(g, dmg, p.x, p.y); if (g.destroyed) m8GusDamage(25, 'GEAR WRECKED'); return true; }
        if (shell.x > 1108 && shell.x < 1292 && shell.y > G.y - 210 && shell.y < G.y + 200) { createImpact(shell.x, shell.y); createHitSparks(shell.x, shell.y); m8GusDamage(1); if (Math.random() < .35) m8Text(shell.x, shell.y - 20, G.state === 'reload' ? 'HIT THE SHELL ON THE HOIST!' : G.state === 'elevate' ? 'HIT THE GEARS!' : 'TOO THICK', '#ffb070', 12); return true; }
    }
    return false;
}
function m8Splash(x, y, r, dmg) {
    if (!M8.active) return;
    if (M8.train && M8.train.alive) M8.train.cars.forEach(function (c, i) { if (!c.armoured && c.hp > 0) { const p = m8CarPos(i), d = Math.hypot(p.x - x, p.y - y); if (d < r + 34) m8Damage(c, Math.round(dmg * .7), p.x, p.y); } });
    M8.towers.forEach(function (t) { if (!t.destroyed && Math.hypot(t.x - x, t.y - y) < r + 34) m8Damage(t, Math.round(dmg * .7), t.x, t.y); });
    const G = M8.gus; if (M8.phase >= 3 && G.out >= 1 && !M8.won) {
        if (G.state === 'reload' && G.shellLive) { const h = m8HoistPos(); if (Math.hypot(h.x - x, h.y - y) < r) { m8Detonate(h.x, h.y); return; } }
        if (Math.abs(x - 1200) < 140 && y > G.y - 230 && y < G.y + 230) m8GusDamage(3);
        if (G.state === 'elevate') M8.gears.forEach(function (g) { const p = m8GearPos(g); if (!g.destroyed && Math.hypot(p.x - x, p.y - y) < r + 20) { m8Damage(g, Math.round(dmg * .6), p.x, p.y); if (g.destroyed) m8GusDamage(25, 'GEAR WRECKED'); } });
    }
}
function m8Damage(o, d, x, y) {
    if (o.destroyed || o.hp <= 0) return; o.hp = Math.max(0, o.hp - d);
    m8Text(x, y - 30, '-' + Math.round(d), '#ffd24a', 14);
    if (o.hp <= 0) {
        o.destroyed = true; createExplosion(x, y, 1.8); createShockwave(x, y, 80); createDebris(x, y, 30, 1.6); addShake(14); try { playExplosionSound(1.3); } catch (e) {}
        hitTexts.push({ x: x, y: y - 50, text: (o.name || 'TARGET') + ' DESTROYED', life: 100, maxLife: 100, color: '#ffd24a', size: 20, stroke: true, vy: .5 }); addXP(140, 'target');
        M8.craters.push({ x: x, y: y, r: 40, t: Date.now() });
        if (M8.towers.indexOf(o) >= 0) { createMission8Map(); const left = M8.towers.filter(function (t) { return !t.destroyed; }).length; if (left) showRadioText(o.name + ' DOWN — ONE SPOTTER LEFT. ITS AIM IS GETTING WORSE!', true); }
    }
}
function m8GusDamage(d, why) {
    const G = M8.gus; if (M8.won) return; G.hp = Math.max(0, G.hp - d);
    if (why) { hitTexts.push({ x: 1200, y: G.y - 260, text: why + '  -' + d + '%', life: 110, maxLife: 110, color: '#ff7050', size: 22, stroke: true, vy: .4 }); addShake(18); }
    if (G.hp <= 0) m8Win();
}
function m8Detonate(x, y) {
    const G = M8.gus, now = Date.now(); G.shellLive = false; G.state = 'reload'; G.stateAt = now + 2200; G.stun = now + 2200; G.hoist = 0;
    createExplosion(x, y, 3.0); createExplosion(x - 40, y + 30, 2.0); createExplosion(x + 40, y + 20, 2.0); createShockwave(x, y, 220); createDebris(x, y, 60, 2.2); addShake(34); try { playExplosionSound(2); } catch (e) {}
    M8.craters.push({ x: x, y: y + 10, r: 70, t: now });
    const d = Math.hypot(player.x - x, player.y - y); if (d < 220) m8DamagePlayer(Math.round(60 * (1 - d / 220)), x, y);
    showRadioText('DIRECT HIT ON THE SHELL HOIST! SEVEN TONNES WENT UP IN ITS FACE!', true);
    m8GusDamage(22, 'SHELL DETONATED');
}
function m8Win() {
    const now = Date.now(); if (M8.won) return; M8.won = true; M8.wonAt = now; showRadioText('GUSTAV IS FINISHED — THE BARREL IS COMING DOWN!', true); addShake(30);
    for (let i = 0; i < 9; i++) setTimeout(function () { try { createExplosion(1120 + Math.random() * 160, M8.gus.y - 200 + Math.random() * 520, 2.4); playExplosionSound(1.4); addShake(18); } catch (e) {} }, 300 + i * 360);
    enemies.forEach(function (en) { if (!en.destroyed) { en.health = 0; destroyTank(en); } });
}
function m8Say(key, txt) { if (M8.msgs[key]) return; M8.msgs[key] = true; showRadioText(txt, true); }
function m8DamagePlayer(d, x, y) {
    if (!player || player.destroyed || d <= 0) return; player.health -= d; addShake(8 + d * .1);
    hitTexts.push({ x: player.x, y: player.y - 34, text: '-' + Math.round(d), life: 60, maxLife: 60, color: '#ff5a40', size: 18, stroke: true, vy: .8 });
    if (player.health <= 0) { player.health = 0; try { destroyTank(player); } catch (e) {} }
}
function m8ShellAt(now, tx, ty, r) { M8.shots.push({ x: tx, y: ty, t0: now, at: now + M8_SHADOW, r: r || 130, done: false }); try { playDistantArtillery(); playTone(60, 30, 1.6, .1, 'sawtooth'); } catch (e) {} addShake(6); }
function updateMission8() {
    if (!M8.active || !player || player.destroyed) return;
    const now = Date.now(); m2UpdateStrikes(now);
    const tr = M8.train, G = M8.gus;
    // ---- escort train
    if (tr.alive) {
        const dt = Math.min(.05, (now - (tr.lastT || now)) / 1000); tr.lastT = now; if (!tr.stopped) tr.s += (tr.v / 625) * 1000 * dt;
        tr.cars.forEach(function (c, i) { const p = m8CarPos(i);
            if (!tr.stopped && Math.hypot(player.x - p.x, player.y - p.y) < 36 + player.size * .5) { const a = Math.atan2(player.y - p.y, player.x - p.x); player.x = p.x + Math.cos(a) * (38 + player.size * .5); player.y = p.y + Math.sin(a) * (38 + player.size * .5); m8DamagePlayer(1, p.x, p.y); m8Say('crush', 'GET OFF THE TRACKS!'); }
            if (c.k === 'flak' && c.hp > 0) { const d = Math.hypot(player.x - p.x, player.y - p.y), want = Math.atan2(player.y - p.y, player.x - p.x); c.ang = c.ang + Math.atan2(Math.sin(want - c.ang), Math.cos(want - c.ang)) * .08;
                if (d < 620 && now - c.last > (c.burst > 0 ? 180 : 2300)) { c.last = now; c.burst = c.burst > 0 ? c.burst - 1 : 4; const ps = { x: p.x, y: p.y, turretAngle: c.ang + (Math.random() - .5) * .1, size: 18, damage: 7, name: c.name }; createShell(ps, true); try { createMuzzleFlash(ps); } catch (e) {} } } });
        if (tr.cars.every(function (c) { return c.armoured || c.hp <= 0; })) { tr.alive = false; tr.stopped = true; }
    }
    if (M8.phase === 1 && now - M8.phaseAt > 22000 && !M8.msgs.w1) { M8.msgs.w1 = 1; m8Spawn(2250, 1250, 'medium'); }
    if (M8.phase === 1 && !tr.alive) {
        M8.phase = 2; M8.phaseAt = now; M8.nextShot = now + 3000;
        showRadioText('FLAK WAGONS DOWN! ...THE MOUNTAIN IS FIRING AT YOU — TWO SPOTTERS ARE GUIDING IT. KNOCK THEM OUT!', true);
        m8Spawn(300, 900, 'medium'); m8Spawn(2100, 900, 'light');
    }
    // ---- phase 2: shelling from the tunnel, guided by the spotters
    if (M8.phase === 2) {
        const left = M8.towers.filter(function (t) { return !t.destroyed; }).length;
        if (now > M8.nextShot) { M8.nextShot = now + M8_SHOT_EVERY; const err = left >= 2 ? 30 : 170, lead = 60; m8ShellAt(now, player.x + Math.cos(player.angle || 0) * lead + (Math.random() - .5) * err, player.y + Math.sin(player.angle || 0) * lead + (Math.random() - .5) * err, 150); m8Say('shadow1', 'SHELL INBOUND — GET OUT OF THE SHADOW!'); }
        if (!left) {
            M8.phase = 3; M8.phaseAt = now; G.state = 'emerge'; G.stateAt = now;
            showRadioText('SPOTTERS DOWN. ...SOMETHING IS COMING OUT OF THAT TUNNEL!', true); try { playTone(40, 50, 6, .14, 'sawtooth'); } catch (e) {}
            if (m8Alive() < 3) m8Spawn(200, 1200, 'medium');
        }
    }
    // ---- phase 3: the gun itself
    if (M8.phase === 3 && !M8.won) {
        if (G.state === 'emerge') { G.out = Math.min(1, (now - M8.phaseAt) / 7000); G.y = cs2L(-300, M8_GY, cs2E(G.out)); if (Math.random() < .3) addShake(3);
            if (G.out >= 1) { createMission8Map(); G.state = 'reload'; G.stateAt = now; G.shellLive = true; G.hoist = 0; showRadioText('SCHWERER GUSTAV! WHILE IT RELOADS, HIT THE SHELL ON THE HOIST AT THE BACK. WHEN IT ELEVATES, HIT THE GEARS!', true); } }
        else {
            const el = now - G.stateAt, gearsOk = M8.gears.some(function (g) { return !g.destroyed; });
            if (G.state === 'reload') { G.el = Math.max(0, G.el - .02); if (now > G.stun) { if (!G.shellLive && el > 0) { G.shellLive = true; G.hoist = 0; } G.hoist = Math.min(1, Math.max(0, el / M8_CYCLE.reload)); }
                if (el > M8_CYCLE.reload && G.shellLive) { G.shellLive = false; G.cycles++; if (gearsOk) { G.state = 'elevate'; G.stateAt = now; showRadioText('IT\'S ELEVATING — THE GEARS ARE EXPOSED!', true); try { playTone(70, 110, 4, .06, 'square'); } catch (e) {} } else { G.state = 'reload'; G.stateAt = now; m8Say('jam', 'BOTH GEARS GONE — IT CAN\'T AIM! FINISH IT AT THE HOIST!'); }
                    if (G.cycles % 2 === 0 && m8Alive() < 3) m8Spawn(G.cycles % 4 ? 2250 : 150, 1200, 'medium'); } }
            else if (G.state === 'elevate') { G.el = Math.min(1, el / M8_CYCLE.elevate); if (!gearsOk) { G.state = 'reload'; G.stateAt = now; m8Say('jam', 'BOTH GEARS GONE — IT CAN\'T AIM! FINISH IT AT THE HOIST!'); }
                else if (el > M8_CYCLE.elevate) { G.state = 'fire'; G.stateAt = now; G.fireAt = now; G.beach++; addShake(40); try { playExplosionSound(2.2); playTone(45, 20, 2, .16, 'sawtooth'); } catch (e) {}
                    const d = Math.hypot(player.x - 1200, player.y - G.y); if (d < 520) { m8DamagePlayer(Math.round(55 * (1 - d / 520)), 1200, G.y); const a = Math.atan2(player.y - G.y, player.x - 1200); for (let k = 0; k < 14; k++) { const nx = player.x + Math.cos(a) * 6, ny = player.y + Math.sin(a) * 6; if (!tankHitsObstacle(player, nx, ny)) { player.x = nx; player.y = ny; } } }
                    enemies.forEach(function (en) { if (!en.destroyed && Math.hypot(en.x - 1200, en.y - G.y) < 260) { en.health = 0; destroyTank(en); } });
                    showRadioText(G.beach >= M8_BEACH_MAX ? 'THE BEACHHEAD IS HIT AGAIN...' : 'IT FIRED! THE BEACH IS HIT — ' + G.beach + ' OF ' + M8_BEACH_MAX + '. STOP THE NEXT ONE!', true); } }
            else if (G.state === 'fire') { if (el > M8_CYCLE.fire) { G.state = 'reload'; G.stateAt = now; } }
            if (G.beach >= M8_BEACH_MAX && !M8.endHandled) { M8.endHandled = true; M8.failWhy = 'beach'; document.getElementById('battleMessage').textContent = '💥 GUSTAV DESTROYED THE BEACHHEAD'; setTimeout(function () { gameRunning = false; showCampaignResult(false); }, 1600); }
        }
    }
    if (M8.won) { G.droop = Math.min(1, (now - M8.wonAt) / 2400); G.el = Math.max(0, G.el - .02); }
    // ---- shells land
    M8.shots.forEach(function (s) { if (s.done || now < s.at) return; s.done = true;
        createExplosion(s.x, s.y, 3.2); createShockwave(s.x, s.y, s.r * 1.4); createDebris(s.x, s.y, 50, 2.4); addShake(26); try { playExplosionSound(2); } catch (e) {}
        const d = Math.hypot(player.x - s.x, player.y - s.y); if (d < s.r) m8DamagePlayer(Math.round(130 * (1 - d / s.r) + 20), s.x, s.y);
        enemies.forEach(function (en) { if (!en.destroyed && Math.hypot(en.x - s.x, en.y - s.y) < s.r * .8) { en.health = 0; destroyTank(en); } });
        M8.craters.push({ x: s.x, y: s.y, r: s.r * .5, t: now }); });
    M8.shots = M8.shots.filter(function (s) { return !s.done || now - s.at < 1500; });
    if (M8.won && now - M8.wonAt > 4800 && !M8.endHandled) {
        M8.endHandled = true; campaignMissionComplete = true; gameRunning = false; addXP(800, 'victory'); progression.campaignM8Done = true; saveProgression();
        document.getElementById('battleMessage').textContent = 'MISSION COMPLETE — GUSTAV SILENCED'; showRadioText('MISSION 08 COMPLETE!', true); showCampaignResult(true);
    }
    m2UpdateHud(now); m8UpdateHud(now); updateCampaignObjectiveUI();
}
function m8ObjectiveText() {
    const G = M8.gus; if (M8.won) return 'Gustav is silenced';
    if (M8.phase === 1) { const n = M8.train.cars.filter(function (c) { return c.k === 'flak' && c.hp > 0; }).length; return 'Destroy the 2 flak wagons on the circling escort train (' + (2 - n) + '/2). The rest of it is armoured.'; }
    if (M8.phase === 2) return 'Destroy both spotter towers (' + M8.towers.filter(function (t) { return t.destroyed; }).length + '/2). Get out of the shell shadows!';
    if (G.state === 'emerge') return 'Gustav is coming out of the tunnel...';
    return (G.state === 'reload' ? 'RELOADING: shoot the shell on the hoist at its rear' : G.state === 'elevate' ? 'ELEVATING: shoot the exposed gears on its sides' : 'FIRED!') + ' · beach hits ' + G.beach + '/' + M8_BEACH_MAX;
}

/* ---------- drawing ---------- */
function buildM8Art(W, H) {
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.scale(W / M8W, H / M8H);
    const gr = g.createLinearGradient(0, 0, 0, M8H); gr.addColorStop(0, '#5a5642'); gr.addColorStop(.35, '#66664a'); gr.addColorStop(1, '#58603f'); g.fillStyle = gr; g.fillRect(0, 0, M8W, M8H);
    for (let i = 0; i < 2600; i++) { const x = m2R(i + 7) * M8W, y = m2R(i + 9907) * M8H, r = 4 + m2R(i + 1907) * 26, k = m2R(i + 2907); g.fillStyle = k < .3 ? 'rgba(90,104,58,.2)' : k < .6 ? 'rgba(124,112,80,.16)' : 'rgba(58,54,38,.16)'; g.beginPath(); g.ellipse(x, y, r, r * .6, k * 3, 0, 7); g.fill(); }
    // dirt roads
    g.strokeStyle = 'rgba(120,100,70,.55)'; g.lineWidth = 46; g.lineCap = 'round'; g.beginPath(); g.moveTo(1200, 1520); g.bezierCurveTo(1180, 1300, 900, 1200, 600, 1230); g.moveTo(1200, 1520); g.bezierCurveTo(1230, 1300, 1500, 1200, 1830, 1215); g.stroke();
    g.strokeStyle = 'rgba(120,100,70,.4)'; g.lineWidth = 34; g.beginPath(); g.moveTo(330, 470); g.bezierCurveTo(500, 700, 800, 720, 1100, 700); g.moveTo(2070, 490); g.bezierCurveTo(1900, 700, 1600, 720, 1300, 700); g.stroke();
    // the gravel yard under the gun
    g.fillStyle = 'rgba(112,102,86,.65)'; g.beginPath(); g.moveTo(1040, 240); g.lineTo(1360, 240); g.lineTo(1400, 960); g.lineTo(1000, 960); g.closePath(); g.fill();
    // ridge + tunnel portal
    const rg = g.createLinearGradient(0, 0, 0, 250); rg.addColorStop(0, '#34342e'); rg.addColorStop(1, '#5a584c'); g.fillStyle = rg; g.beginPath(); g.moveTo(0, 0); g.lineTo(M8W, 0); g.lineTo(M8W, 236); for (let x = M8W; x >= 0; x -= 24) g.lineTo(x, 226 + Math.sin(x * .03) * 8 + m2R(x) * 10); g.closePath(); g.fill();
    for (let i = 0; i < 260; i++) { const x = m2R(i + 50) * M8W, y = m2R(i + 150) * 215; g.fillStyle = m2R(i + 250) > .5 ? 'rgba(0,0,0,.2)' : 'rgba(210,210,190,.12)'; g.beginPath(); g.ellipse(x, y, 10 + m2R(i) * 34, 6 + m2R(i + 9) * 12, m2R(i + 4), 0, 7); g.fill(); }
    g.fillStyle = '#7a776a'; g.fillRect(1060, 150, 280, 90); g.fillStyle = '#08080a'; g.beginPath(); g.moveTo(1080, 242); g.lineTo(1080, 196); g.quadraticCurveTo(1200, 136, 1320, 196); g.lineTo(1320, 242); g.fill(); g.fillStyle = '#9b2a1f'; g.fillRect(1060, 144, 280, 7);
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(1060 + i * 35, 150); g.lineTo(1060 + i * 35, 172); g.stroke(); }
    // Gustav's double track
    [1150, 1250].forEach(function (x) { g.fillStyle = '#4a3e30'; for (let y = 236; y < 980; y += 13) g.fillRect(x - 36, y, 72, 6); g.fillStyle = '#a0a098'; g.fillRect(x - 24, 236, 4, 744); g.fillRect(x + 20, 236, 4, 744); });
    // the escort loop
    const L = M8_LOOP; for (let a = 0; a < 6.283; a += .02) { const x = L.cx + Math.cos(a) * L.rx, y = L.cy + Math.sin(a) * L.ry, t = Math.atan2(Math.cos(a) * L.ry, -Math.sin(a) * L.rx); g.save(); g.translate(x, y); g.rotate(t); g.fillStyle = '#4a3e30'; g.fillRect(-3, -20, 6, 40); g.restore(); }
    [-13, 13].forEach(function (o) { g.strokeStyle = '#a2a29a'; g.lineWidth = 3; g.beginPath(); g.ellipse(L.cx, L.cy, L.rx + o, L.ry + o, 0, 0, 7); g.stroke(); });
    // spotter hills
    [[330, 470], [2070, 490]].forEach(function (p) { g.fillStyle = 'rgba(96,84,58,.6)'; g.beginPath(); g.ellipse(p[0], p[1], 150, 110, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(60,50,30,.4)'; g.lineWidth = 2; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(p[0], p[1], 150 - k * 26, 110 - k * 20, 0, 0, 7); g.stroke(); } for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283; g.fillStyle = k % 2 ? '#8a7a54' : '#9a8862'; g.beginPath(); g.ellipse(p[0] + Math.cos(a) * 66, p[1] + Math.sin(a) * 58, 14, 10, a, 0, 7); g.fill(); } });
    // obstacles
    obstacles.forEach(function (o) {
        if (o.type === 'm8Rock' && o.y > 0) { g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(o.x + o.width / 2 + 6, o.y + o.height / 2 + 8, o.width / 2 + 4, o.height / 2 + 4, 0, 0, 7); g.fill(); g.fillStyle = '#5a584c'; g.beginPath(); g.ellipse(o.x + o.width / 2, o.y + o.height / 2, o.width / 2 + 4, o.height / 2 + 4, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(220,220,200,.18)'; g.beginPath(); g.ellipse(o.x + o.width * .4, o.y + o.height * .35, o.width * .3, o.height * .2, 0, 0, 7); g.fill(); }
        if (o.type === 'm8Sand') { const hor = o.width > o.height; for (let k = 0; k < (hor ? o.width : o.height); k += 20) { const x = hor ? o.x + k + 10 : o.x + 12, y = hor ? o.y + 12 : o.y + k + 10; g.fillStyle = (k / 20) % 2 ? '#8a7a54' : '#9a8862'; g.beginPath(); g.ellipse(x, y, hor ? 12 : 11, hor ? 10 : 12, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 1; g.stroke(); } }
        if (o.type === 'm8House') { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(o.x + 8, o.y + 10, o.width, o.height); g.fillStyle = '#7d766a'; g.fillRect(o.x, o.y, o.width, o.height); g.fillStyle = '#5a3a2a'; g.fillRect(o.x + 6, o.y + 6, o.width - 12, o.height - 12); g.strokeStyle = 'rgba(0,0,0,.3)'; for (let y = o.y + 12; y < o.y + o.height - 6; y += 8) { g.beginPath(); g.moveTo(o.x + 6, y); g.lineTo(o.x + o.width - 6, y); g.stroke(); } g.fillStyle = '#16140f'; g.beginPath(); g.moveTo(o.x + o.width * .5, o.y + 6); g.lineTo(o.x + o.width * .9, o.y + 10); g.lineTo(o.x + o.width * .8, o.y + o.height * .6); g.closePath(); g.fill(); }
        if (o.type === 'm8Wood') { for (let k = 0; k < 18; k++) { const x = o.x + m2R(k + o.x) * o.width, y = o.y + m2R(k + o.y) * o.height, r = 18 + m2R(k * 3 + o.x) * 16; g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.arc(x + 6, y + 8, r, 0, 7); g.fill(); g.fillStyle = k % 2 ? '#3a5228' : '#4a6430'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } }
    });
    for (let i = 0; i < 18; i++) { const x = 200 + m2R(i + 70) * 2000, y = 320 + m2R(i + 80) * 1100, r = 16 + m2R(i + 90) * 30; g.fillStyle = 'rgba(40,34,24,.5)'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = 'rgba(150,130,90,.4)'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r + 3, 0, 7); g.stroke(); }
    return c;
}
function m8DrawCar(c, i, now) {
    const p = m8CarPos(i), dead = !c.armoured && c.hp <= 0; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.ang);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-58, -20, 120, 46);
    const body = c.k === 'loco' ? '#2c2e2a' : c.k === 'flak' ? '#55573c' : '#45473a';
    ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(-58, -22, 116, 44, 5); ctx.fill(); ctx.strokeStyle = '#151612'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,230,.08)'; ctx.fillRect(-56, -20, 112, 6);
    if (c.k === 'loco') { ctx.fillStyle = '#1a1b18'; ctx.fillRect(-20, -16, 64, 32); ctx.fillStyle = '#3a3c34'; ctx.beginPath(); ctx.arc(34, 0, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#9b2a1f'; ctx.fillRect(54, -22, 5, 44); ctx.fillStyle = '#4a4c40'; for (let k = 0; k < 4; k++) ctx.fillRect(-50 + k * 8, -18, 5, 36); }
    else if (c.k === 'flak') { ctx.fillStyle = '#3e4030'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, 7); ctx.fill(); for (let k = 0; k < 10; k++) { ctx.fillStyle = k % 2 ? '#7a6c4a' : '#8a7a54'; const a = k / 10 * 6.283; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 24, Math.sin(a) * 15, 8, 5, a, 0, 7); ctx.fill(); }
        ctx.save(); ctx.rotate((c.ang || 0) - p.ang); ctx.fillStyle = '#1a1b16'; ctx.fillRect(0, -8, 36, 4); ctx.fillRect(0, 4, 36, 4); ctx.fillStyle = '#6a6c50'; ctx.fillRect(-9, -11, 16, 22); ctx.restore();
        if (!dead) { ctx.rotate(-p.ang); const w = 70, f = c.hp / c.maxHp; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(-w / 2, -48, w, 7); ctx.fillStyle = '#e04a32'; ctx.fillRect(-w / 2 + 1, -47, (w - 2) * f, 5); const pl = .5 + .5 * Math.sin(now / 140); ctx.strokeStyle = 'rgba(255,80,50,' + (.4 + pl * .5) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 40 + pl * 4, 0, 7); ctx.stroke(); } }
    else { ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 2; for (let k = -40; k <= 40; k += 16) { ctx.beginPath(); ctx.moveTo(k, -22); ctx.lineTo(k, 22); ctx.stroke(); } ctx.fillStyle = 'rgba(236,232,220,.85)'; ctx.fillRect(-7, -7, 14, 14); ctx.fillStyle = '#16140e'; ctx.fillRect(-5, -5, 10, 10); }
    ctx.restore();
    if (dead) { ddpSmoke(p.x, p.y, .3, now / 1000, i * 3, 60, 260, .7); ctx.fillStyle = 'rgba(255,' + (120 + Math.random() * 80) + ',40,.7)'; ctx.beginPath(); ctx.arc(p.x + (Math.random() - .5) * 14, p.y + (Math.random() - .5) * 10, 7 + Math.random() * 7, 0, 7); ctx.fill(); }
}
function m8DrawTower(t, now) {
    ctx.save(); ctx.translate(t.x, t.y);
    if (t.destroyed) { ctx.fillStyle = '#2a2018'; ctx.beginPath(); ctx.ellipse(10, 10, 46, 26, .5, 0, 7); ctx.fill(); ctx.strokeStyle = '#4a3a24'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-30, -20); ctx.lineTo(40, 30); ctx.moveTo(-10, 30); ctx.lineTo(30, -24); ctx.stroke(); ctx.fillStyle = 'rgba(255,140,40,' + (.5 + Math.random() * .3) + ')'; ctx.beginPath(); ctx.arc(6, 4, 10 + Math.random() * 6, 0, 7); ctx.fill(); ctx.restore(); return; }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-20, -6, 80, 60);
    ctx.strokeStyle = '#4a3a24'; ctx.lineWidth = 5; [[-28, -28], [28, -28], [-28, 28], [28, 28]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0] * .6, q[1] * .6); ctx.stroke(); });
    ctx.fillStyle = '#6e5a3a'; ctx.fillRect(-26, -26, 52, 52); ctx.strokeStyle = '#3a2c18'; ctx.lineWidth = 2; for (let k = -22; k <= 22; k += 8) { ctx.beginPath(); ctx.moveTo(-26, k); ctx.lineTo(26, k); ctx.stroke(); }
    ctx.fillStyle = '#4a4436'; ctx.fillRect(-17, -17, 34, 34); ctx.fillStyle = 'rgba(255,255,220,.15)'; ctx.fillRect(-17, -17, 34, 5);
    ctx.strokeStyle = '#1a1a16'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(10, -10); ctx.lineTo(10, -58); ctx.stroke(); const bl = Math.floor(now / 400) % 2; ctx.fillStyle = bl ? '#ff4030' : '#601810'; ctx.beginPath(); ctx.arc(10, -60, 4, 0, 7); ctx.fill();
    ctx.fillStyle = '#1a1a16'; ctx.beginPath(); ctx.arc(-6, -4, 5, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(180,220,255,.9)'; ctx.fillRect(-4, -12, 8, 4);
    const f = t.hp / t.maxHp, pl = .5 + .5 * Math.sin(now / 160); if (M8.phase === 2) { ctx.strokeStyle = 'rgba(255,80,50,' + (.4 + pl * .5) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 46 + pl * 5, 0, 7); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(-36, -80, 72, 7); ctx.fillStyle = '#e04a32'; ctx.fillRect(-35, -79, 70 * f, 5); ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffe2b0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.strokeText('SPOTTER', 0, -86); ctx.fillText('SPOTTER', 0, -86);
    ctx.restore();
}
function m8DrawGustav(now) { // top-down; the barrel points SOUTH over the yard, the hoist is at the rear by the tunnel
    const G = M8.gus; if (M8.phase < 3) return; const y = G.y, cx = 1200;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 238, M8W, M8H); ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(cx - 96, y - 206, 206, 420);
    [-56, 56].forEach(function (ox) { ctx.fillStyle = '#2a2c26'; ctx.fillRect(cx + ox - 32, y - 200, 64, 400); ctx.fillStyle = '#121310'; for (let k = 0; k < 26; k++) { ctx.fillRect(cx + ox - 38, y - 196 + k * 15.2, 8, 10); ctx.fillRect(cx + ox + 30, y - 196 + k * 15.2, 8, 10); } });
    const cg = ctx.createLinearGradient(cx - 84, 0, cx + 84, 0); cg.addColorStop(0, '#4a4c3a'); cg.addColorStop(.5, '#6c6e52'); cg.addColorStop(1, '#3e4030'); ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(cx - 84, y - 186, 168, 360, 12); ctx.fill(); ctx.strokeStyle = '#1a1b16'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = 'rgba(128,118,82,.6)'; ctx.beginPath(); ctx.ellipse(cx - 30, y - 90, 40, 16, .3, 0, 7); ctx.ellipse(cx + 34, y + 110, 36, 14, -.2, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(84,66,48,.55)'; ctx.beginPath(); ctx.ellipse(cx + 20, y - 20, 44, 10, -.15, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 2; for (let k = -170; k < 170; k += 26) { ctx.beginPath(); ctx.moveTo(cx - 82, y + k); ctx.lineTo(cx + 82, y + k); ctx.stroke(); }
    // rear: shell hoist ramp with the shell riding up (target while reloading)
    ctx.fillStyle = '#3a3c2e'; ctx.fillRect(cx - 26, y - 206, 52, 80); ctx.strokeStyle = '#1a1b16'; ctx.lineWidth = 1.4; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.moveTo(cx - 24, y - 204 + k * 9); ctx.lineTo(cx + 24, y - 204 + k * 9); ctx.stroke(); }
    if (G.state === 'reload' && G.shellLive && !M8.won) { const h = m8HoistPos(); ctx.save(); ctx.translate(h.x, h.y); ctx.fillStyle = '#7d8268'; ctx.beginPath(); ctx.roundRect(-12, -26, 24, 52, 10); ctx.fill(); ctx.fillStyle = '#b06a34'; ctx.fillRect(-12, 10, 24, 5); ctx.fillStyle = '#d8c24a'; ctx.fillRect(-12, -2, 24, 3); const pl = .5 + .5 * Math.sin(now / 110); ctx.strokeStyle = 'rgba(255,200,60,' + (.6 + pl * .4) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 32 + pl * 5, 0, 7); ctx.stroke(); ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = '#000'; ctx.strokeText('SHELL', 0, -42); ctx.fillStyle = '#ffd24a'; ctx.fillText('SHELL', 0, -42); ctx.restore(); }
    ctx.fillStyle = '#585a44'; ctx.fillRect(cx - 50, y - 120, 100, 150); ctx.fillStyle = '#3a3c2e'; ctx.fillRect(cx - 36, y - 120, 72, 40);                     // breech house
    // the barrel (foreshortens as it elevates), droops when it dies
    const elv = G.el, bl = (380 - elv * 170) * (1 - G.droop * .15); ctx.save(); ctx.translate(cx, y + 30); ctx.rotate(G.droop * .05);
    ctx.fillStyle = 'rgba(0,0,0,' + (.25 + elv * .2) + ')'; ctx.fillRect(-18 + elv * 40, 10 + elv * 30, 36, 380);
    const bgr = ctx.createLinearGradient(-22, 0, 22, 0); bgr.addColorStop(0, '#3a3c2e'); bgr.addColorStop(.4, '#6e7254'); bgr.addColorStop(1, '#2e3024'); ctx.fillStyle = bgr; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-15, bl); ctx.lineTo(15, bl); ctx.lineTo(24, 0); ctx.fill();
    ctx.fillStyle = '#2a2b22'; ctx.fillRect(-19, bl - 4, 38, 12); ctx.fillStyle = '#060606'; ctx.beginPath(); ctx.ellipse(0, bl + 4, 10, 4 + elv * 6, 0, 0, 7); ctx.fill();
    if (now - G.fireAt < 700) { const k = 1 - (now - G.fireAt) / 700; ctx.fillStyle = 'rgba(255,230,160,' + k + ')'; ctx.beginPath(); ctx.arc(0, bl + 40, 120 * k + 40, 0, 7); ctx.fill(); }
    ctx.restore();
    // elevation gears on both sides of the trunnion
    M8.gears.forEach(function (g) { const p = m8GearPos(g); ctx.save(); ctx.translate(p.x, p.y);
        if (g.destroyed) { ctx.fillStyle = '#1a1814'; ctx.beginPath(); ctx.arc(0, 0, 26, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,' + (110 + Math.random() * 80) + ',40,.75)'; ctx.beginPath(); ctx.arc((Math.random() - .5) * 8, (Math.random() - .5) * 8, 10 + Math.random() * 6, 0, 7); ctx.fill(); ctx.restore(); return; }
        const open = G.state === 'elevate' ? Math.min(1, (now - G.stateAt) / 600) : 0;
        ctx.fillStyle = '#3a3c30'; ctx.beginPath(); ctx.roundRect(-28, -32, 56, 64, 6); ctx.fill();
        ctx.save(); ctx.rotate(now / (open ? 300 : 2000)); ctx.fillStyle = open ? '#b0985a' : '#6a5e40'; for (let k = 0; k < 12; k++) { ctx.rotate(Math.PI / 6); ctx.fillRect(-3, -24, 6, 8); } ctx.beginPath(); ctx.arc(0, 0, 17, 0, 7); ctx.fill(); ctx.fillStyle = '#2a2a22'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#4a4c3a'; ctx.fillRect(-30, -34, 60, 34 * (1 - open)); ctx.fillRect(-30, 34 - 34 * (1 - open), 60, 34 * (1 - open));                  // armoured covers slide open
        if (open > 0) { const pl = .5 + .5 * Math.sin(now / 120); ctx.strokeStyle = 'rgba(255,80,50,' + (.5 + pl * .5) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 42 + pl * 5, 0, 7); ctx.stroke(); }
        ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(g.dx < 0 ? -96 : 36, -4, 60, 7); ctx.fillStyle = '#e04a32'; ctx.fillRect(g.dx < 0 ? -95 : 37, -3, 58 * g.hp / g.maxHp, 5);
        ctx.restore(); });
    ctx.restore();
}
function drawGustavMap() {
    const W = canvas.width, H = canvas.height, key = W + 'x' + H + ':' + obstacles.length;
    if (!M8.art || M8.artKey !== key) { M8.art = buildM8Art(W, H); M8.artKey = key; }
    ctx.drawImage(M8.art, 0, 0); if (!M8.active) return;
    const now = Date.now();
    M8.craters.forEach(function (c) { ctx.fillStyle = 'rgba(30,24,16,.75)'; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(140,120,80,.5)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(c.x, c.y, c.r + 4, 0, 7); ctx.stroke(); if (now - c.t < 6000) { ctx.fillStyle = 'rgba(255,120,40,' + (.4 * (1 - (now - c.t) / 6000)) + ')'; ctx.beginPath(); ctx.arc(c.x, c.y, c.r * .6, 0, 7); ctx.fill(); } });
    if (M8.train) { for (let i = M8.train.cars.length - 1; i >= 0; i--) m8DrawCar(M8.train.cars[i], i, now); const p = m8CarPos(0); ddpSmoke(p.x, p.y, .32, now / 1000, 2, 80, 240, M8.train.stopped ? .35 : .8); }
    M8.towers.forEach(function (t) { m8DrawTower(t, now); });
    m8DrawGustav(now);
}
function m8Arrow(x, y, label, col, now) { // off-screen pointer at the edge of the view
    const vx = cameraX, vy = cameraY, vw = SKIRMISH_VIEW_WIDTH, vh = SKIRMISH_VIEW_HEIGHT; if (x > vx + 30 && x < vx + vw - 30 && y > vy + 30 && y < vy + vh - 30) return;
    const cx = vx + vw / 2, cy = vy + vh / 2, a = Math.atan2(y - cy, x - cx), k = Math.min((vw / 2 - 40) / Math.abs(Math.cos(a) || 1e-6), (vh / 2 - 40) / Math.abs(Math.sin(a) || 1e-6)), px = cx + Math.cos(a) * k, py = cy + Math.sin(a) * k, pl = .6 + .4 * Math.sin(now / 160);
    ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.fillStyle = col; ctx.globalAlpha = pl; ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-10, -12); ctx.lineTo(-4, 0); ctx.lineTo(-10, 12); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = '#000'; const tx = px - Math.cos(a) * 34, ty = py - Math.sin(a) * 24 + 4; ctx.strokeText(label, tx, ty); ctx.fillStyle = col; ctx.fillText(label, tx, ty); ctx.restore();
}
function m8DrawOverlay() {
    if (!M8.active) return; const now = Date.now(), G = M8.gus; ctx.save();
    M8.shots.forEach(function (s) { if (s.done) return;
        const k = cs2C((now - s.t0) / M8_SHADOW, 0, 1), r = s.r * (.25 + .75 * k);
        ctx.fillStyle = 'rgba(0,0,0,' + (.15 + .45 * k) + ')'; ctx.beginPath(); ctx.ellipse(s.x, s.y, r, r * .8, 0, 0, 7); ctx.fill();
        const pl = .5 + .5 * Math.sin(now / (60 + 200 * (1 - k))); ctx.strokeStyle = 'rgba(255,60,40,' + (.5 + pl * .5) + ')'; ctx.lineWidth = 4; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.ellipse(s.x, s.y, s.r, s.r * .8, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
        ctx.font = 'bold 22px "Stardos Stencil", Impact, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = '#000'; const txt = ((s.at - now) / 1000).toFixed(1); ctx.strokeText(txt, s.x, s.y + 8); ctx.fillStyle = '#ff7050'; ctx.fillText(txt, s.x, s.y + 8);
        if (!M8.msgs['w' + s.t0]) { M8.msgs['w' + s.t0] = 1; try { playTone(1500, 260, (s.at - now) / 1000, .04, 'sine'); } catch (e) {} } });
    if (M8.phase === 3 && now - G.fireAt < 1400) { const k = (now - G.fireAt) / 1400; ctx.strokeStyle = 'rgba(255,230,190,' + (.7 * (1 - k)) + ')'; ctx.lineWidth = 10 * (1 - k) + 2; ctx.beginPath(); ctx.arc(1200, G.y, 60 + k * 520, 0, 7); ctx.stroke(); if (k < .3) { ctx.fillStyle = 'rgba(255,240,210,' + (.35 * (1 - k / .3)) + ')'; ctx.fillRect(0, 0, canvas.width, canvas.height); } }
    // objective pointers
    if (!M8.won) {
        if (M8.phase === 1 && M8.train) M8.train.cars.forEach(function (c, i) { if (c.k === 'flak' && c.hp > 0) { const p = m8CarPos(i); m8Arrow(p.x, p.y, 'FLAK', '#ff7050', now); } });
        if (M8.phase === 2) M8.towers.forEach(function (t) { if (!t.destroyed) m8Arrow(t.x, t.y, 'SPOTTER', '#ff7050', now); });
        if (M8.phase === 3 && G.out >= 1) { if (G.state === 'reload' && G.shellLive) { const h = m8HoistPos(); m8Arrow(h.x, h.y, 'HOIST', '#ffd24a', now); } else m8Arrow(1200, G.y, 'GUSTAV', '#ff7050', now); }
    }
    ctx.restore();
}
function m8EnsureHud() {
    m4EnsureHud(); if (!document.getElementById('m8Style')) { const src = document.getElementById('m4Style'); const s = document.createElement('style'); s.id = 'm8Style'; s.textContent = (src ? src.textContent : '').split('#m4Hud').join('#m8Hud').split('#m4Bar').join('#m8Bar').split('#m4Stat').join('#m8Stat'); document.head.appendChild(s); }
    let h = document.getElementById('m8Hud'); if (!h) { h = document.createElement('div'); h.id = 'm8Hud'; h.hidden = true; h.innerHTML = '<div class="l" id="m8Lbl">SCHWERER GUSTAV · 80 cm K(E)</div><div class="b"><i id="m8Bar"></i></div><div class="s" id="m8Stat"></div>'; document.body.appendChild(h); }
    return h;
}
function m8ShowHud(on) { m8EnsureHud().hidden = !on; }
function m8UpdateHud(now) {
    const h = document.getElementById('m8Hud'); if (!h || h.hidden) return; const G = M8.gus; let f = 1, st = '';
    if (M8.phase === 1) { const n = M8.train.cars.filter(function (c) { return c.k === 'flak'; }), hp = n.reduce(function (a, c) { return a + c.hp; }, 0); f = hp / 760; st = 'PHASE 1 · ESCORT TRAIN — HIT THE FLAK WAGONS'; }
    else if (M8.phase === 2) { f = M8.towers.reduce(function (a, t) { return a + t.hp; }, 0) / 720; st = 'PHASE 2 · TWO SPOTTERS — DODGE THE SHELL SHADOWS'; }
    else { f = G.hp / 100; const left = G.state === 'reload' ? M8_CYCLE.reload - (now - G.stateAt) : G.state === 'elevate' ? M8_CYCLE.elevate - (now - G.stateAt) : 0; st = M8.won ? 'GUSTAV SILENCED' : G.state === 'emerge' ? 'PHASE 3 · IT IS COMING OUT OF THE TUNNEL' : (G.state === 'reload' ? 'RELOADING — HIT THE SHELL ON THE HOIST' : G.state === 'elevate' ? 'ELEVATING — HIT THE GEARS' : 'FIRED!') + (left > 0 ? ' · ' + (left / 1000).toFixed(1) + 's' : '') + ' · BEACH HITS ' + G.beach + '/' + M8_BEACH_MAX; }
    document.getElementById('m8Bar').style.width = Math.max(0, f * 100) + '%'; document.getElementById('m8Stat').textContent = st;
}
function m8Cleanup() { M8.active = false; const h = document.getElementById('m8Hud'); if (h) h.hidden = true; }
function m8ShowBrief(go) {
    m2InjectStyle();
    let b = document.getElementById('m2Brief'); if (!b) { b = document.createElement('div'); b.id = 'm2Brief'; document.body.appendChild(b); }
    b.innerHTML = '<div class="bSheet"><div class="bTape"><span>OPERATION OVERLORD</span><span>MISSION 08</span></div><div class="bBody">' +
        '<h2>SCHWERER GUSTAV</h2><p class="bText" id="m8Typed"></p>' +
        '<ul><li><b>Phase 1:</b> an armoured train circles the gun yard. Only its two <b>flak wagons</b> can be hurt. Stay off the rails.</li><li><b>Phase 2:</b> the gun shells you from the tunnel. When a <b>shadow</b> grows under you, <b>get out</b>. Destroy <b>both spotter towers</b> on the hills.</li><li><b>Phase 3:</b> Gustav rolls out. While it <b>reloads</b>, shoot the <b>shell on the hoist</b> at its rear (big damage, cancels the shot). When it <b>elevates</b>, its <b>gear covers open</b>: wreck the gears. If it fires <b>3 times</b>, the beachhead is lost.</li></ul>' +
        '<div class="bNew">★ FIELD NOTES ★</div><div class="bCards">' +
        '<div class="bCard" id="m8C1"><h3>THE BIG MAP</h3>The yard is huge. Red arrows at the edge of the screen point to your targets. The minimap shows the whole field.</div>' +
        '<div class="bCard" id="m8C2"><h3>THE SHOCKWAVE</h3>When Gustav fires, everything near it gets flattened and thrown back. Do not be beside it when the countdown ends.</div>' +
        '<div class="bCard" id="m8C3"><h3>AIRSTRIKE RUN</h3><kbd>E</kbd> then click. Bombs set off the hoist shell and hurt the flak wagons, spotters and gears. 30 s recharge.</div>' +
        '<div class="bCard" id="m8C4"><h3>FIELD REPAIR</h3><kbd>R</kbd> works anywhere. Never repair inside a shadow.</div></div>' +
        '<div class="bNote">W A S D move · mouse aim · click / space fire.</div>' +
        '<button class="bGo" id="m8Go">SILENCE THE GUN</button></div></div>';
    b.hidden = false;
    const txt = 'D+7. For three days a shell the size of a car has been falling on the beachhead. The train you stopped was feeding it. It lives in a railway tunnel in the hills: Schwerer Gustav, the largest gun ever built. Break the escort, blind the spotters, then take the monster apart before it fires again.';
    const el = document.getElementById('m8Typed'); let i = 0; const iv = setInterval(function () { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(iv); }, 22);
    [1200, 1700, 2200, 2700].forEach(function (ms, k) { setTimeout(function () { const c = document.getElementById('m8C' + (k + 1)); if (c) c.classList.add('show'); try { playTone(640 + k * 60, 860 + k * 60, .18, .06, 'triangle'); } catch (e) {} }, ms); });
    document.getElementById('m8Go').onclick = function () { clearInterval(iv); b.hidden = true; M8.cut = false; go(); };
}
function startMission8(skipIntro) {
    const f = campaignRun.faction || campaignFaction, c = campaignRun.cls || campaignTankClass; if (!f || !c) return;
    returnToMenu(); campaignRun = { faction: f, cls: c }; campaignFaction = f; campaignTankClass = c;
    selectedFaction = f; selectedTankClass = c; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; campaignMission = 8;
    document.getElementById('menu').style.display = 'none'; document.getElementById('campaignScreen').style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = !skipIntro; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)';
    if (skipIntro) { m8ShowBrief(function () { startCampaignMission(); }); return; }
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM8Cutscene);
}
