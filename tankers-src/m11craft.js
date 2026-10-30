/* =====================================================
   MISSION 11 — scrounging + crafting: search the castle for odds and ends, make escape tools
   C craft · F search · E shiv takedown · 1-4 pick a throwable / the zip gun · click to use
===================================================== */
const M11_MATS = {
    scrap: { n: 'SCRAP METAL', c: '#9a9a8a' }, cloth: { n: 'BLANKET STRIPS', c: '#7a6a5a' }, wire: { n: 'WIRE', c: '#b0a070' }, wood: { n: 'BED SLATS', c: '#8a6a40' },
    nails: { n: 'NAILS', c: '#8a8a90' }, pipe: { n: 'BED-FRAME TUBE', c: '#6a7078' }, match: { n: 'MATCHES', c: '#d06040' }, sugar: { n: 'SUGAR', c: '#e8e4d8' },
    tin: { n: 'EMPTY TIN', c: '#b8b8c0' }, polish: { n: 'BOOT POLISH', c: '#2a2a30' }, cigs: { n: 'CIGARETTES', c: '#e0d0b0' }, choc: { n: 'CHOCOLATE', c: '#6a3a20' }, pills: { n: 'SLEEPING PILLS', c: '#d0e0f0' }, blank: { n: 'BLANK AUSWEIS', c: '#d8d0b0' }, tunic: { n: 'HALF-SEWN TUNIC', c: '#5e6656' } };
const M11_RECIPES = [
    { id: 'pass', n: 'FORGED PASS', need: { blank: 1, polish: 1, wood: 1 }, gives: 1, kit: 'papers', d: 'Boot-polish ink and an eagle carved in a bed slat. Shown at the main gate, in uniform.' },
    { id: 'uniform', n: 'GERMAN UNIFORM', need: { tunic: 1, cloth: 1, scrap: 1 }, gives: 1, kit: 'uniform', d: 'Finish the tunic: a blanket collar, tin buttons. Put it on with U.' },
    { id: 'rope', n: 'BEDSHEET ROPE', need: { cloth: 3 }, gives: 1, kit: 'rope', d: 'Knotted blanket strips. Gets you over the park wall beyond the wire.' },
    { id: 'shiv', n: 'SHIV', need: { scrap: 1, cloth: 1 }, gives: 2, d: 'E behind an unaware goon: a silent takedown. Two uses. Bodies get found.' },
    { id: 'zip', n: 'ZIP GUN', need: { pipe: 1, wood: 1, nails: 1, match: 1 }, gives: 2, d: 'A bed-frame tube and a nail for a firing pin. Two shots. Drops a goon — and every guard nearby hears it.' },
    { id: 'pick', n: 'LOCKPICK', need: { wire: 1, scrap: 1 }, gives: 1, d: 'Opens the terrace door without the key, and the locked cupboards in the guard room.' },
    { id: 'cutters', n: 'WIRE CUTTERS', need: { scrap: 2, wood: 1, wire: 1 }, gives: 1, kit: 'cutters', d: 'Two hinges, a bed slat and wire binding. They bite through the park wire.' },
    { id: 'smoke', n: 'SMOKE BOMB', need: { sugar: 1, match: 1, tin: 1 }, gives: 1, d: 'Sugar and match-heads in a tin. Throw it: a cloud nobody can see through for ten seconds.' },
    { id: 'rattle', n: 'TIN RATTLE', need: { tin: 1, nails: 1 }, gives: 2, d: 'Throw it and the clatter draws the goons nearby to look.' },
    { id: 'biscuit', n: 'DOPED CHOCOLATE', need: { choc: 1, pills: 1 }, gives: 1, d: 'Throw it near the Alsatian. Sweet dreams, Rex.' },
    { id: 'dummy', n: 'ROLL-CALL DUMMY', need: { cloth: 2, wood: 1, polish: 1 }, gives: 1, d: 'A head of plaster and boot-polish hair on a frame. Stand it in the ranks (F) and it answers one roll call for you.' },
    { id: 'bribe', n: 'BRIBE', need: { cigs: 1, choc: 1 }, gives: 1, d: 'F face to face: he looks away for 30s. The arch sentry lets you through.' }];
const M11_HOT = ['zip', 'smoke', 'rattle', 'biscuit'];
const M11_SEARCH = [ // hiding places; each gives a fixed haul + one random bit
    { x: 662, y: 465, n: 'BUNK', g: ['cloth', 'wood'] }, { x: 662, y: 585, n: 'BUNK', g: ['cloth', 'wood'] }, { x: 745, y: 480, n: 'MESS TABLE', g: ['cigs', 'match'] }, { x: 790, y: 735, n: 'STOVE', g: ['polish', 'tin'] },
    { x: 655, y: 335, n: 'PROP BOX', g: ['cloth', 'polish', 'wire'] }, { x: 1020, y: 220, n: 'COSTUME RACK', g: ['cloth', 'scrap'] },
    { x: 1700, y: 205, n: 'CANTEEN KITCHEN', g: ['sugar', 'tin', 'match'] }, { x: 1235, y: 270, n: 'CANTEEN TABLE', g: ['choc', 'tin'] },
    { x: 1700, y: 450, n: 'CANDLE BOX', g: ['match', 'wire'] }, { x: 1700, y: 790, n: 'FIRST-AID BOX', g: ['pills', 'cloth'] }, { x: 1515, y: 600, n: 'ORGAN', g: ['pipe', 'wire'] },
    { x: 720, y: 925, n: 'TOOL BENCH', g: ['scrap', 'nails', 'wire'] }, { x: 650, y: 960, n: 'RED CROSS PARCELS', g: ['choc', 'sugar', 'cigs'] }, { x: 1000, y: 1010, n: 'TOOL BOARD', g: ['pipe', 'scrap'] },
    { x: 1420, y: 790, n: 'RUBBISH BIN', g: ['tin', 'nails'] }, { x: 900, y: 790, n: 'WOODPILE', g: ['wood', 'nails'] },
    { x: 1300, y: 950, n: 'GUARD-ROOM DESK', g: ['cigs', 'pills'], ger: 1 }, { x: 1580, y: 960, n: 'LOCKED CUPBOARD', g: ['wire', 'scrap', 'match'], ger: 1, locked: 1 },
    { x: 975, y: 1270, n: 'LORRY', g: ['pipe', 'wire', 'scrap'], ger: 1 }, { x: 1440, y: 1185, n: 'CRATES', g: ['nails', 'wood'], ger: 1 }, { x: 840, y: 1175, n: 'WOODPILE', g: ['wood', 'match'], ger: 1 }];
function m11CraftInit(M) { M.mat = {}; M.tools = {}; M.hot = 0; M.craftOpen = false; M.smokes = []; M.proj = []; M.dummy = null; M.searches = M11_SEARCH.map(function (s, i) { return Object.assign({ done: false, i: i }, s); }); M.mx = 550; M.my = 350; M.craftMsg = ''; }
function m11HasMats(r) { const M = M11; return Object.keys(r.need).every(function (k) { return (M.mat[k] || 0) >= r.need[k]; }); }
function m11Craft(r) { const M = M11; if (!m11HasMats(r)) { M.craftMsg = 'NOT ENOUGH ODDS AND ENDS FOR THE ' + r.n + '.'; try { playTone(200, 160, .1, .03, 'square'); } catch (e) {} return; }
    Object.keys(r.need).forEach(function (k) { M.mat[k] -= r.need[k]; }); M.tools[r.id] = (M.tools[r.id] || 0) + r.gives; M.craftMsg = r.n + ' MADE.' + (M11_HOT.indexOf(r.id) >= 0 ? ' SELECT IT WITH ' + (M11_HOT.indexOf(r.id) + 1) + ', CLICK TO USE.' : '');
    if (r.kit) { if (M.p.has[r.kit]) { M.craftMsg = 'YOU ALREADY HAVE THAT.'; Object.keys(r.need).forEach(function (k) { M.mat[k] += r.need[k]; }); M.tools[r.id] -= r.gives; return; } M.p.has[r.kit] = true; } try { playTone(500, 700, .08, .04, 'square'); setTimeout(function () { try { playTone(700, 900, .08, .04, 'square'); } catch (e) {} }, 120); } catch (e) {} }
function m11Ready(id) { return (M11.tools[id] || 0) > 0; }
/* what can F do here (searching, bribing, the dummy, picking locks) — checked before the main kit */
function m11CraftAct(P, M, now) {
    // bribe a goon who's looking at you
    if (m11Ready('bribe')) { const g = M.guards.find(function (g) { return !g.down && g.state !== 'chase' && !M.alarm && Math.hypot(g.x - P.x, g.y - P.y) < 52 && m8AngDiff(Math.atan2(P.y - g.y, P.x - g.x), g.ang) < 1.2 && !(g.bribedUntil > now); }); if (g) return { k: 'bribe', g: g, need: .9, label: 'HOLD F — SLIP HIM THE CIGARETTES', sus: 0 }; }
    // the dummy in the ranks
    if (m11Ready('dummy') && !M.dummy && m11In(M11_APPELL, P.x, P.y)) return { k: 'dummy', need: 1.2, label: 'HOLD F — STAND THE DUMMY IN THE RANKS', sus: 1.6 };
    // lockpicking the terrace door
    if (!M.tdoorOpen && !P.has.key && m11Ready('pick') && Math.hypot(P.x - 600, P.y - 705) < 50) return { k: 'tdoorPick', need: 3.2, label: 'HOLD F — PICK THE LOCK', sus: 2 };
    // searching
    let best = null, bd = 46; M.searches.forEach(function (s) { if (s.done) return; const d = Math.hypot(P.x - s.x, P.y - s.y); if (d < bd) { bd = d; best = s; } });
    if (best) { if (best.locked && !m11Ready('pick')) return { k: 'none', label: 'LOCKED CUPBOARD. A LOCKPICK WOULD OPEN IT.' }; return { k: 'search', s: best, need: best.locked ? 2.2 : 1.1, label: 'HOLD F — SEARCH THE ' + best.n, sus: best.ger ? 2 : 1.1 }; }
    return null;
}
function m11CraftDo(act, now) {
    const M = M11, P = M.p;
    if (act.k === 'search') { const s = act.s; s.done = true; const got = s.g.slice(); const extra = ['nails', 'scrap', 'cloth', 'tin', 'match', 'wood', 'wire'][Math.floor(Math.random() * 7)]; if (Math.random() < .6) got.push(extra); got.forEach(function (k) { M.mat[k] = (M.mat[k] || 0) + 1; }); try { playTone(700, 900, .06, .03, 'triangle'); } catch (e) {}
        const names = {}; got.forEach(function (k) { names[k] = (names[k] || 0) + 1; }); m11Say('FOUND: ' + Object.keys(names).map(function (k) { return M11_MATS[k].n + (names[k] > 1 ? ' ×' + names[k] : ''); }).join(', ') + '. (C TO CRAFT)', 3200); m11Float(s.x, s.y, '+' + got.length, '#c8f0a0'); }
    if (act.k === 'bribe') { M.tools.bribe--; act.g.bribedUntil = now + 30000; act.g.sus = 0; m11Float(act.g.x, act.g.y, act.g.name === 'gate' ? 'Schnell, durch! Ich hab nichts gesehen.' : 'Ich habe nichts gesehen...', '#c8f0a0'); if (act.g.name === 'gate' && !act.g.main) { M.archBribed = now + 20000; m11Say('THE ARCH SENTRY POCKETS THE CIGARETTES AND UNBOLTS THE GATE — 20 SECONDS.', 3200); } else m11Say('HE LOOKS THE OTHER WAY FOR HALF A MINUTE.', 2400); }
    if (act.k === 'dummy') { M.tools.dummy--; M.dummy = { x: P.x, y: P.y }; m11Say('THE DUMMY STANDS IN THE BACK RANK. IT WILL ANSWER THE NEXT ROLL CALL FOR YOU.', 3600); }
    if (act.k === 'tdoorPick') { M.tdoorOpen = true; M.nav = null; m11Say('THE LOCK GIVES. THE TERRACE DOOR SWINGS OPEN.', 2600); try { playTone(900, 700, .1, .03, 'square'); } catch (e) {} }
}
/* E: shiv takedown from behind */
function m11Takedown() { const M = M11, P = M.p, now = performance.now(); if (M.lost || M.won || M.craftOpen) return; if (!m11Ready('shiv')) { m11Say('YOU NEED A SHIV FOR THAT (C TO CRAFT).', 1600); return; }
    const g = M.guards.find(function (g) { return !g.down && g.state !== 'chase' && Math.hypot(g.x - P.x, g.y - P.y) < 34 && m8AngDiff(Math.atan2(P.y - g.y, P.x - g.x), g.ang) > 1.9; });
    if (!g) { const near = M.guards.find(function (g) { return !g.down && Math.hypot(g.x - P.x, g.y - P.y) < 40; }); m11Say(near ? 'GET BEHIND HIM FIRST.' : 'NOBODY CLOSE ENOUGH.', 1400); return; }
    g.down = true; g.downAt = now; g.deathAng = Math.atan2(g.y - P.y, g.x - P.x); M.tools.shiv--; M.kills = (M.kills || 0) + 1; m11Float(g.x, g.y, 'Hrrk—', '#ff9a70'); try { playTone(160, 80, .12, .04, 'triangle'); } catch (e) {} if (g.dog) { M.dog.sleep = true; } }
/* click: use the selected throwable or the zip gun */
function m11Use(now) { const M = M11, P = M.p; if (M.lost || M.won || M.craftOpen) return; const id = M11_HOT[M.hot]; if (!m11Ready(id)) { m11Say('NO ' + (M11_RECIPES.find(function (r) { return r.id === id; }) || { n: id }).n + ' — CRAFT ONE (C) OR PICK ANOTHER (1-4).', 1800); return; }
    const wx = M.mx / M11Z + M.cam.x, wy = M.my / M11Z + M.cam.y, a = Math.atan2(wy - P.y, wx - P.x);
    if (id === 'zip') { M.tools.zip--; M.proj.push({ k: 'bullet', x: P.x, y: P.y, vx: Math.cos(a) * 22, vy: Math.sin(a) * 22, life: 18 }); M.fx.push({ k: 'flash', x: P.x + Math.cos(a) * 14, y: P.y + Math.sin(a) * 14, t: now }); M.shake = 4; try { playTone(240, 70, .2, .1, 'sawtooth'); } catch (e) {} m11Alert(P.x, P.y, 520); return; }
    const d = Math.min(280, Math.hypot(wx - P.x, wy - P.y)); M.tools[id]--; M.proj.push({ k: id, sx: P.x, sy: P.y, ex: P.x + Math.cos(a) * d, ey: P.y + Math.sin(a) * d, t0: now, dur: 260 + d * 1.6 }); try { playTone(500, 300, .08, .03, 'triangle'); } catch (e) {} }
function m11Alert(x, y, r) { const M = M11; M.guards.forEach(function (g) { if (g.down || g.state === 'chase') return; const d = Math.hypot(g.x - x, g.y - y); if (d < r) { if (r > 400) { g.state = 'hunt'; g.ix = x; g.iy = y; g.searchUntil = 0; } else { g.state = 'look'; g.ix = x + (Math.random() - .5) * 30; g.iy = y + (Math.random() - .5) * 30; g.lookUntil = performance.now() + 7000; g.searchUntil = 0; } } }); if (r > 400) { M.alarm = true; M.alarmEver = true; M.alarmUntil = performance.now() + 30000; M.lastSeen = { x: x, y: y, t: performance.now() }; m11Say('A SHOT IN THE NIGHT — THE GUARDS ARE COMING TO SEE!', 2600); } }
function m11CraftUpdate(dt, now) {
    const M = M11;
    M.proj = M.proj.filter(function (p) {
        if (p.k === 'bullet') { for (let s = 0; s < 3; s++) { p.x += p.vx * dt / 3; p.y += p.vy * dt / 3; if (m11Blocked(p.x, p.y, 2, 'g')) { p.life = 0; break; } const g = M.guards.find(function (g) { return !g.down && Math.hypot(g.x - p.x, g.y - p.y) < 13; }); if (g) { g.down = true; g.downAt = now; g.deathAng = Math.atan2(p.vy, p.vx); M.kills = (M.kills || 0) + 1; p.life = 0; m11Float(g.x, g.y, 'AARGH!', '#ff9a70'); if (g.dog) M.dog.sleep = true; break; } } p.life -= dt; return p.life > 0; }
        const k = (now - p.t0) / p.dur; if (k < 1) { p.x = p.sx + (p.ex - p.sx) * k; p.y = p.sy + (p.ey - p.sy) * k; p.h = Math.sin(k * Math.PI) * 40; return true; }
        p.x = p.ex; p.y = p.ey;
        if (p.k === 'smoke') { M.smokes.push({ x: p.x, y: p.y, t: now, r: 95 }); try { playTone(300, 200, .4, .03, 'triangle'); } catch (e) {} }
        if (p.k === 'rattle') { M.fx.push({ k: 'ping', x: p.x, y: p.y, t: now }); try { playTone(1500, 1300, .05, .03, 'square'); setTimeout(function () { try { playTone(1300, 1200, .05, .03, 'square'); } catch (e) {} }, 90); } catch (e) {} m11Alert(p.x, p.y, 430); }
        if (p.k === 'biscuit') { M.treats = (M.treats || []); M.treats.push({ x: p.x, y: p.y, t: now }); }
        return false; });
    M.smokes = M.smokes.filter(function (s) { return now - s.t < 11000; });
    // the dog finds the doped chocolate
    if (M.treats && M.treats.length && !M.dog.sleep) { const D = M.dog, T = M.treats[0]; if (Math.hypot(T.x - D.x, T.y - D.y) < 320) { D.eating = T; } }
    // goons stumbling on bodies
    M.guards.forEach(function (g) { if (g.down || g.state === 'chase') return; M.guards.forEach(function (b) { if (!b.down || b.found) return; const d = Math.hypot(b.x - g.x, b.y - g.y); if (d < 200 && m8AngDiff(Math.atan2(b.y - g.y, b.x - g.x), g.ang) < .8 && m11LOS(g.x, g.y, b.x, b.y)) { b.found = true; m11Float(g.x, g.y, 'Mein Gott — ALARM!', '#ff8a70'); m11Alarm(b.x, b.y, 'THEY\'VE FOUND A BODY! THE WHOLE CASTLE IS ON ALERT!'); } }); });
}
function m11SmokeLOS(x0, y0, x1, y1) { const now = performance.now(); return !(M11.smokes || []).some(function (s) { const a = now - s.t; if (a < 400) return false; const r = s.r * Math.min(1, a / 1200) * Math.min(1, (11000 - a) / 2000); return m8SegDist(x0, y0, x1, y1, s.x, s.y) < r * .8; }); }
/* ---------- drawing ---------- */
function m11MatIcon(k, x, y, s) { const c = M11_MATS[k].c; ctx.save(); ctx.translate(x, y); ctx.scale(s || 1, s || 1);
    if (k === 'scrap') { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(-2, -7); ctx.lineTo(7, -3); ctx.lineTo(5, 6); ctx.fill(); ctx.fillStyle = '#5a5a50'; ctx.fillRect(-2, -2, 3, 3); }
    else if (k === 'cloth') { ctx.fillStyle = c; ctx.fillRect(-8, -6, 16, 12); ctx.strokeStyle = '#4a3a2a'; ctx.beginPath(); ctx.moveTo(-8, -2); ctx.lineTo(8, -2); ctx.moveTo(-8, 2); ctx.lineTo(8, 2); ctx.stroke(); }
    else if (k === 'wire') { ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 3; i++) ctx.ellipse(0, 0, 7 - i * 2, 5 - i, 0, 0, 7); ctx.stroke(); }
    else if (k === 'wood') { ctx.fillStyle = c; ctx.fillRect(-9, -3, 18, 6); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-9, 0, 18, 1); }
    else if (k === 'nails') { ctx.strokeStyle = c; ctx.lineWidth = 1.6; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * 4, -7); ctx.lineTo(i * 4 + 1, 7); ctx.stroke(); ctx.fillStyle = c; ctx.fillRect(i * 4 - 2, -8, 4, 2); } }
    else if (k === 'pipe') { ctx.fillStyle = c; ctx.fillRect(-9, -3, 18, 6); ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.ellipse(9, 0, 1.5, 3, 0, 0, 7); ctx.fill(); }
    else if (k === 'match') { ctx.fillStyle = '#c0a060'; ctx.fillRect(-7, -5, 14, 10); ctx.fillStyle = c; ctx.fillRect(-7, -5, 14, 3); }
    else if (k === 'sugar') { ctx.fillStyle = c; ctx.fillRect(-6, -7, 12, 14); ctx.fillStyle = '#3a6aa0'; ctx.fillRect(-6, -2, 12, 4); }
    else if (k === 'tin') { m8Disc(ctx, 0, 0, 7, '#6a6a70', c); ctx.fillStyle = '#c02a20'; ctx.fillRect(-7, -2, 14, 4); }
    else if (k === 'polish') { m8Disc(ctx, 0, 0, 7, '#0a0a0a', '#4a4a50'); ctx.fillStyle = '#c0a060'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, 7); ctx.fill(); }
    else if (k === 'cigs') { ctx.fillStyle = '#d8d0b0'; ctx.fillRect(-7, -6, 14, 12); ctx.fillStyle = '#c02a20'; ctx.fillRect(-7, -6, 14, 4); }
    else if (k === 'choc') { ctx.fillStyle = c; ctx.fillRect(-8, -5, 16, 10); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.strokeRect(-8, -5, 16, 10); ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.stroke(); ctx.fillStyle = '#5a3aa0'; ctx.fillRect(-8, -5, 6, 10); }
    else if (k === 'blank') { ctx.fillStyle = c; ctx.fillRect(-8, -6, 16, 12); ctx.fillStyle = '#8a8a8a'; ctx.fillRect(-6, -4, 5, 7); }
    else if (k === 'tunic') { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(8, -6); ctx.lineTo(9, 7); ctx.lineTo(-9, 7); ctx.fill(); ctx.strokeStyle = '#d8d0b8'; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 7); ctx.stroke(); ctx.setLineDash([]); }
    else if (k === 'pills') { ctx.fillStyle = '#5a3a20'; ctx.fillRect(-5, -7, 10, 14); ctx.fillStyle = c; ctx.fillRect(-4, -3, 8, 6); }
    ctx.restore(); }
function m11ToolIcon(id, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s || 1, s || 1); ctx.lineCap = 'round';
    if (id === 'pass') { ctx.rotate(-.15); ctx.fillStyle = '#d8d0b0'; ctx.fillRect(-9, -6, 18, 12); ctx.fillStyle = '#5a6a8a'; ctx.fillRect(-7, -4, 6, 7); ctx.strokeStyle = '#6a3a9a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(4, 1, 3.4, 0, 7); ctx.stroke(); }
    if (id === 'uniform') { ctx.fillStyle = '#5e6656'; ctx.fillRect(-9, -7, 18, 14); ctx.fillStyle = '#2a2c26'; ctx.fillRect(-2, -7, 4, 14); ctx.fillStyle = '#c0b080'; ctx.fillRect(-7, -5, 4, 2); ctx.fillStyle = '#c8c8c0'; for (let i = 0; i < 3; i++) ctx.fillRect(3, -4 + i * 4, 2, 2); }
    if (id === 'rope') { ctx.strokeStyle = '#c8bca0'; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 3; i++) ctx.ellipse(0, 0, 8 - i * 2.4, 6 - i * 1.6, 0, 0, 7); ctx.stroke(); ctx.fillStyle = '#a89878'; ctx.beginPath(); ctx.arc(7, 4, 2.4, 0, 7); ctx.fill(); }
    if (id === 'shiv') { ctx.strokeStyle = '#c8c8c0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-2, 2); ctx.lineTo(9, -9); ctx.stroke(); ctx.strokeStyle = '#7a6a5a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-9, 9); ctx.lineTo(-2, 2); ctx.stroke(); }
    if (id === 'zip') { ctx.fillStyle = '#6a7078'; ctx.fillRect(-4, -4, 16, 5); ctx.fillStyle = '#8a6a40'; ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(-2, -4); ctx.lineTo(-4, 9); ctx.lineTo(-10, 8); ctx.fill(); ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-6, -4); ctx.lineTo(-8, -9); ctx.stroke(); }
    if (id === 'pick') { ctx.strokeStyle = '#b0a070'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-9, 4); ctx.lineTo(7, 4); ctx.lineTo(9, 0); ctx.moveTo(-9, -3); ctx.lineTo(8, -3); ctx.stroke(); }
    if (id === 'cutters') { ctx.strokeStyle = '#9a9a8a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(6, 2); ctx.moveTo(-9, 6); ctx.lineTo(6, -2); ctx.stroke(); }
    if (id === 'smoke') { m8Disc(ctx, 0, 2, 7, '#6a6a70', '#b8b8c0'); ctx.strokeStyle = '#d06040'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -5); ctx.quadraticCurveTo(4, -9, 2, -12); ctx.stroke(); }
    if (id === 'rattle') { m8Disc(ctx, 0, 0, 7, '#6a6a70', '#b8b8c0'); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(-1, -9, 2, 4); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(0, 0, 10, -.5, .5); ctx.stroke(); }
    if (id === 'biscuit') { m11MatIcon('choc', 0, 0, 1); ctx.fillStyle = '#d0e0f0'; ctx.beginPath(); ctx.arc(5, -5, 2.6, 0, 7); ctx.fill(); }
    if (id === 'dummy') { ctx.fillStyle = '#6a6040'; ctx.beginPath(); ctx.ellipse(0, 4, 7, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#e0d8c8'; ctx.beginPath(); ctx.arc(0, -5, 5, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(0, -6, 5, Math.PI, 0); ctx.fill(); }
    if (id === 'bribe') { m11MatIcon('cigs', -3, 0, .8); m11MatIcon('choc', 4, 3, .7); }
    ctx.restore(); }
function m11CraftDrawWorld(now) { const M = M11;
    M.searches.forEach(function (s) { if (s.done) return; const p = .5 + .5 * Math.sin(now / 500 + s.i); ctx.save(); ctx.translate(s.x, s.y); ctx.strokeStyle = 'rgba(' + (s.ger ? '255,170,120,' : '200,230,255,') + (.18 + p * .22) + ')'; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(0, 0, 11 + p * 2, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(220,235,255,' + (.35 + p * .3) + ')'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.fillText(s.locked ? '¤' : '?', 0, 4); ctx.restore(); });
    if (M.dummy) { ctx.save(); ctx.translate(M.dummy.x, M.dummy.y); m11DrawPow({ x: 0, y: 0, ang: -Math.PI / 2, moving: false, coat: '#6a6040', seed: 7 }, now); ctx.restore(); }
    (M.treats || []).forEach(function (T) { m11MatIcon('choc', T.x, T.y, .7); });
    M.proj.forEach(function (p) { if (p.k === 'bullet') { ctx.strokeStyle = 'rgba(255,240,180,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * .6, p.y - p.vy * .6); ctx.stroke(); return; } ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 5, 3, 0, 0, 7); ctx.fill(); m11ToolIcon(p.k, p.x, p.y - (p.h || 0), .8); });
    M.fx.forEach(function (f) { if (f.k === 'ping') { const k = (now - f.t) / 600; if (k < 1) { ctx.strokeStyle = 'rgba(255,240,200,' + (1 - k) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 10 + k * 60, 0, 7); ctx.stroke(); } } });
}
function m11SmokeDraw(now) { const M = M11, P = ddpEnsure(); (M.smokes || []).forEach(function (s) { const a = now - s.t, k = Math.min(1, a / 1200) * Math.min(1, (11000 - a) / 2000); for (let i = 0; i < 9; i++) { const an = i / 9 * 6.28 + a / 4000, r = s.r * .45 * k; ctx.globalAlpha = .8 * k; const sz = s.r * (.8 + .2 * Math.sin(i + a / 900)) * k; ctx.drawImage(P.grey || P.smoke, s.x + Math.cos(an) * r - sz, s.y + Math.sin(an) * r - sz, sz * 2, sz * 2); } ctx.globalAlpha = 1; }); }
function m11Hotbar(now) { const M = M11; ctx.save(); const x0 = 550 - 2 * 62 - 70, y0 = 700 - 64;
    m8Panel(x0 - 6, y0 - 6, 4 * 62 + 140 + 12, 56); ctx.textAlign = 'center';
    M11_HOT.forEach(function (id, i) { const x = x0 + i * 62, sel = M.hot === i, n = M.tools[id] || 0; ctx.fillStyle = sel ? 'rgba(255,210,64,.18)' : 'rgba(255,255,255,.05)'; ctx.fillRect(x, y0, 56, 44); ctx.strokeStyle = sel ? '#ffd040' : 'rgba(255,255,255,.15)'; ctx.lineWidth = sel ? 2 : 1; ctx.strokeRect(x + .5, y0 + .5, 55, 43); ctx.globalAlpha = n ? 1 : .35; m11ToolIcon(id, x + 28, y0 + 18, 1.3); ctx.globalAlpha = 1; ctx.fillStyle = '#e0e8ee'; ctx.font = 'bold 9px monospace'; ctx.fillText((i + 1) + ' ' + (M11_RECIPES.find(function (r) { return r.id === id; }).n.split(' ')[0]) + ' ×' + n, x + 28, y0 + 40); });
    const sx = x0 + 4 * 62; ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(sx, y0, 134, 44); m11ToolIcon('shiv', sx + 16, y0 + 14, 1); ctx.fillStyle = '#e0e8ee'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'left'; ctx.fillText('E SHIV ×' + (M.tools.shiv || 0), sx + 30, y0 + 17); m11ToolIcon('bribe', sx + 16, y0 + 33, 1); ctx.fillText('BRIBE ×' + (M.tools.bribe || 0) + ' DUMMY ×' + (M.tools.dummy || 0), sx + 30, y0 + 37);
    ctx.textAlign = 'center'; ctx.fillStyle = Math.floor(now / 600) % 2 && Object.keys(M.mat).some(function (k) { return M.mat[k]; }) ? '#ffd040' : '#c8c0a0'; ctx.font = 'bold 11px monospace'; ctx.fillText('C — CRAFTING', 550, y0 - 12);
    // aim reticle
    const id = M11_HOT[M.hot]; if (M.tools[id]) { ctx.strokeStyle = 'rgba(255,240,200,.85)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(M.mx, M.my, 8, 0, 7); ctx.moveTo(M.mx - 13, M.my); ctx.lineTo(M.mx - 4, M.my); ctx.moveTo(M.mx + 4, M.my); ctx.lineTo(M.mx + 13, M.my); ctx.moveTo(M.mx, M.my - 13); ctx.lineTo(M.mx, M.my - 4); ctx.moveTo(M.mx, M.my + 4); ctx.lineTo(M.mx, M.my + 13); ctx.stroke(); }
    else { ctx.fillStyle = 'rgba(255,240,200,.6)'; ctx.beginPath(); ctx.arc(M.mx, M.my, 2.5, 0, 7); ctx.fill(); }
    ctx.restore(); }
function m11CraftPanel(now) { const M = M11; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, 1100, 700);
    const X = 90, Y = 44, W = 920, H = 612; ctx.fillStyle = '#d8ccaa'; ctx.fillRect(X, Y, W, H); ctx.fillStyle = 'rgba(120,90,50,.12)'; for (let i = 0; i < 40; i++) ctx.fillRect(X + m8R(i) * W, Y + m8R(i * 3) * H, 40 + m8R(i * 5) * 120, 2);
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; ctx.strokeRect(X + 6, Y + 6, W - 12, H - 12);
    ctx.fillStyle = '#2a1e12'; ctx.textAlign = 'left'; ctx.font = '700 26px "Stardos Stencil", Impact'; ctx.fillText('THE ESCAPE COMMITTEE\'S WORKBENCH', X + 26, Y + 44); ctx.font = '13px "Special Elite", monospace'; ctx.fillText('Click a recipe to make it. C or ESC to close — the castle waits while you work.', X + 26, Y + 66);
    // materials
    ctx.font = '700 14px "Stardos Stencil", Impact'; ctx.fillText('ODDS AND ENDS', X + 26, Y + 98); const mk = Object.keys(M11_MATS); mk.forEach(function (k, i) { const x = X + 20 + (i % 2) * 116, y = Y + 108 + Math.floor(i / 2) * 42, n = M.mat[k] || 0; ctx.fillStyle = n ? 'rgba(80,60,30,.15)' : 'rgba(0,0,0,.04)'; ctx.fillRect(x, y, 110, 38); ctx.globalAlpha = n ? 1 : .35; m11MatIcon(k, x + 18, y + 19, 1.4); ctx.fillStyle = '#2a1e12'; ctx.font = 'bold 10px monospace'; ctx.fillText(M11_MATS[k].n, x + 34, y + 16); ctx.font = 'bold 13px monospace'; ctx.fillText('×' + n, x + 34, y + 32); ctx.globalAlpha = 1; });
    // recipes
    M.craftBtns = []; M11_RECIPES.forEach(function (r, i) { const x = X + 262 + (i % 3) * 214, y = Y + 84 + Math.floor(i / 3) * 120, ok = m11HasMats(r) && !(r.kit && M.p.has[r.kit]), hov = M.mx > x && M.mx < x + 206 && M.my > y && M.my < y + 112;
        ctx.fillStyle = ok ? (hov ? 'rgba(90,140,60,.3)' : 'rgba(90,140,60,.16)') : 'rgba(0,0,0,.06)'; ctx.fillRect(x, y, 206, 112); ctx.strokeStyle = r.kit ? (M.p.has[r.kit] ? '#2a6a8a' : '#8a6a20') : ok ? '#4a7a30' : 'rgba(0,0,0,.25)'; ctx.lineWidth = (ok && hov) || r.kit ? 2.5 : 1; ctx.strokeRect(x + .5, y + .5, 205, 111); if (r.kit) { ctx.fillStyle = M.p.has[r.kit] ? '#2a6a8a' : '#8a6a20'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'right'; ctx.fillText(M.p.has[r.kit] ? 'DONE ✓' : 'ESCAPE KIT', x + 200, y + 11); ctx.textAlign = 'left'; }
        m11ToolIcon(r.id, x + 22, y + 26, 1.6); ctx.fillStyle = '#2a1e12'; ctx.font = '700 13px "Stardos Stencil", Impact'; ctx.fillText(r.n + (M.tools[r.id] && !r.kit ? ' ×' + M.tools[r.id] : ''), x + 42, y + 26);
        let ix = x + 8; Object.keys(r.need).forEach(function (k) { const have = M.mat[k] || 0, need = r.need[k]; m11MatIcon(k, ix + 8, y + 50, 1); ctx.fillStyle = have >= need ? '#2a5a1a' : '#9a2a1a'; ctx.font = 'bold 10px monospace'; ctx.fillText(have + '/' + need, ix + 18, y + 54); ix += 49; });
        ctx.fillStyle = 'rgba(42,30,18,.85)'; ctx.font = '10px "Special Elite", monospace'; const words = r.d.split(' '); let line = '', ly = y + 74; words.forEach(function (w) { if (ctx.measureText(line + w).width > 190) { ctx.fillText(line, x + 10, ly); line = ''; ly += 12; } line += w + ' '; }); ctx.fillText(line, x + 10, ly);
        M.craftBtns.push({ x: x, y: y, w: 206, h: 112, r: r }); });
    if (M.craftMsg) { ctx.fillStyle = '#5a2a12'; ctx.font = 'bold 13px "Special Elite", monospace'; ctx.textAlign = 'center'; ctx.fillText(M.craftMsg, X + W / 2, Y + H - 22); }
    ctx.fillStyle = 'rgba(255,240,200,.9)'; ctx.beginPath(); ctx.moveTo(M.mx, M.my); ctx.lineTo(M.mx + 12, M.my + 6); ctx.lineTo(M.mx + 5, M.my + 13); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore(); }
function m11CraftClick() { const M = M11; (M.craftBtns || []).forEach(function (b) { if (M.mx > b.x && M.mx < b.x + b.w && M.my > b.y && M.my < b.y + b.h) m11Craft(b.r); }); }
