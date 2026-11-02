/* =====================================================
   3D SKIRMISH graphics quality: AUTO / LOW / MEDIUM / HIGH (in the O settings panel), plus a frame-rate counter.
   - render resolution (TK3.scale and a pixel cap), shadow map size (off on LOW), grass density, rain density.
   - AUTO starts at high resolution and steps the resolution down (or back up) to keep the frame rate smooth.
   Changes apply straight away, no restart.
===================================================== */
const SK3Q_PRESETS = {
    low: { scale: .62, cap: 1100, shadow: 0, tuft: .3, part: .45 },
    med: { scale: .82, cap: 1450, shadow: 1024, tuft: .6, part: .75 },
    high: { scale: 1, cap: 1800, shadow: 2048, tuft: 1, part: 1 },
    auto: { scale: 1, cap: 1600, shadow: 2048, tuft: .75, part: .85 }
};
const SK3Q = { fps: 60, fr: 0, t0: 0, autoT: 0, autoScale: 1, lastApplied: '' };
function sk3QP() { return SK3Q_PRESETS[(typeof SK3C !== 'undefined' && SK3C.gq) || 'auto'] || SK3Q_PRESETS.auto; }
function sk3QCap() { return sk3QP().cap; }
function sk3QPart() { return sk3QP().part; }
function sk3QApply() { const P = sk3QP(), st = TK3.st; if (!SK3D.on || !SK3D.ready || !st || TK3.cur !== SK3D.idx) return; TK3.scale = SK3C.gq === 'auto' ? SK3Q.autoScale : P.scale;
    if (st.L && st.L.dir) { const L = st.L.dir, want = P.shadow; L.castShadow = want > 0; if (want > 0 && L.shadow.mapSize.x !== want) { L.shadow.mapSize.set(want, want); if (L.shadow.map) { L.shadow.map.dispose(); L.shadow.map = null; } } }
    if (st.tufts) st.tufts.count = Math.round((st.tufts.userData.full || st.tufts.count) * P.tuft);
    SK3Q.lastApplied = SK3C.gq; }
// AUTO: watch the frame rate and nudge the resolution
function sk3QTick(now) { SK3Q.fr++; if (!SK3Q.t0) SK3Q.t0 = now; const el = now - SK3Q.t0; if (el < 1000) return; SK3Q.fps = SK3Q.fr * 1000 / el; SK3Q.fr = 0; SK3Q.t0 = now;
    if (SK3C.gq !== 'auto' || !SK3D.ready || document.hidden) return; SK3Q.autoT++; if (SK3Q.autoT < 3) return;
    if (SK3Q.fps < 40 && SK3Q.autoScale > .5) { SK3Q.autoScale = Math.max(.5, SK3Q.autoScale - .1); TK3.scale = SK3Q.autoScale; SK3Q.autoT = 0; }
    else if (SK3Q.fps > 57 && SK3Q.autoScale < 1) { SK3Q.autoScale = Math.min(1, SK3Q.autoScale + .05); TK3.scale = SK3Q.autoScale; SK3Q.autoT = 0; } }
function sk3QHud() { if (!SK3C.fps || !SK3D.hud) return; const g = SK3D.hud.getContext('2d'); g.font = 'bold 12px "Special Elite", monospace'; g.textAlign = 'right'; const f = Math.round(SK3Q.fps);
    g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(984, 8, 108, 34); g.fillStyle = f >= 50 ? '#9be08a' : f >= 30 ? '#ffd27a' : '#ff7a6a'; g.fillText(f + ' FPS', 1086, 22); g.fillStyle = '#d8ccb0'; g.fillText((SK3C.gq || 'auto').toUpperCase() + ' · ' + Math.round(TK3.W) + '×' + Math.round(TK3.H), 1086, 36); }
(function () {
    const _fr = sk3Frame; sk3Frame = function (now) { try { sk3QTick(now); } catch (e) {} return _fr.apply(this, arguments); };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { sk3QHud(); } catch (e) {} return r; };
    const _bw = sk3BuildWorld; sk3BuildWorld = function (st) { const r = _bw.apply(this, arguments); try { const P = sk3QP(); if (st.L && st.L.dir) { st.L.dir.castShadow = P.shadow > 0; if (P.shadow) st.L.dir.shadow.mapSize.set(P.shadow, P.shadow); } if (st.tufts) st.tufts.count = Math.round(st.tufts.userData.full * P.tuft); } catch (e) {} return r; };
    const _st = sk3Start; sk3Start = function () { SK3Q.autoScale = 1; SK3Q.autoT = 0; const P = sk3QP(); TK3.scale = SK3C.gq === 'auto' ? 1 : P.scale; return _st.apply(this, arguments); };
    const _sv = sk3CSave; sk3CSave = function () { const r = _sv.apply(this, arguments); try { if (SK3C.gq !== SK3Q.lastApplied) { if (SK3C.gq === 'auto') SK3Q.autoScale = 1; sk3QApply(); } } catch (e) {} return r; };
})();
