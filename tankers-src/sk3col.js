/* =====================================================
   3D: tighter tank collisions and clearer firing feedback.
   - Tanks collide as their real footprint (a box turned with the hull, from the model's length and width) instead of
     a circle as wide as the tank is long — the circle left a ~1 m "invisible wall" beside every object.
   - Pressing fire with a jammed or knocked-out gun now says so (with a click) instead of silently doing nothing.
===================================================== */
function sk3Footprint(t) { const m = SK3D.models && SK3D.models.get(t), sz = t.size || 26; let hl = sz * 1.06, hw = sz * .5; if (m && m.spec) hw = hl * Math.max(.35, Math.min(.6, m.spec.wid / m.spec.len)); return [hl, hw]; }
function sk3BoxHit(t, x, y, o) { const a = t.angle || 0, c = Math.cos(a), s = Math.sin(a), F = sk3Footprint(t), hl = F[0], hw = F[1], ox = o.x + o.width / 2, oy = o.y + o.height / 2, ex = o.width / 2, ey = o.height / 2, ac = Math.abs(c), as = Math.abs(s);
    if (Math.abs(x - ox) >= ex + ac * hl + as * hw) return false; if (Math.abs(y - oy) >= ey + as * hl + ac * hw) return false;
    if (Math.abs((ox - x) * c + (oy - y) * s) >= hl + ex * ac + ey * as) return false; if (Math.abs(-(ox - x) * s + (oy - y) * c) >= hw + ex * as + ey * ac) return false; return true; }
(function () {
    const _th = tankHitsObstacle; tankHitsObstacle = function (t, nx, ny) { if (!SK3D.on || !t || t.sk3inf || !(t.size >= 12) || t.angle == null) return _th.apply(this, arguments); const x = nx == null ? t.x : nx, y = ny == null ? t.y : ny;
        const list = (SK3W.on && selectedGameMode === 'skirmish' && typeof sk3Grid === 'function') ? (function () { const G = sk3Grid(), i = Math.floor(x / G.cell), j = Math.floor(y / G.cell); return i < 0 || j < 0 || i >= G.cols || j >= G.rows ? G.none : (G.b[j * G.cols + i] || G.none); })() : obstacles;
        for (const o of list) { if (o.type === 'campaignHillBarrier') { const fr = t === player || t.team === 'friendly' || t.faction === selectedFaction; if (selectedGameMode === 'campaign' && fr && sk3BoxHit(t, x, y, o)) return true; continue; } if (!isSolidObstacle(o)) continue; if (sk3BoxHit(t, x, y, o)) { // already overlapping (e.g. the hull turned into it)? let it back away rather than trap it
            if ((x !== t.x || y !== t.y) && sk3BoxHit(t, t.x, t.y, o)) { const cx = Math.max(o.x, Math.min(o.x + o.width, t.x)), cy = Math.max(o.y, Math.min(o.y + o.height, t.y)); if (Math.hypot(x - cx, y - cy) > Math.hypot(t.x - cx, t.y - cy) + .01) continue; } return true; } } return false; };
    const _sh = shoot; shoot = function () { if (SK3D.on && player && !player.destroyed && !canTankFire(player)) { const now = Date.now(); if (now - (SK3D.jamSaid || 0) > 1500) { SK3D.jamSaid = now; try { showRadioText(player.gunJammed ? 'GUN JAMMED — STOP AND PRESS R TO CLEAR IT' : 'GUN KNOCKED OUT — WAIT FOR IT OR REPAIR (R)', true); playTone(320, 260, .06, .05, 'square'); } catch (e) {} } return; } return _sh.apply(this, arguments); };
})();
