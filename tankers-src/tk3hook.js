// ===== hook the 3D scenes into the Online Duel loading screen (falls back to the 2D paintings) =====
(function () {
    const order = ['REMAGEN', 'KURSK', 'CLIFF ASSAULT', 'SABOTAGE', 'ATLANTIC CONVOY', 'E-BOAT ALLEY', 'DOGFIGHT', 'PARA DROP'];
    const keep = TK3.list.filter(function (s) { return order.indexOf(s.name) >= 0; }); TK3.list.length = 0; keep.forEach(function (s) { TK3.list.push(s); }); TK3.list.sort(function (a, b) { return order.indexOf(a.name) - order.indexOf(b.name); });
    window.tk3Start = function (force) { if (!DLOAD.on) return; if (!window.THREE) { tk3Load(function (ok) { if (ok && DLOAD.on && !TK3.active) tk3Start(); }); return; } if (TK3.active && force == null) return; const host = document.getElementById('duelLoad'); if (!host || !tk3Init(host)) return;
        let n = typeof force === 'number' ? force : -1; if (n < 0) { do { n = Math.floor(Math.random() * TK3.list.length); } while ((n === TK3.last || !TK3.list[n].kind) && TK3.list.length > 2); } TK3.last = n; TK3.err = null;
        try { tk3Build(n); } catch (e) { TK3.err = e; tk3Stop(); return; } TK3.active = true; TK3.startAt = performance.now(); TK3.cv.style.display = 'block'; const c2 = document.getElementById('duelLoadCv'); if (c2) c2.style.display = 'none';
        const sc = TK3.list[n], e = document.getElementById('duelLoadScene'); if (e) e.innerHTML = '<span style="display:inline-block;font:700 11px Special Elite,monospace;letter-spacing:4px;color:#1a1a10;background:#c8a040;padding:2px 8px;margin-bottom:8px;">' + sc.kind + '</span><b>' + sc.name + '</b>' + sc.place; };
    window.tk3Stop = function () { TK3.active = false; try { tk3Clear(); } catch (e) {} if (TK3.cv) TK3.cv.style.display = 'none'; const c2 = document.getElementById('duelLoadCv'); if (c2) c2.style.display = ''; };
    const _show = duelLoadShow; duelLoadShow = function () { const r = _show.apply(this, arguments); try { if (TK3.active) { tk3Stop(); } tk3Start(); } catch (e) { tk3Stop(); } return r; };
    const _hide = duelLoadHide; duelLoadHide = function () { try { tk3Stop(); } catch (e) {} return _hide.apply(this, arguments); };
    const _frame = duelLoadFrame; duelLoadFrame = function (now) { if (!DLOAD.on) return; if (TK3.active) { tk3Frame(now); if (TK3.err && now - TK3.startAt < 3000) { tk3Stop(); TK3.failed = true; } const u = (now - DLOAD.t0) / 1000; if (Math.floor(u / 6) !== Math.floor((u - .02) / 6)) duelLoadTipNext(); DLOAD.raf = requestAnimationFrame(duelLoadFrame); return; } return _frame.apply(this, arguments); };
    if (typeof openDuel === 'function') { const _open = openDuel; openDuel = function () { try { tk3Load(); } catch (e) {} return _open.apply(this, arguments); }; }
    try { if (/[?&]duel=/.test(location.search)) tk3Load(); } catch (e) {}
})();
