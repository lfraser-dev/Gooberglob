/* =====================================================
   MISSION 9 - SAFE CRACKING: turn the dial, listen for the click
   R-L-R combination. Each number ticks; the right one clicks louder.
   Turn too fast, set a wrong number, or move while footsteps pass and the noise meter climbs.
===================================================== */
const SAFE = { open: false };
function m9OpenSafe(R) {
    if (!R.safe) { const r = function () { return 5 + Math.floor(Math.random() * 90); }; let a = r(), b = r(), c = r(); while (Math.abs(b - a) < 12) b = r(); while (Math.abs(c - b) < 12) c = r(); R.safe = { combo: [a, b, c], step: 0, locked: [], pos: 0, heard: false, moved: 0 }; }
    Object.assign(SAFE, { open: true, R: R, last: performance.now(), noise: SAFE.keepNoise || 0, keys: {}, drag: null, trace: [], foot: { next: performance.now() + 7000 + Math.random() * 5000, until: 0 }, msg: 'Put your ear to it. Turn RIGHT (D / →) to the first number.', msgAt: performance.now(), clickAt: 0, wrongAt: 0, doneAt: 0, door: 0, taken: false, flashLock: 0 });
    M8.safeOpen = true; M8.mdown = false; M8.k = {};
    let el = document.getElementById('m9Safe'); if (!el) { el = document.createElement('div'); el.id = 'm9Safe'; el.style.cssText = 'position:fixed;inset:0;z-index:7200;display:flex;align-items:center;justify-content:center;background:rgba(4,4,3,.82)'; el.innerHTML = '<canvas id="m9SafeC" width="1200" height="760" style="max-width:96vw;max-height:94vh;cursor:grab;box-shadow:0 0 0 3px #000,0 20px 60px rgba(0,0,0,.8)"></canvas>'; document.body.appendChild(el);
        const cv = el.querySelector('canvas');
        const pt = function (e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 1200 / r.width, (e.clientY - r.top) * 760 / r.height]; };
        cv.addEventListener('mousedown', function (e) { if (!SAFE.open) return; const p = pt(e); if (SAFE.doneAt && SAFE.door >= 1 && !SAFE.taken) { SAFE.taken = true; m9SafeClose(true); return; } if (Math.hypot(p[0] - 470, p[1] - 380) < 240) { SAFE.drag = Math.atan2(p[1] - 380, p[0] - 470); cv.style.cursor = 'grabbing'; } });
        window.addEventListener('mousemove', function (e) { if (!SAFE.open || SAFE.drag === null) return; const p = pt(e), a = Math.atan2(p[1] - 380, p[0] - 470); let d = a - SAFE.drag; if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; SAFE.drag = a; m9SafeTurn(d / (Math.PI * 2) * 100); });
        window.addEventListener('mouseup', function () { SAFE.drag = null; if (cv) cv.style.cursor = 'grab'; });
        window.addEventListener('keydown', function (e) { if (!SAFE.open) return; SAFE.keys[e.code] = true; if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); if (SAFE.doneAt && SAFE.door >= 1 && !SAFE.taken) { SAFE.taken = true; m9SafeClose(true); } else m9SafeSet(); } if (e.code === 'Escape' || e.code === 'Backspace') m9SafeClose(false); });
        window.addEventListener('keyup', function (e) { SAFE.keys[e.code] = false; });
    }
    el.hidden = false; el.style.display = 'flex';
    try { playTone(300, 200, .12, .04, 'square'); } catch (e) {}
    cancelAnimationFrame(SAFE.raf); SAFE.raf = requestAnimationFrame(m9SafeFrame);
}
function m9SafeClose(ok) { SAFE.open = false; SAFE.keepNoise = ok ? 0 : SAFE.noise * .7; cancelAnimationFrame(SAFE.raf); const el = document.getElementById('m9Safe'); if (el) { el.hidden = true; el.style.display = 'none'; } M8.k = {}; m9SafeDone(SAFE.R, !!ok); }
function m9SafeNum() { const S = SAFE.R.safe; return ((Math.round(S.pos) % 100) + 100) % 100; }
function m9SafeTurn(d) { // d in dial numbers, + = right/clockwise
    const S = SAFE.R.safe; if (SAFE.doneAt) return; const before = Math.round(S.pos); S.pos += d; const after = Math.round(S.pos), now = performance.now();
    const need = S.step === 1 ? -1 : 1;
    if (after !== before) { const steps = Math.abs(after - before), dir = Math.sign(after - before);
        for (let i = 1; i <= steps; i++) { const n = (((before + dir * i) % 100) + 100) % 100, tgt = S.combo[S.step], near = Math.abs(n - tgt);
            if (dir === need) { S.moved += 1; if (n === tgt && S.moved > 8) { S.heard = true; SAFE.clickAt = now; SAFE.trace.push({ t: now, h: 1, c: 1 }); try { playTone(700, 360, .06, .09, 'square'); } catch (e) {} }
                else { const h = .12 + (near < 4 ? (4 - near) * .07 : 0) + Math.random() * .05; SAFE.trace.push({ t: now, h: h }); try { playTone(2400 - near * 6, 1900, .012, .012 + (near < 4 ? .01 : 0), 'square'); } catch (e) {} } }
            else { SAFE.trace.push({ t: now, h: .1, w: 1 }); try { playTone(1500, 1300, .01, .01, 'square'); } catch (e) {} if (S.moved > 0 || S.heard) { S.wrongRun = (S.wrongRun || 0) + 1; if (S.wrongRun > 3) { S.moved = 0; S.heard = false; S.wrongRun = 0; SAFE.msg = 'Wrong way — that wheel slipped. Turn ' + (need > 0 ? 'RIGHT' : 'LEFT') + ' again.'; SAFE.msgAt = now; } } } }
        if (Math.sign(after - before) === need) S.wrongRun = 0;
        if (now < SAFE.foot.until) SAFE.noise += steps * 2.6;
    }
}
function m9SafeSet() {
    const S = SAFE.R.safe, now = performance.now(), n = m9SafeNum(); if (SAFE.doneAt) return;
    if (n === S.combo[S.step] && S.heard) { S.locked.push(n); S.step++; S.heard = false; S.moved = 0; SAFE.flashLock = now; try { playTone(400, 800, .12, .06, 'triangle'); } catch (e) {}
        if (S.step >= 3) { SAFE.doneAt = now; SAFE.msg = 'The bolts slide back. Turn the handle…'; SAFE.msgAt = now; try { playTone(200, 120, .4, .08, 'square'); setTimeout(function () { try { playTone(160, 300, .5, .06, 'sawtooth'); } catch (e) {} }, 500); } catch (e) {} }
        else { SAFE.msg = 'Number ' + S.step + ' set. Now turn ' + (S.step === 1 ? 'LEFT (A / ←)' : 'RIGHT (D / →)') + ' and listen.'; SAFE.msgAt = now; } }
    else { SAFE.noise += 26; SAFE.wrongAt = now; S.moved = 0; S.heard = false; SAFE.msg = n === S.combo[S.step] ? 'You didn\'t hear it catch. Come round to it again.' : 'Wrong — the bolt rattles. Listen for the heavier click.'; SAFE.msgAt = now; try { playTone(180, 90, .2, .08, 'square'); } catch (e) {} }
}
function m9SafeFrame(now) {
    if (!SAFE.open) return; const dt = Math.min(50, now - SAFE.last) / 16.67; SAFE.last = now;
    const S = SAFE.R.safe, k = SAFE.keys, fine = k.ShiftLeft || k.ShiftRight;
    let turn = 0; if (k.KeyD || k.ArrowRight) turn += 1; if (k.KeyA || k.ArrowLeft) turn -= 1; if (turn) { SAFE.hold = (SAFE.hold || 0) + dt; const sp = fine ? .12 : Math.min(.9, .25 + SAFE.hold * .02); m9SafeTurn(turn * sp * dt); } else SAFE.hold = 0;
    const spd = Math.abs(S.pos - (SAFE.lastPos === undefined ? S.pos : SAFE.lastPos)) / dt; SAFE.lastPos = S.pos; if (spd > .7) SAFE.noise += (spd - .7) * 1.5 * dt;
    SAFE.noise = Math.max(0, SAFE.noise - .05 * dt);
    if (!SAFE.doneAt && now > SAFE.foot.next && !SAFE.foot.until) { SAFE.foot.until = now + 3200; SAFE.msg = 'Footsteps in the corridor — keep your hands still!'; SAFE.msgAt = now; }
    if (SAFE.foot.until && now < SAFE.foot.until && Math.floor(now / 420) !== SAFE.foot.lastStep) { SAFE.foot.lastStep = Math.floor(now / 420); try { playTone(90, 60, .08, .05, 'triangle'); } catch (e) {} }
    if (SAFE.foot.until && now > SAFE.foot.until) { SAFE.foot.until = 0; SAFE.foot.next = now + 9000 + Math.random() * 7000; }
    if (SAFE.noise >= 100) { SAFE.noise = 45; SAFE.keepNoise = 45; SAFE.open = false; cancelAnimationFrame(SAFE.raf); const el = document.getElementById('m9Safe'); el.hidden = true; el.style.display = 'none'; M8.safeOpen = false; M8.k = {}; m9SafeAlarm(SAFE.R); return; }
    if (SAFE.doneAt) SAFE.door = Math.min(1, (now - SAFE.doneAt - 900) / 900);
    SAFE.trace = SAFE.trace.filter(function (t) { return now - t.t < 2600; });
    m9SafeDraw(now);
    SAFE.raf = requestAnimationFrame(m9SafeFrame);
}
function m9SafeDraw(now) {
    const cv = document.getElementById('m9SafeC'), g = cv.getContext('2d'), S = SAFE.R.safe;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0c0c0a'; g.fillRect(0, 0, 1200, 760);
    // wallpaper + painting frame pulled aside
    g.fillStyle = '#4a1c18'; g.fillRect(0, 0, 1200, 760); g.fillStyle = 'rgba(0,0,0,.25)'; for (let x = 0; x < 1200; x += 36) for (let y = 0; y < 760; y += 48) { g.beginPath(); g.ellipse(x + 18 + (y / 48 % 2) * 18, y + 24, 6, 10, 0, 0, 7); g.fill(); }
    // safe door body
    const ox = 170, oy = 70, w = 600, h = 620;
    g.save(); g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 40; g.shadowOffsetY = 16; g.fillStyle = '#1a1c18'; g.fillRect(ox - 20, oy - 20, w + 40, h + 40); g.restore();
    g.fillStyle = '#060605'; g.fillRect(ox, oy, w, h);
    const open = SAFE.door > 0 ? SAFE.door : 0;
    if (open > 0) m9SafeInside(g, ox, oy, w, h, now);
    g.save(); g.translate(ox, oy); g.scale(1 - open * .88, 1); if (open > 0) { g.globalAlpha = 1; }
    const dg = g.createLinearGradient(0, 0, w, h); dg.addColorStop(0, '#4e5a4a'); dg.addColorStop(.5, '#36402f'); dg.addColorStop(1, '#1e241a'); g.fillStyle = dg; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#c8a040'; g.lineWidth = 3; g.strokeRect(24, 24, w - 48, h - 48); g.lineWidth = 1; g.strokeRect(34, 34, w - 68, h - 68);
    g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(0, 0, w, 40);
    for (let i = 0; i < 4; i++) { const bx = i % 2 ? w - 44 : 44, by = i < 2 ? 44 : h - 44; m8Disc(g, bx, by, 9, '#2a2e24', '#b8b8a8'); }
    g.fillStyle = '#c8a040'; g.fillRect(w / 2 - 110, 70, 220, 46); g.fillStyle = '#2a1e0a'; g.font = '700 22px "Stardos Stencil", Impact'; g.textAlign = 'center'; g.fillText('BODE-PANZER', w / 2, 99); g.font = '700 11px monospace'; g.fillText('HANNOVER · D.R.P.', w / 2, 112);
    // handle
    const ha = SAFE.doneAt ? Math.min(1, (now - SAFE.doneAt) / 800) * 1.4 : 0; g.save(); g.translate(w / 2 + 180, 470); g.rotate(-ha); g.fillStyle = m8Grad(g, 0, -10, 0, 10, [[0, '#e0e0d8'], [1, '#5a5e58']]); m8RR(g, -16, -12, 120, 24, 12, g.fillStyle); m8Disc(g, 0, 0, 22, '#3a3e38', '#c8ccc4'); g.restore();
    // the dial
    const cx = 470 - ox, cy = 380 - oy, Rr = 190, rot = -S.pos / 100 * Math.PI * 2;
    m8Disc(g, cx, cy, Rr + 22, '#14160f', '#4a4e44');
    g.save(); g.translate(cx, cy); g.rotate(rot);
    const fg = g.createRadialGradient(-40, -40, 20, 0, 0, Rr); fg.addColorStop(0, '#f4f0e0'); fg.addColorStop(1, '#a8a088'); g.fillStyle = fg; g.beginPath(); g.arc(0, 0, Rr, 0, 7); g.fill();
    for (let i = 0; i < 100; i++) { const a = i / 100 * Math.PI * 2 - Math.PI / 2; const L = i % 10 === 0 ? 26 : i % 5 === 0 ? 18 : 10; g.strokeStyle = '#1a1a14'; g.lineWidth = i % 10 === 0 ? 3 : 1.4; g.beginPath(); g.moveTo(Math.cos(a) * (Rr - 4), Math.sin(a) * (Rr - 4)); g.lineTo(Math.cos(a) * (Rr - 4 - L), Math.sin(a) * (Rr - 4 - L)); g.stroke(); if (i % 10 === 0) { g.save(); g.rotate(a + Math.PI / 2); g.fillStyle = '#1a1a14'; g.font = '700 22px "Stardos Stencil", Impact'; g.textAlign = 'center'; g.fillText(String(i), 0, -(Rr - 50)); g.restore(); } }
    m8Disc(g, 0, 0, 92, '#2a2c26', '#8a8c84'); for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(Math.cos(a) * 80, Math.sin(a) * 80); g.lineTo(Math.cos(a) * 92, Math.sin(a) * 92); g.stroke(); } m8Disc(g, 0, 0, 60, '#3a3c36', '#b8bab0'); g.fillStyle = '#c8a040'; g.beginPath(); g.moveTo(0, -56); g.lineTo(6, -40); g.lineTo(-6, -40); g.fill();
    g.restore();
    g.fillStyle = '#c02818'; g.beginPath(); g.moveTo(cx, cy - Rr - 4); g.lineTo(cx - 12, cy - Rr - 26); g.lineTo(cx + 12, cy - Rr - 26); g.closePath(); g.fill();
    g.restore();
    if (SAFE.clickAt && now - SAFE.clickAt < 300) { g.strokeStyle = 'rgba(255,230,120,' + (1 - (now - SAFE.clickAt) / 300) + ')'; g.lineWidth = 5; g.beginPath(); g.arc(470, 380, 225, 0, 7); g.stroke(); }
    if (SAFE.wrongAt && now - SAFE.wrongAt < 400) { g.fillStyle = 'rgba(200,30,20,' + .3 * (1 - (now - SAFE.wrongAt) / 400) + ')'; g.fillRect(0, 0, 1200, 760); }
    // right panel: stethoscope trace + combination
    const px = 820; g.fillStyle = 'rgba(14,16,10,.92)'; g.fillRect(px, 40, 360, 680); g.strokeStyle = '#6d714f'; g.lineWidth = 2; g.strokeRect(px, 40, 360, 680);
    g.fillStyle = '#d9c88c'; g.font = '700 16px "Stardos Stencil", Impact'; g.textAlign = 'left'; g.fillText('STETHOSCOPE', px + 18, 70);
    g.fillStyle = '#081008'; g.fillRect(px + 18, 84, 324, 150); g.strokeStyle = 'rgba(100,200,110,.15)'; g.lineWidth = 1; for (let y = 84; y < 234; y += 25) { g.beginPath(); g.moveTo(px + 18, y); g.lineTo(px + 342, y); g.stroke(); }
    g.strokeStyle = '#7fe08a'; g.lineWidth = 1.6; g.beginPath(); for (let x = 0; x <= 324; x += 2) { const tt = now - (324 - x) * 8; let y = Math.sin(tt / 40 + x) * 1.2 + (Math.random() - .5) * 1.2; SAFE.trace.forEach(function (tr) { const d = (tt - tr.t) / 16; if (d >= 0 && d < 6) y -= Math.sin(d / 6 * Math.PI) * tr.h * 64 * (d < 2 ? 1 : .6); }); g.lineTo(px + 18 + x, 160 + y); } g.stroke();
    if (SAFE.clickAt && now - SAFE.clickAt < 700) { g.fillStyle = 'rgba(255,230,120,' + (1 - (now - SAFE.clickAt) / 700) + ')'; g.font = '700 26px "Stardos Stencil", Impact'; g.textAlign = 'right'; g.fillText('CLICK', px + 334, 112); }
    g.textAlign = 'left'; g.fillStyle = '#d9c88c'; g.font = '700 16px "Stardos Stencil", Impact'; g.fillText('COMBINATION', px + 18, 272);
    ['RIGHT', 'LEFT', 'RIGHT'].forEach(function (d, i) { const y = 290 + i * 62, act = i === S.step && !SAFE.doneAt, done = i < S.step; g.fillStyle = act ? 'rgba(80,86,46,.9)' : 'rgba(0,0,0,.4)'; g.fillRect(px + 18, y, 324, 52); g.strokeStyle = act ? '#e2c460' : done ? '#7fc06a' : '#3e4230'; g.strokeRect(px + 18, y, 324, 52);
        g.fillStyle = done ? '#9fe08a' : act ? '#ffe2a0' : '#8a8a70'; g.font = '700 14px "Stardos Stencil", Impact'; g.fillText((i + 1) + ' · TURN ' + d + (d === 'RIGHT' ? '  ↻' : '  ↺'), px + 30, y + 22); g.font = '700 26px "Stardos Stencil", Impact'; g.textAlign = 'right'; g.fillText(done ? String(S.locked[i]).padStart(2, '0') : act && S.heard ? '!!' : '??', px + 330, y + 38); g.textAlign = 'left'; });
    g.fillStyle = '#efe6c6'; g.font = '700 30px "Stardos Stencil", Impact'; g.fillText('DIAL: ' + String(m9SafeNum()).padStart(2, '0'), px + 18, 506);
    // noise meter + footsteps
    g.fillStyle = '#d9c88c'; g.font = '700 14px "Stardos Stencil", Impact'; g.fillText('NOISE', px + 18, 546); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(px + 18, 554, 324, 14); const nz = Math.min(1, SAFE.noise / 100); g.fillStyle = nz > .7 ? '#e04030' : nz > .4 ? '#e0a040' : '#7fc06a'; g.fillRect(px + 18, 554, 324 * nz, 14);
    if (SAFE.foot.until && now < SAFE.foot.until) { g.fillStyle = Math.floor(now / 250) % 2 ? '#ff6040' : '#a02818'; g.font = '700 16px "Stardos Stencil", Impact'; g.fillText('▲ FOOTSTEPS OUTSIDE — STAY STILL', px + 18, 594); }
    g.fillStyle = 'rgba(239,230,198,.6)'; g.font = '12px monospace'; ['A/D or ←/→ or drag the dial to turn', 'SHIFT = fine control · listen for the CLICK', 'SPACE = set the number · ESC = step away'].forEach(function (t, i) { g.fillText(t, px + 18, 630 + i * 18); });
    // message
    if (SAFE.msg) { g.textAlign = 'center'; g.font = 'bold 18px "Special Elite", "Courier New", monospace'; const tw = g.measureText(SAFE.msg).width + 40; g.fillStyle = 'rgba(8,10,6,.88)'; g.fillRect(470 - tw / 2, 700, tw, 36); g.fillStyle = '#e7edc9'; g.fillText(SAFE.msg, 470, 724); }
    if (SAFE.door >= 1) { g.textAlign = 'center'; g.font = '700 26px "Stardos Stencil", Impact'; g.fillStyle = Math.floor(now / 400) % 2 ? '#ffe2a0' : '#e2c460'; g.fillText('CLICK OR SPACE — TAKE THE KEY SHEETS', 470, 40); }
}
function m9SafeInside(g, ox, oy, w, h, now) {
    g.fillStyle = '#2a2620'; g.fillRect(ox, oy, w, h); g.fillStyle = '#1a1612'; g.fillRect(ox + 30, oy + 30, w - 60, h - 60);
    [oy + 230, oy + 430].forEach(function (y) { g.fillStyle = '#4a4438'; g.fillRect(ox + 30, y, w - 60, 10); });
    // key sheets folder
    g.save(); g.translate(ox + 140, oy + 140); g.rotate(-.05); g.fillStyle = '#c8b888'; g.fillRect(0, 0, 210, 84); g.fillStyle = '#b02a1c'; g.font = '700 15px "Stardos Stencil", Impact'; g.fillText('GEHEIME KOMMANDOSACHE', 10, 24); g.fillStyle = '#2a2016'; g.font = '700 13px monospace'; g.fillText('SCHLÜSSELTAFEL', 10, 46); g.fillText('JUNI 1944 · M3 / HEER', 10, 64); g.strokeStyle = '#b02a1c'; g.lineWidth = 2; g.strokeRect(4, 4, 202, 76); g.restore();
    g.save(); g.translate(ox + 380, oy + 150); g.rotate(.06); g.fillStyle = '#3a2a1a'; g.fillRect(0, 0, 120, 70); g.fillStyle = '#c8a040'; g.font = '700 11px monospace'; g.fillText('KENNGRUPPEN-', 10, 28); g.fillText('BUCH', 10, 44); g.restore();
    for (let i = 0; i < 4; i++) { g.fillStyle = '#7a8a6a'; g.fillRect(ox + 60 + i * 50, oy + 380, 44, 46); g.fillStyle = '#e0d8b8'; g.fillRect(ox + 60 + i * 50, oy + 398, 44, 8); }
    g.fillStyle = '#1a1a1a'; g.fillRect(ox + 330, oy + 400, 70, 22); g.fillStyle = '#5a3a1c'; g.fillRect(ox + 334, oy + 418, 14, 22);
    const gl = .5 + .5 * Math.sin(now / 250); g.strokeStyle = 'rgba(255,226,160,' + (.4 + gl * .5) + ')'; g.lineWidth = 4; g.strokeRect(ox + 128, oy + 128, 384, 104);
}
