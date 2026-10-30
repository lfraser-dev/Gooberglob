// ===== EXECUTION TEST RANGE: 1v1 vs a single AI, endless respawns =====
(function () {
    const EXT = window.EXT = { on: false, pending: false, vi: -1 };
    const ALL = []; function fill() { if (ALL.length) return; ['british', 'german', 'soviet', 'american'].forEach(function (f) { Object.keys(tanks[f] || {}).forEach(function (k) { const d = tanks[f][k]; if (d && TK3_TSPEC[d.model]) ALL.push({ f: f, k: k, d: d }); }); }); }
    EXT.ALL = ALL;
    function hud() { let h = document.getElementById('extHud'); if (!h) { h = document.createElement('div'); h.id = 'extHud'; h.style.cssText = 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:60;padding:9px 16px;border-radius:12px;background:rgba(20,14,10,.82);border:1px solid rgba(255,140,100,.45);color:#f3e8cc;font:12px "Special Elite",monospace;letter-spacing:.12em;pointer-events:none;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.5);'; document.body.appendChild(h); } return h; }
    function setHud() { const h = hud(); const e = enemies[0]; h.innerHTML = '<b style="color:#ff8a66">🎯 EXECUTION TEST</b> &nbsp;·&nbsp; YOU: ' + (player ? player.name : '') + ' &nbsp;·&nbsp; ENEMY: ' + (e ? e.name : '…') + '<br><span style="opacity:.75">T change your tank &nbsp; V next enemy &nbsp; K weaken enemy &nbsp; F execute (enemy under 30%)</span>'; }
    setInterval(function () { const h = document.getElementById('extHud'); const show = EXT.on && typeof gameRunning !== 'undefined' && gameRunning && !(window.EXE && EXE.on); if (h) h.style.display = show ? 'block' : 'none'; if (show) setHud(); }, 400);
    // spawn a single victim in front of the player
    function spawnVictim(next) { fill(); if (next || EXT.vi < 0) EXT.vi = (EXT.vi + 1) % ALL.length; let v = ALL[EXT.vi]; if (v.d.model === player.model && ALL.length > 1) { EXT.vi = (EXT.vi + 1) % ALL.length; v = ALL[EXT.vi]; }
        _ce(); enemies.length = Math.min(enemies.length, 1); const e = enemies[0]; if (!e) return; const d = v.d;
        Object.assign(e, { name: d.name, model: d.model, faction: v.f, className: d.className, health: Math.round(d.health * .45), maxHealth: d.health, speed: d.speed * .7, damage: Math.round(d.damage * .5), reload: d.reload + 600, size: d.size, armor: d.armor, abilityType: null, abilityCooldownUntil: Date.now() + 1e9, aiRole: v.k, destroyed: false, burning: false });
        let sp = null; const W = (typeof canvas !== 'undefined' ? canvas.width : 2400), H = (typeof canvas !== 'undefined' ? canvas.height : 1200);
        const tx = Math.max(80, Math.min(W - 80, player.x + 420)), ty = Math.max(80, Math.min(H - 80, player.y)); try { sp = findSpawnPoint([tx, ty], d.size, null, 'enemy'); } catch (x) {} sp = sp || { x: tx, y: ty }; e.x = sp.x; e.y = sp.y; e.angle = e.turretAngle = Math.atan2(player.y - e.y, player.x - e.x);
        try { applyAIDiff(e); } catch (x) {} e.health = Math.round(e.maxHealth * .45); try { updateUI(); } catch (x) {} setHud(); }
    // allies off, one enemy only
    const _ca = createAllies; createAllies = function () { const r = _ca.apply(this, arguments); if (EXT.on) allies = []; return r; };
    const _ce = createEnemies; createEnemies = function () { if (!EXT.on) return _ce.apply(this, arguments); spawnVictim(false); };
    const _sg = startGame; startGame = function () { EXT.on = EXT.pending; EXT.pending = false; return _sg.apply(this, arguments); };
    // never run out of enemies, never die
    const _cg = checkGameState; checkGameState = function () { if (EXT.on && gameRunning && player) { if (!enemies.length && !EXT.wait) { EXT.wait = 1; setTimeout(function () { EXT.wait = 0; if (EXT.on && gameRunning && !enemies.length) { spawnVictim(true); showRadioText('NEW TARGET: ' + enemies[0].name, false); } }, 1600); } if (!enemies.length) return; if (player.health < player.maxHealth * .3) player.health = player.maxHealth; } return _cg.apply(this, arguments); };
    const _dt = destroyTank; destroyTank = function (t) { if (EXT.on && t === player) { t.health = t.maxHealth; return; } return _dt.apply(this, arguments); };
    function swapPlayer() { fill(); let i = ALL.findIndex(function (v) { return v.d.model === player.model; }); i = (i + 1) % ALL.length; const v = ALL[i], d = v.d;
        Object.assign(player, { name: d.name, model: d.model, faction: v.f, className: d.className, health: d.health, maxHealth: d.health, speed: d.speed, damage: d.damage, reload: d.reload, size: d.size, armor: d.armor, missileAbility: d.ability || null, abilityCooldownUntil: 0 }); try { player.abilityType = getTankAbility(d); } catch (x) {}
        selectedFaction = v.f; selectedTankClass = v.k; try { document.getElementById('tankName').textContent = d.name; updateUI(); } catch (x) {} try { showRadioText('NOW DRIVING: ' + d.name.toUpperCase(), false); } catch (x) {} setHud(); }
    window.addEventListener('keydown', function (ev) { if (!EXT.on || !gameRunning || (window.EXE && EXE.on) || ev.repeat) return; const k = ev.key.toLowerCase();
        if (k === 't') { swapPlayer(); ev.preventDefault(); } else if (k === 'v') { spawnVictim(true); ev.preventDefault(); } else if (k === 'k') { const e = enemies[0]; if (e) { e.health = Math.max(1, Math.round(e.maxHealth * .2)); try { createExplosion(e.x, e.y, 1); } catch (x) {} } ev.preventDefault(); } }, true);
    window.exeTestStart = function () { if (!selectedFaction) chooseFaction('german'); if (!selectedTankClass) { selectedTankClass = Object.keys(tanks[selectedFaction])[1] || Object.keys(tanks[selectedFaction])[0]; } if (!selectedMap) chooseMap('town'); EXT.vi = -1; EXT.pending = true; startGame(); };
    // the button on the skirmish screen
    try { const sk = document.getElementById('skirmishScreen'), pb = sk && sk.querySelector('.primaryBtn'); if (pb) { const b = document.createElement('button'); b.className = 'ghostBtn'; b.id = 'exeTestBtn'; b.innerHTML = '🎯 1V1 EXECUTION TEST'; b.style.cssText = 'margin-top:12px;border-color:rgba(255,120,90,.7);color:#ffb59a;'; b.onclick = window.exeTestStart; pb.insertAdjacentElement('afterend', b); } } catch (x) {}
})();
