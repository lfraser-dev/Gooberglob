/* =====================================================
   3D SKIRMISH artillery: press G for the battle map (a view over the whole battlefield).
   Move the mouse to aim, left-click to call a barrage of 10 heavy shells; G, Esc or right-click to close.
   W/A/S/D pan the map, the wheel zooms. You hold up to 2 barrages; one comes back every 70 s.
   Shells take ~3.5 s to arrive, whistle in, wreck cover, kill infantry and hurt every tank nearby (yours too).
   Online the host runs the damage; `art` (guest asks) and `arts` (host tells everyone) messages.
===================================================== */
const SK3A = { charges: 1, max: 2, rechargeMs: 70000, nextAt: 0, mx: 550, my: 350, cx: 0, cz: 0, zoom: 1, barrages: [], fog: null, stats: { called: 0, shells: 0 } };
const SK3A_R = 105, SK3A_DMG = 70; // splash radius (px = 10.5 m) and damage at the centre
function sk3ADuel() { return typeof DUEL !== 'undefined' && DUEL.active; }
function sk3AAuth() { return !sk3ADuel() || DUEL.role === 'host'; }
function sk3AOpen(on) { if (on && (!player || player.destroyed || !SK3D.ready)) return; if (!!on === !!SK3D.map) return; SK3D.map = !!on;
    if (SK3D.map) { if (SK3D.bino) sk3Bino(false); if (SK3D.scope) sk3SetScope(false); try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {} SK3A.cx = sk3X(player.x) * .4; SK3A.cz = sk3Z(player.y) * .4; SK3A.zoom = 1;
        if (TK3.scene && TK3.scene.fog) { SK3A.fog = [TK3.scene.fog.color.getHexString(), TK3.scene.fog.density]; tk3Fog('#' + SK3A.fog[0], Math.min(SK3A.fog[1], .0007)); } if (SK3D.hud) SK3D.hud.style.cursor = 'none'; if (TK3.cv) TK3.cv.style.cursor = 'none';
        try { showRadioText(SK3A.charges > 0 ? 'ARTILLERY ON THE NET — MARK THE TARGET' : 'ARTILLERY RELOADING — ' + Math.ceil((SK3A.nextAt - Date.now()) / 1000) + ' S', true); } catch (e) {} }
    else { if (SK3A.fog && TK3.scene && TK3.scene.fog) tk3Fog('#' + SK3A.fog[0], SK3A.fog[1]); SK3A.fog = null; if (TK3.cam) { TK3.cam.userData.hfov = -1; TK3.cam.near = .5; TK3.cam.updateProjectionMatrix(); } if (TK3.cv) TK3.cv.style.cursor = 'crosshair'; } }
// screen (HUD 1100x700) -> battlefield point (2D px)
function sk3AGround(mx, my) { const cam = TK3.cam; if (!cam) return null; const v = new THREE.Vector3(mx / 550 - 1, 1 - my / 350, .5).unproject(cam).sub(cam.position).normalize(); if (v.y >= -.01) return null; let d = -cam.position.y / v.y;
    for (let i = 0; i < 3; i++) { const p = cam.position.clone().addScaledVector(v, d), h = TK3.st && TK3.st.hgt ? TK3.st.hgt(p.x, p.z) : 0; d = (h - cam.position.y) / v.y; }
    const p = cam.position.clone().addScaledVector(v, d); return { x: p.x / SK3D.S + SKIRMISH_WORLD_WIDTH / 2, y: p.z / SK3D.S + SKIRMISH_WORLD_HEIGHT / 2, X: p.x, Y: p.y, Z: p.z }; }
function sk3AProj(x2, y2, h) { const v = new THREE.Vector3(sk3X(x2), (h || 0) + (TK3.st && TK3.st.hgt ? TK3.st.hgt(sk3X(x2), sk3Z(y2)) : 0), sk3Z(y2)).project(TK3.cam); return v.z < 1 ? [(v.x + 1) * 550, (1 - v.y) * 350] : null; }
function sk3ACall() { const g = sk3AGround(SK3A.mx, SK3A.my); if (!g) return; if (g.x < 20 || g.y < 20 || g.x > SKIRMISH_WORLD_WIDTH - 20 || g.y > SKIRMISH_WORLD_HEIGHT - 20) return;
    if (SK3A.charges <= 0) { try { showRadioText('NO GUNS AVAILABLE — ' + Math.ceil((SK3A.nextAt - Date.now()) / 1000) + ' S', true); } catch (e) {} return; }
    SK3A.charges--; if (!SK3A.nextAt || SK3A.nextAt < Date.now()) SK3A.nextAt = Date.now() + SK3A.rechargeMs; SK3A.stats.called++;
    const d = Math.hypot(g.x - player.x, g.y - player.y); try { showRadioText(d < SK3A_R * 2.2 ? 'DANGER CLOSE! FIRE MISSION — SHOT, OVER.' : 'FIRE MISSION — ' + Math.round(d * SK3D.S) + ' M — SHOT, OVER.', true); } catch (e) {}
    try { const S = sk3SPlace(TK3.cam.position.x, TK3.cam.position.y, TK3.cam.position.z, { nodelay: true, vol: .5 }); if (S) { sk3STone(S, .12, 1200, 1200, 'square', .08, .002); sk3SNoise(S, .25, 2600, 1800, 'bandpass', 2, .12, .01); } } catch (e) {}
    const seed = (Math.random() * 1e9) | 0, me = sk3ADuel() ? DUEL.mySlot : 0;
    if (sk3ADuel() && DUEL.role !== 'host') { duelSend({ t: 'art', x: Math.round(g.x), y: Math.round(g.y) }); }
    else { sk3AStart(g.x, g.y, seed, me); if (sk3ADuel()) duelBroadcast({ t: 'arts', x: Math.round(g.x), y: Math.round(g.y), seed: seed, s: me }); }
    setTimeout(function () { sk3AOpen(false); }, 650); }
function sk3AStart(x, y, seed, slot) { const R = tk3Rand(seed), b = { x: x, y: y, t0: performance.now(), slot: slot | 0, shells: [] };
    for (let i = 0; i < 10; i++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 160; b.shells.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, at: 3500 + i * 430 + R() * 220, whist: false, done: false }); }
    SK3A.barrages.push(b);
    // warn whoever is under it
    if (player && !player.destroyed && Math.hypot(player.x - x, player.y - y) < 420 && (!sk3ADuel() || slot !== DUEL.mySlot)) setTimeout(function () { try { showRadioText('INCOMING ARTILLERY! MOVE!', true); } catch (e) {} }, 1600); }
function sk3AStep() { const now = performance.now(); if (SK3A.charges < SK3A.max && SK3A.nextAt && Date.now() >= SK3A.nextAt) { SK3A.charges++; SK3A.nextAt = SK3A.charges < SK3A.max ? Date.now() + SK3A.rechargeMs : 0; try { showRadioText('ARTILLERY READY — PRESS G', false); } catch (e) {} }
    SK3A.barrages = SK3A.barrages.filter(function (b) { const el = now - b.t0; b.shells.forEach(function (s) { if (!s.whist && el >= s.at - 1250) { s.whist = true; sk3AWhistle(s); } if (!s.done && el >= s.at) { s.done = true; sk3AImpact(b, s); } }); return el < 9500; }); }
function sk3AWhistle(s) { if (!SK3D.ready) return; const x = sk3X(s.x), z = sk3Z(s.y), S = sk3SPlace(x, 30, z, { ref: 30, vol: .6, nodelay: true, max: 1500, muf: 300 }); if (!S) return; sk3STone(S, 1.25, 2100, 420, 'sine', .14, .3); sk3SNoise(S, 1.25, 3000, 900, 'bandpass', 4, .1, .5); }
function sk3AImpact(b, s) { SK3A.stats.shells++; createExplosion(s.x, s.y, 1.5); try { addShake(Math.max(0, 14 - Math.hypot(player.x - s.x, player.y - s.y) / 40)); } catch (e) {}
    const st = SK3D.st; if (st && SK3D.ready) { const x = sk3X(s.x), z = sk3Z(s.y), h = st.hgt ? st.hgt(x, z) : 0; for (let i = 0; i < 26; i++) st.dust.emit({ x: x + (Math.random() - .5) * 2, y: h + .3, z: z + (Math.random() - .5) * 2, vx: (Math.random() - .5) * 7, vy: 6 + Math.random() * 12, vz: (Math.random() - .5) * 7, life: 1.6 + Math.random(), s0: .6, s1: 3.2, c0: [.36, .3, .24, .85], c1: [.42, .38, .32, 0], g: 9, drag: .7 });
        for (let i = 0; i < 6; i++) st.smoke.emit({ x: x, y: h + 1, z: z, vx: (Math.random() - .5) * 2, vy: 1 + Math.random() * 2, vz: (Math.random() - .5) * 2, life: 7, s0: 2, s1: 8, c0: [.3, .28, .26, .6], c1: [.4, .38, .36, 0] });
        if (TK3.cam && TK3.cam.position.distanceTo(new THREE.Vector3(x, h, z)) < 60) TK3.shake = Math.max(TK3.shake || 0, .5); }
    try { if (typeof sk3InfBlast === 'function') sk3InfBlast(s.x, s.y, 85); } catch (e) {}
    if (!sk3AAuth()) return;
    // cover: houses, hedges, sandbags near the shell
    obstacles.forEach(function (o) { if (!SK3_HP[o.type] || o.sk3gone) return; const dx = Math.max(o.x - s.x, 0, s.x - (o.x + o.width)), dy = Math.max(o.y - s.y, 0, s.y - (o.y + o.height)); if (Math.hypot(dx, dy) < 60) sk3ObHit(o, Math.max(o.x, Math.min(o.x + o.width, s.x)), Math.max(o.y, Math.min(o.y + o.height, s.y)), 120); });
    // tanks: everyone in the blast, friend or foe
    const hit = function (t) { if (!t || t.destroyed) return; const d = Math.hypot(t.x - s.x, t.y - s.y); if (d > SK3A_R) return; const amt = Math.max(1, Math.round(SK3A_DMG * Math.max(.25, 1 - d / SK3A_R)));
        t.health -= amt; try { createDamageNumber(t, amt, t === player || allies.indexOf(t) >= 0 ? 'enemy' : 'player'); } catch (e) {} try { applyComponentDamage(t, amt, s.x, s.y); } catch (e) {} t.fireSmoke = Math.min(25, (t.fireSmoke || 0) + 5);
        if (t === player) { try { addDamageIndicator(Math.atan2(s.y - t.y, s.x - t.x)); } catch (e) {} } if (!sk3ADuel() && t.health <= 0) destroyTank(t); };
    if (sk3ADuel()) DUEL.tanks.forEach(hit); else [player].concat(allies, enemies).forEach(hit); }
// map view camera
function sk3AMapCam() { const cam = TK3.cam, hf = 58; if (cam.userData.hfov !== hf) { cam.userData.hfov = hf; tk3Aspect(); }
    const WW = SKIRMISH_WORLD_WIDTH * SK3D.S, H = (WW * .5 / Math.tan(hf / 2 * Math.PI / 180)) * 1.02 / SK3A.zoom, maxX = WW * .5 * (1 - 1 / SK3A.zoom), maxZ = SKIRMISH_WORLD_HEIGHT * SK3D.S * .5 * (1 - 1 / SK3A.zoom);
    SK3A.cx = Math.max(-maxX, Math.min(maxX, SK3A.cx)); SK3A.cz = Math.max(-maxZ, Math.min(maxZ, SK3A.cz));
    if (Math.abs(cam.near - H * .2) > 1) { cam.near = H * .2; cam.updateProjectionMatrix(); } // the depth buffer is coarse: keep near far out up here
    cam.position.set(SK3A.cx, H, SK3A.cz + H * .3); cam.lookAt(SK3A.cx, 0, SK3A.cz + H * .02); cam.updateMatrixWorld(); SK3D.camP = cam.position.clone(); SK3D.camT = new THREE.Vector3(SK3A.cx, 0, SK3A.cz); }
function sk3AVisible(e) { const now = performance.now(); if (now < (e.sk3Spot || 0) || now < (e.sk3Reveal || 0)) return true; const R = 1500;
    const fr = [player].concat(allies || []).filter(function (t) { return t && !t.destroyed; }); for (const f of fr) if (Math.hypot(f.x - e.x, f.y - e.y) < R) return true;
    if (typeof SK3I !== 'undefined') for (const m of SK3I.men) if (!m.dead && m.team === 0 && Math.hypot(m.x - e.x, m.y - e.y) < 1000) return true; return false; }
function sk3AHud() { const c = SK3D.hud, g = c.getContext('2d'), now = performance.now(); g.clearRect(0, 0, 1100, 700);
    const vg = g.createRadialGradient(550, 350, 300, 550, 350, 720); vg.addColorStop(0, 'rgba(10,14,8,0)'); vg.addColorStop(1, 'rgba(10,14,8,.55)'); g.fillStyle = vg; g.fillRect(0, 0, 1100, 700);
    // grid
    g.strokeStyle = 'rgba(220,240,200,.12)'; g.lineWidth = 1; for (let x = 0; x <= SKIRMISH_WORLD_WIDTH; x += 500) { const a = sk3AProj(x, 0), b = sk3AProj(x, SKIRMISH_WORLD_HEIGHT); if (a && b) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } }
    for (let y = 0; y <= SKIRMISH_WORLD_HEIGHT; y += 500) { const a = sk3AProj(0, y), b = sk3AProj(SKIRMISH_WORLD_WIDTH, y); if (a && b) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } }
    const mark = function (t, col, me) { const p = sk3AProj(t.x, t.y, 2); if (!p) return; const a = t.angle || 0; g.save(); g.translate(p[0], p[1]); g.rotate(a); g.fillStyle = col; g.strokeStyle = 'rgba(0,0,0,.8)'; g.lineWidth = 1.5; const s = me ? 9 : 7; g.beginPath(); g.moveTo(s, 0); g.lineTo(-s * .7, s * .65); g.lineTo(-s * .7, -s * .65); g.closePath(); g.fill(); g.stroke(); g.restore(); };
    const duel = sk3ADuel(), myTeam = duel ? duelTeam(DUEL.mySlot) : 0;
    if (typeof SK3I !== 'undefined') SK3I.men.forEach(function (m) { if (m.dead) return; if (m.team !== 0 && !sk3AVisible(m)) return; const p = sk3AProj(m.x, m.y, 1); if (!p) return; g.fillStyle = m.team === 0 ? '#8fc8ff' : '#ff8a70'; g.fillRect(p[0] - 1.5, p[1] - 1.5, 3, 3); });
    if (duel) DUEL.tanks.forEach(function (t, s) { if (!t || t.destroyed) return; const mine = duelTeam(s) === myTeam; if (!mine && !sk3AVisible(t)) return; mark(t, s === DUEL.mySlot ? '#ffe070' : mine ? '#6ab4ff' : '#ff5a3a', s === DUEL.mySlot); });
    else { (allies || []).forEach(function (t) { if (t && !t.destroyed) mark(t, '#6ab4ff'); }); (enemies || []).forEach(function (t) { if (t && !t.destroyed && sk3AVisible(t)) mark(t, '#ff5a3a'); }); if (player && !player.destroyed) mark(player, '#ffe070', true); }
    // barrages in the air / landing
    SK3A.barrages.forEach(function (b) { const p = sk3AProj(b.x, b.y), q = sk3AProj(b.x + 160, b.y); if (!p || !q) return; const r = Math.abs(q[0] - p[0]), el = now - b.t0; g.strokeStyle = 'rgba(255,150,60,' + (.5 + .4 * Math.sin(now / 120)) + ')'; g.lineWidth = 2; g.setLineDash([6, 5]); g.beginPath(); g.arc(p[0], p[1], r, 0, 6.3); g.stroke(); g.setLineDash([]);
        g.font = 'bold 12px "Special Elite", monospace'; g.textAlign = 'center'; g.fillStyle = '#ffb070'; g.fillText(el < 3500 ? 'SPLASH IN ' + Math.ceil((3500 - el) / 1000) : 'IMPACT', p[0], p[1] - r - 6); });
    // the aiming ring
    const gp = sk3AGround(SK3A.mx, SK3A.my); if (gp) { const p = [SK3A.mx, SK3A.my], q = sk3AProj(gp.x + 160, gp.y), r = q ? Math.abs(q[0] - p[0]) : 30, ok = SK3A.charges > 0;
        g.strokeStyle = ok ? '#ffd27a' : 'rgba(200,200,200,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(p[0], p[1], r, 0, 6.3); g.stroke(); g.beginPath(); g.moveTo(p[0] - r - 8, p[1]); g.lineTo(p[0] - 6, p[1]); g.moveTo(p[0] + 6, p[1]); g.lineTo(p[0] + r + 8, p[1]); g.moveTo(p[0], p[1] - r - 8); g.lineTo(p[0], p[1] - 6); g.moveTo(p[0], p[1] + 6); g.lineTo(p[0], p[1] + r + 8); g.stroke();
        g.font = 'bold 12px "Special Elite", monospace'; g.textAlign = 'left'; g.fillStyle = ok ? '#ffe6a8' : '#bbb'; g.fillText(Math.round(Math.hypot(gp.x - player.x, gp.y - player.y) * SK3D.S) + ' m', p[0] + r + 10, p[1] - 4); }
    // header
    g.fillStyle = 'rgba(14,16,10,.85)'; g.fillRect(0, 0, 1100, 54); g.fillStyle = '#ffe6a8'; g.textAlign = 'center'; g.font = '20px "Stardos Stencil", Impact, sans-serif'; g.fillText(SK3A.title || 'ARTILLERY — BATTLE MAP', 550, 24);
    g.font = '12px "Special Elite", monospace'; g.fillStyle = '#d8ccb0'; const rel = SK3A.nextAt ? ' · NEXT IN ' + Math.max(0, Math.ceil((SK3A.nextAt - Date.now()) / 1000)) + ' S' : '';
    g.fillText('BARRAGES: ' + '■'.repeat(SK3A.charges) + '□'.repeat(SK3A.max - SK3A.charges) + rel + '   ·   CLICK TO FIRE · W/A/S/D MOVE · WHEEL ZOOM · G / ESC / RIGHT-CLICK CLOSE', 550, 44);
    g.textAlign = 'left'; g.font = '11px "Special Elite", monospace'; [['#ffe070', 'YOU'], ['#6ab4ff', 'FRIENDLY'], ['#ff5a3a', 'ENEMY (SEEN)'], ['#8fc8ff', 'INFANTRY']].forEach(function (k, i) { g.fillStyle = k[0]; g.fillRect(16, 640 + i * 14, 8, 8); g.fillStyle = '#e8dcb8'; g.fillText(k[1], 30, 648 + i * 14); }); }
// HUD outside the map: artillery ready / reloading
function sk3AHudSmall() { if (!SK3D.hud || !player) return; const g = SK3D.hud.getContext('2d'); g.font = 'bold 11px "Special Elite", monospace'; g.textAlign = 'left'; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(12, 600, 170, 20);
    g.fillStyle = SK3A.charges > 0 ? '#ffd27a' : '#a8a090'; g.fillText('G ARTILLERY ' + '■'.repeat(SK3A.charges) + '□'.repeat(SK3A.max - SK3A.charges) + (SK3A.charges < SK3A.max && SK3A.nextAt ? ' ' + Math.max(0, Math.ceil((SK3A.nextAt - Date.now()) / 1000)) + 's' : ''), 18, 614); }
(function () {
    const _cam = sk3Camera; sk3Camera = function (st, dt) { if (SK3D.map && TK3.cam) { if (player && player.destroyed) sk3AOpen(false); else { const k = 160 * dt / SK3A.zoom; if (keys.w || keys.arrowup) SK3A.cz -= k; if (keys.s || keys.arrowdown) SK3A.cz += k; if (keys.a || keys.arrowleft) SK3A.cx -= k; if (keys.d || keys.arrowright) SK3A.cx += k; sk3AMapCam(); return; } } return _cam.apply(this, arguments); };
    // the commander is on the radio: the tank waits while the map is open
    const _mp = movePlayer; movePlayer = function () { if (SK3D.on && SK3D.map) { if (player) player.skV = (player.skV || 0) * .9; return; } return _mp.apply(this, arguments); };
    const _us = updateShells; updateShells = function () { const r = _us.apply(this, arguments); if (SK3D.on && gameRunning) try { sk3AStep(); } catch (e) { SK3A.err = e; } return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { if (SK3D.map) { sk3AHud(); if (typeof sk3QHud === 'function') sk3QHud(); } else sk3AHudSmall(); } catch (e) { SK3A.err = e; } return r; };
    const _st = sk3Start; sk3Start = function () { SK3A.charges = 1; SK3A.nextAt = Date.now() + SK3A.rechargeMs; SK3A.barrages = []; SK3D.map = false; return _st.apply(this, arguments); };
    const _stop = sk3Stop; sk3Stop = function () { sk3AOpen(false); SK3A.barrages = []; return _stop.apply(this, arguments); };
    const _bino = sk3Bino; sk3Bino = function (on) { if (on && SK3D.map) return; return _bino.apply(this, arguments); };
    if (typeof duelOnData === 'function') { const _od = duelOnData; duelOnData = function (m, c) { if (m && (m.t === 'art' || m.t === 'arts')) { DUEL.lastRx = Date.now(); if (c) c.lastRx = Date.now();
            if (m.t === 'art' && DUEL.role === 'host' && c && c.slot > 0) { const seed = (Math.random() * 1e9) | 0; sk3AStart(m.x, m.y, seed, c.slot); duelBroadcast({ t: 'arts', x: m.x, y: m.y, seed: seed, s: c.slot }); }
            else if (m.t === 'arts' && DUEL.role !== 'host') sk3AStart(m.x, m.y, m.seed, m.s); return; } return _od.apply(this, arguments); }; }
    // input while the map is open (captured before the gun and camera handlers)
    const inMap = function () { return SK3D.on && SK3D.map; };
    window.addEventListener('mousemove', function (e) { if (!inMap() || !TK3.cv) return; const r = TK3.cv.getBoundingClientRect(); SK3A.mx = (e.clientX - r.left) * 1100 / r.width; SK3A.my = (e.clientY - r.top) * 700 / r.height; e.stopImmediatePropagation(); }, true);
    window.addEventListener('mousedown', function (e) { if (!inMap()) return; const r = TK3.cv.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return; e.preventDefault(); e.stopImmediatePropagation(); SK3A.mx = (e.clientX - r.left) * 1100 / r.width; SK3A.my = (e.clientY - r.top) * 700 / r.height; if (e.button === 0) sk3ACall(); else if (e.button === 2) sk3AOpen(false); }, true);
    window.addEventListener('wheel', function (e) { if (!inMap()) return; e.preventDefault(); e.stopImmediatePropagation(); SK3A.zoom = Math.max(1, Math.min(4, SK3A.zoom * Math.exp(-e.deltaY * .0015))); }, { capture: true, passive: false });
    window.addEventListener('keydown', function (e) { if (!SK3D.on || e.repeat) return; const tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) return; const k = e.key.toLowerCase();
        if (k === 'g') { e.preventDefault(); sk3AOpen(!SK3D.map); } else if (k === 'escape' && SK3D.map) { e.preventDefault(); e.stopImmediatePropagation(); sk3AOpen(false); } else if (SK3D.map && (k === ' ' || k === 'q')) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
})();
