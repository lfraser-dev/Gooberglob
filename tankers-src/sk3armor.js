/* =====================================================
   3D SKIRMISH armour + ammunition.
   Real armour: every tank has front / side / rear plate thickness (mm, sloped fronts counted as their effective
   thickness) and a gun penetration value. A hit works out which plate it struck and at what angle:
   effective armour = thickness / cos(angle). Above ~70° from the plate's normal AP shells usually ricochet.
   Penetration beats armour -> PENETRATED (full damage, more on side / rear); otherwise NO PENETRATION (a scratch).
   Ammo (keys 1 / 2 / 3, switching reloads the gun):
     1 AP     — armour piercing, the tank killer.
     2 HE     — high explosive: barely penetrates (only light tanks) but always does blast damage, splashes nearby
                tanks, flattens cover and kills infantry in a wide radius.
     3 SMOKE  — lands as a thick smoke screen (blocks sight lines like the smoke ability). 4 rounds a battle.
   Online: the guest tells the host its ammo with an `am` message; the host does the damage; smoke clouds are already
   part of the snapshot.
===================================================== */
const SK3_ARM = {
    'Tetrarch': [16, 14, 10, 50], 'Cromwell': [76, 51, 32, 95], 'Churchill': [152, 95, 50, 90], 'Churchill Crocodile': [152, 95, 50, 80],
    'Panzer II': [35, 15, 15, 40], 'Panzer IV': [80, 30, 20, 110], 'Tiger I': [100, 80, 80, 160], 'Flakpanzer IV': [80, 30, 20, 60],
    'T-70': [55, 15, 25, 50], 'T-34': [90, 45, 40, 95], 'IS-2': [170, 90, 60, 175], 'KV-2': [75, 75, 60, 90],
    'M3 Stuart': [50, 25, 25, 55], 'M4 Sherman': [95, 38, 38, 95], 'M26 Pershing': [140, 76, 51, 150], 'M4 Calliope': [95, 38, 38, 95]
};
const SK3_ARM_CLASS = { LIGHT: [35, 18, 15, 50], MEDIUM: [85, 40, 30, 100], HEAVY: [130, 85, 60, 150], SPECIALIST: [90, 60, 40, 85] };
const SK3_AMMO = { ap: { name: 'AP', col: '#e8dcb8' }, he: { name: 'HE', col: '#ffb070' }, smoke: { name: 'SMOKE', col: '#cfd6dc' } };
const SK3AR = { ammo: 'ap', smoke: 4, stats: { pen: 0, nopen: 0, rico: 0, he: 0, smoke: 0 }, live: new Map(), say: 0 };
function sk3Arm(t) { if (!t) return SK3_ARM_CLASS.MEDIUM; return SK3_ARM[t.name] || SK3_ARM_CLASS[String(t.className || '').toUpperCase()] || SK3_ARM_CLASS.MEDIUM; }
function sk3ArOn() { return typeof SK3D !== 'undefined' && SK3D.on; }
// which plate a shell travelling (vx, vy) strikes on tank t, and the angle to that plate's normal
function sk3ArFace(t, vx, vy) { const L = Math.hypot(vx, vy) || 1, dx = vx / L, dy = vy / L, a = t.angle || 0, c = Math.cos(a), s = Math.sin(a), ax = -(dx * c + dy * s), ay = -(-dx * s + dy * c), HL = 1, HW = .62;
    const wf = Math.abs(ax) * HW, ws = Math.abs(ay) * HL; // a plate gets hit in proportion to how much of it faces the shooter
    if (Math.random() * (wf + ws) < wf) return { face: ax > 0 ? 'FRONT' : 'REAR', cos: Math.abs(ax) }; return { face: 'SIDE', cos: Math.abs(ay) }; }
function sk3ArDamage(shell, target) { const ammo = shell.ammo || 'ap', arm = sk3Arm(target), F = sk3ArFace(target, shell.vx || 0, shell.vy || 0), idx = F.face === 'FRONT' ? 0 : F.face === 'SIDE' ? 1 : 2, thick = arm[idx], eff = thick / Math.max(.2, F.cos);
    const lock = Date.now() < (target.armorLockUntil || 0) ? .42 : 1, base = (shell.damage || 30) * (target.armor || .7) * lock, mine = shell.sk3mine, me = target === player;
    if (ammo === 'smoke') return 0;
    if (ammo !== 'he' && F.cos < .62 && Math.random() < Math.min(.85, (.62 - F.cos) / .22)) { shell.ricocheted = true; shell.ricochetDirection = F.face; SK3AR.stats.rico++; createHitText(shell.x, shell.y, 'RICOCHET!'); try { impacts.push({ x: shell.x, y: shell.y, life: 14, maxLife: 14, scale: .8, ricochet: true }); } catch (e) {} if (me) sk3ArSay('RICOCHET OFF OUR ' + F.face + ' ARMOUR!'); return 0; }
    const pen = (ammo === 'he' ? 30 : (shell.sk3pen || 90)) * (.88 + Math.random() * .24);
    if (pen >= eff) { SK3AR.stats.pen++; const k = { FRONT: 1.1, SIDE: 1.25, REAR: 1.6 }[F.face] * (ammo === 'he' ? 1.3 : 1); createHitText(shell.x, shell.y, 'PENETRATED · ' + F.face + ' HIT'); if (me) sk3ArSay('WE\'RE PENETRATED — ' + F.face + '!'); return Math.max(3, Math.round(base * k)); }
    if (ammo === 'he') { SK3AR.stats.he++; createHitText(shell.x, shell.y, 'HE BLAST · ' + F.face + ' ARMOR'); return Math.max(2, Math.round(base * .4)); }
    SK3AR.stats.nopen++; createHitText(shell.x, shell.y, 'NO PENETRATION · ' + F.face + ' ARMOR'); if (me) sk3ArSay('BOUNCED OFF OUR ' + F.face + ' ARMOUR'); return Math.max(1, Math.round(base * .12)); }
function sk3ArSay(t) { const now = Date.now(); if (now - SK3AR.say < 2500) return; SK3AR.say = now; try { showRadioText(t, true); } catch (e) {} }
function sk3ArSet(a) { if (!SK3_AMMO[a] || !player || player.destroyed) return; if (a === 'smoke' && SK3AR.smoke <= 0) { sk3ArSay('NO SMOKE ROUNDS LEFT'); return; } if (SK3AR.ammo === a) return; SK3AR.ammo = a; player.sk3ammo = a;
    const now = Date.now(); try { lastShot = now; player.lastShot = now; } catch (e) {} try { showRadioText('LOADING ' + SK3_AMMO[a].name + (a === 'smoke' ? ' (' + SK3AR.smoke + ' LEFT)' : ''), false); } catch (e) {}
    if (typeof DUEL !== 'undefined' && DUEL.active && DUEL.role !== 'host') duelSend({ t: 'am', a: a }); }
// shells that just disappeared: HE bursts, smoke screens
function sk3ArStep() { const now = performance.now(), seen = new Set(); (shells || []).forEach(function (s) { if (s.ammo === 'he' || s.ammo === 'smoke') { seen.add(s); SK3AR.live.set(s, [s.x + (s.vx || 0), s.y + (s.vy || 0)]); } });
    SK3AR.live.forEach(function (p, s) { if (seen.has(s)) return; SK3AR.live.delete(s); const auth = !(typeof DUEL !== 'undefined' && DUEL.active && DUEL.role !== 'host');
        if (s.ammo === 'smoke') { SK3AR.stats.smoke++; if (auth) abilitySmokeClouds.push({ x: p[0], y: p[1], radius: 55, maxRadius: 135, life: 1500, maxLife: 1500, driftX: (Math.random() - .5) * .06, driftY: (Math.random() - .5) * .06 }); sk3ArPuff(p[0], p[1]); }
        else { if (typeof sk3InfBlast === 'function') sk3InfBlast(p[0], p[1], 90); if (!s.sk3exploded) try { createExplosion(p[0], p[1], 1.1); } catch (e) {}
            if (auth) obstacles.forEach(function (o) { if (!SK3_HP[o.type] || o.sk3gone) return; const dx = Math.max(o.x - p[0], 0, p[0] - (o.x + o.width)), dy = Math.max(o.y - p[1], 0, p[1] - (o.y + o.height)); if (Math.hypot(dx, dy) < 34) sk3ObHit(o, Math.max(o.x, Math.min(o.x + o.width, p[0])), Math.max(o.y, Math.min(o.y + o.height, p[1])), (s.damage || 30) * 1.6); }); } }); }
function sk3ArPuff(x2, y2) { const st = SK3D.st; if (!st || !SK3D.ready) return; const x = sk3X(x2), z = sk3Z(y2), h = st.hgt ? st.hgt(x, z) : 0; for (let i = 0; i < 40; i++) st.smoke.emit({ x: x + (Math.random() - .5) * 3, y: h + .5 + Math.random() * 2, z: z + (Math.random() - .5) * 3, vx: (Math.random() - .5) * 6, vy: .5 + Math.random() * 2, vz: (Math.random() - .5) * 6, life: 9 + Math.random() * 5, s0: 2, s1: 9, c0: [.86, .87, .88, .9], c1: [.8, .8, .82, 0], drag: .9 }); }
function sk3ArHud() { if (!SK3D.hud || !player || SK3D.map) return; const g = SK3D.hud.getContext('2d'), x0 = 828, y0 = 594; g.font = 'bold 12px "Special Elite", monospace'; g.textAlign = 'center';
    ['ap', 'he', 'smoke'].forEach(function (a, i) { const on = SK3AR.ammo === a, x = x0 + i * 88, A = SK3_AMMO[a]; g.fillStyle = on ? 'rgba(200,160,64,.9)' : 'rgba(0,0,0,.55)'; g.fillRect(x, y0, 82, 34); g.strokeStyle = on ? '#ffe6a8' : 'rgba(232,220,184,.35)'; g.lineWidth = 1.5; g.strokeRect(x + .5, y0 + .5, 81, 33);
        g.fillStyle = on ? '#1a1a10' : A.col; g.fillText((i + 1) + ' ' + A.name, x + 41, y0 + 15); g.font = '10px "Special Elite", monospace'; g.fillText(a === 'smoke' ? SK3AR.smoke + ' LEFT' : a === 'ap' ? 'ANTI-TANK' : 'BLAST', x + 41, y0 + 28); g.font = 'bold 12px "Special Elite", monospace'; });
    const arm = sk3Arm(player); g.font = '10px "Special Elite", monospace'; g.fillStyle = 'rgba(232,220,184,.75)'; g.fillText('ARMOUR ' + arm[0] + '/' + arm[1] + '/' + arm[2] + ' mm · GUN ' + arm[3] + ' mm', x0 + 129, y0 - 6); }
(function () {
    const _cd = calculateDamage; calculateDamage = function (shell, target) { if (!sk3ArOn() || !target || target.m5inf || target.m5pilot || target.m6 || target.m6half || target.m4boss) return _cd.apply(this, arguments);
        if (typeof DUEL !== 'undefined' && DUEL.active && Date.now() < (target.exeSafeUntil || 0)) return 0; return sk3ArDamage(shell, target); };
    const _cs = createShell; createShell = function (tank) { const n = (shells || []).length, r = _cs.apply(this, arguments); if (sk3ArOn() && tank) for (let k = n; k < shells.length; k++) { const s = shells[k]; let a = tank.sk3ammo || 'ap';
            if (a === 'smoke') { if (tank === player && !(typeof DUEL !== 'undefined' && DUEL.active && DUEL.role !== 'host')) { if (SK3AR.smoke <= 0) a = 'ap'; else SK3AR.smoke--; } else { tank.sk3smoke = tank.sk3smoke == null ? 4 : tank.sk3smoke; if (tank.sk3smoke <= 0) a = 'ap'; else tank.sk3smoke--; } }
            s.ammo = a; s.sk3pen = sk3Arm(tank)[3]; if (a === 'he') { s.splashRadius = Math.max(s.splashRadius || 0, 55); s.splashDamage = Math.max(s.splashDamage || 0, Math.round((s.damage || 30) * .25)); } }
        if (tank === player && SK3AR.ammo === 'smoke' && SK3AR.smoke <= 0) { SK3AR.ammo = 'ap'; player.sk3ammo = 'ap'; } return r; };
    const _ce = createExplosion; createExplosion = function (x, y, s) { (shells || []).forEach(function (q) { if (q.ammo && Math.hypot(q.x - x, q.y - y) < 40) q.sk3exploded = true; }); return _ce.apply(this, arguments); };
    const _us = updateShells; updateShells = function () { const r = _us.apply(this, arguments); if (sk3ArOn()) try { sk3ArStep(); } catch (e) { SK3AR.err = e; } return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { sk3ArHud(); } catch (e) {} return r; };
    const _st = sk3Start; sk3Start = function () { SK3AR.ammo = 'ap'; SK3AR.smoke = 4; SK3AR.live = new Map(); if (player) player.sk3ammo = 'ap'; return _st.apply(this, arguments); };
    if (typeof duelOnData === 'function') { const _od = duelOnData; duelOnData = function (m, c) { if (m && m.t === 'am') { DUEL.lastRx = Date.now(); if (c) c.lastRx = Date.now(); if (DUEL.role === 'host' && c && c.slot > 0) { const t = DUEL.tanks[c.slot]; if (t && SK3_AMMO[m.a]) { t.sk3ammo = m.a; t.lastShot = Date.now(); } } return; } return _od.apply(this, arguments); }; }
    window.addEventListener('keydown', function (e) { if (!SK3D.on || e.repeat || SK3D.map) return; const tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) return; const k = { '1': 'ap', '2': 'he', '3': 'smoke' }[e.key]; if (k) { e.preventDefault(); e.stopImmediatePropagation(); sk3ArSet(k); } }, true);
})();
